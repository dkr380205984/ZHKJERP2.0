<template>
  <div id='materialList'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item"
        :class="{'active':type===1}"
        @click="type = 1">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaodinggou"></use>
        </svg>
        <span class="name">原料订购</span>
      </div>
      <div class="cut_item"
        :class="{'active':type===2}"
        @click="type = 2">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaodinggou"></use>
        </svg>
        <span class="name">辅料订购</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <div class="cutBox">
                <div class="item"
                  :class="{'active':orderType}"
                  @click="orderType = true;changeRouter(1)">订单</div>
                <div class="item"
                  :class="{'active':!orderType}"
                  @click="orderType = false;changeRouter(1)">样单</div>
              </div>
              <el-select style="width:140px;margin-right:12px"
                class="filter_item"
                v-model="searchOrderOrProduct"
                @change="changeRouter(1)">
                <el-option value="order"
                  :label="orderType?'订单搜索':'样单搜索'"></el-option>
                <el-option value="product"
                  label="产品编号搜索"></el-option>
              </el-select>
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                :placeholder="'输入' + (searchOrderOrProduct==='order'?(orderType?'订单号':'样单号'):'产品编号')+'按回车键查询'">
              </el-input>
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
                  :value="item.id">
                </el-option>
              </el-select>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
            <div class="filter_line"
              :class="openHiddleFilter ? false : 'hiddle'">
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
                @change="changeRouter(1)">
              </el-date-picker>
              <el-select v-model="has_materialPlan"
                class="filter_item"
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
          </div>
          <div class="rightCtn"
            @click="openHiddleFilter = !openHiddleFilter">
            {{openHiddleFilter ? '收起' : '展开'}}
            <span class="el-icon-arrow-down openIcon"
              :class="openHiddleFilter ? 'active' : false"></span>
          </div>
        </div>
        <order-list :list="list"
          :orderType="orderType?1:2"
          oprWidth="140">
          <template slot="state"
            slot-scope="scope">
            <div class="stateCtn rowFlex"
              v-if="type===1"
              :class="scope.itemOrder.material_order_progress.y_percent<100?'orange':'green'">
              <div class="state"
                style="margin-left:0"></div>
              <span class="name">{{scope.itemOrder.material_order_progress.y_percent}}%</span>
            </div>
            <div class="stateCtn rowFlex"
              v-if="type===2"
              :class="scope.itemOrder.material_order_progress.f_percent<100?'orange':'green'">
              <div class="state"
                style="margin-left:0"></div>
              <span class="name">{{scope.itemOrder.material_order_progress.f_percent}}%</span>
            </div>
          </template>
          <template slot="opr"
            slot-scope="scope">
            <div class="col">
              <span class="opr"
                v-if="scope.itemOrder.has_plan!==0"
                @click="$router.push(`/material/materialDetail/${scope.itemOrder.id}/${type}/${orderType ? '1' : '2'}/normal`)">
                {{type === 1 ? '原料订购':'辅料订购'}}
              </span>
              <span class="opr"
                style="color:rgba(0,0,0,0.25);cursor:not-allowed"
                v-else>暂无物料计划</span>
            </div>
          </template>
        </order-list>
        <div class="pageCtn"
          :style="pages === Math.ceil(total / 10) && 'justify-content: space-between;align-items: center;'">
          <span style="color: #1A95FF;"
            v-if="pages === Math.ceil(total / 10)">当前已是最后一页，如需查询更多订单，请使用时间筛选功能查询更早的记录</span>
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages">
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
            @click="$router.push(`/material/materialBatchDetail/${checkedList.map(item=>item.id).join('-')}/${orderType ? '1' : '2'}/${type}`)">批量订{{type === 1 ? '原' : '辅'}}料</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { productionList, group, client } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      openHiddleFilter: false,
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
      // 批量订购勾选数据
      checkedList: [],
      stateArr: [{
        name: '全部',
        id: '0'
      }, {
        name: '可添加',
        id: '1'
      }, {
        name: '待添加',
        id: '2'
      }],
      has_materialPlan: 1,
      type: 1
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
      // },
      // orderType (newVal) {
      //   this.changeRouter(1)
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
      this.keyword = this.$changeSpecialWord(this.keyword, false)
      this.searchOrderOrProduct = params.searchOrderOrProduct || 'order'
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.has_materialPlan = params.has_materialPlan
      this.group_id = params.group_id ? Number(params.group_id) : ''
      this.company_id = params.company_id.split(',')
      this.orderType = this.$route.params.type === '1'
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/material/materialList/page=' + pages + '&&keyword=' + this.$changeSpecialWord(this.keyword, true) + '&&date=' + this.date + '&&has_materialPlan=' + this.has_materialPlan + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '&&searchOrderOrProduct=' + this.searchOrderOrProduct + '/' + (this.orderType ? '1' : '2'))
    },
    reset () {
      this.$router.push('/material/materialList/page=1&&keyword=&&date==&&has_materialPlan=1&&group_id=&&company_id=&&searchOrderOrProduct=/1')
    },
    getOrderList () {
      this.loading = true
      productionList.materialOrder({
        limit: 10,
        page: this.pages,
        product_code: this.searchOrderOrProduct === 'product' ? this.keyword : '',
        keyword: this.searchOrderOrProduct === 'order' ? this.keyword : '',
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id && this.company_id[1],
        status_material_plan: this.has_materialPlan === '0' ? 0 : 1,
        status_material_order: this.has_materialPlan === '2' ? 2 : 0,
        group_id: this.group_id,
        status: this.state
      }, this.$route.params.type !== '1').then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data.map(itemM => {
            const obj = { ...itemM }
            if (this.$route.params.type !== '1') {
              obj.order_code = itemM.title
            }
            return obj
          })
          this.total = res.data.meta.total
          this.loading = false
        }
      })
      // if (this.$route.params.type === '1') {
      //   order.list({
      //     limit: 10,
      //     page: this.pages,
      //     product_code: this.searchOrderOrProduct === 'product' ? this.keyword : '',
      //     keyword: this.searchOrderOrProduct === 'order' ? this.keyword : '',
      //     start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
      //     end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
      //     client_id: this.company_id && this.company_id[1],
      //     status_material_plan: this.has_materialPlan === '0' ? 0 : 1,
      //     status_material_order: this.has_materialPlan === '2' ? 2 : 0,
      //     group_id: this.group_id,
      //     status: this.state
      //   }).then(res => {
      //     this.list = res.data.data.map(item => {
      //       item.image = this.$mergeData(item.product_info, { mainRule: ['product_code', 'product_id'], otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] }).map(item => {
      //         return item.image.length > 0 ? item.image.map(itemImg => {
      //           return {
      //             ...itemImg,
      //             product_id: item.product_id
      //           }
      //         }) : [{
      //           image_url: '',
      //           thumb: '',
      //           product_id: item.product_id
      //         }]
      //       }).reduce((total, item) => {
      //         return total.concat(item)
      //       }, [])
      //       item.number = item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
      //         return Number(total) + Number(itemNum)
      //       }, 0)
      //       if (this.checkedList.find(itemF => +itemF.id === +item.id)) {
      //         item.checked = true
      //       } else {
      //         item.checked = false
      //       }
      //       return item
      //     })
      //     this.total = res.data.meta.total
      //     this.loading = false
      //   })
      // } else {
      //   sampleOrder.list({
      //     limit: 10,
      //     page: this.pages,
      //     product_code: this.searchOrderOrProduct === 'product' ? this.keyword : '',
      //     keyword: this.searchOrderOrProduct === 'order' ? this.keyword : '',
      //     start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
      //     end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
      //     client_id: this.company_id && this.company_id[1],
      //     status_material_plan: this.has_materialPlan,
      //     group_id: this.group_id
      //   }).then(res => {
      //     this.list = res.data.data
      //     this.list.forEach((item) => {
      //       let proArr = this.$mergeData(item.total_number, { mainRule: 'product_id' })
      //       let img = item.image || []
      //       img = img.map(itemImg => {
      //         return {
      //           thumb: itemImg.thumb,
      //           image_url: itemImg.image_url,
      //           product_id: itemImg.sample_product_id
      //         }
      //       })
      //       proArr.forEach(itemPro => {
      //         if (!img.find(itemImg => itemImg.product_id === itemPro.product_id)) {
      //           img.push({
      //             thumb: '',
      //             image_url: '',
      //             product_id: itemPro.product_id
      //           })
      //         }
      //       })
      //       item.image = img
      //       item.number = item.total_number.map(item => Number(item.numbers)).reduce((total, item) => {
      //         return total + item
      //       })
      //       item.order_code = item.title
      //     })
      //     this.total = res.data.meta.total
      //     this.loading = false
      //   })
      // }
    }
  },
  created () {
    this.getFilters()
    this.getOrderList()
    Promise.all([group.list(), client.list()]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = this.$getClientOptions(res[1].data.data, companyType, { type: [1, 2] })
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialList.less";
</style>
