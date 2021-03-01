<template>
  <div class="indexMain"
    id="settleChargebacks">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/financialStatistics/orderStatistics/page=1&&keyword=&&date=&&group_id=&&company_id=')">
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
      <div class="cut_item active">
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
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <div class="tabCtn">
                <span class="tab"
                  :class="{'active':type==='1'}"
                  @click="type='1'">结算</span>
                <span class="tab"
                  :class="{'active':type==='2'}"
                  @click="type='2'">扣款</span>
              </div>
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入订单编号按回车键查询"></el-input>
              <el-cascader v-model="client_id"
                class="filter_item"
                :show-all-levels='false'
                placeholder="搜索公司名称查询"
                :options="clientList"
                :filter-method='searchClient'
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="changeRouter(1)"
                filterable></el-cascader>
              <el-select class="filter_item"
                v-model="status"
                @change="changeRouter(1)"
                placeholder="筛选状态"
                clearable
                filterable>
                <el-option v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
              <el-select v-model="huobi"
                style="width:180px"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选货币">
                <el-option value=""
                  label="全部"></el-option>
                <el-option value="RMB"
                  label="人民币"></el-option>
                <el-option value="USD"
                  label="美元"></el-option>
              </el-select>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">{{type === '1' ? '结算日期' : '扣款日期'}}</span>
            </div>
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
              <span class="text">关联单位</span>
            </div>
            <div class="col">
              <span class="text">类型</span>
            </div>
            <div class="col">
              <span class="text">包含订单</span>
            </div>
            <div class="col right">
              <span class="text">金额</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">审核状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{$getTime(item.complete_time)}}</div>
            <div class="col">{{item.settle_code || item.deduct_code}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.methods}}</div>
            <div class="col">{{item.order_code_str}}</div>
            <div class="col right">{{$toFixed(item.settle_price || item.deduct_price || 0)}}{{huobi==='RMB'?'元':huobi==='USD'?'美元':''}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col"
              :class="item.status === 1 ? 'orange' : item.status === 2  ? 'green' : 'red'">{{item.status === 1 ? '待审核' : item.status === 2  ? '已通过' : '已驳回'}}</div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/financialStatistics/oprDetail/' + item.client_id + '/' + item.type + '/' + item.id + '/' + item.methods + '?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)">详情</span>
            </div>
          </div>
          <div class="row">
            <span class="col">合计：</span>
            <span class="col">{{$toFixed(totalPrice)}}{{huobi==='RMB'?'元':huobi==='USD'?'美元':''}}</span>
            <span class="col"></span>
            <span class="col"></span>
            <span class="col"></span>
            <span class="col"></span>
            <span class="col"></span>
            <span class="col"></span>
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
import { companyType } from '@/assets/js/dictionary.js'
import { getHash } from '@/assets/js/common.js'
import { settle, chargebacks, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      huobi: '',
      loading: true,
      keyword: '',
      client_id: '',
      clientList: [],
      sortFn: 1,
      status: '',
      statusList: [
        { name: '待审核', id: '1' },
        { name: '已通过', id: '2' },
        { name: '已驳回', id: '3' }
      ],
      date: '',
      pages: 1,
      total: 0,
      list: [],
      totalPrice: '',
      type: '1' // 1结算2扣款

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
      this.$router.push('/financialStatistics/settleChargebacks/page=' + pages + '&&keyword=' + this.$strToAscII(this.keyword) + '&&clientId=' + this.client_id + '&&type=' + this.type + '&&status=' + this.status + '&&huobi=' + this.huobi)
    },
    reset () {
      this.$router.push('/financialStatistics/settleChargebacks/page=1&&keyword=&&clientId=&&type=1&&status=&&huobi=')
    },
    getList () {
      this.loading = true
      if (this.type === '1') {
        settle.log({
          limit: 10,
          page: this.pages,
          order_code: this.keyword,
          client_id: this.client_id && this.client_id[2],
          client_type: this.client_type,
          start_time: this.date ? this.date[0] : '',
          end_time: this.date ? this.date[1] : '',
          currency_type: this.huobi,
          status: this.status,
          sort: this.sortFn
        }).then(res => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              methods: '开票',
              order_code_str: itemM.order_code.map(itemM => itemM.order_code).join(';')
            }
          })
          this.total = res.data.meta.total
          this.totalPrice = res.data.total_price
          this.loading = false
        })
      } else {
        chargebacks.log({
          limit: 10,
          page: this.pages,
          order_code: this.keyword,
          client_id: this.client_id && this.client_id[2],
          client_type: this.client_type,
          start_time: this.date ? this.date[0] : '',
          end_time: this.date ? this.date[1] : '',
          currency_type: this.huobi,
          status: this.status,
          sort: this.sortFn
        }).then(res => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              methods: '扣款',
              order_code_str: itemM.order_code.map(itemM => itemM.order_code).join(';')
            }
          })
          this.total = res.data.meta.total
          this.totalPrice = res.data.total_price
          this.loading = false
        })
      }
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = this.$strToAscII(params.keyword, true)
      this.type = params.type
      this.status = params.status
      this.client_id = params.clientId.split(',')
      this.huobi = params.huobi || ''
    }
  },
  created () {
    this.getFilters()
    Promise.all([
      client.list()
    ]).then(res => {
      this.clientList = this.$getClientOptions(res[0].data.data, companyType, { hasFirstType: true })
      this.getList()
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/settleChargebacks.less";
</style>
