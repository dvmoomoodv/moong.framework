/**
 * json 관련 유틸리티
 * @exports {@link Json}
 * @packageDocumentation
 */

const FUNCTION_PREFIX = '*function:'

export class Json {
  /**
   * 함수가 포함된 object를 json 문자열로 변환
   * @param obj
   * @returns
   */
  stringifyWithFunction(obj: any): string {
    return JSON.stringify(obj, (key, val) => {
      if (typeof val === 'function' || (val && val.constructor === RegExp)) {
        return FUNCTION_PREFIX + String(val)
      }
      return val
    })
  }

  /**
   * 함수가 포함된 json 문자열을 object로 변환
   * @param json json 문자열
   */
  parseWithFunction(json: string) {
    return JSON.parse(json, (key, val) => {
      if (val && typeof val === 'string' && val.startsWith(FUNCTION_PREFIX)) {
        val = val.substring(FUNCTION_PREFIX.length)
        return new Function('return (' + val + ')')()
      }
      return val
    })
  }
}

const instance = new Json()
export default instance
