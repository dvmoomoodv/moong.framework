import { defineNuxtConfig } from "#moong/nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  modules: ["@moong/nuxt"],
  ustra: {
    app: {
      processPath: __dirname,
    },
    logging: {
      name: "demo",
    },
    nuxt: {
      vuetify: {
        enabled: true,
        mdi: {
          enabled: true,
        },
      },
    },
  },
});
