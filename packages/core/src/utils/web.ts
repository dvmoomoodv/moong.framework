/**
 * Web 관련 유틸리티
 * @packageDocumentation
 */
import { type IncomingMessage } from 'http'
import { HttpHeaders } from '../data'

export class Web {
  /**
   * 로컬 도메인
   */
  public LOCALHOST_DOMAIN = 'localhost'

  /**
   * 브라우저 환경 여부 확인
   * @returns
   */
  get isBrowser() {
    return typeof window !== 'undefined'
  }

  /**
   * useragent 조회
   * @param req 서버 실행의 경우는 필수
   * @export
   */
  getUserAgent(req?: IncomingMessage): string {
    if (!this.isBrowser && !req) {
      throw new Error('req must have value.')
    }

    return this.isBrowser ? window.navigator.userAgent : (req.headers[HttpHeaders.USER_AGENT.toLowerCase()] as string) || ''
  }

  /**
   * 모바일 요청인지 확인
   * @param req 서버 실행의 경우는 필수
   * @export
   */
  isMobileRequest(req?: IncomingMessage): boolean {
    const userAgent = this.getUserAgent(req)
    return userAgent.match(/Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|Windows Phone/i)?.length > 0
  }

  /**
   * 안드로이드 요청 여부 확인
   * @param req
   * @returns
   */
  isAndroidRequest(req?: IncomingMessage): boolean {
    const userAgent = this.getUserAgent(req)
    return userAgent.match(/Android/i)?.length > 0
  }

  /**
   * iOS 요청인지 확인
   * @param req 서버 실행의 경우는 필수
   * @export
   */
  isIOsRequest(req?: IncomingMessage): boolean {
    const userAgent = this.getUserAgent(req)
    return userAgent.match(/iP(ad|hone|od)|iOS/i)?.length > 0
  }

  /**
   * iOS 버전을 조회한다.
   */
  getIOSVersion = (req?: IncomingMessage): number => {
    if (!this.isIOsRequest(req)) {
      return null
    }

    const userAgent = this.getUserAgent(req)

    for (let ver = 3; ver < 20; ver++) {
      if (userAgent.includes(`iPhone OS ${ver}`)) {
        return ver
      }

      if (userAgent.includes(`iPad; CPU OS ${ver}`)) {
        return ver
      }
    }

    return null
  }

  /**
   * 동일 URL인지 확인
   * @param a URL A
   * @param b URL B
   */
  isSameURL(a: string, b: string) {
    return a.split('?')[0].replace(/\/+$/, '') === b.split('?')[0].replace(/\/+$/, '')
  }

  /**
   * relative url인지 확인
   * @param url
   */
  isRelativeURL(url: string) {
    return url && url.length && /^\/([a-zA-Z0-9@\-%_~][/a-zA-Z0-9@\-%_~]*)?([?][^#]*)?(#[^#]*)?$/.test(url)
  }

  /**
   * 1차 도메인 조회
   * @param url
   */
  getFirstDomain = (url?: string): string => {
    if (this.isBrowser && !url) {
      url = window.location.host
    }

    if (url.indexOf('://') > 0) {
      url = url.substring(url.indexOf('://') + 3)
    }

    let urls = url.split('.')
    const lastUrl = urls[urls.length - 1]

    if (lastUrl.indexOf(':') > 0) {
      urls[urls.length - 1] = lastUrl.split(':')[0]
    }

    if (urls.length > 2) {
      urls = urls.splice(1)
    }

    return urls.join('.')
  }

  /**
   * css 크기 단위 변환
   * @param unit 단위
   * @param unitSuffix 단위 값
   * @returns
   */
  getCssUnit(unit: string | number | null | undefined, unitSuffix = 'px'): string {
    if (unit == null || unit === '') {
      return undefined
    } else if (isNaN(+unit!)) {
      return String(unit)
    } else {
      return `${Number(unit)}${unitSuffix}`
    }
  }

  /**
   * URLSearchParams 객체 여부 조회
   * @param val
   * @returns
   */
  isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  }
}

const instance = new Web()
export default instance
