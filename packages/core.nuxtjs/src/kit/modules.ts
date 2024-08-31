import { useNuxt, installModule } from '@nuxt/kit'

/**
 * 특정 모듈이 존재하는지 여부를 검사
 * @param nuxt
 * @param moduleName 모듈 명
 * @returns 존재 여부
 */
export const existsModule = (moduleName: string) => {
  const nuxt = useNuxt()
  if (!nuxt.options.modules) {
    return false
  }

  nuxt.options.modules.some(module => {
    if (Array.isArray(module)) {
      return module[0] === moduleName
    }

    return module === moduleName
  })
}

/**
 * 모듈 미존재 시 install
 * @param nuxt Nuxt build context
 * @param moduleName module 명
 * @param option module option
 */
export const installModuleIfNotExists = async (moduleName: string, option: any = {}) => {
  if (!existsModule(moduleName)) {
    await installModule(moduleName, option)
  }
}
