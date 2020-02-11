<template>
  <div class="indexMain"
    id="clientStatistics">
    <div class="module"
      v-loading="loadingTop">
      <div class="listHead">
        <div class="box">
          <div class="boxTop">已结算</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(clientStatistics.YJS)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">待结算</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(clientStatistics.DJS)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">已扣款</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(clientStatistics.YKK)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
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
              <span class="text">待结算</span>
            </div>
            <div class="col">
              <span class="text">已扣款</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">
              <span class="text">{{item.type}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.name}}</span>
            </div>
            <div class="col">
              <span class="text">-</span>
            </div>
            <div class="col">
              <span class="text">-</span>
            </div>
            <div class="col">
              <span class="text">-</span>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/financialStatistics/clientDetail/'+item.id+'/'+ JSON.stringify(item.type))">详情</span>
            </div>
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
import { client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      loadingTop: true,
      pages: 1,
      total: 0,
      list: [],
      type: 1,
      clientStatistics: {
        YJS: 0, // 已结算
        DJS: 0, // 待结算
        YKK: 0 // 已扣款
      }
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
      this.$router.push('/financialStatistics/clientStatistics/page=' + pages + '&&keyword=' + this.keyword)
    },
    reset () {
      this.$router.push('/financialStatistics/clientStatistics/page=1&&keyword=')
    },
    getStatistics () {

    },
    getList () {
      this.loading = true
      client.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword
      }).then((res) => {
        this.list = res.data.data
        this.loading = false
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
    }
  },
  mounted () {
    this.getFilters()
    this.getList()
    this.getStatistics()

    this.loadingTop = false
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/clientStatistics.less";
</style>
