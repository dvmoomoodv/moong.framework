import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { jwt, web, core } from '#ustra/core/utils'
import pathUtils from '#ustra/core/utils/path'
import { CookieStorage } from '#ustra/core/utils/storage/cookie-storage'
import { sessionStorage } from '#ustra/core/utils/storage/session-storage'
import { localStorage } from '#ustra/core/utils/storage/local-storage'
import { defineInitStore } from '#ustra/nuxt/store'
import { useUstra } from '#ustra/nuxt/composables'

export type JwtToken = {
  accessToken: string
  refreshToken: string
}

export const useJwtAuthStore = defineInitStore(
  'ustra:auth:jwt',
  () => {
    const $ustra = useUstra()
    const accessTokenKey = $ustra.env.appProps.auth.jwt.accessTokenKey
    const refreshTokenKey = $ustra.env.appProps.auth.jwt.refreshTokenKey
    const storageType = $ustra.env.appProps.auth.jwt.tokenStorageType

    const cookieOptions = $ustra.env.appProps.auth.jwt.cookieOptions
    const useCookieStorage = $ustra.env.appProps.auth.jwt.useCookie
    const syncServerAuthCookies = useCookieStorage && cookieOptions.syncServer

    const getBrowserStorage = () => {
      return storageType === 'local' ? localStorage : sessionStorage
    }

    const cookieStorage = new CookieStorage({
      samesite: cookieOptions.samesite,
      secure: cookieOptions.secure,
      path: cookieOptions.path || '/',
      domain: cookieOptions.domain,
      httponly: false,
      valueConverter: null,
      keyConverter: null,
      pure: true,
      maxAge: null,
    })

    const accessTokenCookie = () => {
      try {
        return cookieStorage.getItem(accessTokenKey, $ustra.nuxtApp.ssrContext?.event?.node?.req)
      } catch (e) {
        return null
      }
    }

    const refreshTokenCookie = () => {
      try {
        return cookieStorage.getItem(refreshTokenKey, $ustra.nuxtApp.ssrContext?.event?.node?.req)
      } catch (e) {
        return null
      }
    }

    const accessTokenBrowser = () => {
      try {
        return getBrowserStorage().getItem(accessTokenKey) as string
      } catch (e) {
        return null
      }
    }

    const refreshTokenBrowser = () => {
      try {
        return getBrowserStorage().getItem(refreshTokenKey) as string
      } catch (e) {
        return null
      }
    }

    // const accessTokenStorage = process.client
    //   ? useStorage(accessTokenKey, '', storageType === 'local' ? core.global.localStorage : core.global.sessionStorage)
    //   : ref<string>(null)
    // const refreshTokenStorage = process.client
    //   ? useStorage(refreshTokenKey, '', storageType === 'local' ? core.global.localStorage : core.global.sessionStorage)
    //   : ref<string>(null)

    const _accessToken = ref<string>(null)
    const _refreshToken = ref<string>(null)

    /**
     * access token
     */
    const accessToken = computed(() => {
      let token = _accessToken.value
      token = token || (useCookieStorage ? accessTokenCookie() : null)

      if (process.client) {
        token = token || accessTokenBrowser()
      }

      return token
    })

    /**
     * refresh token
     */
    const refreshToken = computed(() => {
      let token = _refreshToken.value
      token = token || (useCookieStorage ? refreshTokenCookie() : null)

      if (process.client) {
        token = token || refreshTokenBrowser()
      }

      return token
    })

    /**
     * token claim
     */
    const tokenClaim = computed(() => {
      if (accessToken.value) {
        return jwt.parseClaim(accessToken.value)
      }

      return null
    })

    /**
     * 인증 여부
     */
    const authenticated = computed(() => {
      return !!tokenClaim.value && !!tokenClaim.value.sub && !!tokenClaim.value.cp
    })

    /**
     * 사용자 정보 존재 여부
     */
    const existsUser = computed(() => {
      return tokenClaim.value && tokenClaim.value.sub
    })

    const actions = {
      /**
       * token update
       * @param newToken 신규 토큰
       */
      setToken(newToken: JwtToken) {
        if (!newToken?.accessToken) {
          actions.removeToken()
        } else {
          if (process.client) {
            getBrowserStorage().setItem(accessTokenKey, newToken.accessToken)
            getBrowserStorage().setItem(refreshTokenKey, newToken.refreshToken)

            _accessToken.value = newToken.accessToken
            _refreshToken.value = newToken.refreshToken
          }

          const currentSyncCookies =
            syncServerAuthCookies === false
              ? false
              : !pathUtils.isMatchPatterns($ustra.nuxtApp._route.path, ...(cookieOptions.excludeSyncServerUrlPatterns || []))

          // 서버 상에서 동기화 수행시에만 처리
          if (currentSyncCookies && process.server) {
            cookieStorage.setItem(
              accessTokenKey,
              newToken.accessToken,
              $ustra.nuxtApp.ssrContext?.event?.node?.req,
              $ustra.nuxtApp.ssrContext?.event?.node?.res,
            )
            cookieStorage.setItem(
              refreshTokenKey,
              newToken.refreshToken,
              $ustra.nuxtApp.ssrContext?.event?.node?.req,
              $ustra.nuxtApp.ssrContext?.event?.node?.res,
            )
            _accessToken.value = newToken.accessToken
            _refreshToken.value = newToken.refreshToken
          }
        }
      },

      /**
       * 토큰 제거
       */
      removeToken() {
        if (process.client) {
          getBrowserStorage().setItem(accessTokenKey, '')
          getBrowserStorage().setItem(refreshTokenKey, '')

          _accessToken.value = ''
          _refreshToken.value = ''
        }

        if (useCookieStorage) {
          cookieStorage.setItem(accessTokenKey, '', $ustra.nuxtApp.ssrContext?.event?.node?.req, $ustra.nuxtApp.ssrContext?.event?.node?.res)
          cookieStorage.setItem(refreshTokenKey, '', $ustra.nuxtApp.ssrContext?.event?.node?.req, $ustra.nuxtApp.ssrContext?.event?.node?.res)

          if (process.server) {
            _accessToken.value = ''
            _refreshToken.value = ''
          }
        }
      },
    }

    // initializing
    if (process.client && useCookieStorage) {
      actions.setToken({
        accessToken: accessTokenCookie(),
        refreshToken: refreshTokenCookie(),
      })
    } else if (process.client) {
      actions.setToken({
        accessToken: accessTokenBrowser(),
        refreshToken: refreshTokenBrowser(),
      })
    }

    return { accessToken, refreshToken, tokenClaim, authenticated, existsUser, ...actions, _accessToken, _refreshToken }
  },
  (store, { isClient, appProps }) => {},
)
