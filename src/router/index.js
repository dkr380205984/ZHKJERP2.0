import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
Vue.use(VueRouter)
// 解决ele组件点击当前页路由时出错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('../views/error.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [{
      path: '/homePage/homePage',
      name: '首页',
      component: () => import('../views/homePage/homePage.vue')
    }, {
      path: '/css/edit',
      name: '编辑页',
      component: () => import('../views/css/edit.vue')
    }, {
      path: '/css/detail',
      name: '详情页',
      component: () => import('../views/css/detail.vue')
    }, {
      path: '/css/list',
      name: '列表页',
      component: () => import('../views/css/list.vue')
    }, {
      path: '/sample/sampleCreate',
      name: '样品添加',
      component: () => import('../views/sample/sampleCreate.vue')
    }, {
      path: '/sample/sampleDetail/:id',
      name: '样品详情',
      component: () => import('../views/sample/sampleDetail.vue')
    }, {
      path: '/sample/sampleUpdate/:id',
      name: '样品修改',
      component: () => import('../views/sample/sampleUpdate.vue')
    }, {
      path: '/sample/sampleList/:params',
      name: '样品列表',
      component: () => import('../views/sample/sampleList.vue')
    }, {
      path: '/sample/sampleOrderCreate',
      name: '样品订单添加',
      component: () => import('../views/sample/sampleOrderCreate.vue')
    }, {
      path: '/sample/sampleOrderUpdate/:id',
      name: '样品订单修改',
      component: () => import('../views/sample/sampleOrderUpdate.vue')
    }, {
      path: '/sample/sampleOrderList/:params',
      name: '样品订单列表',
      component: () => import('../views/sample/sampleOrderList.vue')
    }, {
      path: '/sample/sampleOrderDetail/:id',
      name: '样品订单详情',
      component: () => import('../views/sample/sampleOrderDetail.vue')
    }, {
      path: '/product/productCreate',
      name: '产品添加',
      component: () => import('../views/product/productCreate.vue')
    }, {
      path: '/product/productList/:params',
      name: '产品列表',
      component: () => import('../views/product/productList.vue')
    }, {
      path: '/product/productDetail/:id',
      name: '产品详情',
      component: () => import('../views/product/productDetail.vue')
    }, {
      path: '/product/productUpdate/:id',
      name: '产品修改',
      component: () => import('../views/product/productUpdate.vue')
    }, {
      path: '/price/priceCreate',
      name: '报价单添加',
      component: () => import('../views/price/priceCreate.vue')
    }, {
      path: '/price/priceUpdate/:id',
      name: '报价单修改',
      component: () => import('../views/price/priceUpdate.vue')
    }, {
      path: '/price/priceList/:params',
      name: '报价单列表',
      component: () => import('../views/price/priceList.vue')
    }, {
      path: '/price/priceDetail/:id',
      name: '报价单详情',
      component: () => import('../views/price/priceDetail.vue')
    }, {
      path: '/craft/craftCreate/:id/:type',
      name: '工艺单添加',
      component: () => import('../views/craft/craftCreate.vue')
    }, {
      path: '/craft/craftUpdate/:id/:type',
      name: '工艺单修改',
      component: () => import('../views/craft/craftUpdate.vue')
    }, {
      path: '/craft/craftDetail/:id/:type',
      name: '工艺单详情',
      component: () => import('../views/craft/craftDetail.vue')
    }, {
      path: '/order/orderList/:params',
      name: '订单列表',
      component: () => import('../views/order/orderList.vue')
    }, {
      path: '/order/orderDetail/:id',
      name: '订单详情',
      component: () => import('../views/order/orderDetail.vue')
    }, {
      path: '/order/orderCreate',
      name: '订单添加',
      component: () => import('../views/order/orderCreate.vue')
    }, {
      path: '/order/orderUpdate/:id',
      name: '订单修改',
      component: () => import('../views/order/orderUpdate.vue')
    }, {
      path: '/productPlan/productPlanCreate/:id/:type',
      name: '配料单添加',
      component: () => import('../views/productPlan/productPlanCreate.vue')
    }, {
      path: '/productPlan/productPlanUpdate/:id/:type',
      name: '配料单修改',
      component: () => import('../views/productPlan/productPlanUpdate.vue')
    }, {
      path: '/productPlan/productPlanDetail/:id/:type',
      name: '配料单详情',
      component: () => import('../views/productPlan/productPlanDetail.vue')
    }, {
      path: '/materialPlan/materialPlanCreate/:id/:type',
      name: '物料计划单添加',
      component: () => import('../views/materialPlan/materialPlanCreate.vue')
    }, {
      path: '/materialPlan/materialPlanUpdate/:id/:type',
      name: '物料计划单修改',
      component: () => import('../views/materialPlan/materialPlanUpdate.vue')
    }, {
      path: '/materialPlan/materialPlanDetail/:id/:type',
      name: '物料计划单详情',
      component: () => import('../views/materialPlan/materialPlanDetail.vue')
    }, {
      path: '/materialPlan/materialPlanList/:params/:type',
      name: '物料计划单列表',
      component: () => import('../views/materialPlan/materialPlanList.vue')
    }, {
      path: '/materialOrder/materialOrderCreate',
      name: '物料预订购',
      component: () => import('../views/materialOrder/materialOrderCreate.vue')
    }, {
      path: '/materialOrder/materialOrderUpdate/:id',
      name: '物料预订购修改',
      component: () => import('../views/materialOrder/materialOrderUpdate.vue')
    }, {
      path: '/materialOrder/materialOrderDetail/:id',
      name: '物料预订购入库',
      component: () => import('../views/materialOrder/materialOrderDetail.vue')
    }, {
      path: '/materialOrder/materialOrderList/:params',
      name: '物料预订购列表',
      component: () => import('../views/materialOrder/materialOrderList.vue')
    }, {
      path: '/material/materialDetail/:id/:type/:orderType',
      name: '物料订购',
      component: () => import('../views/material/materialDetail.vue')
    }, {
      path: '/material/materialList/:params/:type',
      name: '物料订购列表',
      component: () => import('../views/material/materialList.vue')
    }, {
      path: '/materialStock/materialStockList/:params/:type',
      name: '物料出入库列表',
      component: () => import('../views/materialStock/materialStockList.vue')
    }, {
      path: '/materialStock/materialStockDetail/:id/:type/:orderType',
      name: '物料出入库详情',
      component: () => import('../views/materialStock/materialStockDetail.vue')
    }, {
      path: '/materialStock/materialStockDetail/:id/:type',
      name: '辅料出入库详情',
      component: () => import('../views/materialStock/materialStockDetail.vue')
    }, {
      path: '/weavingProcessing/weavingDetail/:id/:orderType',
      name: '织造分配详情',
      component: () => import('../views/weavingProcessing/weavingDetail.vue')
    }, {
      path: '/weavingProcessing/weavingList/:params/:type',
      name: '织造分配列表',
      component: () => import('../views/weavingProcessing/weavingList.vue')
    }, {
      path: '/weavingProcessing/processingDetail/:id/:orderType',
      name: '半成品加工分配详情',
      component: () => import('../views/weavingProcessing/processingDetail.vue')
    }, {
      path: '/weavingProcessing/processingList/:params/:type',
      name: '半成品加工分配列表',
      component: () => import('../views/weavingProcessing/processingList.vue')
    }, {
      path: '/setting/setting',
      name: '系统设置',
      component: () => import('../views/setting/setting.vue')
    }, {
      path: '/stock/stockList/:params',
      name: '仓库列表',
      component: () => import('../views/stock/stockList.vue')
    }, {
      path: '/stock/stockDetail/:id/:type',
      name: '仓库详情',
      component: () => import('../views/stock/stockDetail.vue')
    }, {
      path: '/packPlan/packPlanList/:params',
      name: '装箱计划单列表',
      component: () => import('../views/packPlan/packPlanList.vue')
    }, {
      path: '/packPlan/packPlanCreate/:id',
      name: '装箱计划单详情',
      component: () => import('../views/packPlan/packPlanCreate.vue')
    }, {
      path: '/packPlan/packStockList/:params',
      name: '装箱出库列表',
      component: () => import('../views/packPlan/packStockList.vue')
    }, {
      path: '/packPlan/packStock/:id/:type',
      name: '装箱出库详情',
      component: () => import('../views/packPlan/packStock.vue')
    }, {
      path: '/packPlan/packOrderList/:params',
      name: '包装订购列表',
      component: () => import('../views/packPlan/packOrderList.vue')
    }, {
      path: '/packPlan/packOrderDetail/:id',
      name: '包装订购详情',
      component: () => import('../views/packPlan/packOrderDetail.vue')
    }, {
      path: '/receiveDispatch/receiveDispatchList/:params',
      name: '产品收发列表',
      component: () => import('../views/receiveDispatch/receiveDispatchList.vue')
    }, {
      path: '/receiveDispatch/receiveDispatchDetail/:id',
      name: '产品收发详情',
      component: () => import('../views/receiveDispatch/receiveDispatchDetail.vue')
    }, {
      path: '/inspection/inspectionList/:params',
      name: '产品检验列表',
      component: () => import('../views/inspection/inspectionList.vue')
    }, {
      path: '/inspection/finishedDetail/:id',
      name: '成品检验详情',
      component: () => import('../views/inspection/finishedDetail.vue')
    }, {
      path: '/inspection/semiFinishedDetail/:id',
      name: '半成品检验详情',
      component: () => import('../views/inspection/semiFinishedDetail.vue')
    }, {
      path: '/equipment',
      name: '设备管理',
      component: () => import('../views/equipment/equipment.vue')
    }, {
      path: '/client/clientList/:params',
      name: '客户列表',
      component: () => import('../views/client/clientList.vue')
    }, {
      path: '/client/clientCreate',
      name: '客户添加',
      component: () => import('../views/client/clientCreate.vue')
    }, {
      path: '/client/clientUpdate/:id',
      name: '客户修改',
      component: () => import('../views/client/clientUpdate.vue')
    }, {
      path: '/client/clientDetail/:id',
      name: '客户详情',
      component: () => import('../views/client/clientDetail.vue')
    }]
  }, {
    path: '/tagProductPrint/:id/:info',
    name: 'tagProductPrint',
    component: () => import('../views/product/tagPrint.vue')
  }, {
    path: '/tagSamplePrint/:id/:info',
    name: 'tagSamplePrint',
    component: () => import('../views/sample/tagPrint.vue')
  }, {
    path: '/craftTable/:id/:type',
    name: 'craftTable',
    component: () => import('../views/craft/craftTable.vue')
  }, {
    path: '/productPlanTable/:id/:type/:index',
    name: 'productPlanTable',
    component: () => import('../views/productPlan/productPlanTable.vue')
  }, {
    path: '/materialPlanTable/:id/:type/:params',
    name: 'materialPlanTable',
    component: () => import('../views/materialPlan/materialPlanTable.vue')
  }, {
    path: '/materialOrderTable/:id',
    name: 'materialOrderTable',
    component: () => import('../views/materialOrder/materialOrderTable.vue')
  }, {
    path: '/materialStockLogTable/:id',
    name: 'materialStockLogTable',
    component: () => import('../views/materialOrder/materialStockLogTable.vue')
  }, {
    path: '/packOrderTable/:id',
    name: 'packOrderTable',
    component: () => import('../views/packPlan/packOrderTable.vue')
  }, {
    path: '/replenishTable/:id/:type',
    name: 'replenishTable',
    component: () => import('../views/weavingProcessing/replenishTable.vue')
  }, {
    path: '/materialTable/:id/:orderType/:type',
    name: 'materialTable',
    component: () => import('../views/material/materialTable.vue')
  }, {
    path: '/materialProcessTable/:id/:orderType/:type',
    name: 'materialProcessTable',
    component: () => import('../views/material/materialProcessTable.vue')
  }, {
    path: '/packPlanTable/:id/:planId',
    name: 'packPlanTable',
    component: () => import('../views/packPlan/packPlanTable.vue')
  }, {
    path: '/weaveTable/:id/:planId',
    name: 'weaveTable',
    component: () => import('../views/weavingProcessing/weaveTable.vue')
  }, {
    path: '/pricePrintTable/:id',
    name: 'pricePrintTable',
    component: () => import('../views/price/pricePrintTable.vue')
  }
]

