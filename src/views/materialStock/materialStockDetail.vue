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
            <span class="text">订单测试一</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">桐庐凯瑞</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">2019-01-23</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">叶浩文</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">其他</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"></span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">批次信息：</span>
            <span class="text"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料出入库</span>
      </div>
      <div class="detailCtn">
        <div class="swichCtn">
          <div class="swichCtnBox"
            style="left: 32px;">
            <span class="swich active">C19AAA0128</span>
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
          v-for="(itemYarn,indexYarn) in yarnEditInfo"
          :key="indexYarn">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(yarnEditInfo,indexYarn,true)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出入库单位</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemYarn.clientName"
                  filterable
                  default-first-option
                  clearable
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
              <div class="content middle_page col">
                <el-radio-group v-model="itemYarn.editType">
                  <el-radio label="out">出库</el-radio>
                  <el-radio label="go">入库</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text"></span>
              </div>
              <div class="content"></div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">原料名称</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemYarn.yarnName"
                  filterable
                  default-first-option
                  clearable
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
                <el-select v-model="itemYarn.yarnColor"
                  filterable
                  default-first-option
                  clearable
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
                  v-model="itemYarn.number"
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
                <el-date-picker v-model="itemYarn.time"
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
                  v-model="itemYarn.remark"></zh-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">备注</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入备注"
                  v-model="itemYarn.remark"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page right marginTop20">
          <div class="btn btnDashed"
            v-show="yarnEditInfo.length > 0"
            @click="resetEditInfo('yarn')">重置</div>
          <div class="btn btnDashed bgBlue_page"
            v-if="yarnEditInfo.length === 0"
            @click="addItem(yarnEditInfo,'yarn')">+添加出入库</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(yarnEditInfo,'yarn')">
            <div class="btn btnOrange">+添加出入库</div>
          </div>
          <div class="btn btnDashed"
            v-show="yarnEditInfo.length > 0">
            <div class="btn btnBlue"
              @click="saveYarn">保存</div>
          </div>
        </div>
      </div>
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
          v-for="(itemYarn,indexYarn) in yarnEditInfo"
          :key="indexYarn">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(yarnEditInfo,indexYarn,true)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出入库单位</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemYarn.clientName"
                  filterable
                  default-first-option
                  clearable
                  placeholder="请选择需要操作的原料">
                  <el-option v-for="item in []"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3"></div>
            <div class="colCtn flex3"></div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">原料名称</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemYarn.yarnName"
                  filterable
                  default-first-option
                  clearable
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
                <el-select v-model="itemYarn.yarnColor"
                  filterable
                  default-first-option
                  clearable
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
                  v-model="itemYarn.number"
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
                <el-date-picker v-model="itemYarn.time"
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
                  v-model="itemYarn.remark"></zh-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">备注</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入备注"
                  v-model="itemYarn.remark"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page right marginTop20">
          <div class="btn btnDashed"
            v-show="yarnEditInfo.length > 0"
            @click="resetEditInfo('yarn')">重置</div>
          <div class="btn btnDashed bgBlue_page"
            v-if="yarnEditInfo.length === 0"
            @click="addItem(yarnEditInfo,'yarn')">+添加出入库</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(yarnEditInfo,'yarn')">
            <div class="btn btnOrange">+添加出入库</div>
          </div>
          <div class="btn btnDashed"
            v-show="yarnEditInfo.length > 0">
            <div class="btn btnBlue"
              @click="saveYarn">保存</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      yarnEditInfo: [
        {
          yarnName: '',
          yarnColor: '',
          editType: 'go',
          clientName: '',
          number: '',
          time: '',
          remark: ''
        }
      ]
    }
  },
  methods: {
    saveYarn () {

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
      if (type === 'yarn') {
        item.push({
          yarnName: '',
          yarnColor: '',
          editType: 'go',
          clientName: '',
          number: '',
          time: '',
          remark: ''
        })
      }
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
