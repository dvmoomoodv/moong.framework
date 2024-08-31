import { HttpServerStarter } from '#ustra/core/server/http/http-server-starter'
import { App } from 'h3'

/**
 * h3 server starter
 */
// @ts-ignore
export class H3ServerStarter extends HttpServerStarter<App> {}

const instance = new H3ServerStarter()
export { instance as h3ServerStater }
