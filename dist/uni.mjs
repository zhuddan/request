import { merge } from 'lodash-es';

// src/uni.ts
var UniRequest = class {
  /**
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options, interceptors) {
    this.baseConfig = {
      ...options
    };
    this.interceptors = interceptors;
  }
  get(config) {
    return this.request({ ...config, method: "GET" });
  }
  post(config) {
    return this.request({ ...config, method: "POST" });
  }
  put(config) {
    return this.request({ ...config, method: "PUT" });
  }
  delete(config) {
    return this.request({ ...config, method: "DELETE" });
  }
  async request(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let _config = merge({}, this.baseConfig, config);
    try {
      _config = await ((_b = (_a = this.interceptors) == null ? void 0 : _a.request) == null ? void 0 : _b.call(_a, _config)) || _config;
    } catch (error) {
      console.log("interceptors?.requestError ", error);
      (_d = (_c = this.interceptors) == null ? void 0 : _c.requestError) == null ? void 0 : _d.call(_c, error);
      throw error;
    }
    try {
      const response = await uni.request(_config);
      const userResponse = await ((_f = (_e = this.interceptors) == null ? void 0 : _e.response) == null ? void 0 : _f.call(_e, { config: _config, response }));
      return userResponse || response;
    } catch (error) {
      (_h = (_g = this.interceptors) == null ? void 0 : _g.responseError) == null ? void 0 : _h.call(_g, error);
      throw error;
    }
  }
};

export { UniRequest };
