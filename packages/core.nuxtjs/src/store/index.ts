import { NuxtApp, callWithNuxt, useRoute, useNuxtApp } from '#app'
export * from 'pinia'
import { defineStore, Store, _ExtractStateFromSetupStore, _ExtractGettersFromSetupStore, _ExtractActionsFromSetupStore } from 'pinia'
import { Ustra } from '../plugins/ustra'
import { UstraApi } from '../plugins/desc/api'
import { NuxtAppProps } from '../config'

export type InitFunction<T, Option> = (
  store: Store<string, _ExtractStateFromSetupStore<T>, _ExtractGettersFromSetupStore<T>, _ExtractActionsFromSetupStore<T>>,
  param: { $ustra: Ustra; appProps: NuxtAppProps; api: UstraApi; nuxtApp: NuxtApp; isClient: boolean; isServer: boolean },
  option?: Option,
) => any

/**
 * 초기 값 설정이 가능한 store 생성
 * @param id 아이디
 * @param setupStore store 설정
 * @param init 초기화 메소드
 * @param option 호출 옵션
 */
export const defineInitStore = <SS = any, Option = any>(id: string, setupStore: () => SS, init?: InitFunction<SS, Option>, option?: Option) => {
  const storeDef = defineStore(id, setupStore)
  return async (nuxtApp?: NuxtApp) => {
    nuxtApp = nuxtApp || useNuxtApp()
    // @ts-ignore
    const store = await callWithNuxt(nuxtApp, async () => await storeDef(nuxtApp?.$pinia))

    return await callWithNuxt(nuxtApp, async () => {
      const $ustra = nuxtApp.$ustra

      if (init && !store['_initialized']) {
        const route = await callWithNuxt(nuxtApp, () => useRoute())
        if (route.path.endsWith('.map')) {
          return
        }

        store['_initialized'] = true

        await init(
          store,
          { isClient: process.client, isServer: process.server, $ustra, appProps: $ustra.env.appProps, api: $ustra.api, nuxtApp: $ustra.nuxtApp },
          option,
        )
      }

      return store
    })
  }
}
