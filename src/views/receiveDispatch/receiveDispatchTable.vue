<template>
  <div class='printHtml'>
    <div class="printTag center"
      v-for="(item,index) in printInfo"
      :key='index'>
      <div class="tag_item">
        <span class="tag_info">{{order_code}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">加工单位</span>： -->
        <span class="tag_info">{{item.client_name}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">产品信息</span>： -->
        <span class="tag_info">{{item.product_code}}<br />{{item.type ? item.type.join('/') : ''}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">尺码颜色</span>： -->
        <span class="tag_info">{{item.size +  '/' + item.color}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">类型</span>： -->
        <span class="tag_info">{{item.is_pop === 1 ? '入库' : '出库'}}</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">件数</span>： -->
        <span class="tag_info">{{item.count || 0}}件</span>
      </div>
      <div class="tag_item">
        <!-- <span class="tag_label longWidht">数量</span>： -->
        <span class="tag_info">{{item.number + item.unit}}</span>
      </div>
      <div class="tag_item col">
        <img :src="returnUrl(item.id,item.handleType)"
          alt=""
          class="tag_qrCode">
        <span class="tag_text">扫码快捷出入库</span>
      </div>
    </div>
  </div>
</template>

<script>
import { receiveDispatch, order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      qrCodeUrl: '',
      printInfo: [],
      order_code: ''
    }
  },
  methods: {
    init () {
      const api = this.$route.query.type === 'true' ? receiveDispatch.weaveDetail : receiveDispatch.semiDetail
      Promise.all([
        api({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        order.detail({
          id: this.$route.params.id
        })
      ]).then(res => {
        let data = res[0].data.data
        let logIdArr = this.$route.query.logId.split(',')
        logIdArr.forEach(item => {
          let findData = data.find(items => +items.id === +item)
          if (findData) {
            this.printInfo.push({
              id: findData.id,
              client_name: findData.client_name,
              product_code: findData.product_code.code,
              type: [findData.category_info.category_name, findData.category_info.type_name, findData.category_info.style_name],
              size: findData.size_name,
              color: findData.color_name,
              count: findData.count,
              number: findData.number,
              unit: findData.category_info.unit,
              handleType: +findData.type
            })
          }
        })
        this.order_code = res[1].data.data.order_code
        setTimeout(() => {
          window.print()
        }, 1000)
      })
    },
    returnUrl (id, type) {
      let qrCodeUrl = {
        url: ''
      }
      const QRCode = require('qrcode')
      QRCode.toDataURL(window.location.origin + '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id + '/' + (type === 'true' ? 1 : 2) + '?logId=' + id + '&type=' + (type === 'true' ? 1 : 2), { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          qrCodeUrl.url = url
        }
      })
      function cb (data) {
        if (data.url) {
          return data.url
        } else {
          requestAnimationFrame(() => {
            cb(data)
          })
        }
      }
      return cb(qrCodeUrl)
    }
  },
  created () {
    this.init()
  },
  filters: {
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/common.less";
</style>
