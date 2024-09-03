import type { RequiredProperty, ResponseResult } from './shared';
export * from './shared';
type BaseResponse = string | object | ArrayBuffer;
interface UniAppResponse<T extends BaseResponse = BaseResponse> extends UniApp.RequestSuccessCallbackResult {
    data: T;
}
/**
 * UniRequestBaseConfig 请求配置
 */
export interface UniRequestBaseConfig extends Partial<UniNamespace.RequestOptions> {
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
 *  返回原生响应
 */
interface UniRequestGetResponseConfig {
    getResponse: true;
}
/**
 * 用户自定义请求配置
 */
export type UniRequestConfig<T extends object> = UniRequestBaseConfig & T;
/**
 * 用户自定义请求配置
 */
type UniRequestConfigWithoutMethod<T extends object> = RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T;
/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type UniRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<UniRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T;
/**
 * 拦截器
 */
export interface UniRequestInterceptors<T extends object> {
    request?: (value: UniRequestConfig<T>) => UniRequestConfig<T> | Promise<UniRequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: {
        config: UniRequestConfig<T>;
        response: UniAppResponse;
    }) => UniAppResponse | Promise<UniAppResponse>);
    responseError?: (error: any) => (Promise<any> | any);
}
/**
 * 实现
 */
export declare class UniRequest<T extends object> {
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
    constructor(options: UniRequestConfig<T>, interceptors?: UniRequestInterceptors<T>);
    get<D extends object>(config: UniRequestGetConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    get<D extends object>(config: UniRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    post<D extends object>(config: UniRequestConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    post<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    put<D extends object>(config: UniRequestConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    put<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    delete<D extends object>(config: UniRequestConfigWithoutMethod<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    delete<D extends object>(config: UniRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    request<D extends object>(config: UniRequestConfig<T> & UniRequestGetResponseConfig): Promise<UniAppResponse<ResponseResult<D>>>;
    request<D extends object>(config: UniRequestConfig<T>): Promise<ResponseResult<D>>;
}
