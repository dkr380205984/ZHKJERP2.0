<template>
  <div id='PL'
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
                  label='LOADING PORT:'
                  placeholder='装货港口'></document-input>
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
                  label='DESTINATION PORT:'
                  placeholder='目的港口'></document-input>
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
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.order_no"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.item_number"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.desc"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.size"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.quantity_pcs"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.total_ctns_no"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.n_w_kgs"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.g_w_kgs"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
          <div class="rowItem center">
            <document-input v-model="itemPack.vol_cbm"
              noLabel
              rowModle
              innerAlign='center'></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center noBorder">Total</div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder"></div>
          <div class="rowItem center noBorder">{{totalCom.total_ctns_no}}</div>
          <div class="rowItem center noBorder">{{totalCom.n_w_kgs}}</div>
          <div class="rowItem center noBorder">{{totalCom.g_w_kgs}}</div>
          <div class="rowItem center noBorder">{{totalCom.vol_cbm}}</div>
        </div>
      </div>
      <div class="bodyCtn marginTop"
        style="border-bottom:2px solid rgba(0,0,0,.45)">
        <div class="rowCtn">
          <div class="rowItem left">Remarks:</div>
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
// import documentSelect from '@/components/documents/select/index.vue'
// import { documentSetting } from '@/assets/js/api.js'
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
        loading_port: '',
        destination_port: '',
        payment_terms: '',
        shipment_date: ''
      },
      packList: [
        // {
        //   ctn_no_ttl: '',
        //   order_no: '',
        //   item_number: '',
        //   desc: '',
        //   size: '',
        //   quantity_pcs: '',
        //   total_ctns_no: '',
        //   n_w_kgs: '',
        //   g_w_kgs: '',
        //   vol_cbm: ''
        // }
      ],
      remark: ''
    }
  },
  methods: {
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
    // 为了页面好看给定packList长度30
    const arr = new Array(30).join().split(',')
    this.packList = arr.map(itemM => ({}))
    this.remark = Object.keys(Array(100).toString().split(',')).map(itemM => 'JFK大家看法积极开发间接费扩大解放咔叽发').join(',')
    this.$forceUpdate()
  },
  computed: {
    totalCom () {
      return {
        total_ctns_no: this.$toFixed(this.packList.map(itemM => +itemM.total_ctns_no || 0).reduce((total, current) => total + current, 0)),
        n_w_kgs: this.$toFixed(this.packList.map(itemM => +itemM.n_w_kgs || 0).reduce((total, current) => total + current, 0)),
        g_w_kgs: this.$toFixed(this.packList.map(itemM => +itemM.g_w_kgs || 0).reduce((total, current) => total + current, 0)),
        vol_cbm: this.$toFixed(this.packList.map(itemM => +itemM.vol_cbm || 0).reduce((total, current) => total + current, 0))
      }
    }
  },
  components: {
    documentInput
    // documentSelect
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/PL.less";
</style>
