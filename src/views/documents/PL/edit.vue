<template>
  <div id='PL'
    class='document edit'
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
      <div class="bodyCtn">
        <div class="rowCtn">
          <div class="rowItem col noBorder"
            style="flex:1.2">
            <div class="rowCtn noBorder">
              <div class="rowItem left grayLabel">TO:</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="companyInfo.company_name"
                  rowModle
                  placeholder='公司名称(company name)'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="companyInfo.company_address"
                  :rows='2'
                  rowModle
                  placeholder='公司地址(company address)'></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input v-model="companyInfo.invoice_number"
                  rowModle
                  width='150px'
                  alignType='right'
                  label='Invoice Number:'
                  placeholder='发票号码'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input v-model="companyInfo.po_no"
                  rowModle
                  width='150px'
                  alignType='right'
                  label="PO NO.:"
                  placeholder='订单号'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input v-model="companyInfo.date"
                  rowModle
                  width='150px'
                  alignType='right'
                  label='Date:'
                  :rows='2'
                  placeholder='下单日期'></document-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop borderColorDeep">
        <div class="rowCtn borderColor85">
          <div class="rowItem col noBorder"
            style="flex:1.2">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-select v-model="otherInfo.loading_port"
                  :optionData='portList'
                  rowModle
                  type='autocomplete'
                  label='LOADING PORT:'
                  placeholder='装货港口'></document-select>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-select v-model="otherInfo.payment_terms"
                  type='autocomplete'
                  :optionData='paymentList'
                  rowModle
                  label='PAYMENT TERMS:'
                  placeholder='付款方式'></document-select>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-select v-model="otherInfo.destination_port"
                  type='autocomplete'
                  :optionData='portList'
                  rowModle
                  label='DESTINATION PORT:'
                  placeholder='目的港口'></document-select>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="otherInfo.shipment_date"
                  rowModle
                  label="SHIPMENT DATE:"
                  placeholder='发货日期'></document-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop"
        style="overflow:visible;font-size:14px">
        <div class="rowCtn editBtnCtn">
          <div class="addBtn iconModle"
            @click="addItem(packList)"></div>
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
        <div class="rowCtn editBtnCtn"
          v-for="(itemPack,indexPack) in packList"
          :key='indexPack'>
          <div class="deleteBtn iconModle"
            @click="deleteItem(packList,indexPack)"></div>
          <div class="rowItem center">
            <document-input v-model="itemPack.ctn_no_ttl"
              @input="computedTotal(itemPack)"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-select v-model="itemPack.order_no"
              type='autocomplete'
              :optionData="orderArr"
              optionLabel='order_code'
              optionValue='order_code'
              @select='selectOrderNo($event,itemPack)'
              noLabel
              rowModle
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-select v-model="itemPack.item_number"
              type='autocomplete'
              :optionData="itemPack.styleArr || []"
              optionLabel='style_code'
              optionValue='style_code'
              @select='selectStyleNo($event,itemPack)'
              noLabel
              rowModle
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-select v-model="itemPack.desc"
              type='autocomplete'
              :optionData='typeList'
              noLabel
              rowModle
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.size"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.quantity_pcs"
              type='number'
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.total_ctns_no"
              type='number'
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.n_w_kgs"
              type='number'
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.g_w_kgs"
              type='number'
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.vol_cbm"
              type='number'
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center noBorder grayLabel">Total</div>
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
      <div class="bodyCtn marginTop"
        style="display:flex;flex-direction:column;border-bottom:2px solid rgba(0,0,0,.45);min-height:200px">
        <div class="rowCtn">
          <div class="rowItem left grayLabel">Remarks:</div>
        </div>
        <div class="rowCtn noBorder"
          style="flex:1">
          <div class="rowItem left">
            <document-input v-model="remark"
              noLabel
              placeholder='备注信息'></document-input>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btn btnGray"
          @click="$router.go(-1)">返回</div>
        <div class="btn btnBlue"
          @click="saveAll">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
