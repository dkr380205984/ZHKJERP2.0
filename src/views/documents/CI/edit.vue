<template>
  <div id='CI'
    class='document edit'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{'HANGZHOU KANGHENG'}} KNITTING CO.,LTD.</div>
          <div class="title2">NO 156 JINCHENG ROAD XINDENG TOWN FUYANG HANGZHOU,CHINA</div>
          <div class="title3">Tel:086-57163257028&nbsp;&nbsp;Fax:086-57163257028</div>
          <div class="title">COMMERICAL INVOICE</div>
        </div>
      </div>
      <div class="bodyCtn">
        <div class="rowCtn">
          <div class="rowItem col noBorder"
            style="flex:1.5">
            <div class="rowCtn noBorder">
              <div class="rowItem left">TO:</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  placeholder='公司名称(company name)'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input :rows='2'
                  rowModle
                  placeholder='公司地址(company address)'></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input rowModle
                  width='150px'
                  alignType='right'
                  label='Invoice Number:'
                  placeholder='发票号码'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input rowModle
                  width='150px'
                  alignType='right'
                  label="PO NO.:"
                  placeholder='订单号'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem right">
                <document-input rowModle
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
            style="flex:1.5">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='From:'
                  placeholder='生产地'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='PAYMENT TERMS:'
                  placeholder='付款方式'></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='TO:'
                  placeholder='发货地'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
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
            <document-select v-model="itemOD.order_no"
              placeholder='订单号'
              noLabel
              rowModle
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-select v-model="itemOD.style_no"
              placeholder='款号'
              noLabel
              rowModle
              innerAlign='center'></document-select>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.desc"
              placeholder='产品描述'
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.qty_pcs"
              placeholder='数量'
              noLabel
              rowModle
              innerAlign='center'
              @input="computedRowAmount(itemOD,itemOrder)"></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.unit_price"
              placeholder='单价'
              noLabel
              rowModle
              innerAlign='center'
              @input="computedRowAmount(itemOD,itemOrder)"></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemOD.amount"
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
          <div class="rowItem left noBorder">TOTAL FOR:</div>
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
          <div class="rowItem left noBorder">TOTAL VALUE:</div>
          <div class="rowItem"
            style="flex:5">
            <document-input readonly
              rowModle
              noLabel
              placeholder='自动填充'></document-input>
          </div>
        </div>
      </div>
      <div class="rowModle marginTop">
        <div class="bodyCtn">
          <div class="rowCtn">
            <div class="rowItem left">Bank Information:</div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
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
                <div class="rowItem left noBorder"
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
                <div class="rowItem left noBorder"
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
                <div class="rowItem left noBorder"
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
          <div class="rowCtn"
            style="border-top:none">
            <div class="rowItem col">
              <div class="rowCtn noBorder">
                <div class="rowItem left noBorder"
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
            <div class="rowItem left">Remarks:</div>
          </div>
          <div class="rowCtn noBorder">
            <div class="rowItem left">
              <document-input noLabel
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
        <div class="btn btnBlue">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
import documentInput from '@/components/documents/input/index.vue'
import documentSelect from '@/components/documents/select/index.vue'
import { documentSetting } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: false,
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
    Promise.all([
      documentSetting.bankDetail()
    ]).then(res => {
      this.bankInfo = res[0].data.data
    })
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
