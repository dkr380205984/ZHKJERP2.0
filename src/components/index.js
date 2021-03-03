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
import scannerWatcher from './scannerWatcher/scannerWatcher.vue'
import lookPrice from './lookPrice/lookPrice.vue'
import orderList from './orderList/orderList.vue'
import orderAbout from './orderAbout/orderAbout.vue'
import zhSort from './zhSort/zhSort.vue'
import printTime from './printTime/printTime.vue'
import craftCourse from './craftCourse/craftCourse.vue'
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
    vue.component('scannerWatcher', scannerWatcher)
    vue.component('lookPrice', lookPrice)
    vue.component('orderList', orderList)
    vue.component('orderAbout', orderAbout)
    vue.component('zhSort', zhSort)
    vue.component('printTime', printTime)
    vue.component('craftCourse', craftCourse)
  }
}
