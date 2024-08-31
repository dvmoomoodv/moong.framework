import ko from '../../i18n/ko.json'

export interface I18nProps extends Record<string, any> {
  /**
   * 활성화 여부
   * @default true
   */
  enabled?: boolean

  /**
   * local 설정
   * @default 'ko'
   */
  locale?: string

  /**
   * 메시지 설정
   */
  messages?: Record<string, I18nMessage>
}

export interface I18nMessage extends Record<string, any> {
  /**
   * 존재하지 않는 파일 그룹
   * @default '존재하지 않는 파일 그룹입니다. : {0}'
   */
  'ustra.file.notFoundFileGroup'?: string

  /**
   * 파일 허용 용량 초과
   * @default '파일 허용 용량을 초과하였습니다. : {0}\n최대 업로드 가능 용량은 \"{1}\" 입니다.'
   */
  'ustra.file.fileLimitExceeded'?: string

  /**
   * 파일 조회 오류
   * @default '파일 조회 중 오류가 발생하였습니다.'
   */
  'ustra.file.errorOnRetrievingFile'?: string

  /**
   * 파일 not found
   * @default '파일을 찾을 수 없습니다.'
   */
  'ustra.file.cannotFoundFile'?: string

  /**
   * 파일 업로드 오류
   * @default '파일 업로드 중 오류가 발생하였습니다.'
   */
  'ustra.file.errorOnUploadFile'?: string

  /**
   * 파일 다운로드 오류
   * @default '파일 다운로드 중 오류가 발생하였습니다.'
   */
  'ustra.file.errorOnDownloadFile'?: string

  /**
   * IP 주소 메뉴 접근 오류
   * @default '접속한 IP 주소는 접근이 불가능합니다.'
   */
  'ustra.management.cannotAccessbleMenuIpAddress'?: string

  /**
   * 요청 URL을 찾을 수 없음.
   * @default '요청 URL의 적합한 리소스를 찾을 수 없습니다.'
   */
  'ustra.error.notFoundUrl'?: string
}

export const defaultI18nProps = (): I18nProps => {
  return {
    enabled: true,
    locale: 'ko',
    messages: {
      default: ko,
      ko,
    },
  }
}
