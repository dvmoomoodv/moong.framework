import { caching } from 'cache-manager'
import { hash } from 'ohash'

const DefaultCacheOption = {
  max: 500,
  ttl: 1e4,
}
const DefaultOptionsLRU = {
  max: 500,
  ttl: 1e3 * 60,
}
class InMemoryCache {
  private cached = null

  constructor(options2 = {}) {
    this.cached = {}
  }
  async get(key) {
    const result = await this.cached.get(hash(key))
    return result
  }
  async set(key, value) {
    await this.cached.set(hash(key), value)
  }
  async init(options2) {
    let cachingOption = DefaultCacheOption
    if (options2 !== null && typeof options2 === 'object') {
      cachingOption = { ...cachingOption, ...options2 }
    }
    this.cached = await caching('memory', cachingOption)
  }
}
export default new InMemoryCache()
