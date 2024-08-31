import { apiModels } from '#ustra/core/data'
import { useRoute } from '#app'
import { Ustra } from '#ustra/nuxt'
import { logger } from '#ustra/nuxt/utils/logger'
import { useUstraLoginService, LoginResult } from '../../../management/services/common/login'
import { useUstraMenuService } from '../../../management/services/menu'
import { UserMenu } from '../../../management/models/user'
import { Menu } from '#ustra/nuxt/management/models/menu'

// @ts-expect-error
import customIpAddressChecker from '#build/ustra/ustra.management.ipaddress.cheker.ts'

/**
 * 백 오피스 사용자 정보
 */
export interface UstraManagementUser extends Record<string, any> {
  /**
   * 인증 사용자 키
   */
  sub?: string

  /**
   * 사용자 명
   */
  userNm?: string

  /**
   * 부서 명
   */
  deptNm?: string
}

/**
 * management 인증 관련 기능
 */
export class UstraManagmentAuth {
  constructor(private $ustra: Ustra) {
    this.init()
  }

  private init() {
    this.$ustra.hooks.hook('auth:activated', async () => {
      await this.$ustra.management.store.navigation.createNavigation()
      await this.$ustra.management.store.navigation.loadUserMenus()
    })

    this.$ustra.hooks.hook('management:auth:authenticated', async result => {
      // add roles
      this.$ustra.auth.store.roles = new Set<string>(result.authorities.map(authority => authority.clientAuthority))

      this.$ustra.management.store.navigation.userMenus = result.userMenus
      await this.$ustra.management.store.navigation.createNavigation()
    })

    this.$ustra.hooks.hook('auth:inactivated', () => {
      if (this.$ustra.auth.store.roles) {
        this.$ustra.auth.store.roles.clear()
      }
    })
  }

  get useAuthApproval() {
    return $ustra.management.store.initData.serverAppProps.authApprovalType !== 'NONE'
  }

  // 비밀번호 미변경 사용일 수
  get passwordChangeDays() {
    return $ustra.management.store.initData.serverAppProps.passwordChangeDays
  }

  // 최대 로그인 실패 수
  get maximumLoginFailNumbers() {
    return $ustra.management.store.initData.serverAppProps.maximumLoginFailNumbers
  }

  // 메인 페이지 URL
  get mainPageUrl() {
    return $ustra.env.appProps.nuxt.management.ui.defaultPage.main.path
  }

  // use tab ui
  get useTabUI() {
    return $ustra.env.appProps.nuxt.management.ui.tabMenu.enabled
  }

  /**
   * 로그인 사용자 정보
   */
  get user() {
    return ($ustra.auth.user || {}) as UstraManagementUser
  }

  /**
   * 로그인 처리
   * @param userId 사용자 아이디
   * @param userPassword 패스워드 혹은 인증 키
   * @param completion 2factor 인증 완료 처리 여부
   * @param callHook 성공 시, hook 호출 여부
   * @returns
   */
  async login(userId, userPassword, completion = false, callHook: boolean = true) {
    const loginService = useUstraLoginService()
    const result = await loginService.login(userId, userPassword, completion)

    return this.nomalizeLoginResult(result, callHook)
  }

