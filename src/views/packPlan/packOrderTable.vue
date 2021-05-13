<template>
  <div class='printHtml'
    id='packOrderTable'>
    <div class="printTable"
      v-if="$route.params.type === '1'">
      <div class="print_head">
        <div class="left">
          <span class="title">{{title}}{{orderInfo.inside_order_code ? '-' + orderInfo.inside_order_code : ''}}</span>
          <span class="item">
            <span class="label">创建人：</span>
            {{user_name}}
          </span>
          <span class="item">
            <span class="label">联系电话：</span>
          </span>
          <span class="item">
            <span class="label">创建时间：</span>
            {{$getTime()}}
          </span>
        </div>
        <div class="right">
          <span class="text">扫一扫<br />查看电子文档</span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="二维码">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">订单号</span>
          <span class="row_item left">{{orderInfo.order_code}}</span>
          <span class="row_item center w180">订单公司</span>
          <span class="row_item left">{{ isHideClient !== 1 ? orderInfo.client_name : ''}}</span>
        </div>
        <div class="print_row">
          <span class="row_item center w180">订购单位</span>
          <span class="row_item left">{{printInfo.clientName}}</span>
          <span class="row_item center w180">交货日期</span>
          <span class="row_item left">{{printInfo.time}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">总价</span>
          <span class="row_item left">{{$toFixed(total_price)}}元</span>
          <span class="row_item center w180">创建人</span>
          <span class="row_item left">{{user_name}}</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item left">包装辅料</span>
          <span class="row_item left">规格</span>
          <span class="row_item left">属性</span>
          <span class="row_item left">订购数量</span>
          <span class="row_item left">单价</span>
          <span class="row_item left">总价</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in packOrderInfo"
          :key='index'>
          <span class="row_item left">{{item.material_name}}</span>
          <span class="row_item left">{{JSON.parse(item.size).filter(item=>item).join('*') || item.pack_size}}cm</span>
          <span class="row_item left">{{item.attribute}}</span>
          <span class="row_item left">{{item.number}}{{item.unit || '个'}}</span>
          <span class="row_item left">{{item.price}}{{'元/' + (item.unit || '个') }}</span>
          <span class="row_item left">{{item.total_price}}元</span>
        </div>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <span class="row_item center w180">备注</span>
          <span class="row_item left remark_span"
            v-html="remark"></span>
        </div>
      </div>
    </div>
    <div class="printTable crosswise"
      v-for="(itemPage,indexPage) in packOrderInfoCom"
      :key="indexPage">
      <div class="print_head">
        <div class="top">
          <span class="title">{{title}}{{orderInfo.inside_order_code ? '-' + orderInfo.inside_order_code : ''}}</span>
        </div>
      </div>
      <div class="print_body"
        style="display:flex;flex-direction:column">
        <div class="print_row">
          <div class="row_item center w180">订购单位</div>
          <div class="row_item center">{{printInfo.clientName}}</div>
          <div class="row_item center w180">交货日期</div>
          <div class="row_item center">{{printInfo.time}}</div>
          <div class="row_item center w180">订购编号</div>
          <div class="row_item center"></div>
        </div>
        <div class="print_row">
          <div class="row_item center flex02">序号</div>
          <div class="row_item center flex2">包装辅料名称</div>
          <div class="row_item center">规格</div>
          <div class="row_item center">属性</div>
          <div class="row_item center">订购数量</div>
          <div class="row_item center">单价</div>
          <div class="row_item center">总价</div>
        </div>
        <div class="print_row"
          v-for="(item,index) in itemPage"
          :key='index'>
          <div class="row_item center flex02">{{index+1}}</div>
          <div class="row_item center flex2">{{item.material_name}}</div>
          <div class="row_item center">{{JSON.parse(item.size).filter(item=>item).join('*') || item.pack_size}}cm</div>
          <div class="row_item center">{{item.attribute}}</div>
          <div class="row_item center">{{item.number}}{{item.unit || '个'}}</div>
          <div class="row_item center">{{item.price}}{{'元/' + (item.unit || '个') }}</div>
          <div class="row_item center">{{item.total_price}}元</div>
        </div>
        <template v-if="itemPage.length < 6">
          <div class="print_row"
            v-for="item in 6 - itemPage.length"
            :key="item">
            <div class="row_item center flex02"></div>
            <div class="row_item center flex2"></div>
            <div class="row_item center"></div>
            <div class="row_item center"></div>
            <div class="row_item center"></div>
            <div class="row_item center"></div>
            <div class="row_item center"></div>
          </div>
        </template>
        <div class="print_row"
          style="flex:1">
          <div class="row_item center w180">备注</div>
          <div class="row_item center"
            style="flex:2.05"></div>
          <div class="row_item"
            style="flex:4">
            <div class="print_row noBorder">
              <div class="row_item center">合计</div>
              <div class="row_item center">{{totalInfoCom.number}}</div>
              <div class="row_item center">{{$toFixed(totalInfoCom.total_price / totalInfoCom.number)}}</div>
              <div class="row_item center">{{totalInfoCom.total_price}}</div>
            </div>
          </div>
        </div>
        <div class="print_row"
          style="border-bottom:0">
          <div class="row_item center w180">页码</div>
          <div class="row_item center">{{indexPage+1}}/{{packOrderInfoCom.length}}</div>
          <div class="row_item center w180">打印人/时间</div>
          <div class="row_item center">{{user_name}}/{{$getTime()}}</div>
          <div class="row_item center w180">负责人签字</div>
          <div class="row_item center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, packPlan, print } from '@/assets/js/api.js'
export default {
  data () {
    return {
      qrCodeUrl: '',
      orderInfo: {},
      packOrderInfo: [],
      total_price: '',
      printInfo: {},
      user_name: window.sessionStorage.getItem('user_name'),
      title: '',
      remark: '',
      isHideClient: false
    }
  },
  computed: {
    packOrderInfoCom () {
      if (this.$route.params.type === '1') {
        return this.packOrderInfo
      } else if (this.$route.params.type === '2') {
        return this.$newSplice(this.$clone(this.packOrderInfo), 6)
      } else {
        return []
      }
    },
    totalInfoCom () {
      return {
        number: this.packOrderInfo.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0),
        total_price: this.packOrderInfo.map(itemM => +itemM.total_price || 0).reduce((total, current) => total + current, 0)
      }
    }
  },
  created () {
    this.printInfo = this.$route.query
    Promise.all([
      order.detail({
        id: this.$route.params.id
      }),
      packPlan.packOrderLog({
        order_id: this.$route.params.id,
        order_type: 1
      }),
      print.detail({
        type: 9
      })
    ]).then(res => {
      this.orderInfo = res[0].data.data
      this.packOrderInfo = res[1].data.data.filter(item => ((item.client_id.toString() === this.printInfo.clientId) && (this.$getTime(item.deliver_time) === this.$getTime(this.printInfo.time))))
      this.printInfo.clientName = this.packOrderInfo[0].client_name
      this.total_price = (this.packOrderInfo.map(item => Number(item.total_price)).length > 0) ? (this.packOrderInfo.map(item => Number(item.total_price)).reduce((a, b) => a + b)) : 0
      this.title = res[2].data.data ? res[2].data.data.title : (window.sessionStorage.getItem('full_name') + '包装辅料订购单')
      this.remark = res[2].data.data ? res[2].data.data.desc : ''
      this.isHideClient = res[2].data.data && res[2].data.data.hide_order_client
      setTimeout(() => {
        window.print()
      }, 1000)
    })
  },
  mounted () {
    if (this.$route.params.type === '1') {
      const QRCode = require('qrcode')
      QRCode.toDataURL(window.location.origin + '/packPlan/packOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          this.qrCodeUrl = url
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packOrderTable.less";
</style>
