<template>
  <div id='materialStockDetail'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">订单信息</span>
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
      <div class="cut_item active">
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
      <div class="titleCtn">
        <span class="title">物料入库</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row">订购公司</span>
              <span class="tb_row tb_col flex5">
                <span class="tb_col_item">
                  <span class="tb_row">原料名称</span>
                  <span class="tb_row tb_col flex30">
                    <span class="tb_col_item">
                      <span class="tb_row">颜色</span>
                      <span class="tb_row right flex06">订购数量</span>
                      <span class="tb_row right flex06">已入库数量</span>
                      <span class="tb_row right flex06">待入库数量</span>
                      <span class="tb_row middle flex06">操作</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <span class="tb_content"
              v-for="(itemC,indexC) in materialOrderInfo"
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
                      <span class="tb_row ">{{itemA.color_code}}</span>
                      <span class="tb_row right flex06">{{itemA.weight}}kg</span>
                      <span class="tb_row right green flex06">{{$toFixed(itemA.push_weight) || 0}}kg</span>
                      <span class="tb_row right orange flex06">{{$toFixed(itemA.weight - (itemA.push_weight || 0) > 0 ? itemA.weight - (itemA.push_weight || 0) : 0)}}kg</span>
                      <span class="tb_row middle flex06">
                        <span class="tb_handle_btn blue"
                          @click="goStock(itemC,itemM,itemA)">入库</span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <div class="editCtn bgGray_page"
              v-for="(itemC,indexC) in editInfo"
              :key="`edit-${indexC}`"
              :id="indexC === 0 ? 'goStock' : ''">
              <span class="deleteIcon el-icon-close"
                @click="deleteItem(editInfo,indexC)"></span>
              <div class="rowCtn">
                <div class="colCtn flex3">
                  <span class="label">
                    <span class="text">选择单位</span>
                  </span>
                  <span class="content">
                    <el-select v-model="itemC.client_id"
                      filterable
                      default-first-option
                      clearable
                      class="elInput"
                      placeholder="请选择入库单位"
                      @change="changeClient(itemC)">
                      <el-option v-for="item in clientList"
                        :key="item.client_id"
                        :label="item.client_name"
                        :value="item.client_id">
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
                    <template v-if="itemC.isCustomerSupplied">
                      <el-autocomplete class="elInput"
                        clearable
                        v-model="itemM.material_name"
                        :fetch-suggestions="querySearchMaterial"
                        :placeholder="`请选择入库${$route.params.type === '1' ? '原' : '辅'}料`"></el-autocomplete>
                    </template>
                    <template v-else>
                      <el-select v-model="itemM.material_name"
                        filterable
                        default-first-option
                        clearable
                        class="elInput"
                        :placeholder="`请选择入库${$route.params.type === '1' ? '原' : '辅'}料`"
                        @change="changeMaterial(itemM,itemC.materialArr,itemC.isCustomerSupplied)">
                        <el-option v-for="(itemI,indexI) in itemC.materialArr"
                          :key="indexI"
                          :label="itemI.material_name"
                          :value="itemI.material_name">
                        </el-option>
                      </el-select>
                    </template>
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
                        <template v-if="itemC.isCustomerSupplied">
                          <el-autocomplete class="elInput"
                            clearable
                            v-model="itemM.attr_name"
                            :fetch-suggestions="querySearchAttr"
                            :placeholder="`请选择${$route.params.type === '1' ? '原' : '辅'}料颜色`"></el-autocomplete>
                        </template>
                        <template v-else>
                          <el-select v-model="itemM.attr_name"
                            filterable
                            default-first-option
                            clearable
                            class="elInput"
                            :placeholder="`请选择${$route.params.type === '1' ? '原' : '辅'}料颜色`">
                            <el-option v-for="itemI in itemM.attrArr"
                              :key="itemI.id"
                              :label="itemI.color_code + '-' + itemI.id"
                              :value="itemI.color_code + '-' + itemI.id">
                            </el-option>
                          </el-select>
                        </template>
                      </span>
                    </div>
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">色号</span>
                      </span>
                      <span class="content">
                        <zh-input v-model="itemM.color_code"
                          placeholder='请输入色号'></zh-input>
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
                        <zh-input v-model="itemM.vat_code"
                          placeholder='请输入批/缸号'></zh-input>
                      </span>
                    </div>
                    <div class="colCtn">
                      <span class="label"
                        v-if="indexM === 0">
                        <span class="text">入库数量</span>
                      </span>
                      <span class="contetn">
                        <zh-input v-model="itemM.weight"
                          placeholder='请输入数量'>
                          <template slot="append">kg</template>
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
                    <span class="text">入库时间</span>
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
                @click="addItem(editInfo,'go')">添加入库</span>
              <template v-else>
                <span class="once cancle">取消</span>
                <span class="once normal"
                  @click="addItem(editInfo,'go')">添加入库</span>
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
        <span class="title">物料入库信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn col">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
              <span class="tb_row tb_col flex30">
                <span class="tb_col_item">
                  <span class="tb_row">颜色</span>
                  <span class="tb_row flex06">色号</span>
                  <span class="tb_row flex06">批号</span>
                  <span class="tb_row flex06">入库数量</span>
                </span>
              </span>
            </span>
            <span class="tb_content"
              v-for="(itemM,indexM) in materialStockInfo"
              :key="indexM">
              <span class="tb_row">{{itemM.material_name}}</span>
              <span class="tb_row tb_col flex30">
                <span class="tb_col_item"
                  v-for="(itemA,indexA) in itemM.attr_info"
                  :key="indexA">
                  <span class="tb_row">{{itemA.material_color}}</span>
                  <span class="tb_row flex06">{{itemA.color_code || '/'}}</span>
                  <span class="tb_row flex06">{{itemA.vat_code || '/'}}</span>
                  <span class="tb_row green flex06">{{$toFixed(itemA.total_weight || 0)}}kg</span>
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
            <div class="btn btnWhiteBlue"
              @click="deleteLog(materialStockLog,'all')">批量删除</div>
          </div>
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row max40">
                <el-checkbox v-model="checkedAll"
                  @change="checkedAllLog" />
              </span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row flex15">入库来源</span>
              <span class="tb_row flex15">{{$route.params.type === '1' ? '原' : '辅'}}料名称</span>
              <span class="tb_row">颜色</span>
              <span class="tb_row flex06">色号</span>
              <span class="tb_row flex06">批号</span>
              <span class="tb_row flex06">入库数量</span>
              <span class="tb_row flex06">操作人</span>
              <span class="tb_row flex06 middle">操作</span>
            </span>
            <span class="tb_content"
              v-for="(itemLog,indexLog) in materialStockLog"
              :key="indexLog">
              <span class="tb_row max40">
                <el-checkbox v-model="itemLog.checked"
                  @change="$forceUpdate()" />
              </span>
              <span class="tb_row">{{itemLog.complete_time}}</span>
              <span class="tb_row flex15">{{itemLog.client_name}}</span>
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
import { order, sampleOrder, materialStock, materialManage, yarn, yarnColor, pantongList } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      orderInfo: {},
      materialOrderInfo: [],
      clientList: [], // 涉及单位列表
      materialList: [], // 当选择客供纱时所有物料名称
      attrList: [],
      editInfo: [], // 入库编辑
      materialStockInfo: [],
      checkedAll: false,
      materialStockLog: [], // 入库日志
      productMatArr: []
    }
  },
  methods: {
    saveAll () {
      if (this.$submitLock()) return
      let flag = {
        client: true,
        material: true,
        color: true,
        number: true,
        time: true
      }
      let data = this.$flatten(this.editInfo.map(itemE => {
        if (!itemE.client_id) {
          flag.client = false
        }
        if (!itemE.time) {
          flag.time = false
        }
        return itemE.material_info.map(itemM => {
          if (!itemM.material_name) {
            flag.material = false
          }
          if (!itemM.attr_name) {
            flag.color = false
          }
          if (!itemM.weight) {
            flag.number = false
          }
          let info = itemM.attr_name.split('-')
          let orderId = null
          let attrName = null
          if (itemE.isCustomerSupplied) {
            attrName = itemM.attr_name
          } else {
            orderId = info.splice(info.length - 1, 1)[0]
            attrName = info.join('-')
          }
          info.splice()
          return {
            desc: itemE.remark,
            total_weight: itemM.weight,
            store_id: null,
            color_code: itemM.color_code,
            material_name: itemM.material_name,
            material_type: this.$route.params.type,
            vat_code: itemM.vat_code,
            material_order_id: orderId,
            material_color: attrName,
            complete_time: itemE.time,
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType,
            client_id: itemE.client_id
          }
        })
      }))
      if (!flag.client) {
        this.$message.error('请选择入库单位')
        return
      }
      if (!flag.material) {
        this.$message.error(`请选择入库${this.$route.params.type === '1' ? '原' : '辅'}料`)
        return
      }
      if (!flag.color) {
        this.$message.error(`请选择入库${this.$route.params.type === '1' ? '原' : '辅'}料颜色`)
        return
      }
      if (!flag.number) {
        this.$message.error('请输入入库数量')
        return
      }
      if (!flag.time) {
        this.$message.error('请选择入库时间')
        return
      }
      materialStock.create({ type: 2, data: data }).then(res => {
        if (res.data.status !== false) {
          this.editInfo = []
          this.$message.success('保存成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialStock/materialStockDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料入库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
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
      this.materialStockLog.forEach(itemF => {
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
        materialManage.detail({
          order_type: this.$route.params.orderType,
          order_id: this.$route.params.id
        }),
        materialStock.detail({
          order_type: this.$route.params.orderType,
          order_id: this.$route.params.id
        })
      ]).then(res => {
        this.orderInfo = res[0].data.data
        this.clientList = [{
          isCustomerSupplied: true,
          client_id: res[0].data.data.client_id,
          client_name: `${res[0].data.data.client_name}(客供纱)`
        }]
        // 优化客供时选择原料框内直接建议产品内物料成分
        if (type === '1') {
          this.productMatArr = this.$unique(this.$flatten(this.orderInfo.order_batch.map(itemB => {
            return itemB.product_info.map(itemP => {
              return itemP.component.map(itemC => {
                return { value: itemC.component_name }
              })
            })
          })), 'value')
        } else {
          this.productMatArr = this.$unique(this.$flatten(this.orderInfo.product_info.map(itemP => {
            return itemP.product_info.component.map(itemC => {
              return { value: itemC.component_name }
            })
          })), 'value')
        }
        // 初始化订购数据
        this.materialOrderInfo = this.$mergeData(res[1].data.data, {
          mainRule: 'client_id',
          otherRule: [
            { name: 'client_name' }
          ],
          childrenName: 'material_info',
          childrenRule: {
            mainRule: 'material_name',
            childrenName: 'attr_info',
            childrenRule: {
              mainRule: 'id',
              otherRule: [
                { name: 'before_color' },
                { name: 'color_code' },
                { name: 'weight' },
                { name: 'push_weight' },
                { name: 'price' },
                { name: 'type_source' }
              ]
            }
          }
        })
        this.clientList = [...this.clientList, ...this.materialOrderInfo]
        // 初始化日志
        this.materialStockLog = res[2].data.data
        // 初始化入库数据
        this.materialStockInfo = this.$mergeData(res[2].data.data, {
          mainRule: 'material_name',
          childrenName: 'attr_info',
          childrenRule: {
            mainRule: ['material_color', 'color_code', 'vat_code'],
            otherRule: [
              { name: 'total_weight', type: 'add' }
            ]
          }
        })
        this.loading = false
      })
    },
    // 批量导出excel
    download () {
      let data = this.materialStockLog.filter(value => value.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      downloadExcel(data, [
        { title: '入库时间', key: 'complete_time' },
        { title: '入库单位', key: 'client_name' },
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
          attr_name: '',
          vat_code: '',
          color_code: '',
          weight: ''
        })
      } else if (type === 'go') {
        data.push({
          client_id: '',
          materialArr: [],
          material_info: [
            {
              material_name: '',
              attrArr: [],
              attr_name: '',
              vat_code: '',
              color_code: '',
              weight: ''
            }
          ],
          time: '',
          remark: ''
        })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    // 入库module点击入库按钮操作时
    goStock (itemC, itemM, itemA) {
      this.editInfo.push({
        client_id: itemC.client_id,
        materialArr: itemC.material_info,
        material_info: [
          {
            material_name: itemM.material_name,
            attrArr: itemM.attr_info,
            attr_name: itemA.color_code + '-' + itemA.id,
            vat_code: '',
            color_code: '',
            weight: this.$toFixed(itemA.weight - (itemA.push_weight || 0) > 0 ? itemA.weight - (itemA.push_weight || 0) : 0)
          }
        ],
        time: this.$getTime(),
        remark: ''
      })
      this.$goElView('goStock')
    },
    querySearchMaterial (queryString, callback) {
      if (this.materialList.length === 0) {
        yarn.list().then(res => {
          if (res.data.status !== false) {
            this.materialList = res.data.data.map(itemM => ({ value: itemM.name }))
            this.querySearchMaterial(queryString, callback)
          }
        })
      } else {
        let list = queryString ? this.materialList.filter(itemF => itemF.value.indexOf(queryString) !== -1) : this.productMatArr
        callback(list)
      }
    },
    querySearchAttr (queryString, cb) {
      if (this.attrList.length === 0) {
        yarnColor.list().then(res => {
          if (res.data.status !== false) {
            this.attrList = res.data.data.map(itemM => ({ value: itemM.name }))
            this.querySearchAttr(queryString, cb)
          }
        })
      } else {
        let list = queryString ? this.attrList.filter(itemF => itemF.value.indexOf(queryString) !== -1) : this.attrList
        pantongList({
          keyword: queryString
        }).then(res => {
          if (res.data.status !== false) {
            cb(list.concat(res.data.data.map(itemM => ({ value: itemM.name }))))
          }
        })
      }
    },
    // 编辑module改变单位时
    changeClient (item) {
      let flag = this.clientList.find(itemF => itemF.client_id === item.client_id)
      if (flag && flag.isCustomerSupplied) {
        item.isCustomerSupplied = true
      } else {
        item.isCustomerSupplied = false
        item.material_info.forEach(itemF => {
          itemF.material_name = ''
          itemF.attrArr = []
          itemF.attr_name = ''
        })
        let flagM = this.materialOrderInfo.find(itemF => itemF.client_id === item.client_id)
        if (flagM) {
          item.materialArr = flagM.material_info
        }
      }
    },
    // 编辑module为非客供时改变原料更新属性
    changeMaterial (item, materialArr, isCustomerSupplied) {
      if (isCustomerSupplied) {

      } else {
        let flag = materialArr.find(itemF => itemF.material_name === item.material_name)
        if (flag) {
          item.attrArr = flag.attr_info
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
