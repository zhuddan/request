import { AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * @description 请求方法
 */
declare enum RequestMethodsEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
/**
 * @description headers ContentType
 */
declare enum ContentTypeEnum {
    JSON = "application/json;charset=UTF-8",
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    FORM_DATA = "multipart/form-data;charset=UTF-8"
}
/**
 * 拦截器
 */
interface RequestInterceptors<T extends object> {
    request?: (value: RequestConfig<T>) => RequestConfig<T> | Promise<RequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined;
    responseError?: (error: any) => (Promise<any> | any);
}
/**
 * RequestConfig 配置
 */
interface RequestBaseConfig extends AxiosRequestConfig {
    /**
     * @description 返回原生响应 AxiosResponse<T> 默认false
     */
    getResponse?: boolean;
}
interface BaseRequestGetResponseConfig {
    getResponse: true;
}
type ResponseResult<T extends object = object> = {
    code: number;
    status: number;
    msg: string;
    message: string;
} & T;
type RequestConfig<T extends object> = RequestBaseConfig & T;
/**
 * RequestConfig 配置( 去除 method 为了给具体请求函数使用 get / post ...)
 */
type RequestConfigWithoutMethod<T extends object> = Omit<RequestBaseConfig, 'method'> & T;
type RequestGetConfigWithoutMethod<T extends object> = Omit<RequestBaseConfig, 'method' | 'data'> & T;
/**
 * 实现
 */
declare class Request<CustomConfig extends object> {
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
    constructor(options: RequestConfig<CustomConfig>, interceptors?: RequestInterceptors<CustomConfig>);
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
    formatFormData(config: AxiosRequestConfig): RequestConfig<CustomConfig>;
    /**
     * get 请求
     * @param config
     */
    get<D extends object>(config: RequestGetConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    get<D extends object>(config: RequestGetConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    post<D extends object>(config: RequestConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    post<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    put<D extends object>(config: RequestConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    put<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    delete<D extends object>(config: RequestConfigWithoutMethod<CustomConfig> & BaseRequestGetResponseConfig): Promise<AxiosResponse<ResponseResult<D>>>;
    delete<D extends object>(config: RequestConfigWithoutMethod<CustomConfig>): Promise<ResponseResult<D>>;
    request<D extends object>(config: RequestConfig<CustomConfig> & {
        getResponse: true;
    }): Promise<AxiosResponse<ResponseResult<D>>>;
    request<D extends object>(config: RequestConfig<CustomConfig>): Promise<ResponseResult<D>>;
}

export { ContentTypeEnum, Request, type RequestBaseConfig, type RequestConfig, type RequestConfigWithoutMethod, type RequestGetConfigWithoutMethod, type RequestInterceptors, RequestMethodsEnum, type ResponseResult };
