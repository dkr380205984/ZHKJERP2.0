<template>
  <div id='receiveDispatchList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入订单号按回车键查询">
              </el-input>
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
              <div class="resetBtn"
                @click="reset"
                style="width:82px;box-sizing:border-box">重置</div>
            </div>
          </div>
          <div class="leftCtn"
            style="display:flex;flex-direction:row;justify-content:flex-end">
            <div class="btn btnWhiteBlue"
              @click="$router.push('/receiveDispatch/batchXpOpration/1')">芯片入库</div>
            <div class="btn btnWhiteBlue"
              @click="$router.push('/receiveDispatch/batchXpOpration/2')">芯片出库</div>
            <div class="btn btnWhiteBlue"
              @click="$router.push('/receiveDispatch/batchXpOpration/3')">芯片回库</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">芯片编号</span>
            </div>
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">产品信息</span>
            </div>
            <div class="col">
              <span class="text">尺码颜色</span>
            </div>
            <div class="col">
              <span class="text">数量/捆数</span>
            </div>
            <div class="col">
              <span class="text">次品数/原因</span>
            </div>
            <div class="col">
              <span class="text">状态</span>
            </div>
            <!-- <div class="col">
              <span class="text">操作</span>
            </div> -->
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">
              {{(Array(8).join(0) + item.id).slice(-8)}}
            </div>
            <div class="col">
              {{item.order_code}}
            </div>
            <div class="col">
              <span>{{item.product_info.product_code}}</span>
              <span>({{item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name}})</span>
            </div>
            <div class="col">
              {{item.size_name + '/' + item.color_name}}
            </div>
            <div class="col">
              {{item.number}}({{item.count||0}}捆)
            </div>
            <div class="col"
              :style="{'color':item.shoddy_number&&Number(item.shoddy_number)>0?'#F5222D':'#ccc'}">
              {{item.shoddy_number||0}}<span v-if="item.shoddy_reason"
                style="color:#1a95ff;cursor:pointer"
                @click="$alert(item.shoddy_reason, '次品原因', {confirmButtonText: '确定'})">(查看)</span>
            </div>
            <div class="col">
              <div class="stateCtn"
                :class="{'green':item.is_chip===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_chip===1?'绑定日期：' + item.chip_time.slice(0,10):'未绑定'"
                  placement="top">
                  <span class="name">芯</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_weave_push===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_weave_push===1?'入库日期：' + item.weave_time.slice(0,10):'未入库'"
                  placement="top">
                  <span class="name">入</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_inspection===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_inspection===1?'检验日期：' + item.inspection_time.slice(0,10):'未检验'"
                  placement="top">
                  <span class="name">检</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_semi_pop===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_semi_pop===1?'出库日期：' + item.semi_pop_time.slice(0,10):'未出库'"
                  placement="top">
                  <span class="name">出</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_semi_push===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_semi_push===1?'回库日期：' + item.semi_push_time.slice(0,10):'未回库'"
                  placement="top">
                  <span class="name">回</span>
                </el-tooltip>
              </div>
            </div>
            <!-- <div class="col">
              <span class="opr">入库</span>
              <span class="opr">出库</span>
              <span class="opr">回库</span>
            </div> -->
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { receiveDispatch } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 10
    }
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
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
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/receiveDispatch/batchXpList/page=' + pages + '&&date=' + this.date + '&&keyword=' + this.keyword)
    },
    reset () {
      this.$router.push('/receiveDispatch/batchXpList/page=1&&date=&&keyword=')
    },
    getList () {
      this.loading = true
      receiveDispatch.allDetail({
        order_code: this.keyword,
        order_id: '',
        order_type: 1,
        limit: 10,
        page: this.pages,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
      }).then(res => {
        console.log(res)
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/receiveDispatch/receiveDispatchList.less";
.stateCtn {
  .name {
    cursor: pointer;
  }
}
</style>
