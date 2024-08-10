export interface CacheTime {
  day?: number
  hour?: number
  minutes?: number
  second?: number
}

export interface CacheData {
  value: any
  expires: number
}

/**
 * 缓存
 */
export class Cache<CacheType extends object> {
  packageName: string
  packageVersion: string
  defaultExpires = 864e5 * 7

  constructor(name: string, version: string) {
    this.packageName = name
    this.packageVersion = version
  }

  formatTime(data: Partial<CacheTime> | number): number {
    if (typeof data == 'number')
      return data

    const { day, hour, minutes, second } = data
    const dataDay = (day ? day * 24 : 0) * 864e2// 秒
    const dataHours = (hour || 0) * 60 * 60// 秒
    const dataMinutes = (minutes || 0) * 60// 秒
    const dataSeconds = (second || 0) * 60// 秒
    return (dataDay + dataHours + dataMinutes + dataSeconds) * 1000
  }

  getExpires(time?: Partial<CacheTime> | number): number {
    let expires = this.defaultExpires
    if (time === -1)
      expires = Number.MAX_SAFE_INTEGER

    else if (time)
      expires = this.formatTime(time)

    return new Date().getTime() + expires
  }

  get perfixKey() {
    return `${this.packageName}_${this.packageVersion}_`
  }

  stringifyJson<T = any>(data: T): string {
    try {
      return JSON.stringify(data)
    }
    catch (error) {
      throw new Error(error as any)
    }
  }

  parseJson(data: string): object {
    try {
      return JSON.parse(data)
    }
    catch (error) {
      throw new Error(error as any)
    }
  }

  getRealKey<K extends keyof CacheType>(key: K) {
    return `${this.perfixKey}${String(key)}`
  }

  set<K extends keyof CacheType>(key: K, value: CacheType[K], options = this.defaultExpires) {
    if (typeof localStorage === 'undefined')
      return
    const _key = this.getRealKey(key)
    const data = this.stringifyJson({
      value,
      expires: this.getExpires(options),
    })
    try {
      data && localStorage.setItem(_key, data)
    }
    catch (e) {
      // handle exceptions, possibly by removing older items
    }
  }

  get<K extends keyof CacheType>(key: K) {
    if (typeof localStorage === 'undefined')
      return null
    const res = localStorage.getItem(this.getRealKey(key))
    if (!res)
      return null
    const { expires, value } = this.parseJson(res) as CacheData
    const now = Date.now()
    if (expires < now) {
      this.remove(key)
      return null
    }
    return value as CacheType[K]
  }

  remove<K extends keyof CacheType>(key: K) {
    // uni.removeStorageSync(this.getRealKey(key) as string);
    localStorage.removeItem(this.getRealKey(key) as string)
  }

  clear() {
    if (typeof localStorage === 'undefined')
      return
    const keysToDelete = []
    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.perfixKey))
        keysToDelete.push(key)
    }
    keysToDelete.forEach(key => localStorage.removeItem(key))
  }
}
