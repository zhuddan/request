/**
 * @description 请求方法
 */
export enum RequestMethodsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

/**
 * 响应数据类型
 */
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

/**
 * 默认响应数据结构（服务器返回数据）
 */
export interface DefaultResponseResult {}

/**
 *  默认请求配置
 */
export interface DefaultUserConfig {}

/**
 * 错误类
 */
export class ResponseError<T> extends Error {
  /**
   * 兼容微信小程序的错误格式
   */
  public errMsg?: string
  /**
   * 兼容开发者服务器的错误格式
   */
  public msg?: string
  constructor(
    public message: string,
    public config?: T,
  ) {
    super(message)
  }

  get errorMessage(): string {
    return this.message || this.errMsg || this.msg || '未知错误'
  }
}

/**
 * 基础响应类型
 */
export type BaseResponse = string | object | ArrayBuffer

/**
 * 请求配置
 */
export interface BaseConfig {
  /**
   * 公共url
   */
  baseURL?: string
  /**
   * 简单请求参数(get/header/options) 请求参数
   *
   * ps 由于小程序(uni/taro)的 参数方式都是 data 所以这里统一用 params 方便区分简单请求
   */
  params?: any
  /**
   * 返回原生响应  默认false
   */
  getResponse?: boolean
}

/**
 *  返回原生响应
 */
export interface GetResponseConfig {
  /**
   * 当 getResponse 为 true 时候返回的数据为携带http状态吗的原始请求响应
   * 一般用于获取二进制文件/下载之类的操作
   * 可以在默认配置中全局设置为true
   */
  getResponse: true
};

/**
 * 拦截器
 */
export interface BaseRequestInterceptors<RequestConfig, ResponseData> {
  /**
   * 拦截请求前 用于重写 config 例如设置 token 的操作
   */
  request?: (value: RequestConfig) => RequestConfig | Promise<RequestConfig>
  /**
   * 拦截请求前错误
   */
  requestError?: (error: any) => (Promise<any> | any)
  /**
   * 拦截响应 注意用于自定义错误拦截
   */
  response?: ((value: { config: RequestConfig, response: ResponseData }) => ResponseData | Promise<ResponseData>)
  /**
   * 拦截响应错误
   */
  responseError?: (error: ResponseError<RequestConfig>) => (Promise<any> | any)
}

/**
 * 帮助函数
 */
export type RequiredProperty<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
