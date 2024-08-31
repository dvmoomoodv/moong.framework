/**
 * 권한 상태
 * @exports {@link AuthSttCriteria} {@link AuthStt}
 * @packageDocumentation
 */

import { baseModels } from "#moong/core/data";

export interface AuthSttCriteria {
  /**
   * 시스템 코드
   */
  sysCd?: string;
  /**
   * 검색 기간 시작 일자
   */
  searchSrtDttm?: Date;
  /**
   * 검색 기간 종료 일자
   */
  searchEndDttm?: Date;

  [propName: string]: any;
}

type AuthSttBase = baseModels.BaseModel & AuthSttCriteria;

export interface AuthStt extends AuthSttBase {
  /**
   * 권한 아이디
   */
  authId?: number;
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number;
  /**
   * 권한 그룹 명
   */
  authGrpNm?: string;
  /**
   * 사용자 아이디
   */
  usrId?: string;
  /**
   * 사용자 명
   */
  usrNm?: string;
  /**
   * 입력 일시
   */
  inpDttm?: Date;
  /**
   * 회사명
   */
  deptNm?: string;
  /**
   * 메뉴 명
   */
  mnuNm?: string;
  /**
   * 메뉴 아이디
   */
  mnuId?: number;
  /**
   * 메뉴 유형코드
   */
  mnuTyCd?: string;
  /**
   * 권한 범위 코드
   */
  authScopCd?: string;
  /**
   * 권한 여부
   */
  authYn?: string;
  /**
   * 작업 구분 코드
   */
  workDvCd?: string;
  /**
   * 권한 유형 코드
   */
  authTyCd?: string;
  /**
   * 사용 시작 일자
   */
  useSrtDt?: string;
  /**
   * 사용 종료 일자
   */
  useEndDt?: string;
  /**
   * 권한 이력 아이디
   */
  authHistId?: number;
  /**
   * 사용자 등록 일시
   */
  usrRegDttm?: Date;
  /**
   * 최종 로그인 일시
   */
  lstLoginDttm?: Date;

  /**
   * 기관 코드
   */
  orgCd?: string;
  /**
   * 사용자 상태 코드
   */
  usrSttCd?: string;
  /**
   * 범위 권한 맵
   */
  scopeAuthMap?: Map<String, Boolean>;
}
