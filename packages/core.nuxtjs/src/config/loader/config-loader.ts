import { ConfigLoader } from '#ustra/core/config/loader/config-loader'
import { NuxtAppProps } from '#ustra/nuxt/config/nuxt-app-props'
import { defaultProps } from '../props/props-utils'

/**
 * Nuxt Configuration 로드
 */
export class NuxtConfigLoader extends ConfigLoader<NuxtAppProps> {
  protected getDefaultProps(appProps: Partial<NuxtAppProps>) {
    return defaultProps(appProps)
  }
}

const instance = new NuxtConfigLoader()
export { instance as nuxtConfigLoader }
