import { useUstra, useUstraEnv } from '../composables/ustra'
import { useNuxtApp } from '#app'

/**
 * service 기반 클래스 (for Legacy)
 * @deprecate use defineUstraService
 */
export abstract class UstraService {
  /**
   * nuxt app 객체 조회
   * @returns
   */
  protected get nuxtApp() {
    return useNuxtApp()
  }

  /**
   * get ustra plugin
   */
  protected get $ustra() {
    return useUstra()
  }

  /**
   * get application property
   */
  protected get appProps() {
    return useUstraEnv().appProps
  }
}
