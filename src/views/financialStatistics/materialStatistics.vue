<template>
  <div class="indexMain"
    id="materialStatistics">
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="tabCtn">
              <span class="tab"
                :class="{'active':type===1}"
                @click="type=1">原料</span>
              <span class="tab"
                :class="{'active':type===2}"
                @click="type=2">辅料</span>
            </div>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入物料按回车键查询"></el-input>
            <div class="btn btnGray"
              @click="reset"
              style="margin-left:0">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">物料名称</span>
            </div>
            <div class="col">
              <span class="text">合计使用</span>
            </div>
            <div class="col">
              <span class="text">订购数量</span>
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
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.name}}</div>
            <div class="col">{{$toFixed(item.use_total)}}</div>
            <div class="col">{{$toFixed(item.order_total)}}</div>
            <div class="col">{{$toFixed(item.pre_price)}}</div>
            <div class="col">{{$toFixed(item.total_price)}}</div>
            <div class="col">{{$toFixed(item.stock_number)}}</div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/financialStatistics/materialDetail/' + $strToAscII(item.name) + '/' + type)">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="changeRouter"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      date: '',
      keyword: '',
      pages: 1,
      total: 0,
      list: [],
      type: 1
    }
  },
  watch: {
    type (newVal) {
      this.changeRouter()
    },
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
      this.$router.push('/financialStatistics/materialStatistics/page=' + pages + '&&keyword=' + this.keyword + '&&type=' + this.type)
    },
    reset () {
      this.$router.push('/financialStatistics/materialStatistics/page=1&&keyword=&&type=1')
    },
    getList () {
      this.loading = true
      statistics.materialList({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        type: this.type
      }).then((res) => {
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      this.type = Number(params.type)
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/materialStatistics.less";
</style>
