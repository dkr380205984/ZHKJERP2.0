<template>
  <div id='annualStatistics'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">年度合计明细</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="tableTop">
            <span class="left">
              {{2020}}
              年度工厂所有财务统计
            </span>
            <span class="right">统计时间：{{start_time}}~{{end_time}}</span>
          </div>
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row tb_col col_title"></span>
              <span class="tb_col">
                <span class="tb_col_item">
                  <span class="tb_row">项目内容</span>
                  <span class="tb_row">收入(元)</span>
                  <span class="tb_row">支出(元)</span>
                  <span class="tb_row flex04 middle">操作</span>
                </span>
              </span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in detail"
              :key="index">
              <span class="tb_row tb_col col_title"
                :style="'height:' + (55 * item.info.length - 1) + 'px'">{{item.name}}</span>
              <span class="tb_row tb_col">
                <span class="tb_col_item"
                  v-for="(itemI,indexI) in item.info"
                  :key="indexI">
                  <span class="tb_row">{{itemI.name}}</span>
                  <span class="tb_row">{{itemI.income ? '+' + itemI.income : ''}}</span>
                  <span class="tb_row">{{itemI.expend ? '-' + itemI.expend : ''}}</span>
                  <span class="tb_row flex04 middle">
                    <span class="tb_handle_btn blue">详情</span>
                    <span class="tb_handle_btn blue"
                      @click="itemI.show = !itemI.show">{{itemI.show ? '隐藏' : '显示'}}</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tb_header">
              <span class="tb_row tb_col col_title"></span>
              <span class="tb_row tb_col">
                <span class="tb_col_item">
                  <span class="tb_row">合计</span>
                  <span class="tb_row">+{{incomeTotal}}</span>
                  <span class="tb_row">-{{expendTotal}}</span>
                  <span class="tb_row flex04 middle">
                    <span class="tb_handle_btn blue"></span>
                    <span class="tb_handle_btn blue"></span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      start_time: '2019/01/01',
      end_time: '2020/12/31',
      detail: [
        {
          name: '订单',
          info: [
            {
              name: '下单总值',
              income: 20000,
              expend: 1000,
              show: true
            }
          ]
        },
        {
          name: '样单',
          info: [
            {
              name: '客户付费总值',
              income: 2000,
              expend: 0,
              show: true
            }
          ]
        },
        {
          name: '原料纱线',
          info: [
            {
              name: '订单原料采购',
              income: 0,
              expend: 1000,
              show: true
            },
            {
              name: '样单原料采购',
              income: 0,
              expend: 100,
              show: true
            },
            {
              name: '原料预定购',
              income: 0,
              expend: 400,
              show: true
            },
            {
              name: '订单原料加工',
              income: 0,
              expend: 160,
              show: true
            },
            {
              name: '样单原料加工',
              income: 0,
              expend: 80,
              show: true
            }
          ]
        },
        {
          name: '装饰辅料',
          info: [
            {
              name: '订单辅料采购',
              income: 0,
              expend: 80,
              show: true
            },
            {
              name: '样单辅料采购',
              income: 0,
              expend: 40,
              show: true
            }
          ]
        },
        {
          name: '生产织造',
          info: [
            {
              name: '订单织造',
              income: 0,
              expend: 80,
              show: true
            },
            {
              name: '样单织造',
              income: 0,
              expend: 40,
              show: true
            }
          ]
        },
        {
          name: '半成品加工',
          info: [
            {
              name: '订单半成品加工',
              income: 0,
              expend: 80,
              show: true
            },
            {
              name: '样单半成品加工',
              income: 0,
              expend: 40,
              show: true
            }
          ]
        },
        {
          name: '包装',
          info: [
            {
              name: '订单包装辅料',
              income: 0,
              expend: 2000,
              show: true
            }
          ]
        },
        {
          name: '运输',
          info: [
            {
              name: '订单出库运输',
              income: 0,
              expend: 1000,
              show: true
            }
          ]
        },
        {
          name: '人工',
          info: [
            {
              name: '人员工资',
              income: 0,
              expend: 4000,
              show: true
            }
          ]
        },
        {
          name: '其他',
          info: [
            {
              name: '报销费用',
              income: 0,
              expend: 200,
              show: true
            }
          ]
        }
      ]
    }
  },
  methods: {

  },
  computed: {
    incomeTotal () {
      let totalInfo = this.$flatten(this.detail.map(itemM => itemM.info)).filter(itemF => itemF.show).map(itemM => (+itemM.income || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      return totalInfo
    },
    expendTotal () {
      let totalInfo = this.$flatten(this.detail.map(itemM => itemM.info)).filter(itemF => itemF.show).map(itemM => (+itemM.expend || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      return totalInfo
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/financialStatistics/annualStatistics.less";
</style>
