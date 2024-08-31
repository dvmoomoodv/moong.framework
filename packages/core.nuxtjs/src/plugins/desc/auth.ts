import { NuxtApp, useRouter, useRoute, createError, addRouteMiddleware, navigateTo, onNuxtReady, callWithNuxt } from '#app'
import { type RouteLocationNormalized } from 'vue-router'
import { path, jwt, array, url } from '#ustra/core/utils'
import { useLogger } from '#ustra/nuxt/utils/logger'
import { useUstra, ref } from '#ustra/nuxt'
import { useCurrentPageMeta } from '#ustra/nuxt/composables/utils'
import { useAuthStore } from '#ustra/nuxt/store/auth'
import { useJwtAuthStore } from '#ustra/nuxt/store/auth-jwt'
import { useServerAuthStore } from '#ustra/nuxt/store/auth-server'
import { useTimeoutFn } from '@vueuse/core'
import toLower from 'lodash/toLower'
import type { Ustra } from '../ustra'
import { UstraAuthDuplicationCheckerFactory } from './auth/duplication'

// @ts-expect-error
import customValidator from '#build/ustra/ustra.auth.validator.ts'

const logger = useLogger('ustra:auth')

export class UstraAuth {
  public store: Awaited<ReturnType<typeof useAuthStore>> = null

  private _jwtStore: Awaited<ReturnType<typeof useJwtAuthStore>> = null
  private _serverStore: Awaited<ReturnType<typeof useServerAuthStore>> = null
  private timer: UstraAuthTimer = null

  constructor(private app: NuxtApp, private $ustra: Ustra) {}

  async init() {
    this.store = await useAuthStore(this.app)
    this._jwtStore = await useJwtAuthStore(this.app)
    this._serverStore = await useServerAuthStore(this.app)

    this.timer = new UstraAuthTimer(this.$ustra, {
      onExpired: () => {
        this.inactivate('expired', null, 'authentication timer is expired', null, false)
      },
    })
    new UstraAuthDuplicationCheckerFactory(this.$ustra, {
      onDuplicated: () => {
        this.inactivate('duplicated', null, 'authentication is duplicated.', null, false)
      },
      onExpired: () => {
        this.inactivate('expired', null, 'authentication is expired', null, false)
      },
      authInfoProvider: () => {
        return {
          userKey: this.user?.sub,
          procId: this.user?.procId,
          token: this._jwtStore.refreshToken,
        }
      },
    })

    const axiosInstance = await this.$ustra.api.getAxiosInstance()

    // add request interceptor

    const $ustra = this.$ustra
    axiosInstance.interceptors.request.use(config => {
      if (config.withCredentials === false) {
        return
      }

      config['_currentAuth'] = this.store.authInfo
      if (this.authProps.type === 'jwt') {
        // has auth token
        if (config.headers[this.authProps.jwt.refreshTokenKey] || config.headers[this.authProps.jwt.accessTokenKey]) {
          return config
        }
        const headers = this.getHeaders()

        // @ts-ignore
        config.headers = $ustra.utils.core.deepMerge(config.headers, headers)
      }

      return config
    })

    // add request interceptor (sse)
    this.$ustra.api.getSseInstance().addRequestInterceptor(option => {
      if (option.withCredentials === false) {
        return
      }

      option.headers = option.headers || {}

      if (this.authProps.type === 'jwt') {
        // has auth token
        if (option.headers[this.authProps.jwt.refreshTokenKey] || option.headers[this.authProps.jwt.accessTokenKey]) {
          return option
        }
        const headers = this.getHeaders()
        option.headers = $ustra.utils.core.deepMerge(option.headers, headers)
      }

      return option
    })

    const checkResponse = async res => {
      if (!res || !res.config) {
        return res
      }

      if (this.isExcludeUrlPattern(res?.config.url) || !!res.config['excludeAuthValidation']) {
        return res
      }
      if (this.authProps.type === 'jwt') {
        // 서버 인증을 사용하지 않을 경우는 무시
        if (process.server && !$ustra.env.appProps.auth.jwt.useCookie) {
          return res
        }

        if (res.headers) {
          const isAuthenticated = this.store.authenticated
          const accessToken = res.headers[toLower(this.authProps.jwt.accessTokenKey)] || null
          const refreshToken = res.headers[toLower(this.authProps.jwt.refreshTokenKey)] || null

          if (!accessToken) {
            return res
          }

          this._jwtStore.setToken({ accessToken, refreshToken })
          const claim = jwt.parseClaim(accessToken)

          // call updated hook
          $ustra.hooks.callHook('auth:updated', claim)

          // 인증 상태였으나, 서버 정책에 의해 만료 되었을 경우 처리
          if (isAuthenticated) {
            if (!claim || !claim.sub) {
              if (res?.config) {
                res.config['_isInactivated'] = true
              }

              await this.inactivate('released', res?.config?.['_currentAuth'], res?.config.url)
            }
          }
          // 인증 해제 상태 였으나 인증되었을 경우
          else {
            if (claim?.sub && claim?.cp) {
              await this.activate(this.store.authInfo)
            }
          }
        }
      }

      return res
    }

    // add response interceptor
    axiosInstance.interceptors.response.use(
      async res => checkResponse(res),
      err => {
        checkResponse(err.response)
        throw err
      },
    )

    // call hook
    if (this.store.authenticated) {
      this.$ustra.hooks.callHook('auth:activated', this.store.authInfo)
    }

    callWithNuxt(this.app, () => {
      addRouteMiddleware(
        'ustra:auth',
        async (to, from) => {
          if (to.path.endsWith('.map')) {
            return
          }
          const result = await callWithNuxt(this.app, async () => {
            return await this.validateAuthentication(to, from, true)
          })

          if (result) {
            return result
          }
        },
        { global: true },
      )

      // jwt 사용 시, 쿠키를 사용하지 않을 경우는 client에서 validation 재수행
      // if (process.client && $ustra.env.appProps.auth.type === 'jwt' && !$ustra.env.appProps.auth.jwt.useCookie) {
      //   this.validateAuthentication(useRoute(), false)
      // }
    })
  }

