// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取匹配的服务名字
  var _service_name = event.service_name
  var _person_name = event.person_name
  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate
  const serverMills = new Date().getTime()
  const result = await db.collection("look_service")
    .aggregate()
    .match({
      service_name: _.in(_service_name),
      person_name: _.neq(_person_name),
      status: 0
    })
    .sort({
      'weight': -1
    })
    .limit(20)
    .lookup({
      from: 'merchants',
      localField: 'company_name',
      foreignField: '_id',
      as: 'merchant',
    })
    .addFields({
      merchant: $.arrayElemAt(['$merchant', 0]),
      serverMills: serverMills
    })
    .project({
      merchant: {
        name: 1,
        _id: 1,
        merchant_open_id: 1,
        phone: 1
      },
      _id: 1,
      brithday: 1,
      company_name: 1,
      evaluation_stars: 1,
      evaluation_sum: 1,
      person_name: 1,
      person_photo: 1,
      province: 1,
      service_name: 1,
      work_begin_date: 1,
      serverMills: 1,
      certificate_photos: 1,
      skill:1,
      evaluation: 1,

    })
    .end()
  return result;
}