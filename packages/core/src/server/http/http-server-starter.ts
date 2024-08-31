/**
 * HTTP Server Starter
 * @exports
 * @packageDocumentation
 */
import { AppProps, propsStore } from "#moong/core/config";
import { configLoader } from "#moong/core/config/loader/config-loader";
import {
  createServer,
  Server,
  RequestListener,
  ServerOptions,
} from "node:http";
import { useLogger } from "#moong/core";
import coreUtils from "#moong/core/utils/core";
import functionUtils from "#moong/core/utils/functions";
import middlewareUtils from "./utils/middleware-utils";

const logger = useLogger("http");

/**
 * 서버 구동 옵션
 */
export interface ServerRunningOption<
  App extends RequestListener = RequestListener,
> {
  /**
   * 어플리케이션
   */
  app: App;

  /**
   * 서버 옵션
   */
  serverOptions?: ServerOptions;

  /**
   * 어플리케이션 프로퍼티
   */
  appProps?: AppProps;

  /**
   * 미들웨어 적용 여부
   */
  applyMiddlewares?: boolean;

  /**
   * 서버 리스닝 여부
   */
  listening?: boolean;

  /**
   * 미들웨어 세팅 후 처리 Handler
   */
  afterMiddlewareHandler?: (
    app: App,
    appPros: AppProps
  ) => void | Promise<void>;
}

/**
 * Http 서버 구동 추상 클래스
 */
export abstract class HttpServerStarter<
  App extends RequestListener = RequestListener,
> {
  /**
   * 어플리케이션 Configuration을 설정한다.
   * @param appProps
   * @returns
   */
  setConfigProperties(appProps: AppProps): AppProps {
    return configLoader.loadConfigProperties(appProps);
  }

  /**
   * 등록된 어플리케이션 Configuration을 조회
   * @returns
   */
  getConfigProperties() {
    if (propsStore.isStored) {
      return propsStore.getProperties();
    }

    return null;
  }

  initConfigProperties(options: ServerRunningOption<App>) {
    options = coreUtils.deepMerge(
      {},
      {
        app: undefined,
        applyMiddlewares: true,
        listening: true,
        appProps: {},
      },
      options
    );
    if (!propsStore.isStored) {
      options.appProps = this.setConfigProperties(options.appProps);
    }

    return options;
  }

  /**
   * 서버 구동
   * @param options 구동 옵션
   */
  async run(options: ServerRunningOption<App>): Promise<Server> {
    options = this.initConfigProperties(options);

    logger.info("applicaiton properties", options.appProps);

    let server: Server;
    if (options.serverOptions) {
      server = createServer(options.serverOptions, options.app);
    } else {
      server = createServer(options.app);
    }

    if (options.applyMiddlewares) {
      middlewareUtils.setupMiddlewares(options.app, options.appProps);

      if (options.afterMiddlewareHandler) {
        const handlerResult = options.afterMiddlewareHandler(
          options.app,
          options.appProps
        );

        if (functionUtils.isPromise(handlerResult)) {
          await handlerResult;
        }
      }
    }

    if (options.listening) {
      logger.info({
        message: `http server is listening: ${options.appProps.server.port}`,
        badge: true,
      });
      server.listen(options.appProps.server.port);
    }

    return server;
  }
}
