<template>
  <div id='ED'
    class="document">
    <!-- 出口货物报关单 ==>  export declaration -->
    <div class="tableCtn crossWise"
      v-for="itemNo in Math.ceil(saveInfo.custom_declaration_orders.length / 5)"
      :key="itemNo">
      <div class="headerCtn">
        <div class="top">
          <div class="title">中华人民共和国海关出口货物报关单</div>
        </div>
        <div class="bottom">
          <div class="bottom_item">预录入编号：{{saveInfo.pre_entry}} </div>
          <div class="bottom_item">海关编号：{{saveInfo.customs}} </div>
          <div class="bottom_item right"
            style="width:180px"> 页码/页数：{{`${itemNo}/${Math.ceil(saveInfo.custom_declaration_orders.length / 5)}`}}
          </div>
        </div>
      </div>
      <div class="bodyCtn"
        style="overflow:visible">
        <div class="rowCtn">
          <div class="rowItem columnModule">
            境内发货人
            <br />
            {{saveInfo.sender}}
          </div>
          <div class="rowItem columnModule">
            出境关别
            <br />
            {{saveInfo.exit_customs}}
          </div>
          <div class="rowItem columnModule">
            出口日期
            <br />
            {{saveInfo.export_date}}
          </div>
          <div class="rowItem flex2">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                申报日期
                <br />
                {{saveInfo.filing_date}}
              </div>
              <div class="rowItem columnModule">
                备案号
                <br />
                {{saveInfo.case}}
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem columnModule">
            境外收货人
            <br />
            {{saveInfo.overseas_consignee}}
          </div>
          <div class="rowItem columnModule">
            运输方式
            <br />
            {{saveInfo.transport}}
          </div>
          <div class="rowItem columnModule">
            运输工具名称及航次号
            <br />
            {{saveInfo.transport_voyage}}
          </div>
          <div class="rowItem flex2">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                提运单号
                <br />
                {{saveInfo.waybill}}
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem columnModule">
            生产销售单位
            <br />
            {{saveInfo.production_sales_unit}}
          </div>
          <div class="rowItem columnModule">
            监管方式
            <br />
            {{saveInfo.supervision_method}}
          </div>
          <div class="rowItem columnModule">
            免征性质
            <br />
            {{saveInfo.nature_exemption}}
          </div>
          <div class="rowItem flex2">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                许可证
                <br />
                {{saveInfo.license}}
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem columnModule">
            合同协议号
            <br />
            {{saveInfo.contract_agreement}}
          </div>
          <div class="rowItem columnModule">
            贸易国(地区)
            <br />
            {{saveInfo.trading_country}}
          </div>
          <div class="rowItem columnModule">
            运抵国(地区)
            <br />
            {{saveInfo.arrival_country}}
          </div>
          <div class="rowItem flex2">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                指运港
                <br />
                {{saveInfo.refers_port}}
              </div>
              <div class="rowItem columnModule">
                离境口岸
                <br />
                {{saveInfo.departure_port}}
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem columnModule">
            包装种类
            <br />
            {{saveInfo.packaging}}
          </div>
          <div class="rowItem columnModule"
            style="padding:0 8px;height:auto">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                件数
                <br />
                {{saveInfo.pieces}}
              </div>
              <div class="rowItem columnModule">
                毛重(千克)
                <br />
                {{saveInfo.gwkgs}}
              </div>
            </div>
          </div>
          <div class="rowItem columnModule"
            style="padding:0 8px;height:auto">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                净重(千克)
                <br />
                {{saveInfo.nwkgs}}
              </div>
              <div class="rowItem columnModule">
                成交方式
                <br />
                {{saveInfo.transaction_method}}
              </div>
            </div>
          </div>
          <div class="rowItem flex2">
            <div class="rowCtn noBorder">
              <div class="rowItem columnModule">
                运费
                <br />
                {{saveInfo.shipping}}
              </div>
              <div class="rowItem columnModule">
                保费
                <br />
                {{saveInfo.premium}}
              </div>
              <div class="rowItem columnModule">
                杂费
                <br />
                {{saveInfo.miscellaneous}}
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left">随附单证及编号：{{saveInfo.documents}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left">标记喷码及备注：{{saveInfo.marks_remarks}} </div>
        </div>
        <div class="rowCtn"
          style="font-size:16px">
          <div class="rowItem center">项目</div>
          <div class="rowItem center flex2">商品编号</div>
          <div class="rowItem center flex4">商品名称及规格型号</div>
          <div class="rowItem center flex18">数量</div>
          <div class="rowItem center">单位</div>
          <div class="rowItem center">单价</div>
          <div class="rowItem center flex18">总价</div>
          <div class="rowItem center">币制</div>
          <div class="rowItem center flex3">原产国(地区)</div>
          <div class="rowItem center flex3">最终目的国(地区)</div>
          <div class="rowItem center flex18">境内货源地</div>
          <div class="rowItem center flex18">征免</div>
        </div>
        <div class="rowCtn"
          style="font-size:16px;max-height:40px;overflow:visible"
          v-for="(item,index) in returnArr(itemNo)"
          :key="index">
          <div class="rowItem center">{{item.item_no}} </div>
          <div class="rowItem center flex2">{{item.product_no}} </div>
          <div class="rowItem center flex4">{{item.product_name}}<br />{{item.style_code}}</div>
          <div class="rowItem center flex18">{{item.number}} </div>
          <div class="rowItem center">{{item.unit}} </div>
          <div class="rowItem center">{{item.unit_price}} </div>
          <div class="rowItem center flex18">{{item.total_price}} </div>
          <div class="rowItem center">{{item.currency_system}} </div>
          <div class="rowItem center flex3">{{item.origin_country}} </div>
          <div class="rowItem center flex3">{{item.destination_country}} </div>
          <div class="rowItem center flex18">{{item.goods_source}} </div>
          <div class="rowItem center flex18">{{item.exemption}} </div>
        </div>
        <template v-if=" returnArr(itemNo).length < 5">
          <div class="rowCtn"
            style="font-size:16px"
            v-for="(item,index) in 5-returnArr(itemNo).length"
            :key="'buchong-' + index">
            <div class="rowItem center"></div>
            <div class="rowItem center flex2"></div>
            <div class="rowItem center flex4"></div>
            <div class="rowItem center flex18"></div>
            <div class="rowItem center"></div>
            <div class="rowItem center"></div>
            <div class="rowItem center flex18"></div>
            <div class="rowItem center"></div>
            <div class="rowItem center flex3"></div>
            <div class="rowItem center flex3"></div>
            <div class="rowItem center flex18"></div>
            <div class="rowItem center flex18"></div>
          </div>
        </template>
        <div class="rowCtn">
          <div class="rowItem noBorder left flex3">特殊关系确认：{{saveInfo.special_relationship}}</div>
          <div class="rowItem noBorder left flex3">价格影响确认：{{saveInfo.price_impact}} </div>
          <div class="rowItem noBorder left flex4">支付特许权使用费确认：{{saveInfo.payment_concession}} </div>
          <div class="rowItem noBorder left flex2">自报自缴：{{saveInfo.report_pay}} </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem col"
            style="flex:16.6">
            <div class="rowCtn noBorder">
              <div class="rowItem noBorder columnModule">
                报关人员
                <br />
                {{saveInfo.customs_broker}}
              </div>
              <div class="rowItem noBorder columnModule">
                报关人员证号
                <br />
                {{saveInfo.customs_broker_number}}
              </div>
              <div class="rowItem noBorder columnModule">
                电话
                <br />
                {{saveInfo.phone}}
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem noBorder columnModule">
                申报单位
                <br />
                {{saveInfo.reporting_unit}}
              </div>
              <div class="rowItem noBorder columnModule signatureBox">
                申报单位(签章)
                <img :src="signature"
                  style="top:30%"
                  v-if="signature"
                  class="signature" />
              </div>
              <div class="rowItem noBorder"
                style="font-size:14px;align-items:flex-end;">
                兹申明对以上内容承担如实申报、依法纳税责任
              </div>
            </div>
          </div>
          <div class="rowItem columnModule"
            style="flex:6.3">
            海关批注及签章
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documentsTable, documentSetting } from '@/assets/js/api.js'
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
      saveInfo: { // 偷懒按照接口文档数据格式来 到时候直接提交这个数据
        pre_entry: '', // 预录入编号
        customs: '', // 海关编号
        sender: '', // 境内发货人
        exit_customs: '', // 出镜关别
        export_date: '', // 出口日期
        filing_date: '', // 申报日期
        case: '', // 备案号
        overseas_consignee: '', // 境外收货人
        transport: '', // 运输方式
        transport_voyage: '', // 运输工具名称及航次号
        waybill: '', // 提运单号
        production_sales_unit: '', // 生产销售单位
        supervision_method: '', // 监管方式
        nature_exemption: '', // 免征性质
        license: '', // 许可证
        contract_agreement: '', // 合同协议号
        trading_country: '', // 贸易国
        arrival_country: '', // 运抵国
        refers_port: '', // 指运港
        departure_port: '', // 离境口岸
        packaging: '', // 包装种类
        pieces: '', // 件数
        gwkgs: '', // 毛重(kg)
        nwkgs: '', // 净重(kg)
        transaction_method: '', // 成交方式
        shipping: '', // 运费
        premium: '', // 保费
        miscellaneous: '', // 杂费
        documents: '', // 随附单证及编号
        marks_remarks: '', // 标记唛码和备注
        special_relationship: '', // 特殊关系确认
        price_impact: '', // 价格影响确认
        payment_concession: '', // 支付特许使用费
        report_pay: '', // 自报自缴
        customs_broker: '', // 报关人员
        customs_broker_number: '', // 报关人员证号
        phone: '', // 电话
        reporting_unit: '', // 申报单位
        custom_declaration_orders: [ // 货物信息
          {
            item_no: '', // 项号
            product_no: '', // 商品编号
            product_name: '', // 商品名称及规格号
            number: '', // 数量
            unit: '', // 单位
            unit_price: '', // 单价
            total_price: '', // 总价
            currency_system: '', // 币制
            origin_country: '', // 原产国
            destination_country: '', // 最终目的国
            goods_source: '', // 货源地
            exemption: ''// 证免
          }
        ]
      },
      signature: '',
      customs: ''
    }
  },
  created () {
    if (this.isHasDetail) {
      Promise.all([
        documentSetting.companyDetail(),
        this.isHasDetail && documentsTable.EDDetail({
          document_id: this.$route.params.id
        })
      ]).then(res => {
        // this.signature = res[0].data.data.signature
        this.signature = res[0].data.data.special_seal
        // this.customs = res[0].data.data.special_seal
        if (this.isHasDetail) {
          this.saveInfo = res[1].data.data
        }
      })
    }
  },
  methods: {
    returnArr (item) {
      return this.saveInfo.custom_declaration_orders.slice((item - 1) * 5, item * 5)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/ED.less";
</style>
