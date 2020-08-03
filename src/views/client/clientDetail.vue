<template>
  <div id='clientDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">客户信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户名称：</span>
            <span class="text">{{clientInfo.name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">客户简称：</span>
            <span class="text">{{clientInfo.abbreviation}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户状态：</span>
            <span class="text">{{clientInfo.status === 1 ? '合作中' : '暂停合作'}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">客户类型：</span>
            <span class="text">{{clientInfo.typeStr.join(',')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系电话：</span>
            <span class="text">{{clientInfo.phone}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">公司地址：</span>
            <span class="text">{{clientInfo.address}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="clientInfo.contacts.length > 0">
      <div class="titleCtn">
        <span class="title">客户联系人</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row middle">姓名</span>
              <span class="tb_row middle">职务</span>
              <span class="tb_row middle">联系电话</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in clientInfo.contacts"
              :key="index">
              <span class="tb_row middle">{{item.name}}</span>
              <span class="tb_row middle">{{item.station}}</span>
              <span class="tb_row middle">{{item.phone}} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">财务信息统计</span>
      </div>
      <div class="listHead">
        <div class="box">
          <div class="boxTop blue">合计</div>
          <div class="boxBottom">
            <span class="num">{{clientInfo.financial_data.total_price || 0}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop green">已结算(已开票)</div>
          <div class="boxBottom">
            <span class="num">{{clientInfo.financial_data.settle_price_invoice}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop green">已结算(未开票)</div>
          <div class="boxBottom">
            <span class="num">{{clientInfo.financial_data.settle_price}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop red">已扣款</div>
          <div class="boxBottom">
            <span class="num">{{clientInfo.financial_data.deduct_price}}</span>
            <span class="em">元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop orange">待结算</div>
          <div class="boxBottom">
            <span class="num">{{clientInfo.financial_data.wait_settle_price}}</span>
            <span class="em">元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">相关财务明细</span>
        <span class="btnCtn">
          <span class="btn noBorder"
            @click="oprFlag=true">查看所有结算扣款记录</span>
          <!-- <span class="btn noBorder green"
            @click="goSettle">结算</span>
          <span class="btn noBorder red"
            @click="goChargebacks">扣款</span> -->
        </span>
      </div>
      <div class="listCtn hasBorderTop"
        v-loading='loadingStatistics'>
        <el-tabs style="width:100%;font-size:16px"
          v-model="type">
          <!-- 订单 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(1) !== -1"
            label="所有订单"
            name="所有订单">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div>
                <el-input class="inputs"
                  style="width:170px"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入订单编号查询">
                </el-input>
                <el-date-picker v-model="date"
                  style="width:250px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="order_type === 1">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">订单号</span>
                </div>
                <div class="col">
                  <span class="text">下单日期</span>
                </div>
                <div class="col">
                  <span class="text">订单公司</span>
                </div>
                <div class="col">
                  <span class="text">负责小组</span>
                </div>
                <div class="col">
                  <span class="text">下单数量</span>
                </div>
                <div class="col">
                  <span class="text">下单总额</span>
                </div>
                <div class="col">
                  <span class="text">出库数量</span>
                </div>
                <div class="col">
                  <span class="text">实际总值</span>
                </div>
                <div class="col middle">
                  <span class="text">结算记录</span>
                </div>
                <div class="col middle">
                  <span class="text">扣款记录</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">{{item.order_code}}</div>
                <div class="col">{{item.order_time}}</div>
                <div class="col">{{item.client_name}}</div>
                <div class="col">{{item.group_name}}</div>
                <div class="col">{{item.order_number}}</div>
                <div class="col">{{item.total_price}}</div>
                <div class="col">{{item.pack_number}}</div>
                <div class="col">{{item.reality_number}}</div>
                <div class="col middle">{{0}}</div>
                <div class="col middle">{{0}}</div>
              </div>
            </div>
            <div class="list"
              v-if="order_type === 2">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">订单号</span>
                </div>
                <div class="col">
                  <span class="text">下单日期</span>
                </div>
                <div class="col">
                  <span class="text">订单公司</span>
                </div>
                <div class="col">
                  <span class="text">负责小组</span>
                </div>
                <div class="col">
                  <span class="text">打样数量</span>
                </div>
                <div class="col">
                  <span class="text">客户付费</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">{{item.order_code}}</div>
                <div class="col">{{item.order_time}}</div>
                <div class="col">{{item.client_name}}</div>
                <div class="col">{{item.group_name}}</div>
                <div class="col">{{item.numbers}}</div>
                <div class="col">{{item.client_pay}}</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 物料订购调取 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(2) !== -1 || clientInfo.type.indexOf(10) !== -1"
            label="物料订购调取"
            name="物料订购调取">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div>
                <el-input class="inputs"
                  style="width:170px"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="inputs"
                  style="width:170px"
                  v-model="operate_user"
                  @change="getList(1)"
                  placeholder="搜索创建人查询"
                  clearable
                  filterable>
                  <el-option v-for="item in authList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:250px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='物料订购调取'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">物料名称</span>
                </div>
                <div class="col">
                  <span class="text">属性</span>
                </div>
                <div class="col">
                  <span class="text">类型</span>
                </div>
                <div class="col">
                  <span class="text">公司/仓库</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">截止日期</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{item.create_time.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text"
                    @click="$router.push('/order/orderDetail/' + item.order_id)">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.color_code}}</span>
                </div>
                <div class="col">
                  <span class="text"
                    :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name||item.stock_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.weight}}kg</span>
                </div>
                <div class="col">
                  <span class="text">{{Math.round(item.price * item.weight)}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.complete_time}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='物料订购调取'">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">{{statistics.material_order.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.material_order.total_weight)}}kg</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.material_order.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 物料预订购 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(2) !== -1"
            label="物料预订购"
            name="物料预订购">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  style="width:170px"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="inputs"
                  style="width:170px"
                  v-model="stock_id"
                  @change="getList(1)"
                  placeholder="搜索仓库名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in stockList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:250px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='物料预订购'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">订购日期</span>
                </div>
                <div class="col">
                  <span class="text">纱线单位</span>
                </div>
                <div class="col">
                  <span class="text">物料名称</span>
                </div>
                <div class="col">
                  <span class="text">属性</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">入库数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">入库仓库</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">操作日期</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{$getTime(item.create_time)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.color_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.weight}}kg</span>
                </div>
                <div class="col">
                  <span class="text">{{Math.round(item.price * item.weight)}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.stock_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{$getTime(item.create_time)}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='物料预订购'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.material_order_order.total_weight)}}kg</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.material_order_order.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 物料加工 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(3) !== -1"
            label="物料加工"
            name="物料加工">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div>
                <el-input class="inputs"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="inputs"
                  v-model="operate_user"
                  @change="getList(1)"
                  placeholder="搜索创建人查询"
                  clearable
                  filterable>
                  <el-option v-for="item in authList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:290px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='物料加工'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">物料名称</span>
                </div>
                <div class="col">
                  <span class="text">属性</span>
                </div>
                <div class="col">
                  <span class="text">工序</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">截止日期</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{item.create_time.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_color}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.process_type}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.weight}}kg</span>
                </div>
                <div class="col">
                  <span class="text">{{Math.round(item.price*item.weight)}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.complete_time.slice(0,10)}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='物料加工'">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">{{statistics.material_process.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.material_process.total_weight)}}kg</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.material_process.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 织造分配 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(4) !== -1"
            label="织造分配"
            name="织造分配">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div>
                <el-input class="inputs"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-select class="inputs"
                  v-model="operate_user"
                  @change="getList(1)"
                  placeholder="搜索创建人查询"
                  clearable
                  filterable>
                  <el-option v-for="item in authList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:290px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='织造分配'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">分配日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">织造单位</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成日期</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{item.created_at.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  <span>{{item.product_info.product_code}}</span>
                  <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
                </div>
                <div class="col">
                  <span>{{item.size_name}}</span>
                  <br />
                  <span>{{item.color_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
                  <span class="text">{{Math.round(item.price*item.number)}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.complete_time.slice(0,10)}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='织造分配'">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">{{statistics.production_weave.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.production_weave.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.production_weave.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 半成品加工 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(5) !== -1"
            label="半成品加工"
            name="半成品加工">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div>
                <el-input class="inputs"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-select class="inputs"
                  v-model="operate_user"
                  @change="getList(1)"
                  placeholder="搜索创建人查询"
                  clearable
                  filterable>
                  <el-option v-for="item in authList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:290px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='半成品加工'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col">
                  <span class="text">加工类型</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">所需辅料</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量(件)</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成时间</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{$getTime(item.created_at)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.type}}</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  <span>{{item.product_info.product_code}}</span>
                  <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
                </div>
                <div class="col">
                  {{item.size_name}}
                  <br />
                  {{item.color_name}}
                </div>
                <div class="col">
                  <span v-for="(itemIng,indexIng) in item.part_assign"
                    :key="indexIng">{{itemIng.name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{$toFixed(item.price)}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
                  <span class="text">{{Math.round(item.number*item.price)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.complete.slice(0,10)}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='半成品加工'">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">{{statistics.semi_product.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.semi_product.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.semi_product.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 包装订购 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(7) !== -1"
            label="包装订购"
            name="包装订购">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="inputs"
                  v-model="operate_user"
                  @change="getList(1)"
                  placeholder="搜索创建人查询"
                  clearable
                  filterable>
                  <el-option v-for="item in authList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:290px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='包装订购'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">订购日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">订购单位</span>
                </div>
                <div class="col">
                  <span class="text">包装辅料</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成日期</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{item.order_time.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{$toFixed(item.price || 0)}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{$toFixed(item.number)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{$toFixed(item.total_price || 0)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_time.slice(0,10)}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='包装订购'">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">{{statistics.pack_order.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.pack_order.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.pack_order.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 装箱出库 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(8) !== -1"
            label="装箱出库"
            name="装箱出库">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-select class="inputs"
                  v-model="operate_user"
                  @change="getList(1)"
                  placeholder="搜索创建人查询"
                  clearable
                  filterable>
                  <el-option v-for="item in authList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:290px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='装箱出库'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">运输单位</span>
                </div>
                <div class="col">
                  <span class="text">运输箱数</span>
                </div>
                <div class="col">
                  <span class="text">立方数(m³)</span>
                </div>
                <div class="col">
                  <span class="text">单价(m³/元)</span>
                </div>
                <div class="col">
                  <span class="text">总价(元)</span>
                </div>
                <div class="col">
                  <span class="text">出口国家</span>
                </div>
                <div class="col">
                  <span class="text">运输地址</span>
                </div>
                <div class="col">
                  <span class="text">港口</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{item.created_at.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.cubic_number}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.total_price}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.country}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.address}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.port}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.user_name}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='装箱出库'">
              <div class="oneBox">
                <div class="label">运输箱数:</div>
                <div class="content">{{$formatNum(statistics.stock_out.total_number)}}箱</div>
              </div>
              <div class="oneBox">
                <div class="label">立方数:</div>
                <div class="content">{{$formatNum(statistics.stock_out.total_cubic_number)}}立方</div>
              </div>
              <div class="oneBox">
                <div class="label">平均单价:</div>
                <div class="content">{{statistics.stock_out.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.stock_out.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 销售出库 -->
          <el-tab-pane v-if="clientInfo.type.indexOf(11) !== -1"
            label="销售出库"
            name="销售出库">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-date-picker v-model="date"
                  style="width:290px"
                  class="inputs"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='销售出库'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">出库日期</span>
                </div>
                <div class="col">
                  <span class="text">销售单位</span>
                </div>
                <div class="col">
                  <span class="text">销售产品</span>
                </div>
                <div class="col">
                  <span class="text">尺码/颜色</span>
                </div>
                <div class="col right">
                  <span class="text">销售数量</span>
                </div>
                <div class="col center">
                  <span class="text">出库时间</span>
                </div>
                <div class="col right">
                  <span class="text">销售单价</span>
                </div>
                <div class="col">
                  <span class="text">价格说明</span>
                </div>
                <div class="col right">
                  <span class="text">总价(元)</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in list"
                :key="index">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="item.checked"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">{{$getTime(item.complete_time)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">
                    {{item.product_code}}
                    <br />
                    {{item.category_info.category_name}}/{{item.category_info.type_name}}/{{item.category_info.style_name}}
                  </span>
                </div>
                <div class="col">
                  <span class="text">
                    {{item.size_name}}
                    <br />
                    {{item.color_name}}
                  </span>
                </div>
                <div class="col right">
                  <span class="text">{{item.number}}{{item.category_info.unit}}</span>
                </div>
                <div class="col center">
                  <span class="text">{{item.complete_time}}</span>
                </div>
                <div class="col right">
                  <span class="text">{{item.price}}{{'元/' + item.category_info.unit}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price_remakr}}</span>
                </div>
                <div class="col right">
                  <span class="text">{{item.total_price}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.desc}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='销售出库'">
              <div class="oneBox">
                <div class="label">销售数量:</div>
                <div class="content">{{$formatNum(statistics.out_market.total_number)}}件</div>
              </div>
              <div class="oneBox">
                <div class="label">平均单价:</div>
                <div class="content">{{statistics.out_market.avg_price}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.out_market.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 结算 -->
    <div class="popup"
      v-show="settleFlag">
      <div class="main">
        <div class="title">
          <div class="text">单位结算</div>
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
          <div class="row"
            v-if="type === '所有订单' && order_type === 1">
            <div class="label">结算合计：</div>
            <div class="info">{{checkOrderTotalPrice}}元</div>
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
      <div class="main"
        style="width:800px">
        <div class="title">
          <div class="text">操作记录</div>
          <i class="el-icon-close"
            @click="oprFlag=false"></i>
        </div>
        <div class="content"
          style="max-height:600px">
          <div class="row">
            <span class="label">筛选条件：</span>
            <span class="info">
              <el-select v-model="log_type"
                clearable
                style="width:200px"
                placeholder="请选择类型">
                <el-option v-for="item in [{id:1,name:'扣款'},{id:2,name:'结算'}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <el-date-picker v-model="log_date"
                clearable
                style="margin-left:16px;width:300px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </span>
          </div>
          <el-timeline>
            <el-timeline-item v-for="(item, index) in oprListCom.list"
              :key="index">
              <el-collapse>
                <el-collapse-item>
                  <template slot="title">
                    <span class="title_box"
                      style="width:100%;display:flex;justify-content: space-between;align-items:center">
                      <div>
                        <span style="color:rgba(0,0,0,0.65);">{{item.complete_time?$getTime(item.complete_time):'有问题'}}</span>
                        <span :style="{'color':item.methods==='结算'?'#00A539':'#F2637B'}"
                          style="margin-left:20px">{{item.methods}}</span>
                        <span style="margin-left:20px">金额：
                          <span style="font-size:14px">{{$formatNum(item.deduct_price || item.settle_price)}}元</span>
                        </span>
                      </div>
                      <div class="blue"
                        style="margin-right:20px"
                        @click.stop="goSettleDeductDetail(item)">查看详情</div>
                    </span>
                  </template>
                  <template v-if="item.methods==='结算'">
                    <!-- <div class="collapseBox">
                      <span class="label">操作：</span>
                      <span class="info">
                        <div class="blue"
                          @click="goSettleDeductDetail(item)">查看详情</div>
                      </span>
                    </div> -->
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
                    <!-- <div class="collapseBox">
                      <span class="label">操作：</span>
                      <span class="info">
                        <div class="blue"
                          @click="goSettleDeductDetail(item)">查看详情</div>
                      </span>
                    </div> -->
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
          <div class="row">
            <span class="label">合计结算：</span>
            <span class="info green">{{oprListCom.settle}}元</span>
            <span class="label">合计扣款：</span>
            <span class="info red">{{oprListCom.chargebacks}}元</span>
          </div>
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
        <div class="leftCtn">
          <div class="btn btnWhiteBlue"
            @click="goSettle">结算</div>
          <div class="btn btnWhiteRed"
            @click="goChargebacks">扣款</div>
        </div>
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push('/client/clientUpdate/' + $route.params.id)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { client, auth, process, stock, materialManage, materialOrder, materialProcess, weave, processing, packPlan, settle, chargebacks, statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      companyType: companyType,
      clientInfo: {
        type: [],
        contacts: [],
        typeStr: [],
        financial_data: {}
      },
      authList: [],
      processList: [],
      stockList: [],
      checkAll: false,
      loadingStatistics: false,
      list: [],
      total: 1,
      pages: 1,
      type: '',
      // 筛选key
      order_type: 1,
      material_name: '',
      operate_user: '',
      stock_id: '',
      date: '',
      product_code: '',
      order_code: '',
      // 列表下方统计数据
      statistics: {
        material_order: {
          avg_price: 0,
          total_price: 0,
          total_weight: 0
        },
        material_order_order: {
          total_price: 0,
          total_weight: 0
        },
        material_process: {
          avg_price: 0,
          total_price: 0,
          total_weight: 0
        },
        production_weave: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        semi_product: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        pack_order: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        stock_out: {
          total_number: 0,
          total_cubic_number: 0,
          total_price: 0,
          avg_price: 0
        },
        out_market: {
          avg_price: 0,
          total_number: 0,
          total_price: 0
        }
      },
      // 扣款结算数据
      settleFlag: false,
      settle: {
        date: this.$getTime(),
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
        date: this.$getTime(),
        price: '',
        desc: ''
      },
      oprFlag: false,
      log_type: '',
      log_date: '',
      oprList: [],
      orderOprFlag: false,
      orderOprList: []
    }
  },
  methods: {
    goSettleDeductDetail (item) {
      this.$router.push('/financialStatistics/oprDetail/' + this.$route.params.id + '/' + this.typeNum + '/' + item.id + '/' + item.methods + '?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)
    },
    init () {
      Promise.all([
        client.detail({
          id: this.$route.params.id
        }),
        auth.list(),
        process.list(),
        stock.list()
      ]).then(res => {
        // 初始化客户详情
        this.clientInfo = this.$clone(res[0].data.data)
        this.clientInfo.typeStr = this.clientInfo.type.map(item => {
          let flag = this.companyType.find(value => value.value === item)
          return flag ? flag.name : ''
        })
        if (this.clientInfo.type.indexOf(1) !== -1) {
          this.type = '所有订单'
        } else if (this.clientInfo.type.indexOf(2) !== -1 || this.clientInfo.type.indexOf(10) !== -1) {
          this.type = '物料订购调取'
        } else if (this.clientInfo.type.indexOf(3) !== -1) {
          this.type = '物料加工'
        } else if (this.clientInfo.type.indexOf(4) !== -1) {
          this.type = '织造分配'
        } else if (this.clientInfo.type.indexOf(5) !== -1) {
          this.type = '半成品加工'
        } else if (this.clientInfo.type.indexOf(7) !== -1) {
          this.type = '包装订购'
        } else if (this.clientInfo.type.indexOf(8) !== -1) {
          this.type = '装箱出库'
          // } else if (this.clientInfo.type.indexOf(10) !== -1) {
          //   this.type = '装饰辅料订购调取'
        } else if (this.clientInfo.type.indexOf(11) !== -1) {
          this.type = '销售出库'
        }
        // 初始化用户筛选数据
        this.authList = res[1].data.data
        // 初始化加工工序筛选数据
        this.processList = res[2].data.data
        this.processList.unshift({
          name: '织造'
        })
        // 初始化仓库筛选数据
        this.stockList = res[3].data.data
        this.getList()
        this.getSettleChargbacksLog()
        this.loading = false
      })
    },
    getList (page) {
      if (page) {
        this.pages = page
      }
      this.checkAll = false
      this.loading = true
      this.loadingStatistics = true
      this.list = []
      if (this.type === '所有订单') {
        if (this.order_type !== 1) {
          statistics.sampleList({
            limit: 10,
            page: this.pages,
            keyword: this.order_code,
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            client_id: this.$route.params.id
          }).then((res) => {
            this.total = res.data.meta.total
            this.list = res.data.data.map(itemM => {
              itemM.order_id = itemM.id
              itemM.checked = false
              return itemM
            })
            this.loading = false
            this.loadingStatistics = false
          })
        } else {
          statistics.orderList({
            limit: 10,
            page: this.pages,
            order_code: this.order_code,
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            client_id: this.$route.params.id
          }).then((res) => {
            this.total = res.data.meta.total
            this.list = res.data.data.map(itemM => {
              itemM.order_id = itemM.id
              itemM.checked = false
              return itemM
            })
            this.loading = false
            this.loadingStatistics = false
          })
        }
      } else if (this.type === '物料订购调取') {
        materialManage.detail({
          order_id: null,
          limit: 10,
          page: this.pages,
          stock_id: this.stock_id,
          order_type: this.order_type,
          material_name: this.material_name,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.material_order = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_weight: res.data.total_weight
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '物料预订购') {
        materialOrder.allLog({
          material_name: this.material_name,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          stock_id: this.stock_id,
          limit: 10,
          page: this.pages
        }).then(res => {
          if (res.data.status !== false) {
            this.list = res.data.data.map(itemM => {
              return {
                ...itemM,
                checked: false
              }
            })
            this.total = res.data.meta.total
            this.statistics.material_order_order = {
              total_price: res.data.total_price,
              total_weight: res.data.total_weight
            }
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '物料加工') {
        materialProcess.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.material_process = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_weight: res.data.total_weight
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '织造分配') {
        weave.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.production_weave = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_number: res.data.total_number
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '半成品加工') {
        processing.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.semi_product = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_number: res.data.total_number
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '包装订购') {
        packPlan.packOrderLog({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.pack_order = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_number: res.data.total_number
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '装箱出库') {
        packPlan.packOutLog({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages,
          product_code: this.product_code,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.stock_out = {
            total_number: res.data.total_number,
            total_cubic_number: res.data.total_cubic_number,
            total_price: res.data.total_price,
            avg_price: res.data.avg_price
          }
          this.loading = false
          this.loadingStatistics = false
        })
      } else if (this.type === '销售出库') {
        packPlan.outMarketLog({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages,
          product_code: this.product_code,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user
        }).then((res) => {
          this.list = res.data.data.map(itemM => {
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.out_market = {
            avg_price: res.data.avg_price,
            total_number: res.data.total_number,
            total_price: res.data.total_price
          }
          this.loading = false
          this.loadingStatistics = false
        })
      }
    },
    reset () {
      this.order_type = 1
      this.material_name = ''
      this.operate_user = ''
      this.stock_id = ''
      this.date = ''
      this.product_code = ''
      this.order_code = ''
      this.getList(1)
    },
    goSettle () {
      this.settleFlag = true
    },
    settleFn () {
      settle.create({
        id: null,
        client_id: this.$route.params.id,
        order_id: JSON.stringify(this.$unique(this.checkOrder.map((item) => item.order_id))),
        complete_time: this.settle.date,
        settle_price: this.settle.price,
        is_invoice: this.settle.ifInvoice,
        invoice_info: JSON.stringify(this.settle.invoiceDetail),
        desc: this.settle.desc,
        order_type: this.order_type,
        type: this.typeNum
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('结算成功')
          this.settleFlag = false
          this.settle = {
            date: this.$getTime(),
            price: '',
            ifInvoice: 2,
            invoiceDetail: [{
              invoiceNum: '',
              invoicePrice: ''
            }],
            desc: ''
          }
          this.init()
        }
      })
    },
    goChargebacks () {
      this.chargebacksFlag = true
    },
    chargebacksFn () {
      chargebacks.create({
        id: null,
        client_id: this.$route.params.id,
        order_id: JSON.stringify(this.$unique(this.checkOrder.map((item) => item.order_id))),
        complete_time: this.chargebacks.date,
        deduct_price: this.chargebacks.price,
        desc: this.chargebacks.desc,
        order_type: this.order_type,
        type: this.typeNum
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣款成功')
          this.chargebacksFlag = false
          this.chargebacks = {
            date: this.$getTime(),
            price: '',
            desc: ''
          }
          this.init()
        }
      })
    },
    getSettleChargbacksLog () {
      Promise.all([
        chargebacks.log({
          client_id: this.$route.params.id,
          order_type: this.order_type
        }),
        settle.log({
          client_id: this.$route.params.id,
          order_type: this.order_type
        })
      ]).then(res => {
        this.oprList = res[0].data.data.map((item) => {
          item.methods = '扣款'
          return item
        }).concat(res[1].data.data.map((item) => {
          item.methods = '结算'
          return item
        })).sort((a, b) => {
          return new Date(a.ccomplete_time) - new Date(b.complete_time)
        })
      })
    },
    addInvoice () {
      this.settle.invoiceDetail.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.settle.invoiceDetail.splice(index, 1)
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
    },
    cutOrderType (type) {
      this.order_type = type
      this.getList()
    }
  },
  watch: {
    type () {
      this.getList(1)
    },
    checkAll (newVal) {
      this.list.forEach(item => {
        item.checked = newVal
      })
    }
  },
  computed: {
    checkOrder () {
      return this.$unique(this.list.filter((item) => item.checked).map(itemM => {
        return {
          order_code: this.type === '物料预订购' ? ('预订购订单-' + itemM.id) : itemM.order_code,
          order_id: this.type === '物料预订购' ? itemM.id : itemM.order_id
        }
      }), 'order_id')
    },
    checkOrderTotalPrice () {
      return this.list.filter((item) => item.checked).map(itemM => (+itemM.total_price || 0)).reduce((a, b) => a + b, 0)
    },
    typeNum () {
      if (this.type === '物料订购调取') {
        return 1
      } else if (this.type === '物料预订购') {
        return 2
      } else if (this.type === '物料加工') {
        return 3
      } else if (this.type === '织造分配') {
        return 4
      } else if (this.type === '半成品加工') {
        return 5
      } else if (this.type === '包装订购') {
        return 6
      } else if (this.type === '装箱出库') {
        return 7
      } else if (this.type === '销售出库') {
        return 8
      } else if (this.type === '所有订单') {
        return 9
      } else {
        return null
      }
    },
    oprListCom () {
      let list = this.oprList
      if (this.log_type) {
        list = list.filter(itemF => itemF.methods === this.log_type)
      }
      if (this.log_date && this.log_date.length === 2) {
        list = list.filter(itemF => (new Date(this.$getTime(itemF.complete_time)).getTime() >= new Date(this.log_date[0]).getTime()) && (new Date(this.log_date[1]).getTime() >= new Date(this.$getTime(itemF.complete_time)).getTime()))
      }
      let settle = list.map(itemM => (+itemM.settle_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      let chargebacks = list.map(itemM => (+itemM.deduct_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      return {
        list,
        settle,
        chargebacks
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/client/clientDetail.less";
</style>
<style lang="less">
#clientDetail {
  .tableCtnLv2 {
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
      .info {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
