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
        <div class="addCtn">
          <div class="btn btnBlue"
            @click="$router.push('/screenShipmentsList?keyword=' + keyword + '&start_time=' + (date[0] || '') + '&end_time=' + (date[1] || '') + '&group_id=' + group_id + '&company_id=' + company_id)">大屏模式</div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">发货日期</span>
            </div>
            <div class="col flex12">
              <span class="text">订单号</span>
            </div>
            <div class="col flex12">
              <span class="text">外贸公司</span>
            </div>
            <div class="col middle flex12">
              <span class="text">产品图片</span>
            </div>
            <div class="col flex08">
              <span class="text"
                style="line-height:1.2em">批次<br />订单数量</span>
            </div>
            <div class="col flex08">
              <span class="text">负责小组</span>
            </div>
            <div class="col flex16">
              <span class="text">流程进度</span>
            </div>
            <div class="col">
              <span class="text"
                style="line-height:1.2em">已用工时<br />下单日期</span>
            </div>
            <div class="col">
              <span class="text">当前状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col"> {{itemOrder.delivery_time}} </div>
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle flex12">
              <zh-img-list :list="itemOrder.image"
                type='open'></zh-img-list>
            </div>
            <div class="col flex08"> {{'第' + itemOrder.batch_id + '批'}}<br />{{itemOrder.numbers}}</div>
            <div class="col flex08"> {{itemOrder.group_name}} </div>
            <div class="col flex16">
              <div class="stateCtn"
                :class="{'green':itemOrder.has_plan>0}">
                <div class="state"></div>
                <span class="name">计</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.material_order_progress.y_percent>0,'green':itemOrder.material_order_progress.y_percent>=100}">
                <div class="state"></div>
                <span class="name">订</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.material_push_progress.r_push>0,'green':itemOrder.material_push_progress.r_push>=100}">
                <div class="state"></div>
                <span class="name">库</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.product_weave_progress.product>0,'green':itemOrder.product_weave_progress.product>=100}">
                <div class="state"></div>
                <span class="name">织</span>
              </div>
              <div class="stateCtn"
                :class="{'orange':itemOrder.product_push_progress>0,'green':itemOrder.product_push_progress>=100}">
                <div class="state"></div>
                <span class="name">收</span>
              </div>
              <!-- <div class="stateCtn"
                :class="{'orange':itemOrder.product_inspection_progress.r_product>0,'green':itemOrder.product_inspection_progress.r_product>=100}">
                <div class="state"></div>
                <span class="name">检</span>
              </div> -->
              <div class="stateCtn"
                :class="{'orange':itemOrder.pack_real_progress>0,'green':itemOrder.pack_real_progress>=100}">
                <div class="state"></div>
                <span class="name">箱</span>
              </div>
            </div>
            <div class="col"
              :class="filterStatus([itemOrder.delivery_time,itemOrder.status])[1]"> {{itemOrder.order_time|filterTime}}<br />{{itemOrder.order_time}} </div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="filterStatus([itemOrder.delivery_time,itemOrder.status])[1]">
                <div class="state"></div>
                <span class="name">{{filterStatus([itemOrder.delivery_time,itemOrder.status])[0]}}</span>
              </div>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/order/orderDetail/' + itemOrder.order_id)">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="changeRouter(pages)">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { getHash } from '@/assets/js/common.js'
import { orderBatch, group, client, chartsAPI } from '@/assets/js/api.js'
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
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
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
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.group_id = params.group_id ? Number(params.group_id) : ''
      this.company_id = params.company_id.split(',')
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/order/orderStat/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id)
    },
    reset () {
      this.$router.push('/order/orderStat/page=1&&keyword=&&date=&&group_id=&&company_id=')
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
    this.getFilters()
    this.getOrderList()
    Promise.all([
      group.list(),
      client.list()
    ]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = this.$getClientOptions(res[1].data.data, companyType, { type: [1, 2] })
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
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderList.less";
</style>
