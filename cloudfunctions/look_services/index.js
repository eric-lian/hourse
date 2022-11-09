// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate
  const serverMills = new Date().getTime()

  const look_service = await db.collection("look_service")
    .aggregate()
    .lookup({
      from: 'merchants',
      localField: 'company_name',
      foreignField: '_id',
      as: 'merchants',
    })
    // 排序
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$merchants', 0]), '$$ROOT'])
    })
    .addFields({
      serverMills: serverMills
    })
    .project({
      merchants: 0
    })
    .group({
      // 分组标识
      _id: '$service_name',
      // 匹配的数据压入集合
      list: $.push('$$ROOT')
    })
    .end()
  look_service.list.reverse()
  return look_service

}