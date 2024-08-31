/**
 * morgan 기반 서버 로그 설정 정보
 * @packageDocumentation
 */
import { NodeMiddleWareOption } from './node-middleware'
import { Options } from 'morgan'
import { IncomingMessage, ServerResponse } from 'http'

/**
 * 서버 로깅 옵션
 */
export interface ServerLoggingOption extends NodeMiddleWareOption {
  /**
   * 로깅 포맷
   */
  format?: string

  /**
   * 상세 옵션
   */
  options?: Options<IncomingMessage, ServerResponse>
}
