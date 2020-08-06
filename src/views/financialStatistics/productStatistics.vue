<template>
  <div class="indexMain"
    id="productStatistics">
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
      <div class="cut_item active">
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
      <div class="cut_item "
        @click="$router.push('/financialStatistics/logStatistics/page=1&&type=物料订购&&date=&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=')">
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
        <div class="addCtn">
          <div style="color:#1a95ff;font-size:14px"
            v-if="update_time.date!=='0000-00-00'">
            更新日期：{{$getTime(update_time)}}
          </div>
        </div>
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入产品编号按回车键查询"></el-input>
              <el-cascader class="filter_item"
                v-model="type"
                placeholder="筛选品类"
                :options="typeArr"
                @change="getType"
                clearable
                filterable>
              </el-cascader>
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
              <span class="text">产品编号</span>
            </div>
            <div class="col"
              style="flex:1.5">
              <span class="text">品类</span>
            </div>
            <div class="col">
              <span class="text middle">产品图片</span>
            </div>
            <div class="col">
              <span class="text">下单总数
                <span class="iconCtn"
                  @click="sortFn('XDZS')">
                  <i class="el-icon-caret-top"
                    :class="{'green':XDZS==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':XDZS==='2'}"></i>
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
              <span class="text">合计产值
                <span class="iconCtn"
                  @click="sortFn('HJCZ')">
                  <i class="el-icon-caret-top"
                    :class="{'green':HJCZ==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':HJCZ==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">次品率
                <span class="iconCtn"
                  @click="sortFn('CPL')">
                  <i class="el-icon-caret-top"
                    :class="{'green':CPL==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':CPL==='2'}"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">库存数量
                <span class="iconCtn"
                  @click="sortFn('KCSL')">
                  <i class="el-icon-caret-top"
                    :class="{'green':KCSL==='1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':KCSL==='2'}"></i>
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
            <div class="col">
              <span class="text">{{item.product_code}}</span>
            </div>
            <div class="col"
              style="flex:1.5">
              <span class="text">{{item.category_info.category_name}}/{{item.category_info.type_name}}/{{item.category_info.style_name}}</span>
            </div>
            <div class="col">
              <zh-img-list :list="item.image"></zh-img-list>
            </div>
            <div class="col">
              <span class="text">{{item.order_number}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.pre_price}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.total_price}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.shoddy_goods*100 + '%'}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.stock_number}}</span>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/product/productDetail/' + item.id)">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { productType, statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      date: '',
      keyword: '',
      page: 1,
      total: 0,
      list: [],
      searchTypeFlag: false,
      typeArr: [],
      type: [],
      category_id: '',
      type_id: '',
      style_id: '',
      XDZS: null, // 1是升序，2是降序,null是默认
      PJJG: null,
      HJCZ: null,
      CPL: null,
      KCSL: null,
      update_time: {
        date: '0000-00-00'
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
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/financialStatistics/productStatistics/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&category_id=' + this.category_id + '&&type_id=' + this.type_id + '&&style_id=' + this.style_id + '&&XDZS=' + this.XDZS + '&&PJJG=' + this.PJJG + '&&HJCZ=' + this.HJCZ + '&&CPL=' + this.CPL + '&&KCSL=' + this.KCSL)
    },
    reset () {
      this.$router.push('/financialStatistics/productStatistics/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&XDZS=&&PJJG=&&HJCZ=&&CPL=&&KCSL=')
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
      statistics.productList({
        is_search: this.keyword || this.date.length > 0 || this.category_id || this.type_id || this.style_id,
        keyword: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        category_id: this.category_id,
        type_id: this.type_id,
        style_id: this.style_id
      }).then((res) => {
        this.update_time = res.data.data.update_time
        let data = res.data.data.data
        let sortWhich = null
        let arr = ['XDZS', 'PJJG', 'HJCZ', 'CPL', 'KCSL']
        let json = {
          'XDZS': 'order_number',
          'PJJG': 'pre_price',
          'HJCZ': 'total_price',
          'CPL': 'shoddy_goods',
          'KCSL': 'stock_number'
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
          return index >= (this.page - 1) * 10 && index < this.page * 10
        })
        this.total = res.data.data.data.length
        this.loading = false
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      this.XDZS = params.XDZS
      this.PJJG = params.PJJG
      this.HJCZ = params.HJCZ
      this.CPL = params.CPL
      this.KCSL = params.KCSL
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
    },
    sortFn (item) {
      // 保证同时只会出现一种排序方式
      ['XDZS', 'PJJG', 'HJCZ', 'CPL', 'KCSL'].forEach((itemEach) => {
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
