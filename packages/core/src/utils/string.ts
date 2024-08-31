/**
 * 문자열 관련 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 */

export class StringUtils {
  /**
   * 문자열의 byte를 조회
   * @param str
   */
  byteLength(str: string) {
    if (!str) {
      return 0
    }

    return str
      .split('')
      .map(s => s.charCodeAt(0))
      .reduce((prev, c) => prev + (c === 10 ? 2 : c >> 7 ? 2 : 1), 0)
  }

  /**
   * byte 수로 문자열 cut
   * @param s
   * @param len
   * @returns
   */
  cutByteLength(s, len) {
    if (s == null || s.length === 0) {
      return 0
    }

    let size = 0
    let rIndex = s.length

    for (let i = 0; i < s.length; i++) {
      size += s.charCodeAt(i) === 10 ? 2 : s.charCodeAt(i) >> 7 ? 2 : 1
      if (size === len) {
        rIndex = i + 1
        break
      } else if (size > len) {
        rIndex = i
        break
      }
    }
    return s.substring(0, rIndex)
  }

  // /**
  //  * 문자열의 패턴을 검사한다.
  //  * @param searchText 조회할 텍스트
  //  * @param patterns 패턴 목록
  //  * @see micromatch
  //  */
  // isMatchPatterns(searchText: string, ...patterns: string[]) {
  //   if (!searchText) {
  //     return false
  //   }

  //   for (const pattern of patterns) {
  //     if (searchText === pattern) {
  //       return true
  //     }

  //     if (micromatch.isMatch(searchText, pattern)) {
  //       return true
  //     }
  //   }

  //   return false
  // }

  /**
   * 문자열을 formatting 한다.
   * @param text 문자열
   * @param args 매개변수 목록
   * @returns
   * ```
   * format('가나다라{0}:{1}', 1, 2)
   * format('가나다라{0}:{1}', 1)
   * ```
   */
  format(text: string, ...args: any[]) {
    if (!text) {
      return ''
    }

    return text.replace(/\{(\d+)\}/g, function () {
      return typeof args[arguments[1]] === 'undefined' ? '' : args[arguments[1]]
    })
  }
}

const instance = new StringUtils()
export default instance
