import { extendViteConfig } from '@nuxt/kit'
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// import { NodeModulesPolyfillPlugin } from './esbuild/node-module-polyfill'
import { Nuxt } from '@nuxt/schema'
import { core } from '#ustra/core/utils'
import { path as pathUtils, module } from '#ustra/core/utils/node'
import { resolve } from 'pathe'
import { NuxtAppProps } from '../config/nuxt-app-props'
// import removeNodeDepsPlugin from './build/plugins/remove-node-deps'
import { getSsrNoExternalModule, getFrameworkPackageNames } from '#ustra/core/config/framework/modules'
import { optimizeBuild } from './build/optimization'
import watchNodeModulesPlugin from './build/plugins/watch-node-modules'

/**
 * vue runtime compiler configuration
 * @param nuxt
 * @see https://github.com/nuxt/framework/issues/4661
 */
// const enableVueRuntimeCompiler = function (nuxt: Nuxt) {
//   //   const vueModulePath1 = pathUtils.toRelativePath(nuxt.options.rootDir, module.findNodeModuleDirPath(nuxt.options.rootDir, '@vue', false))
//   //   const vueModulePath2 = pathUtils.toRelativePath(nuxt.options.rootDir, module.findNodeModuleDirPath(nuxt.options.rootDir, 'vue', false))

//   //   nuxt.options.nitro = nuxt.options.nitro || {}
//   //   nuxt.options.nitro.commonJS = nuxt.options.nitro.commonJS || {}
//   //   nuxt.options.nitro.commonJS.dynamicRequireTargets = [
//   //     ...(nuxt.options.nitro.commonJS.dynamicRequireTargets || []),
//   //     vueModulePath1 + '/compiler-core',
//   //     vueModulePath1 + '/compiler-dom',
//   //     vueModulePath1 + '/compiler-ssr',
//   //     vueModulePath2 + '/server-renderer',
//   //     vueModulePath2,
//   //   ]

//   //   nuxt.options.alias = {
//   //     ...(nuxt.options.alias || {}),
//   //     // '@vue/compiler-core': '@vue/compiler-core',
//   //     // '@vue/compiler-dom': '@vue/compiler-dom',
//   //     // '@vue/compiler-ssr': '@vue/compiler-ssr',
//   //     // 'vue/server-renderer': 'vue/server-renderer',
//   //     // 'estree-walker': 'estree-walker',
//   //     // '@babel/parser': '@babel/parser',
//   //   }

//   nuxt.hook('vite:extendConfig', (config, { isClient }) => {
//     if (isClient) {
//       config.resolve.alias['vue'] = 'vue/dist/vue.esm-bundler.js'
//     }

//     config.ssr = config.ssr || {}
//     config.ssr.noExternal = [
//       // @ts-ignore
//       ...(config.ssr.noExternal || []),
//       ...getSsrNoExternalModule(),
//     ]
//   })
// }

/**
 * lodash module build patch
 * @param nuxt
 */
const patchLodashModule = function (nuxt: Nuxt) {
  nuxt.hook('vite:extendConfig', (config, { isClient, isServer }) => {
    if (nuxt.options.dev) {
      config.resolve.alias['lodash/*'] = 'lodash-es/*'
      config.resolve.alias['lodash'] = 'lodash-es'
    }

    config.optimizeDeps.exclude.push('lodash', 'lodash/*', 'lodash-es', 'lodash-es/*', 'lodash-es/toString', 'lodash/toString')
  })
  nuxt.options.build.transpile.push(...['lodash', 'lodash-es'])
}

/**
 * patch socketjs client module
 * @see https://github.com/vitejs/vite/issues/7301
 * @param nuxt
 */
// const patchSocketjsClientModule = function (nuxt: Nuxt) {
//   extendViteConfig(config => {
//     const sockjsClientModulePath = module.findNodeModuleDirPath(nuxt.options.srcDir, 'sockjs-client')

//     if (sockjsClientModulePath) {
//       config.resolve.alias['eventsource'] = resolve(sockjsClientModulePath, './lib/transport/browser/eventsource.js')
//       config.resolve.alias['events'] = resolve(sockjsClientModulePath, './lib/event/emitter.js')
//       config.resolve.alias['crypto'] = resolve(sockjsClientModulePath, './lib/utils/browser-crypto.js')
//     }
//   })
// }

