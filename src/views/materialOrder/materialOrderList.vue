<template>
  <div id="materialOrderList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <span class="filter_line">
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
                @click="reset">重置</div>
            </span>
          </div>
          <div class="addCtn">
            <span class="btn btnWhiteBlue"
              @click="$router.push('/materialOrder/materialOrderCreate')">添加预定购</span>
            <span class="btn btnWhiteBlue"
              @click="getLogList(1)">查看预定购日志</span>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">订购日期</span>
            </div>
            <div class="col">
              <span class="text">外贸公司</span>
            </div>
            <div class="col">
              <span class="text">包含纱线</span>
            </div>
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
              <span class="opr orange"
                @click="$router.push('/materialOrder/materialOrderUpdate/'+item.id)">修改</span>
              <span class="opr"
                style="color:#01B48C"
                @click="$openUrl('/materialOrderTable/'+item.id)">打印</span>
              <span class="opr red"
                @click="deleteLog(item.id)">删除</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showMaterialOrderLogPopup">
      <div class="main"
        style="width:1024px;">
        <div class="title">
          <div class="text">预定购入库日志</div>
          <i class="el-icon-close"
            @click="showMaterialOrderLogPopup=false"></i>
        </div>
        <div class="content"
          style="max-height:580px"
          v-loading='logLoading'>
          <div class="row"
            style="height:32px">
            <div class="col">
              <zh-input placeholder="筛选物料名称"
                v-model="logSearchWord"
                @change="getLogList(1)"
                clearable></zh-input>
            </div>
            <div class="col"
              style="margin-left:16px">
              <el-cascader v-model="logClient"
                class="filter_item"
                :show-all-levels='false'
                placeholder="筛选纱线单位"
                :options="companyArr"
                :filter-method='searchClient'
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="getLogList(1)"
                filterable></el-cascader>
            </div>
            <div class="col"
              style="margin-left:16px">
              <el-select v-model="logStock"
                @change="getLogList(1)"
                placeholder="筛选入库仓库"
                clearable>
                <el-option v-for="(item,index) in stockList"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="col"
              style="margin-left:16px">
              <el-date-picker v-model="logDate"
                style="height:32px"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getLogList(1)"
                clearable>
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="tableCtnLv2 minHeight5">
              <div class="tb_content">
                <span class="tb_row">订购日期</span>
                <span class="tb_row">纱线单位</span>
                <span class="tb_row">物料名称</span>
                <span class="tb_row">物料颜色</span>
                <span class="tb_row">物料价格</span>
                <span class="tb_row">入库数量</span>
                <span class="tb_row">入库仓库</span>
                <span class="tb_row">备注</span>
                <span class="tb_row">操作人</span>
                <span class="tb_row">操作时间</span>
                <span class="tb_row">操作</span>
              </div>
              <div class="tb_content"
                v-for="(itemLog,indexLog) in logList"
                :key="indexLog">
                <span class="tb_row">{{itemLog.order_time}}</span>
                <span class="tb_row">{{itemLog.client_name}}</span>
                <span class="tb_row">{{itemLog.material_name}}</span>
                <span class="tb_row">{{itemLog.color_code}}</span>
                <span class="tb_row">{{itemLog.price}}</span>
                <span class="tb_row">{{itemLog.weight}}</span>
                <span class="tb_row">{{itemLog.stock_name}}</span>
                <span class="tb_row middle">
                  <!-- <template v-if="!itemLog.desc"></template> -->
                  <el-popover placement="top-start"
                    v-if="itemLog.desc"
                    title="备注"
                    width="200"
                    trigger="hover"
                    :content="itemLog.desc">
                    <div class="btn noBorder"
                      style="padding:0;margin:0"
                      slot="reference">查看</div>
                  </el-popover>
                </span>
                <span class="tb_row">{{itemLog.user_name}}</span>
                <span class="tb_row">{{$getTime(itemLog.create_time)}}</span>
                <span class="tb_row">
                  <span class="text"
                    style="cursor:pointer;color:#1a95ff"
                    @click="$router.push('/materialOrder/materialOrderDetail/' + itemLog.pid)">详情</span>
                </span>
              </div>
              <div class="tb_content">
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row">合计总价</span>
                <span class="tb_row">{{totalPrice}}元</span>
                <span class="tb_row">合计入库数量</span>
                <span class="tb_row">{{totalNumber}}kg</span>
              </div>
              <div class="tb_content">
                <span class="tb_row right">
                  <el-pagination background
                    :page-size="5"
                    layout="prev, pager, next"
                    :total="logTotal"
                    :current-page.sync="logPages"
                    @current-change="getLogList">
                  </el-pagination>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { materialOrder, client, stock } from '@/assets/js/api.js'
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
      searchCompanyFlag: false,
      // 弹窗日志数据
      showMaterialOrderLogPopup: false,
      logLoading: false,
      logList: [],
      logDate: '',
      logSearchWord: '',
      logClient: '',
      logStock: '',
      logUser: '',
      logPages: 1,
      logTotal: 1,
      totalPrice: 0,
      totalNumber: 0,
      stockList: []
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
    deleteLog (id) {
      this.$confirm('是否删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        materialOrder.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
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
    getList () {
      this.loading = true
      materialOrder.list({
        limit: 10,
        page: this.page,
        client_id: this.company_id && this.company_id[1],
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
      this.company_id = params.client_id.split(',')
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/materialOrder/materialOrderList/page=' + pages + '&&client_id=' + this.company_id + '&&date=' + this.date)
    },
    reset () {
      this.$router.push('/materialOrder/materialOrderList/page=1&&client_id=&&date=')
    },
    getLogList (page) {
      if (!this.showMaterialOrderLogPopup) {
        this.showMaterialOrderLogPopup = true
      }
      if (this.stockList.length === 0) {
        stock.list({ type: [1] }).then(res => {
          this.stockList = res.data.data
        })
      }
      this.logLoading = true
      materialOrder.allLog({
        material_name: this.logSearchWord,
        client_id: this.logClient,
        start_time: this.logDate ? this.logDate[0] : '',
        end_time: this.logDate ? this.logDate[1] : '',
        stock_id: this.logStock,
        limit: 5,
        page: page || this.logPages
      }).then(res => {
        if (res.data.status !== false) {
          this.logList = res.data.data
          this.logTotal = res.data.meta.total
          this.totalPrice = res.data.total_price
          this.totalNumber = res.data.total_weight
        }
        this.logLoading = false
      })
    }
  },
  created () {
    this.getFilters()
    client.list().then((res) => {
      this.companyArr = this.$getClientOptions(res.data.data, companyType, { type: [3, 4] })
      this.getList()
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/materialOrder/materialOrderList.less";
</style>
