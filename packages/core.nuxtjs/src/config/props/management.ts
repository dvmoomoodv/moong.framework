/**
 * 관리 기능 옵션
 */
export interface ManagementOptions {
  /**
   * 활성화 여부
   * @default false
   */
  enabled?: boolean

  /**
   * system api url prefix
   * @default '/api/system'
   */
  systemApiUrlPrefix?: string

  /**
   * 초기 데이터
   */
  initialData?: {
    /**
     * 활성화 여부
     * @default true
     */
    enabled?: boolean

    /**
     * 초기 데이터 조회 URL
     *  없을 경우, 초기 데이터 조회를 수행하지 않음.
     * @default /api/system/initializing-data.json
     */
    initialDataApiUrl?: string

    /**
     * 캐시 사용여부
     * @default true
     */
    useCache?: boolean
  }

  /**
   * UI 설정
   */
  ui?: {
    /**
     * 컴포넌트 유형
     * @default 'wijmo'
     */
    componentType?: 'devextreme' | 'wijmo' | 'vuetify'

    /**
     * 어플리케이션 타이틀
     */
    appTitle?: string

    /**
     * tab menu 설정
     */
    tabMenu?: {
      /**
       * 사용 여부
       * @defualt false
       */
      enabled?: boolean

      /**
       * 최대 오픈 가능 tab 수
       * @default 10
       */
      maximumTabNumbers?: number

      /**
       * tab메뉴 사용 시, URL의 직접 접속을 막는다.
       * @default { enabled: true, excludeUrlPatterns: []}
       */
      preventDirectConnectMenuUrl?:
        | boolean
        | {
            /**
             * 활성화 여부
             * @default true
             */
            enabled?: boolean

            /**
             * 제외 URL 패턴
             */
            excludeUrlPatterns?: string[]
          }
    }

    /**
     * Home 메뉴 표시 여부
     * @default true
     */
    displayHomeMenu?: boolean

    /**
     * 즐겨찾기 메뉴
     */
    favoriteMenu?: {
      /**
       * 즐겨 찾기 메뉴 사용 여부
       * @default true
       */
      enabled?: boolean

      /**
       * 항상 표시 여부
       * @default true
       */
      visibleAlways?: boolean

      /**
       * 기본 즐겨찾기 강조 여부
       * @default true
       */
      highlightDefault?: boolean
    }

    /**
     * 기본 페이지 설정
     */
    defaultPage?: {
      /**
       * 로그인 화면 설정
       */
      login?: {
        /**
         * 로그인 페이지 포함여부
         * @default true
         */
        include?: boolean

        /**
         * 로그인 화면 접속 경로
         * @default '/login'
         */
        path?: string
      }

      /**
       * 레이아웃
       */
      layout?: {
        /**
         * 레이아웃 포함 여부
         * @default true
         */
        include?: boolean

        /**
         * 레이아웃 명
         * @default ustra
         */
        layoutName?: string | false
      }

      /**
       * 메인 화면
       */
      main?: {
        /**
         * 화면 포함 여부
         * @default true
         */
        include?: boolean

        /**
         * 경로
         * @default "/main"
         */
        path?: string
      }

      system?: {
        /**
         * 시스템 화면 포함여부
         * @default true
         */
        include?: boolean

        /**
         * 경로 prefix
         * @default "/system"
         */
        pathPrefix?: string

        /**
         * resource 복사 옵션
         */
        copyResource?: {
          /**
           * 활성화 여부
           * @default false
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
    }
  }

  /**
   * 보안 설정
   */
  security?: {
    /**
     * 패스워드 설정
     */
    password?: {
      /**
       * 패스워드 생성 정책 HTML 가이드
       * @default '비밀번호 길이는 <b>10~16 자</b>로 설정하여야 하며, 아이디와 비밀번호는 동일할 수 없습니다.<br />동일한 문자는 3자 이상 사용이 불가하며, 연속된 문자 (예:abc, 123 등) 또한 3자리 이상 사용이 불가능합니다.'
       */
      creationPolicyHtmlText?: string
    }
  }
}
