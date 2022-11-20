// pages/service_person_detail/service_person_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '服务人员详情',
    })
    const _service_person_detail = JSON.parse(options.item)
    console.log(_service_person_detail)
    this.setData(_service_person_detail)
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
  previewCertificatePhotos(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.certificate_photos,
      current: this.data.certificate_photos[index]
    })
  },
  immediately_subscribe(e) {
    console.log(e)
    const merchant_id = this.data.company_name
    const merchant_name = this.data.name
    const service_person_name = this.data.service_person_name
    const service_person_id = this.data._id
    const service_name = this.data.service_name
    const merchant_phone = this.data.phone
    const merchant_open_id = this.data.merchant_open_id
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
})