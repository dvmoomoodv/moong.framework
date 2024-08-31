/**
 * JSON 유틸리티
 * @exports {@link Json}
 * @packageDocumentation
 */
import { inspect } from 'util'

export class Json {
  /**
   * json serializing (circular error 방지)
   * @param obj json 변환 객체
   */
  safeStringify(obj: any): string {
    return inspect(obj)
  }

  /**
   * function을 포함하여 string 변환
   * @param obj json 변환 객체
   */
  functionStringify(obj: any): string {
    return JSON.stringify(obj, function (key, val) {
      if (typeof val === 'function' || (val && val.constructor === RegExp)) {
        return String(val)
      }

      return val
    })
  }

  /**
   * formating stringify
   * @param obj 변환 객체
   * @param space padding space number
   */
  format(obj: any, space: number = 4): string {
    return JSON.stringify(obj, null, space)
  }
}

const instance = new Json()
export default instance
