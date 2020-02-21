<template>
  <div class='printHtml'
    id='packPlanTable'>
    <div class="printTable crosswise">
      <div class="print_head">
        <div class="top">
          <span class="title">{{companyName}}装箱计划单{{chinaNum[index]}}</span>
        </div>
        <div class="bottom">
          <span>创建人：{{user_name}}</span><span>创建时间：{{$getTime()}}</span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item center w180">订单号</span>
          <span class="row_item left">{{orderInfo.order_code}}</span>
          <span class="row_item center w180">订单公司</span>
          <span class="row_item left">{{orderInfo.client_name}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">下单日期</span>
          <span class="row_item left">{{orderInfo.order_time}}</span>
          <span class="row_item center w180">联系人</span>
          <span class="row_item left">{{orderInfo.contacts}}</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item left">包装类型</span>
          <span class="row_item flex28">
            <span class="print_row noBorder">
              <span class="row_item left flex12">产品/包装</span>
              <span class="row_item left flex08">尺码/颜色</span>
              <span class="row_item left flex08">产品数量</span>
            </span>
          </span>
          <span class="row_item left flex08">包装数量</span>
          <span class="row_item left flex08">总量</span>
          <span class="row_item center flex08">序号</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in planInfo"
          :key="index">
          <span class="row_item left">{{item.pack_code}}<br />{{item.pack_name}}{{item.size_info ? (item.size_info.size_info ? ',' + item.size_info.size_info + 'cm' : '') + (item.size_info.attr ? ',' + item.size_info.attr : '') : ''}}</span>
          <span class="row_item flex28 col">
            <span v-for="(itemInner,indexInner) in item.pack_info"
              :class="['print_row',indexInner === 0 ? 'noBorder' : '']"
              :key="indexInner">
              <span class="row_item left flex12">
                {{itemInner.product_info ? itemInner.product_info.product_code : itemInner.name}}<br />
                {{itemInner|filterName}}
              </span>
              <span class="row_item left flex08">{{itemInner.size_color? itemInner.size_color.join('/') : '/'}}</span>
              <span class="row_item left flex08">{{itemInner.number ? itemInner.number + (itemInner.product_info ? itemInner.product_info.unit : itemInner.packInfo ? itemInner.packInfo.unit : '') + '/' + (item.unit ? item.unit : '') : '/'}}</span>
            </span>
          </span>
          <span class="row_item left flex08">{{item.packNum ? item.packNum + (item.unit ? item.unit : '') : '/'}}</span>
          <span class="row_item left flex08"
            v-if="item.gross_weight || item.net_weight">毛重：{{item.gross_weight + 'kg'}}<br />净重：{{item.net_weight + 'kg'}}</span>
          <span class="row_item left flex08"
            v-else>/</span>
          <span class="row_item center flex08"
            v-if="item.start_box || item.end_box">{{[item.start_box,item.end_box].join('-')}}</span>
          <span class="row_item center flex08"
            v-else>/</span>
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
      orderInfo: {
      },
      planInfo: []
    }
  },
  methods: {

  },
  created () {
    Promise.all([
      order.editDetail({
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
      console.log(planFlag)
      if (planFlag) {
        let productList = this.orderInfo.order_batch.map(itemBatch => {
          return itemBatch.product_info.map(itemPro => itemPro.product_info)
        })
        let newProductList = []
        productList.forEach(item => {
          item.forEach(itemPro => {
            if (!(newProductList.find(value => value.product_id === itemPro.product_id))) {
              newProductList.push(itemPro)
            }
          })
        })
        let data = []
        this.$clone(JSON.parse(planFlag.pack_info)).forEach(item => {
          data = data.concat(item)
        })
        data.forEach(item => {
          item.unit = res[2].data.data.find(items => items.name === item.pack_name) ? res[2].data.data.find(items => items.name === item.pack_name).unit : ''
          item.size_info = this.$clone(JSON.parse(planFlag.material_info)).find(items => items.item_id.indexOf(item.pack_code) !== -1)
          item.pack_info.forEach(itemInner => {
            itemInner.product_info = newProductList.find(items => items.product_id === itemInner.name)
            let flag = data.find(items => items.pack_code === itemInner.name)
            itemInner.packInfo = flag || ''
          })
        })
        // 自动计算包装数量
        let newData = this.$clone(JSON.parse(planFlag.pack_info)).reverse()
        let packNumArr = [] // 数据存放
        newData.forEach((item, key) => {
          item.forEach(value => {
            if (key === 0) { // 当最后一级时直接加箱数
              packNumArr.push({
                pack_id: value.pack_code,
                number: Number(value.total_box || 0)
              })
            }
            value.pack_info.forEach(val => {
              if (key !== newData.length - 1) {
                packNumArr.push({
                  pack_id: val.name,
                  number: Number(val.number || 0) * Number(value.total_box || 1)
                })
              }
            })
          })
        })
        // 将计算结果合并进数据
        packNumArr.forEach(item => {
          let flag = data.find(value => value.pack_code === item.pack_id)
          if (flag) {
            flag.packNum = Number(flag.packNum || 0) + Number(item.number || 0)
          }
        })
        this.planInfo = data
        setTimeout(() => {
          window.print()
        }, 1000)
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
  },
  filters: {
    filterName (item) {
      return item.product_info ? [item.product_info.category_name, item.product_info.type_name, item.product_info.style_name].filter(items => items).join('/') : item.packInfo ? item.packInfo.pack_name : ''
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packPlanTable.less";
</style>
