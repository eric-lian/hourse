// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateLoginData()
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

  },

  getUserProfile(e) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if (this.data.logined) {
      return
    }
    wx.showLoading({
      title: '登录中...',
    })
    wx.getUserProfile({
      desc: '用于完善会员资料' // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    }).then(res => {
      const userInfo = res.userInfo
      console.log(userInfo)
      this.getOpenId(userInfo)
    }).catch(reason => {
      console.error(reason)
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },

  getOpenId(userInfo) {
    // 执行云函数，获取openid
    wx.cloud.callFunction({
      name: "get_openid",
    }).then(res => {
      // 缓存userInfo 和 openId
      const openid = res.result.openid
      userInfo.openid = openid
      app.globalData.logined = true
      app.globalData.userInfo = userInfo
      this.updateLoginData()
      const userInfoStr = JSON.stringify(userInfo)
      console.log("=====" + userInfoStr)
      wx.setStorage({
        data: userInfoStr,
        key: 'userInfo',
        complete: res => {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    }).catch(reason => {
      wx.hideLoading({
        success: (res) => {},
      })
      console.error(reason)
    })
  },

  updateLoginData() {
    // 刷新页面，同步数据
    this.setData({
      userInfo: app.globalData.userInfo,
      logined: app.globalData.logined
    })
    console.log("===========" + this.data.logined)
  },

  logout() {
    wx.showLoading({
      title: '退出登录中...',
    })
    // 清除本地记录
    app.logout(res => {
      // 退出登录成功
      this.updateLoginData()
      wx.hideLoading({
        success: (res) => {},
      })
    }, res => {
      wx.hideLoading({
        success: (res) => {},
      })
      // 退出登录失败
      wx.showToast({
        title: '退出登录失败',
        icon: 'none'
      })
    })
  }
})