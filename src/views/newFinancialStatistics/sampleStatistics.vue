<template>
  <div class="indexMain"
    id="orderStatistics">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/orderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">订单财务统计</span>
      </div>
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">样单财务统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/productStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">产品产量统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/settleChargebacks')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoshiyongtongji"></use>
        </svg>
        <span class="name">结算扣款统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/annualStatistics?year=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-hezuogongsicaiwutongji"></use>
        </svg>
        <span class="name">年度财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/logStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-caozuorizhitongji"></use>
        </svg>
        <span class="name">生产记录统计</span>
      </div>
    </div>
    <div class="module"
      v-loading='loading'>
      <div class="detailCtn">
        <div class="rowCtn">
          <span class="bgGray">当前统计默认值：样单下单时间：{{dateCom}}；下单公司：{{clientCom}}；下单小组：{{groupCom}}。</span>
        </div>
        <div class="tableCtn">
          <div class="filterCtn">
            <el-date-picker class="filter_item"
              v-model="filterInfo.year"
              value-format="yyyy"
              type="year"
              placeholder="筛选下单年份"
              @change="changeRouter(1)">
            </el-date-picker>
            <el-select class="filter_item"
              clearable
              v-model="filterInfo.client"
              placeholder="筛选下单公司"
              @change="changeRouter(1)">
              <el-option v-for="item in filterInfo.clientArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select class="filter_item"
              clearable
              v-model="filterInfo.group"
              placeholder="筛选负责小组"
              @change="changeRouter(1)">
              <el-option v-for="item in filterInfo.groupArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="row">
            <div class="item">打样数量</div>
            <div class="item">确认数量</div>
            <div class="item">确认比例</div>
            <div class="item">客户付费</div>
          </div>
          <div class="row H58">
            <div class="item"
              style="font-size:14px">
              <span class="green"
                style="font-size:28px">{{totalInfo.order_total_number}}</span>件
            </div>
            <div class="item"
              style="font-size:14px">
              <span class="green"
                style="font-size:28px">{{totalInfo.order_total_reality}}</span>件
            </div>
            <div class="item"
              style="font-size:14px">
              <span class="orange"
                style="font-size:28px">{{$toFixed(totalInfo.proportion * 100)}}</span>%
            </div>
            <div class="item"
              style="font-size:14px">
              <span class="orange"
                style="font-size:28px">{{$formatNum($toFixed(totalInfo.client_pay / 10000))}}</span>万元
            </div>
          </div>
        </div>
        <v-chart class="echarts_bar_container"
          :options="barOption" />
        <!-- <div
          ref="echarts_bar_container"></div> -->
        <div class="echarts_pie_treemap_container">
          <v-chart class="echarts_pie_container"
            :options="pieOption" />
          <!-- <div class="echarts_pie_container"
            ref="echarts_pie_container"></div> -->
          <v-chart class="echarts_treemap_container"
            :options="pie2Option" />
          <!-- <div class="echarts_treemap_container"
            ref="echarts_treemap_container"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { newFinance, client, group } from '@/assets/js/api.js'
