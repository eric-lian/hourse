// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const MERCHANT_ACCEPT_ORDER_MSG_TEMPLATE_ID = "fUP2d5u8celV0E-lxxjxugU4yvq1RDRChPV3-4vx-zY"

const USER_ACCPET_ORDER_MSG_TEMPLATE_ID = "fUP2d5u8celV0E-lxxjxukgDGkLSF4rmE0Wvfd3xrWk"

// 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
const MINIPROGRAM_STATE = 'formal'
// const MINIPROGRAM_STATE = 'developer'
// const MINIPROGRAM_STATE = 'trial'

// 云函数入口函数
exports.main = async (event, context) => {
  // 已下单, 发送新订单消息给商家
  // const serviceTime = event.start_time + "-" + event.end_time

  const page = '/pages/merchant_subscribe/merchant_subscribe?order_id=' + event._id

  if (event.status == '1') {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.merchant_openid,
      "templateId": MERCHANT_ACCEPT_ORDER_MSG_TEMPLATE_ID,
      "page": page,
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
    console.log("云函数发送消息结束")
    console.log(result)
    // return result
  } else if (event.status == '2') {
    //  订单已接单 ，通知用户
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.user_open_id,
      "templateId": USER_ACCPET_ORDER_MSG_TEMPLATE_ID,
      "page": page,
      "miniprogramState": MINIPROGRAM_STATE,
      "data": {
        // 订单号
        "character_string5": {
          "value": event._id
        },
        // 订单状态
        "thing4": {
          "value": "已接单"
        },
        // 订单类型
        "thing2": {
          "value": event.service_type
        },
        "thing6": {
          "value": event.start_time
        },
        // 商家名称
        "thing12": {
          "value": event.service_name
        }
      },
    })
    console.log("云函数发送已接单消息结束")
    console.log(result)
  } else if (event.status == '3') {
    //  订单已完成 ，通知用户
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.user_open_id,
      "templateId": USER_ACCPET_ORDER_MSG_TEMPLATE_ID,
      "page": page,
      "miniprogramState": MINIPROGRAM_STATE,
      "data": {
        // 订单号
        "character_string5": {
          "value": event._id
        },
        // 订单状态
        "thing4": {
          "value": "已完成"
        },
        // 订单类型
        "thing2": {
          "value": event.service_type
        },
        "thing6": {
          "value": event.start_time
        },
        // 商家名称
        "thing12": {
          "value": event.service_name
        }
      },
    })
    console.log("云函数发送已完成消息结束")
    console.log(result)
  } else if (event.status == '4') {
    //  商家取消订单，通知用户
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.user_open_id,
      "templateId": USER_ACCPET_ORDER_MSG_TEMPLATE_ID,
      "page": page,
      "miniprogramState": MINIPROGRAM_STATE,
      "data": {
        // 订单号
        "character_string5": {
          "value": event._id
        },
        // 订单状态
        "thing4": {
          "value": "商家已取消"
        },
        // 订单类型
        "thing2": {
          "value": event.service_type
        },
        "thing6": {
          "value": event.start_time
        },
        // 商家名称
        "thing12": {
          "value": event.service_name
        }
      },
    })
    console.log("云函数发送商家已取消消息结束")
    console.log(result)
  } else if (event.status == '5') {
    //  用户取消订单，通知商家
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.merchant_openid,
      "templateId": MERCHANT_ACCEPT_ORDER_MSG_TEMPLATE_ID,
      "page": page,
      "miniprogramState": MINIPROGRAM_STATE,
      "data": {
        // 订单号
        "character_string5": {
          "value": event._id
        },
        // 订单状态
        "thing4": {
          "value": "用户已取消"
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
    console.log("云函数发送用于已取消消息结束")
    console.log(result)
  }
}