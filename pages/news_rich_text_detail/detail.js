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
    const _newId = options.newId
    console.log("======" + _newId)
    this.setData({
      newId: _newId
    })
    this.loadNewItem()
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

  loadNewItem() {
    this.setData({
      status: 0
    })
    // 请求新闻富文本数据
    const db = wx.cloud.database()
    db.collection('home_news').field({
        title: true,
        content: true
      }).where({
        _id: this.data.newId
      }).limit(1)
      .get()
      .then(res => {
        const newsArray = res.data
        console.log(res)
        if (newsArray.length > 0) {
          const _newItem = newsArray[0]
          // 图片大小自适应
          const adaptImgTagContent = _newItem.content.replace(/\<img/gi, '<img style="width:100%;height:auto"');
          _newItem.content = adaptImgTagContent
          this.setData({
            newItem: newsArray[0],
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