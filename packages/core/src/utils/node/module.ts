/**
 * 모듈 관련 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 */
import * as pathe from 'pathe'
import fs from 'node:fs'
import fileUtils from './file'

export class Module {
  /**
   * package.json 정보 조회
   * @param baseDir 기준 디렉토리
   * @param thrown 파일이 없을 경우, 예외 발생여부
   */
  parsePackageJson(baseDir: string, thrown: boolean = true) {
    const packageJsonPath = pathe.resolve(baseDir, './package.json')

    if (!fs.existsSync(packageJsonPath)) {
      if (thrown) {
        throw new Error('cannot find package.json file..')
      }

      return null
    }

    return JSON.parse(fileUtils.readTextFile(packageJsonPath))
  }

  /**
   * package.json write
   * @param baseDir 기준 디렉토리
   * @param content 내용
   */
  writePackageJson(baseDir: string, content: any) {
    const packageJsonPath = pathe.resolve(baseDir, './package.json')

    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('cannot find package.json file..')
    }

    fileUtils.writeTextFile(packageJsonPath, JSON.stringify(content, null, 2))
  }

  /**
   * 현재 모듈의 version 정보 조회
   * @param baseDir 기준 디렉토리
   * @returns
   */
  getCurrentModuleVersion(baseDir: string) {
    baseDir = baseDir || process.cwd()

    let currentDir = baseDir
    while (!!currentDir && currentDir !== '/') {
      const packagePath = pathe.resolve(currentDir, './package.json')

      if (!fs.existsSync(packagePath)) {
        currentDir = pathe.resolve(currentDir, '..')
        continue
      }

      return this.parsePackageJson(currentDir, false)?.version
    }

    return null
  }

  /**
   * 노드 모듈 Directory Path 조회
   * @param basePath 기준 경로
   * @param moduleName 모듈 명
   * @param checkPackageJson package.json 확인 여부
   */
  findNodeModuleDirPath(basePath: string, moduleName: string, checkPackageJson = true) {
    basePath = basePath || process.cwd()

    let currentPath = basePath
    while (!!currentPath && currentPath !== '/') {
      const modulePath = pathe.resolve(currentPath, './node_modules/' + moduleName)

      if (!checkPackageJson && fs.existsSync(modulePath)) {
        return modulePath
      }

      const modulePackagePath = pathe.resolve(currentPath, './node_modules/' + moduleName + '/package.json')
      if (fs.existsSync(modulePackagePath)) {
        return modulePath
      }

      currentPath = pathe.resolve(currentPath, '..')
    }

    return null
  }
}

const instance = new Module()
export default instance
