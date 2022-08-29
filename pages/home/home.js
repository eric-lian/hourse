// pages/home/home.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [{
      img_url: "cloud://miniprogram-test-4fzwowo753c99a4.6d69-miniprogram-test-4fzwowo753c99a4-1313410386/banner/Banner.png"
    }, {
      img_url: "cloud://miniprogram-test-4fzwowo753c99a4.6d69-miniprogram-test-4fzwowo753c99a4-1313410386/banner/Banner.png"
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
    statusBarHeight: 0,
    navigationBarHeight: 0,
    indexDataSuccess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navigationBarHeight: app.globalData.navigationBarHeight
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


  refreshIndexData() {
    const db = wx.cloud.database()
    db.collection('banners')
      .where({
        status: '1'
      }).orderBy('createTime', 'desc')
      .limit(10)
      .get()
      .then(res => {
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  },

  onMenuClick: function (e) {
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/company_type_list/company_type_list?type=' + type,
    })
  },

  onSwiperItemClick: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
  },

  onSearchBarClick(e) {
    wx.showToast({
      title: '点击搜索栏'
    })
  }


})