/**
 * 배치
 * @exports {@link Batch} {@link BatchCriteria}
 * @packageDocumentation
 */

import { baseModels, apiModels } from '#ustra/core/data'

/**
 * 배치 검색 조건
 */
export interface BatchCriteria {
  /**
   * 배치 아이디
   */
  batId?: string
  /**
   * 배치 명
   */
  batNm?: string

  [propName: string]: any
}

type BatchBase = baseModels.BaseModel & BatchCriteria

export interface Batch extends BatchBase {
  /**
   * 배치 아이디
   */
  batId?: string
  /**
   * 배치 명
   */
  batNm?: string
  /**
   * 배치 설명
   */
  batDesc?: string
  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * 스케줄 구분 코드
   */
  schdlDvCd?: string
  /**
   * 스케줄 값
   */
  schdlVal?: string
  /**
   * 중복 실행 가능 여부
   */
  dupExecAvlYn?: string
  /**
   * 지연 시간(S)
   */
  dlyS?: number
  /**
   * 배치 인스턴스 코드
   */
  batInstCd?: string[]
  /**
   * 배치 인스턴스
   */
  insts?: BatchInst[]

  /**
   * 즉시 변경 여부
   */
  immediateStartYn?: string
}

/**
 *
 * @export
 * @interface UstraBatchRqVo
 */
export interface UstraBatchRqVo {
  /**
   *
   * @type {ApiHeader}
   * @memberof UstraBatchRqVo
   */
  header?: apiModels.ApiHeader

  /**
   *
   * @type {Batch}
   * @memberof UstraBatchRqVo
   */
  batch?: Batch
}

/**
 *
 * @export
 * @interface UstraBatchOneRqVo
 */
export interface UstraBatchOneRqVo {
  /**
   *
   * @type {ApiHeader}
   * @memberof UstraBatchOneRqVo
   */
  header?: apiModels.ApiHeader

  /**
   *
   * @type {string}
   * @memberof UstraBatchOneRqVo
   */
  batId?: string
}

/**
 * 배치 매니저 검색 조건
 */
export interface BatchManagerCriteria extends Record<string, any> {
  /**
   * 배치 매니저 아이디
   */
  managerId?: string
}

/**
 * 배치 매니저
 */
export interface BatchManager extends baseModels.BaseModel {
  /**
   * 매니저 아이디
   */
  managerId?: string

  endpoint?: string

  /**
   * 마스터 여부
   */
  master?: boolean

  /**
   * 활성화 여부
   */
  enabled?: boolean
}

/**
 *
 * @export
 * @interface UstraBatchManagerRqVo
 */
export interface UstraBatchManagerRqVo {
  /**
   *
   * @type {ApiHeader}
   * @memberof UstraBatchManagerRqVo
   */
  header?: apiModels.ApiHeader

  /**
   *
   * @type {BatchManager}
   * @memberof UstraBatchManagerRqVo
   */
  batchManager?: BatchManager
}

/**
 * 배치 워커 검색 조건
 */
export interface BatchWorkerCriteria {
  /**
   * 배치 매니저 아이디
   */
  workerId?: string

  endpoint?: string

  [propName: string]: any
}

type BatchWorkerBase = baseModels.BaseModel & BatchWorkerCriteria

export interface BatchWorker extends BatchWorkerBase {
  /**
   * 매니저 아이디
   */
  workerId?: string

  endpoint?: string

  capacity?: number

  enabled?: boolean

  createDate?: Date

  createUser?: string

  createUserIp?: string

  modifyDate?: Date

  modifyUser?: string

  modifyUserIp?: string
}

/**
 *
 * @export
 * @interface UstraBatchWorkerRqVo
 */
export interface UstraBatchWorkerRqVo {
  /**
   *
   * @type {ApiHeader}
   * @memberof UstraBatchWorkerRqVo
   */
  header?: apiModels.ApiHeader

  /**
   *
   * @type {BatchWorker}
   * @memberof UstraBatchWorkerRqVo
   */
  batchWorker?: BatchWorker
}

/**
 * 배치 인스턴스
 */
export interface BatchInst extends baseModels.BaseModel {
  /**
   * 배치 아이디
   */
  batId?: string
  /**
   * 배치 인스턴스 코드
   */
  batInstCd?: string
  /**
   * 배치 상태 코드
   */
  batSttCd?: string
  /**
   * 최종 시작 일시
   */
  lstSrtDttm?: string
  /**
   * 최종 종료 일시
   */
  lstEndDttm?: string
  /**
   * 최종 성공 여부
   */
  lstSuccYn?: string
}

/**
 * 배치 이력 검색 조건
 */
export interface BatchHistCriteria {
  /**
   * 배치 이력 아이디
   */
  batHistId?: string
  /**
   * 배치 아이디
   */
  batId?: string
  /**
   * 배치 명
   */
  batNm?: string
  /**
   * 기간 시작일시
   */
  periodSrtDttm?: string
  /**
   * 기간 종료일시
   */
  periodEndDttm?: string

  [propName: string]: any
}

type BatchHistBase = baseModels.BaseModel & BatchHistCriteria

/**
 * 배치 이력
 */
export interface BatchHist extends BatchHistBase {
  /**
   * 배치 이력 아이디
   */
  batHistId?: string
  /**
   * 배치 아이디
   */
  batId?: string
  /**
   * 배치 명
   */
  batNm?: string
  /**
   * 시작 일시
   */
  srtDttm?: Date
  /**
   * 종료 일시
   */
  endDttm?: Date
  /**
   * 성공 여부
   */
  succYn?: string
  /**
   * 오류 메시지
   */
  errMsg?: string
  /**
   * 배치 인스턴스 코드
   */
  batInstCd?: string
  /**
   * 로깅 파일 경로
   */
  logFilePath?: string
}

/**
 *
 * @export
 * @interface UstraBatchHistOneRqVo
 */
export interface UstraBatchHistOneRqVo {
  /**
   *
   * @type {ApiHeader}
   * @memberof UstraBatchHistOneRqVo
   */
  header?: apiModels.ApiHeader

  /**
   *
   * @type {string}
   * @memberof UstraBatchHistOneRqVo
   */
  batHistId?: string
}
