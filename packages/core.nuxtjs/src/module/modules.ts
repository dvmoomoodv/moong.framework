/**
 * nuxt 추가 모듈 설정
 * @packageDocumentation
 */
import { NuxtAppProps } from '../config/nuxt-app-props'
import { installModuleIfNotExists } from '#ustra/nuxt/kit'
import { Nuxt } from '@nuxt/schema'
import { i18nModule } from './builtin/i18n'
// import { monacoModule } from './builtin/monaco'
// import { nuxtCacheSsrModule } from './builtin/cache'

function modifyOptionsFromModuleConfig(options: NuxtAppProps) {
  if (options.nuxt.wijmo.enabled) {
    options.nuxt.vuetify.enabled = true
    // options.nuxt.vuetify.mdi.enabled = true
  }
}

export const modules = async (options: NuxtAppProps, nuxt: Nuxt) => {
  modifyOptionsFromModuleConfig(options)

  // vueuse
  if (options.nuxt.vueuse.enabled) {
    // await installModuleIfNotExists('@vue-macros/nuxt')

    await installModuleIfNotExists('@vueuse/nuxt', {
      autoImports: options.nuxt.vueuse.autoImports,

      // FIXME: SSR Handler 오류 임시 조치
      // https://github.com/vueuse/vueuse/issues/2453
      ssrHandlers: false,
      // ssrHandlers: core.defaults(options.nuxt.vueuse.ssrHandlers, nuxt.options.ssr),
    })
  }

  await installModuleIfNotExists('@pinia/nuxt')

  // vuetify
  if (options.nuxt.vuetify.enabled) {
    await installModuleIfNotExists('@ustra/nuxt-vuetify', options)
  }

  // wijmo
  if (options.nuxt.wijmo.enabled) {
    await installModuleIfNotExists('@ustra/nuxt-wijmo', options)
  }

  // ckeditor
  if (options.nuxt.ckeditor5.enabled) {
    await installModuleIfNotExists('@ustra/nuxt-ckeditor5', options)
  }

  // ssr cache module
  // await nuxtCacheSsrModule(options, nuxt)

  // nuxt-monaco-editor
  // await monacoModule(options, nuxt)

  // nuxt i18n
  await i18nModule(options, nuxt)

  // nuxtimage
  // issue : https://github.com/nuxt/image/issues/643
  // await installModuleIfNotExists(nuxt, '@nuxt/image')
}
