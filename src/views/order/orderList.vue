<template>
  <div id='orderList'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item active">
        <span class="icon order"></span>
        <span class="name">订单列表</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/product/productList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=&&has_craft=&&has_quotation=')">
        <span class="icon product"></span>
        <span class="name">产品列表</span>
      </div>
    </div>
    <div class="chartsCtn">
      <div class="charts">
        <div class="title">
          <span>本月订单</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：当月订单需要完成的产品数量"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{monthAll}}</div>
        <v-chart style="width:320px;height:120px"
          :options="monthData" />
      </div>
      <div class="charts">
        <div class="title">
          <span>进行中订单</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：未来14天内，订单需要完成数量，且状态为进行中订单"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{processAll}}</div>
        <v-chart style="width:320px;height:120px"
          :options="processData" />
      </div>
      <div class="charts">
        <div class="title">
          <span>逾期订单</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：过去14天内，订单暂未完成的数量，且状态为逾期中的订单"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{delayAll}}</div>
        <v-chart style="width:320px;height:120px"
          :options="delayData" />
      </div>
      <div class="charts">
        <div class="title">
          <span>完成进度</span>
          <el-tooltip class="item"
            effect="dark"
            content="图表显示：当月订单完成率。完成率 = 当月订单装箱数量/当月订单需完成数量"
            placement="top">
            <i class="el-icon-info"
              style="float:right;line-height:42px;font-size:16px"></i>
          </el-tooltip>
        </div>
        <div class="number">{{$toFixed(completeAll)}}%</div>
        <v-chart style="width:320px;height:120px"
          :options="completeData" />
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-select style="width:140px;margin-right:12px"
                class="filter_item"
                v-model="searchOrderOrProduct"
                @change="changeRouter(1)">
                <el-option value="order"
                  label="订单号搜索"></el-option>
                <el-option value="product"
                  label="产品编号搜索"></el-option>
              </el-select>
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                :placeholder="'输入' + (searchOrderOrProduct==='order'?'订单号':'产品编号')+'按回车键查询'">
              </el-input>
              <el-cascader v-model="company_id"
                class="filter_item"
                :show-all-levels='false'
                placeholder="筛选公司"
                :options="companyArr"
                :filter-method='searchClient'
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="setContactsData"
                filterable></el-cascader>
              <el-select v-model="contacts"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选联系人">
                <el-option v-for="(item,index) in contactsArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="group_id"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选小组">
                <el-option v-for="(item,index) in groupArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
            <div class="filter_line"
              :class="!openHiddleFilter ? 'hiddle' : false">
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
              <el-select v-model="state"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选状态">
                <el-option v-for="(item,index) in stateArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="rightCtn"
            @click="openHiddleFilter = !openHiddleFilter">
            {{openHiddleFilter ? '收起' : '展开'}}
            <span class="el-icon-arrow-down openIcon"
              :class="openHiddleFilter ? 'active' : false"></span>
          </div>
        </div>
        <div class="addCtn"
          style="justify-content:space-between">
          <span class="btn noBorder listCutBtn"
            style="padding:0;margin:0"
            @click="$router.push('/order/orderStat/page=1&&keyword=&&date=&&group_id=&&company_id=')">订单发货列表</span>
          <div class="btn btnBlue"
            @click="$router.push('/order/orderCreate')">新建订单</div>
        </div>
        <div class="list">
          <el-table :data="list"
            style="width: 100%">
            <el-table-column fixed
              width="70">
              <template slot="header"
                slot-scope="scope">
                <el-checkbox v-model="checkedAll"
                  ref="checkedAllEl"
                  @change="checkedChange($event,null,'all',scope)"></el-checkbox>全选
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked"
                  @change="checkedChange($event,scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column fixed
              prop="order_code"
              label="订单号"
              width="180">
            </el-table-column>
            <el-table-column prop="client_name"
              fixed
              label="订单公司"
              width="150">
            </el-table-column>
            <el-table-column label="产品图片"
              width="150"
              align="center">
              <template slot-scope="scope">
                <zh-img-list :list="scope.row.image"
                  type='open'></zh-img-list>
              </template>
            </el-table-column>
            <el-table-column prop="product_code"
              label="产品编号"
              width="150">
            </el-table-column>
            <el-table-column label="下单数量"
              width="120">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between;padding-right:15px">
                  <span>{{scope.row.product_number}}</span>
                  <div class="jtCtn"
                    v-show="scope.row.product_info.length>1">
                    <div class="jt el-icon-caret-top"
                      @click="checkPro(scope.row,'last')"></div>
                    <div class="jt el-icon-caret-bottom"
                      @click="checkPro(scope.row,'next')"></div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="order_time"
              label="流程进度"
              width="183">
              <template slot-scope="scope">
                <div style="display:flex">
                  <div class="stateCtn"
                    title="物料计划状态"
                    :class="{'green':scope.row.has_plan===1}">
                    <div class="state"></div>
                    <span class="name">计</span>
                  </div>
                  <div class="stateCtn"
                    title="原料入库状态"
                    :class="{'orange':scope.row.material_push_progress.r_push>0,'green':scope.row.material_push_progress.r_push>=100}">
                    <div class="state"></div>
                    <span class="name">入</span>
                  </div>
                  <div class="stateCtn"
                    title="原料出库状态"
                    :class="{'orange':scope.row.material_push_progress.r_pop>0,'green':scope.row.material_push_progress.r_pop>=100}">
                    <div class="state"></div>
                    <span class="name">出</span>
                  </div>
                  <div class="stateCtn"
                    title="半成品检验状态"
                    :class="{'orange':scope.row.product_push_progress>0,'green':scope.row.product_push_progress>=100}">
                    <div class="state"></div>
                    <span class="name">检</span>
                  </div>
                  <div class="stateCtn"
                    title="半成品回库状态"
                    :class="{'orange':scope.row.semi_push_progress>0,'green':scope.row.semi_push_progress>=100}">
                    <div class="state"></div>
                    <span class="name">回</span>
                  </div>
                  <div class="stateCtn"
                    title="成品装箱状态"
                    :class="{'orange':scope.row.pack_real_progress>0,'green':scope.row.pack_real_progress>=100}">
                    <div class="state"></div>
                    <span class="name">箱</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单状态"
              width="120">
              <template slot-scope="scope">
                <div class="stateCtn rowFlex"
                  :class="{'red':scope.row.status === 2003 || scope.row.status === 2005,'green':scope.row.status === 2004,'blue':scope.row.status === 2002,'orange':scope.row.status === 2001}">
                  <div class="state"
                    style="margin-left:0"></div>
                  <span class="name">{{scope.row.status|filterStatus}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="order_time"
              label="下单日期"
              width="120">
            </el-table-column>
            <el-table-column prop="total_number"
              label="下单总量"
              width="120">
            </el-table-column>
            <el-table-column prop="group_name"
              label="负责小组"
              width="120">
            </el-table-column>
            <el-table-column prop="order_time"
              label="发货日期"
              width="180">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between;padding-right:15px">
                  <span>第{{scope.row.timeIndex+1}}批：{{scope.row.dtime}}</span>
                  <div class="jtCtn"
                    v-show="scope.row.delivery_time.length>1">
                    <div class="jt el-icon-caret-top"
                      @click="checkTime(scope.row,'last')"></div>
                    <div class="jt el-icon-caret-bottom"
                      @click="checkTime(scope.row,'next')"></div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="client_contacts"
              label="联系人"
              width="120">
            </el-table-column>
            <el-table-column label="操作"
              fixed="right"
              width="150">
              <template slot-scope="scope">
                <span class="tOpr"
                  @click="$router.push('/order/orderDetail/' + scope.row.id)">详情</span>
                <span class="tOpr"
                  style="color:rgb(230, 162, 60)"
                  @click="handleCommand('change',scope.row.id)">修改</span>
                <span class="tOpr"
                  style="color:#F5222D"
                  @click="handleCommand('delete',scope.row.id)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="title">
            <div class="col flex08">
              <span class="text">订单号</span>
            </div>
            <div class="col flex12">
              <span class="text">订单公司</span>
            </div>
            <div class="col flex08">
              <span class="text">产品编号</span>
            </div>
            <div class="col middle">
              <span class="text">产品图片</span>
            </div>
            <div class="col flex08">
              <span class="text">订单数量(件)</span>
            </div>
            <div class="col flex08">
              <span class="text">负责小组</span>
            </div>
            <div class="col flex16">
              <span class="text">
                流程进度
                <el-popover placement="right"
                  width="150"
                  trigger="click">
                  计：物料计划状态
                  <br />
                  入：原料入库状态
                  <br />
                  出：原料出库状态
                  <br />
                  检：半成品检验状态
                  <br />
                  回：半成品回库状态
                  <br />
                  箱：成品装箱状态
                  <span class="el-icon-question"
                    slot="reference"></span>
                </el-popover>
              </span>
            </div>
            <div class="col">
              <span class="text">订单状态</span>
            </div>
            <div class="col">
              <span class="text">下单时间</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex08">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col flex08">
              <span class="text">
                <el-popover placement="right"
                  v-if="itemOrder.product_info.length>1"
                  width="200"
                  trigger="click">
                  <span v-for="(itemPro,indexPro) in itemOrder.product_info"
                    :key="indexPro">{{itemPro.product_code}},</span>
                  <span class="btn noBorder"
                    style="padding:0;margin:0"
                    slot="reference">查看详情</span>
                </el-popover>
                <template v-if="itemOrder.product_info.length===1">
                  <span v-for="(itemPro,indexPro) in itemOrder.product_info"
                    :key="indexPro">{{itemPro.product_code}}</span></template>
              </span>
            </div>
            <div class="col middle">
              <zh-img-list :list="itemOrder.image"
                type='open'></zh-img-list>
            </div>
            <div class="col flex08">
              {{itemOrder.number}}
            </div>
            <div class="col flex08">
              {{itemOrder.group_name}}
            </div>
            <div class="col flex16">
              <div class="stateCtn"
                title="物料计划状态"
                :class="{'green':itemOrder.has_plan===1}">
                <div class="state"></div>
                <span class="name">计</span>
              </div>
              <div class="stateCtn"
                title="原料入库状态"
                :class="{'orange':itemOrder.material_push_progress.r_push>0,'green':itemOrder.material_push_progress.r_push>=100}">
                <div class="state"></div>
                <span class="name">入</span>
              </div>
              <div class="stateCtn"
                title="原料出库状态"
                :class="{'orange':itemOrder.material_push_progress.r_pop>0,'green':itemOrder.material_push_progress.r_pop>=100}">
                <div class="state"></div>
                <span class="name">出</span>
              </div>
              <div class="stateCtn"
                title="半成品检验状态"
                :class="{'orange':itemOrder.product_push_progress>0,'green':itemOrder.product_push_progress>=100}">
                <div class="state"></div>
                <span class="name">检</span>
              </div>
              <div class="stateCtn"
                title="半成品回库状态"
                :class="{'orange':itemOrder.semi_push_progress>0,'green':itemOrder.semi_push_progress>=100}">
                <div class="state"></div>
                <span class="name">回</span>
              </div>
              <div class="stateCtn"
                title="成品装箱状态"
                :class="{'orange':itemOrder.pack_real_progress>0,'green':itemOrder.pack_real_progress>=100}">
                <div class="state"></div>
                <span class="name">箱</span>
              </div>
            </div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="{'red':itemOrder.status === 2003 || itemOrder.status === 2005,'green':itemOrder.status === 2004,'blue':itemOrder.status === 2002,'orange':itemOrder.status === 2001}">
                <div class="state"></div>
                <span class="name">{{itemOrder.status|filterStatus}}</span>
              </div>
            </div>
            <div class="col">
              {{itemOrder.order_time}}
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/order/orderDetail/' + itemOrder.id)">详情</span>
              <span class="opr">
                <el-dropdown @command="handleCommand($event,itemOrder.id)">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='change'>
                      <span class="updated">修改</span>
                    </el-dropdown-item>
                    <el-dropdown-item command='delete'>
                      <span class="delete">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </div> -->
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar"
      v-if="checkedList.length > 0">
      <div class="main">
        <div class="checkedInfo"
          style="float:left;flex:1">
          已选择
          <span class="blue">{{checkedList.length}}</span>
          个订单：
          <template v-for="(item,index) in checkedList">
            <span class="blue"
              :key="index">{{item.order_code}}</span>;
          </template>
        </div>
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="cancelChecked">取消</div>
          <div class="btn btnWhiteBlue"
            @click="$openUrl(`/orderBatchTable?isB=${Math.random().toString(36).substr(2)}&id=${checkedList.map(itemM=>itemM.id)}`)">按批次打印</div>
          <div class="btn btnWhiteBlue"
            @click="downLoadExcel">导出Excel</div>
          <div class="btn btnWhiteBlue"
            @click="$openUrl(`/orderBatchTable?id=${checkedList.map(itemM=>itemM.id)}`)">按订单打印</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { getHash } from '@/assets/js/common.js'
import { order, group, client, chartsAPI } from '@/assets/js/api.js'
export default {
  data () {
    return {
      openHiddleFilter: false,
      processData: {
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
          data: [],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '订单数量',
          data: [],
          type: 'bar',
          barMinHeight: 2,
          itemStyle: {
            color: '#1a95ff'
          }
        }]
      },
      processAll: 0,
      delayData: {
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
          data: [],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '订单数量',
          data: [],
          type: 'bar',
          barMinHeight: 2,
          itemStyle: {
            color: '#FA9036'
          }
        }]
      },
      delayAll: 0,
      completeData: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} :{c} ({d})%'
        },
        legend: {
          orient: 'vertical',
          left: 24,
          top: 20,
          data: ['已完成', '未完成']
        },
        color: ['#1A95FF', '#E6A23C', '#01B48C'],
        series: [
          {
            name: '完成率',
            type: 'pie',
            radius: '55%',
            center: ['65%', '50%'],
            data: [
              { value: 0, name: '已完成' },
              { value: 0, name: '未完成' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            minAngle: [10]
          }
        ]
      },
      completeAll: 0,
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
          data: [],
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          name: '发货数量',
          data: [],
          type: 'line',
          symbol: 'none',
          smooth: true,
          areaStyle: {
            color: '#1a95ff'
          },
          itemStyle: {
            color: '#1a95ff'
          },
          lineStyle: {
            width: 2
          },
          smoothMonotone: 'x'
        }]
      },
      monthAll: 0,
      searchOrderOrProduct: 'order',
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0,
      state: '',
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      has_materialPlan: '', // 物料计划
      has_materialOrder: '', // 物料订购
      has_materialStock: '', // 物料出入库
      has_weave: '', // 织造分配
      has_productInOut: '', // 产品收发
      has_inspection: '', // 成品检验
      has_boxing: '', // 装箱出库
      stateArr: [
        {
          name: '已创建',
          id: '2001'
        }, {
          name: '进行中',
          id: '2002'
        }, {
          name: '已完成',
          id: '2004'
        }, {
          name: '已取消',
          id: '2003'
        }, {
          name: '已延期',
          id: '2005'
        }
      ],
      checkedAll: false,
      checkedList: [],
      contacts: '',
      contactsArr: []
    }
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getOrderList()
    }
  },
  methods: {
    setContactsData () {
      this.contacts = ''
      this.changeRouter(1)
    },
    cancelChecked () {
      this.list.forEach(itemF => {
        itemF.checked = false
      })
      this.checkedList = []
    },
    checkedChange (e, item, type) {
      if (type === 'all') {
        this.list.forEach(itemF => {
          itemF.checked = e
          this.checkedChange(e, itemF)
        })
      } else {
        let finded = this.checkedList.findIndex(itemF => itemF.id === item.id)
        if (e && finded < 0) {
          this.checkedList.push({
            id: item.id,
            order_code: item.order_code
          })
        } else if (!e && finded >= 0) {
          item.checked = false
          this.checkedList.splice(finded, 1)
        }
      }
    },
    downLoadExcel () {
      const { downloadOrderProductionExcel } = require('@/assets/js/common.js')
      Promise.all(
        this.checkedList.map(itemM => {
          return order.detailInfo({
            id: itemM.id
          })
        })
      ).then(res => {
        const downLoadData = res.map(itemM => {
          const orderDataItem = itemM.data.data
          return {
            orderInfo: {
              order_time: orderDataItem.order_time,
              order_code: orderDataItem.order_code,
              client_name: orderDataItem.client_name,
              contacts: orderDataItem.contacts,
              create_user: orderDataItem.user_name,
              group_name: orderDataItem.group_name,
              desc: orderDataItem.desc,
              unit: orderDataItem.account_unit
            },
            dataInfo: orderDataItem.batch_info.map(itemMB => {
              return itemMB.product_info.map(itemMP => {
                return {
                  delivery_time: itemMB.delivery_time,
                  batch_title: itemMB.batch_title || `第${itemMB.batch_id}批`,
                  batch_type: itemMB.order_type,
                  product_code: itemMP.product_code,
                  name: itemMP.name,
                  product_ingredient: itemMP.component.map(itemMC => `${itemMC.number}%${itemMC.component_name}`).join(';'),
                  product_unit: itemMP.category_info.unit,
                  size: itemMP.size_name,
                  color: itemMP.color_name,
                  size_info: itemMP.all_size.find(itemF => itemF.size_id === itemMP.size_id) || {},
                  images: itemMP.image,
                  price: itemMP.unit_price,
                  number: itemMP.numbers,
                  total_price: this.$toFixed(itemMP.numbers * itemMP.unit_price),
                  batch_desc: itemMB.desc
                }
              })
            }).flat(2).sort((a, b) => {
              return new Date(a.delivery_time).getTime() - new Date(b.delivery_time).getTime()
            })
          }
        })
        downloadOrderProductionExcel({
          data: downLoadData,
          titleInfo: {
            title: `${window.sessionStorage.getItem('full_name')}生产布置单`,
            created_user: window.sessionStorage.getItem('user_name'),
            created_time: this.$getTime()
          }
        }, `${window.sessionStorage.getItem('full_name')}生产布置单`)
      })
    },
    searchClient (node, query) {
      let flag = true
      if (query) {
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          flag = node.data.label.includes(query)
        } else {
          const queryArr = query.split('')
          for (const item of queryArr) {
            if (!node.data.name_pinyin.includes(item)) {
              flag = false
              break
            }
          }
        }
      }
      return flag
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      this.keyword = this.$changeSpecialWord(this.keyword, false)
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.searchOrderOrProduct = params.searchOrderOrProduct || 'order'
      this.has_materialPlan = params.has_materialPlan
      this.has_materialOrder = params.has_materialOrder
      this.has_materialStock = params.has_materialStock
      this.has_weave = params.has_weave
      this.has_productInOut = params.has_productInOut
      this.has_inspection = params.has_inspection
      this.has_boxing = params.has_boxing
      this.group_id = params.group_id ? Number(params.group_id) : ''
      this.company_id = params.company_id.split(',')
      if (this.company_id) {
        const finded = this.companyArr.find(itemF => itemF.value === this.company_id[0]) && this.companyArr.find(itemF => itemF.value === this.company_id[0]).children.find(itemF => itemF.value === this.company_id[1])
        console.log(finded)
        if (finded) {
          this.contactsArr = finded.contacts
        } else {
          this.contactsArr = []
        }
        this.contacts = +params.contacts || ''
      }
      this.state = params.state
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/order/orderList/page=' + pages + '&&keyword=' + this.$changeSpecialWord(this.keyword, true) + '&&date=' + this.date + '&&has_materialPlan=' + this.has_materialPlan + '&&has_materialOrder=' + this.has_materialOrder + '&&has_materialStock=' + this.has_materialStock + '&&has_weave=' + this.has_weave + '&&has_productInOut=' + this.has_productInOut + '&&has_inspection=' + this.has_inspection + '&&has_boxing=' + this.has_boxing + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '&&contacts=' + this.contacts + '&&state=' + this.state + '&&searchOrderOrProduct=' + this.searchOrderOrProduct)
    },
    reset () {
      this.$router.push('/order/orderList/page=1&&keyword=&&date=&&has_materialOrder=&&has_materialPlan=&&has_materialStock=&&has_weave=&&has_productInOut=&&has_inspection=&&has_boxing=&&group_id=&&company_id=&&state=&&searchOrderOrProduct=')
    },
    getOrderList () {
      this.loading = true
      this.checkedAll = true
      order.list({
        limit: 10,
        page: this.pages,
        product_code: this.searchOrderOrProduct === 'product' ? this.keyword : '',
        keyword: this.searchOrderOrProduct === 'order' ? this.keyword : '',
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id && this.company_id[1],
        group_id: this.group_id,
        status: this.state,
        status_material_plan: this.has_materialPlan,
        status_material_order: this.has_materialOrder,
        status_material_push: this.has_materialStock,
        status_weave: this.has_weave,
        status_product_push: this.has_productInOut,
        status_product_inspection: this.has_inspection,
        status_stock_out: this.has_boxing,
        contacts: this.contacts || null
      }).then(res => {
        this.list = res.data.data.map(item => {
          const finded = this.checkedList.find(itemF => itemF.id === item.id)
          item.checked = !!finded
          item.nowIndex = 0
          item.timeIndex = 0
          item.product_info = this.$mergeData(item.product_info, { mainRule: ['product_code', 'product_id'], otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] })
          item.total_number = item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
            return Number(total) + Number(itemNum)
          }, 0)
          this.checkPro(item, 'init')
          this.checkTime(item, 'init')
          return item
        })
        if (this.list.some(itemF => !itemF.checked)) {
          this.checkedAll = false
        }
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    checkTime (item, opr) {
      if (item.product_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.dtime = item.delivery_time[item.timeIndex]
        }
        if (opr === 'next') {
          if (item.timeIndex === item.delivery_time.length - 1) {
            item.timeIndex = 0
            this.checkTime(item)
          } else {
            item.timeIndex += 1
            this.checkTime(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.timeIndex === 0) {
            item.timeIndex = item.delivery_time.length - 1
            this.checkTime(item)
          } else {
            item.timeIndex -= 1
            this.checkTime(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.product_code = '无产品'
        item.product_number = 0
      }
    },
    checkPro (item, opr) {
      if (item.product_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.product_code = item.product_info[item.nowIndex].product_code
          item.image = item.product_info[item.nowIndex].image.length > 0 ? item.product_info[item.nowIndex].image.map(itemImg => {
            return {
              ...itemImg,
              product_id: item.product_info[item.nowIndex].product_id
            }
          }) : [{
            image_url: '',
            thumb: '',
            product_id: item.product_info[item.nowIndex].product_id
          }]
          item.product_number = item.product_info[item.nowIndex].numbers
        }
        if (opr === 'next') {
          if (item.nowIndex === item.product_info.length - 1) {
            item.nowIndex = 0
            this.checkPro(item)
          } else {
            item.nowIndex += 1
            this.checkPro(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.nowIndex === 0) {
            item.nowIndex = item.product_info.length - 1
            this.checkPro(item)
          } else {
            item.nowIndex -= 1
            this.checkPro(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.product_code = '无产品'
        item.product_number = 0
      }
    },
    handleCommand (type, id) {
      if (type === 'change') {
        this.$router.push('/order/orderUpdate/' + id)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          order.delete({
            id: id
          }).then(res => {
            if (res.data.status) {
              this.$message.success('删除成功')
              setTimeout(() => {
                window.location.reload()
              }, 300)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (type === 'materialStock') {
        this.$router.push('/materialStock/materialStockDetail/' + id + '/1')
      }
    },
    createMonthDay () {
      let daysOfMonth = []
      let fullYear = new Date().getFullYear()
      let month = new Date().getMonth() + 1
      let lastDayOfMonth = new Date(fullYear, month, 0).getDate()
      for (var i = 1; i <= lastDayOfMonth; i++) {
        daysOfMonth.push(fullYear + '-' + (month < 10 ? '0' + month : month) + '-' + (i < 10 ? '0' + i : i))
      }
      return daysOfMonth
    }
  },
  created () {
    window.aaa = require('@/assets/js/common.js')
    this.getFilters()
    this.getOrderList()
    Promise.all([
      group.list(),
      client.list()
    ]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = this.$getClientOptions(res[1].data.data, companyType, { type: [1, 2] })
      if (this.company_id) {
        const finded = this.companyArr.find(itemF => itemF.value === this.company_id[0]) && this.companyArr.find(itemF => itemF.value === this.company_id[0]).children.find(itemF => itemF.value === this.company_id[1])
        if (finded) {
          this.contactsArr = finded.contacts
        } else {
          this.contactsArr = []
        }
      }
    })
    let today = new Date()
    let todayMore14 = [this.$getTime(today)]
    let todayLess14 = [this.$getTime(today)]
    let monthArr = this.createMonthDay()
    for (let i = 1; i < 14; i++) {
      todayLess14.push(this.$getTime(today.getTime() - 24 * 60 * 60 * 1000 * i))
      todayMore14.push(this.$getTime(today.getTime() + 24 * 60 * 60 * 1000 * i))
    }
    todayLess14 = todayLess14.reverse()
    chartsAPI.order().then((res) => {
      let data = res.data.data
      this.processData.xAxis.data = todayMore14
      todayMore14.forEach((item) => {
        this.processData.series[0].data.push(data.proceed.day_number[item] || 0)
      })
      this.delayData.xAxis.data = todayLess14
      todayLess14.forEach((item) => {
        this.delayData.series[0].data.push(data.delay.day_number[item] || 0)
      })

      this.monthData.xAxis.data = monthArr
      monthArr.forEach((item) => {
        this.monthData.series[0].data.push(data.month.day_number[item] || 0)
      })
      this.completeData.series[0].data = [
        { value: data.progress.pack_real, name: '已完成' },
        { value: data.month.total_number - data.progress.pack_real, name: '未完成' }
      ]
      this.completeAll = data.progress.pack_real / data.month.total_number * 100
      this.processAll = data.proceed.total_number
      this.delayAll = data.delay.total_number
      this.monthAll = data.month.total_number
    })
  },
  filters: {
    filterStatus (status) {
      if (status === 2001) {
        return '已创建'
      } else if (status === 2002) {
        return '进行中'
      } else if (status === 2003) {
        return '已取消'
      } else if (status === 2004) {
        return '已完成'
      } else if (status === 2005) {
        return '已延期'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderList.less";
</style>
