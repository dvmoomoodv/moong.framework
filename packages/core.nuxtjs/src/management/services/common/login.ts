import { defineUstraService } from '#ustra/nuxt/composables'
import { apiModels } from '#ustra/core/data'
import { UserMenu } from '#ustra/nuxt/management'

/**
 * 백오피스 로그인 및 계정 연계 서비스
 */
export const useUstraLoginService = defineUstraService(({ api }) => {
  /**
   * 로그인 처리
   * @param userId 사용자아이디
   * @param userPw 사용자 패스워드
   * @param completion 2차 인증 여부
   */
  async function login(userId: string, userPw: string, completion = false) {
    if (!completion) {
      const result = await api.call<apiModels.ApiResponse<LoginResult>>({
        url: `/api/authentication/login`,
        method: 'POST',
        passOnResponseError: true,
        secured: true,
        data: {
          userName: userId,
          userId,
          userPw,
          // encAccount: encryptAes256(JSON.stringify({ userId, userPw }), process.env.SERVER_PROP_ENC_KEY),
          // authSysCd: this.$ustra.store.config().appProp.serverAppProp.systemCode,
        },
      })

      return result.data
    } else {
      const result = await api.call<apiModels.ApiResponse<LoginResult>>({
        url: `/api/authentication/login-complete`,
        method: 'POST',
        passOnResponseError: true,
        secured: true,
        data: {
          userId,
          authenticationKey: userPw,
        },
      })

      return result.data
    }
  }

  /**
   * 로그아웃 처리
   */
  async function logout() {
    if (!process.server) {
      await api.cancel()
    }
    const result = await api.call<apiModels.ApiResponse<string>>({
      url: `/api/authentication/logout`,
      method: 'POST',
      passOnResponseError: true,
      data: {},
    })

    return result.data.body
  }

  /**
   * 패스워드 변경 처리 (로그인 전)
   * @param $core
   * @param usrId 아이디
   * @param oldPwd 패스워드
   * @param newPwd 신규 패스워드
   */
  async function updatePassword(usrId: string, oldPwd: string, newPwd: string) {
    const result = await api.call<apiModels.ApiResponse<string>>({
      url: `/api/authentication/edit-password`,
      secured: true,
      method: 'POST',
      data: { usrId, oldPwd, newPwd },
    })

    return result.data
  }

  /**
   * 아이디 검증
   * @param userId 사용자 아이디
   * @returns 검증 결과
   */
  async function validId(userId: string) {
    const result = await api.call<apiModels.ApiResponse<ValidationResult>>({
      url: `/api/authentication/validate/id`,
      method: 'GET',
      secured: true,
      params: {
        userId,
      },
    })

    return result.data.body
  }

  /**
   * 비밀번호 검증
   * @param password 비밀번호
   * @param oldPassword 기존 비밀번호
   * @param userId 사용자 아이디
   * @returns 검증 결과
   */
  async function validPassword(password: string, oldPassword: string, userId: string) {
    const result = await api.call<apiModels.ApiResponse<ValidationResult>>({
      url: `/api/authentication/validate/password`,
      method: 'GET',
      secured: false,
      showLoadingBar: false,
      params: {
        password,
        oldPassword,
        userId,
      },
    })

    return result.data.body
  }

  return { login, logout, updatePassword, validId, validPassword }
})

/**
 * 로그인 결과
 */
export interface LoginResult extends Record<string, any> {
  /**
   * 인증 여부
   */
  isAuthenticated?: boolean

  /**
   * 사용자 조회 여부
   */
  hasUser?: boolean

  /**
   * 사용자 키
   */
  usrKey?: string

  /**
   * 중복인증 제어 값
   */
  duplicationKey?: string

  /**
   * 사용자 명
   */
  userName?: string

  /**
   * 조직 명
   */
  orgNm?: string

  /**
   * 부서 코드
   */
  deptCd?: string

  /**
   * 부서 명
   */
  deptNm?: string

  /**
   * 패스워드 초기화 여부
   */
  resetPassword?: boolean

  /**
   * 로그인 실패 수
   */
  loginFailCnt?: number

  /**
   * 비밀번호 미변경 일수
   */
  pwdUnchangedDays?: number

  /**
   * 응답 코드
   */
  resCd?: string

  /**
   * 사용자 메뉴 목록
   */
  userMenus?: UserMenu[]

  /**
   * 권한 목록
   */
  authorities?: Authority[]

  /**
   * 인증 완료 여부
   */
  completed?: boolean

  /**
   * 후 처리 Action 구분
   */
  actionResponse?: {
    /**
     * 후처리 Action 구분
     *  - SUCCESS : 성공
     *  - SHOW_DIALOG : 메시지에 따른 대화창 표시
     *  - REQUIRE_CHANGE_PASSWORD : 로그인 성공 후 패스워드 변경 (필수)
     *  - SUCCESS_RECOMMEND_CHANGE_PASSWORD : 로그인 성공 후 패스워드 변경 (추천)
     *  - FAIL_REQUIRE_APPROVAL : 실패 후 승인 요청 필요
     */
    action?: 'SUCCESS' | 'SHOW_DIALOG' | 'REQUIRE_CHANGE_PASSWORD' | 'SUCCESS_RECOMMEND_CHANGE_PASSWORD' | 'FAIL_REQUIRE_APPROVAL'

    /**
     * 표시 메시지
     */
    message?: string

    /**
     * 승인 요청 유형
     */
    approvalType?: string

    /**
     * 승인 요청 명
     */
    approvalName?: string

    /**
     * 성공 시 이동할 화면
     */
    nextPath?: string
  }
}

/**
 * 권한 정보
 */
export interface Authority {
  /**
   * 메뉴 아이디
   */
  menuId?: string

  /**
   * 프로그램 아이디
   */
  programId?: string

  /**
   * function id
   */
  functionId?: string

  /**
   * 클라이언트 인증용 권한
   */
  clientAuthority?: string
}

/**
 * 아이디/비밀번호 검증 결과
 */
export interface ValidationResult {
  /**
   * 성공 여부
   */
  valid?: boolean

  /**
   * 실패 메시지
   */
  invalidMessage?: string
}
