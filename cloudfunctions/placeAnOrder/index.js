// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取下单数据
  console.log("用户下单")
  console.log(event)
  const db = cloud.database()
  if (event.status == "1") {
    console.log("用户开始结果")
    event._createTime = Date.now()
    event._updateTime = Date.now()
    // 订单数据入库
    const result = await db.collection("subscribe").add({
      data: event
    })
    event._id = result._id
    if (event._id == undefined) {
      throw Error('下单失败')
    }
    console.log("用户下单结果")
    console.log(event)
    // 发送通知给商家，有新订单
    // try {
    //   const sendSubscribeResult = await cloud.callFunction({
    //     name: 'send_subscribe',
    //     data: event
    //   })
    //   console.log("发送商家新订单消息结果")
    //   console.log(sendSubscribeResult)
    // } catch (error) {
    //   console.log(error)
    // }    
  }
}