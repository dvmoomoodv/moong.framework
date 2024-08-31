import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { MenuCriteria, Menu, MenuTreeData } from '../models/menu'

/**
 * 메뉴 서비스
 */
export const useUstraMenuService = defineUstraService(({ api }) => {
  /**
   * 메뉴 목록 조회
   * @param creteria 조건
   */
  async function getMenus(creteria?: MenuCriteria, maxDepth?: number) {
    const res = await api.call<apiModels.ApiResponse<Menu[]>>({
      url: '/api/system/menu/list',
      method: 'POST',
      data: creteria,
    })

    const findMenuById = (menus: MenuTreeData[], mnuId: string): MenuTreeData => {
      if (!menus) {
        return null
      }

      for (const menu of menus) {
        if (menu.mnuId === mnuId) {
          return menu
        }

        const subMenu = findMenuById(menu.items, mnuId)
        if (subMenu) {
          return subMenu
        }
      }
    }

    const menus: MenuTreeData[] = []
    for (const ag of res.data.body) {
      const treeMenu: MenuTreeData = ag
      treeMenu.items = []
      treeMenu.expanded = false

      if (maxDepth <= treeMenu.mnuStepNo) {
        treeMenu.icon = 'file'
      }

      if (!treeMenu.uprMnuId) {
        menus.push(treeMenu)
      } else {
        const uprAuthGroup = findMenuById(menus, treeMenu.uprMnuId)

        if (uprAuthGroup) {
          uprAuthGroup.items.push(treeMenu)
        }
      }
    }

    return menus
  }

  /**
   * 메뉴 목록 조회
   * @param creteria 검색 조건
   */
  async function getMenuList(creteria?: MenuCriteria) {
    const result = await api.call<apiModels.ApiResponse<Menu[]>>({
      url: '/api/system/menu/list',
      method: 'POST',
      data: creteria,
    })

    return result.data.body
  }

  /**
   * 메뉴 상세 조회
   * @param mnuId 메뉴 아이디
   */
  async function getMenu(mnuId: string) {
    const result = await api.call<apiModels.ApiResponse<Menu>>({
      url: `/api/system/menu/${mnuId}`,
      method: 'GET',
    })

    return result.data.body
  }

  /**
   * 메뉴 추가
   * @param $core
   * @param menu
   */
  async function addMenu(menu: Menu) {
    const result = await api.call<apiModels.ApiResponse<Menu>>({
      url: '/api/system/menu',
      method: 'POST',
      data: menu,
    })

    return result.data.body
  }

  /**
   * 메뉴 변경
   * @param menu 메뉴 정보
   */
  async function updateMenu(menu: Menu) {
    delete menu.updDttm
    delete menu.updUsrId
    delete menu.updUsrIp
    const result = await api.call<apiModels.ApiResponse<Menu>>({
      url: '/api/system/menu/edit',
      method: 'POST',
      data: menu,
    })

    return result.data.body
  }

  /**
   * 메뉴 일괄 변경
   * @param menu
   */
  async function updateMenuBatch(menus: Menu[]) {
    menus.forEach(menu => {
      delete menu.updDttm
      delete menu.updUsrId
      delete menu.updUsrIp
    })
    const result = await api.call<apiModels.ApiResponse<Menu>>({
      url: '/api/system/menu/batch',
      method: 'POST',
      data: { menus },
    })

    return result.data.body
  }

  /**
   * 메뉴 삭제
   * @param menu 메뉴 정보
   */
  async function removeMenu(menu: Menu) {
    const result = await api.call<apiModels.ApiResponse<Menu>>({
      url: '/api/system/menu/remove',
      method: 'POST',
      data: menu,
    })

    return result.data.body
  }

  /**
   * 메뉴 접근 로그 기록
   * @param mnuId 메뉴 아이디
   * @param mnuUrl 메뉴 URL
   */
  async function addAccessHistory(mnuId: string, mnuUrl: string) {
    try {
      await api.call<apiModels.ApiResponse<any>>({
        url: '/api/system/menu/access',
        method: 'POST',
        data: { mnuId, mnuUrl },
        showLoadingBar: false,
      })
    } catch (e) {}
  }

  /**
   * 메뉴 기능 접근 로그 기록
   * @param mnuId 메뉴 아이디
   * @param fncId 기능 아이디
   */
  async function addFunctionAccessHistory(mnuId: string, fncId: string) {
    try {
      await api.call<apiModels.ApiResponse<any>>({
        url: '/api/system/menu/access/function',
        method: 'POST',
        data: { mnuId, fncId },
        showLoadingBar: false,
      })
    } catch (e) {}
  }

  return { getMenus, getMenuList, getMenu, addMenu, updateMenu, updateMenuBatch, removeMenu, addAccessHistory, addFunctionAccessHistory }
})
