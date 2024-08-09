import e from"axios";import{m as t}from"./merge-10SrFotJ.js";import s from"qs";import{ContentTypeEnum as a,RequestMethodsEnum as r}from"./shared.mjs";class o{axiosInstance;baseConfig;constructor(t,s){this.baseConfig={...t},this.axiosInstance=e.create(this.baseConfig);const{request:a,response:r,requestError:o,responseError:n}=s||{};this.axiosInstance.interceptors.request.use((async e=>await(a?.(e)||e)),o),this.axiosInstance.interceptors.response.use((e=>r?.(e)||e),(e=>n?.(e)||Promise.reject(e)))}uploadFile(e,t={}){const s=new window.FormData,r=t.name||"file";return t.filename?s.append(r,t.file,t.filename):s.append(r,t.file),t.data&&Object.keys(t.data).forEach((e=>{const a=t.data[e];Array.isArray(a)?a.forEach((t=>{s.append(`${e}[]`,t)})):s.append(e,t.data[e])})),this.axiosInstance.request({...e,method:"POST",data:s,headers:{"Content-type":a.FORM_DATA}})}formatFormData(e){const t=e.headers||this.baseConfig.headers;return(t?.["Content-Type"]||t?.["content-type"])!==a.FORM_URLENCODED||e.data&&"object"==typeof e.data&&Object.keys(e.data.length)||e.method?.toUpperCase()===r.GET?e:{...e,data:s.stringify(e.data,{arrayFormat:"brackets"})}}get(e){return this.request({...e,method:"get"})}post(e){return this.request({...e,method:"post"})}put(e){return this.request({...e,method:"put"})}delete(e){return this.request({...e,method:"delete"})}request(e){const s=t({},this.baseConfig,this.formatFormData(e));return this.axiosInstance.request(s)}}export{o as HttpRequest,o as default};
