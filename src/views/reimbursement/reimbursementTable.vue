<template>
  <div class='printHtml'
    id='reimbursementTable'
    v-loading='loading'>
    <div class="printTable crosswise">
      <div class="print_head row">
        <div class="left">
          <span class="title">{{companyName}}报销单</span>
          <span class="item">
            <span class="label">报销单号：</span>
            {{apply_code}}
          </span>
          <span class="item">
            <span class="label">创建时间：</span>
            {{$getTime()}}
          </span>
          <span class="item">
            <span class="label">操作人：</span>
            {{userName}}
          </span>
        </div>
        <div class="right">
          <div class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="">
          </div>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">报销人</span>
          <span class="row_item left">{{apply_user}}</span>
          <span class="row_item center w180"></span>
          <span class="row_item left"></span>
        </div>
        <div class="print_row">
          <span class="row_item w180 center">报销内容</span>
          <span class="row_item right">申请报销金额(元)</span>
          <span class="row_item right">实际报销金额(元)</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in detailList"
          :key="index">
          <span class="row_item w180 center">{{item.name}}</span>
          <span class="row_item right">{{item.apply_price}}</span>
          <span class="row_item right">{{item.real_price}}</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item w180 center noBorder">合计</span>
          <span class="row_item right noBorder">{{totalApplyPrice}}元</span>
          <span class="row_item right noBorder">{{totalRealPrice}}元</span>
        </div>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <span class="row_item center w180">备注</span>
          <span class="row_item left">{{apply_text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { company, reimbursement } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      companyName: '',
      userName: window.sessionStorage.getItem('user_name'),
      qrCodeUrl: '',
      apply_user: '',
      apply_code: '',
      apply_text: '',
      detailList: []
    }
  },
  created () {
    Promise.all([
      company.detail(),
      reimbursement.detail({
        id: this.$route.params.id
      })
    ]).then(res => {
      this.companyName = res[0].data.data.company_name
      this.apply_user = res[1].data.data.apply_user
      this.apply_code = res[1].data.data.code
      this.apply_text = res[1].data.data.apply_text
      this.detailList = res[1].data.data.detail_data ? JSON.parse(res[1].data.data.detail_data).map(itemM => {
        return {
          name: itemM.name,
          apply_price: itemM.price
        }
      }) : []
      if (res[1].data.data.real_data) {
        JSON.parse(res[1].data.data.real_data).forEach(item => {
          let flag = this.detailList.find(itemF => itemF.name === item.name)
          if (flag) {
            flag.real_price = item.price
          } else {
            this.detailList.push({
              name: item.name,
              apply_price: '',
              real_price: item.price
            })
          }
        })
      }
      this.loading = false
    })
  },
  computed: {
    totalApplyPrice () {
      return this.detailList.map(itemM => (+itemM.apply_price || 0)).reduce((a, b) => {
        return a + b
      }, 0) || ''
    },
    totalRealPrice () {
      return this.detailList.map(itemM => (+itemM.real_price || 0)).reduce((a, b) => {
        return a + b
      }, 0) || ''
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/reimbursement/reimbursementDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/reimbursement/reimbursementTable.less";
</style>
