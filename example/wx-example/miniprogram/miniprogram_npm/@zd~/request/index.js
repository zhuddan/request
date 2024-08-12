module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1723433606183, function(require, module, exports) {
module.exports = require('./dist/index.js')

}, function(modId) {var map = {"./dist/index.js":1723433606184}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1723433606184, function(require, module, exports) {
var e=require("./shared.js"),t=require("./http.js"),r=require("./uni.js"),s=require("./wx.js");require("axios"),require("qs"),Object.defineProperty(exports,"ContentTypeEnum",{enumerable:!0,get:function(){return e.ContentTypeEnum}}),Object.defineProperty(exports,"RequestMethodsEnum",{enumerable:!0,get:function(){return e.RequestMethodsEnum}}),exports.isObjectOrArray=e.isObjectOrArray,exports.merge=e.merge,exports.HttpRequest=t.HttpRequest,exports.UniRequest=r.UniRequest,exports.WxRequest=s.WxRequest;

}, function(modId) { var map = {"./shared.js":1723433606185}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1723433606185, function(require, module, exports) {
var t,e;function r(t){return!!t&&"object"==typeof t&&!Array.isArray(t)}exports.RequestMethodsEnum=void 0,(t=exports.RequestMethodsEnum||(exports.RequestMethodsEnum={})).GET="GET",t.POST="POST",t.PUT="PUT",t.DELETE="DELETE",exports.ContentTypeEnum=void 0,(e=exports.ContentTypeEnum||(exports.ContentTypeEnum={})).JSON="application/json;charset=UTF-8",e.FORM_URLENCODED="application/x-www-form-urlencoded;charset=UTF-8",e.FORM_DATA="multipart/form-data;charset=UTF-8",exports.isObjectOrArray=r,exports.merge=function t(e,...n){if(!n.length)return e;const o=n.shift();if(r(e)&&r(o))for(const n in o)r(o[n])?(e[n]||Object.assign(e,{[n]:{}}),t(e[n],o[n])):Object.assign(e,{[n]:o[n]});return t(e,...n)};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1723433606183);
})()
//miniprogram-npm-outsideDeps=["./http.js","./uni.js","./wx.js","axios","qs"]
//# sourceMappingURL=index.js.map