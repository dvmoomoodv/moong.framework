/**
 * 텍스트 템플릿
 * @exports {@link TextTemplateCriteria} {@link TextTemplate}
 * @packageDocumentation
 */
import { baseModels } from "#moong/core/data";

/**
 * 텍스트 템플릿 검색 조건
 */
export interface TextTemplateCriteria {
  /**
   * 텍스트 템플릿 ID
   */
  txtTmplId?: string;

  /**
   * 텍스트 템플릿 명
   */
  txtTmplNm?: string;
}

type TextTemplateBase = baseModels.BaseModel & TextTemplateCriteria;

/**
 * 텍스트 템플릿
 */
export interface TextTemplate extends TextTemplateBase {
  /**
   * 텍스트 템플릿 ID
   */
  txtTmplId?: string;

  /**
   * 텍스트 템플릿 버전
   */
  txtTmplVer?: string;

  /**
   * 텍스트 템플릿 명
   */
  txtTmplNm?: string;

  /**
   * 텍스트 템플릿 설명
   */
  txtTmplDesc?: string;

  /**
   * 텍스트 템플릿 내용
   */
  txtTmplCont?: string;

  /**
   * 텍스트 템플릿 엔진
   */
  txtTmplEngn?: string;

  /**
   * 삭제 여부
   */
  delYn?: string;
}
