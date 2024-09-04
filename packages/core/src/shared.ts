/**
 * @description 请求方法
 */
export enum RequestMethodsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description headers ContentType
 */
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export type ResponseResult<T extends object = object> = {
  code: number
  status: number
  msg: string
  message: string
} & T

export type RequiredProperty<T, K extends keyof T> = T & Required<Pick<T, K>>

export class ResponseError<T> extends Error {
  public errMsg?: string
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
