import merge from 'lodash.merge'
import type { BaseConfig, BaseRequestInterceptors, DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty } from './shared'
import { RequestMethodsEnum, ResponseError, isSimpleRequest } from './shared'

export * from './shared'

type RequestOption = WechatMiniprogram.RequestOption

interface WechatResponse<T = any> extends Omit<WechatMiniprogram.RequestSuccessCallbackResult, 'data'> {
  data: T
}

/**
 * 基础配置
 */
export interface WechatRequestBaseConfig extends Partial<Omit<RequestOption, 'success' | 'fail' | 'complete'>>, BaseConfig {}
/**
 * 用户自定义请求配置(完整的配置，用于拦截器)
 */
export type WechatRequestConfig<T extends object> = WechatRequestBaseConfig & T
/**
 * 默认配置
 */
export type DefaultWechatRequestConfig<T extends object> =
  Omit<
    WechatRequestBaseConfig,
    'method' | 'url' | 'params' | 'data'
  > & T
/**
 * WechatRequestConfigWithoutMethod 配置
 * 去除 method 为了给具体请求函数使用 get / post ...
 */
type WechatRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<WechatRequestBaseConfig, 'method'>, 'url'> & T
/**
 * 简单请求（ GET OPTIONS HEAD ）的配置
 */
type WechatRequestSimpleConfig<T extends object> = RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'data'>, 'url'> & T
/**
 * 拦截器
 */
export type WechatRequestInterceptors<T extends object> = BaseRequestInterceptors<WechatRequestConfig<T>, WechatResponse>
/**
 * 实现
 */
export class WxRequest<
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
  private baseConfig: DefaultWechatRequestConfig<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: WechatRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */ constructor(options: DefaultWechatRequestConfig<UserConfig>, interceptors?: WechatRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  /**
   * 创建请求配置
   */
  private createRequest<D>(
    configOrUrl: WechatRequestSimpleConfig<UserConfig> | WechatRequestConfigWithoutMethod<UserConfig> | string,
      dataOrParams: Record<string, any> = { },
      method: RequestMethodsEnum,
  ) {
    const config = typeof configOrUrl === 'string'
      ? {
          url: configOrUrl,
          [isSimpleRequest(method) ? 'params' : 'data']: dataOrParams,
        } as unknown as WechatRequestSimpleConfig<UserConfig>
      : configOrUrl
    return this.request<D>({ ...config, method })
  }

  /**
   * get 请求
   */
  get<D>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  get<D>(config: WechatRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  get<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  get<D>(configOrUrl: WechatRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.GET)
  }

  /**
   * head 请求
   */
  head<D>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  head<D>(config: WechatRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  head<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  head<D>(configOrUrl: WechatRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.HEAD)
  }

  /**
   * options 请求
   */
  options<D>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  options<D>(config: WechatRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  options<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  options<D>(configOrUrl: WechatRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.OPTIONS)
  }

  /**
   * delete 请求
   */
  delete<D>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  delete<D>(config: WechatRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  delete<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  delete<D>(configOrUrl: WechatRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.DELETE)
  }

  /**
   * post 请求
   */
  post<D>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  post<D>(config: WechatRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  post<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  post<D>(configOrUrl: WechatRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.POST)
  }

  /**
   * put 请求
   */
  put<D>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  put<D>(config: WechatRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  put<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  put<D>(configOrUrl: WechatRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.PUT)
  }

  /**
   * 具体实现
   */
  async request<D>(config: WechatRequestConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  async request<D>(config: WechatRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D>(config: WechatRequestConfig<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    let _config = merge({}, this.baseConfig, config) as WechatRequestConfig<UserConfig>
    try {
      _config = await this.interceptors?.request?.(_config) || _config
    }
    catch (error) {
      this.interceptors?.requestError?.(error)
      throw error
    }

    return new Promise((resolve, reject) => {
      wx.request({
        ..._config as RequestOption,
        success: async (response) => {
          const userResponse = await this.interceptors?.response?.({ config: _config, response }) as WechatResponse<D>
          resolve(userResponse || response)
        },
        fail: (error) => {
          if (error instanceof Error) {
            const requestError = new ResponseError(error.message, _config)
            this.interceptors?.responseError?.(requestError)
            throw requestError
          }

          reject(error)
        },
      })
    })
  }
}
