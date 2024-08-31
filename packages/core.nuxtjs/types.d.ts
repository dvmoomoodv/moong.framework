import { Ustra } from "./src/plugins/ustra";
import { UstraApi } from "./src/plugins/desc/api";
import { UstraAuth } from "./src/plugins/desc/auth";
import { UstraAuthMeta } from "./src/plugins/config/auth";
import { NuxtAppProps } from "./src/config/nuxt-app-props";
import { RequestConfig } from "#moong/core/utils/axios";

// for markdown file
declare module "*.md" {
  const markdownContent: string;
  export default markdownContent;
}

// for image file
declare module "*.png" {
  const img: any;
  export default img;
}

declare module "#app" {
  interface NuxtApp {
    $ustra: Ustra;
  }

  interface _NuxtApp {
    $ustra: Ustra;
  }
}
declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp {
    $ustra: Ustra;
  }

  interface _NuxtApp {
    $ustra: Ustra;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $ustra: Ustra;
  }
}

// vue route
declare module "vue-router" {
  interface RouteMeta {
    auth?: UstraAuthMeta;
  }
}

declare module "nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    auth?: UstraAuthMeta;
  }
}

// hook
declare module "nuxt/dist/app/nuxt" {
  interface RuntimeNuxtHooks {
    /**
     * ustra plugin 모듈 로드 시작
     */
    "ustra:plugin:start": ($ustra: Ustra) => HookResult;

    /**
     * ustra plugin 모듈 로드 완료
     */
    "ustra:plugin:end": ($ustra: Ustra) => HookResult;

    /**
     * ustra plugin api axios instance
     */
    "ustra:plugin:create:axios": (config: RequestConfig) => HookResult;

    /**
     * ustra plugin api 모듈 로드 시
     */
    "ustra:plugin:api": (api: UstraApi, $ustra: Ustra) => HookResult;

    /**
     * ustra plugin auth 모듈 로드 시
     */
    "ustra:plugin:auth": (auth: UstraAuth, $ustra: Ustra) => HookResult;
  }
}

declare module "@nuxt/schema" {
  interface NuxtPlugin {
    order?: number;
  }

  interface RuntimeConfig {
    ustra?: Partial<NuxtAppProps>;
  }

  interface PublicRuntimeConfig {
    ustra?: Partial<NuxtAppProps>;
  }

  interface NuxtConfig {
    ["ustra"]?: Partial<NuxtAppProps>;
  }
  interface NuxtOptions {
    ["ustra"]?: NuxtAppProps;
  }
}

// global
declare global {
  var $ustra: Ustra;

  const toast: typeof window.toast;

  namespace NodeJS {
    interface Global {
      $ustra: Ustra;
    }
  }

  interface Window {
    /**
     * 토스트 메시지 호출
     * @param message  메시지
     * @param displayTime 지연시간 (ms)
     */
    toast(message: string, displayTime?: number): void;
  }
}

export {};
