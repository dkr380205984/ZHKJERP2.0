<template>
  <div id='PL'
    class='document'
    v-loading='loading'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{companyName}}</div>
          <div class="title2">{{companyAddress}}</div>
          <div class="title3">Tel:{{companyTel}}&nbsp;&nbsp;Fax:{{companyFax}}</div>
          <div class="title">PACKING LIST</div>
        </div>
      </div>
      <div class="bodyCtn pageBreakInside">
        <div class="rowCtn">
          <div class="rowItem col noBorder"
            style="flex:1.2">
            <div class="rowCtn noBorder">
              <div class="rowItem left">TO:</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">{{companyInfo.company_name}} </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">{{companyInfo.company_address}} </div>
            </div>
          </div>
          <div class="rowItem col">
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
                <span style="margin-right:16px">LOADING PORT:</span>{{otherInfo.loading_port}}
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
                <span style="margin-right:16px">DESTINATION PORT:</span>{{otherInfo.destination_port}}
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
      <div class="bodyCtn marginTop"
        style="overflow:visible;font-size:14px">
        <div class="rowCtn pageBreakInside">
          <div class="rowItem center">CTN NO./TTL.</div>
          <div class="rowItem center">Order No.</div>
          <div class="rowItem center">ItemNumber</div>
          <div class="rowItem center">Description</div>
          <div class="rowItem center">Size</div>
          <div class="rowItem center">Quantity/PCS</div>
          <div class="rowItem center">Total CTNS NO.</div>
          <div class="rowItem center">N.W./KGS</div>
          <div class="rowItem center">G.W./KGS</div>
          <div class="rowItem center">Vol/CBM</div>
        </div>
        <div class="rowCtn pageBreakInside"
          v-for="(itemPack,indexPack) in packList"
          :key='indexPack'>
          <div class="rowItem center">{{itemPack.ctn_no_ttl}} </div>
          <div class="rowItem center">{{itemPack.order_no}} </div>
          <div class="rowItem center">{{itemPack.item_number}} </div>
          <div class="rowItem center">{{itemPack.desc}} </div>
          <div class="rowItem center">{{itemPack.size}} </div>
          <div class="rowItem center">{{itemPack.quantity_pcs}} </div>
          <div class="rowItem center">{{itemPack.total_ctns_no}} </div>
          <div class="rowItem center">{{itemPack.n_w_kgs}} </div>
          <div class="rowItem center">{{itemPack.g_w_kgs}} </div>
          <div class="rowItem center">{{itemPack.vol_cbm}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center noBorder">Total</div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder">{{totalCom.quantity_pcs}}</div>
          <div class="rowItem center noBorder">{{totalCom.total_ctns_no}}</div>
          <div class="rowItem center noBorder">{{totalCom.n_w_kgs}}</div>
          <div class="rowItem center noBorder">{{totalCom.g_w_kgs}}</div>
          <div class="rowItem center noBorder">{{totalCom.vol_cbm}}</div>
        </div>
      </div>
      <div class="bodyCtn marginTop pageBreakInside signatureBox"
        style="display:flex;flex-direction:column;border-bottom:2px solid rgba(0,0,0,.45);min-height:200px">
        <img :src="signature"
          style="left:auto;right:0%"
          v-if="signature"
          class="signature">
        <div class="rowCtn">
          <div class="rowItem left">Remarks:</div>
        </div>
        <div class="rowCtn noBorder"
          style="flex:1">
          <div class="rowItem left"
            style="align-items:flex-start"
            v-html="remark"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documentSetting, documents, documentsTable } from '@/assets/js/api.js'
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
      companyName: '',
      companyAddress: '',
      companyTel: '',
      companyFax: '',
      signature: '',
      companyInfo: {
        comapny_name: '',
        company_address: '',
        invoice_number: '',
        po_no: '',
        date: ''
      },
      otherInfo: {
        loading_port: '',
        destination_port: '',
        payment_terms: '',
        shipment_date: ''
      },
      packList: [{
        ctn_no_ttl: '',
        order_no: '',
        item_number: '',
        desc: '',
        size: '',
        quantity_pcs: '',
        total_ctns_no: '',
        n_w_kgs: '',
        g_w_kgs: '',
        vol_cbm: ''
      }],
      remark: ''
    }
  },
  created () {
    this.loading = true
    if (this.isHasDetail) {
      Promise.all([
        documentSetting.companyDetail(),
        documentsTable.PLDetail({
          document_id: this.$route.params.id
        })
      ]).then(res => {
        // 初始化标题栏
        this.companyName = res[0].data.data.name
        this.companyAddress = res[0].data.data.address
        this.companyTel = res[0].data.data.tel
        this.companyFax = res[0].data.data.fax
        this.signature = res[0].data.data.signature
        // 初始化内容
        const detail = res[1].data.data
        this.companyInfo = {
          company_name: detail.to_company_name,
          company_address: detail.to_company_address,
          invoice_number: detail.invoice,
          po_no: detail.po,
          date: detail.order_date
        }
        this.otherInfo = {
          loading_port: detail.from_address,
          destination_port: detail.to_address,
          payment_terms: detail.payment,
          shipment_date: detail.shipment_date
        }
        this.packList = detail.box_orders.map(itemM => {
          return {
            ctn_no_ttl: itemM.ctn_no,
            order_no: itemM.order_no,
            item_number: itemM.item_number,
            desc: itemM.description,
            size: itemM.size,
            quantity_pcs: itemM.number,
            total_ctns_no: itemM.ctn_total,
            n_w_kgs: itemM.nwkgs,
            g_w_kgs: itemM.gwkgs,
            vol_cbm: itemM.volume
          }
        })
        this.remark = detail.remarks.replace(/\n/g, '<br />')
        this.loading = false
      })
    } else {
      Promise.all([
        documentSetting.companyDetail(),
        documents.detail({
          id: this.$route.params.id
        })
      ]).then(res => {
        // 初始化标题栏
        this.companyName = res[0].data.data.name
        this.companyAddress = res[0].data.data.address
        this.companyTel = res[0].data.data.tel
        this.companyFax = res[0].data.data.fax
        // 初始化内容
        const detailInfo = res[1].data.data
        this.companyInfo = {
          company_name: detailInfo.to_company_name,
          company_address: detailInfo.to_company_address,
          invoice_number: detailInfo.invoice,
          po_no: detailInfo.po,
          date: this.$getTime(detailInfo.order_date, '.')
        }
        this.otherInfo = {
          loading_port: detailInfo.loading_port,
          destination_port: detailInfo.destination_port,
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
        quantity_pcs: this.$toFixed(this.packList.map(itemM => +itemM.quantity_pcs || 0).reduce((total, current) => total + current, 0)),
        total_ctns_no: this.$toFixed(this.packList.map(itemM => +itemM.total_ctns_no || 0).reduce((total, current) => total + current, 0)),
        n_w_kgs: this.$toFixed(this.packList.map(itemM => +itemM.n_w_kgs || 0).reduce((total, current) => total + current, 0)),
        g_w_kgs: this.$toFixed(this.packList.map(itemM => +itemM.g_w_kgs || 0).reduce((total, current) => total + current, 0)),
        vol_cbm: this.$toFixed(this.packList.map(itemM => +itemM.vol_cbm || 0).reduce((total, current) => total + current, 0))
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/PL.less";
</style>
