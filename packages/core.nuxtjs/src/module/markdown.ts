import { Nuxt } from '@nuxt/schema'
import { addComponent } from '#ustra/nuxt/kit'
import { extendViteConfig } from '@nuxt/kit'
import { NuxtAppProps } from '../config/nuxt-app-props'
import markdowPlugin from './build/plugins/markdown'

export const markdown = (options: NuxtAppProps, nuxt: Nuxt) => {
  if (options.nuxt.markdown.enabled) {
    // add markdown plugin
    extendViteConfig(config => {
      config.plugins.push(markdowPlugin.vite())
    })

    // add markdown component
    addComponent({
      name: 'UMarkdownViewer',
      filePath: '#ustra/nuxt/components/markdown/u-markdown-viewer',
    })
  }
}
