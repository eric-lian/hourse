// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const accountResult = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }

  try {
    // 当前登录的openid查找是否为商家
    const db = cloud.database()
    const merchantResult = await db.collection("merchants").where({
      merchant_open_id: accountResult.openid,
      status: 1
    }).get()
    // 0 普通用户 1 商家角色 2 家政人员角色
    if (merchantResult.data[0] != null) {
      accountResult.roles = 1
    } else {
      accountResult.roles = 0
    }
  } catch (error) {
    accountResult.roles = 0
    console.log(error)
  }
  // console.log(accountResult)
  return accountResult
}