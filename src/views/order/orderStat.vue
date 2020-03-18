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
              placeholder="输入订单号按回车键查询">
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
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">发货日期</span>
            </div>
            <div class="col flex12">
              <span class="text">订单号</span>
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
            </div>
            <div class="col middle flex12">
              <span class="text">产品图片</span>
            </div>
            <div class="col flex08">
              <span class="text"
                style="line-height:1.2em">批次<br />订单数量</span>
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
            <div class="col flex16">
              <span class="text"
                v-show="!searchStateFlag">流程进度</span>
            </div>
            <div class="col">
              <span class="text"
                style="line-height:1.2em">已用工时<br />下单日期</span>
            </div>
            <!-- <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchState2Flag">订单状态
                  <i class="el-icon-search iconBtn"
                    @click="searchState2Flag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchState2Flag"
                    class="filterBox">
                    <el-select v-model="state"
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
            </div> -->
            <!-- <div class="col">
              <span class="text">交货日期</span>
            </div> -->
            <div class="col">
              <span class="text">当前状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col"> {{itemOrder.delivery_time}} </div>
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle flex12">
              <zh-img-list :list="itemOrder.image"
                type='open'></zh-img-list>
            </div>
            <div class="col flex08"> {{'第' + itemOrder.batch_id + '批'}}<br />{{itemOrder.total_number}}</div>
            <div class="col flex08"> {{itemOrder.group_name}} </div>
            <div class="col flex16">
              <div class="stateCtn"
                :class="{'green':itemOrder.has_plan>0}">
                <div class="state"></div>
                <span class="name">计</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.material_order_progress.y_percent>0,'green':itemOrder.material_order_progress.y_percent>=100}">
                <div class="state"></div>
                <span class="name">订</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.material_push_progress.r_push>0,'green':itemOrder.material_push_progress.r_push>=100}">
                <div class="state"></div>
                <span class="name">库</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.product_weave_progress.product>0,'green':itemOrder.product_weave_progress.product>=100}">
                <div class="state"></div>
                <span class="name">织</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.product_push_progress>0,'green':itemOrder.product_push_progress>=100}">
                <div class="state"></div>
                <span class="name">收</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.product_inspection_progress.r_product>0,'green':itemOrder.product_inspection_progress.r_product>=100}">
                <div class="state"></div>
                <span class="name">检</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.pack_real_progress>0,'green':itemOrder.pack_real_progress>=100}">
                <div class="state"></div>
                <span class="name">箱</span>
              </div>
            </div>
            <div class="col"> {{itemOrder.order_time|filterTime}}<br />{{itemOrder.order_time}} </div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="{'red':itemOrder.status === 2003,'green':itemOrder.status === 2004,'blue':itemOrder.status === 2002,'orange':itemOrder.status === 2001}">
                <div class="state"></div>
                <span class="name">{{itemOrder.status === 2001 ? '已创建' : itemOrder.status=== 2002 ? '进行中': itemOrder.status === 2004 ? '已完成' : '已取消'}}</span>
              </div>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/order/orderDetail/' + itemOrder.order_id)">详情</span>
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
import { getHash } from '@/assets/js/common.js'
import { orderBatch, group, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0,
      state: '',
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      stateArr: [
        {
          name: '已创建',
          id: '2001'
        }, {
          name: '进行中',
          id: '2002'
        }, {
          name: '已完成',
          id: '2004'
        }, {
          name: '已取消',
          id: '2003'
        }],
      searchCompanyFlag: false,
      searchGroupFlag: false,
      searchStateFlag: false,
      searchState2Flag: false
    }
  },
  watch: {
    pages (newVal) {
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
      this.pages = Number(params.page)
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
      this.state = params.state
      if (this.state) {
        this.searchState2Flag = true
      }
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/order/orderStat/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '&&state=' + this.state)
    },
    reset () {
      this.$router.push('/order/orderStat/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=')
    },
    getOrderList () {
      this.loading = true
      orderBatch.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id,
        group_id: this.group_id,
        status: this.state
      }).then(res => {
        let data = []
        let batchData = res.data.data.data
        for (let prop in batchData) {
          let item = batchData[prop]
          data.push(...item.map(itemBatch => {
            let productInfo = itemBatch.batch_info.map(itemPro => {
              return {
                number: itemPro.product_info.map(itemSize => (+itemSize.numbers || 0)).reduce((a, b) => {
                  return a + b
                }),
                product_id: itemPro.category_info.product_id,
                image: itemPro.category_info.images.length > 0 ? itemPro.category_info.images.map(itemImg => {
                  itemImg.product_id = itemPro.category_info.product_id
                  itemImg.product_type = itemPro.category_info.product_type
                  return itemImg
                }) : [{
                  product_id: itemPro.category_info.product_id,
                  product_type: itemPro.category_info.product_type
                }]
              }
            })
            return {
              delivery_time: prop,
              order_code: itemBatch.order_code,
              client_name: itemBatch.client_name,
              image: productInfo.map(itemPro => itemPro.image).reduce((a, b) => {
                return a.concat(b)
              }),
              status: itemBatch.status,
              order_id: itemBatch.order_id,
              batch_id: itemBatch.batch_id,
              group_name: itemBatch.group_name,
              total_number: productInfo.map(itemPro => (+itemPro.number || 0)).reduce((a, b) => {
                return a + b
              }),
              order_time: itemBatch.order_time,
              ...itemBatch.log

            }
          })
          )
        }
        this.list = data
        this.total = res.data.data.count
        this.loading = false
      })
    }
  },
  created () {
    this.getFilters()
    this.getOrderList()
    Promise.all([
      group.list(),
      client.list()
    ]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = res[1].data.data.filter((item) => {
        return item.type.indexOf(1) !== -1
      })
    })
  },
  filters: {
    filterStatus (item) { // item 参数1:交货时间；参数2：订单状态
      if (Array.isArray(item)) {
        let nowTime = new Date().getTime()
        let compileTime = new Date(item[0]).getTime()
        let status = item[1]
        if (status === 2004) {
          return '已完成'
        } else if (compileTime > nowTime) {
          return '进行中'
        } else if (nowTime >= compileTime) {
          return '已逾期'
        }
      } else {
        return 'undefined'
      }
    },
    filterTime (item) {
      let nowTime = new Date()
      let orderTime = new Date(item)
      if (orderTime) {
        return Math.ceil((nowTime.getTime() - orderTime.getTime()) / 1000 / 60 / 60 / 24) + '天'
      } else {
        return 'null'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderList.less";
</style>
