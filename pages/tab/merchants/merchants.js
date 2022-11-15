// pages/tab/merchants/merchants.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: undefined,
    userInfo: {},
    // status 0 未注册 1 审核中 2 审核通过 3 审核驳回 4 申请修改
    merchant_register_info: {},
    //0 未知 1 请求中 2 成功 3 失败  4 空数据
    data_status: 0,
    header: {
      main_title: "",
      sub_title: ""
    },
    inputCheck: {
      name: {
        emptyTip: "请输入公司名称",
        minLength: 2,
        minLengthTip: "公司名称最小长度为2位"
      },
      address: {
        emptyTip: "请输入公司地址",
        minLength: 5,
        minLengthTip: "公司地址最小长度为5位"
      },
      id_number: {
        emptyTip: "请输入法人身份证号",
        minLength: 15,
        minLengthTip: "请输入正确法人身份证号"
      },
      business_license_number: {
        emptyTip: "请输入营业执照编号",
        minLength: 18,
        minLengthTip: "请输入正确营业执照编号"
      },
      min_service_price: {
        emptyTip: "请输入最低价格",
      },
      introduction: {
        emptyTip: "请输入公司简介",
        minLength: 15,
        minLengthTip: "公司简介最小长度为15位"
      },
      phone_number: {
        emptyTip: "请输入手机号",
        minLength: 11,
        minLengthTip: "请输入正确手机号"
      },
      isRefreshLoading: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.refreshMerchant()
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
    // 说明非首次，静默更新即可
    this._refreshMerchant(this.data.merchant_register_info.status != undefined)
  },
  refreshMerchant() {
    this._refreshMerchant(false)
  },
  _refreshMerchant(isSilence) {
    // 登录状态发生变化，重置请求信息状态
    if (app.globalData.logined) {
      console.log(app.globalData.userInfo)
      const status = this.data.merchant_register_info.status
      // 只有审核中需要刷新数据
      if (status != undefined && status != 1) {
        return
      }

      if (this.data.isRefreshLoading) {
        return
      }

      if (!isSilence) {
        this.data.logined = app.globalData.logined
        this.data.userInfo = app.globalData.userInfo
        this.data.data_status = 1
        this.data.merchant_register_info = {}
        this.updateHeader()
        wx.showLoading({
          title: '加载中...'
        })
      }
      // 获取商家缓存信息
      this.queryMerchant(res => {
        console.log(res.data)
        const resultDataArray = res.data
        if (resultDataArray.length > 0) {
          const resultData = resultDataArray[0]
          this.data.data_status = 2
          this.data.merchant_register_info = resultData
          this.setData(this.data)
        } else {
          // 空数据
          this.data.data_status = 4
          this.data.merchant_register_info.status = 0
          this.setData(this.data)
        }
        this.updateHeader()
        if (!isSilence) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }, reason => {
        this.data.data_status = 3
        this.data.merchant_register_info = {}
        this.setData(this.data)
        if (!isSilence) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    } else {
      this.data.logined = app.globalData.logined
      this.data.userInfo = app.globalData.userInfo
      this.data.data_status = 1
      this.data.merchant_register_info = {}
      this.updateHeader()
    }
  },

  updateHeader() {
    let header
    if (!this.data.logined) {
      header = {
        main_title: "未登录",
        sub_title: "赶快登陆完善你的信息吧~"
      }
    } else {
      const status = this.data.merchant_register_info.status
      console.log("============= status")
      console.log(status)
      const main_title = "Hey,  " + this.data.userInfo.nickname
      let sub_title
      // 待审核
      if (status == 0 || status == 4) {
        sub_title = "赶快填写你的信息吧~"
      } else if (status == 1) {
        sub_title = "我们正在努力的审核中...请耐心等待一下"
      } else if (status == 2) {
        sub_title = "恭喜您申请成功"
      } else if (status == 3) {
        sub_title = "很抱歉申请信息可能有些问题，仔细检查后重新提交吧~"
      } else {
        sub_title = ""
      }
      header = {
        main_title: main_title,
        sub_title: sub_title
      }
    }
    this.data.header = header
    this.setData(this.data)
  },

  // 查询一个商家
  queryMerchant(onSuccess, onFail) {
    this.data.isRefreshLoading = true
    const db = wx.cloud.database()
    db.collection('merchants_register_info')
      .where({
        merchant_open_id: this.data.userInfo.openid
      })
      .limit(1)
      .get()
      .then(res => {
        onSuccess(res)
        this.data.isRefreshLoading = false
      })
      .catch(reason => {
        onFail(reason)
        this.data.isRefreshLoading = false
      })
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
    console.log("=========== ")
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

  login() {
    app.login(res => {
      // 登录成功，刷新用户状态
      this._refreshMerchant(false)
    }, _ => {

    },reason => {
      console.log(reason)
    })
  },

  registerInfoSubmit(e) {
    const submitValue = e.detail.value
    console.log(submitValue)
    for (let key in submitValue) {
      const value = submitValue[key]
      // tip 为空说明改字段值可以为空
      const tip = this.data.inputCheck[key]['emptyTip']
      console.log("=============xxx " + key)
      console.log(tip)
      console.log(app.isNullOrEmpty(tip))
      console.log(app.isNullOrEmpty(value))
      if (!app.isNullOrEmpty(tip) && app.isNullOrEmpty(value)) {
        wx.showToast({
          title: tip,
          icon: 'none'
        })
        return
      }
      const minLength = this.data.inputCheck[key]['minLength']
      const minLengthTip = this.data.inputCheck[key]['minLengthTip']
      const valueLength = value.length
      console.log("=============xxx")
      console.log(minLength + "===" + minLengthTip + "=====" + valueLength)
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
    // 开始提交表单信息
    wx.showLoading({
      title: '提交中...'
    })
    const db = wx.cloud.database()
    submitValue.merchant_open_id = this.data.userInfo.openid
    submitValue.status = 1
    const cacheCreateTime = this.data.merchant_register_info._createTime
    if (cacheCreateTime != undefined) {
      submitValue._createTime = cacheCreateTime
    }
    const cacheRejectReason = this.data.merchant_register_info.reject_reason
    // 缓存上一次驳回结果
    if (cacheRejectReason != undefined) {
      submitValue.reject_reason = cacheRejectReason
    }
    submitValue._createTime = db.serverDate()
    submitValue._updateTime = db.serverDate()
    db.collection('merchants_register_info')
      .doc(this.data.userInfo.openid)
      .set({
        data: submitValue
      }).then(res => {
        // 成功更新本地信息对象 
        wx.hideLoading({
          icon: 'none',
          success: (res) => {},
        })
        this.data.merchant_register_info = submitValue
        this.setData(this.data)
        console.log("================")
        console.log(this.data)
      }).catch(reason => {
        wx.hideLoading({
          icon: 'none',
          success: (res) => {},
        })
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      })
  },

  reSubmitRegisterInfo() {
    this.data.merchant_register_info.status = 4
    this.updateHeader()
  }
})