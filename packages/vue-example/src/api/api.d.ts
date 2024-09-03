declare namespace Api{

  interface CaptchaImage {
    img: string
    uuid: string
  }

  interface LoginResponse {
    token: string
  }

  interface LoginData {
    username: string
    password: string
    code: string
    uuid: string
  }

  interface User {
    permissions: string[]
    roles: string[]
    user: UserInfo
  }

  interface UserInfo {
    admin: boolean
    /**
     * 头像
     */
    avatar: string
    /**
     * 邮箱
     */
    email?: string
    /**
     * 昵称
     */
    nickName: string
    sex: string
    userId: number
    userName: string
    openId: string
    passWord: string
    phonenumber: string
    roleId: number
    roleIds: number
    roles: string[]
  }

  interface Operlog {
    /**
     * 操作类型
     */
    businessType: string
    /**
     * 日志编号
     */
    operId: number
    /**
     * 操作类型
     */
    businessType: number
    /**
     * 操作人员
     */
    operName: string
    /**
     * 操作地址
     */
    operIp: string
    /**
     * 操作地点
     */
    operLocation: string
    /**
     * 操作日期
     */
    operTime: string
    /**
     * 消耗时间
     */
    costTime: string
    /**
     * 系统模块
     */
    title: string

  }

  interface Gen {

    /**
     * 表名称
     */
    tableName: string
    /**
     * 表描述
     */
    functionName: string
    /**
     * id
     */
    tableId: number

  }

  /**
   * 登录注册返回
   */
  interface LoginRegisterResponse {
    token: string
  }

  interface BannerModel {
    /**
     * 图片
     */
    img?: string
    /**
     * 显示顺序
     */
    orderNum?: number
    /**
     * 备注
     */
    remark?: string
    /**
     * 状态0正常，1停用
     */
    status?: string
    /**
     * 子标题
     */
    subTitle?: string
    /**
     * 标题
     */
    title?: string
    /**
     * 类型1轮播图1，2轮播图2
     */
    type?: string
    /**
     * 跳转地址
     */
    url?: string
  }

}
