/**
 * 암호화 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 */

import CryptoJS from 'crypto-js'
import encoding from '../encoding'
import system from '../system'

export class Crypto {
  /**
   * AES256 암호화
   * @param data 데이터
   * @param secret 키 값
   * @returns 암호화 값
   */
  encryptAes256(data: string, secret: string) {
    return CryptoJS.AES.encrypt(data, CryptoJS.enc.Base64.parse(secret), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
  }

  /**
   * AES256 복호화
   * @param data 데이터
   * @param secret 키 값
   * @returns 암호화 값
   */
  decryptAes256(data: string, secret: string) {
    return CryptoJS.AES.decrypt(data, CryptoJS.enc.Base64.parse(secret), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
  }

  /**
   * random secret 생성
   * @returns
   */
  generateSecret() {
    return encoding.encodeBase64(system.uuidBase62().substring(0, 16))
  }
}

const instance = new Crypto()
export default instance
