/**
 * markdown 유틸리티
 * @packageDocumentation
 */
// import hljs from 'highlight.js'
import hljs from 'highlight.js/lib/common'
import mdit from 'markdown-it'

import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
import fn from 'markdown-it-footnote'
import emo from 'markdown-it-emoji'
import def from 'markdown-it-deflist'
import ins from 'markdown-it-ins'
import container from 'markdown-it-container'
import highlightjs from 'markdown-it-highlightjs'
import plantuml from 'markdown-it-plantuml'
import core from '../core'

export class Markdown {
  private renderer = null

  createMarkdownItRenderer(options: any = {}) {
    options = core.deepMerge(options || {}, {
      html: true,
      xhtmlOut: false,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: true,
      quotes: '“”‘’',
      // highlight: function (str, lang) {
      //   if (lang && hljs.getLanguage(lang)) {
      //     try {
      //       return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>'
      //     } catch (error) {
      //       console.log(error)
      //     }
      //   }

      //   return '<pre class="hljs"><code>' + mdit.utils.escapeHtml(str) + '</code></pre>'
      // },
    })

    const markdownit = new mdit(options)
      .use(sub)
      .use(sup)
      .use(fn)
      .use(emo)
      .use(def)
      .use(ins)
      .use(container, 'codeblock', { marker: '@' })
      .use(highlightjs, {
        hljs,
      })
      .use(plantuml)

    markdownit.linkify.set({ fuzzyEmail: false })

    return markdownit
  }

  /**
   * 전역 사용 마크다운 renderer를 조회
   * @returns
   */
  getGlobalMarkdownRenderer() {
    if (!this.renderer) {
      this.renderer = this.createMarkdownItRenderer()
    }

    return this.renderer
  }
}

const instance = new Markdown()
export default instance
