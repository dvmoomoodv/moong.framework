// import { NuxtApp } from '#app'
// import { useUstra } from '#ustra/nuxt'
// import { createVuetify } from 'vuetify'
export * from './dialog'

// /**
//  * vuetify 플러그인을 등록한다.
//  * @returns
//  */
// export const createVuetifyPlugin = async (nuxtApp: NuxtApp) => {
//   const vuetifyProps = useUstra().env.appProps.nuxt.vuetify
//   const vuetifyOptions = { ...vuetifyProps.options }
//   vuetifyOptions.ssr = !!nuxtApp.$ustra.env.isSsrApp

//   // install vuetify
//   //  : https://next.vuetifyjs.com/en/getting-started/installation/

//   // @ts-ignore
//   await nuxtApp.callHook('ustra:vuetify:options', vuetifyOptions)
//   const vuetify = createVuetify({
//     ...vuetifyOptions,
//   })
//   // _vuetifyPlugin = vuetify

//   return vuetify
// }
