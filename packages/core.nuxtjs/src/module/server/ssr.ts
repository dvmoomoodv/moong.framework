import { join } from 'pathe'
import { NuxtAppProps } from '#ustra/nuxt/config'
import { addTemplate, addServerHandler, useNitro, addServerPlugin } from '@nuxt/kit'
import { NitroApp } from 'nitropack'
import { Nuxt } from '@nuxt/schema'
import { fromNodeMiddleware, callNodeListener, defineEventHandler } from 'h3'
import { pathToFileURL } from 'node:url'

export const addSsrMiddleware = (options: NuxtAppProps, nuxt: Nuxt) => {
  if (!nuxt.options.dev && !nuxt.options.ssr) {
    return
  }

  // nuxt.hook('ready', () => {
  //   // @ts-ignore
  //   const nitro: NitroApp = useNitro()
  //   // console.log('nitro.h3App', nitro)
  // })

  //   addTemplate({
  //     filename: 'ustra/ssr-context.ts',
  //     write: true,
  //     getContents: () => {
  //       return `
  // import contextService from 'request-context-ts'
  // import { fromNodeMiddleware, callNodeListener, defineEventHandler } from 'h3'

  // return fromNodeMiddleware(contextService.middleware('request'))
  // `
  //     },
  //   })

  addTemplate({
    filename: 'ustra/ssr-context.ts',
    write: true,
    getContents: () => {
      return `
import contextService from 'request-context-ts'
import { fromNodeMiddleware, callNodeListener, defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  await fromNodeMiddleware(contextService.middleware('ustra'))(event)
})
`
    },
  })

  addServerHandler({
    handler: join(nuxt.options.buildDir, 'ustra', 'ssr-context.ts'),
    middleware: true,
  })

  //console.log('url', pathToFileURL(join(nuxt.options.buildDir, 'ustra', 'ssr-context.ts')).toString())

  //addServerPlugin(pathToFileURL(join(nuxt.options.buildDir, 'ustra', 'ssr-context.ts')).toString())
  // addServerPlugin('../.nuxt/ustra/ssr-context.ts')

  //   addTemplate({
  //     filename: 'ustra/ssr1.ts',
  //     write: true,
  //     getContents: () => middlewareContent(),
  //   })
  //   addTemplate({
  //     filename: 'ustra/ssr2.ts',
  //     write: true,
  //     getContents: () => `
  // import { system } from '#ustra/core/utils'
  // import contextService from 'request-context-ts'
  // import { fromNodeMiddleware, callNodeListener, defineEventHandler } from 'h3'

  // export default defineEventHandler(event => {
  //   console.warn('event.node.req.uuid', contextService.get('request'))
  //   contextService.set('request:uuid', system.uuidBase62())
  // })
  //     `,
  //   })

  // addServerHandler({
  //   handler: join(nuxt.options.buildDir, 'ustra', 'ssr1.ts'),
  // })

  // addServerHandler({
  //   handler: join(nuxt.options.buildDir, 'ustra', 'ssr2.ts'),
  // })
}

function middlewareContent(): string {
  return `
import contextService from 'request-context-ts'
import { system } from '#ustra/core/utils'
import { fromNodeMiddleware, callNodeListener, defineEventHandler } from 'h3'

export default fromNodeMiddleware(contextService.middleware('request'))

// export default defineEventHandler(async event => {

//   event.node.req.uuid = system.uuidBase62()

//   return await callNodeListener(
//     contextService.middleware('request'),
//     event.node.req,
//     event.node.res
//   )

//   // contextService.set('ustra:uuid', system.uuidBase62())
// })
`
}
