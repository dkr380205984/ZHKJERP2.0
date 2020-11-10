<template>
  <div id='materialStockTable'
    class="printHtml">
    <template v-for="(itemClient,indexClient) in printInfo">
      <div class="printTable crosswise"
        v-for="(itemMa,indexMa) in itemClient.material_info"
        :key="`${indexClient}-${indexMa}`">
        <div class="print_head row">
          <div class="left">
            <h3 class="title">{{`${companyName}${$route.params.materialType === '2' ? '辅料' : '原料'}${$route.params.handleType === '2' ? '出库' : '入库'}单`}}</h3>
            <div class="item">
              <span class="item_span">
                <span class="label">打印人：</span>
                {{print_user}}
              </span>
              <span class="item_span">
                <span class="label">打印时间：</span>
                {{$getTime()}}
              </span>
            </div>
            <div class="item">
              <span class="item_span">
                <span class="label">{{$route.params.handleType === '2' ? '出' : '入'}}库单位：</span>
                {{itemClient.client_name}}
              </span>
              <span class="item_span">
                <span class="label">{{$route.params.handleType === '2' ? '出' : '入'}}库时间：</span>
                {{itemClient.complete_time}}
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
              :style="`flex: ${$route.params.materialType === '2' ? 2.5 : 1.8}`">{{$route.params.materialType === '2' ? '辅' : '原'}}料名称</span>
            <span class="row_item left"
              :style="`flex: ${$route.params.materialType === '2' ? 2 : 1}`">{{$route.params.materialType === '2' ? '辅' : '原'}}料颜色{{$route.params.materialType === '2' && '或属性' || ''}}</span>
            <span class="row_item left"
              v-if="$route.params.materialType !== '2'">原料色号</span>
            <span class="row_item left"
              v-if="$route.params.materialType !== '2'">批/缸号</span>
            <span class="row_item right">{{$route.params.handleType === '2' ? '出' : '入'}}库数量</span>
            <span class="row_item left">备注</span>
          </div>
          <div class="print_row"
            style="max-height:50px"
            v-for="(itemMaI,indexMaI) in 7"
            :key="indexMaI">
            <!--
              为什么限定最高50px  不限定万一高度超出，样式会奇怪 并且可能会把下面的挤出print_body元素外  而print_body元素overflow:hidden了 会造成打印不全打印缺失数据
            -->
            <span class="row_item left"
              :style="`line-height: 1em;flex: ${$route.params.materialType === '2' ? 2.5 : 1.8}`"> {{itemMa[indexMaI] && itemMa[indexMaI].material_name}} </span>
            <span class="row_item left"
              :style="`line-height: 1em;flex: ${$route.params.materialType === '2' ? 2 : 1}`">{{itemMa[indexMaI] && itemMa[indexMaI].material_color}}</span>
            <span class="row_item left"
              v-if="$route.params.materialType !== '2'">{{itemMa[indexMaI] && itemMa[indexMaI].color_code || ''}}</span>
            <span class="row_item left"
              v-if="$route.params.materialType !== '2'">{{itemMa[indexMaI] && itemMa[indexMaI].vat_code || ''}}</span>
            <span class="row_item right">{{itemMa[indexMaI] && itemMa[indexMaI].total_weight}}{{itemMa[indexMaI] && itemMa[indexMaI].unit || ''}}</span>
            <span class="row_item left"
              style="line-height: 1em">{{itemMa[indexMaI] && itemMa[indexMaI].desc || ''}}</span>
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
import { materialStock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      print_user: window.sessionStorage.getItem('user_name'),
      qrCodeUrl: '',
      printInfo: []
    }
  },
  methods: {
    init () {
      materialStock.detail({
        order_type: this.$route.params.orderType,
        order_id: this.$route.params.orderId,
        material_type: this.$route.params.materialType
      }).then(res => {
        if (res.data.status === false) return
        let data = []
        if (this.$route.params.handleType === '2') {
          data = res.data.data.filter(itemF => +itemF.type === 1 || +itemF.type === 4)
        } else {
          data = res.data.data.filter(itemF => +itemF.type === 2)
        }
        if (this.$route.query.logId) {
          data = data.filter(itemF => this.$route.query.logId.split(',').some(itemS => +itemS === +itemF.id))
        }
        this.printInfo = this.$mergeData(data, {
          mainRule: ['client_id', 'complete_time'],
          otherRule: [
            { name: 'client_name' }
          ],
          childrenName: 'material_info'
        })
        this.printInfo.forEach(itemC => {
          itemC.material_info = this.$newSplice(itemC.material_info, 7)
        })
        setTimeout(() => {
          window.print()
        }, 1000)
      })
    }
  },
  created () {
    this.init()
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(`${window.location.origin}/materialStock/${this.$route.params.handleType === '2' ? 'materialOutStockDetail' : 'materialGoStockDetail'}/${this.$route.params.orderId}/${this.$route.params.materialType}/${this.$route.params.orderType}`, { errorCorrectionLevel: 'H' }, (err, url) => {
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
