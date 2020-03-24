import zhInput from './zhInput/zhInput.vue'
import zhNav from './zhNav/zhNav.vue'
import zhImgList from './zhImgList/zhImgList.vue'
import zhCard from './zhCard/zhCard.vue'
import zhCardPosition from './zhCardPosition/zhCardPosition.vue'
import colorPicker from './colorPicker/colorPicker.vue'
import zhBatch from './zhBatch/zhBatch.vue'
import zhTransition from './zhTransition/zhTransition.vue'
import zhMessage from './zhMessage/zhMessage.vue'
import zhTimeProcess from './zhTimeProcess/zhTimeProcess.vue'
export default {
  install: function (vue) {
    vue.component('zhInput', zhInput)
    vue.component('zhNav', zhNav)
    vue.component('zhImgList', zhImgList)
    vue.component('zhCard', zhCard)
    vue.component('zhCardPosition', zhCardPosition)
    vue.component('colorPicker', colorPicker)
    vue.component('zhBatch', zhBatch)
    vue.component('zhTransition', zhTransition)
    vue.component('zhMessage', zhMessage)
    vue.component('zhTimeProcess', zhTimeProcess)
  }
}
