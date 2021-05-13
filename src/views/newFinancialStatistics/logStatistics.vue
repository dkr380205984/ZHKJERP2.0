<template>
  <div id="logStatistics"
    class="indexMain"
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/orderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">订单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/sampleStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">样单财务统计</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/newfinancialStatistics/materialStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">物料使用统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/settleChargebacks')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoshiyongtongji"></use>
        </svg>
        <span class="name">结算扣款统计</span>
      </div>
      <div class="cut_item"
        @click="true ? $message.warning('开发中，敬请期待。。。') : $router.push('/newfinancialStatistics/annualStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-hezuogongsicaiwutongji"></use>
        </svg>
        <span class="name">年度财务统计</span>
      </div>
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-caozuorizhitongji"></use>
        </svg>
        <span class="name">生产记录统计</span>
      </div>
    </div>
    <div class="module"
      id="orderStatistics">
      <div class="listCtn">
        <el-tabs style="width:100%;font-size:16px"
          v-model="type">
          <el-tab-pane label="物料订购调取"
            name="物料订购调取">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；纱线类型：{{materialTypeCom}}；物料名称：{{material_name || '所有'}}；订购单位：{{clientCom}}；负责小组：{{groupCom}}；仓库：{{stockCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-select class="filter_item"
                  style="width:120px"
                  v-model="order_type"
                  @change="changeRouter(1)">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-select class="filter_item"
                  style="width:120px"
                  v-model="material_type"
                  @change="changeRouter(1)">
                  <el-option label="所有类型"
                    :value="'0'"></el-option>
                  <el-option label="纱线原料"
                    :value="'1'"></el-option>
                  <el-option label="装饰辅料"
                    :value="'2'"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  :disabled="order_type === 0"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索公司名称查询"
                  :options="clientFilter.matOrder"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
                  placeholder="搜索小组名称查询"
                  :disabled="order_type === 0"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
                  v-model="stock_id"
                  @change="changeRouter(1)"
                  placeholder="搜索仓库名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in stockList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-select class="filter_item"
                  v-model="operate_user"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">计划采购总额</div>
                <div class="item">实际采购总额</div>
                <div class="item">实际采购总数</div>
                <div class="item">平均价格</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / (material_type === '2' ? 1 : 1000))) : 0}}</span>{{ material_type === '2' ? '件' :'吨'}}
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div>
              </div>
            </div>
            <v-chart v-if="type==='物料订购调取'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='物料订购调取'">
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
                  <span class="text">采购日期</span>
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
                    style="cursor: pointer;"
                    @click="$router.push(`${item.order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.order_group}}</span>
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
                  <span class="text">{{item.weight}}{{item.unit || (item.type === 1 ? 'kg' : '个')}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.reality_push_weight || 0}}{{item.unit || (item.type === 1 ? 'kg' : '个')}}</span>
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
          <el-tab-pane label="物料加工"
            name="物料加工">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；物料名称：{{material_name || '所有'}}；加工单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-select class="filter_item"
                  v-model="order_type"
                  style="width:120px"
                  @change="changeRouter(1)">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  :disabled="order_type === 0"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索加工单位名称查询"
                  :options="clientFilter.matProcess"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">计划加工总额</div>
                <div class="item">实际加工总额</div>
                <div class="item">实际加工总数</div>
                <div class="item">平均价格</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div>
              </div>
            </div>
            <v-chart v-if="type==='物料加工'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='物料加工'">
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
                  <span class="text">下单日期</span>
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
                    style="cursor: pointer;"
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
          <el-tab-pane label="物料出入库"
            name="物料出入库">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；关联单号：{{order_code || '所有'}}；物料名称：{{material_name || '所有'}}；出入库单位：{{clientCom}}；下单小组：{{groupCom}}；操作类型：{{handleTypeCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-select style="width:120px"
                  v-model="order_type"
                  @change="changeRouter(1)"
                  class="filter_item">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  :disabled="order_type === 0"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索出入库单位名称查询"
                  :options="clientFilter.matStock"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
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
                  v-model="operate_type"
                  @change="changeRouter(1)"
                  placeholder="操作类型查询"
                  clearable>
                  <el-option label="出库"
                    value="1"></el-option>
                  <el-option label="入库"
                    value="2"></el-option>
                  <el-option label="最终入库"
                    value="3"></el-option>
                  <el-option label="织造出库"
                    value="4"></el-option>
                </el-select>
                <el-select class="filter_item"
                  v-model="operate_user"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">出入库总额</div>
                <div class="item">出入库总数</div>
                <div class="item">平均价格</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div>
              </div>
            </div>
            <v-chart v-if="type==='物料出入库'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='物料出入库'">
              <div class="title">
                <div class="col flex07">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">出入库时间</span>
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
                  <span class="text">色号</span>
                </div>
                <div class="col flex07">
                  <span class="text">批/缸号</span>
                </div>
                <div class="col flex07">
                  <span class="text">价格</span>
                </div>
                <div class="col flex07">
                  <span class="text">操作类型</span>
                </div>
                <div class="col">
                  <span class="text">出入库单位</span>
                </div>
                <div class="col flex07">
                  <span class="text">数量</span>
                </div>
                <div class="col flex07">
                  <span class="text">备注</span>
                </div>
                <div class="col flex07">
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
                  <span class="text blue"
                    style="cursor: pointer;"
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
                  <span class="text">{{item.color_number}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.vat_code}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col flex07">
                  <span class="text"
                    :class="item.type === 1 ? 'blue' : item.type === 2 ? 'green' : item.type === 3 ? 'green' : 'orange'">{{item.type === 1 ? '出库' : item.type === 2 ? '入库' : item.type === 3 ? '最终入库' : '织造出库'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.total_weight}}kg</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.user_name}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='物料出入库'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.material_push.total_number)}}kg</div>
              </div>
              <div class="oneBox">
                <div class="label">平均单价:</div>
                <div class="content">{{$formatNum(statistics.material_push.avg_price)}}元</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.material_push.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="织造分配"
            name="织造分配">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；关联单号：{{order_code || '所有'}}；产品编号：{{product_code || '所有'}}；织造单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-select v-model="order_type"
                  @change="changeRouter(1)"
                  style="width:120px"
                  class="filter_item">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="changeRouter(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  :disabled="order_type === 0"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索织造单位名称查询"
                  :options="clientFilter.proWeave"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">计划分配总额</div>
                <div class="item">实际分配总额</div>
                <div class="item">实际分配总数</div>
                <div class="item">平均价格</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div>
              </div>
            </div>
            <v-chart v-if="type==='织造分配'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='织造分配'">
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
                  <span class="text">分配日期</span>
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
                    style="cursor: pointer;"
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
                    <span>{{item.product_info.product_code}}</span>
                    <br />
                    <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
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
          <el-tab-pane label="补纱日志"
            name="补纱日志">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；关联单号：{{order_code || '所有'}}；物料名称：{{material_name || '所有'}}；补纱单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-select v-model="order_type"
                  style="width:120px"
                  @change="changeRouter(1)"
                  class="filter_item">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  :disabled="order_type === 0"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索补纱单位名称查询"
                  :options="clientFilter.proWeave"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">补纱总数</div>
                <div class="item">采购总数</div>
                <!-- <div class="item">实际分配总数</div>
                <div class="item">平均价格</div> -->
              </div>
              <div class="row H58">
                <!-- <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万元
                </div> -->
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / 10000)) : 0}}</span>万
                </div>
                <!-- <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div> -->
              </div>
            </div>
            <v-chart v-if="type==='补纱日志'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='补纱日志'">
              <div class="title">
                <div class="col flex07">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">补纱日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col flex07">
                  <span class="text">负责小组</span>
                </div>
                <div class="col">
                  <span class="text">补纱单位</span>
                </div>
                <div class="col">
                  <span class="text">原料名称</span>
                </div>
                <div class="col flex07">
                  <span class="text">颜色</span>
                </div>
                <div class="col flex07">
                  <span class="text">补纱数量</span>
                </div>
                <div class="col flex07">
                  <span class="text">订购数量</span>
                </div>
                <div class="col">
                  <span class="text">承担金额</span>
                </div>
                <div class="col flex07">
                  <span class="text">备注</span>
                </div>
                <div class="col flex07">
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
                  <span class="text blue"
                    style="cursor: pointer;"
                    @click="$router.push(`${item.order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.order_group}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.replenish_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_name}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.material_color}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.need_weight}}kg</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.order_weight}}kg</span>
                </div>
                <div class="col">
                  <span v-for="(itemChild,indexChild) in item.client_info"
                    :key="indexChild">{{itemChild.client_name}}({{itemChild.percent}}元)</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.user_name}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='补纱日志'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.yarn_replenish.total_number)}}kg</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="半成品加工"
            name="半成品加工">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；关联单号：{{order_code || '所有'}}；产品编号：{{product_code || '所有'}}；加工单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-select v-model="order_type"
                  @change="changeRouter(1)"
                  class="filter_item"
                  style="width:120px">
                  <el-option label="所有日志"
                    :value="0"></el-option>
                  <el-option label="订单"
                    :value="1"></el-option>
                  <el-option label="样单"
                    :value="2"></el-option>
                </el-select>
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="changeRouter(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  :disabled="order_type === 0"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索公司名称查询"
                  :options="clientFilter.proProcess"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">加工数量</div>
                <div class="item">加工总价</div>
                <div class="item">加工均价</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price /10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.price || 0}}</span>元
                </div>
              </div>
            </div>
            <v-chart v-if="type==='半成品加工'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='半成品加工'">
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
                  <span class="text">分配时间</span>
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
                    style="cursor: pointer;"
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
                    <span>{{item.product_info.product_code}}</span>
                    <br />
                    <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
                  </zh-card-position>
                </div>
                <div class="col flex07">
                  {{item.size}}
                  <br />
                  {{item.color}}
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
          <el-tab-pane label="半成品检验收发"
            name="半成品检验收发">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；关联单号：{{order_code || '所有'}}；产品编号：{{product_code || '所有'}}；检验单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="changeRouter(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  @change="changeRouter(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索织造单位名称查询"
                  :options="clientFilter.proWeave"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="operate_user"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">检验数量</div>
                <div class="item">次品率</div>
                <div class="item">次品数量</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $toFixed(totalInfo.real_price * 100) : 0}}</span>%
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number || 0}}</span>
                </div>
              </div>
            </div>
            <v-chart v-if="type==='半成品检验收发'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='半成品检验收发'">
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
                  <span class="text">织造单位</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col flex12">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col flex07">
                  <span class="text">数量</span>
                </div>
                <div class="col flex07">
                  <span class="text">捆数</span>
                </div>
                <div class="col">
                  <span class="text">次品信息</span>
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
                  <span class="text">{{item.weave_time}}</span>
                </div>
                <div class="col blue"
                  style="cursor:pointer">
                  <span class="text"
                    @click="$router.push(`${item.order_type === 2 ? '/sample/sampleOrderDetail/' : '/order/orderDetail/'}${item.order_id}`)">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.weave_client_name}}</span>
                </div>
                <div class="col">
                  <span class="text"
                    v-html="item.semi_client_info.map(itemM=>itemM.client_name).join('<br/>')"></span>
                </div>
                <div class="col flex12">
                  <zh-card-position :data="setCardData(item.product_info)">
                    {{item.product_info.product_code}}
                    <br />
                    {{item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name}}
                  </zh-card-position>
                </div>
                <div class="col">
                  {{item.size_name}}
                  <br />
                  {{item.color_name}}
                </div>
                <div class="col flex07">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.count}}</span>
                </div>
                <div class="col">
                  <span class="green"
                    v-if="!item.shoddy_number">无次品</span>
                  <el-popover placement="right"
                    v-else
                    width="100"
                    trigger="click">
                    次品数量：{{item.shoddy_number}}
                    <br />
                    次品原因:{{item.shoddy_reason}}
                    <span class="blue"
                      slot="reference"
                      style="cursor:pointer">有次品(查看)</span>
                  </el-popover>
                </div>
                <div class="col">
                  <span class="text">{{item.desc?item.desc:'暂无'}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='半成品检验收发'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.semi_product_inspection.total_number)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="成品检验加工"
            name="成品检验加工">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；关联单号：{{order_code || '所有'}}；产品编号：{{product_code || '所有'}}；检验单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-input class="filter_item"
                  v-model="product_code"
                  @change="changeRouter(1)"
                  placeholder="输入产品编号查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  @change="changeRouter(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
                  placeholder="搜索小组名称查询"
                  clearable
                  filterable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索加工单位或人员查询"
                  :options="clientFilter.finishedProcess"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="operate_user"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">检验数量</div>
                <div class="item">次品率</div>
                <div class="item">次品数量</div>
                <!-- <div class="item">实际分配总数</div> -->
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $toFixed(totalInfo.real_price * 100) : 0}}</span>%
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number || 0}}</span>
                </div>
                <!-- <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div> -->
              </div>
            </div>
            <v-chart v-if="type==='成品检验加工'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type === '成品检验加工'">
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
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
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
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
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
            <div class="statistics"
              v-if="type === '成品检验加工'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.product_inspection.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">平均单价:</div>
                <div class="content">{{$formatNum(statistics.product_inspection.avg_price)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.product_inspection.total_price)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="包装订购"
            name="包装订购">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；关联单号：{{order_code || '所有'}}；物料名称：{{material_name || '所有'}}；订购单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-input class="filter_item"
                  v-model="order_code"
                  @change="changeRouter(1)"
                  placeholder="输入关联编号查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索包装辅料单位名称查询"
                  :options="clientFilter.matOther"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select class="filter_item"
                  v-model="group_id"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <div class="row">
                <div class="item">计划采购总额</div>
                <div class="item">实际采购总额</div>
                <div class="item">实际采购总数</div>
                <div class="item">平均价格</div>
              </div>
              <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div>
              </div>
            </div>
            <v-chart v-if="type==='包装订购'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='包装订购'">
              <div class="title">
                <div class="col flex07">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">下单日期</span>
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
                  <span class="text">交货日期</span>
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
                    style="cursor: pointer;"
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
                  <span class="text">{{item.deliver_time ? $getTime(item.deliver_time) : '/'}}</span>
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
          <el-tab-pane label="实际装箱"
            name="实际装箱">
            <div class="filterCtn2">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="filter_line">
                  <el-input class="filter_item"
                    style="width:180px"
                    v-model="product_code"
                    @change="changeRouter(1)"
                    placeholder="输入产品编号查询">
                  </el-input>
                  <el-input class="filter_item"
                    style="width:180px"
                    v-model="order_code"
                    @change="changeRouter(1)"
                    placeholder="输入关联编号查询">
                  </el-input>
                  <el-select class="filter_item"
                    v-model="group_id"
                    @change="changeRouter(1)"
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
                    @change="changeRouter(1)"
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
                  <div class="resetBtn"
                    @click="reset">重置</div>
                </div>
              </div>
            </div>
            <div class="list"
              v-if="type==='实际装箱'">
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
                  <span class="text">产品信息</span>
                </div>
                <div class="col flex07">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col flex07">
                  <span class="text">装箱总数</span>
                </div>
                <div class="col flex07">
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
                  <span class="text">{{item.create_time.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text blue"
                    style="cursor: pointer;"
                    @click="$router.push(`/order/orderDetail/${item.order_id}`)">{{item.order_code}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.group_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.product_info.product_code}}
                    <br />
                    {{item.product_info.category_name}}/{{item.product_info.type_name}}/{{item.product_info.style_name}}
                  </span>
                </div>
                <div class="col flex07">
                  {{item.size_name}}
                  <br />
                  {{item.color_name}}
                </div>
                <div class="col flex07">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col flex07">
                  <span class="text">{{item.user_name}}</span>
                </div>
              </div>
            </div>
            <div class="statistics"
              v-if="type==='实际装箱'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.pack_real.total_number)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="销售出库"
            name="销售出库">
            <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  v-model="product_code"
                  @change="changeRouter(1)"
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
            </div>
            <div class="list"
              v-if="type==='销售出库'">
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
          <el-tab-pane label="预订购入库"
            name="预订购入库">
            <div class="bgGray"
              style="margin-bottom:8px">当前统计默认值：日期：{{dateCom}}；订单类型：{{orderTypeCom}}；物料名称：{{material_name || '所有'}}；加工单位：{{clientCom}}；下单小组：{{groupCom}}；创建人：{{userCom}}。</div>
            <div class="tableCtn">
              <div class="filterCtn">
                <el-input class="filter_item"
                  v-model="material_name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-cascader v-model="client_id"
                  class="filter_item"
                  :show-all-levels='false'
                  placeholder="搜索物料预定购单位名称查询"
                  :options="clientFilter.matOrder"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  @change="changeRouter(1)"
                  filterable></el-cascader>
                <el-select v-model="stock_id"
                  class="filter_item"
                  @change="changeRouter(1)"
                  placeholder="筛选入库仓库"
                  clearable>
                  <el-option v-for="(item,index) in stockList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="resetBtn"
                  @click="reset">重置</div>
              </div>
              <!-- <div class="row">
                <div class="item">计划加工总额</div>
                <div class="item">实际加工总额</div>
                <div class="item">实际加工总数</div>
                <div class="item">平均价格</div>
              </div> -->
              <!-- <div class="row H58">
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.plan_price ? $formatNum($toFixed(totalInfo.plan_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_price ? $formatNum($toFixed(totalInfo.real_price / 10000)) : 0}}</span>万元
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="blue"
                    style="font-size:28px">{{totalInfo.real_number ? $formatNum($toFixed(totalInfo.real_number / 10000)) : 0}}</span>万
                </div>
                <div class="item"
                  style="font-size:14px">
                  <span class="green"
                    style="font-size:28px">{{$toFixed(totalInfo.price || 0)}}</span>元
                </div>
              </div> -->
            </div>
            <v-chart v-if="type==='预订购入库'"
              class="echarts_bar_container"
              :options="barOption" />
            <div class="list"
              v-if="type==='预订购入库'">
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
                  <span class="text">物料颜色</span>
                </div>
                <div class="col right">
                  <span class="text">物料价格(元/kg)</span>
                </div>
                <div class="col right">
                  <span class="text">入库数量(kg)</span>
                </div>
                <div class="col">
                  <span class="text">入库仓库</span>
                </div>
                <div class="col center">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">操作人</span>
                </div>
                <div class="col">
                  <span class="text">操作时间</span>
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
                  <span class="text">{{$getTime(item.order_time)}}</span>
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
                <div class="col right">
                  <span class="text">{{item.price}}</span>
                </div>
                <div class="col right">
                  <span class="text">{{item.weight}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.stock_name}}</span>
                </div>
                <div class="col center">
                  <span class="text">
                    <el-popover placement="top-start"
                      v-if="item.desc"
                      title="备注"
                      width="200"
                      trigger="hover"
                      :content="item.desc">
                      <div class="btn noBorder"
                        style="padding:0;margin:0"
                        slot="reference">查看</div>
                    </el-popover>
                  </span>
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
              v-if="type==='预订购入库'">
              <div class="oneBox">
                <div class="label">总数量:</div>
                <div class="content">{{$formatNum(statistics.material_order.total_number)}}kg</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.material_order.total_price)}}元</div>
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
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 导出月度或年度报表数据窗口 -->
    <div class="popup"
      v-if="importType">
      <div class="main"
        style="width:300px">
        <div class="title">
          {{`选择需要导出${(importType === 'month' && '月度') || ''}${(importType === 'year' && '年度') || ''}报表的${(importType === 'month' && '月份') || ''}${(importType === 'year' && '年份') || ''}`}}
          <i class="el-icon-close"
            @click="importType = null"></i>
        </div>
        <div class="content">
          <div class="row">
            <el-date-picker v-model="selectImportDate"
              :type="importType || 'month'"
              :placeholder="`选择${importType === 'year' ? '年' : '月'}`"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="importType = null">取消</div>
          <div class="btn btnBlue"
            @click="importStart">开始</div>
        </div>
      </div>
    </div>
    <!-- 导所有数据蒙层 -->
    <div class="popup"
      v-if="downloading"
      style="display:flex;flex-direction:column;align-items:center;justify-content: center;color:#1A95FF;font-size:40px">
      <span>当前进度：{{propgress || 0}}%
        <span class="el-icon-loading"></span></span>
      <span>正在下载，请勿刷新页面或关闭页面</span>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnBlue"
            @click="importType = 'year',selectImportDate = new Date()">导出年度报表</div>
          <div class="btn btnBlue"
            @click="importType = 'month',selectImportDate = new Date()">导出月度报表</div>
          <div class="btn btnBlue"
            @click="downloadAllLog()">导出所有数据</div>
          <div class="btn btnBlue"
            @click="downloadLog">导出勾选数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { downloadExcel } from '@/assets/js/common.js'
