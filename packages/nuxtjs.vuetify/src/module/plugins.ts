import defu from 'defu'
import { resolve } from 'pathe'
import { isAbsolute } from 'pathe'
import { Nuxt } from '@nuxt/schema'
import { addPluginTemplate, createResolver } from '@nuxt/kit'
import { logger } from '#ustra/nuxt/utils/logger'
import { NuxtAppProps, VuetifyOptions } from '#ustra/nuxt/config'
import { VuetifyOptions as OriginVuetifyOptions } from 'vuetify'
// import vuetify from 'vite-plugin-vuetify'
import { addPluginProperty, addScript } from '#ustra/nuxt/kit'

export const plugins = async (options: NuxtAppProps, nuxt: Nuxt) => {
  logger.info('$ustra vuetify plugin to nuxt app')

  const vuetifyOption = options.nuxt.vuetify
  const originVuetifyOption = <OriginVuetifyOptions>vuetifyOption.vuetifyOptions
  let stylePath =
    vuetifyOption.styles === true
      ? 'vuetify/styles'
      : vuetifyOption.styles === 'sass' || vuetifyOption.styles === 'expose'
      ? 'vuetify/styles/main.sass'
      : typeof vuetifyOption.styles === 'object'
      ? vuetifyOption.styles.configFile
      : ''

  originVuetifyOption.ssr = nuxt.options.ssr

  const iconCdnMap = new Map<string, string>([
    ['fa', 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css'],
    ['mdi', 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'],
  ])

  // cdn
  if (vuetifyOption?.icons?.useCdn) {
    nuxt.options.app.head.link ||= []

    if (vuetifyOption.icons.mdi) {
      nuxt.options.app.head.link.push({
        rel: 'stylesheet',
        type: 'text/css',
        href: iconCdnMap.get('mdi'),
      })
    }

    if (vuetifyOption.icons.fa) {
      nuxt.options.app.head.link.push({
        rel: 'stylesheet',
        type: 'text/css',
        href: iconCdnMap.get('fa'),
      })
    }
  }

  // nuxt.hooks.hook('vite:extendConfig', async config => {
  //   const resolver = createResolver(nuxt.options.srcDir)
  //   if (typeof vuetifyOption.styles === 'object' && vuetifyOption.styles?.configFile) {
  //     // @ts-ignore
  //     vuetifyOption.styles.configFile = await resolver.resolvePath(vuetifyOption.styles.configFile, {
  //       alias: nuxt.options.alias,
  //     })
  //   }

  //   config.optimizeDeps = defu(config.optimizeDeps, { exclude: ['vuetify'] })

  //   // if (vuetifyOption.treeshaking) {
  //   // config.plugins = [
  //   //   ...(Array.isArray(config.plugins) ? config.plugins : []),
  //   //   vuetify({
  //   //     styles: vuetifyOption.styles,
  //   //     autoImport: vuetifyOption.autoImport,
  //   //   }),
  //   // ]
  //   // }

  //   config.ssr ||= {}
  //   config.ssr.noExternal = [...(Array.isArray(config.ssr.noExternal) ? config.ssr.noExternal : []), 'vuetify']
  // })

  // console.log('getPluginContent(stylePath, vuetifyOption, originVuetifyOption)', getPluginContent(stylePath, vuetifyOption, originVuetifyOption))

  addPluginTemplate({
    // src: path.resolve(__dirname, '../../templates/ustra-vuetify.js'),
    getContents() {
      return getPluginContent(stylePath, vuetifyOption, originVuetifyOption)
    },
    filename: 'ustra/ustra-vuetify.ts',
    options: options.nuxt.vuetify,
    write: false,
  })

  // add management plugin props
  if (options.nuxt.management.enabled) {
    if (options.nuxt.management.ui.componentType === 'vuetify') {
      addPluginProperty('vuetify', resolve('../plugins/vuetify.ts'), '#ustra/nuxt-vuetify/plugins/vuetify')
    }
  }
}

function getPluginContent(stylePath: string, vuetifyOption: VuetifyOptions, originVuetifyOption: OriginVuetifyOptions) {
  let content = `
${!stylePath ? '' : `import '${stylePath}'\n`}

// material icons
${vuetifyOption.icons?.mdi === true && !vuetifyOption.icons?.useCdn ? `import '@mdi/font/css/materialdesignicons.min.css'\n` : ''}

// TODO: fa icon 추가 처리 필요함.

// date picker
${vuetifyOption.datepicker.enabled === true ? `import '@vuepic/vue-datepicker/dist/main.css'\n` : ''}


import { logger } from '#ustra/nuxt/utils/logger'
import { createVuetify } from 'vuetify'
import { defineNuxtPlugin, NuxtApp } from '#app'

export default defineNuxtPlugin(async nuxtApp => {
  logger.info('😸[' + $ustra.uuid + '] Start loading U.STRA Vuetify plugin')

  const vuetifyProps = useUstra().env.appProps.nuxt.vuetify
  const vuetifyOptions = { ...vuetifyProps.options }

`

  // set default components
  if (!vuetifyOption.treeshaking && !originVuetifyOption.components) {
    content += `vuetifyOptions.components = await import('vuetify/components')
    `
  }

  // set default directives
  if (!vuetifyOption.treeshaking && !originVuetifyOption.directives) {
    content += `vuetifyOptions.directives = await import('vuetify/directives')
    `
  }

  // set default locale
  if (!originVuetifyOption.locale) {
    content += `
const ko = (await import('vuetify/locale')).ko
const en = (await import('vuetify/locale')).en
vuetifyOptions.locale = {
  locale: 'ko',
  fallback: 'ko',
  messages: { ko, en },
}
    `
  }

  content += `
  await nuxtApp.callHook('ustra:vuetify:options', vuetifyOptions)
  const vuetify = await createVuetify(vuetifyOptions)
  nuxtApp.vueApp.use(vuetify)

  logger.info('😸[' + $ustra.uuid + '] Finish loading U.STRA Vuetify plugin')

  return {
    provide: {
      vuetify,
    },
  }
})`
  return content
}
