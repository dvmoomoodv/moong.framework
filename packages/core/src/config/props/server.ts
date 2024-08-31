/**
 * 서버 설정 설정
 * @exports Server
 * @exports defaultProps
 * @packageDocumentation
 */

/**
 * 인증 관련 설정
 */
import { ServerLoggingOption } from "#moong/core/server/http/middlewares/loggings";
import {
  JsonBodyParserOption,
  UrlEncodedBodyParserOption,
} from "#moong/core/server/http/middlewares/body-parser";
import { MultipartOption } from "#moong/core/server/http/middlewares/multipart";
import { CompressionOption } from "#moong/core/server/http/middlewares/compression";
import { ProxyModuleOptions } from "#moong/core/server/http/middlewares/proxy";
import { StaticServeModuleOptions } from "#moong/core/server/http/middlewares/static-serve";

/**
 * 미들웨어 옵션
 */
interface Middleware extends Record<string, any> {
  /**
   * 서버 압축 설정
   */
  compression?: CompressionOption;

  /**
   * bodyParser 설정 (json)
   */
  jsonBodyParser?: JsonBodyParserOption;

  /**
   * bodyParser 설정 (url encoded)
   */
  urlEncodedBodyParser?: UrlEncodedBodyParserOption;

  /**
   * multipart 사용 설정
   */
  multipart?: MultipartOption;

  /**
   * 서버 로깅 사용설정
   */
  logging?: ServerLoggingOption;

  /**
   * 프록시 설정
   */
  proxy?: ProxyModuleOptions;

  /**
   * static directory options
   */
  static?: StaticServeModuleOptions;
}

interface Server extends Record<string, any> {
  /**
   * Node 서버 활성화 여부
   */
  enabled?: boolean;

  /**
   * 로컬 개발용 서버 여부
   */
  dev?: boolean;

  /**
   * server port
   * @default process.env.PORT
   */
  port?: number;

  /**
   * server host
   * @default process.env.HOST
   */
  host?: string;

  /**
   * 미들웨어 설정
   */
  middleware?: Middleware;

  /**
   * API URL
   */
  apiServerBaseUrl?: string;
}

export type { Middleware, Server };
