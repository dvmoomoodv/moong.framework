// https://github.com/Yaffle/EventSource
import { EventSourcePolyfill } from 'event-source-polyfill'
const EventSource = EventSourcePolyfill

export interface SseEmitterOption {
  /**
   * URL
   */
  url: string

  /**
   * 인증 정보 전송 여부
   */
  withCredentials?: boolean

  /**
   * 헤더 정보
   */
  headers?: Record<string, any>

  /**
   * last event id 쿼리 파라메터 명
   */
  lastEventIdQueryParameterName?: string

  /**
   * 메시지 수신 시 처리 콜백
   */
  onmessage?: ((this: EventSource, ev: MessageEvent) => any) | null

  /**
   * 에러 수신 시 처리 콜백
   */
  onerror?: ((this: EventSource, ev: MessageEvent) => any) | null

  /**
   * 오픈 시 처리 콜백
   */
  onopen?: ((this: EventSource, ev: MessageEvent) => any) | null
}

/**
 * Request Interceptor Handler Function
 */
export type SseEmitterRequestInterceptorHandler = (option: SseEmitterOption) => SseEmitterOption

export class Sse {
  private requestIntercetorHandlers: SseEmitterRequestInterceptorHandler[] = []

  /**
   * sse 연결
   * @param option 옵션
   */
  connect(option: SseEmitterOption): EventSource {
    for (const requestIntercetorHandler of this.requestIntercetorHandlers) {
      option = requestIntercetorHandler(option)
    }

    const eventSource = new EventSource(option.url, { withCredentials: !!option.withCredentials })

    if (option.onmessage) {
      eventSource.onmessage = option.onmessage
    }

    if (option.onerror) {
      eventSource.onerror = option.onerror
    }

    if (option.onopen) {
      eventSource.onopen = option.onopen
    }

    return eventSource
  }

  /**
   * request interceptor 추가
   * @param handler interceptor handler
   */
  addRequestInterceptor(handler: SseEmitterRequestInterceptorHandler) {
    this.requestIntercetorHandlers.push(handler)
  }
}

const instance = new Sse()
export default instance
