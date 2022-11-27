// pages/home/home.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    firstRow: [],
    sencondRow: [],
    thridRow: [],
    homeNews: [],
    statusBarHeight: 0,
    navigationBarHeight: 0,
    indexDataSuccess: false,
    topNavContainerHeight: 0,
    topNavContainerBg: "rgba(96,207,156,0)",
    nav_opacity: 1
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const menus = app.globalData.menus
    this.setData({
      firstRow: menus.slice(0, 4),
      sencondRow: menus.slice(4, 8),
      thridRow: menus.slice(8, 12),
      statusBarHeight: app.globalData.statusBarHeight,
      navigationBarHeight: app.globalData.navigationBarHeight
    })

    this.setData({
      topNavContainerHeight: this.data.statusBarHeight + this.data.navigationBarHeight
    })

    // 请求首屏banner数据
    this.requestBanners()
    //  请求首页新闻列表数据
    this.requestHomeNews()
    //  请求附近商家数据
    if (app.isNullOrEmpty(options.refresh_news)) {
      this.requestNearby()
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

  onPageScroll(options) {
    // const _scrollTop = Math.min(options.scrollTop, this.data.topNavContainerHeight)
    // // const _alpha = Math.round(_scrollTop / this.data.topNavContainerHeight) 
    // const _alpha = 1
    // const _topNavContainerBg = "rgba(23,115,215," + _alpha + ")"
    // console.log(_topNavContainerBg)
    // if (this.data.topNavContainerBg === _topNavContainerBg) {
    //   return
    // }
    // this.setData({
    //   topNavContainerBg: _topNavContainerBg,
    //   nav_opacity: 1 - _alpha
    // })
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

  // 请求首页数据
  requestBanners() {
    const db = wx.cloud.database()
    db.collection('banners')
      .field({
        status: false,
        weight: false,
        _updateTime: false
      })
      .where({
        status: 1
      })
      // .orderBy('weight', 'desc')
      .limit(10)
      .get()
      .then(res => {
        const _banners = res.data
        // 有效数据更新数据
        if (_banners.length > 0) {
          this.setData({
            banners: _banners
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 请求新闻数据
  requestHomeNews() {
    console.log("=================requestHomeNews")
    console.log(app.globalData.globalConfig)
    // 服务端控制下线
    if (app.globalData.globalConfig.home_news != 1) {
      return
    }
    const db = wx.cloud.database()
    db.collection("home_news")
      .field({
        content: false,
        status: false,
        weight: false,
        _updateTime: false
      })
      .where({
        status: 1
      })
      .orderBy('weight', 'desc')
      .limit(50)
      .get()
      .then(res => {
        const _homeNews = res.data
        // 有效数据更新数据
        if (_homeNews.length > 0) {
          this.setData({
            homeNews: _homeNews
          })
          console.log(_homeNews)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },

  onMenuClick: function (e) {
    var type = e.currentTarget.dataset.type
    // 等于更多服务
    if (type == 13) {
      this.onLookService()
      return
    }
    const menus = app.globalData.menus
    const serviceName = menus.find((value, index) => {
      return value.type == type
    }).name

    if (["保洁", "母婴护理", "保姆", "养老护理"].indexOf(serviceName) >= 0) {
      // 找服务页面选中指定的服务名
      app.globalData.defaultLookServiceName = serviceName
      wx.switchTab({
        url: '/pages/look_service/look_service',
      })
      return
    }
    var name = e.currentTarget.dataset.name
    console.log(e)
    wx.navigateTo({
      url: '/pages/search/search?searchShowKey=' + name
    })
  },

  onSwiperItemClick: function (e) {
    const index = e.currentTarget.dataset.index
    const banner = this.data.banners[index]
    const type = banner.type
    const jump_detail_link = banner.jump_detail_link
    console.log("onSwiperItemClick: " + type)
    if (type == 4 && !getApp().isNullOrEmpty(jump_detail_link)) {
      wx.switchTab({
        url: jump_detail_link,
      })
    }

  },

  onSearchBarClick(e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  onHomeTouchMove(e) {
    console.log(e)
  },

  onNewItemTap(e) {
    const newId = e.currentTarget.dataset.new_id
    console.log(e)
    wx.navigateTo({
      url: '/pages/news_rich_text_detail/detail?newId=' + newId,
    })
  },

  onLookMerchant() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  onLookService() {
    wx.switchTab({
      url: '/pages/look_service/look_service',
    })
  },

  onMerchantEnter() {
    wx.navigateTo({
      url: '/pages/tab/merchants/merchants',
    })
  },

  requestNearby() {
    app.getLocation(res => {

    }, fail => {

    })
  }
})