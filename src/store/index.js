import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 面包屑
    breadUrl: [],
    title: '首页'
  },
  mutations: {
    // 路由跳转
    getRoute (state, route) {
      state.breadUrl = route
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
