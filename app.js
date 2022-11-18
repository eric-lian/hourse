// app.js
App({

  globalData: {
    statusBarHeight: 0,
    navigationBarHeight: 0,
    logined: false,
    userInfo: {},
    homeSearchKeyOptimized: [],
    globalConfig: {},
    MERCHANT_ACCEPT_ORDER_MSG_TEMPLATE_ID: "fUP2d5u8celV0E-lxxjxugU4yvq1RDRChPV3-4vx-zY",
    USER_ACCPET_ORDER_MSG_TEMPLATE_ID: "fUP2d5u8celV0E-lxxjxukgDGkLSF4rmE0Wvfd3xrWk",
    defaultLookServiceName: "保洁"
  },

  onLaunch() {
    // miniprogram-test-4fzwowo753c99a4  测试
    wx.cloud.init({
      env: 'house-keeping-7gact5ex37e05233',
      traceUser: true
    });
    this.initWindow()
    this.initLoginConfig()
    this.initHomeSearchKeyOptimized()
    this.initGlobalConfig()
  },
  initWindow() {
    const windowInfo = wx.getWindowInfo()
    // 状态栏高度
    this.globalData.statusBarHeight = windowInfo.statusBarHeight * 750 / wx.getSystemInfoSync().windowWidth
    this.globalData.navigationBarHeight = 44 * 750 / wx.getSystemInfoSync().windowWidth
  },
  initLoginConfig() {
    // 初始化登录状态
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        if (this.isNullOrEmpty(res.data)) {
          return
        }
        // 检查数据是否包含roles 字段，没有清空数据，重新登陆
        const userInfo = JSON.parse(res.data)
        console.log("userInfo :" + userInfo)
        // 主要是针对已经登录的老用户
        if (!this.checkUserInfo(userInfo)) {
          // 无角色退出登录
          console.log("检查登录信息失败，退出登录")
          this.logout()
          return
        }
        this.globalData.userInfo = userInfo
        this.globalData.logined = true
        // 网络再次更新最新数据
        this.updateOpenInfo(res => {
          console.log("更新openInfo 数据成功")
        }, _ => {
          console.log("用户未登录，未完善用户信息")
        }, reason => {
          console.log("更新openInfo 数据失败")
        })
      },
      fail: reason => {
        console.log("未登录，获取缓存登录信息失败~")
      },
      complete: res => {
        console.log("获取缓存登录信息完成~")
      }
    })
  },
  initHomeSearchKeyOptimized() {
    wx.getStorage({
      key: "homeSearchKeyOptimized",
      success: res => {
        if (res.data) {
          console.log("getStorage homeSearchKeyOptimized local cache success")
          console.log(res.data)
          this.globalData.homeSearchKeyOptimized = res.data
        }
      },
      fail: reason => {
        console.log("getStorage homeSearchKeyOptimized local cache fail")
      },
      complete: res => {
        this.updateServerHomeSearchKeyOptimized()
      }
    })
  },
  updateServerHomeSearchKeyOptimized() {
    const db = wx.cloud.database()
    db.collection("home_search_key_optimized")
      .where({
        status: 1
      })
      .get()
      .then(res => {
        console.log(res)
        const _homeSearchKeyOptimized = res.data
        this.globalData.homeSearchKeyOptimized = _homeSearchKeyOptimized
        wx.setStorageSync('homeSearchKeyOptimized', JSON.stringify(_homeSearchKeyOptimized))
      }).catch(reason => {
        console.log(reason)
      })
  },
  initGlobalConfig() {
    const db = wx.cloud.database()
    db.collection("global_config")
      .get()
      .then(res => {
        console.log("initGlobalConfig")
        console.log(res)
        if (res.data.length > 0) {
          const _globalConfig = res.data[0]
          this.globalData.globalConfig = _globalConfig
          if (_globalConfig.home_news == 1) {
            wx.reLaunch({
              url: '/pages/tab/home/home',
            })
          }

        }
      })
  },
  login(logined, unlogin, fail) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    // if (this.data.logined) {
    //   return
    // }
    /**
     * 1. 先判断服务端是否已经有用户资料信息
     * 2. 如果有资料信息，则登录成功
     * 3. 如果无资料，则强制用户更新资料
     */

    wx.showLoading({
      title: '登录中...',
    })
    this.updateOpenInfo(res => {
      logined(res)
      wx.hideLoading()
    }, _ => {
      unlogin()
      wx.hideLoading()
      // 跳转到信息补全页面
      wx.navigateTo({
        url: '/pages/user/user_info_fill/user_info_edit',
      })
    }, reason => {
      fail(reason)
      wx.hideLoading()
    })

  },

  updateOpenInfo(logined, unlogin, fail) {
    // 执行云函数，获取openid, 获取用户角色
    wx.cloud.callFunction({
      name: "get_openid",
      data: {
        new_login_style: true
      }
    }).then(res => {
      console.log("=============== get_openid")
      console.log(res)
      // 检查res.result 对象 ,如果对象为空，表示信息未填写
      const userInfo = res.result
      if (!this.checkUserInfo(userInfo)) {
        unlogin()
        return
      }
      this.globalData.logined = true
      this.globalData.userInfo = userInfo
      const userInfoStr = JSON.stringify(userInfo)
      wx.setStorage({
        data: userInfoStr,
        key: 'userInfo'
      })
      // 登录成功
      logined(userInfo)
    }).catch(reason => {
      fail(reason)
      console.error(reason)
    })
  },

  checkUserInfo(userInfo) {
    if (this.isNullOrEmpty(userInfo) ||
      this.isNullOrEmpty(userInfo.roles) ||
      this.isNullOrEmpty(userInfo.openid) ||
      this.isNullOrEmpty(userInfo.nickname) ||
      this.isNullOrEmpty(userInfo.avatarUrl)) {
      return false
    } else {
      return true
    }
  }

  ,
  logout(_success, _fail) {
    wx.removeStorage({
      key: 'userInfo',
      success: res => {
        this.globalData.userInfo = {}
        this.globalData.logined = false
        if (_success != undefined) {
          _success()
        }
      },
      fail: reason => {
        if (_fail != undefined) {
          _fail(reason)
        }
      }
    })
  },
  // 是否是商家
  isMerchants() {
    return this.globalData.logined && this.globalData.userInfo.roles == 1
  },

  isNullOrEmpty(content) {
    if (content == undefined || content == null) {
      return true
    }

    if ((typeof content == 'string') &&
      content.constructor == String &&
      content.trim().length == 0) {
      return true
    }

    return false
  },

  random(max) {
    return Math.floor(Math.random() * 10)
  },

  // 根据用户角色检查是否一开启模板消息通知
  checkAcceptOrderMsgTemplateId(templateId, success, fail) {
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        console.log(res)
        if (res.subscriptionsSetting.mainSwitch) {
          // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
          if (res.subscriptionsSetting.itemSettings != null) {
            console.log("================" + templateId)
            console.log(res.subscriptionsSetting.itemSettings[templateId])
            let state = res.subscriptionsSetting.itemSettings[templateId]
            if (state === 'accept') {
              success(true)
            } else {
              success(false)
            }
          } else {
            success(false)
          }
        } else {
          success(false)
        }
      },
      fail: reason => {
        fail()
        console.log(reason)
      }
    })
  },

  // 请求订阅消息
  requestSubscribeMessage(templateId, success, fail) {
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: res => {
        if (res[templateId] === 'accept') {
          success(true)
        } else {
          success(false)
        }
        console.log(res)
      },
      fail: reason => {
        console.log(reason)
        fail('error')
      }
    })
  },

  getCurrentRolesTemplateId() {
    if (this.isMerchants()) {
      console.log("======== 商家")
      return this.globalData.MERCHANT_ACCEPT_ORDER_MSG_TEMPLATE_ID
    } else {
      console.log("======== 普通用户")
      return this.globalData.USER_ACCPET_ORDER_MSG_TEMPLATE_ID
    }
  }

})