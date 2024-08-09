import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import merge from 'lodash-es/merge'
import Qs from 'qs'
import type { ResponseResult } from './shared'
import { ContentTypeEnum, RequestMethodsEnum } from './shared'

/**
 * 拦截器
 */
export interface RequestInterceptors<T extends object> {
  request?: (value: RequestConfig<T>) => RequestConfig<T> | Promise<RequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined
  responseError?: (error: any) => (Promise<any> | any)
}
/**
 * RequestConfig 配置
 */
export interface RequestBaseConfig extends AxiosRequestConfig {
  /**
   * @description 返回原生响应 AxiosResponse<T> 默认false
   */
  getResponse?: boolean
}

interface BaseRequestGetResponseConfig {
  getResponse: true
};

export type RequestConfig<T extends object> = RequestBaseConfig & T
/**
 * RequestConfig 配置( 去除 method 为了给具体请求函数使用 get / post ...)
 */
export type RequestConfigWithoutMethod<T extends object> = Omit<RequestBaseConfig, 'method'> & T
export type RequestGetConfigWithoutMethod<T extends object> = Omit<RequestBaseConfig, 'method' | 'data'> & T
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
  private baseConfig: RequestConfig<CustomConfig>

  /**
   *
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options: RequestConfig<CustomConfig>, interceptors?: RequestInterceptors<CustomConfig>) {
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
      const value = await (request?.(config as RequestConfig<CustomConfig>) || config)
      return value as InternalAxiosRequestConfig
    }, requestError)

    this.axiosInstance.interceptors.response.use((data) => {
      return (response?.(data) || data)
    }, (error) => {
      return responseError?.(error) || Promise.reject(error)
    })
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
      return config as RequestConfig<CustomConfig>
    }
    return {
      ...config,
      data: Qs.stringify(config.data, { arrayFormat: 'brackets' }),
    } as RequestConfig<CustomConfig>
  }

  /**
   * get 请求
   * @param config
   */
  get<D extends object>(config: RequestGetConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  get<D extends object>(config: RequestGetConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  get<D extends object>(config: RequestGetConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'get' })
  }

  post<D extends object>(config: RequestConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  post<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  post<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'post' })
  }

  put<D extends object>(config: RequestConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  put<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  put<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'put' })
  }

  delete<D extends object>(config: RequestConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>
  delete<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>
  delete<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    return this.request({ ...config, method: 'delete' })
  }

  request<D extends object>(config: RequestConfig<CustomConfig> & {
    getResponse: true
  }): Promise<AxiosResponse<ResponseResult<D>>>
  request<D extends object>(config: RequestConfig<CustomConfig>): Promise<ResponseResult<D>>
  request<D extends object>(config: RequestConfig<CustomConfig>): Promise<AxiosResponse<D> | ResponseResult<D>> {
    const _config = merge({}, this.baseConfig, this.formatFormData(config))
    return this.axiosInstance.request(_config)
  }
}

export default HttpRequest
