// app.js
App({

  globalData: {
    statusBarHeight: 0,
    navigationBarHeight: 0
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
  }

})