  /**
   * 현재 route 요건에 따른 검증을 수행
   * @param route
   * @param isMiddleware 미들웨어 호출 여부
   * @returns
   */
  async validateAuthentication(to: RouteLocationNormalized, from: RouteLocationNormalized, isMiddleware: boolean = false) {
    const $ustra = useUstra()
    const meta = useCurrentPageMeta(to)

    if (!meta.auth?.required) {
      return
    }

    // check exclude patterns
    if (!array.isEmpty($ustra.env.appProps.auth.excludeUrlPatterns)) {
      if (path.isMatchPatterns(to.path, ...$ustra.env.appProps.auth.excludeUrlPatterns)) {
        return
      }
    }

    // jwt 사용 시, 쿠키를 사용하지 않을 경우는 server 상에서 체크를 수행하지 않음.
    if (process.server && $ustra.env.appProps.auth.type === 'jwt' && !$ustra.env.appProps.auth.jwt.useCookie) {
      return
    }

    let validationResult = null
    if (meta.auth?.validateAuthentication) {
      validationResult = await meta.auth.validateAuthentication($ustra, to, from)
    }

    if ($ustra.utils.core.isEmpty(validationResult) && customValidator) {
      validationResult = await customValidator({ $ustra, to, from })
    }

    if ($ustra.utils.core.isEmpty(validationResult)) {
      validationResult = await $ustra.hooks.callHook('auth:validate', { $ustra, to, from })
    }

    if ($ustra.utils.core.isEmpty(validationResult)) {
      if (meta.auth.required === true && !$ustra.auth.isAuthenticated) {
        validationResult = false
      } else if (meta.auth.required === 'exists' && !$ustra.auth.existsUser) {
        validationResult = false
      }

      // check role
      if (validationResult !== false) {
        if (meta.auth.roles && meta.auth.roles.length > 0) {
          if (!meta.auth.roles.some(role => $ustra.auth.store.roles.has(role))) {
            validationResult = false
          }
        }
      }
    }

    // when fail validation
    if (validationResult === false) {
      if (isMiddleware) {
        const result = await this.inactivate('validate', { to, from }, 'fail validation authentication from auth middleware', to.path, isMiddleware)
        return result
      } else {
        return await this.inactivate('validate', { to, from }, 'fail validation authentication from client plugin', to.path, isMiddleware)
      }
    }
  }

