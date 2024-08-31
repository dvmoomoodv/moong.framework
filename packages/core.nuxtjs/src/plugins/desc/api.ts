// import https from 'https'
import { isRef, unref, toRaw } from "vue";
import { useRuntimeConfig } from "#app";
import { AxiosResponse } from "axios";
import fileDownload from "js-file-download";
import qs from "qs";

import { useLogger } from "#moong/nuxt/utils/logger";
import {
  core,
  path,
  system,
  web,
  encoding,
  UrlBuilder,
  SseEmitterOption,
} from "#moong/core/utils";
import { Sse } from "#moong/core/utils/sse";
import { crypto } from "#moong/core/utils/browser";
import axiosUtils, {
  AxiosInstance,
  CancelTokenSource,
  Method,
  RequestConfig,
} from "#moong/core/utils/axios";
import { CookieStorage } from "#moong/core/utils/storage/cookie-storage";
import { NetworkError } from "#moong/core/error";
import { TaskQueue } from "#moong/core/utils/task/task-queue";
import { HttpHeaders } from "#moong/core/data";

import type { Ustra } from "../ustra";
import type {
  NuxtAppProps,
  ApiOriginOptions,
} from "../../config/nuxt-app-props";

const logger = useLogger("ustra:api");
export class UstraApi {
  private cookieStorage = new CookieStorage({
    samesite: "Lax",
    secure: false,
    path: "/",
    httponly: false,
    valueConverter: null,
    keyConverter: null,
    pure: true,
    maxAge: -1,
  });

  private axiosInstance: AxiosInstance = null;
  private sseInstance: Sse = null;
  private axiosConfig: RequestConfig = null;
  private apiQueue: TaskQueue;

  constructor(private $ustra: Ustra) {
    // this.$ustra.nuxtApp.hook('app:rendered', () => {
    //   if (process.server) {
    //     this.apiQueue?.pause()
    //   }
    // })
  }

  private get appProps() {
    if (!this.$ustra.env.isLoaded) {
      const appProps =
        useRuntimeConfig().ustra || useRuntimeConfig().public?.ustra;
      return toRaw(appProps) as NuxtAppProps;
    }
    return toRaw(this.$ustra.env.appProps);
  }

  /**
   * axios instance 생성
   * @returns
   */
  async getAxiosInstance() {
    if (!this.axiosInstance) {
      if (process.server) {
        const https = await import("https");
        const defaultConfig = {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        };
        // @ts-ignore
        const config = await this.$ustra.nuxtApp.callHook(
          "ustra:plugin:create:axios",
          defaultConfig
        );

        // @ts-ignore
        this.axiosConfig = config || defaultConfig;
        this.axiosInstance = axiosUtils.createInstance(this.axiosConfig);
      } else {
        // @ts-ignore
        const config = await this.$ustra.nuxtApp.callHook(
          "ustra:plugin:create:axios",
          {}
        );

        // @ts-ignore
        this.axiosConfig = config;
        this.axiosInstance = axiosUtils.createInstance(this.axiosConfig);
      }

      // this.apiQueue = new TaskQueue({ maximumConcurrentNumber: 3, taskDelay: 10 })
      this.apiQueue = new TaskQueue({
        maximumConcurrentNumber: this.appProps.nuxt.api.maximumConcurrentNumber,
        taskDelay: this.appProps.nuxt.api.taskDelay,
      });
    }

    return this.axiosInstance;
  }

  /**
   * 기본 인터셉터 등록
   */
  public async addInterceptors() {
    await this.applyResCodeCheckingInterceptor(this.$ustra.env.appProps);
    await this.applyGlobalRequestInterceptor();

    // apply retry
    axiosUtils.applyRetry(await this.getAxiosInstance(), this.axiosConfig);
  }

  /**
   * 기본 retry 조건 조회
   * @param err
   * @returns
   */
  defaultRetryCondition(err: Error) {
    if (err.name === "NetworkError") {
      if (err["canceled"] || err["timeout"]) {
        return false;
      }
      if (err["statusCode"] < 200 || err["statusCode"] >= 300) {
        return true;
      }

      if (err["invalidResCode"]) {
        return true;
      }
    }
    return false;
  }

  getSseInstance() {
    if (!this.sseInstance) {
      this.sseInstance = new Sse();
    }

    return this.sseInstance;
  }

