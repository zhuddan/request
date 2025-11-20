import merge from 'lodash.merge'

import type {
  BaseConfig,
  BaseRequestInterceptors,
  DefaultResponseResult,
  DefaultUserConfig,
  GetResponseConfig,
  RequiredProperty,
} from './shared'
import { RequestMethodsEnum, ResponseError, isSimpleRequest } from './shared'

export * from './shared'

type RequestOptions = UniNamespace.RequestOptions

interface UniAppResponse<T = any> extends Omit<UniApp.RequestSuccessCallbackResult, 'data'> {
  data: T
}

/**
 * 基础配置
 */
export interface UniRequestBaseConfig extends Partial<RequestOptions>, BaseConfig {}
/**
 * 用户自定义请求配置(完整的配置，用于拦截器)
 */
export type UniRequestConfig<T extends object> = UniRequestBaseConfig & T
/**
 * 默认配置
 */
export type DefaultUniRequestConfig<T extends object> =
  Omit<
    UniRequestBaseConfig,
    'method' | 'url' | 'params' | 'data'
  > & T
/**
 * UniRequestConfigWithoutMethod 配置
 * 去除 method 为了给具体请求函数使用 get / post ...
 */
export type UniRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<UniRequestBaseConfig, 'method'>, 'url'> & T

/**
 * 简单请求（ GET OPTIONS HEAD ）的配置
 */
export type UniRequestSimpleConfig<T extends object> = RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'data'>, 'url'> & T

/**
 * 拦截器
 */
export type UniRequestInterceptors<T extends object> = BaseRequestInterceptors<UniRequestConfig<T>, UniAppResponse>
/**
 * 实现
 */
export class UniRequest<
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
  private baseConfig: DefaultUniRequestConfig<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: UniRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */ constructor(options: DefaultUniRequestConfig<UserConfig>, interceptors?: UniRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  /**
   * 创建请求配置
   */
  private createRequest<D>(
    configOrUrl: UniRequestSimpleConfig<UserConfig> | UniRequestConfigWithoutMethod<UserConfig> | string,
      dataOrParams: Record<string, any> = { },
      method: RequestMethodsEnum,
  ) {
    const config = typeof configOrUrl === 'string'
      ? {
          url: configOrUrl,
          [isSimpleRequest(method) ? 'params' : 'data']: dataOrParams,
        } as unknown as UniRequestSimpleConfig<UserConfig>
      : configOrUrl
    return this.request<D>({ ...config, method })
  }

  /**
   * get 请求
   */
  get<D>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  get<D>(config: UniRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  get<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  get<D>(configOrUrl: UniRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.GET)
  }

  /**
   * head 请求
   */
  head<D>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  head<D>(config: UniRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  head<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  head<D>(configOrUrl: UniRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.HEAD)
  }

  /**
   * options 请求
   */
  options<D>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  options<D>(config: UniRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  options<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  options<D>(configOrUrl: UniRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.OPTIONS)
  }

  /**
   * delete 请求
   */
  delete<D>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  delete<D>(config: UniRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  delete<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  delete<D>(configOrUrl: UniRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.DELETE)
  }

  /**
   * post 请求
   */
  post<D>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  post<D>(config: UniRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  post<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  post<D>(configOrUrl: UniRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.POST)
  }

  /**
   * put 请求
   */
  put<D>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  put<D>(config: UniRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  put<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  put<D>(configOrUrl: UniRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.PUT)
  }

  /**
   * 具体实现
   */
  async request<D>(config: UniRequestConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  async request<D>(config: UniRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D>(config: UniRequestConfig<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    let _config = merge({}, this.baseConfig, config) as UniRequestConfig<UserConfig>
    try {
      _config = await this.interceptors?.request?.(_config) || _config
    }
    catch (error) {
      this.interceptors?.requestError?.(error)
      throw error
    }
    try {
      const response = await uni.request(_config as RequestOptions) as UniAppResponse<D>
      const userResponse = await this.interceptors?.response?.({ config: _config, response }) as UniAppResponse<D>
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
