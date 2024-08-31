import { functions, core } from "#moong/core/utils";
import masking, { MaskingType } from "#moong/core/utils/masking";
import { nextTick, getCurrentInstance, shallowRef, reactive } from "vue";
import { component } from "#moong/nuxt/utils";
import { navigateTo, useRoute, NuxtApp } from "#app";
import { RouteLocationNormalized, RouteMeta } from "vue-router";
import { useUstraLogger, useUstra } from "./ustra";
import type { I18nMessage } from "#moong/core/config/props/i18n";

/**
 * function wrapping
 */
export const useFunctionWrap = functions.wrap;

/**
 * OnError decorator, useOnError 옵션
 */
interface OnErrorOptions {
  /**
   * 통지 유형
   * @default 'alert'
   */
  notifyType?: "alert" | "toast" | "redirect";

  /**
   * 예외 처리 후 throw 여부
   * @default false
   */
  throwError?: boolean;

  /**
   * 노출 메시지
   */
  message?: ((err: Error) => string) | string;

  /**
   * 에러 발생 시 후속 처리 action handler
   */
  onError?: (err: Error) => void | Promise<void>;

  /**
   * 로깅 여부
   * @default true
   */
  logging?: boolean;

  /**
   * redirect 시 status code
   * @default 500
   */
  statusCode?: number;

  /**
   * redirect path
   */
  path?: string;

  /**
   * 취소 오류 발생 시 무시
   * @since 3.0.0-rc.5
   */
  ignoreCanceled?: boolean;
}

export type { OnErrorOptions };

/**
 * 에러 발생 시의 처리
 * @param fn 실행 함수
 * @param option 옵션
 */
export const useOnError = <T extends Function>(
  fn: T,
  option?: OnErrorOptions
) => {
  const $ustra = useUstra();

  const defaultOption = {
    notifyType: "alert",
    throwError: false,
    logging: true,
    statusCode: 500,
    ignoreCanceled: false,
  };

  const onErrorOption: any = core.deepMerge({}, defaultOption, option || {});

  // change option for server
  if (process.server) {
    onErrorOption.notifyType = "redirect";

    if (!onErrorOption.path) {
      onErrorOption.throwError = true;
    }
  }

  const _notify = async function (option, err) {
    try {
      // 취소 오류 발생 무시
      if (option.ignoreCanceled && err["canceled"] === true) {
        useUstraLogger().warn("canceled request", { err });
        return;
      }

      let message = "";

      if (!option.message) {
        message = err.message;
      } else if (typeof option.message === "function") {
        message = option.message(err);
      } else if (typeof option.message === "string") {
        message = option.message;
      }

      if (option.logging) {
        useUstraLogger().error("onerror", err);
      }

      if (option.notifyType === "alert") {
        await nextTick();
        const result = await $ustra.hooks.callHook("ui:alert:error", message);
        if (result !== false) {
          await alert(message);
        }

        if (option.onError) {
          await option.onError(err);
        }
        return;
      }

      if (option.notifyType === "toast") {
        await nextTick();
        await window.toast(message);

        if (option.onError) {
          await option.onError(err);
        }
        return;
      }

      if (option.onError) {
        await option.onError(err);
      }

      if (option.path) {
        return navigateTo(option.path);
      }
    } finally {
      if (option.throwError) {
        throw err;
      }
    }
  };

  return useFunctionWrap(fn, function (next) {
    let result;

    try {
      result = next();

      if (functions.isPromise(result)) {
        return (result as Promise<any>).catch(async (e) => {
          await _notify(onErrorOption, e);
        });
      }
    } catch (e) {
      _notify(onErrorOption, e);
    }

    return result;
  });
};

/**
 * 함수 호출 시, 로딩바를 노출한다.
 * @param fn 실행 함수
 */
export const useLoadingBar = <T extends Function>(fn: T) => {
  const $ustra = useUstra();
  return useFunctionWrap(fn, function (next) {
    let result;
    try {
      $ustra.ui.progress.showLoadingBar();
      result = next();

      if (functions.isPromise(result)) {
        result.finally(() => $ustra.ui.progress.hideLoadingBar());
      }
    } finally {
      if (!functions.isPromise(result)) {
        $ustra.ui.progress.hideLoadingBar();
      }
    }

    return result;
  });
};

/**
 * 현재 Route의 Page Meta 정보를 조회
 */
export const useCurrentPageMeta = (
  route: RouteLocationNormalized = undefined,
  nuxtApp?: NuxtApp
): RouteMeta => {
  if (!route) {
    route = useRoute();
  }
  const $ustra = useUstra(nuxtApp);

  const defaultMeta = $ustra.env.appProps.nuxt.meta || {};
  return $ustra.utils.core.deepMerge({}, defaultMeta, route.meta);
};

/**
 * object의 merge 수행
 * @param object object
 * @param sources sources
 * @returns merge된 object
 */
export const useDeepMerge = <T>(
  object: T | Partial<T>,
  ...sources: T[] | Partial<T>[]
): Partial<T> => {
  const $ustra = useUstra();
  return $ustra.utils.core.deepMerge(object, ...sources);
};

/**
 * 환경에 맞는 전역 객체 반환
 */
export const useGlobal = () => {
  const $ustra = useUstra();
  return $ustra.utils.core.global;
};

/**
 * 현재 컴포넌트의 페이지 컴포넌트 여부를 확인
 */
export const isPageComponent = () => {
  return component.isPageComponent(getCurrentInstance());
};

/**
 * 문자열을 마스킹 처리한다.
 * @param type 마스킹 유형
 * @param value text 값
 */
export const useMaskingText = (type: MaskingType, value: any) => {
  if (core.isEmpty(value)) {
    return value;
  }

  return masking.getMaskingFunctionByType(type)(value);
};

/**
 * object 리턴 값이 존재할 때까지 대기하여 조회
 * @param objectFn object 조회 function
 * @param timeout
 * @returns
 */
export const useGetObjectAsync = <T>(
  objectFn: () => T,
  timeout = 0
): Promise<T> => {
  const $ustra = useUstra();
  return $ustra.utils.core.getObjectAsync(objectFn, timeout);
};

/**
 * 비동기 task 실행
 * @returns
 *  - completedCallback : 완료 callback function
 *  - startTask : 작업 시작
 */
export const useAsyncTask = <T = any>() => {
  const completedCallback = shallowRef<(result: T) => void | Promise<void>>();

  function startTask(taskFunction?: Function) {
    return new Promise<T>(async (resolve) => {
      if (taskFunction) {
        await taskFunction();
      }
      completedCallback.value = (result: T) => {
        resolve(result);
        completedCallback.value = null;
      };
    });
  }

  return { completedCallback, startTask };
};

/**
 * media query 모델에 의한 MediaQuery 상태를 조회
 * @returns
 */
export const useMediaQueryState = () => {
  return reactive($ustra.dom.mediaQuery.state);
};

/**
 * ref 객체로부터 exposed된 객체를 조회
 * @param ref
 * @returns
 */
export const useExposed = <T>(ref: T): T => {
  if (ref?.["_"]?.exposed) {
    return ref?.["_"]?.exposed as T;
  }

  return ref as T;
};

/**
 * 포맷팅 된 메시지를 조회한다.
 * @param code
 * @param args
 */
export const useMessage = <K extends keyof I18nMessage>(
  code: K,
  ...args: any[]
) => {
  const $ustra = useUstra();
  return $ustra.message.getMessage(code, ...args);
};
