import { defineNuxtConfig } from '#ustra/nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  modules: ['@ustra/nuxt'],
  ustra: {
    app: {
      processPath: __dirname,
    },
    logging: {
      name: 'demo',
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
})
