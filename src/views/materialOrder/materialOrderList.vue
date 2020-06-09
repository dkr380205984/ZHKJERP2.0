<template>
  <div id="materialOrderList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
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
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">订购日期</span>
            </div>
            <div class="col">
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
            <div class="col">
              <span class="text">包含纱线</span>
            </div>
            <!-- <div class="col">
              <span class="text">预付款(元)</span>
            </div> -->
            <div class="col">
              <span class="text">预定总量(kg)</span>
            </div>
            <div class="col">
              <span class="text">已入库量(kg)</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">
              <span class="text">{{item.order_time}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.client_name}}</span>
            </div>
            <div class="col">
              <span class="text">
                {{item.material_info.map(item=>item.material_name).join(',').slice(0,10)}}
                <template v-if="item.material_info.map(item=>item.material_name).join(',').length>10">
                  <el-tooltip placement="top">
                    <div slot="content"
                      v-html="item.material_info.map(item=>item.material_name + '<br />').join('')">
                    </div>
                    <span class="btn noBorder"
                      style="padding:0">查看全部</span>
                  </el-tooltip>
                </template>
              </span>
            </div>
            <!-- <div class="col">
              <span class="text">{{item.total_price}}</span>
            </div> -->
            <div class="col">
              <span class="text">{{item.total_weight}}</span>
            </div>
            <div class="col">
              <span class="text"
                :class="{
                'red':item.stock_number>item.total_weight,
                'green':item.stock_number===item.total_weight,
                'blue':item.stock_number<item.total_weight,
              }">{{item.stock_number}}</span>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/materialOrder/materialOrderDetail/'+item.id)">入库</span>
              <span class="opr"
                @click="$router.push('/materialOrder/materialOrderUpdate/'+item.id)">修改</span>
              <span class="opr"
                @click="$openUrl('/materialOrderTable/'+item.id)">打印</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialOrder, client } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      date: '',
      list: [],
      page: 1,
      total: 0,
      client_id: '',
      company_id: '',
      companyArr: [],
      searchCompanyFlag: false
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
    getList () {
      this.loading = true
      materialOrder.list({
        limit: 10,
        page: this.page,
        client_id: this.company_id,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
      }).then((res) => {
        console.log(res)
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.company_id = params.client_id
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/materialOrder/materialOrderList/page=' + pages + '&&client_id=' + this.company_id + '&&date=' + this.date)
    },
    reset () {
      this.$router.push('/materialOrder/materialOrderList/page=1&&client_id=&&date=')
    }
  },
  created () {
    this.getFilters()
    this.getList()
    client.list().then((res) => {
      this.companyArr = res.data.data.filter((item) => {
        return item.type.indexOf(2) !== -1
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/materialOrder/materialOrderList.less";
</style>
