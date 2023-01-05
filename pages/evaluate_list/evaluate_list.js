// pages/evaluate_list/evaluate_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluates: [],
    /**
     * 0 加载中
     * 1 刷新数据空结果
     * 2 刷新数据有结果
     * 3 刷新数据失败
     * 4 加载更多数据空结果
     * 5 加载更过数据有结果
     * 6 加载更多数据失败
     */
    state: 0,
    merchant_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '评价',
    })
    this.setData({
      merchant_id: options.merchant_id
    })
    // 加载数据
    this.loadEvaluate()
  },

  loadEvaluate() {
    // 检测数据是否为空， 为空表示加载第一页数据 ，否则获取最后一条记录数据
    var evaluates_length = this.data.evaluates.length;
    var last_evaluate = this.data.evaluates[evaluates_length - 1]
    var last_evaluate_time = 0
    if (last_evaluate != undefined) {
      last_evaluate_time = last_evaluate._createTime
    }
    this.setData({
      state: 0
    })
    var current_evaluate_list_empty = this.data.evaluates[0] == undefined
    // 开始调用云函数请求数据
    wx.cloud.callFunction({
      name: 'get_evaluate_list',
      data: {
        merchant_id: this.data.merchant_id,
        _createTime: last_evaluate_time
      }
    }).then(res => {
      var evaluate_list = res.result.data
      console.log(evaluate_list)
      // 结果是否为空
      var request_evaluate_list_empty = evaluate_list[0] == undefined
      if (current_evaluate_list_empty && request_evaluate_list_empty) {
        // 当前商家没有任何评论
        this.updateState(1)
      } else if (!current_evaluate_list_empty && request_evaluate_list_empty) {
        // 没有更多数据了
        this.updateState(4)
      } else if (!current_evaluate_list_empty && !request_evaluate_list_empty) {
        // 加载更多成功
        this.setData({
          evaluates: this.data.evaluates.concat(evaluate_list)
        })
        this.updateState(5)
      } else {
        // 刷新数据成功
        this.updateState(2)
        this.setData({
          evaluates: this.data.evaluates.concat(evaluate_list)
        })
      }
    }).catch(error => {
      console.log(error)
      this.updateState(current_evaluate_list_empty ? 3 : 6)
    })

  },

  updateState(state) {
    this.setData({
      state: state
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