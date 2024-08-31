/**
 * 브라우저 메시지 관련 유틸리티
 * @exports {@link Message}
 * @packageDocumentation
 */
import objects from '../objects'

export type MessageListener = (this: Window, ev: MessageEvent & { value?: any }) => void
const postMessageListnerMap: Map<string, MessageListener> = new Map()

export class Message {
  /**
   * message 이벤트를 수신한다.
   * @param type 메시지 유형
   */
  listenMessage = (type: string, listener: MessageListener) => {
    this.removeListenMessage(type)
    const originListener = listener
    listener = ev => {
      if (ev.data && ev.data.type === type) {
        objects.setProperty(ev, 'value', ev.data.value)
        originListener.call(window, ev)
      }
    }
    postMessageListnerMap.set(type, listener)
    window.addEventListener('message', listener)
  }

  /**
   * 타임아웃 이벤트 수신
   * @param type
   * @param timeout 타임아웃 (ms)
   * @param listener 리스너
   * @param timeoutListener 타임아웃 리스너
   */
  listenMessageWithTimeout = (type: string, timeout: number, listener: MessageListener, timeoutListener: MessageListener) => {
    let received: boolean = false

    this.removeListenMessage(type)
    const originListener = listener
    listener = ev => {
      if (ev.data && ev.data.type === type) {
        if (received) {
          return
        }

        received = true
        objects.setProperty(ev, 'value', ev.data.value)
        originListener.call(window, ev)
      }
    }
    postMessageListnerMap.set(type, listener)

    setTimeout(() => {
      if (received) {
        return
      }
      this.removeListenMessage(type)
      received = true
      timeoutListener.call(window, null)
    }, timeout)

    window.addEventListener('message', listener)
  }

  /**
   * message 이벤트를 제거한다.
   * @param type
   */
  removeListenMessage = (type: string) => {
    if (postMessageListnerMap.has(type)) {
      const listner = postMessageListnerMap.get(type)
      window.removeEventListener('message', listner)
    }
  }

  /**
   * 메시지를 전송한다.
   * @param type 메시지 유형
   * @param value 전송 값
   */
  postMessage = (type: string, value: any, win?: Window) => {
    if (win) {
      win.postMessage({ type, value }, '*')
    } else {
      if (window.opener) {
        window.opener.postMessage({ type, value }, '*')
      }

      if (window.parent) {
        window.parent.postMessage({ type, value }, '*')
      }
    }
  }
}

const instance = new Message()
export default instance
