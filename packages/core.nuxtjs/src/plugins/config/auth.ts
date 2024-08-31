/**
 * meta auth
 * @packageDocumentation
 */
import { Ustra } from '../ustra'
import { RouteLocationNormalized } from 'vue-router'

/**
 * 인증 메타 설정
 */
export interface UstraAuthMeta extends Record<string, any> {
  /**
   * 인증 필요 여부
   *  - true : 인증 완료 필요
   *  - false : 불필요
   *  - exits : 인증은 완료되지 않았으나 사용자 정보 존재
   *  @default false
   */
  required?: boolean | 'exists'

  /**
   * 필요 역할 목록
   */
  roles?: string[]

  /**
   * 인증 정보 validation
   */
  validateAuthentication?: ($ustra: Ustra, to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean | void | Promise<boolean | void>
}
