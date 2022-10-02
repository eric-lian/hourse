// pages/look_service/look_service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    services: [{
        name: "保姆",
        kinds: [{
          name: "住家型",
          desc: "日常家务、做饭、服务时间6：00-21：00",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/保姆/住家型.png"
        }, {
          name: "早出晚归型",
          desc: "日常家务、做饭、服务时间协商约定",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/保姆/早出晚归型.png"
        }, {
          name: "半日型",
          desc: "日常家务、做饭、服务时间8：00-12：00或14：00-18：00",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/保姆/半日型.png"
        }]
      },
      {
        name: "月嫂",
        kinds: [{
          name: "初级住家型",
          desc: "产妇、婴儿护理、服务时间全天24小时。",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/月嫂/初级住家型.png"
        }, {
          name: "初级早出晚归型",
          desc: "产妇、婴儿护理、服务时间9：00-19:00。",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/月嫂/初级早出晚归型.png"
        }, {
          name: "中级住家型",
          desc: "产妇、婴儿护理、服务时间全天24小时。",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/月嫂/中级住家型.png"
        }, {
          name: "中级早出晚归型",
          desc: "产妇、婴儿护理、服务时间全天24小时。",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/月嫂/中级早出晚归型.png"
        }, {
          name: "高级住家型",
          desc: "产妇、婴儿护理、服务时间全天24小时。",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/月嫂/高级住家型.png"
        }, {
          name: "高级早出晚归型",
          desc: "产妇、婴儿护理、服务时间9：00-19:00。",
          img: "cloud://house-keeping-7gact5ex37e05233.686f-house-keeping-7gact5ex37e05233-1313608840/services_list/月嫂/高级早出晚归型.png"
        }]
      }
    ],
    currentSelectIndex: 0,
    currentKinds: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '找服务',
    })
    // this.data.currentKinds = this.data.services[this.data.currentSelectIndex].kinds
    this.setData({
      currentKinds: this.data.services[this.data.currentSelectIndex].kinds
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

  onSwitchServiceMenu(e) {
    const index = e.currentTarget.dataset.index
    console.log(index)
    if (this.data.currentSelectIndex == index) {
      return
    }
    this.setData({
      currentSelectIndex: index,
      currentKinds: this.data.services[index].kinds
    })
  },

  onSelectServiceKind(e) {
    const parent_index = e.currentTarget.dataset.parent_index
    // console.log(parent_index)
    const keyword = this.data.services[parent_index].name
    wx.navigateTo({
      url: '/pages/search/search?searchKey=' + keyword + "&showSearchBar=false",
    })
  }
})