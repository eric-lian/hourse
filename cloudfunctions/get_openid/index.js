// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const accountResult = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }

  const db = cloud.database()

  // let accountInfo = wx.getAccountInfoSync()
  // let envVersion = accountInfo.miniProgram.envVersion;
  // let version = accountInfo.miniProgram.version;
  // console.log(accountInfo.miniProgram)
  if (event.new_login_style) {
    // 查找用户信息
    const userInfoResult = await db.collection("user_list").where({
      _id: accountResult.openid,
    }).get()
    const user = userInfoResult.data[0]
    if (user != null) {
      accountResult.status = user.status
      accountResult.nickname = user.nickname
      accountResult.avatarUrl = user.avatarUrl
    } else {
      // 表示用户未在本小程序注册，返回空数据
      return {}
    }
  }
  try {
    // 当前登录的openid查找是否为商家
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




  return accountResult
}