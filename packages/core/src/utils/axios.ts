/**
 * AXIOS 관련 유틸리티
 * @exports axios
 * @packageDocumentation
 */
// import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, CancelTokenSource, Method, Cancel } from 'axios-jsonp-pro'
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, CancelTokenSource, Method, Cancel } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry'
import pick from 'lodash/pick'
import web from './web'
import core from './core'
import date from './date'
import logging from './logging'
import { Queue } from './queue'
import qs from 'qs'

const logger = logging.getLogger('axios')

export interface RequestConfig extends AxiosRequestConfig, IAxiosRetryConfig {
  /**
   * axiosInstance
   */
  axiosInstance?: AxiosInstance

  /**
   * jsonp
   */
  jsonp?: boolean

  /**
   * params 데이터 URL 인코딩 수행 여부
   * @default false
   * @since 3.0.2-stable
   */
  encodeURIParams?: boolean
}

export class AxiosUtils {
  /**
   * create axios instance
   * @param config
   * @returns
   */
  createInstance(config: RequestConfig = {}): AxiosInstance {
    // for default for retry
    if (core.isEmpty(config.retries)) {
      config.retries = 0
    }

    if (!web.isBrowser) {
      if (!config.headers) {
        config.headers = {}
      }

      if (!config.headers.common) {
        config.headers.common = {}
      }
      config.headers.common['accept-encoding'] = 'gzip, deflate'
    }

    const axiosInstnace = axios.create(config)
    axiosInstnace['CancelToken'] = axios.CancelToken
    axiosInstnace['isCancel'] = axios.isCancel

    // @ts-ignore
    // axiosRetry(axiosInstnace, this.pickRetryOption(config))

    return axiosInstnace
  }

  /**
   * retry option 적용
   * @param axios
   * @param config
   */
  applyRetry(axios: AxiosInstance, config: RequestConfig) {
    // console.log('this.pickRetryOption(config)', this.pickRetryOption(config))
    // @ts-ignore
    axiosRetry(axios, this.pickRetryOption(config))
  }

  /**
   * 요청 값에서 retry 옵션 추출
   * @param config
   */
  pickRetryOption(config: RequestConfig): IAxiosRetryConfig {
    return pick(config, 'retries', 'retryCondition', 'shouldResetTimeout', 'retryDelay', 'onRetry')
  }

  /**
   * call axios api
   * @param config
   * @returns
   */
  async call<T = any>(config: RequestConfig): Promise<AxiosResponse<T>> {
    const axiosInstance: AxiosInstance = config.axiosInstance || axios

    /**
     * config.encodeURIParams
     * true 설정시에 querystring 파서가 동작하면서
     * null값인 항목에 대해서는 skip 처리를 수행한다.
     */
    if (config.encodeURIParams) {
      config.paramsSerializer = params => qs.stringify(params, { skipNulls: true })
    }

    if (config.jsonp) {
      // const res = await axiosInstance.jsonp<T>(config.url, config)
      // return res as AxiosResponse<T>
      if (!web.isBrowser) {
        throw new Error('JSONP request only supported when client mode')
      }

      const data = (await this.jsonp(config)) as T
      return {
        // @ts-ignore
        config,
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
      }
    } else {
      // for axios retry
      config['axios-retry'] = this.pickRetryOption(config)

      const res = await axiosInstance.request<T>(config)
      return res as AxiosResponse<T>
    }
  }

  private jsonpCount: number = 0
  private jsonp(opts: RequestConfig) {
    const prefix = opts['prefix'] || '__jp'
    const callbackName = opts['callback'] || 'callback'

    // use the callback name that was passed if one was provided.
    // otherwise generate a unique name by incrementing our counter.
    const id = opts['name'] || prefix + this.jsonpCount++

    const timeout = opts.timeout || 60000
    const cacheFlag = opts['cache'] || false
    const enc = encodeURIComponent
    const target = document.getElementsByTagName('script')[0] || document.head
    let script
    let timer

    function cleanup() {
      if (script.parentNode) script.parentNode.removeChild(script)
      globalThis[id] = function noop() {}
      if (timer) clearTimeout(timer)
    }

    function encode(val) {
      return encodeURIComponent(val)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
    }

    function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url
      }

