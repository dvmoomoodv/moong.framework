/**
 * 권한
 * @packageDocumentation
 */

import { baseModels } from '#ustra/core/data'
import { Menu, MenuFunction } from './menu'

/**
 * 권한
 */
export interface Auth extends baseModels.BaseModel {
  /**
   * 권한 아이디
   */
  authId?: number
  /**
   * 권한 그룹 아이디
   */
  authGrpId?: number

  /**
   * 사용자 아이디
   */
  usrId?: string

  /**
   * 권한 유형 코드
   */
  authTyCd?: string

  /**
   * 사용 시작일
   */
  useSrtDt?: string

  /**
   * 사용 종료일
   */
  useEndDt?: string

  /**
   * 메뉴별 권한 목록
   */
  menus?: AuthMenuTreeData[]

  /**
   * 권한 그룹 삭제 여부
   */
  authGrpDelYn?: string

  /**
   * 추가 역할 목록 값
   */
  addRolListVal?: string
}

/**
 * 권한 메뉴
 */
export interface AuthMenu extends Menu {
  /**
   * 권한 적용 여부
   */
  authYn?: string

  /**
   * functions
   */
  authFncs?: AuthMenuFunction[]
}

/**
 * 권한 메뉴 기능
 */
export interface AuthMenuFunction extends MenuFunction {
  /**
   * 권한 적용 여부
   */
  authYn?: string
}

/**
 * 권한 메뉴 트리데이터
 */
export type AuthMenuTreeData = AuthMenu & {
  /**
   * 하위 목록
   */
  items?: AuthMenuTreeData[]

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
}
