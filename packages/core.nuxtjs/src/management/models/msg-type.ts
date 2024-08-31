/**
 * 메시지 유형
 * @packageDocumentation
 */

import { baseModels } from '#ustra/core/data'

/**
 * 메시지 유형 검색 조건
 */
export interface MessageTypeCriteria {
  /**
   * 메시지 유형 ID
   */
  msgTypeId?: string

  /**
   * 메시지 유형명
   */
  msgTypeNm?: string

  /**
   * 프로바이더명
   */
  providerNm?: string

  [propName: string]: any
}

type MessageTypeBase = baseModels.BaseModel & MessageTypeCriteria

/**
 * 메시지 유형
 */
export interface MessageType extends MessageTypeBase {
  /**
   * 메시지 유형 ID
   */
  msgTypeId?: string

  /**
   * 메시지 유형명
   */
  msgTypeNm?: string

  /**
   * 메시지 유형 설명
   */
  msgTypeDesc?: string

  /**
   * 프로바이더명
   */
  providerNm?: string

  /**
   * 속성 목록
   */
  props?: MessageTypeProp[]

  /**
   * 최대 수신자 수
   */
  maxReceiverNum?: number

  /**
   * 참조 사용 여부
   */
  ccUseYn?: string

  /**
   * 숨은 참조 사용 여부
   */
  bccUseYn?: string

  /**
   * 최대 제목 길이
   */
  maxTitleLen?: number

  /**
 * 최대 본문 길이
 */
  maxContentLen?: number

  /**
   * 파일 그룹 아이디
   */
  fileGrpId?: string

  /**
   * 첨부파일 사용 여부
   */
  attachmentUseYn?: string

  /**
   * 첨부파일 최대 사이즈
   */
  attachmentMaxSz?: number

  /**
   * 첨부파일 최대 개수
   */
  attachmentMaxNum?: number

  /**
   * 첨부파일 형식
   */
  attachmentFormat?: string

  /**
   * 재발송 최대 횟수
   */
  resendMaxNum?: number

  [propName: string]: any
}

/**
 * 메시지 유형 속성
 */
export interface MessageTypeProp {
  /**
   * 메시지 유형 ID
   */
  msgTypeId?: string

  /**
   * 속성 키
   */
  propKey?: string

  /**
   * 속성 값
   */
  propVal?: string
}
