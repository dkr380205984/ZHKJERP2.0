<template>
  <div id='materialBatchDetail'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.orderType==='1'?'订':'样'}}单信息</span>
        <!-- <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="afterSend"></zh-message> -->
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <el-collapse class="collapse_row"
            accordion>
            <el-collapse-item v-for="(itemOrder,indexOrder) in orderList"
              :key="indexOrder"
              :title="'订单' + (indexOrder + 1) + '：' + itemOrder.order_code">
              <div class="detail_box bgGray">
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <span class="label">编号：</span>
                    <span class="text">{{itemOrder.order_code || itemOrder.title}}</span>
                  </div>
                  <div class="colCtn flex3">
                    <span class="label">{{$route.params.orderType==='1'?'订':'样'}}单公司：</span>
                    <span class="text">{{itemOrder.client_name}}</span>
                  </div>
                  <div class="colCtn flex3">
                    <span class="label">批次信息：</span>
                    <span class="text">
                      <zh-batch :data="itemOrder.batch_info"></zh-batch>
                    </span>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <span class="label">联系人：</span>
                    <span class="text">{{itemOrder.user_name}}</span>
                  </div>
                  <div class="colCtn flex3">
                    <span class="label">负责小组：</span>
                    <span class="text">{{itemOrder.group_name}}</span>
                  </div>
                  <div class="colCtn flex3">
                    <span class="label">下单日期：</span>
                    <span class="text">{{itemOrder.order_time}}
                      <order-warning :progress="itemOrder.time_progress"></order-warning>
                    </span>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn">
                    <span class="label">备注信息：</span>
                    <span class="text"
                      :class="{'blue':itemOrder.desc}">{{itemOrder.desc ? itemOrder.desc : '无'}}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">订单{{type==='1'?'原':'辅'}}料统计</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length===0?'请选取纱线进行加工操作':'批量加工'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                @click="easyProcess">批量加工</div>
            </el-tooltip>
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length===0?'请选取纱线进行订购操作':'订购白胚'"
              placement="top"
              v-if="type==='1'">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                @click="easyOrder(1)">订购白胚</div>
            </el-tooltip>
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length===0?'请选取纱线进行订购操作':'订购色纱'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                @click="easyOrder(2)">{{type==='1'?'订购色纱':'批量订购'}}</div>
            </el-tooltip>
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length!==0?'请选取一个纱线进行调取操作':'批量调取'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length!==1,'btnWhiteBlue':checkWhichYarn.length===1}"
                @click="selectStockFirst()">批量调取</div>
            </el-tooltip>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">选择</div>
                  <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}名称</div>
                      <div class="tcolumn">计划数量</div>
                      <div class="tcolumn">采购数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in statistic_data"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.attr_info"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.attr}}</div>
                      <div class="tcolumn">{{itemChild.plan_number || 0}}{{itemChild.unit}}</div>
                      <div class="tcolumn"><span class="green">{{itemChild.order_number || 0}}{{itemChild.unit}}</span></div>
                      <div class="tcolumn"
                        style="flex-direction:row;line-height:54px;justify-content:start">
                        <span class="blue"
                          @click="normalOrder(item,itemChild,'order')">订购</span>
                        <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"></span>
                        <span class="blue"
                          @click="normalProcess(item,itemChild,'process')">加工</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="order">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">订购公司</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                      <div class="tcolumn">单价</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">完成时间</div>
                    </div>
                  </div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in order_stock_info"
                  :key="index">
                  <div class="tcolumn"><span :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.material_info"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.material_name}}</div>
                      <div class="tcolumn">{{itemChild.color_code}}</div>
                      <div class="tcolumn">{{itemChild.price}}元</div>
                      <div class="tcolumn"><span class="green">{{itemChild.weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                    </div>
                  </div>
                  <div class="tcolumn"><span class="green">{{item.total_price}}元</span></div>
                  <div class="tcolumn"
                    style="flex-direction: row; justify-content: start; align-items: center;">
                    <span class="blue"
                      @click="$openUrl('/materialTable/' + $route.params.id + '/' + $route.params.orderType + '/' + $route.params.type + '?clientName=' + item.client_name + '&&type=' + item.type_source)">打印</span>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in material_order_info"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteItem(material_order_info,index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">订购公司</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.company_id"
                        filterable
                        placeholder="请选择订购公司">
                        <el-option v-for="item in orderCompany"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">单价</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入单价"
                        v-model="item.price"
                        type="number">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemMat,indexMat) in item.material"
                  :key="indexMat">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">{{type==='1'?'原料名称':'辅料名称'}}</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-select v-model="itemMat.name"
                          @change="selectMaterial($event,itemMat)">
                          <el-option v-for="(itemF,indexF) in materialArr"
                            :key="indexF"
                            :value="itemF.name"
                            :label="itemF.name">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">{{type==='1'?'原料颜色':'辅料属性'}}</span>
                    </div>
                    <div class="content">
                      <el-autocomplete v-model="itemMat.color"
                        :fetch-suggestions="searchColor"
                        placeholder="请输入颜色">
                      </el-autocomplete>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">{{type==='1'?'原':'辅'}}料数量</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入数量"
                        v-model="itemMat.number"
                        disabled
                        type="number">
                        <template slot="append">{{itemMat.unit}}</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexMat===0"
                      @click="addItem(item.material,'material')">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexMat>0"
                      @click="deleteItem(item.material,indexMat)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
                    <div class="label">
                      <span class="text">截止日期</span>
                    </div>
                    <div class="content">
                      <el-date-picker v-model="item.complete_time"
                        value-format="yyyy-MM-dd"
                        style="width:100%"
                        type="date"
                        placeholder="选择截止日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">备注信息</span>
                    </div>
                    <div class="content">
                      <el-input placeholder="请输入备注信息"
                        v-model="item.desc"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="addRows">
                <span class="once"
                  v-if="material_order_info.length === 0"
                  @click="addItem(material_order_info,'order')">普通订购</span>
                <template v-else>
                  <span class="once cancle"
                    @click="cancleOrder">取消订购</span>
                  <span class="once normal"
                    @click="addItem(material_order_info,'order')">添加订购公司</span>
                  <span class="once ok"
                    @click="saveOrder">确认订购</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="process">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料加工</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">加工单位</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                      <div class="tcolumn">工序</div>
                      <div class="tcolumn">单价</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">完成时间</div>
                    </div>
                  </div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_info"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.process_info"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.material_name}}</div>
                      <div class="tcolumn">{{itemChild.material_color}}</div>
                      <div class="tcolumn"><span class="green">{{itemChild.process_type}}</span></div>
                      <div class="tcolumn">{{itemChild.price}}元</div>
                      <div class="tcolumn"><span class="green">{{itemChild.weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                    </div>
                  </div>
                  <div class="tcolumn"><span class="green">{{item.total_price}}元</span></div>
                  <div class="tcolumn"><span class="blue"
                      @click="$openUrl('/materialProcessTable/' + $route.params.id + '/' + $route.params.orderType + '/' + $route.params.type + '?clientName=' + item.client_name)">打印</span></div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in process_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteItem(process_data,index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">加工单位</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.company_id"
                        filterable
                        placeholder="请选择加工单位">
                        <el-option v-for="item in processCompany"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">加工工序</span>
                      <span class="explanation">(可多选)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.process"
                        filterable
                        multiple
                        placeholder="请选择加工工序">
                        <el-option v-for="item in processList"
                          :key="item.id"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.processList"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工{{type==='1'?'原':'辅'}}料</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="itemChild.material_id">
                        <el-option v-for="item in materialArr"
                          :key="item.id"
                          :value="item.name"
                          :label="item.name">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input v-model="itemChild.number"
                        placeholder="请输入加工数量">
                        <template slot="append"
                          v-if="type==='1'">kg</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input v-model="itemChild.price"
                        placeholder="请输入加工单价">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addItem(item.processList,'processChild')">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteItem(item.processList,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
                    <div class="label">
                      <span class="text">截止日期</span>
                    </div>
                    <div class="content">
                      <el-date-picker v-model="item.complete_time"
                        value-format="yyyy-MM-dd"
                        style="width:100%"
                        type="date"
                        placeholder="选择截止日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">备注信息</span>
                    </div>
                    <div class="content">
                      <el-input placeholder="请输入备注信息"
                        v-model="item.desc"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="addRows">
                <span class="once"
                  v-if="process_data.length === 0"
                  @click="addItem(process_data,'process')">普通加工</span>
                <template v-else>
                  <span class="once cancle"
                    @click="cancleProcess">取消加工</span>
                  <span class="once normal"
                    @click="addItem(process_data,'process')">添加加工单位</span>
                  <span class="once ok"
                    @click="saveProcess">确认加工</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购调取日志</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-left:64px;padding-right:64px">
        <div class="btnCtn_page">
          <div class="btn noBorder noMargin"
            @click="deleteOrderLog('all')">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="downloadOrder">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row flex12">完成日期</span>
            <span class="tb_row">来源</span>
            <span class="tb_row flex2">{{type==='1'?'原':'辅'}}料名称</span>
            <span class="tb_row">{{type==='1'?'颜色':'属性'}}</span>
            <span class="tb_row flex08">单价(元)</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">总价(元)</span>
            <span class="tb_row">备注</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row">创建日期</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in order_stock_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row flex12">{{$getTime(item.complete_time)}}</span>
            <span class="tb_row">
              <span>
                <span :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>
                <br />
                {{item.client_name}}
              </span>
            </span>
            <span class="tb_row flex2">{{item.material_name + '/' + item.before_color}}</span>
            <span class="tb_row">{{item.color_code}}</span>
            <span class="tb_row flex08">{{item.price}}</span>
            <span class="tb_row flex08">{{item.weight}}{{type==='1'?'kg':item.unit}}</span>
            <span class="tb_row flex08">{{$toFixed(item.price*item.weight)}}</span>
            <span class="tb_row">{{item.desc}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row">{{item.create_time.slice(0,10)}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteOrderLog(item.id,index)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料加工日志</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-left:64px;padding-right:64px">
        <div class="btnCtn_page">
          <div class="btn noBorder noMargin"
            @click="deleteProcessLog('all')">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="downloadProcess">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row flex12">完成日期</span>
            <span class="tb_row flex2">加工单位</span>
            <span class="tb_row flex2">{{type==='1'?'原':'辅'}}料名称</span>
            <span class="tb_row">{{type==='1'?'颜色':'属性'}}</span>
            <span class="tb_row flex08">工序</span>
            <span class="tb_row flex08">单价(元)</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">总价(元)</span>
            <span class="tb_row">备注</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row">创建日期</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in process_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row flex12">{{$getTime(item.complete_time)}}</span>
            <span class="tb_row flex2">{{item.client_name}}</span>
            <span class="tb_row flex2">{{item.material_name}}</span>
            <span class="tb_row">{{item.material_color}}</span>
            <span class="tb_row flex08">{{item.process_type}}</span>
            <span class="tb_row flex08">{{item.price}}</span>
            <span class="tb_row flex08">{{item.weight}}{{type==='1'?'kg':item.unit}}</span>
            <span class="tb_row flex08">{{$toFixed(item.price*item.weight)}}</span>
            <span class="tb_row">{{item.desc}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row">{{item.create_time.slice(0,10)}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteProcessLog(item.id,index)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="detailCtn"
        style="padding-top:0">
        <div class="swichCtn"
          style="margin-top:0;border-top:0">
          <div class="swich"
            v-for="(item,index) in stock_list"
            :key="index"
            @click="getNormalYarn(index)"
            :class="{'active':stockDefault===index}">{{item.material_name}}</div>
          <div class="swich"
            @click="getOtherYarn"
            :class="{'active':otherYarnFlag}">所有库存物料</div>
        </div>
        <div style="height:1px;background:#E9E9E9;margin-top:19px"></div>
        <div class="rowCtn"
          v-if="!otherYarnFlag">
          <div class="normalTb"
            style="width:100%">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">仓库名称</div>
                <div class="tcolumn">{{type==='1'?'原料颜色':'辅料属性'}}</div>
                <div class="tcolumn">库存数量</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-if="stock_list.length>0">
              <div class="trow"
                v-for="(item,index) in stock_list[stockDefault].childrenMergeInfo"
                :key="index">
                <div class="tcolumn">{{item.stock_name}}</div>
                <div class="tcolumn">{{item.material_color}}</div>
                <div class="tcolumn">{{item.total_weight}}</div>
                <div class="tcolumn">
                  <span class="blue"
                    @click="normalStock(item)">调取</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          style="display:block;overflow:hidden"
          v-if="otherYarnFlag">
          <div style="height:32px;margin:20px 32px;width:300px">
            <el-input class="inputs"
              v-model="yarnWord"
              @change="getOtherYarnList"
              placeholder="输入相似物料名称按回车键查询">
              <template slot="append">
                <i class="el-icon-search"
                  @click="getOtherYarnList"></i>
              </template>
            </el-input>
          </div>
          <div class="normalTb">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">仓库名称</div>
                <div class="tcolumn">物料名称</div>
                <div class="tcolumn">{{type==='1'?'原料颜色':'辅料属性'}}</div>
                <div class="tcolumn">库存数量</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-if="otherYarnStock.length>0">
              <div class="trow"
                v-for="(item,index) in otherYarnStock"
                :key="index">
                <div class="tcolumn">{{item.stock_name}}</div>
                <div class="tcolumn">{{item.material_name}}</div>
                <div class="tcolumn">{{item.material_color}}</div>
                <div class="tcolumn">{{item.total_weight}}</div>
                <div class="tcolumn">
                  <span class="blue"
                    @click="normalStock(item)">调取</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn"
            style="margin:20px;float:right">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="pages"
              @current-change="getOtherYarnList">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyOrderFlag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyOrderFlag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：一键添加操作可以统一选择订购公司和物料单价，如不需要可以选择直接跳过该步骤。
          </div>
          <div v-for="(item,index) in checkWhichYarn"
            :key="index"
            style="padding:8px;background:#f4f4f4;margin:8px 0">
            <div class="row">
              <div class="label">物料名称：</div>
              <div class="info">
                <span class="text">{{item.material_name}}</span>
              </div>
            </div>
            <div class="row">
              <div class="label">订购公司：</div>
              <div class="info">
                <el-select v-model="commonCompany[index]"
                  filterable
                  placeholder="请选择订购公司">
                  <el-option v-for="item in orderCompany"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">物料单价：</div>
              <div class="info">
                <el-input placeholder="单价"
                  class="hasMargin"
                  v-model="commonPrice[index]"
                  :key="index">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyOrderFlag = false">直接跳过</div>
          <span class="btn btnBlue"
            @click="commonFn('order')">确定</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyProcessFlag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyProcessFlag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：一键加工操作可以统一选择加工单位,加工单价,加工工序和截止日期，如不需要可以选择直接跳过该步骤。
          </div>
          <div v-for="(item,index) in checkWhichYarn"
            :key="index"
            style="padding:8px;background:#f4f4f4;margin:8px 0">
            <div class="row">
              <div class="label">物料名称：</div>
              <div class="info">
                <span class="text">{{item.material_name}}</span>
              </div>
            </div>
            <div class="row">
              <div class="label">加工单位：</div>
              <div class="info">
                <el-select v-model="commonProcessCompany[index]"
                  filterable
                  placeholder="请选择加工单位">
                  <el-option v-for="item in processCompany"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">加工单价：</div>
              <div class="info">
                <el-input v-model="commonProcessPrice[index]"
                  placeholder="请输入加工单价">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">加工工序：</div>
              <div class="info">
                <el-select v-model="commonProcess[index]"
                  filterable
                  multiple
                  placeholder="请选择加工工序">
                  <el-option v-for="item in processList"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">截止日期：</div>
              <div class="info">
                <el-date-picker v-model="commonDate[index]"
                  value-format="yyyy-MM-dd"
                  style="width:100%"
                  type="date"
                  placeholder="选择截止日期">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="$goElView('process');easyProcessFlag = false">直接跳过</span>
          <span class="btn btnBlue"
            @click="commonFnProcess('process')">确定</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyStockFlag">
      <div class="main">
        <div class="title">
          <div class="text">调取物料库存</div>
          <i class="el-icon-close"
            @click="easyStockFlag=false"></i>
        </div>
        <div style="max-height:600px;overflow:auto">
          <div class="content"
            v-for="(itemStock,indexStock) in stock_data"
            :key="indexStock">
            <div class="row">
              <div class="label">计划物料：</div>
              <div class="info">
                <el-select v-model="itemStock.material_id"
                  filterable
                  placeholder="请选择需要调取的物料"
                  @change="selectStockMaterial($event,itemStock)">
                  <el-option v-for="item in materialArr"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="row">
                <div class="label">来源仓库：</div>
                <div class="info">
                  <span class="text">{{itemStock.stock.stock_name}}</span>
                </div>
              </div>
              <div class="row">
                <div class="label">调取物料：</div>
                <div class="info">
                  <span class="text">{{itemStock.stock.name}}</span>
                  <span class="text blue">{{itemStock.stock.color}}</span>
                </div>
              </div>
              <div class="row">
                <div class="label">调取数量：</div>
                <div class="info">
                  <zh-input style="margin-bottom:12px;width:160px"
                    placeholder="输入数量"
                    v-model="itemStock.stock.weight"
                    disabled>
                    <template slot="append">{{itemStock.stock.unit}}</template>
                  </zh-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="label">备注信息：</div>
              <div class="info">
                <el-input style="height:32px;flex:1"
                  v-model="itemStock.desc"
                  placeholder="请输入备注信息"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyStockFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveStock">确定</div>
        </div>
      </div>
    </div>
    <!-- 批量调取白胚选择优先仓库 -->
    <div class="popup"
      v-show="showStockSelect">
      <div class="main">
        <div class="title">
          <span class="tex">选择仓库</span>
          <i class="el-icon-close"
            @click="resetStock"></i>
        </div>
        <div class="content">
          <div class="row"
            style="display: block;">
            <el-steps :active="step"
              align-center
              finish-status="success">
              <el-step title="搜索物料"></el-step>
              <el-step title="选择仓库"></el-step>
              <el-step title="仓库调取"></el-step>
              <el-step title="调取统计"></el-step>
            </el-steps>
          </div>
          <div class="box">
            <div class="line1">
              <span>原料名称：{{checkWhichYarn.length>0?checkWhichYarn[0].material_name:supplyMatName}}</span>
              <span v-if="step<3">所需总量：<span class="blue">{{stockMatTotalNum}}</span></span>
              <span v-if="step===3">实际调取：<span class="blue">{{stockMatReallyTotalNum}}</span></span>
            </div>
            <div class="line1"
              v-if="step>1">
              <span>调取仓库：{{stockYarnInfo.from}}</span>
              <span>调取纱线：{{stockYarnInfo.material_name + '/' + stockYarnInfo.material_color}}</span>
            </div>
            <div class="list"
              v-loading="searchYarnLoading"
              v-show="step===0">
              <div class="serachCtn">
                <div style="height:32px;margin:20px 32px;width:300px">
                  <el-input class="inputs"
                    v-model="searchYarnWord"
                    @change="searchYarnFn"
                    placeholder="输入相似物料名称按回车键查询">
                    <template slot="append">
                      <i class="el-icon-search"
                        @click="searchYarnFn"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="li">
                <span class="once">物料名称</span>
                <span class="once">库存数量</span>
                <span class="once right">操作</span>
              </div>
              <div class="li"
                v-if="searchYarnList.length===0">
                <div style="text-alignt:center">未找到物料库存</div>
              </div>
              <div class="li"
                v-for="(item,index) in searchYarnList"
                :key="index">
                <span class="once">{{item.material_name}}</span>
                <span class="once">{{item.total_weight}}</span>
                <span class="once right">
                  <span class="once right blue"
                    v-if="item.total_weight>=stockMatTotalNum"
                    @click="chooseMat(item.material_name)">调取</span>
                  <span class="once right"
                    v-if="item.total_weight<stockMatTotalNum">库存不足</span>
                </span>
              </div>
            </div>
            <div class="list"
              v-show="step===1">
              <div class="li">
                <span class="once">仓库名称</span>
                <span class="once">纱线颜色</span>
                <span class="once">库存数量</span>
                <span class="once right">操作</span>
              </div>
              <div class="li"
                v-for="(item,index) in stockSelectList"
                :key="index">
                <span class="once">{{item.stock_name}}</span>
                <span class="once">{{item.material_color}}</span>
                <span class="once">{{item.total_weight}}</span>
                <span class="once right blue"
                  v-if="item.total_weight>=stockMatTotalNum"
                  @click="easyStockBatch(item)">调取</span>
                <span class="once right"
                  v-if="item.total_weight<stockMatTotalNum">库存不足</span>
              </div>
            </div>
            <div class="list"
              v-if="step===2">
              <div class="li">
                <span class="once">计划物料</span>
                <span class="once">调取数量</span>
              </div>
              <div class="li"
                v-for="(item,index) in stock_data"
                :key="index">
                <span class="once">{{item.material_name}}</span>
                <span class="once">
                  <el-input placeholder="请输入数量"
                    disabled
                    v-model="item.stock.weight">
                    <template slot="append">{{item.stock.unit}}</template>
                  </el-input>
                </span>
              </div>
            </div>
            <div class="list"
              v-if="step===3">
              <div class="li">
                <span class="once">计划物料</span>
                <span class="once">调取数量</span>
              </div>
              <div class="li"
                v-for="(item,index) in stock_data"
                :key="index">
                <span class="once">{{item.material_name}}</span>
                <span class="once">
                  {{item.stock.weight}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            v-if="step>0"
            @click="step--">{{step===1?'搜索其他物料':'上一步'}}</div>
          <div class="btn btnBlue"
            @click="step ++"
            v-if="step===2">下一步</div>
          <div class="btn btnBlue"
            v-if="step===3"
            @click="saveStock">确认调取</div>
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
import { materialPlan, client, materialManage, process, materialProcess, yarnStock, yarnColor, yarn, material } from '@/assets/js/api.js'
export default {
  data () {
    return {
      orderList: [],
      statistic_data: [], // 物料统计
      cloneDetailData: [], // 保留订单数据
      material_order_info: [], // 物料订购数据
      orderCompany: [], // 订购单位
      //
      total: 0,
      pages: 1,
      type: this.$route.params.type,
      loading: true,
      materialArr: [], // 物料原始数据，用于下拉框选项
      order_data: [], // 订购
      order_stock_info: [], // 订购调取详情
      order_stock_log: [], // 订购调取日志
      order_flag: false,
      stock_list: [], // 库存列表
      stockDefault: 0,
      stock_data: [{
        material_id: '',
        desc: '',
        stock: {
          stock_name: '',
          stock_id: '',
          name: '',
          color: '',
          weight: '',
          unit: ''
        }
      }], // 调取
      easyStockFlag: false,
      process_data: [], // 加工
      process_info: [],
      process_log: [],
      process_flag: false,
      processCompany: [],
      easyProcessFlag: false,
      colorList: [],
      yarnList: [],
      processList: [],
      commonCompany: [],
      commonPrice: [],
      commonProcessCompany: [], // 一键加工公共单位
      commonProcessPrice: [],
      commonProcess: [],
      commonDate: [],
      easyOrderFlag: false,
      otherYarnStock: [],
      otherYarnFlag: false,
      stockNameArr: [],
      showStockSelect: false,
      stockSelectList: [],
      lock: true,
      step: 0,
      stockMatTotalNum: 0,
      supplyMatName: '',
      stockYarnInfo: {
        from: '',
        material: ''
      },
      yarnWord: '', // 仓库物料搜索keyword
      searchYarnWord: '', // 调取弹窗物料搜索keyword
      searchYarnLoading: false,
      searchYarnList: []
    }
  },
  methods: {
    init () {
      this.loading = true
      let orderIdArr = this.$route.params.id.split('-')
      let orderType = this.$route.params.orderType
      let materialType = this.$route.params.type
      Promise.all([
        materialPlan.detail({
          order_id: orderIdArr,
          order_type: orderType,
          material_type: materialType
        }),
        client.list(),
        materialManage.detail({
          order_type: orderType,
          order_id: orderIdArr
        }),
        process.list(),
        materialProcess.detail({
          order_type: orderType,
          order_id: orderIdArr
        }),
        materialManage.init({
          order_type: orderType,
          order_id: orderIdArr
        }),
        yarnColor.list(),
        yarn.list(),
        material.list()
      ]).then(res => {
        let materialPlanData = res[0].data.data
        // 订单数据初始化
        this.orderList = materialPlanData.order_info
        // 统计数据初始化
        let detailData = materialPlanData.total_data.filter(itemF => +itemF.material_type === +materialType && itemF.reality_weight).map(item => {
          if (item.material_type === 1) {
            item.reality_weight = this.$toFixed(item.reality_weight / 1000)
            item.unit = 'kg'
          }
          return item
        })
        this.cloneDetailData = this.$clone(detailData)
        this.statistic_data = this.$mergeData(detailData, { mainRule: ['material_name', 'material_type/type'], childrenName: 'attr_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'reality_weight/plan_number', type: 'add' }, { name: 'order_weight/order_number', type: 'add' }, { name: 'unit' }] } }).map(itemMa => {
          return {
            material_name: itemMa.material_name,
            type: itemMa.type,
            checked: false,
            attr_info: itemMa.attr_info.map(itemAttr => {
              return {
                attr: itemAttr.attr,
                plan_number: this.$toFixed(itemAttr.plan_number),
                order_number: this.$toFixed(itemAttr.order_number),
                unit: itemAttr.unit
              }
            })
          }
        })
        this.materialArr = this.$flatten(this.statistic_data.map(item => { // 初始化原料选择框数据
          return item.attr_info.map(itemA => {
            return {
              name: item.material_name + '/' + itemA.attr
            }
          })
        }))
        // 订购公司初始化
        this.orderCompany = res[1].data.data.filter((item) => {
          if (this.type === '1') {
            return item.type.indexOf(2) !== -1 // 原料订购单位
          } else {
            return item.type.indexOf(10) !== -1// 辅料订购单位
          }
        })
        // 订购调取日志初始化
        this.order_stock_log = res[2].data.data.filter(item => item.type === Number(materialType)).map(item => {
          if (!item.client_name) {
            item.client_name = item.stock_name
          }
          item.total_price = this.$toFixed(item.price * item.weight)
          item.checked = false
          return item
        })
        // 订购数据初始化
        this.order_stock_info = this.$mergeData(this.order_stock_log, { mainRule: ['client_name', 'type_source'], otherRule: [{ name: 'total_price', type: 'add' }], childrenName: 'material_info' })
        // 加工单位初始化
        this.processCompany = res[1].data.data.filter((item) => {
          return item.type.indexOf(3) !== -1
        })
        // 加工工序初始化
        this.processList = res[3].data.data.filter(item => Number(item.type) === 1)
        // 加工日志初始化
        this.process_log = res[4].data.data.filter(item => item.type === Number(materialType))
        // 加工数据初始化
        this.process_info = this.$mergeData(this.process_log, { mainRule: 'client_name', childrenName: 'process_info' }).map(item => {
          item.total_price = this.$toFixed(item.process_info.map(itemP => this.$toFixed(itemP.price * itemP.weight || 0)).reduce((a, b) => {
            return a + b
          }))
          return item
        })
        // 库存数据初始化
        this.stock_list = this.$mergeData(res[5].data.data.stock_info.filter(item => item.type === Number(materialType)), { mainRule: 'material_name' })
        // 初始化颜色库
        this.colorList = res[6].data.data.map((item) => {
          return {
            value: item.name
          }
        })
        // 初始化物料库
        if (materialType === '1') {
          this.yarnList = res[7].data.data.map((item) => {
            return {
              value: item.name
            }
          })
        } else {
          this.yarnList = res[8].data.data.map((item) => {
            return {
              value: item.name
            }
          })
        }
        this.loading = false
      })
    },
    afterSend () {
      if (this.$route.params.easyOrder === 'easy') {
        this.$router.push('/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType + '/normal')
        this.$winReload()
      } else {
        this.$winReload()
      }
    },
    addItem (data, type) {
      if (type === 'order') {
        data.push({
          material: [
            {
              name: '',
              color: '',
              number: '',
              unit: ''
            }
          ],
          price: '',
          company_id: '',
          complete_time: this.$getTime(),
          desc: ''
        })
      } else if (type === 'material') {
        data.push({
          color: '',
          name: '',
          number: '',
          unit: ''
        })
      } else if (type === 'process') {
        data.push({
          company_id: '',
          process: [],
          processList: [{
            material_id: '',
            number: '',
            price: ''
          }],
          complete_time: '',
          desc: ''
        })
      } else if (type === 'processChild') {
        data.push({
          material_id: '',
          price: '',
          number: ''
        })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    // 批量导出excel订购
    downloadOrder () {
      let data = this.order_stock_log.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.type_source_name = (item.type_source === 2 ? '订购' : '调取') + (item.replenish_id ? '/补纱' : '')
        item.total_price = this.$toFixed(item.price * item.weight)
        return item
      })
      downloadExcel(data, [
        { title: '完成日期', key: 'complete_time' },
        { title: '来源类型', key: 'type_source_name' },
        { title: '来源', key: 'client_name' },
        { title: '物料名称', key: 'material_name' },
        { title: '属性', key: 'color_code' },
        { title: '单价(元)', key: 'price' },
        { title: '数量', key: 'weight' },
        { title: '总价(元)', key: 'total_price' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderList)
    },
    // 批量导出excel加工
    downloadProcess () {
      let data = this.process_log.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.total_price = this.$toFixed(item.price * item.weight)
        return item
      })
      downloadExcel(data, [
        { title: '完成日期', key: 'complete_time' },
        { title: '加工单位', key: 'client_name' },
        { title: '物料名称', key: 'material_name' },
        { title: '属性', key: 'material_color' },
        { title: '工序', key: 'process_type' },
        { title: '单价(元)', key: 'price' },
        { title: '数量', key: 'weight' },
        { title: '总价(元)', key: 'total_price' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderList)
    },
    searchColor (queryString, cb) {
      let result = queryString ? this.colorList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colorList
      cb(result)
    },
    searchYarn (queryString, cb) {
      let result = queryString ? this.yarnList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarnList
      cb(result)
    },
    selectMaterial (id, data) {
      let finded = this.cloneDetailData.filter((item) => (item.material_name + '/' + item.material_attribute) === id).map(item => {
        item.reality_weight = this.$toFixed(item.reality_weight)
        item.unit = item.material_type === 1 ? 'kg' : item.unit
        return item
      })
      data.color = finded[0].material_attribute
      data.unit = finded[0].unit
      data.number = finded.map(item => {
        return (+item.reality_weight || 0) - (+item.order_weight || 0)
      }).reduce((a, b) => {
        return a + b
      })
    },
    // 订购按钮点击事件
    normalOrder (item, itemInner, elIdName) {
      let orderNum = (+itemInner.plan_number || 0) - (+itemInner.order_number || 0)
      if (orderNum <= 0) {
        this.$message.warning('该物料已完成订购')
        return
      }
      this.material_order_info.push({
        material: [
          {
            name: item.material_name + '/' + itemInner.attr,
            color: itemInner.attr,
            number: this.$toFixed(orderNum),
            unit: itemInner.unit
          }
        ],
        price: '',
        company_id: '',
        complete_time: this.$getTime(),
        desc: ''
      })
      this.$goElView(elIdName)
    },
    // 批量订购点击时间  白胚：1；色纱：2
    easyOrder (type) {
      let checkedData = this.statistic_data.filter(itemF => itemF.checked)
      if (checkedData.length === 0) {
        this.$message.warning('请选择')
        return
      }
      if (this.material_order_info.length > 0) {
        this.$message.warning('请先完成已有的订购信息再继续订购')
        return
      }
      checkedData.forEach((item) => {
        let material = []
        item.attr_info.forEach((itemChild) => {
          if (itemChild.plan_number - (itemChild.order_number || 0) > 0) {
            material.push({
              name: item.material_name + '/' + itemChild.attr,
              color: type === 1 ? '白胚' : itemChild.attr,
              number: itemChild.plan_number - (itemChild.order_number || 0),
              unit: itemChild.unit
            })
          }
        })
        if (material.length > 0) {
          this.material_order_info.push({
            material: material,
            price: '',
            company_id: '',
            complete_time: this.$getTime(),
            desc: ''
          })
        }
      })
      if (this.material_order_info.length > 0) {
        this.order_flag = true
        this.easyOrderFlag = true
      } else {
        this.$message.warning('物料已采购完毕，如有特殊需求请手动添加订购信息')
      }
    },
    selectStockFirst () {
      if (this.checkWhichYarn.length !== 1) {
        this.$message.warning('请选择一种纱线进行调取')
        return
      }
      let needNum = this.checkWhichYarn[0].attr_info.map(item => (+item.plan_number || 0) - (+item.order_number || 0)).reduce((total, current) => {
        return total + current
      }, 0)
      if (parseInt(needNum) === 0) {
        this.$message.warning('检测到需要调取纱线不足一公斤，请手动调取')
        return
      }
      let stockListCopy = this.$clone(this.stock_list)
      let finded = stockListCopy.find((item) => item.material_name === this.checkWhichYarn[0].material_name)
      // if (!finded) {
      //   this.$message.warning('没有符合该原料名称的物料，可以手动搜索相似名称进行调取')
      //   return
      // }
      this.stockMatTotalNum = this.$toFixed(needNum)
      this.showStockSelect = true
      this.stockSelectList = finded ? finded.childrenMergeInfo.filter((item) => item.material_color === '白胚') : []
      // 如果仓库有名称完全一样的白胚，就直接进入调取步骤，否则进入搜索纱线步骤
      if (this.stockSelectList.length > 0) {
        this.step = 1
      } else {
        this.step = 0
        // this.$message.warning('仓库里没有符合该名称的白胚物料，请手动搜索相似名称物料进行搜索')
      }
    },
    // 批量调取
    easyStockBatch (whiteYarn) {
      // 调取白胚
      this.stock_data = []
      this.checkWhichYarn[0].attr_info.forEach((item, index) => {
        let needNumChild = (+item.plan_number || 0) - (+item.order_number || 0)
        let stockWeight = whiteYarn.total_weight > needNumChild ? (needNumChild > 0 ? needNumChild : 0) : whiteYarn.total_weight
        if (stockWeight > 0) {
          this.stock_data.push(
            {
              material_id: this.checkWhichYarn[0].material_name + '/' + item.attr,
              material_name: this.checkWhichYarn[0].material_name + '/' + item.attr,
              desc: '',
              stock: {
                stock_id: whiteYarn.stock_id,
                stock_name: whiteYarn.stock_name,
                weight: stockWeight,
                color: whiteYarn.material_color,
                name: whiteYarn.material_name,
                unit: item.unit
              }
            })
        }
      })
      this.stockYarnInfo = {
        from: whiteYarn.stock_name,
        material_name: whiteYarn.material_name || this.checkWhichYarn[0].material_name,
        material_color: whiteYarn.material_color
      }
      this.step = 2
    },
    // 批量调取搜索物料
    searchYarnFn () {
      this.searchYarnLoading = true
      yarnStock.list({
        limit: 10,
        page: 1,
        weight: this.stockMatTotalNum,
        material_name: this.searchYarnWord,
        type: this.$route.params.type
      }).then((res) => {
        this.searchYarnList = res.data.data
        this.searchYarnLoading = false
      })
    },
    chooseMat (name) {
      this.searchYarnLoading = true
      yarnStock.list({
        material_name: name,
        type: this.$route.params.type,
        page: 1,
        limit: 10
      }).then((res) => {
        this.stockSelectList = res.data.data
        this.step = 1
        this.searchYarnLoading = false
      })
    },
    // 关闭弹窗
    resetStock () {
      this.step = 1
      this.showStockSelect = false
      this.stock_data = []
    },
    normalStock (item) {
      this.stock_data = [{
        material_id: '',
        material_name: '',
        desc: '',
        stock: {
          stock_id: item.stock_id,
          stock_name: item.stock_name,
          weight: '',
          color: item.material_color,
          name: item.material_name || this.stock_list[this.stockDefault].material_name,
          unit: ''
        }
      }]
      this.easyStockFlag = true
    },
    // 调取提交
    saveStock () {
      // 数据验证
      let flag = {
        name: true,
        number: true
      }
      let stockData = []
      let orderData = []
      this.stock_data.forEach(itemStock => {
        if (!itemStock.material_id) {
          flag.name = false
        }
        if (!itemStock.stock.weight) {
          flag.number = false
        }
        let findedFlag = this.cloneDetailData.filter(itemF => (itemF.material_name + '/' + itemF.material_attribute) === itemStock.material_id && itemF.reality_weight)
        stockData.push(...findedFlag.map(item => {
          return {
            order_type: item.order_type,
            material_name: itemStock.stock.name,
            color_code: itemStock.stock.color,
            weight: this.$toFixed((+item.reality_weight || 0) - (+item.order_weight || 0)),
            vat_code: null,
            plan_id: item.id,
            replenish_id: null,
            order_id: item.order_id,
            stock_id: itemStock.stock.stock_id,
            attribute: '',
            desc: itemStock.desc
          }
        }).filter(itemF => itemF.weight > 0))
        orderData.push(...findedFlag.map(item => {
          return {
            order_type: item.order_type,
            desc: itemStock.desc,
            complete_time: this.$getTime(),
            total_price: 0,
            price: 0,
            total_weight: this.$toFixed((+item.reality_weight || 0) - (+item.order_weight || 0)),
            color_code: itemStock.stock.color,
            material_name: itemStock.stock.name,
            plan_id: item.id,
            type: item.material_type,
            vat_code: null,
            replenish_id: null,
            type_source: 1, // 1调取，2订购
            attribute: null,
            stock_id: itemStock.stock.stock_id,
            client_id: null,
            order_id: item.order_id
          }
        }).filter(itemF => itemF.total_weight > 0))
      })
      if (!flag.name) {
        this.$message.error('请选择计划物料')
        return
      }
      if (!flag.number) {
        this.$message.error('请填写调取数量')
        return
      }
      materialManage.create({
        data: {
          order_data: orderData,
          stock_data: stockData
        }
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('调取成功，请刷新页面后查看采购数量')
          this.easyStockFlag = false
          this.init()
        }
      })
    },
    cancleOrder () {
      this.material_order_info = []
    },
    // 批量订购提交
    saveOrder () {
      let flag = {
        client: true,
        price: true,
        name: true,
        attr: true,
        number: true,
        time: true,
        isNotPlan: true
      }
      let materialOrderInfo = []
      this.material_order_info.forEach(itemOrder => {
        if (!itemOrder.company_id) {
          flag.client = false
        }
        if (!itemOrder.price) {
          flag.price = false
        }
        if (!itemOrder.complete_time) {
          flag.time = false
        }
        itemOrder.material.forEach(itemMa => {
          if (!itemMa.name) {
            flag.name = false
          }
          if (!itemMa.color) {
            flag.attr = false
          }
          if (!itemMa.number) {
            flag.number = false
          }
          let flagTotal = this.cloneDetailData.filter(itemF => (itemF.material_name + '/' + itemF.material_attribute) === itemMa.name)
          if (flagTotal.length === 0) {
            flag.isNotPlan = false
          } else {
            let data = flagTotal.map(item => {
              return {
                order_type: item.order_type,
                desc: itemOrder.desc,
                complete_time: itemOrder.complete_time,
                total_price: 0,
                price: itemOrder.price,
                total_weight: (+item.reality_weight || 0) - (+item.order_weight || 0),
                color_code: itemMa.color,
                material_name: item.material_name,
                plan_id: item.id,
                type: item.material_type,
                vat_code: null,
                replenish_id: null,
                type_source: 2, // 1调取，2订购
                attribute: null,
                stock_id: null,
                client_id: itemOrder.company_id,
                order_id: item.order_id
              }
            })
            materialOrderInfo.push(...data)
          }
        })
      })
      if (materialOrderInfo.length === 0) {
        this.$message.error('检测到无可提交的数据，无法提交')
        return
      }
      if (!flag.client) {
        this.$message.error('检测到未选择订购公司，请选择')
        return
      }
      if (!flag.price) {
        this.$message.error('检测到未填写单价，请填写完整')
        return
      }
      if (!flag.name) {
        this.$message.error('检测到有未选择订购物料，请选择')
        return
      }
      if (!flag.attr) {
        this.$message.error('检测到有未填写订购物料属性，请填写完整')
        return
      }
      if (!flag.number) {
        this.$message.error('检测到有未填写订购物料数量，请填写完整')
        return
      }
      if (!flag.time) {
        this.$message.error('检测到未选择截止时间，请选择')
        return
      }
      if (!flag.isNotPlan) {
        this.$message.error('出现未知错误，请刷新页面重试，或联系我们')
        return
      }
      let totalWeight = materialOrderInfo.map(item => (+item.total_weight || 0)).reduce((a, b) => {
        return a + b
      })
      let totalPrice = materialOrderInfo.map(item => (item.total_weight * item.price || 0)).reduce((a, b) => {
        return a + b
      })
      materialManage.create({
        batches_data: {
          material_type: this.$route.params.type,
          order_id: this.$route.params.id.split('-'),
          order_type: this.$route.params.orderType,
          total_weight: totalWeight,
          total_price: totalPrice
        },
        data: {
          order_data: materialOrderInfo,
          stock_data: []
        }
      }).then((res) => {
        if (res.data.status !== false) {
          this.cancleOrder()
          this.$message.success('订购成功，请刷新页面后查看采购数量')
          this.init()
        }
      })
    },
    // 删除订购日志
    deleteOrderLog (id, index) {
      this.$confirm('请确认该物料还未入库', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          materialManage.delete({
            id: this.order_stock_log.filter(item => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$winReload()
            }
          })
        } else {
          materialManage.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看采购和库存变化'
              })
              this.order_stock_log.splice(index, 1)
              this.$winReload()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 一键订购，统一输入订购公司和价格
    commonFn (elIdName) {
      this.material_order_info.forEach((item, index) => {
        item.price = this.commonPrice[index]
        item.company_id = this.commonCompany[index]
      })
      this.commonCompany = []
      this.commonPrice = []
      this.$goElView(elIdName)
      this.easyOrderFlag = false
    },
    // 一键加工
    commonFnProcess (elIdName) {
      this.process_data.forEach((item, index) => {
        item.processList.forEach((itemChild) => {
          itemChild.price = this.commonProcessPrice[index]
        })
        item.process = this.commonProcess[index]
        item.company_id = this.commonProcessCompany[index]
        item.complete_time = this.commonDate[index]
      })
      this.commonProcessCompany = []
      this.commonProcessPrice = []
      this.commonProcess = []
      this.commonDate = []
      this.easyProcessFlag = false
      this.$goElView(elIdName)
    },
    // 加工按钮点击事件
    normalProcess (item, itemChild, elIdName) {
      this.process_flag = true
      this.process_data.push({
        company_id: '',
        processList: [
          {
            material_id: item.material_name + itemChild.attr,
            number: itemChild.plan_number,
            price: ''
          }
        ],
        process: [],
        complete_time: this.$getTime(),
        desc: ''
      })
      this.$goElView(elIdName)
    },
    // 批量加工按钮点击事件
    easyProcess () {
      if (this.checkWhichYarn.length === 0) {
        this.$message.warning('请选择一种纱线进行加工')
        return
      }
      if (this.process_data.length > 0) {
        this.$message.warning('请先完成已有的加工信息再继续订购')
        return
      }
      let flag = true
      this.checkWhichYarn.forEach(item => {
        if (item.attr_info.filter(itemF => +itemF.plan_number !== +itemF.order_number).length > 0) {
          flag = false
        }
      })
      if (!flag) {
        this.$message.warning('检测到已勾选的物料未订购完整，无法批量加工')
        return
      }
      this.checkWhichYarn.forEach((item) => {
        let material = []
        item.attr_info.forEach((itemChild) => {
          material.push({
            replenish_material_name: item.material_name + '/' + itemChild.attr, // 补纱的时候才会用到，用于现实
            material_id: item.material_name + '/' + itemChild.attr,
            number: itemChild.order_number,
            price: ''
          })
        })
        this.process_data.push({
          company_id: '',
          processList: material,
          complete_time: '',
          process: [],
          desc: ''
        })
      })
      this.easyProcessFlag = true
      this.process_flag = true
    },
    // 批量加工提交
    saveProcess () {
      let flag = {
        client: true,
        type: true,
        name: true,
        number: true,
        price: true,
        time: true,
        isNotPlan: true
      }
      let formData = []
      this.process_data.forEach((item) => {
        if (!item.company_id) {
          flag.client = false
        }
        if (!item.process || item.process.length === 0) {
          flag.type = false
        }
        if (!item.complete_time) {
          flag.time = false
        }
        item.processList.forEach((itemChild) => {
          if (!itemChild.material_id) {
            flag.name = false
          }
          if (!itemChild.number) {
            flag.number = false
          }
          if (!itemChild.price) {
            flag.price = false
          }
          let findedFlag = this.cloneDetailData.filter(itemF => (itemF.material_name + '/' + itemF.material_attribute) === itemChild.material_id)
          if (findedFlag.length === 0) {
            flag.isMotPlan = false
          } else {
            let data = findedFlag.map(itemF => {
              return {
                order_type: itemF.order_type,
                process_type: item.process.join('/'),
                type: itemF.material_type,
                order_id: itemF.order_id,
                client_id: item.company_id,
                price: itemChild.price,
                weight: itemF.order_weight,
                desc: item.desc,
                complete_time: this.$getTime(item.complete_time),
                plan_id: itemF.id,
                replenish_id: null

              }
            })
            formData.push(...data)
          }
        })
      })
      if (formData.length === 0) {
        this.$message.error('检测到无可提交的数据，无法提交')
        return
      }
      if (!flag.client) {
        this.$message.error('检测到未选择加工单位，请选择')
        return
      }
      if (!flag.type) {
        this.$message.error('检测到有未选择加工工序，请至少选择一项')
        return
      }
      if (!flag.name) {
        this.$message.error('检测到有未选择订购物料，请选择')
        return
      }
      if (!flag.number) {
        this.$message.error('检测到有未填写订购物料数量，请填写完整')
        return
      }
      if (!flag.price) {
        this.$message.error('检测到未填写单价，请填写完整')
        return
      }
      if (!flag.time) {
        this.$message.error('检测到未选择截止时间，请选择')
        return
      }
      if (!flag.isNotPlan) {
        this.$message.error('出现未知错误，请刷新页面重试，或联系我们')
        return
      }
      materialProcess.create({
        data: formData
      }).then((res) => {
        if (res.data.status !== false) {
          this.cancleProcess()
          this.$message.success('加工成功，请刷新页面后查看加工日志')
          this.init()
        }
      })
    },
    cancleProcess () {
      this.process_data = []
      this.process_flag = false
    },
    deleteProcessLog (id, index) {
      this.$confirm('请确认该物料还未加工', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          materialProcess.delete({
            id: this.process_log.filter(item => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$winReload()
            }
          })
        } else {
          materialProcess.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看加工信息变化'
              })
              this.process_log.splice(index, 1)
              this.$winReload()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getNormalYarn (index) {
      this.stockDefault = index
      this.otherYarnFlag = false
    },
    // 选择其他库存物料
    getOtherYarn () {
      this.stockDefault = -1
      this.otherYarnFlag = true
    },
    getOtherYarnList () {
      yarnStock.list({
        material_name: this.yarnWord,
        type: this.$route.params.type,
        page: this.pages,
        limit: 5
      }).then((res) => {
        this.otherYarnStock = res.data.data
        this.total = res.data.meta.total
      })
    },
    // 调取弹窗选择物料时
    selectStockMaterial (ev, data) {
      for (let prop in this.statistic_data) {
        let item = this.statistic_data[prop]
        for (let propInner in item.attr_info) {
          let itemInner = item.attr_info[propInner]
          if ((item.material_name + '/' + itemInner.attr) === ev) {
            data.stock.weight = this.$toFixed((+itemInner.plan_number || 0) - (+itemInner.order_number || 0))
            data.stock.unit = itemInner.unit
            return
          }
        }
      }
    }
  },
  computed: {
    checkWhichYarn () {
      return this.statistic_data.filter((item) => item.checked)
    },
    stockMatReallyTotalNum () {
      return this.$toFixed(this.stock_data.map(item => (+item.stock.weight || 0)).reduce((total, current) => {
        return total + current
      }, 0))
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialBatchDetail.less";
</style>
