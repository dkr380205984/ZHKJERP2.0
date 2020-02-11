<template>
  <div class="indexMain"
    id="clientDetail"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{statistics.client_name}}</span>
        <span class="clientType">({{clientType}})</span>
      </div>
      <div class="listHead">
        <div class="box">
          <div class="boxTop blue">合计</div>
          <div class="boxBottom">
            <span class="num">{{$formatNum(statistics.total_price)}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop green">已结算</div>
          <div class="boxBottom">
            <span class="num">{{$formatNum(statistics.settle_price)}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop orange">待结算</div>
          <div class="boxBottom">
            <span class="num">{{$formatNum(statistics.wait_settle_price)}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop red">已扣款</div>
          <div class="boxBottom">
            <span class="num">{{$formatNum(statistics.deduct_price)}}</span>
            <span class="em">元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="listCtn hasBorderTop">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="tabCtn">
              <span class="tab"
                v-for="item in typeArr"
                :key="item"
                :class="{'active':item===type}"
                @click="type=item">{{item|filterType}}</span>
            </div>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              @click="reset"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
            <span class="opr blue">操作记录</span>
            <span class="opr green"
              @click="chargebacksFlag=true">结算</span>
            <span class="opr red">扣款</span>
          </div>
        </div>
        <!-- 订单公司 -->
        <template v-if="type===1">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">产品编号</span>
                    <span class="tb_row">产品品类</span>
                    <span class="tb_row">产品名称</span>
                    <span class="tb_row">尺码配色</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">下单数量</span>
                    <span class="tb_row">发货数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.product_code}}</span>
                    <span class="tb_row">{{itemChild.category_info.category_name}}/{{itemChild.category_info.type_name}}/{{itemChild.category_info.style_name}}</span>
                    <span class="tb_row">{{itemChild.product_name}}</span>
                    <span class="tb_row">{{itemChild.size}}/{{itemChild.color}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.order_number}}</span>
                    <span class="tb_row">{{itemChild.dispatch_number}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 原料纱线单位 -->
        <template v-if="type===2">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">纱线名称</span>
                    <span class="tb_row">纱线颜色</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">订购数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.material_name}}</span>
                    <span class="tb_row">{{itemChild.color}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.total_weight}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 物料加工单位 -->
        <template v-if="type===3">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">物料名称</span>
                    <span class="tb_row">物料颜色</span>
                    <span class="tb_row">加工类型</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">加工数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.material_name}}</span>
                    <span class="tb_row">{{itemChild.color}}</span>
                    <span class="tb_row">{{itemChild.process_type}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.weight}}kg</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 生产织造单位 -->
        <template v-if="type===4">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">产品编号</span>
                    <span class="tb_row">产品品类</span>
                    <span class="tb_row">尺码配色</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">织造数量</span>
                    <span class="tb_row">入库数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.product_code}}</span>
                    <span class="tb_row">{{itemChild.category_info.category_name}}/{{itemChild.category_info.type_name}}/{{itemChild.category_info.style_name}}</span>
                    <span class="tb_row">{{itemChild.size}}/{{itemChild.color}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.number}}</span>
                    <span class="tb_row">{{itemChild.put_number}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 半成品加工单位 -->
        <template v-if="type===5">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">产品编号</span>
                    <span class="tb_row">产品品类</span>
                    <span class="tb_row">尺码配色</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">加工数量</span>
                    <span class="tb_row">加工类型</span>
                    <span class="tb_row">入库数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.product_code}}</span>
                    <span class="tb_row">{{itemChild.category_info.category_name}}/{{itemChild.category_info.type_name}}/{{itemChild.category_info.style_name}}</span>
                    <span class="tb_row">{{itemChild.size}}/{{itemChild.color}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.number}}</span>
                    <span class="tb_row">{{itemChild.type}}</span>
                    <span class="tb_row">{{itemChild.put_number}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 包装辅料单位 -->
        <template v-if="type===7">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">包装名称</span>
                    <span class="tb_row">包装属性</span>
                    <span class="tb_row">包装尺码</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.material_name}}</span>
                    <span class="tb_row">{{itemChild.attribute||'暂无'}}</span>
                    <span class="tb_row">{{itemChild.size||'暂无'}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.number}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 运输单位 -->
        <template v-if="type===8">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">运输地址</span>
                    <span class="tb_row">运输箱数</span>
                    <span class="tb_row">运输立方数</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">运输总价</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.address}}</span>
                    <span class="tb_row">{{itemChild.cubic_number||'暂无'}}</span>
                    <span class="tb_row">{{itemChild.number||'暂无'}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.total_price}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <!-- 装饰辅料单位 -->
        <template v-if="type===10">
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row"
                style="flex:0.2">
                <el-checkbox v-model="checkAll"></el-checkbox>
              </span>
              <span class="tb_row">订单号</span>
              <span class="tb_row">下单日期</span>
              <span class="tb_row">负责小组</span>
              <span class="tb_row">合计金额</span>
              <span class="tb_row">扣款记录</span>
              <span class="tb_row">结算记录</span>
              <span class="tb_row">操作</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in list"
                :key="index">
                <div slot="title"
                  class="tb_collapse tb_content bigPadding">
                  <span class="tb_row"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{item.order_code}}</span>
                  <span class="tb_row">{{item.order_time}}</span>
                  <span class="tb_row">{{item.group_name}}</span>
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row">{{item.deduct_log}}</span>
                  <span class="tb_row">{{item.settle_log}}</span>
                  <span class="tb_row">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">辅料名称</span>
                    <span class="tb_row">辅料属性</span>
                    <span class="tb_row">单价</span>
                    <span class="tb_row">订购数量</span>
                  </div>
                  <div class="tb_collapse tb_content bigPadding smallHeight"
                    v-for="(itemChild,indexChild) in item.child_data"
                    :key="indexChild">
                    <span class="tb_row">{{itemChild.material_name}}</span>
                    <span class="tb_row">{{itemChild.color}}</span>
                    <span class="tb_row">{{itemChild.price}}</span>
                    <span class="tb_row">{{itemChild.total_weight}}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
      </div>
    </div>
    <div class="popup"
      v-show="chargebacksFlag">
      <div class="main">
        <div class="title">
          <div class="text">订单结算</div>
          <i class="el-icon-close"
            @click="chargebacksFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">订单编号：</div>
            <div class="info">
              <el-tag closable>
                19ABA
              </el-tag>
              <el-tag closable>
                19ABA12
              </el-tag>
              <el-tag closable>
                19ABA123C
              </el-tag>
            </div>
          </div>
          <div class="row">
            <div class="label">结算日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="chargebacks.date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">结算金额：</div>
            <div class="info">
              <zh-input placeholder="请输入结算金额"
                type="number"
                v-model="chargebacks.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">是否开票：</div>
            <div class="info">
              <el-radio v-model="chargebacks.ifInvoice"
                :label="true">已开票</el-radio>
              <el-radio v-model="chargebacks.ifInvoice"
                :label="false">未开票</el-radio>
            </div>
          </div>
          <div v-show="chargebacks.ifInvoice"
            v-for="(item,index) in chargebacks.invoiceDetail"
            :key="index">
            <div class="row">
              <div class="label">开票号码：</div>
              <div class="info">
                <el-input placeholder="请输入开票号码"
                  v-model="item.invoiceNum"></el-input>
              </div>
              <div class="editBtn blue"
                v-if="index===0"
                @click="addInvoice">添加</div>
              <div class="editBtn red"
                v-if="index>0"
                @click="deleteInvoice(index)">删除</div>
            </div>
            <div class="row">
              <div class="label">开票金额：</div>
              <div class="info">
                <el-input placeholder="请输入开票金额"
                  v-model="item.invoicePrice"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入"
                v-model="chargebacks.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray">取消</div>
          <div class="btn btnBlue">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statistics } from '@/assets/js/api.js'
