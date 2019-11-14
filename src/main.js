import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mycomponent from './components'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 粒子特效 文档地址：https://www.jianshu.com/p/53199b842d25
import VueParticles from 'vue-particles'
import MyPlugin from './assets/js/plugin.js' // 全局方法
Vue.use(MyPlugin)
// import Pusher from 'pusher-js'
Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.use(mycomponent)

// Pusher.logToConsole = true

// var pusher = new Pusher('117b8da677e144ce8212', {
//   cluster: 'ap1',
//   forceTLS: true
// })

// var channel = pusher.subscribe('my-channel')
// channel.bind('my-event', function (data) {
//   alert(JSON.stringify(data))
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
