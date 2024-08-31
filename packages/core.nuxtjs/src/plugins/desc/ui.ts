import { NuxtApp } from '#app'
import { Dialog } from './ui/dialog'
import { Progress } from './ui/progress'
// import { nextTick } from 'vue'

export class UstraUI {
  public dialog: Dialog = null
  public progress: Progress = null

  constructor(private nuxtApp: NuxtApp) {
    this.init()
  }

  private init() {
    this.progress = new Progress(this.nuxtApp.$ustra)

    if (process.server) {
      return
    }

    // dialog
    this.dialog = new Dialog(this.nuxtApp.$ustra)
    if (this.nuxtApp.$ustra.env.appProps.nuxt.ui.replaceDialogFunctions) {
      window['_alert'] = window.alert
      window['_confirm'] = window.confirm

      // @ts-ignore
      window.alert = this.dialog.alert.bind(this.dialog)
      // @ts-ignore
      window.confirm = this.dialog.confirm.bind(this.dialog)

      window.toast = this.dialog.toast.bind(this.dialog)
    }

    // page load hook
    if (this.nuxtApp.$ustra.env.appProps.nuxt.ui.callPageLoadingProgressHook) {
      this.nuxtApp.hook('page:start', () => {
        this.progress.showLoadingBar()
      })

      this.nuxtApp.hook('page:finish', async () => {
        await this.nuxtApp.$ustra.utils.core.sleep(500)
        this.progress.hideLoadingBar()
      })

      this.nuxtApp.hook('app:error', async () => {
        await this.nuxtApp.$ustra.utils.core.sleep(500)
        this.progress.hideLoadingBar()
      })
    }
  }
}
