<template>
  <div class="indexMain"
    id="orderStatistics">
    <div class="listCutCtn">
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">订单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/sampleStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">样单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/materialStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">物料使用统计</span>
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
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/annualStatistics')">
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
      v-zhloading:[loadingInfo].imgModle>
      <div class="detailCtn">
        <div class="rowCtn">
          <span class="bgGray">当前统计默认值：订单下单时间：{{dateCom}}；下单公司：{{clientCom}}；下单小组：{{groupCom}}；币种：{{paymentCom}}。</span>
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
            <el-select class="filter_item"
              clearable
              v-model="filterInfo.payment"
              placeholder="筛选币种"
              @change="changeRouter(1)">
              <el-option v-for="item in filterInfo.paymentArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="row">
            <div class="item">下单总额</div>
            <div class="item">下单总数</div>
            <div class="item">出库总额</div>
            <div class="item">出库总数</div>
          </div>
          <div class="row H58">
            <div class="item"
              style="font-size:14px">
              <span class="green"
                style="font-size:28px">{{$formatNum($toFixed(totalInfo.order_price / 10000))}}</span>万元
            </div>
            <div class="item"
              style="font-size:14px">
              <span class="green"
                style="font-size:28px">{{$formatNum($toFixed(totalInfo.order_number / 10000))}}</span>万
            </div>
            <div class="item"
              style="font-size:14px">
              <span class="orange"
                style="font-size:28px">{{$formatNum($toFixed(totalInfo.pack_price / 10000))}}</span>万元
            </div>
            <div class="item"
              style="font-size:14px">
              <span class="orange"
                style="font-size:28px">{{$formatNum($toFixed(totalInfo.pack_number / 10000))}}</span>万
            </div>
          </div>
        </div>
        <v-chart class="echarts_bar_container"
          :options="barOption" />
        <!-- <div
          ref="echarts_bar_container"></div> -->
        <div class="echarts_pie_treemap_container">
          <v-chart class="echarts_pie_container"
            style="width:30%"
            :options="pieOption" />
          <!-- <div class="echarts_pie_container"
            ref="echarts_pie_container"></div> -->
          <v-chart class="echarts_treemap_container"
            style="width:70%"
            :options="treemapOption" />
          <!-- <div class="echarts_treemap_container"
            ref="echarts_treemap_container"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { newFinance, client, group } from '@/assets/js/api.js'