let router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取标题
  store.commit('getTitle', to.name ? to.name : from.name)
  const routerTable = {
    '首页': ['织为云', '首页'],
    '编辑页': ['织为云', '编辑页'],
    '详情页': ['织为云', '详情页'],
    '列表页': ['织为云', '列表页'],
    '样品添加': ['织为云', '样品添加'],
    '样品详情': ['织为云', '样品列表', '样品详情'],
    '样品修改': ['织为云', '样品列表', '样品修改'],
    '样品列表': ['织为云', '样品列表'],
    '样品订单添加': ['织为云', '样品订单添加'],
    '样品订单详情': ['织为云', '样品订单列表', '样品订单详情'],
    '样品订单修改': ['织为云', '样品订单列表', '样品订单修改'],
    '样品订单列表': ['织为云', '样品订单列表'],
    '产品添加': ['织为云', '产品添加'],
    '产品列表': ['织为云', '产品列表'],
    '产品详情': ['织为云', '产品列表', '产品详情'],
    '产品修改': ['织为云', '产品列表', '产品修改'],
    '报价单添加': ['织为云', '报价单添加'],
    '报价单修改': ['织为云', '报价单修改'],
    '报价单列表': ['织为云', '报价单列表'],
    '报价单详情': ['织为云', '报价单列表', '报价单详情'],
    '工艺单添加': ['织为云', '产品列表', '工艺单添加'],
    '工艺单修改': ['织为云', '产品列表', '工艺单修改'],
    '工艺单详情': ['织为云', '产品列表', '工艺单详情'],
    '订单添加': ['织为云', '订单添加'],
    '订单列表': ['织为云', '订单列表'],
    '订单修改': ['织为云', '订单列表', '订单修改'],
    '订单详情': ['织为云', '订单列表', '订单详情'],
    '配料单添加': ['织为云', '产品列表', '配料单添加'],
    '配料单修改': ['织为云', '产品列表', '配料单修改'],
    '配料单详情': ['织为云', '产品列表', '配料单详情'],
    '物料计划单添加': ['织为云', '物料计划单列表', '物料计划单添加'],
    '物料计划单列表': ['织为云', '物料计划单列表'],
    '物料计划单修改': ['织为云', '物料计划单列表', '物料计划单修改'],
    '物料计划单详情': ['织为云', '物料计划单列表', '物料计划单详情'],
    '物料预定购': ['织为云', '物料预定购'],
    '物料预定购列表': ['织为云', '物料预定购列表'],
    '物料预定购入库': ['织为云', '物料预定购列表', '物料预定购入库'],
    '物料预定购修改': ['织为云', '物料预定购列表', '物料预定购修改'],
    '仓库列表': ['织为云', '仓库列表'],
    '仓库详情': ['织为云', '仓库列表', '仓库详情'],
    '物料预订购': ['织为云', '物料预订购'],
    '物料预订购列表': ['织为云', '物料预订购列表'],
    '物料预订购入库': ['织为云', '物料预订购列表', '物料预订购入库'],
    '物料预订购修改': ['织为云', '物料预订购列表', '物料预订购修改'],
    '物料订购列表': ['织为云', '物料订购列表'],
    '物料订购': ['织为云', '物料订购列表', '物料订购'],
    '系统设置': ['织为云', '系统设置'],
    '物料出入库列表': ['织为云', '物料出入库列表'],
    '物料出入库详情': ['织为云', '物料出入库列表', '物料出入库详情'],
    '织造分配列表': ['织为云', '织造分配列表'],
    '织造分配详情': ['织为云', '织造分配列表', '织造分配详情'],
    '半成品加工分配列表': ['织为云', '半成品加工分配列表'],
    '半成品加工分配详情': ['织为云', '半成品加工分配详情'],
    '装箱计划单列表': ['织为云', '装箱计划单列表'],
    '装箱计划单详情': ['织为云', '装箱计划单列表', '装箱计划单详情'],
    '产品收发列表': ['织为云', '产品收发列表'],
    '产品收发详情': ['织为云', '产品收发列表', '产品收发详情'],
    '产品检验列表': ['织为云', '产品检验列表'],
    '成品检验详情': ['织为云', '产品检验列表', '成品检验详情'],
    '半成品检验详情': ['织为云', '产品检验列表', '半成品检验详情'],
    '装箱出库列表': ['织为云', '装箱出库列表'],
    '装箱出库详情': ['织为云', '装箱出库列表', '装箱出库详情'],
    '设备管理': ['织为云', '设备管理'],
    '客户列表': ['织为云', '客户列表'],
    '客户添加': ['织为云', '客户列表', '客户添加'],
    '客户修改': ['织为云', '客户列表', '客户修改'],
    '客户详情': ['织为云', '客户列表', '客户详情']
  }
  store.commit('getRoute', routerTable[to.name])
  next()
})

export default router
