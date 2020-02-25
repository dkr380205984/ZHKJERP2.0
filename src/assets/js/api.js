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
// 产品尺码
const productSize = {
  create: (params) => http.post(`${baseUrl}/product/size/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/size/delete`, params, 'application/json')
}
// 产品规格
const measurement = {
  create: (params) => http.post(`${baseUrl}/product/measurement/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/measurement/delete`, params, 'application/json')
}
// 花型
const flower = {
  create: (params) => http.post(`${baseUrl}/product/flower/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/flower/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/flower/list`, params)
}
// 工艺单设置
const craftSetting = {
  list: (params) => http.get(`${baseUrl}/production/edit/list`, params),
  createSide: (params) => http.post(`${baseUrl}/production/side/save`, params, 'application/json'),
  deleteSide: (params) => http.post(`${baseUrl}/production/side/delete`, params, 'application/json'),
  createMachine: (params) => http.post(`${baseUrl}/production/type/save`, params, 'application/json'),
  deleteMachine: (params) => http.post(`${baseUrl}/production/type/delete`, params, 'application/json'),
  createMethods: (params) => http.post(`${baseUrl}/production/method/save`, params, 'application/json'),
  deleteMethods: (params) => http.post(`${baseUrl}/production/method/delete`, params, 'application/json')
}
// 原料纱线
const yarn = {
  create: (params) => http.post(`${baseUrl}/yarn/private/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/yarn/private/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/yarn/one`, params),
  list: (params) => http.get(`${baseUrl}/yarn/list`, params),
  priceLog: (params) => http.get(`${baseUrl}//yarn/one`, params)
}
// 原料纱线颜色管理
const yarnColor = {
  create: (params) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/yarn/color/delete`, params, 'application/json'),
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
  list: (params) => http.get(`${baseUrl}/product/material/list`, params),
  priceLog: (params) => http.get(`${baseUrl}/product/material/one`, params)
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
  list: (params) => http.get(`${baseUrl}/client/list`, params),
  disable: (params) => http.post(`${baseUrl}/client/status/check`, params, 'application/json')
}
// 人员管理
const auth = {
  create: (params) => http.post(`${baseUrl}/user/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/user/save`, params, 'application/json'),
  ban: (params) => http.post(`${baseUrl}/user/check_status`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/user/list`, params)
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
// const yarnPrice = {
//   create: (params) => http.post(`${baseUrl}/product/quotation/save`, params, 'application/json'),
//   delete: (params) => http.post(`${baseUrl}/product/quotation/delete`, params, 'application/json'),
//   check: (params) => http.post(`${baseUrl}/product/quotation/check`, params, 'application/json'),
//   detail: (params) => http.get(`${baseUrl}/product/quotation/detail`, params),
//   list: (params) => http.get(`${baseUrl}/yarn/price/list`, params)
// }
// 配料单管理
// const planList = {
//   create: (params) => http.post(`${baseUrl}/product/quotation/save`, params, 'application/json'),
//   delete: (params) => http.post(`${baseUrl}/product/quotation/delete`, params, 'application/json'),
//   check: (params) => http.post(`${baseUrl}/product/quotation/check`, params, 'application/json'),
//   detail_code: (params) => http.get(`${baseUrl}/material/match/card/product`, params),
//   list: (params) => http.get(`${baseUrl}/yarn/price/list`, params)
// }
// 配料单管理
const productPlan = {
  create: (params) => http.post(`${baseUrl}/material/match/card/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/material/match/card/one`, params),
  delete: (params) => http.post(`${baseUrl}/material/match/card/delete`, params, 'application/json'),
  getByProduct: (params) => http.get(`${baseUrl}/material/match/card/product`, params),
  setDefault: (params) => http.post(`${baseUrl}/material/match/card/default`, params, 'application/json') // 设置默认配料单
}
// 工厂信息管理
const company = {
  create: (params) => http.post(`${baseUrl}/company/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/company/detail`, params)
}
// 仓库
const stock = {
  create: (params) => http.post(`${baseUrl}/factory/store/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/factory/store/edit`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/factory/store/list`, params),
  detail: (params) => http.get(`${baseUrl}/factory/store/one`, params),
  yarnStock: (params) => http.post(`${baseUrl}/material/push`, params, 'application/json'),
  materialStock: (params) => http.post(`${baseUrl}/material/push`, params, 'application/json'),
  packStock: (params) => http.post(`${baseUrl}/pack/material/stock/save`, params, 'application/json'),
  productStock: (params) => http.post(`${baseUrl}/product/stock/save`, params, 'application/json')
}
// 物料库存（原料辅料都在这）
const yarnStock = {
  list: (params) => http.get(`${baseUrl}/stock/material/list`, params),
  log: (params) => http.get(`${baseUrl}/stock/material/detail`, params)
}
// 包装库存
const packStock = {
  list: (params) => http.get(`${baseUrl}/pack/material/stock/list`, params),
  log: (params) => http.get(`${baseUrl}/pack/material/stock/log/list`, params)
}
// 包装
const packag = {
  create: (params) => http.post(`${baseUrl}/pack/material/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/pack/material/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/pack/material/list`, params),
  priceLog: (params) => http.get(`${baseUrl}/pack/material/one`, params)
}
// 产品库存
const productStock = {
  list: (params) => http.get(`${baseUrl}/product/stock/list`, params),
  log: (params) => http.get(`${baseUrl}/product/stock/detail`, params)
}
// 订单
const order = {
  create: (params) => http.post(`${baseUrl}/order/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/order/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/order/list`, params),
  detail: (params) => http.get(`${baseUrl}/order/detail`, params),
  editDetail: (params) => http.get(`${baseUrl}/order/one`, params),
  changeStatus: (params) => http.post(`${baseUrl}/order/status/check`, params, 'application/json')
}
// 样品订单
const sampleOrder = {
  create: (params) => http.post(`${baseUrl}/sample/orders/save`, params, 'application/json'),
  // delete: (params) => http.post(`${baseUrl}/sample/orders/save`, params, 'application/json'),
  editDetail: (params) => http.get(`${baseUrl}/sample/orders/edit`, params),
  list: (params) => http.get(`${baseUrl}/sample/orders/all`, params),
  detail: (params) => http.get(`${baseUrl}/sample/orders/one`, params),
  changeStatus: (params) => http.post(`${baseUrl}/sample/status/check`, params, 'application/json')
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
  editDetail: (params) => http.get(`${baseUrl}/order/material/plan/show`, params),
  delete: (params) => http.post(`${baseUrl}/order/material/plan/delete`, params, 'application/json')
}
// 物料管理
const materialManage = {
  create: (params) => http.post(`${baseUrl}/material/order/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/material/order/list`, params),
  delete: (params) => http.post(`${baseUrl}/material/order/delete`, params, 'application/json'), // 订购调取撤销
  init: (params) => http.get(`${baseUrl}/material/order/init`, params) // 物料调取仓库初始化
}
// 加工工序
const process = {
  create: (params) => http.post(`${baseUrl}/production/flow/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/production/flow/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/production/flow/list`, params)
}
// 物料加工
const materialProcess = {
  create: (params) => http.post(`${baseUrl}/material/process/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/material/process/list`, params),
  delete: (params) => http.post(`${baseUrl}/material/process/delete`, params, 'application/json')
}
// 补纱 补辅料
const replenish = {
  create: (params) => http.post(`${baseUrl}/production/yarn/replenish/save`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/production/yarn/replenish/list`, params),
  delete: (params) => http.post(`${baseUrl}/production/yarn/replenish/delete`, params, 'application/json')
}
// 织造分配
const weave = {
  create: (params) => http.post(`${baseUrl}/production/weave/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/production/weave/list`, params),
  delete: (params) => http.post(`${baseUrl}/production/weave/delete`, params, 'application/json')
}
// 半成品加工分配
const processing = {
  create: (params) => http.post(`${baseUrl}/production/semi_product/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/production/semi_product/list`, params),
  delete: (params) => http.post(`${baseUrl}/production/semi_product/delete`, params, 'application/json')
}
// 产品收发入库
const receive = {
  create: (params) => http.post(`${baseUrl}/product/order/push`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/order/push/list`, params),
  delete: (params) => http.post(`${baseUrl}/product/order/push/delete`, params, 'application/json')
}
// 产品收发出库
const dispatch = {
  create: (params) => http.post(`${baseUrl}/product/order/pop`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/order/pop/list`, params),
  delete: (params) => http.post(`${baseUrl}/product/order/pop/delete`, params, 'application/json')
}
// 物料出入库
const materialStock = {
  init: (params) => http.get(`${baseUrl}/order/material/push/init`, params),
  create: (params) => http.post(`${baseUrl}/order/material/push`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/order/material/push/detail`, params),
  delete: (params) => http.post(`${baseUrl}/order/material/push/delete`, params, 'application/json')
}
// 装箱计划
const packPlan = {
  create: (params) => http.post(`${baseUrl}/pack/info/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/pack/info/list`, params),
  packOrder: (params) => http.post(`${baseUrl}/pack/order/save`, params, 'application/json'), // 包装订购
  packOrderLog: (params) => http.get(`${baseUrl}/pack/order/list`, params), // 包装订购日志,
  deletePackOrder: (params) => http.post(`${baseUrl}/pack/order/delete`, params, 'application/json'), // 包装订购删除
  packOut: (params) => http.post(`${baseUrl}/stock/out/save`, params, 'application/json'), // 装箱出库
  packOutLog: (params) => http.get(`${baseUrl}/stock/out/list`, params), // 装箱出库日志
  deletePackOut: (params) => http.post(`${baseUrl}/stock/out/delete`, params, 'application/json'), // 装箱出库删除
  packActual: (params) => http.post(`${baseUrl}/pack/real/save`, params, 'application/json'), // 实际装箱
  packActualLog: (params) => http.get(`${baseUrl}/pack/real/list`, params), // 实际装箱日志
  deletePackActual: (params) => http.post(`${baseUrl}/pack/real/delete`, params, 'application/json') // 实际装箱删除
}
// 产品检验
const inspection = {
  semiFinishedCreate: (params) => http.post(`${baseUrl}/production/semi/inspection`, params, 'application/json'),
  semiFinishedDetail: (params) => http.get(`${baseUrl}/production/semi/inspection/list`, params),
  semiFinishedDelete: (params) => http.post(`${baseUrl}/production/semi/inspection/delete`, params, 'application/json'),
  finishedCreate: (params) => http.post(`${baseUrl}/production/inspection`, params, 'application/json'),
  finishedDetail: (params) => http.get(`${baseUrl}/production/inspection/list`, params),
  finishedDelete: (params) => http.post(`${baseUrl}/production/inspection/delete`, params, 'application/json')
}
// 消息通知
const notify = {
  create: (params) => http.post(`${baseUrl}/notify/save`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/notify/all`, params),
  read: (params) => http.post(`${baseUrl}/notify/check/status`, params, 'application/json'),
  unread: (params) => http.get(`${baseUrl}/notify/no/read`, params) // 未读消息数量
}
// 订单财务总览
const finance = {
  detail: (params) => http.get(`${baseUrl}/financial/order/count/total`, params)
}
// 统计模块（财务统计模块）
const statistics = {
  orderList: (params) => http.get(`${baseUrl}/financial/order/overall/count/list`, params),
  orderStatistics: (params) => http.get(`${baseUrl}/financial/order/overall/count/total`, params),
  materialList: (params) => http.get(`${baseUrl}/financial/material/use/count/list`, params),
  materialDetail: (params) => http.get(`${baseUrl}/financial/material/use/count/detail`, params),
  productList: (params) => http.get(`${baseUrl}/financial/product/output/count/list`, params),
  clientList: (params) => http.get(`${baseUrl}/financial/cooperate/client/count/list`, params),
  clientStatistics: (params) => http.get(`${baseUrl}/financial/cooperate/client/count/total`, params),
  clientDetailList: (params) => http.get(`${baseUrl}/financial/cooperate/client/count/list`, params),
  clientDetailStatistics: (params) => http.get(`${baseUrl}/financial/cooperate/client/count/total`, params)
}
// 订单结算
const settle = {
  create: (params) => http.post(`${baseUrl}/financial/settle/save`, params, 'application/json'),
  check: (params) => http.post(`${baseUrl}/financial/settle/check`, params, 'application/json'),
  log: (params) => http.get(`${baseUrl}/financial/settle/list`, params),
  changeLog: (params) => http.get(`${baseUrl}/user/operate/logs`, params)
}
// 订单扣款
const chargebacks = {
  create: (params) => http.post(`${baseUrl}/financial/deduct/save`, params, 'application/json'),
  check: (params) => http.post(`${baseUrl}/financial/deduct/check`, params, 'application/json'),
  log: (params) => http.get(`${baseUrl}/financial/deduct/list`, params)
}
// 打印设置
const print = {
  create: (params) => http.post(`${baseUrl}/print/edit/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/print/edit/one`, params),
  list: (params) => http.get(`${baseUrl}/print/edit/list`, params)
}
// 全局搜索
const globleSearch = {
  search: (params) => http.post(`${baseUrl}/index/search`, params, 'application/json')
}
// 发货数量统计
const indexCount = {
  dispatchCount: (params) => http.get(`${baseUrl}/index/dispatch/count`, params)
}
// 修改账户密码
const changeUserPasd = (params) => http.post(`${baseUrl}/user/edit/pass`, params, 'application/json')
// 报价单预加载
const priceLoading = {
  create: (params) => http.post(`${baseUrl}/product/quotation/demo/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/quotation/demo/detail`, params),
  list: (params) => http.get(`${baseUrl}/product/quotation/demo/list`, params),
  delete: (params) => http.post(`${baseUrl}/product/quotation/demo/delete`, params, 'application/json')
}
export {
  priceLoading,
  settle,
  chargebacks,
  statistics,
  changeUserPasd,
  indexCount,
  globleSearch,
  print,
  finance,
  notify,
  packPlan,
  inspection,
  receive,
  dispatch,
  processing,
  materialStock,
  weave,
  productStock,
  packag,
  packStock,
  yarnStock,
  replenish,
  materialProcess,
  materialManage,
  materialPlan,
  auth,
  process,
  craftSetting,
  measurement,
  productSize,
  sampleOrder,
  stock,
  materialOrder,
  order,
  company,
  // planList,
  productPlan,
  craftConfig,
  craft,
  penetrationMethod,
  // yarnPrice,
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
