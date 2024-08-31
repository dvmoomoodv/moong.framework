/**
 * 인터페이스 정보
 */
export interface InterfaceInfo {
  /**
   * 인터페이스 아이디
   */
  id: string

  /**
   * 인터페이스 버전
   */
  version: string

  /**
   * 인터페이스 명
   */
  name: string

  /**
   * 인터페이스 유형
   */
  type: 'SOAP' | 'DB' | 'MOBILE_BRIDGE' | 'WEB_PAGE' | 'REST_API_JSON' | 'REST_API_XML'

  /**
   * 인터페이스 로깅 유형
   */
  logType: 'ALL' | 'ON_ERROR' | 'ONLY_RESPONSE' | 'ONLY_REQUEST'

  /**
   * 방향 구분
   */
  direction: 'INBOUND' | 'OUTBOUND'

  /**
   * 시스템 코드
   */
  systemCode: string

  /**
   * 비고
   */
  rmk?: string

  /**
   * IP 접근 제한 여부
   */
  limitByIpAddress?: boolean

  /**
   * 접근 가능 IP 주소 목록
   */
  allowedIpAddresses?: boolean

  /**
   * URL
   */
  url?: string

  /**
   * HTTP Method
   */
  httpMethod?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'OPTIONS' | 'HEAD'

  /**
   * 인증 값 존재 시만 허용 여부
   */
  allowedAuthenticated?: boolean

  /**
   * 채널 접근 제한 여부
   */
  limitByChannel?: boolean

  /**
   * 채널 구분 (아웃바운드 시에만 세팅)
   */
  channel?: string

  /**
   * 접근 허용 채널 목록 (인바운드 시에만 세팅)
   */
  allowedChannels?: Array<string>

  /**
   * 인터페이스 키
   */
  keys?: Map<string, string>
}

/**
 * 기본 인터페이스 정보 객체
 */
export const DEFAULT_INTERFACE_INFO: InterfaceInfo = {
  id: null,
  version: null,
  name: null,
  type: 'MOBILE_BRIDGE',
  logType: 'ALL',
  direction: 'OUTBOUND',
  systemCode: null,
  rmk: null,
  limitByIpAddress: false,
  allowedIpAddresses: null,
  url: null,
  httpMethod: null,
  allowedAuthenticated: false,
  limitByChannel: false,
  channel: null,
  allowedChannels: null,
  keys: null,
}

/**
 * 인터페이스 요청 로깅
 */
export interface InterfaceRequestLogging {
  /**
   * 인터페이스 아이디
   */
  id: string

  /**
   * 버전
   */
  version: string

  /**
   * 요청 내용
   */
  requestContent: any

  /**
   * 시스템 코드
   */
  systemCode?: string

  /**
   * 채널 코드
   */
  channelCode?: string
}

/**
 * 인터페이스 응답 로깅
 */
export interface InterfaceResponseLogging {
  /**
   * 로깅 아이디
   */
  loggingId: number

  /**
   * 성공 여부
   */
  success: boolean

  /**
   * 응답 코드
   */
  resCode?: string

  /**
   * 응답 내용
   */
  responseContent?: any
}
