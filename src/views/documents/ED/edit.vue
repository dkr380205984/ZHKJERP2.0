<template>
  <div id='ED'
    class="document edit">
    <!-- 出口货物报关单 ==>  export declaration -->
    <div class="tableCtn crossWise">
      <div class="headerCtn">
        <div class="top">
          <div class="title">中华人民共和国海关出口货物报关单</div>
        </div>
        <div class="bottom">
          <div class="bottom_item">
            <document-input v-model="saveInfo.pre_entry"
              rowModle
              label="预录入编号：" />
          </div>
          <div class="bottom_item">
            <document-input v-model="saveInfo.customs"
              rowModle
              label="海关编号：" />
          </div>
          <div class="bottom_item right"
            style="width:180px">
            <document-input rowModle
              label="页码/页数：" />
          </div>
        </div>
      </div>
      <div class="bodyCtn"
        style="overflow:visible">
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.sender"
              label="境内发货人"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-select type='autocomplete'
              :optionData='portArr'
              v-model="saveInfo.exit_customs"
              label="出境关别"
              :rows="2"></document-select>
          </div>
          <div class="rowItem">
            <document-input v-model="saveInfo.export_date"
              label="出口日期"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input v-model="saveInfo.filing_date"
              label="申报日期"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input v-model="saveInfo.case"
              label="备案号"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.overseas_consignee"
              label="境外收货人"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-select :optionData='transportMethods'
              type='autocomplete'
              v-model="saveInfo.transport"
              label="运输方式"
              :rows="2"></document-select>
          </div>
          <div class="rowItem">
            <document-input v-model="saveInfo.transport_voyage"
              label="运输工具名称及航次号"
              :rows="2"></document-input>
          </div>
          <div class="rowItem"
            style="flex:2;border-right:2px solid transparent">
            <document-input v-model="saveInfo.waybill"
              label="提运单号"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.production_sales_unit"
              label="生产销售单位"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input v-model="saveInfo.supervision_method"
              label="监管方式"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-input v-model="saveInfo.nature_exemption"
              label="免征性质"
              :rows="2"></document-input>
          </div>
          <div class="rowItem"
            style="flex:2;border-right:2px solid transparent">
            <document-input v-model="saveInfo.license"
              label="许可证"
              :rows="2"></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.contract_agreement"
              label="合同协议号"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <document-select v-model="saveInfo.trading_country"
              label="贸易国(地区)"
              type='autocomplete'
              :optionData='countryArr'
              :rows="2"></document-select>
          </div>
          <div class="rowItem">
            <document-select v-model="saveInfo.arrival_country"
              type='autocomplete'
              :optionData='countryArr'
              label="运抵国(地区)"
              :rows="2"></document-select>
          </div>
          <div class="rowItem">
            <document-select v-model="saveInfo.refers_port"
              type='autocomplete'
              :optionData='portArr'
              label="指运港"
              :rows="2"></document-select>
          </div>
          <div class="rowItem">
            <document-select v-model="saveInfo.departure_port"
              type='autocomplete'
              :optionData='portArr'
              label="离境口岸"
              :rows="2"></document-select>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.packaging"
              label="包装种类"
              :rows="2"></document-input>
          </div>
          <div class="rowItem">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.pieces"
                  type='number'
                  label="件数"
                  :rows="2"></document-input>

              </div>
              <div class="rowItem">
                <document-input v-model="saveInfo.gwkgs"
                  type='number'
                  label="毛重(千克)"
                  :rows="2"></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.nwkgs"
                  type='number'
                  label="净重(千克)"
                  :rows="2"></document-input>

              </div>
              <div class="rowItem">
                <document-select type='autocomplete'
                  :optionData='priceTerms'
                  v-model="saveInfo.transaction_method"
                  label="成交方式"
                  :rows="2"></document-select>
              </div>
            </div>
          </div>
          <div class="rowItem"
            style="flex:2;border-right:2px solid transparent">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input v-model="saveInfo.shipping"
                  type='number'
                  label="运费"
                  :rows="2"></document-input>
              </div>
              <div class="rowItem">
                <document-input v-model="saveInfo.premium"
                  type='number'
                  label="保费"
                  :rows="2"></document-input>
              </div>
              <div class="rowItem">
                <document-input v-model="saveInfo.miscellaneous"
                  type='number'
                  label="杂费"
                  :rows="2"></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.documents"
              label="随附单证及编号"
              rowModle />
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem">
            <document-input v-model="saveInfo.marks_remarks"
              label="标记喷码及备注"
              rowModle />
          </div>
        </div>
        <div class="rowCtn editBtnCtn"
          style="font-size:16px">
          <div class="addBtn iconModle"
            @click="addItem(saveInfo.custom_declaration_orders)"></div>
          <div class="rowItem center">项目</div>
          <div class="rowItem center flex2">商品编号</div>
          <div class="rowItem center flex18">商品名称</div>
          <div class="rowItem center flex2">规格型号</div>
          <div class="rowItem center">数量</div>
          <div class="rowItem center">单位</div>
          <div class="rowItem center">单价</div>
          <div class="rowItem center flex18">总价</div>
          <div class="rowItem center">币制</div>
          <div class="rowItem center flex18">原产国(地区)</div>
          <div class="rowItem center flex2">最终目的国(地区)</div>
          <div class="rowItem center flex18">境内货源地</div>
          <div class="rowItem center flex18">征免</div>
        </div>
        <div class="rowCtn editBtnCtn"
          style="font-size:16px"
          v-for="(item,index) in saveInfo.custom_declaration_orders"
          :key="index">
          <div class="deleteBtn iconModle"
            @click="deleteItem(saveInfo.custom_declaration_orders,index)"></div>
          <div class="rowItem center">
            <document-input v-model="item.item_no"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex2">
            <document-select type='autocomplete'
              :optionData='HSArr'
              optionLabel='hs_code'
              optionValue='hs_code'
              v-model="item.product_no"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex18">
            <document-select type='autocomplete'
              :optionData='typeArr'
              v-model="item.product_name"
              innerAlign='center'
              noLabel
              rowModle
              @select="selectTypeEvent($event,item)" />
          </div>
          <div class="rowItem center flex2">
            <document-select type='autocomplete'
              :optionData='styleArr'
              optionLabel='style_code'
              optionValue='style_code'
              @select="selectStyleCode($event,item)"
              v-model="item.style_code"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center">
            <document-input v-model="item.number"
              @input="computedTotal(item)"
              type='number'
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center">
            <document-input v-model="item.unit"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center">
            <document-input v-model="item.unit_price"
              @input="computedTotal(item)"
              type='number'
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex18">
            <document-input v-model="item.total_price"
              type='number'
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center">
            <document-select type='autocomplete'
              :optionData='moneyTypes'
              v-model="item.currency_system"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex18">
            <document-input v-model="item.origin_country"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex2">
            <document-select type='autocomplete'
              :optionData='countryArr'
              v-model="item.destination_country"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex18">
            <document-select type='autocomplete'
              :optionData='supplySource'
              v-model="item.goods_source"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
          <div class="rowItem center flex18">
            <document-input v-model="item.exemption"
              innerAlign='center'
              noLabel
              rowModle />
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem noBorder flex3">
            <document-input v-model="saveInfo.special_relationship"
              rowModle
              label="特殊关系确认：" />
          </div>
          <div class="rowItem noBorder flex3">
            <document-input v-model="saveInfo.price_impact"
              rowModle
              label="价格影响确认：" />
          </div>
          <div class="rowItem noBorder flex4">
            <document-input v-model="saveInfo.payment_concession"
              rowModle
              label="支付特许权使用费确认：" />
          </div>
          <div class="rowItem noBorder flex2">
            <document-input v-model="saveInfo.report_pay"
              rowModle
              label="自报自缴：" />
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem col"
            style="flex:16.6">
            <div class="rowCtn noBorder">
              <div class="rowItem noBorder">
                <document-input v-model="saveInfo.customs_broker"
                  label="报关人员"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder">
                <document-input v-model="saveInfo.customs_broker_number"
                  label="报关人员证号"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder right">
                <document-input v-model="saveInfo.phone"
                  label="电话"
                  rows='2.5'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem noBorder">
                <document-input v-model="saveInfo.reporting_unit"
                  label="申报单位"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder">
                <document-input label="申报单位(签章)"
                  rows='2.5'></document-input>
              </div>
              <div class="rowItem noBorder right"
                style="font-size:14px;align-items:flex-end;">
                兹申明对以上内容承担如实申报、依法纳税责任
              </div>
            </div>
          </div>
          <div class="rowItem"
            style="flex:6.55">
            <document-input label="海关批注及签章"></document-input>
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
import { documentsTable, documents, documentSetting } from '@/assets/js/api.js'
import { transportMethods, priceTerms, localStorage, moneyTypes } from '@/assets/js/documentsCommon.js'
export default {
  data () {
    return {
      loading: false,
      saveInfo: { // 偷懒按照接口文档数据格式来 到时候直接提交这个数据
        pre_entry: '', // 预录入编号
        customs: '', // 海关编号
        sender: '', // 境内发货人
        exit_customs: '', // 出境关别
        export_date: '', // 出口日期
        filing_date: '', // 申报日期
        case: '', // 备案号
        overseas_consignee: '', // 境外收货人
        transport: '', // 运输方式
        transport_voyage: '', // 运输工具名称及航次号
        waybill: '', // 提运单号
        production_sales_unit: '', // 生产销售单位
        supervision_method: '一般贸易', // 监管方式
        nature_exemption: '一般征税', // 免征性质
        license: '', // 许可证
        contract_agreement: '', // 合同协议号
        trading_country: '', // 贸易国
        arrival_country: '', // 运抵国
        refers_port: '', // 指运港
        departure_port: '', // 离境口岸
        packaging: '纸箱', // 包装种类
        pieces: '', // 件数
        gwkgs: '', // 毛重(kg)
        nwkgs: '', // 净重(kg)
        transaction_method: '', // 成交方式
        shipping: '', // 运费
        premium: '', // 保费
        miscellaneous: '', // 杂费
        documents: '', // 随附单证及编号
        marks_remarks: '', // 标记唛码和备注
        special_relationship: '否', // 特殊关系确认
        price_impact: '否', // 价格影响确认
        payment_concession: '否', // 支付特许使用费
        report_pay: '否', // 自报自缴
        customs_broker: '', // 报关人员
        customs_broker_number: '', // 报关人员证号
        phone: '', // 电话
        reporting_unit: '', // 申报单位
        custom_declaration_orders: [ // 货物信息
          // {
          //   item_no: '1', // 项号
          //   product_no: '', // 商品编号
          //   product_name: '', // 商品名称及规格号
          //   style_code: '', // 上面字段得拆成两字段(新增的)  数据库的product_name是前端product_name与style_code的连接
          //   number: '', // 数量
          //   unit: '', // 单位
          //   unit_price: '', // 单价
          //   total_price: '', // 总价
          //   currency_system: '', // 币制
          //   origin_country: '中国', // 原产国
          //   destination_country: '', // 最终目的国
          //   goods_source: '', // 货源地
          //   exemption: '照章征税'// 证免
          // }
        ]
      },
      countryArr: [],
      portArr: [],
      transportMethods,
      priceTerms,
      HSArr: [],
      typeArr: [],
      styleArr: [],
      supplySource: localStorage.supplySource,
      moneyTypes: moneyTypes.map(itemM => ({ value: itemM.value, label: itemM.value })),
      defaultMoneyType: '' // 默认币制
    }
  },
  methods: {
    selectTypeEvent ({ valueObj }, item) {
      item.unit = valueObj.unit
    },
    selectStyleCode ({ valueObj }, item) {
      // item.number = valueObj.numbers
      item.unit_price = valueObj.unit_price
      this.computedTotal(item)
    },
    saveAll () {
      if (this.$submitLock()) return
      documentsTable.EDSave({
        document_id: this.$route.params.id,
        ...this.saveInfo,
        custom_declaration_orders: this.saveInfo.custom_declaration_orders.map(itemM => {
          localStorage.supplySource = itemM.goods_source // 保存时将境内货源地存在本地缓存
          return itemM
        })
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('编辑成功')
          this.$router.push(`/document/index/detail/${this.$route.params.id}?type=3`)
        }
      })
    },
    computedTotal (item) {
      if (item.number && item.unit_price) {
        item.total_price = this.$toFixed(item.number * item.unit_price)
      }
    },
    addItem (data) {
      data.push({
        item_no: data.length + 1,
        product_no: '',
        product_name: '',
        style_code: '',
        number: '',
        unit: '',
        unit_price: '',
        total_price: '',
        currency_system: this.defaultMoneyType || '',
        origin_country: '中国',
        destination_country: '',
        goods_source: '',
        exemption: '照章征税'
      })
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
      documents.detail({
        id: this.$route.params.id
      }),
      documentSetting.portList(),
      documentSetting.companyDetail(),
      documentSetting.HSList(),
      documentSetting.typeList()
    ]).then(res => {
      this.defaultMoneyType = res[0].data.data.currency_system
      this.addItem(this.saveInfo.custom_declaration_orders)
      if (res[0].data.data.status_export_declaration !== 2) { // 判断是否添加过 是否去拿详情
        documentsTable.EDDetail({
          document_id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            this.saveInfo = res.data.data
          }
        })
      } else {
        if (res[0].data.data.status_packing_list !== 2) { // 判断是否添加过装箱单 拿下件数毛重净重信息
          documentsTable.PLDetail({
            document_id: this.$route.params.id
          }).then(res => {
            if (res.data.status !== false) {
              this.saveInfo.pieces = res.data.data.box_orders.map(itemM => +itemM.ctn_total || 0).reduce((total, current) => total + current, 0)
              this.saveInfo.gwkgs = res.data.data.box_orders.map(itemM => +itemM.gwkgs || 0).reduce((total, current) => total + current, 0)
              this.saveInfo.nwkgs = res.data.data.box_orders.map(itemM => +itemM.nwkgs || 0).reduce((total, current) => total + current, 0)
            }
          })
        }
        this.saveInfo.sender = `${res[2].data.data.code} ${window.sessionStorage.getItem('full_name')}`
        this.saveInfo.overseas_consignee = res[0].data.data.to_company_name
        this.saveInfo.production_sales_unit = `${res[2].data.data.code} ${window.sessionStorage.getItem('full_name')}`
        // this.saveInfo.customs_broker = window.sessionStorage.getItem('user_name') || ''
        // this.saveInfo.phone = window.sessionStorage.getItem('telephone') || ''
        // this.saveInfo.reporting_unit = `${res[2].data.data.code} ${window.sessionStorage.getItem('full_name')}`
      }
      this.countryArr = this.$unique(res[1].data.data.map(itemM => itemM.country)).map(itemM => {
        return {
          value: itemM.toUpperCase(),
          label: itemM.toUpperCase()
        }
      })
      this.portArr = this.$unique(res[1].data.data.map(itemM => itemM.port_name)).map(itemM => {
        return {
          value: itemM.toUpperCase(),
          label: itemM.toUpperCase()
        }
      })
      this.HSArr = res[3].data.data
      this.typeArr = res[4].data.data.map(itemM => {
        return {
          label: `${itemM.name},${itemM.english}`,
          value: `${itemM.name},${itemM.english}`,
          unit: itemM.unit
        }
      })
      this.styleArr = res[0].data.data.orders.map(itemM => {
        return itemM.product_info.map(itemMP => {
          return {
            style_code: itemMP.style_code,
            numbers: itemMP.pivot.numbers,
            unit_price: itemMP.pivot.unit_price
          }
        })
      }).flat(1)
    })
  },
  components: {
    documentInput,
    documentSelect
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/ED.less";
</style>
