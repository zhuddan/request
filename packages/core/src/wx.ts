import merge from 'lodash.merge'
import type { BaseConfig, BaseRequestInterceptors, BaseResponse, DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty } from './shared'
import { RequestMethodsEnum, ResponseError } from './shared'

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
  private baseConfig: WechatRequestConfigWithoutMethod<UserConfig>
  /**
   * 拦截器
   */
  private interceptors?: WechatRequestInterceptors<UserConfig>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: WechatRequestConfigWithoutMethod<UserConfig>, interceptors?: WechatRequestInterceptors<UserConfig>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  /**
   * get 请求
   * @param config
   */
  get<D extends object>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  get<D extends object>(config: WechatRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  get<D extends object>(config: WechatRequestSimpleConfig<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.GET })
  }

  /**
   * header 请求
   * @param config
   */
  header<D extends object>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  header<D extends object>(config: WechatRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  header<D extends object>(config: WechatRequestSimpleConfig<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.HEAD })
  }

  /**
   * options 请求
   * @param config
   */
  options<D extends object>(config: WechatRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  options<D extends object>(config: WechatRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  options<D extends object>(config: WechatRequestSimpleConfig<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.OPTIONS })
  }

  /**
   * post 请求
   * @param config
   */
  post<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  post<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  post<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.POST })
  }

  /**
   * put 请求
   * @param config
   */
  put<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  put<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  put<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.PUT })
  }

  /**
   * delete 请求
   * @param config
   */
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.DELETE })
  }

  async request<D extends object>(config: WechatRequestConfig<UserConfig> & GetResponseConfig): Promise< WechatResponse<UserResponseResult & D>>
  async request<D extends object>(config: WechatRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D extends object>(config: WechatRequestConfig<UserConfig>): Promise< WechatResponse<D> | UserResponseResult & D> {
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
