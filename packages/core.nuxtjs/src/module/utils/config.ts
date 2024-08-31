/**
 * Configuation 관련 모듈 유틸리티
 * @exports {@link Config}
 * @packageDocumentation
 */
import { NuxtAppProps, Profile } from '#ustra/nuxt/config'
import { core, objects } from '#ustra/core/utils'
import { env } from '#ustra/core/config/env'
import { resolve } from 'pathe'
import { existsSync } from 'node:fs'

/**
 * config 설정
 */
export class Config {
  /**
   * Profile별 nuxt properties 조회
   * @param appDirPath application directory path
   * @param profile profile
   */
  async getProfileNuxtAppProps(appDirPath: string, profile: Profile) {
    const profileName = env.getServerProfileName(profile)
    const beforeConfigEnv = process.env.CONFIG_ENV

    process.env.CONFIG_ENV = profileName

    try {
      const nuxtConfigPath = resolve(appDirPath, './nuxt.config.ts')
      if (!existsSync(nuxtConfigPath)) {
        return null
      }

      const nuxtConfig = await (await import(nuxtConfigPath)).default

      return nuxtConfig?.ustra
    } finally {
      process.env.CONFIG_ENV = beforeConfigEnv
    }
  }

  /**
   * client property를 제외한 public property 반환
   * @param options NuxtAppProps
   * @returns public property
   */
  getClientOptions(options: NuxtAppProps) {
    if (!options.nuxt.env.secureClientProps) {
      return options
    }

    const prop = core.deepMerge({}, options)

    for (const secureClientProp of options.nuxt.env.secureClientProps) {
      objects.deleteProperty(prop, secureClientProp)
    }

    return prop
  }
}

const instance = new Config()
export default instance
