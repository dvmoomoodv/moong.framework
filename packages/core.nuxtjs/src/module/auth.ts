import { existsSync } from 'node:fs'
import { Nuxt } from '@nuxt/schema'
import { createResolver, addTemplate } from '@nuxt/kit'
import { resolveFrameworkModulePath } from '#ustra/nuxt/kit'
import { NuxtAppProps } from '../config/nuxt-app-props'

/**
 * 커스톰 인증 Validator 처리
 * @param options
 * @param nuxt
 */
async function registerCustomAuthValidator(options: NuxtAppProps, nuxt: Nuxt) {
  const checkerModuleAlias = '~/app/ustra.auth.validator.ts'
  const { resolvePath } = createResolver(nuxt.options.rootDir)
  const checkerModulePath = await resolvePath(checkerModuleAlias, {
    alias: nuxt.options.alias,
  })

  if (options.auth.enabled && existsSync(checkerModulePath)) {
    addTemplate({
      filename: 'ustra/ustra.auth.validator.ts',
      getContents() {
        return `
import customValidator from '${checkerModuleAlias}'
export default customValidator
        `
      },
    })
  } else {
    addTemplate({
      filename: 'ustra/ustra.auth.validator.ts',
      getContents() {
        return `
export default null
        `
      },
    })
  }
}

export const auth = async (options: NuxtAppProps, nuxt: Nuxt) => {
  await registerCustomAuthValidator(options, nuxt)
}
