import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import Qs from 'qs'
import merge from 'lodash.merge'
import {
  ContentTypeEnum,
  RequestMethodsEnum,
  isSimpleRequest,
} from './shared'
import type {
  DefaultResponseResult,
  DefaultUserConfig,
  GetResponseConfig,
  RequiredProperty,
  ResponseError,
} from './shared'

export * from './shared'

/**
 * RequestConfig 配置
 */
export interface HttpRequestBaseConfig extends AxiosRequestConfig {
  /**
   * @description 返回原生响应 AxiosResponse<T> 默认false
   */
  getResponse?: boolean
}
/**
 * 用户自定义请求配置(完整的配置，用于拦截器)
 */
export type HttpRequestConfig<T extends object> = HttpRequestBaseConfig & T

/**
 * 默认配置
 */
export type DefaultHttpRequestConfig<T extends object> =
  Omit<
    HttpRequestBaseConfig,
    'method' | 'url' | 'params' | 'data'
  > & T

/**
 * HttpRequestConfigWithoutMethod 配置
 * 去除 method 为了给具体请求函数使用 get / post ...
 */
export type HttpRequestConfigWithoutMethod<T extends object> =
  RequiredProperty<Omit<HttpRequestBaseConfig, 'method'>, 'url'> & T

/**
 * 简单请求 配置

 */
export type HttpRequestSimpleConfig<T extends object> =
 RequiredProperty<Omit<HttpRequestBaseConfig, 'method' | 'data'>, 'url'> & T

/**
 * 拦截器
 */
export interface HttpRequestInterceptors<T extends object> {
  request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined
  responseError?: (error: ResponseError<HttpRequestConfig<T>>) => (Promise<any> | any)
}

/**
 * 实现
 */
export class HttpRequest<
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
   * @description axios 实例
   */
  private axiosInstance: AxiosInstance
  /**
   * @description 基础配置
   */
  private baseConfig: DefaultHttpRequestConfig<UserConfig>
  /**
   *
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(
    options: DefaultHttpRequestConfig<UserConfig>,
    interceptors?: HttpRequestInterceptors<UserConfig>,
  ) {
    this.baseConfig = {
      ...options,
    }

    this.axiosInstance = axios.create(this.baseConfig)

    const {
      request,
      response,
      requestError,
      responseError,
    } = interceptors || {}

    this.axiosInstance.interceptors.request.use(async (config) => {
      const value = await (request?.(config as HttpRequestConfig<UserConfig>) || config)
      return value as InternalAxiosRequestConfig
    }, (e) => {
      requestError?.(e)
    })
    this.axiosInstance.interceptors.response.use((data) => {
      return (response?.(data) || data)
    }, ((error: ResponseError<HttpRequestConfig<UserConfig>>) => {
      return responseError?.(error) || Promise.reject(error)
    }) as any)
  }

  /**
   * 文件上传
   * @param config
   * @param params
   */
  uploadFile<T extends object = object>(config: AxiosRequestConfig, params: Record<string, any> = {}) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    }
    else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }
        formData.append(key, params.data![key])
      })
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
      },
    })
  }

  /**
   * 格式化 formdata
   * @param config
   */
  formatFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.baseConfig.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']
    if (
      (contentType !== ContentTypeEnum.FORM_URLENCODED)
      || (config.data && typeof config.data == 'object' && Object.keys(config.data).length)
      || config.method?.toUpperCase() === RequestMethodsEnum.GET
    ) {
      return config as HttpRequestConfig<UserConfig>
    }
    return {
      ...config,
      data: Qs.stringify(config.data, { arrayFormat: 'brackets' }),
    } as HttpRequestConfig<UserConfig>
  }

  /**
   * 创建请求
   */
  private createRequest<D>(
    configOrUrl: HttpRequestSimpleConfig<UserConfig> | HttpRequestConfigWithoutMethod<UserConfig> | string,
    dataOrParams: Record<string, any> = { },
    method: RequestMethodsEnum,
  ) {
    const config = typeof configOrUrl === 'string'
      ? {
          url: configOrUrl,
          [isSimpleRequest(method) ? 'params' : 'data']: dataOrParams,
        } as unknown as HttpRequestSimpleConfig<UserConfig>
      : configOrUrl
    return this.request<D>({ ...config, method })
  }

  /**
   * get 请求
   */
  get<D>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  get<D>(config: HttpRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  get<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  get<D>(configOrUrl: HttpRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.GET)
  }

  /**
   * head 请求
   */
  head<D>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  head<D>(config: HttpRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  head<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  head<D>(configOrUrl: HttpRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.HEAD)
  }

  /**
   * options 请求
   */
  options<D>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  options<D>(config: HttpRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  options<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  options<D>(configOrUrl: HttpRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.OPTIONS)
  }

  /**
   * delete 请求
   */
  delete<D>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  delete<D>(config: HttpRequestSimpleConfig<UserConfig> | string): Promise<UserResponseResult & D>
  delete<D>(url: string, params: Record<string, any>): Promise<UserResponseResult & D>
  delete<D>(configOrUrl: HttpRequestSimpleConfig<UserConfig> | string, params?: Record<string, any>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, params, RequestMethodsEnum.DELETE)
  }

  /**
   * post 请求
   */
  post<D>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  post<D>(config: HttpRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  post<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  post<D>(configOrUrl: HttpRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.POST)
  }

  /**
   * put 请求
   */
  put<D>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  put<D>(config: HttpRequestConfigWithoutMethod<UserConfig> | string): Promise<UserResponseResult & D>
  put<D>(url: string, data: Record<string, any>): Promise<UserResponseResult & D>
  put<D>(configOrUrl: HttpRequestConfigWithoutMethod<UserConfig> | string, data?: Record<string, any>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.createRequest<D>(configOrUrl, data, RequestMethodsEnum.PUT)
  }

  /**
   * 具体实现
   */
  async request<D>(config: HttpRequestConfig<UserConfig> & {
    getResponse: true
  }): Promise<AxiosResponse<UserResponseResult & D>>
  async request<D>(config: HttpRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  async request<D>(config: HttpRequestConfig<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    const _config = merge({}, this.baseConfig, this.formatFormData(config))
    return this.axiosInstance.request(_config)
  }
}
