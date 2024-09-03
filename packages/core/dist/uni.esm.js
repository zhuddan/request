import { m as merge } from './merge-Cu9cWULO.js';
export { C as ContentTypeEnum, R as RequestMethodsEnum } from './merge-Cu9cWULO.js';

/**
 * 实现
 */
class UniRequest {
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
        let _config = merge({}, this.baseConfig, config);
        try {
            _config = await this.interceptors?.request?.(_config) || _config;
        }
        catch (error) {
            console.log('interceptors?.requestError ', error);
            this.interceptors?.requestError?.(error);
            throw error;
        }
        try {
            /**
             * 没有 loading 的请求 在开发环境会报错, 你可以设置 ignoreLoading 取消警告
             */
            const response = await uni.request(_config);
            const userResponse = await this.interceptors?.response?.({ config: _config, response });
            return userResponse || response;
        }
        catch (error) {
            this.interceptors?.responseError?.(error);
            throw error;
        }
    }
}

export { UniRequest };
//# sourceMappingURL=uni.esm.js.map
