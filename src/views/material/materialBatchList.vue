<template>
  <div id='materialList'
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
                :label="orderType?'订单搜索':'样单搜索'"></el-option>
              <el-option value="product"
                label="产品编号搜索"></el-option>
            </el-select>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              :placeholder="'输入' + (searchOrderOrProduct==='order'?(orderType?'订单号':'样单号'):'产品编号')+'按回车键查询'">
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
              :disabled="checkedList.length>0"
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
            <div class="col flex04">
              <span class="text"></span>
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
            <div class="col flex12">
              <span class="text">采购进度(原)</span>
            </div>
            <div class="col flex12">
              <span class="text">采购进度(辅)</span>
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
            <div class="col flex04">
              <el-checkbox v-model="itemOrder.checked"
                :disabled="itemOrder.has_plan === 0"
                @change="checkedChange(itemOrder,$event)"></el-checkbox>
            </div>
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle">
              <zh-img-list :list="itemOrder.image"></zh-img-list>
            </div>
            <div class="col flex08">
              {{itemOrder.number}}
            </div>
            <div class="col flex08">
              {{itemOrder.group_name}}
            </div>
            <div class="col flex12">
              <div class="stateCtn rowFlex"
                :class="itemOrder.material_order_progress.y_percent<100?'orange':'green'">
                <div class="state"></div>
                <span class="name">{{itemOrder.material_order_progress.y_percent}}%</span>
              </div>
            </div>
            <div class="col flex12">
              <div class="stateCtn rowFlex"
                :class="itemOrder.material_order_progress.f_percent<100?'orange':'green'">
                <div class="state"></div>
                <span class="name">{{itemOrder.material_order_progress.f_percent}}%</span>
              </div>
            </div>
            <div class="col">
              {{itemOrder.order_time}}
            </div>
            <div class="col middle flex08">
              <span class="opr"
                v-if="itemOrder.has_plan!==0"
                style="padding-right:0">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    {{itemOrder.material_order_progress.y_percent>=100&&itemOrder.material_order_progress.f_percent>=100?'查看详情':'订购物料'}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="$router.push('/material/materialDetail/'+itemOrder.id+'/1'+ '/' + (orderType ? '1' : '2') + '/normal')">
                      <span class="detail">原料</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="$router.push('/material/materialDetail/'+itemOrder.id+'/2' + '/' + (orderType ? '1' : '2') + '/normal')">
                      <span class="detail">辅料</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <span class="opr"
                style="color:rgba(0,0,0,0.25);cursor:not-allowed"
                v-if="itemOrder.has_plan===0">暂无物料计划</span>
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
    <div class="bottomFixBar"
      v-if="checkedList.length > 0">
      <div class="main">
        <div class="checkedInfo"
          style="float:left">
          已选择
          <span class="blue">{{checkedList.length}}</span>
          个订单：
          <template v-for="(item,index) in checkedList">
            <span class="blue"
              :key="index">{{item.code}}</span>;
          </template>
        </div>
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="cancelChecked">取消</div>
          <div class="btn btnWhiteBlue"
            @click="$router.push('/material/materialBatchDetail/' + checkedList.map(item=>item.id).join('-') + '/' + (orderType ? '1' : '2') + '/2')">批量订辅料</div>
          <div class="btn btnWhiteBlue"
            @click="$router.push('/material/materialBatchDetail/' + checkedList.map(item=>item.id).join('-') + '/' + (orderType ? '1' : '2') + '/1')">批量订原料</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, group, client, sampleOrder } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
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
      orderType: true,
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      searchCompanyFlag: false,
      searchGroupFlag: false,
      // 批量订购勾选数据
      checkedList: []
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
    checkedChange (item, event) {
      if (event) {
        this.checkedList.push({
          id: item.id,
          code: item.order_code
        })
      } else {
        let index = this.checkedList.findIndex(itemF => +itemF.id === +item.id)
        if (index || index === 0) {
          this.checkedList.splice(index, 1)
        }
      }
    },
    cancelChecked () {
      this.list.forEach(item => {
        item.checked = false
      })
      this.checkedList = []
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      this.searchOrderOrProduct = params.searchOrderOrProduct || 'order'
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.has_materialPlan = params.has_materialPlan
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
      this.$router.push('/material/materialList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '&&searchOrderOrProduct=' + this.searchOrderOrProduct + '/' + (this.orderType ? '1' : '2'))
    },
    reset () {
      this.$router.push('/material/materialList/page=1&&keyword=&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1')
    },
    getOrderList () {
      this.loading = true
      if (this.$route.params.type === '1') {
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
          this.list = res.data.data.map(item => {
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
            if (this.checkedList.find(itemF => +itemF.id === +item.id)) {
              item.checked = true
            } else {
              item.checked = false
            }
            return item
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      } else {
        sampleOrder.list({
          limit: 10,
          page: this.pages,
          product_code: this.searchOrderOrProduct === 'product' ? this.keyword : '',
          keyword: this.searchOrderOrProduct === 'order' ? this.keyword : '',
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          client_id: this.company_id,
          group_id: this.group_id
        }).then(res => {
          this.list = res.data.data
          this.list.forEach((item) => {
            let proArr = this.$mergeData(item.total_number, { mainRule: 'product_id' })
            let img = item.image || []
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
@import "~@/assets/less/material/materialList.less";
</style>
