<template>
  <div class='printHtml'
    id='materialTable'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{title}}</span>
          <span class="item"><span class="label">联系人：</span>{{user_name}}</span>
          <span class="item"><span class="label">联系电话：</span>{{user_tel}}</span>
          <span class="item"><span class="label">创建时间：</span>{{$getTime()}}</span>
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
        <div class="print_row posBottom">
          <span class="row_item center w180">备注</span>
          <span class="row_item left remark_span"
            v-html='remark'></span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">订单号</span>
          <span class="row_item left">{{orderInfo.order_code}}</span>
          <span class="row_item center w180">订单公司</span>
          <span class="row_item left flex08">{{orderInfo.client_name}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">加工单位</span>
          <span class="row_item left">{{$route.query.clientName}}</span>
          <span class="row_item center w180">总价</span>
          <span class="row_item left flex08">{{total_price}}元</span>
        </div>
        <template v-for="(item,index) in materialInfo">
          <div class="print_row bgGray"
            :key="index + 'title'">
            <span class="row_item w180 center">{{$route.params.type === '1' ? '原' : '辅'}}料名称{{index + 1}}</span>
            <span class="row_item left">{{item.material_name}}</span>
            <span class="row_item w180 center">总价</span>
            <span class="row_item left flex08">{{item.total_price || 0}}元</span>
          </div>
          <template v-for="(itemColor,indexColor) in item.color_info">
            <div class="print_row"
              :key="indexColor + 'content' + index">
              <span class="row_item w180 center">颜色{{indexColor+1}}</span>
              <span class="row_item noBorder left">{{itemColor.color}}</span>
              <span class="row_item noBorder left">{{itemColor.price || 0}}元/kg</span>
              <span class="row_item noBorder left">{{itemColor.number || 0}}kg</span>
              <span class="row_item noBorder left">{{itemColor.complete_time}}</span>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { order, materialManage, print } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      user_name: window.sessionStorage.getItem('user_name'),
      user_tel: window.sessionStorage.getItem('user_telephone'),
      qrCodeUrl: '',
      orderInfo: {},
      materialInfo: [],
      total_price: '',
      title: '',
      remark: ''
    }
  },
  methods: {

  },
  created () {
    Promise.all([
      order.detail({
        id: this.$route.params.id
      }),
      materialManage.detail({
        order_type: this.$route.params.orderType,
        order_id: this.$route.params.id
      }),
      print.detail({
        type: this.$route.params.type === '1' ? 5 : 6
      })
    ]).then(res => {
      this.orderInfo = res[0].data.data
      let materialInfo = res[1].data.data.filter(item => item.client_name === this.$route.query.clientName || item.stock_name === this.$route.query.clientName)
      this.materialInfo = this.$mergeData(materialInfo, { mainRule: 'material_name', childrenName: 'color_info', childrenRule: { mainRule: ['color_code/color', 'price'], otherRule: [{ name: 'weight/number', type: 'add' }, { name: 'complete_time' }] } }).map(item => {
        item.total_price = item.color_info.map(val => this.$toFixed((val.number * val.price) || 0)).reduce((a, b) => a + b)
        return item
      })
      this.total_price = this.materialInfo.map(item => (item.total_price || 0)).reduce((a, b) => a + b)
      this.title = res[2].data.data ? res[2].data.data.title : (window.sessionStorage.getItem('company_name') + (this.$route.params.type === '1' ? '原料' : '辅料') + (this.$route.query.type === '1' ? '调取' : '订购') + '单')
      this.remark = res[2].data.data ? res[2].data.data.desc : ''
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialTable.less";
</style>
