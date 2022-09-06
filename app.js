// app.js
App({

  globalData: {
    statusBarHeight: 0,
    navigationBarHeight: 0,
    logined: false,
    userInfo: {},
    typeToSearchKeyArray: [{
      search_key: ["保洁", "找保洁"],
      type: "0"
    }, {
      search_key: ["月嫂", "找月嫂"],
      type: "1"
    }, {
      search_key: ["保姆", "找保姆"],
      type: "2"
    }, {
      search_key: ["陪护", "找陪护"],
      type: "3"
    }, {
      search_key: ["擦玻璃", "玻璃"],
      type: "4"
    }, {
      search_key: ["疏通", "管道", "疏通管道"],
      type: "5"
    }, {
      search_key: ["电路", "修电路"],
      type: "6"
    }, {
      search_key: ["家电", "修家电"],
      type: "7"
    }, {
      search_key: ["清空调", "空调"],
      type: "8"
    }, {
      search_key: ["房屋", "维修", "房屋维修"],
      type: "9"
    }]
  },

  onLaunch() {
    // miniprogram-test-4fzwowo753c99a4  测试
    wx.cloud.init({
      env: 'house-keeping-7gact5ex37e05233',
      traceUser: true
    });

    const windowInfo = wx.getWindowInfo()
    // 状态栏高度
    this.globalData.statusBarHeight = windowInfo.statusBarHeight * 750 / wx.getSystemInfoSync().windowWidth
    this.globalData.navigationBarHeight = 44  * 750 / wx.getSystemInfoSync().windowWidth

    // 初始化登录状态
    wx.getStorage({ 
      key: 'userInfo',
      success: res => {
        if (res.data) {
          this.globalData.userInfo = JSON.parse(res.data)
          this.globalData.logined = true
          console.log("============ globalData.userInfo" + res.data)
        }
      }
    })
  },

  logout(onSuccess, onFail) {
    wx.removeStorage({
      key: 'userInfo',
    }).then(res => {
      this.globalData.userInfo = {}
      this.globalData.logined = false
      onSuccess()
    }).catch(reason => {
      onFail()
    })
  }

})