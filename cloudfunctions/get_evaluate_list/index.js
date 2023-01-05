// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // 商家id
  var merchant_id = event.merchant_id
  var _createTime = event._createTime
  console.log("merchant_id: "+ merchant_id)
  console.log("_createTime: "+ _createTime)
  // 首页
  console.log("-----------" + _createTime)
  if (_createTime == undefined ||  _createTime <= 0) {
    _createTime = new Date().getTime()
  }
  
  var db = cloud.database()
  var _ = db.command
  // var $ = _.aggregate
  var result = await db.collection("evaluate").where({
    _createTime: _.lt(_createTime),
    merchant_id: merchant_id, 
    status: 1
  }).orderBy("_createTime", "desc").limit(20).get()
  return result
}