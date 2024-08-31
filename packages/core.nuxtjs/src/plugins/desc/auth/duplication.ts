import { Ustra } from '../../ustra'
import { UstraAuthPollingDuplicationChecker } from './polling'
import { UstraAuthWebsocketDuplicationChecker } from './websocket'
import { UstraAuthDuplicationChecker, UstraAuthDuplicationCheckerOptions } from './base'

export class UstraAuthDuplicationCheckerFactory extends UstraAuthDuplicationChecker {
  constructor($ustra: Ustra, option: UstraAuthDuplicationCheckerOptions) {
    super($ustra, option)
    this.init()
  }

  private checker: UstraAuthDuplicationChecker = null

  /**
   * 추적 시작
   */
  start() {
    if (process.server) {
      return
    }

    if (this.authProps.duplication.type === 'none' || this.authProps.type !== 'jwt') {
      return
    }

    if (!this.checker) {
      this.checker =
        this.authProps.duplication.type === 'polling'
          ? new UstraAuthPollingDuplicationChecker(this.$ustra, this.option)
          : new UstraAuthWebsocketDuplicationChecker(this.$ustra, this.option)
    }

    console.log('this.checker', this.checker)
    this.checker.start()
  }

  /**
   * 추적 중지
   */
  stop() {
    if (process.server) {
      return
    }

    this.checker?.stop()
  }

  private init() {
    if (process.server) {
      return
    }

    if (this.$ustra.auth.isAuthenticated) {
      this.start()
    }

    this.$ustra.hooks.hook('auth:activated', () => {
      this.start()
    })

    this.$ustra.hooks.hook('auth:updated', authInfo => {
      if (this.$ustra.auth.isAuthenticated) {
        this.start()
      }
    })

    this.$ustra.hooks.hook('auth:inactivated', () => {
      this.stop()
    })
  }
}
