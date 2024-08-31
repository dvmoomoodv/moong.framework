import { Nuxt } from '@nuxt/schema'
import { logger } from '#ustra/nuxt/utils/logger'
import { NuxtAppProps } from '../../config/nuxt-app-props'
import { installModuleIfNotExists } from '#ustra/nuxt/kit'

/**
 * nuxt-cache-ssr 모듈 설정
 * @param options
 * @param nuxt
 * @see https://www.npmjs.com/package/nuxt-cache-ssr
 */
export const nuxtCacheSsrModule = async (options: NuxtAppProps, nuxt: Nuxt) => {
  // if (!nuxt.options.ssr || process.dev || !options.nuxt?.cache?.ssr?.enabled) {
  if (!nuxt.options.ssr || !options.nuxt?.cache?.ssr?.enabled) {
    return
  }

  if (options.auth.enabled && options.auth.type === 'jwt' && options.auth.jwt.useCookie && !options.nuxt.cache.ssr?.key) {
    logger.warn('$ustra : When use jwt authentication and cookie store, please set ssr cache key option.')
  }

  await installModuleIfNotExists('nuxt-cache-ssr', options.nuxt.cache.ssr)
}
