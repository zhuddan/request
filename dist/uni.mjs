import{m as t}from"./merge-10SrFotJ.js";class e{baseConfig;interceptors;constructor(t,e){this.baseConfig={...t},this.interceptors=e}get(t){return this.request({...t,method:"GET"})}post(t){return this.request({...t,method:"POST"})}put(t){return this.request({...t,method:"PUT"})}delete(t){return this.request({...t,method:"DELETE"})}async request(e){let r=t({},this.baseConfig,e);try{r=await(this.interceptors?.request?.(r))||r}catch(t){throw console.log("interceptors?.requestError ",t),this.interceptors?.requestError?.(t),t}try{const t=await uni.request(r);return await(this.interceptors?.response?.({config:r,response:t}))||t}catch(t){throw this.interceptors?.responseError?.(t),t}}}export{e as UniRequest,e as default};
