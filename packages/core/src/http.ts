import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import Qs from 'qs'
import merge from 'lodash-es/merge'
import { ContentTypeEnum, RequestMethodsEnum } from './shared'
import type { ResponseResult } from './shared'

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
 *  返回原生响应
 */
interface HttpRequestGetResponseConfig {
  getResponse: true
};

export type HttpRequestConfig<T extends object> = HttpRequestBaseConfig & T
/**
 * RequestConfig 配置( 去除 method 为了给具体请求函数使用 get / post ...)
 */
export type HttpRequestConfigWithoutMethod<T extends object> = Omit<HttpRequestBaseConfig, 'method'> & T

export type HttpRequestGetConfigWithoutMethod<T extends object> = Omit<HttpRequestBaseConfig, 'method' | 'data'> & T

interface ResponseError<CustomConfig extends object> {
  message?: string
  code?: string
  config: HttpRequestConfig<CustomConfig>
  request?: any
  response?: AxiosResponse<unknown, any>
}

/**
 * 拦截器
 */
export interface HttpRequestInterceptors<T extends object> {
  request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined
  responseError?: (error: ResponseError<T>) => (Promise<any> | any)
}
/**
 * 实现
 */
export class HttpRequest<CustomConfig extends object> {
  /**
   * @description axios 实例
   */
  private axiosInstance: AxiosInstance
  /**
   * @description 基础配置
   */
  private baseConfig: HttpRequestConfig<CustomConfig>

  /**
   *
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: HttpRequestConfig<CustomConfig>, interceptors?: HttpRequestInterceptors<CustomConfig>) {
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
      const value = await (request?.(config as HttpRequestConfig<CustomConfig>) || config)
      return value as InternalAxiosRequestConfig
    }, (e) => {
      requestError?.(e)
    })
    this.axiosInstance.interceptors.response.use((data) => {
      return (response?.(data) || data)
    }, ((error: ResponseError<HttpRequestConfig<CustomConfig>>) => {
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
      || (config.data && typeof config.data == 'object' && Object.keys(config.data.length))
      || config.method?.toUpperCase() === RequestMethodsEnum.GET
    ) {
      return config as HttpRequestConfig<CustomConfig>
    }
    return {
      ...config,
      data: Qs.stringify(config.data, { arrayFormat: 'brackets' }),
    } as HttpRequestConfig<CustomConfig>
  }

  /**
   * get 请求
   * @param config
   */
  get<D extends object>(config: HttpRequestGetConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  get<D extends object>(config: HttpRequestGetConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  get<D extends object>(config: HttpRequestGetConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'get' })
  }

  post<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  post<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  post<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'post' })
  }

  put<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  put<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  put<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'put' })
  }

  delete<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  delete<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  delete<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'delete' })
  }

  request<D extends object>(config: HttpRequestConfig<CustomConfig> & {
    getResponse: true
  }): Promise<AxiosResponse<ResponseResult<D>>>
  request<D extends object>(config: HttpRequestConfig<CustomConfig>): Promise<ResponseResult<D>>
  request<D extends object>(config: HttpRequestConfig<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    const _config = merge({}, this.baseConfig, this.formatFormData(config))
    return this.axiosInstance.request(_config)
  }
}
