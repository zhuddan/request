import { name, version } from '../../../package.json'
import { Cache } from './cache'

interface CacheType {
  /**
   * 登录凭证
   */
  TOKEN: string
}
/**
 * 缓存
 */
const cache = new Cache<CacheType>(name, version)

/** */
export function getCacheToken() {
  return cache.get('TOKEN')
}

export function setCacheToken(token: string) {
  return cache.set('TOKEN', token, -1)
}

export function removeCacheToken() {
  return cache.remove('TOKEN')
}
