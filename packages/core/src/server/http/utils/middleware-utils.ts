/**
 * Middleware 관련 유틸리티
 * @exports {@link HttpServerUtils}
 * @packageDocumentation
 */
import * as http from "http";
import * as net from "node:net";
import { ProxyServer, createProxyServer, Server } from "@refactorjs/http-proxy";
import { AppProps } from "#moong/core/config";
import coreUtils from "#moong/core/utils/core";
import arrayUtils from "#moong/core/utils/array";
import pathUtils from "#moong/core/utils/path";
import { logger } from "#moong/core/utils/logging";
import compression from "compression";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import multer from "multer";
import { NodeMiddleWareOption } from "../middlewares/node-middleware";
import { ProxyOptions } from "../middlewares/proxy";
import { requestContextHolder } from "../middlewares/request-context-holder";

/**
 * HTTP Server middleware 관련 유틸리티
 */
export class MiddlewareUtils {
  /**
   * server app에 미들웨어를 적용
   * @param app app
   * @param option 적용 옵션
   * @param applyMiddlwareHandler 후처리 핸들러
   * @returns app
   */
  applyNodeMiddleWareToApp<
    Option extends NodeMiddleWareOption = NodeMiddleWareOption,
  >(
    app: any,
    option: Option,
    applyMiddlwareHandler: (
      req: any,
      res: any,
      next: any
    ) => void | Promise<void>
  ) {
    if (!option.enabled) {
      return app;
    }

    app.use(this.toNodeMiddleware(option, applyMiddlwareHandler));

    return app;
  }

  private toNodeMiddleware<
    Option extends NodeMiddleWareOption = NodeMiddleWareOption,
  >(
    option: Option,
    applyMiddlwareHandler: (
      req: any,
      res: any,
      next: any
    ) => void | Promise<void>
  ) {
    if (!option.enabled) {
      return null;
    }

    return (req, res, next) => {
      if (!arrayUtils.isEmpty(option.includeUrlPatterns)) {
        if (!pathUtils.isMatchPatterns(req.url, ...option.includeUrlPatterns)) {
          return next();
        }
      }

      if (!arrayUtils.isEmpty(option.excludeUrlPatterns)) {
        if (pathUtils.isMatchPatterns(req.url, ...option.excludeUrlPatterns)) {
          return next();
        }
      }

      applyMiddlwareHandler(req, res, next);
    };
  }

  /**
   * app에 미들웨어를 적용한다.
   * @param app App 객체
   * @param appProps AppProps
   */
  setupMiddlewares(app: any, appProps: AppProps) {
    if (!appProps || !appProps.server) {
      throw new Error("before set middleware, set config properties first.");
    }

    if (!appProps.server.enabled) {
      return;
    }

    app.use(requestContextHolder.middleware());

    this.generateMiddlewares(appProps).forEach((middleware) =>
      app.use(middleware)
    );
  }

