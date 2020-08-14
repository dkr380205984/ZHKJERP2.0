<template>
  <div id='packStock'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/packPlan/packPlanCreate/' + $route.params.id)">
        <span class="icon packPlan"></span>
        <span class="name">装箱计划</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packOrderDetail/' + $route.params.id)">
        <span class="icon packOrder"></span>
        <span class="name">包装订购</span>
      </div>
      <div class="cut_item active">
        <span class="icon packOut"></span>
        <span class="name">销售出库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn"
        style="justify-content:start;display:flex">
        <div class="title">订单信息</div>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="$winReload"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}
              <order-warning :progress="orderInfo.time_progress"></order-warning>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{orderInfo.desc}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data='orderInfo.order_batch'></zh-batch>
            </span>
          </div>
        </div>
      </div>
    </div>
    <zh-file-module :orderId='$route.params.id'
      title_has_border />
    <div class="module">
      <div class="titleCtn rightBtn">
        <div class="title">销售出库</div>
        <div class="btn noBorder"
          v-if="outMarketLog.length > 0"
          @click="$goElView('market')">查看日志</div>
        <div class="btn noBorder ban"
          v-else>暂无日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb noMargin">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">销售单位</span>
              <span class="tcolumn">销售产品</span>
              <span class="tcolumn">尺码/颜色</span>
              <span class="tcolumn">销售单价</span>
              <span class="tcolumn">销售数量</span>
              <span class="tcolumn center">出库时间</span>
              <span class="tcolumn center">价格说明</span>
              <span class="tcolumn center">备注</span>
              <!-- <span class="tcolumn center">操作</span> -->
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in outMarketInfo"
              :key="index">
              <span class="tcolumn">{{item.client_name}}</span>
              <span class="tcolumn">{{item.product_code}}<br />{{item.category_info|filterType}}</span>
              <span class="tcolumn">{{item.size_name + '/' + item.color_name}}</span>
              <span class="tcolumn">{{item.price}}</span>
              <span class="tcolumn">{{item.number}}</span>
              <span class="tcolumn center">{{item.complete_time}}</span>
              <span class="tcolumn center">
                <template v-if="item.price_remark">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="item.price_remark">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
              </span>
              <span class="tcolumn center">
                <template v-if="item.desc">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="item.desc">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
              </span>
              <!-- <span class="tcolumn center">
                <span class="btn noBorder noPadding" @click="addMarketOutItem(item)">再次销售</span>
              </span> -->
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          id="markEditBody"
          v-for="(itemOut,indexOut) in outMarketEditInfo"
          :key="indexOut">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(outMarketEditInfo,indexOut,true)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">销售单位</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.client_name"
                  filterable
                  default-first-option
                  clearable
                  class="elInput"
                  placeholder="请选择运输单位">
                  <el-option v-for="item in marketClient"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出库时间</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-date-picker v-model="itemOut.out_time"
                  class="elInput"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">销售产品</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.product_id"
                  clearable
                  class="elInput"
                  placeholder="请选择销售产品"
                  @change="marketProductChange($event,itemOut)">
                  <el-option v-for="item in productInfo_merge_list"
                    :key="item.product_id"
                    :label="item.product_code + '(' + item.type.join('/') + ')'"
                    :value="item.product_id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">尺码/颜色</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-cascader v-model="itemOut.sizeColor"
                  :options="itemOut.sizeColorArr"
                  placeholder="请选择尺码颜色"
                  :props="{ expandTrigger: 'hover' }"></el-cascader>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">销售数量</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input class="elInput"
                  placeholder="销售数量"
                  type='number'
                  v-model="itemOut.number"
                  @input="computedTotalPrice(itemOut)">
                  <template slot="append">{{itemOut.unit || '件'}}</template>
                </zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">销售单价</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input type='number'
                  placeholder='销售单价'
                  v-model="itemOut.price"
                  @input="computedTotalPrice(itemOut)">
                  <template slot="append">元</template>
                </zh-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">价格说明</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入价格说明"
                  class="elInput"
                  v-model="itemOut.price_desc"></zh-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">总价</span>
              </div>
              <div class="content">
                <zh-input placeholder="总价"
                  disabled
                  class="elInput"
                  v-model="itemOut.total_price">
                  <template slot="append">元</template>
                </zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">备注</span>
              </div>
              <div class="content">
                <zh-input class="elInput"
                  v-model="itemOut.remark"
                  placeholder="备注信息"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="outMarketEditInfo.length > 0"
            @click="resetEditInfo('outMarket')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="outMarketEditInfo.length === 0"
            @click="addItem(outMarketEditInfo,'outMarket')">+添加销售出库单位</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(outMarketEditInfo,'outMarket')">
            <div class="btn btnBlue">+添加销售出库单位</div>
          </div>
          <div class="btn btnDashed"
            v-show="outMarketEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveOutMarket">保存</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="module"
      id="actualPacking"
      v-if="actualPackingLog.length > 0">
      <div class="titleCtn">
        <div class="title">实际装箱日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          id='yarn'>
          <div class="btn noBorder noMargin"
            @click="deleteLog('all',actualPackingLog,'actualPacking')">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="download">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">操作时间</span>
            <span class="tb_row">产品信息</span>
            <span class="tb_row flex08">尺码颜色</span>
            <span class="tb_row flex08">实际装箱数</span>
            <span class="tb_row flex08">箱数</span>
            <span class="tb_row flex08">备注</span>
            <span class="tb_row flex08">操作人</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in actualPackingLog[actualPackingLogPages-1]"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.create_time}}</span>
            <span class="tb_row">{{itemLog.product_code}}<br />{{itemLog.type.join('/')}}</span>
            <span class="tb_row flex08">{{itemLog.size_name + '/' + itemLog.color_name}}</span>
            <span class="tb_row flex08">{{itemLog.pack_number+itemLog.unit}}</span>
            <span class="tb_row flex08">{{itemLog.total_box || '/'}}</span>
            <span class="tb_row flex08">
              <template v-if="itemLog.desc">
                <el-popover placement="top-start"
                  title="备注信息"
                  width="200"
                  trigger="hover"
                  :content="itemLog.desc">
                  <div class="blue"
                    slot="reference">查看</div>
                </el-popover>
              </template>
              <template v-else>无</template>
            </span>
            <span class="tb_row flex08">{{itemLog.user_name}}</span>
            <span class="tb_row middle flex08">
              <span class="tb_handle_btn red"
                @click="deleteLog('one',itemLog.id,'actualPacking')">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="actualPackingLogTotal"
            :current-page.sync="actualPackingLogPages">
          </el-pagination>
        </div>
      </div>
    </div> -->
    <div class="module"
      id="market"
      v-if="outMarketLog.length > 0">
      <div class="titleCtn">
        <div class="title">销售出库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          id='yarn'>
          <div class="btn noBorder noMargin"
            @click="deleteLog('all',outMarketLog,'outMarket')">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="downloadMarket">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">出库时间</span>
            <span class="tb_row">销售单位</span>
            <span class="tb_row">销售产品</span>
            <span class="tb_row flex06">尺码颜色</span>
            <span class="tb_row flex06">销售数量</span>
            <span class="tb_row flex06">销售单价</span>
            <span class="tb_row middle flex06">价格说明</span>
            <span class="tb_row middle flex08">总价</span>
            <!-- <span class="tb_row middle flex06">操作人</span> -->
            <span class="tb_row middle flex06">备注</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in outMarketLog[outMarketLogPages-1]"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.complete_time}}</span>
            <span class="tb_row">{{itemLog.client_name}}</span>
            <span class="tb_row">{{itemLog.product_code}}<br />{{itemLog.category_info|filterType}}</span>
            <span class="tb_row flex06">{{itemLog.size_name + '/' + itemLog.color_name}}</span>
            <span class="tb_row flex06">{{itemLog.number}}{{itemLog.category_info.unit || '件'}}</span>
            <span class="tb_row flex06">{{itemLog.price}}元/{{itemLog.category_info.unit || '件'}}</span>
            <span class="tb_row middle flex06">
              <template v-if="itemLog.price_remark">
                <el-popover placement="top"
                  width="200"
                  trigger="click"
                  :content="itemLog.price_remark">
                  <span class="btn noBorder"
                    style="margin:0"
                    slot="reference">查看</span>
                </el-popover>
              </template>
              <template v-else>无</template>
            </span>
            <span class="tb_row middle flex08">{{itemLog.total_price}}元</span>
            <!-- <span class="tb_row middle flex06">{{itemLog.user_name}}</span> -->
            <span class="tb_row middle flex06">
              <template v-if="itemLog.desc">
                <el-popover placement="top"
                  width="200"
                  trigger="click"
                  :content="itemLog.desc">
                  <span class="btn noBorder"
                    style="margin:0"
                    slot="reference">查看</span>
                </el-popover>
              </template>
              <template v-else>无</template>
            </span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteLog('one',itemLog.id,'outMarket')">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="outMarketLogTotal"
            :current-page.sync="outMarketLogPages">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, client, packPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      orderInfo: {},
      lock: true,
      // 销售出库
      outMarketEditInfo: [],
      productInfo_merge_list: [],
      outMarketLog: [],
      outMarketInfo: [],
      marketClient: [],
      outMarketLogPages: 1,
      outMarketLogTotal: 1
    }
  },
  methods: {
    saveOutMarket () {
      let flag = {
        client: true,
        time: true,
        product: true,
        size: true,
        color: true,
        number: true,
        price: true
      }
      let data = this.outMarketEditInfo.map(item => {
        if (!item.client_name) {
          flag.client = false
        }
        if (!item.out_time) {
          flag.time = false
        }
        if (!item.product_id) {
          flag.product = false
        }
        if (!item.sizeColor[0]) {
          flag.size = false
        }
        if (!item.sizeColor[1]) {
          flag.color = false
        }
        if (!item.number) {
          flag.number = false
        }
        if (!item.price) {
          flag.price = false
        }
        return {
          order_id: this.$route.params.id,
          product_id: item.product_id,
          client_id: item.client_name,
          complete_time: item.out_time,
          size_id: item.sizeColor[0],
          color_id: item.sizeColor[1],
          price: item.price,
          price_remark: item.price_desc,
          desc: item.remark,
          total_price: item.total_price || 0,
          number: item.number
        }
      })
      if (!flag.client) {
        this.$message.error('请选择销售单位')
        return false
      }
      if (!flag.time) {
        this.$message.error('请选择出库时间')
        return false
      }
      if (!flag.product) {
        this.$message.error('请选择销售产品')
        return false
      }
      if (!flag.size) {
        this.$message.error('请选择尺码')
        return false
      }
      if (!flag.color) {
        this.$message.error('请选择颜色')
        return false
      }
      if (!flag.number) {
        this.$message.error('请输入销售数量')
        return false
      }
      if (!flag.price) {
        this.$message.error('请选择销售单价')
        return false
      }
      packPlan.outMarket({ data: data }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.outMarketEditInfo = []
          this.getOutMarketLog()
        }
      })
    },
    marketProductChange (event, item) {
      let flag = this.productInfo_merge_list.find(item => item.product_id === event)

      if (flag) {
        item.sizeColorArr = flag.size_info
        item.unit = flag.unit
      }
    },
    addMarketOutItem (item, havePlan) {
      if (!havePlan) {
        let flag = this.productInfo_merge_list.find(itemPro => itemPro.product_id === item.id)
        this.outMarketEditInfo.push({
          client_name: '',
          out_time: this.$getTime(),
          product_id: item.id,
          sizeColor: item.size_color,
          price: '',
          number: '',
          price_desc: '',
          total_price: '',
          remark: '',
          sizeColorArr: flag ? flag.size_info : [],
          unit: flag ? flag.unit : ''
        })
      } else {
        let flag = this.productInfo_merge_list.find(itemPro => itemPro.product_id === item.product_id)
        this.outMarketEditInfo.push({
          client_name: '',
          out_time: this.$getTime(),
          product_id: item.product_id,
          sizeColor: item.sizeColor,
          price: '',
          number: '',
          price_desc: '',
          total_price: '',
          remark: '',
          sizeColorArr: flag ? flag.size_info : [],
          unit: flag ? flag.unit : ''
        })
      }
      setTimeout(() => {
        this.$goElView('markEditBody')
      })
    },
    getOutMarketLog () {
      packPlan.outMarketLog({
        order_id: this.$route.params.id
      }).then(res => {
        if (res.data.stauts !== false) {
          let data = this.$clone(res.data.data)
          this.outMarketInfo = data
          this.outMarketLog = this.$newSplice(res.data.data, 5)
          this.outMarketLogTotal = this.outMarketLog.length
        }
      })
    },
    computedTotalPrice (item) {
      if (item.number && item.price) {
        item.total_price = this.$toFixed(item.number * item.price)
      }
    },
    deleteLog (type, item, types) {
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let checkedArr = []
        if (type === 'all') {
          let deleteItem = []
          item.forEach(itemInner => {
            deleteItem = deleteItem.concat(itemInner)
          })
          checkedArr = deleteItem.filter(value => value.checked).map(value => value.id)
        } else {
          checkedArr.push(item)
        }
        packPlan.deleteOutMark({
          id: checkedArr
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.getOutMarketLog()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    addItem (item, type) {
      if (type === 'outMarket') {
        item.push(
          {
            client_name: '',
            out_time: this.$getTime(),
            product_id: '',
            sizeColor: '',
            price: '',
            number: '',
            price_desc: '',
            total_price: '',
            remark: '',
            sizeColorArr: []
          }
        )
      }
    },
    resetEditInfo (type) {
      this.$confirm('此操作将重置填写的数据，无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'outMarket') {
          this.outMarketEditInfo = []
        }
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    downloadMarket () {
      let data = []
      this.outMarketLog.forEach(item => {
        data.push(...item.filter(value => value.checked))
      })
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.product_type = [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/')
        return item
      })
      downloadExcel(data, [
        { title: '出库时间', key: 'complete_time' },
        { title: '销售单位', key: 'client_name' },
        { title: '销售产品', key: 'product_code' },
        { title: '产品类型', key: 'product_type' },
        { title: '尺码', key: 'size_name' },
        { title: '颜色', key: 'color_name' },
        { title: '销售数量', key: 'number' },
        { title: '销售单价', key: 'price' },
        { title: '价格说明', key: 'price_remark' },
        { title: '总价', key: 'total_price' },
        { title: '备注', key: 'desc' }
      ], this.orderInfo)
    }
  },
  created () {
    Promise.all([
      order.editDetail({
        id: this.$route.params.id
      }),
      client.list()
    ]).then(res => {
      this.orderInfo = res[0].data.data
      let productDetail = []
      this.orderInfo.order_batch.map(item => item.product_info).forEach(item => {
        productDetail = productDetail.concat(item)
      })
      this.productInfo_merge_list = this.$mergeData(productDetail, { mainRule: 'product_code', otherRule: [{ name: 'product_id' }, { name: 'category_info' }], childrenName: 'size_info', childrenRule: { mainRule: 'size_id', otherRule: [{ name: 'size_name' }], childrenName: 'color_info' } }).map(item => {
        return {
          product_code: item.product_code,
          product_id: item.product_id,
          type: [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name],
          unit: item.category_info.unit,
          size_info: item.size_info.map(itemSize => {
            return {
              value: itemSize.size_id,
              label: itemSize.size_name,
              children: itemSize.color_info.map(itemColor => {
                return {
                  value: itemColor.color_id,
                  label: itemColor.color_name
                }
              })
            }
          })
        }
      })
      this.marketClient = res[1].data.data.filter(item => item.type.indexOf(11) !== -1)
      this.getOutMarketLog()
      this.loading = false
    })
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packStock.less";
</style>
