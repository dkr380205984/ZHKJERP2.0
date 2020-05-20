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
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn noMargin">
            <div class="editCtn bgGary_page"
              v-for="(itemPlan,indexPlan) in materialPlanInfo"
              :key="indexPlan">
              <span class="closeIcon_page el-icon-circle-close"
                @click="deleteItem(materialPlanInfo,indexPlan,true)"></span>
              <div class="rowCtn">
                <div class="colCtn flex34 noMargin">
                  <div class="label">
                    <span class="text">计划单{{chinaNum[indexPlan]}}</span>
                    <span class="explanation">（必填）</span>
                  </div>
                  <div class="content">
                    <zh-input class="elInput"
                      v-model="itemPlan.name"
                      placeholder="请输入计划单名称"></zh-input>
                  </div>
                </div>
                <div class="colCtn flex04 noMargin">
                  <div class="label"></div>
                  <div class="content col_center">
                    <span class="btn noBorder col_editBtn"
                      @click="copyItem(materialPlanInfo,itemPlan)">复制计划单</span>
                  </div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn flex34 noMargin">
                  <div class="label">
                    <span class="text">包含产品</span>
                    <span class="explanation">（选填）</span>
                  </div>
                  <div class="content">
                    <zh-input class="elInput"
                      disabled
                      v-model="itemPlan.product_info.productStr"
                      placeholder="请选择包含的产品信息"></zh-input>
                  </div>
                </div>
                <div class="colCtn noMargin flex04 center">
                  <div class="label"></div>
                  <div class="content col_center">
                    <span class="btn noBorder col_editBtn"
                      @click="editProInfo(itemPlan.product_info)">编辑</span>
                  </div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="tableCtnLv2">
                  <div class="tb_header noPad">
                    <span class="tb_row flex12">物料名称</span>
                    <span class="tb_row flex12">物料属性</span>
                    <span class="tb_row">物料数量</span>
                    <span class="tb_row flex04 middle">操作</span>
                  </div>
                  <div class="tb_content noPad noBorder"
                    v-for="(itemMa,indexMa) in itemPlan.materials"
                    :key="indexMa">
                    <span class="tb_row flex12">
                      <el-autocomplete v-if="itemMa.material_type === 1 "
                        v-model="itemMa.material_name"
                        :fetch-suggestions="searchYarn"
                        style="width:80%"
                        @select="computedTotal"
                        placeholder="请输入原料名称">
                      </el-autocomplete>
                      <el-autocomplete v-if="itemMa.material_type === 2"
                        v-model="itemMa.material_name"
                        :fetch-suggestions="searchMaterial"
                        style="width:80%"
                        @select="selectMaterial($event,itemMa)"
                        placeholder="请输入辅料名称">
                      </el-autocomplete>
                    </span>
                    <span class="tb_row flex12">
                      <el-autocomplete :placeholder="itemMa.material_type === 1 ? '请输入原料颜色' : '请输入辅料属性'"
                        v-model="itemMa.material_attr"
                        @select="computedTotal"
                        style="width:80%"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"></el-autocomplete>
                    </span>
                    <span class="tb_row">
                      <zh-input placeholder="数量"
                        v-model="itemMa.material_number"
                        @input="computedTotal"
                        style="width:100%"
                        type="number">
                        <template slot="append">
                          <template v-if="itemMa.material_type === 1">kg</template>
                          <template v-else>
                            <input type="text"
                              v-model="itemMa.material_unit"
                              @change="changeOtherMaterialUnit($event,itemMa)"
                              style="border: none;background: transparent;outline: none;width: 1em;">
                          </template>
                        </template>
                      </zh-input>
                    </span>
                    <span class="tb_row flex04 middle">
                      <span class="tb_handle_btn blue"
                        @click="copyItem(itemPlan.materials,itemMa)">复制</span>
                      <span class="tb_handle_btn red"
                        @click="deleteItem(itemPlan.materials,indexMa)">删除</span>
                    </span>
                  </div>
                  <div class="tb_content noPad noBorder">
                    <div class="tb_row tb_row_handle_btn"
                      @click="addItem(itemPlan.materials,'material')">+ 新增原料</div>
                    <div class="tb_row tb_row_handle_btn"
                      @click="addItem(itemPlan.materials,'other')">+ 新增辅料</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="addRows">
              <span class="once"
                @click="addItem(materialPlanInfo,'plan')">+添加计划单</span>
            </div>
          </div>
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
            <span class="tb_row">颜色/属性</span>
            <span class="tb_row flex08">最终数量</span>
          </div>
          <div class="tb_content"
            v-for="(itemMa,indexMa) in materialTotalInfo"
            :key="indexMa">
            <span class="tb_row flex12">{{itemMa.material_name}}</span>
            <span class="tb_row">{{itemMa.material_attr}}</span>
            <span class="tb_row flex08">
              <span class="align"><em class="bigNum">{{$toFixed(itemMa.material_number) || 0}}</em>{{itemMa.material_type === 1 ? 'kg' : itemMa.material_unit}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="isEditPro">
      <div class="main">
        <div class="title">
          <span class="text">产品选择</span>
          <span class="el-icon-close"
            @click="cancelEditPro"></span>
        </div>
        <div class="content">
          <template v-for="(itemPro,indexPro) in productEditInfo.productArr">
            <div class="row"
              :key="indexPro + 'product'">
              <span class="label">选择产品：</span>
              <span class="info">
                <el-select v-model="itemPro.product_id"
                  @change="changePro($event,itemPro)"
                  placeholder="请选择产品">
                  <el-option v-for="item in productList"
                    :key="item.id"
                    :label="item.product_code"
                    :value="item.id">
                  </el-option>
                </el-select>
              </span>
              <span class="editBtn red"
                @click="deleteItem(productEditInfo,indexPro)">删除</span>
            </div>
            <div class="row col"
              :key="indexPro + 'sizeColor'">
              <span class="label">尺码颜色：</span>
              <span class="info">
                <div class="row_item">
                  <el-checkbox :indeterminate="itemPro.isIndeterminate"
                    v-model="itemPro.checkAll"
                    @change="handleCheckAllChange($event,itemPro)">全选</el-checkbox>
                </div>
                <div class="row_item">
                  <el-checkbox-group v-model="itemPro.sizeColor"
                    @change="handleCheckedChange($event,itemPro)">
                    <el-checkbox v-for="(item,index) in itemPro.sizeColorArr"
                      :label="item.id"
                      :key="index"
                      class="checkbox_item">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </span>
            </div>
          </template>
          <div class="row">
            <div class="btn btnWhiteBlue"
              @click="addItem(productEditInfo,'product')">添加产品</div>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="cancelEditPro">取消</span>
          <span class="btn btnBlue"
            @click="isEditPro = false">确定</span>
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
import { chinaNum } from '@/assets/js/dictionary.js'
import { materialPlan, yarn, material, pantongList, yarnColor } from '@/assets/js/api.js'
export default {
  data () {
    return {
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      loading: true,
      lock: true,
      chinaNum: chinaNum,
      yarnList: [],
      materialList: [],
      orderInfo: {},
      materialTotalInfo: [],
      colorList: [],
      materialPlanInfo: [
        {
          name: '',
          product_info: {
            productArr: [],
            productStr: ''
          },
          materials: [
            {
              material_type: 1,
              material_name: '',
              material_attr: '',
              material_number: '',
              material_unit: 'kg'
            }
          ]
        }
      ],
      productList: [],
      productEditInfo: [
        {
          product_id: '',
          product_code: '',
          sizeColor: [],
          sizeColorName: [],
          sizeColorArr: [],
          isIndeterminate: false,
          checkAll: false
        }
      ],
      oldProductEditInfo: [],
      isEditPro: false,
      materialPlanId: ''

    }
  },
  methods: {
    selectMaterial (e, item) {
      console.log(e, item)
      item.material_unit = e.unit || '个'
      this.computedTotal()
    },
    changeOtherMaterialUnit (e, item) {
      if (!e.target.value) {
        item.material_unit = '个'
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
      if (!this.lock) {
        this.$message.warning('请勿频繁点击')
        return
      }
      let flag = {
        planTitle: true,
        materialName: true,
        materialAttr: true,
        materialNum: true
      }
      let detailData = this.materialPlanInfo.map(itemPlan => {
        if (!itemPlan.name) {
          flag.planTitle = false
        }
        return {
          title: itemPlan.name,
          id: itemPlan.id || null,
          product_data: this.$flatten(itemPlan.product_info.productArr.map(itemPro => {
            return itemPro.sizeColor.map(itemSizeColor => {
              return {
                product_id: itemPro.product_id,
                size_id: itemSizeColor.split('/')[0] || '',
                color_id: itemSizeColor.split('/')[1] || ''
              }
            })
          })),
          material_data: itemPlan.materials.map(itemMa => {
            if (!itemMa.material_name) {
              flag.materialName = false
            }
            if (!itemMa.material_attr) {
              flag.materialAttr = false
            }
            if (!itemMa.material_number) {
              flag.materialNum = false
            }
            return {
              material_name: itemMa.material_name,
              material_attribute: itemMa.material_attr,
              material_type: itemMa.material_type,
              weight: itemMa.material_number,
              unit: itemMa.material_unit
            }
          })
        }
      })
      if (detailData.length === 0) {
        this.$message.error('检测到没有可提交的物料计划单')
        return
      }
      if (!flag.planTitle) {
        this.$message.error('检测到有物料计划单未填写名称，请输入')
        return
      }
      if (!flag.materialName) {
        this.$message.error('检测到有未填写的物料名称，请输入')
        return
      }
      if (!flag.materialAttr) {
        this.$message.error('检测到有未填写的物料属性，请输入')
        return
      }
      if (!flag.materialNum) {
        this.$message.error('检测到有未填写的物料数量，请输入')
        return
      }
      let data = {
        id: this.materialPlanId || null,
        order_id: this.$route.params.id,
        order_type: this.$route.params.type,
        detail_data: detailData,
        total_data: this.materialTotalInfo.map(itemMa => {
          return {
            material_name: itemMa.material_name,
            material_type: itemMa.material_type,
            material_attribute: itemMa.material_attr,
            weight: itemMa.material_number,
            unit: itemMa.material_unit
          }
        })
      }
      console.log(data)
      this.lock = false
      materialPlan.dressCreate(data).then(res => {
        if (res.data.status) {
          this.$message.success('添加成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialPlan/materialPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一张新物料计划单,' + (this.$route.params.type === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
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
          material_type: 1,
          material_name: '',
          material_attr: '',
          material_number: '',
          material_unit: 'kg'
        })
      } else if (type === 'other') {
        item.push({
          material_type: 2,
          material_name: '',
          material_attr: '',
          material_number: '',
          material_unit: '个'
        })
      } else if (type === 'plan') {
        item.push({
          name: '',
          product_info: {
            productArr: [],
            productStr: ''
          },
          materials: [
            {
              material_type: 1,
              material_name: '',
              material_attr: '',
              material_number: '',
              material_unit: 'kg'
            }
          ]
        })
      } else if (type === 'product') {
        item.push({
          product_id: '',
          product_code: '',
          sizeColor: [],
          sizeColorName: [],
          sizeColorArr: [],
          isIndeterminate: false,
          checkAll: false
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
      let data = this.materialPlanInfo.map(item => item.materials)
      this.materialTotalInfo = this.$mergeData(this.$flatten(data), { mainRule: ['material_type', 'material_name', 'material_attr', 'material_unit'], otherRule: [{ name: 'material_number', type: 'add' }] })
    },
    copyItem (data, item) {
      data.push(this.$clone(item))
      this.computedTotal()
    },
    editProInfo (item) {
      this.oldProductEditInfo = this.$clone(item)
      if (item.productArr.length === 0) {
        item.productArr.push({
          product_id: '',
          product_code: '',
          sizeColor: [],
          sizeColorName: [],
          sizeColorArr: [],
          isIndeterminate: false,
          checkAll: false
        })
      }
      this.productEditInfo = item
      this.isEditPro = true
    },
    changePro (ev, item) {
      if (ev) {
        let flag = this.productList.find(itemPro => itemPro.id === item.product_id)
        if (flag) {
          item.product_code = flag.product_code
          item.sizeColorArr = flag.size_color_info.map(item => {
            return {
              id: item.size_id + '/' + item.color_id,
              name: item.size_name + '/' + item.color_name
            }
          })
        }
      }
      this.getProStr()
    },
    handleCheckAllChange (e, item) {
      if (e) {
        item.sizeColor = item.sizeColorArr.map(item => item.id)
        item.sizeColorName = item.sizeColorArr.map(item => item.name)
      } else {
        item.sizeColor = []
        item.sizeColorName = []
      }
      item.isIndeterminate = false
      this.getProStr()
    },
    handleCheckedChange (e, item) {
      if (e.length === 0) {
        item.checkAll = false
        item.isIndeterminate = false
        item.sizeColorName = []
      } else if (e.length === item.sizeColorArr.length) {
        item.checkAll = true
        item.isIndeterminate = false
        item.sizeColorName = item.sizeColorArr.map(item => item.name)
      } else {
        item.checkAll = false
        item.isIndeterminate = true
        item.sizeColorName = item.sizeColorArr.filter(itemF => {
          return e.indexOf(itemF.id) !== -1
        }).map(itemS => itemS.name)
      }
      this.getProStr()
    },
    cancelEditPro () {
      this.productEditInfo.productArr = this.oldProductEditInfo.productArr
      this.productEditInfo.productStr = this.oldProductEditInfo.productStr
      this.isEditPro = false
    },
    getProStr () {
      let strArr = this.productEditInfo.productArr.map(item => {
        return item.product_code + ':' + item.sizeColorName.join('、')
      })
      this.productEditInfo.productStr = strArr.length > 0 ? strArr.join(';') : ''
    }
  },
  created () {
    Promise.all([
      materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      }),
      materialPlan.getDressDetailForOrder({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      }),
      yarn.list(),
      material.list()
    ]).then(res => {
      this.orderInfo = res[0].data.data.order_info
      this.productList = this.$mergeData(res[0].data.data.product_info.map(itemPro => {
        return {
          id: itemPro.product_id,
          product_code: itemPro.product_code,
          size_id: itemPro.size_id,
          size_name: itemPro.size_name,
          color_id: itemPro.color_id,
          color_name: itemPro.color_name,
          type: [itemPro.category_name, itemPro.type_name, itemPro.style_name].join('/')
        }
      }), { mainRule: 'id', otherRule: [{ name: 'product_code' }, { name: 'type' }], childrenName: 'size_color_info', childrenRule: { mainRule: ['size_id', 'color_id'], otherRule: [{ name: 'size_name' }, { name: 'color_name' }] } })
      this.materialPlanId = res[1].data.data.id
      this.materialPlanInfo = res[1].data.data.detail_data.map(itemPlan => {
        let productArr = this.$mergeData(itemPlan.product_data.map(itemPro => {
          let obj = {
            checkAll: false,
            isIndeterminate: false,
            product_code: itemPro.product_code,
            product_id: itemPro.product_id,
            sizeColor: [itemPro.size_id + '/' + itemPro.color_id],
            sizeColorName: [itemPro.size_name + '/' + itemPro.color_name]
          }
          let flag = this.productList.find(itemPro => itemPro.id === obj.product_id)
          if (flag) {
            obj.product_code = flag.product_code
            obj.sizeColorArr = flag.size_color_info.map(item => {
              return {
                id: item.size_id + '/' + item.color_id,
                name: item.size_name + '/' + item.color_name
              }
            })
          }
          return obj
        }), { mainRule: 'product_id', otherRule: [{ name: 'sizeColor', type: 'concat' }, { name: 'sizeColorName', type: 'concat' }, { name: 'sizeColorArr' }, { name: 'checkAll' }, { name: 'product_code' }, { name: 'isIndeterminate' }] })

        let strArr = productArr.map(item => { // 初始化选中的产品展示字符串
          return item.product_code + ':' + item.sizeColorName.join('、')
        })
        return {
          name: itemPlan.title,
          id: itemPlan.id,
          product_info: {
            productArr: productArr,
            productStr: strArr.length > 0 ? strArr.join(';') : ''
          },
          materials: itemPlan.material_data.map(itemMa => {
            return {
              material_type: itemMa.material_type,
              material_name: itemMa.material_name,
              material_attr: itemMa.material_attribute,
              material_number: itemMa.weight,
              material_unit: itemMa.unit
            }
          })
        }
      })
      this.computedTotal()
      this.yarnList = res[2].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.materialList = res[3].data.data.map((item) => {
        return {
          value: item.name,
          unit: item.unit
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
