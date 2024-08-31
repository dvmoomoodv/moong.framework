import { SampleMenu } from './sample-menu'

const managementSampleMenu: SampleMenu[] = [
  {
    title: 'Management',
    icon: 'mdi-account-circle',
    items: [
      { title: '공통코드 콤보', icon: 'mdi-form-select', path: 'management/code-combo', updated: true },
      { title: '공통코드 Radio Box', icon: 'mdi-radiobox-marked', path: 'management/code-radio', updated: false },
      { title: '공통코드 Check Box', icon: 'mdi-checkbox-marked-outline', path: 'management/code-check', updated: false },

      {
        title: 'Popup',
        icon: 'mdi-multimedia',
        updated: false,
        visible: true,
        items: [
          { title: '공통코드 팝업', icon: 'mdi-window-maximize', path: 'management/code-popup' },
          { title: '사용자 조회 팝업', icon: 'mdi-comment-account-outline', path: 'management/user-popup', updated: false },
          { title: '메뉴 조회 팝업', icon: 'mdi-microsoft-xbox-controller-menu', path: 'management/menu-popup', updated: false },
        ],
      },
    ],
  },
]

export default managementSampleMenu
