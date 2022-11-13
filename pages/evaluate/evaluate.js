// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate: "",
    order_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '评价',
    })
    this.setData({
      order_id: options.order_id
    })

    // 查询当前订单下是否已经有评论， 有评论展示评论，无评论
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
    console.log(openid)
    db.collection("evaluate")
      .add({
        data: {
          evaluate: this.data.evaluate,
          user_open_id: openid,
          order_id: this.data.order_id,
          status: 0,
          _createTime: Date.now(),
          _updateTime: Date.now()
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