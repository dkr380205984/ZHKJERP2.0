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
            <span class="text"
              style="white-space: nowrap;overflow:hidden;flex:1;text-overflow: ellipsis;">
              {{clientInfo.typeStr.join(',')}}
            </span>
            <span v-if="clientInfo.typeStr.length >= 3"
              class="showMore">
              <el-popover placement="right"
                trigger="click">
                <span v-html="clientInfo.typeStr.join('<br />')"></span>
                <span slot="reference">更多</span>
              </el-popover>
            </span>
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
    <div class="module">
      <div class="titleCtn">财务统计信息</div>
      <div class="detailCtn">
        <div class="rowCtn"
          style="flex-direction:column">
          <div class="tableTopSelec"
            style="margin-bottom:18px">
            <div class="left"
              style="display:flex">
              <el-date-picker v-model="countYear"
                :picker-options="{
                  disabledDate
                }"
                @change="getCountDetail"
                value-format="yyyy"
                type="year"
                placeholder="选择年">
              </el-date-picker>
              <el-select style="width:240px;margin-left:20px"
                v-if="typeNum === 9"
                v-model="countType"
                @change="getCountDetail">
                <el-option label="默认"
                  :value="null"></el-option>
                <el-option label="只统计人民币"
                  value="RMB"></el-option>
                <el-option label="只统计美元"
                  value="USD"></el-option>
              </el-select>
              <el-tooltip style="margin-left:12px;line-height:32px"
                class="item"
                effect="dark"
                content="以下统计已默认将美元按汇率转成了人民币，如需单独显示，请单独筛选人民币或者美元币种。"
                placement="right">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="tableCtnLv2 countInfo">
            <div class="tb_content">
              <div class="tb_row middle">{{DDXDCZCOM}}</div>
              <div class="tb_row middle">{{SJFHCZCOM}}</div>
              <div class="tb_row middle">已开票金额</div>
              <div class="tb_row middle">{{YSKJECOM}}</div>
              <div class="tb_row middle">已扣款金额</div>
            </div>
            <div class="tb_content">
              <!-- {{(!countType||countType === 'RMB') ? '万元' : '万美元'}} 所有货币已经转成RMB -->
              <div class="tb_row middle"
                style="color:#1a95ff">{{detailCount && $formatNum($toFixed(detailCount.plan_price/10000 || 0))}}{{(!countType||countType === 'RMB') ? '万元' : '万美元'}}</div>
              <div class="tb_row middle"
                style="color:#1a95ff">{{detailCount &&$formatNum($toFixed(detailCount.total_price/10000 || 0))}}{{(!countType||countType === 'RMB') ? '万元' : '万美元'}}</div>
              <div class="tb_row middle"
                style="color:#01B48C">{{detailCount &&$formatNum($toFixed(detailCount.settle_price_invoice/10000 || 0))}}万元</div>
              <div class="tb_row middle"
                style="color:#01B48C">{{detailCount &&$formatNum($toFixed(detailCount.transfer_count/10000 || 0))}}万元</div>
              <div class="tb_row middle"
                style="color:#F5222D">{{detailCount &&$formatNum($toFixed(detailCount.deduct_price/10000 || 0))}}万元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="listCutCtn">
      <div class="cut_item"
        :class="{'active':type === '所有订单'}"
        @click="type = '所有订单'"
        v-if="clientInfo.type.some(itemS => (itemS >= 1 && itemS <= 2))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdan"></use>
        </svg>
        <span class="name">所有订单</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '物料订购调取'}"
        @click="type = '物料订购调取'"
        v-if="clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 6))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaodinggou"></use>
        </svg>
        <span class="name">物料订购调取</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '物料预订购'}"
        @click="type = '物料预订购'"
        v-if="clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 4))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoyudinggou"></use>
        </svg>
        <span class="name">物料预订购</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '物料加工'}"
        @click="type = '物料加工'"
        v-if="clientInfo.type.some(itemS => (itemS >= 9 && itemS <= 12))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaodinggou"></use>
        </svg>
        <span class="name">物料加工</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '织造分配'}"
        @click="type = '织造分配'"
        v-if="clientInfo.type.some(itemS => (itemS >= 13 && itemS <= 14))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-zhizaojiagong"></use>
        </svg>
        <span class="name">织造分配</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '半成品加工'}"
        @click="type = '半成品加工'"
        v-if="clientInfo.type.some(itemS => (itemS >= 15 && itemS <= 28))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-zhizaojiagong"></use>
        </svg>
        <span class="name">半成品加工</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '成品加工'}"
        @click="type = '成品加工'"
        v-if="clientInfo.type.some(itemS => (itemS >= 29&& itemS <= 34))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-zhizaojiagong"></use>
        </svg>
        <span class="name">成品加工</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '包装订购'}"
        @click="type = '包装订购'"
        v-if="clientInfo.type.some(itemS => (itemS >= 7 && itemS <= 8))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-baozhuangdinggou2"></use>
        </svg>
        <span class="name">包装订购</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === '销售出库'}"
        @click="type = '销售出库'"
        v-if="clientInfo.type.some(itemS => (itemS >= 37 && itemS <= 38))">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yunshuhuokuan"></use>
        </svg>
        <span class="name">销售出库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">相关财务明细</span>
        <div class="btnCtn"
          style="display:flex">
          <div class="btn btnWhiteBlue"
            :class="{'btnWhiteGray':order_type === 0}"
            @click="goSettle()">开票</div>
          <div class="btn btnWhiteRed"
            :class="{'btnWhiteGray':order_type === 0}"
            @click="goChargebacks()">扣款</div>
          <div class="btn btnWhiteGreen"
            :class="{'btnWhiteGray':order_type === 0}"
            @click="goCollection()">{{typeNum === 9 ? '收款' : '付款'}}</div>
          <div class="btn btnBlue"
            @click="oprFlag=true;log_date=log_order_code=log_type=''">查看操作记录</div>
        </div>
      </div>
      <div class="listCtn hasBorderTop"
        v-loading='loadingStatistics'>
        <!-- 订单 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 1 && itemS <= 2)) && type === '所有订单'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div>
                <el-input class="filter_item"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入订单编号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select v-model="huobi"
                  style="width:180px"
                  class="filter_item"
                  @change="getList(1)"
                  clearable
                  placeholder="筛选货币">
                  <el-option value=""
                    label="全部"></el-option>
                  <el-option value="RMB"
                    label="人民币"></el-option>
                  <el-option value="USD"
                    label="美元"></el-option>
                </el-select>
                <el-date-picker v-model="date"
                  style="width:250px"
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list"
            v-if="order_type === 1">
            <div class="title">
              <div class="col flex07">
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
              <div class="col flex07">
                <span class="text">下单数量</span>
              </div>
              <div class="col flex07">
                <span class="text">下单总额</span>
              </div>
              <div class="col flex07">
                <span class="text">出库数量</span>
              </div>
              <div class="col flex07">
                <span class="text">实际总值</span>
              </div>
              <div class="col middle flex07">
                <span class="text">开票记录</span>
              </div>
              <div class="col middle flex07">
                <span class="text">扣款记录</span>
              </div>
              <div class="col middle flex07">
                <span class="text">收款记录</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col blue"
                style="cursor: pointer;"
                @click="$router.push(`/order/orderDetail/${item.id}`)">{{item.order_code}}</div>
              <div class="col">{{item.order_time}}</div>
              <div class="col">{{item.client_name}}</div>
              <div class="col">{{item.group_name}}</div>
              <div class="col flex07">{{item.order_number}}</div>
              <div class="col flex07">{{item.total_price}}</div>
              <div class="col flex07">{{item.pack_number}}</div>
              <div class="col flex07">{{item.reality_number}}</div>
              <div class="col middle blue flex07"
                style="cursor:pointer"
                @click="showLog('开票',item)">{{item.settle_number || 0}}</div>
              <div class="col middle orange flex07"
                style="cursor:pointer"
                @click="showLog('扣款',item)">{{item.deduct_number || 0}}</div>
              <div class="col middle green flex07"
                style="cursor:pointer"
                @click="showLog('收款',item)">{{item.transfer_number || 0}}</div>
            </div>
          </div>
          <div class="list"
            v-if="order_type === 2">
            <div class="title">
              <div class="col flex07">
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
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col blue"
                style="cursor: pointer;"
                @click="$router.push(`/sample/sampleOrderDetail/${item.id}`)">{{item.order_code}}</div>
              <div class="col">{{item.order_time}}</div>
              <div class="col">{{item.client_name}}</div>
              <div class="col">{{item.group_name}}</div>
              <div class="col">{{item.numbers}}</div>
              <div class="col">{{item.client_pay}}</div>
            </div>
          </div>
        </template>
        <!-- 物料订购调取 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 6)) && type === '物料订购调取'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <el-select class="filter_item"
                  v-model="order_type"
                  style="width:120px"
                  @change="getList(1)">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  :disabled="order_type === 0"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  :disabled="order_type === 0"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
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
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
                <el-checkbox v-model="checkAll">全选</el-checkbox>
              </div>
              <div class="col">
                <span class="text">创建日期</span>
              </div>
              <div class="col">
                <span class="text">关联单号</span>
              </div>
              <div class="col flex07">
                <span class="text">负责小组</span>
              </div>
              <div class="col">
                <span class="text">物料名称</span>
              </div>
              <div class="col flex07">
                <span class="text">属性</span>
              </div>
              <div class="col flex07">
                <span class="text">类型</span>
              </div>
              <div class="col">
                <span class="text">公司/仓库</span>
              </div>
              <div class="col flex07">
                <span class="text">单价</span>
              </div>
              <div class="col flex07">
                <span class="text">下单数量</span>
              </div>
              <div class="col flex07">
                <span class="text">交货数量</span>
              </div>
              <div class="col flex07">
                <span class="text">总价</span>
              </div>
              <div class="col flex07">
                <span class="text">备注</span>
              </div>
              <div class="col flex07">
                <span class="text">创建人</span>
              </div>
              <div class="col">
                <span class="text">截止日期</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col">
                <span class="text">{{item.create_time.slice(0,10)}}</span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push(`${order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.group_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.material_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.color_code}}</span>
              </div>
              <div class="col flex07">
                <span class="text"
                  :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name||item.stock_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.price}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.weight}}{{item.type === 1 ? 'kg' : (item.unit || '个')}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.reality_push_weight || 0}}{{item.type === 1 ? 'kg' : (item.unit || '个')}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{Math.round(item.price * (Number(item.reality_push_weight) || item.weight))}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.desc?item.desc:'暂无'}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.complete_time}}</span>
              </div>
            </div>
          </div>
          <div class="statistics">
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
        </template>
        <!-- 物料预订购 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 4)) && type === '物料预订购'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="filter_item"
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
                  class="filter_item"
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
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
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
                <span class="text">创建人</span>
              </div>
              <div class="col">
                <span class="text">操作日期</span>
              </div>
              <div class="col">
                <span class="text">操作</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
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
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.create_time)}}</span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push('/materialOrder/materialOrderDetail/' + item.pid)">详情</span>
              </div>
            </div>
          </div>
          <div class="statistics">
            <div class="oneBox">
              <div class="label">数量:</div>
              <div class="content">{{$formatNum(statistics.material_order_order.total_weight)}}kg</div>
            </div>
            <div class="oneBox">
              <div class="label">总价:</div>
              <div class="content">{{$formatNum(statistics.material_order_order.total_price)}}元</div>
            </div>
          </div>
        </template>
        <!-- 物料加工 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 9 && itemS <= 12)) && type === '物料加工'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <!-- <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div> -->
                <el-select class="filter_item"
                  v-model="order_type"
                  style="width:120px"
                  @change="getList(1)">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  :disabled="order_type === 0"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  :disabled="order_type === 0"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
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
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
                <el-checkbox v-model="checkAll">全选</el-checkbox>
              </div>
              <div class="col">
                <span class="text">创建日期</span>
              </div>
              <div class="col">
                <span class="text">关联单号</span>
              </div>
              <div class="col flex07">
                <span class="text">负责小组</span>
              </div>
              <div class="col">
                <span class="text">物料名称</span>
              </div>
              <div class="col flex07">
                <span class="text">属性</span>
              </div>
              <div class="col flex07">
                <span class="text">工序</span>
              </div>
              <div class="col">
                <span class="text">加工单位</span>
              </div>
              <div class="col flex07">
                <span class="text">单价</span>
              </div>
              <div class="col flex07">
                <span class="text">下单数量</span>
              </div>
              <div class="col flex07">
                <span class="text">交货数量</span>
              </div>
              <div class="col flex07">
                <span class="text">总价</span>
              </div>
              <div class="col flex07">
                <span class="text">备注</span>
              </div>
              <div class="col flex07">
                <span class="text">创建人</span>
              </div>
              <div class="col">
                <span class="text">截止日期</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col">
                <span class="text">{{item.create_time.slice(0,10)}}</span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push(`${item.order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.order_group}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.material_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.material_color}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.process_type}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.price}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.weight}}{{item.type === 1 ? 'kg' : (item.unit || '个')}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.reality_push_weight || 0}}{{item.type === 1 ? 'kg' : (item.unit || '个')}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{Math.round(item.price*(Number(item.reality_push_weight) || item.weight))}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.desc?item.desc:'暂无'}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.complete_time.slice(0,10)}}</span>
              </div>
            </div>
          </div>
          <div class="statistics">
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
        </template>
        <!-- 织造分配 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 13 && itemS <= 14)) && type === '织造分配'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <!-- <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div> -->
                <el-select class="filter_item"
                  v-model="order_type"
                  style="width:120px"
                  @change="getList(1)">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  :disabled="order_type === 0"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  :disabled="order_type === 0"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
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
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
                <el-checkbox v-model="checkAll">全选</el-checkbox>
              </div>
              <div class="col">
                <span class="text">分配日期</span>
              </div>
              <div class="col">
                <span class="text">关联单号</span>
              </div>
              <div class="col flex07">
                <span class="text">负责小组</span>
              </div>
              <div class="col">
                <span class="text">织造单位</span>
              </div>
              <div class="col"
                style="flex:1.5">
                <span class="text">产品信息</span>
              </div>
              <div class="col flex07">
                <span class="text">尺码颜色</span>
              </div>
              <div class="col flex07">
                <span class="text">单价(元)</span>
              </div>
              <div class="col flex07">
                <span class="text">分配数量</span>
              </div>
              <div class="col flex07">
                <span class="text">实际数量</span>
              </div>
              <div class="col flex07">
                <span class="text">总价</span>
              </div>
              <div class="col flex07">
                <span class="text">备注</span>
              </div>
              <div class="col flex07">
                <span class="text">创建人</span>
              </div>
              <div class="col">
                <span class="text">完成日期</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col">
                <span class="text">{{item.created_at.slice(0,10)}}</span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push(`${item.order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.order_group}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col"
                style="flex:1.5">
                <zh-card-position :data="setCardData(item.product_info)">
                  {{item.product_info.product_code}}
                  <br />
                  {{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}
                </zh-card-position>
              </div>
              <div class="col flex07">
                <span>{{item.size_name}}</span>
                <br />
                <span>{{item.color_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.price}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.number}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.reality_number}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{Math.round(item.price*(Number(item.reality_number) || item.number))}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.desc?item.desc:'暂无'}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.complete_time.slice(0,10)}}</span>
              </div>
            </div>
          </div>
          <div class="statistics">
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
        </template>
        <!-- 半成品加工 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 15 && itemS <= 28)) && type === '半成品加工'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <!-- <div class="cutBox">
                  <div class="item"
                    :class="{'active':order_type === 1}"
                    @click="cutOrderType(1)">订单</div>
                  <div class="item"
                    :class="{'active':order_type === 2}"
                    @click="cutOrderType(2)">样单</div>
                </div> -->
                <el-select class="filter_item"
                  v-model="order_type"
                  style="width:120px"
                  @change="getList(1)">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  :disabled="order_type === 0"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  :disabled="order_type === 0"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
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
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
                <el-checkbox v-model="checkAll">全选</el-checkbox>
              </div>
              <div class="col">
                <span class="text">创建日期</span>
              </div>
              <div class="col">
                <span class="text">关联单号</span>
              </div>
              <div class="col flex07">
                <span class="text">负责小组</span>
              </div>
              <div class="col">
                <span class="text">加工单位</span>
              </div>
              <div class="col flex07">
                <span class="text">加工类型</span>
              </div>
              <div class="col"
                style="flex:1.5">
                <span class="text">产品信息</span>
              </div>
              <div class="col flex07">
                <span class="text">尺码颜色</span>
              </div>
              <div class="col flex07">
                <span class="text">单价(元)</span>
              </div>
              <div class="col flex07">
                <span class="text">分配数量</span>
              </div>
              <div class="col flex07">
                <span class="text">实际数量</span>
              </div>
              <div class="col flex07">
                <span class="text">总价</span>
              </div>
              <div class="col flex07">
                <span class="text">备注</span>
              </div>
              <div class="col flex07">
                <span class="text">创建人</span>
              </div>
              <div class="col">
                <span class="text">完成时间</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.created_at)}}</span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push(`${item.order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.group_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.type}}</span>
              </div>
              <div class="col"
                style="flex:1.5">
                <zh-card-position :data="setCardData(item.product_info)">
                  {{item.product_info.product_code}}
                  <br />
                  {{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}
                </zh-card-position>
              </div>
              <div class="col flex07">
                {{item.size}}
                <br />
                {{item.color}}
              </div>
              <div class="col flex07">
                <span class="text">{{$toFixed(item.price)}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.number}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.reality_number}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{Math.round((Number(item.reality_number) || item.number)*item.price)}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.desc?item.desc:'暂无'}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.complete.slice(0,10)}}</span>
              </div>
            </div>
          </div>
          <div class="statistics">
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
        </template>
        <!-- 成品加工 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 29 && itemS <= 34)) && type === '成品加工'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="getList(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
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
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
                <el-checkbox v-model="checkAll">全选</el-checkbox>
              </div>
              <div class="col">
                <span class="text">创建日期</span>
              </div>
              <div class="col">
                <span class="text">加工单位/人员</span>
              </div>
              <div class="col">
                <span class="text">关联单号</span>
              </div>
              <div class="col"
                style="flex:1.5">
                <span class="text">产品信息</span>
              </div>
              <div class="col">
                <span class="text">尺码颜色</span>
              </div>
              <div class="col flex07">
                <span class="text">数量</span>
              </div>
              <div class="col flex07">
                <span class="text">单价</span>
              </div>
              <div class="col">
                <span class="text">次品信息</span>
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
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col">
                <span class="text">{{item.complete_time}}</span>
              </div>
              <div class="col">
                <span class="text">
                  <span class="green">{{item.product_flow}}</span>
                  <br />
                  <span>{{item.client_name || item.inspection_user}}</span>
                </span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push(`/order/orderDetail/${item.order_id}`)">{{item.order_code}}</span>
              </div>
              <div class="col"
                style="flex:1.5">
                <zh-card-position :data="setCardData(item.product_info)">
                  {{item.product_info.product_code}}
                  <br />
                  {{item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name}}
                </zh-card-position>
              </div>
              <div class="col">
                <div class="text">
                  {{item.size_name}}
                  <br />
                  {{item.color_name}}
                </div>
              </div>
              <div class="col flex07">
                <span class="text">{{item.number}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.price || '/'}}</span>
              </div>
              <div class="col">
                <span class="green"
                  v-if="item.rejects_info===0">无次品</span>
                <el-popover placement="right"
                  v-else
                  width="100"
                  trigger="click">
                  次品数量：{{item.rejects_info.number}}
                  <br />
                  次品原因:{{item.rejects_info.reason ? item.rejects_info.reason.join(',') : ''}}
                  <span class="blue"
                    slot="reference"
                    style="cursor:pointer">有次品(查看)</span>
                </el-popover>
              </div>
              <div class="col">
                <span class="text">{{item.desc?item.desc:'暂无'}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.user_name}}</span>
              </div>
            </div>
          </div>
          <div class="statistics">
            <div class="oneBox">
              <div class="label">平均价格:</div>
              <div class="content">{{statistics.finished_product.avg_price}}元</div>
            </div>
            <div class="oneBox">
              <div class="label">数量:</div>
              <div class="content">{{$formatNum(statistics.finished_product.total_number)}}</div>
            </div>
            <div class="oneBox">
              <div class="label">总价:</div>
              <div class="content">{{$formatNum(statistics.finished_product.total_price)}}元</div>
            </div>
          </div>
        </template>
        <!-- 包装订购 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 7 && itemS <= 8)) && type === '包装订购'">
          <div class="filterCtn2">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <div class="filter_line">
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="getList(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  :disabled="order_type === 0"
                  v-model="order_code"
                  @change="getList(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="getList(1)"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
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
                  class="filter_item"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getList(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <div class="col flex07">
                <el-checkbox v-model="checkAll">全选</el-checkbox>
              </div>
              <div class="col">
                <span class="text">订购日期</span>
              </div>
              <div class="col">
                <span class="text">关联单号</span>
              </div>
              <div class="col flex07">
                <span class="text">负责小组</span>
              </div>
              <div class="col">
                <span class="text">订购单位</span>
              </div>
              <div class="col">
                <span class="text">包装辅料</span>
              </div>
              <div class="col flex07">
                <span class="text">单价(元)</span>
              </div>
              <div class="col flex07">
                <span class="text">下单数量</span>
              </div>
              <div class="col flex07">
                <span class="text">交货数量</span>
              </div>
              <div class="col flex07">
                <span class="text">总价</span>
              </div>
              <div class="col flex07">
                <span class="text">备注</span>
              </div>
              <div class="col flex07">
                <span class="text">创建人</span>
              </div>
              <div class="col">
                <span class="text">完成日期</span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in list"
              :key="index">
              <div class="col flex07">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col">
                <span class="text">{{item.order_time.slice(0,10)}}</span>
              </div>
              <div class="col">
                <span class="text blue"
                  style="cursor:pointer"
                  @click="$router.push(`/order/orderDetail/${item.order_id}`)">{{item.order_code}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.order_group}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.material_name}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{$toFixed(item.price || 0)}}元</span>
              </div>
              <div class="col flex07">
                <span class="text">{{$toFixed(item.number)}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.reality_number ? $toFixed(item.reality_number) : ''}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{$toFixed((item.price * (Number(item.reality_number) || item.number)) || 0)}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.desc?item.desc:'暂无'}}</span>
              </div>
              <div class="col flex07">
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.order_time.slice(0,10)}}</span>
              </div>
            </div>
          </div>
          <div class="statistics">
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
        </template>
        <!-- 装箱出库 -->
        <!-- <template v-if="clientInfo.type.some(itemS => (itemS >= 35 && itemS <= 36)) && type === '装箱出库'">
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
          <div class="list">
            <div class="title">
              <div class="col flex07">
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
              <div class="col flex07">
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
          <div class="statistics">
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
        </template> -->
        <!-- 销售出库 -->
        <template v-if="clientInfo.type.some(itemS => (itemS >= 37 && itemS <= 38)) && type === '销售出库'">
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
          <div class="list">
            <div class="title">
              <div class="col flex07">
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
              <div class="col flex07">
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
          <div class="statistics">
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
        </template>
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
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">开票列表</span>
        <div class="btn btnBlue"
          @click="goSettle(true)">新增开票</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="settleCode"
                @change="getSettle(1)"
                placeholder="输入开票编号查询">
              </el-input>
              <el-input class="filter_item"
                v-model="settleOrderCode"
                @change="getSettle(1)"
                placeholder="输入订单编号查询">
              </el-input>
              <el-date-picker v-model="settleDate"
                style="width:250px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getSettle(1)">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">开票编号</span>
            </div>
            <div class="col">
              <span class="text">关联订单</span>
            </div>
            <div class="col">
              <span class="text">开票日期</span>
            </div>
            <div class="col">
              <span class="text">开票号码</span>
            </div>
            <div class="col">
              <span class="text">开票金额</span>
            </div>
            <div class="col">
              <span class="text">开票合计</span>
            </div>
            <div class="col">
              <span class="text">图片信息</span>
            </div>
            <div class="col">
              <span class="text">审核状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="item in settleList"
            :key="item.id">
            <div class="col">
              <span class="text">{{item.settle_code}}</span>
            </div>
            <div class="col">
              <span class="text">
                <span style="cursor:pointer;color:#1a95ff"
                  v-for="order in item.order_code"
                  :key="order.order_id"
                  @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span>
              </span>
            </div>
            <div class="col">
              <span class="text">{{$getTime(item.complete_time)}}</span>
            </div>
            <div class="col">
              <div style="display:flex;justify-content:space-between;padding-right:15px">
                <span style="line-height:28px">{{item.invoiceNum}}</span>
                <div class="jtCtn"
                  v-show="item.invoice_info&&item.invoice_info.length>1">
                  <div class="jt el-icon-caret-top"
                    @click="checkWhich(item,'last',index)"></div>
                  <div class="jt el-icon-caret-bottom"
                    @click="checkWhich(item,'next',index)"></div>
                </div>
              </div>
            </div>
            <div class="col">
              <span class="text">{{item.invoicePrice}}元</span>
            </div>
            <div class="col">
              <span class="text">{{item.allPrice}}元</span>
            </div>
            <div class="col">
              <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                :src="item.file_url"
                :preview-src-list="[item.file_url]">
                <div slot="error"
                  class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="col">
              <span class="text"
                :class="item.status === 2 ? 'green' : item.status === 3 ? 'red' : 'blue'">{{item.status === 1 ? '待审核' : item.status === 2 ? '已通过' : '已驳回'}}</span>
            </div>
            <div class="col">
              <span class="text">
                <span class="opr"
                  @click="goSettleDeductDetail(item)">详情</span>
              </span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="settleTotal"
            :current-page.sync="settlePage"
            @current-change="getSettle()">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">{{typeNum === 9 ?'收款':'付款'}}列表</span>
        <div class="btn btnBlue"
          @click="goCollection(true)">{{typeNum === 9 ? '新增收款' : '新增付款'}}</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="collectionCode"
                @change="getCollection(1)"
                :placeholder="'输入'+typeNum === 9 ?'收款':'付款'+'编号查询'">
              </el-input>
              <el-input class="filter_item"
                v-model="collectionOrderCode"
                @change="getCollection(1)"
                placeholder="输入订单编号查询">
              </el-input>
              <el-date-picker v-model="collectionDate"
                style="width:250px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getCollection(1)">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">{{typeNum === 9 ?'收款':'付款'}}编号</span>
            </div>
            <div class="col">
              <span class="text">关联订单</span>
            </div>
            <div class="col">
              <span class="text">{{typeNum === 9 ?'收款':'付款'}}日期</span>
            </div>
            <div class="col">
              <span class="text">{{typeNum === 9 ?'收款':'付款'}}方式</span>
            </div>
            <div class="col">
              <span class="text">{{typeNum === 9 ?'收款':'付款'}}金额</span>
            </div>
            <div class="col">
              <span class="text">图片信息</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="item in collectionList"
            :key="item.id">
            <div class="col">
              <span class="text">{{item.code}}</span>
            </div>
            <div class="col">
              <span class="text"> <span style="cursor:pointer;color:#1a95ff"
                  v-for="order in item.order_code"
                  :key="order.order_id"
                  @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span></span>
            </div>
            <div class="col">
              <span class="text">{{$getTime(item.complete_time)}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.type}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.price}}元</span>
            </div>
            <div class="col">
              <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                :src="item.file_url"
                :preview-src-list="[item.file_url]">
                <div slot="error"
                  class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>

            <div class="col">
              <span class="text">
                <span class="opr"
                  @click="goSettleDeductDetail(item)">详情</span>
              </span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="collectionTotal"
            :current-page.sync="collectionPage"
            @current-change="getCollection()">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">扣款列表</span>
        <div class="btn btnBlue"
          @click="goChargebacks(true)">新增扣款</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="chargebacksCode"
                @change="getChargeBack(1)"
                placeholder="输入扣款编号查询">
              </el-input>
              <el-input class="filter_item"
                v-model="chargebacksOrderCode"
                @change="getChargeBack(1)"
                placeholder="输入订单编号查询">
              </el-input>
              <el-date-picker v-model="chargebacksDate"
                style="width:250px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getChargeBack(1)">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">扣款编号</span>
            </div>
            <div class="col">
              <span class="text">关联订单</span>
            </div>
            <div class="col">
              <span class="text">扣款日期</span>
            </div>
            <div class="col">
              <span class="text">扣款金额</span>
            </div>
            <div class="col">
              <span class="text">扣款原因</span>
            </div>
            <div class="col">
              <span class="text">图片信息</span>
            </div>
            <div class="col">
              <span class="text">审核状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="item in chargebacksList"
            :key="item.id">
            <div class="col">
              <span class="text">{{item.code}}</span>
            </div>
            <div class="col">
              <span class="text"> <span style="cursor:pointer;color:#1a95ff"
                  v-for="order in item.order_code"
                  :key="order.order_id"
                  @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span></span>
            </div>
            <div class="col">
              <span class="text">{{$getTime(item.complete_time)}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.deduct_price}}元</span>
            </div>
            <div class="col">
              <span class="text">{{item.desc}}</span>
            </div>
            <div class="col">
              <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                :src="item.file_url"
                :preview-src-list="[item.file_url]">
                <div slot="error"
                  class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="col">
              <span class="text"><span class="text"
                  :class="item.status === 2 ? 'green' : item.status === 3 ? 'red' : 'blue'">{{item.status === 1 ? '待审核' : item.status === 2 ? '已通过' : '已驳回'}}</span></span>
            </div>
            <div class="col">
              <span class="text">
                <span class="opr green"
                  @click.stop="$openUrl(`/deductTable/${item.client_id}/${item.type}/${item.id}/扣款`)">打印</span>
                <span class="opr"
                  @click="goSettleDeductDetail(item)">详情</span>
              </span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="chargebacksTotal"
            :current-page.sync="chargebacksPage"
            @current-change="getChargeBack()">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 开票 -->
    <div class="popup"
      v-show="settleFlag">
      <div class="main">
        <div class="title">
          <div class="text">单位开票</div>
          <i class="el-icon-close"
            @click="settleFlag=false;resetAll()"></i>
        </div>
        <div class="content">
          <div class="row"
            v-if="checkOrder.length>0&& !noOrder">
            <div class="label">订单编号：</div>
            <div class="info">
              <el-tag style="margin-right:8px"
                v-for="(item,index) in checkOrder"
                :key="index">
                {{item.order_code}}
              </el-tag>
            </div>
          </div>
          <div class="row"
            v-if="type === '所有订单' && order_type === 1">
            <div class="label">开票合计：</div>
            <div class="info">{{checkOrderTotalPrice}}元</div>
          </div>
          <div class="row">
            <div class="label">开票日期：</div>
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
            <div class="label">开票金额：</div>
            <div class="info">
              <zh-input placeholder="请输入开票金额"
                type="number"
                v-model="settle.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div v-for="(item,index) in settle.invoiceDetail"
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
            <div class="label">票据信息：</div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                :on-success="successFile"
                ref="uploada"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
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
            @click="settleFlag=false;resetAll()">取消</div>
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
          <div class="text">订单扣款</div>
          <i class="el-icon-close"
            @click="chargebacksFlag=false;resetAll()"></i>
        </div>
        <div class="content">
          <div class="row"
            v-if="checkOrder.length>0&& !noOrder">
            <div class="label">订单编号：</div>
            <div class="info">
              <el-tag style="margin-right:8px"
                v-for="(item,index) in checkOrder"
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
              <zh-input placeholder="请输入扣款金额"
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
          <div class="row">
            <div class="label">票据信息：</div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                :on-success="successFile"
                ref="uploada"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="chargebacksFlag=false;resetAll()">取消</div>
          <div class="btn btnBlue"
            @click="chargebacksFn">确定</div>
        </div>
      </div>
    </div>
    <!-- 单位收款 -->
    <div class="popup"
      v-if="collectionFlag">
      <div class="main">
        <div class="title">
          <div class="text">单位{{typeNum === 9 ? '收款' : '付款'}}</div>
          <i class="el-icon-close"
            @click="collectionFlag=false;resetAll()"></i>
        </div>
        <div class="content">
          <div class="row"
            v-if="checkOrder.length>0 && !noOrder">
            <div class="label">订单编号：</div>
            <div class="info">
              <el-tag v-for="(item,index) in checkOrder"
                style="margin-right:8px"
                :key="index">
                {{item.order_code}}
              </el-tag>
            </div>
          </div>
          <div class="row">
            <div class="label">{{typeNum === 9 ? '收款' : '付款'}}日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="collection.date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">{{typeNum === 9 ? '收款' : '付款'}}金额：</div>
            <div class="info">
              <zh-input :placeholder='`请输入${typeNum === 9 ? "收款" : "付款"}金额`'
                type="number"
                v-model="collection.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">{{typeNum === 9 ? '收款' : '付款'}}方式：</div>
            <div class="info">
              <el-autocomplete v-model="collection.type"
                clearable
                :fetch-suggestions="querySearchCollection"
                :placeholder='`请选择${typeNum === 9 ? "收款" : "付款"}方式`'></el-autocomplete>
            </div>
          </div>
          <div class="row">
            <div class="label">票据信息：</div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                :on-success="successFile"
                ref="uploada"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入备注信息"
                v-model="collection.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="collectionFlag=false;resetAll()">取消</div>
          <div class="btn btnBlue"
            @click="collectionFn">确定</div>
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
          <div class="row"
            style="height:32px">
            <span class="label">筛选条件：</span>
            <span class="info">
              <el-input v-model="log_order_code"
                placeholder="输入订单号查询"
                clearable
                style="width:150px"></el-input>
              <el-select v-model="log_type"
                clearable
                style="margin-left:16px;width:150px;"
                placeholder="请选择类型">
                <el-option v-for="item in [{id:1,name:'扣款'},{id:2,name:'开票'},{id:3,name:'收款'},{id:4,name:'付款'}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <el-date-picker v-model="log_date"
                clearable
                style="margin-left:16px;width:250px;height:32px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </span>
          </div>
          <div style="width:100%;max-height:400px;overflow-y:auto">
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
                          <span :style="`color:${(item.methods==='开票'&&'#1A95FF') || (item.methods==='扣款'&&'#F2637B') || ((item.methods==='收款' || item.methods==='付款')&&'#00A539')}`"
                            style="margin-left:20px">{{item.methods}}</span>
                          <span style="margin-left:20px">金额：
                            <span style="font-size:14px">{{$formatNum(item.deduct_price  || item.settle_price || item.price || 0)}}元</span>
                          </span>
                        </div>
                        <div style="display:flex;align-items:center">
                          <div class="blue"
                            v-if="item.methods === '扣款'"
                            style="margin-right:20px"
                            @click.stop="$openUrl(`/deductTable/${item.client_id}/${item.type}/${item.id}/扣款`)">打印</div>
                          <div class="blue"
                            style="margin-right:20px"
                            @click.stop="goSettleDeductDetail(item)">查看详情</div>
                        </div>
                      </span>
                    </template>
                    <template v-if="item.methods==='开票'">
                      <div class="collapseBox"
                        v-for="(itemChild,indexChild) in item.invoice_info"
                        :key="indexChild">
                        <span class="label">发票信息：</span>
                        <span class="info">{{itemChild.invoiceNum}} - {{itemChild.invoicePrice}}元</span>
                      </div>
                      <div class="collapseBox">
                        <span class="label">包含订单：</span>
                        <span class="info">
                          <el-tag v-for="order in item.order_code"
                            :key="order.order_id"
                            @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}}</el-tag>
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
                            @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)"
                            :key="order.order_id">{{order.order_code}}</el-tag>
                        </span>
                      </div>
                      <div class="collapseBox">
                        <span class="label">扣款原因：</span>
                        <span class="info">{{item.desc}}</span>
                      </div>
                    </template>
                    <template v-if="item.methods==='收款' || item.methods === '付款'">
                      <div class="collapseBox">
                        <span class="label">包含订单：</span>
                        <span class="info">
                          <el-tag v-for="order in item.order_code"
                            @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)"
                            :key="order.order_id">{{order.order_code}}</el-tag>
                        </span>
                      </div>
                      <div class="collapseBox">
                        <span class="label">{{item.methods}}金额：</span>
                        <span class="info">{{item.price || 0}}元</span>
                      </div>
                      <div class="collapseBox">
                        <span class="label">{{item.methods}}方式：</span>
                        <span class="info">{{item.type || ''}}</span>
                      </div>
                      <div class="collapseBox">
                        <span class="label">{{item.methods}}备注：</span>
                        <span class="info">{{item.desc}}</span>
                      </div>
                    </template>
                  </el-collapse-item>
                </el-collapse>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="row">
            <span class="label">合计开票：</span>
            <span class="info blue">{{$toFixed(oprListCom.settle)}}元</span>
            <span class="label">合计扣款：</span>
            <span class="info red">{{$toFixed(oprListCom.chargebacks)}}元</span>
            <span class="label">合计收款：</span>
            <span class="info green">{{$toFixed(oprListCom.collection)}}元</span>
            <span class="label">合计付款：</span>
            <span class="info green">{{$toFixed(oprListCom.pay)}}元</span>
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="openDownLoadAllProp">导出所有相关日志</div>
        </div>
      </div>
    </div>
    <!-- 导出所有日志窗口-->
    <div class="popup"
      v-if="isDownLoading">
      <div class="centerMain">
        <div class="item">
          <!-- <el-date-picker v-model="year"
            style="width:100%"
            value-format="yyyy"
            type="year"
            placeholder="选择导出年份">
          </el-date-picker> -->
          <el-date-picker :disabled="isDownLoading > 1"
            v-model="year"
            style="width:100%"
            type="monthrange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            @change="year[1] = $getTime(new Date(new Date(year[1]).getFullYear(),new Date(year[1]).getMonth()+1,0))">
          </el-date-picker>
        </div>
        <div class="item"
          v-for="(item,index) in downLoadInfoArr"
          :key="index"
          :class="{
            'blue':item.isGetting === 2 && isDownLoading === 2,
            'red':item.isGetting === 3,
            'green':item.isGetting === 4
          }">
          <div>
            <el-checkbox v-model="item.checked"
              :disabled="isDownLoading > 1"></el-checkbox>
            {{item.name}}
          </div>
          <div>
            {{(item.isGetting === 1 || item.isGetting === 2) ? `${item.propgress || 0}%` : ''}}
            <div :class="{
              'el-icon-loading':item.isGetting === 2 && isDownLoading === 2,
              'blue':item.isGetting === 2 && isDownLoading === 2,
              'el-icon-error':item.isGetting === 3,
              'red':item.isGetting === 3,
              'el-icon-success':item.isGetting === 4,
              'green':item.isGetting === 4,
              'orange':item.isGetting === 5
            }">{{item.isGetting === 5 ? '无相关日志' : ''}}</div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="isDownLoading = 0">关闭</div>
          <div class="btn btnBlue"
            v-if="isDownLoading === 1"
            @click="downloadAllInfo">开始</div>
          <div class="btn btnBlue"
            v-if="isDownLoading === 2">进行中<span class="el-icon-loading"></span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { companyType } from '@/assets/js/dictionary.js'
