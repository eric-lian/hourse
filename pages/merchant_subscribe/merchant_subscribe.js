// pages/merchant_subscribe/merchant_subscribe.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 0 下单 1 待接单 2 已接单 3 已完成 4 商家取消订单 5 用户取消订单
    status: "0",
    coarse_address: "",
    service_name: "",
    start_time: "",
    end_time: "",
    merchant_id: "",
    service_type: "",
    start_time: "",
    end_time: "",
    service_address: "",
    contact: "",
    phone: "",
    desc: "",
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
    home: ""
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
    this.setData({
      start_time: this.getCurrentData(),
      end_time: this.getCurrentData(),
      service_name: options.service_merchant_name,
      merchant_id: options.merchant_id,
      merchant_open_id: options.merchant_open_id
    })
    console.log(options)
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

  selectService() {
    // ,"家电维修", "养老护理", "搬家", "收纳干洗", "甲醛治理", "保育员", "开锁", "其他"
    const _itemList = ["保洁", "母婴护理", "保姆", "疏通管道", "水电安装", "家电清洗"]
    wx.showActionSheet({
      itemList: _itemList,
      success: res => {
        const tapIndex = res.tapIndex
        this.setData({
          service_type: _itemList[tapIndex]
        })
      }
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
    const templateId = app.globalData.MERCHANT_ACCEPT_ORDER_MSG__TEMPLATE_ID
    app.checkAcceptOrderMsgTemplateId(templateId, res => {
      if (res) {
        // 永久同意消息订阅 ，直接下单
        this.placeAnOrder()
      } else {
        // 申请权限
        app.requestSubscribeMessage(templateId, res => {
          // 同意消息订阅，下单
          if (res) {
            this.placeAnOrder()
          } else {
            wx.showToast({
              title: '请同意开启消息订阅，方便接受订单最新状态',
              icon: 'none'
            })
          }
        })
      }
    })
  }

  ,
  placeAnOrder() {

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
      // 下单成功，给商家发送下单消息
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
  }
})