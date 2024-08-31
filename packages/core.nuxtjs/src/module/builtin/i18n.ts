import { Nuxt } from '@nuxt/schema'
import { objects, core } from '#ustra/core/utils'
import { installModuleIfNotExists } from '#ustra/nuxt/kit'
import { NuxtAppProps } from '../../config/nuxt-app-props'

/**
 * i18n 모듈 설정
 * @param options
 * @param nuxt
 * @see https://nuxt.com/modules/i18n
 */
export const i18nModule = async (options: NuxtAppProps, nuxt: Nuxt) => {
  if (options.i18n.messages) {
    const defaultMessage = objects.flat(options.i18n.messages['default']) || {}
    for (const locale in options.i18n.messages) {
      options.i18n.messages[locale] = core.deepMerge(defaultMessage, objects.flat(options.i18n.messages[locale]))
    }
  }

  if (!options.i18n.enabled) {
    // init message
    // options.i18n.messages = {}
    return
  }

  options.i18n.vueI18n = options.i18n.vueI18n || {}

  if (!options.i18n.locales) {
    options.i18n.locales = [{ code: 'ko', iso: 'ko-KR', dir: 'ltr' }]
  }

  if (!options.i18n.strategy) {
    options.i18n.strategy = 'no_prefix'
  }

  const cloneOptions = objects.omit(core.clone(options.i18n), 'messages')

  const i18nOptions = {
    defaultLocale: cloneOptions.locale,
    ...cloneOptions,
    vueI18n: {
      ...cloneOptions.vueI18n,
      legacy: false,
      locale: cloneOptions.locale,
      fallbackLocale: cloneOptions.locale,
      // messages: options.i18n.messages,
    },
  }

  if (typeof cloneOptions.vueI18n === 'string') {
    i18nOptions.vueI18n = cloneOptions.vueI18n
  }

  // @ts-ignore
  nuxt.hook('i18n:extend-messages', additionalMessages => {
    additionalMessages.push(options.i18n.messages)
  })

  await installModuleIfNotExists('@nuxtjs/i18n', i18nOptions)
}
