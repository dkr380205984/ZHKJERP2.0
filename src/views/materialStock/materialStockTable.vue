<template>
  <div id='materialStockTable'
    class="printHtml">
    <template v-for="(itemClient,indexClient) in printInfo">
      <div class="printTable crosswise"
        v-for="(itemMa,indexMa) in itemClient.info"
        :key="`${indexClient}_${indexMa}`">
        <div class="print_head row"
          style="font-size:18px">
          <div class="left">
            <h3 class="title">{{`${companyName}${$route.params.type === '2' ? '辅料' : '原料'}`}}{{itemClient.type|filterHandleType}}库单</h3>
            <div class="item">
              <span class="item_span">
                <span class="label">打印人：</span>
                {{userName}}
              </span>
              <span class="item_span">
                <span class="label">打印时间：</span>
                {{$getTime()}}
              </span>
              <span class="item_span">
                <span class="label">订单号：</span>
                {{order_code}}
              </span>
            </div>
            <div class="item">
              <span class="item_span">
                <span class="label">{{itemClient.type|filterHandleType}}库单位：</span>
                {{itemClient.client_name}}
              </span>
              <span class="item_span">
                <span class="label">{{itemClient.type|filterHandleType}}库时间：</span>
                {{$getTime(itemClient.complete_time)}}
              </span>
              <span class="item_span">
                <span class="label">操作类型：</span>
                {{itemClient.type|filterHandleTypeD}}
              </span>
            </div>
          </div>
          <div class="right">
            <div class="qrCode_box">
              <img :src="qrCodeUrl"
                alt="">
            </div>
          </div>
        </div>
        <div class="print_body"
          style="max-height:400px">
          <div class="print_row bgGray">
            <span class="row_item left"
              :style="`flex: ${$route.params.type === '2' ? 2.5 : 1.8}`">{{$route.params.type === '2' ? '辅' : '原'}}料名称</span>
            <span class="row_item left"
              :style="`flex: ${$route.params.type === '2' ? 2 : 1}`">{{$route.params.type === '2' ? '辅' : '原'}}料颜色{{$route.params.type === '2' && '或属性' || ''}}</span>
            <span class="row_item left"
              v-if="$route.params.type !== '2'">原料色号</span>
            <span class="row_item left"
              v-if="$route.params.type !== '2'">批/缸号</span>
            <span class="row_item left">{{itemClient.type|filterHandleType}}库数量</span>
            <span class="row_item left"
              v-if="itemClient.type !== 1 && itemClient.type !== 4">单价</span>
            <span class="row_item left"
              v-if="itemClient.type !== 1 && itemClient.type !== 4">{{itemClient.type|filterHandleType}}库总价</span>
            <span class="row_item left">备注</span>
          </div>
          <div class="print_row"
            style="max-height:50px;font-size:18px;"
            v-for="(itemMaI,indexMaI) in itemMa"
            :key="indexMaI">
            <!--
              为什么限定最高50px  不限定万一高度超出，样式会奇怪 并且可能会把下面的挤出print_body元素外  而print_body元素overflow:hidden了 会造成打印不全打印缺失数据
            -->
            <span class="row_item left"
              :style="`line-height: 1em;flex: ${$route.params.type === '2' ? 2.5 : 1.8}`"> {{itemMaI.material_name}} </span>
            <span class="row_item left"
              :style="`line-height: 1em;flex: ${$route.params.type === '2' ? 2 : 1}`">{{itemMaI.material_color}}</span>
            <span class="row_item left"
              v-if="$route.params.type !== '2'">{{itemMaI.color_number || ''}}</span>
            <span class="row_item left"
              v-if="$route.params.type !== '2'">{{itemMaI.vat_code || ''}}</span>
            <span class="row_item left">{{itemMaI.total_weight}}{{itemMaI.unit || ''}}</span>
            <span class="row_item left"
              v-if="itemClient.type !== 1 && itemClient.type !== 4">{{itemMaI.price}}</span>
            <span class="row_item left"
              v-if="itemClient.type !== 1 && itemClient.type !== 4">{{(itemMaI.total_price)}}</span>
            <span class="row_item left"
              style="line-height: 1em">{{itemMaI.desc || ''}}</span>
          </div>
          <div class="print_row"
            style="max-height:50px;font-size:18px;"
            v-for="(itemMaI,indexMaI) in (6 - itemMa.length)"
            :key="indexMaI">
            <!--
              为什么限定最高50px  不限定万一高度超出，样式会奇怪 并且可能会把下面的挤出print_body元素外  而print_body元素overflow:hidden了 会造成打印不全打印缺失数据
            -->
            <span class="row_item left"
              :style="`line-height: 1em;flex: ${$route.params.type === '2' ? 2.5 : 1.8}`"></span>
            <span class="row_item left"
              :style="`line-height: 1em;flex: ${$route.params.type === '2' ? 2 : 1}`"></span>
            <span class="row_item left"
              v-if="$route.params.type !== '2'"></span>
            <span class="row_item left"
              v-if="$route.params.type !== '2'"></span>
            <span class="row_item left"></span>
            <span class="row_item left"
              v-if="itemClient.type !== 1 && itemClient.type !== 4"></span>
            <span class="row_item left"
              v-if="itemClient.type !== 1 && itemClient.type !== 4"></span>
            <span class="row_item left"
              style="line-height: 1em"></span>
          </div>
          <div class="print_row"
            style="max-height:50px;font-size:18px;">
            <template v-if="itemClient.type !== 1 && itemClient.type !== 4">
              <span class="row_item center">合计金额</span>
              <span class="row_item center"
                style="flex:2">{{$toFixed(itemMa.map(itemM => +itemM.total_price || 0).reduce((total,current)=> total + current ), 0)}}</span>
            </template>
            <template v-else>
              <span class="row_item center"></span>
              <span class="row_item center"
                style="flex:2"></span>
            </template>
            <span class="row_item center">合计数量</span>
            <span class="row_item center"
              style="flex:2">{{$toFixed(itemMa.map(itemM => +itemM.total_weight || 0).reduce((total,current)=> total + current ), 0)}}</span>
          </div>
        </div>
        <div class="print_bottom">
          <span class="item_span">收货人签名：</span>
          <span class="item_span">送货人签名：</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { order, sampleOrder, materialStock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      order_code: '',
      printInfo: [],
      companyName: window.sessionStorage.getItem('full_name'),
      userName: window.sessionStorage.getItem('user_name'),
      qrCodeUrl: ''
    }
  },
  methods: {

  },
  created () {
    const orderApi = this.$route.params.orderType === '2' ? sampleOrder : order
    Promise.all([
      orderApi.detail({
        id: this.$route.params.id
      }),
      materialStock.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      })
    ]).then(res => {
      this.order_code = res[0].data.data.order_code || res[0].data.data.title
      const allLog = this.$route.query.logId ? res[1].data.data.filter(itemF => {
        return (
          (
            +itemF.material_type === +this.$route.params.type
          ) &&
          (
            this.$route.query.logId.split(',').includes(itemF.id.toString())
          )
        )
      }) : res[1].data.data.filter(itemF => +itemF.material_type === +this.$route.params.type)
      this.printInfo = this.$mergeData(allLog, { mainRule: ['client_id', 'type', 'complete_time'], otherRule: [{ name: 'client_name' }], childrenName: 'info' })
      this.printInfo.forEach(itemF => {
        itemF.info.forEach(itemFI => {
          itemFI.total_price = this.$toFixed((itemFI.total_weight * itemFI.price) || 0)
        })
        itemF.total_weight = this.$toFixed(itemF.info.map(itemM => +itemM.total_weight || 0).reduce((total, current) => total + current, 0))
        itemF.total_price = this.$toFixed(itemF.info.map(itemM => +itemM.total_price || 0).reduce((total, current) => total + current, 0))
        itemF.info = this.$newSplice(itemF.info, 6)
        console.log(itemF.info)
      })
    })
  },
  filters: {
    filterHandleType (item) {
      switch (item) {
        case 1:
        case 4:
          return '出'
        default:
          return '入'
      }
    },
    filterHandleTypeD (item) {
      switch (item) {
        case 1:
          return '出库'
        case 2:
          return '入库'
        case 3:
          return '最终入库'
        case 4:
          return '织造加工出库'
        default:
          return '入库'
      }
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(`${window.location.origin}/materialStock/materialStockDetail/${this.$route.params.id}/${this.$route.params.type}/${this.$route.params.orderType}`, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialStock/materialStockTable.less";
</style>
