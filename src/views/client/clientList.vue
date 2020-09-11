<template>
  <div id='clientList'
    class='indexMain'
    v-loading='loading'>
    <!-- <div class="chartsCtn"> -->
    <!-- <div class="charts">
        <div class="title">
          <span>订单产值</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：当年所有订单总产值"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{productionTotal}}</div>
        <v-chart style="width:320px;height:120px"
          :options="monthData" />
      </div>
      <div class="charts">
        <div class="title">
          <span>工厂成本</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：当年工厂总成本"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{costTotal}}</div>
        <v-chart style="width:320px;height:120px"
          :options="processData" />
      </div> -->
    <!-- <div class="charts listHard">
        <div class="box">
          <span class="title">合计</span>
          <span class="number">{{1000.79}}万元</span>
          <span class="info">
            <span class="info_item">订单：{{2000}}万元 </span>
            <span class="info_item">成本：{{1000.90}}万元</span>
          </span>
        </div>
        <div class="box">
          <span class="title">已结算(已开票)</span>
          <span class="number">{{1000.79}}万元</span>
          <span class="info">
            <span class="info_item">订单：{{2000}}万元 </span>
            <span class="info_item">成本：{{1000.90}}万元</span>
          </span>
        </div>
        <div class="box">
          <span class="title">已结算(未开票)</span>
          <span class="number">{{1000.79}}万元</span>
          <span class="info">
            <span class="info_item">订单：{{2000}}万元 </span>
            <span class="info_item">成本：{{1000.90}}万元</span>
          </span>
        </div>
        <div class="box">
          <span class="title">待结算</span>
          <span class="number">{{1000.79}}万元</span>
          <span class="info">
            <span class="info_item">订单：{{2000}}万元 </span>
            <span class="info_item">成本：{{1000.90}}万元</span>
          </span>
        </div>
        <div class="box">
          <span class="title">已扣款</span>
          <span class="number">{{1000.79}}万元</span>
          <span class="info">
            <span class="info_item">订单：{{2000}}万元 </span>
            <span class="info_item">成本：{{1000.90}}万元</span>
          </span>
        </div>
      </div>
    </div> -->
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入单位名称按回车查询">
            </el-input>
            <el-cascader class="inputs"
              v-model="client_type"
              :options="companyType"
              @change="changeRouter(1)"
              collapse-tags
              placeholder="请选择客户类型"
              clearable></el-cascader>
            <el-select v-model="clientStatus"
              placeholder="筛选状态"
              class="inputs">
              <el-option v-for="item in statusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
          <div class="rightCtn">
            <div class="btn btnWhiteBlue"
              @click="$router.push('/client/clientCreate')">新增客户</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">客户名称</span>
            </div>
            <div class="col">
              <span class="text">客户简称</span>
            </div>
            <div class="col flex12">
              <span class="text">客户类型</span>
            </div>
            <div class="col flex08">
              <span class="text">联系电话</span>
            </div>
            <div class="col flex08">
              <span class="text">合计</span>
            </div>
            <div class="col flex08">
              <span class="text">已结算(已开票)
                <!-- <span class="iconCtn"
                  @click="sortFn('YJSYKP')">
                  <i class="el-icon-caret-top"
                    :class="{'green':YJSYKP === '1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':YJSYKP === '2'}"></i>
                </span> -->
              </span>
            </div>
            <div class="col flex08">
              <span class="text">已结算(未开票)
                <!-- <span class="iconCtn"
                  @click="sortFn('YJSWKP')">
                  <i class="el-icon-caret-top"
                    :class="{'green':YJSWKP === '1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':YJSWKP === '2'}"></i>
                </span> -->
              </span>
            </div>
            <div class="col flex08">
              <span class="text">待结算
                <!-- <span class="iconCtn"
                  @click="sortFn('DJS')">
                  <i class="el-icon-caret-top"
                    :class="{'green':DJS === '1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':DJS === '2'}"></i>
                </span> -->
              </span>
            </div>
            <div class="col flex08">
              <span class="text">已扣款
                <!-- <span class="iconCtn"
                  @click="sortFn('YKK')">
                  <i class="el-icon-caret-top"
                    :class="{'green':YKK === '1'}"></i>
                  <i class="el-icon-caret-bottom"
                    :class="{'green':YKK === '2'}"></i>
                </span> -->
              </span>
            </div>
            <div class="col middle flex12">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemClient,indexClient) in list"
            :key="indexClient">
            <div class="col flex12">{{itemClient.name}}</div>
            <div class="col">{{itemClient.abbreviation}}</div>
            <div class="col flex12"
              style="overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-word;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    display: -webkit-box;">{{computedType(itemClient.type)}}</div>
            <div class="col flex08">{{itemClient.phone}}</div>
            <div class="col flex08"
              style="font-weight:bold">{{$formatNum(itemClient.financial_data.total_price)}}元</div>
            <div class="col flex08">{{$formatNum(itemClient.financial_data.settle_price_invoice)}}元</div>
            <div class="col flex08">{{$formatNum(itemClient.financial_data.settle_price)}}元</div>
            <div class="col flex08">{{$formatNum(itemClient.financial_data.wait_settle_price)}}元</div>
            <div class="col flex08">{{$formatNum($toFixed(itemClient.financial_data.deduct_price))}}元</div>
            <div class="col middle flex12">
              <span class="opr"
                @click="$router.push('/client/clientDetail/' + itemClient.id)">详情</span>
              <span class="opr orange"
                @click="$router.push('/client/clientUpdate/' + itemClient.id)">修改</span>
              <span class="opr"
                :class="{'red':itemClient.status > 0}"
                @click="disableClient(itemClient.id)">{{itemClient.status > 0 ? '禁用' : '启用'}}</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getClientList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { companyType } from '@/assets/js/dictionary.js'
