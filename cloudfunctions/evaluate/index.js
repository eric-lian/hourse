// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const operate = event.operate
  const order_id = event.order_id
  const db = cloud.database()
  if (operate == 'query') {
    const result = await db.collection('evaluate')
      .where({
        order_id: order_id
      }).get()
    return result
  } else if (operate == 'add') {
    const result = await db.collection('evaluate').add({
      data: event
    })
    if(result._id == undefined || result._id == null) {
      throw Error("评论失败")
    }
    return result
  } else if (operate == 'delete') {

  } else if (operate == 'update') {

  }
  throw Error("")
}