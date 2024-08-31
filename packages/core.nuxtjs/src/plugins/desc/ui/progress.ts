import { Ustra } from '../../ustra'

/**
 * UI Progress 관련 기능
 */
export class Progress {
  constructor(private $ustra: Ustra) {}

  /**
   * show loading bar
   * @param cancelToken api cancel token
   */
  showLoadingBar(cancelToken: any = undefined) {
    this.$ustra.hooks.callHook('ui:progress', { type: 'loading', show: true, cancelToken: cancelToken })
  }

  /**
   * hide loading bar
   */
  hideLoadingBar() {
    this.$ustra.hooks.callHook('ui:progress', { type: 'loading', show: false })
  }

  /**
   * show progress bar
   * @param progressRate progress value (0~100) when value is 100, progress will be hide.
   */
  showProgress(progressRate: number) {
    this.$ustra.hooks.callHook('ui:progress', { type: 'progress', progressRate })
  }
}
