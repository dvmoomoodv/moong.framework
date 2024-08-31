import { useRouter } from '#app'
import { useWindowSize } from '@vueuse/core'
import { computed, ref, onMounted, markRaw, nextTick } from '#ustra/nuxt'
import { useUstra } from '#ustra/nuxt/composables'
import { useUstraManagementUser } from '#ustra/nuxt/management'
import { Navigation } from '#ustra/nuxt/management/store/models/navigation'

/**
 * 관리메뉴 유틸리티 사용
 */
export const useUstraManagementLayoutUtils = () => {
  const $ustra = useUstra()
  const $router = useRouter()

  /**
   * 오픈된 Tab 메뉴 목록
   */
  const openedTabNavigations = computed(() => {
    return $ustra.management.store.navigation.openedTabNavigations
  })

  /**
   * 메뉴를 경로 기준으로 오픈한다.
   * @param path 경로
   */
  const openMenuByPath = (path: string, data?: any) => {
    const nav = $ustra.management.navigation.findNavByPath(path)
    openMenu(nav, data)
  }

  /**
   * 메뉴 또는 프로그램 아이디로 오픈
   * @param id 아이디
   */
  const openMenuById = (id: string, data?: any) => {
    const nav = $ustra.management.navigation.findNav(id)
    openMenu(nav, data)
  }

  /**
   * navigation 정보로 메뉴 오픈
   * @param nav Navigation
   * @param data tab 메뉴 사용 시에 전달할 데이터
   * @returns
   */
  const openMenu = async (nav: Navigation, data?: any) => {
    if (!nav) {
      alert('메뉴 정보를 찾을 수 없습니다.')
      return
    }

    if (!nav.path) {
      return
    }

    const comp = $ustra.utils.router.findComponentByPath(nav.path)
    if (!comp) {
      alert('메뉴 정보를 찾을 수 없습니다.')
      return
    }

    if (!nav.component || process.dev) {
      nav.component = markRaw(comp)
    }

    const tabMenuProps = $ustra.env.appProps.nuxt.management.ui.tabMenu

    // tab 메뉴 비사용
    if (!tabMenuProps.enabled) {
      $router.push(nav.path)
      return
    }

    const currentMenu = $ustra.management.navigation.findMenuByNav(nav)

    if (currentMenu && data) {
      currentMenu.componentData = markRaw(data)
    } else {
      currentMenu.componentData = undefined
    }

    // tab 메뉴 사용
    // find exists tab
    const existsIndex = openedTabNavigations.value.findIndex(n => n.id === nav.id)

    if (existsIndex > -1) {
      $ustra.management.store.navigation.selectedTabIndex = existsIndex

      if (!process.dev) {
        nextTick(() => {
          if (currentMenu && currentMenu.componentCallback) {
            currentMenu.componentCallback(currentMenu)
          }
        })
      }

      return
    }

    // check ip address
    const targetMenu = $ustra.management.navigation.findMenuByNav(nav)

    if (targetMenu) {
      const accessable = await $ustra.management.auth.accessableMenuIpAddress(targetMenu, $ustra.management.auth.user.accessInfo.userIp)
      if (accessable === false) {
        return
      }
    }

    openedTabNavigations.value.push(nav)
    $ustra.management.store.navigation.selectedTabIndex = openedTabNavigations.value.length - 1
  }

  /**
   * index로 tab 메뉴를 close 한다.
   * @param index 메뉴 순번 (from zero.)
   */
  const closeTabMenuByIndex = (index: number) => {
    openedTabNavigations.value.splice(index, 1)

    if ($ustra.management.store.navigation.selectedTabIndex === index) {
      const nextIndex = openedTabNavigations.value.length - 1 > index ? index : index - 1

      $ustra.management.store.navigation.selectedTabIndex = nextIndex
    } else if ($ustra.management.store.navigation.selectedTabIndex > index) {
      $ustra.management.store.navigation.selectedTabIndex--
    }
  }

  return { openedTabNavigations, openMenuByPath, openMenuById, openMenu, closeTabMenuByIndex }
}

/**
 * 레이아웃
 * @returns
 */
export const useUstraManagementLayout = () => {
  /**
   * 팝업 오픈 여부
   */
  const showConfigPopup = ref(false)

  /**
   * 설정 메뉴 정보
   */
  const configMenus = computed(() => {
    const sampleProps = $ustra.env.appProps.nuxt.wijmo.samples
    const useSample = sampleProps.enabled
    const menus = []

    menus.push({
      title: '설정',
      icon: 'mdi-cog-outline',
      onClick(e) {
        showConfigPopup.value = true
        e.stopPropagation()
      },
    })

    if (useSample) {
      menus.push({
        title: '샘플',
        icon: 'mdi-comment-text-multiple-outline',
        onClick() {
          window.open(sampleProps.path, '_blank')
        },
      })
    }

    menus.push({
      title: '로그아웃',
      icon: 'mdi-logout',
      async onClick() {
        const result = await confirm('로그아웃 하시겠습니까?')

        if (result) {
          $ustra.management.auth.logout()
        }
      },
    })

    return menus
  })

  /**
   * 사용자 정보
   */
  const displayUserText = computed(() => {
    if (!$ustra.auth.isAuthenticated) {
      return null
    }

    const user = useUstraManagementUser()
    if (user.deptNm) {
      return user.deptNm + ' ' + user.userNm
    }

    return user.userNm
  })

  return {
    /**
     * 설정 메뉴 정보
     */
    configMenus,

    /**
     * 사용자 정보
     */
    displayUserText,

    /**
     * Config 메뉴 오픈 여부
     */
    showConfigPopup,
  }
}

/**
 * 레이아웃 Side Menu
 * @param collapsedWindowWidth
 * @returns
 */
export const useUstraLayoutManagementSideMenu = (collapsedWindowWidth: number = 960) => {
  const isOpenSideMenu = ref(true)
  const navigations = computed(() => {
    return $ustra.management.store.navigation.navigations
  })

  onMounted(() => {
    if (useWindowSize().width.value < collapsedWindowWidth) {
      isOpenSideMenu.value = false
    }
  })

  return {
    /**
     * 사이드 메뉴 오픈 여부
     */
    isOpenSideMenu,

    /**
     * navigation 목록
     */
    navigations,
  }
}
