// pages/home/home.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    menus: [{
        name: "保洁",
        search_key: ["保洁"],
        icon: "/pages/images/menu/baojie.png",
        type: "0"
      },
      {
        name: "母婴护理",
        search_key: ["母婴", "护理", "月嫂", "母婴护理", "育婴师"],
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
        search_key: ["疏通", "管道", "疏通管道", "疏通管道"],
        icon: "/pages/images/menu/guandao.png",
        type: "3"
      },
      {
        name: "水电安装",
        search_key: ["水电", "安装", "水电安装"],
        icon: "/pages/images/menu/shuidiananzhuang.png",
        type: "4"
      }, {
        name: "家电清洗",
        search_key: ["家电", "清洗", "家电清洗"],
        icon: "/pages/images/menu/jiadianqingxi.png",
        type: "5"
      }, {
        name: "家电维修",
        search_key: ["家电", "维修", "家电维修"],
        icon: "/pages/images/menu/jiadianweixiu.png",
        type: "6"
      }, {
        name: "养老护理",
        search_key: ["养老", "护理", "养老护理", "护工", "老年", "护理", "老年护理",
          "病人陪护"
        ],
        icon: "/pages/images/menu/yanglaohuli.png",
        type: "7"
      }, {
        name: "搬家",
        search_key: ["搬家"],
        icon: "/pages/images/menu/banjia.png",
        type: "8"
      }, {
        name: "收纳干洗",
        search_key: ["收纳", "干洗", "收纳干洗"],
        icon: "/pages/images/menu/shounaganxi.png",
        type: "9"
      },

      // {
      //   name: "甲醛治理",
      //   search_key: ["甲醛", "治理", "甲醛治理"],
      //   icon: "/pages/images/menu/jiaquanzhili.png",
      //   type: "11"
      // },

      {
        name: "家政培训",
        search_key: ["家政培训"],
        icon: "/pages/images/menu/jiazhengpeixun.png",
        type: "12"
      },
      {
        name: "更多服务",
        search_key: [""],
        icon: "/pages/images/menu/gengduofuwu.png",
        type: "13"
      }
    ],
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

    this.setData({
      firstRow: this.data.menus.slice(0, 4),
      sencondRow: this.data.menus.slice(4, 8),
      thridRow: this.data.menus.slice(8, 12),
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
    // 等于更多服务
    if (type == 13) {
      this.onLookService()
      return
    }
    var name = e.currentTarget.dataset.name
    console.log(e)
    var search_key = null
    // 查找服务端增强关键词
    const serverSearchKeyObj = app.globalData.homeSearchKeyOptimized.find(res => {
      return type == res.type
    })
    if (serverSearchKeyObj != undefined &&
      serverSearchKeyObj != null &&
      serverSearchKeyObj.search_key.length > 0) {
      search_key = serverSearchKeyObj.search_key
      console.log("用服务端缓存关键词搜索：")
      console.log(search_key)
    }

    if (search_key == null) {
      // 获取搜索的内容
      const menu = this.data.menus.find(res => {
        return type == res.type
      })
      search_key = menu.search_key
      console.log("用客户单缓存关键词搜索：")
      console.log(search_key)
    }

    // 拼接正则匹配表达式
    const joinMatchRegex = search_key.join('|')
    console.log("===" + joinMatchRegex)
    wx.navigateTo({
      url: '/pages/search/search?searchKey=' + joinMatchRegex + '&searchShowKey=' + name
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
  }

})