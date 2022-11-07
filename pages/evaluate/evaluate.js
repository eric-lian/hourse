// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  evaluteInputChange(e) {
    const value = e.detail.value
    this.setData({
      evaluate: value
    })
  },

  submitOrder() {
    const evaluate = this.data.evaluate
    if (getApp().isNullOrEmpty(evaluate)) {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      })
      return;
    }
    const db = wx.cloud.database()
    wx.showLoading({
      title: '提交中...',
      icon: "none"
    })
    const openid = getApp().globalData.userInfo.openid
    console.log(userInfo)
    db.collection("evaluate")
      .add({
        data: {
          evaluate: this.data.evaluate,
          openid: openid,
          _createTime: db.serverDate(),
          _updateTime: db.serverDate()
        }
      }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })

        wx.navigateBack({
          delta: 1,
        })

        wx.showToast({
          title: '评论成功',
          icon: "none"
        })
      }).catch(reason => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '评论失败',
          icon: "none"
        })
      })
  }
})