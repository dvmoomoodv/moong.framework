import type { ProxyServer, Server } from '@refactorjs/http-proxy'
import type { IncomingMessage, ServerResponse } from 'http'

export interface ProxyModuleOptions {
  proxies: {
    [key: string]: string | ProxyOptions
  }
}

export interface ProxyOptions extends Server.ServerOptions {
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
  bypass?: (req: IncomingMessage, res: ServerResponse, options: ProxyOptions) => void | null | undefined | false | string | ProxyOptions
}
