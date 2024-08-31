/**
 * 게시
 * @exports {@link PostCriteria} {@link Post} {@link PostGroupInfo}
 * @packageDocumentation
 */

import { baseModels } from '#ustra/core/data'

/**
 * 게시 검색 조건
 */
export interface PostCriteria {
  /**
   * 게시그룹 ID
   */
  postGrpId?: string

  /**
   * 게시그룹 아이디 목록
   */
  postGrpIds?: string[]

  /**
   * 게시 시작일
   */
  postSrtDttm?: string

  /**
   * 게시 종료일
   */
  postEndDttm?: string
  postTermUseYn?: string
  useYn?: string

  /**
   * 팝업 여부
   */
  popPostYn?: string

  [propName: string]: any
}

type PostBase = baseModels.BaseModel & PostCriteria

/**
 * 게시
 */
export interface Post extends PostBase {
  /**
   * 게시 ID
   */
  postId?: number

  /**
   * 게시그룹 ID
   */
  postGrpId?: string

  /**
   * 제목
   */
  title?: string

  /**
   * 상단고정 여부
   */
  topFixYn?: string

  /**
   * 내용
   */
  cont?: string

  /**
   * 사용여부
   */
  useYn?: string

  /**
   * 게시 시작일시
   */
  postSrtDttm?: string

  /**
   * 게시 종료일시
   */
  postEndDttm?: string

  /**
   * 조회건수
   */
  viewCnt?: bigint

  /**
   * 팝업게시 여부
   */
  popPostYn?: string

  /**
   * 파일 ID
   */
  fileId?: string

  /**
   * 등록사용자명
   */
  regUsrNm?: string

  /**
   * 게시 그룹 정보
   */
  postGroup?: PostGroupInfo
}

/**
 * 게시 그룹
 */
export interface PostGroupInfo extends baseModels.BaseModel {
  /**
   * 게시그룹 ID
   */
  postGrpId?: string

  /**
   * 게시그룹명
   */
  postGrpNm?: string

  /**
   * 파일그룹 ID
   */
  fileGrpId?: string

  /**
   * 첨부파일 사용여부
   */
  attchFileUseYn?: string

  /**
   * HTML 에디터 사용여부
   */
  htmlEditorUseYn?: string

  /**
   * 게시기간 사용여부
   */
  postTermUseYn?: string

  /**
   * 상단고정 사용여부
   */
  topFixUseYn?: string

  /**
   * 팝업 사용여부
   */
  popUseYn?: string

  /**
   * 사용여부
   */
  useYn?: string

  /**
   * 삭제여부
   */
  delYn?: string
}
