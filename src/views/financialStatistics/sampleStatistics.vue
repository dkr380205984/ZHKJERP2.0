<template>
  <div class="indexMain"
    id="orderStatistics">
    <div class="module"
      v-loading="loadingTop">
      <div class="listHead">
        <div class="box">
          <div class="boxTop">打样数量</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.DYSL)}}</span>
            <span class="em">万</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">确认数量</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.QRSL)}}</span>
            <span class="em">万</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">客户付费</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.KHFF)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">工厂成本</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.GCCB)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入订单号按回车键查询"></el-input>
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
              @change="changeRouter(1)"></el-date-picker>
            <div class="btn btnGray"
              @click="reset"
              style="margin-left:0">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">下单日期</span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchCompanyFlag">
                  订单公司
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
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchGroupFlag">
                  负责小组
                  <i class="el-icon-search iconBtn"
                    @click="searchGroupFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchGroupFlag"
                    class="filterBox">
                    <el-select v-model="group_id"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="小组">
                      <el-option v-for="(item,index) in groupArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">打样数量</span>
            </div>
            <div class="col">
              <span class="text">客户付费</span>
            </div>
            <div class="col">
              <span class="text">工厂成本</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.order_code}}</div>
            <div class="col">{{item.order_time}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.group_name}}</div>
            <div class="col">{{item.numbers}}</div>
            <div class="col">{{item.client_pay}}</div>
            <div class="col">{{item.company_cost}}</div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/sample/sampleDetail/' + item.id)">详情</span>
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
import { group, client, statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      loadingTop: true,
      date: '',
      keyword: '',
      pages: 1,
      total: 0,
      list: [],
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      searchCompanyFlag: false,
      searchGroupFlag: false,
      orderStatistics: {
        DYSL: '', // 打样数量
        QRSL: '', // 确认数量
        KHFF: '', // 客户付费
        GCCB: ''// 工厂成本
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
      this.$router.push('/financialStatistics/orderStatistics/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id)
    },
    reset () {
      this.$router.push('/financialStatistics/orderStatistics/page=1&&keyword=&&date=&&group_id=&&company_id=')
    },
    getList () {
      this.loading = true
      statistics.sampleList({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id,
        group_id: this.group_id
      }).then((res) => {
        this.loading = false
        this.total = res.data.meta.total
        this.list = res.data.data
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.group_id = params.group_id ? Number(params.group_id) : ''
      if (this.group_id) {
        this.searchGroupFlag = true
      }
      this.company_id = params.company_id
      if (this.company_id) {
        this.searchCompanyFlag = true
      }
    }
  },
  mounted () {
    this.getFilters()
    this.getList()
    Promise.all([group.list(), client.list(), statistics.sampleStatistics()]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = res[1].data.data.filter((item) => {
        return item.type.indexOf(1) !== -1
      })
      let orderStatistics = res[2].data.data
      this.orderStatistics = {
        DYSL: orderStatistics.order_total_number / 10000, // 打样数量
        QRSL: orderStatistics.order_total_reality / 10000, // 确认数量
        KHFF: orderStatistics.client_pay / 10000, // 客户付费
        GCCB: orderStatistics.company_cost / 10000// 工厂成本
      }
      this.loadingTop = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/orderStatistics.less";
</style>
