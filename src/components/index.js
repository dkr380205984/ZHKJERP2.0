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
import orderWarning from './orderWarning/orderWarning.vue'
import zhDeduct from './zhDeduct/zhDeduct.vue'
import zhFileModule from './zhFileModule/zhFileModule.vue'
import zhConfirmModule from './zhConfirmModule/zhConfirmModule.vue'
import historyPendant from './historyPendant/historyPendant.vue'
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
    vue.component('orderWarning', orderWarning)
    vue.component('zhDeduct', zhDeduct)
    vue.component('zhFileModule', zhFileModule)
    vue.component('zhConfirmModule', zhConfirmModule)
    vue.component('historyPendant', historyPendant)
  }
}