import { companyType } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      date: [],
      type: 1,
      typeArr: [],
      checkAll: false,
      list: [],
      value: false,
      statistics: {
        deduct_price: 0,
        settle_price: 0,
        total_price: 0,
        wait_settle_price: 0,
        client_name: ''
      },
      chargebacksFlag: false,
      chargebacks: {
        date: '',
        price: '',
        ifInvoice: false,
        invoiceDetail: [{
          invoiceNum: '',
          invoicePrice: ''
        }],
        desc: ''
      }
    }
  },
  watch: {
    type (val) {
      this.init()
    }
  },
  computed: {
    clientType () {
      return companyType.find((item) => item.value === Number(this.type)).name
    }
  },
  filters: {
    filterType (val) {
      let str = companyType.find((item) => item.value === Number(val)).name
      return str.slice(0, str.length - 2)
    }
  },
  methods: {
    reset () {

    },
    addInvoice () {
      this.chargebacks.invoiceDetail.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.chargebacks.invoiceDetail.splice(index, 1)
    },
    init () {
      this.loading = true
      Promise.all([statistics.clientDetailList({
        client_id: this.$route.params.id,
        client_type: this.type
      }), statistics.clientDetailStatistics({
        client_id: this.$route.params.id,
        client_type: this.type
      })]).then((res) => {
        this.loading = false
        this.statistics = res[1].data
        this.list = res[0].data.data.map((item) => {
          item.check = false
          return item
        })
      })
    }
  },
  mounted () {
    this.typeArr = JSON.parse(this.$route.params.type)
    this.type = this.typeArr[0]
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/clientDetail.less";
</style>
<style lang="less">
#clientDetail {
  .el-collapse-item__header {
    position: relative;
    min-height: 54px;
    display: flex;
    .el-collapse-item__arrow {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%) rotateZ(90deg);
      color: #1a95ff;
      &.is-active {
        transform: translateY(-50%) rotateZ(270deg);
      }
    }
  }
  .el-collapse-item__wrap {
    background-color: #f2f4f7;
  }
}
</style>
