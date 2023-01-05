// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate: "",
    order_id: "",
    service_person_id: "",
    merchant_id: "",
    star: 5,
    // 0 加载中 1. 无评论 2.有评论  3.加载失败
    status: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我的评价',
    })
    this.setData({
      order_id: options.order_id,
      merchant_id: options.merchant_id,
      service_person_id: options.service_person_id
    })

    // 查询当前订单下是否已经有评论， 有评论展示评论，无评论
    this.queryOrder()
  },

  queryOrder(e) {
    this.setData({
      status: 0
    })

    wx.cloud.callFunction({
      name: "evaluate",
      data: {
        operate: 'query',
        order_id: this.data.order_id,
        service_person_id: this.data.service_person_id,
        merchant_id: this.data.merchant_id
      }
    }).then(res => {
      console.log(res)
      const data = res.result.data[0]
      // 有缓存
      if (data != null) {
        this.setData({
          status: 2,
          evaluate: data.evaluate,
          star: data.star
        })
      } else {
        this.setData({
          status: 1
        })
      }
    }).catch(reason => {
      console.log(reason)
      this.setData({
        status: 3
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

    wx.showLoading({
      title: '提交中...',
      icon: "none"
    })
    const openid = getApp().globalData.userInfo.openid
    console.log(openid)

    wx.cloud.callFunction({
      name: "evaluate",
      data: {
        operate: 'add',
        order_id: this.data.order_id,
        evaluate: this.data.evaluate,
        user_open_id: openid,
        service_person_id: this.data.service_person_id,
        merchant_id: this.data.merchant_id,
        status: 0,
        star: this.data.star,
        user_name: getApp().globalData.userInfo.nickname,
        _createTime: Date.now(),
        _updateTime: Date.now()
      }
    }).then(res => {
      console.log(res)
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
  },

  onStarClick(e) {
    const star = e.currentTarget.dataset.star
    this.setData({
      star: star
    })
  },

  back(e) {
    wx.navigateBack({
      delta: 0,
    })
  }
})