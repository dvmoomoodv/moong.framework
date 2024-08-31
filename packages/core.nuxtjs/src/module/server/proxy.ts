import { join } from "pathe";
import { ProxyOptions } from "#moong/core/server/http/middlewares/proxy";
import { NuxtAppProps } from "#moong/nuxt/config";
import { addTemplate, addServerHandler } from "@nuxt/kit";
import { Nuxt } from "@nuxt/schema";

/**
 * proxy middleware 추가
 * TODO: 최신 버전에 맞게 nitro 설정 업데이트 할 것
 * @see https://github.com/nuxt-alt/proxy
 * @see https://github.com/wobsoriano/nuxt-proxy
 * @param options
 * @param nuxt
 * @returns
 */
export const addProxyMiddleware = (options: NuxtAppProps, nuxt: Nuxt) => {
  if (!nuxt.options.dev && !nuxt.options.ssr) {
    return;
  }

  const proxyOptions = options.server.middleware.proxy.proxies;

  console.info("$ustra proxyOptions", proxyOptions);

  addTemplate({
    filename: "ustra/http-proxy.ts",
    write: true,
    getContents: () => proxyMiddlewareContent(proxyOptions),
  });
  addServerHandler({
    handler: join(nuxt.options.buildDir, "ustra", "http-proxy.ts"),
    middleware: true,
  });
};

function converter(key, val) {
  if (typeof val === "function" || (val && val.constructor === RegExp)) {
    return String(val);
  }
  return val;
}

function proxyMiddlewareContent(options: ProxyOptions): string {
  return `import * as http from 'http'
import * as net from 'net'
import { createProxyServer, ProxyServer, Server } from '@refactorjs/http-proxy'
import { defineEventHandler } from 'h3'

interface ProxyOptions extends Server.ServerOptions {
  /**
   * rewrite path
   */
  rewrite?: (path: string) => string | null | undefined | false

  /**
   * configure the proxy server (e.g. listen to events)
   */
  configure?: (proxy: ProxyServer, options: ProxyOptions) => void | null | undefined | false

  /**
   * webpack-dev-server style bypass function
   */
  bypass?: (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      options: ProxyOptions
  ) => void | null | undefined | false | string
}

// lazy require only when proxy is used
const proxies: Record<string, [ProxyServer, ProxyOptions]> = {}
const options: Record<string, ProxyOptions> = ${JSON.stringify(options, converter)};

Object.keys(options).forEach((context) => {
  let opts: ProxyOptions = options[context]

  if (typeof opts === 'string') {
      opts = { target: opts, changeOrigin: true } as ProxyOptions
  }

  if (isObject(opts)) {
      opts = { changeOrigin: true, ...opts } as ProxyOptions
      opts.rewrite = opts.rewrite ? new Function("return (" + opts.rewrite + ")")() : false
      opts.configure = opts.configure ? new Function("return (" + opts.configure + ")")() : false
      opts.bypass = opts.bypass ? new Function("return (" + opts.bypass + ")")() : false
  }

  const proxy = createProxyServer(opts)

  proxy.on('error', (err, req, originalRes) => {
      // When it is ws proxy, res is net.Socket
      const res = originalRes as http.ServerResponse | net.Socket
      if ('req' in res) {
          console.error('http proxy error:' + err.stack, {
                  timestamp: true,
                  error: err
          })
          if (!res.headersSent && !res.writableEnded) {
              res
                  .writeHead(500, {
                      'Content-Type': 'text/plain'
                  })
                  .end()
          }
      } else {
          console.error('ws proxy error:' + err.stack, {
              timestamp: true,
              error: err
          })
          res.end()
      }
  })

  if (opts.configure) {
      opts.configure(proxy, opts)
  }

  // clone before saving because http-proxy mutates the options
  proxies[context] = [proxy, { ...opts }]
})

export default defineEventHandler(async (event) => {
  await new Promise<void>((resolve, reject) => {
      const next = (err?: unknown) => {
          if (err) {
              reject(err)
          } else {
              resolve()
          }
      }

      const url = event.req.url!

      for (const context in proxies) {
          if (doesProxyContextMatchUrl(context, url)) {
              const [proxy, opts] = proxies[context]
              const options: Server.ServerOptions = {}

              if (opts.bypass) {
                  const bypassResult = opts.bypass(event.req, event.res, opts)
                  if (typeof bypassResult === 'string') {
                    console.debug('bypass: ' + event.req.url + ' -> ' + bypassResult)
                    event.req.url = bypassResult
                    return next()
                  } else if (isObject(bypassResult)) {
                    Object.assign(options, bypassResult)
                    console.debug('bypass: ' + event.req.url + ' use modified options: %O', options)
                    // return next()
                  } else if (bypassResult === false) {
                    console.debug('bypass: ' + event.req.url + ' -> 404')
                    event.res.statusCode = 404
                    return event.res.end()
                    // return event.res.end(404)
                  }
              }

              if (opts.rewrite) {
                const originUrl = event.req.url
                event.req.url = opts.rewrite(event.req.url!) as string
                console.debug('rewrite executed : ', originUrl, ' -> ', event.req.url)
              }

              console.debug('proxy executed : ', event.req.url + ' -> ' + opts.target || opts.forward)

              proxy.web(event.req, event.res, options)
              return
          }
      }
      next()
  })
})

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function doesProxyContextMatchUrl(context: string, url: string): boolean {
  return (
      (context.startsWith('^') && new RegExp(context).test(url)) || url.startsWith(context)
  )
}
`;
}
