/**
 * 메시지
 * @packageDocumentation
 */

import { apiModels, baseModels } from '#ustra/core/data'

/**
 * 메시지 검색 조건
 */
export interface MessageCriteria {
  /**
   * 메시지 ID
   */
  msgId?: number

  /**
   * 메시지 타입 ID
   */
  msgTypeId?: string

  /**
   * 상태
   */
  msgSttCd?: string

  /**
   * 제목
   */
  title?: string

  /**
   * 발신자
   */
  source?: string

  /**
   * 수신자
   */
  target?: string

  /**
   * 발송 요청 일시 시작일
   */
  startSendRqDt?: string

  /**
   * 발송 요청 일시 종료일
   */
  endSendRqDt?: string

  [propName: string]: any
}

type MessageBase = baseModels.BaseModel & MessageCriteria

/**
 * 메시지
 */
export interface Message extends MessageBase {
    /**
   * 메시지 ID
   */
  msgId?: number

  /**
   * 메시지 타입 ID
   */
  msgTypeId?: string

  /**
   * 상태
   */
  msgSttCd?: string

  /**
   * 발송 요청 일시
   */
  sendRqDttm?: Date

  /**
   * 발송 완료 일시
   */
  sendCpDttm?: Date

  /**
   * 취소 요청 일시
   */
  cancelRqDttm?: Date

  /**
   * 취소 완료 일시
   */
  cancelCpDttm?: Date

  /**
   * 재발송 요청 횟수
   */
  resendRqNum?: number

  /**
   * 제목
   */
  title?: string

  /**
   * 내용
   */
  content?: string

  /**
   * 발신자
   */
  source?: string

  /**
   * 참조
   */
  cc?: string

  /**
   * 숨은 참조
   */
  bcc?: string

  /**
   * 첨부 파일 아이디
   */
  fileId?: string

  [propName: string]: any
}

/**
 *
 * @export
 * @interface MessageRqVo
 */
export interface MessageRqVo {
  /**
   *
   * @type {ApiHeader}
   * @memberof MessageRqVo
   */
  header?: apiModels.ApiHeader

  /**
   *
   * @type {Message}
   * @memberof MessageRqVo
   */
  msg?: Message

  sendRqDt? : string
}