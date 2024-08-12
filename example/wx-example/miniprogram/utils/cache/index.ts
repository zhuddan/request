import { Cache } from './cache'

interface CacheType {
  /**
   * 登录凭证
   */
  TOKEN: string
  /**
   * openid
   */
  OPEN_ID: string
  /**
   * debug
   */
  DEBUG_DATA: any
  /**
   * 用户信息
   */
  USER_INFO: Api.UserInfo | null
}
/**
 * 缓存
 */
const cache = new Cache<CacheType>('wx', 'version')

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
/** */

/** */
export function getCacheOpenId() {
  return cache.get('OPEN_ID')
}

export function setCacheOpenId(openid: string) {
  return cache.set('OPEN_ID', openid, -1)
}

export function removeCacheOpenId() {
  return cache.remove('OPEN_ID')
}

/** */
export function getCacheDebugData() {
  return cache.get('DEBUG_DATA')
}

export function setCacheDebugData(data: any) {
  return cache.set('DEBUG_DATA', data, -1)
}

export function removeCacheDebugData() {
  return cache.remove('DEBUG_DATA')
}

/** */
export function getCacheUserInfo() {
  return cache.get('USER_INFO')
}

export function setCacheUserInfo(data: Api.UserInfo | null) {
  return cache.set('USER_INFO', data, -1)
}

export function removeCacheUserInfo() {
  return cache.remove('USER_INFO')
}

/** */
// 清空所有缓存
export function clearCache() {
  const keys: (keyof CacheType)[] = [
    'TOKEN',
    'OPEN_ID',
    'DEBUG_DATA',
    'USER_INFO',
  ]
  keys.forEach((key) => {
    cache.remove(key)
  })
}
