import { apiModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables";
import { TextTemplateCriteria, TextTemplate } from "../models/text-template";

/**
 * 텍스트 템플릿 서비스
 */
export const useUstraTextTemplateService = defineUstraService(
  ({ $ustra, api }) => {
    /**
     * 텍스트 템플릿 목록 조회
     * @param criteria 검색 조건
     */
    async function getTxtTmpls(criteria: TextTemplateCriteria) {
      return (
        await api.call<apiModels.ApiResponse<TextTemplate[]>>({
          url: "/api/system/text-template/list",
          method: "POST",
          data: criteria,
        })
      )?.data?.body;
    }

    /**
     * 텍스트 템플릿 상세 정보 조회
     * @param txtTmplId 텍스트 템플릿 아이디
     * @returns
     */
    async function getTxtTmpl(txtTmplId: string) {
      return (
        await api.call<apiModels.ApiResponse<TextTemplate>>({
          url: "/api/system/text-template/detail",
          method: "POST",
          data: {
            txtTmplId,
          },
        })
      )?.data?.body;
    }

    /**
     * 텍스트 템플릿 추가
     * @param txtTmpl 텍스트 템플릿 정보
     */
    async function addTxtTmpl(txtTmpl: TextTemplate) {
      return (
        await api.call<apiModels.ApiResponse<TextTemplate>>({
          url: "/api/system/text-template",
          method: "POST",
          data: txtTmpl,
        })
      )?.data;
    }

    /**
     * 텍스트 템플릿 수정
     * @param txtTmpl 텍스트 템플릿 정보
     * @returns
     */
    async function updateTxtTmpl(txtTmpl: TextTemplate) {
      return (
        await api.call<apiModels.ApiResponse<TextTemplate>>({
          url: "/api/system/text-template",
          method: "PUT",
          data: txtTmpl,
        })
      )?.data;
    }

    /**
     * 텍스트 템플릿 삭제
     * @param txtTmplId 텍스트 템플릿 아이디
     * @returns
     */
    async function deleteTxtTmpl(txtTmplId: string) {
      return (
        await api.call<apiModels.ApiResponse<TextTemplate>>({
          url: "/api/system/text-template",
          method: "DELETE",
          data: {
            txtTmplId,
          },
        })
      )?.data;
    }

    /**
     * 텍스트 템플릿 엔진 목록 조회
     * @param
     * @returns
     */
    async function getTextTemplateEngineList() {
      return (
        await api.call<apiModels.ApiResponse<String>>({
          url: "/api/system/text-template/engine",
          method: "GET",
        })
      )?.data?.body;
    }

    /**
     * 텍스트 템플릿 적용테스트
     * @param
     * @returns
     */
    async function testTxtTmpl(txtTmplId: string, param) {
      return (
        await api.call<apiModels.ApiResponse<string>>({
          url: `/api/system/text-template/${txtTmplId}/test`,
          method: "POST",
          data: param,
        })
      )?.data?.body;
    }
    return {
      getTxtTmpls,
      getTxtTmpl,
      addTxtTmpl,
      updateTxtTmpl,
      deleteTxtTmpl,
      getTextTemplateEngineList,
      testTxtTmpl,
    };
  }
);
