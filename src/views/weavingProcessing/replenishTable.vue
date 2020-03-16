<template>
  <div class='printHtml'
    id='replenishTable'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{companyName}}补纱单</span>
          <span class="item"><span class="label">联系人：</span>{{user_name}}</span>
          <span class="item"><span class="label">联系电话：</span></span>
          <span class="item"><span class="label">创建日期：</span>{{$getTime()}}</span>
        </div>
        <div class="right">
          <span class="text">
            扫一扫<br />查看电子文档
          </span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item center w180">订单号</span>
          <span class="row_item left">{{orderInfo.order_code||orderInfo.title}}</span>
          <span class="row_item center w180">下单日期</span>
          <span class="row_item left">{{orderInfo.order_time}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">订单公司</span>
          <span class="row_item left">{{orderInfo.client_name}}</span>
          <span class="row_item center w180">负责小组</span>
          <span class="row_item left">{{orderInfo.group_name}}</span>
        </div>
        <template v-for="(item,index) in replenishInfo">
          <div class="print_row"
            :key="index + 'client'">
            <span class="row_item center w180">补纱单位</span>
            <span class="row_item left">{{item.client_name}}</span>
          </div>
          <template v-for="(itemR,indexR) in item.replenish_info">
            <div class="print_row"
              :key="indexR + 'replenish'">
              <span class="row_item center">承担比例{{itemR.percent}}%</span>
            </div>
            <div class="print_row bgGray"
              :key='indexR + "header"'>
              <span class="row_item center flex04">序号</span>
              <span class="row_item left">物料名称</span>
              <span class="row_item left flex06">颜色</span>
              <span class="row_item left flex06">数量</span>
            </div>
            <div class="print_row"
              v-for="(itemMa,indexMa) in itemR.material_info"
              :key='indexMa + "material"'>
              <span class="row_item center flex04">{{"纱线" + chinaNum[indexMa]}}</span>
              <span class="row_item left">{{itemMa.material_name}}</span>
              <span class="row_item left flex06">{{itemMa.color}}</span>
              <span class="row_item left flex06">{{itemMa.weight + 'kg'}}</span>
            </div>
          </template>
        </template>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <span class="row_item center w180">备注</span>
          <span class="row_item left"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { order, replenish, sampleOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      user_name: window.sessionStorage.getItem('user_name'),
      user_tel: window.localStorage.getItem('zhUsername'),
      qrCodeUrl: '',
      orderInfo: {},
      replenishInfo: [],
      chinaNum: chinaNum
    }
  },
  methods: {
    init (type) {
      if (+type === 1) {
        Promise.all([
          order.detail({
            id: this.$route.params.id
          }),
          replenish.list({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type
          })
        ]).then(res => {
          this.orderInfo = res[0].data.data
          let printLogId = this.$route.query.id.split(',')
          this.replenishInfo = this.$mergeData(res[1].data.data.filter(item => printLogId.indexOf((item.id).toString()) !== -1), { mainRule: 'replenish_name/client_name', childrenName: 'other_info' }).map(item => {
            return {
              client_name: item.client_name,
              replenish_info: this.$mergeData(item.other_info.map(value => {
                return {
                  material_name: value.material_name,
                  color: value.material_color,
                  weight: value.need_weight,
                  percent: value.client_info.find(val => val.client_name === item.client_name).percent
                }
              }), { mainRule: 'percent', childrenName: 'material_info' })
            }
          })
          setTimeout(() => {
            window.print()
          }, 1000)
        })
      } else {
        Promise.all([
          sampleOrder.detail({
            id: this.$route.params.id
          }),
          replenish.list({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type
          })
        ]).then(res => {
          this.orderInfo = res[0].data.data
          let printLogId = this.$route.query.id.split(',')
          this.replenishInfo = this.$mergeData(res[1].data.data.filter(item => printLogId.indexOf((item.id).toString()) !== -1), { mainRule: 'replenish_name/client_name', childrenName: 'other_info' }).map(item => {
            return {
              client_name: item.client_name,
              replenish_info: this.$mergeData(item.other_info.map(value => {
                return {
                  material_name: value.material_name,
                  color: value.material_color,
                  weight: value.need_weight,
                  percent: value.client_info.find(val => val.client_name === item.client_name).percent
                }
              }), { mainRule: 'percent', childrenName: 'material_info' })
            }
          })
          setTimeout(() => {
            window.print()
          }, 1000)
        })
      }
    }
  },
  created () {
    this.init(this.$route.params.type)
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/weavingProcessing/weavingDetail/' + this.$route.params.id + '/' + this.$route.params.type + '?showReplenishPopup=true', { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/weavingProcessing/replenishTable.less";
</style>
