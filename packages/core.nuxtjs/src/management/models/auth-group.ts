/**
 * 권한 그룹
 * @exports {@link AuthGroupCriteria} {@link AuthGroup} {@link AuthGroupTreeData} {@link AuthGroupPathText} {@link AuthGroupUser} {@link AuthGroupUserRequestTaretGroup}
 * @packageDocumentation
 */

import { baseModels } from '#ustra/core/data'

/**
 * 권한 그룹 검색 조건
 */
export interface AuthGroupCriteria extends Partial<AuthGroup> {}

/**
 * 권한 그룹
 */
export interface AuthGroup extends baseModels.BaseModel {
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number

  /**
   * 상위 권한 그룹 아이디
   */
  uprAuthGrpId?: number

  /**
   * 권한 그룹 구분
   */
  authGrpDvVal?: string

  /**
   * 권한 그룹 명
   */
  authGrpNm?: string

  /**
   * 권한 그룹 설명
   */
  authGrpDesc?: string

  /**
   * 정렬 순번
   */
  srtNo?: number

  /**
   * 사용 여부
   */
  useYn?: string

  /**
   * 삭제 여부
   */
  delYn?: string

  /**
   * 개인 정보 접근 가능 여부
   */
  prvTrtYn?: string

  /**
   * 시스템 코드
   */
  sysCd?: string

  /**
   * 승인 그룹 여부
   */
  apvGrpYn?: string

  /**
   * 권한 변경 시, 승인 필요 여부
   */
  apvNecYn?: string

  /**
   * 권한 그룹 레벨
   */
  authGrpStepNo?: number

  /**
   * 추가 역할 목록 값
   */
  addRolListVal?: string

  /**
   * 사용 구분 코드 목록 값
   */
  useDvCdListVal?: string

  /**
   * 승인 권한 그룹 목록
   */
  apvAuthGrps?: AuthGroup[]

  /**
   * 사용자 목록
   */
  users?: AuthGroupUser[]

  /**
   * 요청 대상 그룹 목록
   */
  requetTargetGroups?: AuthGroupUserRequestTaretGroup[]
}

/**
 * 권한 그룹 Tree Data
 */
export type AuthGroupTreeData = AuthGroup & {
  /**
   * 하위 그룹 목록
   */
  items?: AuthGroupTreeData[]

  /**
   * 아이콘
   */
  icon?: string

  /**
   * 확장 여부
   */
  expanded?: boolean

  /**
   * 선택 여부
   */
  selected?: boolean

  /**
   * 비활성화 여부
   */
  disabled?: boolean
}

/**
 * 권한 그룹 상위 그룹 정보
 */
export type AuthGroupPathText = AuthGroup & {
  /**
   * 상위 그룹 정보 텍스트
   */
  pathText?: string
}

/**
 * 권한 그룹 사용자
 */
export interface AuthGroupUser extends baseModels.BaseModel {
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number

  /**
   * 사용자 아이디
   */
  usrId?: string
}

/**
 * 권한 그룹 사용자 요청 대상 그룹
 */
export interface AuthGroupUserRequestTaretGroup extends baseModels.BaseModel {
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number

  /**
   * 요청 권한 그룹 아이디
   */
  reqAuthGrpId?: number

  /**
   * 요청 권한 그룹 구분자 값
   */
  reqAuthGrpDvVal?: string

  /**
   * 요청 권한 그룹 명
   */
  reqAuthGrpNm?: string
}
