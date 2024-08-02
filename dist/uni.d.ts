import { ResponseResult, RequiredProperty } from './shared';

type BaseResponse = string | object | ArrayBuffer;
interface UniAppResponse<T extends BaseResponse = BaseResponse> extends UniApp.RequestSuccessCallbackResult {
    data: T;
}
/**
 * 拦截器
 */
interface HttpRequestInterceptors<T extends object> {
    request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: {
        config: HttpRequestConfig<T>;
        response: UniAppResponse;
    }) => UniAppResponse | Promise<UniAppResponse>);
    responseError?: (error: any) => (Promise<any> | any);
}
/**
 * HttpRequest 请求配置
 */
interface HttpBaseRequestConfig extends Partial<UniNamespace.RequestOptions> {
    /**
     * 公共url
     */
    baseUrl?: string;
    /**
     * get 请求参数
     */
    params?: any;
    /**
     * 返回原生响应 UniAppResponse<T> 默认false
     */
    getResponse?: boolean;
    /**
     * 忽略 loading 提示
     */
    ignoreLoading?: boolean;
}
/**
 *  返回原生响应 UniAppResponse<T>
 */
interface HttpBaseRequestGetResponseConfig {
    getResponse: true;
}
/**
 * 用户自定义请求配置
 */
type HttpRequestConfig<T extends object> = HttpBaseRequestConfig & T;
/**
 * 用户自定义请求配置
 */
type HttpRequestConfigWithoutMethod<T extends object> = RequiredProperty<Omit<HttpBaseRequestConfig, 'method'>, 'url'> & T;
/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type HttpRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<HttpBaseRequestConfig, 'method' | 'data'>, 'url'> & T;
/**
 * 实现
 */
declare class HttpRequest<T extends object> {
    /**
     * 基础配置
     */
    private baseConfig;
    /**
     * 拦截器
     */
    private interceptors?;
    /**
     * @param options 基础配置
     * @param interceptors 拦截器
     */
    constructor(options: HttpRequestConfig<T>, interceptors?: HttpRequestInterceptors<T>);
    get<D extends object>(config: HttpRequestGetConfigWithoutMethod<T> & HttpBaseRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    get<D extends object>(config: HttpRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    post<D extends object>(config: HttpRequestConfigWithoutMethod<T> & HttpBaseRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    post<D extends object>(config: HttpRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    put<D extends object>(config: HttpRequestConfigWithoutMethod<T> & HttpBaseRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    put<D extends object>(config: HttpRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    delete<D extends object>(config: HttpRequestConfigWithoutMethod<T> & HttpBaseRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    delete<D extends object>(config: HttpRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    request<D extends object>(config: HttpRequestConfig<T> & HttpBaseRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    request<D extends object>(config: HttpRequestConfig<T>): Promise<ResponseResult<D>>;
}

export { type HttpBaseRequestConfig, HttpRequest, type HttpRequestConfig, type HttpRequestInterceptors };
