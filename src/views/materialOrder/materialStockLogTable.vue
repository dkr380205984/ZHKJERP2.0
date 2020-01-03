<template>
  <div class='printHtml'
    id='materialOrderTable'>
    <div class="printTable crosswise">
      <div class="print_head">
        <div class="top">
          <span class="title">{{companyName}}物料预定购入库日志</span>
        </div>
        <div class="bottom">
          <span>创建人：</span><span>创建时间：{{$getTime()}}</span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item center w180">订购单位</span>
          <span class="row_item left">{{orderDetail.client_name}}</span>
          <span class="row_item center w180">订购日期</span>
          <span class="row_item left">{{orderDetail.order_time}}</span>
        </div>
        <div class="print_row">
          <span class="row_item center w180">订购重量</span>
          <span class="row_item left">{{orderDetail.total_weight}}kg</span>
          <span class="row_item center w180">预付款</span>
          <span class="row_item left">{{orderDetail.total_price}}元</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">入库重量</span>
          <span class="row_item left">{{orderDetail.stock_total_weight}}kg</span>
          <span class="row_item center w180">入库总价</span>
          <span class="row_item left">{{orderDetail.stock_total_price}}元</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item center">入库时间</span>
          <span class="row_item left flex12">物料名称</span>
          <span class="row_item left flex08">颜色</span>
          <span class="row_item left">入库仓库</span>
          <span class="row_item left flex08">数量</span>
          <span class="row_item left flex12">备注</span>
          <span class="row_item center flex08">操作人</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in logDetail"
          :key="index">
          <span class="row_item center">{{item.create_time}}</span>
          <span class="row_item left flex12">{{item.material_name}}</span>
          <span class="row_item left flex08">{{item.color_code}}</span>
          <span class="row_item left">{{item.stock_name}}</span>
          <span class="row_item left flex08">{{item.weight}}</span>
          <span class="row_item left flex12">{{item.desc}}</span>
          <span class="row_item center flex08">{{item.user_name}}</span>
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
      },
      logDetail: []
    }
  },
  methods: {

  },
  created () {
    Promise.all([
      materialOrder.detail({
        id: this.$route.params.id
      }),
      materialOrder.log({
        reserve_order_id: this.$route.params.id,
        stock_id: null,
        action: null,
        material_name: '',
        limit: 9999,
        page: 1
      })
    ]).then(res => {
      this.orderDetail = res[0].data.data
      this.logDetail = res[1].data.data
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
