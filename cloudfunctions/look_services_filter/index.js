// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 查找那个家政类型
  const _service_name = event.service_name

  const _filters = event.filters
  // 当前选中，按照那个排序
  const _key = event.key

  console.log(_key)

  const _sort = {}
  // 排序字段, 拼接排序字段
  _filters.forEach(filter => {
    if (filter.key != _key) {
      return
    }
    const ele = filter.filters.find(ele => {
      return ele.sort != 0 && ele.selected
    })
    if (ele) {
      _sort[filter.key] = ele.sort
    }
  })

  const length = Object.keys(_sort).length
  if (length <= 0) {
    _sort.weight = -1
  }

  console.log(_service_name)
  console.log(_filters)
  console.log(_sort)
  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate
  const serverMills = new Date().getTime()

  const look_service = await db.collection("look_service")
    .aggregate()
    .match({
      service_name: _service_name
    })
    // .sort({
    //   work_begin_date: -1
    // })
    // .sort({
    //   brithday: 1
    // })
    .sort(_sort)
    .lookup({
      from: 'merchants',
      localField: 'company_name',
      foreignField: '_id',
      as: 'merchants',
    })
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

  // console.log()

  return look_service
}