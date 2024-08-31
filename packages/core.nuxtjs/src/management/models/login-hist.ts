/**
 * 로그인 이력
 * @exports {@link LoginHistCriteria} {@link LoginHist}
 * @packageDocumentation
 */

import { baseModels } from "#moong/core/data";

/**
 * 로그인 이력 검색 조건
 */
export interface LoginHistCriteria {
  /**
   * 시스템 코드
   */
  sysCd?: string;
  /**
   * 사용자 아이디
   */
  usrId?: string;
  /**
   * 사용자 명
   */
  usrNm?: string;
  /**
   * 검색 기간 시작 일자
   */
  searchSrtDttm?: Date;
  /**
   * 검색 기간 종료 일자
   */
  searchEndDttm?: Date;
  /**
   * 차트 종류
   */
  chartType?: string;

  [propName: string]: any;
}

type LoginHistBase = baseModels.BaseModel & LoginHistCriteria;

/**
 * 로그인 이력
 */
export interface LoginHist extends LoginHistBase {
  /**
   * 로그인 이력 아이디
   */
  loginHistId?: number;
  /**
   * 사용자 아이디
   */
  usrId?: string;
  /**
   * 사용자 키
   */
  usrKey?: string;
  /**
   * 시스템 코드
   */
  sysCd?: string;
  /**
   * 사용자 명
   */
  usrNm?: string;
  /**
   * 접근 아이피
   */
  accIp?: string;
  /**
   * 회사명
   */
  deptNm?: string;
  /**
   * 로그인 일시
   */
  loginDttm?: Date;
  /**
   * 로그아웃 일시
   */
  logotDttm?: Date;
  /**
   * 응답 코드 값
   */
  resCdVal?: string;
  /**
   * 프로세스 아이디
   */
  procId?: string;
  /**
   * 요청 아이디
   */
  reqId?: string;

  /**
   * 접속 횟수
   */
  accCnt?: number;

  /**
   * 최종 로그인 시간
   */
  lstLoginDttm?: Date;
  /**
   * 최초 로그인 시간
   */
  firstLoginDttm?: Date;

  /**
   * 로그인 시간
   */
  loginHour?: string;

  /**
   * 로그인 수
   */
  loginCnt?: number;

  /**
   * formatted 로그인 시간
   */
  formatLoginDttm?: string;

  /**
   * formatted 로그아웃 시간
   */
  formatLogotDttm?: string;

  /**
   * 사용 시간
   */
  useTime?: string;
}
