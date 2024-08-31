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
  moduleName: string;

  /**
   * 참조 별칭
   */
  alias: string;

  /**
   * type import 여부
   */
  requiredImport: boolean;

  /**
   * type 정의 목록
   */
  typeDefinitions: string[];

  /**
   * 소스 단위 작업 시의 경로
   */
  sourcePath: string;

  /**
   * 의존 모듈 목록
   */
  dependencyModuleNames: string[];

  /**
   * 빌드 가능 여부
   */
  canBuild: boolean;
}

export const FRAMEWORK_MODULE_DEFINITION: Array<
  Readonly<FrameworkModuleDefinition>
> = [
  {
    moduleName: "@moong/core",
    alias: "#moong/core",
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: "core/src",
    dependencyModuleNames: ["@moong/types"],
    canBuild: true,
  },
  {
    moduleName: "@moong/nuxt",
    alias: "#moong/nuxt",
    requiredImport: true,
    typeDefinitions: ["@moong/nuxt/types"],
    sourcePath: "nuxt/src",
    dependencyModuleNames: ["@moong/types", "@moong/core"],
    canBuild: true,
  },
  {
    moduleName: "@moong/nuxt-vuetify",
    alias: "#moong/nuxt-vuetify",
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: "nuxt-vuetify/src",
    dependencyModuleNames: ["@moong/types", "@moong/core", "@moong/nuxt"],
    canBuild: true,
  },
  {
    moduleName: "@moong/nuxt-wijmo",
    alias: "#moong/nuxt-wijmo",
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: "nuxt-wijmo/src",
    dependencyModuleNames: [
      "@moong/types",
      "@moong/core",
      "@moong/nuxt",
      "@moong/nuxt-vuetify",
    ],
    canBuild: true,
  },
  {
    moduleName: "@moong/nuxt-dx",
    alias: "#moong/nuxt-dx",
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: "nuxt-dx/src",
    dependencyModuleNames: ["@moong/types", "@moong/core", "@moong/nuxt"],
    canBuild: false,
  },
  {
    moduleName: "@moong/nuxt-ckeditor5",
    alias: "#moong/nuxt-ckeditor5",
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: "nuxt-ckeditor5/src",
    dependencyModuleNames: ["@moong/types", "@moong/core", "@moong/nuxt"],
    canBuild: true,
  },
  {
    moduleName: "@moong/h3",
    alias: "#moong/h3",
    requiredImport: true,
    typeDefinitions: [],
    sourcePath: "h3/src",
    dependencyModuleNames: ["@moong/types", "@moong/core"],
    canBuild: true,
  },
  {
    moduleName: "@moong/types",
    alias: "#moong/types",
    requiredImport: false,
    typeDefinitions: [],
    sourcePath: null,
    dependencyModuleNames: [],
    canBuild: false,
  },
];

/**
 * SSR에 external 하지 않을 모듈 조회
 * @returns
 */
export const getSsrNoExternalModule = () => {
  return FRAMEWORK_MODULE_DEFINITION.flatMap((def) => {
    return [def.moduleName, def.alias];
  });
};

/**
 * 프레임워크 패키지 명
 * @returns
 */
export const getFrameworkPackageNames = () => {
  return FRAMEWORK_MODULE_DEFINITION.filter((m) => m.canBuild).map(
    (m) => m.moduleName
  );
};
