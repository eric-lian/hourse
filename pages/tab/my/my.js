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
    // 获取当前最新角色信息


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


  updateLoginData() {
    // 刷新页面，同步数据
    this.setData({
      userInfo: app.globalData.userInfo,
      logined: app.globalData.logined
    })
    console.log("updateLoginData" + this.data.logined)
  },
  getUserProfile(e) {
    app.login(res => {
        this.updateLoginData()
      },
      res => {
        console.log("getUserProfile login error ")
      })
  },
  enterMyEvaluate(e) {

  },

  enterOrderManager(e) {
    wx.navigateTo({
      url: '/pages/merchant/order_manager/order_manager',
    })
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