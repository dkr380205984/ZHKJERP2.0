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
            <!-- <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker> -->
            <el-switch v-if="type===1||type===2||type===3||type===4||type===5"
              class="inputs"
              style="height: 32px;"
              v-model="order_type"
              :active-value="1"
              :inactive-value="2"
              active-text="订单"
              inactive-text="样单">
            </el-switch>
          </div>
          <div class="rightCtn">
            <span class="opr blue"
              @click="oprFlag=true">操作记录</span>
            <span class="opr green"
              @click="goSettle">结算</span>
            <span class="opr red"
              @click="goChargebacks">扣款</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
                    <span class="tb_row"
                      v-if="itemChild.category_info">{{itemChild.category_info.category_name}}/{{itemChild.category_info.type_name}}/{{itemChild.category_info.style_name}}</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
                    <span class="tb_row"
                      v-if="itemChild.category_info">{{itemChild.category_info.category_name}}/{{itemChild.category_info.type_name}}/{{itemChild.category_info.style_name}}</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
                    <span class="tb_row"
                      v-if="itemChild.category_info">{{itemChild.category_info.category_name}}/{{itemChild.category_info.type_name}}/{{itemChild.category_info.style_name}}</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
                </div>
                <div class="tableCtnLv2">
                  <div class="tb_header noBgColor bigPadding">
                    <span class="tb_row">运输地址</span>
                    <span class="tb_row">运输立方数</span>
                    <span class="tb_row">运输箱数</span>
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
              <span class="tb_row">关联单号</span>
              <span class="tb_row">下单日期</span>
              <!-- <span class="tb_row">负责小组</span> -->
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
                  <!-- <span class="tb_row">{{item.group_name}}</span> -->
                  <span class="tb_row">{{item.total_price}}</span>
                  <span class="tb_row"
                    :class="{'red':item.deduct_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.deduct_log,'扣款',item.order_id)">{{item.deduct_log}}</span>
                  <span class="tb_row"
                    :class="{'blue':item.settle_log>0}"
                    style="line-height:30px"
                    @click.stop="getLog(item.settle_log,'结算',item.order_id)">{{item.settle_log}}</span>
                  <span class="tb_row blue"
                    @click="order_type===1?$router.push('/order/orderDetail/' + item.order_id):$router.push('/sample/sampleOrderDetail/' + item.order_id)">详情</span>
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
    <!-- 结算 -->
    <div class="popup"
      v-show="settleFlag">
      <div class="main">
        <div class="title">
          <div class="text">订单结算</div>
          <i class="el-icon-close"
            @click="settleFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">订单编号：</div>
            <div class="info">
              <el-tag v-for="(item,index) in checkOrder"
                :key="index">
                {{item.order_code}}
              </el-tag>
            </div>
          </div>
          <div class="row">
            <div class="label">结算日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="settle.date"
                value-format="yyyy-MM-dd"
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
                v-model="settle.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">是否开票：</div>
            <div class="info">
              <el-radio v-model="settle.ifInvoice"
                :label="1">已开票</el-radio>
              <el-radio v-model="settle.ifInvoice"
                :label="2">未开票</el-radio>
            </div>
          </div>
          <div v-show="settle.ifInvoice === 1"
            v-for="(item,index) in settle.invoiceDetail"
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
                placeholder="请输入备注信息"
                v-model="settle.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="settleFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="settleFn">确定</div>
        </div>
      </div>
    </div>
    <!-- 扣款 -->
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
              <el-tag v-for="(item,index) in checkOrder"
                :key="index">
                {{item.order_code}}
              </el-tag>
            </div>
          </div>
          <div class="row">
            <div class="label">扣款日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="chargebacks.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">扣款金额：</div>
            <div class="info">
              <zh-input placeholder="请输入结算金额"
                type="number"
                v-model="chargebacks.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">扣款原因：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入扣款原因"
                v-model="chargebacks.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="chargebacksFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="chargebacksFn">确定</div>
        </div>
      </div>
    </div>
    <!-- 操作记录 -->
    <div class="popup"
      v-show="oprFlag">
      <div class="main">
        <div class="title">
          <div class="text">操作记录</div>
          <i class="el-icon-close"
            @click="oprFlag=false"></i>
        </div>
        <div class="content">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in oprList"
              :key="index">
              <el-collapse>
                <el-collapse-item>
                  <template slot="title">
                    <span style="color:rgba(0,0,0,0.65);">{{item.complete_time?item.complete_time:'有问题'}}</span>
                    <span :style="{'color':item.methods==='结算'?'#00A539':'#F2637B'}"
                      style="margin-left:20px">{{item.methods}}</span>
                    <span style="margin-left:20px">金额：
                      <span style="font-size:14px">{{$formatNum(item.deduct_price || item.settle_price)}}</span>
                    </span>
                  </template>
                  <template v-if="item.methods==='结算'">
                    <div class="collapseBox">
                      <span class="label">是否开票：</span>
                      <span class="info">{{item.is_invoice===1?'已开票':'未开票'}}</span>
                    </div>
                    <div class="collapseBox"
                      v-for="(itemChild,indexChild) in item.invoice_info"
                      :key="indexChild"
                      v-show="item.is_invoice===1">
                      <span class="label">发票信息：</span>
                      <span class="info">{{itemChild.invoiceNum}} - {{itemChild.invoicePrice}}元</span>
                    </div>
                    <div class="collapseBox">
                      <span class="label">包含订单：</span>
                      <span class="info">
                        <el-tag v-for="order in item.order_code"
                          :key="order.order_code">{{order.order_code}}</el-tag>
                      </span>
                    </div>
                    <div class="collapseBox">
                      <span class="label">备注信息：</span>
                      <span class="info">{{item.desc}}</span>
                    </div>
                  </template>
                  <template v-if="item.methods==='扣款'">
                    <div class="collapseBox">
                      <span class="label">包含订单：</span>
                      <span class="info">
                        <el-tag v-for="order in item.order_code"
                          :key="order.order_code">{{order.order_code}}</el-tag>
                      </span>
                    </div>
                    <div class="collapseBox">
                      <span class="label">扣款原因：</span>
                      <span class="info">{{item.desc}}</span>
                    </div>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="oprFlag=false">关闭</div>
          <div class="btn btnBlue"
            @click="oprFlag=false">确定</div>
        </div>
      </div>
    </div>
    <!-- 订单结算/扣款记录 -->
    <div class="popup"
      v-show="orderOprFlag">
      <div class="main">
        <div class="title">
          <div class="text">操作记录</div>
          <i class="el-icon-close"
            @click="orderOprFlag=false"></i>
        </div>
        <div class="content">
          <div class="list">
            <div class="line lineHead">
              <div class="once"
                style="flex:1.5">结算单编号</div>
              <div class="once">金额</div>
              <div class="once"
                style="flex:1.5">日期</div>
              <div class="once">审核状态</div>
              <div class="once">操作</div>
            </div>
            <div class="line"
              v-for="(item,index) in orderOprList"
              :key="index">
              <div class="once"
                style="flex:1.5">{{item.settle_code || item.deduct_code}}</div>
              <div class="once">{{item.settle_price || item.deduct_price}}元</div>
              <div class="once"
                style="flex:1.5">{{$getTime(item.complete_time)}}</div>
              <div class="once">{{item.status|filterStatus}}</div>
              <div class="once blue"
                style="cursor:pointer"
                @click="$router.push('/financialStatistics/oprDetail/' +  $route.params.id+ '/' + type +'/' + oprOrderId + '/' + item.id + '/' + orderOprType)">查看</div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="orderOprFlag=false">关闭</div>
          <div class="btn btnBlue"
            @click="orderOprFlag=false">确定</div>
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
import { statistics, settle, chargebacks } from '@/assets/js/api.js'
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
      settleFlag: false,
      settle: {
        date: '',
        price: '',
        ifInvoice: 2,
        invoiceDetail: [{
          invoiceNum: '',
          invoicePrice: ''
        }],
        desc: ''
      },
      chargebacksFlag: false,
      chargebacks: {
        date: '',
        price: '',
        desc: ''
      },
      oprFlag: false,
      oprList: [],
      orderOprFlag: false,
      orderOprType: '',
      orderOprList: [],
      oprOrderId: '',
      order_type: 1 // 订单 或 样单
    }
  },
  watch: {
    order_type (val) {
      this.init()
    },
    type (val) {
      this.init()
    },
    checkAll (val) {
      if (val) {
        this.list.forEach((item) => {
          item.check = true
        })
      } else {
        this.list.forEach((item) => {
          item.check = false
        })
      }
    }
  },
  computed: {
    clientType () {
      return companyType.find((item) => item.value === Number(this.type)).name
    },
    // 勾选订单
    checkOrder () {
      return this.list.filter((item) => item.check)
    }
  },
  filters: {
    filterType (val) {
      let str = companyType.find((item) => item.value === Number(val)).name
      return str.slice(0, str.length - 2)
    },
    filterStatus (status) {
      let arr = ['', '待审核', '审核通过', '驳回']
      return arr[status]
    }
  },
  methods: {
    addInvoice () {
      this.settle.invoiceDetail.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.settle.invoiceDetail.splice(index, 1)
    },
    goSettle () {
      if (this.checkOrder.length === 0) {
        this.$message.error('请先勾选订单再进行扣款')
      } else {
        this.settleFlag = true
      }
    },
    settleFn () {
      this.loading = true
      settle.create({
        id: null,
        client_id: this.$route.params.id,
        order_id: JSON.stringify(this.checkOrder.map((item) => item.order_id)),
        complete_time: this.settle.date,
        settle_price: this.settle.price,
        is_invoice: this.settle.ifInvoice,
        invoice_info: JSON.stringify(this.settle.invoiceDetail),
        desc: this.settle.desc,
        order_type: this.order_type,
        type: this.type
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('结算成功')
          this.settleFlag = false
          this.init()
        }
      })
    },
    goChargebacks () {
      if (this.checkOrder.length === 0) {
        this.$message.error('请先勾选订单再进行结算')
      } else {
        this.chargebacksFlag = true
      }
    },
    chargebacksFn () {
      chargebacks.create({
        id: null,
        client_id: this.$route.params.id,
        order_id: JSON.stringify(this.checkOrder.map((item) => item.order_id)),
        complete_time: this.chargebacks.date,
        deduct_price: this.chargebacks.price,
        desc: this.chargebacks.desc,
        order_type: this.order_type,
        type: this.type
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣款成功')
          this.chargebacksFlag = false
          this.init()
        }
      })
    },
    init () {
      this.loading = true
      this.list = []
      Promise.all([statistics.clientDetailList({
        client_id: this.$route.params.id,
        client_type: this.type,
        order_type: this.order_type
      }), statistics.clientDetailStatistics({
        client_id: this.$route.params.id,
        client_type: this.type
      }), chargebacks.log({
        client_id: this.$route.params.id,
        client_type: this.type,
        order_type: this.order_type
      }), settle.log({
        client_id: this.$route.params.id,
        client_type: this.type,
        order_type: this.order_type
      })]).then((res) => {
        this.loading = false
        this.statistics = res[1].data
        this.list = res[0].data.data.map((item) => {
          item.check = false
          return item
        })
        this.oprList = res[2].data.data.map((item) => {
          item.methods = '扣款'
          return item
        }).concat(res[3].data.data.map((item) => {
          item.methods = '结算'
          return item
        })).sort((a, b) => {
          return new Date(a.ccomplete_time) - new Date(b.complete_time)
        })
      })
    },
    getLog (num, type, orderId) {
      this.oprOrderId = orderId
      this.orderOprType = type
      if (Number(num) > 0) {
        this.loading = true
        if (type === '扣款') {
          chargebacks.log({
            client_id: this.$route.params.id,
            client_type: this.type,
            order_type: this.order_type,
            order_id: orderId
          }).then((res) => {
            this.orderOprFlag = true
            this.orderOprList = res.data.data.map((item) => {
              item.methods = type
              return item
            })
            this.loading = false
          })
        } else {
          settle.log({
            client_id: this.$route.params.id,
            client_type: this.type,
            order_type: this.order_type,
            order_id: orderId
          }).then((res) => {
            this.orderOprFlag = true
            this.orderOprList = res.data.data.map((item) => {
              item.methods = type
              return item
            })
            this.loading = false
          })
        }
      } else {
        this.$message.warning('该订单没有' + type + '记录')
      }
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
      margin: 12px;
    }
  }
}
</style>
