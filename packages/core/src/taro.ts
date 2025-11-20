import Taro from '@tarojs/taro'
import merge from 'lodash.merge'
import type { BaseConfig, BaseRequestInterceptors, DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty } from './shared'
import { RequestMethodsEnum, ResponseError, isSimpleRequest } from './shared'

export * from './shared'

type RequestOptions<T = any, U extends string | TaroGeneral.IAnyObject | ArrayBuffer = any | any> = Taro.request.Option<T, U>

interface TaroResponse<T = any> extends Taro.request.SuccessCallbackResult {
  data: T
}

/**
 * 基础配置
 */
export interface TaroRequestBaseConfig extends Partial<RequestOptions>, BaseConfig {}

/**
 * 用户自定义请求配置(完整的配置，用于拦截器)
 */
export type TaroRequestConfig<T extends object> = TaroRequestBaseConfig & T

/**
 * 默认配置
 */
export type DefaultTaroRequestConfig<T extends object> =
  Omit<
    TaroRequestBaseConfig,
    'method' | 'url' | 'params' | 'data'
  > & T
/**
 * TaroRequestConfigWithoutMethod 配置
 * 去除 method 为了给具体请求函数使用 get / post ...
 */
export type TaroRequestConfigWithoutMethod<T extends object> =
  RequiredProperty<Omit<TaroRequestBaseConfig, 'method'>, 'url'> & T

/**
 * 简单请求（ GET OPTIONS HEAD ）的配置
 */
export type TaroRequestSimpleConfig<T extends object> =
  RequiredProperty<Omit<TaroRequestBaseConfig, 'method' | 'data'>, 'url'> & T

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
  private baseConfig: DefaultTaroRequestConfig<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: TaroRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: DefaultTaroRequestConfig<UserConfig>, interceptors?: TaroRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  /**
   * 创建请求
   */
  private createRequest<D>(
    configOrUrl: TaroRequestSimpleConfig<UserConfig> | TaroRequestConfigWithoutMethod<UserConfig> | string,
      dataOrParams: Record<string, any> = { },
      method: RequestMethodsEnum,
  ) {
    const config = typeof configOrUrl === 'string'
      ? {
          url: configOrUrl,
          [isSimpleRequest(method) ? 'params' : 'data']: dataOrParams,
        } as unknown as TaroRequestSimpleConfig<UserConfig>
      : configOrUrl
    return this.request<D>({ ...config, method })
  }

  /**
   * get 请求
   */
  get<D>(config: TaroRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  get<D>(config: TaroRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  get<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  get<D>(configOrUrl: TaroRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.GET)
  }

  /**
   * head 请求
   */
  head<D>(config: TaroRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  head<D>(config: TaroRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  head<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  head<D>(configOrUrl: TaroRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.HEAD)
  }

  /**
   * options 请求
   */
  options<D>(config: TaroRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  options<D>(config: TaroRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  options<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  options<D>(configOrUrl: TaroRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.OPTIONS)
  }

  /**
   * delete 请求
   */
  delete<D>(config: TaroRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  delete<D>(config: TaroRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  delete<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  delete<D>(configOrUrl: TaroRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.DELETE)
  }

  /**
   * post 请求
   */
  post<D>(config: TaroRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  post<D>(config: TaroRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  post<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  post<D>(configOrUrl: TaroRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.POST)
  }

  /**
   * put 请求
   */
  put<D>(config: TaroRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  put<D>(config: TaroRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  put<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  put<D>(configOrUrl: TaroRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise<TaroResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.PUT)
  }

  /**
   * request 请求
   */
  async request<D>(config: TaroRequestConfig<UserConfig> & GetResponseConfig): Promise<TaroResponse<UserResponseResult & D>>
  async request<D>(config: TaroRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D>(config: TaroRequestConfig<UserConfig>): Promise<TaroResponse<D> | UserResponseResult & D> {
    let _config = merge({}, this.baseConfig, config) as TaroRequestConfig<UserConfig>
    try {
      _config = (await this.interceptors?.request?.(_config) || _config)
    }
    catch (error) {
      this.interceptors?.requestError?.(error)
      throw error
    }
    try {
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