  /**
   * API 오류 처리 interceptor를 등록한다.
   * @param appProp
   */
  private async applyResCodeCheckingInterceptor(appProp: NuxtAppProps) {
    // 응답 코드 검증 처리 하지 않을 경우
    if (!appProp.nuxt.api.occurErrorwhenReceivedApiErrCode) {
      return;
    }

    const checkResponse = (res: AxiosResponse<any>) => {
      if (
        !res ||
        !res.data ||
        this.$ustra.utils.core.isEmpty(res.data.resultCode)
      ) {
        return res?.status >= 300 ? null : res;
      }

      const config = res["config"] as ApiOriginOptions;

      // 인증 만료 체크
      if (
        appProp.nuxt.api.disableCheckErrorWhenAuthInactivated &&
        this.isInactivatedAuthResponse(res)
      ) {
        return res;
      }

      // 검증을 수행하지 않을 URL 처리
      if (appProp.nuxt.api.ignoreErrorUrlPatterns) {
        if (
          path.isMatchPatterns(
            config.url,
            ...appProp.nuxt.api.ignoreErrorUrlPatterns
          )
        ) {
          return res;
        }
      }

      if (
        res &&
        res.data &&
        res.data.resultCode &&
        !config.passOnResponseError
      ) {
        if (
          !config.passOnResponseCode.some(
            (responseCode) => responseCode === res.data.resultCode
          )
        ) {
          let message = res.data.resultMessage;

          if (this.$ustra.env.isDevelopment && res.data.errors) {
            for (const error of res.data.errors) {
              message += "/" + error;
            }
          }
          const error = new NetworkError(
            new Error(message),
            res.data.resultCode,
            config
          );
          error.statusCode = res.status;
          error.invalidResCode = true;
          throw error;
        }
      }

      return res;
    };

    const axiosInstance = await this.getAxiosInstance();
    axiosInstance.interceptors.response.use(
      // @ts-ignore
      (res) => {
        return checkResponse(res);
      },
      (err) => {
        err.message = axiosUtils.getAxiosErrorMessage(err);
        logger.warn(err.message, { err });

        if (err.name === "NetworkError") {
          throw err;
        }

        const res = checkResponse(err.response);

        if (res) {
          return res;
        }

        const netError = new NetworkError(err, err?.errorCode, err?.config);
        netError.statusCode = err?.response?.status;

        throw netError;
      }
    );
  }

  /**
   * global api request interceptor를 등록한다.
   */
  private async applyGlobalRequestInterceptor() {
    const axiosInstance = await this.getAxiosInstance();
    axiosInstance.interceptors.request.use((config) => {
      if (this.appProps) {
        if (process.server) {
          config.baseURL =
            config.baseURL ||
            this.appProps.server.nodeServerBaseUrl ||
            this.appProps.server.apiServerBaseUrl;
        }

        // profile header 추가
        config.headers.c = this.$ustra.env.encryptedProfile;

        // rest header 값을 Http Header에 추가
        if (config.data && config.data.header) {
          try {
            config.headers[HttpHeaders.REST_API_HEADER.toLowerCase()] =
              JSON.stringify(config.data.header);
          } catch (e) {}
        }
      }

      return config;
    });
  }

  private async normalizeRequestConfig(
    option: ApiOriginOptions | string
  ): Promise<ApiOriginOptions> {
    const mergedOption = core.deepMergeArrayConcat<ApiOriginOptions>(
      {
        data: null,
        url: null,
        method: "GET",
        tranId: system.uuidBase62(),
        timeout: 20000,
        headers: {},
        showLoadingBar: web.isBrowser,
        passOnResponseError: false,
        passOnResponseCode: [],
        jsonp: false,
        secured: false,
        retryCondition: this.defaultRetryCondition,
        encodeURIParams: false,
      },
      this.appProps.nuxt.api,
      {
        // excludeAuthValidationOnServer option default 값 적용
        excludeAuthValidation:
          process.server &&
          this.appProps.nuxt.api.excludeAuthValidationOnServer === true
            ? true
            : false,
      },
      typeof option == "string" ? { url: option } : option
    );

    const finalOption = {
      axiosInstance: await this.getAxiosInstance(),
      ...mergedOption,
    };

    if (finalOption.data && isRef(finalOption.data)) {
      finalOption.data = unref(finalOption.data);
    }

    if (finalOption.params && isRef(finalOption.params)) {
      finalOption.params = unref(finalOption.params);
    }

    // secure option 처리
    if (finalOption.secured) {
      const urlParams = {};
      if (finalOption.params) {
        for (const k in finalOption.params) {
          if (urlParams[k]) {
            urlParams[k].push(finalOption.params[k]);
          } else {
            urlParams[k] = Array.isArray(finalOption.params[k])
              ? finalOption.params
              : [finalOption.params[k]];
          }
        }
      }
      let body = null;
      if (finalOption.data) {
        body = JSON.stringify(finalOption.data);
        finalOption.data = {};
      }

      finalOption.params = {};

      const param = {
        parameters: urlParams,
        body,
      };

      finalOption.params["__usp"] = crypto.encryptAes256(
        JSON.stringify(param),
        encoding.encodeBase64(finalOption.tranId.substring(0, 16))
      );
    }

    finalOption.headers[HttpHeaders.X_TRAN_ID] = finalOption.tranId;
    finalOption["uuid"] = this.$ustra.uuid;

    // @ts-ignore
    return finalOption;
  }

