'use strict';

var merge = require('./merge-CnaYuBEF.js');

/**
 * 实现
 */
class WxRequest {
    /**
     * 基础配置
     */
    baseConfig;
    /**
     * 拦截器
     */
    interceptors;
    /**
     * @param options 基础配置
     * @param interceptors 拦截器
     */
    constructor(options, interceptors) {
        this.baseConfig = {
            ...options,
        };
        this.interceptors = interceptors;
    }
    get(config) {
        return this.request({ ...config, method: 'GET' });
    }
    post(config) {
        return this.request({ ...config, method: 'POST' });
    }
    put(config) {
        return this.request({ ...config, method: 'PUT' });
    }
    delete(config) {
        return this.request({ ...config, method: 'DELETE' });
    }
    async request(config) {
        let _config = merge.merge({}, this.baseConfig, config);
        try {
            _config = await this.interceptors?.request?.(_config) || _config;
        }
        catch (error) {
            this.interceptors?.requestError?.(error);
            throw error;
        }
        return new Promise((resolve, reject) => {
            wx.request({
                ..._config,
                success: async (response) => {
                    const userResponse = await this.interceptors?.response?.({ config: _config, response });
                    resolve(userResponse || response);
                },
                fail: (error) => {
                    this.interceptors?.responseError?.(error);
                    reject(error);
                },
            });
        });
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
exports.WxRequest = WxRequest;
//# sourceMappingURL=wx.cjs.js.map
