/**
 * 프레임워크 모듈 유틸리티
 * @packageDocumentation
 */
import { FRAMEWORK_MODULE_DEFINITION } from "./modules";
import pathUtils from "../../utils/node/path";
import fileUtils from "../../utils/node/file";
import moduleUtils from "../../utils/node/module";
import coreUtils from "../../utils/core";
import { logger } from "../../";
import { resolve, join } from "pathe";
import { existsSync } from "node:fs";

export class FrameworkSupport {
  /**
   * 프레임워크 모듈의 alias를 조회
   * @param baseDir 기준 directory 경로
   */
  getModuleAlias(baseDir: string = undefined) {
    if (process.env.BUILD_ENV !== "prod") {
      return {};
    }

    baseDir = baseDir || process.cwd();
    const modules = {};
    FRAMEWORK_MODULE_DEFINITION.filter((def) => def.requiredImport).forEach(
      (def) => {
        const modulePath = moduleUtils.findNodeModuleDirPath(
          baseDir,
          def.moduleName
        );

        if (!modulePath) {
          logger.warn(`cannot find module path : ${def.moduleName}`);
          return [];
        }

        // modules[def.moduleName] = modulePath
        modules[def.alias] = resolve(modulePath, "src");
      }
    );

    return modules;
  }

  /**
   * 프레임워크 모듈 정보 조회
   * @param moduleName 모듈 명
   */
  getModuleInfo(moduleName: string) {
    return FRAMEWORK_MODULE_DEFINITION.find(
      (module) => module.moduleName === moduleName
    );
  }

  /**
   * package.json 정보 조회
   * @param baseDir 기준 디렉토리
   * @param thrown 파일이 없을 경우, 예외 발생여부
   */
  parsePackageJson(baseDir: string, thrown: boolean = true) {
    return moduleUtils.parsePackageJson(baseDir, thrown);
  }

  /**
   * package.json write
   * @param baseDir 기준 디렉토리
   * @param content 내용
   */
  writePackageJson(baseDir: string, content: any) {
    moduleUtils.writePackageJson(baseDir, content);
  }

  /**
   * 사용 중인 프레임워크 모듈 목록을 조회
   * @param baseDir 기준 디렉토리
   */
  getUseFrameworkModules(baseDir: string) {
    const useModuleSet = new Set<string>();
    const packageInfo = this.parsePackageJson(baseDir);
    const dependencies = coreUtils.deepMerge(
      {},
      packageInfo.dependencies || {},
      packageInfo.devDependencies || {}
    );

    FRAMEWORK_MODULE_DEFINITION.filter((def) => {
      return !!dependencies[def.moduleName];
    }).forEach((def) => {
      useModuleSet.add(def.moduleName);
      def.dependencyModuleNames.forEach((d) => useModuleSet.add(d));
    });

    return useModuleSet;
  }

  /**
   * 프레임워크 경로로 부터 모듈 경로를 조회
   * @param frameworkDir 프레임워크 디렉토리
   * @param moduleName 모듈 명
   */
  getModulePathFromFrameworkPath(frameworkDir: string, moduleName: string) {
    if (frameworkDir.includes("node_modules")) {
      return resolve(frameworkDir, "../" + moduleName);
    } else {
      return resolve(frameworkDir, "./" + moduleName.split("/")[1]);
    }
  }

  /**
   * 설치가 필요한 dev dependencies 목록을 추출한다.
   * @param baseDir 기준 디렉토리
   * @param frameworkDir 프레임워크 경로
   */
  getAllDevDependencies(baseDir: string, frameworkDir: string) {
    const allDevDependencies = {};

    this.getUseFrameworkModules(baseDir).forEach((moduleName) => {
      const moduleDir = this.getModulePathFromFrameworkPath(
        frameworkDir,
        moduleName
      );
      const packageInfo = this.parsePackageJson(moduleDir, false);

      if (!packageInfo) {
        logger.warn("cannot find module : ", moduleName);
        return;
      }

      const devDependencies = packageInfo.devDependencies || {};
      for (const key of Object.keys(devDependencies)) {
        allDevDependencies[key] = devDependencies[key];
      }
    });

    return Object.keys(allDevDependencies).map((moduleName) => {
      return `${moduleName}@${allDevDependencies[moduleName]}`;
    });
  }

  /**
   * 모든 템플릿 목록을 조회
   * @param frameworkDir 프레임워크가 위치하는 디렉토리
   * @param moduleName 모듈 명
   */
  getTemplateList(baseDir: string, frameworkDir: string) {
    const templates: {
      dirPath: string;
      templateName: string;
      templateMessage: string;
      templatePostScript: string;
      packageInfo: any;
    }[] = [];
    this.getUseFrameworkModules(baseDir).forEach((moduleName) => {
      const moduleDirPath = this.getModulePathFromFrameworkPath(
        frameworkDir,
        moduleName
      );
      const templateDirPath = resolve(moduleDirPath, "__templates__");

      if (!existsSync(templateDirPath)) {
        return;
      }

      fileUtils.getDirectoryFiles(templateDirPath, true).forEach((dir) => {
        const templateInfoPath = join(
          templateDirPath,
          dir.name,
          "template-info.json"
        );

        if (!existsSync(templateInfoPath)) {
          return;
        }

        const sharedTemplateInfoPath = join(
          this.getModulePathFromFrameworkPath(frameworkDir, "@moong/core"),
          "__templates__",
          "shared",
          "template-info.json"
        );
        let sharedTemplateInfo = {};

        if (existsSync(sharedTemplateInfoPath)) {
          sharedTemplateInfo = JSON.parse(
            fileUtils.readTextFile(sharedTemplateInfoPath)
          );
        }

        const templateInfo = JSON.parse(
          fileUtils.readTextFile(templateInfoPath)
        );
        const templateName = templateInfo.name;
        const templateMessage = templateInfo.message;
        const templatePostScript = templateInfo.postScript
          ? resolve(join(templateDirPath, dir.name), templateInfo.postScript)
          : null;
        const packageInfo = this.parsePackageJson(baseDir);

        delete templateInfo.name;
        delete templateInfo.message;
        delete templateInfo.postScript;

        templates.push({
          templateName,
          templateMessage,
          templatePostScript,
          dirPath: join(templateDirPath, dir.name),
          packageInfo: coreUtils.deepMerge(
            {},
            sharedTemplateInfo,
            templateInfo,
            packageInfo
          ),
        });
      });
    });

    return templates;
  }
}
const instance = new FrameworkSupport();
export default instance;
