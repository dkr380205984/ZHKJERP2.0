<template>
  <div id='weaveTable'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{title}}</span>
          <span class="item">
            <span class="label">联系人：</span>
            {{user_name}}
          </span>
          <span class="item">
            <span class="label">联系人电话：</span>
          </span>
          <span class="item">
            <span class="label">创建日期：</span>
            {{$getTime()}}
          </span>
        </div>
        <div class="right">
          <span class="text">扫一扫<br />更新生产进度</span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="二维码">
          </span>
        </div>
      </div>
      <div class="print_body hasPosBottom">
        <div class="print_row posBottom">
          <div class="row_item center w180">备注</div>
          <div class="row_item left"
            v-html="remark"></div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">订单号</div>
          <div class="row_item left">{{orderInfo.order_code}}</div>
          <div class="row_item center w180">下单日期</div>
          <div class="row_item left flex08">{{orderInfo.order_time}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">订单公司</div>
          <div class="row_item left">{{orderInfo.client_name}}</div>
          <div class="row_item center w180">负责小组</div>
          <div class="row_item left flex08">{{orderInfo.group_name}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">生产单位</div>
          <div class="row_item left"></div>
          <div class="row_item center w180">总价</div>
          <div class="row_item left flex08"></div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center w180">产品信息</div>
          <div class="row_item center w180">尺码颜色</div>
          <div class="row_item center">图片</div>
          <div class="row_item center">类型/单价</div>
          <div class="row_item center">数量</div>
          <div class="row_item center">完成日期</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item w180 center"></div>
          <div class="row_item col">
            <span class="print_row noBorder">
              <span class="row_item w180"></span>
              <span class="row_item"></span>
              <span class="row_item"></span>
              <span class="row_item"></span>
              <span class="row_item"></span>
            </span>
          </div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center w180">原料信息</div>
          <div class="row_item center w180">原料颜色</div>
          <div class="row_item center">原料数量</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item w180 center"></div>
          <div class="row_item col">
            <span class="print_row noBorder">
              <span class="row_item w180"></span>
              <span class="row_item"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { print, order, weave } from '@/assets/js/api.js'
export default {
  data () {
    return {
      title: '',
      remark: '',
      user_name: window.sessionStorage.getItem('user_name'),
      qrCodeUrl: '',
      orderInfo: {},
      weaveInfo: []
    }
  },
  methods: {

  },
  created () {
    Promise.all([
      print.detail({
        type: this.$route.query.type === '1' ? 1 : 2
      }),
      order.detail({
        id: this.$route.params.id
      }),
      weave.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      })
    ]).then(res => {
      this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
      this.remark = res[0].data.data ? res[0].data.data.desc : ''
      // 处理订单信息
      this.orderInfo = res[1].data.data
      let productList = []
      res[1].data.data.batch_info.forEach(itemBatch => {
        itemBatch.product_info.forEach(itemPro => {
          let flag = productList.find(item => item.product_id === itemPro.product_info.product_id)
          if (!flag) {
            productList.push(itemPro.product_info)
          }
        })
      })
      // 处理织造分配数据
      let weaveInfo = res[2].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
        let flag = productList.find(itemPro => itemPro.product_code === item.product_info.product_code)
        console.log(flag)
        return {
          ...item.product_info,
          ...item.category_info,
          client_name: item.client_name,
          size: item.size,
          color: item.color,
          price: item.price,
          number: item.number,
          compiled_time: item.complete_time
        }
      })
      console.log(weaveInfo)
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/productPlan/productPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/weavingProcessing/weaveTable.less";
</style>
