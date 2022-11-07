// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const MERCHANT_ACCEPT_ORDER_MSG__TEMPLATE_ID = "fUP2d5u8celV0E-lxxjxugU4yvq1RDRChPV3-4vx-zY"

const USER_ACCPET_ORDER_MSG_TEMPLATE_ID = "fUP2d5u8celV0E-lxxjxukgDGkLSF4rmE0Wvfd3xrWk"

// 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
const MINIPROGRAM_STATE = 'developer'

// 云函数入口函数
exports.main = async (event, context) => {  
  // 已下单, 发送新订单消息给商家
  const serviceTime = event.start_time + "-" + event.end_time
  if (event.status == '1') {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.user_open_id,
      "templateId": MERCHANT_ACCEPT_ORDER_MSG__TEMPLATE_ID,
      "page": '/pages/merchant_detail/merchant_detail',
      "miniprogramState": MINIPROGRAM_STATE,
      "data": {
        // 订单号
        "character_string5": {
          "value": event._id
        },
        // 订单状态
        "thing4": {
          "value": "新订单"
        },
        // 订单类型
        "thing2": {
          "value": event.service_type
        },
        // 服务时间
        "thing6": {
          "value": event.start_time
        },
        // 订单地址
        "thing1": {
          "value": event.service_address
        }
      },
    })
    return result
  }
}