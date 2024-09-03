'use strict';

var axios = require('axios');
var Qs = require('qs');
var merge = require('./merge-CnaYuBEF.js');

/**
 * 实现
 */
class HttpRequest {
    /**
     * @description axios 实例
     */
    axiosInstance;
    /**
     * @description 基础配置
     */
    baseConfig;
    /**
     *
     * @param options 基础配置
     * @param interceptors 拦截器
     */
    constructor(options, interceptors) {
        this.baseConfig = {
            ...options,
        };
        this.axiosInstance = axios.create(this.baseConfig);
        const { request, response, requestError, responseError, } = interceptors || {};
        this.axiosInstance.interceptors.request.use(async (config) => {
            const value = await (request?.(config) || config);
            return value;
        }, (e) => {
            requestError?.(e);
        });
        this.axiosInstance.interceptors.response.use((data) => {
            return (response?.(data) || data);
        }, ((error) => {
            return responseError?.(error) || Promise.reject(error);
        }));
    }
    /**
     * 文件上传
     * @param config
     * @param params
     */
    uploadFile(config, params = {}) {
        const formData = new window.FormData();
        const customFilename = params.name || 'file';
        if (params.filename) {
            formData.append(customFilename, params.file, params.filename);
        }
        else {
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
            method: 'POST',
            data: formData,
            headers: {
                'Content-type': merge.ContentTypeEnum.FORM_DATA,
            },
        });
    }
    /**
     * 格式化 formdata
     * @param config
     */
    formatFormData(config) {
        const headers = config.headers || this.baseConfig.headers;
        const contentType = headers?.['Content-Type'] || headers?.['content-type'];
        if ((contentType !== merge.ContentTypeEnum.FORM_URLENCODED)
            || (config.data && typeof config.data == 'object' && Object.keys(config.data.length))
            || config.method?.toUpperCase() === merge.RequestMethodsEnum.GET) {
            return config;
        }
        return {
            ...config,
            data: Qs.stringify(config.data, { arrayFormat: 'brackets' }),
        };
    }
    get(config) {
        return this.request({ ...config, method: 'get' });
    }
    post(config) {
        return this.request({ ...config, method: 'post' });
    }
    put(config) {
        return this.request({ ...config, method: 'put' });
    }
    delete(config) {
        return this.request({ ...config, method: 'delete' });
    }
    request(config) {
        const _config = merge.merge({}, this.baseConfig, this.formatFormData(config));
        return this.axiosInstance.request(_config);
    }
}

Object.defineProperty(exports, "ContentTypeEnum", {
    enumerable: true,
    get: function () { return merge.ContentTypeEnum; }
});
Object.defineProperty(exports, "RequestMethodsEnum", {
    enumerable: true,
    get: function () { return merge.RequestMethodsEnum; }
});
exports.HttpRequest = HttpRequest;
//# sourceMappingURL=http.cjs.js.map
