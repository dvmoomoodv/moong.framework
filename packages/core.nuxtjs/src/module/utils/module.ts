// import { Nuxt } from '@nuxt/schema'
// import { installModule, requireModule, importModule } from '@nuxt/kit'

// export class ModuleUtils {
//   /**
//    * 특정 모듈이 존재하는지 여부를 검사
//    * @param nuxt
//    * @param moduleName 모듈 명
//    * @returns 존재 여부
//    */
//   existsModule(nuxt: Nuxt, moduleName: string) {
//     if (!nuxt.options.modules) {
//       return false
//     }

//     nuxt.options.modules.some(module => {
//       if (Array.isArray(module)) {
//         return module[0] === moduleName
//       }

//       return module === moduleName
//     })
//   }

//   /**
//    * 모듈 미존재 시 install
//    * @param nuxt Nuxt build context
//    * @param moduleName module 명
//    * @param option module option
//    */
//   async installModuleWhenNotExists(nuxt: Nuxt, moduleName: string, option: any = {}) {
//     if (!this.existsModule(nuxt, moduleName)) {
//       await installModule(moduleName, option)
//     }
//   }
// }

// const instance = new ModuleUtils()
// export default instance
