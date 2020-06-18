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
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{year}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown"
                  class="yearDropdown">
                  <el-dropdown-item>
                    <span @click.stop="changeYear('before')"
                      style="width:100%;height:100%;padding:0 10px;user-select: none;">&lt;&lt;</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-for="(itemD,indexD) in 10"
                    :key='indexD'
                    :command='itemD'>
                    <span @click="changeYear('change',(yearArr * 10 + itemD))"
                      style="width:100%;height:100%;padding:0 10px;user-select: none;">{{(yearArr * 10 + itemD)}}</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click.stop="changeYear('after')"
                      style="width:100%;height:100%;padding:0 10px;user-select: none;">&gt;&gt;</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
                  <span class="tb_row"
                    v-if="item.name === '订单'">
                    <el-dropdown @command='handleOrderCommand($event,itemI)'>
                      <span class="el-dropdown-link">
                        {{itemI.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(itemD,indexD) in orderSelectArr"
                          :key='indexD'
                          :command='itemD'>{{itemD.name}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                  <span class="tb_row"
                    v-else-if="item.name === '样单'">
                    <el-dropdown @command='handleOrderCommand($event,itemI)'>
                      <span class="el-dropdown-link">
                        {{itemI.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(itemD,indexD) in sampleSelectArr"
                          :key='indexD'
                          :command='itemD'>{{itemD.name}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                  <span class="tb_row"
                    v-else>{{itemI.name}}</span>
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
      ],
      orderSelectArr: [
        {
          name: '下单总值',
          income: 20000,
          expend: 1000
        },
        {
          name: '实际出库总值',
          income: 38000,
          expend: 2000
        },
        {
          name: '实际结算总值',
          income: 30600,
          expend: 1600
        }
      ],
      sampleSelectArr: [
        {
          name: '客户付费总值',
          income: 2000,
          expend: 0,
          show: true
        },
        {
          name: '实际付费总值',
          income: 1800,
          expend: 0,
          show: true
        }
      ],
      year: '',
      yearArr: []
    }
  },
  methods: {
    handleOrderCommand (event, item) {
      item.name = event.name
      item.income = event.income
      item.expend = event.expend
    },
    changeYear (type, year) {
      if (type === 'before') {
        this.yearArr -= 1
      } else if (type === 'after') {
        this.yearArr += 1
      } else {
        this.year = year
      }
      return false
    }
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
  },
  created () {
    this.year = new Date().getFullYear()
    this.yearArr = Math.floor(this.year / 10) - 1
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/financialStatistics/annualStatistics.less";
</style>
<style lang="less">
// #annualStatistics {
.yearDropdown {
  .el-dropdown-menu__item {
    padding: 0;
    display: flex;
  }
}
// }
</style>
