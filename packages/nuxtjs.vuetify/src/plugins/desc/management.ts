import { defineAsyncComponent } from '#ustra/nuxt'
import { Ustra } from '#ustra/nuxt/plugins/ustra'

/**
 * vuetify 관리 기능
 */
export class NuxtVuetifyManagement {
  constructor($ustra: Ustra) {
    this.init()
  }

  private init() {
    // config 메뉴 설정
    $ustra.hooks.hook('management:config:menu:load', configMenus => {
      configMenus.forEach(menu => {
        // 어플리케이션 설정
        if (menu.id === 'application') {
          menu.component = defineAsyncComponent(() => import('#ustra/nuxt-vuetify/management/layouts/config/application.vue'))
        }

        // 비밀번호 변경
        if (menu.id === 'password') {
          menu.component = defineAsyncComponent(() => import('#ustra/nuxt-vuetify/management/layouts/config/password.vue'))
        }
      })

      return configMenus
    })
  }
}