  private createProxyMiddleware(appProps: AppProps) {
    const proxies: Record<string, [ProxyServer, ProxyOptions]> = {};

    Object.keys(appProps.server.middleware.proxy.proxies).forEach((c) => {
      let opts: any = appProps.server.middleware.proxy[c];

      if (typeof opts === "string") {
        // @ts-ignore
        opts = { target: opts, changeOrigin: true } as ProxyOptions;
      }

      if (typeof opts === "object") {
        opts = coreUtils.assign(
          {
            changeOrigin: true,
            rewrite: false,
            configure: false,
            bypass: false,
          },
          opts
        ) as ProxyOptions;
      }

      const proxy = createProxyServer(opts as Server.ServerOptions);
      proxy.on("error", (err, req, originalRes) => {
        // When it is ws proxy, res is net.Socket
        const res = originalRes as http.ServerResponse | net.Socket;
        if ("req" in res) {
          console.error("http proxy error:" + err.stack, {
            timestamp: true,
            error: err,
          });

          if (!res.headersSent && !res.writableEnded) {
            res
              .writeHead(500, {
                "Content-Type": "text/plain",
              })
              .end();
          }
        } else {
          logger.error("ws proxy error:" + err.stack, {
            timestamp: true,
            error: err,
          });
          res.end();
        }
      });

      if (opts.configure) {
        opts.configure(proxy, opts);
      }

      proxies[c] = [proxy, { ...opts }];
    });

    function doesProxyContextMatchUrl(context: string, url: string): boolean {
      return (
        (context.startsWith("^") && new RegExp(context).test(url)) ||
        url.startsWith(context)
      );
    }

    return async (req, res, next) => {
      await new Promise<void>((resolve, reject) => {
        const next = (err?: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        };

        const url = req.url!;

        for (const context in proxies) {
          if (doesProxyContextMatchUrl(context, url)) {
            const [proxy, opts] = proxies[context];
            const options: Server.ServerOptions = {};

            if (opts.bypass) {
              const bypassResult = opts.bypass(req, res, opts);
              if (typeof bypassResult === "string") {
                req.url = bypassResult;
                console.debug("bypass: " + req.url + " -> " + bypassResult);
                return next();
              } else if (typeof bypassResult === "object") {
                Object.assign(options, bypassResult);
                console.debug(
                  "bypass: " + req.url + " use modified options: %O",
                  options
                );
                return next();
              } else if (bypassResult === false) {
                console.debug("bypass: " + req.url + " -> 404");
                return res.end(404);
              }
            }

            console.debug(req.url + " -> " + opts.target || opts["forward"]);

            if (opts.rewrite) {
              req.url = opts.rewrite(req.url!);
            }

            proxy.web(req, res, options);
            return;
          }
        }

        next();
      });
      next();
    };
  }

  /**
   * 설정에 존재하는 미들웨어 목록을 생성
   * @param appProps application properties
   * @param useRequestContext use request context middlware
   * @returns middleware array
   */
  generateMiddlewares(appProps: AppProps, useRequestContext = true) {
    const middlewares = [];

    if (useRequestContext) {
      middlewares.push(requestContextHolder.middleware());
    }

    // compression
    if (appProps.server.middleware.compression.enabled) {
      const compressionMiddleware = compression(
        appProps.server.middleware.compression
      );
      middlewares.push(
        this.toNodeMiddleware(
          appProps.server.middleware.compression,
          (req, res, next) => {
            return compressionMiddleware(req, res, next);
          }
        )
      );
    }

    // logging
    if (appProps.server.middleware.logging.enabled) {
      const loggingMiddleware = morgan(
        appProps.server.middleware.logging.format,
        appProps.server.middleware.logging.options
      );
      middlewares.push(
        this.toNodeMiddleware(
          appProps.server.middleware.logging,
          (req, res, next) => loggingMiddleware(req, res, next)
        )
      );
    }

    // body parsers
    if (appProps.server.middleware.jsonBodyParser.enabled) {
      const jsonMiddleware = json(appProps.server.middleware.jsonBodyParser);
      middlewares.push(
        this.toNodeMiddleware(
          appProps.server.middleware.jsonBodyParser,
          (req, res, next) => jsonMiddleware(req, res, next)
        )
      );
    }

    // url encode body
    if (appProps.server.middleware.urlEncodedBodyParser.enabled) {
      const urlEncodedMiddleware = urlencoded(
        appProps.server.middleware.urlEncodedBodyParser
      );
      middlewares.push(
        this.toNodeMiddleware(
          appProps.server.middleware.urlEncodedBodyParser,
          (req, res, next) => urlEncodedMiddleware(req, res, next)
        )
      );
    }

    // multipart
    if (appProps.server.middleware.multipart.enabled) {
      const multipartMiddleware = multer().array("files");
      middlewares.push(
        this.toNodeMiddleware(
          appProps.server.middleware.multipart,
          (req, res, next) => multipartMiddleware(req, res, next)
        )
      );
    }

    if (appProps.server.middleware.proxy) {
      middlewares.push(this.createProxyMiddleware(appProps));
    }

    return middlewares;
  }
}

const instance = new MiddlewareUtils();
export default instance;
