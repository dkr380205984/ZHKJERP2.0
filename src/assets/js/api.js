import http from './http.js'
const baseUrl = '/api'
// 登录
const login = (params) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// 注销
const logout = (params) => http.post(`${baseUrl}/auth/logout`, params, 'application/json')
// token
const getToken = (params) => http.get(`${baseUrl}/upload/token`, params)
// 删除上传文件
const deleteFile = (params) => http.post(`${baseUrl}/file/delete`, params, 'application/json')
// 潘通色号
const pantongList = (params) => http.get(`${baseUrl}/pan/color/list`, params)

// 样品管理
const sample = {
  create: (params) => http.post(`${baseUrl}/sample/product/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/sample/product/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/sample/product/detail`, params),
  editDetail: (params) => http.get(`${baseUrl}/sample/product/edit`, params), // 样品修改时获取的详情数据
  delete: (params) => http.post(`${baseUrl}/sample/product/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/sample/product/list`, params)
}
// 产品管理
const product = {
  create: (params) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/one`, params),
  delete: (params) => http.post(`${baseUrl}/product/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/list`, params)
}
// 产品类型
const productType = {
  create: (params) => http.post(`${baseUrl}/product/category/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/category/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/category/list`, params)
}
// 花型
const flower = {
  create: (params) => http.post(`${baseUrl}/product/flower/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/flower/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/flower/list`, params)
}
// 原料纱线
const yarn = {
  create: (params) => http.post(`${baseUrl}/product/flower/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/flower/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/yarn/list`, params)
}
// 原料纱线颜色管理
const yarnColor = {
  create: (params) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/yarn/color/list`, params)
}
// 产品成分
const ingredient = {
  create: (params) => http.post(`${baseUrl}/product/component/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/component/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/component/list`, params)
}
// 产品配色
const colour = {
  create: (params) => http.post(`${baseUrl}/product/color/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/color/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/color/list`, params)
}
// 辅料
const material = {
  create: (params) => http.post(`${baseUrl}/product/material/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/material/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/material/one`, params),
  list: (params) => http.get(`${baseUrl}/product/material/list`, params)
}
// 工艺单设置管理 边形/机型/组织法
const craftConfig = {
  getAll: (params) => http.get(`${baseUrl}/production/edit/list`, params)
}
// 工艺单穿综法
const penetrationMethod = {
  create: (params) => http.post(`${baseUrl}/craft/pattern/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/craft/pattern/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/craft/pattern/list`, params)
}
// 工艺单
const craft = {
  create: (params) => http.post(`${baseUrl}/product/craft/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/product/craft/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/craft/draft/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/craft/one`, params),
  getByProduct: (params) => http.get(`${baseUrl}/craft/product/one`, params),
  setDefault: (params) => http.post(`${baseUrl}/product/craft/default`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/craft/list`, params)
}
// 客户管理
const client = {
  create: (params) => http.post(`${baseUrl}/client/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/client/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/client/one`, params),
  list: (params) => http.get(`${baseUrl}/client/list`, params)
}
// 小组
const group = {
  create: (params) => http.post(`${baseUrl}/user/group/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/user/group/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/client/one`, params),
  list: (params) => http.get(`${baseUrl}/user/group/list`, params)
}
// 工序
const course = {
  create: (params) => http.post(`${baseUrl}/production/flow/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/client/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/client/one`, params),
  list: (params) => http.get(`${baseUrl}/production/flow/list`, params)
}
// 报价单管理
const price = {
  create: (params) => http.post(`${baseUrl}/product/quotation/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/quotation/delete`, params, 'application/json'),
  check: (params) => http.post(`${baseUrl}/product/quotation/check`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/quotation/detail`, params),
  list: (params) => http.get(`${baseUrl}/product/quotation/list`, params)
}
// 物料价格管理
const yarnPrice = {
  create: (params) => http.post(`${baseUrl}/product/quotation/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/quotation/delete`, params, 'application/json'),
  check: (params) => http.post(`${baseUrl}/product/quotation/check`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/quotation/detail`, params),
  list: (params) => http.get(`${baseUrl}/yarn/price/list`, params)
}
// 配料单管理
const planList = {
  create: (params) => http.post(`${baseUrl}/product/quotation/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/quotation/delete`, params, 'application/json'),
  check: (params) => http.post(`${baseUrl}/product/quotation/check`, params, 'application/json'),
  detail_code: (params) => http.get(`${baseUrl}/product/plan/product/one`, params),
  list: (params) => http.get(`${baseUrl}/yarn/price/list`, params)
}
// 配料单管理
const productPlan = {
  create: (params) => http.post(`${baseUrl}/material/match/card/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/material/match/card/one`, params),
  getByProduct: (params) => http.get(`${baseUrl}/material/match/card/product`, params),
  setDefault: (params) => http.post(`${baseUrl}/material/match/card/default`, params, 'application/json') // 设置默认配料单
}
// 工厂信息管理
const company = {
  detail: (params) => http.get(`${baseUrl}/company/detail`, params)
}
// 仓库
const stock = {
  list: (params) => http.get(`${baseUrl}/factory/store/list`, params)
}
// 订单
const order = {
  create: (params) => http.post(`${baseUrl}/order/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/order/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/order/list`, params),
  detail: (params) => http.get(`${baseUrl}/order/detail`, params),
  editDetail: (params) => http.get(`${baseUrl}/order/one`, params)
}
const sampleOrder = {
  create: (params) => http.post(`${baseUrl}/sample/orders/save`, params, 'application/json'),
  // delete: (params) => http.post(`${baseUrl}/sample/orders/save`, params, 'application/json'),
  editDetail: (params) => http.get(`${baseUrl}/sample/orders/edit`, params),
  list: (params) => http.get(`${baseUrl}/sample/orders/all`, params),
  detail: (params) => http.get(`${baseUrl}/sample/orders/one`, params)
}

// 物料预定购
const materialOrder = {
  create: (params) => http.post(`${baseUrl}/material/reserve/save`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/material/reserve/list`, params),
  detail: (params) => http.get(`${baseUrl}/material/reserve/detail`, params),
  stockIn: (params) => http.post(`${baseUrl}/material/stock/reserve/push`, params, 'application/json'),
  log: (params) => http.get(`${baseUrl}/stock/material/detail`, params),
  logDelete: (params) => http.post(`${baseUrl}/material/reserve/delete`, params, 'application/json')
}
// 物料计划单
const materialPlan = {
  init: (params) => http.get(`${baseUrl}/order/material/plan/init`, params),
  create: (params) => http.post(`${baseUrl}/order/material/plan/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/order/material/plan/show`, params),
  editDetail: (params) => http.get(`${baseUrl}/order/material/plan/show`, params)
}

export {
  materialPlan,
  sampleOrder,
  stock,
  materialOrder,
  order,
  company,
  planList,
  productPlan,
  craftConfig,
  craft,
  penetrationMethod,
  yarnPrice,
  price,
  yarn,
  yarnColor,
  group,
  course,
  client,
  login,
  logout,
  getToken,
  deleteFile,
  pantongList,
  sample,
  product,
  productType,
  flower,
  ingredient,
  colour,
  material
}
