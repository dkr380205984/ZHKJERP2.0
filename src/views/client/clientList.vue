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
    <div class="typeCtn">
      <div class="typeCtn_item"
        :class="{'active':clientBigType === itemType.value}"
        v-for="(itemType,indexType) in companyType"
        :key="indexType"
        @click="changeCompanyType(itemType)">{{itemType.value}}</div>
    </div>
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
            <!-- <el-cascader class="inputs"
              v-model="client_type"
              :options="companyType"
              @change="changeRouter(1)"
              collapse-tags
              placeholder="请选择客户类型"
              clearable></el-cascader> -->
            <el-select v-model="client_type"
              clearable
              placeholder="请选择客户类型"
              class="inputs"
              @change="changeRouter(1)">
              <el-option v-for="item in clientTypeCom"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
            <div class="btn btnBlue"
              @click="downloading = true">导出数据</div>
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
            <!-- <div class="col flex08">
              <span class="text">联系电话</span>
            </div> -->
            <div class="col flex08">
              <span class="text">{{DDXDCZCOM}}</span>
              <zh-sort v-model="DDXDCZ"
                specialKey='plan_price'
                @change="sortFn($event,'DDXDCZ')" />
            </div>
            <div class="col flex08">
              <span class="text">{{SJFHCZCOM}}</span>
              <zh-sort v-model="SJFHCZ"
                specialKey='total_price'
                @change="sortFn($event,'SJFHCZ')" />
            </div>
            <div class="col flex08">
              <span class="text">已开票金额</span>
              <zh-sort v-model="YKPJE"
                specialKey='settle_price_invoice'
                @change="sortFn($event,'YKPJE')" />
            </div>
            <div class="col flex08">
              <span class="text">{{YSKJECOM}}</span>
              <zh-sort v-model="YSKJE"
                specialKey='transfer_count'
                @change="sortFn($event,'YSKJE')" />
            </div>
            <div class="col flex08">
              <span class="text">已扣款金额</span>
              <zh-sort v-model="YKKJE"
                specialKey='deduct_price'
                @change="sortFn($event,'YKKJE')" />
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
            <!-- <div class="col flex08">{{itemClient.phone}}</div> -->
            <div class="col flex08">{{$formatNum($toFixed(itemClient.financial_data.plan_price || 0))}}</div>
            <div class="col flex08"
              style="font-weight:bold">{{$formatNum($toFixed(itemClient.financial_data.total_price || 0))}}元</div>
            <div class="col flex08">{{$formatNum($toFixed(itemClient.financial_data.settle_price_invoice || 0))}}元</div>
            <div class="col flex08">{{$formatNum($toFixed((itemClient.financial_data.transfer_count || 0)))}}元</div>
            <div class="col flex08">{{$formatNum($toFixed((itemClient.financial_data.deduct_price || 0)))}}元</div>
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
          <div class="row positonBottom">
            <div class="col flex12">合计</div>
            <div class="col"></div>
            <div class="col flex12"></div>
            <!-- <div class="col flex08"></div> -->
            <div class="col flex08">{{$formatNum($toFixed(count.plan_price/10000 || 0))}}万元</div>
            <div class="col flex08"
              style="font-weight:bold">{{$formatNum($toFixed(count.total_price/10000 || 0))}}万元</div>
            <div class="col flex08">{{$formatNum($toFixed(count.settle_price_invoice/10000 || 0))}}万元</div>
            <div class="col flex08">{{$formatNum($toFixed($toFixed(count.transfer_count/10000 || 0)))}}万元</div>
            <div class="col flex08">{{$formatNum($toFixed($toFixed(count.deduct_price/10000 || 0)))}}万元</div>
            <div class="col middle flex12"></div>
          </div>
        </div>
        <div class="pageCtn">
          <!-- <div class="timeCtn">
            <span class="label">统计时间：</span>
            <span class="text">{{selectTime.join('~')}}</span>
            <span class="btn noBorder">修改</span>
          </div> -->
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
    <!-- 导所有数据蒙层 -->
    <!-- <div class="popup"
      v-if="downloading"
      style="display:flex;flex-direction:column;align-items:center;justify-content: center;color:#1A95FF;font-size:40px">
      <span>当前进度：{{propgress || 0}}%
        <span class="el-icon-loading"></span></span>
      <span>正在下载，请勿刷新页面或关闭页面</span>
    </div> -->
    <div class="popup"
      v-if="downloading">
      <div class="main"
        style="width:400px">
        <div class="title">
          选择时间
          <i class="el-icon-close"
            @click="downloading = false" />
        </div>
        <div class="content">
          <el-date-picker v-model="exportTime"
            style="width:300px"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="downloading = false">取消</div>
          <div class="btn btnBlue"
            @click="downLoadData(exportTime && exportTime[0],exportTime && exportTime[1])">导出{{isDownLoad ? '中...' : ''}}</div>
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
      clientBigType: '订单公司',
      client_type: '',
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
      DDXDCZ: 0,
      SJFHCZ: 0,
      YKPJE: 0,
      YSKJE: 0,
      YKKJE: 0,
      sortType: '',
      sortValue: '',
      sortKey: '',
      count: {},
      downloading: false,
      isDownLoad: false,
      exportTime: '',
      propgress: 0,
      selectTime: []
    }
  },
  methods: {
    sortFn (event, key) {
      ['DDXDCZ', 'SJFHCZ', 'YKPJE', 'YSKJE', 'YKKJE'].forEach(itemF => {
        if (key === itemF) return
        this[itemF] = 0
      })
      this.sortType = key
      this.sortValue = event.value
      this.sortKey = event.specialKey
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
      this.clientBigType = params.clientBigType || '订单公司'
      this.client_type = +params.clientType || ''
      this[params.sortType] = +params.sortValue || 0
      this.sortKey = params.sortKey
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push(`/client/clientList/page=${pages}&&keyword=${this.keyword}&&clientBigType=${this.clientBigType}&&clientType=${this.client_type}&&sortType=${this.sortType}&&sortKey=${this.sortKey}&&sortValue=${this.sortValue}`)
    },
    getClientList () {
      this.loading = true
      client.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        type: this.client_type ? [this.client_type] : this.clientTypeCom.map(itemM => itemM.value),
        status: this.clientStatus,
        order: (this.sortValue && this.sortKey) || '',
        order_way: this.sortValue === 1 ? '' : 'desc'
      }).then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.count = {
            deduct_price: res.data.deduct_price,
            plan_price: res.data.plan_price,
            settle_price_invoice: res.data.settle_price_invoice,
            total_price: res.data.total_price,
            transfer_count: res.data.transfer_count
          }
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
    },
    changeCompanyType (item) {
      this.clientBigType = item.value
      this.changeRouter(1)
    },
    downLoadData (startTime, endTime) { // data = [], pages = 1, total, limit = 50
      if (this.isDownLoad) return
      if (!startTime || !endTime) {
        this.$message.warning('请选择起始日期与结束日期')
        return
      }
      this.isDownLoad = true
      client.exportFile({
        type: this.client_type ? [this.client_type] : this.clientTypeCom.map(itemM => itemM.value),
        export_type: this.clientBigType === '订单公司' ? '收款' : '付款',
        start_time: startTime,
        end_time: endTime
      }).then(res => {
        if (res.data.status !== false) {
          let aLink = document.createElement('a')
          let url = res.data.data
          aLink.href = url
          aLink.download = new Date().getTime() + '.xls'
          aLink.click()
          this.downloading = false
          this.isDownLoad = false
        }
      })
      // this.downloading = true
      // this.propgress = total ? this.$toFixed((pages / Math.ceil(total / limit) * 100)) : 0
      // client.list({
      //   limit: limit,
      //   page: pages,
      //   keyword: this.keyword,
      //   type: this.client_type ? [this.client_type] : this.clientTypeCom.map(itemM => itemM.value),
      //   status: this.clientStatus,
      //   order: (this.sortValue && this.sortKey) || '',
      //   order_way: this.sortValue === 1 ? '' : 'desc'
      // }).then((res) => {
      //   if (res.data.status !== false) {
      //     data.push(...res.data.data.map(itemM => {
      //       return {
      //         ...itemM,
      //         client_type: this.computedType(itemM.type),
      //         ...itemM.financial_data
      //       }
      //     }))
      //     total = res.data.meta.total
      //     if (pages >= Math.ceil(total / limit)) { // 当页数到最后一页时
      //       downloadExcel(data, [
      //         { title: '客户名称', key: 'name' },
      //         { title: '客户简称', key: 'abbreviation' },
      //         { title: '客户类型', key: 'client_type' },
      //         { title: '订单下单产值', key: 'plan_price' },
      //         { title: '实际发货产值', key: 'total_price' },
      //         { title: '已开票金额', key: 'settle_price_invoice' },
      //         { title: '已收款金额', key: 'transfer_count' },
      //         { title: '已扣款金额', key: 'deduct_price' }
      //       ], false)
      //       this.downloading = false
      //     } else {
      //       setTimeout(() => {
      //         this.downLoadData(data, pages + 1, total, limit)
      //       }, 1000)
      //     }
      //   }
      // })
    }
  },
  created () {
    this.getFilters()
    this.selectTime = [`${new Date().getFullYear()}/01/01`, this.$getTime(null, '/')]
    this.companyType = this.$mergeData(companyType, { mainRule: 'type', childrenName: 'children' }).map(itemM => {
      return {
        value: itemM.type,
        label: itemM.type,
        children: itemM.children
      }
    })
    this.getClientList()
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
  },
  computed: {
    clientTypeCom () {
      const typeArr = this.companyType.find(itemF => itemF.value === this.clientBigType)
      return (typeArr && typeArr.children) || []
    },
    DDXDCZCOM () {
      switch (this.clientBigType) {
        case '订单公司':
          return '订单下单产值'
        case '原料纱线单位':
        case '装饰辅料单位':
        case '包装辅料单位':
          return '计划采购总值'
        case '生产织造单位':
          return '计划生产总值'
        case '物料加工单位':
        case '半成品加工单位':
        case '成品加工单位':
          return '计划加工总值'
        default:
          return '计划总值'
      }
    },
    SJFHCZCOM () {
      switch (this.clientBigType) {
        case '订单公司':
          return '实际发货产值'
        case '原料纱线单位':
        case '装饰辅料单位':
        case '包装辅料单位':
          return '实际采购总值'
        case '生产织造单位':
          return '实际生产总值'
        case '物料加工单位':
        case '半成品加工单位':
        case '成品加工单位':
          return '实际加工总值'
        default:
          return '实际总值'
      }
    },
    YSKJECOM () {
      switch (this.clientBigType) {
        case '订单公司':
          return '已收款金额'
        default:
          return '已付款金额'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/client/clientList.less";
</style>
