<template>
  <div id='packStock'
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
        <div class="title">实际装箱信息</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb"
          style="margin:1px">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">包装类型</span>
              <span class="tcolumn">包装序号</span>
              <span class="tcolumn">包装数量</span>
              <span class="tcolumn">包含产品</span>
              <span class="tcolumn">尺码/颜色</span>
              <span class="tcolumn">实际装箱</span>
              <span class="tcolumn">计划数量</span>
              <span class="tcolumn">装箱差值</span>
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
              <span class="tcolumn"></span>
              <span class="tcolumn"></span>
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          v-for="(itemOut,indexOut) in outPackingEditInfo"
          :key="indexOut">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(outPackingEditInfo,indexOut,true)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">包装类型</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.name"
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
                <span class="text">包装序号</span>
              </div>
              <div class="content">
                <div class="content elInput middle">
                  <zh-input type='number'
                    placeholder='箱数'
                    v-model="itemOut.transport_number">
                  </zh-input>
                  ~
                  <zh-input type='number'
                    placeholder='箱数'
                    v-model="itemOut.transport_number">
                  </zh-input>
                </div>
                <zh-input type='number'
                  class="elInput"
                  placeholder='箱数'
                  v-model="itemOut.cube_number">
                  <template slot="append">箱</template>
                </zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">包含产品</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.out_country"
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
                <span class="text"></span>
              </div>
              <div class="content">
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">尺码规格</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.transport_number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">计划数量</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.cube_number">
                        <template slot="append">条</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">实际装箱数</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入实际装箱数量"
                  class="elInput"
                  v-model="itemOut.number"
                  type="number"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="outPackingEditInfo.length > 0"
            @click="resetEditInfo('weave')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="outPackingEditInfo.length === 0"
            @click="addItem(outPackingEditInfo,'outPacking')">+添加运输单位</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(outPackingEditInfo,'outPacking')">
            <div class="btn btnBlue">+添加运输单位</div>
          </div>
          <div class="btn btnDashed"
            v-show="outPackingEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveOutPacking">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">装箱出库</div>
      </div>
      <div class="listCtn hasBorderTop">
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
          v-for="(itemOut,indexOut) in outPackingEditInfo"
          :key="indexOut">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(outPackingEditInfo,indexOut,true)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">运输单位</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.client_name"
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
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">运输箱数</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.transport_number">
                        <template slot="append">箱</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">出库立方数</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.cube_number">
                        <template slot="append">m³</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text"></span>
              </div>
              <div class="content">
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">运输单价</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.transport_price">
                        <template slot="append">元/m³</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">运输总价</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.total_price">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出库国家</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.out_country"
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
                <span class="text">运输地址</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入运输地址"
                  class="elInput"
                  v-model="itemOut.number"></zh-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出库港口</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入出库港口"
                  class="elInput"
                  v-model="itemOut.number"></zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">完成时间</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-date-picker v-model="itemOut.compile_time"
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
                  v-model="itemOut.remark"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="outPackingEditInfo.length > 0"
            @click="resetEditInfo('weave')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="outPackingEditInfo.length === 0"
            @click="addItem(outPackingEditInfo,'outPacking')">+添加运输单位</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(outPackingEditInfo,'outPacking')">
            <div class="btn btnBlue">+添加运输单位</div>
          </div>
          <div class="btn btnDashed"
            v-show="outPackingEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveOutPacking">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">实际装箱日志</div>
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
            <span class="tb_row">操作时间</span>
            <span class="tb_row">产品信息</span>
            <span class="tb_row flex08">尺码颜色</span>
            <span class="tb_row flex08">实际装箱数</span>
            <span class="tb_row flex08">操作人</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in actualPackingLog"
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
              <span class="tb_handle_btn red">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="actualPackingLogTotal"
            :current-page.sync="actualPackingLogPages"
            @current-change='getActualPackingLog'>
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">装箱出库日志</div>
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
            <span class="tb_row">操作时间</span>
            <span class="tb_row">运输单位</span>
            <span class="tb_row flex08">运输箱数</span>
            <span class="tb_row flex08">立方数（m³）</span>
            <span class="tb_row flex08">运输单位</span>
            <span class="tb_row middle flex08">运输总价</span>
            <span class="tb_row middle flex08">其他信息</span>
            <span class="tb_row middle flex08">完成时间</span>
            <span class="tb_row middle flex08">操作人</span>
            <span class="tb_row middle flex08">备注</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in outPackingLog"
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
            :total="outPackingLogTotal"
            :current-page.sync="outPackingLogPages"
            @current-change='getOutPackingLog'>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      orderInfo: {},
      actualPackingLog: [],
      actualPackingLogTotal: 1,
      actualPackingLogPages: 1,
      outPackingLog: [],
      outPackingLogTotal: 1,
      outPackingLogPages: 1,
      outPackingEditInfo: []
    }
  },
  methods: {
    getActualPackingLog () {

    },
    getOutPackingLog () {

    },
    saveOutPacking () {

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
      if (type === 'outPacking') {
        item.push({
          transport_client: '',
          transport_number: '',
          cube_number: '',
          transport_price: '',
          total_price: '',
          out_country: '',
          transport_address: '',
          out_port: '',
          compile_time: this.$getTime(),
          remark: ''
        })
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packStock.less";
</style>