import documentInput from '@/components/documents/input/index.vue'
import documentSelect from '@/components/documents/select/index.vue'
import { documentSetting, documents, documentsTable } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      companyName: '',
      companyAddress: '',
      companyTel: '',
      companyFax: '',
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
      portList: [],
      paymentList: [],
      typeList: [],
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
      orderArr: [],
      remark: ''
    }
  },
  methods: {
    saveAll () {
      if (this.$submitLock()) return
      documentsTable.PLSave({
        document_id: this.$route.params.id,
        to_company_name: this.companyInfo.company_name,
        to_company_address: this.companyInfo.company_address,
        invoice: this.companyInfo.invoice_number,
        po: this.companyInfo.po_no,
        order_date: this.companyInfo.date,
        from_address: this.otherInfo.loading_port,
        to_address: this.otherInfo.destination_port,
        payment: this.otherInfo.payment_terms,
        shipment_date: this.otherInfo.shipment_date,
        box_orders: this.packList.map(itemM => {
          return {
            ctn_no: itemM.ctn_no_ttl,
            order_no: itemM.order_no,
            item_number: itemM.item_number,
            description: itemM.desc,
            size: itemM.size,
            number: itemM.quantity_pcs,
            ctn_total: itemM.total_ctns_no,
            nwkgs: itemM.n_w_kgs,
            gwkgs: itemM.g_w_kgs,
            volume: itemM.vol_cbm
          }
        }),
        remarks: this.remark
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('编辑成功')
          this.$router.push(`/document/index/detail/${this.$route.params.id}?type=2`)
        }
      })
    },
    selectOrderNo ({ valueObj }, itemPack) {
      itemPack.styleArr = valueObj.product_info
    },
    selectStyleNo ({ valueObj }, itemPack) {
      itemPack.quantity_pcs = valueObj.pivot.numbers
    },
    computedTotal (itemPack) {
      const arr = itemPack.ctn_no_ttl.split('-')
      itemPack.total_ctns_no = arr.length > 1 ? (parseInt(arr[1]) - parseInt(arr[0]) + 1) : 1
    },
    addItem (data) {
      data.push(
        {
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
        }
      )
    },
    deleteItem (data, index) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        data.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created () {
    this.loading = true
    Promise.all([
      documentSetting.companyDetail(),
      documentSetting.portList(),
      documentSetting.payTypeList(),
      documentSetting.typeList(),
      documents.detail({
        id: this.$route.params.id
      })
    ]).then(res => {
      // 初始化标题栏
      this.companyName = res[0].data.data.name
      this.companyAddress = res[0].data.data.address
      this.companyTel = res[0].data.data.tel
      this.companyFax = res[0].data.data.fax
      // 初始化下拉数据
      this.paymentList = res[2].data.data.map(itemM => {
        return {
          value: `${itemM.name}(${itemM.english.toUpperCase()})`,
          label: `${itemM.name}(${itemM.english.toUpperCase()})`
        }
      })
      this.portList = res[1].data.data.map(itemM => {
        return {
          value: `${itemM.port_name},${itemM.country}`.toUpperCase(),
          label: `${itemM.port_name},${itemM.country}`.toUpperCase()
        }
      })
      this.typeList = res[3].data.data.map(itemM => {
        return {
          value: itemM.english,
          label: itemM.english
        }
      })
      // 初始化公共信息
      const detailInfo = res[4].data.data
      this.orderArr = detailInfo.orders
      if (detailInfo.status_packing_list !== 2) {
        documentsTable.PLDetail({
          document_id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            const detail = res.data.data
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
            this.remark = detail.remarks
            this.loading = false
          }
        })
      } else {
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
      }
    })
    // 为了页面好看给定packList长度30
    // const arr = new Array(30).join().split(',')
    // this.packList = arr.map(itemM => ({}))
    // this.remark = Object.keys(Array(100).toString().split(',')).map(itemM => 'JFK大家看法积极开发间接费扩大解放咔叽发').join(',')
    // this.$forceUpdate()
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
  },
  components: {
    documentInput,
    documentSelect
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/PL.less";
</style>
