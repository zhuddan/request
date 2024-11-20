import Taro from '@tarojs/taro'
import merge from 'lodash-es/merge'
import type { RequiredProperty, ResponseResult } from './shared'
import { ResponseError } from './shared'

export * from './shared'

type BaseResponse = string | object | ArrayBuffer

type RequestOptions<T = any, U extends string | TaroGeneral.IAnyObject | ArrayBuffer = any | any> = Taro.request.Option<T, U>
type _TaroResponse = Taro.request.SuccessCallbackResult

interface TaroResponse<T extends BaseResponse = BaseResponse> extends _TaroResponse {
  data: T
}

/**
 * TaroRequestBaseConfig 请求配置
 */
export interface TaroRequestBaseConfig extends Partial<RequestOptions> {
  /**
   * 公共url
   */
  baseUrl?: string
  /**
   * get 请求参数
   */
  params?: any
  /**
   * 返回原生响应 TaroResponse<T> 默认false
   */
  getResponse?: boolean
  /**
   * 忽略 loading 提示
   */
  ignoreLoading?: boolean
}

/**
 *  返回原生响应
 */
interface TaroRequestGetResponseConfig {
  getResponse: true
};

/**
 * 用户自定义请求配置
 */
export type TaroRequestConfig<T extends object> = TaroRequestBaseConfig & T

/**
 * 用户自定义请求配置
 */
type TaroRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<TaroRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T

/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type TaroRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<TaroRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T

/**
 * 拦截器
 */
export interface TaroRequestInterceptors<T extends object> {
  request?: (value: TaroRequestConfig<T>) => TaroRequestConfig<T> | Promise<TaroRequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: { config: TaroRequestConfig<T>, response: TaroResponse }) => TaroResponse | Promise<TaroResponse>)
  responseError?: (error: ResponseError<TaroRequestConfig<T>>) => (Promise<any> | any)
}
/**
 * 实现
 */
export class TaroRequest<T extends object> {
  /**
   * 基础配置
   */
  private baseConfig: TaroRequestConfig<T>
  /**
   * 拦截器
   */
  private interceptors?: TaroRequestInterceptors<T>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: TaroRequestConfig<T>, interceptors?: TaroRequestInterceptors<T>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<T> & TaroRequestGetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: TaroRequestConfigWithoutMethod<T> & TaroRequestGetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  post<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  post<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: TaroRequestConfigWithoutMethod<T> & TaroRequestGetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  put<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  put<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: TaroRequestConfigWithoutMethod<T> & TaroRequestGetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  delete<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  delete<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: TaroRequestConfig<T> & TaroRequestGetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  async request<D extends object>(config: TaroRequestConfig<T>): Promise<ResponseResult<D>>
  async request<D extends object>(config: TaroRequestConfig<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    let _config = merge({}, this.baseConfig, config)
    try {
      _config = await this.interceptors?.request?.(_config) || _config
    }
    catch (error) {
      console.log('interceptors?.requestError ', error)
      this.interceptors?.requestError?.(error)
      throw error
    }
    try {
      /**
       * 没有 loading 的请求 在开发环境会报错, 你可以设置 ignoreLoading 取消警告
       */
      const response = await Taro.request(_config as any) as TaroResponse<D>
      const userResponse = await this.interceptors?.response?.({ config: _config, response }) as TaroResponse<D>
      return userResponse || response
    }
    catch (error) {
      if (error instanceof Error) {
        const requestError = new ResponseError(error.message, _config)
        this.interceptors?.responseError?.(requestError)
        throw requestError
      }
      throw error
    }
  }
}
