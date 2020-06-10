<template>
  <div id="chartIndex"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">订单产值产量</span>
      </div>
      <div class="chartCtn"
        v-loading='productionLoading'>
        <div class="leftCtn">
          <div class="infoLine"
            style="display:flex;align-items:center">
            <el-select v-model="client_name_orderProduction"
              style="width:200px;margin-right:16px"
              filterable
              placeholder="请输入公司名称搜索"
              @change="getOrderProductionInfo($event,year_orderProduction)">
              <el-option v-for="item in clientList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-date-picker v-model="year_orderProduction"
              type="year"
              value-format="yyyy"
              :clearable="false"
              placeholder="选择年份"
              @change="getOrderProductionInfo(client_name_orderProduction,$event)">
            </el-date-picker>
            <div class="textInfo">
              <span class="label">总产量：</span>
              <span class="text">{{productionTotalNumber}}</span>
              <span class="unit">件</span>
            </div>
            <div class="textInfo">
              <span class="label">总产值：</span>
              <span class="text">{{productionTotalPrice}}</span>
              <span class="unit">元</span>
            </div>
          </div>
          <v-chart style="width:100%;height:240px"
            :options="orderProductionData" />
        </div>
        <!-- <div class="rightCtn">
          <div class="title">订单数量排名</div>
          <el-autocomplete class="inputs"
            v-model="client_name"
            :fetch-suggestions="querySearchClient"
            placeholder="请输入公司名称搜索"></el-autocomplete>
          <el-input class="inputs"
            placeholder="请输入公司名称搜索"
            v-model="client_name"></el-input>
          <div class="list">
            <div class="once">
              <span class="circle blue">1</span>
              <span class="name">杭州飞泰服饰</span>
              <span class="number">123456</span>
            </div>
            <div class="once">
              <span class="circle blue">2</span>
              <span class="name">杭州飞泰服饰</span>
              <span class="number">123456</span>
            </div>
            <div class="once">
              <span class="circle blue">3</span>
              <span class="name">杭州飞泰服饰</span>
              <span class="number">123456</span>
            </div>
            <div class="once">
              <span class="circle gray">4</span>
              <span class="name">杭州飞泰服饰</span>
              <span class="number">123456</span>
            </div>
            <div class="once">
              <span class="circle gray">5</span>
              <span class="name">杭州飞泰服饰</span>
              <span class="number">123456</span>
            </div>
            <div class="once">
              <span class="circle gray">6</span>
              <span class="name">杭州飞泰服饰</span>
              <span class="number">123456</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">公司分析</span>
      </div>
      <div class="chartCtn"
        v-loading='companyAnalyseLoading'>
        <div class="leftCtn"
          style="flex:5">
          <v-chart style="width:100%;height:380px"
            :options="companyData" />
        </div>
        <div class="rightCtn"
          style="flex:5">
          <div class="title"
            style="display:flex">搜索公司：
            <zh-input placeholder="请选择公司名称"
              style="display:inline-block;width:550px"
              v-model="client_name_analyse"></zh-input>
          </div>
          <div class="list"
            style="max-height:300px;overflow:auto;">
            <div class="once"
              v-for="(itemClient,indexClient) in clientListAnalyseArr"
              :key="indexClient">
              <span style="margin-right:16px">
                <el-checkbox v-model="itemClient.checked"
                  @change="checkedChange(itemClient,itemClient.id)"></el-checkbox>
              </span>
              <span>
                {{itemClient.name}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">生产织造计划日期单</span>
      </div>
      <div class="chartCtn">
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">发货日历</span>
        <el-switch v-model="calendarShowType"
          active-text="按月展示"
          inactive-text="按年展示">
        </el-switch>
      </div>
      <div class="chartCtn">
        <!-- 按月展示 -->
        <div class="leftCtn"
          v-if="calendarShowType">
          <div class="infoLine"
            style="display:flex;align-items:center">
            <el-date-picker v-model="calendar_filter_month"
              type="month"
              :clearable="false"
              value-format="MM"
              placeholder="选择月">
            </el-date-picker>
            <!-- <el-date-picker v-model="year_orderProduction"
              type="year"
              value-format="yyyy"
              :clearable="false"
              placeholder="选择年份"
              @change="getOrderProductionInfo(client_name_orderProduction,$event)">
            </el-date-picker> -->
          </div>
          <v-chart style="margin:0 auto;width:440px;height:320px"
            :options="calendarMonthData" />
        </div>
        <!-- 按年展示 -->
        <div class="leftCtn"
          v-else>
          <div class="infoLine"
            style="display:flex;align-items:center">
            <el-date-picker v-model="calendar_filter_year"
              type="year"
              value-format="yyyy"
              :clearable="false"
              placeholder="选择年份">
            </el-date-picker>
          </div>
          <v-chart style="width:100%;height:320px"
            :options="calendarYearData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { client, echartsApi } from '@/assets/js/api.js'
export default {
  data () {
    return {
      // 订单产值产量
      productionLoading: false,
      productionTotalNumber: 0,
      productionTotalPrice: 0,
      orderProductionData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 40, // 左
          y: 30, // 上
          x2: 40, // 右
          y2: 30 // 下
        },
        legend: {
          data: ['产值', '产量']
        },
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: [{
          name: '产值',
          max: Math.max(...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          min: 0,
          type: 'value'
        }, {
          name: '产量',
          max: Math.max(...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          min: 0,
          type: 'value'
        }],
        series: [{
          name: '产值',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'bar',
          itemStyle: {
            color: '#5B8FF9'
          },
          yAxisIndex: 0
        }, {
          name: '产量',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'bar',
          itemStyle: {
            color: '#5AD8A6'
          },
          yAxisIndex: 1
        }]
      },
      year_orderProduction: new Date().getFullYear().toString(),
      client_name_orderProduction: '',
      clientList: [],
      // 公司分析
      companyAnalyseLoading: false,
      clientListAnalyse: [],
      client_name_analyse: '',
      companyData: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [],
          orient: 'veritcal',
          right: 100,
          top: 'center'
        },
        radar: {
          name: {
            textStyle: {
            }
          },
          indicator: [
            { name: '平均成本', max: 6500 },
            { name: '下单数量', max: 16000 },
            { name: '平均价格', max: 30000 },
            { name: '订单产值', max: 38000 },
            { name: '平均工期', max: 52000 }
          ],
          center: ['35%', '50%']
        },
        series: [{
          name: '公司名称',
          type: 'radar',
          lineStyle: {
            width: 3
          },
          tooltip: {
            trigger: 'item'
          },
          data: [{
            value: [4300, 10000, 28000, 35000, 50000],
            name: 'A公司',
            lineStyle: {
              color: '#5B8FF9'
            },
            itemStyle: {
              color: '#5B8FF9'
            }
          }]
        }]
      },
      // 发货日历
      calendarShowType: false,
      calendar_filter_month: '',
      calendar_filter_year: '',
      calendarMonthData: {
        tooltip: {
          position: 'top'
        },
        visualMap: {
          min: 0,
          max: 1000,
          calculable: true,
          orient: 'vertical',
          right: 0,
          top: 'center',
          align: 'left'
        },
        calendar: [
          {
            orient: 'vertical',
            yearLabel: {
              margin: 40
            },
            monthLabel: {
              nameMap: 'cn',
              margin: 20
            },
            dayLabel: {
              firstDay: 1,
              nameMap: 'cn'
            },
            cellSize: 40,
            left: 50,
            bottom: 50,
            range: '2020-06'
          }
        ],
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            symbolSize: function (val) {
              return val[1] / 40
            },
            data: this.getVirtulData()
          }]
      },
      calendarYearData: {
        tooltip: {
          position: 'top'
        },
        visualMap: {
          min: 0,
          max: 1000,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 20,
          align: 'top'
        },
        calendar: {
          range: new Date().getFullYear().toString()
        },
        series: {
          type: 'effectScatter',
          coordinateSystem: 'calendar',
          calendarIndex: 0,
          symbolSize: function (val) {
            return val[1] / 80
          },
          data: this.getVirtulData()
        }
      }
    }
  },
  methods: {
    getOrderProductionInfo (id, year) {
      year = year || new Date().getFullYear()
      this.productionLoading = true
      echartsApi.orderProduction({
        client_id: id,
        year: year
      }).then(res => {
        if (res.data.status !== false) {
          let data = res.data.data
          this.productionTotalNumber = data.total_output
          this.productionTotalPrice = data.total_price
          let productionPriceArr = []
          let productionNumberArr = []
          for (let index in data.data_month) {
            let item = data.data_month[index]
            productionPriceArr.push(+item.total_price || 0)
            productionNumberArr.push(+item.total_output || 0)
          }
          this.orderProductionData = {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              x: 40, // 左
              y: 30, // 上
              x2: 40, // 右
              y2: 30 // 下
            },
            legend: {
              data: ['产值', '产量']
            },
            xAxis: {
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [{
              name: '产值',
              max: Math.max(...productionPriceArr),
              min: 0,
              type: 'value'
            }, {
              name: '产量',
              max: Math.max(...productionNumberArr),
              min: 0,
              type: 'value'
            }],
            series: [{
              name: '产值',
              data: productionPriceArr,
              type: 'bar',
              itemStyle: {
                color: '#5B8FF9'
              },
              yAxisIndex: 0
            }, {
              name: '产量',
              data: productionNumberArr,
              type: 'bar',
              itemStyle: {
                color: '#5AD8A6'
              },
              yAxisIndex: 1
            }]
          }
        }
        this.productionLoading = false
      })
    },
    getCompanyAnalyseInfo (id) {
      this.companyAnalyseLoading = true
      let flag = this.clientListAnalyse.find(itemF => +itemF.id === +id)
      if (flag.data) {
        this.getCompanyData()
      } else {
        echartsApi.clientAnalyse({
          client_id: id,
          year: ''
        }).then(res => {
          if (res.data.status !== false) {
            flag.data = res.data.data
            this.getCompanyData()
          }
        })
      }
    },
    getCompanyData () {
      let colorArr = ['#5B8FF9', '#5AD8A6', '#F6C34A', '#F8134C', '#F6C66A']
      let data = this.clientListAnalyse.filter(item => item.checked)
      let clientNameArr = data.map(item => item.name)
      let maxAvgCost = Math.max(...data.map(item => +item.data.avg_cost))
      let maxAvgPrice = Math.max(...data.map(item => +item.data.avg_price))
      let maxTotalNumber = Math.max(...data.map(item => +item.data.total_number))
      let maxTotalPrice = Math.max(...data.map(item => +item.data.total_price))
      let maxAvgDay = Math.max(...data.map(item => +item.data.avg_day))
      let echartsData = data.map((item, index) => {
        return {
          value: [item.data.avg_cost, item.data.total_number, item.data.avg_price, item.data.total_price, item.data.avg_day],
          name: item.name,
          lineStyle: {
            color: colorArr[index]
          },
          itemStyle: {
            color: colorArr[index]
          }
        }
      })
      // [{
      //   value: [4300, 10000, 28000, 35000, 50000],
      //   name: 'A公司',
      //   lineStyle: {
      //     color: '#5B8FF9'
      //   },
      //   itemStyle: {
      //     color: '#5B8FF9'
      //   }
      // }, {
      //   value: [5000, 14000, 8000, 31000, 42000],
      //   name: 'B公司',
      //   lineStyle: {
      //     color: '#5AD8A6'
      //   },
      //   itemStyle: {
      //     color: '#5AD8A6'
      //   }
      // }, {
      //   value: [3000, 12000, 18000, 11000, 34000],
      //   name: 'C公司',
      //   lineStyle: {
      //     color: '#F6C34A'
      //   },
      //   itemStyle: {
      //     color: '#F6C34A'
      //   }
      // }, {
      //   value: [3000, 10000, 10000, 10000, 30000],
      //   name: 'D公司',
      //   lineStyle: {
      //     color: '#F8134C'
      //   },
      //   itemStyle: {
      //     color: '#F8134C'
      //   }
      // }, {
      //   value: [3000, 1200, 1800, 1100, 3400],
      //   name: 'E公司',
      //   lineStyle: {
      //     color: '#F6C66A'
      //   },
      //   itemStyle: {
      //     color: '#F6C66A'
      //   }
      // }]
      this.companyData = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: clientNameArr,
          orient: 'veritcal',
          right: 100,
          top: 'center'
        },
        radar: {
          name: {
            textStyle: {
            }
          },
          indicator: [
            { name: '平均成本', max: maxAvgCost },
            { name: '下单数量', max: maxTotalNumber },
            { name: '平均价格', max: maxAvgPrice },
            { name: '订单产值', max: maxTotalPrice },
            { name: '平均工期', max: maxAvgDay }
          ],
          center: ['35%', '50%']
        },
        series: [{
          name: '公司名称',
          type: 'radar',
          lineStyle: {
            width: 3
          },
          tooltip: {
            trigger: 'item'
          },
          data: echartsData
        }]
      }
      this.companyAnalyseLoading = false
    },
    checkedChange (item) {
      if (item.checked) {
        if (this.clientListAnalyse.filter(itemF => itemF.checked).length > 10) {
          this.$message.warning('最多只能选择10个单位')
          item.checked = false
          return
        }
        this.getCompanyAnalyseInfo(item.id)
      } else {
        this.getCompanyData()
      }
    },
    getVirtulData (year) {
      year = year || '2020'
      var date = new Date(year + '-01-01').getTime()
      var end = new Date((+year + 1) + '-01-01').getTime()
      var dayTime = 3600 * 24 * 1000
      var data = []
      for (var time = date; time < end; time += dayTime) {
        data.push([
          this.$getTime(time),
          Math.floor(Math.random() * 1000)
        ])
      }
      console.log(data)
      return data
    }
  },
  created () {
    this.calendar_filter_month = (new Date().getMonth() + 1).toString()
    this.calendar_filter_year = new Date().getFullYear().toString()
  },
  mounted () {
    Promise.all([
      client.list()
    ]).then(res => {
      this.clientList = res[0].data.data.filter(itemF => itemF.type.indexOf(1) !== -1)
      this.client_name_orderProduction = this.clientList[0].id
      this.getOrderProductionInfo(this.client_name_orderProduction)
      this.clientListAnalyse = this.clientList.map((item, index) => {
        if (index < 1) {
          return {
            checked: true,
            ...item
          }
        } else {
          return {
            checked: false,
            ...item
          }
        }
      })
      this.getCompanyAnalyseInfo(this.clientListAnalyse[0].id)
    })
  },
  computed: {
    clientListAnalyseArr () {
      let list = this.clientListAnalyse
      let returnList = this.client_name_analyse ? list.filter(itemF => itemF.name.indexOf(this.client_name_analyse) !== -1) : list
      return returnList
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/other/chartIndex.less";
</style>
