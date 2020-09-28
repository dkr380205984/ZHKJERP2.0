<template>
  <div id="xpList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <span class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入编号按回车键查询">
              </el-input>
            </span>
          </div>
          <div class="leftCtn">
            <div class="btn btnBlue"
              @click="$router.push('/xpManage/xpCreate')">新增芯片</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">芯片编号</span>
            </div>
            <div class="col">
              <span class="text">绑定状态</span>
            </div>
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">产品编号</span>
            </div>
            <div class="col">
              <span class="text">尺码配色</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.chip_id}}</div>
            <div class="col"
              :style="{'color':item.order_code?'#01B48C':'#ccc'}">{{item.order_code?'已绑定':'未绑定'}}</div>
            <div class="col">{{item.order_code?item.order_code:'/'}}</div>
            <div class="col">{{item.order_code?item.product_code:'/'}}</div>
            <div class="col">{{item.order_code?item.size_name+'/'+item.color_name:'/'}}</div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { xpManage } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      keyword: '',
      page: 1,
      total: 1,
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
    getList () {
      this.loading = true
      xpManage.list({
        keyword: this.keyword,
        limit: 10,
        page: this.page
      }).then((res) => {
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/xpManage/xpList/page=' + pages + '&&keyword=' + this.keyword)
    },
    reset () {
      this.$router.push('/xpManage/xpList/page=1&&keyword=')
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/xpManage/xpList.less";
</style>
