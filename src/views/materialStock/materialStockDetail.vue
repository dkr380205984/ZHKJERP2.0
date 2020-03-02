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
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type === '1' ? '原' : '辅'}}料出入库</span>
      </div>
      <template v-if="materialStockInfo.length > 0">
        <!-- <div class="listCtn hasBorderTop"
          style="padding:20px 0">
          <zh-transition :list="materialStockInfo"
            markId="1"
            showKey='material_name'
            @changed="catActiveMaterial"></zh-transition>
          <div class="flexTb"
            style="margin:20px 32px 0 ">
            <div class="thead">
              <span class="trow">
                <span class="tcolumn">颜色</span>
                <span class="tcolumn">订购数量</span>
                <span class="tcolumn">已入库数量</span>
                <span class="tcolumn">待入库数量</span>
                <span class="tcolumn">更新时间</span>
                <span class="tcolumn center">操作</span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow"
                v-for="(itemColor,indexColor) in activeMaterialInfo"
                :key="indexColor">
                <span class="tcolumn">{{itemColor.attr}}</span>
                <span class="tcolumn">{{itemColor.order_weight}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                <span class="tcolumn">{{$toFixed(itemColor.goStockNumEnd || 0)}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                <span class="tcolumn">{{$toFixed(Number(itemColor.order_weight ? itemColor.order_weight : 0) - Number(itemColor.goStockNumEnd ? itemColor.goStockNumEnd : 0))}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                <span class="tcolumn">{{itemColor.updated_at}}</span>
                <span class="tcolumn center">
                  <span class="trow"
                    style="align-items: center;">
                    <div class="btn noBorder noMargin"
                      @click="handleClick(itemColor,'out')">出库</div>
                    <div class="btn noBorder"
                      @click="handleClick(itemColor,'end_go')">入库</div>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="editCtn bgGary_page"
            style="margin:20px 32px 0 32px;padding: 20px 0;"
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
                    placeholder="请选择出入库单位">
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
                  <el-radio-group v-model="itemStock.editType"
                    class="elInput">
                    <el-radio label="out">出库</el-radio>
                    <el-radio label="go">入库</el-radio>
                    <el-radio label="end_go">最终入库</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-select v-model="itemStock.material_name"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    :placeholder="'请选择需要操作的' + ($route.params.type === '1' ? '原' : '辅') +'料'"
                    @change="changeColorInfo($event,itemStock)">
                    <el-option v-for="item in materialStockInfo"
                      :key="item.id"
                      :label="item.material_name"
                      :value="item.material_name">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content middle_page col">
                  <el-select v-model="itemStock.material_attribute"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    :placeholder="'请选择需要操作的'+($route.params.type === '1' ? '原' : '辅') + '料颜色'"
                    @change="changeType($event,itemStock)">
                    <el-option v-for="item in itemStock.color_info"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">出入库重量</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入入库数量"
                    class="elInput"
                    v-model="itemStock.number"
                    type='number'></zh-input>
                </div>
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
          <div class="addRows"
            style="margin:16px 32px 0 32px">
            <span class="once"
              v-if="stockEditInfo.length === 0"
              @click="addItem(stockEditInfo,'stock')">普通出入库</span>
            <span class="once"
              v-if="stockEditInfo.length === 0"
              @click="stockAll(stockEditInfo,'end_go')">一键入库</span>
            <span class="once cancle"
              v-if="stockEditInfo.length"
              @click="resetEditInfo('stock')">取消</span>
            <span class="once normal"
              v-if="stockEditInfo.length > 0"
              @click="addItem(stockEditInfo,'stock')">添加出入库</span>
            <span class="once ok"
              v-if="stockEditInfo.length > 0"
              @click="saveAll('material')">确认</span>
          </div>
        </div> -->
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
              <div class="flexTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn"
                      style="flex:0.2">选择</div>
                    <div class="tcolumn">{{$route.params.type==='1'?'原':'辅'}}料名称</div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcolumn">{{$route.params.type==='1'?'颜色':'属性'}}名称</div>
                        <span class="tcolumn">订购数量</span>
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
                        <span class="tcolumn">{{itemColor.order_weight}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                        <span class="tcolumn">{{$toFixed(itemColor.goStockNumEnd || 0)}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                        <span class="tcolumn">{{$toFixed(Number(itemColor.order_weight ? itemColor.order_weight : 0) - Number(itemColor.goStockNumEnd ? itemColor.goStockNumEnd : 0))}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                        <span class="tcolumn">{{$getTime(itemColor.updated_at)}}</span>
                        <span class="tcolumn center"
                          style="flex:1.5">
                          <span class="trow"
                            style="align-items: center;">
                            <div class="btn noBorder noMargin"
                              @click="handleClick(item,itemColor,'out')">出库</div>
                            <div class="btn noBorder"
                              @click="handleClick(item,itemColor,'end_go')">入库</div>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="editCtn bgGary_page"
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
                          placeholder="请选择出入库单位">
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
                        <el-radio-group v-model="itemStock.editType"
                          class="elInput">
                          <el-radio label="out">出库</el-radio>
                          <el-radio label="go">入库</el-radio>
                          <el-radio label="end_go">最终入库</el-radio>
                        </el-radio-group>
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
                    @click="addItem(stockEditInfo,'stock')">普通出入库</span>
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
        <div class="normalCtn hasBorderTop">暂无任何原料订购信息</div>
      </template>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type === '1' ? '原' : '辅'}}料{{$route.params.type === '1' ? '织造' : '加工'}}出库</span>
      </div>
      <template v-if="weaveInfo.length !== 0">
        <!-- <zh-transition :list="weaveInfo"
          markId="2"
          showKey="client_name"
          @changed="catActiveClient"></zh-transition>
        <div class="listCtn">
          <div class="flexTb"
            style="margin:1px">
            <div class="thead">
              <span class="trow">
                <span class="tcolumn">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                <span class="tcolumn noPad flex5">
                  <span class="trow">
                    <span class="tcolumn">颜色</span>
                    <span class="tcolumn">分配数量</span>
                    <span class="tcolumn">已出库数量</span>
                    <span class="tcolumn">待出库数量</span>
                    <span class="tcolumn center">操作</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow"
                v-for="(itemMa,indexMa) in activeProcessInfo"
                :key="indexMa">
                <span class="tcolumn">{{itemMa.material_name}}</span>
                <span class="tcolumn noPad flex5">
                  <span class="trow"
                    v-for="(itemColor,indexColor) in itemMa.color_info"
                    :key="indexColor">
                    <span class="tcolumn">{{itemColor.attr}}</span>
                    <span class="tcolumn">{{itemColor.unit === 'g' ? $toFixed(itemColor.weight/1000 || 0) : $toFixed(itemColor.weight || 0)}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                    <span class="tcolumn">{{itemColor.unit === 'g' ? $toFixed((itemColor.outStockNum || 0)) : $toFixed((itemColor.outStockNum || 0))}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                    <span class="tcolumn">{{itemColor.unit === 'g' ? $toFixed(itemColor.weight/1000 - (itemColor.outStockNum || 0)) : $toFixed(itemColor.weight - (itemColor.outStockNum || 0))}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                    <span class="tcolumn center">
                      <span class="btn noBorder noMargin"
                        @click="handleClickProcess(itemColor,itemMa)">出库</span>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="editCtn bgGary_page"
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
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-select v-model="itemWeave.material_name"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    :placeholder="'请选择需要操作的'+($route.params.type === '1' ? '原' : '辅')+'料'"
                    @change="changeAttrInfo($event,itemWeave)">
                    <el-option v-for="item in itemWeave.materialInfo"
                      :key="item.id"
                      :label="item.material_name"
                      :value="item.material_name">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">{{$route.params.type === '1' ? '原' : '辅'}}料颜色</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-select v-model="itemWeave.material_attribute"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    :placeholder="'请选择需要操作的'+($route.params.type === '1' ? '原' : '辅')+'料颜色'">
                    <el-option v-for="item in itemWeave.color_info"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">出库重量</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入入库数量"
                    class="elInput"
                    v-model="itemWeave.number"
                    type='number'></zh-input>
                </div>
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
                    class="elInput"
                    type="date"
                    value-format="yyyy-MM-dd"
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
                    class="elInput"
                    v-model="itemWeave.remark"></zh-input>
                </div>
              </div>
            </div>
          </div>
          <div class="addRows"
            style="margin:16px 32px 0 32px">
            <span class="once"
              v-if="weaveStockEditInfo.length === 0"
              @click="addItem(weaveStockEditInfo,'process')">普通出库</span>
            <span class="once"
              v-if="weaveStockEditInfo.length === 0"
              @click="stockAll(weaveStockEditInfo,'process')">一键出库</span>
            <span class="once cancle"
              v-if="weaveStockEditInfo.length"
              @click="resetEditInfo('weave')">重置</span>
            <span class="once normal"
              v-if="weaveStockEditInfo.length > 0"
              @click="addItem(weaveStockEditInfo,'stock')">添加出库</span>
            <span class="once ok"
              v-if="weaveStockEditInfo.length > 0"
              @click="saveAll('weave')">确认</span>
          </div>
        </div> -->
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <el-tooltip class="item"
                effect="dark"
                :content="checkWhichWeave.length===0?'请选取单位进行批量操作':'批量操作'"
                placement="top">
                <div class="btn"
                  :class="{'btnGray':checkWhichWeave.length===0,'btnWhiteBlue':checkWhichWeave.length>0}"
                  @click="batchBtnClickWeave">批量操作</div>
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
                    <div class="tcolumn">单位名称</div>
                    <div class="tcolumn noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcolumn">{{$route.params.type==='1'?'原':'辅'}}料名称 </div>
                        <div class="tcolumn noPad"
                          style="flex:5">
                          <div class="trow">
                            <div class="tcolumn">{{$route.params.type==='1'?'颜色':'属性'}}</div>
                            <span class="tcolumn">分配数量</span>
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
                      <el-checkbox v-model="item.checked"></el-checkbox>
                    </div>
                    <div class="tcolumn">{{item.client_name}}</div>
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
                            <span class="tcolumn">{{itemColor.unit === 'g' ? $toFixed(itemColor.weight/1000 || 0) : $toFixed(itemColor.weight || 0)}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                            <span class="tcolumn">{{itemColor.unit === 'g' ? $toFixed((itemColor.outStockNum || 0)) : $toFixed((itemColor.outStockNum || 0))}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
                            <span class="tcolumn">{{itemColor.unit === 'g' ? $toFixed(itemColor.weight/1000 - (itemColor.outStockNum || 0)) : $toFixed(itemColor.weight - (itemColor.outStockNum || 0))}}{{itemColor.unit === 'g' ? 'kg' : itemColor.unit}}</span>
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
                    @click="addItem(weaveStockEditInfo,'process')">普通出库</span>
                  <span class="once cancle"
                    v-if="weaveStockEditInfo.length > 0"
                    @click="resetEditInfo('weave')">取消</span>
                  <span class="once normal"
                    v-if="weaveStockEditInfo.length > 0"
                    @click="addItem(weaveStockEditInfo,'process')">添加出入库</span>
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
    <div class="module">
      <div class="titleCtn">
        <div class="title">出入库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          id='yarn'>
          <div class="btn noBorder noMargin"
            @click="deleteLog('all',stockLog)">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="download">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">出入库时间</span>
            <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
            <span class="tb_row flex08">颜色</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">操作类型</span>
            <span class="tb_row flex08">操作人</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in stockLog[stockLogPages-1]"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.complete_time}}</span>
            <span class="tb_row">{{itemLog.material_name}}</span>
            <span class="tb_row flex08">{{itemLog.material_color}}</span>
            <span class="tb_row flex08">{{itemLog.total_weight}}</span>
            <span class="tb_row flex08">{{itemLog.type|filterType}}</span>
            <span class="tb_row flex08">{{itemLog.user_name}}</span>
            <span class="tb_row middle flex08">
              <!-- <span class="tb_handle_btn blue">打印</span> -->
              <span class="tb_handle_btn red"
                @click="deleteLog('one',itemLog.id)">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="stockLogTotal"
            :current-page.sync="stockLogPages">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- <div class="module">
      <div class="titleCtn">
        <div class="title">出库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          id='yarn'>
          <div class="btn noBorder noMargin"
            @click="deleteLog(yarnLog,'yarnLog')">批量删除</div>
          <div class="btn noBorder noMargin">批量打印</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">入库时间</span>
            <span class="tb_row">原料名称</span>
            <span class="tb_row flex08">颜色</span>
            <span class="tb_row flex08">数量（kg）</span>
            <span class="tb_row flex08">操作人</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in goStockLog"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.create_time}}</span>
            <span class="tb_row">{{itemLog.material_name}}</span>
            <span class="tb_row flex08">{{itemLog.color_code}}</span>
            <span class="tb_row">{{itemLog.action|filterAction}}</span>
            <span class="tb_row flex08">{{itemLog.weight}}</span>
            <span class="tb_row flex08">{{itemLog.user_name}}</span>
            <span class="tb_row middle flex08">
              <span class="tb_handle_btn blue">打印</span>
              <span class="tb_handle_btn red">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="goStockLogTotal"
            :current-page.sync="goStockLogPages"
            @current-change='getGoStockLog'>
          </el-pagination>
        </div>
      </div>
    </div> -->
    <div class="module">
      <div class="detailCtn noPadding">
        <div class="swichCtn">
          <div :class="{'swich':true,'active':activeType === 'plan'}"
            @click="activeType = 'plan'">计划</div>
          <div :class="{'swich':true,'active':activeType === 'order'}"
            @click="activeType = 'order'">采购</div>
          <div :class="{'swich':true,'active':activeType === 'process'}"
            @click="activeType = 'process'">加工</div>
        </div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">计划原料</span>
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
              v-for="(item,index) in totalInfo[activeType]"
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
              <span class="tcolumn">{{item.color_info.map(items=>item.type === 1 ? items.number/1000 : items.number).reduce((a,b)=>{return Number(a)+Number(b)})}}{{item.type === 1 ? 'kg' : item.unit}}</span>
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
                <el-radio-group v-model="item.handleType"
                  class="elInput">
                  <el-radio label="out">出库</el-radio>
                  <el-radio label="go">入库</el-radio>
                  <el-radio label="end_go">最终入库</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label">出入库单位：</div>
              <div class="info">
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
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="stockHandles">直接跳过</div>
          <a href="#order"
            class="btn btnBlue"
            @click="stockHandles">确定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { materialStock, weave, processing, replenish } from '@/assets/js/api.js'
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
      }
    }
  },
  methods: {
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
          handleType: 'out'
        }
      })
      this.easyHandlePopupFlag = true
    },
    // 快捷按钮点击跳过与确定时
    stockHandles () {
      let data = this.materialStockInfo.filter(item => item.checked)
      this.stockEditInfo.push(...data.map(item => {
        let flag = this.easyHandleInfo.find(items => items.material_name === item.material_name)
        return {
          client_name: flag ? flag.client_name : '',
          editType: flag ? flag.handleType : 'out',
          material_info: item.color_info.map(itemColor => {
            return {
              material_name: item.material_name,
              material_attribute: itemColor.attr,
              number: this.$toFixed((itemColor.order_weight || 0) - (itemColor.goStockNumEnd || 0))
            }
          }),
          time: this.$getTime(),
          remark: ''
        }
      }))
      this.easyHandleInfo = []
      this.easyHandlePopupFlag = false
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
          data.push({
            client_name: item.client_id,
            editType: 'out',
            material_info: itemMa.color_info.map(itemColor => {
              return {
                material_name: itemMa.material_name,
                material_attribute: itemColor.attr,
                number: this.$toFixed((itemColor.type === 1 ? itemColor.weight / 1000 : itemColor.weight) - (itemColor.outStockNum || 0))
              }
            }),
            time: this.$getTime(),
            remark: ''
          })
        })
      })
      this.weaveStockEditInfo.push(...data)
    },
    // 批量导出excel
    download () {
      let data = []
      this.stockLog.forEach(item => {
        data.push(...item.filter(value => value.checked))
      })
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
          let deleteItem = []
          item.forEach(itemInner => {
            deleteItem = deleteItem.concat(itemInner)
          })
          checkedArr = deleteItem.filter(value => value.checked).map(value => value.id)
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
      let flag = {
        client: true,
        editType: true,
        name: true,
        attr: true,
        weight: true,
        time: true
      }
      if (type === 'material') {
        this.stockEditInfo.forEach(item => {
          if (!item.editType) {
            flag.editType = false
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
              type: item.editType === 'out' ? 1 : item.editType === 'go' ? 2 : 3,
              material_type: this.$route.params.type
            })
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
      }
      if (!flag.client) {
        this.$message.error('检测到未选择出入库单位，请选择')
        return
      }
      if (!flag.editType) {
        this.$message.error('检测到未选择操作类型，请选择')
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
            this.$router.push('/materialStock/materialStockDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType)
          }
        }
      })
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    addItem (item, type) {
      if (type === 'stock') {
        let obj = {
          client_name: '',
          editType: 'out',
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
      let materialInfo = {
        material_name: item.material_name,
        material_attribute: itemInner.attr,
        number: this.$toFixed((itemInner.order_weight || 0) - (itemInner.goStockNumEnd || 0)),
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
    },
    // 织造加工module点击表格内操作时
    handleClickProcess (item, itemMa, itemColor) {
      let materialInfo = {
        material_name: itemMa.material_name,
        material_attribute: itemColor.attr,
        number: this.$toFixed((itemColor.type === 1 ? itemColor.weight / 1000 : itemColor.weight) - (itemColor.outStockNum || 0))
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
          })
        ]).then(res => {
          // 初始化原料出入库数据
          let materialPlan = res[0].data.data.order_material_plan.total_data.filter(item => Number(item.material_type) === 1)
          this.orderInfo = res[0].data.data.order_info
          this.materialStockInfo = this.$mergeData(materialPlan.filter(itemMa => Number(itemMa.order_weight) && Number(itemMa.order_weight) !== 0), { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'unit' }, { name: 'updated_at' }, { name: 'material_type/type' }] } })
          this.materialClient = this.$mergeData(res[0].data.data.material_order_client, { mainRule: ['client_name', 'client_id'] })
          // 初始化织造出入库数据
          this.weaveInfo = this.$mergeData(res[2].data.data, { mainRule: 'client_name', otherRule: [{ name: 'material_assign/material_info', type: 'concat' }, { 'name': 'client_id' }] }).map(items => {
            return {
              checked: false,
              client_name: items.client_name,
              client_id: items.client_id,
              material_info: this.$mergeData(items.material_info, { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'material_weight/weight', type: 'add' }, { name: 'material_unit/unit' }, { name: 'material_type/type' }] } })
            }
          })
          // 初始化统计数据
          this.totalInfo.plan = this.$mergeData(this.$clone(materialPlan).map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.reality_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          this.totalInfo.order = this.$mergeData(this.$clone(materialPlan).map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.material_type === 1 ? item.order_weight * 1000 : item.order_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          this.totalInfo.process = this.$mergeData(this.$clone(materialPlan).map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.material_type === 1 ? item.process_weight * 1000 : item.process_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          // 初始化日志信息
          this.stockLog = this.$newSplice(res[1].data.data.filter(item => Number(item.material_type) === 1).map(item => {
            return {
              ...item,
              checked: false
            }
          }), 5)
          this.stockLogTotal = this.stockLog.length
          this.stockLog.forEach(item => {
            item.forEach(itemInner => {
              let materialFlag = this.materialStockInfo.find(value => value.material_name === itemInner.material_name)
              if (materialFlag) {
                let colorFlag = materialFlag.color_info.find(value => value.attr === itemInner.material_color)
                if (colorFlag) {
                  // colorFlag.goStockNum = Number(colorFlag.goStockNum || 0) + Number(itemInner.total_weight)
                  if (itemInner.type === 3) {
                    colorFlag.goStockNumEnd = Number(colorFlag.goStockNumEnd || 0) + Number(itemInner.total_weight)
                  }
                }
              }
              let clientFlag = this.weaveInfo.find(value => value.client_name === itemInner.client_name)
              if (clientFlag) {
                let materialFlag = clientFlag.material_info.find(value => value.material_name === itemInner.material_name)
                if (materialFlag) {
                  let colorFlag = materialFlag.color_info.find(value => (value.attr === itemInner.material_color || (value.attr === undefined && itemInner.material_color === '')))
                  console.log(colorFlag)
                  if (colorFlag) {
                    // colorFlag.goStockNum = Number(colorFlag.goStockNum || 0) + Number(itemInner.total_weight)
                    if (itemInner.type === 4) {
                      colorFlag.outStockNum = Number(colorFlag.outStockNum || 0) + Number(itemInner.total_weight)
                    }
                  }
                }
              }
            })
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
          processing.detail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          })
        ]).then(res => {
          // 初始化辅料出入库数据
          let materialPlan = res[0].data.data.order_material_plan.total_data.filter(item => Number(item.material_type) === 2)
          this.orderInfo = res[0].data.data.order_info
          this.materialStockInfo = this.$mergeData(materialPlan.filter(itemMa => Number(itemMa.order_weight) && Number(itemMa.order_weight) !== 0), { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'unit' }, { name: 'updated_at' }, { name: 'material_type/type' }] } })
          this.materialClient = this.$mergeData(res[0].data.data.material_process_client, { mainRule: ['client_name', 'client_id'] })
          // 初始化加工出入库数据
          this.weaveInfo = this.$mergeData(res[2].data.data, { mainRule: 'client_name', otherRule: [{ name: 'part_assign/material_info', type: 'concat' }, { name: 'client_id' }] }).map(items => {
            return {
              checked: false,
              client_name: items.client_name,
              client_id: items.client_id,
              material_info: this.$mergeData(items.material_info, { mainRule: ['name/material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'number/weight', type: 'add' }] } }).map(value => {
                value.color_info.forEach(val => {
                  val.type = 2
                  val.unit = '个'
                })
                return value
              })
            }
          })
          // 初始化统计数据
          this.totalInfo.plan = this.$mergeData(this.$clone(materialPlan).map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.reality_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          this.totalInfo.order = this.$mergeData(this.$clone(materialPlan).map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.material_type === 1 ? item.order_weight * 1000 : item.order_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          this.totalInfo.process = this.$mergeData(this.$clone(materialPlan).map(item => {
            return {
              type: item.material_type,
              material_name: item.material_name,
              color: item.material_attribute,
              number: item.material_type === 1 ? item.process_weight * 1000 : item.process_weight,
              unit: item.unit
            }
          }), { mainRule: ['material_name', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'color_info', childrenRule: { mainRule: 'color', otherRule: [{ name: 'number' }] } })
          // 初始化日志信息
          this.stockLog = this.$newSplice(res[1].data.data.filter(item => Number(item.material_type) === 2).map(item => {
            return {
              ...item,
              checked: false
            }
          }), 5)
          this.stockLogTotal = this.stockLog.length
          this.stockLog.forEach(item => {
            item.forEach(itemInner => {
              let materialFlag = this.materialStockInfo.find(value => value.material_name === itemInner.material_name)
              if (materialFlag) {
                let colorFlag = materialFlag.color_info.find(value => value.attr === itemInner.material_color)
                if (colorFlag) {
                  // colorFlag.goStockNum = Number(colorFlag.goStockNum || 0) + Number(itemInner.total_weight)
                  if (itemInner.type === 3) {
                    colorFlag.goStockNumEnd = Number(colorFlag.goStockNumEnd || 0) + Number(itemInner.total_weight)
                  }
                }
              }
              let clientFlag = this.weaveInfo.find(value => value.client_name === itemInner.client_name)
              if (clientFlag) {
                let materialFlag = clientFlag.material_info.find(value => value.material_name === itemInner.material_name)
                if (materialFlag) {
                  let colorFlag = materialFlag.color_info.find(value => (value.attr === itemInner.material_color || (value.attr === undefined && itemInner.material_color === '')))
                  console.log(colorFlag)
                  if (colorFlag) {
                    // colorFlag.goStockNum = Number(colorFlag.goStockNum || 0) + Number(itemInner.total_weight)
                    if (itemInner.type === 4) {
                      colorFlag.outStockNum = Number(colorFlag.outStockNum || 0) + Number(itemInner.total_weight)
                    }
                  }
                }
              }
            })
          })
          this.loading = false
        })
      }
    }
  },
  created () {
    this.initData(this.$route.params.type)
  },
  computed: {
    checkWhichYarn () {
      return this.materialStockInfo.filter(item => item.checked)
    },
    checkWhichWeave () {
      return this.weaveInfo.filter(item => item.checked)
    }
  },
  filters: {
    filterType (item) {
      return item === 1 ? '出库' : item === 2 ? '入库' : item === 3 ? '最终入库' : '织造出库'
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialStock/materialStockDetail.less";
</style>
<style lang="less">
#materialStock {
  .el-date-editor.el-input {
    width: 100% !important;
  }
}
</style>
