<template>
  <div id='materialStockDetail'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单信息</div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
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
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{orderInfo.desc}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data='orderInfo.order_batch'></zh-batch>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料出入库</span>
      </div>
      <template v-if="materialStockInfo.length > 0">
        <div class="detailCtn noPadding">
          <div class="swichCtn">
            <div class="swichCtnBox"
              style="left: 32px;">
              <span :class="['swich', activeStockMa === itemMa.material_name ? 'active' : '']"
                v-for="(itemMa,indexMa) in materialStockInfo"
                :key="indexMa"
                @click="activeStockMa = itemMa.material_name">{{itemMa.material_name}}</span>
            </div>
            <span class="handleBtn left"></span>
            <span class="handleBtn right"></span>
          </div>
        </div>
        <div class="listCtn">
          <div class="flexTb"
            style="margin:0">
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
                v-for="(itemColor,indexColor) in getActiveStockMa(activeStockMa)"
                :key="indexColor">
                <span class="tcolumn">{{itemColor.attr}}</span>
                <span class="tcolumn">{{itemColor.order_weight}}{{itemColor.type === 1 ? 'kg' : itemColor.unit}}</span>
                <span class="tcolumn">{{itemColor.goStock_weight ? itemColor.goStock_weight : 0}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
                <span class="tcolumn">{{Number(itemColor.order_weight ? itemColor.order_weight : 0) - Number(itemColor.goStock_weight ? itemColor.goStock_weight : 0)}}{{itemColor.type === 1 ? 'kg' : (itemColor.unit ? itemColor.unit : '个')}}</span>
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
            v-for="(itemStock,indexStock) in stockEditInfo"
            :key="indexStock">
            <span class="closeIcon_page el-icon-circle-close"
              @click="deleteItem(stockEditInfo,indexStock,true)"></span>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">出入库单位</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-select v-model="itemStock.client_name"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    placeholder="请选择需要操作的原料">
                    <el-option v-for="item in []"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
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
                  <span class="text">原料名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-select v-model="itemStock.material_name"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    placeholder="请选择需要操作的原料">
                    <el-option v-for="item in []"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">原料颜色</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content middle_page col">
                  <el-select v-model="itemStock.material_attribute"
                    filterable
                    default-first-option
                    clearable
                    class="elInput"
                    placeholder="请选择需要操作的原料颜色">
                    <el-option v-for="item in []"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">入库重量</span>
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
                    v-model="itemStock.remark"></zh-input>
                </div>
              </div>
            </div>
          </div>
          <div class="btnCtn_page marginTop20">
            <div class="btn btnDashed"
              v-show="stockEditInfo.length > 0"
              @click="resetEditInfo('stock')">
              <div class="btn btnOrange">重置</div>
            </div>
            <div class="btn btnDashed bgBlue_page"
              v-if="stockEditInfo.length === 0"
              @click="addItem(stockEditInfo,'stock')">+添加出入库</div>
            <div class="btn btnDashed"
              v-else
              @click="addItem(stockEditInfo,'stock')">
              <div class="btn btnBlue">+添加出入库</div>
            </div>
            <div class="btn btnDashed"
              v-show="stockEditInfo.length > 0">
              <div class="btn btnGreen"
                @click="saveStock">保存</div>
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
        <span class="title">物料织造出库</span>
      </div>
      <div class="detailCtn">
        <div class="swichCtn">
          <span class="swich active">织造车间</span>
          <span class="swich">加工车间</span>
        </div>
      </div>
      <div class="listCtn">
        <div class="flexTb"
          style="margin:1px">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">颜色</span>
              <span class="tcolumn">计划数量</span>
              <span class="tcolumn">已入库数量</span>
              <span class="tcolumn">待入库数量</span>
              <span class="tcolumn">更新时间</span>
              <span class="tcolumn">操作</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow">
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
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
                  placeholder="请选择需要操作的原料">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">原料名称</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemWeave.material_Name"
                  filterable
                  default-first-option
                  clearable
                  class="elInput"
                  placeholder="请选择需要操作的原料">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">原料颜色</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemWeave.material_attribute"
                  filterable
                  default-first-option
                  clearable
                  class="elInput"
                  placeholder="请选择需要操作的原料颜色">
                  <el-option v-for="item in []"
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
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="weaveStockEditInfo.length > 0"
            @click="resetEditInfo('weave')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="weaveStockEditInfo.length === 0"
            @click="addItem(weaveStockEditInfo,'weave')">+添加出入库</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(weaveStockEditInfo,'weave')">
            <div class="btn btnBlue">+添加出入库</div>
          </div>
          <div class="btn btnDashed"
            v-show="weaveStockEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveWeave">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">入库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <!-- <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="searchYarnLog"
              placeholder="输入原料按回车键查询"
              @change="getYarnLog(1)">
            </el-input>
            <el-select v-model="yarnAction"
              class="inputs"
              filterable
              placeholder="请选择需要筛选的类型"
              @change="getYarnLog(1)">
              <el-option v-for="(item,index) in actionArr"
                :key="index"
                :label="item.name"
                :value="item.action">
              </el-option>
            </el-select>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="resetEditInfo('filterYarnLog')">重置</div>
          </div>
        </div> -->
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
              <!-- <template v-if="itemLog.desc">
                <el-popover placement="top"
                  width="200"
                  trigger="click"
                  :content="itemLog.desc">
                  <span class="btn noBorder"
                    style="margin:0"
                    slot="reference">查看</span>
                </el-popover>
              </template>
              <template v-else>无</template> -->
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
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">出库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <!-- <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="searchYarnLog"
              placeholder="输入原料按回车键查询"
              @change="getYarnLog(1)">
            </el-input>
            <el-select v-model="yarnAction"
              class="inputs"
              filterable
              placeholder="请选择需要筛选的类型"
              @change="getYarnLog(1)">
              <el-option v-for="(item,index) in actionArr"
                :key="index"
                :label="item.name"
                :value="item.action">
              </el-option>
            </el-select>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="resetEditInfo('filterYarnLog')">重置</div>
          </div>
        </div> -->
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
              <!-- <template v-if="itemLog.desc">
                <el-popover placement="top"
                  width="200"
                  trigger="click"
                  :content="itemLog.desc">
                  <span class="btn noBorder"
                    style="margin:0"
                    slot="reference">查看</span>
                </el-popover>
              </template>
              <template v-else>无</template> -->
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
    </div>
    <div class="module">
      <div class="detailCtn noPadding">
        <div class="swichCtn">
          <div class="swich active">计划</div>
          <div class="swich">采购</div>
          <div class="swich">加工</div>
        </div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">计划原料</span>
              <span class="tcolumn">原料颜色</span>
              <span class="tcolumn">计划数量</span>
              <span class="tcolumn">总计</span>
            </span>
          </div>
          <div class="tbody"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialStock, weave } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      orderInfo: {},
      materialStockInfo: [],
      activeStockMa: '',
      stockEditInfo: [],
      weaveStockEditInfo: [
        {
          client_name: '',
          material_name: '',
          material_attribute: '',
          number: '',
          time: '',
          remark: ''
        }
      ],
      goStockLog: [],
      goStockLogTotal: 1,
      goStockLogPages: 1,
      outStockLog: [],
      outStockLogTotal: 1,
      outStockLogPages: 1
    }
  },
  methods: {
    saveStock () {

    },
    saveWeave () {

    },
    deleteItem (item, index, flag) {
      if (!flag && (item.length < 2)) {
        this.$message.warning('至少保留一项')
      } else {
        this.$confirm('此操作将删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.splice(index, 1)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    addItem (item, type) {
      if (type === 'stock') {
        item.push({
          client_name: '',
          editType: 'go',
          material_name: this.activeStockMa,
          material_attribute: item.attr,
          number: '',
          time: this.$getTime(),
          remark: ''
        })
      }
    },
    getGoStockLog () {

    },
    getOutStockLog () {

    },
    getActiveStockMa (activeName) {
      let activeInfo = this.materialStockInfo.find(item => item.material_name === activeName)
      return activeInfo ? activeInfo.color_info : []
    },
    handleClick (item, type) {
      this.stockEditInfo.push({
        client_name: '',
        editType: type,
        material_name: this.activeStockMa,
        material_attribute: item.attr,
        number: '',
        time: this.$getTime(),
        remark: ''
      })
    }
  },
  created () {
    Promise.all([
      // materialPlan.editDetail({
      //   order_id: this.$route.params.id,
      //   order_type: this.$route.params.type
      // }),
      materialStock.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      }),
      weave.detail({
        order_id: this.$route.params.id
      })
    ]).then(res => {
      let materialPlan = res[0].data.data.order_material_plan.total_data
      this.orderInfo = res[0].data.data.order_info
      console.log(materialPlan.filter(itemMa => itemMa.order_weight))
      this.materialStockInfo = this.$mergeData(materialPlan.filter(itemMa => Number(itemMa.order_weight) && Number(itemMa.order_weight) !== 0), { mainRule: ['material_name'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'order_weight', type: 'add' }, { name: 'unit' }, { name: 'updated_at' }, { name: 'material_type/type' }] } })
      this.activeStockMa = this.materialStockInfo[0] ? this.materialStockInfo[0].material_name : ''
    })
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
