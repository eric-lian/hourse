// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userOrders: [],
    merchantOrders: [],
    order_status_text: {},
    // -1 未登录 0 用户 1商家
    roles: -1,
    // -1 初始化 0 加载中 1 刷新成功， 数据不为空 2 刷新成功 ，数据为空 3  刷新数据失败 4 加载更多成功，数据不为空
    // 5 加载更多成功， 数据为空  6加载更多失败
    status: -1,
    logined: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      logined: app.globalData.logined
    })
    // 检查用户角色
    this.checkRoles(true, true)
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
    this.checkRoles(true, false)
  },

  checkRoles(isRefresh, ignoreRolesNoChanged) {
    const roles = app.globalData.userInfo.roles
    if (!app.globalData.logined) {
      this.setData({
        roles: -1,
        logined: app.globalData.logined,
        order_status_text: {},
        userOrders: [],
        merchantOrders: []
      })
    } else if (this.data.roles != roles || ignoreRolesNoChanged) {
      // 已登录角色发生变化
      if (roles == 0) {
        if (this.data.roles != roles) {
          this.setData({
            roles: roles,
            logined: app.globalData.logined,
            order_status_text: {
              '1': "待接单",
              '2': "已接单",
              '3': "已完成",
              '4': "商家已取消",
              '5': "您已取消"
            }
          })
        }
        this.loadUserOrders(isRefresh)
      } else if (roles == 1) {
        if (this.data.roles != roles) {
          this.setData({
            roles: roles,
            logined: app.globalData.logined,
            order_status_text: {
              '1': "待接单",
              '2': "已接单",
              '3': "已完成",
              '4': "您已取消",
              '5': "用户已取消"
            }
          })
        }
        this.loadMerchantOrders(isRefresh)
      } else {
        this.setData({
          roles: roles,
          logined: app.globalData.logined,
          order_status_text: {},
          userOrders: [],
          merchantOrders: []
        })
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
    this.checkRoles(true, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.checkRoles(false, true)
    wx.showToast({
      title: '触发了加载更多',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  loadUserOrders(isRefresh) {
    // 正在加载中
    if (this.data.status == 0) {
      return
    }
    this.setData({
      status: 0
    })

    var lastCreateTime = Date.now()
    if (!isRefresh) {
      // 获取最后一个元素时间
      const orders = this.data.userOrders
      const length = orders.length
      if (length > 0) {
        lastCreateTime = orders[length - 1]._createTime
      }
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
        if (isRefresh) {
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
        }
        if (this.data.roles != 0) {
          return
        }

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

        if (isRefresh && isEmpty) {
          // 刷新空数据  
          this.setData({
            status: 2
          })
        } else if (isRefresh && !isEmpty) {
          // 新数据
          this.setData({
            status: 1
          })
        } else if (!isRefresh && !isEmpty) {
          this.setData({
            status: 4
          })
          // 有更多数据
        } else {
          this.setData({
            status: 5
          })
          // 没有更多数据了
          wx.showToast({
            title: '没有更多数据了',
          })
        }

      }).catch(reason => {
        if (isRefresh) {
          this.setData({
            status: 3
          })
          wx.showToast({
            title: '刷新失败',
          })
        } else {
          this.setData({
            status: 6
          })
          wx.showToast({
            title: '加载失败',
          })
        }
      })
  },

  loadMerchantOrders(isRefresh) {
    // 正在加载中
    if (this.data.status == 0) {
      return
    }

    if (isRefresh) {
      wx.startPullDownRefresh({
        success: (res) => {},
      })
    }

    this.setData({
      status: 0
    })

    // 计算最后一个元素时间
    var lastCreateTime = Date.now()
    if (!isRefresh) {
      const orders = this.data.merchantOrders
      const length = orders.length
      if (length > 0) {
        lastCreateTime = orders[length - 1]._createTime
      }
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
        if (isRefresh) {
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
        }
        if (this.data.roles != 1) {
          return
        }

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
        if (isRefresh && dataIsEmpty) {
          // 空数据 
          this.setData({
            status: 2
          })
        } else if (isRefresh && !dataIsEmpty) {
          // 新数据
          this.setData({
            status: 1
          })
        } else if (!isRefresh && !dataIsEmpty) {
          // 有更多数据
          this.setData({
            status: 4
          })
        } else {
          // 没有更多数据了
          this.setData({
            status: 5
          })
          wx.showToast({
            title: '没有更多数据了',
          })
        }

      }).catch(reason => {
        console.log(reason)
        if (isRefresh) {
          this.setData({
            status: 3
          })
          wx.showToast({
            title: '刷新失败',
          })
        } else {
          this.setData({
            status: 6
          })
          wx.showToast({
            title: '加载失败',
          })
        }
      })
  },

  gotoOrderDetail(e) {
    const order_id = e.currentTarget.dataset.order_id
    console.log(order_id)
    wx.navigateTo({
      url: '/pages/merchant_subscribe/merchant_subscribe?order_id=' + order_id,
    })
  },

  gotoLoginTab(e){
    wx.switchTab({
      url: '/pages/tab/my/my',
    })
  }

})