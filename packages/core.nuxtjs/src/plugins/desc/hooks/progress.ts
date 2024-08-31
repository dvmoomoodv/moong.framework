/**
 * progress hook 정의
 * @exports {@link UstraProgressHookInfo}
 * @packageDocumentation
 */

/**
 * 프로그레스 hook 정보
 */
export interface UstraProgressHookInfo {
  /**
   * 유형
   *  - progress : 진행율 표시
   *  - loading : 로딩바 표시
   */
  type: 'progress' | 'loading'

  /**
   * 표시 여부
   */
  show?: boolean

  /**
   * progress rate [0-100]
   */
  progressRate?: number

  /**
   * cancel token
   */
  cancelToken?: any
}
