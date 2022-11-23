// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {


  let _searchKey = event.searchKey

  const _filters = event.filters
  // 当前选中，按照那个排序
  const _key = event.key

  // 获取好评排序
  const evaluation_stars_filter_ele_sort = _filters.find(value => {
    return value.key == 'evaluation_stars'
  }).filters.find(ele => {
    return ele.selected
  }).sort

  // 获取好评排序
  const distance_filter_ele = _filters.find(value => {
    return value.key == 'distance'
  }).filters.find(ele => {
    return ele.sort != 0 && ele.selected
  })

  // 服务类型
  const service_type_filter_ele_key = _filters.find(value => {
    return value.key == 'service_type'
  }).filters.find(ele => {
    return ele.selected
  }).key


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
    }]))
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

  return result
}