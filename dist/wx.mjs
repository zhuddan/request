import{merge as e}from"./shared.mjs";class t{baseConfig;interceptors;constructor(e,t){this.baseConfig={...e},this.interceptors=t}get(e){return this.request({...e,method:"GET"})}post(e){return this.request({...e,method:"POST"})}put(e){return this.request({...e,method:"PUT"})}delete(e){return this.request({...e,method:"DELETE"})}async request(t){let r=e({},this.baseConfig,t);try{r=await(this.interceptors?.request?.(r))||r}catch(e){throw this.interceptors?.requestError?.(e),e}return new Promise(((e,t)=>{wx.request({...r,success:async t=>{const s=await(this.interceptors?.response?.({config:r,response:t}));e(s||t)},fail:e=>{this.interceptors?.responseError?.(e,r),t(e)}})}))}}export{t as WxRequest,t as default};
