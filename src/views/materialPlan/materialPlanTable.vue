<template>
  <div class='printHtml'
    id="materialPlanTable">
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{company_name}}{{$route.query.type === '1' ? '原' : '辅'}}料计划单</span>
          <span class="item">
            <span class="label">联系人：</span>
            <span>{{contact_name}}</span>
          </span>
          <span class="item">
            <span class="label">联系人电话：</span>
            <span>{{contact_tel}}</span>
          </span>
          <span class="item">
            <span class="label">创建时间：</span>
            <span>{{$getTime()}}</span>
          </span>
        </div>
        <div class="right">
          <span class="text">
            扫一扫
            <br />
            查看物料计划单
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
          <span class="row_item left">{{orderInfo.order_code}}</span>
          <span class="row_item center w180">下单日期</span>
          <span class="row_item left">{{orderInfo.order_time}}</span>
        </div>
        <div class="print_row">
          <span class="row_item center w180">订单公司</span>
          <span class="row_item left">{{orderInfo.client_name}}</span>
          <span class="row_item center w180">负责小组</span>
          <span class="row_item left">{{orderInfo.group_name}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">产品详情</span>
          <span class="row_item col">
            <span class="print_row"
              :class="{noBorder:indexPro === 0 ? true : false}"
              v-for="(itemPro,indexPro) in productInfo"
              :key="indexPro">
              <span class="row_item noBorder left w180">{{itemPro.product_code}}</span>
              <span class="row_item noBorder left">{{itemPro.category_info|filterType}}</span>
              <span class="row_item noBorder left">{{itemPro.order_number + itemPro.category_info.unit}}</span>
            </span>
          </span>
        </div>
        <template v-for="(item,index) in materialInfo">
          <div class="print_row bgGray"
            :key='index + "title"'>
            <div class="row_item center w180">{{$route.query.type === '1' ? '原' : '辅'}}料名称</div>
            <div class="row_item center">{{item.material_name}}</div>
            <div class="row_item center w180">合计</div>
            <div class="row_item center">{{item.type === 1 ? $toFixed(item.total_weight/1000) + 'kg' : $toFixed(item.total_weight) + item.unit}}</div>
          </div>
          <div class="print_row"
            v-for="(itemColor,indexColor) in item.color_info"
            :key='index + "body" + indexColor'>
            <span class="row_item w180 center">颜色重量{{indexColor+1}}</span>
            <span class="row_item left">
              <span class="print_row noBorder">
                <span class="row_item noBorder w180">{{itemColor.color}}</span>
                <span class="row_item noBorder">{{ item.type === 1 ? $toFixed(itemColor.weight/1000) + 'kg' : $toFixed(itemColor.weight) + item.unit}}</span>
              </span>
            </span>
          </div>
        </template>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <span class="row_item w180 center">备注</span>
          <span class="row_item left"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialPlan, order, sampleOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      params: {},
      orderInfo: {},
      company_name: window.sessionStorage.getItem('company_name'),
      contact_name: window.sessionStorage.getItem('user_name'),
      contact_tel: window.localStorage.getItem('zhUsername'),
      qrCodeUrl: '',
      productInfo: [],
      materialInfo: []
    }
  },
  methods: {
  },
  created () {
    // this.$route.params.params.split('&').forEach(item => {
    //   let data = item.split('=')
    //   this.params[data[0]] = data[1]
    // })
    let orderOrSample = this.$route.params.type === '1' ? order.detailInfo : sampleOrder.detail
    Promise.all([
      materialPlan.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      }),
      orderOrSample({
        id: this.$route.params.id
      })
    ]).then(res => {
      let orderProInfo = []
      if (this.$route.params.type === '1') { // 获取订单或样单的产品id
        orderProInfo = this.$flatten(res[1].data.data.batch_info.map(itemBatch => {
          return itemBatch.product_info.map(itemPro => {
            return itemPro.product_id
          })
        }))
      } else {
        orderProInfo = res[1].data.data.product_info.map(itemPro => itemPro.id)
      }
      let data = res[0].data.data
      this.orderInfo = data.order_info
      if (this.$route.query.proInfo) {
        let proInfo = this.$route.query.proInfo.split(';').map(item => {
          return item.split(',')
        })
        let filterData = data.production_data.filter(item => {
          let flag = proInfo.find(itemF => {
            return +itemF[0] === +item.product_id && +itemF[1] === +item.size_id && +itemF[2] === +item.color_id
          })
          return flag
        })
        this.productInfo = this.$mergeData(filterData, { mainRule: 'product_id', otherRule: [{ name: 'order_number', type: 'add' }, { name: 'category_info' }, { name: 'product_code' }] })
      } else {
        this.productInfo = this.$mergeData(data.production_data, { mainRule: 'product_id', otherRule: [{ name: 'order_number', type: 'add' }, { name: 'category_info' }, { name: 'product_code' }] })
      }
      this.productInfo = this.productInfo.filter(itemPro => orderProInfo.find(itemF => +itemF === +itemPro.product_id)) // 筛选掉配件
      let materialDetail = this.$clone(data.detail_data)
      materialDetail.forEach(itemPro => {
        if (!itemPro.pid) {
          itemPro.pid = itemPro.product_id
        }
      })
      if (this.$route.query.proInfo) {
        let proInfo = this.$route.query.proInfo.split(';').map(item => {
          return item.split(',')
        })
        let filterData = materialDetail.filter(item => {
          let flag = proInfo.find(itemF => {
            return +itemF[0] === +item.pid && +itemF[1] === +item.size_id && +itemF[2] === +item.color_id && Number(item.material_type) === Number(this.$route.query.type)
          })
          return flag
        })
        this.materialInfo = this.$mergeData(filterData, { mainRule: 'material_name', otherRule: [{ name: 'material_type/type' }, { name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/color', otherRule: [{ name: 'reality_weight/weight', type: 'add' }] } })
      } else {
        this.materialInfo = this.$mergeData(materialDetail.filter(item => Number(item.material_type) === Number(this.$route.query.type)), { mainRule: 'material_name', otherRule: [{ name: 'material_type/type' }, { name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/color', otherRule: [{ name: 'reality_weight/weight', type: 'add' }] } })
      }
      this.materialInfo.forEach(itemMa => {
        itemMa.color_info.forEach(itemColor => {
          itemMa.total_weight = Number(itemMa.total_weight || 0) + Number(itemColor.weight)
        })
      })
      setTimeout(() => {
        window.print()
      }, 1000)
    })
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type + '?showRouterPopup=true', { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialPlan/materialPlanTable.less";
</style>
