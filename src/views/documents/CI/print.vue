<template>
  <div id='CI'
    class='document'
    v-loading='loading'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{company_name}}</div>
          <div class="title2">{{company_address}}</div>
          <div class="title3">Tel:{{company_tel}}&nbsp;&nbsp;Fax:{{company_fax}}</div>
          <div class="title">COMMERICAL INVOICE</div>
        </div>
      </div>
      <div class="bodyCtn pageBreakInside">
        <div class="rowCtn">
          <div class="rowItem col noBorder"
            style="flex:1.2;justify-content:flex-start">
            <div class="rowCtn noBorder">
              <div class="rowItem left">TO:</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">{{companyInfo.company_name}}</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">{{companyInfo.company_address}}</div>
            </div>
          </div>
          <div class="rowItem col"
            style="justify-content:flex-start">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="width:9em;text-align:right;margin-right:16px">Invoice Number:</span>
                {{companyInfo.invoice_number}}
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="width:9em;text-align:right;margin-right:16px">PO NO.:</span>
                {{companyInfo.po_no}}
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="width:9em;text-align:right;margin-right:16px">Date:</span>
                {{companyInfo.date}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop borderColorDeep pageBreakInside">
        <div class="rowCtn borderColor85">
          <div class="rowItem col noBorder"
            style="flex:1.2">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="margin-right:16px">From:</span>{{otherInfo.from}}
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="margin-right:16px">PAYMENT TERMS:</span>{{otherInfo.payment_terms}}
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="margin-right:16px">TO:</span>{{otherInfo.to}}
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <span style="margin-right:16px">SHIPMENT DATE:</span>{{otherInfo.shipment_date}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop pageBreakInside"
        v-for="(itemOrder,indexOrder) in orderInfo"
        :key="indexOrder">
        <div class="rowCtn">
          <div class="rowItem center">ORDER NO</div>
          <div class="rowItem center">STYLE NO</div>
          <div class="rowItem center">DESC.</div>
          <div class="rowItem center">QTY/PCS</div>
          <div class="rowItem center">UNIT PRICE</div>
          <div class="rowItem center">Amount</div>
        </div>
        <div class="rowCtn"
          v-for="(itemOD,indexOD) in itemOrder.order_data"
          :key='`order_${indexOD}`'>
          <div class="rowItem center">{{itemOrder.order_no}} </div>
          <div class="rowItem center">{{itemOD.style_no}} </div>
          <div class="rowItem center">{{itemOD.desc}} </div>
          <div class="rowItem center">{{itemOD.qty_pcs}} </div>
          <div class="rowItem center">{{itemOD.unit_price}} </div>
          <div class="rowItem center">{{itemOD.amount}} </div>
        </div>
        <div class="rowCtn"
          v-for="(itemPrice,indexPrice) in itemOrder.price_data"
          :key="`price_${indexPrice}`">
          <div class="rowItem left"
            style="flex:4.9">{{itemPrice.content}} </div>
          <div class="rowItem center">{{itemPrice.price}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left noBorder">TOTAL FOR:</div>
          <div class="rowItem noBorder right"
            style="flex:2">{{itemOrder.pcs}}</div>
          <div class="rowItem noBorder"
            style="flex:0.6">PCS</div>
          <div class="rowItem noBorder right"
            style="flex:1.5">{{itemOrder.amount}}</div>
          <div class="rowItem"
            style="flex:0.6">$</div>
        </div>
      </div>
      <div class="bodyCtn marginTop pageBreakInside">
        <div class="rowCtn">
          <div class="rowItem left noBorder">TOTAL:</div>
          <div class="rowItem noBorder right"
            style="flex:2">{{totalCom.total_pcs}} </div>
          <div class="rowItem noBorder"
            style="flex:0.6">PCS</div>
          <div class="rowItem noBorder right"
            style="flex:1.5">{{totalCom.total_value}} </div>
          <div class="rowItem"
            style="flex:0.6">$</div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left noBorder">TOTAL VALUE:</div>
          <div class="rowItem"
            style="flex:5">{{total_value}} </div>
        </div>
      </div>
      <div class="rowModle marginTop pageBreakInside">
        <div class="bodyCtn"
          style="border-bottom:2px solid rgba(0,0,0,.45)">
          <div class="rowCtn">
            <div class="rowItem left">Bank Information:</div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
                  style="flex:0.3">Bank:</div>
                <div class="rowItem">{{bankInfo.name}} </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
                  style="flex:0.3">Address:</div>
                <div class="rowItem">{{bankInfo.address}} </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
                  style="flex:0.3">SWIFT:</div>
                <div class="rowItem">{{bankInfo.code}} </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
                  style="flex:0.3">Beneficiary:</div>
                <div class="rowItem">{{bankInfo.beneficiary}} </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
                  style="flex:0.3">Account No:</div>
                <div class="rowItem">{{bankInfo.account_no}} </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bodyCtn signatureBox"
          style="border-bottom:2px solid rgba(0,0,0,.45)">
          <div class="rowCtn">
            <div class="rowItem left">Remarks:</div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem left">{{remark}}</div>
          </div>
          <img :src="signature"
            v-if="signature"
            class="signature">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documentSetting } from '@/assets/js/api.js'
export default {
  props: {
    isHasDetail: { // 判断是否为组件是否需要去获取详情数据
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: true,
      company_name: '',
      company_address: '',
      company_tel: '',
      company_fax: '',
      companyInfo: {
        comapny_name: '',
        company_address: '',
        invoice_number: '',
        po_no: '',
        date: ''
      },
      otherInfo: {
        from: '',
        to: '',
        payment_terms: '',
        shipment_date: ''
      },
      orderInfo: [
        {
          order_data: [
            {
              style_no: '',
              desc: '',
              qty_pcs: '',
              unit_price: '',
              amount: ''
            }
          ],
          price_data: [
            {
              content: '',
              price: ''
            }
          ],
          order_no: '',
          pcs: '',
          amount: ''
        }
      ],
      total_value: '',
      bankInfo: {
        name: '',
        address: '',
        code: '',
        beneficiary: '',
        account_no: ''
      },
      remark: '',
      signature: ''
    }
  },
  created () {
    this.loading = true
    if (this.isHasDetail) {
      const { documentsTable } = require('@/assets/js/api.js')
      Promise.all([
        documentSetting.companyDetail(),
        documentsTable.CIDetail({
          document_id: this.$route.params.id
        })
      ]).then(res => {
        this.company_name = res[0].data.data.name
        this.company_address = res[0].data.data.address
        this.company_tel = res[0].data.data.tel
        this.company_fax = res[0].data.data.fax
        this.signature = res[0].data.data.signature
        // 初始化基本信息
        const detail = res[1].data.data
        this.companyInfo = {
          company_name: detail.to_company_name,
          company_address: detail.to_company_address,
          invoice_number: detail.invoice,
          po_no: detail.po,
          date: this.$getTime(detail.order_date, '.')
        }
        this.otherInfo = {
          from: detail.from_address,
          to: detail.to_address,
          payment_terms: detail.payment,
          shipment_date: this.$getTime(detail.shipment_date, '.')
        }
        this.bankInfo = {
          name: detail.bank,
          address: detail.address,
          code: detail.code,
          beneficiary: detail.beneficiary,
          account_no: detail.account_no
        }
        this.orderInfo = JSON.parse(detail.order_info)
        this.total_value = detail.total_for
        this.remark = detail.remarks
        this.loading = false
      })
    } else {
      const { documents } = require('@/assets/js/api.js')
      Promise.all([
        documentSetting.companyDetail(),
        documentSetting.bankDetail(),
        documents.detail({
          id: this.$route.params.id
        })
      ]).then(res => {
        this.company_name = res[0].data.data.name
        this.company_address = res[0].data.data.address
        this.company_tel = res[0].data.data.tel
        this.company_fax = res[0].data.data.fax
        this.bankInfo = res[1].data.data
        const detailInfo = res[2].data.data
        this.companyInfo = {
          company_name: detailInfo.to_company_name,
          company_address: detailInfo.to_company_address,
          invoice_number: detailInfo.invoice,
          po_no: detailInfo.po,
          date: this.$getTime(detailInfo.order_date, '.')
        }
        this.otherInfo = {
          from: detailInfo.from_address,
          to: detailInfo.to_address,
          payment_terms: detailInfo.payment,
          shipment_date: this.$getTime(detailInfo.shipment_date, '.')
        }
        this.loading = false
      })
    }
  },
  computed: {
    totalCom () {
      return {
        total_pcs: this.orderInfo.map(itemM => +itemM.pcs || 0).reduce((total, current) => total + current, 0),
        total_value: this.orderInfo.map(itemM => +itemM.amount || 0).reduce((total, current) => total + current, 0)
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/CI.less";
</style>
