/**
 * 인터페이스 로깅 모델
 */

export interface InterfaceRequestLogging {
  /**
   * 인터페이스 아이디
   */
  ifId: string

  /**
   * 인터페이스 버전
   */
  ifVer: string

  /**
   * 시스템 코드 (없을 경우, 자동 추출)
   */
  sysCd?: string

  /**
   * 채널 코드 (없을 경우, 자동 추출)
   */
  chnlCd?: string

  /**
   * 요청 내용
   */
  reqCont?: string

  [propName: string]: any
}

export interface InterfaceResponseLogging {
  /**
   * 인터페이스 히스토리 아이디
   */
  ifHistId: number

  /**
   * 성공여부
   */
  succYn?: string

  /**
   * 응답 코드
   */
  resCdVal?: string

  /**
   * 응답 내용
   */
  resCont?: any

  [propName: string]: any
}
/**
 * 파일 업로드 결과
 */
export interface FileOutput extends Record<string, unknown> {
  /**
   * 파일 아이디
   */
  fileId?: string

  /**
   * 파일 메타데이타
   */
  fileMetaDatas?: FileMetaData[]

  /**
   * 성공 여부
   */
  success?: boolean

  /**
   * 변환된 데이터
   */
  convertData?: unknown

  [propName: string]: any
}

/**
 * 파일 메타 데이터
 */
export interface FileMetaData extends Record<string, unknown> {
  /**
   * 파일 명
   */
  fileName?: string

  /**
   * 파일 경로
   */
  filePath?: string

  fileExt?: string

  fileSize?: number

  orgExt?: string

  orgName?: string

  orgPath?: string

  orgSize?: number

  fileId?: string

  fileNo?: number

  /**
   * 업로드 유형
   * - 01 : 신규
   * - 02 : 수정
   * - 03 : 삭제
   */
  uploadType?: '01' | '02' | '03'

  fileGrpId?: string

  orgData?: File
}
