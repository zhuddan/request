/**
 * @description 请求方法
 */
export enum RequestMethodsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description headers ContentType
 */
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export type ResponseResult<T extends object = object> = {
  code: number
  status: number
  msg: string
  message: string
} & T

export type RequiredProperty<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Simple object check.
 * @param item
 */
export function isObjectOrArray(item: unknown): item is Array<any> | Record<any, any> {
  return (!!item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * 对象合并
 * @param object
 * @param source
 */
export function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource
export function merge<TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2
export function merge<TObject, TSource1, TSource2, TSource3>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3): TObject & TSource1 & TSource2 & TSource3
export function merge<TObject, TSource1, TSource2, TSource3, TSource4>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, source4: TSource4): TObject & TSource1 & TSource2 & TSource3 & TSource4
export function merge(object: any, ...otherArgs: any[]): any
export function merge<TObject, TSource>(target: TObject, ...sources: TSource[]) {
  if (!sources.length)
    return target
  const source = sources.shift()

  if (isObjectOrArray(target) && isObjectOrArray(source)) {
    for (const key in source) {
      if (isObjectOrArray((source as any)[key])) {
        if (!(target as any)[key])
          Object.assign(target, { [key]: {} })
        merge((target as any)[key], (source as any)[key])
      }
      else {
        Object.assign(target, { [key]: (source as any)[key] })
      }
    }
  }

  return merge(target, ...sources)
}
