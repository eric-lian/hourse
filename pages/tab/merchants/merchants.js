// pages/tab/merchants/merchants.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: false,
    userInfo: {},
    merchant_register_info: {},
    //0 未知 1 请求中 2 成功 3 失败  4 空数据
    data_status: 0,
    header: {
      main_title: "",
      sub_title: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.refreshMerchant()
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
    // 状态不一致，更新
    if (this.data.logined != app.globalData.logined) {
      this.refreshMerchant()
    }
  },
  refreshMerchant() {
    // 登录状态发生变化，重置请求信息状态
    this.data.data_status = 0
    if (app.globalData.logined) {
      console.log(app.globalData.userInfo)
      const main_title = "Hey,  " + app.globalData.userInfo.nickName
      this.setData({
        logined: app.globalData.logined,
        userInfo: app.globalData.userInfo,
        data_status: 1,
        merchant_register_info: {},
        header: {
          main_title: main_title,
          sub_title: ""
        }
      })
      // 获取商家缓存信息
      this.queryMerchant(res => {
        console.log(res.data)
        const resultDataArray = res.data
        if (resultDataArray.length > 0) {
          const resultData = resultDataArray[0]
          const status = resultData.status
          let sub_title = ""
          // 待审核
          if (status == 1) {
            sub_title = "我们正在努力的审核中...请耐心等待一下"
          } else if (status == 2) {
            sub_title = "恭喜您申请成功"
          } else if (status == 3) {
            sub_title = "很抱歉申请信息可能有些问题，仔细检查后重新提交吧~"
          }

          this.setData({
            data_status: 2,
            merchant_register_info: resultData,
            header: {
              main_title: main_title,
              sub_title: sub_title
            }
          })
        } else {
          // 空数据
          this.setData({
            data_status: 4,
            merchant_register_info: {},
            header: {
              main_title: main_title,
              sub_title: "赶快填写你的信息吧~"
            }
          })
        }
      }, reason => {
        this.setData({
          data_status: 3,
          merchant_register_info: {}
        })
      })
    } else {
      this.setData({
        logined: app.globalData.logined,
        userInfo: app.globalData.userInfo,
        data_status: 1,
        merchant_register_info: {},
        header: {
          main_title: "未登录",
          sub_title: "赶快登陆完善你的信息吧~"
        }
      })
    }
  },

  /**
   * 插入或者更新一条数据
   **/
  setMerchant() {
    console.log("========== openid : " + this.data.userInfo.openid)
    // 先查询，再插入
    const db = wx.cloud.database()
    db.collection('merchants_register_info')
      .doc(this.data.userInfo.openid)
      .set({
        data: {
          "name": "军嫂家政",
          "address": "海淀区军嫂家政",
          "id_number": "1234567890",
          "business_license_number": "1234567890",
          "min_service_price": 15.6,
          "introduction": "致力于全球最好的家政服务",
          "phone_number": 15738898831,
          "merchant_open_id": this.data.userInfo.openid,
          "status": 1,
          _createTime: db.serverDate(),
          _updateTime: db.serverDate()
        }
      }).then(res => {
        console.log(res)
      }).catch(reason => {
        console.log(reason)
      })
  },

  // 查询一个商家
  queryMerchant(onSuccess, onFail) {
    const db = wx.cloud.database()
    db.collection('merchants_register_info')
      .where({
        merchant_open_id: this.data.userInfo.openid
      })
      .limit(1)
      .get()
      .then(onSuccess)
      .catch(onFail)
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

  login() {
    app.login(res => {
      // 登录成功，刷新用户状态
      this.refreshMerchant()
    }, reason => {
      console.log(reason)
    })
  }
})