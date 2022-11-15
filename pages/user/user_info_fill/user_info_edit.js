// pages/user/user_info_fill/user_info_edit.js
const app = getApp()

const defaultAvatarUrl = '/pages/images/my/user_default_avatar.png'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '信息完善',
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

  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  onNicknameChanged(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  saveUserInfo(e) {
    // 检查头像
    if (this.data.avatarUrl == defaultAvatarUrl) {
      wx.showToast({
        title: '请选择头像',
      })
      return
    }
    // 检查昵称输入框内容是否为空
    if (app.isNullOrEmpty(this.data.nickname)) {
      wx.showToast({
        title: '请输入昵称',
      })
      return
    }
    // 保存用户资料 ，返回登录内容
    wx.showLoading({
      title: '保存中...',
    })
    // 说明是在线文件无需再次上传了 
    if (this.data.avatarUrl.startsWith('clound://')) {
      this.updateUserInfo()
      return
    }
    const suffixIndexOf = this.data.avatarUrl.lastIndexOf(".");
    const suffix = this.data.avatarUrl.substring(suffixIndexOf)
    console.log(suffix)
    wx.cloud.uploadFile({
      cloudPath: Date.now() + suffix,
      filePath: this.data.avatarUrl,
    }).then(res => {
      this.setData({
        avatarUrl: res.fileID
      })
      this.updateUserInfo()
    }).catch(reason => {
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '保存信息失败，请稍后再试',
          })
        },
      })
    })
  },

  updateUserInfo() {
    wx.cloud.callFunction({
      name: 'user_info_update',
      data: this.data
    }).then(res => {
      app.updateOpenInfo(res => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '登陆成功',
            })
            // 关闭当前页面
            wx.navigateBack({
              delta: 0,
            })
          },
        })
      }, res => {
        // ignore
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '保存信息失败，请稍后再试',
            })
          },
        })
      }, reason => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '保存信息失败，请稍后再试',
            })
          },
        })
      })
    }).catch(reason => {
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '保存信息失败，请稍后再试',
          })
        },
      })
    })

  }
})