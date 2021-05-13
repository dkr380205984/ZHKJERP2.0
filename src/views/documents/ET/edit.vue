<template>
  <div id='ET'
    class='document edit'
    v-loading='loading'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{companyName}}货运委托书</div>
        </div>
      </div>
      <div class="bodyCtn">
        <div class="rowCtn">
          <div class="rowItem col noBorder flex15">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="saveInfo.order_no"
                  rowModle
                  label='委托书单号：'
                  placeholder='委托书单号'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="addDate"
                  rowModle
                  readonly
                  label='添加日期：'
                  placeholder='添加日期'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="printDate"
                  rowModle
                  readonly
                  label='打印日期：'
                  placeholder='打印日期'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input v-model="printUser"
                  rowModle
                  readonly
                  label='打印人：'
                  placeholder='打印人'></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.contact_person"
                  rowModle
                  label='联系人:'
                  placeholder='联系人'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.phone"
                  rowModle
                  label='电话:'
                  placeholder='电话'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.email"
                  rowModle
                  label="邮箱:"
                  placeholder='邮箱'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.fax"
                  rowModle
                  label='传真:'
                  placeholder='传真'></document-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop"
        style="overflow:visible">
        <div class="rowCtn">
          <div class="rowItem center">SHIPPER<br />(发货人)</div>
          <div class="rowItem center flex2">
            <document-input v-model="saveInfo.shipper"
              rowModle
              noLabel
              placeholder='SHIPPER(发货人)'></document-input>
          </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">运输方式</div>
              <div class="rowItem center">
                <document-select type='autocomplete'
                  :optionData='transportMethods'
                  v-model="saveInfo.transport"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='运输方式'></document-select>
              </div>
              <div class="rowItem center">价格条款</div>
              <div class="rowItem center">
                <document-select type='autocomplete'
                  :optionData='priceTerms'
                  v-model="saveInfo.pricing_term"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='价格条款'></document-select>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">发票号码</div>
              <div class="rowItem center"
                style="flex:3.03">
                <document-input v-model="saveInfo.invoice_number"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='发票号码'></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">CONSIGNEE<br />(收货人)</div>
          <div class="rowItem center flex2">
            <document-input v-model="saveInfo.consignee"
              rowModle
              noLabel
              placeholder='CONSIGNEE(收货人)'></document-input>
          </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">合同号码</div>
              <div class="rowItem center"
                style="flex:3.03">
                <document-input v-model="saveInfo.contract_number"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='合同号码'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">开证日期</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.issuing_date"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='开证日期'></document-input>
              </div>
              <div class="rowItem center">信用证号</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.credit_number"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='信用证号'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">金额USD</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.amount_usd"
                  type='number'
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='金额USD'></document-input>
              </div>
              <div class="rowItem center">收汇方式</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.receiving_method"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='收汇方式'></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">NOTIFY<br />PARTY<br />(通知人)</div>
          <div class="rowItem center flex2">
            <document-input v-model="saveInfo.notify_party"
              rowModle
              noLabel
              placeholder='NOTIFY PARTY(通知人)'></document-input>
          </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">贸易性质</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.nature_trade"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='贸易性质'></document-input>
              </div>
              <div class="rowItem center">贸易国别</div>
              <div class="rowItem center">
                <document-select type='autocomplete'
                  :optionData='countryList'
                  v-model="saveInfo.trading_country"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='贸易国别'></document-select>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">出口口岸</div>
              <div class="rowItem center">
                <document-select v-model="saveInfo.export_ports"
                  type='autocomplete'
                  :optionData='portList'
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='出口口岸'></document-select>
              </div>
              <div class="rowItem center">目的地港口</div>
              <div class="rowItem center">
                <document-select v-model="saveInfo.destination_port"
                  type='autocomplete'
                  :optionData='portList'
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='目的地港口'></document-select>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">转运</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.transport_method"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='转运'></document-input>
              </div>
              <div class="rowItem center">分批</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.batch"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='分批'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">装运期限</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.shipment_term"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='装运期限'></document-input>
              </div>
              <div class="rowItem center">有效期限</div>
              <div class="rowItem center">
                <document-input v-model="saveInfo.validity_period"
                  rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='有效期限'></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn editBtnCtn">
          <div class="addBtn"
            @click="addItem(saveInfo.freight_orders)">添加</div>
          <div class="rowItem center">标记唛头</div>
          <div class="rowItem center"
            style="flex:0.99">货品规格</div>
          <div class="rowItem center"
            style="flex:0.99">HS CODE</div>
          <div class="rowItem center"
            style="flex:0.99">件数及包装</div>
          <div class="rowItem center"
            style="flex:0.99">毛重(KGS)</div>
          <div class="rowItem center"
            style="flex:0.98">净重(KGS)</div>
          <div class="rowItem center"
            style="flex:0.99">体积(VOL)</div>
        </div>
        <div class="rowCtn editBtnCtn"
          v-for="(itemPack,indexPack) in saveInfo.freight_orders"
          :key="indexPack">
          <div class="deleteBtn iconModle"
            @click="deleteItem(saveInfo.freight_orders,indexPack)"></div>
          <div class="rowItem center">
            <document-input v-model="itemPack.trademark"
              rowModle
              innerAlign='center'
              noLabel
              placeholder='标记唛头'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-select type='autocomplete'
              :optionData='typeList'
              v-model="itemPack.specification"
              rowModle
              innerAlign='center'
              noLabel
              placeholder='货品规格'></document-select>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-select :optionData='HSList'
              type='autocomplete'
              optionLabel='hs_code'
              optionValue='hs_code'
              v-model="itemPack.hs_code"
              rowModle
              innerAlign='center'
              noLabel
              placeholder='HS CODE'></document-select>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input v-model="itemPack.number_package"
              type='number'
              rowModle
              innerAlign='center'
              noLabel
              placeholder='件数及包装'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input v-model="itemPack.gwkgs"
              type='number'
              rowModle
              innerAlign='center'
              noLabel
              placeholder='毛重(KGS)'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.98">
            <document-input v-model="itemPack.nwkgs"
              type='number'
              rowModle
              innerAlign='center'
              noLabel
              placeholder='净重(KGS)'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input v-model="itemPack.volume"
              type='number'
              rowModle
              innerAlign='center'
              noLabel
              placeholder='体积(VOL)'></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem"
            style="flex:3.04;">
            <span style="flex:1;padding-right:36px;text-align:right">TOTAL:</span>
          </div>
          <div class="rowItem">
            <document-input v-model="totalCom.number_package"
              rowModle
              readonly
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
          <div class="rowItem">
            <document-input v-model="totalCom.gwkgs"
              rowModle
              readonly
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
          <div class="rowItem"
            style="flex:0.99">
            <document-input v-model="totalCom.nwkgs"
              rowModle
              readonly
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
          <div class="rowItem">
            <document-input v-model="totalCom.volume"
              rowModle
              readonly
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">订仓说明</div>
          <div class="rowItem center flex3">
            <document-input v-model="saveInfo.remarks"
              rowModle
              noLabel
              placeholder='订仓说明'></document-input>
          </div>
          <div class="rowItem center flex3 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">总托盘数(PLTS)</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.plts"
                  rowModle
                  noLabel
                  placeholder='总托盘数(PLTS)'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">船名航次</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.voyage"
                  rowModle
                  noLabel
                  placeholder='船名航次'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">提单号</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.bill_order_no"
                  rowModle
                  noLabel
                  placeholder='提单号'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">海运费</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.maritime_number"
                  type='number'
                  rowModle
                  noLabel
                  placeholder='海运费'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">包干费</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.lump_sum_fee"
                  type='number'
                  rowModle
                  noLabel
                  placeholder='包干费'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">运费</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.shipping"
                  type='number'
                  rowModle
                  noLabel
                  placeholder='运费'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">其它费用</div>
              <div class="rowItem center flex2">
                <document-input v-model="saveInfo.other_fee"
                  type='number'
                  rowModle
                  noLabel
                  placeholder='其它费用'></document-input>
              </div>
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
import { documents, documentsTable, documentSetting } from '@/assets/js/api.js'
import { transportMethods, priceTerms } from '@/assets/js/documentsCommon.js'
export default {
  data () {
    return {
      loading: true,
      companyName: window.sessionStorage.getItem('full_name'),
      addDate: this.$getTime(),
      printDate: this.$getTime(),
      printUser: window.sessionStorage.getItem('user_name'),
      saveInfo: {// 偷懒按照接口文档数据格式来 到时候直接提交这个数据
        order_no: '', // 委托书单号
        contact_person: window.sessionStorage.getItem('user_name'), // 联系人
        phone: window.sessionStorage.getItem('telephone'), // 电话
        email: '', // 邮箱
        fax: '', // 传真
        shipper: '', // 发货人
        consignee: '', // 收货人
        notify_party: '', // 通知人
        transport: '', // 运输方式
        pricing_term: '', // 价格条款
        invoice_number: '', // 发票号码
        contract_number: '', // 合同号码
        issuing_date: '', // 开证日期
        credit_number: '', // 信用证号
        amount_usd: '', // 金额usd
        receiving_method: '', // 收汇方式
        nature_trade: '一般贸易', // 贸易性质
        trading_country: '', // 贸易国别
        export_ports: '', // 出口口岸
        destination_port: '', // 目的地港口
        transport_method: '', // 转运
        batch: '', // 分批
        shipment_term: '', // 装运期限
        validity_period: '', // 有效期限
        remarks: '', // 定仓说明
        plts: '', // 总托盘数
        voyage: '', // 船名航次
        bill_order_no: '', // 提单号
        maritime_number: '', // 海运号
        lump_sum_fee: '', // 包干费
        shipping: '', // 运费
        other_fee: '', // 其他费用
        freight_orders: [ // 货物信息
          {
            trademark: '', // 标记唛头
            specification: '', // 规格
            hs_code: '', // hs 编码
            number_package: '', // 件数和包装
            gwkgs: '', // 毛重
            nwkgs: '', // 净重
            volume: '' // 体积
          }
        ]
      },
      portList: [],
      transportMethods,
      priceTerms,
      countryList: [],
      HSList: [],
      typeList: []
    }
  },
  methods: {
    saveAll () {
      if (this.$submitLock()) return
      documentsTable.ETSave({
        document_id: this.$route.params.id,
        ...this.saveInfo
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('编辑成功')
          this.$router.push(`/document/index/detail/${this.$route.params.id}?type=5`)
        }
      })
    },
    addItem (data) {
      data.push({
        trademark: '', // 标记唛头
        specification: '', // 规格
        hs_code: '', // hs 编码
        number_package: '', // 件数和包装
        gwkgs: '', // 毛重
        newkgs: '', // 净重
        volume: '' // 体积
      })
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
  computed: {
    totalCom () {
      return {
        number_package: this.saveInfo.freight_orders.map(itemM => +itemM.number_package || 0).reduce((total, current) => total + current, 0),
        gwkgs: this.saveInfo.freight_orders.map(itemM => +itemM.gwkgs || 0).reduce((total, current) => total + current, 0),
        nwkgs: this.saveInfo.freight_orders.map(itemM => +itemM.nwkgs || 0).reduce((total, current) => total + current, 0),
        volume: this.saveInfo.freight_orders.map(itemM => +itemM.volume || 0).reduce((total, current) => total + current, 0)
      }
    }
  },
  created () {
    this.loading = true
    Promise.all([
      documents.detail({
        id: this.$route.params.id
      }),
      documentSetting.portList(),
      documentSetting.HSList(),
      documentSetting.typeList()
    ]).then(res => {
      if (res[0].data.data.status_entrustiong_transport !== 2) {
        documentsTable.ETDetail({
          document_id: this.$route.params.id
        }).then(res => {
          if (res.data.data.status !== false) {
            this.saveInfo = res.data.data
            this.addDate = this.$getTime(res.data.data.created_at)
            delete this.saveInfo.created_at
            this.loading = false
          }
        })
      } else {
        if (res[0].data.data.status_commercial_invoice !== 2) {
          documentsTable.CIDetail({
            document_id: this.$route.params.id
          }).then(res => {
            if (res.data.status !== false) {
              const orderInfo = JSON.parse(res.data.data.order_info)
              this.saveInfo.amount_usd = this.$toFixed((orderInfo || []).map(itemM => (+itemM.amount || 0)).reduce((total, current) => total + current, 0))
            }
          })
        }
        this.saveInfo.shipper = `${window.sessionStorage.getItem('full_name')} `
        this.saveInfo.consignee = `${res[0].data.data.to_company_name},${res[0].data.data.to_company_address}`
        this.saveInfo.notify_party = `${res[0].data.data.to_company_name},${res[0].data.data.to_company_address}`
        this.loading = false
      }
      this.portList = res[1].data.data.map(itemM => {
        return {
          label: (itemM.port_name).toUpperCase(),
          value: (itemM.port_name).toUpperCase()
        }
      })
      this.countryList = this.$unique(res[1].data.data.map(itemM => {
        return {
          label: (itemM.country).toUpperCase(),
          value: (itemM.country).toUpperCase()
        }
      }), 'label')
      this.HSList = res[2].data.data
      this.typeList = res[3].data.data.map(itemM => {
        return {
          label: `${itemM.name},${itemM.english}`,
          value: `${itemM.name},${itemM.english}`
        }
      })
    })
  },
  components: {
    documentInput,
    documentSelect
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/ET.less";
</style>
