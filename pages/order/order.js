// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userOrders: [],
    merchantOrders: [],
    order_status_text: {
      '1': "待接单",
      '2': "已接单",
      '3': "已完成",
      '4': "商家已取消",
      '5': "用户已取消"
    },
    // -1 未登录 0 用户 1商家
    roles: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadUserOrders()
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
    const roles = app.globalData.userInfo.roles
    if (this.data.roles != roles) {
      this.setData({
        roles: roles
      })
      if (roles == 0) {
        this.loadUserOrders(true)
      } else if (roles == 1) {
        this.loadMerchantOrders(true)
      }
    }
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

  onSwipePageChanged(e) {
    const current = e.detail.current
  },

  loadUserOrders(isRefresh) {
    // 计算最后一个元素时间
    var lastCreateTime = Date.now()
    const orders = this.data.userOrders
    const length = orders.length
    if (length > 0) {
      lastCreateTime = orders[length - 1]._createTime
    }
    const db = wx.cloud.database()
    const _ = db.command
    const openid = app.globalData.userInfo.openid
    db.collection('subscribe').orderBy("_createTime", "desc").where({
        user_open_id: openid,
        _createTime: _.lte(lastCreateTime)
      })
      .limit(20)
      .get()
      .then(res => {
        console.log(res)
        const data = res.data
        const isEmpty = data.length <= 0

        if (isRefresh) {
          this.setData({
            userOrders: data
          })
        } else {
          this.setData({
            userOrders: this.data.userOrders.concat(data)
          })
        }
        const userOrdersIsEmpty = this.data.userOrders.length <= 0
        if (userOrdersIsEmpty && isEmpty) {
          // 空数据  
        } else if (userOrdersIsEmpty && !isEmpty) {
          // 新数据
        } else if (!userOrdersIsEmpty && !isEmpty) {
          // 有更多数据
        } else {
          // 没有更多数据了
        }

      }).catch(reason => {
        console.log(reason)
      })
  },

  loadMerchantOrders(isRefresh) {
    // 计算最后一个元素时间
    var lastCreateTime = Date.now()
    const orders = this.data.merchantOrders
    const length = orders.length
    if (length > 0) {
      lastCreateTime = orders[length - 1]._createTime
    }
    const db = wx.cloud.database()
    const _ = db.command
    const openid = app.globalData.userInfo.openid
    db.collection('subscribe').orderBy("_createTime", "desc").where({
        merchant_open_id: openid,
        _createTime: _.lte(lastCreateTime)
      })
      .limit(20)
      .get()
      .then(res => {
        console.log(res)
        const data = res.data
        const dataIsEmpty = data.length <= 0

        if (isRefresh) {
          this.setData({
            merchantOrders: data
          })
        } else {
          this.setData({
            merchantOrders: this.data.merchantOrders.concat(data)
          })
        }
        const merchantOrdersIsEmpty = this.data.merchantOrders.length <= 0
        if (merchantOrdersIsEmpty && dataIsEmpty) {
          // 空数据  
        } else if (merchantOrdersIsEmpty && !dataIsEmpty) {
          // 新数据
        } else if (!merchantOrdersIsEmpty && !dataIsEmpty) {
          // 有更多数据
        } else {
          // 没有更多数据了
        }

      }).catch(reason => {
        console.log(reason)
      })
  }

})