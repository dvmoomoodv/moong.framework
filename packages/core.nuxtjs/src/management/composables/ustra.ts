import { useUstra } from "../../composables/ustra";
import { core } from "#moong/core/utils";
import { NuxtApp } from "#app";

/**
 * U.STRA 플러그인 management 기능 사용
 */
export const useUstraManagement = (nuxtApp?: NuxtApp) => {
  return useUstra(nuxtApp).management;
};

/**
 * U.STRA 관리자 사용자 정보
 */
export const useUstraManagementUser = (nuxtApp?: NuxtApp) => {
  return useUstra(nuxtApp).management.auth.user || {};
};
