// import { getContext } from 'unctx'
import { useNuxtApp, NuxtApp } from '#app'
import { getCurrentInstance } from 'vue'
import type { Ustra } from '../plugins/ustra'

export class NuxtUtils {
  /**
   * ustra 플러그인 객체 조회
   * @param nuxtApp
   * @returns
   */
  useUstra(nuxtApp?: NuxtApp): Ustra {
    try {
      const instance = nuxtApp || useNuxtApp()
      return instance.$ustra
    } catch (e) {
      const vm = getCurrentInstance()

      if (!vm) {
        throw new Error('ustra instance unavailable')
      }

      return vm.appContext.app['$ustra'] as Ustra
    }
  }
}

const instance = new NuxtUtils()
export default instance
