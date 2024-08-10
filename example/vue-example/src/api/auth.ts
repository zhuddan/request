import { request } from '~/utils/request/index'
// 获取验证码
export function getCodeImg() {
  return request.get<Api.CaptchaImage>({
    url: '/captchaImage',
    withToken: false,
  })
}

export function getInfo() {
  return request.get<Api.User>({
    url: '/getInfo',
  })
}

// 登录方法
export function login(data: Api.LoginData) {
  return request.post<Api.LoginResponse>({
    url: '/login',
    data,
    withToken: false,
  })
}
