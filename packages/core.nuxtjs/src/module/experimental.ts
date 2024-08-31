import { Nuxt } from "@nuxt/schema";

import { NuxtAppProps } from "../config/nuxt-app-props";
import core from "#moong/core/utils/core";

export const experimental = (options: NuxtAppProps, nuxt: Nuxt) => {
  // TODO: 프레임워크 업데이트 시 재확인 필요함.

  // @ts-ignore
  nuxt.options.experimental = nuxt.options.experimental || {};

  // changed to parcel
  if (core.isEmpty(nuxt.options.experimental.watcher)) {
    nuxt.options.experimental.watcher = "parcel";
  }
};
