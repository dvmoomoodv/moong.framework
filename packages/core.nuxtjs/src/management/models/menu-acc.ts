/**
 * 메뉴 접근 이력
 * @exports {@link MenuAccessCriteria} {@link MenuAccess} {@link MenuFunctionAccess}
 * @packageDocumentation
 */

import { baseModels, paginationModels } from '#ustra/core/data'

/**
 * 검색 조건
 */
export interface MenuAccessCriteria {
  /**
   * 페이징 요청 정보
   */
  paginationRequest?: paginationModels.PaginationRequest

  /**
   * 검색 기간 시작 일자
   */
  searchSrtDttm?: Date
  /**
   * 검색 기간 종료 일자
   */
  searchEndDttm?: Date
  /**
   * 사용자 아이디 또는 명
   */
  usrIdOrNm?: string
  /**
   * 메뉴 명
   */
  mnuNm?: string

  [propName: string]: any
}

/**
 * 메뉴 접근 이력
 */
export interface MenuAccess extends baseModels.BaseModel {
  /**
   * 메뉴 접근 이력 아이디
   */
  mnuAccId?: number
  /**
   * 메뉴 아이디
   */
  mnuId?: string
  /**
   * 사용자 아이디
   */
  usrId?: string
  /**
   * 프로세스 아이디
   */
  procId?: string

  /**
   * 요청 아이디
   */
  reqId?: string
  /**
   * 메뉴 URL
   */
  mnuUrl?: string
  /**
   * 사용자 명
   */
  usrNm?: string
  /**
   * 메뉴 명
   */
  mnuNm?: string
}

/**
 * 메뉴 기능 접근 이력
 */
export interface MenuFunctionAccess extends baseModels.BaseModel {
  /**
   * 메뉴 기능 접근 아이디
   */
  mnuFncAccId: number

  /**
   * 메뉴 아이디
   */
  mnuId: string

  /**
   * 기능 아이디
   */
  fncId: string

  /**
   * 사용자 아이디
   */
  usrId: string

  /**
   * 요청 아이디
   */
  reqId: string

  /**
   * 프로세스 아이디
   */
  procId: string
}
