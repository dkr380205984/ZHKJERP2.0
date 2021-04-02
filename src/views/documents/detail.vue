<template>
  <div id='documentDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Po Number: </span>
            <span class="text">{{detailInfo.po}}</span>
          </div>
          <div class="colCtn">
            <span class="label">Invoice Number:</span>
            <span class="text">{{detailInfo.invoice}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Order Date:</span>
            <span class="text">{{detailInfo.order_date}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Ex-factory Date:</span>
            <span class="text">{{detailInfo.ex_factory_date}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Shipment Date:</span>
            <span class="text">{{detailInfo.shipment_date}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">From: </span>
            <span class="text">{{detailInfo.from_address}}</span>
          </div>
          <div class="colCtn">
            <span class="label">To:</span>
            <span class="text">{{detailInfo.to_address}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Loading Port: </span>
            <span class="text">{{detailInfo.loading_port}}</span>
          </div>
          <div class="colCtn">
            <span class="label">Destination Port:</span>
            <span class="text">{{detailInfo.destination_port}}</span>
          </div>
          <div class="colCtn">
            <span class="label">Currency System:</span>
            <span class="text">{{detailInfo.currency_system}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Payment Term:</span>
            <span class="text">{{detailInfo.payment}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Company Name:</span>
            <span class="text">{{detailInfo.to_company_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Company Address: </span>
            <span class="text">{{detailInfo.to_company_address}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">包含订单</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn"
          style="flex-direction:column;margin:0">
          <div class="orderCtn"
            v-for="(itemOrder,indexOrder) in (detailInfo.orders || [])"
            :key="indexOrder">
            <span class="num">{{indexOrder+1}}</span>
            <span class="code"
              @click="$router.push(`/order/orderDetail/${itemOrder.id}`)">{{itemOrder.order_code}}</span>
            <span class="client">{{itemOrder.client && itemOrder.client.name}}</span>
            <span class="number">{{itemOrder.total_number}}条</span>
          </div>
        </div>
      </div>
    </div>
    <div class="listCutCtn">
      <div :class="`cut_item ${activeType.id === itemType.id && 'active' || ''}`"
        v-for="(itemType,indexType) in types"
        :key="indexType"
        @click="activeType = itemType">
        <span class="name"
          style="margin-bottom:16px">{{itemType.CNName}}</span>
        <span class="name">{{itemType.USName}}</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="left">
          <span class="title hasBorder">{{activeType.CNName}}</span>
        </span>
        <div class="right"
          style="display:flex">
          <div class="btn btnBlue"
            @click="activeType.status ? $openUrl(`${activeType.printUrl}/${$route.params.id}`) : $message.warning('请先添加')">打印</div>
          <div class="btn btnOrange"
            @click="$router.push(`${activeType.editUrl}/${$route.params.id}`)">编辑</div>
        </div>
      </div>
      <div class="detailCtn">
        <template v-if="activeType.id === 1">
          <CIPrint style="display:flex;justify-content:center"
            :isHasDetail='activeType.status' />
        </template>
        <template v-if="activeType.id === 2">
          <PLPrint style="display:flex;justify-content:center"
            :isHasDetail='activeType.status' />
        </template>
        <template v-if="activeType.id === 3">
          <EDPrint style="display:flex;flex-direction:column;transform-origin: top;transform: scale(0.8);align-items:center;justify-content:center"
            :isHasDetail='activeType.status' />
        </template>
        <template v-if="activeType.id === 4">
          <DEPrint style="display:flex;justify-content:center"
            :isHasDetail='activeType.status' />
        </template>
        <template v-if="activeType.id === 5">
          <ETPrint style="display:flex;justify-content:center"
            :isHasDetail='activeType.status' />
        </template>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push(`/document/index/update/${$route.params.id}`)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CIPrint from '@/views/documents/CI/print.vue'
import PLPrint from '@/views/documents/PL/print.vue'
import EDPrint from '@/views/documents/ED/print.vue'
import DEPrint from '@/views/documents/DE/print.vue'
import ETPrint from '@/views/documents/ET/print.vue'
import { documents } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: false,
      detailInfo: {

      },
      types: [
        {
          id: 1,
          CNName: '形式发票',
          USName: 'Commercial Invoice',
          printUrl: '/document/print/CI',
          editUrl: '/document/edit/CI',
          status: false
        },
        {
          id: 2,
          CNName: '装箱单',
          USName: 'Packing list',
          printUrl: '/document/print/PL',
          editUrl: '/document/edit/PL',
          status: false
        },
        {
          id: 3,
          CNName: '出口货物报关单',
          USName: 'Export declaration',
          printUrl: '/document/print/ED',
          editUrl: '/document/edit/ED',
          status: false
        },
        {
          id: 4,
          CNName: '申报要素',
          USName: 'Declare elements',
          printUrl: '/document/print/DE',
          editUrl: '/document/edit/DE',
          status: false
        },
        {
          id: 5,
          CNName: '货运委托书',
          USName: 'Entrusting transport',
          printUrl: '/document/print/ET',
          editUrl: '/document/edit/ET',
          status: false
        }
      ],
      activeType: {}
    }
  },
  methods: {
    init () {
      this.loading = true
      documents.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          this.detailInfo = res.data.data
          this.types = [
            {
              id: 1,
              CNName: '形式发票',
              USName: 'Commercial Invoice',
              printUrl: '/document/print/CI',
              editUrl: '/document/edit/CI',
              status: this.detailInfo.status_commercial_invoice !== 2
            },
            {
              id: 2,
              CNName: '装箱单',
              USName: 'Packing list',
              printUrl: '/document/print/PL',
              editUrl: '/document/edit/PL',
              status: this.detailInfo.status_packing_list !== 2
            },
            {
              id: 3,
              CNName: '出口货物报关单',
              USName: 'Export declaration',
              printUrl: '/document/print/ED',
              editUrl: '/document/edit/ED',
              status: this.detailInfo.status_export_declaration !== 2
            },
            {
              id: 4,
              CNName: '申报要素',
              USName: 'Declare elements',
              printUrl: '/document/print/DE',
              editUrl: '/document/edit/DE',
              status: this.detailInfo.status_declare_elements !== 2
            },
            {
              id: 5,
              CNName: '货运委托书',
              USName: 'Entrusting transport',
              printUrl: '/document/print/ET',
              editUrl: '/document/edit/ET',
              status: this.detailInfo.status_entrustiong_transport !== 2
            }
          ]
          if (this.$route.query.type) {
            this.activeType = this.types.find(itemF => itemF.id === +this.$route.query.type) || this.types[0]
          } else {
            this.activeType = this.types[0]
          }
          this.loading = false
        }
      })
    }
  },
  created () {
    this.init()
  },
  components: {
    CIPrint,
    PLPrint,
    EDPrint,
    DEPrint,
    ETPrint
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/detail.less";
</style>
