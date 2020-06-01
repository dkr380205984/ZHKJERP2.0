<template>
  <div id='materialStockBatchDetail'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <el-collapse class="collapse_row"
            accordion>
            <el-collapse-item v-for="(itemOrder,indexOrder) in orderInfo"
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
        <span class="title">{{$route.params.type === '1' ? '原' : '辅'}}料出入库</span>
      </div>
      <template v-if="materialStockInfo.length > 0">
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
                        <span class="tcolumn">
                          <span class="order">{{$toFixed(itemColor.order_weight)}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                        </span>
                        <span class="tcolumn green">{{$toFixed(itemColor.goStockNumEnd || 0)}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                        <span class="tcolumn orange">{{$toFixed(Number(itemColor.order_weight || 0) - Number(itemColor.goStockNumEnd || 0))}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                        <span class="tcolumn">{{$getTime(itemColor.updated_at)}}</span>
                        <span class="tcolumn center"
                          style="flex:1.5">
                          <span class="trow"
                            style="align-items: center;">
                            <div class="btn noBorder"
                              @click="handleClick(item,itemColor,3)">入库</div>
                          </span>
                        </span>
                      </div>
                    </div>
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
                        <el-select v-model="itemStock.editType"
                          class="elInput"
                          placeholder="请选择操作类型">
                          <el-option v-for="item in editTypeArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
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
                          @change="changeAttrInfo($event,itemMa)"
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
                          disabled
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
                    @click="addItem(stockEditInfo,'stock')">添加入库</span>
                  <span class="once cancle"
                    v-if="stockEditInfo.length > 0"
                    @click="resetEditInfo('stock')">取消</span>
                  <span class="once normal"
                    v-if="stockEditInfo.length > 0"
                    @click="addItem(stockEditInfo,'stock')">添加入库</span>
                  <span class="once ok"
                    v-if="stockEditInfo.length > 0"
                    @click="saveAll()">确认</span>
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
            v-for="(itemLog,indexLog) in stockLog[stockLogPages-1]"
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
              <span class="tcolumn">{{item.color_info.map(items=>item.type === 1 ? items.number/1000 : items.number).reduce((a,b)=>{return Number(a)+Number(b)})}}{{item.type === 1 ? 'kg' : item.unit}}</span>
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
                  placeholder="请选择操作类型">
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
import { materialStock, materialManage, materialProcess, stock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      orderInfo: [],
      materialStockInfo: [],
      cloneData: [],
      stockEditInfo: [],
      materialClient: [],
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
        handleType: 3
      },
      showFilterTypeBox: false,
      filterHandleType: '',
      handleTypeArr: [
        {
          value: 3,
          label: '最终入库'
        }
      ],
      showFilterClientBox: false,
      filterHandleClient: '',
      cloneStockLog: [],
      editTypeArr: [
        {
          label: '最终入库',
          value: 3
        }
      ],
      stockArr: []
    }
  },
  watch: {
    filterHandleType (newVal) {
      if (newVal) {
        if (this.filterHandleClient) {
          this.stockLog = this.$newSplice(this.cloneStockLog.filter(item => +item.type === +newVal && item.client_name === this.filterHandleClient).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        } else {
          this.stockLog = this.$newSplice(this.cloneStockLog.filter(item => +item.type === +newVal).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        }
      } else {
        if (this.filterHandleClient) {
          this.stockLog = this.$newSplice(this.cloneStockLog.filter(item => item.client_name === this.filterHandleClient).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        } else {
          this.stockLog = this.$newSplice(this.cloneStockLog.map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        }
      }
      this.stockLogPages = 1
      this.stockLogTotal = this.stockLog.length
    },
    filterHandleClient (newVal) {
      if (newVal) {
        if (this.filterHandleType) {
          this.stockLog = this.$newSplice(this.cloneStockLog.filter(item => +item.type === +this.filterHandleType && item.client_name === newVal).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        } else {
          this.stockLog = this.$newSplice(this.cloneStockLog.filter(item => item.client_name === newVal).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        }
      } else {
        if (this.filterHandleType) {
          this.stockLog = this.$newSplice(this.cloneStockLog.filter(item => +item.type === +this.filterHandleType).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        } else {
          this.stockLog = this.$newSplice(this.cloneStockLog.map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
        }
      }
      this.stockLogPages = 1
      this.stockLogTotal = this.stockLog.length
    },
    stockEditInfo (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    }
  },
  methods: {
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
          handleType: 3,
          stockId: ''
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
        if (flag.handleType === 3) {
          colorInfo = item.color_info.filter(itemColor => this.$toFixed((itemColor.order_weight || 0) - (itemColor.goStockNumEnd || 0)) > 0)
        } else {
          colorInfo = item.color_info
        }
        let materialInfo = colorInfo.map(itemColor => {
          return {
            material_name: item.material_name,
            material_attribute: itemColor.attr,
            number: this.$toFixed((itemColor.order_weight || 0) - (itemColor.goStockNumEnd || 0)),
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
            editType: flag ? flag.handleType : 3,
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
          let finedFlag = this.cloneData.filter(itemF => itemF.material_attribute === itemMa.material_attribute && itemF.material_name === itemMa.material_name && (itemF.order_weight > (itemF.goStockNumEnd || 0)))
          if (finedFlag) {
            data.push(...finedFlag.map(itemF => {
              return {
                order_id: itemF.order_id,
                client_id: item.client_name,
                material_name: itemMa.material_name,
                order_type: itemF.order_type,
                material_color: itemMa.material_attribute,
                total_weight: this.$toFixed(itemF.order_weight - (+itemF.goStockNumEnd || 0)),
                complete_time: item.time,
                desc: item.remark,
                type: item.editType,
                material_type: this.$route.params.type
              }
            }))
          }
        })
      })
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
      // 订单物料出入库
      if (data.length > 0) {
        materialStock.create({ data: data }).then(res => {
          if (res.data.status !== false) {
            this.stockEditInfo = []
            this.$message.success('保存成功')
            this.initData(this.$route.params.type)
          }
        })
      } else {
        this.$message.error('未知错误,请刷新重试或联系我们')
      }
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    addItem (item, type) {
      if (type === 'stock') {
        let obj = {
          client_name: '',
          editType: 3,
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
      let num = this.$toFixed((+itemInner.order_weight || 0) - (+itemInner.goStockNumEnd || 0))
      if (num <= 0) {
        this.$message.warning('检测到该物料已完成入库，无需再次入库')
        return
      }
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
    // 原料出入库module改变原料时
    changeColorInfo (eve, item) {
      item.material_attribute = ''
      item.color_info = this.materialStockInfo.find(items => items.material_name === eve).color_info.map(value => {
        return {
          name: value.attr
        }
      })
    },
    // 原料出入库module改变颜色属性时
    changeAttrInfo (eve, item) {
      let flag = this.materialStockInfo.find(itemF => itemF.material_name === item.material_name).color_info.find(itemF => itemF.attr === eve)
      item.number = flag ? (flag.order_weight - (flag.goStockNumEnd || 0)) : 0
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
      }
    },
    // 初始化
    initData (type) {
      this.loading = true
      let orderId = this.$route.params.id.split('-')
      let orderType = this.$route.params.orderType
      Promise.all([
        materialStock.init({
          order_id: orderId,
          order_type: orderType
        }),
        materialStock.detail({
          order_id: orderId,
          order_type: orderType
        })
      ]).then(res => {
        // 初始化原料出入库数据
        let materialPlan = res[0].data.data.order_material_plan.total_data.filter(item => Number(item.material_type) === +type && item.reality_weight)
        this.orderInfo = res[0].data.data.order_info
        // 保留一份数据以便提交时去比对
        this.cloneData = this.$mergeData(materialPlan, { mainRule: ['order_id', 'material_name', 'material_attribute', 'material_type', 'order_type'], otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'id' }, { name: 'unit' }] }).map(itemClone => {
          return {
            order_id: itemClone.order_id,
            material_name: itemClone.material_name,
            material_attribute: itemClone.material_attribute,
            material_type: itemClone.material_type,
            order_type: itemClone.order_type,
            order_weight: itemClone.order_weight,
            id: itemClone.id,
            unit: itemClone.unit
          }
        })
        this.materialStockInfo = this.$mergeData(materialPlan, { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'unit' }, { name: 'updated_at' }, { name: 'material_type/type' }] } })
        this.materialClient = this.$mergeData(res[0].data.data.material_order_client.concat(res[0].data.data.material_process_client, this.orderInfo.map(itemClient => {
          return {
            client_name: itemClient.client_name,
            client_id: itemClient.client_id
          }
        })), { mainRule: ['client_name', 'client_id'] })
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
        // 初始化日志信息
        this.cloneStockLog = this.$clone(res[1].data.data.filter(item => Number(item.material_type) === +type && +item.type === 3))
        this.stockLog = this.$newSplice(this.cloneStockLog.map(item => {
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
                colorFlag.goStockNumEnd = Number(colorFlag.goStockNumEnd || 0) + Number(itemInner.total_weight)
              }
            }
            let cloneMaterialFlag = this.cloneData.find(itemF => itemF.material_name === itemInner.material_name && itemF.material_attribute === itemInner.material_color && itemF.order_id === itemInner.order_id && itemF.order_type === itemInner.order_type)
            if (cloneMaterialFlag) {
              cloneMaterialFlag.goStockNumEnd = (+cloneMaterialFlag.goStockNumEnd || 0) + itemInner.total_weight
            }
          })
        })
        this.loading = false
      })
    },
    // 获取订购日志
    getMaterialOrder () {
      this.activeType = 'order'
      materialManage.detail({
        order_type: this.$route.params.orderType,
        order_id: this.$route.params.id.split('-')
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
        order_id: this.$route.params.id.split('-')
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
  },
  computed: {
    checkWhichYarn () {
      return this.materialStockInfo.filter(item => item.checked)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialStock/materialStockBatchDetail.less";
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
