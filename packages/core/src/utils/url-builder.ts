import qs from 'qs'
import { base64Converter } from './converter/base64-converter'
import { base62Converter } from './converter/base62-converter'

/**
 * URL을 생성하기 위한 Builder 클래스
 * ```typescript
 * const url = new UrlBuilder('http://gsitm.com')
 *    .addBase64('a', '가나다라')
 *    .addBase64('b', 'abcdedfg')
 *    .add('test', 'Y')
 *    .build()
 *
 *  // url => http://gsitm.com?a=6rCA64KY64uk6528&b=YWJjZGVkZmc%3D&test=Y
 * ```
 */
export class UrlBuilder {
  private parameters: object = {}
  private baseUrl: string = ''

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private convertValue(value: any) {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }

    if (typeof value === 'string') {
      return value
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    if (typeof value === 'function') {
      return ''
    }

    return value || ''
  }

  /**
   * 파라메터 추가
   * @param key 키
   * @param value 값
   * @returns UriBuilder
   */
  add(key: string, value: any): UrlBuilder {
    this.parameters[key] = this.convertValue(value)
    return this
  }

  /**
   * 파라메터 추가 (base64)
   * @param key 키
   * @param value 값
   * @returns UriBuilder
   */
  addBase64(key: string, value: any): UrlBuilder {
    this.add(key, base64Converter.convert(this.convertValue(value)))
    return this
  }

  /**
   * 파라메터 추가 (base62)
   * @param key 키
   * @param value 값
   * @returns UriBuilder
   */
  addBase62(key: string, value: any): UrlBuilder {
    this.add(key, base62Converter.convert(this.convertValue(value)))
    return this
  }

  /**
   * URL 생성
   * @returns
   */
  build() {
    let paramString = qs.stringify(this.parameters)

    this.baseUrl = !this.baseUrl ? '' : this.baseUrl

    if (paramString) {
      if (this.baseUrl.indexOf('?') < 0) {
        paramString = '?' + paramString
      } else {
        paramString = '&' + paramString
      }
    }

    return `${this.baseUrl}${paramString}`
  }
}
