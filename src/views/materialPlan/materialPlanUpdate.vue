<template>
  <div id='materialPlanCreate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
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
      <div class="titleCtn">
        <span class="title">物料计划</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row">产品品类</span>
            <span class="tb_row">尺码颜色</span>
            <span class="tb_row flex08">下单数量</span>
            <span class="tb_row flex08">库存数量</span>
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
                <span class="tb_row flex08">{{itemPro.order_num + '' +itemPro.unit}}</span>
                <span class="tb_row flex08">{{itemPro.stock_num + '' +itemPro.unit}}</span>
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
                  <span class="tb_row flex12">物料名称</span>
                  <span class="tb_row">物料颜色</span>
                  <span class="tb_row flex08">单件数量</span>
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
                      style="width:130px;">
                      <el-option v-for="item in itemPro.part_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </span>
                  <span class="tb_row flex12">
                    <el-autocomplete v-if="itemMa.type === 1 "
                      v-model="itemMa.material_name"
                      :fetch-suggestions="searchYarn"
                      style="width:130px"
                      @change="computedTotal"
                      placeholder="请输入原料名称">
                    </el-autocomplete>
                    <el-autocomplete v-if="itemMa.type === 2"
                      v-model="itemMa.material_name"
                      :fetch-suggestions="searchMaterial"
                      style="width:130px"
                      @change="computedTotal"
                      placeholder="请输入辅料名称">
                    </el-autocomplete>
                  </span>
                  <span class="tb_row">
                    <zh-input placeholder="请输入颜色"
                      v-model="itemMa.color"
                      @change="computedTotal"
                      style="width:130px">
                    </zh-input>
                  </span>
                  <span class="tb_row flex08">{{itemMa.number ? itemMa.number + '' + itemMa.unit : '-'}}</span>
                  <span class="tb_row flex08">{{itemMa.total_number ? itemMa.total_number + '' + itemMa.unit : '-'}}</span>
                  <span class="tb_row">
                    <zh-input placeholder="损耗"
                      :disabled="itemMa.disabled"
                      v-model="itemMa.material_loss"
                      style="width:130px"
                      @input="changeLossInner(itemMa,'loss')"
                      type="number">
                      <template slot="append">%</template>
                    </zh-input>
                  </span>
                  <span class="tb_row">
                    <zh-input placeholder="数量"
                      v-model="itemMa.end_num"
                      style="width:130px"
                      @input="changeLossInner(itemMa,'end_num')"
                      type="number">
                      <template slot="append"
                        v-if="itemMa.unit">{{(itemMa.unit === 'g' || itemMa.unit === '克') ? 'kg' : itemMa.unit}}</template>
                    </zh-input>
                  </span>
                  <span class="tb_row middle flex08">
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
            <span class="tb_row flex12">名称</span>
            <span class="tb_row">颜色</span>
            <span class="tb_row flex08">所需数量</span>
            <span class="tb_row flex08">原料损耗</span>
            <span class="tb_row flex08">最终数量</span>
          </div>
          <div class="tb_content"
            v-for="(itemMa,indexMa) in materialTotalInfo"
            :key="indexMa">
            <span class="tb_row flex12">{{itemMa.material_name}}</span>
            <span class="tb_row">{{itemMa.color}}</span>
            <span class="tb_row flex08">{{itemMa.total_number ? (itemMa.type === 1 ? itemMa.total_number/1000 + 'kg' : itemMa.total_number + itemMa.unit) : '-'}}</span>
            <span class="tb_row flex08">{{itemMa.loss || 0}}%</span>
            <span class="tb_row flex08">
              <span class="align"><em class="bigNum">{{itemMa.end_num || 0}}</em>{{itemMa.type === 1 ? 'kg' : itemMa.unit}}</span>
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
          <div class="btn btnBlue"
            @click="saveAll">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialPlan, yarn, material } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      lock: true,
      yarnList: [],
      materialList: [],
      orderInfo: {},
      materialPlanInfo: [],
      materialTotalInfo: [],
      cloneData: []
    }
  },
  methods: {
    saveAll () {
      if (!this.lock) {
        this.$message.warning('请勿频繁点击')
        return
      }
      for (let indexPro in this.materialPlanInfo) {
        let itemPro = this.materialPlanInfo[indexPro]
        if (itemPro.material_info.length === 0) {
          this.$message.error('检测到产品"' + itemPro.product_code + '"没有计划信息，请填写')
          return
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
          color_name: itemPro.color,
          size_name: itemPro.size,
          order_number: itemPro.order_num,
          loss_y: itemPro.material_loss,
          loss_f: itemPro.other_loss,
          product_number: itemPro.production_num
        })
        itemPro.material_info.forEach(itemMa => {
          detailData.push({
            product_id: itemMa.product_part,
            material_name: itemMa.material_name,
            material_type: itemMa.type,
            material_attribute: itemMa.color,
            loss: itemMa.material_loss,
            single_weight: (Number(itemMa.type) === 1 ? itemMa.end_num * 1000 : itemMa.end_num) / itemPro.production_num,
            reality_weight: (Number(itemMa.type) === 1 ? itemMa.end_num * 1000 : itemMa.end_num),
            total_weight: itemMa.total_number,
            size_name: itemPro.size,
            color_name: itemPro.color,
            unit: itemMa.unit
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
      this.cloneData.forEach(itemMa => {
        let flag = totalData.find(valMa => valMa.material_name === itemMa.material_name && valMa.material_attribute === itemMa.material_attribute)
        if (!flag) {
          totalData.push({
            id: null,
            material_name: itemMa.material_name,
            material_type: itemMa.material_type,
            material_attribute: itemMa.material_attribute,
            need_weight: 0,
            loss: 0,
            reality_weight: 0,
            unit: itemMa.unit
          })
        } else {
          flag.id = itemMa.id
        }
      })
      this.lock = false
      materialPlan.create({
        is_update: true,
        order_id: this.$route.params.id,
        order_type: this.$route.params.type,
        detail_data: detailData,
        total_data: totalData,
        production_data: productionData
      }).then(res => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.$router.push('/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type)
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#E6A23C">修改</span>了一张物料计划单,' + (this.$route.params.type === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type)
          }
        }
        this.lock = true
      })
    },
    deleteItem (item, index) {
      this.$confirm('此操作将删除该列数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.splice(index, 1)
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
        this.changeLossInner(itemMa, 'loss')
      })
    },
    // 改变内层损耗和数量
    changeLossInner (item, type) {
      if (type === 'loss') {
        if (item.total_number && item.material_loss) {
          item.end_num = this.$toFixed(item.type === 1 ? (item.total_number / 1000 * (1 + item.material_loss / 100)) : (item.total_number * (1 + item.material_loss / 100)))
        }
      } else if (type === 'end_num') {
        if (item.total_number && item.end_num) {
          item.material_loss = this.$toFixed(item.type === 1 ? ((item.end_num * 1000 / item.total_number) - 1) * 100 : ((item.end_num / item.total_number) - 1) * 100)
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
        this.$message.error('生产数量不可超出下单数量')
        item.production_num = item.order_num
        return
      }
      if (item.production_num) {
        item.material_info.forEach(itemMa => {
          itemMa.total_number = this.$toFixed(item.production_num * itemMa.number)
          this.changeLossInner(itemMa, 'loss')
        })
      }
    },
    // 改变产品部位
    changePart (eve, partArr, item) {
      let flag = partArr.find(itemPart => itemPart.id === eve)
      if (flag) {
        item.type = flag.type
        item.unit = Number(flag.type) === 1 ? 'g' : '个'
      }
    },
    searchYarn (queryString, cb) {
      let result = queryString ? this.yarnList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarnList
      console.log(result)
      cb(result)
    },
    searchMaterial (queryString, cb) {
      let result = queryString ? this.materialList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.materialList
      cb(result)
    },
    computedTotal () {
      let arr = []
      this.materialPlanInfo.forEach(itemPro => {
        arr.push(...this.$clone(itemPro.material_info))
      })
      let totalInfo = this.$mergeData(arr, { mainRule: ['material_name', 'color'], otherRule: [{ name: 'total_number', type: 'add' }, { name: 'unit' }, { name: 'end_num', type: 'add' }, { name: 'type' }] })
      this.materialTotalInfo = totalInfo.map(itemMa => {
        delete itemMa.childrenMergeInfo
        return {
          ...itemMa,
          loss: (itemMa.total_number && itemMa.end_num) ? this.$toFixed((itemMa.end_num * (itemMa.type === 1 ? 1000 : 1) - itemMa.total_number) / itemMa.total_number * 100) : 0
        }
      }).sort((a, b) => {
        return a.material_name.localeCompare(b.material_name)
      })
    }
  },
  created () {
    Promise.all([
      materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      }),
      yarn.list(),
      material.list(),
      materialPlan.editDetail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      })
    ]).then(res => {
      this.orderInfo = res[0].data.data.order_info
      let materialPlanInfo = res[0].data.data.product_info
      this.materialPlanInfo = materialPlanInfo.map(itemPro => {
        return {
          product_code: itemPro.product_code,
          product_id: itemPro.product_id,
          category_name: itemPro.category_name,
          style_name: itemPro.style_name,
          type_name: itemPro.type_name,
          size: itemPro.size,
          color: itemPro.color,
          order_num: itemPro.numbers,
          stock_num: itemPro.stock_number,
          stock_num_use: 0,
          material_loss: '',
          other_loss: '',
          production_num: itemPro.numbers,
          unit: itemPro.unit,
          part_arr: this.$clone([{
            name: '大身',
            id: itemPro.product_id
          }].concat(itemPro.part_data.map(itemPart => {
            return {
              name: itemPart.name,
              id: itemPart.id
            }
          }))),
          material_info: itemPro.material_info.map(itemMa => {
            return {
              product_part: itemMa.product_id,
              material_name: itemMa.material_name,
              type: itemMa.type,
              color: itemMa.material_attribute,
              number: itemMa.weight,
              total_number: this.$toFixed(itemMa.weight * itemPro.numbers),
              material_loss: '',
              end_num: '',
              unit: itemMa.unit
            }
          }).concat(itemPro.part_data_material.filter(itemMa => itemMa.product_color === itemPro.color && itemMa.product_size === itemPro.size).map(itemMa => {
            return {
              product_part: itemMa.product_id,
              material_name: itemMa.material_name,
              type: itemMa.type,
              color: itemMa.material_attribute,
              number: itemMa.weight,
              total_number: this.$toFixed(itemMa.weight * itemPro.numbers),
              material_loss: '',
              end_num: '',
              unit: itemMa.unit
            }
          }))
        }
      })
      // 初始化数据
      let data = res[3].data.data
      this.cloneData = this.$clone(data.total_data) // 保留一份修改前的物料总计数据
      data.production_data.forEach(itemPro => {
        let flag = this.materialPlanInfo.find(valPro => valPro.product_id === itemPro.product_id && valPro.size === itemPro.size_name && valPro.color === itemPro.color_name)
        if (flag) {
          flag.material_loss = itemPro.loss_y
          flag.other_loss = itemPro.loss_f
          flag.production_num = itemPro.product_number
        }
      })
      // 处理计划数据
      let planInfo = this.$clone(data.detail_data).map(itemPro => {
        if (itemPro.pid === 0) {
          itemPro.pid = itemPro.product_id
        }
        return itemPro
      })
      planInfo = this.$mergeData(planInfo, { mainRule: ['pid/product_id', 'color_name/color', 'size_name/size'], childrenName: 'material_info', childrenRule: { otherRule: [{ name: 'product_id/product_part' }, { name: 'material_name' }, { name: 'material_type/type' }, { name: 'material_attribute/material_color' }, { name: 'single_weight/number' }, { name: 'total_weight/total_number' }, { name: 'loss/material_loss' }, { name: 'reality_weight/end_num' }, { name: 'unit' }] } })
      this.materialPlanInfo.forEach(itemPro => {
        let planFlag = planInfo.find(valPro => valPro.product_id === itemPro.product_id && valPro.color === itemPro.color && valPro.size === itemPro.size)
        if (planFlag) {
          itemPro.material_info = planFlag.material_info.map(itemMa => {
            return {
              product_part: itemMa.product_part,
              material_name: itemMa.material_name,
              type: itemMa.type,
              color: itemMa.material_color,
              number: itemMa.number,
              total_number: this.$toFixed(itemMa.total_number),
              material_loss: itemMa.material_loss,
              end_num: itemMa.type === 1 ? this.$toFixed(itemMa.end_num / 1000) : this.$toFixed(itemMa.end_num),
              unit: itemMa.unit
            }
          })
        }
      })

      this.computedTotal()
      this.yarnList = res[1].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.materialList = res[2].data.data.map((item) => {
        return {
          value: item.name
        }
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
