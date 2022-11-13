// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const orderId = event.order_id
  const openId = wxContext.OPENID
  const db = cloud.database()
  const result = await db.collection("evaluate").aggregate()
    .match({
      open_id: openId,
      order_id: orderId
    })
    .lookup({
      from: "subscribe",
      localField: "order_id",
      foreignField: "_id",
      as: "order"
    })
  // console.log(result)
  return result
}