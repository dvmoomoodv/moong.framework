/**
 * 권한 그룹 승인 모델
 * @exports {@link AuthGrpApv} {@link AuthGrpApvUser}
 * @packageDocumentation
 */

import { baseModels } from '#ustra/core/data'

/**
 * 권한 그룹 승인
 */
export interface AuthGrpApv extends baseModels.BaseModel {
  /**
   * 사용자 승인 아이디
   */
  usrApvId?: number
  /**
   * 사용자 승인 권한 그룹 번호
   */
  usrApvAuthGrpNo?: number
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number
  /**
   * 상위 권한 그룹 아이디
   */
  uprAuthGrpId?: number
  /**
   * 권한 그룹 명
   */
  authGrpNm?: string
  /**
   * 정렬 번호
   */
  srtNo?: number
  /**
   * 권한 그룹 설명
   */
  authGrpDesc?: string
  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * 삭제 여부
   */
  delYn?: string
  /**
   * 개인 정보 취급 여부
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
   * 승인 필요 여부
   */
  apvNecYn?: string
  /**
   * 권한 그룹 단계 번호
   */
  authGrpStepNo?: string
  /**
   * 사용자 목록
   */
  users?: AuthGrpApvUser[]
}

/**
 * 권한 그룹 승인 사용자 모델
 */
export interface AuthGrpApvUser extends baseModels.BaseModel {
  /**
   * 사용자 승인 아이디
   */
  usrApvId?: number
  /**
   * 사용자 승인 권한 그룹 번호
   */
  usrApvAuthGrpNo?: number
  /**
   * 사용자 아이디
   */
  usrId?: string
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number
}
