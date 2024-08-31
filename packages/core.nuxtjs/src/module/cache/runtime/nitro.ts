import InMemoryCache from './inmemory'
import zlib from 'node:zlib'

// @ts-ignore
import { options } from '#ustra-cache-ssr-options'

// @ts-ignore
import keyFunction from '#ustra-cache-ssr-key-function'

import { isUrlCacheable } from './utils'

const customKey = keyFunction ? keyFunction : options.key ? eval(options.key) : null
const gzipOptions = { level: zlib.constants.Z_BEST_COMPRESSION }
const brotliOptions = {
  [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
  [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.Z_BEST_COMPRESSION,
}

const { encoding = '' } = options.compressResponse || {}
const compressedBuff = fileContents => {
  return new Promise((resolve, reject) => {
    const cb = (error, result?) => (error ? reject(error) : resolve(result))
    if (encoding === 'gzip') {
      zlib.gzip(fileContents, gzipOptions, cb)
    } else if (encoding === 'br') {
      zlib.brotliCompress(fileContents, brotliOptions, cb)
    } else {
      cb('Invalid compression option. Please provide either br or gzip')
    }
  })
}

export default async function (nitroApp) {
  const cacheOption = options.store || {}
  await InMemoryCache.init(cacheOption)

  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    const isCacheable = isUrlCacheable(event.node.req, event.node.res, options.pages)
    if (isCacheable && response.statusCode === 200) {
      const key = customKey ? await customKey(event.node.req.url, event.node.req.headers, event) : event.req.url
      if (key && typeof key === 'string') {
        let cachedRes = response
        if (encoding) {
          const encodedBuffer = await compressedBuff(response.body)
          cachedRes = {
            ...cachedRes,
            body: encodedBuffer,
            headers: {
              ...cachedRes.headers,
              'content-encoding': encoding,
            },
          }
        }

        console.log('$ustra add ssr cache : ', key)
        await InMemoryCache.set(key, cachedRes)
      }
    }
  })
}
