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
      path: '/sample/sampleOrderCreate',
      name: '样单添加',
      component: () => import('../views/sample/sampleOrderCreate.vue')
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
      name: '样单添加',
      component: () => import('../views/sample/sampleOrderCreate.vue')
    }, {
      path: '/sample/sampleOrderList',
      name: '样单列表',
      component: () => import('../views/sample/sampleOrderList.vue')
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
    '产品添加': ['织为云', '产品添加'],
    '产品列表': ['织为云', '产品列表'],
    '产品详情': ['织为云', '产品列表', '产品详情'],
    '产品修改': ['织为云', '产品列表', '产品修改'],
    '报价单添加': ['织为云', '报价单添加'],
    '报价单修改': ['织为云', '报价单修改'],
    '报价单列表': ['织为云', '报价单列表'],
    '报价单详情': ['织为云', '报价单列表', '报价单详情']
  }
  store.commit('getRoute', routerTable[to.name])
  next()
})

export default router
