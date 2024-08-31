/**
 * 인증 관련 설정
 * @exports Auth
 * @exports defaultProps
 * @packageDocumentation
 */

/**
 * 인증 관련 설정
 */

interface Auth extends Record<string, any> {
  /**
   * 활성화 여부
   * @default false
   */
  enabled?: boolean

  /**
   * 인증 유형
   * @default 'jwt'
   */
  type?: 'jwt' | 'server'

  /**
   * 로그인 Path
   * @default '/login'
   */
  loginPath?: string

  /**
   * 로그인 화면으로 redirect 시 전송할 return page Query Parameter 명
   * @default 'rtnUrl'
   */
  redirectReturnPageParamName?: string

  /**
   * 인증에 실패 처리 유형
   *  redirect : 로그인 페이지로 리다이렉트
   *  error : 에러 발생 (에러 페이지로 이동)
   *  none : hook 발생
   *
   *  @default redirect
   */
  failProcessType?: 'redirect' | 'error' | 'none'

  /**
   * 인증이 만료되었을 경우 처리 유형
   *  logout : 로그아웃 처리
   *  error : 에러 발생 (에러 페이지로 이동)
   *  none : hook 발생
   *
   *  @default logout
   */
  expiredProcessType?: 'logout' | 'error' | 'none'

  /**
   * 에러 처리를 할 경우, 에러 페이지 경로
   */
  errorUrl?: string

  /**
   * 에러 처리를 할 경우, 상태 코드
   * @default 401
   */
  errorStatusCode?: number

  /**
   * 자동 로그아웃(초)
   * @default 0
   */
  autoLogoutSeconds?: number

  /**
   * 인증 처리를 수행하지 않을 URL 적용
   * @default []
   * @see micromatch
   */
  excludeUrlPatterns?: string[]

  /**
   * JWT 상세 옵션
   */
  jwt?: JwtOptions

  /**
   * 인증 중복 설정
   */
  duplication?: DuplicationOptions
}

export interface JwtOptions {
  /**
   * 쿠키 사용 여부
   */
  useCookie?: boolean

  /**
   * 쿠키 Path
   * @default "/"
   * @deprecated use cookieOptions.path
   */
  cookiePath?: string

  /**
   * 쿠키 관련 설정
   */
  cookieOptions?: {
    /**
     * 쿠키 Path
     * @default "/"
     */
    path?: string

    /**
     * 쿠키 도메인
     * @default null
     */
    domain?: string

    /**
     * 쿠키 값을 서버 토큰 저장소와 동기화할 지여부
     * @default false
     */
    syncServer?: boolean

    /**
     * syncServer가 true일 때 동기화를 제외할 URL 패턴 목록
     */
    excludeSyncServerUrlPatterns?: string[]

    /**
     * samesite 설정
     * @default 'None'
     */
    samesite?: 'Lax' | 'None' | 'Strict'

    /**
     * 쿠키 secure 설정
     * @default true
     */
    secure?: boolean
  }

  /**
   * access token key
   */
  accessTokenKey?: string

  /**
   * refresh token key
   */
  refreshTokenKey?: string

  /**
   * 토큰 저장 스토리지 유형
   *  - session : 세션 스토리지
   *  - contextPathSession : context path 기반 세션 스토리지
   *  - local : 로컬 스토리지
   * @default contextPathSession
   */
  tokenStorageType?: 'session' | 'contextPathSession' | 'local'
}

/**
 * 중복 체크 설정
 */
export interface DuplicationOptions {
  /**
   * 중복 인증 체크 유형
   *  - websocket: 웹 소켓
   *  - polling : 폴링
   *  - none: 없음.
   * @default 'none'
   */
  type?: 'websocket' | 'polling' | 'none'

  /**
   * 중복 확인 Path
   */
  checkPath?: string

  /**
   * 폴링 요청 간격
   * @default 10000
   */
  pollingMilliSec?: number
}

export type { Auth }
