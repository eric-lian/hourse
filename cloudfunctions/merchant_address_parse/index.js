// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios').default;
const urlencode = require('urlencode');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境


// 云函数入口函数
exports.main = async (event, context) => {
  // 查询获取所有未进行地址解析的商家地址
  const db = cloud.database()
  const _ = db.command
  const merchants = await db.collection('merchants')
    .field({
      _id: true,
      name: true,
      address: true,
      location: true
    })
    .where({
      location: _.exists(false)
    })
    // .limit(1)
    .get()
  const data = merchants.data
  for (const value of data) {
    const address = value.address
    const encode_address = urlencode(address)
    var url = 'https://apis.map.qq.com/ws/geocoder/v1/?address=' + encode_address + '&key=R3EBZ-OC26D-M4242-PZPG3-WUAD2-XQBKO'
    try {
      const response = await axios.get(url)
      const status = response.data.status
      // console.log(status)
      if (status == 0) {
        const result = response.data.result
        // 可信度参考， 值范围 1 - 10 <高可信>
        const reliability = result.reliability
        // 生成geo 存放到数据库
        if (reliability >= 1) {
          // 11 个等级 ，一般>= 9 即可采用 非必填项
          // const level = result.level
          const location = result.location
          value.location = location
          // console.log(location)
          // console.log(reliability)
          // console.log(level)
          // 位置入库
          // console.log(value)
        } else {
          //  位置模糊
          console.log("======= 地址模糊 : ")
          console.log(response)
          console.log(value)
          // throw Error(response)
        }
      } else {
        console.log("======= 地址解析异常 : ")
        console.log(response)
        console.log(value)
        // throw Error(response)
      }
    } catch (error) {
      console.log("======= 地址解析错误 : ")
      console.log(value)
      console.log(error)
    }
    // 延时200ms，控制一下最大并发
    await sleep(200)
  }
  const updateLocationData = data.filter(value => {
    return value.location != undefined
  })
  for (const value of updateLocationData) {
    try {
      const result = await db.collection('merchants')
        .doc(value._id)
        .update({
          data: {
            location: new db.Geo.Point(Number(value.location.lng), Number(value.location.lat))
          }
        })
      console.log(result)
      // console.log(value.location)
    } catch (error) {
          console.log(error)
    }
  }
  return {}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}