/**
 * dom handling 관련 유틸리티
 * @packageDocumentation
 */

export class Dom {
  /**
   * frame의 html을 replace 한다.
   * @param frameEl frame dom
   * @param html html string
   */
  replaceFrameHtml = (frameEl: HTMLIFrameElement | HTMLFrameElement, html: string) => {
    frameEl.contentWindow.document.open()
    frameEl.contentWindow.document.write(html)
    frameEl.contentWindow.document.close()
  }

  /**
   * form element를 생성한다.
   * @param target 타겟
   * @param method 메소드
   * @param action 액션
   * @param paramMap 파라메터 맵
   */
  createForm(target: string, method: 'GET' | 'POST' = 'GET', action?: string, paramMap?: Map<string, string>) {
    const formElement = document.createElement('form')
    formElement.target = target
    formElement.method = method

    if (action) {
      formElement.action = action
    }

    if (paramMap) {
      paramMap.forEach((v, k) => {
        const inputEl = document.createElement('input')
        inputEl.type = 'hidden'
        inputEl.name = k
        inputEl.value = v

        formElement.appendChild(inputEl)
      })
    }
    document.body.appendChild(formElement)

    return formElement
  }

  /**
   * html로 element 생성
   * @param html
   */
  htmlToElement(html: string) {
    const template = document.createElement('template')
    html = html.trim()
    template.innerHTML = html
    return template.content.firstChild
  }

  /**
   * html로 elements 생성
   * @param html
   */
  htmlToElements(html: string) {
    const template = document.createElement('template')
    html = html.trim()
    template.innerHTML = html
    return template.content.childNodes
  }

  /**
   * 지정 url의 스크립트 태그를 head에 생성
   * @param src source url
   */
  appendScriptSource(src: string) {
    // 동일한 src의 스크립트가 삽입되어 있는지 확인
    const scriptTags = document.getElementsByTagName('script')
    for (let i = 0; i < scriptTags.length; i++) {
      if (scriptTags[i].src === src) {
        return
      }
    }

    const loadScriptEl = document.createElement('script')
    loadScriptEl.type = 'text/javascript'
    loadScriptEl.src = src

    document.head.appendChild(loadScriptEl)
  }

  /**
   * element에 스크립트를 삽입
   * @param el element
   * @param script script 문자열
   */
  appendScript(el: Element, script: string) {
    const loadScriptEl = document.createElement('script')
    loadScriptEl.type = 'text/javascript'
    const loadTextEl = document.createTextNode(script)
    loadScriptEl.appendChild(loadTextEl)

    el.appendChild(loadScriptEl)
  }

  /**
   * 상위 element의 스크롤이 모두 최상단 위치 여부 확인
   * @param el element
   */
  isAllScrollerIsTop(el: Element) {
    while (true) {
      if (!el) {
        break
      }
      if (el.tagName === 'body') {
        break
      }

      if ((el.scrollTop || 0) > 0) {
        return false
      }

      el = el.parentElement
    }
    return true
  }

  /**
   * element의 스크롤이 하단에 있는지 확인
   * @param el element
   * @param offset 간격
   */
  isScrollBottom(el: HTMLElement, offset: number = 1) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < offset
  }

  /**
   * element가 invisible 상태인지 확인
   * @param el element
   */
  isHidden(el: Element) {
    // @ts-ignore
    return el.offsetParent === null
  }

  /**
   * element가 focus 상태인지 확인
   * @param el
   */
  isFocus(el: Element) {
    return document.activeElement === el
  }

  /**
   * dom을 필터링하여 select한다.
   * @param sourceEl 검색 대상 element
   * @param filterFn filtering function
   * @param includeSelf source el 포함 여부
   */
  querySelectors(sourceEl: Element, filterFn: (el: Element) => boolean | 'exclude', includeSelf: boolean = false): Element[] {
    const selectors: Element[] = []

    function findChild(el: Element, depth: number = 0) {
      if (depth === 0 && includeSelf) {
        const result = filterFn(sourceEl)
        if (result === true) {
          selectors.push(sourceEl)
        } else {
          if (result === 'exclude') {
            return
          }
        }
      }

      const children = el.children

      for (let index = 0; index < children.length; index++) {
        const currentChild = children.item(index)

        const result = filterFn(currentChild)
        if (result === true) {
          selectors.push(currentChild)
        } else {
          if (result !== 'exclude') {
            findChild(currentChild, depth++)
          }
        }
      }
    }

    findChild(sourceEl)

    return selectors
  }

  /**
   * css 크기 단위 변환
   * @param unit 단위
   * @param unitSuffix 단위 값
   * @returns
   */
  getCssUnit(unit: string | number | null | undefined, unitSuffix = 'px'): string {
    if (unit == null || unit === '') {
      return undefined
    } else if (isNaN(+unit!)) {
      return String(unit)
    } else {
      return `${Number(unit)}${unitSuffix}`
    }
  }

  /**
   * dom 내의 focusable 객체를 조회
   * @param el
   * @returns
   */
  findFocusableEl(el: HTMLElement) {
    if (!el?.parentElement) {
      return null
    }

    const queryTags = 'input:not([type=hidden]),textarea:not([type=hidden]),button,select'

    const selfEls = el.parentElement.querySelectorAll(queryTags)
    if (Array.from(selfEls).some(e => e === el)) {
      return el
    }

    return el.querySelector(queryTags) as HTMLElement
  }

  /**
   * dom 내의 focusable 객체를 찾아 focus 처리
   * @param el
   */
  focus(el: HTMLElement) {
    const targetEl = this.findFocusableEl(el)

    if (targetEl && targetEl['focus']) {
      targetEl['focus']()
    }
  }
}

const instance = new Dom()
export default instance
