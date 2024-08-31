/**
 * JWT 유틸리티
 * @packageDocumentation
 */
import { base64Converter } from './converter/base64-converter'

export class Jwt {
  /**
   * token claim parsing
   * @param token
   * @returns
   */
  parseClaim(token: string) {
    try {
      if (!token) {
        return null
      }
      const claim = token.split('.')[1]
      return JSON.parse(base64Converter.deconvert(claim))
    } catch (e) {
      return null
    }
  }
}

const instance = new Jwt()
export default instance
