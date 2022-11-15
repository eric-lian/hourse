// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const avatarUrl = event.avatarUrl
  const nickname = event.nickname
  const db = cloud.database()

  // const userResult = await db.collection('user_list').where({
  //   _id: openid
  // }).get()
  // const user = userResult[0]
  let _createTime = Date.now()
  let _updateTime = Date.now()
  // 记录已存在
  // if (user != null) {
  //   _createTime = user._createTime
  // }

  // @TODO 检查用户状态

  const saveUserResult = await db.collection('user_list').doc(openid).set({
    data: {
      _createTime: _createTime,
      _updateTime: _updateTime,
      status: 0,
      nickname: nickname,
      avatarUrl: avatarUrl,
    }
  })
  console.log("saveUserResult:")
  console.log(saveUserResult)
  return saveUserResult
}