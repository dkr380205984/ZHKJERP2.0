<template>
  <div id='receiveDispatchList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-select style="width:140px;margin-right:12px"
              v-model="searchOrderOrProduct"
              @change="changeRouter(1)">
              <el-option value="order"
                label="订单搜索"></el-option>
              <el-option value="product"
                label="产品编号搜索"></el-option>
            </el-select>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              :placeholder="'输入' + (searchOrderOrProduct==='order'?'订单号':'产品编号')+'按回车键查询'">
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
            <div class="col flex16">
              <span class="text">
                <span class="text">实际装箱进度</span>
              </span>
            </div>
            <div class="col">
              <span class="text">下单时间</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle">
              <zh-img-list :list="itemOrder.image"
                type='open'></zh-img-list>
            </div>
            <div class="col flex08">
              {{itemOrder.number}}
            </div>
            <div class="col flex08">
              {{itemOrder.group_name}}
            </div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="{'orange':itemOrder.pack_real_progress>=0,'green':itemOrder.pack_real_progress>=100}">
                <div class="state"></div>
                <span class="name">{{(itemOrder.pack_real_progress || 0)}}%</span>
                <!-- <div class="col flex12">
                  <div class="stateCtn rowFlex"
                    :class="itemOrder.product_push_progress < 100 ? 'orange' : 'green'">
                    <div class="state"></div>
                    <span class="name">{{itemOrder.product_push_progress}}%</span>
                  </div> -->
              </div>
            </div>
            <div class="col">
              {{itemOrder.order_time}}
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/packPlan/packStock/' + itemOrder.id)">详情</span>
              <!-- <span class="opr"
                v-if="itemOrder.has_plan===0"
                @click="$router.push('/packPlan/packStock/' + itemOrder.id)">添加</span> -->
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { order, group, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      searchOrderOrProduct: 'order',
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
      has_materialPlan: '', // 物料计划
      has_materialOrder: '', // 物料订购
      has_materialStock: '', // 物料出入库
      has_weave: '', // 织造分配
      has_productInOut: '', // 产品收发
      has_inspection: '', // 成品检验
      has_boxing: '', // 装箱出库
      stateArr: [{
        name: '全部',
        id: '0'
      }, {
        name: '已取消',
        id: '1'
      }, {
        name: '其他',
        id: '2'
      }],
      searchCompanyFlag: false,
      searchGroupFlag: false,
      searchStateFlag: false,
      searchState2Flag: false
    }
  },
  watch: {
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
      this.keyword = this.$changeSpecialWord(this.keyword, false)
      this.searchOrderOrProduct = params.searchOrderOrProduct || 'order'
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.has_materialPlan = params.has_materialPlan
      this.has_materialOrder = params.has_materialOrder
      this.has_materialStock = params.has_materialStock
      this.has_weave = params.has_weave
      this.has_productInOut = params.has_productInOut
      this.has_inspection = params.has_inspection
      this.has_boxing = params.has_boxing
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
      this.$router.push('/packPlan/packStockList/page=' + pages + '&&keyword=' + this.$changeSpecialWord(this.keyword, true) + '&&date=' + this.date + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '&&state=' + this.state + '&&searchOrderOrProduct=' + this.searchOrderOrProduct)
    },
    reset () {
      this.$router.push('/packPlan/packStockList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct=')
    },
    getOrderList () {
      this.loading = true
      order.list({
        limit: 10,
        page: this.pages,
        product_code: this.searchOrderOrProduct === 'product' ? this.keyword : '',
        keyword: this.searchOrderOrProduct === 'order' ? this.keyword : '',
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id,
        group_id: this.group_id,
        status: this.state
      }).then(res => {
        this.list = res.data.data
        this.list.forEach(item => {
          item.image = this.$mergeData(item.product_info, { mainRule: ['product_code', 'product_id'], otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] }).map(item => {
            return item.image.length > 0 ? item.image.map(itemImg => {
              return {
                ...itemImg,
                product_id: item.product_id
              }
            }) : [{
              image_url: '',
              thumb: '',
              product_id: item.product_id
            }]
          }).reduce((total, item) => {
            return total.concat(item)
          })
          item.number = item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
            return Number(total) + Number(itemNum)
          })
        })
        // this.list = res.data.data.map(item => {
        //   return {
        //     id: item.id,
        //     order_code: item.order_code,
        //     client_name: item.client_name,
        //     image: this.$mergeData(item.product_info, { mainRule: 'product_code', otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] }).map(item => item.image).reduce((total, item) => {
        //       return total.concat(item)
        //     }),
        //     number: item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
        //       return Number(total) + Number(itemNum)
        //     }),
        //     group_name: item.group_name,
        //     order_time: item.order_time,
        //     product_push_progress: item.product_push_progress
        //   }
        // })
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    handleCommand (type, id) {
      if (type === 'change') {
        this.$router.push('/order/orderUpdate/' + id)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          order.delete({
            id: id
          }).then(res => {
            if (res.data.status) {
              this.$message.success('删除成功')
              setTimeout(() => {
                window.location.reload()
              }, 300)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (type === 'materialStock') {
        this.$router.push('/materialStock/materialStockDetail/' + id + '/1')
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
@import "~@/assets/less/receiveDispatch/receiveDispatchList.less";
</style>
