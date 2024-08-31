export interface ErrorOptions {
  /**
   * Error 핸들링 유형
   * - logging: 로깅 처리
   * - redirect : Error 화면으로 이동
   */
  handlerType: 'logging' | 'redirect'

  /**
   * redirect 시 상태 코드 값
   * @default 500
   */
  statusCode?: number
}
