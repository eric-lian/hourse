// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const searchKey = event.searchKey
  const result = await db.collection("merchants")
    .where(_.or([{
      status: 1,
      scope_of_business: db.RegExp({
        regexp: searchKey
      })
    }, {
      status: 1,
      name: db.RegExp({
        regexp: searchKey
      })
    }]))
    // 到序排序
    // 降序
    .orderBy('weight', "desc")
    .get()
  // 原函数最大100条
  return result
}