<template>
  <div id='DE'
    class='document'
    v-loading='loading'>
    <div class="tableCtn">
      <div class="headerCtn pageBreakInside">
        <div class="top">
          <div class="title">{{companyName}}</div>
          <div class="title2">{{company_name}}</div>
          <div class="title2">{{company_address}}</div>
          <div class="title2">
            <span>电话：{{company_tel}}</span><span style="margin-left:120px">传真：{{company_fax}}</span>
          </div>
          <div class="title bigLetter">申报要素</div>
        </div>
      </div>
      <div class="bodyCtn noBorder pageBreakInside">
        <div class="rowCtn">
          <div class="rowItem left">TO：{{saveInfo.to}} </div>
        </div>
      </div>
      <div class="bodyCtn marginTop noBorder bgGray pageBreakInside"
        v-for="(item,index) in saveInfo.element_orders"
        :key="index"
        style="padding:8px">
        <div class="rowCtn">
          <div class="rowItem left w180 grayLabel">HS编码： </div>
          <div class="rowItem w500">{{item.hs_code}} </div>
        </div>
        <div class="rowCtn"
          v-for="(itemOther,indexOther) in item.other_info"
          :key="indexOther">
          <div class="rowItem left w180 grayLabel">{{itemOther[0]}}： </div>
          <div class="rowItem w500">{{itemOther[1]}} </div>
        </div>
        <!-- <div class="rowCtn">
          <div class="rowItem left w180 grayLabel">制作工艺： </div>
          <div class="rowItem w500">{{item.craftsmanship}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left w180 grayLabel">成分含量： </div>
          <div class="rowItem w500">{{item.ingredient}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left w180 grayLabel">产品品牌： </div>
          <div class="rowItem w500">{{item.product_brand}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left w180 grayLabel">出口优惠情况： </div>
          <div class="rowItem w500">{{item.export_preferences}} </div>
        </div> -->
      </div>
      <div class="bodyCtn noBorder marginTop pageBreakInside">
        <div class="rowCtn">
          <div class="rowItem left"
            style="align-items:flex-start">其它备注：{{saveInfo.remarks}} </div>
        </div>
        <div class="rowCtn signatureBox pageBreakInside"
          style="align-items:flex-start;height:200px;">
          <div class="rowItem left">
            公司签章：
          </div>
          <img :src="signature"
            style="left:20%"
            v-if="signature"
            class="signature">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documentSetting, documentsTable } from '@/assets/js/api'
export default {
  props: {
    isHasDetail: { // 判断是否为组件是否需要去获取详情数据
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false,
      companyName: window.sessionStorage.getItem('full_name'),
      company_name: '',
      company_address: '',
      company_tel: '',
      company_fax: '',
      saveInfo: {
        to: '报关组工作人员', // 人员信息
        remarks: '', // 备注信息
        element_orders: [// 编码信息
          {
            hs_code: '', // 编码号
            other_info: []
          }
        ]
      },
      signature: ''
    }
  },
  created () {
    this.loading = true
    Promise.all([
      documentSetting.companyDetail()
    ]).then(res => {
      this.company_name = res[0].data.data.name
      this.company_address = res[0].data.data.address
      this.company_tel = res[0].data.data.tel
      this.company_fax = res[0].data.data.fax
      this.signature = res[0].data.data.signature
      if (this.isHasDetail) {
        documentsTable.DEDetail({
          document_id: this.$route.params.id
        }).then(resI => {
          if (resI.data.status !== false) {
            this.saveInfo = {
              ...resI.data.data,
              element_orders: resI.data.data.element_orders.map(itemM => {
                return {
                  hs_code: itemM.hs_code,
                  other_info: (itemM.other_info && JSON.parse(itemM.other_info)) || []
                }
              })
            }
            this.loading = false
          }
        })
      } else {
        this.loading = false
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/DE.less";
</style>
