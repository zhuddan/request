import { request } from '@/utils/request/index'
// 获取验证码
export function getCodeImg() {
  return request.get<{ img: string, uuid: string }>(
    {
      url: '/captchaImage',
      header: {
        withToken: false,
      },
    },
  )
}
