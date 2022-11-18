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
      merchants: 0,
      address: 0,
      company_main_img: 0,
      credit_code: 0,
      introducation: 0,
      min_service_price: 0,
      photo_of_business_license: 0,
      scope_of_business: 0,
      weight: 0,
      status: 0,
      _createTime: 0,
      _updateTime: 0
    })
    .group({
      // 分组标识
      _id: '$service_name',
      // 匹配的数据压入集合
      list: $.push('$$ROOT')
    })
    .end()
  // look_service.list.reverse()
  const services = [
    "保洁", 
    "保姆",
    "母婴护理",
    "养老护理",
    "开锁",
    "保育员",
    "家电维修",
    "水电安装",
    "家电清洗",
    "家具维修",
    "甲醛治理",
    "收纳干洗",
    "其他"
  ]
  look_service.list.sort(function (serviceA, serviceB) {
    const aID = serviceA._id
    const bID = serviceB._id
    return services.indexOf(aID) - services.indexOf(bID)
  })
  // look_service['甲醛治理'].list=[]
  return look_service
}