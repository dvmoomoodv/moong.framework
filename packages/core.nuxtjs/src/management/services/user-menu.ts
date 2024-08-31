import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { UserMenu, UserMenus, UserMenuCriteria } from '../models/user'

/**
 * 사용자 메뉴 서비스
 */
export const useUstraUserMenuService = defineUstraService(({ api }) => {
  /**
   * 즐겨 찾기 메뉴 조회
   * @param creteria  조건
   * @param showLoadingBar 로딩바 표시 여부
   * @returns 즐겨찾기 목록
   */
  async function getUserMenus(creteria?: UserMenuCriteria, showLoadingBar: boolean = true) {
    creteria.sysCd = creteria.sysCd || $ustra.management.currentSystemCode

    const result = await api.call<apiModels.ApiResponse<UserMenu[]>>({
      url: '/api/system/usermenu/list',
      method: 'POST',
      data: creteria,
      showLoadingBar,
    })

    return result.data.body
  }

  /**
   * 즐겨 찾기 대표 메뉴 변경
   * @param menu 메뉴
   * @returns
   */
  async function updateDefMenu(menu: UserMenu) {
    menu.sysCd = menu.sysCd || $ustra.management.currentSystemCode

    /** 배열로 넘겨야 함 */
    const result = await api.call<apiModels.ApiResponse<UserMenu>>({
      url: '/api/system/usermenu/def',
      method: 'POST',
      data: menu,
    })

    return result.data.body
  }

  /**
   * 즐겨찾기 순번 변경
   * @param menu
   */
  async function updateMenu(menus: UserMenus) {
    /** 배열로 넘겨야 함 */
    const result = await api.call<apiModels.ApiResponse<UserMenus>>({
      url: '/api/system/usermenu/edit',
      method: 'POST',
      data: menus,
    })

    return result.data.body
  }

  /**
   * 즐겨찾기 추가
   * @param userMenu
   * @returns
   */
  async function addMenu(userMenu: UserMenu) {
    userMenu.sysCd = userMenu.sysCd || $ustra.management.currentSystemCode

    const result = await api.call<apiModels.ApiResponse<UserMenu>>({
      url: '/api/system/usermenu',
      method: 'POST',
      data: userMenu,
    })

    return result.data.body
  }

  /**
   * 즐겨 찾기 삭제
   * @param userMenu
   * @returns
   */
  async function removeMenu(userMenu: UserMenu) {
    userMenu.sysCd = userMenu.sysCd || $ustra.management.currentSystemCode

    const result = await api.call<apiModels.ApiResponse<UserMenu>>({
      url: '/api/system/usermenu/remove',
      method: 'POST',
      data: userMenu,
    })

    return result.data.body
  }

  return { getUserMenus, updateDefMenu, updateMenu, addMenu, removeMenu }
})
