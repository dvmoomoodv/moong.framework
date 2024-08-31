import { createHooks, Hookable } from 'hookable'
import { AppProps } from '../config/props'

export interface UstraRuntimeHooks {
  'properties:stored': (appProps: AppProps) => void | Promise<void>
}

/**
 * Hook 관련 지원 클래스
 */
export class Hooks {
  private hooks = createHooks<UstraRuntimeHooks>()

  get hook() {
    return this.hooks.hook
  }

  get callHook() {
    return this.hooks.callHook
  }
}

const instance = new Hooks()
export default instance
