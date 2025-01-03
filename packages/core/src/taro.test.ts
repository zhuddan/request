import type {

  DefaultTaroRequestConfig,
  TaroRequestConfigWithoutMethod,
  TaroRequestSimpleConfig,
} from './taro'

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
const _default_config_1: DefaultTaroRequestConfig<TestConfig> = {
  baseURL: '',
  timeout: 60 * 1000,
  header: {
    'Content-Type': '',
  },
  getResponse: false,
  withToken: true,
  showErrorMsg: true,
}

const _default_config_2: DefaultTaroRequestConfig<TestConfig> = {
  // @ts-expect-error: `method` is not allowed in DefaultTaroRequestConfig
  method: 'get',
}

const _default_config_3: DefaultTaroRequestConfig<TestConfig> = {
  // @ts-expect-error: `url` is not allowed in DefaultTaroRequestConfig
  url: 'url',
}

const _default_config_4: DefaultTaroRequestConfig<TestConfig> = {
  // @ts-expect-error: `params` is not allowed in DefaultTaroRequestConfig
  params: 'params',
}

const _default_config_5: DefaultTaroRequestConfig<TestConfig> = {
  // @ts-expect-error: `data` is not allowed in DefaultTaroRequestConfig
  data: 'data',
}

const _without_method_config_1: TaroRequestConfigWithoutMethod<TestConfig> = {
  url: 'url',
}

// @ts-expect-error: `url` is allowed in TaroRequestConfigWithoutMethod
const _without_method_config_2: TaroRequestConfigWithoutMethod<TestConfig> = {

}

const _simple_config_config_1: TaroRequestSimpleConfig<TestConfig> = {
  url: 'url',
}

// @ts-expect-error: `url` is allowed in TaroRequestSimpleConfig
const _simple_config_config_2: TaroRequestSimpleConfig<TestConfig> = {

}

const _simple_config_config_3: TaroRequestSimpleConfig<TestConfig> = {
  // @ts-expect-error: `data` is allowed in TaroRequestSimpleConfig
  data: '',
}

const _simple_config_config_4: TaroRequestSimpleConfig<TestConfig> = {
  // @ts-expect-error: `method` is allowed in TaroRequestSimpleConfig
  method: '',
}
