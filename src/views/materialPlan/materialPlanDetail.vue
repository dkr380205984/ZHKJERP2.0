<template>
  <div id="materialPlanDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.type==='1'?'订':'样'}}单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'订':'样'}}单公司：</span>
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
    <template v-if="$route.params.type === '1'">
      <zh-file-module :orderId='$route.params.id'
        title_has_border />
    </template>
    <template v-else-if="$route.params.type === '2'">
      <zh-confirm-module title_has_border
        :orderId="$route.params.id"
        :orderInfo='confirmInfo' />
    </template>
    <div class="module">
      <div class="titleCtn rightCtn">
        <span class="title hasBorder">物料计划</span>
        <div class="positionBtn">
          <div class="btn btnWhiteBlue"
            @click="goPrintProTable(1)">打印原料单</div>
          <div class="btn btnWhiteBlue"
            @click="goPrintProTable(2)">打印辅料单</div>
        </div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row flex04">
              <el-checkbox v-model="checkedAll"
                @change="changeCheckedAll"></el-checkbox>
            </span>
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
              :key="indexPro"
              :disabled='itemPro.material_info.length === 0'>
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row flex04">
                  <el-checkbox v-model="itemPro.checked"
                    @click.stop="(res)=>{return false}"
                    :disabled='itemPro.material_info.length === 0'></el-checkbox>
                </span>
                <span class="tb_row two_line">{{itemPro.product_code}}<br />{{itemPro|filterType}}</span>
                <span class="tb_row">{{itemPro.size + '/' + itemPro.color}}</span>
                <span class="tb_row flex08">{{itemPro.order_num + '' +itemPro.category_info.unit}}</span>
                <span class="tb_row flex08">{{itemPro.stock_num ? itemPro.stock_num : 0 + '' +itemPro.category_info.unit}}</span>
                <span class="tb_row">{{itemPro.material_loss ? itemPro.material_loss + '%' : '0%'}}</span>
                <span class="tb_row">{{itemPro.other_loss ? itemPro.other_loss + '%' : '0%'}}</span>
                <span class="tb_row">{{itemPro.production_num}}</span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品部位</span>
                  <span class="tb_row flex12">物料名称</span>
                  <span class="tb_row">物料颜色</span>
                  <span class="tb_row flex08">配料数量</span>
                  <span class="tb_row flex08">所需个数</span>
                  <span class="tb_row flex08">合计数量</span>
                  <span class="tb_row">原料损耗</span>
                  <span class="tb_row">最终数量</span>
                  <span class="tb_row flex08">单个数量
                    <el-tooltip class="item"
                      effect="dark"
                      content="实际单个部位所需数量"
                      placement="top-start">
                      <span class="el-icon-question"></span>
                    </el-tooltip>
                  </span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight"
                  v-for="(itemMa,indexMa) in itemPro.material_info"
                  :key="indexMa">
                  <span class="tb_row">
                    {{itemMa.product_part === itemPro.product_id ? '大身' :itemMa.name}}
                  </span>
                  <span class="tb_row flex12">{{itemMa.material_name}}</span>
                  <span class="tb_row">{{itemMa.color}}</span>
                  <span class="tb_row flex08">
                    {{itemMa.plan_number ? itemMa.plan_number + '' + itemMa.unit : '-'}}
                  </span>
                  <span class="tb_row flex08">{{itemMa.need_number || 1}}*{{itemPro.production_num}}</span>
                  <span class="tb_row flex08">
                    {{itemMa.total_number ? itemMa.total_number + '' + itemMa.unit : '-'}}
                  </span>
                  <span class="tb_row">{{itemMa.material_loss ? itemMa.material_loss + '%' : '0%'}}</span>
                  <span class="tb_row">{{itemMa.end_num ? itemMa.type === 1 ? $toFixed(itemMa.end_num/1000) + 'kg' : $toFixed(itemMa.end_num) + '' +itemMa.unit : '-'}}</span>
                  <span class="tb_row flex08">
                    {{itemMa.number ? $toFixed(itemMa.number) + '' + itemMa.unit : '-'}}
                  </span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">所需物料</span>
      </div>
      <div class="detailCtn">
        <zh-transition :list="productMaterialTotal"
          style="margin-bottom:16px"
          @changed="changeActiveProId"></zh-transition>
        <div class="normalTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">物料名称</span>
              <span class="tcolumn">颜色</span>
              <span class="tcolumn"
                v-for="(itemSize,indexSize) in showSizeArr"
                :key="indexSize">{{itemSize}}</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(itemMa,indexMa) in showMaterialInfo"
              :key="indexMa">
              <span class="tcolumn">{{itemMa.material_name}}</span>
              <span class="tcolumn">{{itemMa.color}}</span>
              <span class="tcolumn"
                v-for="(itemSize,indexSize) in showSizeArr"
                :key="indexSize">{{itemMa.type === 1 ? $toFixed(itemMa[itemSize]/1000 || 0) + 'kg' : $toFixed(itemMa[itemSize] || 0) + itemMa.unit}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">物料统计</span>
        <div class="positionBtn">
          <div class="btn btnWhiteBlue"
            @click="$openUrl('/materialPlanTable/' + $route.params.id + '/' + $route.params.type + '?type=1')">打印原料单</div>
          <div class="btn btnWhiteBlue"
            @click="$openUrl('/materialPlanTable/' + $route.params.id + '/' + $route.params.type + '?type=2')">打印辅料单</div>
        </div>
      </div>
      <div class="detailCtn paddingTop60">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn flex04 center">物料类型</span>
              <span class="tcolumn">物料名称</span>
              <span class="tcolumn flex20 noPad">
                <span class="trow">
                  <span class="tcolumn">颜色</span>
                  <span class="tcolumn">重量/数量</span>
                </span>
              </span>
              <span class="tcolumn">总计</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(itemMa,indexMa) in materialPlanTotalInfo"
              :key="indexMa">
              <span class="tcolumn flex04 center"
                :class="itemMa.type === 1 ? 'green' : 'orange'">{{itemMa.type === 1 ? '原料' : '辅料'}}</span>
              <span class="tcolumn">{{itemMa.material_name}}</span>
              <span class="tcolumn flex20 noPad">
                <span class="trow"
                  v-for="(itemColor,indexColor) in itemMa.color_info"
                  :key="indexColor">
                  <span class="tcolumn">{{itemColor.color}}</span>
                  <span class="tcolumn">{{itemMa.type === 1 ? $toFixed(itemColor.number/1000) + 'kg' : $toFixed(itemColor.number) + itemMa.unit}}</span>
                </span>
              </span>
              <span class="tcolumn">{{itemMa.type === 1 ? $toFixed(itemMa.total_number/1000) + 'kg' : $toFixed(itemMa.total_number) + itemMa.unit}}</span>
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
          <div class="btn btnRed"
            @click="deleteMaterialPlan($route.params.id,$route.params.type)">删除</div>
          <div class="btn btnBlue"
            @click="$router.push('/materialPlan/materialPlanUpdate/' + $route.params.id + '/' + $route.params.type)">修改</div>
          <!-- <div class="btn btnBlue"
            @click="$openUrl('/material/materialDetail/' + $route.params.id + '/1' + '/' + $route.params.type + '/easy')">去订原料</div>
          <div class="btn btnBlue"
            @click="$openUrl('/material/materialDetail/' + $route.params.id  +'/2'+ '/' + $route.params.type + '/easy')">去订辅料</div> -->
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showRouterPopup">
      <div class="main">
        <div class="title">
          <span style="display:flex;justify-content:center;flex:auto">请选择需要您要跳转的页面</span>
          <span class="el-icon-close"
            @click="showRouterPopup = false"></span>
        </div>
        <div class="content">
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/1/' + $route.params.type + '/normal' )">原料订购</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/2/' + $route.params.type  + '/normal')">辅料订购</div>
          </div>
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/1/' + $route.params.type)">原料出入库</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/2/' + $route.params.type)">辅料出入库</div>
          </div>
        </div>
      </div>
    </div>
    <opr-history :id="$route.params.id"
      :type="this.$route.params.type===1?'order':'sampleOrder'"></opr-history>
  </div>