import { client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      client_type: [],
      searchTypeFlag: false,
      pages: 1,
      total: 0,
      companyType: [],
      clientStatus: 1,
      statusArr: [
        {
          label: '全部',
          value: ''
        }, {
          label: '合作中',
          value: 1
        }
      ],
      costTotal: 0,
      productionTotal: 0,
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
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '发货数量',
          data: [10, 52, 200, 334, 390, 330, 210, 52, 200, 334, 390, 330, 220],
          type: 'bar',
          areaStyle: {
            color: '#36CBCB'
          },
          itemStyle: {
            color: '#36CBCB'
          },
          lineStyle: {
            width: 2
          }
        }]
      },
      processData: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.9)',
          formatter: '{b}<br />{c}元 ({d}%)',
          textStyle: {
            color: '#666'
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        },
        color: ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            center: ['75%', '50%'],
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '10',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 3305, name: '物料订购' },
              { value: 1310, name: '物料加工' },
              { value: 1234, name: '生产织造' },
              { value: 1135, name: '半成品加工' },
              { value: 548, name: '包装订购' },
              { value: 408, name: '装箱出库' }
            ]
          }
        ]
      },
      YJSYKP: '',
      YJSWKP: '',
      DJS: '',
      YKK: ''
    }
  },
  methods: {
    sortFn (item) {
      ['YJSYKP', 'YJSWKP', 'DJS', 'YKK'].forEach(itemF => {
        if (itemF !== item) {
          this[itemF] = ''
        } else {
          this[itemF] = !this[itemF] ? '1' : this[itemF] === '1' ? '2' : '1'
        }
      })
      this.changeRouter(1)
    },
    disableClient (id) {
      this.$confirm('此操作将禁用该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        client.disable({
          id: id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('禁用成功')
            this.getClientList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      if (params.clientType) {
        this.client_type = params.clientType.split(',')
      }
      this.YJSYKP = params.YJSYKP
      this.YJSWKP = params.YJSWKP
      this.DJS = params.DJS
      this.YKK = params.YKK
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/client/clientList/page=' + pages + '&&keyword=' + this.keyword + '&&clientType=' + this.client_type + '&&YJSYKP=' + this.YJSYKP + '&&YJSWKP=' + this.YJSWKP + '&&DJS=' + this.DJS + '&&YKK=' + this.YKK)
    },
    getClientList () {
      this.loading = true
      client.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        type: this.client_type.length > 1 ? this.client_type[1] : this.client_type[0],
        status: this.clientStatus
      }).then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        }
      })
    },
    computedType (type) {
      return this.$unique(type.map(item => {
        let flag = this.companyType.find(value => value.children.find(itemF => +itemF.value === +item))
        return flag ? (flag.label || '') : ''
      })).join(',')
    },
    reset () {
      this.$router.push('/client/clientList/page=1&&keyword=&&clientType=')
    }
  },
  created () {
    this.getFilters()
    this.getClientList()
    this.companyType = this.$mergeData(companyType, { mainRule: 'type', childrenName: 'children' }).map(itemM => {
      return {
        value: itemM.type,
        label: itemM.type,
        children: itemM.children
      }
    })
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      this.getFilters()
      this.getClientList()
    },
    clientStatus (newVal) {
      this.getClientList()
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/client/clientList.less";
</style>
