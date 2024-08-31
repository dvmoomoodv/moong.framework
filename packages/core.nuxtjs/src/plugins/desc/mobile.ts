import { NuxtApp, onNuxtReady } from '#app'
import padStart from 'lodash/padStart'
import toNumber from 'lodash/toNumber'
import { useLogger } from '#ustra/core'
import { web, random } from '#ustra/core/utils'
import { base64Converter } from '#ustra/core/utils/converter/base64-converter'
import NativeAppStorage from '#ustra/nuxt/utils/storage/native-app-storage'

const logger = useLogger('ustra:mobile')

export class UstraMobile {
  public bridge: MobileBridge

  private get mobileProp() {
    return this.nuxtApp.$ustra.env.appProps.mobile
  }

  constructor(private nuxtApp: NuxtApp) {
    if (process.client && this.mobileProp.hybrid.bridge.enabled) {
      const useTokenSecurity = this.mobileProp.hybrid.bridge.useTokenSecurity
      this.bridge = new MobileBridge(nuxtApp, useTokenSecurity)
    }
  }

  /**
   * ios native 요청인지 확인
   */
  get isIosNativeRequest() {
    if (!this.nuxtApp.$ustra.env.isIOsRequest) {
      return false
    }

    if (this.mobileProp.hybrid.nativeAgent.ios) {
      return web.getUserAgent(this.nuxtApp.ssrContext?.event?.node?.req).includes(this.mobileProp.hybrid.nativeAgent.ios)
    }

    return true
  }

  /**
   * 안드로이드 native 요청 확인
   */
  get isAndroidNativeRequest() {
    if (!this.nuxtApp.$ustra.env.isAndroidRequest) {
      return false
    }

    if (this.mobileProp.hybrid.nativeAgent.android) {
      return web.getUserAgent(this.nuxtApp.ssrContext?.event?.node?.req).includes(this.mobileProp.hybrid.nativeAgent.android)
    }

    return true
  }

  /**
   * native 요청 여부
   */
  get isNativeRequest() {
    return this.isIosNativeRequest || this.isAndroidNativeRequest
  }
}

/**
 * 모바일 브릿지 기능
 */
export class MobileBridge {
  private useTokenSecurity: boolean
  private nativeListeners: { [key: string]: Function[] } = {}
  private appStorage: NativeAppStorage

  private get mobileProp() {
    return this.nuxtApp.$ustra.env.appProps.mobile
  }

  constructor(private nuxtApp: NuxtApp, useTokenSecurity: boolean) {
    this.useTokenSecurity = useTokenSecurity

    onNuxtReady(() => this.registerNativeInboundFunctions())
    const toastFunctionName = this.mobileProp.hybrid.bridge.staticBridgeNames.toast

    // mapping toast
    if (toastFunctionName) {
      window.toast = this.staticFunctions.toast
    }

    const storageFunctionName = this.mobileProp.hybrid.bridge.staticBridgeNames.storage
    if (storageFunctionName) {
      this.appStorage = new NativeAppStorage(this.nuxtApp, storageFunctionName)
    }
  }

  staticFunctions = {
    /**
     * 로드 완료 통지
     */
    notifyLoaded: () => {
      const functionName = this.mobileProp.hybrid.bridge.staticBridgeNames.notifyLoaded
      if (!functionName) {
        return
      }

      this.callNative({ id: functionName })
    },

    /**
     * 토스트 메시지 호출
     * @param message 메시지
     */
    toast: (message: string) => {
      const functionName = this.mobileProp.hybrid.bridge.staticBridgeNames.toast
      if (!functionName) {
        return
      }

      this.callNative({ id: functionName, data: { message } })
    },

    /**
     * 현재 시간 조회
     */
    currentTime: () => {
      const functionName = this.mobileProp.hybrid.bridge.staticBridgeNames.currentTime
      return new Promise<Date>(resolve => {
        if (functionName && this.nuxtApp.$ustra.mobile.isNativeRequest) {
          this.callNative({
            id: functionName,
            callback: result => {
              if (result.timeout || result.resCode !== '0000') {
                resolve(new Date())
              } else {
                resolve(this.nuxtApp.$ustra.utils.date.parse(result.data.datetime, 'yyyyMMddHHmmss'))
              }
            },
          })
        } else {
          resolve(new Date())
        }
      })
    },

    /**
     * native 연계 스토리지
     */
    storage: () => {
      return this.appStorage
    },
  }

  /**
   * 토큰을 생성한다.
   */
  private async createToken() {
    const currentDate = await this.staticFunctions.currentTime()
    const currentTimeStamp = this.nuxtApp.$ustra.utils.date.format(currentDate, 'yyyyMMddHHmmss')

    const seq = random.max(9000)
    const randomSeqVal = padStart(seq.toString(), 6, '0')
    let seqVal = currentTimeStamp + randomSeqVal

    let sumVal = 0
    for (let i = 0; i < seqVal.length; i++) {
      sumVal += toNumber(seqVal.charAt(i))
    }

    const modVal = sumVal % 17
    let addVal = 17 - modVal + 3
    let newSeqVal = ''

    for (let i = 0; i < randomSeqVal.length; i++) {
      let addableVal = 9 - toNumber(randomSeqVal.charAt(i))

      if (!addableVal || !addVal) {
        newSeqVal = newSeqVal + randomSeqVal.charAt(i)
        continue
      }

      addableVal = Math.min(addVal, addableVal)
      newSeqVal = newSeqVal + (toNumber(randomSeqVal.charAt(i)) + addableVal)
      addVal -= addableVal
    }

    seqVal = currentTimeStamp + newSeqVal

    return base64Converter.convert(seqVal)
  }

