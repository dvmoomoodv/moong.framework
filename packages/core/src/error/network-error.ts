/**
 * 네트워크 통신 관련 오류 정의
 */
export class NetworkError extends Error {
  /**
   * 에러 코드
   */
  public errorCode: string = null

  /**
   * 본문
   */
  public body: any = null

  /**
   * 네트워크 오류 여부
   */
  public isNetworkError = true

  /**
   * error 명
   */
  public name = 'NetworkError'

  /**
   * 통신 설정 값
   */
  public config: any = null

  /**
   * origin error 객체
   */
  public originError: Error = null

  /**
   * 타임아웃 오류 여부
   */
  public timeout: boolean = false

  /**
   * 취소 오류 여부
   */
  public canceled: boolean = false

  /**
   * 유효하지 않은 응답 코드 여부
   */
  public invalidResCode: boolean = false

  /**
   * 상태 코드
   */
  public statusCode: number = 200

  constructor(error: Error, errorCode: string, config: any = null) {
    super(error.message)
    this.errorCode = errorCode
    this.config = config
    this.originError = error

    if (typeof error['timeout'] === 'boolean') {
      this.timeout = error['timeout']
    }

    if (typeof error['canceled'] === 'boolean') {
      this.canceled = error['canceled']
    }
  }
}
