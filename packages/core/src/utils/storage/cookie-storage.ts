import CookieUniversal from 'cookie-universal'
import StringConverter from '../converter/string-converter'
import core from '../core'
import date from '../date'
import web from '../web'
import ObjectStorage from './object-storage'

/**
 storage for browser cookie
 @packageDocumentation
 @browser
 */

export interface CookieStorageOption {
  /**
   * lax : sub domain까지만 허용
   * none : 모든 domain허용 (secure가 반드시 true여야만 함)
   * strict : 동일 domain + port만 허용
   *
   * @default lax
   */
  samesite?: 'Lax' | 'None' | 'Strict'

  /**
   * @default false
   */
  secure?: boolean

  /**
   * 쿠키 저장 경로
   * @default /
   */
  path?: string

  /**
   * @default 0
   */
  expireSec?: number

  /**
   * @default -1
   */
  maxAge?: number

  /**
   * 저장 도메인
   */
  domain?: string

  /**
   * pure value 연동 여부
   */
  pure?: boolean

  /**
   * http 저장
   */
  httponly?: boolean

  /**
   * value 값 치환 정책
   */
  valueConverter?: StringConverter

  /**
   * key 값 치환 정책
   */
  keyConverter?: StringConverter
}

export default class CookieStorage extends ObjectStorage {
  protected option: CookieStorageOption = {
    samesite: null,
    secure: false,
    path: '/',
    maxAge: null,
    expireSec: null,
    httponly: false,
    // valueConverter: base64Converter,
    pure: true,
  }

  constructor(option?: CookieStorageOption) {
    super()

    if (option) {
      this.option = core.assign(this.option, option)
    }
  }

  private getCookie(req = null, res = null) {
    if (web.isBrowser) {
      return CookieUniversal()
    } else {
      return CookieUniversal(req, res)
    }
  }

  private removeResponseCookie(key: string, res: any) {
    if (!res) {
      return
    }

    let cookies: string[] = res.getHeader('Set-Cookie')
    cookies = typeof cookies === 'string' ? [cookies] : cookies

    if (cookies) {
      const duplicatedCookieIndex = cookies.findIndex(c => c && c.startsWith(`${key}=`))
      if (duplicatedCookieIndex >= 0) {
        cookies.splice(duplicatedCookieIndex, 1)
        res.setHeader('Set-Cookie', cookies)
      }
    }
  }

  getItem(key: string, req: object = null, res: object = null): any {
    const cookie = this.getCookie(req, res)
    key = this.getKey(key)
    let value = cookie.get(key)

    if (this.option.valueConverter) {
      value = this.option.valueConverter.deconvert(value)
    }

    return this.option.pure ? value : this.deserializeValue(value)
  }

  setItem(key: string, value: any, req: object = null, res: object = null): void {
    const cookie = this.getCookie(req, res)
    key = this.getKey(key)
    value = this.option.pure ? value : this.serializeValue(value)

    if (this.option.valueConverter) {
      value = this.option.valueConverter.convert(value)
    }

    if (!web.isBrowser) {
      this.removeResponseCookie(key, res)
    }

    cookie.set(key, value, {
      domain: this.option.domain,
      expires: this.option.expireSec ? date.addSeconds(new Date(), this.option.expireSec) : null,
      httpOnly: this.option.httponly,
      maxAge: this.option.maxAge,
      path: this.option.path,
      // @ts-ignore
      sameSite: this.option.samesite,
      secure: this.option.secure,
    })
    this.addKey(key)
  }

  removeItem(key: string, req: object = null, res: object = null): void {
    const cookie = this.getCookie(req, res)
    key = this.getKey(key)

    if (!web.isBrowser) {
      this.removeResponseCookie(key, res)
    }

    cookie.remove(key, { expires: date.addSeconds(new Date(), -1000), maxAge: -1000, domain: this.option.domain, path: this.option.path })
    this.removeKey(key)
  }

  private getKey(key: string) {
    if (this.option.keyConverter) {
      return this.option.keyConverter.convert(key)
    }

    return key
  }
}

export const cookieStorage = new CookieStorage()
export { CookieStorage }
