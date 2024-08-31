import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables/service'
import { ApiOriginOptions } from '#ustra/nuxt/config/nuxt-app-props'
import { BatchCriteria, Batch, UstraBatchRqVo, UstraBatchOneRqVo } from '#ustra/nuxt/management'

export const useUstraBatchService = defineUstraService(({ api }) => {
  /**
   *
   *
   *
   */
  async function modBatch(data: UstraBatchRqVo, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch/edit`,
      method: 'POST',
      showLoadingBar,
      data: data,
    })

    return res.data
  }

  /**
   *
   *
   *
   */
  async function addBatch(data: UstraBatchRqVo, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch`,
      method: 'POST',
      showLoadingBar,
      data: data,
    })

    return res.data
  }

  /**
   *
   *
   *
   */
  async function delBatch(data: UstraBatchOneRqVo, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch/remove`,
      method: 'POST',
      showLoadingBar,
      data: data,
    })

    return res.data
  }

  /**
   *
   *
   *
   */
  async function startBatch(data: UstraBatchOneRqVo, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<apiModels.ResponseCode>>({
      ...option,
      url: `/api/system/batch/start`,
      method: 'POST',
      showLoadingBar,
      data: data,
    })

    return res.data
  }

  /**
   *
   *
   *
   */
  async function getBatchList(data: BatchCriteria, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<Batch[]>>({
      ...option,
      url: `/api/system/batch/list`,
      method: 'POST',
      showLoadingBar,
      data: data,
    })

    return res.data
  }

  /**
   *
   *
   *
   */
  async function getBatch(data: UstraBatchOneRqVo, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<Batch>>({
      ...option,
      url: `/api/system/batch/detail`,
      method: 'POST',
      showLoadingBar,
      data: data,
    })

    return res.data
  }

  return { modBatch, addBatch, delBatch, startBatch, getBatchList, getBatch }
})
