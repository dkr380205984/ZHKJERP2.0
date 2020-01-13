<template>
  <div id='orderList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入编号按回车键查询">
            </el-input>
            <el-date-picker v-model="date"
              style="width:290px"
              class="inputs"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeRouter(1)">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
            <div class="btn btnWhiteBlue">批量操作</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">订单号</span>
            </div>
            <div class="col flex12">
              <span class="text">外贸公司</span>
            </div>
            <div class="col middle">
              <span class="text">产品图片</span>
            </div>
            <div class="col flex08">
              <span class="text">订单数量(件)</span>
            </div>
            <div class="col flex08">
              <span class="text">负责小组</span>
            </div>
            <div class="col flex12">
              <span class="text">流程进度</span>
            </div>
            <div class="col">
              <span class="text">下单时间</span>
            </div>
            <div class="col middle flex08">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle">
              <zh-img-list :list="itemOrder.image"></zh-img-list>
            </div>
            <div class="col flex08">
              {{itemOrder.number}}
            </div>
            <div class="col flex08">
              {{itemOrder.group_name}}
            </div>
            <div class="col flex12">
              <div class="stateCtn rowFlex"
                :class="itemOrder.product_push_progress < 100 ? 'orange' : 'green'">
                <div class="state"></div>
                <span class="name">{{itemOrder.product_push_progress}}%</span>
              </div>
            </div>
            <div class="col">
              {{itemOrder.order_time}}
            </div>
            <div class="col middle flex08">
              <span class="opr"
                @click="$router.push('/packPlan/packStock/' + itemOrder.id + '/1' )">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0
    }
  },
  methods: {
    getOrderList () {
      this.loading = true
      order.list({
        limit: 10,
        page: this.pages
      }).then(res => {
        this.list = res.data.data.map(item => {
          return {
            id: item.id,
            order_code: item.order_code,
            client_name: item.client_name,
            image: this.$mergeData(item.product_info, { mainRule: 'product_code', otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] }).map(item => item.image).reduce((total, item) => {
              return total.concat(item)
            }),
            number: item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
              return Number(total) + Number(itemNum)
            }),
            group_name: item.group_name,
            order_time: item.order_time,
            product_push_progress: item.product_push_progress
          }
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderList.less";
</style>
