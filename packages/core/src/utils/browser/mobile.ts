/**
 * TODO: Module Description
 * @exports {@link modules}
 * @packageDocumentation
 */
import web from '../web'

declare const webkit: any

export class Mobile {
  /**
   * 네이티브 App 함수를 실행한다.
   * @param fnName
   * @param data
   */
  callNative = (fnName: string, data: any) => {
    try {
      if (web.isIOsRequest()) {
        webkit.messageHandlers[fnName].postMessage(data)
      } else {
        // @ts-ignore
        window.android[fnName](JSON.stringify(data))
      }
    } catch (e) {
      // console.error(e)
    }
  }

  /**
   * SMS 발송 기능을 호출한다.
   * @param phoneNo
   * @param body
   */
  callSms = (phoneNo: string, body: string) => {
    location.href = 'sms:' + phoneNo + (web.isIOsRequest() ? '&' : '?') + 'body=' + body
  }

  /**
   * 전화 걸기 기능을 호출한다.
   * @param phoneNo
   */
  callTel = (phoneNo: string) => {
    location.href = 'tel:' + phoneNo
  }

  /**
   * 이메일 기능을 호출한다.
   * @param phoneNo
   */
  callEmail = (email: string) => {
    location.href = 'mailto:' + email
  }
}

const instance = new Mobile()
export default instance
