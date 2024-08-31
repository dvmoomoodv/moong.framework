/**
 * current request에 접근 가능한 유틸리티
 * @packageDocumentation
 */
import requestContextLib from 'request-context'

/**
 * Request 객체를 변환하는 유틸리티
 */
export class RequestContextHolder {
  private static readonly NAMESPACE: string = 'request'

  /**
   * http 미들웨어 반환
   * @example
   * ```typescript
   * ```
   */
  middleware() {
    return requestContextLib.middleware(RequestContextHolder.NAMESPACE)
  }

  /**
   * context 저장 값 추가
   * @param key 키 값
   * @param val Value 값
   */
  set(key: string, val: any) {
    requestContextLib.set(`${RequestContextHolder.NAMESPACE}:${key}`, val)
  }

  /**
   * context 저장 값 조회
   * @param key 키 값
   */
  get(key: string): any {
    return requestContextLib.get(`${RequestContextHolder.NAMESPACE}:${key}`)
  }

  /**
   * request 객체 저장
   */
  setRequest(request) {
    this.set('request', request)
  }

  /**
   * request 객체 조회
   */
  getRequest() {
    return this.get('request')
  }

  /**
   * request 객체 저장
   */
  setResponse(response) {
    this.set('response', response)
  }

  /**
   * request 객체 조회
   */
  getResponse() {
    return this.get('response')
  }
}

export const requestContextHolder = new RequestContextHolder()
