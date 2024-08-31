import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables/service'
import { ApiOriginOptions } from '#ustra/nuxt/config/nuxt-app-props'
import { BatchHistCriteria, BatchHist, UstraBatchHistOneRqVo } from '#ustra/nuxt/management'
export const useUstraBatchHistService = defineUstraService(({ api }) => {
  /**
   *
   *
   *
   */
  async function getBatchHistList(data: BatchHistCriteria, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<BatchHist>>({
      ...option,
      url: `/api/system/batch-hist/list`,
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
  async function getBatchHist(data: UstraBatchHistOneRqVo, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
    const res = await api.call<apiModels.ApiResponse<BatchHist>>({
      ...option,
      url: `/api/system/batch-hist/detail`,
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
  // async function getLog(batHistId: string, option: ApiOriginOptions = {}, showLoadingBar: boolean = true) {
  //   const res = await api.call<apiModels.ApiResponse<SseEmitter>>({
  //     ...option,
  //     url: `/api/system/batch-hist/batchLogging`,
  //     method: 'GET',
  //     showLoadingBar,
  //     params: {
  //       batHistId,
  //     },
  //   })
  //   return res.data
  // }
  async function getLog(batHistId: string, callback: (log: string) => void) {
    const eventSource = $ustra.api.sse({
      url: `/api/system/batch-hist/batchLogging?batHistId=${batHistId}`,
      onmessage: e => {
        console.log(e)
        callback(e.data as string)
      },
      onerror: () => {
        eventSource.close()
      },
    })
    return eventSource
  }

  return { getBatchHistList, getBatchHist, getLog }
})
