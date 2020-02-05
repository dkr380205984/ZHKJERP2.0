<template>
  <div class="indexMain"
    id="productStatistics">
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
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">产品编号</span>
            </div>
            <div class="col"
              style="flex:1.5">
              <span class="text">
                <span class="text"
                  v-show="!searchTypeFlag">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchTypeFlag"
                    class="filterBox">
                    <el-cascader class="filter"
                      v-model="type"
                      placeholder="筛选品类"
                      :options="typeArr"
                      @change="getType"
                      clearable
                      filterable>
                    </el-cascader>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">下单总数</span>
            </div>
            <div class="col">
              <span class="text">平均价格</span>
            </div>
            <div class="col">
              <span class="text">合计产值</span>
            </div>
            <div class="col">
              <span class="text">次品率</span>
            </div>
            <div class="col">
              <span class="text">库存数量</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex12"></div>
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
import { productType } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      date: '',
      keyword: '',
      pages: 1,
      total: 0,
      list: [],
      searchTypeFlag: false,
      typeArr: [],
      type: [],
      category_id: '',
      type_id: '',
      style_id: ''
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
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/financialStatistics/productStatistics/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&category_id=' + this.category_id + '&&type_id=' + this.type_id + '&&style_id=' + this.style_id)
    },
    reset () {
      this.$router.push('/financialStatistics/productStatistics/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=')
    },
    getType (type) {
      if (type.length === 3) {
        this.category_id = type[0]
        this.type_id = type[1]
        this.style_id = type[2]
      } else {
        this.category_id = ''
        this.type_id = ''
        this.style_id = ''
      }
      this.changeRouter()
    },
    getList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
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
      this.category_id = params.category_id ? params.category_id : ''
      this.type_id = params.type_id ? params.type_id : ''
      this.style_id = params.style_id ? params.style_id : ''
      if (this.category_id) {
        this.type = [this.category_id, this.type_id, this.style_id]
        this.searchTypeFlag = true
      }
    }
  },
  mounted () {
    this.getFilters()
    this.getList()
    productType.list().then((res) => {
      this.typeArr = res.data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
          sizeArr: item.sizeArr,
          child_size: item.child_size,
          children: item.child.length === 0 ? null : item.child.map((item) => {
            return {
              value: item.id,
              label: item.name,
              children: item.child.length === 0 ? null : item.child.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }
          })
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/productStatistics.less";
</style>
