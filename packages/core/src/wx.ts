import merge from 'lodash.merge'
import type { BaseConfig, BaseRequestInterceptors, BaseResponse, DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty } from './shared'
import { ResponseError } from './shared'

export * from './shared'

type RequestOption = WechatMiniprogram.RequestOption

interface WechatResponse<T extends BaseResponse = BaseResponse> extends WechatMiniprogram.RequestSuccessCallbackResult {
  data: T
}

/**
 * 基础配置
 */
export interface WechatRequestBaseConfig extends Partial<Omit<RequestOption, 'success' | 'fail' | 'complete'>>, BaseConfig {}
/**
 * 用户自定义请求配置
 */
export type WechatRequestConfig<T extends object> = WechatRequestBaseConfig & T
/**
 * 用户自定义请求配置  (去除 method baseUrl)
 */
type WechatRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T
/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type WechatRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T
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
  private baseConfig: WechatRequestConfig<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: WechatRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: WechatRequestConfig<UserConfig>, interceptors?: WechatRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  get<D extends object>(config: WechatRequestGetConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  get<D extends object>(config: WechatRequestGetConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  get<D extends object>(config: WechatRequestGetConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  post<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  post<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  put<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  put<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: WechatRequestConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  async request<D extends object>(config: WechatRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D extends object>(config: WechatRequestConfig<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    let _config = merge({}, this.baseConfig, config)
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
