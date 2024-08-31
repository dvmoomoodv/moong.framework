import path from "path";
import fs from "node:fs";
import { AppProps, Profile } from "../props";
import { env } from "../env";
import { load as yamlLoad, read as yamlRead } from "node-yaml-config";
import core from "#moong/core/utils/core";
import pathUtils from "#moong/core/utils/node/path";
import { defaultProps } from "../props/props-utils";
import { propsStore } from "../props-store";

export class ConfigLoader<T extends AppProps = AppProps> {
  private propertyFileComparator(
    _profileName: string
  ): (a: Array<string>, b: Array<string>) => number {
    return (a, b) => {
      const isSpecificProfileFile = (fileName: Array<string>): boolean => {
        return fileName[0] !== "*";
      };

      let score1 = 0;
      let score2 = 0;

      const pathInfo1 = path.parse(a[1]);
      const pathInfo2 = path.parse(b[1]);

      score1 += isSpecificProfileFile(a) ? 1 << 2 : 0;
      score2 += isSpecificProfileFile(b) ? 1 << 2 : 0;

      score1 += pathInfo1.name.localeCompare(pathInfo2.name);
      score2 += pathInfo2.name.localeCompare(pathInfo1.name);

      return score1 - score2;
    };
  }

  /**
   * Configuration Property 로드
   * @param appProps Application 프로퍼티
   * @param storeProperty 프로퍼티 저장 여부
   * @returns 최종 프로퍼티
   */
  loadConfigProperties(appProps: Partial<T>, storeProperty: boolean = true): T {
    appProps = appProps || {};

    const defaultConfig = this.getDefaultProps(appProps);
    let yamlConfig = null;
    const configPath =
      appProps?.app?.configDirPath || defaultConfig.app.configDirPath;

    if (configPath) {
      let configDirPath = pathUtils.getAbsolutePath(
        configPath,
        appProps?.app?.processPath || defaultConfig.app.processPath
      );
      yamlConfig = this.loadYamlConfig(
        configDirPath,
        env.getProfile(appProps?.app?.profile || defaultConfig.app.profile)
      );

      console.log(
        "load yaml config profile:",
        env.getProfile(appProps?.app?.profile || defaultConfig.app.profile),
        yamlConfig
      );
    }

    const finalConfig = core.deepMerge(
      {},
      defaultConfig,
      appProps,
      yamlConfig
    ) as T;

    if (storeProperty) {
      propsStore.setProperties(finalConfig);
    }

    return finalConfig;
  }

  /**
   * 기본 설정 조회
   * @param appProps
   */
  protected getDefaultProps(appProps: Partial<T>) {
    return defaultProps(appProps);
  }

  /**
   * Loads yaml config
   * @template T
   * @param configDirPath config directory path
   * @param [profile] current profile
   * @returns yaml config
   */
  loadYamlConfig<T>(configDirPath: string, profile?: Profile): T {
    const profileName = env.propertyProfileName(profile);

    const files = this.getYamlFiles(configDirPath, profileName);

    const loadedResults: Array<T> = [];

    files.forEach((file) => {
      if (file[0] === "*") {
        const result = yamlLoad(file[1], profileName) as T;

        if (result) {
          loadedResults.push(result);
        }
      } else {
        const result = yamlRead(file[1]) as T;

        if (result) {
          loadedResults.push(result);
        }
      }
    });

    return core.deepMerge<any>({}, ...loadedResults);
  }

  /**
   * 로드할 yml 파일 추출
   * @param dirPath 디렉토리경로
   * @param profileName
   * @returns 파일 목록
   */
  private getYamlFiles(
    dirPath: string,
    profileName: string
  ): Array<Array<string>> {
    const files = fs.readdirSync(dirPath, "utf-8");
    const ymlFiles: Array<Array<string>> = [];

    files.forEach((v) => {
      const pathInfo = path.parse(v);

      if (pathInfo.ext === ".yml") {
        const approciateResult = this.isApprociateFileName(
          pathInfo.name,
          profileName
        );
        if (approciateResult === "Y") {
          ymlFiles.push(["*", path.join(dirPath, v)]);
        } else if (approciateResult === "P") {
          ymlFiles.push([profileName, path.join(dirPath, v)]);
        }
      }
    });

    ymlFiles.sort(this.propertyFileComparator(profileName));

    return ymlFiles;
  }

  /**
   * file name이 로드할 profile과 맞는지 확인
   * @param fileName file name
   * @param profileName profile name
   * @returns P:특정프로파일 Y:로드대상 N:로드대상아님
   */
  private isApprociateFileName(
    fileName: string,
    profileName: string
  ): "P" | "Y" | "N" {
    let isExistsProfileSuffix = false;

    for (const profile in Profile) {
      if (
        fileName.endsWith(`-${env.propertyProfileName(Profile[profile])}`) ||
        fileName.endsWith(`.${env.propertyProfileName(Profile[profile])}`)
      ) {
        isExistsProfileSuffix = true;
      }
    }

    if (!isExistsProfileSuffix) {
      return "Y";
    } else {
      return fileName.endsWith(`-${profileName}`) ||
        fileName.endsWith(`.${profileName}`)
        ? "P"
        : "N";
    }
  }
}

const instance = new ConfigLoader();
export { instance as configLoader };
