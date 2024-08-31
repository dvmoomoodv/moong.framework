/**
 * View 관련 유틸리티
 * @exports {@link ScriptUtils}
 * @packageDocumentation
 */
import endsWith from 'lodash/endsWith'

/**
 * 스크립트 관련 유틸리티
 */
export class ScriptUtils {
  /**
   * 스크립트 연결 문자열 생성
   * @param scripts
   */
  generate(...scripts: string[]) {
    let scriptStr = ''
    for (const script of scripts) {
      if (!script) {
        continue
      }

      if (!endsWith(script)) {
        scriptStr += script + ';'
      } else {
        scriptStr += script
      }
    }

    return scriptStr
  }
}

const instance = new ScriptUtils()
export default instance
