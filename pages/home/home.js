// pages/home/home.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [{
      img_url: "https://686f-house-keeping-7gact5ex37e05233-1313608840.tcb.qcloud.la/cloudbase-cms/upload/2022-08-31/knqggo8ef31lhpzw61rm6kmgdvjvq5ff_.png",
      type: 3
    }],
    firstRow: [{
      name: "找保洁",
      search_key: ["保洁", "找保洁"],
      icon: "/pages/images/menu/zhaobaojie.png",
      type: "0"
    }, {
      name: "找月嫂",
      search_key: ["月嫂", "找月嫂"],
      icon: "/pages/images/menu/zhaoyuesao.png",
      type: "1"
    }, {
      name: "找保姆",
      search_key: ["保姆", "找保姆"],
      icon: "/pages/images/menu/zhaobaomu.png",
      type: "2"
    }, {
      name: "找陪护",
      search_key: ["陪护", "找陪护"],
      icon: "/pages/images/menu/zhaopeihu.png",
      type: "3"
    }, {
      name: "擦玻璃",
      search_key: ["擦玻璃", "玻璃"],
      icon: "/pages/images/menu/caboli.png",
      type: "4"
    }],
    sencondRow: [{
      name: "疏通管道",
      search_key: ["疏通", "管道", "疏通管道"],
      icon: "/pages/images/menu/shutongguandao.png",
      type: "5"
    }, {
      name: "修电路",
      search_key: ["电路", "修电路"],
      icon: "/pages/images/menu/xiudianlu.png",
      type: "6"
    }, {
      name: "修家电",
      search_key: ["家电", "修家电"],
      icon: "/pages/images/menu/xiujiadian.png",
      type: "7"
    }, {
      name: "清空调",
      search_key: ["清空调", "空调"],
      icon: "/pages/images/menu/qingkongtiao.png",
      type: "8"
    }, {
      name: "房屋维修",
      search_key: ["房屋", "维修", "房屋维修"],
      icon: "/pages/images/menu/fangwuweixiu.png",
      type: "9"
    }],
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
    this.setData({
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
    const _scrollTop = Math.min(options.scrollTop, this.data.topNavContainerHeight)
    const _alpha = Math.round(_scrollTop / this.data.topNavContainerHeight)
    const _topNavContainerBg = "rgba(96,207,156," + _alpha + ")"
    // console.log(_topNavContainerBg)
    if (this.data.topNavContainerBg === _topNavContainerBg) {
      return
    }
    this.setData({
      topNavContainerBg: _topNavContainerBg,
      nav_opacity: 1 - _alpha
    })
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
      // .orderBy('weig', 'desc')
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
      // .orderBy('createTime', 'desc')
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
    // 获取搜索的内容
    const typeToSearchKeyArray = app.globalData.typeToSearchKeyArray
    console.log(typeToSearchKeyArray)
    const typeToSearchKey = typeToSearchKeyArray.find(res => {
      return type == res.type
    })
    // 拼接正则匹配表达式
    const joinMatchRegex = typeToSearchKey.search_key.join('|')

    wx.navigateTo({
      url: '/pages/search/search?searchKey=' + joinMatchRegex
    })
  },

  onSwiperItemClick: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
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
  }


})