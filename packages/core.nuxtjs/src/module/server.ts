import { resolve, join } from 'pathe'
import serveStatic from 'serve-static'
import { Nuxt } from '@nuxt/schema'
import { addTemplate, addServerHandler } from '@nuxt/kit'
import { defineNodeMiddleware, fromNodeMiddleware } from 'h3'
import { logger } from '#ustra/nuxt/utils/logger'
import middlewareUtils from '#ustra/core/server/http/utils/middleware-utils'
import { NuxtAppProps } from '../config/nuxt-app-props'
import { addProxyMiddleware } from './server/proxy'
import { addStaticMiddleware } from './server/static'
// import { addSsrMiddleware } from './server/ssr'

// function addStaticServes(options: NuxtAppProps, nuxt: Nuxt) {
//   // logger.info('add $ustra static directory : ', '/fonts', resolve(__dirname, '../assets/fonts'))
//   // addServerMiddleware({
//   //   path: '/fonts',
//   //   handler: serveStatic(resolve(__dirname, '../assets/fonts')),
//   // })
// }

function addMiddlewares(options: NuxtAppProps, nuxt: Nuxt) {
  // FIXME: fetch middleware to use addServerHandler
  // nuxt.options.serverMiddleware = nuxt.options.serverMiddleware || []
  // middlewareUtils.generateMiddlewares(options, false).forEach(middleware => {
  //   addServerMiddleware({
  //     // @ts-ignore
  //     // handler: fromNodeMiddleware(middleware),
  //     handler: middleware,
  //   })
  // })
  // addSsrMiddleware(options, nuxt)

  if (options.server.middleware?.proxy?.proxies) {
    addProxyMiddleware(options, nuxt)
  }

  if (options.server.middleware?.static) {
    addStaticMiddleware(options, nuxt)
  }
}

export const server = (options: NuxtAppProps, nuxt: Nuxt) => {
  addMiddlewares(options, nuxt)
}
