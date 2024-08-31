import { useState } from "#app";
import { shallowRef } from "vue";
import { createEventHook } from "@vueuse/core";
// import type PasswordEditPopup from '#moong/nuxt-wijmo/management/pages/common/password-edit-popup.vue'

/**
 * 관리자 app 사용
 * @returns
 */
export const useUstraManagementApp = () => {
  const showConfigPopup = useState(
    "ustra-management-config-popup-opend",
    () => false
  );
  const showPasswordPopup = useState(
    "ustra-management-password-popup-opend",
    () => false
  );

  const passwordPopupOnHidden = useState(
    "ustra-management-password-popup-hidden-hook",
    () => createEventHook()
  );

  const passwordPopup = {
    /**
     * 창 닫을 때 이벤트 처리
     */
    onHidden: passwordPopupOnHidden.value.on,

    /**
     * 팝업 창 인스턴 스
     */
    componentInstance: shallowRef<any>(),
  };

  return {
    /**
     * 설정 팝업 오픈 여부
     */
    showConfigPopup,
    /**
     * 패스워드 변경 팝업 오픈 여부
     */
    showPasswordPopup,

    events: {
      passwordPopupOnHidden,
    },

    passwordPopup,
  };
};
