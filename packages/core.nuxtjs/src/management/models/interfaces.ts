/**
 * 인터페이스
 * @exports {@link IfsChnl} {@link IfsKey} {@link IfsHistCriteria} {@link IfsHist} {@link IfsCriteria} {@link Ifs}
 * @packageDocumentation
 */

import { baseModels, apiModels } from '#ustra/core/data'

/**
 * 인터페이스 채널
 */
export interface IfsChnl extends baseModels.StateBaseModel {
  /**
   * 인터페이스 아이디
   */
  ifId: string

  /**
   * 인터페이스 버전
   */
  ifVer: string

  /**
   * 인터페이스 채널코드
   */
  chnlCd: string
}

//#region 인터페이스 이력

/**
 * 인터페이스 이력 검색 조건
 */
export interface IfsHistCriteria extends apiModels.ApiRequest {
  searchValue: {
    /**
     * 인터페이스 이력 아이디
     */
    ifHistId?: number
    /**
     * 프로세스 아이디
     */
    procId?: string
    /**
     * 요청 아이디
     */
    reqId?: string
    /**
     * 인터페이스 아이디
     */
    ifId?: string
    /**
     * 시스템 코드
     */
    sysCd?: string
    /**
     * 채널 코드
     */
    chnlCd?: any
    /**
     * url
     */
    url?: string
    /**
     * 성공 여부
     */
    succYn?: string
    /**
     * 응답 코드 값
     */
    resCdVal?: string
    /**
     * 검색 기간 시작 일자
     */
    searchSrtDttm?: Date
    /**
     * 검색 기간 종료 일자
     */
    searchEndDttm?: Date

    [propName: string]: any
  }

  [propName: string]: any
}

type IfsHistBase = baseModels.BaseModel & IfsHistCriteria

/**
 * 인터페이스 이력
 */
export interface IfsHist extends IfsHistBase {
  /**
   * 인터페이스 이력 아이디
   */
  ifHistId?: number
  /**
   * 프로세스 아이디
   */
  procId?: string
  /**
   * 요청 아이디
   */
  reqId?: string
  /**
   * 요청 번호
   */
  reqNo?: number
  /**
   * 인터페이스 아이디
   */
  ifId?: string
  /**
   * 인터페이스 버전
   */
  ifVer?: string
  /**
   * 인터페이스 명
   */
  ifNm?: string
  /**
   * 시스템 코드
   */
  sysCd?: string
  /**
   * 채널 코드
   */
  chnlCd?: any
  /**
   * 비고
   */
  rmk?: string
  /**
   * url
   */
  url?: string
  /**
   * http 메소드 코드
   */
  httpMethCd?: string
  /**
   * 성공 여부
   */
  succYn?: string
  /**
   * 응답 코드 값
   */
  resCdVal?: string
  /**
   * http 상태 코드 값
   */
  httpSttCdVal?: string
  /**
   * 요청 메시지 내용
   */
  reqMsgCont?: string
  /**
   * 응답 메시지 내용
   */
  resMsgCont?: string
  /**
   * 사용자 아이디
   */
  usrId?: string
  /**
   * 사용자 키
   */
  usrKey?: string
  /**
   * 프로세스 시간
   */
  procMs?: number
  /**
   * 요청 헤더 내용
   */
  reqHedCont?: string
  /**
   * 요청 파파라메터 내용
   */
  reqPrmCont?: string
  /**
   * 응답 헤더 내용
   */
  resHedCont?: string
}

//#endregion

/**
 * 인터페이스 키 모델
 */
export interface IfsKey extends baseModels.StateBaseModel {
  /**
   * 인터페이스 아이디
   */
  ifId: string

  /**
   * 인터페이스 버전
   */
  ifVer: string

  /**
   * 인터페이스 키
   */
  ifKey: string

  /**
   * 인터페이스 값
   */
  ifVal: string

  /**
   * 비고
   */
  rmk?: string
}

/**
 * 인터페이스 검색 조건
 */
export interface IfsCriteria {
  /**
   * 시스템 코드
   */
  sysCd?: string
  /**
   * 채널 코드
   */
  chnlCd?: any
  /**
   * 인터페이스 아이디
   */
  ifId?: string
  /**
   * 인터페이스 버전
   */
  ifVer?: string
  /**
   * 인터페이스 명
   */
  ifNm?: string
  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * url
   */
  url?: string
  /**
   * 인터페이스 방향 코드
   */
  ifDirCd?: string

  [propName: string]: any
}

type IfsBase = baseModels.BaseModel & IfsCriteria

/**
 * 인터페이스
 */
export interface Ifs extends IfsBase {
  /**
   * 인터페이스 아이디
   */
  ifId?: string
  /**
   * 인터페이스 버전
   */
  ifVer?: string
  /**
   * 인터페이스 명
   */
  ifNm?: string
  /**
   * 시스템 코드
   */
  sysCd?: string
  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * 제한 여부
   */
  lmtYn?: string
  /**
   * 비고
   */
  rmk?: string
  /**
   * 아이피 제한 여부
   */
  ipLmtYn?: string
  /**
   * 아이피 목록
   */
  ipList?: string
  /**
   * url
   */
  url?: string
  /**
   * http 메소드 코드
   */
  httpMethCd?: string
  /**
   * 권한 제어 여부
   */
  authCtrlYn?: string
  /**
   * 인터페이스 유형 코드
   */
  ifTyCd?: string
  /**
   * 인터페이스 로깅 유형 코드
   */
  ifLogTyCd?: string
  /**
   * 인터페이스 방향 코드
   */
  ifDirCd?: string
  /**
   * 채널 제한 여부
   */
  chnlLmtYn?: string
  /**
   * 인증 필요 여부
   */
  certNecYn?: string
  /**
   * 채널 코드
   */
  chnlCd?: any

  /**
   * 인터페이스 채널 목록
   */
  channels?: IfsChnl[]

  /**
   * 인터페이스 키 목록
   */
  keys?: IfsKey[]
}