export const build = (options: NuxtAppProps, nuxt: Nuxt) => {
  nuxt.hook('vite:extendConfig', (config, { isClient, isServer }) => {
    if (isClient && process.env.NODE_ENV === 'production') {
      // FIXME: patch for nuxt 3.1.1 error
      // config.build.rollupOptions.plugins = [...(config.build.rollupOptions.plugins || []), rollupNodePolyFill()]

      config.define['process.platform'] = '"browser"'
      config.optimizeDeps.exclude = [...config.optimizeDeps.exclude, 'winston', 'winston-daily-rotate-file']
      // clientConfig.resolve.alias['process'] = resolve(__dirname, '../../../../node_modules/rollup-plugin-node-polyfills/polyfills/process-es6.js')
    }

    config.optimizeDeps.exclude = [...config.optimizeDeps.exclude, 'scule', 'date-fns/locale']

    // if (!process.env.PORT && config.define['process.env.PORT']) {
    //   config.define['process.env.PORT'] = '3000'
    // }

    // FIXME: Nuxt3.8 업데이트 후 오류 미발생으로 플러그인 제거
    // add ustra vite plugin
    // config.plugins.push(
    //   removeNodeDepsPlugin({
    //     enforce: 'pre',
    //     isServer: isServer,
    //   }),
    // )

    // watch node modules
    config.plugins.push(watchNodeModulesPlugin.vite(getFrameworkPackageNames()))
  })

  extendViteConfig(config => {
    config.optimizeDeps = core.assign({}, config.optimizeDeps)
    config.optimizeDeps.esbuildOptions = core.assign({}, config.optimizeDeps.esbuildOptions)

    config.optimizeDeps.esbuildOptions.define = {
      ...config.optimizeDeps.esbuildOptions.define,
      global: 'globalThis',
    }

    // FIXME: patch for nuxt 3.1.1 error
    // config.optimizeDeps.esbuildOptions.plugins = [
    //   ...(config.optimizeDeps.esbuildOptions.plugins || []),
    //   // NodeGlobalsPolyfillPlugin({
    //   //   process: true,
    //   //   buffer: true,
    //   // }),
    //   NodeModulesPolyfillPlugin(),
    // ]

    // ;(config.optimizeDeps.entries as string[]).push(resolve(__dirname, './build/entry'))
    // config.optimizeDeps.include.push(resolve(__dirname, './build/entry'))

    // @ts-ignore
    // config.build.rollupOptions.input = [config.build.rollupOptions.input, resolve(__dirname, './build/entry')]

    // add dependency optimization
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      '@refactorjs/http-proxy',
      // 'ant-path-matcher',
      '@howiefh/ant-path-matcher',
      'axios',
      'axios-retry',
      'base62x',
      'body-parser',
      'compression',
      'event-source-polyfill',
      'highlight.js/lib/common',
      'hookable',
      // 'micromatch',
      'uuid62',
      'uuid',
      // 'picomatch',
      // 'printj',
      'winston',
      'request-context',
      'serve-static',
      'consola',
      'markdown-it',
      'markdown-it-container',
      'markdown-it-deflist',
      'markdown-it-sub',
      'markdown-it-sup',
      'markdown-it-footnote',
      'markdown-it-emoji',
      'markdown-it-deflist',
      'markdown-it-ins',
      'markdown-it-highlightjs',
      'markdown-it-plantuml',
      'base-x',
      'qs',
      'cookie-universal',
      'crypto-js',
      'js-file-download',
      'queue-typescript',
      'event-source-polyfill',
      // 'monaco-editor',
      // 'monaco-editor-nls',
      'tippy.js',
      // 'sockjs-client',
      // 'nuxt-monaco-editor',
    ]

    config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude || []), ...getSsrNoExternalModule()]
  })

  nuxt.options.build.transpile.push(...getSsrNoExternalModule())
  // nuxt.options.build.transpile.push('sockjs-client')

  // @ts-ignore
  // nuxt.options.experimental = nuxt.options.experimental || {}
  // nuxt.options.experimental.viteNode = true
  // nuxt.options.experimental.externalVue = true

  // add build path
  // nuxt.options.app.buildAssetsDir = '/_ustra/'

  // enableVueRuntimeCompiler(nuxt)
  patchLodashModule(nuxt)
  // patchSocketjsClientModule(nuxt)
  optimizeBuild(options, nuxt)
}
