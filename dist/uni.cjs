"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./merge-DNQoOYXz.js");class t{baseConfig;interceptors;constructor(e,t){this.baseConfig={...e},this.interceptors=t}get(e){return this.request({...e,method:"GET"})}post(e){return this.request({...e,method:"POST"})}put(e){return this.request({...e,method:"PUT"})}delete(e){return this.request({...e,method:"DELETE"})}async request(t){let r=e.merge({},this.baseConfig,t);try{r=await(this.interceptors?.request?.(r))||r}catch(e){throw console.log("interceptors?.requestError ",e),this.interceptors?.requestError?.(e),e}try{const e=await uni.request(r);return await(this.interceptors?.response?.({config:r,response:e}))||e}catch(e){throw this.interceptors?.responseError?.(e),e}}}exports.UniRequest=t,exports.default=t;
