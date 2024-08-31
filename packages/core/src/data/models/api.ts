import { PaginationRequest } from './pagination'

/**
 * API 헤더
 */
export interface ApiHeader extends PaginationRequest {
  /**
   * 총 레코드 수
   */
  totalRecords?: number

  /**
   * 채널 코드
   */
  chnlCd?: string

  [key: string]: any
}

/**
 * API 요청
 */
export interface ApiRequest {
  /**
   * 헤더 정보
   */
  header?: ApiHeader

  [key: string]: any
}

/**
 * API 응답
 */
export interface ApiResponse<T = any> {
  /**
   * 헤더 정보
   */
  header?: ApiHeader

  /**
   * 본문
   */
  body?: T

  /**
   * 응답 코드
   */
  resultCode?: string

  /**
   * 결과 메시지
   */
  resultMessage?: string

  /**
   * 상세 에러 내용
   */
  erros?: string[]
}

/**
 *
 * @export
 * @interface ResponseCode
 */
export interface ResponseCode {
  /**
   *
   * @type {string}
   * @memberof ResponseCode
   */
  message?: string

  /**
   *
   * @type {boolean}
   * @memberof ResponseCode
   */
  success?: boolean

  /**
   *
   * @type {string}
   * @memberof ResponseCode
   */
  code?: string
}
