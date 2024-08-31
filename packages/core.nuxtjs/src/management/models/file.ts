/**
 * 파일 그룹 모델
 * @exports {@link File} {@link FileGrp}
 * @packageDocumentation
 */
import { baseModels } from '#ustra/core/data'

/**
 * 파일 그룹
 */
export interface FileGrp extends baseModels.BaseModel {
  /**
   * 파일 그룹 아이디
   */
  fileGrpId?: string
  /**
   * 파일 그룹 명
   */
  fileGrpNm?: string
  /**
   * 저장 경로
   */
  svPath?: string
  /**
   * 최대 용량
   */
  maxSz?: number
  /**
   * 확장자 제한
   */
  extenLmt?: string
  /**
   * 파일 구조 코드
   */
  dirStructCd?: string
  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * 삭제 여부
   */
  delYn?: string
  /**
   * 파일 명 저장 방식 코드
   */
  fileNmSvMethCd?: string

  /**
   * 웹 기본 url
   */
  webDefUrl?: string

  /**
   * 파일 암호화 방식
   */
  fileCrytMethCd?: string
}

/**
 * 파일
 */
export interface File extends baseModels.BaseModel {
  /**
   * 파일 아이디
   */
  fileId?: string
  /**
   * 파일 그룹 아이디
   */
  fileGrpId?: string
  /**
   * 메뉴 아이디
   */
  mnuId?: string
  /**
   * 파일 번호
   */
  fileNo?: number
  /**
   * 파일 명
   */
  fileNm?: string
  /**
   * 기존 파일 명
   */
  orgFileNm?: string
  /**
   * 파일 설명
   */
  fileDesc?: string
  /**
   * 파일 형식 내용
   */
  fileFmtCont?: string
  /**
   * 저장 경로
   */
  svPath?: string
  /**
   * 파일 사이즈
   */
  fileSz?: number

  /**
   * 파일 암호화 방식
   */
  fileCrytMethCd?: string

  /**
   * 파일 암호화 키 값
   */
  fileCrytKeyVal?: string
}
