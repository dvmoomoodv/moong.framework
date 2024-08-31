export interface VueuseOptions extends Record<string, any> {
  /**
   * 활성화 여부
   * @default true
   */
  enabled?: boolean

  /**
   * auto import 여부
   * @default true
   */
  autoImports?: boolean

  /**
   * add ssr handler
   */
  ssrHandlers?: boolean
}
