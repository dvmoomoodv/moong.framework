import { computed } from "vue";
import { defineInitStore } from "#moong/nuxt/store";
import { useSessionStorage, StorageSerializers } from "@vueuse/core";

export const useServerAuthStore = defineInitStore(
  "ustra:auth:server",
  () => {
    /**
     * 인증 정보
     */
    const authInfo = useSessionStorage("ustra:auth", null, {
      serializer: StorageSerializers.object,
    });

    /**
     * 인증 완료 여부
     */
    const authenticated = computed(() => {
      return !!authInfo.value;
    });

    /**
     * 사용자 정보 존재 여부
     */
    const existsUser = computed(() => {
      return !!authInfo;
    });

    return { authInfo, authenticated, existsUser };
  },
  (store) => {}
);
