'use strict';

var merge = require('./merge-CnaYuBEF.js');
var http = require('./http.cjs.js');
var uni = require('./uni.cjs.js');
var wx = require('./wx.cjs.js');
require('axios');
require('qs');



Object.defineProperty(exports, "ContentTypeEnum", {
	enumerable: true,
	get: function () { return merge.ContentTypeEnum; }
});
Object.defineProperty(exports, "RequestMethodsEnum", {
	enumerable: true,
	get: function () { return merge.RequestMethodsEnum; }
});
exports.HttpRequest = http.HttpRequest;
exports.UniRequest = uni.UniRequest;
exports.WxRequest = wx.WxRequest;
//# sourceMappingURL=index.cjs.js.map