import { getToken, group, client, auth, process, stock, materialManage, materialOrder, materialProcess, weave, processing, packPlan, settle, chargebacks, collection, statistics, inspection } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      huobi: '',
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
      order_type: 0,
      material_name: '',
      operate_user: '',
      stock_id: '',
      date: [this.$getTime(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 365)), this.$getTime(new Date())],
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
        finished_product: {
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
      // 扣款开票数据
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
      log_order_code: '',
      log_date: '',
      oprList: [],
      orderOprFlag: false,
      orderOprList: [],
      // 收款数据
      collectionFlag: false,
      collection: {
        data: this.$getTime(),
        price: '',
        desc: '',
        type: ''
      },
      // 2020-09-01新增修改数据
      group_id: '',
      groupList: [],
      // 导出所有数据
      year: '',
      isDownLoading: 0, // 导出状态 0窗口关闭1窗口打开2正在导出3导出完毕
      downLoadInfoArr: [],
      detailCount: null,
      countType: null,
      countYear: (new Date().getFullYear()).toString(),
      chargebacksList: [],
      chargebacksPage: 1,
      chargebacksTotal: 1,
      chargebacksCode: '',
      chargebacksOrderCode: '',
      chargebacksDate: [this.$getTime(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 365)), this.$getTime(new Date())],
      settleList: [],
      settlePage: 1,
      settleTotal: 1,
      settleCode: '',
      settleOrderCode: '',
      settleDate: [this.$getTime(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 365)), this.$getTime(new Date())],
      collectionList: [],
      collectionPage: 1,
      collectionTotal: 1,
      collectionCode: '',
      collectionOrderCode: '',
      collectionDate: [this.$getTime(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 365)), this.$getTime(new Date())],
      collectionMethod: '',
      noOrder: false, // 标记是否是无单号提交
      postData: { token: '' },
      fileArr: [],
      fileUrl: ''
    }
  },
  methods: {
    resetAll () {
      this.noOrder = false
      this.fileArr = []
      this.fileUrl = ''
    },
    checkWhich (item, opr, index) {
      if (item.invoice_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.invoicePrice = item.invoice_info[item.nowIndex || 0].invoicePrice
          item.invoiceNum = item.invoice_info[item.nowIndex || 0].invoiceNum
          this.$set(this.settleList, index, item)
        }
        if (opr === 'next') {
          if (item.nowIndex === item.invoice_info.length - 1) {
            item.nowIndex = 0
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          } else {
            item.nowIndex += 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.nowIndex === 0) {
            item.nowIndex = item.product_info.length - 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          } else {
            item.nowIndex -= 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.invoicePrice = 0
        item.invoiceNum = '无票号'
      }
    },
    disabledDate (e) {
      if (new Date(e).getFullYear() > (new Date().getFullYear())) return true
    },
    setCardData (item) {
      return {
        product_id: item.product_id,
        product_type: item.product_type,
        product_code: item.product_code,
        img: item.image.map(val => { return { image_url: val.image_url, thumb: val.thumb } }),
        category_name: item.category_name,
        type_name: item.type_name,
        style_name: item.style_name,
        color: item.color ? item.color.map(val => val.color_name) : [],
        size: item.size,
        description: item.description
      }
    },
    showLog (type, item) {
      this.log_type = type
      this.log_order_code = item.order_code
      this.oprFlag = true
    },
    downloadAllInfo () {
      if (!(this.year && this.year[0] && this.year[1])) {
        this.$message.warning(`请选择导出月份区间`)
        return
      }
      this.isDownLoading = 2
      this.downLoadInfoArr.forEach(item => {
        if (item.checked) {
          this.getAllLog(item)
        }
      })
    },
    openDownLoadAllProp () {
      let year = new Date().getFullYear()
      this.year = [this.$getTime(new Date(year, 0, 1)), this.$getTime(new Date(year + 1, 0, 0))]
      this.downLoadInfoArr = []
      if (this.clientInfo.type.some(itemS => (itemS >= 1 && itemS <= 2))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '订单',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        }, {
          checked: true,
          name: '样单',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 6))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '物料订购调取',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 4))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '物料预订购',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 9 && itemS <= 12))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '物料加工',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 13 && itemS <= 14))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '织造分配',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 15 && itemS <= 28))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '半成品加工',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 29 && itemS <= 34))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '成品加工',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 7 && itemS <= 8))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '包装订购',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      if (this.clientInfo.type.some(itemS => (itemS >= 37 && itemS <= 38))) {
        this.downLoadInfoArr.push({
          checked: true,
          name: '销售出库',
          isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
          propgress: 0 // 进度
        })
      }
      this.downLoadInfoArr.push({
        checked: true,
        name: '扣款',
        isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
        propgress: 0 // 进度
      }, {
        checked: true,
        name: '开票',
        isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
        propgress: 0 // 进度
      }, {
        checked: true,
        name: '收款',
        isGetting: 1, // 当前状态 1等待2获取中3获取失败4获取完成5没有日志
        propgress: 0 // 进度
      })
      this.isDownLoading = 1
    },
    getAllLog (item = {}, data = [], total, page = 1, limit = 50) {
      item.isGetting = 1
      item.propgress = this.$toFixed(page / Math.ceil(total / limit) * 100)
      if (item.name === '订单') {
        statistics.orderList({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data)
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '订单编号', key: 'order_code' },
                { title: '下单日期', key: 'order_time' },
                { title: '订单公司', key: 'client_name' },
                { title: '负责小组', key: 'group_name' },
                { title: '下单数量', key: 'order_number' },
                { title: '下单总额', key: 'total_price' },
                { title: '出库数量', key: 'pack_number' },
                { title: '实际总值', key: 'reality_number' },
                { title: '工厂成本', key: 'company_cost' },
                { title: '开票记录', key: 'settle_number' },
                { title: '扣款记录', key: 'deduct_number' },
                { title: '创建人', key: 'user_name' }
              ], false, `订单-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '样单') {
        statistics.sampleList({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data)
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '样单编号', key: 'order_code' },
                { title: '下单日期', key: 'order_time' },
                { title: '订单公司', key: 'client_name' },
                { title: '负责小组', key: 'group_name' },
                { title: '打样数量', key: 'numbers' },
                { title: '客户付费', key: 'client_pay' },
                { title: '工厂成本', key: 'company_cost' }
              ], false, `样单-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '物料订购调取') {
        materialManage.detail({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.type_source_name = (item.type_source === 2 ? '订购' : '调取') + (item.replenish_id ? '/补纱' : '')
              item.total_price = this.$toFixed(item.price * (Number(item.reality_push_weight) || item.weight))
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '创建日期', key: 'create_time' },
                { title: '关联单号', key: 'order_code' },
                { title: '物料名称', key: 'material_name' },
                { title: '属性', key: 'color_code' },
                { title: '来源类型', key: 'type_source_name' },
                { title: '公司名称', key: 'client_name' },
                { title: '单价(元)', key: 'price' },
                { title: '下单数量', key: 'weight' },
                { title: '交货数量', key: 'reality_push_weight' },
                { title: '总价(元)', key: 'total_price' },
                { title: '备注', key: 'desc' },
                { title: '创建人', key: 'user_name' },
                { title: '采购日期', key: 'complete_time' }
              ], false, `物料订购调取-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '物料预订购') {
        materialOrder.allLog({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data)
            total = res.data.meta.total
            debugger
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '订购日期', key: 'order_time' },
                { title: '纱线单位', key: 'client_name' },
                { title: '物料名称', key: 'material_name' },
                { title: '物料颜色', key: 'color_code' },
                { title: '物料价格', key: 'price' },
                { title: '入库数量', key: 'weight' },
                { title: '入库仓库', key: 'stock_name' },
                { title: '备注', key: 'desc' },
                { title: '创建人', key: 'user_name' },
                { title: '操作时间', key: 'create_time' }
              ], false, `物料预订购入库-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '物料加工') {
        materialProcess.detail({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.total_price = this.$toFixed(item.price * (Number(item.reality_push_weight) || item.weight))
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '创建日期', key: 'create_time' },
                { title: '关联单号', key: 'order_code' },
                { title: '加工单位', key: 'client_name' },
                { title: '物料名称', key: 'material_name' },
                { title: '属性', key: 'material_color' },
                { title: '工序', key: 'process_type' },
                { title: '单价(元)', key: 'price' },
                { title: '下单数量', key: 'weight' },
                { title: '交货数量', key: 'reality_push_weight' },
                { title: '总价(元)', key: 'total_price' },
                { title: '备注', key: 'desc' },
                { title: '创建人', key: 'user_name' },
                { title: '下单日期', key: 'complete_time' }
              ], false, `物料加工-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '织造分配') {
        weave.detail({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map((item) => {
              item.product_code = item.product_info.product_code
              item.sizeColor = item.size_name + '/' + item.color_name
              let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
              item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
              item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
              item.total_price = this.$toFixed(item.price * (Number(item.reality_number) || item.number))
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '创建日期', key: 'created_at' },
                { title: '关联单号', key: 'order_code' },
                { title: '出入库单位', key: 'client_name' },
                { title: '产品编号', key: 'product_code' },
                { title: '尺码颜色', key: 'sizeColor' },
                { title: '尺码信息', key: 'size_info' },
                { title: '克重', key: 'size_weight' },
                { title: '单价(元)', key: 'price' },
                { title: '分配数量', key: 'number' },
                { title: '实际数量', key: 'reality_number' },
                { title: '总价(元)', key: 'total_price' },
                { title: '备注', key: 'desc' },
                { title: '创建人', key: 'user_name' },
                { title: '分配日期', key: 'complete_time' }
              ], false, `织造分配-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '半成品加工') {
        processing.detail({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map((item) => {
              item.product_code = item.product_info.product_code
              item.sizeColor = item.size + '/' + item.color
              let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => itemF.size_name === item.size)) || false
              item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
              item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
              item.total_price = this.$toFixed(item.price * (Number(item.reality_number) || item.number))
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '创建日期', key: 'created_at' },
                { title: '关联单号', key: 'order_code' },
                { title: '出入库单位', key: 'client_name' },
                { title: '加工类型', key: 'type' },
                { title: '产品编号', key: 'product_code' },
                { title: '尺码颜色', key: 'sizeColor' },
                { title: '尺码信息', key: 'size_info' },
                { title: '克重', key: 'size_weight' },
                { title: '单价(元)', key: 'price' },
                { title: '分配数量', key: 'number' },
                { title: '实际数量', key: 'reality_number' },
                { title: '总价(元)', key: 'total_price' },
                { title: '备注', key: 'desc' },
                { title: '创建人', key: 'user_name' },
                { title: '分配日期', key: 'complete' }
              ], false, `半成品加工-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '成品加工') {
        inspection.finishedDetail({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map((item) => {
              if (item.rejects_info) {
                item.rejects_info = JSON.parse(item.rejects_info)
                if (!item.rejects_info.number) {
                  item.rejects_info = 0
                }
              }
              item.client_or_user_name = item.client_name || item.inspection_user
              item.product_code = item.product_info.product_code
              let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
              item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
              item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
              item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
              if (item.rejects_info !== 0) {
                item.rejects_number = item.rejects_info.number
                item.rejects_infos = item.rejects_info.reason ? item.rejects_info.reason.join(',') : ''
              } else {
                item.rejects_number = 0
                item.rejects_infos = ''
              }
              item.total_price = item.price ? item.price * item.number : 0
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '创建日期', key: 'complete_time' },
                { title: '加工类型', key: 'product_flow' },
                { title: '加工单位', key: 'client_or_user_name' },
                { title: '关联单号', key: 'order_code' },
                { title: '产品编号', key: 'product_code' },
                { title: '产品品类', key: 'product_types' },
                { title: '尺码', key: 'size_name' },
                { title: '尺码信息', key: 'size_info' },
                { title: '克重', key: 'size_weight' },
                { title: '颜色', key: 'color_name' },
                { title: '数量', key: 'number' },
                { title: '单价(元)', key: 'price' },
                { title: '总价(元)', key: 'total_price' },
                { title: '次品数量', key: 'rejects_number' },
                { title: '次品原因', key: 'rejects_infos' },
                { title: '备注', key: 'desc' },
                { title: '操作人', key: 'user_name' }
              ], false, `成品加工-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '包装订购') {
        packPlan.packOrderLog({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.pack_size = item.price_square ? JSON.parse(item.size).join('*') : item.pack_size
              item.total_price = this.$toFixed(item.price * (Number(item.reality_number) || item.number))
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '创建日期', key: 'order_time' },
                { title: '关联单号', key: 'order_code' },
                { title: '订购单位', key: 'client_name' },
                { title: '包装辅料', key: 'material_name' },
                { title: '单价', key: 'price' },
                { title: '下单数量', key: 'number' },
                { title: '交货数量', key: 'reality_number' },
                { title: '总价', key: 'total_price' },
                { title: '规格', key: 'pack_size' },
                { title: '属性', key: 'attribute' },
                { title: '备注', key: 'desc' },
                { title: '创建人', key: 'user_name' }
              ], false, `包装订购-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '销售出库') {
        packPlan.outMarketLog({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.category_type = [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/')
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '出库日期', key: 'complete_time' },
                { title: '销售单位', key: 'client_name' },
                { title: '销售产品', key: 'product_code' },
                { title: '产品类型', key: 'category_type' },
                { title: '尺码', key: 'size_name' },
                { title: '颜色', key: 'color_name' },
                { title: '销售数量', key: 'number' },
                { title: '销售单价', key: 'price' },
                { title: '价格说明', key: 'price_remark' },
                { title: '总价', key: 'total_price' },
                { title: '备注', key: 'desc' }
              ], false, `销售出库-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '扣款') {
        chargebacks.log({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.order_code_str = item.order_code.map(itemM => itemM.order_code).join(';')
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '扣款日期', key: 'complete_time' },
                { title: '扣款编号', key: 'deduct_code' },
                { title: '扣款单位', key: 'client_name' },
                { title: '包含订单', key: 'order_code_str' },
                { title: '扣款金额', key: 'deduct_price' },
                { title: '扣款原因', key: 'desc' },
                { title: '操作人', key: 'user_name' }
              ], false, `扣款-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '开票') {
        settle.log({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.order_code_str = item.order_code.map(itemM => itemM.order_code).join(';')
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '开票日期', key: 'complete_time' },
                { title: '开票编号', key: 'settle_code' },
                { title: '开票单位', key: 'client_name' },
                { title: '包含订单', key: 'order_code_str' },
                { title: '开票金额', key: 'settle_price' },
                { title: '备注信息', key: 'desc' },
                { title: '操作人', key: 'user_name' }
              ], false, `开票-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      } else if (item.name === '收款') {
        collection.log({
          limit: limit,
          page: page,
          client_id: this.$route.params.id,
          start_time: (this.year && this.year[0]) || '',
          end_time: (this.year && this.year[1]) || ''
        }).then((res) => {
          if (res.data.data && res.data.data.length === 0) {
            item.isGetting = 5
            return
          }
          if (res.data.status !== false) {
            data.push(...res.data.data.map(item => {
              item.order_code_str = item.order_code.map(itemM => itemM.order_code).join(';')
              return item
            }))
            total = res.data.meta.total
            if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
              downloadExcel(data, [
                { title: '收款日期', key: 'complete_time' },
                // { title: '开票单位', key: 'client_name' },
                { title: '包含订单', key: 'order_code_str' },
                { title: '收款金额', key: 'price' },
                { title: '收款方式', key: 'type' },
                { title: '备注信息', key: 'desc' },
                { title: '操作人', key: 'user_name' }
              ], false, `收款-${this.year}年度-${new Date().getTime()}`)
              item.isGetting = 4
            } else {
              setTimeout(() => {
                this.getAllLog(item, data, total, page + 1, limit)
              }, 1000)
            }
          } else {
            item.isGetting = 3
          }
        }).catch(error => {
          console.log(error)
          item.isGetting = 3
        })
      }
    },
    goSettleDeductDetail (item) {
      this.$router.push('/financialStatistics/oprDetail/' + this.$route.params.id + '/' + item.type + '/' + item.id + '/' + item.methods + '?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)
    },
    init () {
      Promise.all([
        client.detail({
          id: this.$route.params.id
        }),
        auth.list(),
        process.list(),
        stock.list(),
        group.list(),
        getToken()
      ]).then(res => {
        // 初始化客户详情
        this.clientInfo = this.$clone(res[0].data.data)
        this.clientInfo.typeStr = this.clientInfo.type.map(item => {
          let flag = this.companyType.find(value => value.value === item)
          return flag ? `${flag.type}/${flag.label}` : ''
        })
        if (this.clientInfo.type.some(itemS => (itemS >= 1 && itemS <= 2))) {
          this.type = '所有订单'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 3 && itemS <= 6))) {
          this.type = '物料订购调取'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 9 && itemS <= 12))) {
          this.type = '物料加工'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 13 && itemS <= 14))) {
          this.type = '织造分配'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 15 && itemS <= 28))) {
          this.type = '半成品加工'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 29 && itemS <= 34))) {
          this.type = '成品加工'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 7 && itemS <= 8))) {
          this.type = '包装订购'
        } else if (this.clientInfo.type.some(itemS => (itemS >= 35 && itemS <= 36))) {
          this.type = '装箱出库'
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
        this.groupList = res[4].data.data
        this.postData.token = res[5].data.data
        this.getSettleChargbacksLog()
        this.loading = false
      })
    },
    getCountDetail () {
      this.loading = true
      client.detailCount({
        client_id: this.$route.params.id,
        year: this.countYear < new Date().getFullYear() ? this.countYear : null,
        type: this.countType || null
      }).then(res => {
        this.loading = false
        if (res.data.status === false) return
        this.detailCount = res.data.data
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
            client_id: this.$route.params.id,
            group_id: this.group_id,
            currency_type: this.huobi
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
            client_id: this.$route.params.id,
            group_id: this.group_id,
            currency_type: this.huobi
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
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.$route.params.id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
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
          operate_user: this.operate_user,
          group_id: this.group_id
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
          operate_user: this.operate_user,
          group_id: this.group_id
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
          operate_user: this.operate_user,
          group_id: this.group_id
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
      } else if (this.type === '成品加工') {
        inspection.finishedDetail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id,
          client_id: this.$route.params.id
        }).then(res => {
          this.list = res.data.data.map(itemM => {
            if (itemM.rejects_info) {
              itemM.rejects_info = JSON.parse(itemM.rejects_info)
              if (!itemM.rejects_info.number) {
                itemM.rejects_info = 0
              }
            }
            return {
              ...itemM,
              checked: false
            }
          })
          this.total = res.data.meta.total
          this.statistics.finished_product = {
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
          operate_user: this.operate_user,
          group_id: this.group_id
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
          // this.statistics.stock_out = {
          //   total_number: res.data.total_number,
          //   total_cubic_number: res.data.total_cubic_number,
          //   total_price: res.data.total_price,
          //   avg_price: res.data.avg_price
          // }
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
    goSettle (noOrder) {
      if (this.order_type === 0) {
        if (noOrder) {
          this.noOrder = true
        } else {
          this.$message.warning('请将筛选条件中的所有日志修改为订单或者样单，然后使用')
          return
        }
      }
      this.settleFlag = true
    },
    settleFn () {
      settle.create({
        id: null,
        client_id: this.$route.params.id,
        order_id: this.noOrder ? null : JSON.stringify(this.$unique(this.checkOrder.map((item) => item.order_id))),
        complete_time: this.settle.date,
        settle_price: this.settle.price,
        is_invoice: this.settle.ifInvoice,
        invoice_info: JSON.stringify(this.settle.invoiceDetail),
        desc: this.settle.desc,
        order_type: this.order_type,
        transfer_type: this.typeNum === 9 ? 1 : 0,
        type: this.typeNum,
        file_url: this.fileUrl
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('开票成功')
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
          this.getList()
          this.getSettleChargbacksLog()
        }
      })
    },
    goChargebacks (noOrder) {
      if (this.order_type === 0) {
        if (noOrder) {
          this.noOrder = true
        } else {
          this.$message.warning('请将筛选条件中的所有日志修改为订单或者样单，然后使用')
          return
        }
      }
      this.chargebacksFlag = true
    },
    chargebacksFn () {
      chargebacks.create({
        id: null,
        client_id: this.$route.params.id,
        order_id: this.noOrder ? null : JSON.stringify(this.$unique(this.checkOrder.map((item) => item.order_id))),
        complete_time: this.chargebacks.date,
        deduct_price: this.chargebacks.price,
        desc: this.chargebacks.desc,
        order_type: this.order_type,
        type: this.typeNum,
        file_url: this.fileUrl
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣款成功')
          this.chargebacksFlag = false
          this.chargebacks = {
            date: this.$getTime(),
            price: '',
            desc: ''
          }
          this.getList()
          this.getSettleChargbacksLog()
        }
      })
    },
    // 收款
    goCollection (noOrder) {
      if (noOrder) {
        this.noOrder = true
      } else {
        this.$message.warning('请将筛选条件中的所有日志修改为订单或者样单，然后使用')
        return
      }
      this.collectionFlag = true
    },
    collectionFn () {
      collection.create({
        id: null,
        client_id: this.$route.params.id,
        complete_time: this.collection.date,
        order_id: this.noOrder ? null : JSON.stringify(this.$unique(this.checkOrder.map((item) => item.order_id))),
        price: this.collection.price,
        desc: this.collection.desc,
        type: this.collection.type,
        order_type: this.order_type,
        // 加一个字段区分收款(1)付款(0)
        transfer_type: this.typeNum === 9 ? 1 : 0,
        file_url: this.fileUrl
      }).then((res) => {
        if (res.data.status !== false) {
          this.$message.success(`${this.typeNum === 9 ? '收款' : '付款'}成功`)
          if (this.collection.type) {
            let list = window.localStorage.getItem('zh_collection_type')
            list = list ? JSON.parse(list) : []
            list.push({ value: this.collection.type })
            list = this.$unique(list, 'value')
            window.localStorage.setItem('zh_collection_type', JSON.stringify(list))
          }
          this.collectionFlag = false
          this.collection = {
            date: this.$getTime(),
            price: '',
            desc: '',
            type: ''
          }
          this.getList()
          this.getSettleChargbacksLog()
        }
      })
    },
    querySearchCollection (queryString, cb) {
      let list = window.localStorage.getItem('zh_collection_type')
      list = list ? JSON.parse(list) : []
      list = queryString ? list.filter(itemF => itemF.value.indexOf(queryString) !== -1) : list
      cb(list)
    },
    getChargeBack (page) {
      if (page) {
        this.settlePage = page
      }
      chargebacks.log({
        limit: 5,
        page: this.chargebacksPage,
        client_id: this.$route.params.id,
        order_code: this.chargebacksOrderCode,
        code: this.chargebacksCode,
        start_time: (this.chargebacksDate && this.chargebacksDate[0]) || '',
        end_time: (this.chargebacksDate && this.chargebacksDate[1]) || ''
      }).then((res) => {
        this.chargebacksList = res.data.data
        this.chargebacksTotal = res.data.meta.total
      })
    },
    getSettle (page) {
      if (page) {
        this.settlePage = page
      }
      settle.log({
        limit: 5,
        page: this.settlePage,
        client_id: this.$route.params.id,
        order_code: this.settleOrderCode,
        code: this.settleCode,
        start_time: (this.settleDate && this.settleDate[0]) || '',
        end_time: (this.settleDate && this.settleDate[1]) || ''
      }).then((res) => {
        this.settleList = res.data.data
        this.settleTotal = res.data.meta.total
        this.settleList.forEach((item) => {
          this.checkWhich(item, 'init')
          item.allPrice = item.invoice_info.reduce((total, current) => {
            return total + Number(current.invoicePrice)
          }, 0)
        })
      })
    },
    getCollection () {
      collection.log({
        limit: 5,
        page: this.collectionPage,
        client_id: this.$route.params.id,
        order_code: this.collectionOrderCode,
        code: this.collectionCode,
        start_time: (this.collectionDate && this.collectionDate[0]) || '',
        end_time: (this.collectionDate && this.collectionDate[1]) || ''
      }).then((res) => {
        this.collectionList = res.data.data
        this.collectionTotal = res.data.meta.total
      })
    },
    getSettleChargbacksLog () {
      Promise.all([
        chargebacks.log({
          page: 1,
          limit: 5,
          client_id: this.$route.params.id,
          start_time: (this.chargebacksDate && this.chargebacksDate[0]) || '',
          end_time: (this.chargebacksDate && this.chargebacksDate[1]) || ''
        }),
        settle.log({
          page: 1,
          limit: 5,
          client_id: this.$route.params.id,
          start_time: (this.settleDate && this.settleDate[0]) || '',
          end_time: (this.settleDate && this.settleDate[1]) || ''
        }),
        collection.log({
          page: 1,
          limit: 5,
          client_id: this.$route.params.id,
          start_time: (this.collectionDate && this.collectionDate[0]) || '',
          end_time: (this.collectionDate && this.collectionDate[1]) || ''
        })
      ]).then(res => {
        this.oprList = res[0].data.data.map((item) => {
          item.methods = '扣款'
          return item
        }).concat(res[1].data.data.map((item) => {
          item.methods = '开票'
          return item
        }), res[2].data.data.map(item => {
          item.methods = +item.transfer_type ? '收款' : '付款'
          return item
        })).sort((a, b) => {
          return new Date(a.complete_time) - new Date(b.complete_time)
        })
        this.chargebacksList = res[0].data.data
        this.settleList = res[1].data.data
        this.collectionList = res[2].data.data
        this.settleList.forEach((item) => {
          this.checkWhich(item, 'init')
          item.allPrice = item.invoice_info.reduce((total, current) => {
            return total + Number(current.invoicePrice)
          }, 0)
        })
        this.chargebacksTotal = res[0].data.meta.total
        this.settleTotal = res[1].data.meta.total
        this.collectionTotal = res[2].data.meta.total
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
    cutOrderType (type) {
      this.order_type = type
      this.getList()
    },
    beforeAvatarUpload (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile (response, file, fileList) {
      this.fileUrl = 'https://file.zwyknit.com/' + response.key
    },
    beforeRemove (file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteArr.push({
          id: file.id ? file.id : null,
          file_name: file.response ? file.response.key : file.url.split('https://file.zwyknit.com/')[1]
        })
        let deleteIndex = 0
        fileList.forEach((item, index) => {
          if (file.response) {
            if (item.response && (item.response.key === file.response.key)) {
              deleteIndex = index
            }
          } else {
            if (item.url === file.url) {
              deleteIndex = index
            }
          }
        })
        fileList.splice(deleteIndex, 1)
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
    }
  },
  watch: {
    type (newVal) {
      this.group_id = ''
      if (newVal === '所有订单' || newVal === '成品加工' || newVal === '包装订购' || newVal === '物料预定购' || newVal === '销售出库' || newVal === '装箱出库') {
        this.order_type = 1
      } else {
        this.order_type = 0
      }
      this.getList(1)
    },
    checkAll (newVal) {
      this.list.forEach(item => {
        item.checked = newVal
      })
    },
    downLoadInfoArr: {
      deep: true,
      handler (newVal) {
        if (this.isDownLoading === 2) {
          const arr = this.downLoadInfoArr.filter(itemF => itemF.checked).map(itemM => itemM.isGetting)
          if (!arr.includes(1) && !arr.includes(2)) {
            this.isDownLoading = 3
          }
        }
      }
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
      } else if (this.type === '成品加工') {
        return 10
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
      if (this.log_order_code) {
        list = list.filter(itemF => itemF.order_code.find(itemFI => itemFI.order_code === this.log_order_code))
      }
      if (this.log_date && this.log_date.length === 2) {
        list = list.filter(itemF => (new Date(this.$getTime(itemF.complete_time)).getTime() >= new Date(this.log_date[0]).getTime()) && (new Date(this.log_date[1]).getTime() >= new Date(this.$getTime(itemF.complete_time)).getTime()))
      }
      let settle = list.filter(itemF => itemF.methods === '开票').map(itemM => (+itemM.settle_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      let chargebacks = list.filter(itemF => itemF.methods === '扣款').map(itemM => (+itemM.deduct_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      let collection = list.filter(itemF => itemF.methods === '收款').map(itemM => (+itemM.price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      let pay = list.filter(itemF => itemF.methods === '付款').map(itemM => (+itemM.price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
      return {
        list,
        settle,
        chargebacks,
        collection,
        pay
      }
    },
    DDXDCZCOM () {
      switch (this.type) {
        case '所有订单':
          return '订单下单产值'
        case '物料订购调取':
        case '物料预订购':
        case '包装订购':
          return '计划采购总值'
        case '织造分配':
          return '计划生产总值'
        case '物料加工':
        case '半成品加工':
        case '成品加工':
          return '计划加工总值'
        default:
          return '计划总值'
      }
    },
    SJFHCZCOM () {
      switch (this.type) {
        case '所有订单':
          return '实际发货产值'
        case '物料订购调取':
        case '物料预订购':
        case '包装订购':
          return '实际采购总值'
        case '织造分配':
          return '实际生产总值'
        case '物料加工':
        case '半成品加工':
        case '成品加工':
          return '实际加工总值'
        default:
          return '实际总值'
      }
    },
    YSKJECOM () {
      switch (this.type) {
        case '所有订单':
          return '已收款金额'
        default:
          return '已付款金额'
      }
    }
  },
  created () {
    this.init()
    this.getCountDetail()
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
