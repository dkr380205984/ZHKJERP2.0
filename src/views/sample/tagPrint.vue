<template>
  <div class='printHtml'>
    <template v-for="(itemSize,indexSize) in size">
      <div class="printTag"
        v-for="(itemColor,indexColor) in color"
        :key="indexSize + '-' + indexColor">
        <div class="tag_item">
          <span class="tag_label">编号：</span>
          <span class="tag_info">{{detail.sample_product_code}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">品类：</span>
          <span class="tag_info">{{detail|filterType}}</span>
        </div>
        <div class="tag_item">
          <span class="tag_label">花型：</span>
          <span class="tag_info">{{detail.flower_name}}</span>
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
          <span class="tag_text">{{$getTime()}}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { sample } from '@/assets/js/api.js'
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
    sample.detail({
      id: this.$route.params.id
    }).then(res => {
      this.size = (this.$route.query.size || []).split(',').map(item => {
        return {
          size: this.$strToAscII(item, true)
        }
      })
      this.color = ((this.$route.query.color && this.$route.query.color.split(',')) || []).map(itemM => this.$strToAscII(itemM, true))
      if (res.data.status !== false) {
        this.detail = res.data.data
        this.size.forEach(itemSize => {
          let flag = this.detail.size.find(valSize => valSize.size_name === itemSize.size)
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
    QRCode.toDataURL(window.location.origin + '/sample/sampleDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
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
