// pages/company_type_list/company_type_list.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyList: [],
    // 0 默认 1 loading 2 success 3 empty 4 errror
    status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    const typeToSearchKeyArray = app.globalData.typeToSearchKeyArray
    console.log(typeToSearchKeyArray)
    const typeToSearchKey = typeToSearchKeyArray.find(res => {
      return type == res.type
    })
    // 拼接正则匹配表达式
    const matchRegex = typeToSearchKey.search_key.join('|')
    console.log(matchRegex)
    const db = wx.cloud.database()
    const _ = db.command
    // 模糊匹配服务
    db.collection("merchants")
      .where({
        "scope_of_business": db.RegExp({
          regexp: matchRegex
        })
      })
      //  最多获取50条
      .limit(50)
      .get()
      .then(res => {
        console.log(res.data)
        const resultData = res.data
        if(resultData.length > 0) {
          this.setData({
            status: 2,
            companyList: resultData
          })
        } else {
          this.setData({
            status: 4,
            companyList: []
          })
        }
      }).catch(reason => {
        this.setData({
          status: 3,
          companyList: []
        })
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

  }
})