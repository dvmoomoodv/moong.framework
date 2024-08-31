import InMemoryCache from './inmemory'

// @ts-ignore
import { options } from '#ustra-cache-ssr-options'

// @ts-ignore
import keyFunction from '#ustra-cache-ssr-key-function'

import { isUrlCacheable } from './utils'
import { eventHandler } from 'h3'

const customKey = keyFunction ? keyFunction : options.key ? eval(options.key) : null

export default eventHandler(async event => {
  const { url } = event.node.req
  if (isUrlCacheable(event.node.req, event.node.res, options.pages)) {
    const key = customKey ? await customKey(url, event.node.req.headers, event) : url

    if (key && typeof key === 'string') {
      console.log('$ustra find ssr cache : ', key)
      const cachedRes = await InMemoryCache.get(key)

      if (cachedRes) {
        event.node.res.writeHead(200, { ...cachedRes.headers, 'x-ssr-cache': 'HIT' })
        event.node.res.end(cachedRes.body)
      } else {
        event.node.res.setHeader('x-ssr-cache', 'MISS')
      }
    }
  }
})
