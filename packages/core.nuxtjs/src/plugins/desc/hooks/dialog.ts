/**
 * dialog hook 정의
 * @exports {@link UstraDialogHookInfo}
 * @packageDocumentation
 */

/**
 * dialog hook 정보
 */
export interface UstraDialogHookInfo extends Record<string, any> {
  /**
   * 유형
   *  - alert
   *  - confirm
   *  - toast
   */
  type: 'alert' | 'confirm' | 'toast'

  /**
   * 노출 메시지
   */
  message: string

  /**
   * 제목
   */
  title?: string

  /**
   * display time
   */
  displayTime?: number

  /**
   * close callback function
   */
  closeCallback?: Function
}
