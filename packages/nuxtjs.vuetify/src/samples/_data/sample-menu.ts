import { NuxtAppProps } from '#ustra/nuxt/config'

export interface SampleMenu extends Record<string, any> {
  /**
   * 제목
   */
  title?: string

  /**
   * icon
   */
  icon?: string

  /**
   * 비활성화 여부
   */
  disabled?: boolean

  /**
   * 경로
   */
  path?: string

  /**
   * 업데이트 여부
   */
  updated?: boolean

  /**
   * 노출 여부
   */
  visible?: boolean | ((appProps: NuxtAppProps) => boolean)

  /**
   * 하위 메뉴
   */
  items?: SampleMenu[]

  /**
   * 전체 제목
   */
  _fullTitle?: string
}

export default [
  {
    title: 'Common',
    icon: 'mdi-application-cog-outline',
    items: [
      { title: 'Markdown', icon: 'mdi-language-markdown', path: 'common/markdown' },
      // { title: 'Error Handling', icon: 'mdi-alert-circle', path: 'common/error-handling', updated: false },
      // { title: 'Rendering', icon: 'mdi-draw', path: 'common/rendering', updated: false },
      { title: 'MediaQuery', icon: 'mdi-multimedia', path: 'common/media-query', updated: false },
      {
        title: 'Vuetify Style',
        icon: 'mdi-multimedia',
        updated: false,
        visible: true,
        items: [{ title: 'v-focus', path: 'common/vuetify-style', updated: false }],
      },
      {
        title: 'Composables',
        icon: 'mdi-multimedia',
        updated: false,
        visible: true,
        items: [{ title: 'useOnError', path: 'common/composables/use-on-error', updated: false }],
      },
      {
        title: 'Config',
        icon: 'mdi-multimedia',
        updated: false,
        visible: true,
        items: [
          { title: 'v-focus', path: 'common/directives/focus', updated: false },
          { title: 'v-image', path: 'common/directives/image', updated: false },
        ],
      },
      {
        title: 'Directives',
        icon: 'mdi-multimedia',
        updated: false,
        visible: true,
        items: [
          { title: 'v-focus', path: 'common/directives/focus', updated: false },
          { title: 'v-image', path: 'common/directives/image', updated: false },
        ],
      },
    ],
  },
  {
    title: 'Layout',
    icon: 'mdi-page-layout-header-footer',
    items: [
      { title: '페이지 레이아웃', path: 'layout/page' },
      { title: 'Form 레이아웃', path: 'layout/form', updated: false },
      // { title: 'Form 레이아웃(Sample)', path: 'layout/form-sample' },
      // { title: 'Form 레이아웃(Grid)', path: 'layout/form-grid' },
      // { title: 'Grid 레이아웃', path: 'layout/grid' },
      // { title: 'ButtonBar', path: 'layout/button-bar', updated: false },
      { title: '반응형 레이아웃 설정', path: 'layout/responsive-setting', updated: false },
    ],
  },
  {
    title: 'Input',
    icon: 'mdi-form-textbox',
    items: [
      // { title: 'Button', icon: 'mdi-gesture-tap-button', path: 'input/button', updated: false },
      { title: 'Radio', icon: 'mdi-gesture-tap-button', path: 'input/radio', updated: false },
      { title: 'CheckBox', icon: 'mdi-gesture-tap-button', path: 'input/check', updated: false },
      { title: 'SelectBox', icon: 'mdi-gesture-tap-button', path: 'input/base', updated: false },
      { title: 'AutoComplete', icon: 'mdi-gesture-tap-button', path: 'input/base', updated: false },
      {
        title: 'TextBox',
        icon: 'mdi-multimedia',
        updated: false,
        visible: true,
        items: [
          { title: 'TextBox', icon: 'mdi-window-maximize', path: 'input/textbox' },
          // { title: '전화번호', icon: 'mdi-comment-account-outline', path: 'input/phone-no', updated: false },
          // { title: 'IP주소', icon: 'mdi-microsoft-xbox-controller-menu', path: 'input/ip-address', updated: false },
          // { title: '사업자번호', icon: 'mdi-microsoft-xbox-controller-menu', path: 'input/corp-no', updated: false },
        ],
      },
      // { title: 'Datepicker', icon: 'mdi-gesture-tap-button', path: 'input/datepicker', updated: false },
      { title: 'DateBox', icon: 'mdi-gesture-tap-button', path: 'input/datebox', updated: false },
      { title: 'DatePeriodBox', icon: 'mdi-gesture-tap-button', path: 'input/datebox-period', updated: false },
      { title: 'Validation', icon: 'mdi-gesture-tap-button', path: 'input/base', updated: false },

      { title: 'CkEditor5', path: 'input/ckeditor5', updated: false, visible: appProps => appProps.nuxt.ckeditor5.enabled },
    ],
  },
  {
    title: 'Navigation',
    icon: 'mdi-monitor',
    items: [
      { title: '팝업', icon: 'mdi-window-restore', path: 'navigation/popup', updated: false },
      // { title: 'Tree', icon: 'mdi-file-tree', path: 'navigation/tree', updated: false },
      // { title: 'Context Menu', icon: 'mdi-window-shutter-settings', path: 'navigation/context-menu', updated: false },
      // { title: 'Tab', icon: 'mdi-tab', path: 'navigation/tab', updated: false },
      // { title: 'Accordion', icon: 'mdi-menu-open', path: 'navigation/accordion', updated: true },
    ],
  },
  {
    title: 'File',
    icon: 'mdi-file-settings-outline',
    items: [
      { title: 'Button', path: 'file/button', updated: false },
      { title: 'Drop Box', path: 'file/drop-box', updated: false },
      {
        title: 'Single File Uploader',
        path: 'file/single-uploader',
        updated: false,
        visible: appProps => {
          return appProps.nuxt.management.enabled
        },
      },
      // {
      //   title: 'Multi File Uploader',
      //   path: 'file/multi-uploader',
      //   updated: false,
      //   visible: appProps => {
      //     return appProps.nuxt.management.enabled
      //   },
      // },
      // {
      //   title: 'Image Uploader',
      //   path: 'file/image-uploader',
      //   updated: false,
      //   visible: appProps => {
      //     return appProps.nuxt.management.enabled
      //   },
      // },
      // {
      //   title: 'Excel File Uploader',
      //   path: 'file/excel-uploader',
      //   updated: false,
      //   visible: appProps => {
      //     return appProps.nuxt.management.enabled
      //   },
      // },
    ],
  },
  // {
  //   title: 'Chart',
  //   icon: 'mdi-chart-box-outline',
  //   items: [{ title: 'ApexCharts', path: 'chart/apex-charts' }],
  // },
  {
    title: 'Miscellaneous',
    icon: 'mdi-baby-bottle-outline',
    items: [
      { title: 'Daum 주소창', icon: 'mdi-note-search-outline', path: 'miscellaneous/daum-post', updated: false },
      { title: 'QR-code', icon: 'mdi-note-search-outline', path: 'miscellaneous/qrcode', updated: false },
    ],
  },
] as SampleMenu[]
