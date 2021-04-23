<template>
  <div class="indexMain"
    id="orderStatistics"
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/orderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">订单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/sampleStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">样单财务统计</span>
      </div>
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">物料使用统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/settleChargebacks')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoshiyongtongji"></use>
        </svg>
        <span class="name">结算扣款统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/annualStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-hezuogongsicaiwutongji"></use>
        </svg>
        <span class="name">年度财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/logStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-caozuorizhitongji"></use>
        </svg>
        <span class="name">生产记录统计</span>
      </div>
    </div>
    <div class="module">
      <div class="detailCtn">
        <div class="rowCtn">
          <span class="bgGray">当前统计默认值：数据更新时间：{{dateCom}}；预订单位：{{clientCom}}；物料名称：{{filterInfo.yarn_name_1 || '所有'}}。</span>
        </div>
        <div class="tableCtn">
          <div class="filterCtn">
            <!-- <el-date-picker class="filter_item"
              v-model="filterInfo.year"
              value-format="yyyy"
              type="year"
              placeholder="筛选下单年份"
              @change="changeRouter(1)">
            </el-date-picker> -->
            <el-cascader v-model="filterInfo.client"
              clearable
              class="filter_item"
              :show-all-levels='false'
              placeholder="筛选单位名称"
              :options="filterInfo.clientArr"
              :props="{ expandTrigger: 'hover' }"
              @change="changeRouter(1)"
              filterable></el-cascader>
            <!-- <el-select class="filter_item"
              clearable
              v-model="filterInfo.client"
              placeholder="筛选单位名称"
              @change="changeRouter(1)">
              <el-option v-for="item in filterInfo.clientArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
            <el-select class="filter_item"
              clearable
              filterable
              v-model="filterInfo.yarn_name_1"
              placeholder="筛选物料名称"
              @change="changeRouter(1)">
              <el-option v-for="item in filterInfo.yarnArr"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
          <div class="flexTb">
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn center">物料名称</div>
                <div class="tcolumn noPad flex5">
                  <div class="trow">
                    <div class="tcolumn center">单位名称</div>
                    <div class="tcolumn center">纱线颜色</div>
                    <div class="tcolumn center">预订数量</div>
                    <div class="tcolumn center">入库数量</div>
                    <div class="tcolumn center">剩余数量</div>
                  </div>
                </div>
              </div>
              <div class="trow"
                v-for="(itemClient,indexClient) in yarnListForClient"
                :key="indexClient">
                <div class="tcolumn center">{{itemClient.material_name}}</div>
                <div class="tcolumn noPad flex5">
                  <div class="trow"
                    v-for="(itemInner,indexInner) in itemClient.list"
                    :key="indexInner">
                    <div class="tcolumn center">{{itemInner.name}}</div>
                    <div class="tcolumn center">{{itemInner.color_code}}</div>
                    <div class="tcolumn center">{{itemInner.weight}}</div>
                    <div class="tcolumn center">{{itemInner.stock_weight}}</div>
                    <div class="tcolumn center">{{itemInner.residue_weight}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin:8px 0">
            <el-pagination background
              :page-size="filterInfo.limit"
              layout="prev, pager, next"
              :total="filterInfo.total_1"
              :current-page.sync="filterInfo.pages_1"
              @current-change="changeRouter()"></el-pagination>
          </div>
        </div>
        <div class="rowCtn">
          <span class="bgGray">当前统计默认值：数据更新时间：{{dateCom}}；物料类型：{{materialTypeCom}}；所属仓库：{{storeCom}}；物料名称：{{filterInfo.yarn_name_2 || '所有'}}。</span>
        </div>
        <div class="tableCtn">
          <div class="filterCtn">
            <!-- <el-date-picker class="filter_item"
              v-model="filterInfo.year"
              value-format="yyyy"
              type="year"
              placeholder="筛选下单年份"
              @change="changeRouter(1)">
            </el-date-picker> -->
            <el-select class="filter_item"
              clearable
              v-model="filterInfo.material_type"
              placeholder="筛选物料类型"
              @change="changeRouter(2)">
              <el-option v-for="item in filterInfo.typeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="filter_item"
              clearable
              filterable
              v-model="filterInfo.store"
              placeholder="筛选仓库名称"
              @change="changeRouter(2)">
              <el-option v-for="item in filterInfo.storeArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select class="filter_item"
              clearable
              filterable
              v-model="filterInfo.yarn_name_2"
              placeholder="筛选物料名称"
              @change="changeRouter(2)">
              <el-option v-for="item in filterInfo.yarnArr"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
          <div class="flexTb">
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn center">物料名称</div>
                <div class="tcolumn noPad flex5">
                  <div class="trow">
                    <div class="tcolumn center">仓库名称</div>
                    <div class="tcolumn center">颜色属性</div>
                    <div class="tcolumn center">色号</div>
                    <div class="tcolumn center">批/缸号</div>
                    <div class="tcolumn center">库存数量</div>
                  </div>
                </div>
              </div>
              <div class="trow"
                v-for="(itemStore,indexStore) in yarnListForStore"
                :key="indexStore">
                <div class="tcolumn center">{{itemStore.material_name}}</div>
                <div class="tcolumn noPad flex5">
                  <div class="trow"
                    v-for="(itemInner,indexInner) in itemStore.list"
                    :key="indexInner">
                    <div class="tcolumn center">{{itemInner.name}}</div>
                    <div class="tcolumn center">{{itemInner.material_color}}</div>
                    <div class="tcolumn center">{{itemInner.color_number}}</div>
                    <div class="tcolumn center">{{itemInner.vat_code}}</div>
                    <div class="tcolumn center">{{itemInner.weight}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin:8px 0">
            <el-pagination background
              :page-size="filterInfo.limit"
              layout="prev, pager, next"
              :total="filterInfo.total_2"
              :current-page.sync="filterInfo.pages_2"
              @current-change="changeRouter()"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { newFinance, client, yarn, stock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      filterInfo: {
        // year: '',
        client: '',
        clientArr: [],
        yarn_name_1: '',
        yarn_name_2: '',
        yarnArr: [],
        pages_1: 1,
        total_1: 1,
        limit: 8,
        pages_2: 1,
        total_2: 1,
        material_type: '',
        typeArr: [
          {
            value: 1,
            label: '纱线原料'
          },
          {
            value: 2,
            label: '装饰辅料'
          }
        ],
        store: '',
        storeArr: []
      },
      yarnListForClient: [],
      yarnListForStore: []
    }
  },
  watch: {
    $route () {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.init()
    }
  },
  methods: {
    changeRouter (type) { // type区分是pages_1改变还是pages_2改变
      if (type) {
        this.filterInfo[`pages_${type}`] = 1
      }
      this.$router.replace(`/newfinancialStatistics/materialStatistics?client=${this.filterInfo.client || ''}&yarn_name_1=${this.filterInfo.yarn_name_1 || ''}&pages1=${this.filterInfo.pages_1}&material_type=${this.filterInfo.material_type || ''}&store=${this.filterInfo.store || ''}&yarn_name_2=${this.filterInfo.yarn_name_2}&pages_2=${this.filterInfo.pages_2}`)
    },
    getFilters () {
      const params = this.$route.query
      this.filterInfo.client = (params.client && params.client.split(',')) || ''
      this.filterInfo.yarn_name_1 = params.yarn_name_1 || ''
      this.filterInfo.pages_1 = +params.pages_1 || 1
      this.filterInfo.material_type = +params.material_type || ''
      this.filterInfo.store = +params.store || ''
      this.filterInfo.yarn_name_2 = params.yarn_name_2 || ''
      this.filterInfo.pages_2 = +params.pages_2 || 1
    },
    init () {
      this.loading = true
      Promise.all([
        newFinance.materialStoreForClient({
          client_id: (this.filterInfo.client && this.filterInfo.client[1]) || '',
          material_name: this.filterInfo.yarn_name_1 || '',
          page: this.filterInfo.pages_1,
          limit: this.filterInfo.limit
        }),
        newFinance.materialStore({
          material_name: this.filterInfo.yarn_name_2 || '',
          type: this.filterInfo.material_type || '',
          stock_id: this.filterInfo.store || '',
          page: this.filterInfo.pages_2,
          limit: this.filterInfo.limit
        })
      ]).then(res => {
        // console.log(this.$flatten(res[1].data.data.data))
        this.yarnListForClient = this.$mergeData(res[0].data.data.data, { mainRule: 'material_name', childrenName: 'list' })
        this.filterInfo.total_1 = res[0].data.data.total
        this.yarnListForStore = this.$mergeData(res[1].data.data.data, { mainRule: 'material_name', childrenName: 'list' })
        this.filterInfo.total_2 = res[1].data.data.total
        this.loading = false
      })
    }
  },
  mounted () {
    this.getFilters()
    // this.loading = false
    this.init()
  },
  created () {
    Promise.all([
      client.list(),
      yarn.list(),
      stock.list()
    ]).then(res => {
      this.filterInfo.clientArr = this.$getClientOptions(res[0].data.data, companyType, { type: [3, 4] })
      this.filterInfo.yarnArr = res[1].data.data
      this.filterInfo.storeArr = res[2].data.data.filter(itemF => itemF.type === 1 || itemF.type === 2)
    })
  },
  computed: {
    dateCom () {
      // if (this.filterInfo.year && +this.filterInfo.year !== new Date().getFullYear()) {
      //   return `${this.filterInfo.year}年1月1日-${this.filterInfo.year}年12月31日`
      // }
      // const nowDate = this.$getTime().split('-')
      // return `${nowDate[0]}年1月1日-${nowDate[0]}年${nowDate[1]}月${nowDate[2]}日`
      return this.$getTime()
    },
    clientCom () {
      if (this.filterInfo.client && this.filterInfo.client.length === 2) {
        const findedFirst = this.filterInfo.clientArr.find(itemF => itemF.value === this.filterInfo.client[0])
        const findedLast = (findedFirst && findedFirst.children.find(itemF => itemF.value === this.filterInfo.client[1])) || null
        return (findedLast && findedLast.label) || '未知'
      }
      return '所有'
    },
    materialTypeCom () {
      if (this.filterInfo.material_type) {
        const finded = this.filterInfo.typeArr.find(itemF => itemF.value === this.filterInfo.material_type)
        return (finded && finded.label) || '未知'
      }
      return '所有'
    },
    storeCom () {
      if (this.filterInfo.store) {
        const finded = this.filterInfo.storeArr.find(itemF => itemF.id === this.filterInfo.store)
        return (finded && finded.name) || '未知'
      }
      return '所有'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/newfinancialStatistics/orderStatistics.less";
</style>
