import { Nuxt } from '@nuxt/schema'
import { NuxtAppProps } from '../config/nuxt-app-props'
import { resolvePageRoutes } from '#ustra/nuxt/kit'

function extendsPageRoutes(options: NuxtAppProps, nuxt: Nuxt) {
  nuxt.hook('pages:extend', async pages => {
    const allRoutes = (await Promise.all(options.nuxt.router.extendPagesDirs.map(async dir => await resolvePageRoutes(dir)))).flat()
    pages.unshift(...allRoutes)
  })
}

export const router = (options: NuxtAppProps, nuxt: Nuxt) => {
  extendsPageRoutes(options, nuxt)
}
