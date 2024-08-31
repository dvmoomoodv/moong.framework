import { Nuxt } from '@nuxt/schema'
import { NuxtAppProps } from '../config/nuxt-app-props'

/**
 * nitro 관련 설정
 * @param options
 * @param nuxt
 */
export const nitro = (options: NuxtAppProps, nuxt: Nuxt) => {
  nuxt.options.nitro = nuxt.options.nitro || {}
  nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
  nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []

  // patch nitro date-fns issue
  // https://github.com/nuxt/framework/issues/6495
  nuxt.options.nitro.externals.inline.push('date-fns')

  // nuxt.options.nitro.externals.inline.push('@ustra/core', '@ustra/nuxt')
}
