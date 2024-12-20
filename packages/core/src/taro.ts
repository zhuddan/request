import Taro from '@tarojs/taro'
import merge from 'lodash-es/merge'
import type { BaseConfig, BaseRequestInterceptors, BaseResponse, DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty } from './shared'
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
export class TaroRequest<
  /**
   * 用户自定义配置
   */
  UserConfig extends object = DefaultUserConfig,
  /**
   * 用户自定义响应
   */
  UserResponseResult extends object = DefaultResponseResult,
> {
  /**
   * 基础配置
   */
  private baseConfig: TaroRequestConfig<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: TaroRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: TaroRequestConfig<UserConfig>, interceptors?: TaroRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  get<D extends object>(config: TaroRequestGetConfigWithoutMethod<UserConfig>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  post<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  post<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  put<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  put<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  delete<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  delete<D extends object>(config: TaroRequestConfigWithoutMethod<UserConfig>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: TaroRequestConfig<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  async request<D extends object>(config: TaroRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D extends object>(config: TaroRequestConfig<UserConfig>): Promise<TaroResponse<D> | UserResponseResult & D> {
    let _config = merge({}, this.baseConfig, config)
    try {
      _config = await this.interceptors?.request?.(_config) || _config
    }
    catch (error) {
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