import { ECHARTS_COLOR } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      // loading: true,
      loadingInfo: {
        loading: true
        // type: 'error'
      },
      filterInfo: {
        year: '',
        client: '',
        clientArr: [],
        group: '',
        groupArr: [],
        payment: '',
        paymentArr: [
          { value: 'USD', label: '美元' },
          { value: 'CNY', label: '人民币' }
        ]
      },
      totalInfo: {
        order_price: '',
        order_number: '',
        pack_price: '',
        pack_number: ''
      },
      // 柱状图数据
      // barEcharts: null,
      barOption: {
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br />{a0}：{c0} 万元<br />{a1}：{c1} 万元'
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
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '下单金额',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 万元'
            }
          },
          {
            type: 'value',
            name: '出库金额',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万元'
            }
          }
        ],
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
            yAxisIndex: 1,
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
          trigger: 'item',
          formatter: '{b}：{c} 万元'
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
      treemapOption: {
        name: '还原',
        color: ECHARTS_COLOR,
        tooltip: {
          trigger: 'item',
          show: true
        },
        series: {
          type: 'treemap',
          label: {
            position: 'insideTopLeft',
            formatter: function (params) {
              return [
                `{name|${params.name}}`,
                `{hr|}`,
                params.data.type === 'USD' ? `{CNY|$${echarts.format.addCommas(params.value[0])}}{label|下单总额(USD)}` : `{CNY|￥${echarts.format.addCommas(params.value[0])}}{label|下单总额(CNY)}`
                // `{USD|$${echarts.format.addCommas(params.value[1])}}{label|USD}`
              ].join('\n')
            },
            show: true,
            distance: 0,
            padding: 5,
            color: '#FFF',
            overflow: 'truncate',
            rich: {
              CNY: {
                fontSize: 22,
                lineHeight: 38,
                color: 'yellow'
              },
              USD: {
                fontSize: 14,
                color: '#fff'
              },
              name: {
                fontSize: 12,
                color: '#FFF'
              },
              label: {
                fontSize: 9,
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#fff',
                borderRadius: 2,
                padding: [2, 4],
                lineHeight: 25,
                align: 'right'
              },
              hr: {
                width: '100%',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                height: 0,
                lineHeight: 10
              }
            }
          },
          tooltip: {
            formatter: function (params) {
              return [
                params.name,
                (params.data.type === 'USD'
                  ? `USD：$${echarts.format.addCommas(params.value[0])}`
                  : `CNY：￥${echarts.format.addCommas(params.value[0])}`)
                // `USD：$${echarts.format.addCommas(params.value[1])}`
              ].join('<br />')
            }
          },
          data: []
        }
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
      this.$router.push(`/newfinancialStatistics/orderStatistics?year=${this.filterInfo.year || ''}&client=${this.filterInfo.client || ''}&group=${this.filterInfo.group || ''}&payment=${this.filterInfo.payment || ''}`)
    },
    getFilters () {
      this.filterInfo.year = this.$route.query.year || ''
      this.filterInfo.client = this.$route.query.client || ''
      this.filterInfo.group = +this.$route.query.group || ''
      this.filterInfo.payment = this.$route.query.payment || ''
    },
    init () {
      this.loadingInfo.loading = true
      this.loadingInfo.type = null
      // if (!this.barEcharts) {
      //   this.barEcharts = echarts.init(this.$refs.echarts_bar_container)
      // }
      // if (!this.pieEcharts) {
      //   this.pieEcharts = echarts.init(this.$refs.echarts_pie_container)
      // }
      // if (!this.treemapEcharts) {
      //   this.treemapEcharts = echarts.init(this.$refs.echarts_treemap_container)
      // }
      // this.loading = true
      newFinance.order({
        year: this.filterInfo.year || '',
        client_id: this.filterInfo.client || '',
        group_id: this.filterInfo.group || '',
        currency_type: this.filterInfo.payment || ''
      }).then(res => {
        if (res.data.status !== false) {
          // 初始化表格的统计数据
          this.totalInfo = {
            order_price: res.data.data.total_price,
            order_number: res.data.data.order_number,
            pack_price: res.data.data.pack_price,
            pack_number: res.data.data.pack_number
          }
          // 初始化柱状图数
          const orderPriceMin = Math.min(...Object.values(res.data.data.monthly_order))
          const orderPriceMax = Math.max(...Object.values(res.data.data.monthly_order))
          const outPriceMin = Math.min(...Object.values(res.data.data.monthly_outbound))
          const outPriceMax = Math.max(...Object.values(res.data.data.monthly_outbound))
          this.barOption.yAxis = [
            {
              type: 'value',
              name: '下单金额',
              min: (orderPriceMin && orderPriceMin < 0) ? orderPriceMin / 10000 : 0,
              max: Math.ceil(Math.ceil(orderPriceMax / 10000 / 5)) * 5,
              interval: Math.ceil(orderPriceMax / 10000 / 5),
              axisLabel: {
                formatter: '{value} 万元'
              }
            },
            {
              type: 'value',
              name: '出库金额',
              min: (outPriceMin && outPriceMin < 0) ? outPriceMin / 10000 : 0,
              max: Math.ceil(Math.ceil(outPriceMax / 10000 / 5)) * 5,
              interval: Math.ceil(outPriceMax / 10000 / 5),
              axisLabel: {
                formatter: '{value} 万元'
              }
            }
          ]
          this.barOption.series = [
            {
              name: '每月下单总额',
              type: 'bar',
              data: Object.values(res.data.data.monthly_order).map(itemM => this.$toFixed(itemM / 10000)),
              itemStyle: {
                color: '#1F78B4'
              }
            },
            {
              name: '每月出库总额',
              type: 'line',
              yAxisIndex: 1,
              data: Object.values(res.data.data.monthly_outbound).map(itemM => this.$toFixed(itemM / 10000)),
              itemStyle: {
                color: '#25B41F'
              }
            }
          ]
          // this.barEcharts.setOption(this.barOption)
          // 初始化饼图数据
          this.pieOption.series.data = res.data.data.user_groups.map(itemM => {
            return { value: this.$toFixed(itemM.total_price / 10000), name: itemM.name }
          })
          // this.pieEcharts.setOption(this.pieOption)
          // 初始化矩形树图
          this.treemapOption.series.data = res.data.data.clients.map(itemM => {
            return {
              name: itemM.name,
              value: [itemM.total_price, 0],
              type: this.filterInfo.payment
            }
          })
          this.loadingInfo.loading = false
        } else {
          this.loadingInfo.type = 'error'
        }
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
    },
    paymentCom () {
      switch (this.filterInfo.payment) {
        case 'USD':
          return '美元'
        case 'CNY':
          return '人民币'
        default:
          return '默认'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/newfinancialStatistics/orderStatistics.less";
</style>
