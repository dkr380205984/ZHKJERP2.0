<template>
  <div id='ET'
    class='document'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{companyName}}货运委托书</div>
        </div>
      </div>
      <div class="bodyCtn pageBreakInside">
        <div class="rowCtn">
          <div class="rowItem col noBorder flex15">
            <div class="rowCtn noBorder">
              <div class="rowItem left"> 委托书单号：{{saveInfo.order_no}} </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">添加日期：{{$getTime(saveInfo.created_at)}} </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">打印日期：{{printDate}}</div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">打印人：{{printUser}} </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem">联系人：{{saveInfo.contact_person}} </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">电话：{{saveInfo.phone}} </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">邮箱：{{saveInfo.email}} </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">传真：{{saveInfo.fax}} </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop">
        <div class="rowCtn pageBreakInside">
          <div class="rowItem center">SHIPPER<br />(发货人)</div>
          <div class="rowItem center flex2">{{saveInfo.shipper}} </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">运输方式</div>
              <div class="rowItem center">{{saveInfo.transport}} </div>
              <div class="rowItem center">价格条款</div>
              <div class="rowItem center">{{saveInfo.pricing_term}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">发票号码</div>
              <div class="rowItem center"
                style="flex:3.03">{{saveInfo.invoice_number}} </div>
            </div>
          </div>
        </div>
        <div class="rowCtn pageBreakInside">
          <div class="rowItem center">CONSIGNEE<br />(收货人)</div>
          <div class="rowItem center flex2">{{saveInfo.consignee}} </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">合同号码</div>
              <div class="rowItem center"
                style="flex:3.03">{{saveInfo.contract_number}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">开证日期</div>
              <div class="rowItem center">{{saveInfo.issuing_date}} </div>
              <div class="rowItem center">信用证号</div>
              <div class="rowItem center">{{saveInfo.credit_number}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">金额USD</div>
              <div class="rowItem center">{{saveInfo.amount_usd}} </div>
              <div class="rowItem center">收汇方式</div>
              <div class="rowItem center">{{saveInfo.receiving_method}} </div>
            </div>
          </div>
        </div>
        <div class="rowCtn pageBreakInside">
          <div class="rowItem center">NOTIFY<br />PARTY<br />(通知人)</div>
          <div class="rowItem center flex2">{{saveInfo.notify_party}} </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">贸易性质</div>
              <div class="rowItem center">{{saveInfo.nature_trade}} </div>
              <div class="rowItem center">贸易国别</div>
              <div class="rowItem center">{{saveInfo.trading_country}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">出口口岸</div>
              <div class="rowItem center">{{saveInfo.export_ports}} </div>
              <div class="rowItem center">目的地港口</div>
              <div class="rowItem center">{{saveInfo.destination_port}}</div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">转运</div>
              <div class="rowItem center">{{saveInfo.transport_method}} </div>
              <div class="rowItem center">分批</div>
              <div class="rowItem center">{{saveInfo.batch}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">装运期限</div>
              <div class="rowItem center">{{saveInfo.shipment_term}} </div>
              <div class="rowItem center">有效期限</div>
              <div class="rowItem center">{{saveInfo.validity_period}} </div>
            </div>
          </div>
        </div>
        <div class="rowCtn pageBreakInside">
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
        <div class="rowCtn pageBreakInside"
          v-for="(itemPack,indexPack) in saveInfo.freight_orders"
          :key="indexPack">
          <div class="rowItem center">{{itemPack.trademark}} </div>
          <div class="rowItem center"
            style="flex:0.99">{{itemPack.specification}} </div>
          <div class="rowItem center"
            style="flex:0.99">{{itemPack.hs_code}} </div>
          <div class="rowItem center"
            style="flex:0.99">{{itemPack.number_package}} </div>
          <div class="rowItem center"
            style="flex:0.99">{{itemPack.gwkgs}} </div>
          <div class="rowItem center"
            style="flex:0.98">{{itemPack.nwkgs}} </div>
          <div class="rowItem center"
            style="flex:0.99">{{itemPack.volume}} </div>
        </div>
        <div class="rowCtn pageBreakInside">
          <div class="rowItem"
            style="flex:3.04;">
            <span style="flex:1;padding-right:36px;text-align:right">TOTAL:</span>
          </div>
          <div class="rowItem center">{{totalCom.number_package}} </div>
          <div class="rowItem center">{{totalCom.gwkgs}} </div>
          <div class="rowItem center"
            style="flex:0.99">{{totalCom.nwkgs}} </div>
          <div class="rowItem center">{{totalCom.volume}} </div>
        </div>
        <div class="rowCtn pageBreakInside">
          <div class="rowItem center">订仓说明</div>
          <div class="rowItem center flex3">{{saveInfo.remarks}} </div>
          <div class="rowItem center flex3 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">总托盘数(PLTS)</div>
              <div class="rowItem center flex2">{{saveInfo.plts}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">船名航次</div>
              <div class="rowItem center flex2">{{saveInfo.voyage}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">提单号</div>
              <div class="rowItem center flex2">{{saveInfo.bill_order_no}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">海运费</div>
              <div class="rowItem center flex2">{{saveInfo.maritime_number}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">包干费</div>
              <div class="rowItem center flex2">{{saveInfo.lump_sum_fee}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">运费</div>
              <div class="rowItem center flex2">{{saveInfo.shipping}} </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">其它费用</div>
              <div class="rowItem center flex2">{{saveInfo.other_fee}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documentsTable } from '@/assets/js/api.js'
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
      printDate: this.$getTime(),
      printUser: window.sessionStorage.getItem('user_name'),
      companyName: window.sessionStorage.getItem('full_name'),
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
        nature_trade: '', // 贸易性质
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
      }
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
    if (this.isHasDetail) {
      documentsTable.ETDetail({
        document_id: this.$route.params.id
      }).then(res => {
        if (res.data.data.status !== false) {
          this.saveInfo = res.data.data
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/ET.less";
</style>
