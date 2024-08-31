/**
 * 프레임워크 모듈 정의
 * @exports FrameworkModuleDefinition
 * @exports FRAMEWORK_MODULE_DEFINITION
 * @packageDocumentation
 */

/**
 * 프레임워크 모듈 정의
 */
export interface FrameworkModuleDefinition {
  /**
   * 모듈 명
   */
  moduleName: string

  /**
   * 참조 별칭
   */
  alias: string

  /**
   * type import 여부
   */
  requiredImport: boolean

  /**
   * type 정의 목록
   */
  typeDefinitions: string[]

  /**
   * 소스 단위 작업 시의 경로
   */
  sourcePath: string

  /**
   * 의존 모듈 목록
   */
  dependencyModuleNames: string[]

  /**
   * 빌드 가능 여부
   */
  canBuild: boolean
}

export const FRAMEWORK_MODULE_DEFINITION: Array<Readonly<FrameworkModuleDefinition>> = [
  {
    moduleName: '@ustra/core',
    alias: '#ustra/core',
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: 'core/src',
    dependencyModuleNames: ['@ustra/types'],
    canBuild: true,
  },
  {
    moduleName: '@ustra/nuxt',
    alias: '#ustra/nuxt',
    requiredImport: true,
    typeDefinitions: ['@ustra/nuxt/types'],
    sourcePath: 'nuxt/src',
    dependencyModuleNames: ['@ustra/types', '@ustra/core'],
    canBuild: true,
  },
  {
    moduleName: '@ustra/nuxt-vuetify',
    alias: '#ustra/nuxt-vuetify',
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: 'nuxt-vuetify/src',
    dependencyModuleNames: ['@ustra/types', '@ustra/core', '@ustra/nuxt'],
    canBuild: true,
  },
  {
    moduleName: '@ustra/nuxt-wijmo',
    alias: '#ustra/nuxt-wijmo',
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: 'nuxt-wijmo/src',
    dependencyModuleNames: ['@ustra/types', '@ustra/core', '@ustra/nuxt', '@ustra/nuxt-vuetify'],
    canBuild: true,
  },
  {
    moduleName: '@ustra/nuxt-dx',
    alias: '#ustra/nuxt-dx',
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: 'nuxt-dx/src',
    dependencyModuleNames: ['@ustra/types', '@ustra/core', '@ustra/nuxt'],
    canBuild: false,
  },
  {
    moduleName: '@ustra/nuxt-ckeditor5',
    alias: '#ustra/nuxt-ckeditor5',
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: 'nuxt-ckeditor5/src',
    dependencyModuleNames: ['@ustra/types', '@ustra/core', '@ustra/nuxt'],
    canBuild: true,
  },
  {
    moduleName: '@ustra/h3',
    alias: '#ustra/h3',
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: 'h3/src',
    dependencyModuleNames: ['@ustra/types', '@ustra/core'],
    canBuild: true,
  },
  {
    moduleName: '@ustra/types',
    alias: '#ustra/types',
    requiredImport: false,
    typeDefinitions: [],
    sourcePath: null,
    dependencyModuleNames: [],
    canBuild: false,
  },
]

/**
 * SSR에 external 하지 않을 모듈 조회
 * @returns
 */
export const getSsrNoExternalModule = () => {
  return FRAMEWORK_MODULE_DEFINITION.flatMap(def => {
    return [def.moduleName, def.alias]
  })
}

/**
 * 프레임워크 패키지 명
 * @returns
 */
export const getFrameworkPackageNames = () => {
  return FRAMEWORK_MODULE_DEFINITION.filter(m => m.canBuild).map(m => m.moduleName)
}
