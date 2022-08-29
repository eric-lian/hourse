// app.js
App({

  globalData: {
    statusBarHeight: 0,
    navigationBarHeight: 0,
    logined: false,
    userInfo: {}
  },

  onLaunch() {
    wx.cloud.init({
      env: 'miniprogram-test-4fzwowo753c99a4',
      traceUser: true
    });

    const windowInfo = wx.getWindowInfo()
    // 状态栏高度
    this.globalData.statusBarHeight = windowInfo.statusBarHeight
    this.globalData.navigationBarHeight = windowInfo.screenTop
    console.log(this.globalData.navigationBarHeight)

    // 初始化登录状态
     wx.getStorage({
      key: 'userInfo',
      success: res => {
        if(res.data) {
          this.globalData.userInfo = JSON.parse(res.data)
          this.globalData.logined = true
          console.log("============ globalData.userInfo" + res.data)
        } 
      }
    })
  }

})