'use strict';

// src/shared.ts
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

exports.ContentTypeEnum = ContentTypeEnum;
exports.RequestMethodsEnum = RequestMethodsEnum;
