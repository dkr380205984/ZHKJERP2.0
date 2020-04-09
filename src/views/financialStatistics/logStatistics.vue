<template>
  <div id="logStatistics"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <el-tabs style="width:100%;font-size:16px"
          v-model="type">
          <el-tab-pane label="物料订购调取"
            name="物料订购调取">
            <!-- <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  v-model="order_code"
                  @change="changeRouter(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-input class="inputs"
                  v-model="name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="inputs"
                  v-model="client_id"
                  placeholder="搜索公司名称"
                  filterable>
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
              <div class="rightCtn">
              </div>
            </div> -->
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
                  <span class="text">公司名称</span>
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
                  <span class="text">{{item.color_code}}</span>
                </div>
                <div class="col">
                  <span class="text"
                    :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>
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
          <el-tab-pane label="物料加工"
            name="物料加工">
            <!-- <div class="filterCtn">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <el-input class="inputs"
                  v-model="order_code"
                  @change="changeRouter(1)"
                  placeholder="输入关联单号查询">
                </el-input>
                <el-input class="inputs"
                  v-model="name"
                  @change="changeRouter(1)"
                  placeholder="输入物料名称查询">
                </el-input>
                <el-select class="inputs"
                  v-model="client_id"
                  placeholder="搜索公司名称"
                  filterable>
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
                  @change="changeRouter(1)">
                </el-date-picker>
                <div class="btn btnGray"
                  style="margin-left:0"
                  @click="reset">重置</div>
              </div>
              <div class="rightCtn">
              </div>
            </div> -->
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
                  <span class="text">{{item.order_company}}</span>
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
          <el-tab-pane label="物料出入库"
            name="物料出入库">
            <div class="list"
              v-if="type==='物料出入库'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">出入库时间</span>
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
                  <span class="text">操作类型</span>
                </div>
                <div class="col">
                  <span class="text">出入库单位</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
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
                  <span class="text">{{item.complete_time}}</span>
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
                  <span class="text"
                    :class="item.type === 1 ? 'blue' : item.type === 2 ? 'green' : item.type === 3 ? 'green' : 'orange'">{{item.type === 1 ? '出库' : item.type === 2 ? '入库' : item.type === 3 ? '最终入库' : '织造出库'}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.total_weight}}kg</span>
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
              v-if="type==='物料出入库'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.material_push.total_weight)}}kg</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="织造分配"
            name="织造分配">
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
                  <span>{{item.product_info.code}}</span>
                  <span>{{item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name}}</span>
                </div>
                <div class="col">
                  <span>{{item.size}}</span>
                  <br />
                  <span>{{item.color}}</span>
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
                <div class="content">{{$formatNum(statistics.production_weave.total_number)}}kg</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">{{$formatNum(statistics.production_weave.total_price)}}元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="补纱日志"
            name="补纱日志">
            <div class="list"
              v-if="type==='补纱日志'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">补纱日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">补纱单位</span>
                </div>
                <div class="col">
                  <span class="text">原料名称</span>
                </div>
                <div class="col">
                  <span class="text">颜色</span>
                </div>
                <div class="col">
                  <span class="text">补纱数量(kg)</span>
                </div>
                <div class="col">
                  <span class="text">订购数量(kg)</span>
                </div>
                <div class="col">
                  <span class="text">承担比例</span>
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
                  <span class="text">{{item.replenish_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.material_color}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.need_weight}}kg</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_weight}}kg</span>
                </div>
                <div class="col">
                  <span v-for="(itemChild,indexChild) in item.client_info"
                    :key="indexChild">{{itemChild.client_name}}({{itemChild.percent}}%)</span>
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
              v-if="type==='补纱日志'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.yarn_replenish.total_weight)}}kg</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="半成品加工"
            name="半成品加工">
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
                  <span>{{item.product_info.code}}</span>
                  <span>{{item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name}}</span>
                </div>
                <div class="col">
                  {{item.size}}
                  <br />
                  {{item.color}}
                </div>
                <div class="col">
                  <span v-for="(itemIng,indexIng) in item.part_assign"
                    :key="indexIng">{{itemIng.name}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}元</span>
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
                  <span class="text">{{item.complete_time.slice(0,10)}}</span>
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
          <el-tab-pane label="产品入库"
            name="产品入库">
            <div class="list"
              v-if="type==='产品入库'">
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
                  <span class="text">单位名称</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">入库类型</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
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
                  <span class="text">{{item.created_at.date.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  {{item.product_code.code}}
                  <br />
                  {{item.category_info.category_name?(item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name):item.product_code.name}}
                </div>
                <div class="col">
                  {{item.size}}
                  <br />
                  {{item.color}}
                </div>
                <div class="col">
                  <span class="text">{{item.production_type}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
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
              v-if="type==='产品入库'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.product_push.total_number)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品出库"
            name="产品出库">
            <div class="list"
              v-if="type==='产品出库'">
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
                  <span class="text">单位名称</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">出库类型</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
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
                  <span class="text">{{item.created_at.date.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.client_name}}</span>
                </div>
                <div class="col"
                  style="flex:1.5">
                  {{item.product_code.code}}
                  <br />
                  {{item.category_info.category_name?(item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name):item.product_code.name}}
                </div>
                <div class="col">
                  {{item.size}}
                  <br />
                  {{item.color}}
                </div>
                <div class="col">
                  <span class="text">{{item.production_type}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
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
              v-if="type==='产品出库'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.product_pop.total_number)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="半成品检验"
            name="半成品检验">
            <div class="list"
              v-if="type==='半成品检验'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">检验日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">织造单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">检验数量</span>
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
                  <span class="text">{{item.product_name}}</span>
                </div>
                <div class="col">
                  {{item.size}}
                  <br />
                  {{item.color}}
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
                  <span class="green"
                    v-if="item.rejects_info===0">无次品</span>
                  <span class="blue"
                    style="cursor:pointer"
                    v-if="item.rejects_info!==0"
                    @click="rejectsDetail(item.rejects_info)">有次品(查看)</span>
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
              v-if="type==='半成品检验'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.semi_product_inspection.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">次品数量:</div>
                <div class="content">{{$formatNum(statistics.semi_product_inspection.rejects_number)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="成品检验"
            name="成品检验">
            <div class="list"
              v-if="type==='成品检验'">
              <div class="title">
                <div class="col"
                  style="flex:0.7">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">检验日期</span>
                </div>
                <div class="col">
                  <span class="text">关联单号</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">检验数量</span>
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
                  <span class="text">{{item.product_name}}</span>
                </div>
                <div class="col">
                  <div class="col">
                    {{item.size}}
                    <br />
                    {{item.color}}
                  </div>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
                  <span class="green"
                    v-if="item.rejects_info===0">无次品</span>
                  <span class="blue"
                    style="cursor:pointer"
                    v-if="item.rejects_info!==0"
                    @click="rejectsDetail(item.rejects_info)">有次品(查看)</span>
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
              v-if="type==='成品检验'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.product_inspection.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">次品数量:</div>
                <div class="content">{{$formatNum(statistics.product_inspection.rejects_number)}}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="包装订购"
            name="包装订购">
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
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col">
                  <span class="text">{{item.number}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.total_price}}</span>
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
          <el-tab-pane label="实际装箱"
            name="实际装箱">
            <div class="list"
              v-if="type==='实际装箱'">
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
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">装箱总数</span>
                </div>
                <div class="col">
                  <span class="text">箱数</span>
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
                  <span class="text">{{item.create_time.slice(0,10)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.order_code}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.product_info.product_code}}
                    <br />
                    {{item.product_info.category_name}}/{{item.product_info.type_name}}/{{item.product_info.style_name}}
                  </span>
                </div>
                <div class="col">
                  {{item.size}}
                  <br />
                  {{item.color}}
                </div>
                <div class="col">
                  <span class="text">{{item.pack_number}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.total_box?item.total_box:0}}箱</span>
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
              v-if="type==='实际装箱'">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">{{$formatNum(statistics.pack_real.total_number)}}</div>
              </div>
              <div class="oneBox">
                <div class="label">箱数:</div>
                <div class="content">{{$formatNum(statistics.pack_real.total_box)}}箱</div>
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
    <!-- 次品信息 -->
    <div class="popup"
      v-show="rejects_flag">
      <div class="main">
        <div class="title">
          <div class="text">次品信息</div>
          <i class="el-icon-close"
            @click="rejects_flag=false"></i>
        </div>
        <div class="content"
          v-for="(item,index) in rejects_info"
          :key="index">
          <div class="row">
            <div class="label">次品数量：</div>
            <div class="info text">
              {{item.number}}
            </div>
          </div>
          <div class="row"
            v-for="(itemChild,indexChild) in item.reason"
            :key="indexChild">
            <div class="label"
              :style="{'visibility':indexChild>0?'hidden':''}">次品原因：</div>
            <div class="info text">
              {{indexChild+1}}.{{itemChild}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnBlue"
            @click="downloadLog">导出勾选数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel, getHash } from '@/assets/js/common.js'
import { materialManage, materialProcess, materialStock, weave, replenish, processing, receive, dispatch, inspection, packPlan, logStatistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      loadingStatistics: true,
      list: [],
      checkAll: false,
      pages: 1,
      total: 0,
      order_code: '',
      name: '',
      client_id: '',
      date: [],
      rejects_flag: false,
      rejects_info: [{
        number: '',
        reason: []
      }],
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
          total_weight: 0
        },
        production_weave: {
          avg_price: 0,
          total_price: 0,
          total_number: 0
        },
        yarn_replenish: {
          total_weight: 0
        },
        semi_product: {
          avg_price: 0,
          total_price: 0,
          total_weight: 0
        },
        product_pop: {
          total_number: 0
        },
        product_push: {
          total_number: 0
        },
        product_inspection: {
          total_number: 0,
          rejects_number: 0
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
        }
      }
    }
  },
  computed: {
    checkList () {
      return this.list.filter((item) => item.checked)
    }
  },
  watch: {
    checkAll (newVal) {
      this.list.forEach((item) => {
        item.checked = newVal
      })
    },
    type (newVal) {
      this.changeRouter(1)
    },
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    downloadLog () {
      if (this.checkList.length === 0) {
        this.$message.error('请选择需要打印的日志')
        return
      }
      if (this.type === '物料订购调取') {
        let data = this.checkList.map(item => {
          item.type_source_name = (item.type_source === 2 ? '订购' : '调取') + (item.replenish_id ? '/补纱' : '')
          item.total_price = this.$toFixed(item.price * item.weight)
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
          { title: '数量', key: 'weight' },
          { title: '总价(元)', key: 'total_price' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' },
          { title: '完成日期', key: 'complete_time' }
        ])
      } else if (this.type === '物料加工') {
        let data = this.checkList.map(item => {
          item.total_price = this.$toFixed(item.price * item.weight)
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
          { title: '数量', key: 'weight' },
          { title: '总价(元)', key: 'total_price' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' },
          { title: '完成日期', key: 'complete_time' }
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
          item.product_code = item.product_info.code
          item.sizeColor = item.size + '/' + item.color
          item.total_price = this.$toFixed(item.price * item.number)
          return item
        })
        downloadExcel(data, [
          { title: '分配日期', key: 'created_at' },
          { title: '关联单号', key: 'order_code' },
          { title: '出入库单位', key: 'client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '尺码颜色', key: 'sizeColor' },
          { title: '单价(元)', key: 'price' },
          { title: '数量', key: 'number' },
          { title: '总价(元)', key: 'total_price' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' },
          { title: '完成日期', key: 'complete_time' }
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
          item.sizeColor = item.size + '/' + item.color
          item.total_price = this.$toFixed(item.price * item.number)
          item.part = item.part_assign.map((item) => item.name).join('/')
          return item
        })
        downloadExcel(data, [
          { title: '分配日期', key: 'created_at' },
          { title: '关联单号', key: 'order_code' },
          { title: '出入库单位', key: 'client_name' },
          { title: '产品编号', key: 'product_code' },
          { title: '尺码颜色', key: 'sizeColor' },
          { title: '所需辅料', key: 'part' },
          { title: '单价(元)', key: 'price' },
          { title: '数量', key: 'number' },
          { title: '总价(元)', key: 'total_price' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' },
          { title: '完成日期', key: 'complete_time' }
        ])
      } else if (this.type === '产品入库') {
        let data = this.checkList.map((item) => {
          item.product_code = item.product_code.code
          item.sizeColor = item.size + '/' + item.color
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
      } else if (this.type === '产品出库') {
        let data = this.checkList.map((item) => {
          item.product_code = item.product_code.code
          item.sizeColor = item.size + '/' + item.color
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
      } else if (this.type === '半成品检验') {
        let data = this.checkList.map(item => {
          if (item.rejects_info !== 0) {
            item.rejects_number = item.rejects_info.reduce((total, current) => {
              return total + Number(current.number)
            }, 0)
            item.rejects_infos = ''
            item.rejects_client = ''
            item.rejects_info.forEach((val, key) => {
              item.rejects_infos += val.reason.join(',')
              item.rejects_client += val.client_id + '<br />'
            })
          } else {
            item.rejects_number = 0
            item.rejects_infos = ''
            item.rejects_client = ''
          }
          return item
        })
        downloadExcel(data, [
          { title: '检验日期', key: 'complete_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '织造单位', key: 'client_name' },
          { title: '产品名称', key: 'product_name' },
          { title: '尺码', key: 'size' },
          { title: '颜色', key: 'color' },
          { title: '检验数量', key: 'number' },
          { title: '次品数量', key: 'rejects_number' },
          { title: '次品原因', key: 'rejects_infos' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' }
        ])
      } else if (this.type === '成品检验') {
        let data = this.checkList.map(item => {
          if (item.rejects_info !== 0) {
            item.rejects_number = item.rejects_info.reduce((total, current) => {
              return total + Number(current.number)
            }, 0)
            item.rejects_infos = ''
            item.rejects_client = ''
            item.rejects_info.forEach((val, key) => {
              item.rejects_infos += val.reason.join(',')
              item.rejects_client += val.client_id + '<br />'
            })
          } else {
            item.rejects_number = 0
            item.rejects_infos = ''
            item.rejects_client = ''
          }
          return item
        })
        downloadExcel(data, [
          { title: '检验日期', key: 'complete_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_types' },
          { title: '尺码', key: 'size' },
          { title: '颜色', key: 'color' },
          { title: '检验数量', key: 'number' },
          { title: '次品数量', key: 'rejects_number' },
          { title: '次品原因', key: 'rejects_infos' },
          { title: '承担单位', key: 'rejects_client' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' }
        ])
      } else if (this.type === '包装订购') {
        let data = this.checkList.map(item => {
          item.pack_size = item.price_square ? JSON.parse(item.size).join('*') : item.pack_size
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'order_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '订购单位', key: 'client_name' },
          { title: '包装辅料', key: 'material_name' },
          { title: '单价', key: 'price' },
          { title: '数量', key: 'number' },
          { title: '总价', key: 'total_price' },
          { title: '规格', key: 'pack_size' },
          { title: '属性', key: 'attribute' },
          { title: '备注', key: 'desc' },
          { title: '创建人', key: 'user_name' }
        ])
      } else if (this.type === '实际装箱') {
        let data = this.checkList.map(item => {
          item.product_type = item.type.join('/')
          item.product_code = item.product_info.product_code
          item.product_type = item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name
          return item
        })
        downloadExcel(data, [
          { title: '创建日期', key: 'create_time' },
          { title: '关联单号', key: 'order_code' },
          { title: '产品编号', key: 'product_code' },
          { title: '产品品类', key: 'product_type' },
          { title: '尺码', key: 'size' },
          { title: '颜色', key: 'color' },
          { title: '实际装箱数', key: 'number' },
          { title: '箱数', key: 'total_box' },
          { title: '备注', key: 'desc' },
          { title: '操作人', key: 'user_name' }
        ])
      }
    },
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.type = params.type
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/financialStatistics/logStatistics/page=' + pages + '&&type=' + this.type)
    },
    rejectsDetail (detail) {
      this.rejects_info = detail
      this.rejects_flag = true
    },
    reset () {

    },
    getList () {
      this.checkAll = false
      this.loading = true
      this.loadingStatistics = true
      this.list = []
      if (this.type === '物料订购调取') {
        materialManage.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '物料加工') {
        materialProcess.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '物料出入库') {
        materialStock.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '织造分配') {
        weave.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '补纱日志') {
        replenish.list({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '半成品加工') {
        processing.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '产品入库') {
        receive.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '产品出库') {
        dispatch.detail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '半成品检验') {
        inspection.semiFinishedDetail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.list.forEach((item) => {
            let flag = false
            // 检查是否有次品
            JSON.parse(item.rejects_info).forEach((itemChild) => {
              if (Number(itemChild.number) > 0) {
                flag = true
              }
            })
            if (flag) {
              item.rejects_info = JSON.parse(item.rejects_info)
            } else {
              item.rejects_info = 0
            }
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '成品检验') {
        inspection.finishedDetail({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.list.forEach((item) => {
            let flag = false
            // 检查是否有次品
            JSON.parse(item.rejects_info).forEach((itemChild) => {
              if (Number(itemChild.number) > 0) {
                flag = true
              }
            })
            if (flag) {
              item.rejects_info = JSON.parse(item.rejects_info)
            } else {
              item.rejects_info = 0
            }
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '包装订购') {
        packPlan.packOrderLog({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      } else if (this.type === '实际装箱') {
        packPlan.packActualLog({
          order_type: null,
          order_id: null,
          limit: 10,
          page: this.pages
        }).then((res) => {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        })
      }
      logStatistics.detail().then((res) => {
        this.statistics = res.data.data
        this.loadingStatistics = false
      })
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/logStatistics.less";
</style>
<style lang="less">
#logStatistics {
  .el-tabs__item {
    font-size: 16px;
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
