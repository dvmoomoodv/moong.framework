/**
 * $ustra management 정의
 * @packageDocumentation
 */
import { NuxtApp, addRouteMiddleware, createError } from '#app'
import { useCurrentPageMeta } from '#ustra/nuxt/composables/utils'
import pathUtils from '#ustra/core/utils/path'
import { useUstraInitDataStore } from '../../management/store/init-data'
import { useUstraNavigationStore } from '../../management/store/navigation'
import type { Ustra } from '../ustra'
import { UstraManagmentAuth } from './management/auth'
import { UstraManagementNavigation } from './management/navigation'
import { UstraManagmentFile } from './management/file'
import { UstraManagementConfig } from './management/config'

export class UstraManagement {
  private _initDataStore: Awaited<ReturnType<typeof useUstraInitDataStore>> = null
  private _navigationStore: Awaited<ReturnType<typeof useUstraNavigationStore>> = null

  public auth: UstraManagmentAuth
  public navigation: UstraManagementNavigation
  public file: UstraManagmentFile
  public config: UstraManagementConfig

  constructor(private app: NuxtApp, private $ustra: Ustra) {
    this.auth = new UstraManagmentAuth($ustra)
    this.navigation = new UstraManagementNavigation($ustra)
    this.file = new UstraManagmentFile()
    this.config = new UstraManagementConfig($ustra)
  }

  get store() {
    return {
      initData: this._initDataStore,
      navigation: this._navigationStore,
    }
  }

  async init() {
    this._initDataStore = await useUstraInitDataStore()
    this._navigationStore = await useUstraNavigationStore()

    this.addMiddleware()
  }

  private addMiddleware() {
    const tabMenuConfig = $ustra.env.appProps.nuxt.management.ui.tabMenu
    if (typeof tabMenuConfig.preventDirectConnectMenuUrl !== 'object') {
      tabMenuConfig.preventDirectConnectMenuUrl = {
        enabled: tabMenuConfig.preventDirectConnectMenuUrl,
        excludeUrlPatterns: [],
      }
    }

    addRouteMiddleware(
      'ustra:management',
      async (to, from) => {
        const meta = useCurrentPageMeta(to)

        // change current menu
        const currentNav = this.navigation.findNavByPath(to.path)

        if (!currentNav) {
          // 경로 변경 시에만 발생하도록 조치
          if (to?.fullPath !== from?.fullPath) {
            this.$ustra.hooks.callHook('management:navigation:updated', null, to)
          }
          return
        }

        const currentMenu = this.navigation.findMenuById(currentNav.id)

        // 경로 변경 시에만 발생하도록 조치
        if (to?.fullPath !== from?.fullPath) {
          this.$ustra.hooks.callHook('management:navigation:updated', currentNav, to)
        }

        // 권한 체크
        if (meta.auth?.required && currentMenu) {
          // 체크하지 않을 경우, 종료
          if (currentMenu.authScopCd === '03') {
            return
          }

          if (!this.auth.hasMenuAuthority(currentMenu.mnuId)) {
            await this.$ustra.auth.inactivate('validate', null, 'user has not authority for current menu.')
            return
          }

          // check ip address
          if ((await this.auth.accessableMenuIpAddress(currentMenu, this.auth.user.accessInfo.userIp)) === false) {
            return
          }

          const mainPath = $ustra.env.appProps.nuxt.management.ui.defaultPage.main.path
          const loginPath = $ustra.env.appProps.auth.loginPath

          // tab menu 사용 시의 direct connect
          if (
            !process.dev &&
            tabMenuConfig.enabled &&
            tabMenuConfig.preventDirectConnectMenuUrl['enabled'] &&
            !pathUtils.isMatchPatterns(to.path, ...(tabMenuConfig.preventDirectConnectMenuUrl['excludeUrlPatterns'] || [])) &&
            !$ustra.utils.router.equalPath(to.path, mainPath) &&
            !$ustra.utils.router.equalPath(to.path, loginPath)
          ) {
            // await this.$ustra.auth.inactivate('validate', null, 'invalid access url.')
            throw createError({
              statusCode: 404,
              message: this.$ustra.message.getMessage('ustra.error.notFoundUrl'),
              statusMessage: 'invalid access url.',
              fatal: true,
            })
          }
        }
      },
      { global: true },
    )
  }

  /**
   * 현재 시스템 코드 조회
   */
  get currentSystemCode() {
    return this.store.initData.currentSystemCode
  }

  /**
   * 서버 어플리케이션 프로퍼티 조회
   */
  get serverAppProps() {
    return this.store.initData.serverAppProps
  }

  /**
   * 프로젝트 어플리케이션 프로퍼티 조회
   */
  get projectAppProps() {
    return this.store.initData.projectProps
  }
}
