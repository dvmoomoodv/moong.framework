/**
 * 캐시 옵션
 */
export interface CacheOptions {
  ssr?: SsrCacheOptions
}

/**
 * SSR 전용 캐시 옵션
 */
export interface SsrCacheOptions {
  /**
   * 활성화 여부
   * @default false
   */
  enabled?: boolean

  /**
   * 저장 옵션
   */
  store?: {
    /**
     * 저장소 유형
     * @default ''
     */
    type?: string

    /**
     * 최대 저장 값
     * @default 500
     */
    max?: number

    /**
     * 유효시간
     * @default 10000
     */
    ttl?: number
  }

  /**
   * page 시작 prefix
   * main화면만 캐시할 경우, '/'로 설정
   */
  pages?: string[]

  /**
   * 키 설정 function
   * - route : 요청경로
   * - headers : 헤더 객체
   * - event : H3Event 객체
   */
  key?: ((route: string, headers: any, event: any) => string | Promise<string>) | string
}
