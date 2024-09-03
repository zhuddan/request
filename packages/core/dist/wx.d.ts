import { a as ResponseResult, b as RequiredProperty } from './shared.d-l6eAR4hM.js';
export { C as ContentTypeEnum, R as RequestMethodsEnum } from './shared.d-l6eAR4hM.js';

type BaseResponse = string | object | ArrayBuffer;
interface WechatResponse<T extends BaseResponse = BaseResponse> extends WechatMiniprogram.RequestSuccessCallbackResult {
    data: T;
}
/**
 * 拦截器
 */
interface WechatRequestInterceptors<T extends object> {
    request?: (value: WechatRequestConfig<T>) => WechatRequestConfig<T> | Promise<WechatRequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: {
        config: WechatRequestConfig<T>;
        response: WechatResponse;
    }) => WechatResponse | Promise<WechatResponse>);
    responseError?: (error: any, config: WechatRequestConfig<T>) => (Promise<any> | any);
}
/**
 * RequestBaseConfig 请求配置
 */
interface WechatRequestBaseConfig extends Partial<Omit<WechatMiniprogram.RequestOption, 'success' | 'fail' | 'complete'>> {
    /**
     * 公共url
     */
    baseUrl?: string;
    /**
     * get 请求参数
     */
    params?: any;
    /**
     * 返回原生响应 AppResponse<T> 默认false
     */
    getResponse?: boolean;
    /**
     * 忽略 loading 提示
     */
    ignoreLoading?: boolean;
}
/**
 *  返回原生响应 AppResponse<T>
 */
interface WechatRequestGetResponseConfig {
    getResponse: true;
}
/**
 * 用户自定义请求配置
 */
type WechatRequestConfig<T extends object> = WechatRequestBaseConfig & T;
/**
 * 用户自定义请求配置
 */
type WechatRequestConfigWithoutMethod<T extends object> = RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'baseUrl'>, 'url'> & T;
/**
 * 用户自定义 get 请求配置 get 请求参设置请使用 params 而不是 data
 */
type WechatRequestGetConfigWithoutMethod<T extends object> = RequiredProperty<Omit<WechatRequestBaseConfig, 'method' | 'baseUrl' | 'data'>, 'url'> & T;
/**
 * 实现
 */
declare class WxRequest<T extends object> {
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
    constructor(options: WechatRequestConfig<T>, interceptors?: WechatRequestInterceptors<T>);
    get<D extends object>(config: WechatRequestGetConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise<WechatResponse<ResponseResult<D>>>;
    get<D extends object>(config: WechatRequestGetConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    post<D extends object>(config: WechatRequestConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise<WechatResponse<ResponseResult<D>>>;
    post<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    put<D extends object>(config: WechatRequestConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise<WechatResponse<ResponseResult<D>>>;
    put<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    delete<D extends object>(config: WechatRequestConfigWithoutMethod<T> & WechatRequestGetResponseConfig): Promise<WechatResponse<ResponseResult<D>>>;
    delete<D extends object>(config: WechatRequestConfigWithoutMethod<T>): Promise<ResponseResult<D>>;
    request<D extends object>(config: WechatRequestConfig<T> & WechatRequestGetResponseConfig): Promise<WechatResponse<ResponseResult<D>>>;
    request<D extends object>(config: WechatRequestConfig<T>): Promise<ResponseResult<D>>;
}

export { RequiredProperty, ResponseResult, type WechatRequestBaseConfig, type WechatRequestConfig, type WechatRequestInterceptors, WxRequest };
