import { ref, markRaw } from 'vue'
import { useRoute, useRouter } from '#app'
import { defineInitStore } from '#ustra/nuxt/store'
import { useUstra } from '#ustra/nuxt/composables'
import { RouteLocationNormalized } from 'vue-router'
import { useUstraUserMenuService } from '../services/user-menu'
import type { Navigation, ProgramMenu } from './models/navigation'
import type { UserMenu } from '../models/user'

export const useUstraNavigationStore = defineInitStore(
  'ustra:management:navigation',
  () => {
    const $ustra = useUstra()
    const initDataStore = $ustra.management.store.initData
    const userMenuService = useUstraUserMenuService()

    const states = {
      /**
       * 현재 프로그램 메뉴
       */
      currentProgramMenu: ref<ProgramMenu>(null),

      /**
       * navigation 정보
       */
      navigations: ref<Navigation[]>([]),

      /**
       * 즐겨찾기
       */
      userMenus: ref<UserMenu[]>([]),

      /**
       * tab navigation
       */
      openedTabNavigations: ref<Navigation[]>([]),

      /**
       * 선택된 tab index
       */
      selectedTabIndex: ref<number>(-1),
    }

    const _actions = {
      updateCurrentMenu(currentMenu) {
        states.currentProgramMenu.value = currentMenu
        const programMenus = initDataStore.programMenus

        // 상위 메뉴 찾기
        const findParentMenu = (menu: ProgramMenu, menuNames = []) => {
          menuNames.unshift({ name: menu.mnuNm, menu })

          if (!menu.uprMnuId) {
            return menuNames
          }

          const foundMenus = programMenus.filter(m => menu.uprMnuId === m.mnuId)

          if (foundMenus && foundMenus.length > 0) {
            findParentMenu(foundMenus[0], menuNames)
          }
          return menuNames
        }

        const foundMenus = findParentMenu(states.currentProgramMenu.value)
        states.currentProgramMenu.value.mnuFullNm = foundMenus.map(m => m.name).join(' > ')
        states.currentProgramMenu.value.parentMenus = foundMenus.map(m => m.menu).slice(0, foundMenus.length - 1)
      },
    }

    const actions = {
      /**
       * navigation 정보를 생성
       */
      async createNavigation() {
        const managementConfig = $ustra.env.appProps.nuxt.management

        const menus = $ustra.utils.core.deepMerge([], initDataStore.programMenus).filter(menu => menu.sysCd === initDataStore.currentSystemCode)

        const userMenus = states.userMenus.value
        const mainPageUrl = managementConfig.ui.defaultPage.main.path
        const displayHomeMenu = managementConfig.ui.displayHomeMenu
        const highlightDefault = managementConfig.ui.favoriteMenu.highlightDefault

        const navigations: Navigation[] = []

        if (displayHomeMenu) {
          navigations.push({
            id: 'home',
            text: 'Home',
            path: mainPageUrl,
            icon: 'home',
          })
        }

        if (!menus) {
          return navigations
        }

        const favoriteVisibleAlways = managementConfig.ui.favoriteMenu.visibleAlways
        const hasFavorites = favoriteVisibleAlways || (userMenus && userMenus.length > 0)
        // add favorite
        if (managementConfig.ui.favoriteMenu.enabled) {
          const favoriteNavigation = {
            text: '즐겨찾기',
            id: 'favorites',
            icon: 'favorites',
            display: true,
            show: true,
            active: false,
            expanded: false,
            items: [],
            favorite: true,
            visible: hasFavorites,
          }
          navigations.push(favoriteNavigation)

          for (const userMenu of userMenus) {
            favoriteNavigation.items.push({
              id: 'favorites-' + userMenu.mnuId,
              originId: userMenu.mnuId,
              text: userMenu.mnuNm,
              iconSrc: null,
              display: true,
              show: true,
              active: false,
              path: userMenu.mnuUrl,
              visible: $ustra.management.auth.hasMenuAuthority(userMenu.mnuId),
              parent: favoriteNavigation,
            })
          }
        }

        const register = (menu: ProgramMenu, items: any[], parent: any) => {
          const navigation: Navigation = {
            id: menu.mnuId,
            prgId: menu.proIdVal,
            text: menu.mnuNm,
            path: menu.mnuUrl,
            icon: menu.mnuStepNo === 1 ? 'folder' : null,
            iconSrc: menu.iconSrc,
            active: false,
            display: menu.dpYn === 'Y',
            show: $ustra.management.auth.hasMenuAuthority(menu.mnuId),
            items: [],
            parent,
          }

          /**
           * visible 설정
           *   display : 노출 여부
           *   show : 권한 할당 여부
           *   mnuDvcScopCd, isMobileRequest : 디바이스 설정 여부
           *
           * 수정 : 20230329 이무현
           */
          navigation.visible =
            navigation.display &&
            navigation.show &&
            (menu.mnuDvcScopCd === 'A' ||
              !menu.mnuDvcScopCd ||
              (menu.mnuDvcScopCd === 'D' && !$ustra.env.isMobileRequest) ||
              (menu.mnuDvcScopCd === 'M' && $ustra.env.isMobileRequest))

          if (navigation.visible && parent) {
            let currentParent = parent

            while (currentParent) {
              currentParent.visible = true
              currentParent = currentParent.parent
            }
          }

          items.push(navigation)

          const subMenus = menus.filter(m => m.uprMnuId === menu.mnuId)
          for (const sm of subMenus) {
            register(sm, navigation.items, navigation)
          }
        }

        for (const menu of menus) {
          if (menu.mnuStepNo === 1) {
            register(menu, navigations, null)
          }
        }

        states.navigations.value = navigations

        if (managementConfig.ui.tabMenu.enabled) {
          actions.loadTabMenus()
        }

        $ustra.hooks.callHook('management:navigation:created', states.navigations.value)
      },

      /**
       * 즐겨찾기 메뉴 로드
       * @param navigations
       */
      loadFavoriteNavigation() {
        const managementConfig = $ustra.env.appProps.nuxt.management
        const userMenus = states.userMenus.value
        const navigations = states.navigations.value

        if (!navigations) {
          return
        }

        const favoriteMenu = navigations.find(nav => nav.favorite)
        const highlightDefault = managementConfig.ui.favoriteMenu.highlightDefault

        if (!favoriteMenu) {
          return
        }

        const favoriteMenuItems = []
        for (const userMenu of userMenus) {
          favoriteMenuItems.push({
            id: 'favorites-' + userMenu.mnuId,
            originId: userMenu.mnuId,
            text: userMenu.mnuNm,
            iconSrc: null,
            display: true,
            show: true,
            active: false,
            visible: $ustra.management.auth.hasMenuAuthority(userMenu.mnuId),
            parent: favoriteMenu,
            path: userMenu.mnuUrl,
          })
        }

        const favoriteVisibleAlways = managementConfig.ui.favoriteMenu.visibleAlways
        const favoriteVisible = favoriteVisibleAlways || favoriteMenuItems.length > 0

        favoriteMenu.items = favoriteMenuItems
        favoriteMenu.visible = favoriteVisible
        favoriteMenu.ts = new Date()

        states.navigations.value = navigations
      },

      /**
       * 현재 메뉴 반영
       * @param path path
       * @returns
       */
      setCurrentProgramMenuByPath(path: string) {
        if (!path) {
          states.currentProgramMenu.value = null
          return
        }

        path = path.endsWith('/') ? path.substring(0, path.length - 1) : path

        const programMenus = initDataStore.programMenus
        if (programMenus) {
          const currentMenu = programMenus.filter(m => m.sysCd === initDataStore.currentSystemCode && $ustra.utils.router.equalPath(m.mnuUrl, path))

          if (currentMenu.length > 0) {
            _actions.updateCurrentMenu(currentMenu[0])
            return states.currentProgramMenu.value
          }
        }

        states.currentProgramMenu.value = null
        return states.currentProgramMenu.value
      },

      /**
       * 아이디로 현재 메뉴 반영
       * @param id 메뉴 아이디
       */
      setCurrentProgramMenu(id: string) {
        if (!id) {
          states.currentProgramMenu.value = null
          return
        }

        const programMenus = initDataStore.programMenus
        if (programMenus) {
          const currentMenu = programMenus.filter(m => m.sysCd === initDataStore.currentSystemCode && m.mnuId === id)

          if (currentMenu.length > 0) {
            _actions.updateCurrentMenu(currentMenu[0])
            return states.currentProgramMenu.value
          }
        }

        states.currentProgramMenu.value = null
        return states.currentProgramMenu.value
      },

      /**
       * 현재 메뉴 활성화
       * @param inactiveOthers 비활성화 메뉴는 actvie를 false로 설정할지 여부
       */
      activateCurrentMenu(inactiveOthers = true, $route?: RouteLocationNormalized) {
        const currentMenu = states.currentProgramMenu.value
        $route = $route || useRoute()

        const selectNavigation = navs => {
          for (const nav of navs) {
            if (inactiveOthers) {
              nav.active = false
            } else if (nav.path) {
              nav.active = false
            }
            if (currentMenu) {
              if (currentMenu.mnuId === nav.id) {
                nav.active = true
              }
              if (currentMenu.parentMenus.some(pm => pm.mnuId === nav.id)) {
                nav.active = true
              }
            }
            if (nav.items) {
              selectNavigation(nav.items)
            }
          }
        }
        if (states.navigations) {
          selectNavigation(states.navigations.value)
        }

        const mainPagePath = $ustra.env.appProps.nuxt.management.ui.defaultPage.main.path
        const managementConfig = $ustra.env.appProps.nuxt.management
        const useTabMenu = managementConfig.ui.tabMenu.enabled
        if ($ustra.utils.router.equalPath($route.path, mainPagePath) && !useTabMenu) {
          const activatedNavigations = states.navigations.value.filter(nav => nav.visible)

          if (activatedNavigations && activatedNavigations.length > 0) {
            activatedNavigations[0].active = true
          }
        }
      },

      /**
       * 탭 메뉴 로드
       */
      async loadTabMenus() {
        states.openedTabNavigations.value = []

        const displayHomeMenu = $ustra.env.appProps.nuxt.management.ui.displayHomeMenu
        const mainPagePath = $ustra.env.appProps.nuxt.management.ui.defaultPage.main.path
        const navigations = states.navigations.value

        const $route = useRoute()

        if (navigations.length < 1) {
          return
        }

        if ($route.query.id) {
          const nav = actions.findNavigationByMenuId($route.query.id as string, true)

          if (!nav) {
            await alert('선택 메뉴는 존재하지 않습니다. 관리자에게 문의하시기 바랍니다.')
            window.close()
            return
          } else {
            const component = $ustra.utils.router.findComponentByPath(nav.path)
            if (!component) {
              await alert('선택 메뉴는 존재하지 않습니다. 관리자에게 문의하시기 바랍니다.')
              window.close()
              return
            }

            nav.component = markRaw(component)
            states.openedTabNavigations.value.push(nav)
            return
          }
        }

        // pick main page component
        if (displayHomeMenu && mainPagePath && navigations.length > 0) {
          const mainComponent = $ustra.utils.router.findComponentByPath(mainPagePath)

          if (mainComponent) {
            navigations[0].component = markRaw(mainComponent)
            states.openedTabNavigations.value.push(navigations[0])
          }
        }
      },

      /**
       * 즐겨찾기 목록 조회
       */
      async loadUserMenus() {
        try {
          const useFavoriteMenu = $ustra.env.appProps.nuxt.management.ui.favoriteMenu.enabled

          if (!useFavoriteMenu) {
            states.userMenus.value = []
            return
          }

          if (!$ustra.auth.isAuthenticated) {
            states.userMenus.value = []
            return
          }

          const userMenus = await userMenuService.getUserMenus({ usrId: $ustra.management.auth.user.sub })
          states.userMenus.value = userMenus
        } finally {
          actions.loadFavoriteNavigation()
        }
      },

      /**
       * 메뉴 아이디로 메뉴 조회
       * @param mnuId 메뉴 아이디 or 프로그램 아이디
       * @param checkVisible 접근 권한 확인
       */
      findNavigationByMenuId(mnuId: string, checkVisible = false) {
        const navs = $ustra.utils.model.flatReclusiveArray(states.navigations.value, 'items', false)

        for (const nav of navs) {
          if (nav.id === mnuId || (nav.prgId && nav.prgId === mnuId)) {
            if (!checkVisible || (checkVisible && nav.visible)) {
              return nav
            }
          }
        }

        return null
      },

      /**
       * navigation 전체 명 조회
       * @param nav
       */
      getNavFullName(nav: Navigation) {
        let parent = nav.parent
        const names = []

        while (parent) {
          names.unshift(parent.text)
          parent = parent.parent
        }

        return names.join(' > ')
      },
    }

    return { ...states, ...actions }
  },
  store => {
    // console.warn('navigations........')
  },
)
