/**
 * 메뉴
 * @exports {@link MenuCriteria} {@link Menu} {@link MenuTreeData} {@link MenuPathText} {@link MenuFunction}
 * @packageDocumentation
 */

import { baseModels } from "#moong/core/data";

/**
 * 메뉴 검색 조건
 */
export interface MenuCriteria extends Record<string, any> {
  /**
   * 시스템 코드
   */
  sysCd?: string;

  /**
   * 사용여부
   */
  useYn?: string;
}

type MenuBase = baseModels.BaseModel & MenuCriteria;

/**
 * 메뉴
 */
export interface Menu extends MenuBase {
  /**
   * 메뉴 아이디
   */
  mnuId?: string;
  /**
   * 상위메뉴 아이디
   */
  uprMnuId?: string;
  /**
   * 시스템코드
   */
  sysCd?: string;
  /**
   * 메뉴 명
   */
  mnuNm?: string;
  /**
   * 메뉴 정렬순서
   */
  mnuSrtNo?: number;
  /**
   * 메뉴 URL
   */
  mnuUrl?: string;
  /**
   * 메뉴 설명
   */
  mnuDesc?: string;
  /**
   * 메뉴(권한) 유형코드
   * - 01 : 일반
   * - 02 : 기능권한
   */
  mnuTyCd?: string;
  /**
   * 사용여부
   */
  useYn?: string;
  /**
   * 삭제여부
   */
  delYn?: string;
  /**
   * 메뉴 레벨
   */
  mnuStepNo?: number;
  /**
   * 메뉴 아이콘 파일 아이디
   */
  iconFileId?: string;

  iconSrc?: string;

  /**
   * 기능 목록
   */
  functions?: MenuFunction[];

  /**
   * 프로그램 아이디 값
   */
  proIdVal?: string;

  /**
   * 아이피 제한 여부
   */
  ipLmtYn?: string;

  /**
   * 아이피 목록
   */
  ipList?: string;

  /**
   * 개인정보 조회 여부
   */
  prvViewYn?: string;

  /**
   * 전시 여부
   */
  dpYn?: string;

  /**
   * 권한 범위 코드
   */
  authScopCd?: string;

  /**
   * 메뉴 디바이스 범위 코드
   */
  mnuDvcScopCd?: string;

  /**
   * 메뉴 가이드 내용
   */
  mnuGuideCont?: string;
}

/**
 * 메뉴 Tree Data
 */
export type MenuTreeData = Menu & {
  /**
   * 하위 그룹 목록
   */
  items?: MenuTreeData[];

  /**
   * 아이콘
   */
  icon?: string;

  /**
   * 확장 여부
   */
  expanded?: boolean;
};

/**
 * 메뉴 상위 그룹 정보
 */
export type MenuPathText = Menu & {
  /**
   * 상위 그룹 정보 텍스트
   */
  pathText?: string;
};

/**
 * 메뉴 기능 모델
 */
export interface MenuFunction extends baseModels.StateBaseModel {
  /**
   * 매뉴 아이디
   */
  mnuId?: string;

  /**
   * 기능아이디
   */
  fncId?: string;

  /**
   * 기능명
   */
  fncNm?: string;

  /**
   * 개인정보조회 여부
   */
  prvViewYn?: string;
}
