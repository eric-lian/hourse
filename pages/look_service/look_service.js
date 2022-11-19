// pages/look_service/look_service.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    services: [],
    currentSelectIndex: 0,
    // 0 loading 1 fail 2 empty 3 success
    status: 0,
    topNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '找服务',
    })
    this.loadService()
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
    // 获取当前全局配置指定选中服务名
    const defaultLookServiceName = getApp().globalData.defaultLookServiceName
    console.log("===============" + defaultLookServiceName)
    // 查找与当前选中的是否相同
    let selectIndex = this.data.currentSelectIndex
    console.log(selectIndex)
    this.data.services.find((value, index) => {
      if (value._id == defaultLookServiceName) {
        selectIndex = index
        return true
      }
    })
    console.log(selectIndex)
    console.log(defaultLookServiceName)
    this.switchItem(selectIndex)
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

  onSwitchServiceMenu(e) {
    const index = e.currentTarget.dataset.index
    console.log(index)
    this.switchItem(index)
  },
  switchItem(index) {
    if (this.data.currentSelectIndex == index) {
      return
    }
    getApp().globalData.defaultLookServiceName = this.data.services[index]._id
    this.setData({
      currentSelectIndex: index,
      topNum: 0
    })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        duration: 0,
        scrollTop: 0
      })
    }
  },
  loadService() {
    this.setData({
      status: 0
    })
    wx.cloud.callFunction({
      name: "look_services"
    }).then(res => {
      const list = res.result.list
      // 1 判断list 是否为空
      if (list.length > 0) {
        // 不为空赋值数据 , 默认选中第一个数据
        this.setData({
          services: list,
          status: 3
        })
        console.log
      } else {
        // 为空展示空数据
        this.setData({
          status: 2
        })
      }
      console.log(list)
    }).catch(reason => {
      console.log(reason)
      // 网络异常
      this.setData({
        status: 1
      })
    });
  },

  immediately_subscribe(e) {
    console.log(e)
    const merchant_id = e.currentTarget.dataset.merchant_id
    const merchant_name = e.currentTarget.dataset.merchant_name
    const service_person_name = e.currentTarget.dataset.service_person_name
    const service_person_id = e.currentTarget.dataset.service_person_id
    const service_name = e.currentTarget.dataset.service_name
    const merchant_phone = e.currentTarget.dataset.phone
    const merchant_open_id = e.currentTarget.dataset.merchant_open_id
    console.log(merchant_id)
    wx.navigateTo({
      url: '/pages/merchant_subscribe/merchant_subscribe?service_merchant_name=' + merchant_name +
      "&merchant_id=" + merchant_id +
      "&merchant_open_id=" + merchant_open_id +
      "&merchant_phone=" + merchant_phone +
      "&service_person_name=" + service_person_name +
      "&service_person_id=" + service_person_id +
      "&service_type=" + service_name
    })
  },
  gotoMerchantDetail(e) {
    console.log(e)
    const _id = e.currentTarget.dataset.merchant_id
    wx.navigateTo({
      url: '/pages/merchant_detail/merchant_detail?_id=' + _id,
    })
  },

  immediately_call(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }
})