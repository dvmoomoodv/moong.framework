/**
 * Utility Option
 */
export interface UtilityOptions extends Record<string, any> {
  /**
   * 미디어 쿼리 기능 설정
   */
  mediaQuery?: {
    /**
     * 사용 여부
     * @default true
     */
    enabled?: boolean

    /**
     * 통지 범위 설정
     * @default
     * ```
     *  {
     *   XS: '(max-width: 599.99px)',
     *   S: '(min-width: 600px) and (max-width: 959.99px)',
     *   M: '(min-width: 960px) and (max-width: 1279.99px)',
     *   L: '(min-width: 1280px)',
     * }```
     */
    breakPoitns?: Record<string, string>
  }
}
