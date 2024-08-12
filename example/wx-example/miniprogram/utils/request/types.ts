export interface HttpRequestUserConfig {
  /**
   * @description 是否需要token
   */
  withToken?: boolean
  /**
   * 是否提示 错误信息
   */
  showErrorMsg?: boolean
}
/**
 * token key
 */
export const tokenKey = 'Authorization'
/**
 * token 前缀
 */
export const tokenKeyScheme = 'Bearer'
