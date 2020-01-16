<template>
  <div class='printHtml'>
    <div class="printTag center">
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">订单号</span>： -->
        <span class="tag_info">{{printInfo.order_code}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">加工单位</span>： -->
        <span class="tag_info">{{printInfo.client_name}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">产品信息</span>： -->
        <span class="tag_info">{{printInfo.product_code}}<br />{{printInfo.type ? printInfo.type.join('/') : ''}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">尺码颜色</span>： -->
        <span class="tag_info">{{printInfo.size +  '/' + printInfo.color}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">类型</span>： -->
        <span class="tag_info">{{$route.query.type === '1' ? '入库' : '出库'}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">件数</span>： -->
        <span class="tag_info">{{printInfo.count}}件</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">数量</span>： -->
        <span class="tag_info">{{printInfo.number + printInfo.unit}}</span>
      </div>
      <div class="tag_item col">
        <img :src="qrCodeUrl"
          alt=""
          class="tag_qrCode">
        <span class="tag_text">扫码快捷出入库</span>
      </div>
    </div>
  </div>
</template>

<script>
import { receive, dispatch } from '@/assets/js/api.js'
export default {
  data () {
    return {
      printInfo: {}
    }
  },
  methods: {

  },
  created () {
    if (this.$route.query.type === '1') {
      receive.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        let receiveData = res.data.data.find(item => Number(item.id) === Number(this.$route.query.logId))
        console.log(receiveData)
        if (receiveData) {
          this.printInfo = {
            client_name: receiveData.client_name,
            product_code: receiveData.product_code.code,
            type: [receiveData.category_info.category_name, receiveData.category_info.type_name, receiveData.category_info.style_name],
            size: receiveData.size,
            color: receiveData.color,
            count: receiveData.count,
            number: receiveData.number,
            unit: receiveData.category_info.unit
          }
        }
      })
    } else if (this.$route.query.type === '2') {
      dispatch.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        let dispatchData = res.data.data.find(item => Number(item.id) === Number(this.$route.query.logId))
        console.log(dispatchData)
      })
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id + '?logId=' + this.$route.query.logId + '&type=' + this.$route.query.type, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  filters: {
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/common.less";
</style>
