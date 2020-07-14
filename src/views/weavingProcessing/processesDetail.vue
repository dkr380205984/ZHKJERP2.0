<template>
  <div id="processesDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="$winReload"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code || orderInfo.title}}</span>
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
            <span class="text">{{orderInfo.order_time}}
              <order-warning :progress="orderInfo.time_progress"></order-warning>
            </span>
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">工序分配</span>
      </div>
    </div>
  </div>
</template>

<script>
import { order, sampleOrder, materialPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
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
    let api = this.$route.params.orderType === '1' ? order : sampleOrder
    Promise.all([
      api.detail({
        id: this.$route.params.id
      }),
      materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      })
    ]).then((res) => {
      this.orderInfo = res[0].data.data
      // 没有物料计划单就拿批次信息里的产品计划值
      let productInfo = []
      if (this.orderInfo.has_plan === 0) {
        this.orderInfo.batch_info.forEach((item) => {
          item.product_info.forEach((itemPro) => {
            let finded = productInfo.find((itemFind) => {
              return itemFind.size_id === itemPro.size_id && itemFind.color_id === itemPro.color_id && itemFind.product_id === itemPro.product_id
            })
            if (!finded) {
              productInfo.push({
                color_name: itemPro.color_name,
                color_id: itemPro.color_id,
                size_name: itemPro.size_name,
                size_id: itemPro.size_id,
                product_id: itemPro.product_id,
                production_number: parseInt(itemPro.numbers),
                category_name: itemPro.category_info.category_name,
                style_name: itemPro.category_info.style_name,
                type_name: itemPro.category_info.type_name,
                unit: itemPro.category_info.unit,
                product_code: itemPro.product_code
              })
            } else {
              finded.production_number += parseInt(itemPro.numbers)
            }
          })
        })
      } else {
        res[1].data.data.product_info.forEach((item) => {
          let finded = productInfo.find((itemFind) => {
            return itemFind.size_id === item.size_id && itemFind.color_id === item.color_id && itemFind.product_id === item.product_id
          })
          if (finded) {
            finded.production_number += Number(item.production_number)
          } else {
            productInfo.push(item)
          }
        })
      }
      console.log(productInfo)
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/processesDetail.less";
</style>
<style lang="less">
#processesDetail {
  .popup {
    .el-timeline-item {
      padding-bottom: 0px;
      margin-bottom: -9px;
    }
    .el-collapse-item__header {
      min-height: 46px;
      height: 46px;
    }
    .el-timeline-item__tail {
      margin-top: 14px;
    }
    .el-timeline-item__node--normal {
      margin-top: 14px;
    }
    .collapseBox {
      display: flex;
      margin: 12px;
      .info {
        flex: 1;
      }
    }
  }
}
</style>
