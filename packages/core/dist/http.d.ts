import { a as ResponseResult } from './shared.d-l6eAR4hM.js';
export { C as ContentTypeEnum, R as RequestMethodsEnum, b as RequiredProperty } from './shared.d-l6eAR4hM.js';

// TypeScript Version: 4.7
type AxiosHeaderValue = AxiosHeaders | string | string[] | number | boolean | null;

interface RawAxiosHeaders {
  [key: string]: AxiosHeaderValue;
}

type MethodsHeaders = Partial<{
  [Key in Method as Lowercase<Key>]: AxiosHeaders;
} & {common: AxiosHeaders}>;

type AxiosHeaderMatcher = string | RegExp | ((this: AxiosHeaders, value: string, name: string) => boolean);

type AxiosHeaderParser = (this: AxiosHeaders, value: AxiosHeaderValue, header: string) => any;

declare class AxiosHeaders {
  constructor(
      headers?: RawAxiosHeaders | AxiosHeaders | string
  );

  [key: string]: any;

  set(headerName?: string, value?: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  set(headers?: RawAxiosHeaders | AxiosHeaders | string, rewrite?: boolean): AxiosHeaders;

  get(headerName: string, parser: RegExp): RegExpExecArray | null;
  get(headerName: string, matcher?: true | AxiosHeaderParser): AxiosHeaderValue;

  has(header: string, matcher?: AxiosHeaderMatcher): boolean;

  delete(header: string | string[], matcher?: AxiosHeaderMatcher): boolean;

  clear(matcher?: AxiosHeaderMatcher): boolean;

  normalize(format: boolean): AxiosHeaders;

  concat(...targets: Array<AxiosHeaders | RawAxiosHeaders | string | undefined | null>): AxiosHeaders;

  toJSON(asStrings?: boolean): RawAxiosHeaders;

  static from(thing?: AxiosHeaders | RawAxiosHeaders | string): AxiosHeaders;

  static accessor(header: string | string[]): AxiosHeaders;

  static concat(...targets: Array<AxiosHeaders | RawAxiosHeaders | string | undefined | null>): AxiosHeaders;

  setContentType(value: ContentType, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getContentType(parser?: RegExp): RegExpExecArray | null;
  getContentType(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasContentType(matcher?: AxiosHeaderMatcher): boolean;

  setContentLength(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getContentLength(parser?: RegExp): RegExpExecArray | null;
  getContentLength(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasContentLength(matcher?: AxiosHeaderMatcher): boolean;

  setAccept(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getAccept(parser?: RegExp): RegExpExecArray | null;
  getAccept(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasAccept(matcher?: AxiosHeaderMatcher): boolean;

  setUserAgent(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getUserAgent(parser?: RegExp): RegExpExecArray | null;
  getUserAgent(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasUserAgent(matcher?: AxiosHeaderMatcher): boolean;

  setContentEncoding(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getContentEncoding(parser?: RegExp): RegExpExecArray | null;
  getContentEncoding(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasContentEncoding(matcher?: AxiosHeaderMatcher): boolean;

  setAuthorization(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getAuthorization(parser?: RegExp): RegExpExecArray | null;
  getAuthorization(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasAuthorization(matcher?: AxiosHeaderMatcher): boolean;

  [Symbol.iterator](): IterableIterator<[string, AxiosHeaderValue]>;
}

type CommonRequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization';

type ContentType = AxiosHeaderValue | 'text/html' | 'text/plain' | 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded' | 'application/octet-stream';

type RawAxiosRequestHeaders = Partial<RawAxiosHeaders & {
  [Key in CommonRequestHeadersList]: AxiosHeaderValue;
} & {
  'Content-Type': ContentType
}>;

type AxiosRequestHeaders = RawAxiosRequestHeaders & AxiosHeaders;

type CommonResponseHeadersList = 'Server' | 'Content-Type' | 'Content-Length' | 'Cache-Control'| 'Content-Encoding';

type RawCommonResponseHeaders = {
  [Key in CommonResponseHeadersList]: AxiosHeaderValue;
} & {
  "set-cookie": string[];
};

type RawAxiosResponseHeaders = Partial<RawAxiosHeaders & RawCommonResponseHeaders>;

type AxiosResponseHeaders = RawAxiosResponseHeaders & AxiosHeaders;

interface AxiosRequestTransformer {
  (this: InternalAxiosRequestConfig, data: any, headers: AxiosRequestHeaders): any;
}

interface AxiosResponseTransformer {
  (this: InternalAxiosRequestConfig, data: any, headers: AxiosResponseHeaders, status?: number): any;
}

interface AxiosAdapter {
  (config: InternalAxiosRequestConfig): AxiosPromise;
}

interface AxiosBasicCredentials {
  username: string;
  password: string;
}

interface AxiosProxyConfig {
  host: string;
  port: number;
  auth?: AxiosBasicCredentials;
  protocol?: string;
}

declare enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'
    | 'formdata';

type responseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';

interface TransitionalOptions {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
}

interface GenericAbortSignal {
  readonly aborted: boolean;
  onabort?: ((...args: any) => any) | null;
  addEventListener?: (...args: any) => any;
  removeEventListener?: (...args: any) => any;
}

interface FormDataVisitorHelpers {
  defaultVisitor: SerializerVisitor;
  convertValue: (value: any) => any;
  isVisitable: (value: any) => boolean;
}

interface SerializerVisitor {
  (
      this: GenericFormData,
      value: any,
      key: string | number,
      path: null | Array<string | number>,
      helpers: FormDataVisitorHelpers
  ): boolean;
}

interface SerializerOptions {
  visitor?: SerializerVisitor;
  dots?: boolean;
  metaTokens?: boolean;
  indexes?: boolean | null;
}

// tslint:disable-next-line
interface FormSerializerOptions extends SerializerOptions {
}

interface ParamEncoder {
  (value: any, defaultEncoder: (value: any) => any): any;
}

interface CustomParamsSerializer {
  (params: Record<string, any>, options?: ParamsSerializerOptions): string;
}

interface ParamsSerializerOptions extends SerializerOptions {
  encode?: ParamEncoder;
  serialize?: CustomParamsSerializer;
}

type MaxUploadRate = number;

type MaxDownloadRate = number;

type BrowserProgressEvent = any;

interface AxiosProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
  event?: BrowserProgressEvent;
  lengthComputable: boolean;
}

type Milliseconds = number;

type AxiosAdapterName = 'fetch' | 'xhr' | 'http' | string;

type AxiosAdapterConfig = AxiosAdapter | AxiosAdapterName;

type AddressFamily = 4 | 6 | undefined;

interface LookupAddressEntry {
  address: string;
  family?: AddressFamily;
}

type LookupAddress = string | LookupAddressEntry;

interface AxiosRequestConfig<D = any> {
  url?: string;
  method?: Method | string;
  baseURL?: string;
  transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
  transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
  headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
  params?: any;
  paramsSerializer?: ParamsSerializerOptions | CustomParamsSerializer;
  data?: D;
  timeout?: Milliseconds;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: AxiosAdapterConfig | AxiosAdapterConfig[];
  auth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  maxRate?: number | [MaxUploadRate, MaxDownloadRate];
  beforeRedirect?: (options: Record<string, any>, responseDetails: {headers: Record<string, string>, statusCode: HttpStatusCode}) => void;
  socketPath?: string | null;
  transport?: any;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
  transitional?: TransitionalOptions;
  signal?: GenericAbortSignal;
  insecureHTTPParser?: boolean;
  env?: {
    FormData?: new (...args: any[]) => object;
  };
  formSerializer?: FormSerializerOptions;
  family?: AddressFamily;
  lookup?: ((hostname: string, options: object, cb: (err: Error | null, address: LookupAddress | LookupAddress[], family?: AddressFamily) => void) => void) |
      ((hostname: string, options: object) => Promise<[address: LookupAddressEntry | LookupAddressEntry[], family?: AddressFamily] | LookupAddress>);
  withXSRFToken?: boolean | ((config: InternalAxiosRequestConfig) => boolean | undefined);
  fetchOptions?: Record<string, any>;
}

interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders;
}

interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}

type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;

interface Cancel {
  message: string | undefined;
}

interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

interface GenericFormData {
  append(name: string, value: any, options?: any): any;
}

/**
 * RequestConfig 配置
 */
interface HttpRequestBaseConfig extends AxiosRequestConfig {
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
type HttpRequestConfig<T extends object> = HttpRequestBaseConfig & T;
/**
 * RequestConfig 配置( 去除 method 为了给具体请求函数使用 get / post ...)
 */
type HttpRequestConfigWithoutMethod<T extends object> = Omit<HttpRequestBaseConfig, 'method'> & T;
type HttpRequestGetConfigWithoutMethod<T extends object> = Omit<HttpRequestBaseConfig, 'method' | 'data'> & T;
interface ResponseError<CustomConfig extends object> {
    message?: string;
    code?: string;
    config: HttpRequestConfig<CustomConfig>;
    request?: any;
    response?: AxiosResponse<unknown, any>;
}
/**
 * 拦截器
 */
interface HttpRequestInterceptors<T extends object> {
    request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined;
    responseError?: (error: ResponseError<T>) => (Promise<any> | any);
}
/**
 * 实现
 */
declare class HttpRequest<CustomConfig extends object> {
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

export { HttpRequest, type HttpRequestBaseConfig, type HttpRequestConfig, type HttpRequestConfigWithoutMethod, type HttpRequestGetConfigWithoutMethod, type HttpRequestInterceptors, ResponseResult };
