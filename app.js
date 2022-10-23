// app.js
App({

  globalData: {
    statusBarHeight: 0,
    navigationBarHeight: 0,
    logined: false,
    userInfo: {}
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
    this.globalData.navigationBarHeight = 44 * 750 / wx.getSystemInfoSync().windowWidth

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

  login(onSuccess, onFail) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    // if (this.data.logined) {
    //   return
    // }
    wx.showLoading({
      title: '登录中...',
    })
    wx.getUserProfile({
      desc: '用于完善会员资料' // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    }).then(res => {
      const userInfo = res.userInfo
      console.log(userInfo)
      this.getOpenId(userInfo, onSuccess, onFail)
    }).catch(reason => {
      console.error(reason)
      wx.hideLoading({
        success: (res) => {
          onFail()
        },
      })
    })
  },

  getOpenId(userInfo, onSuccess, onFail) {
    // 执行云函数，获取openid
    wx.cloud.callFunction({
      name: "get_openid",
    }).then(res => {
      // 缓存userInfo 和 openId
      const openid = res.result.openid
      userInfo.openid = openid
      this.globalData.logined = true
      this.globalData.userInfo = userInfo
      const userInfoStr = JSON.stringify(userInfo)
      console.log("=====" + userInfoStr)
      wx.setStorage({
        data: userInfoStr,
        key: 'userInfo',
        complete: res => {
          wx.hideLoading({
            success: (res) => {
              onSuccess()
            },
          })
        }
      })
    }).catch(reason => {
      wx.hideLoading({
        success: (res) => {
          onFail()
        },
      })
      console.error(reason)
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
  },

  inputIsEmpty(content) {
    if (content == undefined || content == null || content.trim() == '') {
      return true
    }
    return false
  },

  random(max) {
    return Math.floor(Math.random() * 10)
  }
})