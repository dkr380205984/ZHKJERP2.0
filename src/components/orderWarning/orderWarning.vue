<template>
  <div id="orderWarning">
    <span class="blue"
      v-if="progress"
      @click="showPopup=true">(查看截止日期)</span>
    <span class="gray"
      v-if="!progress">(预警已关闭)</span>
    <div class="zhPopup"
      v-if="showPopup">
      <div class="main">
        <div class="title">
          <div class="text">批次信息列表</div>
          <i class="el-icon-close"
            @click="showPopup=false"></i>
        </div>
        <div class="content"
          style="width:780px;line-height:0;padding:60px 50px">
          <zh-time-process :processData="timeData"
            :startTime="progress?progress.order_time:'2020-04-10'"
            :endTime="progress?progress.end_time:'2020-04-20'"
            style="width:100%"></zh-time-process>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './orderWarning.less'
export default {
  props: {
    progress: {
      type: Object
    }
  },
  computed: {
    timeData () {
      return (this.progress
        ? [
          {
            percent: this.$toFixed(this.progress.progress_data.material_plan / 100),
            name: '物料计划'
          }, {
            percent: this.$toFixed(this.progress.progress_data.material_push / 100),
            name: '物料入库'
          }, {
            percent: this.$toFixed(this.progress.progress_data.semi_product_push / 100),
            name: '半成品入库'
          }, {
            percent: this.$toFixed(this.progress.progress_data.product_push / 100),
            name: '成品入库'
          }, {
            percent: this.$toFixed(this.progress.progress_data.product_pack / 100),
            name: '成品装箱'
          }
        ] : [
          {
            percent: 0.2,
            name: '物料计划'
          }, {
            percent: 0.2,
            name: '物料入库'
          }, {
            percent: 0.2,
            name: '半成品入库'
          }, {
            percent: 0.2,
            name: '成品入库'
          }, {
            percent: 0.2,
            name: '成品装箱'
          }
        ])
    }
  },
  data () {
    return {
      showPopup: false
    }
  }
}
</script>
