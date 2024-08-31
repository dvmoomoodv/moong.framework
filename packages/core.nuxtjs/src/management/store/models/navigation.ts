import { Menu } from "#moong/nuxt/management/models/menu";

/**
 * 프로그램 메뉴 정보
 */
export type ProgramMenu = Menu & { mnuFullNm?: string; parentMenus?: Menu[] };

/**
 * 메뉴 navigation 정보
 */
export interface Navigation {
  /**
   * navigation id
   */
  id?: string;

  /**
   * 프로그램 아이디
   */
  prgId?: string;

  /**
   * 명칭
   */
  text?: string;

  /**
   * 경로
   */
  path?: string;

  /**
   * 아이콘
   */
  icon?: string;

  /**
   * 아이콘 경로
   */
  iconSrc?: string;

  /**
   * 활성화 여부
   */
  active?: boolean;

  /**
   * tab 활성화 여부
   */
  activeTab?: boolean;

  /**
   * 표시 여부
   */
  display?: boolean;

  /**
   * 노출 여부
   */
  show?: boolean;

  /**
   * 하위 아이템 목록
   */
  items?: Navigation[];

  /**
   * 상위 navigation
   */
  parent?: Navigation;

  /**
   * 즐겨 찾기 메뉴 여부
   */
  favorite?: boolean;

  /**
   * 감지를 위한 dummy 값
   */
  ts?: any;

  /**
   * navigation 표시여부
   */
  visible?: boolean;

  /**
   * 컴포넌트 정보
   */
  component?: any;

  /**
   * 즐겨찾기의 경우 원본 메뉴 아이디
   */
  originId?: string;
}
