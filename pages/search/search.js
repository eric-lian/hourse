// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchShowKey: "",
    companyList: [],
    // 0 默认 1 loading 2 success 3 errror 4  empty
    status: 0,
    focus: false,
    showSearchBar: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _searchShowKey = options.searchShowKey
    const _searchKey = options.searchKey
    const _showSearchBar = options.showSearchBar
    console.log(_showSearchBar)
    // 设置默认搜索词 , 有默认搜索词，直接搜索
    if (!getApp().isNullOrEmpty(_searchKey)) {
      this.setData({
        searchShowKey: _searchShowKey,
        focus: false,
        showSearchBar: _showSearchBar
      })
      this._goToSearch(_searchKey)
    } else {
      this.setData({
        focus: true,
        showSearchBar: _showSearchBar
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
    this._goToSearch(this.data.searchShowKey)
  },

  _goToSearch(searchKey) {
    if (getApp().isNullOrEmpty(searchKey)) {
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

    wx.cloud.callFunction({
        name: "search_merchant",
        data: {
          searchKey: searchKey
        }
      })
      .then(res => {
        console.log(res.result.data)
        const resultData = res.result.data
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
    this.data.status = 0
    this.data.focus = true
    this.setData(this.data)
  },

  gotoDetail(event) {
    const _id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/merchant_detail/merchant_detail?_id=' + _id,
    })
  },

  gotoGuidePrice() {
    wx.previewImage({
      urls: ["cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/price_guide_20220927102917_00.png"],
    })
    // wx.navigateTo({
    //   url: '/pages/price_guide/price_guide',
    // })
  },

  onSearchInputChanged(event) {
    this.setData({
      searchShowKey: event.detail.value
    })
  }
})