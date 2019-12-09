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
    name: '首页',
    component: () => import('../views/index.vue'),
    children: [{
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
      path: '/materialPlan/materialPlanList',
      name: '物料计划单列表',
      component: () => import('../views/materialPlan/materialPlanList.vue')
    }, {
      path: '/materialOrder/materialOrderCreate',
      name: '物料预定购',
      component: () => import('../views/materialOrder/materialOrderCreate.vue')
    }, {
      path: '/materialOrder/materialOrderUpdate/:id',
      name: '物料预定购修改',
      component: () => import('../views/materialOrder/materialOrderUpdate.vue')
    }, {
      path: '/materialOrder/materialOrderDetail/:id',
      name: '物料预定购入库',
      component: () => import('../views/materialOrder/materialOrderDetail.vue')
    }, {
      path: '/materialOrder/materialOrderList/:params',
      name: '物料预定购列表',
      component: () => import('../views/materialOrder/materialOrderList.vue')
    }, {
      path: '/setting/setting',
      name: '系统设置',
      component: () => import('../views/setting/setting.vue')
    }]
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
    '编辑页': ['织为云', '编辑页'],
    '详情页': ['织为云', '详情页'],
    '列表页': ['织为云', '列表页'],
    '样品添加': ['织为云', '样品添加'],
    '样品详情': ['织为云', '样品列表', '样品详情'],
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
    '系统设置': ['织为云', '系统设置']
  }
  store.commit('getRoute', routerTable[to.name])
  next()
})

export default router
