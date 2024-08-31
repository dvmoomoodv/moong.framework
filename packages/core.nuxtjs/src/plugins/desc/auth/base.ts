import { Ustra } from '../../ustra'

export interface UstraAuthDuplicationCheckerOptions {
  onDuplicated: () => void
  onExpired: () => void
  authInfoProvider: () => {
    userKey: string
    procId: string
    token: string
  }
}

export abstract class UstraAuthDuplicationChecker {
  constructor(protected $ustra: Ustra, protected option: UstraAuthDuplicationCheckerOptions) {}

  protected get authProps() {
    return this.$ustra.env.appProps.auth
  }

  abstract start()
  abstract stop()
}