  /**
   * 인증 해제 처리된 API 응답 여부를 판단
   * @param response
   */
  private isInactivatedAuthResponse(res: AxiosResponse) {
    return res?.config?.["_isInactivated"] === true;
  }

  /**
   * API를 호출한다.
   * @param option
   * @returns
   */
  async call<T = any>(option: ApiOriginOptions | string) {
    const requestOption = await this.normalizeRequestConfig(option);
    const appProps = this.$ustra.env.appProps as NuxtAppProps;

    // validation 체크하지 않을 경우, withCredentials = false 설정
    if (requestOption.excludeAuthValidation && appProps.auth?.jwt?.useCookie) {
      requestOption.withCredentials = false;
    }

    const requestId = `[${this.$ustra.uuid}:${requestOption.tranId}]`;
    return new Promise<AxiosResponse<T>>((resolve, reject) =>
      this.callNext(requestOption, requestId, resolve, reject)
    );
  }

  private async callNext<T = any>(
    requestOption: ApiOriginOptions,
    requestId: string,
    resolve: (data: AxiosResponse<T>) => void,
    reject: (err: Error) => void
  ) {
    // if (!requestOption.cancelToken) {
    //   const cancelTokenSource = this.createCancelToken()
    //   requestOption.cancelToken = cancelTokenSource.token
    // }

    const handler = async () => {
      try {
        if (this.$ustra.debug) {
          console.time(requestId);
        }

        // logger.debug(`[${this.$ustra.uuid}] call api start :`, requestOption.url)
        // if (!this.$ustra.env.isProduction) {
        if (this.$ustra.debug) {
          logger.debug(
            `😸 [${this.$ustra.uuid}] call api start :`,
            requestId,
            requestOption.url + ":" + requestOption.method
          );
        }

        if (requestOption.showLoadingBar) {
          this.$ustra.ui.progress.showLoadingBar();
        }

        const result = await axiosUtils.call<T>(requestOption);
        resolve(result);
      } catch (e) {
        reject(e);
      } finally {
        if (requestOption.showLoadingBar) {
          this.$ustra.ui.progress.hideLoadingBar();
        }

        // logger.debug(`[${this.$ustra.uuid}] call api finished :`, requestOption.url)
        // if (!this.$ustra.env.isProduction) {
        if (this.$ustra.debug) {
          console.timeEnd(requestId);
        }
      }
    };

    // for SSR is return sync
    if (process.server) {
      return handler();
    }

    const controller = new AbortController();
    requestOption.signal = controller.signal;

    this.apiQueue.add({
      taskId: requestId,
      taskTypeId: requestOption.tranTypeId,
      handler,
      cancel: async () => {
        await controller.abort();
      },
    });
  }

  /**
   * API 호출을 취소한다.
   * @param tranTypeId 취소할 트랜잭션 유형 아이디
   * @returns
   */
  async cancel(tranTypeId?: string) {
    return this.apiQueue?.clear(tranTypeId);
  }

  /**
   * cancel token 생성
   * @returns
   */
  createCancelToken(): CancelTokenSource {
    return axiosUtils.createCancelToken();
  }

  /**
   * API의 취소 여부 확인
   * @param err 에러 객체
   */
  isCancel = (err: Error) => {
    return axiosUtils.isCancel(err);
  };

