import { useLogger } from "#moong/nuxt/utils/logger";
import { NuxtApp } from "#app";
import type { Ustra } from "../plugins/ustra";
import nuxtUtils from "../utils/nuxt";

/**
 * $ustra 플러그인 반환
 * @param nuxtApp NuxtApp
 * @returns
 */
export const useUstra = (nuxtApp?: NuxtApp): Ustra => {
  return nuxtUtils.useUstra(nuxtApp);
};

/**
 * logger 객체 반환
 * @param name 로거 scope 명
 * @param nuxtApp NuxtApp
 * @returns logger 객체
 */
// @ts-ignore
export const useUstraLogger = (name: string = null, nuxtApp?: NuxtApp) => {
  const $ustra = useUstra(nuxtApp);

  if (!$ustra) {
    throw new Error("ustra instance unavailable");
  }

  return name ? useLogger(name) : $ustra.logger;
};

/**
 * Ustra utils
 * @returns
 */
export const useUstraUtils = (nuxtApp?: NuxtApp) => {
  return useUstra(nuxtApp).utils;
};

/**
 * Ustra env
 * @returns
 */
export const useUstraEnv = (nuxtApp?: NuxtApp) => {
  return useUstra(nuxtApp).env;
};
