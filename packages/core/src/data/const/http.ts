/**
 * HTTP Protocol
 */
export enum HttpProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

/**
 * 공통 HttpHeader 객체
 */
export const HttpHeaders = {
  USER_AGENT: 'User-Agent',
  REST_API_HEADER: 'rest-api-header',

  X_TRAN_ID: 'X-Tran-Id',
  MENU_ID: 'Menu-Id',
  PROGRAM_ID: 'Program-Id',
}
