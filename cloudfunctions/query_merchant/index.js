// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const merchant_id = event.merchant_id

  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate

  const serverMills = new Date().getTime()

  return db.collection("merchants")
    .aggregate()
    .match({
      _id: merchant_id
    })
    .lookup({
      from: 'look_service',
      localField: '_id',
      foreignField: 'company_name',
      as: 'persons',
    })
    .addFields({
      serverMills: serverMills
    })
    .end()
}