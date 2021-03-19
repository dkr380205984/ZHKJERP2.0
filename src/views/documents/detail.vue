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
            <span class="info">{{detailInfo.po_number}}</span>
          </div>
          <div class="colCtn">
            <span class="label">Invoice Number:</span>
            <span class="info">{{detailInfo.invoice_number}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Order Date:</span>
            <span class="info">{{detailInfo.order_date}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Ex-factory Date:</span>
            <span class="info">{{detailInfo.exFactory_date}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Shipment Date:</span>
            <span class="info">{{detailInfo.shipment_date}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">From: </span>
            <span class="info">{{detailInfo.from}}</span>
          </div>
          <div class="colCtn">
            <span class="label">To:</span>
            <span class="info">{{detailInfo.to}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Loading Port: </span>
            <span class="info">{{detailInfo.loading_port}}</span>
          </div>
          <div class="colCtn">
            <span class="label">Destination Port:</span>
            <span class="info">{{detailInfo.destination_port}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Payment Term:</span>
            <span class="info">{{detailInfo.payment_term}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Company Name:</span>
            <span class="info">{{detailInfo.company_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">Company Address: </span>
            <span class="info">{{detailInfo.company_address}}</span>
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
          <div class="orderCtn">
            <span class="num">1</span>
            <span class="code">1659412</span>
            <span class="client">杭州织慧科技</span>
            <span class="number">3000条</span>
          </div>
          <div class="orderCtn">
            <span class="num">99</span>
            <span class="code">1659412</span>
            <span class="client">杭州织慧科技</span>
            <span class="number">3000条</span>
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
            @click="$openUrl(`${activeType.printUrl}/${$route.params.id}`)">打印</div>
          <div class="btn btnOrange"
            @click="$router.push(`${activeType.editUrl}/${$route.params.id}`)">编辑</div>
        </div>
      </div>
      <div class="detailCtn">
        <template v-if="activeType.id === 1">
          <CIPrint style="display:flex;justify-content:center" />
        </template>
        <template v-if="activeType.id === 2">
          <PLPrint style="display:flex;justify-content:center" />
        </template>
        <template v-if="activeType.id === 3">
          <EDPrint style="display:flex;justify-content:center" />
        </template>
        <template v-if="activeType.id === 5">
          <ETPrint style="display:flex;justify-content:center" />
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
import ETPrint from '@/views/documents/ET/print.vue'
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
          editUrl: '/document/edit/CI'
        },
        {
          id: 2,
          CNName: '装箱单',
          USName: 'Packing list',
          printUrl: '/document/print/PL',
          editUrl: '/document/edit/PL'
        },
        {
          id: 3,
          CNName: '出口货物报关单',
          USName: 'Export declaration',
          printUrl: '/document/print/ED',
          editUrl: '/document/edit/ED'
        },
        {
          id: 4,
          CNName: '申报要素',
          USName: 'Declare elements',
          printUrl: '/document/print/DE',
          editUrl: '/document/edit/DE'
        },
        {
          id: 5,
          CNName: '货运委托书',
          USName: 'Entrusting transport',
          printUrl: '/document/print/ET',
          editUrl: '/document/edit/ET'
        }
      ],
      activeType: {}
    }
  },
  methods: {

  },
  created () {
    this.activeType = this.types[0]
  },
  components: {
    CIPrint,
    PLPrint,
    EDPrint,
    ETPrint
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/detail.less";
</style>
