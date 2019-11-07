import zhInput from './zhInput/zhInput.vue'
import zhNav from './zhNav/zhNav.vue'
export default {
  install: function (vue) {
    vue.component('zhInput', zhInput)
    vue.component('zhNav', zhNav)
  }
}