  /**
   * 인증 해제 처리
   * @param redirect 로그인 화면으로 이동 여부
   * @param removeAuth 인증 정보 제거 여부
   * @param to 이동 경로
   * @param isMiddleware 미들웨어 호출 여부
   */
  unauthenicate(redirect: boolean = true, removeAuth: boolean = true, to?: string, isMiddleware?: boolean) {
    this.$ustra.hooks.callHook('auth:unauthenticate:before')

    if (removeAuth) {
      this.store.remove()
    }

    if (redirect) {
      return this.goToAuthenticationPath(to, isMiddleware)
    }
  }

  /**
   * 인증 화면으로 이동
   * @param to 현재 접속 path
   * @param isMiddleware 미들웨어 호출 여부
   * @returns
   */
  goToAuthenticationPath(to?: string, isMiddleware?: boolean) {
    return callWithNuxt(this.$ustra.nuxtApp, () => {
      const loginPath = this.authProps.loginPath

      if (!to) {
        to = useRoute().path
      }

      const router = useRouter()
      const currentPath = router.currentRoute.value.fullPath

      if (loginPath !== to) {
        if (this.authProps.redirectReturnPageParamName) {
          const returnPageParamValue = url.getUrlSearchParam(currentPath).get(this.authProps.redirectReturnPageParamName)

          if (returnPageParamValue) {
            if (isMiddleware) {
              return navigateTo({ path: loginPath }, { replace: true })
            } else {
              return router.replace(loginPath)
            }
          }

          if (isMiddleware) {
            return navigateTo({ path: loginPath, query: { [this.authProps.redirectReturnPageParamName]: currentPath } }, { replace: true })
          } else {
            return router.replace({ path: loginPath, query: { [this.authProps.redirectReturnPageParamName]: currentPath } })
          }
        } else {
          if (isMiddleware) {
            return navigateTo({ path: loginPath }, { replace: true })
          } else {
            return router.replace(loginPath)
          }
        }
      }
    })
  }

  private get authProps() {
    return this.$ustra.env.appProps.auth
  }

  /**
   * 현재 URL이 제외 패턴인지 여부 리턴
   * @param url
   */
  public isExcludeUrlPattern(url: string) {
    if (!url) {
      return true
    }

    if (!this.authProps.excludeUrlPatterns) {
      return false
    }

    return path.isMatchPatterns(url, ...this.authProps.excludeUrlPatterns)
  }

  /**
   * 인증 설정에 따른 HTTP Header 정보 반환
   */
  public getHeaders() {
    const headers = {}
    if (this.authProps.type === 'jwt') {
      if (this._jwtStore.accessToken) {
        headers[this.authProps.jwt.accessTokenKey] = this._jwtStore.accessToken
      }
      if (this._jwtStore.refreshToken) {
        headers[this.authProps.jwt.refreshTokenKey] = this._jwtStore.refreshToken
      }
    }
    return headers
  }

  /**
   * 비활성화 처리
   * @param type 유형
   * @param authInfo 인증정보
   * @param description 설명
   * @param to 이동 경로
   * @param isMiddleware 미들웨어 호출 여부
   */
  async inactivate(
    type: 'validate' | 'expired' | 'duplicated' | 'released' = 'validate',
    authInfo: any,
    description: string = null,
    to?: string,
    isMiddleware: boolean = false,
  ) {
    logger.info('inactivate', type, description)

    // 검증 실패
    if (type === 'validate') {
      const invalidatedResult = await this.$ustra.hooks.callHook('auth:invalidated', authInfo, to, isMiddleware)
      if (this.authProps.failProcessType === 'redirect') {
        return this.goToAuthenticationPath(to, isMiddleware)
      } else if (this.authProps.failProcessType === 'error') {
        throw createError({ statusCode: 401, statusMessage: '권한이 없습니다.' })
      } else {
        return invalidatedResult
      }
    } else {
      const invalidatedResult = await this.$ustra.hooks.callHook('auth:inactivated', authInfo, type, description)

      // TODO: released이고, 현재 페이지가 auth.required가 false일 경우는 무동작 하도록 처리....
      // const currentMeta = useCurrentPageMeta()
      // if (type === 'released' && !currentMeta.auth?.required) {
      //   return
      // }

      if (this.authProps.expiredProcessType === 'logout') {
        return this.unauthenicate(true, true, to, isMiddleware)
      } else if (this.authProps.expiredProcessType === 'error') {
        throw createError({ statusCode: 401, statusMessage: '권한이 없습니다.' })
      }

      return invalidatedResult
    }
  }

