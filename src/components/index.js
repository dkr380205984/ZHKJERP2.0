import zhInput from './zhInput/zhInput.vue'
import zhNav from './zhNav/zhNav.vue'
import zhImgList from './zhImgList/zhImgList.vue'
export default {
  install: function (vue) {
    vue.component('zhInput', zhInput)
    vue.component('zhNav', zhNav)
    vue.component('zhImgList', zhImgList)
  }
}
