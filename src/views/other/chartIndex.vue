<template>
  <div id="chartIndex"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">订单产值产量</span>
      </div>
      <div class="chartCtn">
        <div class="leftCtn">
          <div class="infoLine">
            <el-date-picker v-model="date"
              type="year"
              placeholder="选择年份">
            </el-date-picker>
            <div class="textInfo">
              <span class="label">总产量：</span>
              <span class="text">200000</span>
              <span class="unit">件</span>
            </div>
            <div class="textInfo">
              <span class="label">总产值：</span>
              <span class="text">32312313</span>
              <span class="unit">元</span>
            </div>
          </div>
          <v-chart style="width:100%;height:240px"
            :options="orderData" />
        </div>
        <div class="rightCtn">
          <div class="title">订单数量排名</div>
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
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">公司分析</span>
      </div>
      <div class="chartCtn">
        <div class="leftCtn"
          style="flex:5">
          <v-chart style="width:100%;height:380px"
            :options="companyData" />
        </div>
        <div class="rightCtn"
          style="flex:5">
          <div class="title"
            style="display:flex">搜索公司：
            <el-select placeholder="请选择公司名称"
              style="display:inline-block;width:550px"
              v-model="client"></el-select>
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
      <div class="titleCtn">
        <span class="title">发货日历</span>
      </div>
      <div class="chartCtn">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderData: {
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
          max: Math.max(...[3200, 3320, 3010, 3340, 3900, 1500, 2320, 2010, 1540, 1900, 2200, 3660]),
          min: 0,
          type: 'value'
        }, {
          name: '产量',
          max: Math.max(...[220, 182, 191, 234, 290, 98, 77, 101, 99, 40, 95, 203]),
          min: 0,
          type: 'value'
        }],
        series: [{
          name: '产值',
          data: [3200, 3320, 3010, 3340, 3900, 1500, 2320, 2010, 1540, 1900, 2200, 3660],
          type: 'bar',
          itemStyle: {
            color: '#5B8FF9'
          },
          yAxisIndex: 0
        }, {
          name: '产量',
          data: [220, 182, 191, 234, 290, 98, 77, 101, 99, 40, 95, 203],
          type: 'bar',
          itemStyle: {
            color: '#5AD8A6'
          },
          yAxisIndex: 1
        }]
      },
      companyData: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['A公司', 'B公司', 'C公司'],
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
          }, {
            value: [5000, 14000, 8000, 31000, 42000],
            name: 'B公司',
            lineStyle: {
              color: '#5AD8A6'
            },
            itemStyle: {
              color: '#5AD8A6'
            }
          }, {
            value: [3000, 12000, 18000, 11000, 34000],
            name: 'C公司',
            lineStyle: {
              color: '#F6C34A'
            },
            itemStyle: {
              color: '#F6C34A'
            }
          }]
        }]
      },
      date: '',
      client_name: '',
      client: ''
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/other/chartIndex.less";
</style>
