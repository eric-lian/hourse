// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // 先查询订单最新状态
  // 订单id
  const order_id = event.order_id
  // 目标状态
  const to_status = event.to_status

  const db = cloud.database()

  const queryOrder = await cloud.callFunction({
    name: 'query_order',
    data: {
      order_id: order_id
    }
  })
  const queryOrderResult = queryOrder.result
  console.log(queryOrderResult)

  // 接收订单
  // <!-- 0 下单 1 待接单 2 已接单 3 已完成 4 商家取消订单 5 用户取消订单 -->
  if (to_status == '2' && ['1'].includes(queryOrderResult.status)) {
    // 接受订单
    const updateResult = await db.collection('subscribe').doc(order_id).update({
      data: {
        status: to_status
      }
    })
    console.log("订单更新为已接单")
    console.log(updateResult)
    queryOrderResult.status = to_status
  } else if (to_status == '3' && ['2'].includes(queryOrderResult.status)) {
    // 订单已完成
    const updateResult = await db.collection('subscribe').doc(order_id).update({
      data: {
        status: to_status
      }
    })
    console.log("订单更新为取消订单")
    console.log(updateResult)
    queryOrderResult.status = to_status
  } else if (to_status == '4' && ['1', '2'].includes(queryOrderResult.status)) {
    // 商家取消订单
    const updateResult = await db.collection('subscribe').doc(order_id).update({
      data: {
        status: to_status
      }
    })
    console.log("订单更新为取消订单")
    console.log(updateResult)
    queryOrderResult.status = to_status
  } else if (to_status == '4' && ['1'].includes(queryOrderResult.status)) {
    // 用户取消订单
    const updateResult = await db.collection('subscribe').doc(order_id).update({
      data: {
        status: to_status
      }
    })
    console.log("订单更新为取消订单")
    console.log(updateResult)
    queryOrderResult.status = to_status
  }
  return queryOrderResult;
}