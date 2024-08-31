import { HttpHeaders } from '#ustra/core/data'
import { Ustra } from '#ustra/nuxt'
import { useRouter, useRoute } from '#app'
import { RouteLocation } from 'vue-router'
import { useUstraMenuService } from '../../../management/services/menu'
import { useCurrentPageMeta } from '../../../composables/utils'
import type { Navigation, ProgramMenu } from '../../../management/store/models/navigation'

// @ts-ignore
import { LayoutKey } from '#build/types/layouts'

/**
 * management navigation 관련 기능
 */
export class UstraManagementNavigation {
  constructor(private $ustra: Ustra) {
    this.init()
  }

  get store() {
    return this.$ustra.management.store.navigation
  }

  get currentProgramMenu() {
    return this.store?.currentProgramMenu
  }

  private init() {
    // navigation 변경
    this.$ustra.hooks.hook('management:navigation:updated', async (nav, route) => {
      if (nav?.id && this.store.currentProgramMenu?.mnuId === nav?.id) {
        return
      }

      await this.store.setCurrentProgramMenu(nav?.id)
      await this.store.activateCurrentMenu(false, route)

      // add access history
      if (nav) {
        if (isNaN(parseInt(nav.id))) {
          return
        }

        const menuService = useUstraMenuService()
        menuService.addAccessHistory(nav.id, nav.path || route.path)
      }
    })

    // add api interceptor
    this.$ustra.api.getAxiosInstance().then(axios => {
      axios.interceptors.request.use(config => {
        const currentProgramMenu = this.currentProgramMenu

        if (currentProgramMenu) {
          if (currentProgramMenu.mnuId) {
            config.headers[HttpHeaders.MENU_ID] = currentProgramMenu.mnuId
          }

          if (currentProgramMenu.proIdVal) {
            config.headers[HttpHeaders.PROGRAM_ID] = currentProgramMenu.proIdVal
          }
        }

        return config
      })
    })
  }

  /**
   * 현재 메뉴 정보를 path 기준으로 변경
   * @param path 경로
   */
  async setCurrentProgramMenuByPath(path: string) {
    return this.store.setCurrentProgramMenuByPath(path)
  }

  /**
   * navigation을 경로 기준으로 조회
   * @param path 경로
   */
  findNavByPath(path: string) {
    for (const m of this.$ustra.management.store.initData.programMenus) {
      if (m.sysCd !== this.$ustra.management.currentSystemCode) {
        continue
      }

      if (this.$ustra.utils.router.equalPath(m.mnuUrl, path)) {
        return this.store.findNavigationByMenuId(m.mnuId)
      }
    }
  }

  /**
   * 메뉴 아이디 또는 프로그램 아이디로 Navigation 조회
   * @param id
   */
  findNav(id: string) {
    return this.store.findNavigationByMenuId(id)
  }

  /**
   * 아이디로 메뉴 정보 조회
   * @param id 아이디
   * @returns
   */
  findMenuById(id: string) {
    for (const m of this.$ustra.management.store.initData.programMenus) {
      if (m.mnuId === id) {
        return m
      }
    }
  }

  /**
   * navigation으로 메뉴 조회
   * @param nav
   */
  findMenuByNav(nav: Navigation) {
    const initDataStore = this.$ustra.management.store.initData
    return initDataStore.programMenus.find(
      m => m.sysCd === initDataStore.currentSystemCode && (m.mnuId === nav.id || m.mnuId === nav.originId),
    ) as ProgramMenu
  }

  /**
   * 현재 페이지의 레이아웃 명을 조회한다.
   * @param route Route 정보
   * @returns
   */
  getCurrentRouteLayoutName(route: RouteLocation) {
    if (!route) {
      route = useRoute()
    }

    const useTabUi = $ustra.env.appProps.nuxt?.management?.ui?.tabMenu?.enabled
    const mainPagePath = $ustra.env.appProps.nuxt?.management?.ui?.defaultPage?.main?.path
    const layoutProp = $ustra.env.appProps.nuxt?.management?.ui?.defaultPage?.layout
    const metaLayout = useCurrentPageMeta(route)?.layout

    if (metaLayout !== null && metaLayout !== undefined) {
      return metaLayout as LayoutKey
    }

    if (mainPagePath === route?.matched?.[0]?.path && useTabUi && layoutProp?.layoutName) {
      return layoutProp.layoutName as LayoutKey
    }

    if (useTabUi && layoutProp?.layoutName) {
      return false
    }

    if (layoutProp?.include && layoutProp?.layoutName) {
      return layoutProp.layoutName as LayoutKey
    }
    return 'default' as LayoutKey
  }
}
