<template>
  <div id='annualStatistics'
    class='indexMain'
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/financialStatistics/orderStatistics/page=1&&keyword=&&date=&&group_id=&&company_id=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">订单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/sampleStatistics/page=1&&keyword=&&date=&&group_id=&&company_id=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">样单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/productStatistics/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&XDZS=&&PJJG=&&HJCZ=&&CPL=&&KCSL=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">产品产量统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/materialStatistics/page=1&&keyword=&&type=1&&HJSY=&&DGSL=&&PJJG=&&HJJG=&&KCSY=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoshiyongtongji"></use>
        </svg>
        <span class="name">物料使用统计</span>
      </div>
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-hezuogongsicaiwutongji"></use>
        </svg>
        <span class="name">年度财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-caozuorizhitongji"></use>
        </svg>
        <span class="name">操作记录统计</span>
      </div>
    </div>
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
                    v-else>{{itemI.name}}</span>
                  <span class="tb_row">{{itemI.income ? '+' + itemI.income : ''}}</span>
                  <span class="tb_row">{{itemI.expend ? '-' + itemI.expend : ''}}</span>
                  <span class="tb_row flex04 middle">
                    <span class="tb_handle_btn blue"
                      @click="goUrl(itemI.url)">详情</span>
                    <span class="tb_handle_btn blue"
                      @click="itemI.show = !itemI.show">{{itemI.show ? '不计入合计' : '计入合计'}}</span>
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
import { statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
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
    goUrl (url) {
      console.log(url)
      if (url) {
        this.$router.push(url)
      } else {
        this.$message.warning('暂无该统计模块')
      }
    },
    handleOrderCommand (event, item) {
      item.name = event.name
      item.income = event.income
      item.expend = event.expend
      item.url = event.url
    },
    getData () {
      this.loading = true
      statistics.yearDetail({
        year: this.year
      }).then((res) => {
        console.log(res)
        let data = res.data.data
        this.orderSelectArr = [
          {
            name: '下单总值',
            income: data.order.order_price,
            expend: 0
          },
          {
            name: '实际出库总值',
            income: data.order.real_price,
            expend: 0
          },
          {
            name: '实际结算总值',
            income: data.order.settle_price,
            expend: 0
          }
        ]
        this.detail = [
          {
            name: '订单',
            info: [
              {
                name: '下单总值',
                income: data.order.order_price,
                expend: 0,
                show: true,
                url: '/financialStatistics/orderStatistics/page=1&&keyword=&&date=' + this.start_time + ',' + this.end_time + '&&group_id=&&company_id='
              }
            ]
          },
          {
            name: '样单',
            info: [
              {
                name: '客户付费总值',
                income: data.sample_order.client_pay,
                expend: 0,
                show: true,
                url: '/financialStatistics/sampleStatistics/page=1&&keyword=&&date=' + this.start_time + ',' + this.end_time + '&&group_id=&&company_id='
              }
            ]
          },
          {
            name: '原料纱线',
            info: [
              {
                name: '订单原料采购',
                income: 0,
                expend: data.material.material_order,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=&&stock_id='
              },
              {
                name: '样单原料采购',
                income: 0,
                expend: data.material.material_sample_order,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=2&&production_type=&&operate_user=&&material_name=&&stock_id='
              },
              {
                name: '订单原料加工',
                income: 0,
                expend: data.material.order_process,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=物料加工&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=&&stock_id='
              },
              {
                name: '样单原料加工',
                income: 0,
                expend: data.material.sample_order_process,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=物料加工&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=2&&production_type=&&operate_user=&&material_name=&&stock_id='
              }
            ]
          },
          {
            name: '装饰辅料',
            info: [
              {
                name: '订单辅料采购',
                income: 0,
                expend: data.assist_material.order,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=&&stock_id='
              },
              {
                name: '样单辅料采购',
                income: 0,
                expend: data.assist_material.sample_order,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=2&&production_type=&&operate_user=&&material_name=&&stock_id='
              }
            ]
          },
          {
            name: '生产织造',
            info: [
              {
                name: '订单织造',
                income: 0,
                expend: data.production_weave.order,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=织造分配&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name=&&stock_id='
              },
              {
                name: '样单织造',
                income: 0,
                expend: data.production_weave.sample_order,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=织造分配&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=2&&production_type=&&operate_user=&&material_name=&&stock_id='
              }
            ]
          },
          {
            name: '包装',
            info: [
              {
                name: '订单包装辅料',
                income: 0,
                expend: data.pack,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=包装订购&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=0&&production_type=&&operate_user=&&material_name=&&stock_id='
              }
            ]
          },
          {
            name: '运输',
            info: [
              {
                name: '订单出库运输',
                income: 0,
                expend: data.sotck_out,
                show: true,
                url: '/financialStatistics/logStatistics/page=1&&type=装箱出库&&date=' + this.start_time + ',' + this.end_time + '&&client_id=&&product_code=&&order_type=0&&production_type=&&operate_user=&&material_name=&&stock_id='
              }
            ]
          },
          {
            name: '人工',
            info: [
              {
                name: '人员工资',
                income: 0,
                expend: data.user,
                show: true,
                url: ''
              }
            ]
          },
          {
            name: '其他',
            info: [
              {
                name: '报销费用',
                income: 0,
                expend: data.others.reimburse_price,
                show: true,
                url: ''
              }
            ]
          }
        ]
        this.loading = false
      })
    },
    changeYear (type, year) {
      if (type === 'before') {
        this.yearArr -= 1
      } else if (type === 'after') {
        this.yearArr += 1
      } else {
        this.year = year
      }
      this.start_time = this.year - 1 + '-01-01'
      this.end_time = this.year + '-12-31'
      this.getData()
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
    this.start_time = this.year + '-01-01'
    this.end_time = this.year + '-12-31'
    this.yearArr = Math.floor(this.year / 10) - 1
    this.getData()
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