</template>

<script>
import { materialPlan, order, sampleOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      orderInfo: {},
      materialPlanInfo: [],
      productMaterialTotal: [],
      activeProId: '',
      showMaterialInfo: [],
      showSizeArr: [],
      materialPlanTotalInfo: [],
      showRouterPopup: false,
      checkedAll: false,
      confirmInfo: {}
    }
  },
  created () {
    this.init(this.$route.params.id, this.$route.params.type)
    if (this.$route.query.showRouterPopup === 'true') {
      this.showRouterPopup = true
    }
  },
  methods: {
    changeActiveProId (item) {
      this.activeProId = item.product_id
      this.showSizeArr = item.sizeArr
      this.showMaterialInfo = item.material_info
    },
    deleteMaterialPlan (id, type) {
      materialPlan.delete({
        order_id: id,
        order_type: type
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('删除成功')
          this.$router.push('/materialPlan/materialPlanCreate/' + id + '/' + type)
        }
      })
    },
    changeCheckedAll (event) {
      this.materialPlanInfo.forEach(item => {
        item.checked = event
      })
    },
    goPrintProTable (type) {
      let checkedPro = this.materialPlanInfo.filter(item => item.checked)
      if (checkedPro.length === 0) {
        this.$message.error('请选择需要打印的相关产品')
        return
      }
      let printInfo = checkedPro.map(item => [item.product_id, item.size_id, item.color_id].join(',')).join(';')
      this.$openUrl('/materialPlanTable/' + this.$route.params.id + '/' + this.$route.params.type + '?type=' + type + '&proInfo=' + printInfo)
    },
    init (id, type) {
      if (type === '1') {
        Promise.all([
          materialPlan.init({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type
          }),
          materialPlan.detail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type
          }),
          order.detail({
            id: id
          })
        ]).then(res => {
          let data = res[1].data.data
          // 初始化订单信息
          this.orderInfo = res[2].data.data
          // 处理计划数据
          let planInfo = this.$clone(data.detail_data).sort((a, b) => {
            return a.pid - b.pid
          }).map(itemPro => {
            if (itemPro.pid === 0) {
              itemPro.pid = itemPro.product_id
            }
            return itemPro
          })
          this.materialPlanInfo = this.$mergeData(planInfo, { mainRule: ['pid/product_id', 'color_id', 'size_id'], otherRule: [{ name: 'color_name/color' }, { name: 'size_name/size' }, { name: 'category_info' }, { name: 'product_code' }], childrenName: 'material_info', childrenRule: { otherRule: [{ name: 'product_id/product_part' }, { name: 'name' }, { name: 'material_name' }, { name: 'material_type/type' }, { name: 'material_attribute/color' }, { name: 'single_weight/number' }, { name: 'mix_material_weight/plan_number' }, { name: 'total_weight/total_number' }, { name: 'loss/material_loss' }, { name: 'need_weight/need_number' }, { name: 'calculate_method' }, { name: 'reality_weight/end_num' }, { name: 'unit' }] } })
          // 处理计划时未填写产品物料计划数据不展示的问题（强行匹配没有物料计划的订单产品进去）
          let orderProductInfo = res[0].data.data.product_info
          orderProductInfo.forEach(itemPro => {
            let flag = this.materialPlanInfo.find(itemPlan => {
              return +itemPlan.product_id === +itemPro.product_id && itemPlan.color_id === itemPro.color_id && itemPlan.size_id === itemPro.size_id
            })
            if (!flag) {
              this.materialPlanInfo.push({
                product_id: itemPro.product_id,
                size: itemPro.size_name,
                size_id: itemPro.size_id,
                color: itemPro.color_name,
                color_id: itemPro.color_id,
                product_code: itemPro.product_code,
                category_info: {
                  category_name: itemPro.category_name,
                  style_name: itemPro.style_name,
                  type_name: itemPro.type_name,
                  unit: itemPro.unit
                },
                material_info: []
              })
            } else {
              flag.product_code = itemPro.product_code
              flag.category_info = {
                category_name: itemPro.category_name,
                style_name: itemPro.style_name,
                type_name: itemPro.type_name,
                unit: itemPro.unit
              }
            }
          })
          data.production_data.forEach(itemPro => {
            let flag = this.materialPlanInfo.find(valPro => valPro.product_id === itemPro.product_id && valPro.color_id === itemPro.color_id && valPro.size_id === itemPro.size_id)
            if (flag) {
              flag.material_loss = itemPro.loss_y
              flag.other_loss = itemPro.loss_f
              flag.production_num = itemPro.product_number
              flag.order_num = itemPro.order_number
              flag.stock_num = ''
            }
          })
          // 处理所需物料
          let productMaterialTotal = this.$mergeData(planInfo, { mainRule: ['pid/product_id'], otherRule: [{ name: 'product_code' }], childrenName: 'material_info', childrenRule: { mainRule: ['material_name', 'material_attribute/color', 'size_name/size', 'material_type/type'], otherRule: [{ name: 'reality_weight/number', type: 'add' }, { name: 'unit' }] } })
          productMaterialTotal = productMaterialTotal.map(itemPro => {
            let materialInfo = this.$mergeData(itemPro.material_info.map(itemMa => {
              delete itemMa.childrenMergeInfo
              return itemMa
            }), { mainRule: ['material_name', 'color', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'size_info', childrenRule: { mainRule: 'size', otherRule: [{ name: 'number', type: 'add' }] } }).map(itemMa => {
              let obj = {}
              itemMa.size_info.forEach(itemSize => {
                obj[itemSize.size] = itemSize.number
              })
              return {
                color: itemMa.color,
                material_name: itemMa.material_name,
                type: itemMa.type,
                unit: itemMa.unit,
                ...obj
              }
            })
            return {
              name: itemPro.product_code,
              product_id: itemPro.product_id,
              material_info: materialInfo
            }
          })
          let proSizeArr = this.$mergeData(data.production_data, { mainRule: 'product_id', childrenName: 'size_arr', childrenRule: { mainRule: 'size_name' } })
          proSizeArr.forEach(valPro => {
            let sizeFlag = productMaterialTotal.find(itemPro => itemPro.product_id === valPro.product_id)
            if (sizeFlag) {
              sizeFlag.sizeArr = valPro.size_arr.map(itemSize => itemSize.size_name)
            }
          })
          this.productMaterialTotal = productMaterialTotal
          this.activeProId = this.productMaterialTotal[0] ? this.productMaterialTotal[0].product_id : ''
          this.showMaterialInfo = this.productMaterialTotal[0] ? this.productMaterialTotal[0].material_info : []
          this.showSizeArr = this.productMaterialTotal[0] ? this.productMaterialTotal[0].sizeArr : []
          // 处理统计数据
          this.materialPlanTotalInfo = this.$mergeData(data.total_data.filter(itemNum => Number(itemNum.reality_weight)), { mainRule: 'material_name', otherRule: [{ name: 'unit' }, { name: 'material_type/type' }], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/color', otherRule: [{ name: 'reality_weight/number', type: 'add' }] } })
          this.materialPlanTotalInfo = this.materialPlanTotalInfo.map(itemMa => {
            return {
              material_name: itemMa.material_name,
              type: itemMa.type,
              unit: itemMa.unit,
              color_info: itemMa.color_info.map(itemColor => {
                return {
                  color: itemColor.color,
                  number: itemColor.number
                }
              }),
              total_number: this.$toFixed(itemMa.color_info.map(itemColor => Number(itemColor.number)).reduce((total, itemNum) => {
                return total + itemNum
              }))
            }
          })
          this.loading = false
        })
      } else {
        Promise.all([
          materialPlan.init({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type
          }),
          materialPlan.detail({
            order_id: this.$route.params.id,
            order_type: this.$route.params.type
          }),
          sampleOrder.detail({
            id: this.$route.params.id
          })
        ]).then(res => {
          this.confirmInfo = res[2].data.data
          let data = res[1].data.data
          // 初始化订单信息
          this.orderInfo = data.order_info
          // 处理计划数据
          let planInfo = this.$clone(data.detail_data).sort((a, b) => {
            return a.pid - b.pid
          }).map(itemPro => {
            if (itemPro.pid === 0) {
              itemPro.pid = itemPro.product_id
            }
            return itemPro
          })
          this.materialPlanInfo = this.$mergeData(planInfo, { mainRule: ['pid/product_id', 'color_id', 'size_id'], otherRule: [{ name: 'color_name/color' }, { name: 'size_name/size' }, { name: 'category_info' }, { name: 'product_code' }], childrenName: 'material_info', childrenRule: { otherRule: [{ name: 'product_id/product_part' }, { name: 'name' }, { name: 'material_name' }, { name: 'material_type/type' }, { name: 'material_attribute/color' }, { name: 'single_weight/number' }, { name: 'mix_material_weight/plan_number' }, { name: 'total_weight/total_number' }, { name: 'loss/material_loss' }, { name: 'reality_weight/end_num' }, { name: 'need_weight/need_number' }, { name: 'calculate_method' }, { name: 'unit' }] } })
          // 处理计划时未填写产品物料计划数据不展示的问题（强行匹配没有物料计划的订单产品进去）
          let orderProductInfo = res[0].data.data.product_info
          orderProductInfo.forEach(itemPro => {
            let flag = this.materialPlanInfo.find(itemPlan => {
              return +itemPlan.product_id === +itemPro.product_id && itemPlan.color_id === itemPro.color_id && itemPlan.size_id === itemPro.size_id
            })
            if (!flag) {
              this.materialPlanInfo.push({
                product_id: itemPro.product_id,
                size: itemPro.size_name,
                size_id: itemPro.size_id,
                color: itemPro.color_name,
                color_id: itemPro.color_id,
                product_code: itemPro.product_code,
                category_info: {
                  category_name: itemPro.category_name,
                  style_name: itemPro.style_name,
                  type_name: itemPro.type_name,
                  unit: itemPro.unit
                },
                material_info: []
              })
            } else {
              flag.product_code = itemPro.product_code
              flag.category_info = {
                category_name: itemPro.category_name,
                style_name: itemPro.style_name,
                type_name: itemPro.type_name,
                unit: itemPro.unit
              }
            }
          })
          data.production_data.forEach(itemPro => {
            let flag = this.materialPlanInfo.find(valPro => valPro.product_id === itemPro.product_id && valPro.color_id === itemPro.color_id && valPro.size_id === itemPro.size_id)
            if (flag) {
              flag.material_loss = itemPro.loss_y
              flag.other_loss = itemPro.loss_f
              flag.production_num = itemPro.product_number
              flag.order_num = itemPro.order_number
              flag.stock_num = ''
            }
          })
          // 处理所需物料
          let productMaterialTotal = this.$mergeData(planInfo, { mainRule: ['pid/product_id'], otherRule: [{ name: 'product_code' }], childrenName: 'material_info', childrenRule: { mainRule: ['material_name', 'material_attribute/color', 'size_name/size', 'material_type/type'], otherRule: [{ name: 'reality_weight/number', type: 'add' }, { name: 'unit' }] } })
          productMaterialTotal = productMaterialTotal.map(itemPro => {
            let materialInfo = this.$mergeData(itemPro.material_info.map(itemMa => {
              delete itemMa.childrenMergeInfo
              return itemMa
            }), { mainRule: ['material_name', 'color', 'type'], otherRule: [{ name: 'unit' }], childrenName: 'size_info', childrenRule: { mainRule: 'size', otherRule: [{ name: 'number', type: 'add' }] } }).map(itemMa => {
              let obj = {}
              itemMa.size_info.forEach(itemSize => {
                obj[itemSize.size] = itemSize.number
              })
              return {
                color: itemMa.color,
                material_name: itemMa.material_name,
                type: itemMa.type,
                unit: itemMa.unit,
                ...obj
              }
            })
            return {
              name: itemPro.product_code,
              product_id: itemPro.product_id,
              material_info: materialInfo
            }
          })
          let proSizeArr = this.$mergeData(data.production_data, { mainRule: 'product_id', childrenName: 'size_arr', childrenRule: { mainRule: 'size_name' } })
          proSizeArr.forEach(valPro => {
            let sizeFlag = productMaterialTotal.find(itemPro => itemPro.product_id === valPro.product_id)
            if (sizeFlag) {
              sizeFlag.sizeArr = valPro.size_arr.map(itemSize => itemSize.size_name)
            }
          })
          this.productMaterialTotal = productMaterialTotal
          this.activeProId = this.productMaterialTotal[0] ? this.productMaterialTotal[0].product_id : ''
          this.showMaterialInfo = this.productMaterialTotal[0] ? this.productMaterialTotal[0].material_info : []
          this.showSizeArr = this.productMaterialTotal[0] ? this.productMaterialTotal[0].sizeArr : []
          // 处理统计数据
          this.materialPlanTotalInfo = this.$mergeData(data.total_data.filter(itemNum => Number(itemNum.reality_weight)), { mainRule: 'material_name', otherRule: [{ name: 'unit' }, { name: 'material_type/type' }], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/color', otherRule: [{ name: 'reality_weight/number', type: 'add' }] } })
          this.materialPlanTotalInfo = this.materialPlanTotalInfo.map(itemMa => {
            return {
              material_name: itemMa.material_name,
              type: itemMa.type,
              unit: itemMa.unit,
              color_info: itemMa.color_info.map(itemColor => {
                return {
                  color: itemColor.color,
                  number: itemColor.number
                }
              }),
              total_number: this.$toFixed(itemMa.color_info.map(itemColor => Number(itemColor.number)).reduce((total, itemNum) => {
                return total + itemNum
              }))
            }
          })
          this.loading = false
        })
      }
    }
  },
  filters: {
    filterType (item) {
      return [item.category_info.category_name, item.category_info.style_name, item.category_info.type_name].join('/')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/assets/less/materialPlan/materialPlanDetail.less";
</style>

<style lang="less">
#materialPlanDetail {
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
}
</style>
