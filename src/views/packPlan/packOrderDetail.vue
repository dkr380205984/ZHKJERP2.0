<template>
  <div id='packOrderDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单信息</div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">发货批次：</span>
            <span class="text">
              <zh-batch :data='$route.params.id'></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.contacts}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包装辅料统计</div>
      </div>
      <div class="detailCtn">
        <div class="swichCtn"
          v-if="planTb.length>0">
          <div class="swichCtnBox"
            style="left: 32px;">
            <span v-for="(item,index) in planTb"
              :key="index"
              :class="{'swich':true,'active':item.id === activePlanId}"
              @click="cutPlanTb(item.id)">装箱计划单{{chinaNum[index]}}</span>
          </div>
          <span class="handleBtn left"></span>
          <span class="handleBtn right"></span>
        </div>
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">产品/包装</span>
              <span class="tcolumn">包装规格</span>
              <span class="tcolumn">属性</span>
              <span class="tcolumn">计划数量</span>
              <span class="tcolumn">已订购数量</span>
              <span class="tcolumn center">操作</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in activePlanInfo"
              :key="index">
              <span class="tcolumn">{{item.pack_name || '/'}}</span>
              <span class="tcolumn">{{item.size_info ? item.size_info + 'cm' : '/'}}</span>
              <span class="tcolumn">{{item.attr || '/'}}</span>
              <span class="tcolumn">{{item.number ? item.number + item.unit : '/'}}</span>
              <span class="tcolumn">{{item.orderNum ? item.orderNum + item.unit : '/'}}</span>
              <span class="tcolumn center">
                <div class="btn noBorder noMargin"
                  @click="orderPack(item)">订购</div>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包装辅料订购</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb"
          style="margin:0">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn flex16">订购单位</span>
              <span class="tcolumn flex6 noPad">
                <span class="trow">
                  <span class="tcolumn">包装辅料</span>
                  <span class="tcolumn">单价</span>
                  <span class="tcolumn">已订购数量</span>
                  <span class="tcolumn right">总价</span>
                  <span class="tcolumn center">完成日期</span>
                  <span class="tcolumn center">备注</span>
                </span>
              </span>
              <span class="tcolumn center">操作</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in packOrderInfo"
              :key="index">
              <span class="tcolumn flex16">{{item.client_name}}</span>
              <span class="tcolumn flex6 noPad">
                <span class="trow"
                  v-for="(itemMa,indexMa) in item.material_info"
                  :key="indexMa">
                  <span class="tcolumn">{{itemMa.material_name}}</span>
                  <span class="tcolumn">{{itemMa.price ? itemMa.price + itemMa.unit + '/元' :'/'}}</span>
                  <span class="tcolumn">{{itemMa.number ? itemMa.number + itemMa.unit : '/'}}</span>
                  <span class="tcolumn">{{itemMa.total_price ? itemMa.total_price + '元' : '/'}}</span>
                  <span class="tcolumn center">{{itemMa.compiled_time.split(' ')[0]}}</span>
                  <span class="tcolumn center">
                    <el-popover placement="bottom"
                      v-if="item.desc"
                      width="200"
                      trigger="click"
                      :content="item.desc">
                      <div class="btn noBorder noMargin"
                        slot="reference">查看</div>
                    </el-popover>
                    <template v-else>暂无备注</template>
                  </span>
                </span>
              </span>
              <span class="tcolumn center">
                <div class="btn noBorder noMargin">打印</div>
              </span>
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          v-for="(itemOrder,indexOrder) in packOrderEdit"
          :key="indexOrder">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(packOrderEdit,indexOrder)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">订购单位</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOrder.order_client"
                  class="elInput"
                  filterable
                  default-first-option
                  placeholder="请选择订购单位">
                  <el-option v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">包装辅料</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-autocomplete v-model="itemOrder.pack_name"
                  class="elInput"
                  :fetch-suggestions="querySearchPack"
                  placeholder="请选择包装"></el-autocomplete>
                <!-- <el-select v-model="itemOrder.pack_name"
                  class="elInput"
                  filterable
                  default-first-option
                  placeholder="请选择包装辅料">
                  <el-option v-for="item in activePlanInfo"
                    :key="item.id"
                    :label="item.pack_name"
                    :value="item.pack_name">
                  </el-option>
                </el-select> -->
              </div>
            </div>
            <!-- <div class="colCtn flex3">
              <div class="label">
                <span class="text">规格</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入包装规格"
                  v-model="itemOrder.size_info">
                  <template slot="append">cm</template>
                </zh-input>
              </div>
            </div> -->
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">属性</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入包装属性"
                  v-model="itemOrder.attr"></zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <span class="label">
                <span class="text">计价方式</span>
              </span>
              <span class="content">
                <el-radio-group v-model="itemOrder.computed_method"
                  @change="computedPrice(itemOrder)">
                  <el-radio label="1">箱子</el-radio>
                  <el-radio label="2">袋子</el-radio>
                  <el-radio label="3">其他</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="colCtn">
              <span class="label">
                <span class="text">包装规格</span>
              </span>
              <span class="content"
                v-if="itemOrder.computed_method === '1' || itemOrder.computed_method === '2' ">
                <zh-input placeholder="长"
                  class="elInput"
                  v-model="itemOrder.long_box"
                  @input="computedPrice(itemOrder)"
                  type='number'></zh-input>
                <zh-input placeholder="宽"
                  class="elInput"
                  v-model="itemOrder.width_box"
                  @input="computedPrice(itemOrder)"
                  type='number'></zh-input>
                <zh-input placeholder="高"
                  v-if="itemOrder.computed_method !== '2'"
                  class="elInput"
                  v-model="itemOrder.height_box"
                  @input="computedPrice(itemOrder)"
                  type='number'></zh-input>
              </span>
              <span class="content"
                v-else>
                <zh-input placeholder="请输入包装规格"
                  v-model="itemOrder.size_info">
                  <template slot="append">cm</template>
                </zh-input>
              </span>
            </div>
            <div class="colCtn">
              <span class="label">
                <span class="text">单价信息</span>
              </span>
              <span class="content">
                <zh-input placeholder="单价"
                  v-if="itemOrder.computed_method === '1' || itemOrder.computed_method === '2'"
                  class="elInput"
                  v-model="itemOrder.price"
                  @input="computedPrice(itemOrder)"
                  type='number'>
                  <template slot="append">㎡/元</template>
                </zh-input>
                <zh-input placeholder="单价"
                  class="elInput"
                  :disabled="itemOrder.computed_method === '1' || itemOrder.computed_method === '2'"
                  v-model="itemOrder.one_price"
                  @input="computedTotalPrice(itemOrder)"
                  type='number'>
                  <template slot="append">{{(itemOrder.unit || '个') + '/元'}}</template>
                </zh-input>
              </span>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <span class="label">
                <span class="text">订购数量</span>
              </span>
              <span class="content">
                <zh-input placeholder='请输入订购数量'
                  v-model="itemOrder.number"
                  @input="computedTotalPrice(itemOrder)"
                  type='number'>
                  <template slot="append">{{itemOrder.unit || '个'}}</template>
                </zh-input>
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label">
                <span class="text">总价</span>
              </span>
              <span class="content">
                <zh-input placeholder='总价'
                  v-model="itemOrder.total_price"
                  type='number'>
                  <template slot="append">元</template>
                </zh-input>
              </span>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <span class="label">
                <span class="text">完成日期</span>
              </span>
              <span class="content">
                <el-date-picker v-model="itemOrder.compile_time"
                  class="elInput"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择完成日期">
                </el-date-picker>
              </span>
            </div>
            <div class="colCtn">
              <span class="label">
                <span class="text">备注信息</span>
              </span>
              <span class="content">
                <zh-input placeholder='请输入备注信息......'
                  v-model="itemOrder.remark"></zh-input>
              </span>
            </div>
          </div>
        </div>
        <div class="btnCtn_page right marginTop20">
          <div class="btn btnDashed"
            v-show="packOrderEdit.length > 0"
            @click="resetEditInfo('order')">重置</div>
          <div class="btn btnDashed bgBlue_page"
            v-if="packOrderEdit.length === 0"
            @click="addItem(packOrderEdit,'order')">+添加订购</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(packOrderEdit,'order')">
            <div class="btn btnOrange">+添加订购</div>
          </div>
          <div class="btn btnDashed"
            v-show="packOrderEdit.length > 0">
            <div class="btn btnBlue"
              @click="saveAll">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包装辅料订购日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row">订购单位</span>
            <span class="tb_row">包装辅料</span>
            <span class="tb_row">订购单价</span>
            <span class="tb_row">订购数量</span>
            <span class="tb_row">总价</span>
            <span class="tb_row middle">完成日期</span>
            <span class="tb_row middle">备注</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in orderLog[pageLog-1]"
            :key="index">
            <span class="tb_row">{{item.client_name}}</span>
            <span class="tb_row">{{item.material_name}}</span>
            <span class="tb_row">{{item.price}}元/{{item.unit}}</span>
            <span class="tb_row">{{item.number}}{{item.unit}}</span>
            <span class="tb_row">{{item.total_price}}元</span>
            <span class="tb_row middle">{{item.order_time.split(' ')[0]}}</span>
            <span class="tb_row middle">
              <el-popover placement="top"
                title="标题"
                width="200"
                trigger="click"
                :content="item.desc">
                <span class="tb_handle_btn blue"
                  slot="reference">查看</span>
              </el-popover>
            </span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn orange">修改</span>
              <span class="tb_handle_btn red">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="totalLog"
            :current-page.sync="pageLog">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray">返回</div>
          <!-- <div class="btn btnBlue">提交</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { letterArr, chinaNum } from '@/assets/js/dictionary.js'
