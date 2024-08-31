import { defineNuxtPlugin, NuxtApp } from "#app";
import { logger, useLogger } from "#moong/nuxt/utils/logger";
import { core, date, system } from "#moong/core/utils";
import { useUstra } from "#moong/nuxt/composables";
import { UstraError } from "./desc/error";
import { UstraEnv } from "./desc/env";
import { UstraMessage } from "./desc/message";
import { UstraUtils } from "./desc/utils";
import { UstraHooks } from "./desc/hooks";
import { UstraApi } from "./desc/api";
import { UstraFetch } from "./desc/fetch";
import { UstraManagement } from "./desc/management";
import { UstraAuth } from "./desc/auth";
import { UstraUI } from "./desc/ui";
import { UstraComponents } from "./desc/components";
import { UstraDom } from "./desc/dom";
import { UstraRouter } from "./desc/router";
import { UstraMobile } from "./desc/mobile";
import { UstraInterfaces } from "./desc/interfaces";
import { registerDirectives } from "./desc/directives";

import { Config } from "./config";
import { useUstraCoreStore } from "../store/core";
import { useUstraInterfaceStore } from "../store/interface";

// wrap the console
// consola.wrapConsole()

/**
 * $ustra plugin
 */
export class Ustra {
  public hooks: UstraHooks = new UstraHooks(this);
  public router: UstraRouter = new UstraRouter(this);
  public message: UstraMessage = new UstraMessage(this);
  public env: UstraEnv = null;

  public utils: UstraUtils = null;
  public logger: ReturnType<typeof useLogger> = null;
  public api: UstraApi = null;
  public fetch: UstraFetch = null;
  public management: UstraManagement = null;
  public auth: UstraAuth = null;
  public ui: UstraUI = null;
  public error: UstraError = null;
  public components: UstraComponents = null;
  public dom: UstraDom = null;
  public mobile: UstraMobile = null;
  public interfaces: UstraInterfaces = null;

  public uuid: string = system.uuidBase62();

  constructor(public nuxtApp: NuxtApp) {
    nuxtApp.$ustra = this;

    if (!core.global["$ustra"]) {
      core.proxy(core.global, "$ustra", {
        get() {
          return useUstra();
        },
      });
    }

    // core.global.$ustra = this

    // for vue app
    nuxtApp.vueApp.config.globalProperties.$ustra = this;
  }

  /**
   * 디버그 모드 여부
   */
  get debug() {
    return !!this.env?.appProps?.debug;
  }

  async init() {
    await this.nuxtApp.callHook("ustra:plugin:start", this);

    // patch date json format
    date.patchConvertJsonWithCurrentZone();

    // plugin order
    // env -> ui -> api -> management -> auth -> add interceptors

    const config = new Config(this.nuxtApp);

    this.error = new UstraError(this.nuxtApp);
    this.utils = new UstraUtils(this.nuxtApp);
    this.env = new UstraEnv(this.nuxtApp, this);
    this.components = new UstraComponents(this);

    await this.env.init();

    if (process.client && this.env.appProps.app.banner) {
      console.log(this.env.appProps.app.banner);
      // this.env.appProps.app.banner?.split('\n').forEach(l => console.log(l))
    }
    logger.info(
      `😸 U.STRA framework version : ${this.env.appProps.app.version}`
    );
    logger.info(`🛠 User request unique id : ${this.uuid}`);
    logger.info(
      `🛠 [${this.uuid}] User request routes path : ${this.nuxtApp._route?.fullPath}`
    );

    this.ui = new UstraUI(this.nuxtApp);
    this.api = new UstraApi(this);
    this.fetch = new UstraFetch(this);

    await this.nuxtApp.callHook("ustra:plugin:api", this.api, this);

    if (this.env.appProps.nuxt.management.enabled) {
      this.management = new UstraManagement(this.nuxtApp, this);
      await this.management.init();
    }

    if (this.env.appProps.auth.enabled) {
      this.auth = new UstraAuth(this.nuxtApp, this);
      await this.nuxtApp.callHook("ustra:plugin:auth", this.auth, this);
      await this.auth.init();
    }

    await this.api.addInterceptors();
    this._interfaceStore = await useUstraInterfaceStore(this.nuxtApp);

    this.interfaces = new UstraInterfaces(this.nuxtApp);

    this.mobile = new UstraMobile(this.nuxtApp);

    if (process.client) {
      this.dom = new UstraDom(this);
    }

    this.logger = useLogger(this.env?.appProps?.logging?.name || "ustra");

    registerDirectives(this.nuxtApp);

    await this.nuxtApp.callHook("ustra:plugin:end", this);
  }

  private _interfaceStore: Awaited<ReturnType<typeof useUstraInterfaceStore>> =
    null;

  definedStore = ((plugin) => {
    return {
      core: useUstraCoreStore(),
      get interfaces() {
        return plugin._interfaceStore;
      },
    };
  })(this);

  /**
   * global 객체 리턴
   */
  get global() {
    return core.global;
  }
}

const _subsets = {};
export const addSubSets = (name: string, value: any) => {
  _subsets[name] = value;
};

export default defineNuxtPlugin(async (nuxtApp) => {
  // add component mixin
  // https://stackoverflow.com/questions/64119722/what-is-the-vue-3-equivalent-of-vue-2s-vue
  if (process.client) {
    nuxtApp.vueApp.mixin({
      mounted() {
        if (!this.$el) {
          return;
        }

        if (!this.$el.__vueComponent) {
          this.$el.__vueComponent = this;
        }

        if (!this.$el.__vueComponentInstances) {
          this.$el.__vueComponentInstances = [];
        }

        this.$el.__vueComponentInstances.push(this);
      },
    });
  }

  // @ts-ignore
  const ustraPlugin = new Ustra(nuxtApp);
  await ustraPlugin.init();

  for (const subSetKey in _subsets) {
    ustraPlugin[subSetKey] = await _subsets[subSetKey](ustraPlugin);
  }

  return {
    provide: {
      ustra: ustraPlugin,
    },
  };
});
