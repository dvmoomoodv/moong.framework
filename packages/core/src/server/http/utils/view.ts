/**
 * View 관련 유틸리티
 * @exports {@link HttpServerUtils}
 * @packageDocumentation
 */
import { IncomingMessage } from 'http'
import { objects, script as scriptUtils } from '#ustra/core/utils'

/**
 * 서버 데이터 설정 키
 */
const MIDDLEWARE_SERVER_DATA_KEY = 'SERVER_DATA'

/**
 * View 관련 유틸리티
 */
export class ViewUtils {
  /**
   * request 객체에 서버 데이터를 추가
   * @param req 요청 정보
   * @param data 데이터
   */
  serverData(req: IncomingMessage, data: any) {
    objects.setProperty(req, MIDDLEWARE_SERVER_DATA_KEY, data)
  }

  /**
   * html 문서 생성
   * @param head
   * @param content
   */
  generateHtmlDoc(head: string = null, content: string = null) {
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">${head}</head><body>${content}</body></html>`
  }

  /**
   * 스크립트 태그 생성
   * @param content
   * @param type
   */
  generateScript(content: string = null, type: string = 'text/javascript') {
    return `<script type="${type}">${content}</script>`
  }

  /**
   * 스크립트 용 문서 생성
   * @param content
   * @param type
   */
  generateScriptDoc(content: string = null, type: string = 'text/javascript') {
    return this.generateHtmlDoc('', this.generateScript(content, type))
  }

  /**
   * 스크립트 용 문서 생성
   * @param contents
   */
  generateScriptsDoc(...contents: string[]) {
    return this.generateHtmlDoc('', this.generateScript(scriptUtils.generate(...contents)))
  }

  /**
   * post message 전송 스크립트 생성
   * @param type 유형
   * @param data 전송 데이터
   * @param target 메시지 타겟
   * @param addClassScript window.close 스크립트 포함여부
   */
  generatePostMessageScriptDoc(type: string, data: any, target: 'opener' | 'parent' = 'parent', addCloseScript: boolean = false) {
    const content = `window.${target}.postMessage({type:"${type}", value:${JSON.stringify(data)}})`
    const script = scriptUtils.generate(content, addCloseScript ? 'window.close()' : null)
    const scriptContent = this.generateScript(script)

    return this.generateHtmlDoc('', scriptContent)
  }
}

const instance = new ViewUtils()
export default instance
