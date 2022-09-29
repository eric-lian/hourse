// pages/merchant_detail/merchant_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    merchant_detail_info: {}
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
      console.log(res)
      const merchant_detail_info_array = res.data
      if (merchant_detail_info_array.length > 0) {
        const merchant_detail_info = merchant_detail_info_array[0]
        this.setData({
          merchant_detail_info: merchant_detail_info
        })
      } else {
        // @TODO
      }
    }, reason => {
      console.log(reason)
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
    const db = wx.cloud.database()
    db.collection('merchants')
      .where({
        _id: this.data.id
      })
      .limit(1)
      .get()
      .then(res => {
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
        if(res.tapIndex == 0){
          wx.makePhoneCall({
            phoneNumber: this.data.merchant_detail_info.phone,
          })
        }
      }
    })
  },

  subscribe(){
    wx.navigateTo({
      url: '/pages/merchant_subscribe/merchant_subscribe?service_merchant_name='+ this.data.merchant_detail_info.name + "&merchant_id=" + this.data.merchant_detail_info._id,
    })
  },

  evaluate() {
    wx.navigateTo({
      url: '/pages/evaluate/evaluate',
    })
  }
})