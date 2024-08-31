import { NuxtApp } from '#app'

export class Config {
  constructor(private app: NuxtApp) {
    // console.log('app', app)

    app.vueApp.mixin({
      beforeCreate() {
        // console.log('this', this.$options)
      },
    })
  }
}
