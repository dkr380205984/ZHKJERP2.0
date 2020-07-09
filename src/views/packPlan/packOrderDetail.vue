<template>
  <div id='packOrderDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/packPlan/packPlanCreate/' + $route.params.id)">
        <span class="icon packPlan"></span>
        <span class="name">装箱计划</span>
      </div>
      <div class="cut_item active">
        <span class="icon packOrder"></span>
        <span class="name">包装订购</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packStock/' + $route.params.id)">
        <span class="icon packOut"></span>
        <span class="name">装箱出库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">
          订单信息
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent"
            :afterSend="$winReload"></zh-message>
        </div>
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
              <zh-batch :data='orderInfo.order_batch'></zh-batch>
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
        <span class="title">调取包装辅料</span>
      </div>
      <div class="listCtn hasBorderTop"
        v-loading='stockLoading'>
        <zh-transition :list="stockTitleInfo"
          showKey='name'
          @changed="catFilterConditions"></zh-transition>
        <div class="tableCtnLv2">
          <div class="tb_header">
            <span class="tb_row">仓库名称</span>
            <span class="tb_row">包装名称</span>
            <span class="tb_row">包装规格</span>
            <span class="tb_row">包装属性</span>
            <span class="tb_row">库存数量</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in stockList"
            :key="index">
            <span class="tb_row">{{item.stock_name}}</span>
            <span class="tb_row">{{item.material_name}}</span>
            <span class="tb_row">{{item.size ? item.size + 'cm' : ''}}</span>
            <span class="tb_row">{{item.attribute}}</span>
            <span class="tb_row">{{item.total_number}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn blue"
                @click="showStockPopup(item)">调取</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="stockTotal"
            :current-page.sync="stockPages">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包装辅料订购</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb"
          style="margin:0"
          ref="orderModule">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn flex16">订购单位</span>
              <span class="tcolumn flex6 noPad">
                <span class="trow">
                  <span class="tcolumn flex5 noPad">
                    <span class="trow">
                      <span class="tcolumn">包装辅料</span>
                      <span class="tcolumn">单价</span>
                      <span class="tcolumn">已订购数量</span>
                      <span class="tcolumn">总价</span>
                    </span>
                  </span>
                  <span class="tcolumn center">完成日期</span>
                  <span class="tcolumn center">操作</span>
                </span>
              </span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in packOrderInfo"
              :key="index">
              <span class="tcolumn flex16">{{item.client_name}}</span>
              <span class="tcolumn flex6 noPad">
                <span class="trow"
                  v-for="(itemTime,indexTime) in item.time_info"
                  :key="indexTime">
                  <span class="tcolumn flex5 noPad">
                    <span class="trow"
                      v-for="(itemMa,indexMa) in itemTime.material_info"
                      :key="indexMa">
                      <span class="tcolumn">{{itemMa.material_name}}</span>
                      <span class="tcolumn">{{itemMa.price ? itemMa.price + '元/' + itemMa.unit :'/'}}</span>
                      <span class="tcolumn">{{itemMa.number ? itemMa.number + itemMa.unit : '/'}}</span>
                      <span class="tcolumn">{{itemMa.total_price ? itemMa.total_price + '元' : '/'}}</span>
                    </span>
                  </span>
                  <span class="tcolumn center">{{$getTime(itemTime.compiled_time)}}</span>
                  <span class="tcolumn center">
                    <div class="btn noBorder noMargin"
                      @click="$openUrl('/packOrderTable/' + $route.params.id + '?clientId=' + item.client_id + '&time=' + $getTime(itemTime.compiled_time))">打印</div>
                  </span>
                </span>
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
                  placeholder="请选择包装"
                  @select="handleSelect($event,itemOrder)"></el-autocomplete>
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
                  <template slot="append">{{'元/'+ (itemOrder.unit || '个') }}</template>
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
        <div class="btnCtn_page">
          <div class="btn noBorder noMargin"
            :style="isNoStockInfo ? 'color:rgba(0,0,0,0.3);cursor: not-allowed;' : ''"
            @click="isNoStockInfo ? $message.warning('暂无法删除仓库调取信息') : deleteLog('all',orderLog)">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="download">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">订购单位</span>
            <span class="tb_row">包装辅料</span>
            <span class="tb_row">订购单价</span>
            <span class="tb_row">订购数量</span>
            <span class="tb_row">总价</span>
            <span class="tb_row middle">完成日期</span>
            <span class="tb_row middle">其他信息</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in orderLog[pageLog-1]"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{item.client_name}}</span>
            <span class="tb_row">{{item.material_name}}</span>
            <span class="tb_row">{{item.price}}元/{{item.unit}}</span>
            <span class="tb_row">{{item.number}}{{item.unit}}</span>
            <span class="tb_row">{{item.total_price}}元</span>
            <span class="tb_row middle">{{$getTime(item.order_time)}}</span>
            <span class="tb_row middle">
              <el-tooltip placement="top">
                <div slot="content">规格：{{item.price_square ? JSON.parse(item.size).join('*') : item.pack_size}}cm<br />属性：{{item.attribute}}<br />备注：{{item.desc}}</div>
                <span class="tb_handle_btn blue">查看</span>
              </el-tooltip>
            </span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn"
                v-if="item.action_type === 3"
                @click="$message.warning('暂无法删除仓库调取信息')">删除</span>
              <span class="tb_handle_btn red"
                @click="deleteLog('one',item.id)"
                v-else>删除</span>
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
    <!-- 调取窗口 -->
    <div class="popup"
      v-if="stockPopupFlag">
      <div class="main">
        <div class="title">
          <span class="text">调取包装辅料</span>
          <span class="el-icon-close"
            @click="stockPopupFlag = false"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">仓库名称：</span>
            <span class="info">{{stockInfo.stock_name}}</span>
          </div>
          <div class="row">
            <span class="label">包装辅料：</span>
            <span class="info">{{stockInfo.material_name}}</span>
          </div>
          <div class="row">
            <span class="label">包装规格：</span>
            <span class="info">{{stockInfo.size ? stockInfo.size + 'cm' : '无'}}</span>
          </div>
          <div class="row">
            <span class="label">包装属性：</span>
            <span class="info">{{stockInfo.attribute || '无'}}</span>
          </div>
          <div class="row">
            <span class="label">库存数量：</span>
            <span class="info">{{stockInfo.total_number}}</span>
          </div>
          <div class="row">
            <span class="label">调取数量：</span>
            <span class="info">
              <zh-input v-model="stockInfo.stock_number"
                type='number'
                placeholder="请输入调取数量"></zh-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="stockPopupFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveStockPack">调取</div>
        </div>
      </div>
    </div>
    <!-- 扣款窗口 -->
    <div class="popup"
      v-if="deductPopupFlag">
      <div class="main">
        <div class="title">
          单位扣款
          <span class="el-icon-close"
            @click="deductPopupFlag = false"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">扣款单位：</span>
            <span class="info">
              <el-select v-model="deductInfo.client_id"
                filterable
                placeholder="请选择需要扣款的单位">
                <el-option v-for="item in clientArr"
                  :key="item.client_id"
                  :label="item.client_name"
                  :value="item.client_id + '-' + item.type">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">扣款金额：</span>
            <span class="info">
              <zh-input type='number'
                v-model=" deductInfo.price"
                placeholder="请输入需要扣除款项的金额">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">扣款备注：</span>
            <span class="info">
              <zh-input v-model=" deductInfo.remark"
                placeholder="请输入扣款备注">
              </zh-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="deductPopupFlag = false">取消</span>
          <span class="btn btnBlue"
            @click="clientDeduct">确定</span>
        </div>
      </div>
    </div>
    <!-- 操作记录 -->
    <div class="popup"
      v-show="deductLogPopupFlag">
      <div class="main">
        <div class="title">
          <div class="text">扣款记录</div>
          <i class="el-icon-close"
            @click="deductLogPopupFlag=false"></i>
        </div>
        <div class="content">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in deductLogList"
              :key="index">
              <el-collapse>
                <el-collapse-item>
                  <template slot="title">
                    <span style="color:rgba(0,0,0,0.65);">{{item.complete_time?item.complete_time:'有问题'}}</span>
                    <span style="margin-left:20px;color:#F5222D">扣款</span>
                    <span style="margin-left:20px">金额：
                      <span style="font-size:14px">{{$formatNum(item.deduct_price)}}</span>
                    </span>
                  </template>
                  <div class="collapseBox">
                    <span class="label">操作：</span>
                    <span class="info">
                      <span class="blue"
                        @click="$router.push('/financialStatistics/oprDetail/' + item.client_id + '/' +item.type + '/' + item.id + '/扣款?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)">查看详情</span>
                    </span>
                  </div>
                  <div class="collapseBox">
                    <span class="label">扣款单位：</span>
                    <span class="info">{{item.client_name}} </span>
                  </div>
                  <div class="collapseBox">
                    <span class="label">扣款原因：</span>
                    <span class="info">{{item.desc}}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="deductLogPopupFlag=false">关闭</div>
          <div class="btn btnBlue"
            @click="deductLogPopupFlag=false">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnWhiteBlue"
            @click="deductLogPopupFlag = true">扣款日志</div>
          <div class="btn btnWhiteRed"
            @click="deductPopupFlag = true">单位扣款</div>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { letterArr, chinaNum } from '@/assets/js/dictionary.js'
import { packPlan, packag, order, client, packStock, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
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
      lock: true,
      // 库存调取数据
      stockLoading: true,
      stockTitleInfo: [
        {
          name: '所有包装库存',
          value: ''
        }
      ],
      stockList: [],
      stockPages: 1,
      stockTotal: 1,
      stockPopupFlag: false,
      stockInfo: {
        stock_id: '',
        stock_name: '',
        material_name: '',
        attribute: '',
        size: '',
        total_number: '',
        stock_number: ''
      },
      // 扣款窗口数据
      deductPopupFlag: false,
      clientArr: [],
      deductInfo: {
        client_id: '',
        price: '',
        remark: ''
      },
      deductLogPopupFlag: false,
      deductLogList: []
    }
  },
  methods: {
    // 扣款提交
    clientDeduct () {
      if (!this.deductInfo.client_id) {
        this.$message.error('请选择需要扣款的合作单位')
        return
      }
      if (!this.deductInfo.price) {
        this.$message.error('请填写需要扣除款项的金额')
        return
      }
      chargebacks.create({
        id: null,
        client_id: this.deductInfo.client_id.split('-')[0],
        order_id: JSON.stringify([this.$route.params.id]),
        complete_time: this.$getTime(),
        deduct_price: this.deductInfo.price,
        desc: this.deductInfo.remark,
        order_type: 1,
        type: this.deductInfo.client_id.split('-')[1]
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣款成功')
          this.deductPopupFlag = false
          this.getDeductLog()
        }
      })
    },
    // 获取扣款日志
    getDeductLog () {
      chargebacks.log({
        order_type: 1,
        order_id: this.$route.params.id,
        type: [6]
      }).then((res) => {
        this.deductLogList = res.data.data
      })
    },
    init (activePlanId) {
      this.loading = true
      this.getDeductLog()
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
        if (this.planTb.length > 0) {
          if (activePlanId) {
            this.activePlanId = activePlanId
            this.activePlanInfo = this.planTb.find(item => item.id === activePlanId).planInfo
          } else {
            this.activePlanId = this.planTb[0].id
            this.activePlanInfo = this.planTb[0].planInfo
          }
        }
        this.stockTitleInfo = this.activePlanInfo.map(item => {
          return {
            name: item.pack_name,
            value: item.pack_name
          }
        }).concat({
          name: '所有包装库存',
          value: ''
        })
        if (!this.activeFilterKeyword) {
          this.activeFilterKeyword = this.stockTitleInfo[0]
        }
        this.getPackStockList(this.stockTitleInfo[0].value)
        this.getLog()
        this.loading = false
      })
    },
    // 批量导出excel
    download () {
      let data = []
      this.orderLog.forEach(item => {
        data.push(...item.filter(value => value.checked))
      })
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.pack_size = item.price_square ? JSON.parse(item.size).join('*') : item.pack_size
        return item
      })
      console.log(data)
      downloadExcel(data, [
        { title: '订购单位', key: 'client_name' },
        { title: '包装辅料', key: 'material_name' },
        { title: '单价', key: 'price' },
        { title: '数量', key: 'number' },
        { title: '总价', key: 'total_price' },
        { title: '完成日期', key: 'order_time' },
        { title: '规格', key: 'pack_size' },
        { title: '属性', key: 'attribute' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    deleteLog (type, item) {
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
        packPlan.deletePackOrder({
          id: checkedArr
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.init()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
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
      let elementGo = this.$refs.orderModule
      elementGo.scrollIntoView()
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
            pack_plan_id: this.activePlanId,
            price_square: item.price,
            desc: item.remark,
            order_time: item.compile_time,
            total_price: item.total_price,
            attribute: item.attr,
            pack_size: item.size_info,
            price_type: item.computed_method,
            size: JSON.stringify([item.long_box, item.width_box, item.height_box]),
            price: item.one_price,
            number: item.number,
            client_id: item.order_client,
            material_name: item.pack_name,
            // order_type: 1,
            order_id: this.$route.params.id,
            unit: item.unit || '个'
          }
        })
        this.lock = false
        packPlan.packOrder({
          data: {
            order_data: data,
            stock_data: null
          }
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('保存成功')
            this.packOrderEdit = []
            this.getLog()
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/packPlan/packOrderDetail/' + this.$route.params.id
              this.msgContent = '<span style="color:#1A95FF">添加</span>了新的包装订购信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.$router.push('/packPlan/packOrderDetail/' + this.$route.params.id)
            }
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
      Promise.all([
        packStock.log({
          order_id: this.$route.params.id
        }),
        packPlan.packOrderLog({
          order_id: this.$route.params.id,
          order_type: 1
        })
      ]).then(res => {
        let stockLog = res[0].data.data.map(item => {
          let flag = this.packList.find(items => items.name === item.material_name)
          return {
            checked: false,
            client_name: item.stock_name,
            unit: flag ? flag.unit : '个',
            material_name: item.material_name,
            price: 0,
            number: item.number,
            total_price: 0,
            order_time: item.created_at,
            pack_size: item.size,
            attribute: item.attribute,
            desc: item.desc,
            user_name: item.user_name,
            action_type: item.action_type,
            pack_plan_id: item.pack_plan_id
          }
        })
        this.planTb.forEach(itemPlan => {
          itemPlan.planInfo.forEach(itemPack => {
            let filterLog = res[1].data.data.concat(stockLog).filter(items => items.pack_plan_id === itemPlan.id && items.material_name === itemPack.pack_name).map(items => Number(items.number || 0))
            if (filterLog.length > 0) {
              itemPack.orderNum = filterLog.reduce((total, value) => {
                return total + value
              })
            }
          })
        })
        this.clientArr = this.$unique(res[1].data.data.map(itemM => {
          return {
            client_name: itemM.client_name,
            client_id: itemM.client_id,
            type: 6
          }
        }))
        this.orderLog = this.$newSplice(this.$clone(res[1].data.data).concat(stockLog).map(item => {
          return {
            ...item,
            checked: false
          }
        }), 5)
        this.totalLog = this.orderLog.length
        this.packOrderInfo = this.$mergeData(this.$clone(res[1].data.data), { mainRule: 'client_id', otherRule: [{ name: 'client_name' }], childrenName: 'time_info', childrenRule: { mainRule: 'order_time/compiled_time', childrenName: 'material_info', childrenRule: { mainRule: ['material_name', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'unit' }, { name: 'total_price', type: 'add' }, { name: 'desc' }] } } })
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
      var restaurants = this.packList.map(item => { return { value: item.name, unit: item.unit } })
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    catFilterConditions (eve) {
      this.getPackStockList(eve.value)
    },
    getPackStockList (keyword) {
      this.stockLoading = true
      packStock.list({
        limit: 5,
        page: this.stockPages,
        material_name: keyword
      }).then(res => {
        if (res.data.status !== false) {
          this.stockList = res.data.data
          this.stockTotal = res.data.meta.total
        }
        this.stockLoading = false
      })
    },
    showStockPopup (item) {
      this.stockPopupFlag = true
      this.stockInfo = {
        stock_id: item.stock_id,
        stock_name: item.stock_name,
        material_name: item.material_name,
        attribute: item.attribute,
        size: item.size,
        total_number: item.total_number,
        stock_number: ''
      }
    },
    saveStockPack () {
      if (this.lock) {
        if (!this.stockInfo.stock_number) {
          this.$message.error('请输入调取数量')
          return
        }
        let data = [{
          pack_plan_id: this.activePlanId,
          material_name: this.stockInfo.material_name,
          size: this.stockInfo.size,
          stock_id: this.stockInfo.stock_id,
          attribute: this.stockInfo.attribute,
          order_id: this.$route.params.id,
          number: -this.stockInfo.stock_number,
          action_type: 3,
          desc: null
        }]
        this.lock = false
        packPlan.packOrder({
          data: {
            stock_data: data,
            order_data: null
          }
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('调取成功')
            this.packOrderEdit = []
            this.init()
            this.stockPopupFlag = false
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/packPlan/packOrderDetail/' + this.$route.params.id
              this.msgContent = '<span style="color:#1A95FF">添加</span>了新的包装调取信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.$router.push('/packPlan/packOrderDetail/' + this.$route.params.id)
            }
          }
          this.lock = true
        })
      } else {
        this.$message.warning('请勿频繁操作')
      }
    },
    handleSelect ($event, item) {
      item.unit = $event.unit
    }
  },
  created () {
    this.init()
  },
  computed: {
    isNoStockInfo () {
      let data = []
      this.orderLog.forEach(item => {
        data.push(...item.filter(items => items.checked && items.action_type === 3))
      })
      return data.length
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packOrderDetail.less";
</style>
<style lang="less">
#packOrderDetail {
  .popup {
    .el-timeline-item {
      padding-bottom: 0px;
      margin-bottom: -9px;
    }
    .el-collapse-item__header {
      min-height: 46px;
      height: 46px;
    }
    .el-timeline-item__tail {
      margin-top: 14px;
    }
    .el-timeline-item__node--normal {
      margin-top: 14px;
    }
    .collapseBox {
      display: flex;
      margin: 12px;
      .info {
        flex: 1;
      }
    }
  }
}
</style>
