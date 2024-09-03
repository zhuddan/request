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

export { ContentTypeEnum as C, RequestMethodsEnum as R, type ResponseResult as a, type RequiredProperty as b };
