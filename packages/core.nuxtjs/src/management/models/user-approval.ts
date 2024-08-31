/**
 * 사용자 승인 모델
 */

import { baseModels } from '#ustra/core/data'
import { AuthMenuTreeData } from './auth'
import { AuthGrpApvUser } from './auth-group-approval'
import { User } from './user'
import { AuthGroup } from './auth-group'
import { UsrApvTyCd, ApvSttCd } from './common-code'

export interface UserApprovalCriteria {
  /**
   * 사용자 승인 아이디
   */
  usrApvId?: number

  /**
   * 요청 사용자 아이디
   */
  reqUsrId?: string

  /**
   * 요청 사용자 명
   */
  reqUsrNm?: string

  /**
   * 사용자 승인 유형 코드
   */
  usrApvTyCd?: UsrApvTyCd

  /**
   * 승인 상태 코드
   */
  apvSttCd?: ApvSttCd

  /**
   * 승인 요청 시작일
   */
  srtApvReqDt?: string

  /**
   * 승인 요청 종료일
   */
  endApvReqDt?: string

  [propName: string]: any
}

/**
 * 권한 그룹 승인 요청 모델
 */
export interface GroupApproval {
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
   * 권한 그룹 구분
   */
  authGrpDvVal?: string

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
  users?: AuthGrpApvUser[]
}

/**
 * 사용자 승인
 */
export interface UserApproval extends baseModels.BaseModel {
  [key: string]: any

  /**
   * 사용자 승인 아이디
   */
  usrApvId?: number

  /**
   * 요청 사용자 아이디
   */
  reqUsrId?: string

  /**
   * 승인 사용자 아이디
   */
  apvUsrId?: string

  /**
   * 사용자 승인 유형 코드
   */
  usrApvTyCd?: UsrApvTyCd

  /**
   * 승인 상태 코드
   */
  apvSttCd?: ApvSttCd

  /**
   * 승인요청일시
   */
  apvReqDttm?: string

  /**
   * 승인처리일시
   */
  apvPrcDttm?: string

  /**
   * 승인 요청 의견
   */
  apvReqOpnCont?: string

  /**
   * 승인 의견
   */
  apvOpnCont?: string

  /**
   * 요청자 이메일
   */
  reqUsrEmail?: string

  /**
   * 요청자 회사명
   */
  reqUsrDeptNm?: string

  /**
   * 요청자 명
   */
  reqUsrNm?: string

  /**
   * 승인 시 패스워드 초기화 여부 (잠김해제일 경우만 사용 됨)
   */
  resetPassword?: boolean

  /**
   * 추가 정보 값
   */
  addInfoVal?: boolean

  /**
   * 대상 사용자 아이디
   */
  usrId?: string

  /**
   * 대상 사용자 아이디
   */
  targetUsrNm?: string

  /**
   * 권한 요청 정보
   */
  authApproval?: {
    /**
     * 권한 아이디
     */
    authId?: number

    /**
     * 사용 시작일
     */
    useSrtDt?: string

    /**
     * 사용 종료일
     */
    useEndDt?: string

    /**
     * 사용자 권한 그룹 삭제 여부
     */
    usrAuthGrpDelYn?: string

    /**
     * 메뉴별 권한 목록
     */
    menus?: AuthMenuTreeData[]
  }

  authApprovalDetail?: {
    /**
     * 권한 아이디
     */
    authId?: number

    /**
     * 사용 시작일
     */
    useSrtDt?: string

    /**
     * 사용 종료일
     */
    useEndDt?: string

    /**
     * 권한 유형 코드
     */
    authTyCd?: string

    /**
     * 사용자 아이디
     */
    usrId?: string

    /**
     * 권한 그룹 명
     */
    authGrpNm?: string

    /**
     * 사용자 명
     */
    usrNm?: string

    /**
     * 메뉴별 권한 목록
     */
    menus?: AuthMenuTreeData[]
  }
  /**
   * 사용자 상태 승인 정보
   */
  usrSttApproval?: {
    /**
     * 사용자 승인 아이디
     */
    usrApvId?: string
    /**
     * 사용자 상태 코드
     */
    usrSttCd?: string
    /**
     * 비밀번호 초기화 여부
     */
    pwdResetYn?: string
    /**
     * 사용자 아이디
     */
    usrId?: string

    users?: User
  }

  /**
   * 권한 그룹 삭제 여부
   */
  authGrpDelYn?: string

  /**
   * 권한 그룹 승인 모델
   */
  authGrpApproval?: GroupApproval

  /**
   * 그룹 사용자 배정 승인 모델
   */
  authorityGrpApprovalList?: GroupApproval[]
}
