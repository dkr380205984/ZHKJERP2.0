<template>
  <div class="indexMain"
    id="orderStatistics">
    <div class="module"
      v-loading="loadingTop">
      <div class="listHead">
        <div class="box">
          <div class="boxTop">订单总额</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.DDZE)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">下单数量</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.XDSL)}}</span>
            <span class="em">万</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">出库数量</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.CKSL)}}</span>
            <span class="em">万</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">实际总值</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.SJZZ)}}</span>
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
      <div class="listHead">
        <div class="box small">
          <div class="boxTop">原料采购</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.material_order)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">原料加工</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.material_process)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">辅料采购</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.assist_material_order)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">辅料加工</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.assist_material_process)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">生产织造</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.product_weave)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">半成品加工</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.semi_product)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">包装辅料订购</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.pack_order)}}</span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box small">
          <div class="boxTop">出库运输</div>
          <div class="boxBottom">
            <span class="num">{{$toFixed(orderStatistics.company_cost_detail.stock_out)}}</span>
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
          <div class="rightCtn"
            style="color:#1a95ff;font-size:14px"
            v-if="orderStatistics.update_time!=='0000-00-00'">
            更新日期：{{orderStatistics.update_time.slice(0,16)}}
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
              <span class="text">下单数量</span>
            </div>
            <div class="col">
              <span class="text">下单总额</span>
            </div>
            <div class="col">
              <span class="text">出库数量</span>
            </div>
            <div class="col">
              <span class="text">实际总值</span>
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
            <div class="col">{{item.order_number}}</div>
            <div class="col">{{item.total_price}}</div>
            <div class="col">{{item.pack_number}}</div>
            <div class="col">{{item.reality_number}}</div>
            <div class="col">{{item.company_cost}}</div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/order/orderDetail/' + item.id)">详情</span>
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
      clientArrReal: [],
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
        DDZE: '', // 订单总额
        XDSL: '', // 下单数量
        CKSL: '', // 出库数量
        SJZZ: '', // 实际总值
        GCCB: '', // 工厂成本
        company_cost_detail: {
          material_order: '',
          material_process: '',
          assist_material_order: '',
          assist_material_process: '',
          is_search: ((this.date && this.date.length > 0) || this.keyword || this.company_id || this.group_id) ? 1 : 0,
          order_code: this.keyword,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          client_id: this.company_id,
          group_id: this.group_id,
          product_weave: '',
          semi_product: '',
          pack_order: '',
          stock_out: ''
        },
        update_time: '0000-00-00'
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
      this.$router.push('/financialStatistics/orderStatistics/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id)
    },
    reset () {
      this.$router.push('/financialStatistics/orderStatistics/page=1&&keyword=&&date=&&group_id=&&company_id=')
    },
    getList () {
      this.loading = true
      this.loadingTop = true
      statistics.orderList({
        limit: 10,
        page: this.pages,
        order_code: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id,
        group_id: this.group_id
      }).then((res) => {
        this.loading = false
        this.total = res.data.meta.total
        this.list = res.data.data
      })
      statistics.orderStatistics({
        is_search: ((this.date && this.date.length > 0) || this.keyword || this.company_id || this.group_id) ? 1 : 0,
        order_code: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id,
        group_id: this.group_id
      }).then((res) => {
        let orderStatistics = res.data.data
        this.orderStatistics = {
          DDZE: orderStatistics.order_total_price / 10000, // 订单总额
          XDSL: orderStatistics.order_total_number / 10000, // 下单数量
          CKSL: orderStatistics.order_total_pack_real / 10000, // 出库数量
          SJZZ: orderStatistics.order_total_reality / 10000, // 实际总值
          GCCB: orderStatistics.company_cost / 10000, // 工厂成本
          update_time: orderStatistics.update_time,
          company_cost_detail: {
            material_order: orderStatistics.company_cost_detail.material_order / 10000,
            material_process: orderStatistics.company_cost_detail.material_process / 10000,
            assist_material_order: orderStatistics.company_cost_detail.assist_material_order / 10000,
            assist_material_process: orderStatistics.company_cost_detail.assist_material_process / 10000,
            product_weave: orderStatistics.company_cost_detail.product_weave / 10000,
            semi_product: orderStatistics.company_cost_detail.semi_product / 10000,
            pack_order: orderStatistics.company_cost_detail.pack_order / 10000,
            stock_out: orderStatistics.company_cost_detail.stock_out / 10000
          }
        }
        this.loadingTop = false
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
    Promise.all([group.list(), client.list()]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = res[1].data.data.filter((item) => {
        return item.type.indexOf(1) !== -1
      })
      this.companyArr.forEach((item) => {
        item.name_pinyin = item.name_pinyin.join('')
      })
      this.clientArrReal = this.$clone(this.companyArr)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/orderStatistics.less";
</style>
