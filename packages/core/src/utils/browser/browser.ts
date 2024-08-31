/**
 * 브라우저 관련 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 */
import web from '../web'

export class Browser {
  /**
   * IE 기존 브라우저 확인 (<=IE11)
   * @returns IE 브라우저 여부
   */
  isIEOldBrowser(): boolean {
    const userAgent = web.getUserAgent()
    const msie = userAgent.indexOf('MSIE ')
    return msie > 0 || !!userAgent.match(/Trident.*rv\:11\./)
  }

  /**
   * IE Edge 브라우저 확인
   */
  isIEEdgeBrowser = (): boolean => {
    const userAgent = web.getUserAgent()
    const edge = userAgent.indexOf('Edge/')
    return edge > 0
  }

  /**
   * IE 브라우저 여부 확인
   */
  isIEBrowser = (): boolean => {
    return this.isIEOldBrowser() || this.isIEEdgeBrowser()
  }

  /**
   * 브라우저 복사 방지를 수행한다.
   */
  startBlockCopy = () => {
    if (!web.isBrowser) {
      return
    }

    // @ts-ignore
    if (document.__blockCopied) {
      return
    }
    const blockFn = e => (e.returnValue = false)

    // @ts-ignore
    document.__blockCopied = true
    document.body.addEventListener('selectstart', blockFn)
    document.body.addEventListener('contextmenu', blockFn)
    document.body.addEventListener('copy', blockFn)

    // @ts-ignore
    document.__blockFn = blockFn
  }

  /**
   * 브라우저 복사 방지를 중지 한다.
   */
  stopBlockCopy = () => {
    if (!web.isBrowser) {
      return
    }

    // @ts-ignore
    if (!document.__blockCopied) {
      return
    }

    // @ts-ignore
    document.__blockCopied = false

    // @ts-ignore
    if (document.__blockFn) {
      // @ts-ignore
      document.body.removeEventListener('selectstart', document.__blockFn)
      // @ts-ignore
      document.body.removeEventListener('contextmenu', document.__blockFn)
      // @ts-ignore
      document.body.removeEventListener('copy', document.__blockFn)
    }

    // @ts-ignore
    document.__blockFn = null
  }

  /**
   * 텍스트를 복사한다.
   * @param text 텍스트
   */
  copyText = (text: string) => {
    const copyToClipBoard = (text: string) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)

      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      copyToClipBoard(text)
    } else {
      navigator.clipboard.writeText(text).then(
        () => {
          // logger().info('success copy text')
        },
        err => {
          // logger().error('could not copy text', err)
          copyToClipBoard(text)
        },
      )
    }
  }
}

const instrance = new Browser()
export default instrance
