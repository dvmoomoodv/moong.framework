/**
 * UI 옵션
 */
export interface UiOptions extends Record<string, any> {
  /**
   * 기본 폰트 사용 여부
   * @default true
   */
  useDefaultFont?: boolean

  /**
   * dialog function을 hook 기반 메소드로 변경
   * @default true
   */
  replaceDialogFunctions?: boolean

  /**
   * page 이동 시 loading progress hook 호출 여부
   * @default true
   */
  callPageLoadingProgressHook?: boolean

  /**
   * 기본 favicon 사용 여부
   * @defualt true
   */
  useDefaultFavicon?: boolean
}
