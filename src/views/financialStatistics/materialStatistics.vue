<template>
  <div class="indexMain"
    id="materialStatistics">
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入物料按回车键查询"></el-input>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">公司类型</span>
            </div>
            <div class="col">
              <span class="text">订单公司</span>
            </div>
            <div class="col">
              <span class="text">已结算</span>
            </div>
            <div class="col">
              <span class="text">平均价格</span>
            </div>
            <div class="col">
              <span class="text">合计价格</span>
            </div>
            <div class="col">
              <span class="text">库存剩余</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      date: '',
      keyword: '',
      pages: 1,
      total: 0,
      list: []
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/financialStatistics/materialStatistics/page=' + pages + '&&keyword=' + this.keyword)
    },
    reset () {
      this.$router.push('/financialStatistics/materialStatistics/page=1&&keyword=')
    },
    getList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
    }
  },
  mounted () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/materialStatistics.less";
</style>
