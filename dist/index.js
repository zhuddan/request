"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ContentTypeEnum: () => ContentTypeEnum,
  Request: () => Request,
  RequestMethodsEnum: () => RequestMethodsEnum
});
module.exports = __toCommonJS(src_exports);
var import_axios = __toESM(require("axios"));
var import_lodash_es = require("lodash-es");
var import_qs = __toESM(require("qs"));
var RequestMethodsEnum = /* @__PURE__ */ ((RequestMethodsEnum2) => {
  RequestMethodsEnum2["GET"] = "GET";
  RequestMethodsEnum2["POST"] = "POST";
  RequestMethodsEnum2["PUT"] = "PUT";
  RequestMethodsEnum2["DELETE"] = "DELETE";
  return RequestMethodsEnum2;
})(RequestMethodsEnum || {});
var ContentTypeEnum = /* @__PURE__ */ ((ContentTypeEnum2) => {
  ContentTypeEnum2["JSON"] = "application/json;charset=UTF-8";
  ContentTypeEnum2["FORM_URLENCODED"] = "application/x-www-form-urlencoded;charset=UTF-8";
  ContentTypeEnum2["FORM_DATA"] = "multipart/form-data;charset=UTF-8";
  return ContentTypeEnum2;
})(ContentTypeEnum || {});
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
    this.axiosInstance = import_axios.default.create(this.baseConfig);
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
        "Content-type": "multipart/form-data;charset=UTF-8" /* FORM_DATA */
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
    if (contentType !== "application/x-www-form-urlencoded;charset=UTF-8" /* FORM_URLENCODED */ || config.data && typeof config.data == "object" && Object.keys(config.data.length) || ((_a = config.method) == null ? void 0 : _a.toUpperCase()) === "GET" /* GET */) {
      return config;
    }
    return {
      ...config,
      data: import_qs.default.stringify(config.data, { arrayFormat: "brackets" })
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
    const _config = (0, import_lodash_es.merge)({}, this.baseConfig, this.formatFormData(config));
    return this.axiosInstance.request(_config);
  }
};
