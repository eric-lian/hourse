// pages/home/home.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [{
      img_url: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/banner/Frame 43.png",
      type: 3
    }],

    firstRow: [{
        name: "保洁",
        search_key: ["保洁"],
        icon: "/pages/images/menu/baojie.png",
        type: "0"
      },
      {
        name: "母婴护理",
        search_key: ["母婴护理"],
        icon: "/pages/images/menu/muyinghuli.png",
        type: "1"
      }, {
        name: "保姆",
        search_key: ["保姆"],
        icon: "/pages/images/menu/baomu.png",
        type: "2"
      },
      {
        name: "疏通管道",
        search_key: ["疏通", "管道", "疏通管道"],
        icon: "/pages/images/menu/guandao.png",
        type: "3"
      }
    ],
    sencondRow: [{
      name: "水电安装",
      search_key: ["水电安装"],
      icon: "/pages/images/menu/shuidiananzhuang.png",
      type: "4"
    }, {
      name: "家电清洗",
      search_key: ["家电清洗", "家电清洗"],
      icon: "/pages/images/menu/jiadianqingxi.png",
      type: "5"
    }, {
      name: "家电维修",
      search_key: ["家电", "家电维修"],
      icon: "/pages/images/menu/jiadianweixiu.png",
      type: "6"
    }, {
      name: "养老护理",
      search_key: ["养老", "护理", "养老护理"],
      icon: "/pages/images/menu/yanglaohuli.png",
      type: "7"
    }],
    thridRow: [{
      name: "搬家",
      search_key: ["搬家"],
      icon: "/pages/images/menu/banjia.png",
      type: "8"
    }, {
      name: "收纳干洗",
      search_key: ["收纳干洗"],
      icon: "/pages/images/menu/shounaganxi.png",
      type: "9"
    }, {
      name: "甲醛治理",
      search_key: ["甲醛治理"],
      icon: "/pages/images/menu/jiaquanzhili.png",
      type: "11"
    }, {
      name: "家政培训",
      search_key: ["家政培训"],
      icon: "/pages/images/menu/jiazhengpeixun.png",
      type: "12"
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
        status: 0
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
    var name = e.currentTarget.dataset.name
    // 获取搜索的内容
    // const typeToSearchKeyArray = app.globalData.typeToSearchKeyArray
    // console.log(typeToSearchKeyArray)
    // const typeToSearchKey = typeToSearchKeyArray.find(res => {
    //   return type == res.type
    // })
    // 拼接正则匹配表达式
    // const joinMatchRegex = typeToSearchKey.search_key.join('|')

    wx.navigateTo({
      url: '/pages/search/search?searchKey=' + name
    })
  },

  onSwiperItemClick: function (e) {
    const index = e.currentTarget.dataset.index
    const banner = this.data.banners[index]
    const type = banner.type
    const jump_detail_link = banner.jump_detail_link
    console.log("onSwiperItemClick: " + type)
    if (type == 4 && !getApp().inputIsEmpty(jump_detail_link)) {
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
    wx.navigateTo({
      url: '/pages/look_service/look_service',
    })
  },

  onMerchantEnter() {
    wx.navigateTo({
      url: '/pages/tab/merchants/merchants',
    })
  }

})