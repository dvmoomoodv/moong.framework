import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { UserApproval } from '../models/user-approval'

/**
 * 사용자 승인
 */
export const useUstraUserApprovalService = defineUstraService(({ api }) => {
  /**
   * 승인 요청
   * @param $core core plugin
   * @param approval 승인 데이터
   */
  async function request(approval: UserApproval) {
    return (
      await api.call<apiModels.ApiResponse<UserApproval>>({
        url: `/api/system/user-approval/request`,
        method: 'POST',
        data: approval,
      })
    )?.data?.body
  }

  return { request }
})
