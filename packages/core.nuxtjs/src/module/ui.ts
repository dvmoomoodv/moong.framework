import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'pathe'
import { existsSync, mkdirSync, copyFileSync } from 'fs-extra'
import { Nuxt } from '@nuxt/schema'
import { NuxtAppProps, Profile } from '../config/nuxt-app-props'

/**
 * favicon 설정
 */
const setFavicon = (options: NuxtAppProps, nuxt: Nuxt) => {
  if (!options.nuxt.ui.useDefaultFavicon) {
    return
  }

  const currentDir = dirname(fileURLToPath(import.meta.url))
  const originFaviconFilePath = resolve(currentDir, '../assets/ustra-favicon.svg')
  const targetFaviconFilePath = resolve(nuxt.options.srcDir, './public/ustra-favicon.svg')
  const publicDir = resolve(nuxt.options.srcDir, './public')

  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }

  copyFileSync(originFaviconFilePath, targetFaviconFilePath)

  nuxt.options.app.head = nuxt.options.app.head || {}
  nuxt.options.app.head.link = nuxt.options.app.head.link || []
  nuxt.options.app.head.link.push({
    rel: 'icon',
    href: `${nuxt.options.app.baseURL || '/'}ustra-favicon.svg`,
    type: 'image/svg+xml',
  })
}

export const ui = async (options: NuxtAppProps, nuxt: Nuxt) => {
  setFavicon(options, nuxt)
}
