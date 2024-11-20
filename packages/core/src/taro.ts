import Taro from '@tarojs/taro'
import merge from 'lodash-es/merge'
import type { BaseConfig, BaseRequestInterceptors, BaseResponse, GetResponseConfig, RequiredProperty, ResponseResult } from './shared'
import { ResponseError } from './shared'

export * from './shared'

type RequestOptions<T = any, U extends string | TaroGeneral.IAnyObject | ArrayBuffer = any | any> = Taro.request.Option<T, U>

interface TaroResponse<T extends BaseResponse = BaseResponse> extends Taro.request.SuccessCallbackResult {
  data: T
}

/**
 * 基础配置
 */
export interface TaroRequestBaseConfig extends Partial<RequestOptions>, BaseConfig {}

/**
 * 用户自定义请求配置
 */
export type TaroRequestConfig<T extends object> = TaroRequestBaseConfig & T

/**
 * 用户自定义请求配置  (去除 method baseUrl)
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
export type TaroRequestInterceptors<T extends object> = BaseRequestInterceptors<TaroRequestConfig<T>, TaroResponse>
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

  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<T> & GetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: TaroRequestConfigWithoutMethod<T> & GetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  post<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  post<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: TaroRequestConfigWithoutMethod<T> & GetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  put<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  put<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: TaroRequestConfigWithoutMethod<T> & GetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
  delete<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  delete<D extends object>(config: TaroRequestConfigWithoutMethod<T>): Promise<TaroResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: TaroRequestConfig<T> & GetResponseConfig): Promise<TaroResponse<ResponseResult<D>>>
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
      const response = await Taro.request(_config as RequestOptions) as TaroResponse<D>
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
