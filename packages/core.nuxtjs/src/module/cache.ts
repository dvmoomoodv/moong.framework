/**
 * cache 설정
 * @packageDocumentation
 */

// FIXME: 추후 nitro cache api를 사용도록 개선 필요
// https://nitro.unjs.io/guide/cache
import { Nuxt } from '@nuxt/schema'
import { createResolver, addServerHandler } from '@nuxt/kit'

import { NuxtAppProps } from '../config/nuxt-app-props'

export const cache = async (options: NuxtAppProps, nuxt: Nuxt) => {
  //if (!nuxt.options.ssr || !options.nuxt?.cache?.ssr?.enabled) {
  if (!nuxt.options.ssr || process.dev || !options.nuxt?.cache?.ssr?.enabled) {
    return
  }

  if (options.auth.enabled && options.auth.type === 'jwt' && options.auth.jwt.useCookie && !options.nuxt.cache.ssr?.key) {
    // logger.warn('$ustra : When use jwt authentication and cookie store, please set ssr cache key option.')

    options.nuxt.cache.ssr.key = `
import { getCookie } from 'h3'
import { jwt } from '#ustra/core/utils'

export default (route, headers, event) => {
  const tokenValue = getCookie(event, '${options.auth.jwt.accessTokenKey}')

  if (!tokenValue) {
    return route
  }

  const claim = jwt.parseClaim(tokenValue)
  const sub = claim?.sub

  return !sub ? route : route + '-' + sub
}
    `
  }

  const option = options.nuxt.cache.ssr

  const { resolve } = createResolver(import.meta.url)
  const runtimeDir = await resolve('./cache/runtime')
  nuxt.options.build.transpile.push(runtimeDir)

  nuxt.hook('nitro:config', nitro => {
    const key = option.key
    nitro.externals = nitro.externals || {}
    nitro.externals.inline = nitro.externals.inline || []
    nitro.externals.inline.push(runtimeDir)
    nitro.virtual = nitro.virtual || {}

    if (typeof key === 'string') {
      delete option.key
    }

    nitro.virtual['#ustra-cache-ssr-options'] = `export const options = ${JSON.stringify(
      option,
      function (key, val) {
        if (typeof val === 'function') {
          return val + ''
        }
        return val
      },
      2,
    )}`

    nitro.virtual['#ustra-cache-ssr-key-function'] = typeof key === 'string' ? key : 'export default undefined'

    nitro.plugins = nitro.plugins || []
    nitro.plugins.push(resolve('./cache/runtime/nitro'))
  })
  addServerHandler({
    handler: resolve('./cache/runtime/middleware'),
  })
}
