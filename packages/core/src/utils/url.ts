/**
 * URL 관련 유틸리티
 */
export class UrlUtils {
  /**
   * url에서 URLSearchParams 객체를 생성
   * @param url
   * @returns
   */
  getUrlSearchParam(url: string) {
    if (!url) {
      return
    }

    if (url.indexOf('?') > 0) {
      url = url.substring(url.indexOf('?'))
    }

    return new URLSearchParams(url)
  }
}

const instance = new UrlUtils()
export default instance
