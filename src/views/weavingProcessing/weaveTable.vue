<template>
  <div id='weaveTable'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{companyName}}生产加工通知单</span>
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
          <div class="row_item left"></div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">订单号</div>
          <div class="row_item left"></div>
          <div class="row_item center w180">下单日期</div>
          <div class="row_item left flex08"></div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">订单公司</div>
          <div class="row_item left"></div>
          <div class="row_item center w180">负责小组</div>
          <div class="row_item left flex08"></div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">生产单位</div>
          <div class="row_item left"></div>
          <div class="row_item center w180">总价</div>
          <div class="row_item left flex08"></div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">生产单位</div>
          <div class="row_item left"></div>
          <div class="row_item center w180">总价</div>
          <div class="row_item left flex08"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      user_name: window.sessionStorage.getItem('user_name'),
      qrCodeUrl: ''
    }
  },
  methods: {

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
