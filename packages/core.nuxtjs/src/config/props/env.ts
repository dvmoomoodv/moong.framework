export interface EnvOptions {
  /**
   * client에 숨길 property 목록 작성
   * ```typescript
   * ['app.profile', 'app.processPath']
   * ```
   */
  secureClientProps?: Array<string>

  /**
   * 통신 보안 키
   */
  secret?: string
}
