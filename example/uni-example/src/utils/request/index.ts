import {
  type UniRequestConfig as RequestConfig,
  UniRequest,
} from '@zd~/request/uni'

import {
  ContentTypeEnum,
  RequestMethodsEnum,
  type ResponseResult,
} from '@zd~/request/shared'

import { getCacheToken } from '../cache'
import { type HttpRequestUserConfig, tokenKey, tokenKeyScheme } from './types'

function isString(value: string): value is string {
  return typeof value == 'string'
}
// import {
//   getCacheToken,
//   isLink,
//   isString,
//   joinTimestamp,
//   removeUndefinedKeys,
//   setParams,
//   showToastError,
//   toAuth,
// } from '@/utils/index'

function isLink(url = '') {
  return /^[a-z]+:\/\//i.test(url)
}

/**
 * 加时间戳
 * @param join
 * @param restful
 */
function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object
function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join)
    return restful ? '' : {}

  const now = Date.now()
  if (restful)
    return `?_t=${now}`

  return { _t: now }
}

/**
 * @description 去除去除对象中的值为 undefined 的键
 * @param obj
 * @example
 * const obj = {
 *   a: 1,
 *   b: undefined,
 *   c: 3,
 *   d: undefined,
 * };
 * const result = removeUndefinedKeys(obj);
 * console.log(result); // 输出: { a: 1, c: 3 }
 */
function removeUndefinedKeys<T extends object>(obj: T) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined)
      acc[key as keyof T] = value
    return acc
  }, {} as T)
}

// /**
//  *  获取?后面的参数
//  * @param url
//  */
// function getParams(url?: string) {
//   const _url = url || window.location.href
//   const [, search] = _url.split('?')
//   if (search && search.length) {
//     const paramsList = search.split('&')
//     const params: Record<string, any> = {}
//     paramsList.forEach((e) => {
//       const [key, value] = e.split('=')
//       if (value !== undefined && value !== '') {
//         params[key] = value
//       }
//     })
//     return params
//   }
//   return {}
// }

/**
 * 封装带?有查询参数的 URL
 * @param {string} baseUrl - 基础 URL
 * @param {object} params - 要附加到 URL 的查询参数对象
 * @returns {string} 返回附加了查询参数的完整 URL
 */
function setParams(baseUrl: string, params: object): string {
  if (!Object.keys(params).length)
    return baseUrl
  let parameters = ''
  for (const key in params) {
    parameters += `${key}=${encodeURIComponent(params[key as keyof typeof params])}&`
  }

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export const request = new UniRequest<HttpRequestUserConfig>({
  baseUrl: 'https://vue.ruoyi.vip/prod-api',
  timeout: 60 * 1000,
  header: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  getResponse: false,
  withToken: true,
  showErrorMsg: true,
}, {
  request(_config) {
    const config = Object.assign({
      ..._config,
    }) as RequestConfig<HttpRequestUserConfig>

    // 1. 处理 url 不是 http 或者 https 开头则加上 baseUrl
    if (!isLink(config.url))
      config.url = `${config.baseUrl || ''}${config.url}`

    if (config.params !== undefined) {
      if (config.method?.toUpperCase() === RequestMethodsEnum.GET) {
        if (!isString(config.params)) {
          const params = removeUndefinedKeys(config.params)
          const _params = Object.assign(params || {}, params || {}, joinTimestamp(true, false))
          config.data = removeUndefinedKeys(_params)
        }
        else {
          config.url = `${config.url + config.params}${joinTimestamp(true, true)}`
        }
      }
      else {
        if (!isString(config.params)) {
          config.url = setParams(config.url as string, Object.assign({}, config.params))
        }
        else {
        // 兼容restful风格
          config.url = config.url + config.params
        }
      }
    }

    /**
     * token
     */
    const token = getCacheToken()
    const whiteUrlPrefix = `${config.baseUrl}/api/`
    const isWhiteUrl = config.url!.startsWith(whiteUrlPrefix)
    const withToken = config.withToken && `${config.withToken}` === 'true'

    if (withToken && !isWhiteUrl) {
      if (token) {
        config.header = {
          [tokenKey]: `${tokenKeyScheme} ${token}`,
          ...config.header,
        }
      }
      else {
        throw new Error('no token')
      }
    }
    if (config.data && typeof config.data === 'object') {
      config.data = removeUndefinedKeys(config.data)
    }
    return config
  },

  requestError(e) {
    if (e.message === 'no token') {
      //
    }
  },

  async response({ config, response }) {
    const { data, statusCode } = response
    if (statusCode !== 200) {
      const msg = getSystemErrorMessage(statusCode)
      return handleError(msg)
    }

    if (config.getResponse) {
      return response
    }

    const responseData = data as ResponseResult<object>

    if (responseData.code === 200) {
      return responseData as any
    }

    if (responseData.code === 401) {
      //
    }

    const msg = responseData.msg || getSystemErrorMessage(responseData.code)
    return handleError(msg, responseData.code !== 401 && !config?.showErrorMsg)
  },

  responseError(error: any) {
    if (error) {
      const err = error?.errMsg || error?.msg || error?.message || ''
      return handleError(err)
    }
  },
})

function getSystemErrorMessage(status: number) {
  switch (status) {
    case 400:
      return '错误请求，服务器无法理解请求的格式'
    case 401:
      return '无效的会话，或者会话已过期，请重新登录。'
    case 403:
      return '当前操作没有权限'
    case 404:
      return '服务器无法根据客户端的请求找到资源'
    case 405:
      return '网络请求错误,请求方法未允许!'
    case 408:
      return '网络请求超时!'
    case 500:
      return '服务器内部错误，无法完成请求'
    case 502:
      return '网关错误'
    case 503:
      return '服务器目前无法使用（由于超载或停机维护）'
    case 504:
      return '网络超时!'
    case 505:
      return 'http版本不支持该请求!'
    default:
      return '未知错误'
  }
}

function handleError(msg: string, showErrorMsg = true) {
  // showErrorMsg && showToastError(msg)
  if (showErrorMsg) {
    uni.showToast({
      icon: 'fail',
      title: msg,
    })
  }
  throw new Error(msg)
}
