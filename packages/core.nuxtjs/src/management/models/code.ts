/**
 * 백오피스 코드 모델
 * @exports {@link CodeCriteria}
 * @packageDocumentation
 */
import { baseModels } from '#ustra/core/data'

/**
 * 코드 검색 조건
 */
export interface CodeCriteria extends Record<string, any> {
  /**
   * 그룹 코드
   */
  grpCd?: string

  /**
   * 상세 코드
   */
  dtlCd?: string

  /**
   * 상위 그룹 코드
   */
  uprGrpCd?: string

  /**
   * 상위 상세 코드
   */
  uprDtlCd?: string

  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * 대분류 코드
   */
  lclsCd?: string
  /**
   * 중분류 코드
   */
  mclsCd?: string

  /**
   * 코드 명
   */
  cdNm?: string

  /**
   * 그룹 코드 명
   */
  grpNm?: string
}

type CodeBase = baseModels.BaseModel & CodeCriteria

/**
 * 코드 정보
 */
export interface Code extends CodeBase {
  /**
   * 그룹 코드
   */
  grpCd?: string

  /**
   * 상세 코드
   */
  dtlCd?: string

  /**
   * 상위 그룹 코드
   */
  uprGrpCd?: string

  /**
   * 상위 상세 코드
   */
  uprDtlCd?: string

  /**
   * 사용 여부
   */
  useYn?: string
  /**
   * 코드 명
   */
  cdNm?: string

  /**
   * 정렬번호
   */
  srtNo?: number

  /**
   * 코드 설명
   */
  cdDesc?: string

  /**
   * 비고
   */
  rmk?: string

  /**
   * 기타필드1
   */
  etc1?: string
  /**
   * 기타필드2
   */
  etc2?: string
  /**
   * 기타필드3
   */
  etc3?: string
  /**
   * 기타필드4
   */
  etc4?: string
  /**
   * 기타필드5
   */
  etc5?: string
  /**
   * 그룹코드 명
   */
  grpNm?: string
  /**
   * 대분류 코드
   */
  lclsCd?: string
  /**
   * 대분류 명
   */
  lclsNm?: string
  /**
   * 중분류 코드
   */
  mclsCd?: string
  /**
   * 중분류 코드명
   */
  mclsNm?: string
}
