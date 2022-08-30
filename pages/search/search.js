// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: "",
    companyList: [],
    // 0 默认 1 loading 2 success 3 errror 4  empty
    status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _searchKey = options.searchKey
    // 设置默认搜索词
    if (_searchKey) {
      this.setData({
        searchKey: _searchKey
      })
    }

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

  goToSearch(event) {
    const searchKey = event.detail.value.trim()
    const searchKeyLength = searchKey.length
    console.log(searchKeyLength)
    if (searchKeyLength == 0) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }

    // 开始搜索
    this.setData({
      status: 1
    })
    wx.showLoading({
      title: '搜索中...',
      icon: 'none'
    })
    const db = wx.cloud.database()
    const _ = db.command
    // 模糊匹配服务
    db.collection("merchants")
      .where({
        "scope_of_business": db.RegExp({
          regexp: searchKey
        })
      })
      //  最多获取50条
      .limit(50)
      .get()
      .then(res => {
        console.log(res.data)
        const resultData = res.data
        if (resultData.length > 0) {
          this.setData({
            status: 2,
            companyList: resultData
          })
        } else {
          // 空数据
          this.setData({
            status: 4,
            companyList: []
          })
        }
        wx.hideLoading({
          success: (res) => {},
        })
      }).catch(reason => {
        this.setData({
          status: 3,
          companyList: []
        })
        wx.hideLoading({
          success: (res) => {},
        })
      })
  },

  onFocus(event) {
    // 输入框获得焦点，重置状态
    this.setData({
      status: 0
    })
  }
})