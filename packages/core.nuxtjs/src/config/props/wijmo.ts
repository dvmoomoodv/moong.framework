export interface WijmoOptions extends Record<string, any> {
  /**
   * 활성화 여부
   * @default false
   */
  enabled?: boolean

  /**
   * 라이센스 키
   */
  licenseKey?: string

  /**
   * 추가 기능 설정
   */
  functions?: {
    /**
     * grid pdf export 기능 활성화 여부
     * @default false
     */
    gridPdf?: boolean
  }

  /**
   * 스타일 관련 설정
   */
  styles?: {
    [k: string]: any
    /**
     * css 사용 여부
     * @default true
     */
    useCss?: boolean

    /**
     * theme
     * @default light
     */
    theme?:
      | 'cerulean'
      | 'cleandark'
      | 'cleanlight'
      | 'cocoa'
      | 'coral'
      | 'cyborg'
      | 'dark'
      | 'darkly'
      | 'flatly'
      | 'grayscale'
      | 'highcontrast'
      | 'light'
      | 'material.amber-indigo'
      | 'material.indigo-orange'
      | 'material'
      | 'material.vars'
      | 'midnight'
      | 'minimal'
      | 'modern'
      | 'office'
      | 'organic'
      | 'paper'
      | 'simplex'
      | 'slate'
      | 'superhero'
      | 'trust'
      | 'zen'
      | 'material/material.amber-blue'
      | 'material/material.amber-cyan'
      | 'material/material.amber-deep_orange'
      | 'material/material.amber-deep_purple'
      | 'material/material.amber-green'
      | 'material/material.amber-indigo'
      | 'material/material.amber-light_blue'
      | 'material/material.amber-light_green'
      | 'material/material.amber-lime'
      | 'material/material.amber-orange'
      | 'material/material.amber-pink'
      | 'material/material.amber-purple'
      | 'material/material.amber-red'
      | 'material/material.amber-teal'
      | 'material/material.amber-yellow'
      | 'material/material.blue-amber'
      | 'material/material.blue-cyan'
      | 'material/material.blue-deep_orange'
      | 'material/material.blue-deep_purple'
      | 'material/material.blue-green'
      | 'material/material.blue-indigo'
      | 'material/material.blue-light_blue'
      | 'material/material.blue-light_green'
      | 'material/material.blue-lime'
      | 'material/material.blue-orange'
      | 'material/material.blue-pink'
      | 'material/material.blue-purple'
      | 'material/material.blue-red'
      | 'material/material.blue-teal'
      | 'material/material.blue-yellow'
      | 'material/material.blue_grey-amber'
      | 'material/material.blue_grey-blue'
      | 'material/material.blue_grey-cyan'
      | 'material/material.blue_grey-deep_orange'
      | 'material/material.blue_grey-deep_purple'
      | 'material/material.blue_grey-green'
      | 'material/material.blue_grey-indigo'
      | 'material/material.blue_grey-light_blue'
      | 'material/material.blue_grey-light_green'
      | 'material/material.blue_grey-lime'
      | 'material/material.blue_grey-orange'
      | 'material/material.blue_grey-pink'
      | 'material/material.blue_grey-purple'
      | 'material/material.blue_grey-red'
      | 'material/material.blue_grey-teal'
      | 'material/material.blue_grey-yellow'
      | 'material/material.brown-amber'
      | 'material/material.brown-blue'
      | 'material/material.brown-cyan'
      | 'material/material.brown-deep_orange'
      | 'material/material.brown-deep_purple'
      | 'material/material.brown-green'
      | 'material/material.brown-indigo'
      | 'material/material.brown-light_blue'
      | 'material/material.brown-light_green'
      | 'material/material.brown-lime'
      | 'material/material.brown-orange'
      | 'material/material.brown-pink'
      | 'material/material.brown-purple'
      | 'material/material.brown-red'
      | 'material/material.brown-teal'
      | 'material/material.brown-yellow'
      | 'material/material.cyan-amber'
      | 'material/material.cyan-blue'
      | 'material/material.cyan-deep_orange'
      | 'material/material.cyan-deep_purple'
      | 'material/material.cyan-green'
      | 'material/material.cyan-indigo'
      | 'material/material.cyan-light_blue'
      | 'material/material.cyan-light_green'
      | 'material/material.cyan-lime'
      | 'material/material.cyan-orange'
      | 'material/material.cyan-pink'
      | 'material/material.cyan-purple'
      | 'material/material.cyan-red'
      | 'material/material.cyan-teal'
      | 'material/material.cyan-yellow'
      | 'material/material.deep_orange-amber'
      | 'material/material.deep_orange-blue'
      | 'material/material.deep_orange-cyan'
      | 'material/material.deep_orange-deep_purple'
      | 'material/material.deep_orange-green'
      | 'material/material.deep_orange-indigo'
      | 'material/material.deep_orange-light_blue'
      | 'material/material.deep_orange-light_green'
      | 'material/material.deep_orange-lime'
      | 'material/material.deep_orange-orange'
      | 'material/material.deep_orange-pink'
      | 'material/material.deep_orange-purple'
      | 'material/material.deep_orange-red'
      | 'material/material.deep_orange-teal'
      | 'material/material.deep_orange-yellow'
      | 'material/material.deep_purple-amber'
      | 'material/material.deep_purple-blue'
      | 'material/material.deep_purple-cyan'
      | 'material/material.deep_purple-deep_orange'
      | 'material/material.deep_purple-green'
      | 'material/material.deep_purple-indigo'
      | 'material/material.deep_purple-light_blue'
      | 'material/material.deep_purple-light_green'
      | 'material/material.deep_purple-lime'
      | 'material/material.deep_purple-orange'
      | 'material/material.deep_purple-pink'
      | 'material/material.deep_purple-purple'
      | 'material/material.deep_purple-red'
      | 'material/material.deep_purple-teal'
      | 'material/material.deep_purple-yellow'
      | 'material/material.green-amber'
      | 'material/material.green-blue'
      | 'material/material.green-cyan'
      | 'material/material.green-deep_orange'
      | 'material/material.green-deep_purple'
      | 'material/material.green-indigo'
      | 'material/material.green-light_blue'
      | 'material/material.green-light_green'
      | 'material/material.green-lime'
      | 'material/material.green-orange'
      | 'material/material.green-pink'
      | 'material/material.green-purple'
      | 'material/material.green-red'
      | 'material/material.green-teal'
      | 'material/material.green-yellow'
      | 'material/material.grey-amber'
      | 'material/material.grey-blue'
      | 'material/material.grey-cyan'
      | 'material/material.grey-deep_orange'
      | 'material/material.grey-deep_purple'
      | 'material/material.grey-green'
      | 'material/material.grey-indigo'
      | 'material/material.grey-light_blue'
      | 'material/material.grey-light_green'
      | 'material/material.grey-lime'
      | 'material/material.grey-orange'
      | 'material/material.grey-pink'
      | 'material/material.grey-purple'
      | 'material/material.grey-red'
      | 'material/material.grey-teal'
      | 'material/material.grey-yellow'
      | 'material/material.indigo-amber'
      | 'material/material.indigo-blue'
      | 'material/material.indigo-cyan'
      | 'material/material.indigo-deep_orange'
      | 'material/material.indigo-deep_purple'
      | 'material/material.indigo-green'
      | 'material/material.indigo-light_blue'
      | 'material/material.indigo-light_green'
      | 'material/material.indigo-lime'
      | 'material/material.indigo-orange'
      | 'material/material.indigo-pink'
      | 'material/material.indigo-purple'
      | 'material/material.indigo-red'
      | 'material/material.indigo-teal'
      | 'material/material.indigo-yellow'
      | 'material/material.light_blue-amber'
      | 'material/material.light_blue-blue'
      | 'material/material.light_blue-cyan'
      | 'material/material.light_blue-deep_orange'
      | 'material/material.light_blue-deep_purple'
      | 'material/material.light_blue-green'
      | 'material/material.light_blue-indigo'
      | 'material/material.light_blue-light_green'
      | 'material/material.light_blue-lime'
      | 'material/material.light_blue-orange'
      | 'material/material.light_blue-pink'
      | 'material/material.light_blue-purple'
      | 'material/material.light_blue-red'
      | 'material/material.light_blue-teal'
      | 'material/material.light_blue-yellow'
      | 'material/material.light_green-amber'
      | 'material/material.light_green-blue'
      | 'material/material.light_green-cyan'
      | 'material/material.light_green-deep_orange'
      | 'material/material.light_green-deep_purple'
      | 'material/material.light_green-green'
      | 'material/material.light_green-indigo'
      | 'material/material.light_green-light_blue'
      | 'material/material.light_green-lime'
      | 'material/material.light_green-orange'
      | 'material/material.light_green-pink'
      | 'material/material.light_green-purple'
      | 'material/material.light_green-red'
      | 'material/material.light_green-teal'
      | 'material/material.light_green-yellow'
      | 'material/material.lime-amber'
      | 'material/material.lime-blue'
      | 'material/material.lime-cyan'
      | 'material/material.lime-deep_orange'
      | 'material/material.lime-deep_purple'
      | 'material/material.lime-green'
      | 'material/material.lime-indigo'
      | 'material/material.lime-light_blue'
      | 'material/material.lime-light_green'
      | 'material/material.lime-orange'
      | 'material/material.lime-pink'
      | 'material/material.lime-purple'
      | 'material/material.lime-red'
      | 'material/material.lime-teal'
      | 'material/material.lime-yellow'
      | 'material/material.orange-amber'
      | 'material/material.orange-blue'
      | 'material/material.orange-cyan'
      | 'material/material.orange-deep_orange'
      | 'material/material.orange-deep_purple'
      | 'material/material.orange-green'
      | 'material/material.orange-indigo'
      | 'material/material.orange-light_blue'
      | 'material/material.orange-light_green'
      | 'material/material.orange-lime'
      | 'material/material.orange-pink'
      | 'material/material.orange-purple'
      | 'material/material.orange-red'
      | 'material/material.orange-teal'
      | 'material/material.orange-yellow'
      | 'material/material.pink-amber'
      | 'material/material.pink-blue'
      | 'material/material.pink-cyan'
      | 'material/material.pink-deep_orange'
      | 'material/material.pink-deep_purple'
      | 'material/material.pink-green'
      | 'material/material.pink-indigo'
      | 'material/material.pink-light_blue'
      | 'material/material.pink-light_green'
      | 'material/material.pink-lime'
      | 'material/material.pink-orange'
      | 'material/material.pink-purple'
      | 'material/material.pink-red'
      | 'material/material.pink-teal'
      | 'material/material.pink-yellow'
      | 'material/material.purple-amber'
      | 'material/material.purple-blue'
      | 'material/material.purple-cyan'
      | 'material/material.purple-deep_orange'
      | 'material/material.purple-deep_purple'
      | 'material/material.purple-green'
      | 'material/material.purple-indigo'
      | 'material/material.purple-light_blue'
      | 'material/material.purple-light_green'
      | 'material/material.purple-lime'
      | 'material/material.purple-orange'
      | 'material/material.purple-pink'
      | 'material/material.purple-red'
      | 'material/material.purple-teal'
      | 'material/material.purple-yellow'
      | 'material/material.red-amber'
      | 'material/material.red-blue'
      | 'material/material.red-cyan'
      | 'material/material.red-deep_orange'
      | 'material/material.red-deep_purple'
      | 'material/material.red-green'
      | 'material/material.red-indigo'
      | 'material/material.red-light_blue'
      | 'material/material.red-light_green'
      | 'material/material.red-lime'
      | 'material/material.red-orange'
      | 'material/material.red-pink'
      | 'material/material.red-purple'
      | 'material/material.red-teal'
      | 'material/material.red-yellow'
      | 'material/material.teal-amber'
      | 'material/material.teal-blue'
      | 'material/material.teal-cyan'
      | 'material/material.teal-deep_orange'
      | 'material/material.teal-deep_purple'
      | 'material/material.teal-green'
      | 'material/material.teal-indigo'
      | 'material/material.teal-light_blue'
      | 'material/material.teal-light_green'
      | 'material/material.teal-lime'
      | 'material/material.teal-orange'
      | 'material/material.teal-pink'
      | 'material/material.teal-purple'
      | 'material/material.teal-red'
      | 'material/material.teal-yellow'
      | 'material/material.yellow-amber'
      | 'material/material.yellow-blue'
      | 'material/material.yellow-cyan'
      | 'material/material.yellow-deep_orange'
      | 'material/material.yellow-deep_purple'
      | 'material/material.yellow-green'
      | 'material/material.yellow-indigo'
      | 'material/material.yellow-light_blue'
      | 'material/material.yellow-light_green'
      | 'material/material.yellow-lime'
      | 'material/material.yellow-orange'
      | 'material/material.yellow-pink'
      | 'material/material.yellow-purple'
      | 'material/material.yellow-red'
      | 'material/material.yellow-teal'

    /**
     * 커스톰 설정 Sass 경로
     */
    customThemeVariablePath?: string

    /**
     * 프레임워크 custom style 추가
     * @default true
     */
    addFrameworkCustomStyle?: boolean
  }

  /**
   * culture
   * @default ko
   */
  culture?:
    | 'ar-AE'
    | 'bg'
    | 'ca'
    | 'cs'
    | 'da'
    | 'de-CH'
    | 'de'
    | 'el'
    | 'en-CA'
    | 'en-GB'
    | 'en'
    | 'es-419'
    | 'es-MX'
    | 'es'
    | 'et'
    | 'eu'
    | 'fi'
    | 'fr-CA'
    | 'fr'
    | 'gl'
    | 'he'
    | 'hi'
    | 'hr'
    | 'hu'
    | 'id'
    | 'it'
    | 'ja'
    | 'kk'
    | 'ko'
    | 'lt'
    | 'lv'
    | 'mn-MN'
    | 'nl'
    | 'no'
    | 'pl'
    | 'pt'
    | 'ro'
    | 'ru'
    | 'sk'
    | 'sl'
    | 'sr'
    | 'sv'
    | 'th'
    | 'tr'
    | 'uk'
    | 'vi'
    | 'zh-HK'
    | 'zh-TW'
    | 'zh'

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
     * @default /samples/wijmo
     */
    path?: string

    /**
     * 추가 샘플 메뉴 정보
     */
    additionalMenus?: WijmoSampleMenuOptions[]

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

  /**
   * 컴포넌트 옵션
   */
  components?: WijmoComponentOptions
}

export interface WijmoSampleMenuOptions extends Record<string, any> {
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
  items?: WijmoSampleMenuOptions[]
}

/**
 * Wijmo 컴포넌트 옵션
 */
export interface WijmoComponentOptions extends Record<string, any> {
  /**
   * input date component
   */
  inputDate?: {
    /**
     * 캘린더 아이콘 사용 여부
     * @default true
     */
    useCalendarIcon?: boolean
  }
}
