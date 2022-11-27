// pages/search/search.js
const app = getApp()
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
    showSearchBar: true,
    filter_list: [{
      // 好评
      key: 'evaluation_stars',
      filters: [{
        key: 'all',
        name: '全部',
        nick: "好评",
        selected: true,
        sort: 0
      }, {
        key: 'down',
        name: '由高到低',
        nick: "好评",
        selected: false,
        sort: 1
      }, {
        key: 'up',
        name: '由低到高',
        nick: "好评",
        selected: false,
        sort: -1
      }],
      selected: false
    }, {
      // 距离
      key: 'distance',
      filters: [{
        key: 'all',
        name: '全部',
        nick: "距离",
        selected: true,
        sort: 0
      }, {
        key: 'down',
        name: '由近到远',
        nick: "距离",
        selected: false,
        sort: 1
      }, {
        key: 'up',
        name: '由远到近',
        nick: "距离",
        selected: false,
        sort: -1
      }],
      selected: false
    }, {
      // 服务类型
      key: 'service_type',
      filters: [{
          key: '.*',
          name: '全部',
          nick: "服务类型",
          selected: true,
          sort: 0
        }, {
          key: '保洁',
          name: '保洁',
          nick: "服务类型",
          selected: false,
          sort: -1
        },
        {
          key: '母婴护理',
          name: '母婴护理',
          nick: "服务类型",
          selected: false,
          sort: -1
        },

        {
          key: '保姆',
          name: '保姆',
          nick: "服务类型",
          selected: false,
          sort: -1
        },

        {
          key: '水电安装',
          name: '水电安装',
          nick: "服务类型",
          selected: false,
          sort: -1
        },

        {
          key: '家电清洗',
          name: '家电清洗',
          nick: "服务类型",
          selected: false,
          sort: -1
        },

        {
          key: '家电维修',
          name: '家电维修',
          nick: "服务类型",
          selected: false,
          sort: -1
        },

        {
          key: '养老护理',
          name: '养老护理',
          nick: "服务类型",
          selected: false,
          sort: -1
        }

        , {
          key: '搬家',
          name: '搬家',
          nick: "服务类型",
          selected: false,
          sort: -1
        }

        , {
          key: '收纳干洗',
          name: '收纳干洗',
          nick: "服务类型",
          selected: false,
          sort: -1
        }

        , {
          key: '家政培训',
          name: '家政培训',
          nick: "服务类型",
          selected: false,
          sort: -1
        }
      ],
      selected: false
    }],
    current_filter_click: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _searchShowKey = options.searchShowKey
    const _showSearchBar = options.showSearchBar
    console.log(_showSearchBar)
    // 设置默认搜索词 , 有默认搜索词，直接搜索
    this.setData({
      searchShowKey: _searchShowKey,
      focus: false,
      showSearchBar: _showSearchBar
    })
    this.search("")
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
    this.search("")
  },

  onFocus(event) {
    // 输入框获得焦点，重置状态
    this.data.status = 0
    this.data.focus = true
    this.setData(this.data)
    this.close_filter_click("")
  },

  gotoDetail(event) {
    const _id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/merchant_detail/merchant_detail?_id=' + _id,
    })
  },

  gotoGuidePrice() {
    this.close_filter_click("")
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
  },

  closeFilter() {
    return true
  },

  _onFilterClick(e) {
    const key = e.currentTarget.dataset.key
    // 获取当前是否选中， 如果当前被选中，则取消选中，并关闭弹窗对象
    const filter_list = this.data.filter_list
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
      this.data.current_filter_click = current_filter_click
    } else {
      // 当前已经被选中
      current_filter_click.selected = false
      this.data.current_filter_click = null
    }
    console.log(current_filter_click)
    // 设置当前对象被选中
    this.setData({
      filter_list: this.data.filter_list,
      current_filter_click: this.data.current_filter_click
    })
  },

  onFilterClick(e) {
    const key = e.currentTarget.dataset.key
    // 获取当前是否选中， 如果当前被选中，则取消选中，并关闭弹窗对象
    const filter_list = this.data.filter_list
    const current_filter_click = filter_list.find(res => {
      return res.key == key
    })
    // 当前为被选中 
    if (!current_filter_click.selected && current_filter_click.key == 'distance') {
      // 根据距离选择，弹出距离选择弹窗
      getApp().getLocation(success => {
        this._onFilterClick(e)
      }, fail => {

      })
      return
    } else {
      this._onFilterClick(e)
    }
  },
  close_filter_click(e) {
    const current_filter_click = this.data.current_filter_click
    console.log(current_filter_click)
    if (current_filter_click) {
      current_filter_click.selected = false
      this.setData({
        filter_list: this.data.filter_list,
        current_filter_click: null
      })
    }
  },

  // 点击了搜索条件 ，设置当前搜索选中的数据
  onEleSelected(e) {
    // 已经选中的不会再选中
    // 先获取当前过滤类型展示的对象
    const current_filter_click = this.data.current_filter_click
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
      filter_list: this.data.filter_list
    })

    this.setData({
      current_filter_click: null
    })

    // 查看服务类型标签选中的什么
    if (key == 'service_type') {
      const service_type_filter_ele_key = this.data.filter_list.find(value => {
        return value.key == 'service_type'
      }).filters.find(ele => {
        return ele.selected
      }).key

      this.setData({
        searchShowKey: service_type_filter_ele_key == '.*' ? '' : service_type_filter_ele_key
      })
    }


    this.search(key)

  },

  search(key) {
    // 开始搜索
    this.setData({
      status: 1
    })
    wx.showLoading({
      title: '搜索中...',
      icon: 'none'
    })
    // 根据当前的查词结果进行排序
    // 根据当前的查词结果进行排序
    let searchKey = this.data.searchShowKey
    if (app.isNullOrEmpty(searchKey)) {
      searchKey = ".*"
    }
    // 查找服务端增强关键词
    const serverSearchKeyObj = app.globalData.homeSearchKeyOptimized.find(res => {
      console.log('--------------')
      console.log(searchKey)
      console.log(res)
      return res.name.indexOf(searchKey) >= 0
    })
    let search_key
    if (serverSearchKeyObj && serverSearchKeyObj.search_key.length > 0) {
      search_key = serverSearchKeyObj.search_key
      console.log("用服务端缓存关键词搜索：")
      console.log(search_key)
    }

    if (search_key == null) {
      // 获取搜索的内容
      const menu = app.globalData.menus.find(res => {
        return res.name.indexOf(searchKey) >= 0
      })
      if (menu) {
        search_key = menu.search_key
        console.log("用客户单缓存关键词搜索：")
        console.log(search_key)
      }
    }
    if (search_key) {
      // 拼接正则匹配表达式
      searchKey = search_key.join('|')
    }

    console.log("---------" + searchKey)
    const location = getApp().globalData.location
    console.log(location)
    wx.cloud.callFunction({
        name: 'merchant_filter',
        data: {
          searchKey: searchKey,
          filters: this.data.filter_list,
          key: key,
          location: location
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
  }


})