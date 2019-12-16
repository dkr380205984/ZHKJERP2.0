<template>
  <div id="weavingDetail"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data="orderInfo.batch_info"></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':orderInfo.desc}">{{orderInfo.desc?orderInfo.desc:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, materialPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      orderInfo: {
        order_code: '',
        client_name: '',
        user_name: '',
        group_name: '',
        order_time: '',
        order_batch: [],
        desc: ''
      }
    }
  },
  mounted () {
    Promise.all([order.detail({
      id: this.$route.params.id
    }), materialPlan.init({
      order_id: this.$route.params.id,
      order_type: 1
    })]).then((res) => {
      this.orderInfo = res[0].data.data
      console.log(res)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/weavingDetail.less";
</style>
