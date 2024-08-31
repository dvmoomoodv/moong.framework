/**
 * Router 옵션
 */
export interface RouterOptions extends Record<string, any> {
  /**
   * 확장 pages 디렉토리 목록 설정
   * @default []
   */
  extendPagesDirs?: string[]
}
