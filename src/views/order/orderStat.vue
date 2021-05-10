<template>
  <div id='orderList'
    class='indexMain'
    v-loading='loading'>
    <div class="chartsCtn">
      <div class="charts">
        <div class="title">
          <span>本月订单</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：当月订单需要完成的产品数量"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{monthAll}}</div>
        <!-- <v-chart style="width:320px;height:120px"
          :options="monthData" /> -->
        <!-- 为什么不用vue-echarts的组件：
                暂时没找到点击图例外触发click的方法-->
        <div style="width:320px;height:120px"
          ref="monthEcharts"></div>
      </div>
      <div class="charts">
        <div class="title">
          <span>进行中订单</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：未来14天内，订单需要完成数量，且状态为进行中订单"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{processAll}}</div>
        <!-- <v-chart style="width:320px;height:120px"
          :options="processData" /> -->
        <div style="width:320px;height:120px"
          ref="runingEcharts"></div>
      </div>
      <div class="charts">
        <div class="title">
          <span>逾期订单</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：过去14天内，订单暂未完成的数量，且状态为逾期中的订单"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{delayAll}}</div>
        <!-- <v-chart style="width:320px;height:120px"
          :options="delayData" /> -->
        <div style="width:320px;height:120px"
          ref="timeOutEcharts"></div>
      </div>
      <div class="charts">
        <div class="title">
          <span>完成进度</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：当月订单完成率。完成率 = 当月订单装箱数量/当月订单需完成数量"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{$toFixed(completeAll)}}%</div>
        <v-chart style="width:320px;height:120px"
          :options="completeData" />
      </div>
    </div>
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
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="left"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="changeRouter(1)">
              </el-date-picker>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
          </div>
        </div>
        <div class="addCtn"
          style="justify-content:space-between">
          <span class="btn noBorder listCutBtn"
            style="padding:0;margin:0"
            @click="$router.push('/order/orderList/page=1&&keyword=&&date=&&has_materialOrder=&&has_materialPlan=&&has_materialStock=&&has_weave=&&has_productInOut=&&has_inspection=&&has_boxing=&&group_id=&&company_id=&&state=&&searchOrderOrPro')">订单列表</span>
          <div class="btn btnBlue"
            @click="$router.push('/screenShipmentsList?keyword=' + keyword + '&start_time=' + (date[0] || '') + '&end_time=' + (date[1] || '') + '&group_id=' + group_id + '&company_id=' + company_id)">大屏模式</div>
        </div>
        <div class="list">
          <el-table :data="list"
            style="width: 100%">
            <el-table-column fixed
              prop="delivery_time"
              label="发货日期"
              width="150">
            </el-table-column>
            <el-table-column fixed
              prop="order_code"
              label="订单号"
              width="150">
            </el-table-column>
            <el-table-column fixed
              prop="client_name"
              label="外贸公司"
              width="150">
            </el-table-column>
            <el-table-column fixed
              prop="order_code"
              label="发货批次"
              width="150">
              <template slot-scope="scope">
                {{`第${scope.row.batch_id}批`}}
              </template>
            </el-table-column>
            <el-table-column label="产品图片"
              width="150"
              align="center">
              <template slot-scope="scope">
                <zh-img-list :list="scope.row.image"
                  type='open'></zh-img-list>
              </template>
            </el-table-column>
            <el-table-column prop="numbers"
              label="下单数量"
              width="120">
            </el-table-column>
            <el-table-column prop="order_time"
              label="流程进度"
              width="183">
              <template slot-scope="scope">
                <div style="display:flex">
                  <div class="stateCtn"
                    title="物料计划状态"
                    :class="{'green':scope.row.has_plan===1}">
                    <div class="state"></div>
                    <span class="name">计</span>
                  </div>
                  <div class="stateCtn"
                    title="原料入库状态"
                    :class="{'orange':scope.row.material_push_progress.r_push>0,'green':scope.row.material_push_progress.r_push>=100}">
                    <div class="state"></div>
                    <span class="name">入</span>
                  </div>
                  <div class="stateCtn"
                    title="原料出库状态"
                    :class="{'orange':scope.row.material_push_progress.r_pop>0,'green':scope.row.material_push_progress.r_pop>=100}">
                    <div class="state"></div>
                    <span class="name">出</span>
                  </div>
                  <div class="stateCtn"
                    title="半成品检验状态"
                    :class="{'orange':scope.row.product_push_progress>0,'green':scope.row.product_push_progress>=100}">
                    <div class="state"></div>
                    <span class="name">检</span>
                  </div>
                  <div class="stateCtn"
                    title="半成品回库状态"
                    :class="{'orange':scope.row.semi_push_progress>0,'green':scope.row.semi_push_progress>=100}">
                    <div class="state"></div>
                    <span class="name">回</span>
                  </div>
                  <div class="stateCtn"
                    title="成品装箱状态"
                    :class="{'orange':scope.row.pack_real_progress>0,'green':scope.row.pack_real_progress>=100}">
                    <div class="state"></div>
                    <span class="name">箱</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单状态"
              width="120">
              <template slot-scope="scope">
                <div class="stateCtn rowFlex"
                  :class="{'red':scope.row.status === 2003 || scope.row.status === 2005,'green':scope.row.status === 2004,'blue':scope.row.status === 2002,'orange':scope.row.status === 2001}">
                  <div class="state"
                    style="margin-left:0"></div>
                  <span class="name">{{scope.row.status|filterStatus}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="批次状态"
              width="120">
              <template slot-scope="scope">
                <div class="stateCtn rowFlex"
                  :class="{'red':scope.row.batch_status === 3 || scope.row.batch_status === 4,'green':scope.row.batch_status === 1,'blue':scope.row.batch_status === 2,'orange':scope.row.batch_status === 0}">
                  <div class="state"
                    style="margin-left:0"></div>
                  <span class="name">{{scope.row.batch_status|filterBatchStatus}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="order_time"
              label="下单日期"
              width="120">
            </el-table-column>
            <el-table-column label="已用工时"
              width="120">
              <template slot-scope="scope">
                {{scope.row.order_time|filterTime}}
              </template>
            </el-table-column>
            <el-table-column prop="group_name"
              label="负责小组"
              width="120">
            </el-table-column>
            <el-table-column label="操作"
              fixed="right"
              width="150">
              <template slot-scope="scope">
                <span class="tOpr"
                  @click="updatedOrderInfoEvent(scope.row)">更新进度</span>
                <span class="tOpr"
                  @click="$router.push('/order/orderDetail/' + scope.row.order_id)">详情</span>
              </template>
            </el-table-column>
          </el-table>
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
    <div class="popup"
      v-if="updatedOrderInfo">
      <div class="main"
        style="width: 800px;">
        <div class="title">
          <span class="text">添加订单最新进度</span>
          <span class="el-icon-close"
            @click="updatedOrderInfo = null"></span>
        </div>
        <div class="content"
          style="max-height: 500px;">
          <div class="row">
            <div class="label">当前订单批次：</div>
            <div class="info colCenter">{{`第${updatedOrderInfo.batch_id}批`}}</div>
          </div>
          <div class="row">
            <div class="label">最新进度描述：</div>
            <div class="info colCenter">
              <el-input v-model="updatedOrderInfo.desc"
                type="textarea"
                :rows="2"
                placeholder="请输入内容" />
            </div>
          </div>
          <div class="row">
            <div class="label">切换批次状态：</div>
            <div class="info colCenter">
              <el-select v-model="updatedOrderInfo.status"
                placeholder="请选择">
                <el-option v-for="item in [
                  { label: '进行中', value: 2 },
                  { label: '紧急', value: 3 },
                  { label: '已完成', value: 1 }
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">通知成员：</div>
            <div class="info colCenter">
              <div class="groupCtn">
                <!-- <span>{{itemG.name}}</span> -->
                <el-tag :class="`group_item ${checkedGroup === itemG.id ? 'active' : ''}`"
                  v-for="itemG in groupArrCom"
                  :key="itemG.id"
                  size="small"
                  :type='checkedGroup === itemG.id ? "" : "info"'
                  @click="checkedGroup = itemG.id">{{itemG.name}}</el-tag>
              </div>
              <div class="userCtn">
                <el-checkbox v-model="checkedAll"
                  :indeterminate="indeterminate"
                  label='全选'
                  @change="checkedAllChange" />
                <el-checkbox v-for="itemU in userArrCom"
                  @change="isCheckedAll"
                  :key="itemU.id"
                  v-model="itemU.checked"
                  :label='itemU.name' />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="label">已选成员：</div>
            <div class="info colCenter">
              <div class="groupCtn">
                <!--
                  不知道为什么 userArr.filter(itemF => itemF.checked) 写在computed中有时会过滤不了
                   -->
                <template v-if="userArr.filter(itemF => itemF.checked).length !== 0">
                  <!-- <span :class="`group_item`"
                    v-for="itemG in userArr.filter(itemF => itemF.checked)"
                    :key="itemG.id">{{itemG.name}}</span> -->
                  <el-tag v-for="itemG in userArr.filter(itemF => itemF.checked)"
                    class="group_item"
                    :key="itemG.id"
                    size="small"
                    closable
                    @close='deleteCheckedUser(itemG)'>
                    {{itemG.name}}
                  </el-tag>
                </template>
                <span style="color:#B9B9B9"
                  v-else>暂无</span>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="updatedOrderInfo = null">取消</div>
          <div class="btn btnBlue"
            @click="updatedBatchStatus">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { orderBatch, group, client, chartsAPI, auth } from '@/assets/js/api.js'
export default {
  data () {
    return {
      processData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 24, // 左
          y: 20, // 上
          x2: 24, // 右
          y2: 10 // 下
        },
        xAxis: {
          data: [],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '订单数量',
          data: [],
          type: 'bar',
          barMinHeight: 2,
          itemStyle: {
            color: '#1a95ff'
          }
        }]
      },
      processAll: 0,
      delayData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 24, // 左
          y: 20, // 上
          x2: 24, // 右
          y2: 10 // 下
        },
        xAxis: {
          data: [],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '订单数量',
          data: [],
          type: 'bar',
          barMinHeight: 2,
          itemStyle: {
            color: '#FA9036'
          }
        }]
      },
      delayAll: 0,
      completeData: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} :{c} ({d})%'
        },
        legend: {
          orient: 'vertical',
          left: 24,
          top: 20,
          data: ['已完成', '未完成']
        },
        color: ['#1A95FF', '#E6A23C', '#01B48C'],
        series: [
          {
            name: '完成率',
            type: 'pie',
            radius: '55%',
            center: ['65%', '50%'],
            data: [
              { value: 0, name: '已完成' },
              { value: 0, name: '未完成' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            minAngle: [10]
          }
        ]
      },
      completeAll: 0,
      monthData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 24, // 左
          y: 20, // 上
          x2: 24, // 右
          y2: 10 // 下
        },
        xAxis: {
          data: [],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '发货数量',
          data: [],
          type: 'line',
          symbol: 'none',
          smooth: true,
          areaStyle: {
            color: '#1a95ff'
          },
          itemStyle: {
            color: '#1a95ff'
          },
          lineStyle: {
            width: 2
          },
          smoothMonotone: 'x'
        }]
      },
      monthAll: 0,
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0,
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [end, start])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [end, start])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [end, start])
          }
        }]
      },
      // 更新订单批次进度字段
      updatedOrderInfo: null, // null的时候关闭弹窗
      checkedGroup: '',
      checkedAll: false,
      indeterminate: false,
      userArr: []

    }
  },
  watch: {
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getOrderList()
    },
    checkedGroup () {
      this.isCheckedAll()
    }
  },
  methods: {
    deleteCheckedUser (item) {
      item.checked = false
      this.$forceUpdate()
    },
    updatedBatchStatus () {
      if (this.$submitLock()) return
      if (!this.updatedOrderInfo.status) {
        this.$message.warning('请选择批次状态')
        return
      }
      orderBatch.changeProg({
        order_batch_id: this.updatedOrderInfo.id,
        number: this.updatedOrderInfo.batch_id,
        order_id: this.updatedOrderInfo.order_id,
        status: this.updatedOrderInfo.status,
        users: this.userArr.filter(itemM => itemM.checked).map(itemM => itemM.id),
        description: this.updatedOrderInfo.desc,
        router_url: `/order/orderDetail/${this.updatedOrderInfo.order_id}`
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('更新成功')
          this.updatedOrderInfo = null
          this.getOrderList()
        }
      })
    },
    checkedAllChange (event) {
      this.userArrCom.forEach(itemM => { itemM.checked = event })
      // this.userArrCom.forEach(itemF => {
      //   const finded = this.userArr.find(itemFind => itemFind.id === itemF.id)
      //   if (finded) {
      //     finded.checked = event
      //   }
      // })
      // this.isCheckedAll()
      // this.$forceUpdate()
    },
    isCheckedAll () {
      const checkedNum = this.userArrCom.filter(itemF => itemF.checked).length
      if (checkedNum === 0) {
        this.checkedAll = false
        this.indeterminate = false
      } else if (checkedNum === this.userArrCom.length) {
        this.checkedAll = true
        this.indeterminate = false
      } else {
        this.checkedAll = false
        this.indeterminate = true
      }
      this.$forceUpdate()
    },
    updatedOrderInfoEvent (item) {
      this.userArr.forEach(item => {
        item.checked = false
      })
      this.isCheckedAll()
      this.updatedOrderInfo = {
        order_id: item.order_id,
        id: item.id,
        batch_id: item.batch_id,
        desc: '',
        status: item.batch_status || ''
      }
    },
    closeUpdatedOrderInfoPopup () {
      this.updatedOrderInfo = null
      this.userArr.forEach(itemM => { itemM.checked = false })
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
    getFilters () {
      let params = this.$route.query
      this.pages = Number(params.page) || 1
      this.keyword = params.keyword || ''
      if (params.date && params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.group_id = params.group_id ? Number(params.group_id) : ''
      this.company_id = (params.company_id && params.company_id.split(',')) || ''
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/order/orderStat?page=' + pages + '&keyword=' + this.keyword + '&date=' + this.date + '&group_id=' + this.group_id + '&company_id=' + this.company_id)
    },
    reset () {
      this.$router.push('/order/orderStat')
    },
    getOrderList () {
      this.loading = true
      orderBatch.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id && this.company_id[1],
        group_id: this.group_id
      }).then(res => {
        res.data.data.forEach(item => {
          item.image = []
          item.image = this.$flatten(this.$mergeData(item.product_info, { mainRule: 'product_id', otherRule: [{ name: 'image' }] }).map(item => {
            item.image.map(itemI => {
              itemI.product_id = item.product_id
              return itemI
            })
            return item.image
          }))
        })
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    filterStatus (item) { // item 参数1:交货时间；参数2：订单状态
      if (Array.isArray(item)) {
        let nowTime = new Date(this.$getTime()).getTime()
        let compileTime = new Date(this.$getTime(item[0])).getTime()
        let status = +item[1]
        if (status === 2004) {
          return ['已完成', 'green']
        } else if (((compileTime - nowTime) / 1000 / 60 / 60 / 24) <= 3 && ((compileTime - nowTime) / 1000 / 60 / 60 / 24) >= 0) {
          return ['即将发货', 'orange']
        } else if (compileTime >= nowTime) {
          return ['进行中', 'blue']
        } else if (nowTime > compileTime) {
          return ['已逾期', 'red']
        }
      } else {
        return ['undefined', 'orange']
      }
    },
    createMonthDay () {
      let daysOfMonth = []
      let fullYear = new Date().getFullYear()
      let month = new Date().getMonth() + 1
      let lastDayOfMonth = new Date(fullYear, month, 0).getDate()
      for (var i = 1; i <= lastDayOfMonth; i++) {
        daysOfMonth.push(fullYear + '-' + (month < 10 ? '0' + month : month) + '-' + (i < 10 ? '0' + i : i))
      }
      return daysOfMonth
    },
    clickEcharts (event, echart, type) {
      if (type === 'month') {
        let XY = [event.offsetX, event.offsetY]
        let day = echart.convertFromPixel({ seriesIndex: 0 }, XY)[0] + 1
        let nowTime = this.$getTime().split('-')
        let nowYM = nowTime[0] + '-' + nowTime[1]
        let date = nowYM + '-' + (day.length > 1 ? '0' + day : day)
        this.date = [date, date]
        this.keyword = ''
        this.group_id = ''
        this.company_id = ''
      } else if (type === 'runing') {
        let XY = [event.offsetX, event.offsetY]
        let index = echart.convertFromPixel({ seriesIndex: 0 }, XY)[0]
        let date = this.$getTime(new Date(this.$getTime()).getTime() + (index * 1000 * 60 * 60 * 24))
        this.date = [date, date]
        this.keyword = ''
        this.group_id = ''
        this.company_id = ''
        // this.state = '2002'
        // this.searchState2Flag = true
      } else if (type === 'timeOut') {
        let XY = [event.offsetX, event.offsetY]
        let index = echart.convertFromPixel({ seriesIndex: 0 }, XY)[0]
        let date = this.$getTime(new Date(this.$getTime()).getTime() - ((14 - index - 1) * 1000 * 60 * 60 * 24))
        this.date = [date, date]
        this.keyword = ''
        this.group_id = ''
        this.company_id = ''
        // this.state = '2005'
        // this.searchState2Flag = true
      }
      this.changeRouter(1)
    },
    initEcharts () {
      let _this = this
      let echarts = require('echarts')
      let monthEcharts = echarts.init(this.$refs.monthEcharts)
      monthEcharts.setOption(this.monthData)
      monthEcharts.getZr().on('click', (event) => {
        _this.clickEcharts(event, monthEcharts, 'month')
      })
      let runingEcharts = echarts.init(this.$refs.runingEcharts)
      runingEcharts.setOption(this.processData)
      runingEcharts.getZr().on('click', (event) => {
        _this.clickEcharts(event, runingEcharts, 'runing')
      })
      let timeOutEcharts = echarts.init(this.$refs.timeOutEcharts)
      timeOutEcharts.setOption(this.delayData)
      timeOutEcharts.getZr().on('click', (event) => {
        _this.clickEcharts(event, timeOutEcharts, 'timeOut')
      })
    }
  },
  created () {
    // this.updatedOrderInfo = {}
    // this.loading = false
    this.getFilters()
    this.getOrderList()
    Promise.all([
      group.list(),
      client.list(),
      auth.list()
    ]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = this.$getClientOptions(res[1].data.data, companyType, { type: [1, 2] })
      this.userArr = res[2].data.data
    })
    let today = new Date()
    let todayMore14 = [this.$getTime(today)]
    let todayLess14 = [this.$getTime(today)]
    let monthArr = this.createMonthDay()
    for (let i = 1; i < 14; i++) {
      todayLess14.push(this.$getTime(today.getTime() - 24 * 60 * 60 * 1000 * i))
      todayMore14.push(this.$getTime(today.getTime() + 24 * 60 * 60 * 1000 * i))
    }
    todayLess14 = todayLess14.reverse()
    chartsAPI.order().then((res) => {
      let data = res.data.data
      this.processData.xAxis.data = todayMore14
      todayMore14.forEach((item) => {
        this.processData.series[0].data.push(data.proceed.day_number[item] || 0)
      })
      this.delayData.xAxis.data = todayLess14
      todayLess14.forEach((item) => {
        this.delayData.series[0].data.push(data.delay.day_number[item] || 0)
      })
      this.monthData.xAxis.data = monthArr
      monthArr.forEach((item) => {
        this.monthData.series[0].data.push(data.month.day_number[item] || 0)
      })
      this.completeData.series[0].data = [
        { value: data.progress.pack_real, name: '已完成' },
        { value: data.month.total_number - data.progress.pack_real, name: '未完成' }
      ]
      this.completeAll = data.progress.pack_real / data.month.total_number * 100
      this.processAll = data.proceed.total_number
      this.delayAll = data.delay.total_number
      this.monthAll = data.month.total_number
      this.initEcharts()
    })
  },
  filters: {
    filterTime (item) {
      let nowTime = new Date()
      let orderTime = new Date(item)
      if (orderTime) {
        return Math.ceil((nowTime.getTime() - orderTime.getTime()) / 1000 / 60 / 60 / 24) + '天'
      } else {
        return 'null'
      }
    },
    filterStatus (status) {
      if (status === 2001) {
        return '已创建'
      } else if (status === 2002) {
        return '进行中'
      } else if (status === 2003) {
        return '已取消'
      } else if (status === 2004) {
        return '已完成'
      } else if (status === 2005) {
        return '已延期'
      }
    },
    filterBatchStatus (status) {
      if (status === 0) {
        return '已创建'
      } else if (status === 2) {
        return '进行中'
      } else if (status === 4) {
        return '已取消'
      } else if (status === 1) {
        return '已完成'
      } else if (status === 3) {
        return '紧急'
      }
    }
  },
  computed: {
    userArrCom () {
      return this.checkedGroup ? this.userArr.filter(itemF => itemF.group_id === this.checkedGroup) : this.userArr
    },
    groupArrCom () {
      return [{ id: '', name: '所有' }].concat(this.$unique(this.userArr, 'group_id').map(itemM => ({ id: itemM.group_id, name: itemM.group })))
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderStat.less";
</style>
