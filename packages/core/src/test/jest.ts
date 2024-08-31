import type { Config } from "@jest/types";
import path from "node:path";
import { FRAMEWORK_MODULE_DEFINITION } from "@moong/core/src/config/framework/modules";

/**
 * 프레임워크 개발 사용 ModuleNameMapper
 */
const FRAMEWORK_BASE_DIR = "../../../../framework";

const frameworkModuleNameMapper: { [key: string]: string | string[] } = {};
FRAMEWORK_MODULE_DEFINITION.forEach((def) => {
  const subModuleName = def.alias.split("/")[1];

  frameworkModuleNameMapper[`${def.alias}/(.*)`] = path.resolve(
    __dirname,
    `${FRAMEWORK_BASE_DIR}/${subModuleName}/src/$1`
  );
  frameworkModuleNameMapper[`^${def.alias}$`] = path.resolve(
    __dirname,
    `${FRAMEWORK_BASE_DIR}/${subModuleName}/src`
  );
});

const option: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  // testRegex: '\\.test\\.ts$',
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: frameworkModuleNameMapper,
  modulePaths: ["<rootDir>/__tests__"],
  rootDir: "",
  globals: {
    "ts-jest": {
      diagnostics: true,
      isolatedModules: true,
    },
  },
  testTimeout: 20000,
  verbose: true,
};

export { option as devJestOption };
