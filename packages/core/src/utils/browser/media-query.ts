import core from '../core'

/**
 media query 관련 유틸리티
 @packageDocumentation
 */
export class MediaQuery {
  private breakPoints: BreakPoints = null
  private handlers: Handler[] = []
  private mediaQueries: Record<string, MediaQueryList> = {}

  constructor(breakPoints: BreakPoints = __defaultBreakPoints) {
    breakPoints = core.deepMerge({}, __defaultBreakPoints, breakPoints)

    this.breakPoints = breakPoints
    this.listenMediaQuery()
  }

  private listenMediaQuery() {
    const keys = Object.keys(this.breakPoints)
    for (const key of keys) {
      this.mediaQueries[key] = window.matchMedia(this.breakPoints[key])

      if (this.mediaQueries[key].addEventListener) {
        this.mediaQueries[key].addEventListener('change', () => {
          this.handlers.forEach(handler => handler(this.getState()))
        })
      } else {
        this.mediaQueries[key].addListener(() => {
          this.handlers.forEach(handler => handler(this.getState()))
        })
      }
    }
  }

  /**
   * 현재 미디어 쿼리 상태 조회
   * @returns
   */
  getState(): MediaQueryState {
    const state: MediaQueryState = {}
    const keys = Object.keys(this.breakPoints)
    for (const key of keys) {
      state[key] = this.mediaQueries[key].matches
    }

    return state
  }

  /**
   * add handler
   * @param handler
   */
  on(handler: Handler) {
    this.handlers.push(handler)
  }

  /**
   * off handler
   * @param handler
   */
  off(handler: Handler) {
    this.handlers.filter(item => item !== handler)
  }
}

/**
 * break point 정의
 */
export interface BreakPoints extends Record<string, string> {}

const __defaultBreakPoints: BreakPoints = {
  XS: '(max-width: 599.99px)',
  S: '(min-width: 600px) and (max-width: 959.99px)',
  M: '(min-width: 960px) and (max-width: 1279.99px)',
  L: '(min-width: 1280px)',
}

export type Handler = (querys: MediaQueryState) => void
export type MediaQueryState = Record<string, boolean>
