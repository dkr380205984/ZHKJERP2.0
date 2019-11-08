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
      path: '/sample/sampleList',
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
    }]
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
  if (to.name !== store.state.breadUrl[store.state.breadUrl.length - 1].name) {
    store.commit('routerChange', {
      name: to.name,
      url: to.fullPath
    })
  } else {
    store.commit('hashChange', to.fullPath)
  }
  next()
})

export default router
