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
import { RequestMethodsEnum, ResponseError } from './shared'

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
   */
  constructor(options: DefaultUniRequestConfig<UserConfig>, interceptors?: UniRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  /**
   * get 请求
   * @param config
   */
  get<D extends object>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  get<D extends object>(config: UniRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  get<D extends object>(config: UniRequestSimpleConfig<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.GET })
  }

  /**
   * header 请求
   * @param config
   */
  header<D extends object>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  header<D extends object>(config: UniRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  header<D extends object>(config: UniRequestSimpleConfig<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.HEAD })
  }

  /**
   * options 请求
   * @param config
   */
  options<D extends object>(config: UniRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  options<D extends object>(config: UniRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  options<D extends object>(config: UniRequestSimpleConfig<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.OPTIONS })
  }

  /**
   * post 请求
   * @param config
   */
  post<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  post<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  post<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.POST })
  }

  /**
   * put 请求
   * @param config
   */
  put<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  put<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  put<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.PUT })
  }

  /**
   * delete 请求
   * @param config
   */
  delete<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  delete<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  delete<D extends object>(config: UniRequestConfigWithoutMethod<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.DELETE })
  }

  async request<D extends object>(config: UniRequestConfig<UserConfig> & GetResponseConfig): Promise<UniAppResponse<UserResponseResult & D>>
  async request<D extends object>(config: UniRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D extends object>(config: UniRequestConfig<UserConfig>): Promise<UniAppResponse<D> | UserResponseResult & D> {
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
