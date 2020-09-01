<template>
  <div class="indexMain"
    id="orderStatistics">
    <div class="listCutCtn">
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">订单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/sampleStatistics/page=1&&keyword=&&date=&&group_id=&&company_id=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">样单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/productStatistics/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&XDZS=&&PJJG=&&HJCZ=&&CPL=&&KCSL=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">产品产量统计</span>
      </div>
      <!-- <div class="cut_item"
        @click="$router.push('/financialStatistics/materialStatistics/page=1&&keyword=&&type=1&&HJSY=&&DGSL=&&PJJG=&&HJJG=&&KCSY=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoshiyongtongji"></use>
        </svg>
        <span class="name">物料使用统计</span>
      </div> -->
      <div class="cut_item"
        @click="$router.push('/financialStatistics/settleChargebacks/page=1&&keyword=&&clientId=&&type=1&&status=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoshiyongtongji"></use>
        </svg>
        <span class="name">结算扣款统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/annualStatistics?year=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-hezuogongsicaiwutongji"></use>
        </svg>
        <span class="name">年度财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-caozuorizhitongji"></use>
        </svg>
        <span class="name">生产记录统计</span>
      </div>
    </div>
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
        <div class="addCtn">
          <div style="width:auto;color:#1a95ff;font-size:14px"
            v-if="orderStatistics.update_time!=='0000-00-00'">
            更新日期：{{orderStatistics.update_time.slice(0,16)}}
          </div>
        </div>
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入订单号按回车键查询"></el-input>
              <el-cascader v-model="company_id"
                class="filter_item"
                :show-all-levels='false'
                placeholder="筛选公司"
                :options="companyArr"
                :filter-method='searchClient'
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="changeRouter(1)"
                filterable></el-cascader>
              <el-select v-model="group_id"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选小组">
                <el-option v-for="(item,index) in groupArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)"></el-date-picker>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
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
              <span class="text">订单公司</span>
            </div>
            <div class="col">
              <span class="text">负责小组</span>
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
            <div class="col">{{parseInt(item.order_number)}}</div>
            <div class="col">{{parseInt(item.total_price)}}</div>
            <div class="col">{{item.pack_number}}</div>
            <div class="col">{{item.reality_number}}</div>
            <div class="col">{{parseInt(item.company_cost)}}</div>
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
import { companyType } from '@/assets/js/dictionary.js'
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
    searchClient (node, query) {
      let flag = true
      if (query) {
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          flag = node.data.label.includes(query)
        } else {
          const queryArr = query.split('')
          for (const item of queryArr) {
            if (!node.data.name_pinyin.includes(item)) {
              flag = false
              break
            }
          }
        }
      }
      return flag
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
        client_id: this.company_id && this.company_id[1],
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
        client_id: this.company_id && this.company_id[1],
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
      if (params.company_id !== 'null' && params.company_id !== '') {
        this.company_id = params.company_id.split(',')
      } else {
        this.company_id = ''
      }
    }
  },
  mounted () {
    this.getFilters()
    this.getList()
    Promise.all([
      group.list(),
      client.list()
    ]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = this.$getClientOptions(res[1].data.data, companyType, { type: [1, 2] })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/orderStatistics.less";
</style>
