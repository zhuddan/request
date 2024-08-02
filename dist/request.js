'use strict';

var axios = require('axios');
var lodashEs = require('lodash-es');
var Qs = require('qs');
var shared = require('./shared');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var axios__default = /*#__PURE__*/_interopDefault(axios);
var Qs__default = /*#__PURE__*/_interopDefault(Qs);

// src/request.ts
var Request = class {
  /**
   *
   * @param options 基础配置
   * @param interceptors 拦截器
   */
  constructor(options, interceptors) {
    this.baseConfig = {
      ...options
    };
    this.axiosInstance = axios__default.default.create(this.baseConfig);
    const {
      request,
      response,
      requestError,
      responseError
    } = interceptors || {};
    this.axiosInstance.interceptors.request.use(async (config) => {
      const value = await ((request == null ? void 0 : request(config)) || config);
      return value;
    }, requestError);
    this.axiosInstance.interceptors.response.use((data) => {
      return (response == null ? void 0 : response(data)) || data;
    }, (error) => {
      return (responseError == null ? void 0 : responseError(error)) || Promise.reject(error);
    });
  }
  /**
   * 文件上传
   * @param config
   * @param params
   */
  uploadFile(config, params = {}) {
    const formData = new window.FormData();
    const customFilename = params.name || "file";
    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }
        formData.append(key, params.data[key]);
      });
    }
    return this.axiosInstance.request({
      ...config,
      method: "POST",
      data: formData,
      headers: {
        "Content-type": shared.ContentTypeEnum.FORM_DATA
      }
    });
  }
  /**
   * 格式化 formdata
   * @param config
   */
  formatFormData(config) {
    var _a;
    const headers = config.headers || this.baseConfig.headers;
    const contentType = (headers == null ? void 0 : headers["Content-Type"]) || (headers == null ? void 0 : headers["content-type"]);
    if (contentType !== shared.ContentTypeEnum.FORM_URLENCODED || config.data && typeof config.data == "object" && Object.keys(config.data.length) || ((_a = config.method) == null ? void 0 : _a.toUpperCase()) === shared.RequestMethodsEnum.GET) {
      return config;
    }
    return {
      ...config,
      data: Qs__default.default.stringify(config.data, { arrayFormat: "brackets" })
    };
  }
  get(config) {
    return this.request({ ...config, method: "get" });
  }
  post(config) {
    return this.request({ ...config, method: "post" });
  }
  put(config) {
    return this.request({ ...config, method: "put" });
  }
  delete(config) {
    return this.request({ ...config, method: "delete" });
  }
  request(config) {
    const _config = lodashEs.merge({}, this.baseConfig, this.formatFormData(config));
    return this.axiosInstance.request(_config);
  }
};

exports.Request = Request;
