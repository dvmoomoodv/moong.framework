import { apiModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables/service";
import { ApiOriginOptions } from "#moong/nuxt/config/nuxt-app-props";
import {
  BatchManagerCriteria,
  BatchManager,
  UstraBatchManagerRqVo,
} from "#moong/nuxt/management";

export const useUstraBatchManagerService = defineUstraService(({ api }) => {
  /**
   *
   *
   *
   */
  async function modifyManager(
    data: UstraBatchManagerRqVo,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchManager>>({
      ...option,
      url: `/api/system/batch-manager/edit`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  /**
   *
   *
   *
   */
  async function createManager(
    data: UstraBatchManagerRqVo,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch-manager`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  /**
   *
   *
   *
   */
  async function deleteManager(
    data: BatchManagerCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch-manager/remove`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  /**
   *
   *
   *
   */
  async function enableManager(
    data: BatchManager,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchManager>>({
      ...option,
      url: `/api/system/batch-manager/enable`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  /**
   *
   *
   *
   */
  async function disableManager(
    data: BatchManager,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchManager>>({
      ...option,
      url: `/api/system/batch-manager/disable`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  /**
   *
   *
   *
   */
  async function getManagerList(
    data: BatchManagerCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchManager[]>>({
      ...option,
      url: `/api/system/batch-manager/list`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  /**
   *
   *
   *
   */
  async function getManager(
    data: BatchManagerCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchManager>>({
      ...option,
      url: `/api/system/batch-manager/detail`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  return {
    modifyManager,
    createManager,
    deleteManager,
    enableManager,
    disableManager,
    getManagerList,
    getManager,
  };
});
