import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 面包屑
    breadUrl: window.localStorage.getItem('breadUrl') ? JSON.parse(window.localStorage.getItem('breadUrl')) : [{
      name: '首页',
      url: '/index'
    }],
    title: '首页'
  },
  mutations: {
    // 路由跳转
    routerChange (state, route) {
      state.breadUrl.push(route)
      window.localStorage.setItem('breadUrl', JSON.stringify(state.breadUrl))
    },
    // 哈希变化,一般用于分页信息记录
    hashChange (state, fullpath) {
      state.breadUrl[state.breadUrl.length - 1].url = fullpath
      window.localStorage.setItem('breadUrl', JSON.stringify(state.breadUrl))
    },
    // 路由重置
    routerReset () {
      // 当页面为某些基本路由时,需要重置下面包屑,防止面包屑越来越长
    },
    // 点击面包屑上的路由
    routerSlice (state, index) {
      const len = state.breadUrl.length
      if (index < len - 1) {
        state.breadUrl = state.breadUrl.slice(0, index + 1)
        window.localStorage.setItem('breadUrl', JSON.stringify(state.breadUrl))
        router.push(state.breadUrl[state.breadUrl.length - 1].url)
      }
    },
    // 标题赋值
    getTitle (state, title) {
      state.title = title
    }
  },
  actions: {
  },
  modules: {
  }
})
