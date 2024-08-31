import { useNuxt } from "@nuxt/kit";
import { useUstra } from "./plugin";
import { symlinkSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "pathe";
import {
  FrameworkModuleDefinition,
  FRAMEWORK_MODULE_DEFINITION,
} from "#moong/core/config/framework/modules";

/**
 * Framework link dir 조회
 * @returns
 */
export const getFrameworkLinkDir = () => {
  // return resolve(useNuxt().options.srcDir, './.ustra')
  const moduleDir = resolve(__dirname, "../../../");
  return moduleDir;
};

/**
 * framework symlink 생성
 */
export const createSymlink = () => {
  const $ustra = useUstra();

  const createLink = () => {
    const linkPath = getFrameworkLinkDir();

    if (!existsSync(linkPath)) {
      symlinkSync($ustra.nuxt._build.frameworkDirPath, linkPath, "junction");
    }
  };

  useNuxt().hook("build:before", () => createLink());
  createLink();
};

/**
 * 프레임워크 모듈의 경로 조회
 * @param module
 * @returns
 */
export const getFrameowrkModuleDirPath = (
  module: FrameworkModuleDefinition
) => {
  let modulePath = null;
  const moduleDir = resolve(__dirname, "../../../");

  if (moduleDir.includes("node_modules")) {
    modulePath = resolve(moduleDir, "../" + module.moduleName, "src");
  } else {
    modulePath = resolve(moduleDir, module.sourcePath);
  }

  return modulePath;
  // return join(getFrameworkLinkDir(), module.sourcePath)
};

/**
 * 프레임워크 모듈 경로 조회
 * @param modulePath
 * @returns
 */
export const resolveFrameworkModulePath = (modulePath: string) => {
  modulePath = modulePath.replace(/\\/g, "/");

  for (const frameworkModule of FRAMEWORK_MODULE_DEFINITION) {
    if (modulePath.startsWith(frameworkModule.alias + "/")) {
      const moduleSubPath = modulePath.substring(frameworkModule.alias.length);

      return resolve(
        resolve(
          getFrameworkLinkDir() +
            "/" +
            frameworkModule.alias.split("/")[1] +
            "/src"
        ),
        "./" + moduleSubPath
      );
    }
  }

  return modulePath;
};
