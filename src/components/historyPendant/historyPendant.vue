<template>
  <div id="historyPendant"
    :class="{'showAll':showFlag}">
    <div class="container">
      <div class="title"
        @click="showFlag=!showFlag"> {{showFlag?'收起列表':'浏览记录'}}</div>
      <div class="hideInfo">
        <div class="once first">
          <span class="orderCode"
            style="color:rgba(0,0,0,0.85);">订单号</span>
          <span class="company"
            style="color:rgba(0,0,0,0.85);">公司名称</span>
        </div>
        <div class="once"
          v-for="(item,index) in list"
          :key="item.id">
          <!-- 点击按钮会触发回调，不同的页面可以对回调函数做不同处理 -->
          <span class="orderCode"
            @click="openUrl(prefix + '/' + item.id)">{{item.order_code}}</span>
          <span class="company">{{item.client_name}}</span>
          <span class="opr"
            @click="deleteHistory(index)">×</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './historyPendant.less'
export default {
  props: ['prefix'],
  data () {
    return {
      showFlag: false,
      list: JSON.parse(window.localStorage.getItem('orderHistory')) || []
    }
  },
  methods: {
    deleteHistory (index) {
      this.list.splice(index, 1)
      window.localStorage.setItem('orderHistory', JSON.stringify(this.list))
    },
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>
