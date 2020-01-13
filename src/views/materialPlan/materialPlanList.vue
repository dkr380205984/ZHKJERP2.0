<template>
  <div id='orderList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              :placeholder="'输入' +(orderType?'订':'样')+'单号按回车键查询'">
            </el-input>
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
              @change="changeRouter(1)">
            </el-date-picker>
            <div class="btn btnGray"
              @click="reset"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
            <el-switch class="switch"
              @change="changeRouter(1)"
              v-model="orderType"
              active-color="#1A95FF"
              inactive-color="#E6A23C"
              active-text="订单"
              inactive-text="样单">
            </el-switch>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">{{orderType?'订':'样'}}单号</span>
            </div>
            <div class="col flex12">
              <span class="text">
                <span class="text"
                  v-show="!searchCompanyFlag">外贸公司
                  <i class="el-icon-search iconBtn"
                    @click="searchCompanyFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchCompanyFlag"
                    class="filterBox">
                    <el-select v-model="company_id"
                      @change="changeRouter(1)"
                      clearable
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
            </div>
            <div class="col middle">
              <span class="text">产品图片</span>
            </div>
            <div class="col flex08">
              <span class="text">订单数量(件)</span>
            </div>
            <div class="col flex08">
              <span class="text">
                <span class="text"
                  v-show="!searchGroupFlag">负责小组
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
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchStateFlag">状态
                  <i class="el-icon-search iconBtn"
                    @click="searchStateFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchStateFlag"
                    class="filterBox">
                    <el-select v-model="has_materialPlan"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选状态">
                      <el-option v-for="(item,index) in stateArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">下单时间</span>
            </div>
            <div class="col middle flex08">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle">
              <zh-img-list :list="itemOrder.image"></zh-img-list>
            </div>
            <div class="col flex08">{{itemOrder.number}}</div>
            <div class="col flex08">{{itemOrder.group_name}}</div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="{'green':itemOrder.has_plan>0,'orange':itemOrder.has_plan===0}">
                <div class="state"></div>
                <span class="name">{{itemOrder.has_plan>0?'已创建':'待添加'}}</span>
              </div>
            </div>
            <div class="col">{{itemOrder.order_time}}</div>
            <div class="col middle flex08">
              <span class="opr"
                v-if="itemOrder.has_plan>0"
                @click="$router.push('/materialPlan/materialPlanDetail/' + itemOrder.id + '/' + (orderType ? 1 : 2))">详情</span>
              <span class="opr"
                v-if="itemOrder.has_plan===0"
                @click="$router.push('/materialPlan/materialPlanCreate/' + itemOrder.id + '/' + (orderType ? 1 : 2))">添加</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { order, group, client, sampleOrder } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0,
      orderType: true,
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      stateArr: [{
        name: '全部',
        id: '0'
      }, {
        name: '已创建',
        id: '1'
      }, {
        name: '待添加',
        id: '2'
      }],
      has_materialPlan: '',
      searchCompanyFlag: false,
      searchGroupFlag: false,
      searchStateFlag: false,
      chinaNum: chinaNum
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getOrderList()
    }
  },
  methods: {
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
      this.orderType = this.$route.params.type === '1'
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/materialPlan/materialPlanList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&has_materialPlan=' + this.has_materialPlan + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '/' + (this.orderType ? '1' : '2'))
    },
    reset () {
      this.$router.push('/materialPlan/materialPlanList/page=1&&keyword=&&date=&&has_materialPlan=&&group_id=&&company_id=/1')
    },
    getOrderList () {
      this.loading = true
      if (this.$route.params.type === '1') {
        order.list({
          limit: 10,
          page: this.pages,
          keyword: this.keyword,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          client_id: this.company_id,
          gourp_id: this.group_id,
          status: this.state
        }).then(res => {
          this.list = res.data.data
          this.list.forEach(item => {
            item.image = this.$mergeData(item.product_info, { mainRule: 'product_code', otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] }).map(item => item.image).reduce((total, item) => {
              return total.concat(item)
            })
            item.number = item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
              return Number(total) + Number(itemNum)
            })
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      } else {
        sampleOrder.list({
          limit: 10,
          page: this.pages,
          keyword: this.keyword,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          client_id: this.company_id,
          gourp_id: this.group_id
        }).then(res => {
          this.list = res.data.data
          this.list.forEach((item) => {
            let proArr = this.$mergeData(item.total_number, { mainRule: 'product_id' })
            let img = item.images || []
            img = img.map(itemImg => {
              return {
                thumb: itemImg.thumb,
                image_url: itemImg.image_url,
                product_id: itemImg.sample_product_id
              }
            })
            proArr.forEach(itemPro => {
              if (!img.find(itemImg => itemImg.product_id === itemPro.product_id)) {
                img.push({
                  thumb: '',
                  image_url: '',
                  product_id: itemPro.product_id
                })
              }
            })
            item.image = img
            item.number = item.total_number.map(item => Number(item.numbers)).reduce((total, item) => {
              return total + item
            })
            item.order_code = item.title
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      }
    }
  },
  created () {
    this.getFilters()
    this.getOrderList()
    Promise.all([group.list(), client.list()]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = res[1].data.data.filter((item) => {
        return item.type.indexOf(1) !== -1
      })
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderList.less";
</style>
