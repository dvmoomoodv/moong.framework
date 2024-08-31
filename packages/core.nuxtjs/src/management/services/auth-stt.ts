import { apiModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables/service";
import { AuthStt, AuthSttCriteria } from "#moong/nuxt/management";

export const useUstraAuthSttService = defineUstraService(({ api }) => {
  /**
   * 사용자별 권한 조회
   * @param core CorePlugin
   * @param criteria AuthStt 검색조건
   */
  async function getAuthSttUserList(criteria: AuthSttCriteria = {}) {
    const result = await $ustra.api.call<apiModels.ApiResponse<AuthStt[]>>({
      url: "/api/system/auth-stt/user",
      method: "POST",
      data: criteria,
    });

    return result.data;
  }

  /**
   * 기간별 권한 조회
   * @param core CorePlugin
   * @param criteria AuthStt 검색조건
   */
  async function getAuthSttPeriodList(criteria: AuthSttCriteria = {}) {
    const result = await $ustra.api.call<apiModels.ApiResponse<AuthStt[]>>({
      url: "/api/system/auth-stt/period",
      method: "POST",
      data: criteria,
    });

    return result.data;
  }

  /**
   * 현재 권한 조회
   * @param core CorePlugin
   * @param criteria AuthStt 검색조건
   */
  async function getAuthSttCurrentList(criteria: AuthSttCriteria = {}) {
    const result = await $ustra.api.call<apiModels.ApiResponse<AuthStt[]>>({
      url: "/api/system/auth-stt/current",
      method: "POST",
      data: criteria,
    });

    return result.data;
  }

  /**
   * 권한 그룹 이력 조회
   * @param core CorePlugin
   * @param criteria AuthStt 검색조건
   */
  async function getAuthSttGrpHistList(criteria: AuthSttCriteria = {}) {
    const result = await $ustra.api.call<apiModels.ApiResponse<AuthStt[]>>({
      url: "/api/system/auth-stt/grp",
      method: "POST",
      data: criteria,
    });

    return result.data;
  }

  /**
   * 권한 이력 조회
   * @param core CorePlugin
   * @param criteria AuthStt 검색조건
   */
  async function getAuthSttHistList(criteria: AuthSttCriteria = {}) {
    const result = await $ustra.api.call<apiModels.ApiResponse<AuthStt[]>>({
      url: "/api/system/auth-stt/auth",
      method: "POST",
      data: criteria,
    });

    return result.data;
  }

  return {
    getAuthSttUserList,
    getAuthSttPeriodList,
    getAuthSttCurrentList,
    getAuthSttGrpHistList,
    getAuthSttHistList,
  };
});
