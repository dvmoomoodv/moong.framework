import { NuxtApp } from '#app'
import { Ustra } from '../plugins/ustra'
import { UstraApi } from '../plugins/desc/api'
import { NuxtAppProps } from '../config'
import { useUstra } from './ustra'

export type SetupFunction<T> = (param: { $ustra: Ustra; appProps: NuxtAppProps; api: UstraApi; nuxtApp: NuxtApp }) => T

/**
 * Ustra Service 정의
 * @param setupFn setup function
 * @returns
 */
export const defineUstraService = <T>(setupFn: SetupFunction<T>) => {
  return (nuxtApp?: NuxtApp) => {
    const $ustra = useUstra(nuxtApp)
    return setupFn({ $ustra, appProps: $ustra.env.appProps, api: $ustra.api, nuxtApp: $ustra.nuxtApp })
  }
}
