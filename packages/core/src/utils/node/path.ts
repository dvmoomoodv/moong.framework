/**
 * NODE Path 관련 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 * @server
 */
import path from 'node:path'
import fs from 'node:fs'
import { relative, join } from 'pathe'

export class Path {
  /**
   * 절대 경로 생성
   * @param targetPath 대상 경로
   * @param basePath 기준 경로
   */
  getAbsolutePath(targetPath: string, basePath?: string): string {
    // basePath = basePath || process.cwd()

    if (path.isAbsolute(targetPath)) {
      return targetPath
    }

    if (this.isRelativePath(targetPath)) {
      return path.resolve(basePath, targetPath)
    }

    return join(basePath, targetPath)
  }

  /**
   * 상대 경로여부 확인
   * @param path 경로
   * @returns 상대 경로 여부
   */
  isRelativePath(path: string) {
    return path.startsWith('.')
  }

  /**
   * 대상 경로의 참조 경로를 반환
   * @param basePath 기준 경로
   * @param targetPath 대상 경로
   */
  toRelativePath(basePath: string, targetPath: string) {
    return relative(basePath, targetPath)
  }
}

const instance = new Path()
export default instance
