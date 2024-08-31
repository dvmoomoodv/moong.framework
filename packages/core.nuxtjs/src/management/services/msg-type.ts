import { apiModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables";
import {
  MessageTypeCriteria,
  MessageType,
  MessageTypeProp,
} from "../models/msg-type";

/**
 * 메시지 유형 서비스
 */
export const useUstraMessageTypeService = defineUstraService(
  ({ $ustra, api }) => {
    /**
     * 메시지 유형 조회
     * @param criteria 검색 조건
     */
    async function getMsgTypes(criteria: MessageTypeCriteria) {
      return (
        await api.call<apiModels.ApiResponse<MessageType[]>>({
          url: "/api/system/msg-type/list",
          method: "POST",
          data: criteria,
        })
      )?.data?.body;
    }

    /**
     * 메시지 유형 상세 정보 조회
     * @param msgTypeId 메시지 유형 아이디
     * @returns
     */
    async function getMsgType(msgTypeId: string) {
      return (
        await api.call<apiModels.ApiResponse<MessageType>>({
          url: "/api/system/msg-type/detail",
          method: "POST",
          data: {
            msgTypeId,
          },
        })
      )?.data?.body;
    }

    /**
     * 메시지 유형 추가
     * @param msgType 메시지 유형 정보
     */
    async function addMsgType(msgType: MessageType) {
      return (
        await api.call<apiModels.ApiResponse<MessageType>>({
          url: "/api/system/msg-type/",
          method: "POST",
          data: { msgType },
        })
      )?.data;
    }

    /**
     * 메시지 유형 수정
     * @param msgType 메시지 유형 정보
     * @returns
     */
    async function updateMsgType(msgType: MessageType) {
      return (
        await api.call<apiModels.ApiResponse<MessageType>>({
          url: "/api/system/msg-type/edit",
          method: "POST",
          data: { msgType },
        })
      )?.data;
    }

    /**
     * 메시지 유형 제거
     * @param msgTypeId 메시지 유형 아이디
     * @returns
     */
    async function removeMsgType(msgTypeId: string) {
      return (
        await api.call<apiModels.ApiResponse<MessageType>>({
          url: "/api/system/msg-type/remove",
          method: "POST",
          data: { msgTypeId },
        })
      )?.data;
    }

    /**
     * 메시지 프로바이더 목록
     * @returns
     */
    async function getProviderList() {
      return (
        await api.call<apiModels.ApiResponse<Object>>({
          url: "/api/system/msg-type/provider",
          method: "POST",
        })
      )?.data.body;
    }

    return {
      getMsgTypes,
      getMsgType,
      addMsgType,
      updateMsgType,
      removeMsgType,
      getProviderList,
    };
  }
);
