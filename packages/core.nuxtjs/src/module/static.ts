/**
 * static application 설정
 * @exports {@link statics}
 * @packageDocumentation
 */

import { OutputOptions } from 'rollup'
import { Nuxt } from '@nuxt/schema'
import { env } from '#ustra/core/config/env'
import core from '#ustra/core/utils/core'
import { resolve } from 'pathe'
import { existsSync } from 'node:fs'
import { logger } from '#ustra/nuxt/utils/logger'

import { nuxtConfigLoader } from '../config/loader/config-loader'
import { NuxtAppProps, Profile } from '../config/nuxt-app-props'
import config from './utils/config'
import { pathToFileURL } from 'node:url'

async function generateAppProps(options: NuxtAppProps, nuxt: Nuxt) {
  if (!options.nuxt.build.generation.generateProfiles) {
    return
  }

  for (const profile of options.nuxt.build.generation.generateProfiles) {
    // config
    let profileConfig: NuxtAppProps = (await config.getProfileNuxtAppProps(nuxt.options.rootDir, profile)) || options
    profileConfig.app.profile = profile
    profileConfig = nuxtConfigLoader.loadConfigProperties(profileConfig, false)

    const propertyKey = `ustra-${env.getServerProfileName(profile)}`

    // TODO: 암호화 처리
    const publicConfig = { ...(nuxt.options.runtimeConfig.public || {}), [propertyKey]: { ...config.getClientOptions(profileConfig) } }

    // @ts-ignore
    nuxt.options.runtimeConfig = { ...nuxt.options.runtimeConfig, [propertyKey]: { ...profileConfig }, public: publicConfig }
  }
}

/**
 * spaLoadingTemplate 기본 설정
 * @param options
 * @param nuxt
 */
async function setSpaLoadingTemplate(options: NuxtAppProps, nuxt: Nuxt) {
  // FIXME: nuxt version 변경 시 경로 확인 필요함.
  const templatePath = resolve(nuxt.options.srcDir, 'app/spa-loading-template.html')
  if (existsSync(templatePath)) {
    return
  }

  if (core.isEmpty(nuxt.options.spaLoadingTemplate)) {
    // nuxt.options.spaLoadingTemplate = true
    options.server.middleware.static = options.server.middleware.static || []
    options.server.middleware.static.push({
      path: '/ustra-resources',
      serveDir: resolve(__dirname, '../assets/loading'),
    })

    nuxt.options.spaLoadingTemplate = resolve(__dirname, '../assets/loading/ustra-spa-loading-template.html')

    // logger.info(
    //   '$ustra register default spaLoadingTemplate \n(if you need customization, read the document follow link : `http://guide.ustraframework.kro.kr/ref-doc/11/8cKD4Bwwyle9FVpk6yhA`)',
    // )
    logger.info(
      '$ustra register default spaLoadingTemplate \n(if you need customization, read the document follow link : `http://guide.ustraframework.kro.kr`)\nReference Doc > Framework3-Node3 > Nuxt > Nuxt 기능 활용 > SPA Loading Template',
    )
  }
}

export const statics = async (options: NuxtAppProps, nuxt: Nuxt) => {
  setSpaLoadingTemplate(options, nuxt)

  if (!nuxt.options._generate) {
    return
  }

  // 3버전의 경우는 generate profiles 지원하지 않음.
  // await generateAppProps(options, nuxt)

  // nuxt.hook('vite:extendConfig', config => {
  //   // convert .mjs to .js
  //   // https://github.com/nuxt/framework/issues/4807
  //   const ouputOption = <OutputOptions>config.build.rollupOptions.output

  //   // ouputOption.chunkFileNames = '_nuxt/[name].[hash].js'
  //   // ouputOption.entryFileNames = '_nuxt/[name].[hash].js'
  // })
}
