// import { VuetifyOptions as OriginVuetifyOptions } from 'vuetify'

export interface VuetifyOptions extends Record<string, any> {
  /**
   * 활성화 여부
   * @default false
   */
  enabled?: boolean

  /**
   * datepicker 사용 여부
   * @see https://vue3datepicker.com/
   */
  datepicker?: {
    enabled: boolean
  }

  /**
   * 샘플 설정
   */
  samples?: {
    /**
     * 샘플 활성화 여부
     * @default true
     */
    enabled?: boolean

    /**
     * Path URL
     * @default /samples/vuetify
     */
    path?: string

    /**
     * 추가 샘플 메뉴 정보
     */
    additionalMenus?: VuetifySampleMenuOptions[]

    /**
     * resource 복사 옵션
     */
    copyResource?: {
      /**
       * 활성화 여부
       * @default true
       */
      enabled?: boolean

      /**
       * overwrite 여부
       * @default true
       */
      overwrite?: boolean

      /**
       * 대상 디렉토리 경로
       * @default './components/ustra'
       */
      targetDirPath?: string
    }
  }

  // /**
  //  * materail design icons 설정
  //  * @deprecated use ustra.nuxt.vuetify.icons.mdi
  //  */
  // mdi?: {
  //   /**
  //    * 활성화 여부
  //    * @default true
  //    */
  //   enabled?: boolean
  // }

  // /**
  //  * 아이콘 설정
  //  */
  // icons?: {
  //   /**
  //    * material design icons
  //    * @default true
  //    */
  //   mdi?: boolean

  //   /**
  //    * font awsome icons
  //    * @default false
  //    */
  //   fa?:
  //     | boolean
  //     | {
  //         /**
  //          * 컴포넌트 등록 여부
  //          */
  //         registerComponent?: boolean
  //       }

  //   /**
  //    * CDN 사용 여부
  //    */
  //   useCdn?: boolean
  // }

  // /**
  //  * 스타일 설정
  //  * @default true
  //  */
  // styles?:
  //   | true
  //   | 'none'
  //   | 'expose'
  //   | 'sass'
  //   | {
  //       configFile: string
  //     }

  // /**
  //  * treeshaking
  //  * @default false
  //  */
  // treeshaking?: boolean

  // /**
  //  * auto import
  //  * @default true
  //  */
  // autoImport?: boolean

  // /**
  //  * vuetify options
  //  * @see https://next.vuetifyjs.com/en/features/global-configuration/
  //  * @see https://next.vuetifyjs.com/en/features/icon-fonts/
  //  * @see https://next.vuetifyjs.com/en/features/internationalization/
  //  * @see https://next.vuetifyjs.com/en/features/theme/
  //  * @see https://next.vuetifyjs.com/en/features/treeshaking/
  //  */
  // // options?: OriginVuetifyOptions
}
export interface VuetifySampleMenuOptions extends Record<string, any> {
  /**
   * 제목
   */
  title: string

  /**
   * 컴포넌트 경로
   */
  componentPath?: string

  /**
   * 아이콘
   */
  icon?: string

  /**
   * 하위 메뉴 목록
   */
  items?: VuetifySampleMenuOptions[]
}
