import html2pdf from 'html2pdf-jspdf2'
import { jsPDFOptions, jsPDF } from 'jspdf'
import { Options as Html2CanvasOptions } from 'html2canvas'

export type PagebreakMode = 'avoid-all' | 'css' | 'legacy'

export interface PdfUtilsOptions {
  /**
   * PDF margin (in jsPDF units). Can be a single number, [vMargin, hMargin], or [top, left, bottom, right].
   */
  margin?: number | [number, number] | [number, number, number, number]

  /**
   * The default filename of the exported PDF.
   * @default 'file.pdf'
   */
  filename?: string

  /**
   * The image type and quality used to generate the PDF.
   * @see https://www.npmjs.com/package/html2pdf-jspdf2#image-type-and-quality
   */
  image?: {
    type?: string
    quality: number
  }
  /**
   * If enabled, PDF hyperlinks are automatically added ontop of all anchor tags.
   * @default true
   */
  enableLinks?: boolean

  /**
   * Configuration options sent directly to html2canvas
   * @see https://html2canvas.hertzen.com/configuration
   */
  html2canvas?: Partial<Html2CanvasOptions>

  /**
   * Configuration options sent directly to jsPDF
   * @see https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html
   */
  jsPDF?: jsPDFOptions

  /**
   * Controls the pagebreak behaviour on the page.
   * @see https://www.npmjs.com/package/html2pdf-jspdf2#page-breaks
   */
  pagebreak?: {
    mode?: PagebreakMode | PagebreakMode[]
    before?: string | string[]
    after?: string | string[]
    avoid?: string | string[]
  }
}

/**
 * Wrapped html2pdf.js
 * @see https://www.npmjs.com/package/html2pdf-jspdf2#page-breaks
 */
export class PdfCreator {
  public html2pdf = null
  constructor() {
    this.html2pdf = html2pdf()
  }

  /**
   * 변환 대상 지정
   */
  from(src: HTMLElement | string, type?: 'string' | 'elelemnt' | 'canvas' | 'img') {
    return this.html2pdf.from(src, type) as PdfCreator
  }

  /**
   * jsPdf의 output 메소드를 사용하여 pdf 변환
   * @param type
   * @param options
   * @returns
   * @see https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
   * @see https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html#output
   */
  outputPdf(
    type?: 'arraybuffer' | 'blob' | 'bloburi' | 'datauristring' | 'datauri' | 'dataurlnewwindow' | 'pdfobjectnewwindow' | 'pdfjsnewwindow',
    options?: jsPDFOptions | string,
  ) {
    return this.html2pdf.outputPdf(type, options) as Promise<any>
  }

  /**
   * 저장
   * @param filename 파일 명
   * @returns
   */
  save(filename?: string) {
    return this.html2pdf.save(filename) as PdfCreator
  }

  /**
   * PDF 옵션 설정
   */
  set(options: PdfUtilsOptions) {
    return this.html2pdf.set(options) as PdfCreator
  }

  /**
   * 오류 발생 시 처리
   * @param onRejected
   */
  catch(onRejected: (e: any) => void | Promise<void>) {
    return this.html2pdf.catch(onRejected) as PdfCreator
  }

  /**
   * PDF Creation
   */
  public static createPdf(options?: PdfUtilsOptions) {
    const pdfCreator = new PdfCreator()

    if (options) {
      return pdfCreator.set(options)
    }

    return pdfCreator
  }
}