  /**
   * 인증 정보를 스토어에 저장
   * @param authInfo
   */
  setServerAuthInfo(authInfo: any) {
    this._serverStore.authInfo = authInfo
  }

  /**
   * 역할 정보를 스토어에 저장
   * @param roles
   */
  setRoles(roles: Set<string>) {
    this.store.roles = roles
  }

  /**
   * 인증 활성화
   * @param authInfo
   */
  private activate(authInfo: any) {
    this.$ustra.hooks.callHook('auth:activated', authInfo)
  }

  /**
   * 인증 사용자 정보
   */
  get user() {
    return this.store.authInfo
  }

  /**
   * 인증 여부 조회
   */
  get isAuthenticated() {
    return this.store.authenticated
  }

  /**
   * 사용자 정보 존재 여부
   */
  get existsUser() {
    return this.store.existsUser
  }
}

/**
 * 인증 로그아웃 타이머 처리
 */
class UstraAuthTimer {
  constructor(
    private $ustra: Ustra,
    private option: {
      onExpired: () => void
    },
  ) {
    this.init()
  }

  private get autoLogoutSeconds() {
    return this.$ustra.env.appProps.auth.autoLogoutSeconds
  }

  private authNoExpireTime: Date | null = null
  public remainSec = ref(0)

  private timer = useTimeoutFn(
    () => {
      if (!this.authNoExpireTime || !this.$ustra.auth.isAuthenticated) {
        this.timer.stop()
        return
      }

      this.remainSec.value = Math.ceil($ustra.utils.date.getMilliDuration(new Date(), this.authNoExpireTime) / 1000)
      // logger.debug('authentication timer :', this.remainSec.value)

      if (this.remainSec.value < 0) {
        this.option.onExpired()
        return
      }

      this.timer.start()
    },
    1000,
    {
      immediate: false,
    },
  )

  private startTimer() {
    if (process.server) {
      return
    }

    this.timer.stop()
    if (this.autoLogoutSeconds <= 0) {
      return
    }

    this.authNoExpireTime = $ustra.utils.date.addSeconds(new Date(), this.autoLogoutSeconds)
    this.remainSec.value = Math.ceil($ustra.utils.date.getMilliDuration(new Date(), this.authNoExpireTime) / 1000)
    this.timer.start()
  }

  private init() {
    if (process.server) {
      return
    }

    if (this.$ustra.auth.isAuthenticated) {
      this.startTimer()
    }

    this.$ustra.hooks.hook('auth:activated', () => {
      this.startTimer()
    })

    this.$ustra.hooks.hook('auth:updated', () => {
      if (this.$ustra.auth.isAuthenticated) {
        this.startTimer()
      }
    })

    this.$ustra.hooks.hook('auth:inactivated', () => {
      this.authNoExpireTime = null
      this.timer.stop()
    })
  }
}

/**
 * 중복 인증 처리
 */
class UstraAuthDuplicationChecker {
  constructor(
    private $ustra: Ustra,
    private option: {
      onDuplicated: () => void
    },
  ) {
    this.init()
  }

  private get authProps() {
    return this.$ustra.env.appProps.auth
  }

  private start() {
    if (this.authProps.duplication.type === 'none' || this.authProps.type !== 'jwt') {
      return
    }
  }

  private stop() {}

  private init() {
    if (process.server) {
      return
    }

    if (this.$ustra.auth.isAuthenticated) {
      this.start()
    }

    this.$ustra.hooks.hook('auth:activated', () => {
      this.start()
    })

    this.$ustra.hooks.hook('auth:updated', () => {
      if (this.$ustra.auth.isAuthenticated) {
        this.start()
      }
    })

    this.$ustra.hooks.hook('auth:inactivated', () => {
      this.stop()
    })
  }
}

class UstraAuthWebSocketDuplicationChecker {}