import { ECHARTS_COLOR } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      filterInfo: {
        year: '',
        client: '',
        clientArr: [],
        group: '',
        groupArr: []
      },
      totalInfo: {
        order_total_number: '',
        order_total_reality: '',
        proportion: '',
        client_pay: ''
      },
      // 柱状图数据
      // barEcharts: null,
      barOption: {
        tooltip: {
          trigger: 'axis'
          // formatter: '{b0}<br />{a0}：{c0} <br />{a1}：{c1} 万元'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          left: '10%',
          data: ['每月下单总额', '每月出库总额']
        },
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'value',
          // show: false,
          name: '数量(件)',
          min: 0,
          max: 0,
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '每月下单总额',
            type: 'bar',
            data: [],
            itemStyle: {
              color: '#1F78B4'
            }
          },
          {
            name: '每月出库总额',
            type: 'line',
            data: [],
            itemStyle: {
              color: '#25B41F'
            }
          }
        ]
      },
      // 饼状图数据
      // pieEcharts: null,
      pieOption: {
        tooltip: {
          trigger: 'item'
          // formatter: '{b}：{c} 万元'
        },
        legend: {
          top: '5%',
          right: '0',
          orient: 'vertical'
        },
        series: {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: []
        },
        color: ECHARTS_COLOR
      },
      // treemapEcharts: null,
      pie2Option: {
        tooltip: {
          trigger: 'item'
          // formatter: '{b}：{c} 万元'
        },
        legend: {
          top: '5%',
          right: '0',
          orient: 'vertical'
        },
        series: {
          type: 'pie',
          radius: ['0%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: []
        },
        color: ECHARTS_COLOR
      }
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route () {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.init()
    }
  },
  methods: {
    changeRouter () {
      this.$router.push(`/newfinancialStatistics/sampleStatistics?year=${this.filterInfo.year || ''}&client=${this.filterInfo.client || ''}&group=${this.filterInfo.group || ''}`)
    },
    getFilters () {
      this.filterInfo.year = this.$route.query.year || ''
      this.filterInfo.client = this.$route.query.client || ''
      this.filterInfo.group = +this.$route.query.group || ''
    },
    init () {
      this.loading = true
      newFinance.sample({
        year: this.filterInfo.year || '',
        client_id: this.filterInfo.client || '',
        group_id: this.filterInfo.group || ''
      }).then(res => {
        if (res.data.status !== false) {
          // 初始化表格的统计数据
          this.totalInfo = {
            order_total_number: res.data.data.order_total_number,
            order_total_reality: res.data.data.order_total_reality,
            proportion: res.data.data.proportion,
            client_pay: res.data.data.client_pay
          }
          // 初始化柱状图数
          const clientData = res.data.data.client_list.sort((now, next) => {
            return next.order_total_number - now.order_total_number
          })
          const beforeTwentieth = clientData.splice(0, 20).concat({
            client_name: '其它',
            order_total_number: clientData.map(itemM => +itemM.order_total_number || 0).reduce((total, current) => total + current, 0),
            order_total_reality: clientData.map(itemM => +itemM.order_total_reality || 0).reduce((total, current) => total + current, 0)
          })
          this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.client_name)
          this.barOption.series = [
            {
              name: '打样数量',
              type: 'bar',
              data: beforeTwentieth.map(itemM => itemM.order_total_number),
              itemStyle: {
                color: '#1F78B4'
              }
            },
            {
              name: '确认数量',
              type: 'line',
              data: beforeTwentieth.map(itemM => itemM.order_total_reality),
              itemStyle: {
                color: '#25B41F'
              }
            }
          ]
          const allNums = [...beforeTwentieth.map(itemM => itemM.order_total_number), ...beforeTwentieth.map(itemM => itemM.order_total_reality)]
          this.barOption.yAxis.max = allNums.length > 0 ? Math.max(...allNums) : 1
          // this.barOption.yAxis.min = allNums.length > 0 ? Math.min(...allNums) : 10000
          // 初始化饼图数据
          this.pieOption.series.data = res.data.data.group_list.map(itemM => {
            return { value: itemM.order_total_number, name: itemM.group_name }
          })
          // 初始化饼图2数据
          this.pie2Option.series.data = res.data.data.category_list.map(itemM => {
            return { value: itemM.order_total_number, name: itemM.category_name }
          })
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.getFilters()
    this.init()
  },
  created () {
    Promise.all([
      client.list(),
      group.list()
    ]).then(res => {
      this.filterInfo.clientArr = res[0].data.data.filter(itemF => itemF.type.indexOf(1) !== -1 || itemF.type.indexOf(2) !== -1)
      this.filterInfo.groupArr = res[1].data.data
    })
  },
  computed: {
    dateCom () {
      if (this.filterInfo.year && +this.filterInfo.year !== new Date().getFullYear()) {
        return `${this.filterInfo.year}年1月1日-${this.filterInfo.year}年12月31日`
      }
      const nowDate = this.$getTime().split('-')
      return `${nowDate[0]}年1月1日-${nowDate[0]}年${nowDate[1]}月${nowDate[2]}日`
    },
    clientCom () {
      if (this.filterInfo.client) {
        const finded = this.filterInfo.clientArr.find(itemF => itemF.id === this.filterInfo.client)
        return (finded && finded.name) || '未知'
      }
      return '所有'
    },
    groupCom () {
      if (this.filterInfo.group) {
        const finded = this.filterInfo.groupArr.find(itemF => itemF.id === this.filterInfo.group)
        return (finded && finded.name) || '未知'
      }
      return '所有'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/newfinancialStatistics/orderStatistics.less";
</style>