  /**
   * 파일을 다운로드 한다.
   * @param option 옵션
   *  - url : 호출 URL
   *  - fileName : 다운로드 파일 명
   *  - method : 호출 HTTP 메소드
   *  - showLoadingBar : 로딩바 표시 여부
   *  - data : 호출 데이터
   *  - params : 파라메터
   *  - timeout : 다운로드 timeout
   *  - excludeAuthValidation : 인증 검증 제외 여부
   *  - failMessage : 다운로드 실패 시 메시지
   */
  downloadFile(option: {
    /**
     * 호출 URL
     */
    url: string;

    /**
     * 다운로드 파일 명
     */
    fileName: string;

    /**
     * 호출 HTTP 메소드
     */
    method?: Method;

    /**
     * 로딩바 표시 여부
     */
    showLoadingBar?: boolean;

    /**
     * 데이터
     */
    data?: any;

    /**
     * 쿼리 파라미터
     */
    params?: Record<string, any>;

    /**
     * 다운로드 timeout
     * @default 60000
     */
    timeout?: number;

    /**
     * 인증 검증 제외 여부
     */
    excludeAuthValidation?: boolean;

    /**
     * 다운로드 실패 시 메시지
     * @default ustra.file.errorOnDownloadFile
     */
    failMessage?: string;
  }) {
    option = this.$ustra.utils.core.deepMerge(
      {
        excludeAuthValidation: true,
        failMessage: this.$ustra.message.getMessage(
          "ustra.file.errorOnDownloadFile"
        ),
        timeout: 60000,
      },
      option
    );
    option["responseType"] = "blob";
    option["showLoadingBar"] = false;
    option["onDownloadProgress"] = (event) => {
      $ustra.hooks.callHook("ui:progress", {
        type: "progress",
        show: true,
        progressRate: Math.round(event.progress * 100),
      });

      if (event.progress === 1) {
        setTimeout(() => {
          $ustra.hooks.callHook("ui:progress", {
            type: "progress",
            show: false,
            progressRate: 100,
          });
        }, 1000);
        return;
      }
    };

    return this.call(option)
      .then(async (res) => {
        // check error type
        if (res.data && res.data.type === "application/json") {
          try {
            const jsonResult = JSON.parse(await res.data.text());

            if (jsonResult.resultCode !== "0000") {
              alert(option.failMessage);
              return;
            }
          } catch (err) {}
        }

        fileDownload(res.data, option.fileName);
      })
      .catch((e) => {
        $ustra.hooks.callHook("ui:progress", {
          type: "progress",
          show: false,
          progressRate: 0,
        });

        alert(option.failMessage);
        throw e;
      });
  }

  private completedCheckTimer: any = null;
  /**
   * 서버 요청 응답 시 처리 call back 전달
   * @param callback
   */
  addRequestCompletedCallback(callback: Function) {
    if (this.completedCheckTimer) {
      try {
        clearInterval(this.completedCheckTimer);
      } catch (e) {}
    }

    this.cookieStorage.setItem("RES_ATTATCHED", "0");

    this.completedCheckTimer = setInterval(() => {
      const resAttatched = this.cookieStorage.getItem("RES_ATTATCHED");

      if (resAttatched === "1" || resAttatched === 1) {
        clearInterval(this.completedCheckTimer);
        callback();
      }
    }, 500);
  }

  /**
   * UrlBuilder를 생성한다.
   * @param baseUrl base URL
   * @returns UrlBuilder
   */
  urlBuilder(baseUrl: string) {
    return new UrlBuilder(baseUrl);
  }

  /**
   * URL encoded parameter를 생성한다.
   * @param params 파라메터
   * @param encodeBase64 base64 인코딩 여부
   */
  createUrlEncodedParameter(
    params: Record<string, string>,
    encodeBase64: boolean = false
  ) {
    for (const key in params) {
      if (typeof params[key] === "object") {
        params[key] = JSON.stringify(params[key]);
      }

      if (encodeBase64) {
        params[key] = this.$ustra.utils.encoding.encodeBase64(params[key]);
      }
    }

    return new URLSearchParams(params).toString();
    // return qs.stringify(params)
  }

  /**
   * ssemitter 연결을 수행한다.
   * @param option {SseEmitterOption} 연결 옵션
   */
  sse(option: SseEmitterOption) {
    return this.getSseInstance().connect(option);
  }
}
