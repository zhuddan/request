import { getCodeImg } from "../../api/auth"

// pages/login/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
      form:{
        username: 'admin',
        password: 'admin123',
        code: '',
        uuid: '',
      },
      codeImg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  getCode() {
    return getCodeImg()
      .then((res) => {
        this.setData({
          form:{
            ...this.data.form,
            uuid:res.uuid,
          },
          codeImg:`data:image/gif;base64,${res.img}`
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})