/**
 * 어플리케이션 상태 모델
 * @exports {@link AppSttCriteria} {@link AppStt} {@link AppSttMenu}
 * @packageDocumentation
 */

import { baseModels } from "#moong/core/data";

/**
 * 어플리케이션 상태 검색 조건
 */
export interface AppSttCriteria extends Record<string, any> {
  /**
   * 시스템 코드
   */
  sysCd?: string;
  /**
   * 상태 유형 코드
   */
  sttTyCd?: string;
}

type AppSttBase = baseModels.BaseModel & AppSttCriteria;

/**
 * 어플리케이션 상태 모델
 */
export interface AppStt extends AppSttBase {
  /**
   * 어플리케이션 상태 아이디
   */
  appSttId?: number;
  /**
   * 적용 시작 일시
   */
  aplySrtDttm?: Date;
  /**
   * 적용 종료 일시
   */
  aplyEndDttm?: Date;
  /**
   * 상태 유형 코드
   */
  sttTyCd?: string;
  /**
   * 접속 허용 아이피 목록
   */
  accAlwIpList?: string;
  /**
   * 사용 여부
   */
  useYn?: string;
  /**
   * 제목
   */
  title?: string;
  /**
   * 리다이렉트 URL
   */
  redtUrl?: string;
  /**
   * 제어 범위 유형 코드
   */
  ctrlScopTyCd?: string;
  /**
   * 범위 URL
   */
  scopUrl?: string;
  /**
   * 노출 메시지
   */
  expsMsg?: string;
  /**
   * 시스템 코드
   */
  sysCd?: string;

  /**
   * 메뉴 키 목록
   */
  menus?: AppSttMenu[];
}

/**
 * 어플리케이션 상태 메뉴 모델
 */
export interface AppSttMenu extends baseModels.StateBaseModel {
  /**
   * 메뉴 아이디
   */
  mnuId: number;

  /**
   * 어플리케이션 상태 아이디
   */
  appSttId?: number;
}
