<template>
  <div class='printHtml'
    id='priceBatchTable'>
    <div class="printTable crosswise">
      <div class="print_head row">
        <div class="left"
          style="flex:1">
          <div class="top"
            style="text-align:left">
            <span class="title">{{companyName}}报价单</span>
          </div>
          <div class="bottom"
            style="font-size:16px">
            <span style="width:20%">创建人：{{user_name}}</span>
            <span style="width:20%">创建时间：{{$getTime()}}</span>
            <span style="width:20%">产品数量：{{this.priceArr.length}}款</span>
            <span style="width:20%">报价客户：</span>
          </div>
        </div>
        <div class="right">
          <div class="qrCode_box">
            <img :src="qrCodeUrl || errImg"
              alt="二维码">
          </div>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row bgGray"
          style="font-size:16px">
          <span class="row_item center flex04">序号</span>
          <span class="row_item center">报价编号</span>
          <span class="row_item flex4 col">
            <span class="print_row noBorder"
              style="min-height:25px">
              <span class="row_item center">产品信息</span>
            </span>
            <span class="print_row"
              style="min-height:25px">
              <span class="row_item center">图片</span>
              <span class="row_item center">编号/品类</span>
              <span class="row_item center flex08">成分</span>
              <span class="row_item center flex15">尺寸克重</span>
            </span>
          </span>
          <span class="row_item right flex06">最终报价</span>
          <span class="row_item flex15 col">起订/产品需求备注</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in priceArr"
          :key="index"
          style="font-size:16px">
          <span class="row_item center flex04">{{index + 1}}</span>
          <span class="row_item center">{{item.code}}</span>
          <span class="row_item flex4 col">
            <span v-for="(itemInner,indexInner) in item.product_info"
              :class="['print_row',indexInner === 0 ? 'noBorder' : '']"
              :key="indexInner">
              <span class="row_item center">
                <zh-img-list :list="itemInner.image"></zh-img-list>
              </span>
              <span class="row_item center">
                {{itemInner.code}}<br />
                {{itemInner.type.join('/')}}
              </span>
              <span class="row_item center flex08">
                <template v-for="(itemC,indexC) in itemInner.components">
                  {{`${itemC.number}%${itemC.component_name}`}}<br :key="indexC" />
                </template>
              </span>
              <span class="row_item center flex15 col">
                <span v-for="(itemS,indexS) in itemInner.size_info"
                  :key="indexS"
                  :class="['print_row',indexS === 0 ? 'noBorder' : '']"
                  style="min-height:25px;">
                  <span class="row_item left">
                    <span style="min-width:90px;text-align:left">{{`${itemS.size_name}:${itemS.size_info ? itemS.size_info + 'cm' : ''}`}}</span>
                    <span style="margin-left:16px">{{`克重：${itemS.weight ? itemS.weight + 'g' : ''}`}}</span>
                  </span>
                </span>
              </span>
            </span>
          </span>
          <span class="row_item right flex06">{{item.total_price}}元</span>
          <span class="row_item flex15 col">
            <span class="print_row noBorder"
              style="min-height:25px;">
              <span class="row_item left">
                <span>{{`起订备注：${item.setNum_desc || ''}`}}</span>
              </span>
            </span>
            <span class="print_row"
              style="min-height:25px;">
              <span class="row_item left">
                <span>{{`产品需求：${item.product_need || ''}`}}</span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { price } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      user_name: window.sessionStorage.getItem('user_name'),
      errImg: require('@/assets/image/index/noPic.jpg'),
      qrCodeUrl: '',
      priceArr: [],
      remark: ''
    }
  },
  created () {
    let idArr = this.$route.query.priceId.split(',')
    if (idArr.length === 0) return
    price.list({
      id: idArr
    }).then(res => {
      if (res.data.status === false) return
      this.priceArr = res.data.data.map(itemPrice => {
        return {
          code: itemPrice.quotation_code,
          product_info: itemPrice.product_info.map(itemPro => {
            return {
              image: itemPro.product_info.image,
              code: itemPro.product_info.product_code,
              type: [itemPro.product_info.category_name, itemPro.product_info.type_name, itemPro.product_info.style_name],
              components: itemPro.product_info.component,
              size_info: itemPro.product_info.size_measurement
            }
          }),
          total_price: itemPrice.total_price,
          product_need: itemPrice.product_need,
          setNum_desc: itemPrice.product_need_desc
        }
      })
      setTimeout(() => {
        window.print()
      }, 1000)
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/price/priceList/page=1&&keyword=&&date=&&status=&&client_id=&&user_id=', { errorCorrectionLevel: 'H' }, (err, url) => {
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
@import "~@/assets/less/price/priceBatchTable.less";
</style>
