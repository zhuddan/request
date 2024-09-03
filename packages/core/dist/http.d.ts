import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ResponseResult } from './shared';
export * from './shared';
/**
 * RequestConfig 配置
 */
export interface HttpRequestBaseConfig extends AxiosRequestConfig {
    /**
     * @description 返回原生响应 AxiosResponse<T> 默认false
     */
    getResponse?: boolean;
}
/**
 *  返回原生响应
 */
interface HttpRequestGetResponseConfig {
    getResponse: true;
}
export type HttpRequestConfig<T extends object> = HttpRequestBaseConfig & T;
/**
 * RequestConfig 配置( 去除 method 为了给具体请求函数使用 get / post ...)
 */
export type HttpRequestConfigWithoutMethod<T extends object> = Omit<HttpRequestBaseConfig, 'method'> & T;
export type HttpRequestGetConfigWithoutMethod<T extends object> = Omit<HttpRequestBaseConfig, 'method' | 'data'> & T;
/**
 * 拦截器
 */
export interface HttpRequestInterceptors<T extends object> {
    request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined;
    responseError?: (error: any) => (Promise<any> | any);
}
/**
 * 实现
 */
export declare class HttpRequest<CustomConfig extends object> {
    /**
     * @description axios 实例
     */
    private axiosInstance;
    /**
     * @description 基础配置
     */
    private baseConfig;
    /**
     *
     * @param options 基础配置
     * @param interceptors 拦截器
     */
    constructor(options: HttpRequestConfig<CustomConfig>, interceptors?: HttpRequestInterceptors<CustomConfig>);
    /**
     * 文件上传
     * @param config
     * @param params
     */
    uploadFile<T extends object = object>(config: AxiosRequestConfig, params?: Record<string, any>): Promise<AxiosResponse<T, any>>;
    /**
     * 格式化 formdata
     * @param config
     */
    formatFormData(config: AxiosRequestConfig): HttpRequestConfig<CustomConfig>;
    /**
     * get 请求
     * @param config
     */
    get<D extends object>(config: HttpRequestGetConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    get<D extends object>(config: HttpRequestGetConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    post<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    post<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    put<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    put<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    delete<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig> & HttpRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    delete<D extends object>(config: HttpRequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    request<D extends object>(config: HttpRequestConfig<CustomConfig> & {
        getResponse: true;
    }): Promise<AxiosResponse<ResponseResult<D>>>;
    request<D extends object>(config: HttpRequestConfig<CustomConfig>): Promise<ResponseResult<D>>;
}
