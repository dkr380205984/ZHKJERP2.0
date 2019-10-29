import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mycomponent from './components'

Vue.config.productionTip = false
Vue.use(mycomponent)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
