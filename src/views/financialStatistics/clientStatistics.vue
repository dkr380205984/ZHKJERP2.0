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
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">待结算</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(clientStatistics.DJS)}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">已扣款</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(clientStatistics.YKK)}}</span>
            <span class="em">元</span>
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
              <span class="text">
                <span class="text">
                  <span class="text"
                    v-show="!searcTypeFlag">公司类型
                    <i class="el-icon-search iconBtn"
                      @click="searcTypeFlag=true"></i>
                  </span>
                  <transition name="el-zoom-in-top">
                    <div v-show="searcTypeFlag"
                      class="filterBox">
                      <el-select v-model="company_type"
                        @change="changeRouter(1)"
                        clearable
                        filterable
                        placeholder="筛选公司类型">
                        <el-option v-for="(item,index) in companyTypeArr"
                          :key="index"
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </transition>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text">
                  <span class="text"
                    v-show="!searchCompanyFlag">公司名称
                    <i class="el-icon-search iconBtn"
                      @click="searchCompanyFlag=true"></i>
                  </span>
                  <transition name="el-zoom-in-top">
                    <div v-show="searchCompanyFlag"
                      class="filterBox">
                      <el-select v-model="company_id"
                        @change="changeRouter(1)"
                        clearable
                        filterable
                        placeholder="筛选公司">
                        <el-option v-for="(item,index) in companyArr"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </transition>
                </span>
              </span>
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
              <span class="text">{{item.type|filterTypes}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.name}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.settle_price}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.wait_settle_price}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.deduct_price}}</span>
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
import { statistics, client } from '@/assets/js/api.js'
import { companyType } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      loadingTop: true,
      searchCompanyFlag: false,
      companyArr: [],
      company_id: '',
      searcTypeFlag: false,
      company_type: '',
      companyTypeArr: companyType,
      pages: 1,
      total: 0,
      list: [],
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
      this.$router.push('/financialStatistics/clientStatistics/page=' + pages + '&&keyword=' + this.keyword + '&&company_id=' + this.company_id + '&&company_type=' + this.company_type)
    },
    reset () {
      this.$router.push('/financialStatistics/clientStatistics/page=1&&keyword=&&company_id=&&company_type=')
    },
    getStatistics () {
      statistics.clientStatistics().then((res) => {
        let data = res.data
        this.clientStatistics = {
          YJS: data.settle_price, // 已结算
          DJS: data.wait_settle_price, // 待结算
          YKK: data.deduct_price // 已扣款
        }
        this.loadingTop = false
      })
    },
    getList () {
      this.loading = true
      statistics.clientList({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        client_id: this.company_id,
        client_type: this.company_type
      }).then((res) => {
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.company_id = params.company_id
      this.company_type = params.company_type ? Number(params.company_type) : ''
      this.searchCompanyFlag = Boolean(params.company_id)
      this.searcTypeFlag = Boolean(params.company_type)
    }
  },
  mounted () {
    this.getFilters()
    this.getList()
    this.getStatistics()
    client.list().then((res) => {
      this.companyArr = res.data.data
    })
  },
  filters: {
    filterTypes (item) {
      return item.map(val => {
        let flag = companyType.find(valItem => valItem.value === val)
        return flag ? flag.name : ''
      }).join(',')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/clientStatistics.less";
</style>
