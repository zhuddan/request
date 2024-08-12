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
type ResponseResult<T extends object = object> = {
    code: number;
    status: number;
    msg: string;
    message: string;
} & T;
type RequiredProperty<T, K extends keyof T> = T & Required<Pick<T, K>>;
/**
 * Simple object check.
 * @param item
 */
declare function isObjectOrArray(item: unknown): item is Array<any> | Record<any, any>;
/**
 * 对象合并
 * @param object
 * @param source
 */
declare function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
declare function merge<TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2;
declare function merge<TObject, TSource1, TSource2, TSource3>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3): TObject & TSource1 & TSource2 & TSource3;
declare function merge<TObject, TSource1, TSource2, TSource3, TSource4>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, source4: TSource4): TObject & TSource1 & TSource2 & TSource3 & TSource4;
declare function merge(object: any, ...otherArgs: any[]): any;

export { ContentTypeEnum, RequestMethodsEnum, type RequiredProperty, type ResponseResult, isObjectOrArray, merge };
