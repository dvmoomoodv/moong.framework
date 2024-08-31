import { NuxtAppProps } from "#moong/nuxt/config";
import { Nuxt } from "@nuxt/schema";
import { extendViteConfig, addPluginTemplate } from "@nuxt/kit";
import { logger } from "#moong/nuxt/utils/logger";
import { core } from "#moong/core/utils";
import { installModuleIfNotExists } from "#moong/nuxt/kit";

export const build = async (options: NuxtAppProps, nuxt: Nuxt) => {
  await installModuleIfNotExists("vuetify-nuxt-module", {
    moduleOptions: options.nuxt.vuetify.moduleOptions,
    vuetifyOptions: options.nuxt.vuetify.vuetifyOptions,
  });

  extendViteConfig((config) => {
    config.optimizeDeps = core.assign({}, config.optimizeDeps);
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      "vuetify/lib/components/index.mjs",
    ];

    if (options.nuxt.vuetify.datepicker.enabled) {
      config.optimizeDeps.exclude = [
        ...(config.optimizeDeps.exclude || []),
        "@vuepic/vue-datepicker",
      ];
    }
  });

  // for ssr build patch
  // @see https://vuetify-nuxt-module.netlify.app/guide/server-side-rendering.html#vuetify-sass-variables
  if (
    nuxt.options.ssr &&
    options.nuxt.vuetify?.moduleOptions?.styles?.configFile
  ) {
    // @ts-expect-error
    nuxt.options.features ||= {};
    nuxt.options.features.inlineStyles = false;

    logger.info(
      "set nuxt.options.features.inlineStyles to false automatically when use SSR and custom sass files."
    );
  }

  const vuetifyOptions = options.nuxt.vuetify.vuetifyOptions;
  const isDev = nuxt.options.dev;

  // vuetify-nuxt-module 모듈 적용으로 기본 플러그인 설정을 runtime hook으로 변경
  // @see https://vuetify-nuxt-module.netlify.app/guide/nuxt-runtime-hooks.html
  addPluginTemplate({
    filename: "ustra/ustra-vuetify.ts",
    getContents(data) {
      return `
import { defineNuxtPlugin, NuxtApp } from '#app'
import { logger } from '#moong/nuxt/utils/logger'
${options.nuxt.vuetify.datepicker.enabled ? `import '@vuepic/vue-datepicker/dist/main.css'` : ""}
import 'v-calendar/dist/style.css'

export default defineNuxtPlugin(async nuxtApp => {
  const isDev = ${nuxt.options.dev}

  logger.info('😸[' + $ustra.uuid + '] Start loading U.STRA Vuetify plugin')
  nuxtApp.hook('vuetify:before-create', async ({ vuetifyOptions }) => {
  ${
    !vuetifyOptions.components && isDev
      ? `
    vuetifyOptions.components = await import('vuetify/components')
    `
      : ""
  }
  ${
    !vuetifyOptions.directives && isDev
      ? `
    vuetifyOptions.directives = await import('vuetify/directives')
    `
      : ""
  }
  ${
    !vuetifyOptions.locale
      ? `
      const { ko, en } = await import('vuetify/locale')
      vuetifyOptions.locale = {
        locale: 'ko',
        fallback: 'ko',
        messages: { ko, en },
      }
    `
      : ""
  }
    await nuxtApp.callHook('ustra:vuetify:options', vuetifyOptions)

  })

})
        `;
    },
    write: false,
  });
};