  /**
   * 로그인 결과를 표준화 처리
   * @param result
   * @param callHook 성공 시, hook 호출 여부
   * @returns
   */
  async nomalizeLoginResult(result: apiModels.ApiResponse<LoginResult>, callHook: boolean = true) {
    result.body = result.body || {}
    result.body.actionResponse = {}
    result.body.actionResponse.nextPath = this.getNextPath(result.body.userMenus)

    if (result.resultCode === 'FS0F') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'SHOW_DIALOG',
        message: '유효하지 않은 인증 키 입니다.',
      }
      return result
    }

    if (result.resultCode !== '0000') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'SHOW_DIALOG',
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      }
      return result
    }

    if (result.body.resCd === '0000') {
      if (callHook) {
        await this.$ustra.hooks.callHook('management:auth:authenticated', result.body)
      }

      if (this.passwordChangeDays && this.passwordChangeDays < result.body.pwdUnchangedDays) {
        result.body.actionResponse = {
          ...result.body.actionResponse,
          action: 'SUCCESS_RECOMMEND_CHANGE_PASSWORD',
          message: `비밀번호 변경 후, ${this.passwordChangeDays}일이 경과하여, 비밀번호 변경이 필요합니다. 비밀번호를 변경하시겠습니까?`,
        }
        return result
      }

      result.body.actionResponse.action = 'SUCCESS'
      return result
    }

    // 사용 불가 사용자
    if (result.body.resCd === 'FS06') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'SHOW_DIALOG',
        message: `시스템을 사용할 수 없는 사용자입니다.`,
      }
      return result
    }

    // 관리자 승인 중
    if (result.body.resCd === 'FM17') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'SHOW_DIALOG',
        message: `관리자 승인 대기 중 입니다. 승인 완료 후 이용 가능합니다.`,
      }
      return result
    }

    // 접속 불가 지역
    if (result.body.resCd === 'FS04') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'SHOW_DIALOG',
        message: `허용되지 않은 접속 지역입니다.`,
      }
      return result
    }

    // 휴면 또는 시스템 기간 연장
    if (result.body.resCd === 'FS07') {
      if (!this.useAuthApproval) {
        result.body.actionResponse = {
          ...result.body.actionResponse,
          action: 'SHOW_DIALOG',
          message: `시스템 사용 기간이 만료되었습니다. \n관리자에게 문의하시기 바랍니다.`,
        }
      } else {
        result.body.actionResponse = {
          ...result.body.actionResponse,
          action: 'FAIL_REQUIRE_APPROVAL',
          message: `시스템 사용 기간이 만료되었습니다. \n관리자에게 시스템 연장 요청을 진행하시겠습니까?`,
          approvalType: '03',
          approvalName: '휴면해제 승인 요청',
        }
      }
      return result
    }

    // 비밀번호 만료
    if (result.body.resCd === 'FS08') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'REQUIRE_CHANGE_PASSWORD',
        message: `비밀번호 변경 후, 이용 가능합니다.`,
      }
      return result
    }

    // 계정 잠김
    if (result.body.resCd === 'FS09') {
      if (!this.useAuthApproval) {
        result.body.actionResponse = {
          ...result.body.actionResponse,
          action: 'SHOW_DIALOG',
          message: `계정이 잠금 상태입니다. \n관리자에게 문의하시기 바랍니다.`,
        }
      } else {
        result.body.actionResponse = {
          ...result.body.actionResponse,
          action: 'FAIL_REQUIRE_APPROVAL',
          message: `계정이 잠금 상태입니다. \n관리자에게 계정 잠금 해제를 요청하시겠습니까?`,
          approvalType: '01',
          approvalName: '계정 잠김해제 승인 요청',
        }
      }
      return result
    }

    // 인증번호 불일치
    if (result.body.resCd === 'FS0F') {
      result.body.actionResponse = {
        ...result.body.actionResponse,
        action: 'SHOW_DIALOG',
        message: `정확한 인증번호를 입력하세요.`,
      }
      return result
    }

    if (result.body.hasUser) {
      if (this.maximumLoginFailNumbers > 0 && result.body.loginFailCnt >= this.maximumLoginFailNumbers) {
        if (!this.useAuthApproval) {
          result.body.actionResponse = {
            ...result.body.actionResponse,
            action: 'SHOW_DIALOG',
            message: `최대 인증 시도를 초과하여 계정이 잠겼습니다. \n관리자에게 문의하시기 바랍니다.`,
          }
        } else {
          result.body.actionResponse = {
            ...result.body.actionResponse,
            action: 'FAIL_REQUIRE_APPROVAL',
            message: `최대 인증 시도를 초과하여 계정이 잠겼습니다. \n관리자에게 비밀번호 초기화를 요청하시겠습니까?`,
            approvalType: '02',
            approvalName: '비밀번호 초기화 요청',
          }
        }
        return result
      } else if (this.maximumLoginFailNumbers > 0) {
        result.body.actionResponse = {
          ...result.body.actionResponse,
          action: 'SHOW_DIALOG',
          message: `인증이 실패되었습니다. \n최대 인증 시도 ${this.maximumLoginFailNumbers} 건 중 ${result.body.loginFailCnt} 건을 시도하였습니다.`,
        }
        return result
      }
    }

    result.body.actionResponse = {
      ...result.body.actionResponse,
      action: 'SHOW_DIALOG',
      message: '아이디 또는 비밀번호가 일치하지 않습니다.',
    }

    return result
  }

  /**
   * 로그 아웃
   * @param redirect
   */
  async logout(redirect: boolean = false) {
    const loginService = useUstraLoginService()

    await loginService.logout()
    await $ustra.auth.unauthenicate(redirect, false)
  }

  /**
   * 로그인 후 이동할 경로 추출
   */
  getNextPath(userMenus?: UserMenu[]) {
    if (!userMenus) {
      userMenus = this.$ustra.management.navigation.store.userMenus
    }

    if (this.useTabUI) {
      return this.mainPageUrl
    }

    if (useRoute().query.rtnUrl) {
      return useRoute().query.rtnUrl as string
    }

    // if (this.context.$ustra.bo.store.mainData.lastConnectedPath && this.context.$ustra.bo.store.mainData.lastConnectedPath !== this.mainPageUrl) {
    //   return this.context.$ustra.bo.store.mainData.lastConnectedPath
    // }

    let nextUrl = null

    if (userMenus && userMenus.length > 0) {
      const defaultMenu = userMenus.find(um => um.defMnuYn === 'Y')

      if (defaultMenu) {
        nextUrl = defaultMenu.mnuUrl
      } else {
        nextUrl = userMenus.find(um => um.mnuUrl)?.mnuUrl
      }
    }

    return nextUrl || this.mainPageUrl
  }

  /**
   * 사용자 아이디 유효성을 검증한다.
   * @param userId 사용자 아이디
   */
  async validateId(userId: string) {
    const loginService = useUstraLoginService()
    return loginService.validId(userId)
  }

  /**
   * 비밀번호 유효성을 검증한다.
   * @param usrId 사용자 아이디
   * @param password 비밀번호
   * @param oldPassword 기존 비밀번호
   */
  async validatePassword(usrId: string, password: string, oldPassword: string) {
    const loginService = useUstraLoginService()
    return loginService.validPassword(password, oldPassword, usrId)
  }

  // TODO: 실시간 확인 옵션 넣을 것
  /**
   * 메뉴 권한 존재여부 확인
   * @param menuOrProgramId 메뉴 또는 프로그램 아이디
   */
  hasMenuAuthority(menuOrProgramId: string) {
    const authorities = this.$ustra.auth.store.roles

    if (!authorities || authorities.size < 1) {
      return false
    }

    return Array.from(authorities).some(auth => {
      if (!auth) {
        return false
      }

      const auths = auth.split(':')
      if (auths.length < 2) {
        return false
      }

      return auths[0] === menuOrProgramId || auths[1] === menuOrProgramId
    })
  }

  /**
   * 지정된 기능 아이디의 권한이 있는지 확인
   * @param fncId 기능 아이디
   */
  hasFunctionAuthority(functionId: string) {
    const currentMenu = this.$ustra.management.store.navigation.currentProgramMenu

    // 현재 설정된 메뉴가 없을 경우, true 반환
    if (!currentMenu) {
      return true
    }

    const authorities = this.$ustra.auth.store.roles

    if (!authorities) {
      return false
    }

    return Array.from(authorities).some(auth => {
      if (!auth) {
        return false
      }

      const auths = auth.split(':')
      if (auths.length < 2) {
        return false
      }

      return auths[0] === currentMenu.mnuId && auths[2] === functionId
    })
  }

  /**
   * 기능 접근 이력을 추가
   * @param functionId 기능 아이디
   * @returns
   */
  addFunctionAccessHistory(functionId: string) {
    const currentMenu = this.$ustra.management.store.navigation.currentProgramMenu

    // 현재 설정된 메뉴가 없을 경우, true 반환
    if (!currentMenu) {
      alert('현재 접속된 메뉴 정보를 찾을 수 없습니다.')
      return
    }

    const menuService = useUstraMenuService()
    return menuService.addFunctionAccessHistory(currentMenu.mnuId, functionId)
  }

  /**
   * 메뉴에 접근 가능한 IP 여부를 확인한다.
   * @param menu 메뉴 정보
   * @param ipAddress IP 주소
   * @returns
   */
  async accessableMenuIpAddress(currentMenu: Menu, ipAddress: string) {
    if (customIpAddressChecker) {
      logger.debug('run custom ustra.management.ipaddress.cheker')
      const customIpAddressCheckerResult = await customIpAddressChecker(currentMenu, ipAddress)

      if (customIpAddressCheckerResult === true || customIpAddressCheckerResult === false) {
        return customIpAddressCheckerResult
      }
    }

    // check ip address
    if (currentMenu.ipLmtYn === 'Y' && currentMenu.ipList) {
      if (ipAddress === '127.0.0.1') {
        return true
      }
      if (!currentMenu.ipList.split(',').includes(ipAddress)) {
        // tab menu is enabled
        if (this.$ustra.env.appProps.nuxt.management.ui.tabMenu.enabled) {
          // 접속한 IP 주소는 접근이 불가능합니다.
          await alert(this.$ustra.message.getMessage('ustra.management.cannotAccessbleMenuIpAddress'))
        } else {
          await this.$ustra.auth.inactivate('validate', null, 'user connected from not allowed ip address.')
        }

        return false
      }
    }

    return true
  }
}
