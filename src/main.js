import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mycomponent from './components'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 粒子特效 文档地址：https://www.jianshu.com/p/53199b842d25
import VueParticles from 'vue-particles'
import MyPlugin from './assets/js/plugin.js'
import ECharts from 'vue-echarts'
import 'echarts-gl'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
// 导入icon svg
import './assets/font/iconfont.js'

Vue.component('v-chart', ECharts)
Vue.use(MyPlugin)
Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.use(mycomponent)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
