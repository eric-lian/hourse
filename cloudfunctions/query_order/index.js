// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const order_id = event.order_id
  // 先查询订单
  const db = cloud.database()
  const subscribeGetResult = await db.collection("subscribe").where({
    _id: order_id
  }).get()

  const subscribe = subscribeGetResult.data[0]
  console.log(subscribe)
  // 根据商家id 查找商家信息
  const merchantGetResult = await db.collection("merchants").where({
    _id: subscribe.merchant_id
  }).get()

  const merchant = merchantGetResult.data[0]
  subscribe.merchant = merchant

  console.log(subscribe)

  return subscribe
}