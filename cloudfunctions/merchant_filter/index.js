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

  const MAX_LIMIT = 100
  // 获取到所有数据
  const countResult = await query.count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  console.log("=================== 所有商家数据总数：")
  console.log(countResult)

  for (let i = 0; i < batchTimes; i++) {
    const promise = query
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
    for (let i = 0; i < batchTimes; i++) {
      const startIndex = i * MAX_LIMIT;
      let endIndex = (i + 1) * MAX_LIMIT
      if (i == batchTimes) {
        endIndex = total
      }
      console.log("=================== startIndex")
      console.log(startIndex)
      console.log(endIndex)
      const data = result.data.slice(startIndex, endIndex)
      // 拼接 from 位置
      const from = _location.latitude + ',' + _location.longitude
      // 遍历数据，拼接所有商家位置信息
      let to = '';
      for (const index in data) {
        const location = data[index].location
        to += location.latitude + ',' + location.longitude
        if (index != data.length - 1) {
          to += ';'
        }
      }
      console.log(to)
      var url = 'https://apis.map.qq.com/ws/distance/v1/matrix?from=' + from + '&to=' + to + '&key=R3EBZ-OC26D-M4242-PZPG3-WUAD2-XQBKO&mode=bicycling'
      try {
        const response = await axios.get(url)
        console.log(response)
        const elements = response.data.result.rows[0].elements
        if (elements.length != data.length) {
          // 计算出错
          console.log(response)
          throw Error()
        }
        console.log(elements)
        // 将计算结果赋值给查出来的元素
        for (const index in elements) {
          data[index].distance = elements[index].distance
          // console.log(elements[index])
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  // 根据距离对结果进行排序
  const sort = distance_filter_ele.sort
  // 默认优先按照距离最近排序
  console.log(_key != 'evaluation_stars')
  console.log("============= sort")
  console.log(sort)
  if (sort != 0 && _key != 'evaluation_stars') {
    result.data.sort(function (merchantA, merchantB) {
      return (merchantA.distance - merchantB.distance) * sort
    })
  } else if (_key == "") {

    // 默认按照 weight 排序
    result.data.sort(function (merchantA, merchantB) {
      // 默认大的在后面， 升序 ，所以要乘以 -1
      let sort = (merchantA.weight - merchantB.weight) * -1;
      // 优先权重展示
      if (sort != 0) {
        return sort;
      }
      // 优先平级展示
      // sort = (merchantA.evaluation_stars - merchantB.evaluation_stars) * -1;
      // if (sort != 0) {
      //   return sort;
      // }

      // 随机生成顺序
      return Math.random() - 0.5;
      // return sort
    })
  };
  console.log(result)
  return result
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
};