      var serializedParams
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params)
      } else if (web.isURLSearchParams(params)) {
        serializedParams = params.toString()
      } else {
        var parts = []

        core.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return
          }

          if (Array.isArray(val)) {
            key = key + '[]'
          }

          if (!Array.isArray(val)) {
            val = [val]
          }

          core.forEach(val, function parseValue(v) {
            if (date.isDate(v)) {
              v = v.toISOString()
            } else if (typeof v === 'object') {
              v = JSON.stringify(v)
            }
            parts.push(encode(key) + '=' + encode(v))
          })
        })

        serializedParams = parts.join('&')
      }

      if (serializedParams) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
      }

      return url
    }

    if (!opts.url) {
      throw new TypeError('url is null or not defined')
    }

    return new Promise(function (resolve, reject) {
      try {
        if (timeout) {
          timer = setTimeout(function () {
            cleanup()
            reject(new Error('Request timed out'))
          }, timeout)
        }

        globalThis[id] = function (data) {
          cleanup()

          //Throws a `Cancel` if cancellation has been requested.
          if (opts.cancelToken) {
            opts.cancelToken.throwIfRequested()
          }

          resolve(data)
        }

        // add params
        opts.url = buildURL(opts.url, opts.params, opts.paramsSerializer)
        // add callback
        opts.url += (opts.url.indexOf('?') === -1 ? '?' : '&') + callbackName + '=' + enc(id)
        // cache
        !cacheFlag && (opts.url += '&_=' + new Date().getTime())

        // create script
        script = document.createElement('script')
        script.src = opts.url
        target.parentNode.insertBefore(script, target)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * cancel token 생성
   * @returns
   */
  createCancelToken(): CancelTokenSource {
    return axios.CancelToken.source()
  }

  /**
   * API의 취소 여부 확인
   * @param err 에러 객체
   */
  isCancel(err: Error) {
    return axios.isCancel(err)
  }

  /**
   * 통신 오류 메시지를 조회
   * @param error
   */
  getAxiosErrorMessage(error: Error) {
    const err: any = error

    if (this.isCancel(error)) {
      err['canceled'] = true
      return '통신 요청이 취소되었습니다.'
    }

    if (!err.request && !err.response) {
      return err.message
    }

    if (err.message && error.message.includes('timeout')) {
      err['timeout'] = true
      return '통신 시간이 만료되었습니다. 다시 시도해주십시오. 동일한 현상이 나타나는 경우, 관리자에게 문의하시기 바랍니다.'
    } else if (err.response) {
      switch (err.response.status) {
        case 500:
        case 501:
        case 502:
        case 503:
          return '서버 장애가 발생하였습니다. 관리자에게 문의하시기 바랍니다.'

        case 504:
          return '서버 연결이 원활하지 않습니다. 관리자에게 문의하시기 바랍니다.'
        case 400:
        case 405:
          return '서버에 연결할 수 없습니다. 네트워크 환경을 점검하시기 바랍니다.'
        case 401:
          return '수행 권한이 없습니다.'
      }

      if (err.response.status >= 300 && err.response.status < 400) {
        return '서버 장애가 발생하였습니다. 관리자에게 문의하시기 바랍니다.'
      }
    }
    return err.message
  }
}

export interface AxiosTask {}
export class AxiosQueue {
  private taskQueue: Queue<AxiosTask> = new Queue()
}

export type { AxiosRequestConfig, AxiosInstance, AxiosResponse, CancelTokenSource, Method, Cancel }
const instance = new AxiosUtils()

export default instance
