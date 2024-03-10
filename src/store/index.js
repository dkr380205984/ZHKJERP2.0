import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 面包屑
    breadUrl: [],
    title: '首页',
    // 消息通知需要用的分组集合
    group: [],
    // 消息通知人员列表
    userList: []
  },
  mutations: {
    // 路由跳转
    getRoute (state, route) {
      if (route.name !== '首页' && route.name !== 'login') {
        let finded = state.breadUrl.find((item) => {
          return item.name === route.name
        })
        if (finded) {
          finded.fullPath = route.fullPath
        } else {
          state.breadUrl.push(route)
        }
      }
    },
    deleteRoute (state, route) {
      let spliceIndex = 0
      let finded = state.breadUrl.find((item, index) => {
        spliceIndex = index
        return item.name === route.name
      })
      if (finded) {
        state.breadUrl.splice(spliceIndex, 1)
      }
    },
    // 标题赋值
    getTitle (state, title) {
      state.title = title
    },
    getGroup (state, data) {
      state.group = data
    },
    getUserList (state, data) {
      state.userList = data
    }
  },
  actions: {
  },
  modules: {
  }
})