import { packPlan, packag, order, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      letterArr: letterArr,
      chinaNum: chinaNum,
      orderInfo: {},
      planTb: [],
      packOrderEdit: [],
      clientList: [],
      packList: [],
      activePlanId: '',
      activePlanInfo: [],
      orderLog: [],
      packOrderInfo: [],
      pageLog: 1,
      totalLog: 1,
      lock: true
    }
  },
  methods: {
    cutPlanTb (id) {
      this.$confirm('请检测是否存在未保存的订购信息，切换装箱单将清空页面填写数据,请在提交订购后在进行切换计划单，是否继续切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let flag = this.planTb.find(items => items.id === id)
        if (flag) {
          this.activePlanId = id
          this.activePlanInfo = flag.planInfo
        } else {
          this.$message.error('未获取到该计划单信息，请尝试刷新页面')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    deleteItem (item, index, flag) {
      this.$confirm('此操作将删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.splice(index, 1)
        this.$message({
          type: 'success',
          message: '已删除'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addItem (item, type) {
      if (type === 'order') {
        item.push({
          order_client: '',
          pack_name: '',
          size_info: '',
          attr: '',
          computed_method: '3',
          long_box: '',
          width_box: '',
          height_box: '',
          price: '',
          one_price: '',
          number: '',
          total_price: '',
          compile_time: this.$getTime(),
          remark: ''
        })
      }
    },
    orderPack (item) {
      let sizeInfo = item.size_info.split('*')
      this.packOrderEdit.push({
        order_client: '',
        pack_name: item.pack_name,
        size_info: item.size_info,
        attr: item.attr,
        unit: item.unit,
        computed_method: '3',
        long_box: sizeInfo[0] || '',
        width_box: sizeInfo[1] || '',
        height_box: sizeInfo[2] || '',
        price: '',
        one_price: '',
        number: item.number,
        total_price: '',
        compile_time: this.$getTime(),
        remark: ''
      })
    },
    saveAll () {
      if (this.lock) {
        let flag = {
          client: true,
          material: true,
          type: true,
          price: true,
          number: true,
          totalPrice: true,
          time: true
        }
        this.packOrderEdit.forEach(item => {
          if (!item.order_client) {
            flag.client = false
          }
          if (!item.pack_name) {
            flag.material = false
          }
          if (!item.computed_method) {
            flag.type = false
          }
          if (!item.one_price) {
            flag.price = false
          }
          if (!item.number) {
            flag.number = false
          }
          if (!item.total_price) {
            flag.totalPrice = false
          }
          if (!item.compile_time) {
            flag.time = false
          }
        })
        if (!flag.client) {
          this.$message.error('检测到未选择订购公司，请选择')
          return
        }
        if (!flag.material) {
          this.$message.error('检测到未选择包装辅料，请选择')
          return
        }
        if (!flag.type) {
          this.$message.error('检测到未选择计价方式，请选择')
          return
        }
        if (!flag.price) {
          this.$message.error('检测到未填写单价，请填写')
          return
        }
        if (!flag.number) {
          this.$message.error('检测到未填写订购价格，请填写')
          return
        }
        if (!flag.totalPrice) {
          this.$message.error('检测到未填写总价，请填写')
          return
        }
        if (!flag.time) {
          this.$message.error('检测到未选择完成时间，请选择')
          return
        }
        let data = this.packOrderEdit.map(item => {
          return {
            order_id: this.$route.params.id,
            order_type: 1,
            client_id: item.order_client,
            material_name: item.pack_name,
            pack_size: item.size_info,
            attribute: item.attr,
            price_type: item.computed_method,
            size: JSON.stringify([item.long_box, item.width_box, item.height_box]),
            price_square: item.price,
            price: item.one_price,
            number: item.number,
            total_price: item.total_price,
            order_time: item.compile_time,
            desc: item.remark
          }
        })
        this.lock = false
        packPlan.packOrder({
          data: data
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('保存成功')
            this.packOrderEdit = []
            this.getLog()
          }
          this.lock = true
        })
      } else {
        this.$message.warning('请勿频繁点击')
      }
    },
    resetEditInfo (type) {
      if (type === 'order') {
        this.packOrderEdit = [{
          order_client: '',
          pack_name: '',
          size_info: '',
          attr: '',
          computed_method: '3',
          long_box: '',
          with_box: '',
          height_box: '',
          price: '',
          one_price: '',
          number: '',
          total_price: '',
          compile_time: '',
          remark: ''
        }]
      }
    },
    getLog () {
      this.loading = true
      this.activePlanInfo.forEach(item => {
        item.orderNum = 0
      })
      packPlan.packOrderLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        console.log(res.data.data)
        res.data.data.forEach(item => {
          let flag = this.packList.find(items => items.name === item.material_name)
          item.unit = flag ? flag.unit : '个'
          let packFlag = this.activePlanInfo.find(items => items.pack_name === item.material_name)
          if (packFlag) {
            packFlag.orderNum = Number(packFlag.orderNum || 0) + Number(item.number)
          }
        })
        this.orderLog = this.$newSplice(this.$clone(res.data.data), 5)
        this.totalLog = this.orderLog.length
        this.packOrderInfo = this.$mergeData(this.$clone(res.data.data), { mainRule: 'client_id', otherRule: [{ name: 'client_name' }], childrenName: 'material_info', childrenRule: { mainRule: ['material_name', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'unit' }, { name: 'total_price', type: 'add' }, { name: 'order_time/compiled_time' }, { name: 'desc' }] } })
        this.loading = false
      })
    },
    computedPrice (item) {
      let long = item.long_box ? item.long_box / 100 : 0
      let width = item.width_box ? item.width_box / 100 : 0
      let height = item.height_box ? item.height_box / 100 : 0
      let price = item.price || 0
      let orderNum = item.number || 0
      if (item.computed_method === '1') {
        item.one_price = this.$toFixed((long + width + 0.08) * (width + height + 0.04) * price)
        // item.total_price = this.$toFixed(item.one_price * orderNum)
      } else if (item.computed_method === '2') {
        item.one_price = this.$toFixed(long * width * 1.08 * price)
      }
      item.total_price = this.$toFixed(item.one_price * orderNum)
    },
    computedTotalPrice (item) {
      item.total_price = this.$toFixed((item.one_price || 0) * (item.number || 0))
    },
    querySearchPack (queryString, cb) {
      var restaurants = this.packList.map(item => { return { value: item.name } })
      console.log(restaurants)
      var results = queryString ? restaurants.filter(item => item.value.toLowerCase().indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    }
  },
  created () {
    Promise.all([
      packPlan.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }),
      packag.list(),
      order.editDetail({
        id: this.$route.params.id
      }),
      client.list()
    ]).then(res => {
      this.packList = res[1].data.data
      this.orderInfo = res[2].data.data
      this.clientList = res[3].data.data.filter(item => item.type.indexOf(7) !== -1)
      this.planTb = res[0].data.data.map(item => {
        let planInfo = JSON.parse(item.material_info).map(itemInner => {
          let flag = this.packList.find(items => items.name === itemInner.pack_name)
          itemInner.unit = flag ? flag.unit : '个'
          return itemInner
        })
        return {
          id: item.id,
          planInfo: planInfo
        }
      })
      this.activePlanId = this.planTb[0].id
      this.activePlanInfo = this.planTb[0].planInfo
      this.getLog()
      this.loading = false
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packOrderDetail.less";
</style>
