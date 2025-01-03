import type {

  DefaultHttpRequestConfig,
  HttpRequestConfigWithoutMethod,
  HttpRequestSimpleConfig,
} from './http'

interface TestConfig {
  /**
   * @description 是否需要token
   */
  withToken?: boolean
  /**
   * 是否提示 错误信息
   */
  showErrorMsg?: boolean
  /**
   * 是否需要签名加密
   */
  sign?: boolean
}
const _default_config_1: DefaultHttpRequestConfig<TestConfig> = {
  baseURL: '',
  timeout: 60 * 1000,
  headers: {
    'Content-Type': '',
  },
  getResponse: false,
  withToken: true,
  showErrorMsg: true,
}

const _default_config_2: DefaultHttpRequestConfig<TestConfig> = {
  // @ts-expect-error: `method` is not allowed in DefaultHttpRequestConfig
  method: 'get',
}

const _default_config_3: DefaultHttpRequestConfig<TestConfig> = {
  // @ts-expect-error: `url` is not allowed in DefaultHttpRequestConfig
  url: 'url',
}

const _default_config_4: DefaultHttpRequestConfig<TestConfig> = {
  // @ts-expect-error: `params` is not allowed in DefaultHttpRequestConfig
  params: 'params',
}

const _default_config_5: DefaultHttpRequestConfig<TestConfig> = {
  // @ts-expect-error: `data` is not allowed in DefaultHttpRequestConfig
  data: 'data',
}

const _without_method_config_1: HttpRequestConfigWithoutMethod<TestConfig> = {
  url: 'url',
}

// @ts-expect-error: `url` is allowed in HttpRequestConfigWithoutMethod
const _without_method_config_2: HttpRequestConfigWithoutMethod<TestConfig> = {

}

const _simple_config_config_1: HttpRequestSimpleConfig<TestConfig> = {
  url: 'url',
}

// @ts-expect-error: `url` is allowed in HttpRequestSimpleConfig
const _simple_config_config_2: HttpRequestSimpleConfig<TestConfig> = {

}

const _simple_config_config_3: HttpRequestSimpleConfig<TestConfig> = {
  // @ts-expect-error: `data` is allowed in HttpRequestSimpleConfig
  data: '',
}

const _simple_config_config_4: HttpRequestSimpleConfig<TestConfig> = {
  // @ts-expect-error: `method` is allowed in HttpRequestSimpleConfig
  method: '',
}
