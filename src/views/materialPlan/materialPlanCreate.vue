<template>
  <div id='materialPlanCreate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.type==='1'?'订':'样'}}单信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'订':'样'}}单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <!-- <div class="colCtn">
            <span class="label">系统编号：</span>
            <span class="text"></span>
          </div> -->
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
            <span class="text">{{orderInfo.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">
          物料计划
          <span class="el-icon-setting settingMethod"
            @click="settingMethodFlag = true"></span>
        </span>
        <span class="btn noBorder"
          @click="fastWriteFlag = true">快捷填写</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row">产品品类</span>
            <span class="tb_row">尺码颜色</span>
            <span class="tb_row flex08">下单数量</span>
            <span class="tb_row flex08">库存数量</span>
            <!-- <span class="tb_row">库存调取</span> -->
            <span class="tb_row">原料损耗</span>
            <span class="tb_row">辅料损耗</span>
            <span class="tb_row">生产数量</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item v-for="(itemPro,indexPro) in materialPlanInfo"
              :key="indexPro">
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row two_line">{{itemPro.product_code}}<br />{{itemPro|filterType}}</span>
                <span class="tb_row">{{itemPro.size + '/' + itemPro.color}}</span>
                <span class="tb_row flex08">{{$toFixed(itemPro.order_num) + '' +itemPro.unit}}</span>
                <span class="tb_row flex08">{{$toFixed(itemPro.stock_num) + '' +itemPro.unit}}</span>
                <!-- <span class="tb_row"
                  @click.stop="returnFalse">
                  <zh-input placeholder="数量"
                    v-model="itemPro.stock_num_use"
                    style="width:130px"
                    type="number"
                    @input="changeStockNum(itemPro)">
                    <template slot="append"
                      v-if="itemPro.unit">{{itemPro.unit}}</template>
                  </zh-input>
                </span> -->
                <span class="tb_row"
                  @click.stop="returnFalse">
                  <zh-input placeholder="损耗"
                    v-model="itemPro.material_loss"
                    style="width:130px"
                    @input="changeLoss(itemPro,1,$event)"
                    type="number">
                    <template slot="append">%</template>
                  </zh-input>
                </span>
                <span class="tb_row"
                  @click.stop="returnFalse">
                  <zh-input placeholder="损耗"
                    v-model="itemPro.other_loss"
                    style="width:130px"
                    @input="changeLoss(itemPro,2,$event)"
                    type="number">
                    <template slot="append">%</template>
                  </zh-input>
                </span>
                <span class="tb_row"
                  @click.stop="returnFalse">
                  <zh-input placeholder="数量"
                    v-model="itemPro.production_num"
                    style="width:130px"
                    type="number"
                    @input="changeEndNum(itemPro)">
                    <template slot="append"
                      v-if="itemPro.unit">{{itemPro.unit}}</template>
                  </zh-input>
                </span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品部位</span>
                  <span class="tb_row flex15">物料名称</span>
                  <span class="tb_row">物料颜色</span>
                  <span class="tb_row flex08">
                    配料数量
                    <el-tooltip class="item"
                      effect="dark"
                      content="单个部位配料数量"
                      placement="top-start">
                      <span class="el-icon-question"></span>
                    </el-tooltip>
                  </span>
                  <span class="tb_row flex08">所需数量</span>
                  <span class="tb_row flex08">合计数量</span>
                  <span class="tb_row">原料损耗</span>
                  <span class="tb_row">最终数量</span>
                  <span class="tb_row middle flex08">操作</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight"
                  v-for="(itemMa,indexMa) in itemPro.material_info"
                  :key="indexMa">
                  <span class="tb_row">
                    <el-select placeholder="请选择部位"
                      v-model="itemMa.product_part"
                      @change="changePart(itemMa,itemPro)"
                      style="width:130px;">
                      <el-option v-for="item in itemPro.part_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </span>
                  <span class="tb_row flex15">
                    <el-autocomplete v-if="itemMa.type === 1 "
                      v-model="itemMa.material_name"
                      :fetch-suggestions="searchYarn"
                      style="width:210px"
                      @select="computedTotal"
                      placeholder="请输入原料名称">
                    </el-autocomplete>
                    <el-autocomplete v-if="itemMa.type === 2"
                      v-model="itemMa.material_name"
                      :fetch-suggestions="searchMaterial"
                      style="width:210px"
                      @select="selectMaterial($event,itemMa)"
                      placeholder="请输入辅料名称">
                    </el-autocomplete>
                  </span>
                  <span class="tb_row">
                    <el-autocomplete placeholder="请输入颜色"
                      v-model="itemMa.color"
                      @select="computedTotal"
                      style="width:130px"
                      :fetch-suggestions="querySearch"
                      :trigger-on-focus="false"></el-autocomplete>
                  </span>
                  <span class="tb_row flex08">{{itemMa.number ? $toFixed(itemMa.number) + '' + itemMa.unit : '-'}}</span>
                  <span class="tb_row flex08">{{itemMa.need_number ? $toFixed(itemMa.need_number) + '*' +  itemPro.production_num : '-'}}</span>
                  <span class="tb_row flex08">{{itemMa.number && itemMa.need_number ? $toFixed(itemMa.number * itemMa.need_number * itemPro.production_num) + '' + itemMa.unit : '-'}}</span>
                  <span class="tb_row">
                    <zh-input placeholder="损耗"
                      :disabled="itemMa.disabled"
                      v-model="itemMa.material_loss"
                      style="width:130px"
                      @input="changeLossInner(itemMa,'loss',itemPro.production_num)"
                      type="number">
                      <template slot="append">%</template>
                    </zh-input>
                  </span>
                  <span class="tb_row">
                    <zh-input placeholder="数量"
                      v-model="itemMa.end_num"
                      style="width:130px"
                      @input="changeLossInner(itemMa,'end_num',itemPro.production_num)"
                      type="number">
                      <template slot="append">
                        <template v-if="itemMa.type === 1">kg</template>
                        <template v-else>
                          <input type="text"
                            v-model="itemMa.unit"
                            @change="changeOtherMaterialUnit($event,itemMa)"
                            style="border: none;background: transparent;outline: none;width: 1em;">
                        </template>
                      </template>
                    </zh-input>
                  </span>
                  <span class="tb_row middle flex08">
                    <span class="tb_handle_btn blue"
                      @click="copyItem(itemPro.material_info,itemMa)">复制</span>
                    <span class="tb_handle_btn red"
                      @click="deleteItem(itemPro.material_info,indexMa)">删除</span>
                  </span>
                </div>
                <div class="tb_content">
                  <div class="tb_row tb_row_handle_btn"
                    @click="addItem(itemPro.material_info,'material')">+ 新增原料</div>
                  <div class="tb_row tb_row_handle_btn"
                    @click="addItem(itemPro.material_info,'other')">+ 新增辅料</div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">所需物料</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2">
          <div class="tb_header">
            <span class="tb_row flex04 middle">类型</span>
            <span class="tb_row flex12">名称</span>
            <span class="tb_row">颜色</span>
            <span class="tb_row flex08">所需数量</span>
            <span class="tb_row flex08">原料损耗</span>
            <span class="tb_row flex08">最终数量</span>
          </div>
          <div class="tb_content"
            v-for="(itemMa,indexMa) in materialTotalInfo"
            :key="indexMa">
            <span class="tb_row flex04 middle"
              :class="itemMa.type === 1 ? 'green' : 'orange'">{{itemMa.type === 1 ? '原料' : '辅料'}}</span>
            <span class="tb_row flex12">{{itemMa.material_name}}</span>
            <span class="tb_row">{{itemMa.color}}</span>
            <span class="tb_row flex08">{{itemMa.total_number ? itemMa.total_number + (itemMa.type === 1 ? 'kg' : itemMa.unit) : '-'}}</span>
            <span class="tb_row flex08">{{itemMa.loss || 0}}%</span>
            <span class="tb_row flex08">
              <span class="align"><em class="bigNum">{{itemMa.end_num || 0}}</em>{{itemMa.type === 1 ? 'kg' : itemMa.unit}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="settingMethodFlag">
      <div class="main">
        <div class="title">
          <span class="text">设置取值方式</span>
          <span class="el-icon-close"
            @click="cancelSetting"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="info">
              <el-select v-model="settingMethod"
                placeholder="请选择方式">
                <el-option v-for="item in settingMethodArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="cancelSetting">取消</div>
          <div class="btn btnBlue"
            @click="changeSettingMethodFlag">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="fastWriteFlag">
      <div class="main"
        style="width:800px">
        <div class="title">
          <span class="text">快捷填写</span>
          <span class="el-icon-close"
            @click="fastWriteFlag = false"></span>
        </div>
        <div class="content">
          <span class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row flex12">产品品类</span>
              <span class="tb_row">色组</span>
              <span class="tb_row">下单数</span>
              <span class="tb_row flex12">原料损耗</span>
              <span class="tb_row flex12">辅料损耗</span>
            </span>
            <span class="tb_content"
              v-for="(itemPro,indexPro) in productColorList"
              :key='indexPro'>
              <span class="tb_row flex12">{{itemPro.product_code}}<br />{{itemPro|filterType}}</span>
              <span class="tb_row">{{itemPro.color}}</span>
              <span class="tb_row">{{itemPro.order_num}}</span>
              <span class="tb_row flex12">
                <zh-input placeholder="损耗"
                  v-model="itemPro.material_loss"
                  style="width:130px"
                  type="number">
                  <template slot="append">%</template>
                </zh-input>
              </span>
              <span class="tb_row flex12">
                <zh-input placeholder="损耗"
                  v-model="itemPro.other_loss"
                  style="width:130px"
                  type="number">
                  <template slot="append">%</template>
                </zh-input>
              </span>
            </span>
          </span>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="fastWriteFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="fastWriteLoss">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveAll">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialPlan, yarn, material, pantongList, yarnColor } from '@/assets/js/api.js'
export default {
  data () {
    return {
      msgSwitch: false,
      settingMethodFlag: false, // 设置取值方式
      settingMethod: +window.localStorage.getItem('materialPlanSettingMethod') || 1,
      settingMethodArr: [
        {
          name: '向上取整 （例：1.8变成2）',
          id: 1
        },
        {
          name: '四舍五入 （例：1.5变成2，1.4变成1）',
          id: 2
        },
        {
          name: '向下取整 （例：1.8变成1）',
          id: 3
        },
        {
          name: '不取整',
          id: 4
        }
      ],
      fastWriteFlag: false, // 快捷填写颜色损耗
      msgUrl: '',
      msgContent: '',
      loading: true,
      yarnList: [],
      materialList: [],
      orderInfo: {},
      materialPlanInfo: [],
      materialTotalInfo: [],
      colorList: [],
      productColorList: []
    }
  },
  methods: {
    // 改变大身配件部位
    changePart (itemInner, item) {
      let flag = item.part_arr.find(itemF => itemF.id === itemInner.product_part)
      itemInner.need_number = flag ? flag.number : 1
      this.changeLossInner(itemInner, 'loss', item.production_num)
    },
    cancelSetting () {
      this.settingMethod = +window.localStorage.getItem('materialPlanSettingMethod') || 1
      this.settingMethodFlag = false
    },
    changeSettingMethodFlag () {
      window.localStorage.setItem('materialPlanSettingMethod', this.settingMethod)
      this.settingMethodFlag = false
    },
    fastWriteLoss () {
      this.fastWriteFlag = false
      this.materialPlanInfo.forEach(itemPro => {
        let flag = this.productColorList.find(itemF => itemF.color_id === itemPro.color_id)
        if (flag) {
          itemPro.material_loss = flag.material_loss
          this.changeLoss(itemPro, 1, flag.material_loss)
          itemPro.other_loss = flag.other_loss
          this.changeLoss(itemPro, 2, flag.other_loss)
        }
      })
    },
    // 小数点处理方式
    numberAutoMethod (num) {
      let number = Number(num)
      if (number || number === 0) {
        if (+this.settingMethod === 1) { // 向上取整
          return Math.ceil(number)
        } else if (+this.settingMethod === 2) { // 四舍五入
          return Math.round(number)
        } else if (+this.settingMethod === 3) { // 向下取整
          return parseInt(number)
        } else {
          return this.$toFixed(number)
        }
      } else if (isNaN(num)) {
        return ''
      } else {
        throw new TypeError('“' + num + '”is not a number')
      }
    },
    selectMaterial (e, item) {
      item.unit = e.unit || '个'
      this.computedTotal()
    },
    changeOtherMaterialUnit (e, item) {
      if (!e.target.value) {
        item.unit = '个'
        this.computedTotal()
      }
    },
    querySearch (queryString, cb) {
      this.computedTotal()
      if (this.colorList.length === 0) {
        Promise.all([
          pantongList(),
          yarnColor.list()
        ]).then(res => {
          this.colorList = res[0].data.data.concat(res[1].data.data).map(item => {
            return {
              value: item.name
            }
          })
          let filterArr = queryString ? this.colorList.filter(item => item.value.indexOf(queryString) !== -1) : []
          cb(filterArr)
        })
      } else {
        let filterArr = queryString ? this.colorList.filter(item => item.value.indexOf(queryString) !== -1) : []
        cb(filterArr)
      }
    },
    saveAll () {
      if (this.$submitLock()) return
      let isAllComplete = true
      for (let indexPro in this.materialPlanInfo) {
        let itemPro = this.materialPlanInfo[indexPro]
        if (itemPro.material_info.length === 0) {
          isAllComplete = false
        }
        for (let indexMa in itemPro.material_info) {
          let itemMa = itemPro.material_info[indexMa]
          if (!itemMa.product_part) {
            this.$message.error('检测到产品"' + itemPro.product_code + '"第"' + (Number(indexMa) + 1) + '"项未选择产品部位,请选择')
            return
          }
          if (!itemMa.material_name) {
            this.$message.error('检测到产品"' + itemPro.product_code + '"第"' + (Number(indexMa) + 1) + '"项未填写物料,请填写')
            return
          }
          if (!itemMa.color) {
            this.$message.error('检测到产品"' + itemPro.product_code + '"第"' + (Number(indexMa) + 1) + '"项未填写物料颜色,请填写')
            return
          }
          if (!itemMa.material_loss && itemMa.material_loss.toString() !== '0') {
            this.$message.error('检测到产品"' + itemPro.product_code + '"第"' + (Number(indexMa) + 1) + '"项未填写物料损耗,请填写')
            return
          }
          if (!itemMa.end_num && itemMa.end_num.toString() !== '0') {
            this.$message.error('检测到产品"' + itemPro.product_code + '"第"' + (Number(indexMa) + 1) + '"项未填写最终数量,请填写')
            return
          }
        }
      }
      let detailData = []
      let totalData = []
      let productionData = []
      this.materialPlanInfo.forEach(itemPro => {
        productionData.push({
          product_id: itemPro.product_id,
          color_id: itemPro.color_id,
          size_id: itemPro.size_id,
          order_number: itemPro.order_num,
          loss_y: itemPro.material_loss,
          loss_f: itemPro.other_loss,
          product_number: itemPro.production_num
        })
        itemPro.part_data.forEach(itemPart => {
          let flag = itemPart.size_info.find(itemPartSize => itemPartSize.size_id === itemPro.size_id)
          if (flag) {
            productionData.push({
              product_id: itemPart.id,
              color_id: itemPro.color_id,
              size_id: flag.size_id,
              order_number: Math.ceil(itemPro.order_num * flag.number),
              loss_y: itemPro.material_loss,
              loss_f: itemPro.other_loss,
              product_number: Math.ceil(itemPro.production_num * flag.number)
            })
          }
        })
        itemPro.material_info.forEach(itemMa => {
          detailData.push({
            product_id: itemMa.product_part,
            material_name: itemMa.material_name,
            material_type: itemMa.type,
            material_attribute: itemMa.color,
            loss: itemMa.material_loss,
            single_weight_loss: this.$toFixed(itemMa.number),
            single_weight: (Number(itemMa.type) === 1 ? itemMa.end_num * 1000 : itemMa.end_num) / itemPro.production_num / itemMa.need_number,
            reality_weight: (Number(itemMa.type) === 1 ? itemMa.end_num * 1000 : itemMa.end_num),
            total_weight: this.$toFixed(+(itemMa.number * itemMa.need_number * itemPro.production_num) || 0) || '',
            size_id: itemPro.size_id,
            color_id: itemPro.color_id,
            unit: itemMa.unit,
            need_weight: itemMa.need_number,
            mix_material_weight: itemMa.number,
            calculate_method: this.settingMethod
          })
        })
      })
      this.materialTotalInfo.forEach(itemMa => {
        totalData.push({
          material_name: itemMa.material_name,
          material_type: itemMa.type,
          material_attribute: itemMa.color,
          need_weight: itemMa.total_number,
          loss: itemMa.loss,
          reality_weight: (Number(itemMa.type) === 1 ? itemMa.end_num * 1000 : itemMa.end_num),
          unit: itemMa.unit
        })
      })
      if (!isAllComplete) {
        this.$confirm('该物料计划仍有部分产品物料信息没有计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          materialPlan.create({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type,
            detail_data: detailData,
            total_data: totalData,
            production_data: productionData
          }).then(res => {
            if (res.data.status) {
              this.$message.success('添加成功')
              if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
                this.msgUrl = '/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type
                this.msgContent = '<span style="color:#1A95FF">添加</span>了一张新物料计划单,' + (this.$route.params.type === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
                this.msgSwitch = true
              } else {
                this.$router.replace('/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type)
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        materialPlan.create({
          order_id: this.$route.params.id,
          order_type: this.$route.params.type,
          detail_data: detailData,
          total_data: totalData,
          production_data: productionData
        }).then(res => {
          if (res.data.status) {
            this.$message.success('添加成功')
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type
              this.msgContent = '<span style="color:#1A95FF">添加</span>了一张新物料计划单,' + (this.$route.params.type === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.$router.replace('/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type)
            }
          }
        })
      }
    },
    deleteItem (item, index) {
      this.$confirm('此操作将删除该列数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.splice(index, 1)
        this.computedTotal()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addItem (item, type) {
      if (type === 'material') {
        item.push({
          product_part: '',
          material_name: '',
          type: 1,
          color: '',
          number: '',
          total_number: '',
          material_loss: 0,
          end_num: '',
          unit: 'g',
          disabled: true
        })
      } else if (type === 'other') {
        item.push({
          product_part: '',
          material_name: '',
          type: 2,
          color: '',
          number: '',
          total_number: '',
          material_loss: 0,
          end_num: '',
          unit: '个',
          disabled: true
        })
      }
    },
    // 改变外层损耗
    changeLoss (item, type, eve) {
      item.material_info.filter(itemMa => Number(itemMa.type) === Number(type)).forEach(itemMa => {
        itemMa.material_loss = eve
        this.changeLossInner(itemMa, 'loss', item.production_num)
      })
    },
    // 改变内层损耗和数量
    changeLossInner (item, type, productionNum) {
      let totalNum = item.number * item.need_number * productionNum
      if (type === 'loss') {
        if (totalNum && (item.material_loss || item.material_loss === 0)) {
          item.end_num = this.numberAutoMethod(item.type === 1 ? (totalNum / 1000 * (1 + item.material_loss / 100)) : (totalNum * (1 + item.material_loss / 100)))
        }
      } else if (type === 'end_num') {
        if (totalNum && item.end_num) {
          item.material_loss = this.$toFixed(item.type === 1 ? ((item.end_num * 1000 / totalNum) - 1) * 100 : ((item.end_num / totalNum) - 1) * 100)
        }
      }
      this.computedTotal()
    },
    // elementUi折叠面板点击title输入框时，阻止冒泡，防止其折叠
    returnFalse () {
      return false
    },
    // 改变生产数量
    changeEndNum (item) {
      if (Number(item.production_num) > Number(item.order_num)) {
        this.$message.warning('生产数量已超出下单数量')
      }
      if (item.production_num) {
        item.material_info.forEach(itemMa => {
          itemMa.total_number = this.$toFixed(item.production_num * itemMa.number * itemMa.need_number)
          this.changeLossInner(itemMa, 'loss', item.production_num)
        })
      }
    },
    searchYarn (queryString, cb) {
      this.computedTotal()
      let result = queryString ? this.yarnList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarnList
      cb(result)
    },
    searchMaterial (queryString, cb) {
      this.computedTotal()
      let result = queryString ? this.materialList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.materialList
      cb(result)
    },
    computedTotal () {
      let arr = []
      this.materialPlanInfo.forEach(itemPro => {
        arr.push(...itemPro.material_info.map(itemM => {
          return {
            material_name: itemM.material_name,
            color: itemM.color,
            unit: itemM.unit,
            end_num: itemM.end_num,
            type: itemM.type,
            total_number: itemM.number * itemPro.production_num * itemM.need_number
          }
        }))
      })
      let totalInfo = this.$mergeData(arr, { mainRule: ['material_name', 'color'], otherRule: [{ name: 'total_number', type: 'add' }, { name: 'unit' }, { name: 'end_num', type: 'add' }, { name: 'type' }] })
      this.materialTotalInfo = totalInfo.map(itemMa => {
        delete itemMa.childrenMergeInfo
        itemMa.total_number = itemMa.type === 1 ? this.numberAutoMethod(itemMa.total_number / 1000) : this.numberAutoMethod(itemMa.total_number)
        return {
          ...itemMa,
          loss: (itemMa.total_number && itemMa.end_num) ? this.$toFixed((itemMa.end_num - itemMa.total_number) / itemMa.total_number * 100) : 0
        }
      }).sort((a, b) => {
        return a.material_name.localeCompare(b.material_name)
      })
    },
    copyItem (data, item) {
      data.push(this.$clone(item))
      this.computedTotal()
    }
  },
  created () {
    Promise.all([
      materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      }),
      yarn.list(),
      material.list()
    ]).then(res => {
      this.orderInfo = res[0].data.data.order_info
      let materialPlanInfo = this.$mergeData(res[0].data.data.product_info, { mainRule: ['product_id', 'product_code', 'size_id', 'color_id'], otherRule: [{ name: 'size_name' }, { name: 'color_name' }, { name: 'numbers', type: 'add' }, { name: 'part_data' }, { name: 'part_data_material' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'unit' }, { name: 'stock_number' }, { name: 'material_info' }, { name: 'category_name' }] })
      this.materialPlanInfo = materialPlanInfo.map(itemPro => {
        return {
          product_code: itemPro.product_code,
          product_id: itemPro.product_id,
          category_name: itemPro.category_name,
          style_name: itemPro.style_name,
          type_name: itemPro.type_name,
          size: itemPro.size_name,
          color: itemPro.color_name,
          size_id: itemPro.size_id,
          color_id: itemPro.color_id,
          order_num: itemPro.numbers,
          stock_num: itemPro.stock_number,
          stock_num_use: 0,
          material_loss: '',
          other_loss: '',
          production_num: itemPro.numbers,
          unit: itemPro.unit,
          part_arr: this.$clone([{
            name: '大身',
            id: itemPro.product_id,
            number: 1
          }].concat(itemPro.part_data.map(itemPart => {
            let flag = itemPart.size_info.find(itemF => itemF.size_id === itemPro.size_id)
            return {
              name: itemPart.name,
              id: itemPart.id,
              number: flag ? (+flag.number || 1) : 1
            }
          }))),
          material_info: itemPro.material_info.map(itemMa => {
            return {
              product_part: itemMa.product_id,
              material_name: itemMa.material_name,
              type: itemMa.type,
              color: itemMa.material_attribute,
              number: itemMa.weight,
              material_loss: '',
              end_num: '',
              unit: itemMa.unit,
              need_number: 1
            }
          }).concat(itemPro.part_data_material.filter(itemMa => itemMa.color_id === itemPro.color_id && itemMa.size_id === itemPro.size_id).map(itemMa => {
            let partName = itemPro.part_data.find(items => +items.id === +itemMa.product_id)
            let sizeFlag = ''
            if (partName) {
              sizeFlag = partName.size_info.find(itemPartSize => itemPartSize.size_id === itemPro.size_id)
            }
            return {
              product_part: itemMa.product_id,
              material_name: itemMa.material_name,
              type: itemMa.type,
              color: itemMa.material_attribute,
              number: itemMa.weight,
              need_number: (sizeFlag ? (+sizeFlag.number || 1) : 1),
              material_loss: '',
              end_num: '',
              unit: itemMa.unit
            }
          })),
          part_data: itemPro.part_data
        }
      }).sort((a, b) => {
        return a.color_id - b.color_id
      })
      this.computedTotal()
      this.yarnList = res[1].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.materialList = res[2].data.data.map((item) => {
        return {
          value: item.name,
          unit: item.unit
        }
      })
      this.productColorList = this.$mergeData(this.materialPlanInfo, { mainRule: ['product_id', 'color_id'], otherRule: [{ name: 'color' }, { name: 'product_code' }, { name: 'category_name' }, { name: 'style_name' }, { name: 'type_name' }, { name: 'order_num', type: 'add' }, { name: 'material_loss' }, { name: 'other_loss' }] }).map(item => {
        delete item.childrenMergeInfo
        return item
      })
      this.loading = false
    })
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.style_name, item.type_name].join('/')
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/materialPlan/materialPlanCreate.less";
</style>
<style lang="less">
#materialPlanCreate {
  .el-collapse-item__header {
    position: relative;
    min-height: 54px;
    display: flex;
    .el-collapse-item__arrow {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%) rotateZ(90deg);
      color: #1a95ff;
      &.is-active {
        transform: translateY(-50%) rotateZ(270deg);
      }
    }
  }
  .el-collapse-item__wrap {
    background-color: #f2f4f7;
  }
  .el-input__inner {
    height: 32px !important;
  }
}
</style>
