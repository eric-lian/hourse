// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const MAX_LIMIT = 100
  // 计算并更新所有商家的好评数
  // 1.先获取所有商家总数
  const _ = db.command
  const $ = _.aggregate
  const count = await db.collection('merchants').where({
    status: 1,
    merchant_open_id: _.exists(true)
  }).count()
  //2. 分批查询获取所有结果 , 每一次更新一百条
  // 计算需分几次取
  const total = count.total
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('merchants')
      .where({
        status: 1,
        merchant_open_id: _.exists(true)
      })
      .field({
        _id: true,
        // name: true
      })
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }

  const result = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  // console.log(result)
  // 数据转换 ，转换成id数据
  const ids = result.data.map(item => {
    return item._id
  })
  // console.log(ids)
  //3 开始计算每个商家的好评数
  const avgStarResult = await db.collection('evaluate')
    .aggregate()
    .match({
      merchant_id: _.in(ids),
      // 需要是已经过审的评论
      status: _.in([1])
    })
    .group({
      _id: '$merchant_id',
      avgStar: $.avg('$star')
    })
    .end()
  // console.log(avgStarResult)
  const avgStarResultList = avgStarResult.list
  // 更新家政人员服务满意度星数
  // console.log(avgStarResultList)
  // 只能for循环
  for (let index = 0; index < avgStarResultList.length; index++) {
    const updateObj = avgStarResultList[index]
    console.log(updateObj)
    const updateResult = await db.collection('merchants').doc(updateObj._id).update({
      data: {
        evaluation_stars: updateObj.avgStar
      }
    })
    console.log(updateResult)
  }

  console.log("================ 商家好评更新结束")

  // 计算并更新所有家政人员的好评数  ===============
  const look_service_count = await db.collection('look_service').where({
    status: 1,
    // 未实名认证的不计入
    company_name: _.in(ids)
  }).count()
  //2. 分批查询获取所有结果 , 每一次更新一百条
  // 计算需分几次取
  const look_service_total = look_service_count.total
  const lookServiceBatchTimes = Math.ceil(look_service_total / 100)
  // 承载所有读操作的 promise 的数组
  const lookServiceTasks = []
  for (let i = 0; i < lookServiceBatchTimes; i++) {
    const promise = db.collection('look_service')
      .where({
        status: 1,
        // 未实名认证的不计入
        company_name: _.in(ids)
      })
      .field({
        _id: true,
        // name: true
      })
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
      lookServiceTasks.push(promise)
  }

  const lookServiceResult = (await Promise.all(lookServiceTasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  console.log(lookServiceResult)
  // 数据转换 ，转换成id数据
  const lookServiceIds = lookServiceResult.data.map(item => {
    return item._id
  })
  console.log(lookServiceIds)
  //3 开始计算每个家政服务人员的好评数
  const lookServiceAvgStarResult = await db.collection('evaluate')
    .aggregate()
    .match({
      service_person_id: _.in(lookServiceIds),
      // 需要是已经过审的评论
      status: _.in([1])
    })
    .group({
      _id: '$service_person_id',
      avgStar: $.avg('$star')
    })
    .end()
  console.log(lookServiceAvgStarResult)
  const lookServiceAvgStarResultList = lookServiceAvgStarResult.list
  // 更新家政人员服务满意度星数
  console.log(lookServiceAvgStarResultList)
  // 只能for循环
  for (let index = 0; index < lookServiceAvgStarResultList.length; index++) {
    const updateObj = lookServiceAvgStarResultList[index]
    console.log(updateObj)
    const updateResult = await db.collection('look_service').doc(updateObj._id).update({
      data: {
        evaluation_stars: updateObj.avgStar
      }
    })

    console.log(updateResult)
  }


  return {}
}