import { newFinance, materialOrder, group, materialManage, materialProcess, materialStock, weave, replenish, processing, inspection, packPlan, client, auth, process, stock, receiveDispatch, staff } from '@/assets/js/api.js'
export default {
  data () {
    return {
      barOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
          // formatter: '{b0}<br />{a0}：{c0} <br />{a1}：{c1} 万元'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          left: '10%',
          data: ['采购总额', '采购数量']
        },
        xAxis: {
          type: 'category',
          data: [],
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [{
          type: 'value',
          name: '采购总额',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value} 万元'
          }
        },
        {
          type: 'value',
          name: '采购数量',
          min: 0,
          max: 5000,
          interval: 1000,
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [
          {
            name: '采购总额',
            type: 'bar',
            data: [],
            itemStyle: {
              color: '#1F78B4'
            }
          },
          {
            name: '采购数量',
            type: 'line',
            data: [],
            yAxisIndex: 1,
            itemStyle: {
              color: '#25B41F'
            }
          }
        ]
      },
      totalInfo: {},
      loading: true,
      loadingStatistics: true,
      list: [],
      checkAll: false,
      pages: 1,
      total: 0,
      order_code: '',
      order_type: 1,
      name: '',
      client_id: '',
      product_code: '',
      production_type: '', // 产品入库操作类型
      operate_user: '',
      material_name: '', // 原料/包装辅料名称
      material_type: '',
      date: [],
      clientFilter: {
        matOrder: [],
        matProcess: [],
        matStock: [],
        proWeave: [],
        proProcess: [],
        matOther: [],
        finishedProcess: []
      },
      stockList: [],
      stock_id: '',
      clientList: [],
      authList: [],
      processList: [],
      type: '物料订购调取',
      statistics: {
        material_order: {
          avg_price: 0,
          total_price: 0,
          total_weight: 0
        },
        material_process: {
          avg_price: 0,
          total_price: 0,
          total_weight: 0
        },
        material_push: {
          total_number: 0,
          avg_price: 0,
          total_price: 0
        },
        production_weave: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        yarn_replenish: {
          total_number: 0
        },
        semi_product: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        product_pop: {
          total_number: 0
        },
        product_push: {
          total_number: 0
        },
        product_inspection: {
          total_number: 0,
          total_price: 0,
          avg_price: 0
        },
        semi_product_inspection: {
          total_number: 0,
          rejects_number: 0
        },
        pack_order: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        pack_real: {
          total_number: 0,
          total_box: 0
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
      operate_type: '',
      downloading: '',
      propgress: 0,
      // 2020-09-01修改新增数据
      openHiddleFilter: false,
      group_id: '',
      groupList: [],
      // 导出类型
      importType: null,
      selectImportDate: '',
      pickerOptions: {
        disabledDate: (date) => {
          return !(new Date(date).getTime() < new Date().getTime())
        }
      }
    }
  },
  computed: {
    checkList () {
      return this.list.filter((item) => item.checked)
    },
    dateCom () {
      if (this.date) {
        const dateArr = this.date.map(itemM => itemM.split('-'))
        return dateArr.map(itemM => {
          return `${itemM[0]}年${itemM[1]}月${itemM[2]}日`
        }).join('-')
      }
      const nowDate = this.$getTime().split('-')
      return `${nowDate[0]}年1月1日-${nowDate[0]}年${nowDate[1]}月${nowDate[2]}日`
    },
    orderTypeCom () {
      switch (this.order_type) {
        case 0:
          return '所有'
        case 1:
          return '订单'
        case 2:
          return '样单'
        default:
          return '未知'
      }
    },
    materialTypeCom () {
      switch (this.material_type) {
        case '0':
          return '所有'
        case '1':
          return '纱线原料'
        case '2':
          return '装饰辅料'
        default:
          return '未知'
      }
    },
    clientCom () {
      let clientKey = null
      switch (this.type) {
        case '物料订购调取':
          clientKey = 'matOrder'
          break
        case '物料加工':
          clientKey = 'matProcess'
          break
        case '物料出入库':
          clientKey = 'matStock'
          break
        case '织造分配':
          clientKey = 'proWeave'
          break
        case '补纱日志':
          clientKey = 'proWeave'
          break
        case '成品检验加工':
          clientKey = 'finishedProcess'
          break
        case '包装订购':
          clientKey = 'matOther'
          break
        case '半成品加工':
          clientKey = 'proProcess'
          break
        case '半成品检验收发':
          clientKey = 'proWeave'
          break
        case '预订购入库':
          clientKey = 'matProcess'
          break
        default:
          break
      }
      if (this.client_id && clientKey) {
        const finded = this.clientFilter[clientKey].find(itemF => itemF.value === this.client_id[0])
        const finded2 = finded ? finded.children.find(itemF => itemF.value === this.client_id[1]) : false
        return (finded && finded2 && `${finded.label}/${finded2.label}`) || '未知'
      }
      return '所有'
    },
    groupCom () {
      if (this.group_id) {
        const finded = this.groupList.find(itemF => itemF.id === this.group_id)
        return (finded && finded.name) || '未知'
      }
      return '所有'
    },
    stockCom () {
      if (this.stock_id) {
        const finded = this.stockList.find(itemF => itemF.id === this.stock_id)
        return (finded && finded.name) || '未知'
      }
      return '所有'
    },
    userCom () {
      if (this.operate_user) {
        const finded = this.authList.find(itemF => itemF.id === this.operate_user)
        return (finded && finded.name) || '未知'
      }
      return '所有'
    },
    handleTypeCom () {
      if (this.operate_type) {
        switch (this.operate_type) {
          case '1':
            return '出库'
          case '2':
            return '入库'
          case '3':
            return '最终入库'
          case '4':
            return '织造出库'
          default:
            return '未知'
        }
      }
      return '所有'
    }
  },
  watch: {
    checkAll (newVal) {
      this.list.forEach((item) => {
        item.checked = newVal
      })
    },
    type (newVal) {
      this.client_id = ''
      this.product_code = ''
      this.product_type = ''
      this.order_type = 0
      this.order_code = ''
      this.operate_user = ''
      this.material_name = ''
      this.group_id = ''
      this.operate_type = ''
      this.stock_id = ''
      this.material_type = '0'
      this.date = ''
      this.openHiddleFilter = false
      this.changeRouter(1)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getBarEchartsInfo(this.type)
      this.getList()
    }
  },
  methods: {
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
    // 更新筛选条件
    getFilters () {
      let params = this.$route.query
      this.pages = Number(params.page) || 1
      if (params.date && params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = [`${new Date().getFullYear()}-01-01`, this.$getTime()]
      }
      this.client_id = (params.client_id && params.client_id.split(',')) || ''
      this.product_code = params.product_code || ''
      this.order_type = (params.order_type && Number(params.order_type)) || 0
      this.order_code = params.order_code || ''
      this.product_type = params.product_type || ''
      this.operate_user = params.operate_user || ''
      this.material_name = params.material_name || ''
      this.stock_id = (params.stock_id && Number(params.stock_id)) || ''
      this.operate_type = params.operate_type || ''
      this.type = params.type || '物料订购调取'
      this.material_type = params.material_type || '0'
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/newfinancialStatistics/logStatistics?page=' + pages + '&type=' + this.type + '&date=' + this.date + '&client_id=' + this.client_id + '&product_code=' + this.product_code + '&order_type=' + this.order_type + '&order_code=' + this.order_code + '&production_type=' + this.production_type + '&operate_user=' + this.operate_user + '&material_name=' + this.material_name + '&stock_id=' + this.stock_id + '&operate_type=' + this.operate_type + '&group_id=' + this.group_id + '&material_type=' + (this.material_type || 0))
    },
    reset () {
      this.$router.push('/newfinancialStatistics/logStatistics')
    },
    getList () {
      this.checkAll = false
      this.loading = true
      this.loadingStatistics = true
      this.list = []
      if (this.type === '物料订购调取') {
        materialManage.detail({
          order_id: null,
          limit: 10,
          page: this.pages,
          stock_id: this.stock_id,
          order_type: this.order_type,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id,
          type: this.material_type || null
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.material_order = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_weight: res.data.total_weight
          }
          this.loading = false
        })
      } else if (this.type === '物料加工') {
        materialProcess.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.material_process = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_weight: res.data.total_weight
          }
          this.loading = false
        })
      } else if (this.type === '物料出入库') {
        materialStock.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[2],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          type: this.operate_type,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.material_push = {
            total_number: res.data.total_number,
            avg_price: res.data.avg_price,
            total_price: res.data.total_price
          }
          this.loading = false
        })
      } else if (this.type === '织造分配') {
        weave.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.production_weave = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_number: res.data.total_number
          }
          this.loading = false
        })
      } else if (this.type === '补纱日志') {
        replenish.list({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.yarn_replenish = {
            total_number: res.data.total_number
          }
          this.loading = false
        })
      } else if (this.type === '半成品加工') {
        processing.detail({
          order_type: this.order_type,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.semi_product = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_number: res.data.total_number
          }
          this.loading = false
        })
      } else if (this.type === '半成品检验收发') {
        receiveDispatch.allDetail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.semi_product_inspection = {
            total_number: res.data.total_number
          }
          this.loading = false
        })
      } else if (this.type === '成品检验加工') {
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
          client_id: (this.client_id && this.client_id[0] !== '所有人员' && this.client_id[1]) || '',
          inspection_user: (this.client_id && this.client_id[0] === '所有人员' && this.client_id[1]) || ''
        }).then((res) => {
          this.list = res.data.data.map(item => {
            if (item.rejects_info) {
              item.rejects_info = JSON.parse(item.rejects_info)
              if (!item.rejects_info.number) {
                item.rejects_info = 0
              }
            }
            return item
          })
          this.total = res.data.meta.total
          this.statistics.product_inspection = {
            total_number: res.data.total_number,
            total_price: res.data.total_price,
            avg_price: res.data.avg_price
          }
          this.loading = false
        })
      } else if (this.type === '包装订购') {
        packPlan.packOrderLog({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.pack_order = {
            avg_price: res.data.avg_price,
            total_price: res.data.total_price,
            total_number: res.data.total_number
          }
          this.loading = false
        })
      } else if (this.type === '实际装箱') {
        packPlan.packActualLog({
          // order_type: null,
          // order_id: null,
          limit: 10,
          page: this.pages,
          order_code: this.order_code,
          product_code: this.product_code,
          // client_id: this.client_id,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.pack_real = {
            total_number: res.data.total_number,
            total_box: res.data.total_box
          }
          this.loading = false
        })
      } else if (this.type === '销售出库') {
        packPlan.outMarketLog({
          limit: 10,
          page: this.pages,
          product_code: this.product_code,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.out_market = {
            avg_price: res.data.avg_price,
            total_number: res.data.total_number,
            total_price: res.data.total_price
          }
          this.loading = false
        })
      } else if (this.type === '预订购入库') {
        materialOrder.allLog({
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
          stock_id: this.stock_id,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.statistics.material_order = {
            total_number: res.data.total_weight,
            total_price: res.data.total_price
          }
          this.loading = false
        })
      }
    },
    getBarEchartsInfo (type = '物料订购调取') {
      switch (type) {
        case '物料订购调取':
          newFinance.materialOrder({
            order_type: this.order_type,
            type: this.material_type || null,
            material_name: this.material_name,
            stock_id: this.stock_id,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            group_id: this.group_id
          }).then(res => {
            if (res.data.status !== false) {
              const isRaw = this.material_type === '2'
              this.totalInfo = {
                plan_price: res.data.data.total_price,
                real_price: res.data.data.reality_price,
                real_number: res.data.data.reality_weight,
                price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.reality_price - now.reality_price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                reality_weight: this.$toFixed(clientData.map(itemM => +itemM.reality_weight || 0).reduce((total, current) => total + current, 0)),
                reality_price: this.$toFixed(clientData.map(itemM => +itemM.reality_price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['采购总额', '采购数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => (isRaw ? +itemM.reality_weight : this.$toFixed(+itemM.reality_weight / 1000)) || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => (isRaw ? +itemM.reality_weight : this.$toFixed(+itemM.reality_weight / 1000)) || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '采购总额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '采购数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} ' + (isRaw ? '件' : '吨')
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '采购总额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '采购数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => (isRaw ? +itemM.reality_weight : this.$toFixed(+itemM.reality_weight / 1000))),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '物料加工':
          newFinance.materialProcess({
            order_type: this.order_type,
            order_code: this.order_code,
            material_name: this.material_name,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                plan_price: res.data.data.total_price,
                real_price: res.data.data.reality_price,
                real_number: res.data.data.reality_weight,
                price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.reality_price - now.reality_price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                reality_weight: this.$toFixed(clientData.map(itemM => +itemM.reality_weight || 0).reduce((total, current) => total + current, 0)),
                reality_price: this.$toFixed(clientData.map(itemM => +itemM.reality_price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['加工总额', '加工数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const peightMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_weight / 10000) || 0))
              const peightMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_weight / 10000) || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '加工总额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '加工数量',
                  min: (peightMin && peightMin < 0) ? peightMin : 0,
                  max: Math.ceil(Math.ceil(peightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(peightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '加工总额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '加工数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_weight / 10000)),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '物料出入库':
          newFinance.materialStock({
            order_type: this.order_type,
            order_code: this.order_code,
            material_name: this.material_name,
            client_id: this.client_id && this.client_id[2],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            type: this.operate_type,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                // plan_process_price: res.data.data.total_price,
                real_price: res.data.data.total_price,
                real_number: res.data.data.total_weight,
                price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.total_price - now.total_price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                total_weight: this.$toFixed(clientData.map(itemM => +itemM.total_weight || 0).reduce((total, current) => total + current, 0)),
                total_price: this.$toFixed(clientData.map(itemM => +itemM.total_price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['出入库总额', '出入库数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_price / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_weight / 10000) || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_weight / 10000) || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '出入库总额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '出入库数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '出入库总额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '出入库数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_weight / 10000)),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '织造分配':
          newFinance.weave({
            order_type: this.order_type,
            order_code: this.order_code,
            product_code: this.product_code,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                plan_price: res.data.data.total_price,
                real_price: res.data.data.reality_price,
                real_number: res.data.data.reality_number,
                price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.reality_price - now.reality_price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                reality_number: this.$toFixed(clientData.map(itemM => +itemM.reality_number || 0).reduce((total, current) => total + current, 0)),
                reality_price: this.$toFixed(clientData.map(itemM => +itemM.reality_price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['分配总额', '分配数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_number / 10000) || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_number / 10000) || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '分配总额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '分配数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '分配总额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '分配数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_number / 10000)),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '补纱日志':
          newFinance.replenish({
            order_type: this.order_type,
            order_code: this.order_code,
            material_name: this.material_name,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                // plan_price: res.data.data.total_price,
                real_price: res.data.data.need_weight,
                real_number: res.data.data.order_weight
                // price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.need_weight - now.need_weight
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                need_weight: this.$toFixed(clientData.map(itemM => +itemM.need_weight || 0).reduce((total, current) => total + current, 0)),
                order_weight: this.$toFixed(clientData.map(itemM => +itemM.order_weight || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['补纱数量', '采购数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => +itemM.need_weight || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => +itemM.need_weight || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => +itemM.order_weight || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => +itemM.order_weight || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '补纱数量',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} KG'
                  }
                },
                {
                  type: 'value',
                  name: '采购数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} KG'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '补纱数量',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => +itemM.need_weight),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '采购数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => +itemM.order_weight),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '半成品加工':
          newFinance.semiProcess({
            order_type: this.order_type,
            order_code: this.order_code,
            product_code: this.product_code,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                plan_price: res.data.data.number, // 数量
                real_price: res.data.data.total_price, // 总价
                // real_number: res.data.data.shoddy_number// 次品数量
                price: res.data.data.price // 均价
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.total_price - now.total_price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                number: this.$toFixed(clientData.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0)),
                total_price: this.$toFixed(clientData.map(itemM => +itemM.total_price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['加工金额', '加工数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_price / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => +itemM.number || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => +itemM.number || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '加工金额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '加工数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value}'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '加工金额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.total_price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '加工数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => +itemM.number),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '半成品检验收发':
          newFinance.semiInspection({
            order_code: this.order_code,
            product_code: this.product_code,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                plan_price: res.data.data.number, // 检验数量
                real_price: res.data.data.shoddy_rate, // 次品率
                real_number: res.data.data.shoddy_number// 次品数量
                // price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.number - now.number
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                number: this.$toFixed(clientData.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0)),
                shoddy_number: this.$toFixed(clientData.map(itemM => +itemM.shoddy_number || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['检验数量', '次品数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.number / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.number / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => +itemM.shoddy_number || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => +itemM.shoddy_number || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '检验数量',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                },
                {
                  type: 'value',
                  name: '次品数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 件'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '检验数量',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.number / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '次品数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => +itemM.shoddy_number),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '成品检验加工':
          newFinance.inspection({
            order_code: this.order_code,
            product_code: this.product_code,
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id,
            client_id: (this.client_id && this.client_id[0] !== '所有人员' && this.client_id[1]) || '',
            inspection_user: (this.client_id && this.client_id[0] === '所有人员' && this.client_id[1]) || ''
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                plan_price: res.data.data.number, // 检验数量
                real_price: res.data.data.shoddy_rate, // 次品率
                real_number: res.data.data.shoddy_number// 次品数量
                // price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.number - now.number
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                number: this.$toFixed(clientData.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0)),
                shoddy_number: this.$toFixed(clientData.map(itemM => +itemM.shoddy_number || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['检验数量', '次品数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.number / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.number / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => +itemM.shoddy_number || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => +itemM.shoddy_number || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '检验数量',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                },
                {
                  type: 'value',
                  name: '次品数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 件'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '检验数量',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.number / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '次品数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => +itemM.shoddy_number),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '包装订购':
          newFinance.pack({
            order_code: this.order_code,
            material_name: this.material_name,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            operate_user: this.operate_user,
            group_id: this.group_id
          }).then(res => {
            if (res.data.data.status !== false) {
              this.totalInfo = {
                plan_price: res.data.data.total_price,
                real_price: res.data.data.reality_price,
                real_number: res.data.data.reality_number,
                price: res.data.data.price
              }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.reality_price - now.reality_price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                reality_number: this.$toFixed(clientData.map(itemM => +itemM.reality_number || 0).reduce((total, current) => total + current, 0)),
                reality_price: this.$toFixed(clientData.map(itemM => +itemM.reality_price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['采购金额', '采购数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_number / 10000) || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_number / 10000) || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '采购金额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '采购数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '采购金额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '采购数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.reality_number / 10000)),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        case '预订购入库':
          newFinance.bookingMaterial({
            material_name: this.material_name,
            client_id: this.client_id && this.client_id[1],
            start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
            end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
            stock_id: this.stock_id
          }).then(res => {
            if (res.data.data.status !== false) {
              // this.totalInfo = {
              //   plan_price: res.data.data.total_price,
              //   real_price: res.data.data.reality_price,
              //   real_number: res.data.data.reality_number,
              //   price: res.data.data.price
              // }
              const clientData = res.data.data.clients.sort((now, next) => {
                return next.price - now.price
              })
              const beforeTwentieth = clientData.splice(0, 20).concat({
                name: '其它',
                action_weight: this.$toFixed(clientData.map(itemM => +itemM.action_weight || 0).reduce((total, current) => total + current, 0)),
                price: this.$toFixed(clientData.map(itemM => +itemM.price || 0).reduce((total, current) => total + current, 0))
              })
              this.barOption.legend.data = ['采购金额', '采购数量']
              this.barOption.xAxis.data = beforeTwentieth.map(itemM => itemM.name)
              const priceMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.price / 10000) || 0))
              const priceMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.price / 10000) || 0))
              const weightMin = Math.min(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.action_weight / 10000) || 0))
              const weightMax = Math.max(...beforeTwentieth.map(itemM => this.$toFixed(+itemM.action_weight / 10000) || 0))
              this.barOption.yAxis = [
                {
                  type: 'value',
                  name: '采购金额',
                  min: (priceMin && priceMin < 0) ? priceMin : 0,
                  max: Math.ceil(Math.ceil(priceMax) / 5) * 5 || 5,
                  interval: Math.ceil(Math.ceil(priceMax) / 5) || 1,
                  axisLabel: {
                    formatter: '{value} 万元'
                  }
                },
                {
                  type: 'value',
                  name: '采购数量',
                  min: (weightMin && weightMin < 0) ? weightMin : 0,
                  max: Math.ceil(Math.ceil(weightMax) / 5) * 5,
                  interval: Math.ceil(Math.ceil(weightMax) / 5),
                  axisLabel: {
                    formatter: '{value} 万'
                  }
                }
              ]
              this.barOption.series = [
                {
                  name: '采购金额',
                  type: 'bar',
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.price / 10000)),
                  itemStyle: {
                    color: '#1F78B4'
                  }
                },
                {
                  name: '采购数量',
                  type: 'line',
                  yAxisIndex: 1,
                  data: beforeTwentieth.map(itemM => this.$toFixed(+itemM.action_weight / 10000)),
                  itemStyle: {
                    color: '#25B41F'
                  }
                }
              ]
            }
          })
          break
        default:
          console.error(`not find type of "${type}"`)
          break
      }
    },
    downloadLog () {
      if (this.checkList.length === 0) {
        this.$message.error('请选择需要打印的日志')
        return
      }
      if (this.type === '物料订购调取') {
        let data = this.checkList.map(item => {
          item.type_source_name = (item.type_source === 2 ? '订购' : '调取') + (item.replenish_id ? '/补纱' : '')
          item.total_price = this.$toFixed(item.price * (Number(item.reality_push_weight) || item.weight))
          return item
        })
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
        ])
      } else if (this.type === '物料加工') {
        let data = this.checkList.map(item => {
          item.total_price = this.$toFixed(item.price * (Number(item.reality_push_weight) || item.weight))
          return item
        })
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
        ])
      } else if (this.type === '物料出入库') {
        let data = this.checkList.map(item => {
          item.type_name = item.type === 1 ? '出库' : item.type === 2 ? '入库' : '最终入库'
          return item
        })
        downloadExcel(data, [
          { title: '出入库时间', key: 'complete_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '物料名称', key: 'material_name' },
          { title: '属性', key: 'material_color' },
          { title: '数量', key: 'total_weight' },
          { title: '操作类型', key: 'type_name' },
          { title: '出入库单位', key: 'client_name' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' }
        ])
      } else if (this.type === '织造分配') {
        let data = this.checkList.map((item) => {
          item.product_code = item.product_info.product_code
          item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
          item.product_title = item.product_info.product_title
          item.sizeColor = item.size_name + '/' + item.color_name
          let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
          item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
          item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
          item.total_price = this.$toFixed(item.price * (Number(item.reality_number) || item.number))
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'created_at' },
          { title: '关联单号', key: 'order_code' },
          { title: '出入库单位', key: 'client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_types' },
          { title: '产品名称', key: 'product_title' },
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
        ])
      } else if (this.type === '补纱日志') {
        let data = this.checkList
        downloadExcel(data, [
          { title: '补纱日期', key: 'created_at' },
          { title: '关联单号', key: 'order_code' },
          { title: '补纱单位', key: 'replenish_name' },
          { title: '原料名称', key: 'material_name' },
          { title: '颜色', key: 'material_color' },
          { title: '补纱数量', key: 'need_weight' },
          { title: '订购数量', key: 'order_weight' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' }
        ])
      } else if (this.type === '半成品加工') {
        let data = this.checkList.map((item) => {
          item.product_code = item.product_info.code
          item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
          item.product_title = item.product_info.product_title
          item.sizeColor = item.size + '/' + item.color
          let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => itemF.size_name === item.size)) || false
          item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
          item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
          item.total_price = this.$toFixed(item.price * (Number(item.reality_number) || item.number))
          item.part = ((item.part_assign && item.part_assign.map((item) => item.name).join('/')) || '')
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'created_at' },
          { title: '关联单号', key: 'order_code' },
          { title: '出入库单位', key: 'client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_types' },
          { title: '产品名称', key: 'product_title' },
          { title: '尺码颜色', key: 'sizeColor' },
          { title: '尺码信息', key: 'size_info' },
          { title: '克重', key: 'size_weight' },
          { title: '所需辅料', key: 'part' },
          { title: '单价(元)', key: 'price' },
          { title: '分配数量', key: 'number' },
          { title: '实际数量', key: 'reality_number' },
          { title: '总价(元)', key: 'total_price' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' },
          { title: '分配日期', key: 'complete' }
        ])
      } else if (this.type === '织造入库') {
        let data = this.checkList.map((item) => {
          item.product_code = item.product_code.code
          item.sizeColor = item.size_name + '/' + item.color_name
          return item
        })
        downloadExcel(data, [
          { title: '入库日期', key: 'complete_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '单位名称', key: 'client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '尺码颜色', key: 'sizeColor' },
          { title: '入库类型', key: 'production_type' },
          { title: '数量', key: 'number' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' }
        ])
      } else if (this.type === '半成品出入库') {
        let data = this.checkList.map((item) => {
          item.product_code = item.product_code.code
          item.sizeColor = item.size_name + '/' + item.color_name
          return item
        })
        downloadExcel(data, [
          { title: '出库日期', key: 'complete_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '单位名称', key: 'client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '尺码颜色', key: 'sizeColor' },
          { title: '出库类型', key: 'production_type' },
          { title: '数量', key: 'number' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' }
        ])
      } else if (this.type === '半成品检验收发') {
        let data = this.checkList.map(item => {
          item.process_client_name = item.semi_client_info.map(itemM => itemM.client_name).join('<br />')
          item.product_code = item.product_info.product_code
          item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
          item.product_title = item.product_info.product_title
          let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
          item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
          item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'weave_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '织造单位', key: 'weave_client_name' },
          { title: '加工单位', key: 'process_client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_types' },
          { title: '产品名称', key: 'product_title' },
          { title: '尺码', key: 'size_name' },
          { title: '尺码信息', key: 'size_info' },
          { title: '克重', key: 'size_weight' },
          { title: '颜色', key: 'color_name' },
          { title: '数量', key: 'number' },
          { title: '捆数', key: 'count' },
          { title: '次品数量', key: 'shoddy_number' },
          { title: '次品原因', key: 'shoddy_reason' },
          { title: '备注', key: 'desc' }
        ])
      } else if (this.type === '成品检验加工') {
        let data = this.checkList.map(item => {
          item.client_or_user_name = item.client_name || item.inspection_user
          item.product_code = item.product_info.product_code
          let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
          item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
          item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
          item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
          item.product_title = item.product_info.product_title
          if (item.rejects_info !== 0) {
            item.rejects_number = item.rejects_info.number
            item.rejects_infos = item.rejects_info.reason ? item.rejects_info.reason.join(',') : ''
          } else {
            item.rejects_number = 0
            item.rejects_infos = ''
          }
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'complete_time' },
          { title: '加工类型', key: 'product_flow' },
          { titla: '加工单位/人员', key: 'client_or_user_name' },
          { title: '关联单号', key: 'order_code' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_types' },
          { title: '产品名称', key: 'product_title' },
          { title: '尺码', key: 'size_name' },
          { title: '尺码信息', key: 'size_info' },
          { title: '克重', key: 'size_weight' },
          { title: '颜色', key: 'color_name' },
          { title: '数量', key: 'number' },
          { title: '次品数量', key: 'rejects_number' },
          { title: '次品原因', key: 'rejects_infos' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' }
        ])
      } else if (this.type === '包装订购') {
        let data = this.checkList.map(item => {
          item.pack_size = item.price_square ? JSON.parse(item.size).join('*') : item.pack_size
          item.total_price = this.$toFixed((item.price * (Number(item.reality_number) || Number(item.number))))
          return item
        })
        downloadExcel(data, [
          { title: '采购日期', key: 'order_time' },
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
        ])
      } else if (this.type === '实际装箱') {
        let data = this.checkList.map(item => {
          item.product_code = item.product_info.product_code
          item.product_type = item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name
          // let flag = (item.product_info && item.product_info.size_measurement && item.product_info.size_measurement.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
          // item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
          // item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'create_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_type' },
          { title: '尺码', key: 'size_name' },
          // { title: '尺码信息', key: 'size_info' },
          // { title: '克重', key: 'size_weight' },
          { title: '颜色', key: 'color_name' },
          { title: '实际装箱数', key: 'number' },
          { title: '箱数', key: 'total_box' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' }
        ])
      } else if (this.type === '装箱出库') {
        let data = this.checkList
        downloadExcel(data, [
          { title: '创建日期', key: 'created_at' },
          { title: '关联单号', key: 'order_code' },
          { title: '运输单位', key: 'client_name' },
          { title: '运输箱数', key: 'number' },
          { title: '立方数(m³)', key: 'cubic_number' },
          { title: '单价(m³/元)', key: 'price' },
          { title: '总价(元)', key: 'total_price' },
          { title: '出口国家', key: 'country' },
          { title: '运输地址', key: 'address' },
          { title: '港口', key: 'port' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' }
        ])
      } else if (this.type === '销售出库') {
        let data = this.checkList.map(item => {
          item.category_type = [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/')
          return item
        })
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
        ])
      } else if (this.type === '预订购入库') {
        let data = this.checkList
        downloadExcel(data, [
          { title: '订购日期', key: 'order_time' },
          { title: '纱线单位', key: 'client_name' },
          { title: '物料名称', key: 'material_name' },
          { title: '物料颜色', key: 'color_code' },
          { title: '物料价格', key: 'price' },
          { title: '入库数量', key: 'weight' },
          { title: '入库仓库', key: 'stock_name' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' },
          { title: '操作时间', key: 'create_time' }
        ])
      } else {
        this.$message.warning(`未找到“${this.type}”相关数据`)
      }
    },
    downloadAllLog (data = [], total, page = 1, limit = 50, startDate, endDate) {
      this.downloading = true
      this.propgress = this.$toFixed(page / Math.ceil(total / limit) * 100)
      if (this.type === '物料订购调取') {
        materialManage.detail({
          order_id: null,
          limit: limit,
          page: page,
          stock_id: this.stock_id,
          order_type: this.order_type,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
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
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '物料加工') {
        materialProcess.detail({
          order_type: this.order_type,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
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
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '物料出入库') {
        materialStock.detail({
          order_type: this.order_type,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[2],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          type: this.operate_type,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map(item => {
            item.type_name = item.type === 1 ? '出库' : item.type === 2 ? '入库' : '最终入库'
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '出入库时间', key: 'complete_time' },
              { title: '关联单号', key: 'order_code' },
              { title: '物料名称', key: 'material_name' },
              { title: '属性', key: 'material_color' },
              { title: '数量', key: 'total_weight' },
              { title: '单价', key: 'price' },
              { title: '操作类型', key: 'type_name' },
              { title: '出入库单位', key: 'client_name' },
              { title: '备注', key: 'desc' },
              { title: '创建人', key: 'user_name' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '织造分配') {
        weave.detail({
          order_type: this.order_type,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map((item) => {
            item.product_code = item.product_info.code
            item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
            item.product_title = item.product_info.product_title
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
              { title: '产品品类', key: 'product_types' },
              { title: '产品名称', key: 'product_title' },
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
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '补纱日志') {
        replenish.list({
          order_type: this.order_type,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data)
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '补纱日期', key: 'created_at' },
              { title: '关联单号', key: 'order_code' },
              { title: '补纱单位', key: 'replenish_name' },
              { title: '原料名称', key: 'material_name' },
              { title: '颜色', key: 'material_color' },
              { title: '补纱数量', key: 'need_weight' },
              { title: '订购数量', key: 'order_weight' },
              { title: '备注', key: 'desc' },
              { title: '创建人', key: 'user_name' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '半成品加工') {
        processing.detail({
          order_type: this.order_type,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map((item) => {
            item.product_code = item.product_info.code
            item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
            item.product_title = item.product_info.product_title
            item.sizeColor = item.size + '/' + item.color
            let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => itemF.size_name === item.size)) || false
            item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
            item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
            item.total_price = this.$toFixed(item.price * (Number(item.reality_number) || item.number))
            item.part = (item.part_assign && item.part_assign.map((item) => item.name).join('/')) || ''
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '创建日期', key: 'created_at' },
              { title: '关联单号', key: 'order_code' },
              { title: '出入库单位', key: 'client_name' },
              { title: '产品编号', key: 'product_code' },
              { title: '产品品类', key: 'product_types' },
              { title: '产品名称', key: 'product_title' },
              { title: '尺码颜色', key: 'sizeColor' },
              { title: '尺码信息', key: 'size_info' },
              { title: '克重', key: 'size_weight' },
              { title: '所需辅料', key: 'part' },
              { title: '单价(元)', key: 'price' },
              { title: '分配数量', key: 'number' },
              { title: '实际数量', key: 'reality_number' },
              { title: '总价(元)', key: 'total_price' },
              { title: '备注', key: 'desc' },
              { title: '创建人', key: 'user_name' },
              { title: '分配日期', key: 'complete' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '织造入库') {
        receiveDispatch.weaveDetail({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          production_type: this.production_type,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[2],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map((item) => {
            item.product_code = item.product_code.code
            item.sizeColor = item.size_name + '/' + item.color_name
            let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
            item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
            item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '入库日期', key: 'complete_time' },
              { title: '关联单号', key: 'order_code' },
              { title: '单位名称', key: 'client_name' },
              { title: '产品编号', key: 'product_code' },
              { title: '尺码颜色', key: 'sizeColor' },
              { title: '尺码信息', key: 'size_info' },
              { title: '克重', key: 'size_weight' },
              { title: '入库类型', key: 'production_type' },
              { title: '数量', key: 'number' },
              { title: '备注', key: 'desc' },
              { title: '创建人', key: 'user_name' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '半成品出入库') {
        receiveDispatch.semiDetail({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          production_type: this.production_type,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[2],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map((item) => {
            item.product_code = item.product_code.code
            item.sizeColor = item.size_name + '/' + item.color_name
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '出库日期', key: 'complete_time' },
              { title: '关联单号', key: 'order_code' },
              { title: '单位名称', key: 'client_name' },
              { title: '产品编号', key: 'product_code' },
              { title: '尺码颜色', key: 'sizeColor' },
              { title: '出库类型', key: 'production_type' },
              { title: '数量', key: 'number' },
              { title: '备注', key: 'desc' },
              { title: '创建人', key: 'user_name' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '半成品检验收发') {
        receiveDispatch.allDetail({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map(item => {
            item.process_client_name = item.semi_client_info.map(itemM => itemM.client_name).join('<br />')
            item.product_code = item.product_info.product_code
            item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
            item.product_title = item.product_info.product_title
            let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
            item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
            item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
            // item.count = item.count ? item.count.split('/').join('-') : ''
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            console.log(data)
            downloadExcel(data, [
              { title: '创建日期', key: 'weave_time' },
              { title: '关联单号', key: 'order_code' },
              { title: '织造单位', key: 'weave_client_name' },
              { title: '加工单位', key: 'process_client_name' },
              { title: '产品编号', key: 'product_code' },
              { title: '产品品类', key: 'product_types' },
              { title: '产品名称', key: 'product_title' },
              { title: '尺码', key: 'size_name' },
              { title: '尺码信息', key: 'size_info' },
              { title: '克重', key: 'size_weight' },
              { title: '颜色', key: 'color_name' },
              { title: '数量', key: 'number' },
              { title: '捆数', key: 'count' },
              { title: '次品数量', key: 'shoddy_number' },
              { title: '次品原因', key: 'shoddy_reason' },
              { title: '备注', key: 'desc' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '成品检验加工') {
        inspection.finishedDetail({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          product_code: this.product_code,
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id,
          client_id: this.client_id && this.client_id[1]
        }).then((res) => {
          data.push(...res.data.data.map((item) => {
            if (item.rejects_info) {
              item.rejects_info = JSON.parse(item.rejects_info)
              if (!item.rejects_info.number) {
                item.rejects_info = 0
              }
            }
            item.total_price = item.price ? item.price * item.number : 0
            item.client_or_user_name = item.client_name || item.inspection_user
            item.product_code = item.product_info.product_code
            item.product_types = `${item.product_info.category_name}/${item.product_info.type_name}/${item.product_info.style_name}`
            item.product_title = item.product_info.product_title
            let flag = (item.product_info && item.product_info.size && item.product_info.size.find(itemF => (itemF.size_id === item.size_id || itemF.size_name === item.size_name))) || false
            item.size_info = (flag && flag.size_info && `${flag.size_info}cm`) || ''
            item.size_weight = (flag && flag.weight && `${flag.weight}g`) || ''
            if (item.rejects_info !== 0) {
              item.rejects_number = item.rejects_info.number
              item.rejects_infos = item.rejects_info.reason ? item.rejects_info.reason.join(',') : ''
            } else {
              item.rejects_number = 0
              item.rejects_infos = ''
            }
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '创建日期', key: 'complete_time' },
              { title: '加工类型', key: 'product_flow' },
              { title: '单位人员', key: 'client_or_user_name' },
              { title: '关联单号', key: 'order_code' },
              { title: '产品编号', key: 'product_code' },
              { title: '产品品类', key: 'product_types' },
              { title: '产品名称', key: 'product_title' },
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
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '包装订购') {
        packPlan.packOrderLog({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
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
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '实际装箱') {
        packPlan.packActualLog({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          order_code: this.order_code,
          product_code: this.product_code,
          client_id: this.client_id,
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user,
          group_id: this.group_id
        }).then((res) => {
          data.push(...res.data.data.map(item => {
            // item.product_type = item.type.join('/')
            item.product_code = item.product_info.product_code
            item.product_type = item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name
            return item
          }))
          total = res.data.meta.total
          if (page >= Math.ceil(total / limit)) { // 当页数到最后一页时
            downloadExcel(data, [
              { title: '创建日期', key: 'create_time' },
              { title: '关联单号', key: 'order_code' },
              { title: '产品编号', key: 'product_code' },
              { title: '产品品类', key: 'product_type' },
              { title: '尺码', key: 'size_name' },
              { title: '颜色', key: 'color_name' },
              { title: '实际装箱数', key: 'number' },
              { title: '箱数', key: 'total_box' },
              { title: '备注', key: 'desc' },
              { title: '操作人', key: 'user_name' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '销售出库') {
        packPlan.outMarketLog({
          order_type: null,
          order_id: null,
          limit: limit,
          page: page,
          product_code: this.product_code,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          operate_user: this.operate_user
        }).then((res) => {
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
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else if (this.type === '预订购入库') {
        materialOrder.allLog({
          material_name: this.material_name,
          client_id: this.client_id && this.client_id[1],
          start_time: startDate || ((this.date && this.date.length > 0) ? this.date[0] : ''),
          end_time: endDate || ((this.date && this.date.length > 0) ? this.date[1] : ''),
          stock_id: this.stock_id,
          limit: limit,
          page: page
        }).then((res) => {
          data.push(...res.data.data)
          total = res.data.meta.total
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
              { title: '操作人', key: 'user_name' },
              { title: '操作时间', key: 'create_time' }
            ])
            this.downloading = false
          } else {
            setTimeout(() => {
              this.downloadAllLog(data, total, page + 1, limit, startDate, endDate)
            }, 1000)
          }
        })
      } else {
        this.$message.warning(`未找到“${this.type}”相关数据`)
      }
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
    // 导出年度或月度窗口确定
    importStart () {
      if (!this.selectImportDate) {
        this.$message.warning('请选择')
        return
      }
      let year = new Date(this.selectImportDate).getFullYear()
      if (this.importType === 'year') {
        this.importType = null
        this.downloadAllLog([], null, 1, 50, `${year}-01-01`, `${year}-12-31`)
      } else if (this.importType === 'month') {
        this.importType = null
        let month = new Date(this.selectImportDate).getMonth()
        this.downloadAllLog([], null, 1, 50, this.$getTime(new Date(year, month, 1)), this.$getTime(new Date(year, month + 1, 0)))
      } else {
        this.$message.warning('未知错误，请刷新重试或联系管理员')
      }
    }
  },
  created () {
    this.getFilters()
    this.getBarEchartsInfo(this.type)
    this.getList()
    Promise.all([
      auth.list(),
      process.list(),
      stock.list(),
      group.list(),
      client.list(),
      staff.list()
    ]).then(res => {
      // 初始化人员
      this.authList = res[0].data.data
      // 初始化加工类型
      this.processList = res[1].data.data
      this.processList.unshift({
        name: '织造'
      })
      // 初始化仓库列表
      this.stockList = res[2].data.data
      // 初始化小组
      this.groupList = res[3].data.data
      this.clientList = res[4].data.data
      this.clientFilter = {
        matOrder: this.$getClientOptions(this.clientList, companyType, { typeScope: [3, 4] }),
        matProcess: this.$getClientOptions(this.clientList, companyType, { typeScope: [9, 12] }),
        matStock: this.$getClientOptions(this.clientList, companyType, { hasFirstType: true, typeScope: [9, 28] }),
        proWeave: this.$getClientOptions(this.clientList, companyType, { typeScope: [13, 14, 39] }),
        proProcess: this.$getClientOptions(this.clientList, companyType, { typeScope: [15, 28] }),
        matOther: this.$getClientOptions(this.clientList, companyType, { typeScope: [7, 8] }),
        finishedProcess: [{
          type: '所有人员',
          value: '所有人员',
          label: '所有人员',
          children: res[5].data.data.map(itemM => {
            return {
              value: itemM.id,
              label: itemM.name,
              name_pinyin: '',
              contacts: []
            }
          })
        }].concat(this.$getClientOptions(this.clientList, companyType, { typeScope: [29, 34] }))
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/logStatistics.less";
@import "~@/assets/less/newfinancialStatistics/orderStatistics.less";
</style>
<style lang="less">
#logStatistics {
  .el-tabs__content {
    overflow: visible;
  }
  .el-tabs__item {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: #1a95ff;
    }
    &.is-active {
      color: #1a95ff;
    }
  }
}
</style>
