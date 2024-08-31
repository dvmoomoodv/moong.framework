import { defineStore } from ".";
import { ref } from "vue";
import { MediaQueryState } from "#moong/core/utils/browser/media-query";

export interface ServerError {
  /**
   * 상태 값
   */
  status?: number;

  /**
   * 메시지
   */
  message?: string;
}

export const useUstraCoreStore = defineStore("ustra:core", () => {
  const serverError = ref<ServerError>(null);
  /**
   * 미디어 쿼리 상태
   */
  const mediaState = ref<MediaQueryState>({});

  /**
   * SSR 구동 여부
   */
  const isSsr = ref<boolean>(false);

  const pageKey = ref(0);

  function initialize() {}

  return { serverError, mediaState, isSsr, initialize, pageKey };
});
