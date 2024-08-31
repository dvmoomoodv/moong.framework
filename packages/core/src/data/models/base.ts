/**
 * 상태 관리 Base 모델
 */
export interface StateBaseModel extends BaseModel {
  /**
   * 입력 여부
   */
  inserted?: boolean

  /**
   * 수정 여부
   */
  updated?: boolean

  /**
   * 삭제 여부
   */
  deleted?: boolean
}

/**
 * 시스템 필드가 포함된 모델
 */
export interface BaseModel extends Record<string, any> {
  /**
   * 등록일자
   */
  regDttm?: string

  /**
   * 등록 사용자 아이디
   */
  regUsrId?: string

  /**
   * 등록자 아이피
   */
  regUsrIp?: string

  /**
   * 수정일자
   */
  updDttm?: string

  /**
   * 수정자 아이디
   */
  updUsrId?: string

  /**
   * 수정자 아이피
   */
  updUsrIp?: string
}

export type FormMode = 'new' | 'update'

/**
 * 코드와 명을 포함한 모델
 */
export interface CodeNameModel {
  /**
   * 코드
   */
  code?: string

  /**
   * 명
   */
  name?: string
}
