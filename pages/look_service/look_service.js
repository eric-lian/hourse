// pages/look_service/look_service.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    services: [],
    currentSelectIndex: 0,
    // 0 loading 1 fail 2 empty 3 success
    status: 0,
    topNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '找服务',
    })
    this.loadService()
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
    // 获取当前全局配置指定选中服务名
    const defaultLookServiceName = getApp().globalData.defaultLookServiceName
    console.log("===============" + defaultLookServiceName)
    // 查找与当前选中的是否相同
    let selectIndex = this.data.currentSelectIndex
    console.log(selectIndex)
    this.data.services.find((value, index) => {
      if (value._id == defaultLookServiceName) {
        selectIndex = index
        return true
      }
    })
    console.log(selectIndex)
    console.log(defaultLookServiceName)
    this.switchItem(selectIndex)
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
    this.switchItem(index)
  },
  switchItem(index) {
    if (this.data.currentSelectIndex == index) {
      return
    }
    getApp().globalData.defaultLookServiceName = this.data.services[index]._id
    this.setData({
      currentSelectIndex: index,
      topNum: 0
    })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        duration: 0,
        scrollTop: 0
      })
    }
  },
  loadService() {
    this.setData({
      status: 0
    })
    wx.cloud.callFunction({
      name: "look_services"
    }).then(res => {
      const list = res.result.list
      // 1 判断list 是否为空
      if (list.length > 0) {
        // 为每一组数据设置一个默认的过滤条件
        // 不为空赋值数据 , 默认选中第一个数据
        list.forEach(value => {
          value.filter_list = [{
            // 工龄
            key: 'work_begin_date',
            filters: [{
              key: 'all',
              name: '全部',
              nick: "从业年限",
              selected: true,
              sort: 0
            }, {
              key: 'down',
              name: '由高到低',
              nick: "从业年限",
              selected: false,
              sort: 1
            }, {
              key: 'up',
              name: '由低到高',
              nick: "从业年限",
              selected: false,
              sort: -1
            }],
            selected: false
          }, {
            // 年龄
            key: 'brithday',
            filters: [{
              key: 'all',
              name: '全部',
              nick: "年龄",
              selected: true,
              sort: 0
            }, {
              key: 'down',
              name: '由高到低',
              nick: "年龄",
              selected: false,
              sort: 1
            }, {
              key: 'up',
              name: '由低到高',
              nick: "年龄",
              selected: false,
              sort: -1
            }],
            selected: false
          }, {
            // 性别
            key: 'province',
            filters: [{
              key: 'all',
              name: '全部',
              nick: "性别",
              selected: true,
              sort: 0
            }, {
              key: 'down',
              name: '男',
              nick: "性别",
              selected: false,
              sort: -1
            }, {
              key: 'up',
              name: '女',
              nick: "性别",
              selected: false,
              sort: 1
            }],
            selected: false
          }]
          value.current_filter_click = undefined
        })
        this.setData({
          services: list,
          status: 3
        })
        console.log
      } else {
        // 为空展示空数据
        this.setData({
          status: 2
        })
      }
      console.log(list)
    }).catch(reason => {
      console.log(reason)
      // 网络异常
      this.setData({
        status: 1
      })
    });
  },

  immediately_subscribe(e) {
    console.log(e)
    const merchant_id = e.currentTarget.dataset.merchant_id
    const merchant_name = e.currentTarget.dataset.merchant_name
    const service_person_name = e.currentTarget.dataset.service_person_name
    const service_person_id = e.currentTarget.dataset.service_person_id
    const service_name = e.currentTarget.dataset.service_name
    const merchant_phone = e.currentTarget.dataset.phone
    const merchant_openid = e.currentTarget.dataset.merchant_openid
    console.log(merchant_id)
    wx.navigateTo({
      url: '/pages/merchant_subscribe/merchant_subscribe?service_merchant_name=' + merchant_name +
        "&merchant_id=" + merchant_id +
        "&merchant_openid=" + merchant_openid +
        "&merchant_phone=" + merchant_phone +
        "&service_person_name=" + service_person_name +
        "&service_person_id=" + service_person_id +
        "&service_type=" + service_name
    })
  },
  gotoMerchantDetail(e) {
    console.log(e)
    const _id = e.currentTarget.dataset.merchant_id
    wx.navigateTo({
      url: '/pages/merchant_detail/merchant_detail?_id=' + _id,
    })
  },
  immediately_call(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  enter_service_person_detail(e) {
    console.log(e)
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/service_person_detail/service_person_detail?item=' + JSON.stringify(item),
    })
  },

  closeFilter() {
    return true
  },

  onFilterClick(e) {
    const key = e.currentTarget.dataset.key
    // 获取当前是否选中， 如果当前被选中，则取消选中，并关闭弹窗对象
    const current_service = this.data.services[this.data.currentSelectIndex];
    const filter_list = current_service.filter_list
    const current_filter_click = filter_list.find(res => {
      return res.key == key
    })

    // 当前未被选中， 需要重置所有的条件为未选中状态
    if (!current_filter_click.selected) {
      filter_list.forEach(value => {
        value.selected = false
      })
      // 设置当前变量条件被选中
      current_filter_click.selected = true
      current_service.current_filter_click = current_filter_click
    } else {
      // 当前已经被选中
      current_filter_click.selected = false
      current_service.current_filter_click = undefined
    }
    console.log(current_filter_click)
    // 设置当前对象被选中
    this.setData({
      services: this.data.services
    })
  },
  close_filter_click(e) {
    const current_filter_click = this.data.services[this.data.currentSelectIndex].current_filter_click
    console.log("===============")
    console.log(current_filter_click)
    if (current_filter_click) {
      current_filter_click.selected = false
      this.data.services[this.data.currentSelectIndex].current_filter_click = undefined
      this.setData({
        services: this.data.services
      })
    }

  },
  // 点击了搜索条件 ，设置当前搜索选中的数据
  onEleSelected(e) {
    // 已经选中的不会再选中
    // 先获取当前过滤类型展示的对象
    const current_filter_click = this.data.services[this.data.currentSelectIndex].current_filter_click
    console.log(e)
    console.log(current_filter_click)
    // 先获取点击的那个类型的标签
    const key = e.currentTarget.dataset.key
    const ele_key = e.currentTarget.dataset.ele_key
    // 遍历设置标签选中状态
    current_filter_click.filters.forEach(value => {
      value.selected = ele_key == value.key
    })
    current_filter_click.selected = false
    // 关闭标签
    console.log(current_filter_click)
    this.setData({
      services: this.data.services
    })
    this.data.services[this.data.currentSelectIndex].current_filter_click = undefined
    this.setData({
      services: this.data.services
    })
    wx.showLoading({
      title: '加载中...',
    })
    // 根据当前的查词结果进行排序
    wx.cloud.callFunction({
      name: 'look_services_filter',
      data: {
        service_name: this.data.services[this.data.currentSelectIndex]._id,
        filters: this.data.services[this.data.currentSelectIndex].filter_list,
        key: key
      }
    }).then(res => {
      const result = res.result.list[0]
      const service = this.data.services.find(service => {
        return service._id == result._id
      })
      service.list = result.list
      this.setData({
        services: this.data.services
      })
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败,请稍后再试~',
      })
    })
  }
})