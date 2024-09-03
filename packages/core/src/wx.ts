import merge from 'lodash-es/merge'
import type { RequiredProperty, ResponseResult } from './shared'

export * from './shared'

type BaseResponse = string | object | ArrayBuffer

interface WechatResponse<T extends BaseResponse = BaseResponse> extends WechatMiniprogram.RequestSuccessCallbackResult {
  data: T
}
/**
 * 拦截器
 */
export interface WechatRequestInterceptors<T extends object> {
  request?: (value: WechatRequestConfig<T>) => WechatRequestConfig<T> | Promise<WechatRequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: { config: WechatRequestConfig<T>, response: WechatResponse }) => WechatResponse | Promise< WechatResponse>)
  responseError?: (error: any, config: WechatRequestConfig<T>) => (Promise<any> | any)
}
/**
 * RequestBaseConfig 请求配置
 */
export interface WechatRequestBaseConfig extends Partial<Omit<WechatMiniprogram.RequestOption, 'success' | 'fail' | 'complete'>> {
  /**
   * 公共url
   */
  baseUrl?: string
  /**
   * get 请求参数
   */
  params?: any
  /**
   * 返回原生响应 AppResponse<T> 默认false
   */
  getResponse?: boolean
  /**
   * 忽略 loading 提示
   */
  ignoreLoading?: boolean
}

/**
 *  返回原生响应 AppResponse<T>
 */
interface WechatRequestGetResponseConfig {
  getResponse: true
};

/**
 * 用户自定义请求配置
 */
export type WechatRequestConfig<T extends object> = WechatRequestBaseConfig & T

/**
 * 用户自定义请求配置
 */
type WechatRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T

/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type WechatRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T
/**
 * 实现
 */
export class WxRequest<T extends object> {
  /**
   * 基础配置
   */
  private baseConfig: WechatRequestConfig<T>
  /**
   * 拦截器
   */
  private interceptors?: WechatRequestInterceptors<T>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: WechatRequestConfig<T>, interceptors?: WechatRequestInterceptors<T>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  get<D extends object>(config: WechatRequestGetConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise< WechatResponse<ResponseResult<D>>>
  get<D extends object>(config: WechatRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  get<D extends object>(config: WechatRequestGetConfigWithoutMethod<T>): Promise< WechatResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: WechatRequestConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise< WechatResponse<ResponseResult<D>>>
  post<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  post<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise< WechatResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: WechatRequestConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise< WechatResponse<ResponseResult<D>>>
  put<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  put<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise< WechatResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: WechatRequestConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise< WechatResponse<ResponseResult<D>>>
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  delete<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise< WechatResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: WechatRequestConfig<T> & WechatRequestGetResponseConfig): Promise< WechatResponse<ResponseResult<D>>>
  async request<D extends object>(config: WechatRequestConfig<T>): Promise<ResponseResult<D>>
  async request<D extends object>(config: WechatRequestConfig<T>): Promise< WechatResponse<D> | ResponseResult<D>> {
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
        ..._config as WechatMiniprogram.RequestOption,
        success: async (response) => {
          const userResponse = await this.interceptors?.response?.({ config: _config, response }) as WechatResponse<D>
          resolve(userResponse || response)
        },
        fail: (error) => {
          this.interceptors?.responseError?.(error, _config)
          reject(error)
        },
      })
    })
  }
}
