import { apiModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables/service";
import { ApiOriginOptions } from "#moong/nuxt/config/nuxt-app-props";
import {
  BatchWorkerCriteria,
  BatchWorker,
  UstraBatchWorkerRqVo,
} from "#moong/nuxt/management";

export const useUstraBatchWorkerService = defineUstraService(({ api }) => {
  /**
   *
   *
   *
   */
  async function modifyWorker(
    data: UstraBatchWorkerRqVo,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchWorker>>({
      ...option,
      url: `/api/system/batch-worker/edit`,
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
  async function createWorker(
    data: UstraBatchWorkerRqVo,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch-worker`,
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
  async function deleteWorker(
    data: BatchWorkerCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch-worker/remove`,
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
  async function enableWorker(
    data: UstraBatchWorkerRqVo,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchWorker>>({
      ...option,
      url: `/api/system/batch-worker/enable`,
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
  async function disableWorker(
    data: UstraBatchWorkerRqVo,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchWorker>>({
      ...option,
      url: `/api/system/batch-worker/disable`,
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
  async function getWorkerList(
    data: BatchWorkerCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchWorker[]>>({
      ...option,
      url: `/api/system/batch-worker/list`,
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
  async function getWorker(
    data: BatchWorkerCriteria,
    option: ApiOriginOptions = {},
    showLoadingBar: boolean = true
  ) {
    const res = await api.call<apiModels.ApiResponse<BatchWorker>>({
      ...option,
      url: `/api/system/batch-worker/detail`,
      method: "POST",
      showLoadingBar,
      data: data,
    });

    return res.data;
  }

  return {
    modifyWorker,
    createWorker,
    deleteWorker,
    enableWorker,
    disableWorker,
    getWorkerList,
    getWorker,
  };
});
