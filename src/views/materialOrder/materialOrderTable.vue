<template>
  <div class='printHtml'
    id='materialOrderTable'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{companyName}}物料预定购单</span>
          <span class="item">
            <span class="label">创建人：</span>
          </span>
          <span class="item">
            <span class="label">联系电话：</span>
          </span>
          <span class="item">
            <span class="label">创建时间：</span>
            {{$getTime()}}
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
      <div class="print_body hasPosBottom">
        <div class="print_row">
          <span class="row_item center w180">订购公司</span>
          <span class="row_item left">{{orderDetail.client_name}}</span>
          <span class="row_item center w180">订购日期</span>
          <span class="row_item left">{{orderDetail.order_time}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">订购数量</span>
          <span class="row_item left">{{orderDetail.total_weight}}kg</span>
          <span class="row_item center w180">订单总价</span>
          <span class="row_item left">{{orderDetail.total_price}}元</span>
        </div>
        <div class="print_row posBottom">
          <span class="row_item center w180">备注</span>
          <span class="row_item left">{{orderDetail.desc}}</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in orderDetail.material_info"
          :key="index">
          <span class="row_item center w180">原料<span class="number">{{index + 1}}</span></span>
          <span class="row_item noBorder left">{{item.material_name}}</span>
          <span class="row_item noBorder flex04">{{item.color_code}}</span>
          <span class="row_item noBorder flex04">{{item.price}}元/kg</span>
          <span class="row_item noBorder flex04">{{item.weight}}kg</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: '桐庐凯瑞针纺',
      qrCodeUrl: '',
      orderDetail: {
        material_info: []
      }
    }
  },
  methods: {

  },
  created () {
    materialOrder.detail({
      id: this.$route.params.id
    }).then(res => {
      if (res.data.status !== false) {
        this.orderDetail = res.data.data
      }
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/materialOrder/materialOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialOrder/materialOrderTable.less";
</style>
