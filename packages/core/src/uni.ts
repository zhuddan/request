import merge from 'lodash.merge'

import type {
  BaseConfig,
  BaseRequestInterceptors,
  BaseResponse,
  DefaultResponseResult,
  DefaultUserConfig,
  GetResponseConfig,
  RequiredProperty,
} from './shared'
import { ResponseError } from './shared'

export * from './shared'

type RequestOptions = UniNamespace.RequestOptions

interface UniAppResponse<T extends BaseResponse = BaseResponse> extends UniApp.RequestSuccessCallbackResult {
  data: T
}

/**
 * 基础配置
 */
export interface UniRequestBaseConfig extends Partial<RequestOptions>, BaseConfig {}
/**
 * 用户自定义请求配置
 */
export type UniRequestConfig<T extends object> = UniRequestBaseConfig & T
/**
 * 用户自定义请求配置  (去除 method baseUrl)
 */
type UniRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T

/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type UniRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T

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
  private baseConfig: UniRequestConfig<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: UniRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: UniRequestConfig<UserConfig>, interceptors?: UniRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  get<D extends object>(config: UniRequestGetConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  get<D extends object>(config: UniRequestGetConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  get<D extends object>(config: UniRequestGetConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  post<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  post<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  put<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  put<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  delete<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  delete<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: UniRequestConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  async request<D extends object>(config: UniRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D extends object>(config: UniRequestConfig<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
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
