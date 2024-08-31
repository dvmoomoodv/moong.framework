export interface PiniaOptions extends Record<string, any> {
  /**
   * 활성화 여부
   * @default true
   */
  enabled?: boolean

  /**
   * auto import 변수 목록
   * @default "['defineStore', 'storeToRefs']"
   */
  autoImports?: string[]
}
