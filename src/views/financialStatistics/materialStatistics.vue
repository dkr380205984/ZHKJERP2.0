<template>
  <div class="indexMain"
    id="materialStatistics">
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="tabCtn">
              <span class="tab"
                :class="{'active':type===1}"
                @click="type=1">原料</span>
              <span class="tab"
                :class="{'active':type===2}"
                @click="type=2">辅料</span>
            </div>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入物料按回车键查询"></el-input>
            <div class="btn btnGray"
              @click="reset"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn"
            style="color:#1a95ff;font-size:14px"
            v-if="update_time.date!=='0000-00-00'">
            更新日期：{{update_time.date.slice(0,16)}}
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">物料名称</span>
            </div>
            <div class="col">
              <span class="text">合计使用
                <span class="iconCtn"
                  @click="sortFn('HJSY')">
                  <i class="el-icon-caret-top"
                    :class="{'green':HJSY==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':HJSY==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">订购数量
                <span class="iconCtn"
                  @click="sortFn('DGSL')">
                  <i class="el-icon-caret-top"
                    :class="{'green':DGSL==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':DGSL==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">平均价格
                <span class="iconCtn"
                  @click="sortFn('PJJG')">
                  <i class="el-icon-caret-top"
                    :class="{'green':PJJG==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':PJJG==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">合计价格
                <span class="iconCtn"
                  @click="sortFn('HJJG')">
                  <i class="el-icon-caret-top"
                    :class="{'green':HJJG==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':HJJG==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">库存剩余
                <span class="iconCtn"
                  @click="sortFn('KCSY')">
                  <i class="el-icon-caret-top"
                    :class="{'green':KCSY==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':KCSY==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.name}}</div>
            <div class="col">{{$toFixed(item.use_total)}}</div>
            <div class="col">{{$toFixed(item.order_total)}}</div>
            <div class="col">{{$toFixed(item.pre_price)}}</div>
            <div class="col">{{$toFixed(item.total_price)}}</div>
            <div class="col">{{$toFixed(item.stock_number)}}</div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/financialStatistics/materialDetail/' + $strToAscII(item.name) + '/' + type)">详情</span>
            </div>
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
import { getHash } from '@/assets/js/common.js'
import { statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      date: '',
      keyword: '',
      pages: 1,
      total: 0,
      list: [],
      type: 1,
      HJSY: null,
      DGSL: null,
      PJJG: null,
      HJJG: null,
      KCSY: null,
      update_time: {
        date: '0000-00-00'
      }
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
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/financialStatistics/materialStatistics/page=' + pages + '&&keyword=' + this.$strToAscII(this.keyword) + '&&type=' + this.type + '&&HJSY=' + this.HJSY + '&&DGSL=' + this.DGSL + '&&PJJG=' + this.PJJG + '&&HJJG=' + this.HJJG + '&&KCSY=' + this.KCSY)
    },
    reset () {
      this.$router.push('/financialStatistics/materialStatistics/page=1&&keyword=&&type=1&&HJSY=&&DGSL=&&PJJG=&&HJJG=&&KCSY=')
    },
    getList () {
      this.loading = true
      statistics.materialList({
        keyword: this.keyword,
        type: this.type,
        is_search: (this.keyword ? 1 : 0)
      }).then((res) => {
        this.update_time = res.data.data.update_time
        let data = res.data.data.data
        let sortWhich = null
        let arr = ['HJSY', 'DGSL', 'PJJG', 'HJJG', 'KCSY']
        let json = {
          'HJSY': 'use_total',
          'DGSL': 'order_total',
          'PJJG': 'pre_price',
          'HJJG': 'total_price',
          'KCSY': 'stock_number'
        }
        arr.forEach((item) => {
          if (Number(this[item])) {
            sortWhich = item
          }
        })
        if (sortWhich) {
          data = data.sort((a, b) => {
            if (Number(this[sortWhich]) === 2) {
              return a[json[sortWhich]] - b[json[sortWhich]]
            } else {
              return b[json[sortWhich]] - a[json[sortWhich]]
            }
          })
        }
        this.list = data.filter((item, index) => {
          return index >= (this.pages - 1) * 10 && index < this.pages * 10
        })
        this.total = res.data.data.data.length
        this.loading = false
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = this.$strToAscII(params.keyword, true)
      this.HJSY = params.HJSY
      this.DGSL = params.DGSL
      this.PJJG = params.PJJG
      this.HJJG = params.HJJG
      this.KCSY = params.KCSY
      this.type = Number(params.type)
    },
    sortFn (item) {
      // 保证同时只会出现一种排序方式
      ['HJSY', 'DGSL', 'PJJG', 'HJJG', 'KCSY'].forEach((itemEach) => {
        if (item !== itemEach) {
          this[itemEach] = null
        }
      })
      this[item] = this[item] ? (this[item] === '1' ? '2' : '1') : '1'
      this.changeRouter(1)
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/materialStatistics.less";
</style>
