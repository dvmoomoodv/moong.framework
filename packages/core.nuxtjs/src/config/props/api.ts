import type { RequestConfig } from '#ustra/core/utils/axios'
import type { TaskQueueOptions } from '#ustra/core/utils/task/task-queue'

/**
 * API origin option
 */
export interface ApiOriginOptions extends RequestConfig {
  /**
   * 로딩 바 display 여부
   * @default true
   */
  showLoadingBar?: boolean

  /**
   * API 응답 코드 오류 시 PASS 여부
   */
  passOnResponseError?: boolean

  /**
   * 특정 응답 코드일 경우, 오류 처리하지 않음.
   * @default ['0000']
   */
  passOnResponseCode?: string[]

  /**
   * 인증 검증 제외 여부
   * @default false
   */
  excludeAuthValidation?: boolean

  /**
   * 보안 암호화 통신 여부
   * @default false
   */
  secured?: boolean

  /**
   * 거래아이디(undefined일 경우 신규 생성)
   */
  tranId?: string

  /**
   * 거래 유형 아이디 (고유 아이디를 사용하여 일괄 취소를 처리할 수 있다.)
   * @since 3.0.0-rc.5
   */
  tranTypeId?: string
}

/**
 * API 옵션
 */
export interface ApiOptions
  extends Partial<
      Omit<
        ApiOriginOptions,
        | 'transformRequest'
        | 'transformResponse'
        | 'paramsSerializer'
        | 'adapter'
        | 'onUploadProgress'
        | 'onDownloadProgress'
        | 'validateStatus'
        | 'cancelToken'
        | 'axiosInstance'
        | 'httpAgent'
        | 'httpsAgent'
        | 'jsonp'
        | 'axios-retry'
        | 'cancelToken'
        | 'signal'
      >
    >,
    Partial<TaskQueueOptions> {
  /**
   * API로부터 오류 응답 수신 시 에러 발생 여부
   * @default true
   */
  occurErrorwhenReceivedApiErrCode?: boolean

  /**
   * 오류 응답 수신 무신 처리 URL 패턴
   */
  ignoreErrorUrlPatterns?: string[]

  /**
   * 인증이 만료되었을 경우, API의 오류를 체크 비활성화 여부
   * @default true
   */
  disableCheckErrorWhenAuthInactivated?: boolean

  /**
   * excludeAuthValidation 속성이 설정되지 않았을 경우, 서버 상에서 excludeAuthValidation 값을 true로 설정한다.
   * @default true
   */
  excludeAuthValidationOnServer?: boolean
}
