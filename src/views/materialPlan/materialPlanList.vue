<template>
  <div id="materialPlanList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              placeholder="请输入订单号查询"></el-input>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">外贸公司</span>
            </div>
            <div class="col">
              <span class="text">产品图片</span>
            </div>
            <div class="col">
              <span class="text">订单数量</span>
            </div>
            <div class="col">
              <span class="text">负责小组</span>
            </div>
            <div class="col">
              <span class="text">物料计划</span>
            </div>
            <div class="col">
              <span class="text">创建时间</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { client, group, order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      keyword: '',
      date: '',
      list: [],
      clientArr: '',
      client: '',
      groupArr: '',
      group: '',
      total: 1,
      page: 1
    }
  },
  methods: {
    getList () {
      this.loading = true
      order.list({
        'company_id': window.sessionStorage.getItem('company_id'),
        'limit': 10,
        'page': this.pages,
        'has_plan': '',
        'category_id': '',
        'type_id': '',
        'style_id': '',
        'client_id': this.client,
        'group_id': this.group,
        'order_code': this.keyword,
        'product_code': '',
        'start_time': '',
        'end_time': '',
        'type': 1,
        'status': 0
      }).then((res) => {
        console.log(res)
        this.list = res.data.data
        this.loading = false
      })
    }
  },
  created () {
    this.getList()
    Promise.all([client.list(), group.list()]).then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/materialPlan/materialPlanList.less";
</style>
