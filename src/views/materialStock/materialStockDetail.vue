<template>
  <div id='materialStockDetail'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="$winReload"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data="orderInfo.batch_info"></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':orderInfo.desc}">{{orderInfo.desc?orderInfo.desc:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <template v-if="$route.params.orderType === '1'">
      <zh-file-module :orderId='$route.params.id'
        title_has_border />
    </template>
    <template v-else-if="$route.params.orderType === '2'">
      <zh-confirm-module title_has_border
        :orderId="$route.params.id"
        :orderInfo='confirmInfo' />
    </template>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type === '1' ? '原' : '辅'}}料出入库</span>
      </div>
      <template v-if="materialStockInfo.length > 0 || $route.params.type !== '1'">
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <el-tooltip class="item"
                effect="dark"
                :content="checkWhichYarn.length===0?'请选取物料进行批量操作':'批量操作'"
                placement="top">
                <div class="btn"
                  :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                  @click="batchBtnClick">批量操作</div>
              </el-tooltip>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn"
              style="margin-right:0">
              <div class="flexTb"
                style="border-bottom:0">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn"
                      style="flex:0.2">选择</div>
                    <div class="tcolumn">{{$route.params.type==='1'?'原':'辅'}}料名称</div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcolumn">{{$route.params.type==='1'?'颜色':'属性'}}名称</div>
                        <span class="tcolumn">订购/补纱数量</span>
                        <span class="tcolumn">已入库数量</span>
                        <span class="tcolumn">待入库数量</span>
                        <span class="tcolumn">更新时间</span>
                        <span class="tcolumn center"
                          style="flex:1.5">操作</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in materialStockInfo"
                    :key="index">
                    <div class="tcolumn"
                      style="flex:0.2">
                      <el-checkbox v-model="item.checked"></el-checkbox>
                    </div>
                    <div class="tcolumn">{{item.material_name}}</div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow"
                        v-for="(itemColor,indexColor) in item.color_info"
                        :key="indexColor">
                        <div class="tcolumn">{{itemColor.attr}}</div>
                        <span class="tcolumn">
                          <span class="order">{{$toFixed(itemColor.order_weight)}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                          <span class="replenish"
                            v-if="+itemColor.replenish_order_weight > 0">{{$toFixed(itemColor.replenish_order_weight)}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                        </span>
                        <span class="tcolumn green">{{$toFixed(itemColor.goStockNumEnd || 0)}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                        <span class="tcolumn orange">{{$toFixed(Number(itemColor.order_weight || 0) + Number(itemColor.replenish_order_weight || 0) - Number(itemColor.goStockNumEnd || 0))}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                        <span class="tcolumn">{{$getTime(itemColor.updated_at)}}</span>
                        <span class="tcolumn center"
                          style="flex:1.5">
                          <span class="trow"
                            style="align-items: center;">
                            <!-- <div class="btn noBorder noMargin"
                              @click="handleClick(item,itemColor,'out')">出库</div> -->
                            <div class="btn noBorder"
                              @click="handleClick(item,itemColor,'end_go')">入库</div>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="trow"
                    v-if="materialStockInfo.length === 0">
                    <span class="tcolumn center">暂无数据</span>
                  </div>
                </div>
                <div class="editCtn bgGary_page"
                  id="handleMaterial"
                  v-for="(itemStock,indexStock) in stockEditInfo"
                  :key="indexStock">
                  <span class="closeIcon_page el-icon-circle-close"
                    @click="deleteItem(stockEditInfo,indexStock,true)"></span>
                  <div class="rowCtn">
                    <div class="colCtn flex3">
                      <div class="label">
                        <span class="text">选择单位</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemStock.client_name"
                          filterable
                          default-first-option
                          clearable
                          class="elInput"
                          placeholder="请选择出入库单位"
                          :disabled="itemStock.editType === 5"
                          @change="changeClient(itemStock,$event)">
                          <el-option v-for="item in materialClient"
                            :key="item.client_id"
                            :label="item.client_name"
                            :value="item.client_id">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label">
                        <span class="text"></span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemStock.editType"
                          class="elInput"
                          placeholder="请选择操作类型"
                          :disabled="itemStock.editTypeDisabled"
                          @change="getStockList">
                          <el-option v-for="item in editTypeArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="colCtn flex3"
                      v-if="itemStock.editType === 5">
                      <div class="label">
                        <span class="text">结余入库仓库</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemStock.stockId"
                          class="elInput"
                          placeholder="请选择结余入库仓库">
                          <el-option v-for="item in stockArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="rowCtn"
                    v-for="(itemMa,indexMa) in itemStock.material_info"
                    :key="indexMa">
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexMa === 0">
                        <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <template v-if="itemStock.isCustomerSupplied">
                          <el-autocomplete class="elInput"
                            v-model="itemMa.material_name"
                            :fetch-suggestions="querySearchMaterial"
                            :placeholder="`请选择需要操作的${$route.params.type === '1' ? '原' : '辅'}料`"></el-autocomplete>
                        </template>
                        <template v-else>
                          <el-select v-model="itemMa.material_name"
                            filterable
                            default-first-option
                            clearable
                            class="elInput"
                            :placeholder="'请选择需要操作的' + ($route.params.type === '1' ? '原' : '辅') +'料'"
                            @change="changeColorInfo($event,itemMa)">
                            <el-option v-for="item in materialStockInfo"
                              :key="item.id"
                              :label="item.material_name"
                              :value="item.material_name">
                            </el-option>
                          </el-select>
                        </template>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexMa === 0">
                        <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content middle_page col">
                        <template v-if="itemStock.isCustomerSupplied">
                          <el-autocomplete class="elInput"
                            v-model="itemMa.material_attribute"
                            :fetch-suggestions="querySearchColor"
                            :placeholder="`请选择需要操作的${$route.params.type === '1' ? '原' : '辅'}料颜色`"></el-autocomplete>
                        </template>
                        <template v-else>
                          <el-select v-model="itemMa.material_attribute"
                            filterable
                            default-first-option
                            clearable
                            class="elInput"
                            :placeholder="'请选择需要操作的'+($route.params.type === '1' ? '原' : '辅') + '料颜色'">
                            <el-option v-for="item in itemMa.color_info"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name">
                            </el-option>
                          </el-select>
                        </template>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexMa === 0">
                        <span class="text">出入库重量</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <zh-input placeholder="请输入入库数量"
                          class="elInput"
                          v-model="itemMa.number"
                          type='number'></zh-input>
                      </div>
                      <div class="editBtn addBtn"
                        @click="addItem(itemStock.material_info,'material')"
                        v-if="indexMa === 0">添加</div>
                      <div class="editBtn deleteBtn"
                        @click="deleteItem(itemStock.material_info,indexMa)"
                        v-else>删除</div>
                    </div>
                  </div>
                  <div class="rowCtn">
                    <div class="colCtn flex3">
                      <div class="label">
                        <span class="text">入库时间</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <el-date-picker v-model="itemStock.time"
                          value-format="yyyy-MM-dd"
                          class="elInput"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </div>
                    </div>
                    <div class="colCtn">
                      <div class="label">
                        <span class="text">备注信息</span>
                      </div>
                      <div class="content">
                        <zh-input placeholder="请输入备注信息"
                          v-model="itemStock.remark"></zh-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="addRows">
                  <span class="once"
                    v-if="stockEditInfo.length === 0"
                    @click="addItem(stockEditInfo,'stock')">添加出入库</span>
                  <span class="once cancle"
                    v-if="stockEditInfo.length > 0"
                    @click="resetEditInfo('stock')">取消</span>
                  <span class="once normal"
                    v-if="stockEditInfo.length > 0"
                    @click="addItem(stockEditInfo,'stock')">添加出入库</span>
                  <span class="once ok"
                    v-if="stockEditInfo.length > 0"
                    @click="saveAll('material')">确认</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="normalCtn hasBorderTop">暂无任何{{$route.params.type === '1' ? '原' : '辅'}}料订购信息</div>
      </template>
    </div>
    <div class="module"
      v-if="weaveInfo.length !== 0">
      <div class="titleCtn">
        <span class="title">{{$route.params.type === '1' ? '原' : '辅'}}料{{$route.params.type === '1' ? '织造' : '加工'}}单位出库</span>
      </div>
      <template v-if="weaveInfo.length !== 0">
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <el-tooltip class="item"
                effect="dark"
                :content="checkWhichWeave.length===0?'请选取单位进行批量操作':'批量操作'"
                placement="top">
                <span class="btn"
                  :class="{'btnGray':checkWhichWeave.length===0,'btnWhiteBlue':checkWhichWeave.length>0}"
                  @click="batchBtnClickWeave">批量操作</span>
              </el-tooltip>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn"
              style="margin-right:0">
              <div class="flexTb"
                style="border-bottom:0">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn"
                      style="flex:0.2">选择</div>
                    <div class="tcolumn">单位名称</div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcolumn">{{$route.params.type==='1'?'原':'辅'}}料名称 </div>
                        <div class="tcolumn noPad"
                          style="flex:5">
                          <div class="trow">
                            <div class="tcolumn">{{$route.params.type==='1'?'颜色':'属性'}}</div>
                            <span class="tcolumn">分配/补纱数量</span>
                            <span class="tcolumn">已出库数量</span>
                            <span class="tcolumn">待出库数量</span>
                            <span class="tcolumn center">操作</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in weaveInfo"
                    :key="index">
                    <div class="tcolumn"
                      style="flex:0.2">
                      <el-checkbox v-model="item.checked"
                        @change="watchCheckedNum($event,item)"></el-checkbox>
                    </div>
                    <div class="tcolumn">{{item.client_name}}
                      <span style="color:#1a95ff">{{item.process?item.process:'织造'}}</span>
                    </div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow"
                        v-for="(itemMa,indexMa) in item.material_info"
                        :key="indexMa">
                        <div class="tcolumn">{{itemMa.material_name}}</div>
                        <div class="tcloumn"
                          style="flex:5">
                          <div class="trow"
                            v-for="(itemColor,indexColor) in itemMa.color_info"
                            :key="indexColor">
                            <span class="tcolumn">{{itemColor.attr}}</span>
                            <span class="tcolumn">
                              <span class="distribution">{{itemColor.unit === 'g' ? $toFixed(itemColor.weight/1000 || 0) : $toFixed(itemColor.weight || 0)}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                              <span class="replenish"
                                v-if="+itemColor.replenish_weight > 0">{{itemColor.unit === 'g' ? $toFixed(itemColor.replenish_weight/1000 || 0) : $toFixed(itemColor.replenish_weight || 0)}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                            </span>
                            <span class="tcolumn green">{{itemColor.unit === 'g' ? $toFixed((itemColor.outStockNum || 0)) : $toFixed((itemColor.outStockNum || 0))}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                            <span class="tcolumn orange">{{itemColor.unit === 'g' ? $toFixed((+itemColor.weight + (+itemColor.replenish_weight || 0))/1000 - (+itemColor.outStockNum || 0)) : $toFixed((+itemColor.weight + (+itemColor.replenish_weight || 0)) - (+itemColor.outStockNum || 0))}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                            <span class="tcolumn center">
                              <span class="btn noBorder noMargin"
                                @click="handleClickProcess(item,itemMa,itemColor)">出库</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="editCtn bgGary_page"
                  id="handleWeave"
                  v-for="(itemWeave,indexWeave) in weaveStockEditInfo"
                  :key="indexWeave">
                  <span class="closeIcon_page el-icon-circle-close"
                    @click="deleteItem(weaveStockEditInfo,indexWeave,true)"></span>
                  <div class="rowCtn">
                    <div class="colCtn flex3">
                      <div class="label">
                        <span class="text">出库单位</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemWeave.client_name"
                          filterable
                          default-first-option
                          clearable
                          class="elInput"
                          placeholder="请选择出库单位"
                          @change="changeMaterialInfo($event,itemWeave)">
                          <el-option v-for="item in weaveInfo"
                            :key="item.client_id"
                            :label="item.client_name"
                            :value="item.client_id">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="rowCtn"
                    v-for="(itemMa,indexMa) in itemWeave.material_info"
                    :key="indexMa">
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexMa === 0">
                        <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemMa.material_name"
                          filterable
                          default-first-option
                          clearable
                          class="elInput"
                          :placeholder="'请选择需要操作的' + ($route.params.type === '1' ? '原' : '辅') +'料'"
                          @change="changeAttrInfo($event,itemWeave,itemMa)">
                          <el-option v-for="(item,index) in itemWeave.materialInfo"
                            :key="index"
                            :label="item.material_name"
                            :value="item.material_name">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexMa === 0">
                        <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content middle_page col">
                        <el-select v-model="itemMa.material_attribute"
                          filterable
                          default-first-option
                          clearable
                          class="elInput"
                          :placeholder="'请选择需要操作的'+($route.params.type === '1' ? '原' : '辅') + '料颜色'">
                          <el-option v-for="item in itemMa.color_info"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexMa === 0">
                        <span class="text">出入库重量</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <zh-input placeholder="请输入入库数量"
                          class="elInput"
                          v-model="itemMa.number"
                          type='number'></zh-input>
                      </div>
                      <div class="editBtn addBtn"
                        @click="addItem(itemWeave.material_info,'material')"
                        v-if="indexMa === 0">添加</div>
                      <div class="editBtn deleteBtn"
                        @click="deleteItem(itemWeave.material_info,indexMa)"
                        v-else>删除</div>
                    </div>
                  </div>
                  <div class="rowCtn">
                    <div class="colCtn flex3">
                      <div class="label">
                        <span class="text">出库时间</span>
                        <span class="explanation">（必填）</span>
                      </div>
                      <div class="content">
                        <el-date-picker v-model="itemWeave.time"
                          value-format="yyyy-MM-dd"
                          class="elInput"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </div>
                    </div>
                    <div class="colCtn">
                      <div class="label">
                        <span class="text">备注信息</span>
                      </div>
                      <div class="content">
                        <zh-input placeholder="请输入备注信息"
                          v-model="itemWeave.remark"></zh-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="addRows">
                  <span class="once"
                    v-if="weaveStockEditInfo.length === 0"
                    @click="addItem(weaveStockEditInfo,'process')">添加单位出库</span>
                  <span class="once cancle"
                    v-if="weaveStockEditInfo.length > 0"
                    @click="resetEditInfo('weave')">取消</span>
                  <span class="once normal"
                    v-if="weaveStockEditInfo.length > 0"
                    @click="addItem(weaveStockEditInfo,'process')">添加单位出库</span>
                  <span class="once ok"
                    v-if="weaveStockEditInfo.length > 0"
                    @click="saveAll('weave')">确认</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="normalCtn hasBorderTop">暂无任何织造加工信息</div>
      </template>
    </div>
    <div class="module"
      v-if="stockLog.length>0">
      <div class="titleCtn">
        <div class="title">出入库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="deleteLog('all')">批量删除</div>
            <div class="btn btnWhiteBlue"
              @click="download">批量导出excel</div>
          </div>
        </div>
        <div style="margin:18px 32px;width:auto"
          class="tableCtnLv2">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">出入库时间</span>
            <span class="tb_row">
              <template v-if="!showFilterClientBox">
                出入库单位
                <span class="filterIcon el-icon-search"
                  @click="showFilterClientBox = true"></span>
              </template>
              <template v-else>
                <el-select v-model="filterHandleClient"
                  clearable
                  class="filterInput"
                  placeholder="筛选类型">
                  <el-option v-for="item in handleClientArr"
                    :key="item.client_name"
                    :label="item.client_name"
                    :value="item.client_name">
                  </el-option>
                </el-select>
              </template>
            </span>
            <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
            <span class="tb_row flex08">颜色</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">
              <template v-if="!showFilterTypeBox">
                操作类型
                <span class="filterIcon el-icon-search"
                  @click="showFilterTypeBox = true"></span>
              </template>
              <template v-else>
                <el-select v-model="filterHandleType"
                  clearable
                  class="filterInput"
                  placeholder="筛选类型">
                  <el-option v-for="item in handleTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </span>
            <span class="tb_row flex08">操作人</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in stockLog"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.complete_time}}</span>
            <span class="tb_row">{{itemLog.client_name}}</span>
            <span class="tb_row">{{itemLog.material_name}}</span>
            <span class="tb_row flex08">{{itemLog.material_color}}</span>
            <span class="tb_row flex08">{{itemLog.total_weight}}</span>
            <span class="tb_row flex08"
              :class="itemLog.type === 1 ? 'blue' : itemLog.type === 2 ? 'green' : itemLog.type === 3 ? 'green' : 'orange'">{{itemLog.type === 1 ? '出库' : itemLog.type === 2 ? '入库' : itemLog.type === 3 ? '最终入库' : '织造出库'}}</span>
            <span class="tb_row flex08">{{itemLog.user_name}}</span>
            <span class="tb_row middle flex08">
              <span class="tb_handle_btn red"
                @click="deleteLog('one',itemLog.id)">删除</span>
            </span>
          </div>
        </div>
        <!-- <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="stockLogTotal"
            :current-page.sync="stockLogPages">
          </el-pagination>
        </div> -->
      </div>
    </div>
    <div class="module">
      <div class="detailCtn noPadding">
        <div class="swichCtn">
          <div :class="{'swich':true,'active':activeType === 'plan'}"
            @click="activeType = 'plan'">计划</div>
          <div :class="{'swich':true,'active':activeType === 'order'}"
            @click="getMaterialOrder">采购</div>
          <div :class="{'swich':true,'active':activeType === 'process'}"
            @click="getMaterialProcess">加工</div>
        </div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb"
          v-if="activeType === 'plan'">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">计划{{$route.params.type === '1' ? '原' : '辅'}}料</span>
              <span class="tcolumn noPad flex20">
                <span class="trow">
                  <span class="tcolumn">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                  <span class="tcolumn">计划数量</span>
                </span></span>
              <span class="tcolumn">总计</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in totalInfo.plan"
              :key="index">
              <span class="tcolumn">{{item.material_name}}</span>
              <span class="tcolumn noPadding flex20">
                <span class="trow"
                  v-for="(itemColor,indexColor) in item.color_info"
                  :key="indexColor">
                  <span class="tcolumn">{{itemColor.color}}</span>
                  <span class="tcolumn">{{item.type === 1 ? $toFixed(itemColor.number/1000 || 0) + 'kg' : $toFixed(itemColor.number|| 0 ) + item.unit}}</span>
                </span>
              </span>
              <span class="tcolumn">{{$toFixed(item.color_info.map(items=>item.type === 1 ? items.number/1000 : items.number).reduce((a,b)=>{return Number(a)+Number(b)}))}}{{item.type === 1 ? 'kg' : item.unit}}</span>
            </span>
          </div>
        </div>
        <div class="flexTb"
          v-if="activeType === 'order'">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
              <span class="tcolumn noPad flex50">
                <span class="trow">
                  <span class="tcolumn">订购来源</span>
                  <span class="tcolumn noPad flex40">
                    <span class="trow">
                      <span class="tcolumn">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                      <span class="tcolumn">重量</span>
                      <span class="tcolumn">备注</span>
                      <span class="tcolumn">完成时间</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in totalInfo.order"
              :key="index">
              <span class="tcolumn">{{item.material_name}}</span>
              <span class="tcolumn noPad flex50">
                <span class="trow"
                  v-for="(itemSource,indexSource) in item.source_info"
                  :key="indexSource">
                  <span class="tcolumn">
                    <span :class="{'green':itemSource.type_source === 1,'orange':itemSource.type_source === 2}">{{itemSource.type_source === 1 ? '调取' : '订购'}}</span>
                    <span>{{itemSource.client_name || itemSource.stock_name}}</span>
                  </span>
                  <span class="tcolumn noPad flex40">
                    <span class="trow"
                      v-for="(itemColor,indexColor) in itemSource.color_info"
                      :key='indexColor'>
                      <span class="tcolumn">{{itemColor.color_code}}</span>
                      <span class="tcolumn">{{itemColor.weight}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                      <span class="tcolumn">
                        <template v-if="itemColor.desc">
                          <el-popover placement="top-start"
                            title="备注信息"
                            width="200"
                            trigger="hover"
                            :content="itemColor.desc">
                            <div class="btn noBorder"
                              slot="reference">查看</div>
                          </el-popover>
                        </template>
                        <template v-else>无</template>
                      </span>
                      <span class="tcolumn">{{$getTime(itemColor.complete_time)}}</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
        </div>
        <div class="flexTb"
          v-if="activeType === 'process'">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">加工单位</span>
              <span class="tcolumn noPad flex50">
                <span class="trow">
                  <span class="tcolumn">加工类型</span>
                  <span class="tcolumn noPad flex50">
                    <span class="trow">
                      <span class="tcolumn">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                      <span class="tcolumn noPad flex40">
                        <span class="trow">
                          <span class="tcolumn">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                          <span class="tcolumn">重量</span>
                          <span class="tcolumn">备注</span>
                          <span class="tcolumn">完成时间</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in totalInfo.process"
              :key="index">
              <span class="tcolumn">{{item.client_name}}</span>
              <span class="tcolumn noPad flex50">
                <span class="trow"
                  v-for="(itemType,indexType) in item.process_info"
                  :key="indexType">
                  <span class="tcolumn">{{itemType.process_type}}</span>
                  <span class="tcolumn noPad flex50">
                    <span class="trow"
                      v-for="(itemMa,indexMa) in itemType.material_info"
                      :key="indexMa">
                      <span class="tcolumn">{{itemMa.material_name}}</span>
                      <span class="tcolumn noPad flex40">
                        <span class="trow"
                          v-for="(itemColor,indexColor) in itemMa.color_info"
                          :key="indexColor">
                          <span class="tcolumn">{{itemColor.material_color}}</span>
                          <span class="tcolumn">{{itemColor.weight}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                          <span class="tcolumn">
                            <template v-if="itemColor.desc">
                              <el-popover placement="top-start"
                                title="备注信息"
                                width="200"
                                trigger="hover"
                                :content="itemColor.desc">
                                <div class="btn noBorder"
                                  slot="reference">查看</div>
                              </el-popover>
                            </template>
                            <template v-else>无</template>
                          </span>
                          <span class="tcolumn">{{$getTime(itemColor.complete_time)}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
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
    <div class="popup"
      v-show="easyHandlePopupFlag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyHandlePopupFlag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：一键添加操作可以统一选择出入库单位，如不需要可以选择直接跳过该步骤。
          </div>
          <div v-for="(item,index) in easyHandleInfo"
            :key="index"
            style="padding:8px;background:#f4f4f4;margin:8px 0;width:100%;box-sizing:border-box">
            <div class="row">
              <div class="label">物料名称：</div>
              <div class="info">{{item.material_name}}</div>
            </div>
            <div class="row">
              <div class="label">操作类型：</div>
              <div class="info elInputInfo">
                <el-select v-model="item.handleType"
                  class="elInput"
                  placeholder="请选择操作类型"
                  @change="getStockList">
                  <el-option v-for="item in editTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">{{item.handleType === 5 ? '入库仓库：' : '出入库单位：'}}</div>
              <div class="info">
                <template v-if="item.handleType === 5">
                  <el-select v-model="item.stockId"
                    class="elInput"
                    placeholder="请选择结余入库仓库">
                    <el-option v-for="items in stockArr"
                      :key="items.id"
                      :label="items.name"
                      :value="items.id">
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select v-model="item.client_name"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    placeholder="请选择出入库单位">
                    <el-option v-for="item in materialClient"
                      :key="item.client_id"
                      :label="item.client_name"
                      :value="item.client_id">
                    </el-option>
                  </el-select>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="stockHandles">直接跳过</div>
          <span class="btn btnBlue"
            @click="stockHandles">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { materialStock, weave, processing, replenish, materialManage, materialProcess, stock, material, yarnColor, sampleOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      orderInfo: {},
      materialStockInfo: [],
      stockEditInfo: [],
      materialClient: [],
      weaveInfo: [],
      weaveStockEditInfo: [],
      stockLog: [],
      stockLogTotal: 1,
      stockLogPages: 1,
      activeType: 'plan',
      totalInfo: {
        plan: [],
        order: [],
        process: []
      },
      easyHandlePopupFlag: false,
      easyHandleInfo: {
        client_name: '',
        handleType: 'out'
      },
      showFilterTypeBox: false,
      filterHandleType: '',
      handleTypeArr: [
        {
          value: 1,
          label: '出库'
        }, {
          value: 2,
          label: '入库'
        }, {
          value: 3,
          label: '最终入库'
        }, {
          value: 4,
          label: '织造出库'
        }
      ],
      showFilterClientBox: false,
      filterHandleClient: '',
      handleClientArr: [],
      cloneStockLog: [],
      editTypeArr: [
        {
          //   label: '出库',
          //   value: 'out'
          // }, {
          //   label: '入库',
          //   value: 'go'
          // }, {
          label: '最终入库',
          value: 'end_go'
        }, {
          label: '结余入库',
          value: 5
        }
      ],
      stockArr: [],
      orderLog: [],
      // 添加辅料客供逻辑
      materialList: [],
      colorList: [],
      confirmInfo: {}
    }
  },
  watch: {
    filterHandleType (newVal) {
      if (newVal) {
        if (this.filterHandleClient) {
          this.stockLog = this.cloneStockLog.filter(item => +item.type === +newVal && item.client_name === this.filterHandleClient).map(item => {
            return {
              checked: false,
              ...item
            }
          })
        } else {
          this.stockLog = this.cloneStockLog.filter(item => +item.type === +newVal).map(item => {
            return {
              checked: false,
              ...item
            }
          })
        }
      } else {
        if (this.filterHandleClient) {
          this.stockLog = this.cloneStockLog.filter(item => item.client_name === this.filterHandleClient).map(item => {
            return {
              checked: false,
              ...item
            }
          })
        } else {
          this.stockLog = this.cloneStockLog.map(item => {
            return {
              checked: false,
              ...item
            }
          })
        }
      }
    },
    filterHandleClient (newVal) {
      if (newVal) {
        if (this.filterHandleType) {
          this.stockLog = this.cloneStockLog.filter(item => +item.type === +this.filterHandleType && item.client_name === newVal).map(item => {
            return {
              checked: false,
              ...item
            }
          })
        } else {
          this.stockLog = this.cloneStockLog.filter(item => item.client_name === newVal).map(item => {
            return {
              checked: false,
              ...item
            }
          })
        }
      } else {
        if (this.filterHandleType) {
          this.stockLog = this.cloneStockLog.filter(item => +item.type === +this.filterHandleType).map(item => {
            return {
              checked: false,
              ...item
            }
          })
        } else {
          this.stockLog = this.cloneStockLog.map(item => {
            return {
              checked: false,
              ...item
            }
          })
        }
      }
    },
    stockEditInfo (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    }
  },
  methods: {
    // 添加辅料客供逻辑
    querySearchMaterial (queryString, callback, flag) {
      if (this.materialList.length === 0 || !flag) {
        material.list().then(res => {
          if (res.data.status !== false) {
            this.materialList = res.data.data.map(item => ({ value: item.name }))
            this.querySearchMaterial(queryString, callback, true)
          }
        })
      } else {
        callback(queryString ? this.materialList.filter(itemF => itemF.value.indexOf(queryString) !== -1) : this.materialList)
      }
    },
    querySearchColor (queryString, callback, flag) {
      if (this.colorList.length === 0 || !flag) {
        yarnColor.list().then(res => {
          if (res.data.status !== false) {
            this.colorList = res.data.data.map(item => ({ value: item.name }))
            this.querySearchColor(queryString, callback, true)
          }
        })
      } else {
        callback(queryString ? this.colorList.filter(itemF => itemF.value.indexOf(queryString) !== -1) : this.colorList)
      }
    },
    changeClient (item, e) {
      if (this.$route.params.orderType === '1') return
      const isCustomerSupplied = this.materialClient.find(itemF => itemF.client_id === e)
      if (isCustomerSupplied && isCustomerSupplied.isCustomerSupplied) {
        item.isCustomerSupplied = true
        item.editTypeDisabled = true
        item.editType = 'end_go'
      } else {
        item.isCustomerSupplied = false
        item.editTypeDisabled = false
        item.material_info = [{
          material_name: '',
          material_attribute: '',
          number: ''
        }]
      }
    },
    getStockList (event) {
      if (event === 5) {
        if (this.stockArr.length === 0) {
          stock.list().then(res => {
            if (res.data.status !== false) {
              this.stockArr = res.data.data.filter(item => item.type === 1).map(item => {
                return {
                  name: item.name,
                  id: item.id
                }
              })
            }
          })
        }
      } else {

      }
    },
    // 原料出入库module点击批量操作时
    batchBtnClick () {
      if (this.materialStockInfo.filter(item => item.checked).length === 0) {
        this.$message.warning('请勾选最少一款纱线原料')
        return
      }
      this.easyHandleInfo = this.materialStockInfo.filter(item => item.checked).map(item => {
        return {
          material_name: item.material_name,
          client_name: '',
          handleType: 'end_go'
        }
      })
      this.easyHandlePopupFlag = true
    },
    // 快捷按钮点击跳过与确定时
    stockHandles () {
      let data = this.materialStockInfo.filter(item => item.checked)
      let pushData = []
      data.forEach(item => {
        let flag = this.easyHandleInfo.find(items => items.material_name === item.material_name)
        let colorInfo = null
        if (flag.handleType === 'end_go') {
          colorInfo = item.color_info.filter(itemColor => this.$toFixed((itemColor.order_weight || 0) - (itemColor.goStockNumEnd || 0)) > 0)
        } else {
          colorInfo = item.color_info
        }
        let materialInfo = colorInfo.map(itemColor => {
          return {
            material_name: item.material_name,
            material_attribute: itemColor.attr,
            number: flag.handleType === 'end_go' ? this.$toFixed((itemColor.order_weight || 0) - (itemColor.goStockNumEnd || 0)) : '',
            color_info: item.color_info.map(itemColorInner => {
              return {
                name: itemColorInner.attr
              }
            })
          }
        })
        if (materialInfo.length !== 0) {
          pushData.push({
            client_name: flag ? flag.client_name : '',
            stockId: flag ? flag.stockId : '',
            editType: flag ? flag.handleType : 'end_go',
            material_info: materialInfo,
            time: this.$getTime(),
            remark: ''
          })
        }
      })
      if (pushData.length === 0) {
        this.$message.warning('检测到最终入库已完成，无需继续入库')
      } else {
        this.stockEditInfo.push(...pushData)
        this.easyHandleInfo = []
        this.easyHandlePopupFlag = false
        setTimeout(() => {
          this.$goElView('handleMaterial')
        })
      }
    },
    // 织造加工module点击批量操作时
    batchBtnClickWeave () {
      let checkedData = this.weaveInfo.filter(item => item.checked)
      if (checkedData.length === 0) {
        this.$message.warning('请勾选最少一个出库单位')
        return
      }
      let data = []
      checkedData.forEach(item => {
        item.material_info.forEach(itemMa => {
          let obj = {
            client_name: item.client_id,
            editType: 4,
            material_info: itemMa.color_info.filter(itemColor => this.$toFixed((itemColor.type === 1 ? itemColor.weight / 1000 : itemColor.weight) - (itemColor.outStockNum || 0)) > 0).map(itemColor => {
              return {
                material_name: itemMa.material_name,
                material_attribute: itemColor.attr,
                number: this.$toFixed((itemColor.type === 1 ? itemColor.weight / 1000 : itemColor.weight) - (itemColor.outStockNum || 0)),
                color_info: itemMa.color_info.map(itemColorInner => {
                  return {
                    name: itemColorInner.attr
                  }
                })
              }
            }),
            time: this.$getTime(),
            remark: ''
          }
          if (obj.material_info.length !== 0) {
            this.changeMaterialInfo(item.client_id, obj)
            data.push(obj)
          }
        })
      })
      if (data.length === 0) {
        this.$message.warning('检测到物料已出库完成，无需出库')
        return
      }
      this.weaveStockEditInfo.push(...data)
      setTimeout(() => {
        this.$goElView('handleWeave')
      })
    },
    // 批量导出excel
    download () {
      let data = this.stockLog.filter(value => value.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.type_name = item.type === 1 ? '出库' : item.type === 2 ? '入库' : '最终入库'
        return item
      })
      downloadExcel(data, [
        { title: '出入库时间', key: 'complete_time' },
        { title: '出入库单位', key: 'client_name' },
        { title: this.$route.params.type === '1' ? '原料名称' : '辅料名称', key: 'material_name' },
        { title: '颜色', key: 'material_color' },
        { title: '数量', key: 'total_weight' },
        { title: '操作类型', key: 'type_name' },
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
          checkedArr = this.stockLog.filter(value => value.checked).map(value => value.id)
        } else {
          checkedArr.push(item)
        }
        materialStock.delete({
          id: checkedArr
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.initData(this.$route.params.type)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveAll (type) {
      let data = []
      let surplusData = []
      let exceedMaterialInfo = []
      let flag = {
        client: true,
        editType: true,
        name: true,
        attr: true,
        weight: true,
        time: true,
        stockId: true
      }
      if (type === 'material') {
        this.stockEditInfo.forEach(item => {
          if (!item.editType) {
            flag.editType = false
          }
          if (!item.time) {
            flag.time = false
          }
          if ((+item.editType === 5 && !item.stockId)) {
            flag.stockId = false
          }
          item.material_info.forEach(itemMa => {
            if (!itemMa.material_name) {
              flag.name = false
            }
            if (!itemMa.material_attribute) {
              flag.attr = false
            }
            if (!itemMa.number) {
              flag.weight = false
            }
            if (+item.editType === 5) {
              surplusData.push({
                order_id: this.$route.params.id,
                type: this.$route.params.type,
                weight: itemMa.number,
                company_id: window.sessionStorage.getItem('company_id'),
                stock_id: item.stockId,
                color_code: itemMa.material_attribute,
                material_name: itemMa.material_name,
                desc: item.remark
              })
            } else {
              let finded = this.orderLog.find((itemFind) => itemFind.material_name === itemMa.material_name && itemFind.color_code === itemMa.material_attribute && itemFind.type_source !== 2)
              data.push({
                order_client: finded ? finded.client_id : '', // 物料订购单位
                price: finded ? finded.price : 0, // 单价
                order_id: this.$route.params.id,
                client_id: item.client_name,
                material_name: itemMa.material_name,
                order_type: this.$route.params.orderType,
                material_color: itemMa.material_attribute,
                total_weight: itemMa.number,
                complete_time: item.time,
                desc: item.remark,
                type: item.editType === 'out' ? 1 : item.editType === 'go' ? 2 : 3,
                material_type: this.$route.params.type
              })
            }
          })
        })
      } else if (type === 'weave') {
        this.weaveStockEditInfo.forEach(item => {
          if (!item.client_name) {
            flag.client = false
          }
          if (!item.time) {
            flag.time = false
          }
          item.material_info.forEach(itemMa => {
            if (!itemMa.material_name) {
              flag.name = false
            }
            if (!itemMa.material_attribute) {
              flag.attr = false
            }
            if (!itemMa.number) {
              flag.weight = false
            }
            data.push({
              order_id: this.$route.params.id,
              client_id: item.client_name,
              material_name: itemMa.material_name,
              order_type: this.$route.params.orderType,
              material_color: itemMa.material_attribute,
              total_weight: itemMa.number,
              complete_time: item.time,
              desc: item.remark,
              type: 4,
              material_type: this.$route.params.type
            })
          })
        })
        // 检测织造出库数量书否超出已入库数量
        let outStockInfo = []
        this.weaveInfo.forEach(item => {
          item.material_info.forEach(itemMa => {
            itemMa.color_info.forEach(itemColor => {
              outStockInfo.push({
                material_name: itemMa.material_name,
                material_color: itemColor.attr,
                outStockNum: itemColor.outStockNum || 0
              })
            })
          })
        })
        data.forEach(item => {
          outStockInfo.push({
            material_name: item.material_name,
            material_color: item.material_color,
            outStockNum: item.total_weight || 0
          })
        })
        outStockInfo = this.$mergeData(outStockInfo, { mainRule: ['material_name', 'material_color'], otherRule: [{ name: 'outStockNum', type: 'add' }] })
        outStockInfo.forEach(item => {
          let flag = this.materialStockInfo.find(items => items.material_name === item.material_name)
          if (flag) {
            let innerFlag = flag.color_info.find(items => items.attr === item.material_color)
            if (innerFlag) {
              if (this.$toFixed(innerFlag.goStockNumEnd || 0) < this.$toFixed(item.outStockNum)) {
                exceedMaterialInfo.push('物料:“' + item.material_name + '”，颜色/属性：“' + item.material_color + '”')
              }
            }
          }
        })
      }
      if (exceedMaterialInfo.length > 0) {
        this.$message.error({
          dangerouslyUseHTMLString: true,
          message: '检测到您所织造出库的原料大于已入库数<br />请做出调整；具体超出信息：<br />' + exceedMaterialInfo.join('<br />')
        })
        return
      }
      if (!flag.client) {
        this.$message.error('检测到未选择出入库单位，请选择')
        return
      }
      if (!flag.editType) {
        this.$message.error('检测到未选择操作类型，请选择')
        return
      }
      if (!flag.stockId) {
        this.$message.error('检测到结余入库未选择入库仓库，请选择')
        return
      }
      if (!flag.name) {
        this.$message.error('检测到未选择物料名称，请选择')
        return
      }
      if (!flag.attr && this.$route.params.type === '1') {
        this.$message.error('检测到未选择物料属性，请选择')
        return
      }
      if (!flag.weight) {
        this.$message.error('检测到未填写操作数量，请填写')
        return
      }
      if (!flag.time) {
        this.$message.error('检测到未选择出入库时间，请选择')
        return
      }
      // 订单物料出入库
      if (data.length > 0) {
        materialStock.create({ data: data }).then(res => {
          if (res.data.status !== false) {
            this.initData(this.$route.params.type)
            this.stockEditInfo = []
            this.weaveStockEditInfo = []
            this.$message.success('保存成功')
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/materialStock/materialStockDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType
              this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料出入库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.initData(this.$route.params.type)
            }
          }
        })
      }
      // 订单结余入库
      if (surplusData.length > 0) {
        console.log(surplusData)
        materialStock.surplusCreate({ data: surplusData }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('保存成功')
            this.initData(this.$route.params.type)
          }
        })
      }
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    addItem (item, type) {
      if (type === 'stock') {
        let obj = {
          client_name: '',
          editType: 'end_go',
          stockId: '',
          material_info: [
            {
              material_name: '',
              material_attribute: '',
              number: ''
            }
          ],
          time: this.$getTime(),
          remark: ''
        }
        item.push(obj)
      } else if (type === 'process') {
        let obj = {
          client_name: '',
          editType: 4,
          material_info: [
            {
              material_name: '',
              material_attribute: '',
              number: ''
            }
          ],
          time: this.$getTime(),
          remark: ''
        }
        item.push(obj)
      } else if (type === 'material') {
        item.push({
          material_name: '',
          material_attribute: '',
          number: ''
        })
      }
    },
    // 原料出入库module点击表格内操作时
    handleClick (item, itemInner, type) {
      let num = this.$toFixed((+itemInner.order_weight || 0) + (+itemInner.replenish_order_weight || 0) - (+itemInner.goStockNumEnd || 0))
      let materialInfo = {
        material_name: item.material_name,
        material_attribute: itemInner.attr,
        number: num,
        material_type: itemInner.type
      }
      let obj = {
        client_name: '',
        editType: type,
        material_info: [materialInfo],
        time: this.$getTime(),
        remark: ''
      }
      this.changeColorInfo(item.material_name, materialInfo)
      this.stockEditInfo.push(obj)
      setTimeout(() => {
        this.$goElView('handleMaterial')
      })
    },
    // 织造加工module点击表格内操作时
    handleClickProcess (item, itemMa, itemColor) {
      let num = this.$toFixed((itemColor.type === 1 ? (+itemColor.weight + +itemColor.replenish_weight) / 1000 : (+itemColor.weight + +itemColor.replenish_weight)) - (+itemColor.outStockNum || 0))
      let materialInfo = {
        material_name: itemMa.material_name,
        material_attribute: itemColor.attr,
        number: num > 0 ? num : 0
      }
      let obj = {
        client_name: item.client_id,
        editType: 4,
        material_info: [materialInfo],
        time: this.$getTime(),
        remark: ''
      }
      this.changeMaterialInfo(item.client_id, obj)
      this.changeAttrInfo(itemMa.material_name, obj, materialInfo)
      this.weaveStockEditInfo.push(obj)
      setTimeout(() => {
        this.$goElView('handleWeave')
      })
    },
    // 原料出入库module改变原料时
    changeColorInfo (eve, item) {
      item.color_info = this.materialStockInfo.find(items => items.material_name === eve).color_info.map(value => {
        return {
          name: value.attr
        }
      })
    },
    // 织造加工module改变出库单位时
    changeMaterialInfo (eve, item) {
      item.materialInfo = this.weaveInfo.find(items => items.client_id === eve).material_info
    },
    // 织造加工module改变原料时
    changeAttrInfo (eve, item, itemInner) {
      itemInner.color_info = item.materialInfo.find(items => items.material_name === eve).color_info.map(value => {
        return {
          name: value.attr
        }
      })
    },
    // 重置
    resetEditInfo (type) {
      if (type === 'stock') {
        this.$confirm('此操作将清空数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.stockEditInfo = []
          this.$message({
            type: 'success',
            message: '已重置'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else if (type === 'weave') {
        this.$confirm('此操作将清空数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.weaveStockEditInfo = []
          this.$message({
            type: 'success',
            message: '已重置'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 初始化
    initData (type) {
      this.loading = true
      if (type === '1') {
        Promise.all([
          materialStock.init({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          }),
          materialStock.detail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          }),
          weave.detail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          }),
          replenish.list({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          }),
          materialManage.detail({
            order_type: this.$route.params.orderType,
            order_id: this.$route.params.id
          }),
          processing.matDetail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          })
        ]).then(res => {
          this.orderLog = res[4].data.data
          // 初始化原料出入库数据
          let materialPlan = res[0].data.data.order_material_plan.total_data.filter(item => (Number(item.material_type) === 1) && (+item.reality_weight > 0)).concat(res[3].data.data.filter(item => +item.type === 1).map(item => {
            return {
              material_name: item.material_name,
              material_attribute: item.material_color,
              updated_at: item.created_at,
              replenish_order_weight: item.order_weight,
              material_type: item.type,
              unit: 'g'
            }
          }))
          this.orderInfo = res[0].data.data.order_info
          this.materialStockInfo = this.$mergeData(materialPlan, { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'replenish_order_weight', type: 'add' }, { name: 'unit' }, { name: 'updated_at' }, { name: 'material_type/type' }] } })
          this.materialClient = this.$mergeData(res[0].data.data.material_order_client.concat(res[0].data.data.material_process_client), { mainRule: ['client_name', 'client_id'] })
          // 初始化织造出入库数据
          console.log(res[5].data.data)
          this.weaveInfo = this.$mergeData(res[2].data.data, { mainRule: 'client_name', otherRule: [{ name: 'material_assign/material_info', type: 'concat' }, { name: 'client_id' }] }).map(items => {
            return {
              checked: false,
              client_name: items.client_name,
              client_id: items.client_id,
              material_info: this.$mergeData(items.material_info, { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'material_weight/weight', type: 'add' }, { name: 'material_unit/unit' }, { name: 'material_type/type' }] } })
            }
          }).concat(this.$mergeData(res[5].data.data.filter((item) => item.material_type === 1), { mainRule: ['client_id', 'product_flow/process'], otherRule: [{ name: 'client_name' }], childrenName: 'material_info', childrenRule: { mainRule: 'material_name', childrenName: 'color_info', otherRule: [{ name: 'number/weight', type: 'add' }] } }))
          this.weaveInfo.forEach((item) => {
            item.material_info.forEach((itemChild) => {
              itemChild.color_info.forEach((itemSon) => {
                itemSon.attr = itemSon.material_attribute
              })
            })
          })
          // 合并补纱信息入织造出入库
          res[3].data.data.filter(item => +item.type === 1).forEach(item => {
            let flag = this.weaveInfo.find(items => items.client_name === item.replenish_name)
            if (flag) {
              let innerFlag = flag.material_info.find(items => items.material_name === item.material_name)
              if (innerFlag) {
                let innerFlag2 = innerFlag.color_info.find(items => items.attr === item.material_color)
                if (innerFlag2) {
                  innerFlag2.replenish_weight = this.$toFixed((innerFlag2.replenish_weight || 0) + (item.need_weight * 1000 || 0))
                } else {
                  innerFlag.color_info.push({
                    attr: item.material_color,
                    replenish_weight: item.need_weight * 1000 || 0,
                    unit: 'g',
                    type: 1
                  })
                }
              }
            }
          })
          // 初始化统计数据
          this.totalInfo.plan = this.$mergeData(materialPlan.map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.reality_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          // 初始化日志信息
          this.cloneStockLog = this.$clone(res[1].data.data.filter(item => Number(item.material_type) === 1))
          this.handleClientArr = this.$mergeData(this.cloneStockLog, { mainRule: 'client_name' }).map(item => {
            return {
              client_name: item.client_name
            }
          })
          this.stockLog = res[1].data.data.filter(item => Number(item.material_type) === 1).map(item => {
            return {
              ...item,
              checked: false
            }
          })
          // this.stockLogTotal = this.stockLog.length
          this.stockLog.forEach(item => {
            let materialFlag = this.materialStockInfo.find(value => value.material_name === item.material_name)
            if (materialFlag) {
              let colorFlag = materialFlag.color_info.find(value => value.attr === item.material_color)
              if (colorFlag) {
                if (item.type === 3) {
                  colorFlag.goStockNumEnd = Number(colorFlag.goStockNumEnd || 0) + Number(item.total_weight)
                }
              }
            }
            let clientFlag = this.weaveInfo.find(value => value.client_name === item.client_name)
            if (clientFlag) {
              let materialFlag = clientFlag.material_info.find(value => value.material_name === item.material_name)
              if (materialFlag) {
                let colorFlag = materialFlag.color_info.find(value => (value.attr === item.material_color || (value.attr === undefined && item.material_color === '')))
                if (colorFlag) {
                  if (item.type === 4) {
                    colorFlag.outStockNum = Number(colorFlag.outStockNum || 0) + Number(item.total_weight)
                  }
                }
              }
            }
          })
          this.loading = false
        })
      } else if (type === '2') {
        Promise.all([
          materialStock.init({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          }),
          materialStock.detail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          }),
          processing.matDetail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          })
        ]).then(res => {
          console.log(res[2].data.data)
          // 初始化辅料出入库数据
          let materialPlan = res[0].data.data.order_material_plan.total_data.filter(item => (Number(item.material_type) === 2) && (+item.reality_weight > 0))
          this.orderInfo = res[0].data.data.order_info
          this.materialStockInfo = this.$mergeData(materialPlan.filter(itemMa => Number(itemMa.order_weight) && Number(itemMa.order_weight) !== 0), { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'unit' }, { name: 'updated_at' }, { name: 'material_type/type' }] } })
          this.materialClient = this.$mergeData(res[0].data.data.material_process_client.concat(res[0].data.data.material_order_client), { mainRule: ['client_name', 'client_id'] })
          // 添加客供逻辑
          this.materialClient.unshift({
            client_name: `${this.orderInfo.client_name}(客供)`,
            client_id: this.orderInfo.client_id,
            isCustomerSupplied: true
          })
          // 初始化加工出入库数据
          this.weaveInfo = this.$mergeData(res[2].data.data.filter((item) => item.material_type === 2), { mainRule: ['client_id', 'product_flow/process'], otherRule: [{ name: 'client_name' }], childrenName: 'material_info', childrenRule: { mainRule: 'material_name', childrenName: 'color_info', otherRule: [{ name: 'number/weight', type: 'add' }] } })
          this.weaveInfo.forEach((item) => {
            item.material_info.forEach((itemChild) => {
              itemChild.color_info.forEach((itemSon) => {
                itemSon.attr = itemSon.material_attribute
              })
            })
          })
          // 初始化统计数据
          this.totalInfo.plan = this.$mergeData(materialPlan.map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.reality_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          // 初始化日志信息
          this.cloneStockLog = this.$clone(res[1].data.data.filter(item => Number(item.material_type) === 2))
          this.handleClientArr = this.$mergeData(this.$clone(this.cloneStockLog), { mainRule: 'client_name' }).map(item => {
            return {
              client_name: item.client_name
            }
          })
          this.stockLog = res[1].data.data.filter(item => Number(item.material_type) === 2).map(item => {
            return {
              ...item,
              checked: false
            }
          })
          // this.stockLogTotal = this.stockLog.length
          this.stockLog.forEach(item => {
            let materialFlag = this.materialStockInfo.find(value => value.material_name === item.material_name)
            if (materialFlag) {
              let colorFlag = materialFlag.color_info.find(value => value.attr === item.material_color)
              if (colorFlag) {
                if (item.type === 3) {
                  colorFlag.goStockNumEnd = Number(colorFlag.goStockNumEnd || 0) + Number(item.total_weight)
                }
              }
            } else {
              this.materialStockInfo.push({
                material_name: item.material_name,
                checked: false,
                unit: '个',
                color_info: [
                  {
                    attr: item.material_color,
                    order_weight: 0,
                    goStockNumEnd: Number(item.total_weight),
                    updated_at: null
                  }
                ]
              })
            }
            let clientFlag = this.weaveInfo.find(value => value.client_name === item.client_name)
            if (clientFlag) {
              let materialFlag = clientFlag.material_info.find(value => value.material_name === item.material_name)
              if (materialFlag) {
                let colorFlag = materialFlag.color_info.find(value => (value.attr === item.material_color || (value.attr === undefined && item.material_color === '')))
                if (colorFlag) {
                  if (item.type === 4) {
                    colorFlag.outStockNum = Number(colorFlag.outStockNum || 0) + Number(item.total_weight)
                  }
                }
              }
            }
          })
          this.loading = false
        })
      }
    },
    // 监听织造不能同时选择
    watchCheckedNum (eve, item) {
      if (eve && this.weaveInfo.filter(items => items.checked).length > 1) {
        this.$message.warning('单次只能对一个单位进行批量操作')
        item.checked = false
      }
    },
    // 获取订购日志
    getMaterialOrder () {
      this.activeType = 'order'
      materialManage.detail({
        order_type: this.$route.params.orderType,
        order_id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          let data = this.$mergeData(res.data.data.filter(item => +item.type === +this.$route.params.type), { mainRule: ['material_name'], childrenName: 'source_info', childrenRule: { mainRule: ['client_name', 'type_source', 'stock_name'], childrenName: 'color_info', childrenRule: { mainRule: 'before_color/color_code', otherRule: [{ name: 'weight', type: 'add' }, { name: 'type' }, { name: 'unit' }, { name: 'desc' }, { name: 'complete_time' }] } } })
          this.totalInfo.order = data
        }
      })
    },
    // 获取加工日志
    getMaterialProcess () {
      this.activeType = 'process'
      materialProcess.detail({
        order_type: this.$route.params.orderType,
        order_id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          let data = this.$mergeData(res.data.data.filter(item => +item.type === +this.$route.params.type), { mainRule: ['client_name'], childrenName: 'process_info', childrenRule: { mainRule: 'process_type', childrenName: 'material_info', childrenRule: { mainRule: 'material_name', childrenName: 'color_info', childrenRule: { mainRule: 'material_color', otherRule: [{ name: 'weight', type: 'add' }, { name: 'unit' }, { name: 'complete_time' }, { name: 'type' }] } } } })
          this.totalInfo.process = data
        }
      })
    }
  },
  created () {
    this.initData(this.$route.params.type)
    if (this.$route.params.orderType === '2') {
      sampleOrder.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          this.confirmInfo = res.data.data
        }
      })
    }
  },
  computed: {
    checkWhichYarn () {
      return this.materialStockInfo.filter(item => item.checked)
    },
    checkWhichWeave () {
      return this.weaveInfo.filter(item => item.checked)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialStock/materialStockDetail.less";
</style>
<style lang="less">
#materialStockDetail {
  .filterInput {
    .el-input__inner {
      height: 32px !important;
    }
  }
}
</style>
