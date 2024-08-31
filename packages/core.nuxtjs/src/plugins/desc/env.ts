import { NuxtApp, useRuntimeConfig, callWithNuxt } from '#app'
import { hooks, core, web, objects } from '#ustra/core/utils'
import { env } from '#ustra/core/config/env'
import { Profile } from '#ustra/core/config'
import { logger } from '#ustra/nuxt/utils/logger'
import { NuxtAppProps } from '#ustra/nuxt/config'
// import { CookieStorage } from '#ustra/core/utils/storage/cookie-storage'

// @ts-ignore
import getFunctionAppProps from '#build/ustra/app-props.ts'

import { Ustra } from '../ustra'

export class UstraEnv {
  private _appProps: Partial<NuxtAppProps> = null
  private currentProfile: Profile = null

  public isMobileRequest: boolean = false
  public isAndroidRequest: boolean = false
  public isIOsRequest: boolean = false
  public isLoaded: boolean = false

  constructor(private app: NuxtApp, private $ustra: Ustra) {}

  async init() {
    await callWithNuxt(this.app, async () => {
      try {
        if (process.server) {
          this.$ustra.definedStore.core.isSsr = !!this.app.ssrContext
        }

        if (!process.dev) {
          this.disableConsole()
        }

        const runtimeConfig = useRuntimeConfig()
        this._appProps = runtimeConfig.ustra || runtimeConfig.public?.ustra

        const configEnv = await this.getConfigEnv(this._appProps.nuxt.build.generation.profileApiUrl)
        this.currentProfile = env.getProfile(configEnv || this._appProps.app.profile)

        logger.info('😸 $ustra currentProfile', this.currentProfile)

        this._appProps = this.getAppProps(runtimeConfig)

        const functionProps = await getFunctionAppProps()

        if (functionProps) {
          for (const key in functionProps) {
            objects.setPropertyFromPath(this._appProps, key, functionProps[key])
          }
        }

        hooks.callHook('properties:stored', this._appProps)
        this.$ustra.hooks.callHook('env:loaded', this._appProps)

        this.isMobileRequest = web.isMobileRequest(this.app.ssrContext?.event?.req)
        this.isAndroidRequest = web.isAndroidRequest(this.app.ssrContext?.event?.req)
        this.isIOsRequest = web.isIOsRequest(this.app.ssrContext?.event?.req)
      } finally {
        if (!process.dev) {
          if (!this._appProps.logging.browser.disabled) {
            this.enableConsole()
          }
        }
        this.isLoaded = true
      }
    })
  }

  private getAppProps(runtimeConfig): NuxtAppProps {
    return this._appProps

    // if (!this.isStaticProduction) {
    //   return this._appProps
    // }

    // return runtimeConfig[`ustra-${env.getServerProfileName(this.currentProfile)}`] || this._appProps
  }

  private async getConfigEnv(profileApiUrl: string) {
    // tobe는 build 영역과 runtime 영역 분리로 호출이 불필요함.
    // for static application
    // if (profileApiUrl && this.isStaticProduction) {
    //   try {
    //     const cookieStorage = new CookieStorage({
    //       keyConverter: null,
    //       valueConverter: null,
    //     })

    //     let encProfile = cookieStorage.getItem('c')

    //     if (!encProfile) {
    //       // API 호출 케이스
    //       encProfile = (await axios.call({ url: profileApiUrl })).data as string
    //     }

    //     const decProfile = this.$ustra.utils.crypto.decrypt(this.$ustra.utils.crypto.decrypt(encProfile))
    //     return decProfile
    //   } catch (e) {
    //     console.warn(e)
    //     return null
    //   }
    // } else {
    //   return null
    // }
    return null
  }

  /**
   * SSR 어플리케이션 여부 반환
   */
  get isSsrApp() {
    return this.$ustra.definedStore.core.isSsr
  }

  /**
   * 운영 static application
   */
  get isStaticProduction() {
    return !this.isDevelopment && !this.isSsrApp
  }

  /**
   * 암호화된 프로파일 조회
   */
  get encryptedProfile() {
    if (!this.currentProfile) {
      return null
    }

    return this.$ustra.utils.crypto.encrypt(this.$ustra.utils.crypto.encrypt(env.getServerProfileName(this.currentProfile)))
  }

  /**
   * 어플리케이션 설정 정보 조회
   */
  get appProps() {
    return this._appProps as NuxtAppProps
  }

  /**
   * 개발 서버 구동 여부
   */
  get isDevServer() {
    return this.appProps.server.dev
  }

  /**
   * 개발 여부
   */
  get isDevelopment() {
    return process.env.NODE_ENV === 'development'
  }

  private disableConsole() {
    if (process.server) {
      return
    }

    if (!core.global.__originConsole) {
      core.global.__originConsole = core.global.console
    }

    core.global.console = {
      assert: () => {},
      clear: () => {},
      context: () => {},
      count: () => {},
      countReset: () => {},
      createTask: () => {},
      debug: () => {},
      dir: () => {},
      log: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      trace: () => {},
      time: () => {},
      timeEnd: () => {},
    }
  }

  /**
   * local 개발 환경 여부
   */
  get isLocal() {
    return this.currentProfile === Profile.LOCAL
  }

  /**
   * 운영 환경인지 확인
   */
  get isProduction() {
    return this.currentProfile === Profile.PRODUCTION
  }

  /**
   * 개발 환경인지 확인
   */
  get isDev() {
    return this.currentProfile === Profile.DEV
  }

  /**
   * Staging 환경인지 확인
   */
  get isStaging() {
    return this.currentProfile === Profile.STAGING
  }

  /**
   * QA 환경여부 확인
   * @returns
   */
  get isQa() {
    return this.currentProfile === Profile.QA
  }

  private enableConsole() {
    if (core.global.__originConsole) {
      core.global.console = core.global.__originConsole
      delete core.global.__originConsole
    }
  }
}
