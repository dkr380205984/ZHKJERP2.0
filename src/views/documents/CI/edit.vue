<template>
  <div id='CI'
    class='document edit'
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
      <div class="bodyCtn">
        <div class="rowCtn">
          <div class="rowItem col noBorder"
            style="flex:1.2">
            <div class="rowCtn noBorder">
              <div class="rowItem left grayLabel">TO:</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  v-model="companyInfo.company_name"
                  placeholder='公司名称(company name)'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input :rows='2'
                  rowModle
                  v-model="companyInfo.company_address"
                  placeholder='公司地址(company address)'></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input rowModle
                  v-model="companyInfo.invoice_number"
                  width='150px'
                  alignType='right'
                  label='Invoice Number:'
                  placeholder='发票号码'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input rowModle
                  v-model="companyInfo.po_no"
                  width='150px'
                  alignType='right'
                  label="PO NO.:"
                  placeholder='订单号'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input rowModle
                  v-model="companyInfo.date"
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
                <document-input rowModle
                  v-model="otherInfo.from"
                  label='From:'
                  placeholder='生产地'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-select rowModle
                  type='autocomplete'
                  :optionData='payTypeList'
                  v-model="otherInfo.payment_terms"
                  label='PAYMENT TERMS:'
                  placeholder='付款方式'></document-select>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  v-model="otherInfo.to"
                  label='TO:'
                  placeholder='发货地'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  v-model="otherInfo.shipment_date"
                  label="SHIPMENT DATE:"
                  placeholder='发货日期'></document-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop"
        style="overflow:visible"
        v-for="(itemOrder,indexOrder) in orderInfo"
        :key="indexOrder">
        <div class="rowCtn editBtnCtn">
          <div class="addBtn"
            v-if="indexOrder===0"
            @click="addItem(orderInfo,'order')">添加订单</div>
          <div class="deleteBtn"
            v-else
            @click="deleteItem(orderInfo,indexOrder)">删除订单</div>
          <div class="rowItem center">ORDER NO</div>
          <div class="rowItem center">STYLE NO</div>
          <div class="rowItem center">DESC.</div>
          <div class="rowItem center">QTY/PCS</div>
          <div class="rowItem center">UNIT PRICE</div>
          <div class="rowItem center">Amount</div>
        </div>
        <div class="rowCtn editBtnCtn"
          v-for="(itemOD,indexOD) in itemOrder.order_data"
          :key='`order_${indexOD}`'>
          <div class="addBtn iconModle"
            v-if="indexOD === 0"
            @click="addItem(itemOrder.order_data,'order_data')"></div>
          <div class="deleteBtn iconModle"
            v-else
            @click="deleteItem(itemOrder.order_data,indexOD)"></div>
          <div class="rowItem center">
            <document-select v-model="itemOrder.order_no"
              placeholder='订单号'
              type='autocomplete'
              :optionData='orderArr'
              optionLabel='order_code'
              optionValue='order_code'
              noLabel
              rowModle
              @select="selectOrderNo($event,itemOrder)"
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-select v-model="itemOD.style_no"
              placeholder='款号'
              type='autocomplete'
              :optionData='itemOrder.styleArr || []'
              optionLabel='style_code'
              optionValue='style_code'
              noLabel
              rowModle
              @select="selectStyleNo($event,itemOD,itemOrder)"
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-select v-model="itemOD.desc"
              type='autocomplete'
              :optionData='typeList'
              placeholder='产品描述'
              noLabel
              rowModle
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.qty_pcs"
              type='int'
              placeholder='数量'
              noLabel
              rowModle
              innerAlign='center'
              @input="computedRowAmount(itemOD,itemOrder)"></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.unit_price"
              type='number'
              placeholder='单价'
              noLabel
              rowModle
              innerAlign='center'
              @input="computedRowAmount(itemOD,itemOrder)"></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.amount"
              type='number'
              placeholder='总价'
              noLabel
              rowModle
              readonly
              innerAlign='center'></document-input>
          </div>
        </div>
        <div class="rowCtn editBtnCtn"
          v-for="(itemPrice,indexPrice) in itemOrder.price_data"
          :key="`price_${indexPrice}`">
          <div class="addBtn iconModle"
            v-if="indexPrice===0"
            @click="addItem(itemOrder.price_data,'price')"></div>
          <div class="deleteBtn  iconModle"
            v-else
            @click="deleteItem(itemOrder.price_data,indexPrice)"></div>
          <div class="rowItem left"
            style="flex:4.9">
            <document-input v-model="itemPrice.content"
              placeholder='请输入额外费用内容'
              noLabel
              rowModle></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPrice.price"
              placeholder='额外费用金额'
              noLabel
              rowModle
              innerAlign='center'
              @input="computedOrderPCSAmount(itemOrder)"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left noBorder grayLabel">TOTAL FOR:</div>
          <div class="rowItem noBorder"
            style="flex:2">
            <document-input v-model="itemOrder.pcs"
              placeholder='自动计算'
              readonly
              noLabel
              rowModle
              innerAlign='right'></document-input>
          </div>
          <div class="rowItem noBorder"
            style="flex:0.6">PCS</div>
          <div class="rowItem noBorder"
            style="flex:1.5">
            <document-input v-model="itemOrder.amount"
              placeholder='自动计算'
              readonly
              noLabel
              rowModle
              innerAlign='right'></document-input>
          </div>
          <div class="rowItem"
            style="flex:0.6">$</div>
        </div>
      </div>
      <div class="bodyCtn marginTop">
        <div class="rowCtn">
          <div class="rowItem left noBorder grayLabel">TOTAL:</div>
          <div class="rowItem noBorder"
            style="flex:2">
            <document-input v-model="totalCom.total_pcs"
              placeholder='自动计算'
              readonly
              noLabel
              rowModle
              innerAlign='right'></document-input>
          </div>
          <div class="rowItem noBorder"
            style="flex:0.6">PCS</div>
          <div class="rowItem noBorder"
            style="flex:1.5">
            <document-input v-model="totalCom.total_value"
              placeholder='自动计算'
              readonly
              noLabel
              rowModle
              innerAlign='right'></document-input>
          </div>
          <div class="rowItem"
            style="flex:0.6">$</div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left noBorder grayLabel">TOTAL VALUE:</div>
          <div class="rowItem"
            style="flex:5">
            <document-input rowModle
              v-model="total_value"
              noLabel
              placeholder='自动填充'></document-input>
          </div>
        </div>
      </div>
      <div class="rowModle marginTop">
        <div class="bodyCtn"
          style="border-bottom:2px solid rgba(0,0,0,.45)">
          <div class="rowCtn">
            <div class="rowItem left grayLabel">Bank Information:</div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder grayLabel"
                  style="flex:0.3">Bank:</div>
                <div class="rowItem">
                  <document-input v-model="bankInfo.name"
                    rowModle
                    noLabel
                    placeholder='银行名称'></document-input>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder grayLabel"
                  style="flex:0.3">Address:</div>
                <div class="rowItem">
                  <document-input v-model="bankInfo.address"
                    rowModle
                    noLabel
                    placeholder='银行地址'></document-input>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder grayLabel"
                  style="flex:0.3">SWIFT:</div>
                <div class="rowItem">
                  <document-input v-model="bankInfo.code"
                    rowModle
                    noLabel
                    placeholder='银行行号'></document-input>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder grayLabel"
                  style="flex:0.3">Beneficiary:</div>
                <div class="rowItem">
                  <document-input v-model="bankInfo.beneficiary"
                    rowModle
                    noLabel
                    placeholder='收款人'></document-input>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder grayLabel"
                  style="flex:0.3">Account No:</div>
                <div class="rowItem">
                  <document-input v-model="bankInfo.account_no"
                    rowModle
                    noLabel
                    placeholder='银行账号'></document-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bodyCtn"
          style="border-bottom:2px solid rgba(0,0,0,.45)">
          <div class="rowCtn">
            <div class="rowItem left grayLabel">Remarks:</div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem left">
              <document-input v-model="remark"
                noLabel
                placeholder='备注信息'
                :rows='9'></document-input>
            </div>
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
import { documents, documentSetting, documentsTable } from '@/assets/js/api.js'
import { numberToEnglish } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: false,
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
      portList: [],
      payTypeList: [],
      typeList: [],
      orderArr: [],
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
      remark: ''
    }
  },
  methods: {
    saveAll () {
      if (this.$submitLock()) return
      documentsTable.CISave({
        document_id: this.$route.params.id,
        bank: this.bankInfo.name,
        address: this.bankInfo.address,
        code: this.bankInfo.code,
        beneficiary: this.bankInfo.beneficiary,
        account_no: this.bankInfo.account_no,
        remarks: this.remark,
        to_company_name: this.companyInfo.company_name,
        to_company_address: this.companyInfo.company_address,
        invoice: this.companyInfo.invoice_number,
        po: this.companyInfo.po_no,
        order_date: this.companyInfo.date,
        from_address: this.otherInfo.from,
        to_address: this.otherInfo.to,
        payment: this.otherInfo.payment_terms,
        shipment_date: this.otherInfo.shipment_date,
        total_for: this.total_value,
        order_info: JSON.stringify(this.orderInfo)
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('编辑成功')
          this.$router.push(`/document/index/detail/${this.$route.params.id}?type=1`)
        }
      })
    },
    selectOrderNo ({ valueObj }, itemOrder) {
      itemOrder.styleArr = valueObj.product_info
    },
    selectStyleNo ({ valueObj }, itemOD, itemOrder) {
      itemOD.qty_pcs = (valueObj.pivot && valueObj.pivot.numbers) || ''
      itemOD.unit_price = (valueObj.pivot && valueObj.pivot.unit_price) || ''
      this.computedRowAmount(itemOD, itemOrder)
    },
    computedRowAmount (item, itemOrder) {
      if (item.qty_pcs && item.unit_price) {
        item.amount = this.$toFixed(item.qty_pcs * item.unit_price)
      } else {
        item.amount = ''
      }
      this.computedOrderPCSAmount(itemOrder)
    },
    computedOrderPCSAmount (itemOrder) {
      itemOrder.pcs = this.$toFixed(itemOrder.order_data.map(itemM => +itemM.qty_pcs || 0).reduce((total, current) => total + current, 0))
      itemOrder.amount = this.$toFixed(itemOrder.order_data.map(itemM => +itemM.amount || 0).reduce((total, current) => total + current, 0) + itemOrder.price_data.map(itemM => +itemM.price || 0).reduce((total, current) => total + current, 0))
    },
    addItem (data, type) {
      if (type === 'order') {
        data.push({
          order_data: [
            {
              order_no: '',
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
          pcs: '',
          amount: ''
        })
      } else if (type === 'order_data') {
        data.push({
          order_no: '',
          style_no: '',
          desc: '',
          qty_pcs: '',
          unit_price: '',
          amount: ''
        })
      } else if (type === 'price') {
        data.push({
          content: '',
          price: ''
        })
      }
    },
    deleteItem (data, index) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        data.splice(index, 1)
        this.orderInfo.forEach(itemF => {
          this.computedOrderPCSAmount(itemF)
        })
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
      documentSetting.bankDetail(),
      documents.detail({
        id: this.$route.params.id
      }),
      documentSetting.payTypeList(),
      documentSetting.typeList()
      // documentSetting.portList(),
    ]).then(res => {
      this.company_name = res[0].data.data.name
      this.company_address = res[0].data.data.address
      this.company_tel = res[0].data.data.tel
      this.company_fax = res[0].data.data.fax
      this.bankInfo = res[1].data.data
      // this.portList = res[2].data.data.map(itemM => {
      //   return {
      //     label: `${itemM.port_name},${itemM.country}`.toUpperCase(),
      //     value: `${itemM.port_name},${itemM.country}`.toUpperCase()
      //   }
      // })
      this.payTypeList = res[3].data.data.map(itemM => {
        return {
          label: `${itemM.name}(${itemM.english})`,
          value: `${itemM.name}(${itemM.english})`
        }
      })
      this.typeList = res[4].data.data.map(itemM => {
        return {
          label: itemM.english,
          value: itemM.english
        }
      })
      // 初始化基本信息
      const detailInfo = res[2].data.data
      this.orderArr = detailInfo.orders
      if (detailInfo.status_commercial_invoice !== 2) {
        documentsTable.CIDetail({
          document_id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            const detail = res.data.data
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
            this.orderInfo = JSON.parse(detail.order_info)
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
          from: detailInfo.from_address,
          to: detailInfo.to_address,
          payment_terms: detailInfo.payment,
          shipment_date: this.$getTime(detailInfo.shipment_date, '.')
        }
        this.loading = false
      }
    })
  },
  computed: {
    totalCom () {
      return {
        total_pcs: this.orderInfo.map(itemM => +itemM.pcs || 0).reduce((total, current) => total + current, 0),
        total_value: this.orderInfo.map(itemM => +itemM.amount || 0).reduce((total, current) => total + current, 0)
      }
    }
  },
  watch: {
    'totalCom.total_value' (newVal) {
      if (newVal === 0) {
        this.total_value = `SAY US ZERO DOLLARS ONLY.`
      } else if (newVal > 0 && newVal < 1) {
        this.total_value = `SAY US ${numberToEnglish(newVal)} ONLY.`.toUpperCase().replace(/,/g, ' ').replace(/-/g, ' ')
      } else {
        this.total_value = `SAY US ${numberToEnglish(newVal)} DOLLARS ONLY.`.toUpperCase().replace(/,/g, ' ').replace(/-/g, ' ')
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
@import "~@/assets/less/documents/CI.less";
</style>
