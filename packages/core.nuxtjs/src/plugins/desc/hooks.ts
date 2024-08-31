import { Hookable, HookCallback, HookKeys, createDebugger } from "hookable";
import { useLogger } from "#moong/nuxt/utils/logger";
import { UstraProgressHookInfo } from "./hooks/progress";
import { UstraDialogHookInfo } from "./hooks/dialog";
import { UstraManagementInitialDataLoaded } from "./hooks/management/initial-data";
import { Navigation } from "../../management/store/models/navigation";
import type { NuxtAppProps } from "../../config/nuxt-app-props";
import type { Ustra } from "../ustra";
import { LoginResult } from "../../management/services/common/login";
import type { ConfigMenu } from "./management/config";
import { RouteLocationNormalized } from "vue-router";
// import { HookResult } from '@nuxt/schema'

const logger = useLogger("ustra:hook");

export interface UstraNuxtRuntimeHooks {
  /**
   * 환경 설정 로드
   */
  "env:loaded": (appProps: NuxtAppProps) => void | Promise<void>;

  /**
   * loading, progress
   */
  "ui:progress": (progress: UstraProgressHookInfo) => void | Promise<void>;

  /**
   * dialog popup option
   */
  "ui:dialog": (dialog: UstraDialogHookInfo) => void | Promise<void>;

  /**
   * close all dialog
   */
  "ui:dialog:close": () => void | Promise<void>;

  /**
   * 에러 메시지 alert 호출 시
   *  false를 반환할 경우, useOnError에서 호출되는 alert 동작을 커스토마이징 할 수 있음.
   */
  "ui:alert:error": (message: string) => any;

  /**
   * 인증 정보 활성화 시
   */
  "auth:activated": (authInfo: any) => void | Promise<void>;

  /**
   * 인증 정보 검증
   */
  "auth:validate": (arg: {
    $ustra: Ustra;
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
  }) => any;

  /**
   * 인증 정보 비활성화 시
   * - authInfo : 만료 전 인증 정보
   * - type : 만료 유형
   * - lastCallUrl : 마지막 호출 API URL
   */
  "auth:inactivated": (
    authInfo: any,
    type: "expired" | "duplicated" | "released",
    lastCallUrl: string
  ) => any;

  /**
   * 인증 정보 유효성 검증 실패 시
   * - authInfo : 인증정보
   * - to : 이동경로
   * - isMiddleware : 미들웨어 호출 여부
   */
  "auth:invalidated": (authInfo: any, to: string, isMiddleware: boolean) => any;

  /**
   * 인증 해제 (로그아웃) 처리 전
   */
  "auth:unauthenticate:before": () => void | Promise<void>;

  /**
   * 인증 해제 (로그아웃) 처리 후
   */
  "auth:unauthenticate:after": () => void | Promise<void>;

  /**
   * 인증 정보 변경 시
   */
  "auth:updated": (authInfo: any) => void | Promise<void>;

  /**
   * management 초기 데이터 로드 시
   */
  "management:initial-data:loaded": (
    info: UstraManagementInitialDataLoaded
  ) => void | Promise<void>;

  /**
   * management 초기 데이터 오류
   */
  "management:initial-data:error": (error: Error) => void | Promise<void>;

  /**
   * management navigation 변경
   */
  "management:navigation:updated": (
    navigation: Navigation,
    currentRoute: RouteLocationNormalized
  ) => void | Promise<void>;

  /**
   * management navigation 생성
   */
  "management:navigation:created": (
    navigations: Navigation[]
  ) => void | Promise<void>;

  /**
   * management 인증 처리 완료 시
   */
  "management:auth:authenticated": (
    result: LoginResult
  ) => void | Promise<void>;

  /**
   * management 설정 메뉴 로드 시
   */
  "management:config:menu:load": (configMenus: Partial<ConfigMenu>[]) => any;
}

const __onceHooks = [
  "management:initial-data:loaded",
  "management:initial-data:error",
  "env:loaded",
];

function serialCaller(hooks, args) {
  return hooks.reduce(
    (promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)),
    Promise.resolve(null)
  );
}

/**
 * Hook 관련 지원 클래스
 */
export class UstraHooks extends Hookable<UstraNuxtRuntimeHooks> {
  private createdDebugger: boolean;
  private __calledOnceHooks: Record<string, any> = {};

  constructor(private $ustra: Ustra) {
    super();
  }

  callHook<NameT extends HookKeys<UstraNuxtRuntimeHooks>>(
    name: NameT,
    ...args: Parameters<
      UstraNuxtRuntimeHooks[NameT] extends HookCallback
        ? UstraNuxtRuntimeHooks[NameT]
        : never
    >
  ): Promise<any> {
    if (this.$ustra.env?.appProps?.debug && !this.createdDebugger) {
      // @ts-ignore
      createDebugger(this.$ustra.hooks, { tag: "ustra" });
      this.createdDebugger = true;
    }

    if (__onceHooks.includes(name)) {
      this.__calledOnceHooks[name] = args;
    }

    // if (this.$ustra.nuxtApp.ssrContext && this.$ustra.nuxtApp.ssrContext.error) {
    //   logger.warn(`😸 [${this.$ustra.uuid}] call hook`, name, 'nuxt has error')
    // } else {
    //   if (this.$ustra.env?.appProps?.debug) {
    //     if (name === 'env:loaded' && process.server) {
    //       logger.debug(`😸 [${this.$ustra.uuid}] call hook`, name, this.$ustra.nuxtApp.ssrContext?.event?.node?.req?.url)
    //     } else {
    //       logger.debug(`😸 [${this.$ustra.uuid}] call hook`, name, args, this.$ustra.nuxtApp.ssrContext?.event?.node?.req?.url)
    //     }
    //   }
    // }

    return super.callHook(name, ...args);
  }

  hook<NameT extends HookKeys<UstraNuxtRuntimeHooks>>(
    name: NameT,
    fn: UstraNuxtRuntimeHooks[NameT] extends HookCallback
      ? UstraNuxtRuntimeHooks[NameT]
      : never
  ): () => void {
    if (__onceHooks.includes(name) && this.__calledOnceHooks[name]) {
      return serialCaller([fn], this.__calledOnceHooks[name]);
    }

    return super.hook(name, fn);
  }
}
