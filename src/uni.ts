import { merge } from 'lodash-es'
import type { RequiredProperty, ResponseResult } from './shared'

type BaseResponse = string | object | ArrayBuffer

interface UniAppResponse<T extends BaseResponse = BaseResponse> extends UniApp.RequestSuccessCallbackResult {
  data: T
}
/**
 * 拦截器
 */
export interface UniRequestInterceptors<T extends object> {
  request?: (value: UniRequestConfig<T>) => UniRequestConfig<T> | Promise<UniRequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: { config: UniRequestConfig<T>, response: UniAppResponse }) => UniAppResponse | Promise<UniAppResponse>)
  responseError?: (error: any) => (Promise<any> | any)
}
/**
 * UniRequestBaseConfig 请求配置
 */
export interface UniRequestBaseConfig extends Partial<UniNamespace.RequestOptions> {
  /**
   * 公共url
   */
  baseUrl?: string
  /**
   * get 请求参数
   */
  params?: any
  /**
   * 返回原生响应 UniAppResponse<T> 默认false
   */
  getResponse?: boolean
  /**
   * 忽略 loading 提示
   */
  ignoreLoading?: boolean
}

/**
 *  返回原生响应 UniAppResponse<T>
 */
interface UniRequestGetResponseConfig {
  getResponse: true
};

/**
 * 用户自定义请求配置
 */
export type UniRequestConfig<T extends object> = UniRequestBaseConfig & T

/**
 * 用户自定义请求配置
 */
type UniRequestConfigWithoutMethod<T extends object> =
RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T

/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type UniRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T
/**
 * 实现
 */
export class UniRequest<T extends object> {
  /**
   * 基础配置
   */
  private baseConfig: UniRequestConfig<T>
  /**
   * 拦截器
   */
  private interceptors?: UniRequestInterceptors<T>
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: UniRequestConfig<T>, interceptors?: UniRequestInterceptors<T>) {
    this.baseConfig = {
      ...options,
    }
    this.interceptors = interceptors
  }

  get<D extends object>(config: UniRequestGetConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>
  get<D extends object>(config: UniRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  get<D extends object>(config: UniRequestGetConfigWithoutMethod<T>): Promise<UniAppResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'GET' })
  }

  post<D extends object>(config: UniRequestConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>
  post<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  post<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<UniAppResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'POST' })
  }

  put<D extends object>(config: UniRequestConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>
  put<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  put<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<UniAppResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<D extends object>(config: UniRequestConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>
  delete<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>
  delete<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<UniAppResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async request<D extends object>(config: UniRequestConfig<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>
  async request<D extends object>(config: UniRequestConfig<T>): Promise<ResponseResult<D>>
  async request<D extends object>(config: UniRequestConfig<T>): Promise<UniAppResponse<D> | ResponseResult<D>> {
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
      const response = await uni.request(_config as UniNamespace.RequestOptions) as UniAppResponse<D>
      const userResponse = await this.interceptors?.response?.({ config: _config, response }) as UniAppResponse<D>
      return userResponse || response
    }
    catch (error) {
      this.interceptors?.responseError?.(error)
      throw error
    }
  }
}

export default UniRequest