  /**
   * 토큰을 확인한다.
   */
  private async validateToken(token: string) {
    if (!this.mobileProp.hybrid.bridge.useTokenSecurity) {
      return true
    }

    if (!token) {
      return false
    }

    try {
      token = base64Converter.deconvert(token)

      const currentDate = await this.staticFunctions.currentTime()
      const issueTimeStamp = token.substring(0, 14)
      const tokenIssueDate = this.nuxtApp.$ustra.utils.date.parse(issueTimeStamp, 'yyyyMMddHHmmss')

      // 발행 기간 10초가 넘을 경우
      if (this.nuxtApp.$ustra.utils.date.getMilliDuration(currentDate, tokenIssueDate) > 10000) {
        return false
      }

      let sumVal = 0
      for (let i = 0; i < token.length; i++) {
        sumVal += toNumber(token.charAt(i))
      }

      if (sumVal % 17 !== 3) {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }

  /**
   *
   * @param callbackFnId
   */
  private callTimeCallback(callbackFnId: string) {
    if (!window[callbackFnId] || window[callbackFnId].called === true || !window[callbackFnId].callback) {
      return
    }

    logger.error('mobile app interface timeout : ' + window[callbackFnId].callInterfaceId)
    window[callbackFnId].called = true
    const param = window[callbackFnId].param

    param.data = null
    param.timeout = true

    window[callbackFnId].callback(param)

    if (window[callbackFnId].ifHistId) {
      // this.addResponseLogging({
      //   ifHistId: window[callbackFnId].ifHistId,
      //   succYn: "N",
      //   resCdVal: "9998",
      //   resCont: "timeout",
      // });
    }
  }

  /**
   * 브릿지를 호출한다.
   */
  async callNative<T = any>(option: MobileBridgeCallOption<T>) {
    option = $ustra.utils.core.deepMerge({}, defaultCallOption, option)
    if (!this.useTokenSecurity) {
      option.useToken = false
    }

    const interfaceInfo = this.nuxtApp.$ustra.interfaces.getOutboundInterface(option.id, 'MOBILE_BRIDGE')

    // 인터페이스 정보를 찾을 수 없는 경우
    if (!interfaceInfo) {
      throw new Error('인터페이스 정보를 찾을 수 없습니다. : ' + option.id)
    }

    const callInterfaceId = option.id.replace(/-/g, '_')
    const callbackFnId: string = option.callbackName || callInterfaceId + '_callback'

    const callParam: MobileBridgeResult = {
      token: option.useToken ? await this.createToken() : null,
      callbackName: option.callback ? callbackFnId : undefined,
      data: option.data,
    }

    // 로깅 처리
    const loggingId = await this.nuxtApp.$ustra.interfaces.addRequestLogging({
      id: interfaceInfo.id,
      version: interfaceInfo.version,
      requestContent: callParam,
    })
    callParam.loggingId = loggingId

    // register callback
    if (option.callback) {
      // 기존 callback이 있을 경우는 타임아웃으로 처리.
      this.callTimeCallback(callbackFnId)

      if (window[callbackFnId]?.timer) {
        clearTimeout(window[callbackFnId].timer)
      }

      window[callbackFnId] = this.nuxtApp.$ustra.utils.functions.wrap(option.callback, (next, ...args) => {
        if (window[callbackFnId]?.timer) {
          clearTimeout(window[callbackFnId].timer)
        }

        if (!window[callbackFnId] || window[callbackFnId].called) {
          return
        }
        window[callbackFnId].called = true

        logger.debug('callback native interface', interfaceInfo, args)

        // TODO: validate interface token

        try {
          // @ts-ignore
          if (typeof args[0] === 'string') {
            // @ts-ignore
            args[0] = JSON.parse(args[0])
          }
          next()
        } finally {
          window[callbackFnId] = undefined

          this.nuxtApp.$ustra.interfaces.addResponseLogging({
            loggingId,
            // @ts-ignore
            resCode: args[0]?.resCd,
            // @ts-ignore
            responseContent: args[0],
            // @ts-ignore
            success: args[0]?.resCd === '0000',
          })
        }
      })

      window[callbackFnId].called = false
      window[callbackFnId].param = callParam
      window[callbackFnId].loggingId = loggingId
      window[callbackFnId].callInterfaceId = callInterfaceId
      window[callbackFnId].callback = option.callback
    } else {
      // callback이 없을 경우, 완료 로깅 처리
      this.nuxtApp.$ustra.interfaces.addResponseLogging({ loggingId, success: true })
    }

    logger.debug('call native interface', callInterfaceId, callParam, interfaceInfo)
    this.nuxtApp.$ustra.utils.mobile.callNative(callInterfaceId, callParam)

    if (option.callback && option.timeout > 0) {
      // 타임아웃 시 처리
      const callbackTimeoutTimer = setTimeout(() => {
        try {
          this.callTimeCallback(callbackFnId)
        } finally {
          window[callbackFnId] = undefined
        }
      }, option.timeout)

      window[callbackFnId].timer = callbackTimeoutTimer
    }
  }

  /**
   * native inbound interface 리스너를 등록
   */
  addNativeListener<T = any>(ifId: string, listener: (param: MobileBridgeResult<T>) => void | Promise<void> | any | Promise<any>) {
    if (!this.nativeListeners[ifId]) {
      this.nativeListeners[ifId] = []
    }

    this.nativeListeners[ifId].push(listener)
  }

  /**
   * native listener를 clear
   * @param ifId 인터페이스 아이디
   */
  clearNativeListeners(id: string) {
    this.nativeListeners[id] = []
  }

  /**
   * 인바운드 인터페이스를 등록한다.
   */
  private registerNativeInboundFunctions() {
    const interfaces = this.nuxtApp.$ustra.interfaces.getInterfaces().filter(i => i.direction === 'INBOUND' && i.type === 'MOBILE_BRIDGE')
    interfaces.forEach(interfaceInfo => {
      const callInterfaceId = interfaceInfo.id.replace(/-/g, '_')

      // @ts-ignore
      window[callInterfaceId] = async param => {
        if (param && typeof param === 'string') {
          param = JSON.parse(param)
        }

        logger.debug('receive native interface', callInterfaceId, param)

        const result: MobileBridgeResult<any> = {
          data: null,
          resCode: '0000',
          token: param.token,
        }

        if (!param) {
          result.resCode = '5001'
          result.resMessage = '유효하지 않은 요청입니다.'
        } else if (!(await this.validateToken(param.token))) {
          result.resCode = '5003'
          result.resMessage = '유효하지 않은 인터페이스 토큰'
        } else {
          let loggingId = null

          if (interfaceInfo) {
            loggingId = await this.nuxtApp.$ustra.interfaces.addRequestLogging({
              id: interfaceInfo.id,
              version: interfaceInfo.version,
              requestContent: param,
            })
          }

          if (!interfaceInfo) {
            result.resCode = '5005'
            result.resMessage = '유효하지 않은 인터페이스 아이디.'
          } else if (interfaceInfo.allowedAuthenticated && !this.nuxtApp.$ustra.auth.isAuthenticated) {
            result.resCode = '0401'
            result.resMessage = '인터페이스 호출 권한 없음.'
          } else {
            // eslint-disable-next-line no-lonely-if
            if (this.nativeListeners[interfaceInfo.id]) {
              for (const listener of this.nativeListeners[interfaceInfo.id]) {
                try {
                  const r = await listener(param)

                  if (r) {
                    result.data = r
                  }
                } catch (e) {
                  logger.error('mobile api error', e)
                  result.resCode = e.errorCode || '9999'
                  result.resMessage = e.message
                  break
                }
              }
            }
          }

          if (loggingId) {
            this.nuxtApp.$ustra.interfaces.addResponseLogging({
              loggingId,
              resCode: result.resCode,
              success: result.resCode === '0000',
              responseContent: result,
            })
          }
        }

        if (param.callbackFnName) {
          // call back 처리
          this.nuxtApp.$ustra.utils.mobile.callNative(param.callbackFnName, result)
        }

        logger.debug('receive callback native interface : ', callInterfaceId, result)
        return result
      }

      logger.debug('register native interface : ' + interfaceInfo?.id)
    })
  }
}

/**
 * 브릿지 호출 옵션
 */
export interface MobileBridgeCallOption<T = any> {
  /**
   * 브릿지 아이디
   */
  id: string

  /**
   * 전송 데이터
   */
  data?: object

  /**
   * callback function
   */
  callback?: (result: MobileBridgeResult<T>) => void | Promise<void>

  /**
   * 타임아웃 (0일 경우 무제한)
   */
  timeout?: number

  /**
   * 콜백 함수 명
   */
  callbackName?: string

  /**
   * 토큰 사용 여부
   */
  useToken?: boolean
}

const defaultCallOption: MobileBridgeCallOption = {
  id: undefined,
  timeout: 0,
  useToken: true,
}

/**
 * 브릿지 호출 결과
 */
export interface MobileBridgeResult<T = any> {
  /**
   * 응답코드
   */
  resCode?: string

  /**
   * 응답 메시지
   */
  resMessage?: string

  /**
   * 토큰
   */
  token?: string

  /**
   * 타임아웃 발생 여부
   */
  timeout?: boolean

  /**
   * callback 명
   */
  callbackName?: string

  /**
   * 전송 데이터
   */
  data?: T

  /**
   * 로깅 아이디
   */
  loggingId?: number
}
