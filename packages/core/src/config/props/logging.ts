/**
 * 로깅 관련 설정
 * @packageDocumentation
 * @exports Logging
 * @exports defaultLoggingProps
 * @exports LogLevel
 */
import { AppProps } from '.'

/**
 * logging level
 */
enum LogLevel {
  Fatal = 0,
  Error = 0,
  Warn = 1,
  Log = 2,
  Info = 3,
  Success = 3,
  Debug = 4,
  Trace = 5,
  Silent = -Infinity,
  Verbose = Infinity,
}

/**
 * 로깅 관련 설정
 */
interface Logging extends Record<string, any> {
  /**
   * logging level
   * @default debug
   */
  level?: LogLevel

  /**
   * logger name
   * @default ustra
   */
  name?: string

  /**
   * 파일 로깅 설정
   */
  file?: {
    /**
     * 파일 로깅 적재 여부
     * @default false
     */
    enabled?: boolean

    /**
     * 파일 로깅 시 적재 directory 경로
     * @default applicationRoot/logs
     */
    dirPath?: string

    /**
     * file logging name
     * %DATE% 문자열은 datePattern으로 replace
     * @default application.%DATE%.log
     */
    filename?: string

    /**
     * error 로그를 저장할 파일 명
     * 파일명을 설정할 경우, error level의 별도 로그를 적재한다.
     * @default error.%DATE%.log
     */
    errFilename?: string

    /**
     * 일자 패턴
     * @default YYYY-MM-DD
     * YYYY-MM-DD-HH로 설정할 경우, 시간별 rotate
     */
    datePattern?: string

    /**
     * 백업 파일 zip 압축 여부
     * @default false
     */
    zippedArchive?: boolean

    /**
     * file logging size (byte)
     * number : byte 길이
     * string : k, m, g 로 파일 사이즈 단위
     * @default null
     */
    maxSize?: number | string

    /**
     * 로그 파일 유지 수
     * number : 파일 수
     * string : number + 'd' => 일수
     * @default 30
     */
    maxFiles?: number | string
  }

  /**
   * 브라우저 로깅 설정
   */
  browser?: {
    /**
     * 로깅 비활성화 여부
     * @default false
     */
    disabled?: boolean
  }
}

export type { Logging }
export { LogLevel }
