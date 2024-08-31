/**
 * 서버 미들웨어 설정 관련 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 */
import { AppProps } from '../../../config/props'
import { JsonBodyParserOption, UrlEncodedBodyParserOption } from './body-parser'
import { ServerLoggingOption } from './loggings'
import { CompressionOption } from './compression'
import { MultipartOption } from './multipart'

/**
 * json body parser 기본 옵션 조회
 * @param appProps AppProps
 * @returns JsonBodyParserOption
 */
export const defaultJsonBodyParserOption = (appProps: AppProps): JsonBodyParserOption => {
  return {
    enabled: false,
    excludeUrlPatterns: [],
    includeUrlPatterns: [],
  }
}

/**
 * url encoded parser 기본 옵션 조회
 * @param appProps AppProps
 * @returns UrlEncodedBodyParserOption
 */
export const defaultUrlEncodedBodyParserOption = (appProps: AppProps): UrlEncodedBodyParserOption => {
  return {
    enabled: false,
    excludeUrlPatterns: [],
    includeUrlPatterns: [],
  }
}

/**
 * server logging 기본 옵션 조회
 * @param appProps AppProps
 * @returns ServerLoggingOption
 */
export const defaultServerLoggingOption = (appProps: AppProps): ServerLoggingOption => {
  return {
    enabled: false,
    format: appProps?.server?.dev ? 'dev' : 'combined',
    excludeUrlPatterns: [],
    includeUrlPatterns: [],
  }
}

/**
 * compression 기본 옵션 조회
 * @param appProps AppProps
 * @returns CompressionOption
 */
export const defaultCompressionOption = (appProps: AppProps): CompressionOption => {
  return {
    enabled: true,
    excludeUrlPatterns: [],
    includeUrlPatterns: [],
  }
}

/**
 * multipart 기본 옵션 조회
 * @param appProps AppProps
 * @returns MultipartOption
 */
export const defaultMultipartOption = (appProps: AppProps): MultipartOption => {
  return {
    enabled: false,
    excludeUrlPatterns: [],
    includeUrlPatterns: [],
  }
}
