<template>
  <div class='printHtml'
    id='deductTable'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{`${companyName}扣款单`}}</span>
          <span class="item">
            <span class="label">打印人：</span>
            {{user_name}}
          </span>
          <!-- <span class="item">
            <span class="label">联系电话：</span>
            {{user_tel}}
          </span> -->
          <span class="item">
            <span class="label">打印时间：</span>
            <printTime :data-time='$getTime()' />
          </span>
        </div>
        <div class="right">
          <span class="text">扫一扫<br />查看电子文档</span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="二维码">
          </span>
        </div>
      </div>
      <div class="print_body"
        style="flex:0">
        <div class="print_row">
          <span class="row_item left w180">扣款编号</span>
          <span class="row_item left">{{info.deduct_code}}</span>
        </div>
        <div class="print_row">
          <span class="row_item left w180">扣款日期</span>
          <span class="row_item left">{{$getTime(info.complete_time)}}</span>
        </div>
        <div class="print_row">
          <span class="row_item left w180">扣款单位</span>
          <span class="row_item left">{{info.client_name}}</span>
        </div>
        <div class="print_row">
          <span class="row_item left w180">扣款金额</span>
          <span class="row_item left">{{info.deduct_price || 0}}元</span>
        </div>
        <div class="print_row minH88">
          <span class="row_item left w180">包含订单</span>
          <span class="row_item left">{{info.order_code.map(itemOrder=>itemOrder.order_code).join(';')}}</span>
        </div>
        <div class="print_row minH128">
          <span class="row_item left w180">扣款原因</span>
          <span class="row_item left">{{info.desc || ''}}</span>
        </div>
      </div>
      <div class="bottom_info">
        <span class="item">扣款负责人签字：</span>
        <span class="item">扣款单位负责人签字：</span>
      </div>
    </div>
  </div>
</template>

<script>
import { chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('full_name'),
      user_name: window.sessionStorage.getItem('user_name'),
      qrCodeUrl: '',
      info: {}
    }
  },
  created () {
    chargebacks.log({
      client_id: this.$route.params.clientId
      // type: [this.$route.params.type],
      // order_id: this.$route.query.orderId || ''
    }).then((res) => {
      this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
      setTimeout(() => {
        window.print()
      }, 200)
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/financialStatistics/oprDetail/' + this.$route.params.clientId + '/' + this.$route.params.type + '/' + this.$route.params.oprId + '/扣款?orderId=&orderType=', { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/financialStatistics/deductTable.less";
</style>
