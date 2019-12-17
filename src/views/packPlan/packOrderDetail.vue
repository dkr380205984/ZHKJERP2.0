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
            <span class="swich active"
              v-for="(item,index) in planTb"
              :key="index"
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
            <span class="trow">
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn">
                <div class="btn noBorder">订购</div>
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
              <span class="tcolumn">订购单位</span>
              <span class="tcolumn">包装辅料</span>
              <span class="tcolumn">计划数量</span>
              <span class="tcolumn">已订购数量</span>
              <span class="tcolumn">单价</span>
              <span class="tcolumn right">总价</span>
              <span class="tcolumn center">完成日期</span>
              <span class="tcolumn center">备注</span>
              <span class="tcolumn center">操作</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow">
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn right"></span>
              <span class="tcolumn center"></span>
              <span class="tcolumn center">
                <el-popover placement="bottom"
                  title="标题"
                  width="200"
                  trigger="click"
                  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                  <div class="btn noBorder"
                    slot="reference">查看</div>
                </el-popover>
              </span>
              <span class="tcolumn">
                <div class="btn noBorder">订购</div>
              </span>
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          v-for="(itemOrder,indexOrder) in packOrderInfo"
          :key="indexOrder">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(packOrderInfo,indexOrder)"></span>
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
                    :value="item.name">
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
                <el-select v-model="itemOrder.pack_name"
                  class="elInput"
                  filterable
                  default-first-option
                  placeholder="请选择包装辅料">
                  <el-option v-for="item in packList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">规格</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入包装规格"
                  v-model="itemOrder.size_info"></zh-input>
              </div>
            </div>
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
                <el-radio-group v-model="itemOrder.computed_method">
                  <el-radio label="box">箱子</el-radio>
                  <el-radio label="bag">袋子</el-radio>
                  <el-radio label="other">其他</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="colCtn">
              <span class="label">
                <span class="text">包装规格</span>
              </span>
              <span class="content">
                <zh-input placeholder="长"
                  class="elInput"
                  v-model="itemOrder.long_box"
                  type='number'></zh-input>
                <zh-input placeholder="宽"
                  class="elInput"
                  v-model="itemOrder.long_box"
                  type='number'></zh-input>
                <zh-input placeholder="高"
                  class="elInput"
                  v-model="itemOrder.long_box"
                  type='number'></zh-input>
              </span>
            </div>
            <div class="colCtn">
              <span class="label">
                <span class="text">单价信息</span>
              </span>
              <span class="content">
                <zh-input placeholder="单价"
                  v-if="itemOrder.computed_method !== 'other'"
                  class="elInput"
                  v-model="itemOrder.price"
                  type='number'></zh-input>
                <zh-input placeholder="单价"
                  class="elInput"
                  :disabled='itemOrder.computed_method !== "other"'
                  v-model="itemOrder.one_price"
                  type='number'></zh-input>
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
                  type='number'></zh-input>
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label">
                <span class="text">总价</span>
              </span>
              <span class="content">
                <zh-input placeholder='总价'
                  v-model="itemOrder.total_price"
                  type='number'></zh-input>
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
            v-show="packOrderInfo.length > 0"
            @click="resetEditInfo('order')">重置</div>
          <div class="btn btnDashed bgBlue_page"
            v-if="packOrderInfo.length === 0"
            @click="addItem(packOrderInfo,'order')">+添加出入库</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(packOrderInfo,'order')">
            <div class="btn btnOrange">+添加出入库</div>
          </div>
          <div class="btn btnDashed"
            v-show="packOrderInfo.length > 0">
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
        <div class="tableCtnLv2">
          <div class="tb_header">
            <span class="tb_row">操作时间</span>
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
          <div class="tb_content">
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row middle">{{'2019-10-02'}}</span>
            <span class="tb_row middle">
              <el-popover placement="top"
                title="标题"
                width="200"
                trigger="click"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <span class="tb_handle_btn blue"
                  slot="reference">查看</span>
              </el-popover>
            </span>
            <span class="tb_row">{{'2019-10-02'}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn orange">修改</span>
              <span class="tb_handle_btn red">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="totalLog"
            :current-page.sync="pageLog"
            @current-change="getLog">
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
import { packag, order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      letterArr: letterArr,
      chinaNum: chinaNum,
      orderInfo: {},
      planTb: [{ id: 2 }, { id: 6 }],
      packOrderInfo: [
        {
          order_client: '',
          pack_name: '',
          size_info: '',
          attr: '',
          computed_method: 'box',
          long_box: '',
          with_box: '',
          height_box: '',
          price: '',
          one_price: '',
          number: '',
          total_price: '',
          compile_time: '',
          remark: ''
        }
      ],
      clientList: [],
      packList: [],
      pageLog: 1,
      totalLog: 1
    }
  },
  methods: {
    cutPlanTb (id) {
      this.$confirm('请检测是否存在未保存的订购信息，切换装箱单将清空页面填写数据,请在提交订购后在进行切换计划单，是否继续切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {

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
          computed_method: 'box',
          long_box: '',
          with_box: '',
          height_box: '',
          price: '',
          one_price: '',
          number: '',
          total_price: '',
          compile_time: '',
          remark: ''
        })
      }
    },
    saveAll () {

    },
    resetEditInfo (type) {
      if (type === 'order') {
        this.packOrderInfo = [{
          order_client: '',
          pack_name: '',
          size_info: '',
          attr: '',
          computed_method: 'box',
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

    }
  },
  created () {
    this.loading = false
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packOrderDetail.less";
</style>
