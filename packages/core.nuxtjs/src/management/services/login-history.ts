import { apiModels, paginationModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables";
import { ApiOriginOptions } from "#moong/nuxt/config/nuxt-app-props";
import { LoginHistCriteria, LoginHist } from "../models/login-hist";

export const useUstraLoginHistoryService = defineUstraService(({ api }) => {
  async function getLoginHistorys(
    data: LoginHistCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<LoginHist[]>>({
      ...option,
      url: `/api/system/login-hist/list`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  async function getListHhChart(
    data: LoginHistCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<LoginHist[]>>({
      ...option,
      url: `/api/system/login-hist/list/chart`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  async function getCurrentAcc(
    data: LoginHistCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<LoginHist[]>>({
      ...option,
      url: `/api/system/login-hist/current`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  async function getAccCnt(
    data: LoginHistCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<LoginHist[]>>({
      ...option,
      url: `/api/system/login-hist/cnt`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  async function listDownload(
    criteria: LoginHistCriteria,
    paginationRequest: paginationModels.PaginationRequest,
    maskYn: string,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<object>>({
      ...option,
      url: `/api/system/login-hist/list/download`,
      method: "GET",
      showLoadingBar,
      params: {
        ...criteria,
        ...paginationRequest,
        maskYn,
      },
    });

    return res.data;
  }

  return {
    getLoginHistorys,
    getListHhChart,
    getCurrentAcc,
    getAccCnt,
    listDownload,
  };
});
