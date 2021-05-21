<template>
  <div id='clientList'
    class='indexMain'
    v-loading='loading'>
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
            <div class="col flex12">
              <span class="text">客户状态</span>
            </div>
            <div class="col flex08">
              <span class="text">联系电话</span>
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
            <div class="col flex12">
              <span class="text"
                :style="{'color':itemClient.status===1?'#01B48C':'#F5222D'}">{{itemClient.status===1?'合作中':'已禁用'}}</span>
            </div>
            <div class="col flex08">{{itemClient.phone}}</div>
            <div class="col middle flex12">
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
            :current-page.sync="pages">
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
      year: '',
      list: [],
      keyword: '',
      clientBigType: '订单公司',
      client_type: '',
      searchTypeFlag: false,
      pages: 1,
      total: 0,
      fuckCompanyType: [],
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
      this.clientBigType = params.clientBigType
      this.client_type = params.clientType
      this[params.sortType] = +params.sortValue || 0
      this.sortKey = params.sortKey
      this.year = params.year || new Date().getFullYear().toString()
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push(`/client/clientListEasy/page=${pages}&&keyword=${this.keyword}&&clientBigType=${this.clientBigType}&&clientType=${this.client_type}&&sortType=${this.sortType}&&sortKey=${this.sortKey}&&sortValue=${this.sortValue}&&year=${this.year}`)
    },
    getClientList () {
      this.loading = true
      client.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        type: this.client_type ? [this.client_type.split(',')[1]] : [],
        status: this.clientStatus
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
        let flag = companyType.find(value => value.value === item)
        return flag ? `${flag.type}/${flag.label}` : ''
      })).join(',')
    },
    reset () {
      this.$router.push('/client/clientListEasy/page=1&&keyword=&&clientType=')
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
        type: [this.client_type],
        export_type: this.client_type === '订单公司' ? '收款' : '付款',
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
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/client/clientList.less";
</style>
