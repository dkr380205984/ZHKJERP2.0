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
            <span class="text">{{orderInfo.order_code || orderInfo.title}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data="orderInfo.order_batch"></zh-batch>
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
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push(`/materialStock/materialGoStockDetail/${$route.params.id}/${$route.params.type}/${$route.params.orderType}`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoruku"></use>
        </svg>
        <span class="name">物料入库</span>
      </div>
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaochuku"></use>
        </svg>
        <span class="name">物料出库</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/materialStock/materialBackStockDetail/${$route.params.id}/${$route.params.type}/${$route.params.orderType}`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaohuiku"></use>
        </svg>
        <span class="name">物料回库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">物料出库</span>
        <span class="btn btnWhiteBlue"
          @click="getStockInfo">库存调取出库
          <span class="el-icon-d-arrow-right"></span></span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="btnCtn_page">
            <div class="btn btnWhiteBlue"
              @click="outStockBatch">批量出库</div>
          </div>
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row max40"></span>
              <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
              <span class="tb_row tb_col flex30">
                <span class="tb_col_item">
                  <span class="tb_row">颜色</span>
                  <span class="tb_row">色号</span>
                  <span class="tb_row">批号</span>
                  <span class="tb_row">入库数量</span>
                  <span class="tb_row">出库数量</span>
                  <span class="tb_row">操作</span>
                </span>
              </span>
            </span>
            <span class="tb_content"
              v-for="(itemM,indexM) in materialGoStockInfo"
              :key="indexM">
              <span class="tb_row max40">
                <el-checkbox v-model="itemM.checked"
                  @change="$forceUpdate()" />
              </span>
              <span class="tb_row">{{itemM.material_name}}</span>
              <span class="tb_row tb_col flex30">
                <span class="tb_col_item"
                  v-for="(itemA,indexA) in itemM.attr_info"
                  :key="indexA">
                  <span class="tb_row">{{itemA.material_color}}</span>
                  <span class="tb_row">{{itemA.color_code}}</span>
                  <span class="tb_row">{{itemA.vat_code}}</span>
                  <span class="tb_row green">{{itemA.goStockNum}}{{itemA.unit || ($route.params.type === '1' ? 'kg' : '个')}}</span>
                  <span class="tb_row orange">{{itemA.outStockNum || 0}}{{itemA.unit || ($route.params.type === '1' ? 'kg' : '个')}}</span>
                  <span class="tb_row">
                    <span class="tb_handle_btn blue"
                      @click="outStock(itemM,itemA)">出库</span>
                  </span>
                </span>
              </span>
            </span>
            <div class="editCtn bgGray_page"
              v-for="(itemC,indexC) in editInfo"
              :key="`edit-${indexC}`"
              :id="indexC === 0 ? 'outStock' : ''">
              <span class="deleteIcon el-icon-close"
                @click="deleteItem(editInfo,indexC)"></span>
              <div class="rowCtn">
                <div class="colCtn flex3">
                  <span class="label">
                    <span class="text">选择单位</span>
                  </span>
                  <span class="content">
                    <el-cascader v-model="itemC.client_id"
                      clearable
                      :props="{ expandTrigger: 'hover' }"
                      placeholder="请选择出库单位"
                      :options="clientList"
                      @change="getDistributionMaterial($event,itemC)"></el-cascader>
                  </span>
                </div>
              </div>
              <div class="rowCtn"
                v-for="(itemM,indexM) in itemC.material_info"
                :key="indexM">
                <div class="colCtn flex3">
                  <span class="label"
                    v-if="indexM === 0">
                    <span class="text">{{$route.params.type === '1' ? 'kg' : '个'}}料名称</span>
                  </span>
                  <span class="content">
                    <el-select v-model="itemM.material_name"
                      filterable
                      default-first-option
                      clearable
                      :placeholder="`请选择出库${$route.params.type === '1' ? '原' : '辅'}料`"
                      @change="changeMaterial(itemM,$event)">
                      <el-option v-for="(itemI,indexI) in materialGoStockInfo"
                        :key="indexI"
                        :label="itemI.material_name"
                        :value="itemI.material_name">
                      </el-option>
                    </el-select>
                  </span>
                </div>
                <div class="colCtn flex3">
                  <span class="content">
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">{{$route.params.type === '1' ? 'kg' : '个'}}料颜色</span>
                      </span>
                      <span class="content">
                        <el-select v-model="itemM.attr_name"
                          filterable
                          default-first-option
                          clearable
                          :placeholder="`请选择${$route.params.type === '1' ? '原' : '辅'}料颜色`"
                          @change="changeColor(itemM,$event)">
                          <el-option v-for="(itemI,indexI) in itemM.attrArr"
                            :key="indexI"
                            :label="itemI.material_color"
                            :value="itemI.material_color">
                          </el-option>
                        </el-select>
                      </span>
                    </div>
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">色号</span>
                      </span>
                      <span class="content">
                        <el-select v-model="itemM.color_code"
                          filterable
                          default-first-option
                          clearable
                          placeholder="色号"
                          @change="changeColorCode(itemM,$event)">
                          <el-option v-for="(itemI,indexI) in itemM.colorArr"
                            :key="indexI"
                            :label="itemI.color_code"
                            :value="itemI.color_code">
                          </el-option>
                        </el-select>
                      </span>
                    </div>
                  </span>
                </div>
                <div class="colCtn flex3">
                  <span class="content">
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">批/缸号</span>
                      </span>
                      <span class="contetn">
                        <el-select v-model="itemM.vat_code"
                          filterable
                          default-first-option
                          clearable
                          placeholder="批/缸号">
                          <el-option v-for="(itemI,indexI) in itemM.vatArr"
                            :key="indexI"
                            :label="itemI.vat_code"
                            :value="itemI.vat_code">
                          </el-option>
                        </el-select>
                      </span>
                    </div>
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">出库数量</span>
                      </span>
                      <span class="contetn">
                        <zh-input v-model="itemM.weight"
                          placeholder='请输入数量'>
                          <template slot="append">
                            <input type="text"
                              style="width:20px;border:none;outline:none;background:inherit;"
                              v-model="itemM.unit"
                              :placeholder="`${$route.params.type === '1' ? 'kg' : '个'}`">
                          </template>
                        </zh-input>
                      </span>
                    </div>
                  </span>
                  <span class="editBtn addBtn"
                    v-if="indexM === 0"
                    @click="addItem(itemC.material_info,'material')">添加</span>
                  <span class="editBtn deleteBtn"
                    v-else
                    @click="deleteItem(itemC.material_info,indexM)">删除</span>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn flex3">
                  <span class="label">
                    <span class="text">出库时间</span>
                  </span>
                  <span class="content">
                    <el-date-picker v-model="itemC.time"
                      value-format="yyyy-MM-dd"
                      style="width:100%"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </span>
                </div>
                <div class="colCtn">
                  <span class="label">
                    <span class="text">备注</span>
                  </span>
                  <span class="content">
                    <zh-input v-model="itemC.remark"
                      placeholder="请输入备注"></zh-input>
                  </span>
                </div>
              </div>
            </div>
            <div class="addRows">
              <span class="once"
                v-if="editInfo.length === 0"
                @click="addItem(editInfo,'out')">添加出库</span>
              <template v-else>
                <span class="once cancle">取消</span>
                <span class="once normal"
                  @click="addItem(editInfo,'out')">添加出库</span>
                <span class="once ok"
                  @click="saveAll">提交</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料出库信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row">出库单位</span>
              <span class="tb_row tb_col flex4">
                <span class="tb_col_item">
                  <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                  <span class="tb_row tb_col flex30">
                    <span class="tb_col_item">
                      <span class="tb_row">颜色</span>
                      <span class="tb_row">色号</span>
                      <span class="tb_row">批号</span>
                      <span class="tb_row">出库数量</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <span class="tb_content"
              v-for="(itemC,indexC) in materialOutStockInfo"
              :key="indexC">
              <span class="tb_row">{{itemC.client_name}}</span>
              <span class="tb_row tb_col flex4">
                <span class="tb_col_item"
                  v-for="(itemM,indexM) in itemC.material_info"
                  :key="indexM">
                  <span class="tb_row">{{itemM.material_name}}</span>
                  <span class="tb_row tb_col flex30">
                    <span class="tb_col_item"
                      v-for="(itemA,indexA) in itemM.attr_info"
                      :key="indexA">
                      <span class="tb_row">{{itemA.material_color}}</span>
                      <span class="tb_row">{{itemA.color_code || '/'}}</span>
                      <span class="tb_row">{{itemA.vat_code || '/'}}</span>
                      <span class="tb_row green">{{$toFixed(itemA.total_weight)}}{{itemA.unit || ($route.params.type === '1' ? 'kg' : '个')}}</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">日志信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="btnCtn_page">
            <div class="btn btnWhiteRed"
              @click="deleteLog(materialOutStockLog,'all')">批量删除</div>
            <div class="btn btnWhiteBlue"
              @click="download">导出Excel</div>
          </div>
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row max40">
                <el-checkbox v-model="checkedAll"
                  @change="checkedAllLog" />
              </span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row flex15">出库单位</span>
              <span class="tb_row flex15">出库仓库</span>
              <span class="tb_row flex15">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
              <span class="tb_row">颜色</span>
              <span class="tb_row flex06">色号</span>
              <span class="tb_row flex06">批号</span>
              <span class="tb_row flex06">出库数量</span>
              <span class="tb_row flex06">操作人</span>
              <span class="tb_row flex06 middle">操作</span>
            </span>
            <span class="tb_content"
              v-for="(itemLog,indexLog) in materialOutStockLog"
              :key="indexLog.id">
              <span class="tb_row max40">
                <el-checkbox v-model="itemLog.checked"
                  @change="$forceUpdate()" />
              </span>
              <span class="tb_row">{{itemLog.complete_time}}</span>
              <span class="tb_row flex15">{{itemLog.client_name}}</span>
              <span class="tb_row flex15">{{itemLog.store_name || '/'}}</span>
              <span class="tb_row flex15">{{itemLog.material_name}}</span>
              <span class="tb_row">{{itemLog.material_color}}</span>
              <span class="tb_row flex06">{{itemLog.color_code || '/'}}</span>
              <span class="tb_row flex06">{{itemLog.vat_code || '/'}}</span>
              <span class="tb_row flex06">{{$toFixed(itemLog.total_weight)}}{{itemLog.unit || ($route.params.type === '1' ? 'kg' : '个')}}</span>
              <span class="tb_row flex06">{{itemLog.user_name}}</span>
              <span class="tb_row flex06 middle">
                <span class="tb_handle_btn red"
                  @click="deleteLog(itemLog.id)">删除</span>
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
    <!-- 库存信息 -->
    <el-drawer :visible.sync="showStockInfoFlag"
      custom-class="materialOutStockDetail_drawer"
      title="库存调取"
      :wrapperClosable="false"
      :destroy-on-close='true'
      :with-header="false">
      <div class="drawerCtn">
        <!-- <div class="header">
          <span class="title">库存调取</span>
          <span class="el-icon-close close_icon"></span>
        </div> -->
        <div class="content">
          <div class="modules">
            <div class="title">
              <span class="text">库存数量</span>
            </div>
            <div class="rowCtn">
              <zh-input v-model="searchWord"
                style="width:200px"
                placeholder='筛选物料名称'
                @change="getStockList(1)"></zh-input>
            </div>
            <div class="rowCtn">
              <div class="tableCtnLv2"
                v-loading='stockLoading'>
                <span class="tb_header">
                  <span class="tb_row"
                    style="flex:1.5">仓库</span>
                  <span class="tb_row"
                    style="flex:1.2">纱线名称</span>
                  <span class="tb_row">颜色</span>
                  <span class="tb_row"
                    style="flex:0.8">色号</span>
                  <span class="tb_row"
                    style="flex:0.8">批/缸号</span>
                  <span class="tb_row"
                    style="flex:0.8">库存数量</span>
                  <span class="tb_row"
                    style="flex:0.5">操作</span>
                </span>
                <span class="tb_content"
                  v-for="(itemLog,indexLog) in stockList"
                  :key="indexLog">
                  <span class="tb_row"
                    style="flex:1.5">{{itemLog.store_name}}</span>
                  <span class="tb_row"
                    style="flex:1.2">{{itemLog.material_name}}</span>
                  <span class="tb_row">{{itemLog.material_color}}</span>
                  <span class="tb_row"
                    style="flex:0.8">{{itemLog.color_code || '/'}}</span>
                  <span class="tb_row"
                    style="flex:0.8">{{itemLog.vat_code || '/'}}</span>
                  <span class="tb_row"
                    style="flex:0.8">{{itemLog.total_weight}}</span>
                  <span class="tb_row"
                    style="flex:0.5">
                    <span class="tb_handle_btn blue"
                      @click="drawStock(itemLog)">出库</span>
                  </span>
                </span>
                <span class="tb_content"
                  v-if="stockList.length === 0">
                  <span class="tb_row">暂无库存数据</span>
                </span>
              </div>
            </div>
            <div class="rowCtn"
              style="justify-content:flex-end">
              <el-pagination background
                :page-size="5"
                layout="prev, pager, next"
                :total="stockTotal"
                :current-page.sync="stockPage"
                @current-change="getStockList">
              </el-pagination>
            </div>
          </div>
          <div class="modules"
            v-if="stockEditInfo.length > 0">
            <div class="title">
              <span class="text">物料出库</span>
            </div>
            <template v-for="(itemE,indexE) in stockEditInfo">
              <div class="rowCtn"
                :key="`stock-${indexE}`">
                <div class="colCtn"
                  style="flex:3">
                  <span class="info">
                    <zh-input disabled
                      v-model="itemE.stock_name"
                      placeholder="来源仓库" />
                  </span>
                </div>
                <div class="colCtn"
                  style="flex:2">
                  <span class="info">
                  </span>
                </div>
              </div>
              <div class="rowCtn"
                :key="`material-${indexE}`">
                <div class="colCtn"
                  style="flex:3">
                  <span class="info">
                    <zh-input disabled
                      placeholder="原料名称"
                      v-model="itemE.material_name"
                      style="flex:2;margin-right:16px"></zh-input>
                    <zh-input disabled
                      placeholder="颜色"
                      v-model="itemE.attr_name"
                      style="flex:1;"></zh-input>
                  </span>
                </div>
                <div class="colCtn"
                  style="flex:2">
                  <div class="info">
                    <zh-input disabled
                      placeholder="色号"
                      v-model="itemE.color_code"
                      style="flex:1;margin-right:16px"></zh-input>
                    <zh-input disabled
                      placeholder="批/缸号"
                      v-model="itemE.vat_code"
                      style="flex:1"></zh-input>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                v-for="(itemClient,indexClient) in itemE.client_info"
                :key="`client-${indexE}-${indexClient}`">
                <div class="colCtn"
                  style="flex:3">
                  <span class="info">
                    <el-cascader v-model="itemClient.client_id"
                      clearable
                      :props="{ expandTrigger: 'hover' }"
                      placeholder="请选择出库单位"
                      :options="clientList"></el-cascader>
                  </span>
                </div>
                <div class="colCtn"
                  style="flex:2">
                  <span class="info">
                    <zh-input placeholder="请输入出库数量"
                      v-model="itemClient.weight"></zh-input>
                    <span class="handle el-icon-delete red"
                      @click="deleteItem(itemE.client_info,indexClient)"></span>
                  </span>
                </div>
              </div>
            </template>
            <div class="addRows"
              v-if="stockEditInfo.length> 0"
              @click="addItem(stockEditInfo[0].client_info,'client')">+添加出库单位</div>
          </div>
        </div>
        <div class="footer">
          <div class="opr"
            @click="closeDrawer('showStockInfoFlag')">取消</div>
          <div class="opr blue"
            @click="commitDrawer">确定</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, sampleOrder, materialStock, client, yarnStock, weave } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true, // 整个页面loading
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      orderInfo: {}, // 订单信息
      materialGoStockInfo: [], // 物料入库信息
      editInfo: [], // 出库编辑
      clientList: [], // 涉及单位列表
      materialOutStockInfo: [], // 出库数据
      materialOutStockLog: [], // 出库日志
      checkedAll: false, // 日志全选
      showStockInfoFlag: false, // 库存展示
      stockLoading: false,
      stockList: [],
      stockPage: 1,
      stockTotal: 1,
      searchWord: '',
      stockEditInfo: []
    }
  },
  methods: {
    // 改变出库单位判断为分配单位时自动填充分配物料
    getDistributionMaterial (e, item) {
      if (e[0] === '0') { // 判断是否选择分配单位
        let flag = this.clientList.find(itemF => itemF.value === '0').children.find(itemF => itemF.value === e[1])
        if (flag) {
          item.material_info = flag.material_info.map(itemM => {
            let flag = this.materialGoStockInfo.find(itemF => itemF.material_name === itemM.material_name)
            return {
              material_name: itemM.material_name,
              attrArr: flag ? this.$unique(flag.attr_info, 'material_color') : [],
              colorArr: flag ? this.$unique(flag.attr_info.filter(itemF => itemF.material_color === itemM.attr_name), 'color_code') : [],
              vatArr: [],
              attr_name: itemM.attr_name,
              vat_code: '',
              color_code: '',
              weight: itemM.weight,
              unit: itemM.unit || (this.$route.params.type === '1' ? 'kg' : '个')
            }
          })
        }
      }
    },
    closeDrawer (key) {
      this[key] = false
    },
    commitDrawer () {
      if (this.$submitLock()) return
      let flag = {
        client: true,
        material: true,
        color: true,
        number: true,
        stock: true
      }
      let data = this.$flatten(this.stockEditInfo.map(itemS => {
        if (!itemS.stock_id) {
          flag.stock = false
        }
        if (!itemS.material_name) {
          flag.material = false
        }
        if (!itemS.attr_name) {
          flag.color = false
        }
        return itemS.client_info.map(itemC => {
          if (!itemC.client_id || itemC.client_id.length === 0) {
            flag.client = false
          }
          if (!itemC.weight) {
            flag.number = false
          }
          return {
            desc: '',
            total_weight: itemC.weight,
            store_id: itemS.stock_id,
            color_code: itemS.color_code,
            material_name: itemS.material_name,
            material_type: this.$route.params.type,
            vat_code: itemS.vat_code,
            material_order_id: null,
            material_color: itemS.attr_name,
            complete_time: this.$getTime(),
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType,
            client_id: itemC.client_id[1]
          }
        })
      }))
      if (!flag.stock) {
        this.$message.error('请选择调取仓库')
        return
      }
      if (!flag.material) {
        this.$message.error(`请选择调取出库${this.$route.params.type === '1' ? '原' : '辅'}料`)
        return
      }
      if (!flag.color) {
        this.$message.error(`请选择调取出库${this.$route.params.type === '1' ? '原' : '辅'}料颜色`)
        return
      }
      if (!flag.client) {
        this.$message.error('请选择调取出库单位')
        return
      }
      if (!flag.number) {
        this.$message.error('请输入调取出库数量')
        return
      }
      // 订单物料出入库
      materialStock.create({ type: 4, data: data }).then(res => {
        if (res.data.status !== false) {
          this.init(this.$route.params.orderType)
          this.stockEditInfo = []
          this.$message.success('保存成功')
          this.closeDrawer('showStockInfoFlag')
        }
      })
    },
    drawStock (item) {
      if (this.stockEditInfo[0]) {
        this.stockEditInfo[0].id = item.id
        this.stockEditInfo[0].stock_name = item.store_name
        this.stockEditInfo[0].stock_id = item.store_id
        this.stockEditInfo[0].material_name = item.material_name
        this.stockEditInfo[0].attr_name = item.material_color
        this.stockEditInfo[0].color_code = item.color_code
        this.stockEditInfo[0].vat_code = item.vat_code
      } else {
        this.stockEditInfo.push({
          id: item.id,
          stock_name: item.store_name,
          stock_id: item.store_id,
          material_name: item.material_name,
          attr_name: item.material_color,
          color_code: item.color_code,
          vat_code: item.vat_code,
          client_info: [
            {
              client_id: '',
              weight: ''
            }
          ]
        })
      }
    },
    getStockInfo () {
      this.showStockInfoFlag = true
      this.getStockList(1)
    },
    getStockList (page) {
      this.stockPage = page || this.stockPage
      this.stockLoading = true
      yarnStock.list({
        limit: 5,
        page: this.stockPage,
        type: this.$route.params.type,
        material_name: this.searchWord || '',
        material_type: this.$route.params.type
      }).then(res => {
        if (res.data.status !== false) {
          this.stockList = res.data.data
          this.stockTotal = res.data.meta.total
          this.stockLoading = false
        }
      })
    },
    saveAll () {
      if (this.$submitLock()) return
      let flag = {
        client: true,
        material: true,
        color: true,
        number: true,
        time: true
      }
      let data = this.$flatten(this.editInfo.map(itemC => {
        if (!itemC.client_id || itemC.client_id.length === 0) {
          flag.client = false
        }
        if (!itemC.time) {
          flag.time = false
        }
        return itemC.material_info.map(itemM => {
          if (!itemM.material_name) {
            flag.material = false
          }
          if (!itemM.attr_name) {
            flag.color = false
          }
          if (!itemM.weight) {
            flag.number = false
          }
          return {
            desc: itemC.remark,
            total_weight: itemM.weight,
            store_id: null,
            color_code: itemM.color_code || null,
            material_name: itemM.material_name,
            material_type: this.$route.params.type,
            vat_code: itemM.vat_code || null,
            material_order_id: null,
            material_color: itemM.attr_name,
            complete_time: itemC.time,
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType,
            client_id: itemC.client_id[1],
            unit: itemM.unit || (this.$route.params.type === '1' ? 'kg' : '个')
          }
        })
      }))
      // 判断是否超出入库数量
      let errorArr = []
      let commitData = this.$mergeData(data, { mainRule: ['material_name', 'material_color', 'color_code', 'vat_code'], otherRule: [{ name: 'total_weight', type: 'add' }] })
      commitData.forEach(itemM => {
        let flag = this.materialGoStockInfo.find(itemF => itemF.material_name === itemM.material_name)
        if (flag) {
          let otherFlag = flag.attr_info.find(itemF => itemF.material_color === itemM.material_color && itemF.color_code === itemM.color_code && itemF.vat_code === itemM.vat_code)
          if (otherFlag) {
            if ((otherFlag.goStockNum < ((otherFlag.outStockNum || 0) + itemM.total_weight))) {
              errorArr.push(`名称:${itemM.material_name}<br/>颜色:${itemM.material_color}<br/>色号:${itemM.color_code || '/'}<br/>缸号：${itemM.vat_code || '/'}<br/>入库数量${otherFlag.goStockNum}<br/>已出库数量:${otherFlag.outStockNum}<br/>出库数量:${itemM.total_weight}<br/>超出数量:${((itemM.total_weight || 0) + (otherFlag.outStockNum || 0) - (otherFlag.goStockNum || 0))}`)
            }
          } else {
            errorArr.push(`名称:${itemM.material_name}<br/>颜色:${itemM.material_color}<br/>色号:${itemM.color_code || '/'}<br/>缸号：${itemM.vat_code || '/'}<br/>入库数量:0<br/>已出库数量:0<br/>出库数量:${itemM.total_weight}<br/>超出数量:${itemM.total_weight}`)
          }
        } else {
          errorArr.push(`名称:${itemM.material_name}<br/>颜色:${itemM.material_color}<br/>色号:${itemM.color_code || '/'}<br/>缸号：${itemM.vat_code || '/'}<br/>入库数量:0<br/>已出库数量:0<br/>出库数量:${itemM.total_weight}<br/>超出数量:${itemM.total_weight}`)
        }
      })
      if (errorArr.length > 0) {
        this.$message.error({
          dangerouslyUseHTMLString: true,
          message: '检测到您出库的原料超出已入库数<br />请做出调整；具体超出信息：<br />' + errorArr.join('<br />')
        })
        return
      }
      if (!flag.client) {
        this.$message.error('请选择出库单位')
        return
      }
      if (!flag.material) {
        this.$message.error(`请选择出库${this.$route.params.type === '1' ? '原' : '辅'}料`)
        return
      }
      if (!flag.color) {
        this.$message.error(`请选择出库${this.$route.params.type === '1' ? '原' : '辅'}料颜色`)
        return
      }
      if (!flag.number) {
        this.$message.error('请输入出库数量')
        return
      }
      if (!flag.time) {
        this.$message.error('请选择出库时间')
        return
      }
      // 订单物料出入库
      materialStock.create({ type: 1, data: data }).then(res => {
        if (res.data.status !== false) {
          this.editInfo = []
          this.$message.success('保存成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialStock/materialOutStockDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料出库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.init(this.$route.params.orderType)
          }
        }
      })
    },
    deleteLog (item, type) {
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let checkedArr = []
        if (type === 'all') {
          checkedArr = item.filter(value => value.checked).map(value => value.id)
        } else {
          checkedArr.push(item)
        }
        materialStock.delete({
          id: checkedArr
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.init(this.$route.params.orderType)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    checkedAllLog (e) {
      this.materialOutStockLog.forEach(itemF => {
        itemF.checked = e
      })
      this.$forceUpdate()
    },
    // 初始化
    init (type) {
      this.loading = true
      const api = type === '1' ? order.editDetail : sampleOrder.detail
      Promise.all([
        api({
          id: this.$route.params.id
        }),
        materialStock.detail({
          order_type: this.$route.params.orderType,
          order_id: this.$route.params.id,
          material_type: this.$route.params.type
        }),
        client.list(),
        weave.getDressMat({
          order_id: this.$route.params.id,
          order_type: this.$route.params.orderType
        })
      ]).then(res => {
        this.orderInfo = res[0].data.data
        // 初始化入库数据
        this.materialGoStockInfo = this.$mergeData(res[1].data.data.filter(itemF => +itemF.type === 2), {
          mainRule: 'material_name',
          childrenName: 'attr_info',
          childrenRule: {
            mainRule: ['material_color', 'color_code', 'vat_code'],
            otherRule: [
              { name: 'total_weight/goStockNum', type: 'add' },
              { name: 'unit' }
            ]
          }
        })
        // 初始化出库日志
        this.materialOutStockLog = res[1].data.data.filter(itemF => +itemF.type === 1 || +itemF.type === 4)
        // 初始化出库数据
        this.materialOutStockInfo = this.$mergeData(this.materialOutStockLog, {
          mainRule: 'client_id',
          otherRule: [
            { name: 'client_name' }
          ],
          childrenName: 'material_info',
          childrenRule: {
            mainRule: 'material_name',
            childrenName: 'attr_info',
            childrenRule: {
              mainRule: ['material_color', 'color_code', 'vat_code'],
              otherRule: [
                { name: 'total_weight', type: 'add' },
                { name: 'unit' }
              ]
            }
          }
        })
        // 将出库数据插入至入库数据
        this.materialGoStockInfo.forEach(itemM => {
          itemM.attr_info.forEach(itemA => {
            itemA.outStockNum = res[1].data.data.filter(itemF => +itemF.type === 1).filter(itemF => itemF.material_name === itemM.material_name && itemF.material_color === itemA.material_color && itemF.color_code === itemA.color_code && itemF.vat_code === itemA.vat_code).map(itemMa => (+itemMa.total_weight || 0)).reduce((a, b) => {
              return a + b
            }, 0)
          })
        })
        // 初始化已分配单位及分配物料
        let clientInfo = this.$mergeData(res[3].data.data.filter(itemF => +itemF.material_type === +this.$route.params.type), {
          mainRule: 'client_id/value',
          otherRule: [
            { name: 'client_name/label' }
          ],
          childrenName: 'material_info',
          childrenRule: {
            mainRule: ['material_name', 'material_attribute/attr_name', 'weight'],
            otherRule: [
              { name: 'unit' }
            ]
          }
        })
        // 初始化出库单位
        this.clientList = [
          {
            value: '0',
            label: '已分配单位',
            children: clientInfo
          }, {
            value: '1',
            label: '织片单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(5)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '2',
            label: '套口单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(6)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '3',
            label: '车缝单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(7)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '4',
            label: '整烫单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(8)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '5',
            label: '钉扣单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(9)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '6',
            label: '烫钻单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(10)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '7',
            label: '手工单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(11)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }, {
            value: '8',
            label: '其它单位',
            children: res[2].data.data.filter(itemF => itemF.type.includes(13)).map(itemM => ({ value: itemM.id, label: itemM.name }))
          }
        ]
        this.loading = false
      })
    },
    // 批量导出excel
    download () {
      let data = this.materialOutStockLog.filter(value => value.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.type_name = item.type === 1 ? '出库' : item.type === 2 ? '入库' : '最终入库'
        return item
      })
      downloadExcel(data, [
        { title: '出库时间', key: 'complete_time' },
        { title: '出库单位', key: 'client_name' },
        { title: '出库仓库', key: 'store_name' },
        { title: this.$route.params.type === '1' ? '原料名称' : '辅料名称', key: 'material_name' },
        { title: '颜色', key: 'material_color' },
        { title: '色号', key: 'color_code' },
        { title: '批/缸号', key: 'vat_code' },
        { title: '数量', key: 'total_weight' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    addItem (data, type) {
      if (type === 'material') {
        data.push({
          material_name: '',
          attrArr: [],
          colorArr: [],
          vatArr: [],
          attr_name: '',
          vat_code: '',
          color_code: '',
          weight: '',
          unit: this.$route.params.type === '1' ? 'kg' : '个'
        })
      } else if (type === 'out') {
        data.push({
          client_id: '',
          material_info: [
            {
              material_name: '',
              attrArr: [],
              colorArr: [],
              vatArr: [],
              attr_name: '',
              vat_code: '',
              color_code: '',
              weight: '',
              unit: this.$route.params.type === '1' ? 'kg' : '个'
            }
          ],
          time: this.$getTime(),
          remark: ''
        })
      } else if (type === 'client') {
        data.push({
          client_id: '',
          weight: ''
        })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    // 出库module点击出库按钮操作时
    outStock (itemM, itemA) {
      if (itemA.goStockNum - (itemA.outStockNum || 0) <= 0) {
        this.$message.warning('检测到该物料已完成出库')
        return
      }
      this.editInfo.push({
        client_id: '',
        material_info: [
          {
            material_name: itemM.material_name,
            attrArr: this.$unique(itemM.attr_info, 'material_color'),
            colorArr: this.$unique(itemM.attr_info.filter(itemF => itemF.material_color === itemA.material_color), 'color_code'),
            vatArr: this.$unique(itemM.attr_info.filter(itemF => itemF.material_color === itemA.material_color).filter(itemF => itemF.color_code === itemA.color_code), 'vat_code'),
            attr_name: itemA.material_color,
            vat_code: itemA.vat_code,
            color_code: itemA.color_code,
            weight: this.$toFixed(itemA.goStockNum - (itemA.outStockNum || 0)),
            unit: itemA.unit || (this.$route.params.type === '1' ? 'kg' : '个')
          }
        ],
        time: this.$getTime(),
        remark: ''
      })
      this.$goElView('outStock')
    },
    // 出库module点击批量出库按钮操作时
    outStockBatch () {
      let checkedData = this.materialGoStockInfo.filter(itemF => itemF.checked)
      if (checkedData.length === 0) {
        this.$message.warning('请选择最少一项需要批量操作的物料')
        return
      }
      let materialInfo = []
      checkedData.forEach(itemM => {
        materialInfo.push(...itemM.attr_info.filter(itemF => (itemF.goStockNum - (itemF.outStockNum || 0)) > 0).map(itemA => {
          return {
            material_name: itemM.material_name,
            attrArr: this.$unique(itemM.attr_info, 'material_color'),
            colorArr: this.$unique(itemM.attr_info.filter(itemF => itemF.material_color === itemA.material_color), 'color_code'),
            vatArr: this.$unique(itemM.attr_info.filter(itemF => itemF.material_color === itemA.material_color).filter(itemF => itemF.color_code === itemA.color_code), 'vat_code'),
            attr_name: itemA.material_color,
            vat_code: itemA.vat_code,
            color_code: itemA.color_code,
            weight: this.$toFixed(itemA.goStockNum - (itemA.outStockNum || 0)),
            unit: itemA.unit || (this.$route.params.type === '1' ? 'kg' : '个')
          }
        }))
      })
      if (materialInfo.length === 0) {
        this.$message.warning('检测到选中物料已完成出库')
        return
      }
      this.editInfo.push({
        client_id: '',
        material_info: materialInfo,
        time: this.$getTime(),
        remark: ''
      })
    },
    // 编辑modeule改变物料时
    changeMaterial (item, e) {
      let flag = this.materialGoStockInfo.find(itemF => itemF.material_name === e)
      if (flag) {
        item.attrArr = this.$unique(flag.attr_info, 'material_color')
        if (!item.attrArr.find(itemF => itemF.material_color === item.attr_name)) { // 判断更改后的物料有没有原颜色 没有则清空
          item.attr_name = ''
          item.color_code = ''
          item.colorArr = []
          item.vat_code = ''
          item.vatArr = []
        } else {
          this.changeColor(item, item.attr_name)
        }
      }
    },
    // 编辑module改变颜色时
    changeColor (item, e) {
      let flag = this.materialGoStockInfo.find(itemF => itemF.material_name === item.material_name)
      if (flag) {
        item.colorArr = this.$unique(flag.attr_info.filter(itemF => itemF.material_color === e), 'color_code')
        if (!item.colorArr.find(itemF => itemF.color_code === item.color_code)) { // 判断更改后的物料有没有原色号 没有则清空
          item.color_code = ''
          item.vat_code = ''
          item.vatArr = []
        } else {
          this.changeColorCode(item, item.color_code)
        }
      }
    },
    // 编辑module改变色号时
    changeColorCode (item, e) {
      let flag = this.materialGoStockInfo.find(itemF => itemF.material_name === item.material_name)
      if (flag) {
        item.vatArr = this.$unique(flag.attr_info.filter(itemF => itemF.material_color === item.attr_name).filter(itemF => itemF.color_code === e), 'vat_code')
        if (!item.vatArr.find(itemF => itemF.vat_code === item.vat_code)) { // 判断更改后的物料有没有原批/缸号 没有则清空
          item.vat_code = ''
        }
      }
    }
  },
  created () {
    this.init(this.$route.params.orderType)
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialStock/materialStockDetail.less";
</style>
<style lang="less">
.materialOutStockDetail_drawer {
  min-width: 900px !important;
}
</style>
