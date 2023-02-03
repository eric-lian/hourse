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

  const result = await db.collection("merchants")
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
  console.log(result)
  const merchant = result.list[0]
  if (merchant) {
    // merchant.persons.forEach(res => {
    //   res.serverMills = serverMills
    // })
    var mergePersons = new Array();
    merchant.persons.forEach(res => {
      // 先查找 mergePersons 是否存在
      var mergePerson = mergePersons.find(person => {
        return res.person_name == person.person_name
      })
      if (mergePerson == undefined) {
        mergePersons.push(res)
        mergePerson = res
        mergePerson.serverMills = serverMills
      }

      var service_names = mergePerson.service_names
      if (service_names == undefined) {
        service_names = new Array()
        mergePerson.service_names = service_names
      }
      // 判断当前的 service_names 是否已经存在  res.service_name
      var exist = service_names.some(value => {
        return value == res.service_name
      })

      if (!exist) {
        service_names.push(res.service_name)
      }
    })
    console.log(mergePersons)
    merchant.persons = mergePersons

    // 查询商家下所有的评论数
    var totalResult = await db.collection("evaluate").where({
      merchant_id: merchant_id, 
      status: 1
    }).count()
    merchant.evaluate_count = totalResult.total
  }
  return result
}