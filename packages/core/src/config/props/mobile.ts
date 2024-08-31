/**
 * mobile option
 */
export interface Mobile extends Record<string, any> {
  /**
   * 모바일 연계 기능 활성화 여부
   */
  enabled?: boolean

  /**
   * hybrid APP 설정
   */
  hybrid?: {
    /**
     * native agent 추가 검증 값
     */
    nativeAgent: {
      /**
       * 안드로이드
       */
      android: string

      /**
       * iOS
       */
      ios: string
    }
    /**
     * 모바일 브릿지 설정
     */
    bridge?: {
      /**
       * 사용 여부
       */
      enabled?: boolean

      /**
       * 로깅 사용 여부
       */
      useLogging?: boolean

      /**
       * 토큰 검증 사용여부
       */
      useTokenSecurity?: boolean

      /**
       * 고정 브릿지 명
       */
      staticBridgeNames?: {
        /**
         * 로드 완료 통지 브릿지 명
         */
        notifyLoaded?: string

        /**
         * 토스트 호출 브릿지 명
         */
        toast?: string

        /**
         * 현재 시간 가져오는 브릿지
         */
        currentTime?: string

        /**
         * 스토리지 연계 브릿지 명
         */
        storage?: string
      }
    }
  }
}
