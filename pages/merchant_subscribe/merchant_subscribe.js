// pages/merchant_subscribe/merchant_subscribe.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 0 下单 1 待接单 2 已接单 3 已完成 4 商家取消订单 5 用户取消订单
    status: "-1",
    coarse_address: "",
    service_name: "",
    start_time: "",
    end_time: "",
    merchant_id: "",
    service_type: "",
    service_address: "",
    contact: "",
    phone: "",
    desc: "",
    user_open_id: "",
    merchant_open_id: "",
    inputCheck: {
      service_type: {
        emptyTip: "请选择服务类型",
      },

      coarse_address: {
        emptyTip: "请输入服务地址",
      },

      service_address: {
        emptyTip: "请输入详细地址",
      },
      contact: {
        emptyTip: "请输入联系人姓名",
      },
      phone: {
        emptyTip: "请输入手机号",
        minLength: 11,
        minLengthTip: "请输入正确手机号"
      },
      desc: {
        emptyTip: "请输入需求描述",
      }
    },
    home: "",
    order_id: "",
    roles: -1,
    serviceTypeList: ["保洁",
      "保姆",
      "开锁",
      "搬家",
      "保育员",
      "母婴护理",
      "养老护理",
      "家电维修",
      "水电安装",
      "家电清洗",
      "家具维修",
      "甲醛治理",
      "收纳干洗",
      "其他"
    ]
  },


  getCurrentData() {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    // const second = date.getSeconds()
    return year + '年' + month + '月' + day + '日'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查订单id参数是否存在，如果存在则表示是订单详情页，否则是下单页面
    const order_id = options.order_id
    this.updateRoles()
    if (!app.isNullOrEmpty(order_id)) {
      this.setData({
        order_id: order_id
      })
      this.queryOrder()
    } else {
      // 下单
      this.setData({
        status: '0',
        start_time: this.getCurrentData(),
        end_time: this.getCurrentData(),
        service_name: options.service_merchant_name,
        merchant_id: options.merchant_id,
        merchant_open_id: options.merchant_open_id
      })
    }
    console.log(options)
  },

  updateRoles() {
    this.setData({
      roles: app.globalData.logined ? app.globalData.userInfo.roles : -1
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

  selectService(e) {
    this.setData({
      service_type: this.data.serviceTypeList[e.detail.value]
    })
  },

  onDateChangeLeft(e) {
    let date = e.detail.value;
    let arr = date.split('-');
    let dateStr = `${arr[0]}年${arr[1]}月${arr[2]}日`;
    this.setData({
      start_time: dateStr
    });
  },

  onDateChangeRight(e) {
    let date = e.detail.value;
    let arr = date.split('-');
    let dateStr = `${arr[0]}年${arr[1]}月${arr[2]}日`;
    this.setData({
      end_time: dateStr
    });
  },
  onInputChange(e) {
    const value = e.detail.value
    const id = e.currentTarget.id
    console.log("=========" + value)
    if ("service_address" == id) {
      this.setData({
        service_address: value
      })
    } else if ("coarse_address" == id) {
      this.setData({
        coarse_address: value
      })
    } else if ("contact" == id) {
      this.setData({
        contact: value
      })
    } else if ("phone" == id) {
      this.setData({
        phone: value
      })
    } else if ("desc" == id) {
      this.setData({
        desc: value
      })
    }

  },
  submitOrder(e) {
    const app = getApp()
    const submitValue = this.data
    for (let key in submitValue) {
      // tip 为空说明改字段值可以为空
      const checkValue = this.data.inputCheck[key]
      if (checkValue == undefined) {
        continue
      }
      const value = submitValue[key]
      const tip = checkValue['emptyTip']
      if (app.isNullOrEmpty(value)) {
        wx.showToast({
          title: tip,
          icon: 'none'
        })
        return
      }

      const minLength = this.data.inputCheck[key]['minLength']
      const minLengthTip = this.data.inputCheck[key]['minLengthTip']
      const valueLength = value.length
      // 小于最小长度
      if (!app.isNullOrEmpty(tip) &&
        !app.isNullOrEmpty(minLength + "") &&
        valueLength < minLength &&
        !app.isNullOrEmpty(minLengthTip)) {
        wx.showToast({
          title: minLengthTip,
          icon: 'none',
          // mask: true
        })
        return
      }
    }

    // 确认是否登录
    if (!app.globalData.logined) {
      app.login(res => {
        // 登陆成功，更新角色
        this.updateRoles()
        // 登录成功，下单 
        this.checkAcceptOrderMsgTemplateId()
      }, reason => {
        wx.showToast({
          title: '登录后再预约吧~',
        })
      })
      return
    } else {
      this.checkAcceptOrderMsgTemplateId()
    }
  },

  checkAcceptOrderMsgTemplateId() {
    // 检测是否开启订阅消息权限
    // const templateId = app.globalData.MERCHANT_ACCEPT_ORDER_MSG__TEMPLATE_ID
    // app.checkAcceptOrderMsgTemplateId(templateId, res => {
    //   if (res) {
    //     // 永久同意消息订阅 ，直接下单
    //     this.placeAnOrder()
    //   } else {
    //     // 申请权限
    //     app.requestSubscribeMessage(templateId, res => {
    //       // 同意消息订阅，下单
    //       if (res) {
    //         this.placeAnOrder()
    //       } else {
    //         wx.showToast({
    //           title: '请同意开启消息订阅，方便接受订单最新状态',
    //           icon: 'none'
    //         })
    //       }
    //     })
    //   }
    // })
    this.placeAnOrder()
  }

  ,
  placeAnOrder() {
    // 如果是商家角色， 不允许提交订单
    if (this.data.roles == 1) {
      wx.showToast({
        title: '对不起，该功能暂未对商家开放',
        icon: 'none'
      })
      return
    }
    const subscribe = {
      status: "1",
      service_name: this.data.service_name,
      start_time: this.data.start_time,
      end_time: this.data.end_time,
      merchant_id: this.data.merchant_id,
      service_type: this.data.service_type,
      coarse_address: this.data.coarse_address,
      service_address: this.data.service_address,
      contact: this.data.contact,
      phone: this.data.phone,
      desc: this.data.desc,
      user_open_id: app.globalData.userInfo.openid,
      merchant_open_id: this.data.merchant_open_id
      // _updateTime: db.serverDate(),
      // _createTime: db.serverDate()
    }
    console.log(subscribe)
    wx.showLoading({
      title: '提交中...',
    })
    wx.cloud.callFunction({
      name: "placeAnOrder",
      data: subscribe
    }).then(res => {
      this.setData({
        status: "1"
      })
      wx.hideLoading({
        success: (res) => {},
      })
    }).catch(reason => {
      console.log(reason)
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  selectLocation() {
    var _this = this
    wx.chooseLocation({
      success: function (e) {
        var coarse_address = e.name
        _this.setData({
          coarse_address: coarse_address
        })
      }
    })
  },

  queryOrder() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
        name: "query_order",
        data: {
          order_id: this.data.order_id
        }
      }).then(res => {
        console.log("======= 查询订单信息成功")
        this.setOrderData(res.result)
        wx.hideLoading({
          success: (res) => {},
        })
      })
      .catch(error => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '网络错误，请稍后再试',
        })
        wx.navigateBack({
          delta: 0,
        })
      })
  },
  setOrderData(order) {
    try {
      console.log(this.data)
      this.setData(order)
      console.log(this.data)
    } catch (error) {
      wx.showToast({
        title: '订单异常',
      })
      wx.navigateBack({
        delta: 0,
      })
    }
  },
  callUserPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },

  callMerchantPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.merchant.phone,
    })
  },

  merchantAcceptOrder(e) {
    console.log(e)
    this.merchantChangeOrder('2', "您确定接受该订单吗？")
  },

  merchantCancelOrder(e) {
    console.log(e)
    this.merchantChangeOrder('4', "您确定取消该订单吗？")
  },

  merchantCompleteOrder(e) {
    console.log(e)
    this.merchantChangeOrder('3', "您确定更改为订单完成吗？")
  },

  merchantChangeOrder(to_status, content) {
    const that = this
    wx.showModal({
      title: "提示",
      content: content,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '提交中...',
          })
          wx.cloud.callFunction({
            name: "change_order_status",
            data: {
              order_id: that.data.order_id,
              to_status: to_status
            }
          }).then(res => {
            that.setOrderData(res.result)
            wx.hideLoading({
              success: (res) => {},
            })
          }).catch(error => {
            console.log(error)
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '订单操作失败，请稍后再试',
            })
          })
        }
      }
    })
  },

  userCancelOrder(e) {
    console.log(e)
    this.merchantChangeOrder('5', "您确定取消该订单吗？")
  }

})