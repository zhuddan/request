import type {
  DefaultUniRequestConfig,
  UniRequestConfigWithoutMethod,
  UniRequestSimpleConfig,
} from './uni'

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
const _default_config_1: DefaultUniRequestConfig<TestConfig> = {
  baseURL: '',
  timeout: 60 * 1000,
  header: {
    'Content-Type': '',
  },
  getResponse: false,
  withToken: true,
  showErrorMsg: true,
}

const _default_config_2: DefaultUniRequestConfig<TestConfig> = {
  // @ts-expect-error: `method` is not allowed in DefaultUniRequestConfig
  method: 'get',
}

const _default_config_3: DefaultUniRequestConfig<TestConfig> = {
  // @ts-expect-error: `url` is not allowed in DefaultUniRequestConfig
  url: 'url',
}

const _default_config_4: DefaultUniRequestConfig<TestConfig> = {
  // @ts-expect-error: `params` is not allowed in DefaultUniRequestConfig
  params: 'params',
}

const _default_config_5: DefaultUniRequestConfig<TestConfig> = {
  // @ts-expect-error: `data` is not allowed in DefaultUniRequestConfig
  data: 'data',
}

const _without_method_config_1: UniRequestConfigWithoutMethod<TestConfig> = {
  url: 'url',
}

// @ts-expect-error: `url` is allowed in UniRequestConfigWithoutMethod
const _without_method_config_2: UniRequestConfigWithoutMethod<TestConfig> = {

}

const _simple_config_config_1: UniRequestSimpleConfig<TestConfig> = {
  url: 'url',
}

// @ts-expect-error: `url` is allowed in UniRequestSimpleConfig
const _simple_config_config_2: UniRequestSimpleConfig<TestConfig> = {

}

const _simple_config_config_3: UniRequestSimpleConfig<TestConfig> = {
  // @ts-expect-error: `data` is allowed in UniRequestSimpleConfig
  data: '',
}

const _simple_config_config_4: UniRequestSimpleConfig<TestConfig> = {
  // @ts-expect-error: `method` is allowed in UniRequestSimpleConfig
  method: '',
}
