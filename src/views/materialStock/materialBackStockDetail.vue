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
      <div class="cut_item"
        @click="$router.push(`/materialStock/materialOutStockDetail/${$route.params.id}/${$route.params.type}/${$route.params.orderType}`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaochuku"></use>
        </svg>
        <span class="name">物料出库</span>
      </div>
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaohuiku"></use>
        </svg>
        <span class="name">物料回库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">物料回库</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row">出库单位</span>
              <span class="tb_row tb_col flex5">
                <span class="tb_col_item">
                  <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                  <span class="tb_row tb_col flex30">
                    <span class="tb_col_item">
                      <span class="tb_row">颜色</span>
                      <span class="tb_row flex06">色号</span>
                      <span class="tb_row flex06">批/缸号</span>
                      <span class="tb_row right flex06">出库数量</span>
                      <span class="tb_row middle flex06">操作</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <span class="tb_content"
              v-for="(itemC,indexC) in materialOutStockInfo"
              :key="indexC">
              <span class="tb_row">{{itemC.client_name}}</span>
              <span class="tb_row tb_col flex5">
                <span class="tb_col_item"
                  v-for="(itemM,indexM) in itemC.material_info"
                  :key="indexM">
                  <span class="tb_row">{{itemM.material_name}}</span>
                  <span class="tb_row tb_col flex30">
                    <span class="tb_col_item"
                      v-for="(itemA,indexA) in itemM.attr_info"
                      :key="indexA">
                      <span class="tb_row">{{itemA.material_color}}</span>
                      <span class="tb_row flex06">{{itemA.color_code || '/'}}</span>
                      <span class="tb_row flex06">{{itemA.vat_code || '/'}}</span>
                      <span class="tb_row right flex06 green">{{itemA.total_weight}}{{$route.params.type === '1' ? 'kg' : '个'}}</span>
                      <span class="tb_row middle flex06">
                        <span class="tb_handle_btn blue"
                          @click="goBatckStock(itemC,itemM,itemA)">回库</span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <div class="editCtn bgGray_page"
              v-for="(itemC,indexC) in editInfo"
              :key="`edit-${indexC}`"
              :id="indexC === 0 ? 'goBackStock' : ''">
              <span class="deleteIcon el-icon-close"
                @click="deleteItem(editInfo,indexC)"></span>
              <div class="rowCtn">
                <div class="colCtn flex3">
                  <span class="label">
                    <span class="text">选择回库单位</span>
                  </span>
                  <span class="content">
                    <el-select v-model="itemC.client_id"
                      filterable
                      default-first-option
                      clearable
                      placeholder="请选择回库单位"
                      @change="changeClient(itemC)">
                      <el-option v-for="item in materialOutStockInfo"
                        :key="item.client_id"
                        :label="item.client_name"
                        :value="item.client_id">
                      </el-option>
                    </el-select>
                  </span>
                </div>
                <div class="colCtn flex3">
                  <span class="label">
                    <span class="text">选择回库仓库</span>
                  </span>
                  <span class="content">
                    <el-select v-model="itemC.stock_id"
                      filterable
                      default-first-option
                      clearable
                      placeholder="请选择回库仓库">
                      <el-option v-for="item in stockList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </span>
                </div>
              </div>
              <div class="rowCtn"
                v-for="(itemM,indexM) in itemC.material_info"
                :key="indexM">
                <div class="colCtn flex3">
                  <span class="label"
                    v-if="indexM === 0">
                    <span class="text">原料名称</span>
                  </span>
                  <span class="content">
                    <el-select v-model="itemM.material_name"
                      filterable
                      default-first-option
                      clearable
                      :placeholder="`请选择回库${$route.params.type === '1' ? '原' : '辅'}料`"
                      @change="changeMaterial(itemC.materialArr,itemM,$event)">
                      <el-option v-for="(itemI,indexI) in itemC.materialArr"
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
                        <span class="text">原料颜色</span>
                      </span>
                      <span class="content">
                        <el-select v-model="itemM.attr_name"
                          filterable
                          default-first-option
                          clearable
                          :placeholder="`请选择${$route.params.type === '1' ? '原' : '辅'}料颜色`"
                          @change="changeColor(itemC.materialArr,itemM,$event)">
                          <el-option v-for="itemI in itemM.attrArr"
                            :key="itemI.id"
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
                          placeholder='请输入色号'
                          @change="changeColorCode(itemC.materialArr,itemM,$event)">
                          <el-option v-for="itemI in itemM.colorArr"
                            :key="itemI.id"
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
                          placeholder='请输入批/缸号'>
                          <el-option v-for="itemI in itemM.vatArr"
                            :key="itemI.id"
                            :label="itemI.vat_code"
                            :value="itemI.vat_code">
                          </el-option>
                        </el-select>
                      </span>
                    </div>
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">回库数量</span>
                      </span>
                      <span class="contetn">
                        <zh-input v-model="itemM.weight"
                          placeholder='请输入数量'>
                          <template slot="append">{{$route.params.type === '1' ? 'kg' : '个'}}</template>
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
                    <span class="text">回库时间</span>
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
                @click="addItem(editInfo,'goBack')">添加回库</span>
              <template v-else>
                <span class="once cancle"
                  @click="resetEdit">取消</span>
                <span class="once normal"
                  @click="addItem(editInfo,'goBack')">添加回库</span>
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
        <span class="title hasBorder">物料回库信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row">回库单位</span>
              <span class="tb_row tb_col flex30">
                <span class="tb_col_item">
                  <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
                  <span class="tb_row tb_col flex2">
                    <span class="tb_col_item">
                      <span class="tb_row">颜色</span>
                      <span class="tb_row flex06">色号</span>
                      <span class="tb_row flex06">批号</span>
                      <span class="tb_row right flex06">回库数量</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <span class="tb_content"
              v-for="(itemC,indexC) in materialBackStockInfo"
              :key="indexC">
              <span class="tb_row">{{itemC.client_name}}</span>
              <span class="tb_row tb_col flex30">
                <span class="tb_col_item"
                  v-for="(itemM,indexM) in itemC.material_info"
                  :key="indexM">
                  <span class="tb_row">{{itemM.material_name}}</span>
                  <span class="tb_row tb_col flex2">
                    <span class="tb_col_item"
                      v-for="(itemA,indexA) in itemM.attr_info"
                      :key="indexA">
                      <span class="tb_row">{{itemA.material_color}}</span>
                      <span class="tb_row flex06">{{itemA.color_code || '/'}}</span>
                      <span class="tb_row flex06">{{itemA.vat_code || '/'}}</span>
                      <span class="tb_row flex06 right green">{{$toFixed(itemA.total_weight)}}{{$route.params.type === '1' ? 'kg' : '个'}}</span>
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
        <span class="title hasBorder">日志信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="btnCtn_page">
            <div class="btn btnWhiteBlue"
              @click="deleteLog(materialBackStockLog,'all')">批量删除</div>
          </div>
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row max40">
                <el-checkbox v-model="checkedAll"
                  @change="checkedAllLog" />
              </span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row flex15">回库单位</span>
              <span class="tb_row flex15">回库仓库</span>
              <span class="tb_row flex15">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
              <span class="tb_row">颜色</span>
              <span class="tb_row flex06">色号</span>
              <span class="tb_row flex06">批号</span>
              <span class="tb_row flex06">回库数量</span>
              <span class="tb_row flex06">操作人</span>
              <span class="tb_row flex06 middle">操作</span>
            </span>
            <span class="tb_content"
              v-for="(itemLog,indexLog) in materialBackStockLog"
              :key="indexLog.id">
              <span class="tb_row max40">
                <el-checkbox v-model="itemLog.checked"
                  @change="$forceUpdate()" />
              </span>
              <span class="tb_row">{{itemLog.complete_time}}</span>
              <span class="tb_row flex15">{{itemLog.client_name}}</span>
              <span class="tb_row flex15">{{itemLog.store_name}}</span>
              <span class="tb_row flex15">{{itemLog.material_name}}</span>
              <span class="tb_row">{{itemLog.material_color}}</span>
              <span class="tb_row flex06">{{itemLog.color_code || '/'}}</span>
              <span class="tb_row flex06">{{itemLog.vat_code || '/'}}</span>
              <span class="tb_row flex06">{{$toFixed(itemLog.total_weight)}}</span>
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
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, sampleOrder, materialStock, stock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      orderInfo: {},
      materialOutStockInfo: [],
      stockList: [],
      editInfo: [], // 回库编辑
      materialBackStockInfo: [],
      checkedAll: false,
      materialBackStockLog: []
    }
  },
  methods: {
    saveAll (type) {
      if (this.$submitLock()) return
      let flag = {
        client: true,
        stock: true,
        material: true,
        color: true,
        number: true,
        time: true
      }
      let data = this.$flatten(this.editInfo.map(itemC => {
        if (!itemC.client_id) {
          flag.client = false
        }
        if (!itemC.stock_id) {
          flag.stock = false
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
            store_id: itemC.stock_id,
            color_code: itemM.color_code,
            material_name: itemM.material_name,
            material_type: this.$route.params.type,
            vat_code: itemM.vat_code,
            material_order_id: null,
            material_color: itemM.attr_name,
            complete_time: itemC.time,
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType,
            client_id: itemC.client_id
          }
        })
      }))
      if (!flag.client) {
        this.$message.error('请选择回库单位')
        return
      }
      if (!flag.stock) {
        this.$message.error('请选择回库仓库')
        return
      }
      if (!flag.material) {
        this.$message.error(`请选择回库${this.$route.params.type === '1' ? '原' : '辅'}料`)
        return
      }
      if (!flag.color) {
        this.$message.error(`请选择回库${this.$route.params.type === '1' ? '原' : '辅'}料颜色`)
        return
      }
      if (!flag.number) {
        this.$message.error('请输入回库数量')
        return
      }
      if (!flag.time) {
        this.$message.error('请选择回库时间')
        return
      }
      materialStock.create({ type: 3, data: data }).then(res => {
        if (res.data.status !== false) {
          this.editInfo = []
          this.$message.success('保存成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialStock/materialStockDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料回库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.init(this.$route.params.orderType)
          }
        }
      })
    },
    deleteLog (type, item) {
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
      this.materialBackStockLog.forEach(itemF => {
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
        stock.list()
      ]).then(res => {
        this.orderInfo = res[0].data.data
        // 初始化出库及调取出库数据
        this.materialOutStockInfo = this.$mergeData(res[1].data.data.filter(itemF => +itemF.type === 1 || +itemF.type === 4), {
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
                { name: 'total_weight', type: 'add' }
              ]
            }
          }
        })
        // 初始化回库日志
        this.materialBackStockLog = res[1].data.data.filter(itemF => +itemF.type === 3)
        // 初始化回库数据
        this.materialBackStockInfo = this.$mergeData(this.materialBackStockLog, {
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
                { name: 'total_weight', type: 'add' }
              ]
            }
          }
        })
        // 初始化仓库数据
        this.stockList = res[2].data.data.filter(itemF => +itemF.type === (this.$route.params.type === '1' ? 1 : 2))
        this.loading = false
      })
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
    addItem (data, type) {
      if (type === 'material') {
        data.push({
          material_name: '',
          attrArr: [],
          attr_name: '',
          vat_code: '',
          color_code: '',
          weight: ''
        })
      } else if (type === 'goBack') {
        data.push({
          client_id: '',
          stock_id: '',
          materialArr: [],
          material_info: [
            {
              material_name: '',
              attrArr: [],
              colorArr: [],
              vatArr: [],
              attr_name: '',
              vat_code: '',
              color_code: '',
              weight: ''
            }
          ],
          time: this.$getTime(),
          remark: ''
        })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    resetEdit () {
      this.$confirm('此操作将清空正在编辑的回库数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editInfo = []
      })
    },
    // 入库module点击入库按钮操作时
    goBatckStock (itemC, itemM, itemA) {
      this.editInfo.push({
        client_id: itemC.client_id,
        stock_id: '',
        materialArr: itemC.material_info,
        material_info: [
          {
            material_name: itemM.material_name,
            attrArr: this.$unique(itemM.attr_info, 'material_color'),
            colorArr: this.$unique(itemM.attr_info.filter(itemF => itemF.material_color === itemA.material_color), 'color_code'),
            vatArr: this.$unique(itemM.attr_info.filter(itemF => itemF.material_color === itemA.material_color).filter(itemF => itemF.color_code === itemA.color_code), 'vat_code'),
            attr_name: itemA.material_color,
            vat_code: itemA.vat_code,
            color_code: itemA.color_code,
            weight: ''
          }
        ],
        time: this.$getTime(),
        remark: ''
      })
      this.$goElView('goBackStock')
    },
    // 编辑module改变单位时
    changeClient (item) {
      let flag = this.materialOutStockInfo.find(itemF => itemF.client_id === item.client_id)
      if (flag) {
        item.materialArr = flag.material_info
        item.material_info.forEach(itemM => {
          if (!flag.material_info.find(itemF => itemF.material_name === itemM.material_name)) { // 判断更改后有没有原物料 没有则清空
            itemM.material_name = ''
            itemM.attr_name = ''
            itemM.color_code = ''
            itemM.vat_code = ''
            itemM.attrArr = []
            itemM.colorArr = []
            itemM.vatArr = []
          } else {
            this.changeMaterial(item, itemM.material_name)
          }
        })
      }
    },
    // 编辑module改变物料时
    changeMaterial (sourceData, item, e) {
      let flag = sourceData.find(itemF => itemF.material_name === e)
      if (flag) {
        item.attrArr = this.$unique(flag.attr_info, 'material_color')
        if (!item.attrArr.find(itemF => itemF.material_color === item.attr_name)) {
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
    changeColor (sourceData, item, e) {
      let flag = sourceData.find(itemF => itemF.material_name === item.material_name)
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
    changeColorCode (sourceData, item, e) {
      let flag = sourceData.find(itemF => itemF.material_name === item.material_name)
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
