<template>
  <div class='printHtml'>
    <template v-for="(itemSize,indexSize) in size">
      <div class="printTag"
        v-for="(itemColor,indexColor) in color"
        :key="indexSize + '-' + indexColor">
        <div class="tag_item">
          <span class="tag_label">编号：</span>
          <span class="tag_info">{{detail.product_code}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">品类：</span>
          <span class="tag_info">{{detail|filterType}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">花型：</span>
          <span class="tag_info">{{detail.flower_id}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">成分：</span>
          <span class="tag_info">{{detail.component|filterMaterial}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">规格：</span>
          <span class="tag_info">{{itemSize.size}}<br />{{itemSize.size_info}}cm</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">克重：</span>
          <span class="tag_info">{{itemSize.weight}}g</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">颜色：</span>
          <span class="tag_info">{{itemColor}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">描述：</span>
          <span class="tag_info">{{detail.description}}</span>
        </div>
        <div class="tag_item col">
          <img :src="qrCodeUrl"
            alt=""
            class="tag_qrCode">
          <span class="tag_text">扫码查看更多</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { product } from '@/assets/js/api.js'
export default {
  data () {
    return {
      size: [],
      color: [],
      detail: {
        category_info: {},
        component: []
      },
      qrCodeUrl: ''
    }
  },
  methods: {

  },
  created () {
    product.detail({
      id: this.$route.params.id
    }).then(res => {
      this.size = this.$route.params.info.split('&&')[0].split('&').map(item => {
        return {
          size: item
        }
      })
      this.color = this.$route.params.info.split('&&')[1].split('&')
      if (res.data.status !== false) {
        this.detail = res.data.data
        this.size.forEach(itemSize => {
          let flag = this.detail.size.find(valSize => valSize.measurement === itemSize.size)
          if (flag) {
            itemSize.weight = flag.weight
            itemSize.size_info = flag.size_info
          }
        })
      }
      setTimeout(() => {
        window.print()
      }, 1000)
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/product/productDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  filters: {
    filterType (item) {
      return [item.category_info.product_category, item.type_name, item.style_name].join('/')
    },
    filterMaterial (item) {
      return item.map(itemCom => itemCom.number + '%' + itemCom.component_name).join(',')
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/common.less";
</style>
