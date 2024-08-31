import { NuxtApp, showError } from "#app";
import { logger } from "#moong/nuxt/utils/logger";

/**
 * 플러그인 에러 처리
 */
export class UstraError {
  constructor(private app: NuxtApp) {
    this.app.hook("vue:error", (err) => {
      logger.warn("vue app has error", { err });

      // @ts-ignore
      if (
        this.app.$ustra.env.appProps.nuxt.error.handlerType === "redirect" ||
        err?.fatal === true
      ) {
        showError({
          message: err?.["message"],
          fatal: true,
          statusCode: this.app.$ustra.env.appProps.nuxt.error.statusCode,
        });
      }
    });

    // this.app.hook('app:error', err => {
    //   if (err.statusCode === 404) {
    //     logger.warn(err.message)
    //     return
    //   }

    //   logger.warn('nuxt app has error', { err }, err)
    // })

    // this.app.vueApp.config.errorHandler = (err, context) => {
    //   console.log('errorHandler')
    // }

    // this.app.hook('vue:error', (err, instance, info) => {
    //   logger.warn(err)
    //   throw createError({ message: err?.['message'], fatal: true })
    // })
  }
}
