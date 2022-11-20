// pages/merchant_detail/merchant_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    merchant_detail_info: {},
    //0 加载中  1 加载成功 2 加载失败 3 加载为空
    status: 0,
    is_merchant: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const _id = options._id
    this.setData({
      id: _id
    })
    this.queryMerchant(res => {
      const merchant_detail_info_array = res.result.list
      if (merchant_detail_info_array.length > 0) {
        const merchant_detail_info = merchant_detail_info_array[0]
        this.setData({
          status: 1,
          merchant_detail_info: merchant_detail_info
        })
      } else {
        this.setData({
          status: 3
        })
      }
    }, reason => {
      console.log(reason)
      this.setData({
        status: 2
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

  queryMerchant(onSuccess, onFail) {
    this.data.isRefreshLoading = true
    wx.cloud.callFunction({
        name: "query_merchant",
        data: {
          merchant_id: this.data.id
        }
      }).then(res => {
        onSuccess(res)
      })
      .catch(reason => {
        onFail(reason)
      })
  },

  callPhone() {
    wx.showActionSheet({
      itemList: ["呼叫 " + this.data.merchant_detail_info.phone],
      success: res => {
        console.log(res)
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: this.data.merchant_detail_info.phone,
          })
        }
      }
    })
  },

  subscribe() {
    // 判断用户是否登录

    wx.navigateTo({
      url: '/pages/merchant_subscribe/merchant_subscribe?service_merchant_name=' + this.data.merchant_detail_info.name + "&merchant_id=" + this.data.merchant_detail_info._id + "&merchant_open_id=" + this.data.merchant_detail_info.merchant_open_id + "&merchant_phone=" + this.data.merchant_detail_info.phone
    })
  },

  evaluate() {
    wx.navigateTo({
      url: '/pages/evaluate/evaluate',
    })
  },

  collect() {
    wx.showToast({
      title: '已收藏',
    })
  },

  // 家政人员预约
  immediately_subscribe(e) {
    // 判断用户是否登录
    const merchant_id = e.currentTarget.dataset.merchant_id
    const merchant_name = this.data.merchant_detail_info.name
    const service_person_name = e.currentTarget.dataset.service_person_name
    const service_person_id = e.currentTarget.dataset.service_person_id
    const service_name = e.currentTarget.dataset.service_name
    console.log("家政人员服务名称：" + service_person_name)
    console.log("家政人员服务ID" + service_person_id)
    console.log("家政人员服务类型" + service_name)
    wx.navigateTo({
      url: '/pages/merchant_subscribe/merchant_subscribe?service_merchant_name=' + merchant_name +
        "&merchant_id=" + merchant_id +
        "&merchant_open_id=" + this.data.merchant_detail_info.merchant_open_id +
        "&merchant_phone=" + this.data.merchant_detail_info.phone +
        "&service_person_name=" + service_person_name +
        "&service_person_id=" + service_person_id +
        "&service_type=" + service_name
    })
  },

  enter_service_person_detail(e) {
    const item = e.currentTarget.dataset.item
    item.merchant_open_id = this.data.merchant_detail_info.merchant_open_id
    item.phone = this.data.phone
    item.name = this.data.merchant_detail_info.name
    console.log(e)
    wx.navigateTo({
      url: '/pages/service_person_detail/service_person_detail?item=' + JSON.stringify(item),
    })
  }

})