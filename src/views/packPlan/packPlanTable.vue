<template>
  <div class='printHtml'
    id='packPlanTable'>
    <div class="printTable crosswise">
      <div class="print_head row">
        <div class="left">
          <span class="title">{{companyName}}装箱计划单{{chinaNum[index]}}{{orderInfo.inside_order_code ? '-' + orderInfo.inside_order_code : ''}}</span>
          <span class="item">
            <span class="label">创建人：</span>
            {{user_name}}
          </span>
          <span class="item">
            <span class="label">创建时间：</span>
            {{$getTime()}}
          </span>
        </div>
        <div class="right">
          <div class="qrCode_box"
            style="margin-right:8px">
            <img :src="proImage.image_url || errImg"
              alt="产品图片">
          </div>
          <div class="qrCode_box">
            <img :src="qrCodeUrl || errImg"
              alt="二维码">
          </div>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">订单号</span>
          <span class="row_item left">{{orderInfo.order_code}}</span>
          <span class="row_item center w180">订单公司</span>
          <span class="row_item left">{{orderInfo.client_name}}</span>
          <span class="row_item center w180">下单日期</span>
          <span class="row_item left">{{orderInfo.order_time}}</span>
        </div>
        <div class="print_row bgGray"
          style="font-size:16px">
          <span class="row_item center flex06">装箱类型</span>
          <span class="row_item flex4">
            <span class="print_row noBorder">
              <span class="row_item left flex15">产品</span>
              <span class="row_item left">尺码/颜色</span>
              <span class="row_item left flex08">袋装<br />件/袋</span>
              <span class="row_item left flex08">箱装<br />袋/箱</span>
              <span class="row_item left flex08">总数量</span>
            </span>
          </span>
          <span class="row_item left flex04">箱号</span>
          <span class="row_item right flex04">箱数</span>
          <span class="row_item left flex04">毛重</span>
          <span class="row_item left flex04">净重</span>
          <span class="row_item left">长*宽*高</span>
          <span class="row_item right flex04">体积</span>
          <span class="row_item left flex08">备注</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in planInfo"
          :key="index"
          style="font-size:16px">
          <span class="row_item center flex06">{{chinaNum[index]}}</span>
          <span class="row_item flex4 col">
            <span v-for="(itemInner,indexInner) in item.product_info"
              :class="['print_row',indexInner === 0 ? 'noBorder' : '']"
              :key="indexInner">
              <span class="row_item left flex15">
                {{itemInner.product_info ? itemInner.product_info.product_code : itemInner.name}}<br />
                {{itemInner|filterName}}
              </span>
              <span class="row_item left">{{itemInner.size_name + '/' + itemInner.color_name}}</span>
              <span class="row_item left flex08">{{itemInner.quantity_bag}}</span>
              <span class="row_item left flex08">{{itemInner.quantity_chest}}</span>
              <span class="row_item left flex08">{{itemInner.quantity_total}}</span>
            </span>
          </span>
          <span class="row_item left flex04">{{item.chest_number ? item.chest_number.split(',').join('-') : '/'}}</span>
          <span class="row_item right flex04">{{item.chest_quantity || 0}}</span>
          <span class="row_item left flex04">{{item.gross_weight_chest || 0}}kg</span>
          <span class="row_item left flex04">{{item.net_weight_chest || 0}}kg</span>
          <span class="row_item left">{{item.extent_width_height.split(',').join('*')}}</span>
          <span class="row_item right flex04">{{item.bulk || 0}}m³</span>
          <span class="row_item left flex08">{{item.remark || '/'}}</span>
        </div>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <span class="row_item center w180">备注</span>
          <span class="row_item left remark_span"
            v-html='remark'></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { packPlan, order, packag } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      chinaNum: chinaNum,
      user_name: window.sessionStorage.getItem('user_name'),
      index: 0,
      qrCodeUrl: '',
      proImage: '',
      errImg: require('@/assets/image/index/noPic.jpg'),
      orderInfo: {
      },
      planInfo: [],
      remark: ''
    }
  },
  created () {
    Promise.all([
      order.detail({
        id: this.$route.params.id
      }),
      packPlan.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }),
      packag.list()
    ]).then(res => {
      this.orderInfo = res[0].data.data
      let planInfo = res[1].data.data
      this.index = planInfo.map(item => Number(item.id)).indexOf(Number(this.$route.params.planId))
      let planFlag = planInfo[this.index]
      if (planFlag) {
        this.planInfo = this.$mergeData(planFlag.pack_info, { mainRule: 'pack_type', otherRule: [{ name: 'chest_number' }, { name: 'chest_quantity' }, { name: 'gross_weight_chest' }, { name: 'gross_weight_total' }, { name: 'net_weight_chest' }, { name: 'net_weight_total' }, { name: 'extent_width_height' }, { name: 'bulk' }, { name: 'total_bulk' }, { name: 'desc' }], childrenName: 'product_info' })
        this.remark = planFlag.desc
        this.proImage = this.$flatten(this.planInfo.map(itemM => {
          return itemM.product_info.map(itemP => {
            return itemP.product_info.image
          })
        }))[0]
        setTimeout(() => {
          window.print()
        }, 1000)
      }
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/packPlan/packPlanCreate/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  filters: {
    filterName (item) {
      return item.product_info ? [item.product_info.category_name, item.product_info.type_name, item.product_info.style_name].filter(items => items).join('/') : ''
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packPlanTable.less";
</style>
