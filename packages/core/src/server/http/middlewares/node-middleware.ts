/**
 * Node 미들 웨어 옵션
 */
export interface NodeMiddleWareOption {
  /**
   * 활성화 여부
   */
  enabled: boolean

  /**
   * 제외 URL 패턴
   */
  excludeUrlPatterns?: string[]

  /**
   * 포함 URL 패턴
   */
  includeUrlPatterns?: string[]
}
