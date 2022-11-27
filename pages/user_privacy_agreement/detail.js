// pages/news_rich_text_detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newId: "",
    newItem: {},
    // 0 加载中  1 success 2 error 3 empty
    status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '平台用户协议',
    })
    this.loadUserPrivacyAgreement()
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

  loadUserPrivacyAgreement() {
    this.setData({
      status: 0
    })
    // 请求新闻富文本数据
    const db = wx.cloud.database()
    db.collection('user_privacy_agreement')
      .where({
        status: 0,
        type: 0
      })
      .limit(1)
      .get()
      .then(res => {
        console.log(res)
        const _newItem = res.data[0]
        if (_newItem) {
          this.setData({
            newItem: _newItem,
            status: 1
          })

        } else {
          this.setData({
            status: 3
          })
        }
      }).catch(reason => {
        console.log(reason)
        this.setData({
          status: 2
        })
      })
  }
})