import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { MessageCriteria, Message, MessageRqVo } from '../models/msg'

/**
 * 메시지 서비스
 */
export const useUstraMessageService = defineUstraService(({ $ustra, api }) => {
  /**
   * 메시지 조회
   * @param criteria 검색 조건
   */
  async function getMsgs(criteria: MessageCriteria) {
    return (
      await api.call<apiModels.ApiResponse<Message[]>>({
        url: '/api/system/msg/list',
        method: 'POST',
        data: criteria,
      })
    )?.data?.body
  }

  /**
   * 메시지 상세 정보 조회
   * @param msgId 메시지 아이디
   * @returns
   */
  async function getMsg(msgId: number) {
    return (
      await api.call<apiModels.ApiResponse<Message>>({
        url: '/api/system/msg/detail',
        method: 'POST',
        data: {
          msgId,
        },
      })
    )?.data?.body
  }

  /**
   * 메시지 추가
   * @param msg 메시지 정보
   */
  async function addMsg(msgRqVo: MessageRqVo) {
    return (
      await api.call<apiModels.ApiResponse<Message>>({
        url: '/api/system/msg',
        method: 'POST',
        data: { sendRqDt : msgRqVo.sendRqDt, msg : msgRqVo.msg },
      })
    )?.data
  }

  /**
   * 메시지 제거
   * @param msgId 메시지 아이디
   * @returns
   */
  async function removeMsg(msgId: number) {
    return (
      await api.call<apiModels.ApiResponse<Message>>({
        url: '/api/system/msg/remove',
        method: 'POST',
        data: { msgId },
      })
    )?.data
  }

  /**
   * 재발송 요청
   * @param msgId 메시지 아이디
   * @returns
   */
    async function resendMsg(msgId: number) {
      return (
        await api.call<apiModels.ApiResponse<Message>>({
          url: '/api/system/msg/resend',
          method: 'POST',
          data: { msgId },
        })
      )?.data
    }

  /**
   * 취소 요청
   * @param msgId 메시지 아이디
   * @returns
   */
  async function cancelMsg(msgId: number) {
    return (
      await api.call<apiModels.ApiResponse<Message>>({
        url: '/api/system/msg/cancel',
        method: 'POST',
        data: { msgId },
      })
    )?.data
  }

  return { getMsgs, getMsg, addMsg, removeMsg, resendMsg, cancelMsg }
})
