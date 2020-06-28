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
                        :filter-method="searchClient"
                        placeholder="筛选公司">
                        <el-option v-for="item in clientArrReal"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
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
              <span class="text">{{item.type|filterType}}</span>
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
      clientArrReal: [],
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
  filters: {
    filterType (type) {
      return type.map((item) => companyType.find((itemFind) => itemFind.value === Number(item)).name).join('/')
    }
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    searchClient (query) {
      this.clientArrReal = []
      if (query) {
        // 判断一个字符串是否包含某几个字符,所有的indexOf!==-1 且字符是从左往右的,也就是从小到大的
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          this.clientArrReal = this.companyArr.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        } else {
          const queryArr = query.split('')
          this.companyArr.forEach((item) => {
            let flag = true
            let indexPinyin = 0
            queryArr.forEach((itemQuery) => {
              indexPinyin = item.name_pinyin.substr(indexPinyin, item.name_pinyin.length).indexOf(itemQuery)
              if (indexPinyin === -1) {
                flag = false
                // 可以通过throw new Error('')终止循环,如果需要优化的话
              }
            })
            if (flag) {
              this.clientArrReal.push(item)
            }
          })
        }
      } else {
        this.clientArrReal = this.$clone(this.companyArr)
      }
    },
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
          YJS: data.settle_price / 10000, // 已结算
          DJS: data.wait_settle_price / 10000, // 待结算
          YKK: data.deduct_price / 10000 // 已扣款
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
      this.pages = Number(params.page)
      this.company_id = params.company_id
      this.company_type = params.company_type ? Number(params.company_type) : ''
      this.searchCompanyFlag = Boolean(params.company_id)
      this.searcTypeFlag = Boolean(params.company_type)
    }
  },
  created () {
    this.getFilters()
    this.getList()
    this.getStatistics()
    client.list().then((res) => {
      this.companyArr = res.data.data
      this.companyArr.forEach((item) => {
        item.name_pinyin = item.name_pinyin.join('')
      })
      this.clientArrReal = this.$clone(this.companyArr)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/clientStatistics.less";
</style>
