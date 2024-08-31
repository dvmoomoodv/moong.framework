import { defineNuxtModule } from '@nuxt/kit'
import { NuxtAppProps } from '#ustra/nuxt/config'
import { logger } from '#ustra/nuxt/utils/logger'
import { options } from './options'
import { plugins } from './plugins'
import { pluginsManagement } from './plugins-management'
import { build } from './build'
import { samples } from './samples'
import { components } from './components'
import { management } from './management'

export default defineNuxtModule<NuxtAppProps>({
  meta: {
    name: '@ustra/nuxt-vuetify',
    // compatibility: {
    //   nuxt: '^3.0.0',
    // },
  },
  async setup(definedOptions, nuxt) {
    logger.info('register @ustra/nuxt-vuetify module...')

    options(definedOptions, nuxt)
    // await plugins(definedOptions, nuxt)
    // plugins모듈 주석건으로 pluginsManagement 별도 생성
    pluginsManagement(definedOptions, nuxt)
    samples(definedOptions, nuxt)
    await build(definedOptions, nuxt)
    components(definedOptions, nuxt)
    management(definedOptions, nuxt)
  },
})
