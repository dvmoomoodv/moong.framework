/**
 * static 제공 디렉토리 옵션
 */
export type StaticServeModuleOptions = StaticServeOptions[]

export interface StaticServeOptions {
  /**
   * 제공 경로
   * @example '/resources'
   */
  path: string

  /**
   * 제공 디렉토리
   */
  serveDir: string

  /**
   * static 빌드 시, 리소스 복사 여부
   * @default ture
   */
  copyResource?: boolean
}
