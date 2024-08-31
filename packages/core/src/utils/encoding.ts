/**
 * 인코딩 유틸리티
 * @packageDocumentation
 */
import baseX from 'base-x'
import { Base64 } from 'js-base64'

export class Encoding {
  private base62 = baseX('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')

  /**
   * base62 인코딩
   * @param str
   * @returns
   */
  encodeBase62(str: string) {
    if (!str) {
      return str
    }

    // return this.base62.encode(Buffer.from(str, 'utf-8'))
    return this.base62.encode(new TextEncoder().encode(str))
  }

  /**
   * base62 문자열을 평문으로 변경
   * @param str
   */
  decodeBase62(str: string) {
    if (!str) {
      return str
    }
    return this.base62.decode(str).toString()
  }

  /**
   * 문자열을 base64 포맷으로 변환
   * @param str
   */
  encodeBase64(str: string) {
    if (!str) {
      return str
    }

    return Base64.encode(str)
  }

  /**
   * base64 문자열을 평문으로 변경
   * @param str
   */
  decodeBase64(str: string) {
    if (!str) {
      return str
    }
    return Base64.decode(str)
  }
}

const instance = new Encoding()
export default instance
