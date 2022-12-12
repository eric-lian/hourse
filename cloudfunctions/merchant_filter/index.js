// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios').default;
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  const _searchKey = event.searchKey

  const _filters = event.filters
  // 当前选中，按照那个排序
  const _key = event.key

  const _location = event.location

  // 获取好评排序
  const evaluation_stars_filter_ele_sort = _filters.find(value => {
    return value.key == 'evaluation_stars'
  }).filters.find(ele => {
    return ele.selected
  }).sort

  // 距离
  const distance_filter_ele = _filters.find(value => {
    return value.key == 'distance'
  }).filters.find(ele => {
    // ele.sort != 0 &&
    return ele.selected
  })

  // 服务类型 ， 忽略 ，就是现在的  _searchKey
  // const service_type_filter_ele_key = _filters.find(value => {
  //   return value.key == 'service_type'
  // }).filters.find(ele => {
  //   return ele.selected
  // }).key

  const db = cloud.database()
  const _ = db.command
  let query = db.collection("merchants")
    .where(_.or([{
      status: 1,
      scope_of_business: db.RegExp({
        regexp: _searchKey
      })
    }, {
      status: 1,
      name: db.RegExp({
        regexp: _searchKey
      })
    }])
    .and([{
      location: _.exists(true)
    }])
    )
  // 到序排序
  // 降序
  console.log(evaluation_stars_filter_ele_sort)
  if (evaluation_stars_filter_ele_sort != 0) {
    query = query.orderBy('evaluation_stars',
      evaluation_stars_filter_ele_sort == 1 ? 'desc' : 'asc')
  } else {
    query = query.orderBy('weight', "desc")
  }
  const result = await query.get()
  // 根据结果搜索查询商家距离
  console.log("===================")
  console.log(distance_filter_ele)
  console.log(result)
  // 1. 结果有数据
  // 2. 选中 需要按照距离排序, 1 由近到远 
  // 3. 传过来代码检测是否有位置 _location 
  if (
    result.data[0] &&
    // distance_filter_ele.selected &&
    // distance_filter_ele.sort != 0 &&
    _location &&
    _location.longitude &&
    _location.latitude) {
    // 拼接 from 位置
    const from = _location.latitude + ',' + _location.longitude
    // 遍历数据，拼接所有商家位置信息
    let to = '';
    for (const index in result.data) {
      const location = result.data[index].location
      to += location.latitude + ',' + location.longitude
      if (index != result.data.length - 1) {
        to += ';'
      }
    }
    console.log(to)
    var url = 'https://apis.map.qq.com/ws/distance/v1/matrix?from=' + from + '&to=' + to + '&key=R3EBZ-OC26D-M4242-PZPG3-WUAD2-XQBKO&mode=bicycling'
    try {
      const response = await axios.get(url)
      console.log(response)
      const elements = response.data.result.rows[0].elements
      if (elements.length != result.data.length) {
        // 计算出错
        console.log(response)
        throw Error()
      }
      console.log(elements)
      // 将计算结果赋值给查出来的元素
      for (const index in elements) {
        result.data[index].distance = elements[index].distance
        // console.log(elements[index])
      }

      // 根据距离对结果进行排序
      const sort = distance_filter_ele.sort
      // 默认优先按照距离最近排序
      console.log(_key != 'evaluation_stars')
      if (sort != 0 && _key != 'evaluation_stars') {
        result.data.sort(function (merchantA, merchantB) {
          return (merchantA.distance - merchantB.distance) * sort
        })
      }
      // result.data[index]

    } catch (error) {
      console.log(error)
    }
  }
  console.log(result)
  return result
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
