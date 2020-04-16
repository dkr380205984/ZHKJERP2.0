<template>
  <div id="productPlanDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">产品信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品编号：</span>
            <span class="text">{{productInfo.product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">产品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.name||productInfo.product_title}">{{productInfo.name||productInfo.product_title?productInfo.name||productInfo.product_title:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">产品品类：</span>
            <span class="text">{{productInfo.category_name}}/{{productInfo.type_name}}/{{productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品配色：</span>
            <span class="text">
              <span v-for="(item,index) in productInfo.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}
              </span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品规格：</span>
            <div class="tableCtn">
              <div class="line">
                <div class="once">
                  <div class="biaotou rightTop">规格</div>
                  <div class="xiexian"></div>
                  <div class="biaotou leftBottom">部位</div>
                </div>
                <div class="once"
                  v-for="(item,index) in productInfo.size_measurement"
                  :key="index">
                  {{item.size_name}}
                </div>
              </div>
              <div class="line"
                v-for="(item,index) in productInfo.sizePart"
                :key="index">
                <div class="once">
                  {{item.part}}
                </div>
                <div class="once"
                  v-for="(itemNum,indexNum) in item.size"
                  :key="indexNum">
                  {{itemNum}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':productInfo.description}">{{productInfo.description?productInfo.description:'无'}}</span>
          </div>
        </div>
        <div class="swichCtn"
          v-if="$route.params.type==='2' && list.length>0">
          <div class="swich"
            v-for="index in list.length"
            :key="index"
            :class="{'active':listIndex===index-1}"
            @click="changePlan(index-1)">配料单{{index}}</div>
          <div class="btn btnBlue"
            @click="setDefault"
            :style="{'display':listIndex===defaultIndex?'none':'block'}">设为默认</div>
        </div>
      </div>
    </div>
    <div class="module"
      v-for="(item,index) in list[listIndex].data"
      :key="index">
      <div class="titleCtn">
        <span class="title">{{item.name}}</span>
      </div>
      <div class="detailCtn">
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">尺码/配色</div>
              <div class="tcolumn noPad"
                style="flex:3">
                <div class="trow">
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">物料属性</div>
                  <div class="tcolumn">物料数量</div>
                  <div class="tcolumn">物料比例</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(itemCS,indexCS) in item.colourSizeArr"
              :key="indexCS">
              <div class="tcolumn">
                {{itemCS.size_name}}/{{itemCS.colour_name}}
              </div>
              <div class="tcolumn noPad"
                style="flex:3">
                <div class="trow"
                  v-for="(itemMat,indexMat) in itemCS.materials"
                  :key="indexMat">
                  <div class="tcolumn">{{itemMat.name}}</div>
                  <div class="tcolumn">{{itemMat.attr}}</div>
                  <div class="tcolumn">{{$toFixed(itemMat.number)}}{{itemMat.unit}}</div>
                  <div class="tcolumn">{{$toFixed(itemMat.number/itemCS.material_total*100) + '%'}}</div>
                </div>
              </div>
            </div>
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
            @click="deletePlan">删除</div>
          <div class="btn btnOrange"
            @click="$openUrl('/productPlanTable/' + $route.params.id + '/' + $route.params.type + '/' + list[listIndex].id)">打印</div>
          <div class="btn btnBlue"
            @click="$router.push('/productPlan/productPlanUpdate/'+list[listIndex].id + '/' + $route.params.type)">修改</div>
          <div class="btn btnBlue"
            @click="getOrderList(productInfo.product_code)">计划物料</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showOrderListFlag">
      <div class="main">
        <div class="title">
          <span class="text">请选择您需要填写的订单</span>
          <span class="el-icon-close"
            @click="showOrderListFlag = false"></span>
        </div>
        <div class="content"
          v-loading='showOrderListLoading'>
          <div class="row flax_warp">
            <template v-if="orderList.length > 0">
              <el-radio-group v-model="checkedOrderId"
                v-for="(item,index) in orderList"
                :key="index"
                style="margin:4px 0">
                <el-radio :label="item.id">{{item.order_code}}</el-radio>
              </el-radio-group>
            </template>
            <template v-else>
              暂无相关订单
            </template>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGary"
            @click="showOrderListFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="goMaterialPlan(checkedOrderId)">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productPlan, order, sampleOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      has_check: window.sessionStorage.getItem('has_check'),
      loading: true,
      productInfo: {
        product_code: '',
        type_name: '',
        flower_id: '',
        style_name: '',
        category_name: '',
        color: [],
        component: [],
        create_time: '',
        user_name: '',
        size_measurement: [],
        name: '',
        sizePart: []
      },
      list: [{
        data: [],
        id: ''
      }],
      listIndex: 0,
      defaultIndex: 0,
      plan_id: 0,
      // 搜索相关订单信息
      showOrderListFlag: false,
      showOrderListLoading: false,
      orderList: [],
      checkedOrderId: ''
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].component_name) {
        arr.forEach((item) => {
          str += item.component_name + item.number + '%' + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  methods: {
    // 获取与该产品相关的订单
    getOrderList (code) {
      this.showOrderListFlag = true
      this.showOrderListLoading = true
      if (this.$route.params.type === '1') {
        order.list({
          limit: 9999,
          page: 1,
          product_code: code
        }).then(res => {
          if (res.data.status !== false) {
            this.orderList = res.data.data
            this.showOrderListLoading = false
          }
        })
      } else {
        sampleOrder.list({
          limit: 9999,
          page: 1,
          product_code: code
        }).then(res => {
          if (res.data.status !== false) {
            this.orderList = res.data.data.map(item => {
              item.order_code = item.title
              return item
            })
            this.showOrderListLoading = false
          }
        })
      }
    },
    goMaterialPlan (id) {
      let flag = this.orderList.find(item => item.id === id)
      if (flag) {
        flag.has_plan > 0 ? this.$router.push('/materialPlan/materialPlanDetail/' + id + '/' + this.$route.params.type) : this.$router.push('/materialPlan/materialPlanCreate/' + id + '/' + this.$route.params.type)
      } else {
        this.$message.warning('请选择需要前往添加物料计划的订单')
      }
    },
    changePlan (index) {
      this.listIndex = index
      this.plan_id = this.list[this.listIndex].id
    },
    // 设为默认
    setDefault () {
      productPlan.setDefault({
        id: this.plan_id
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('设置成功')
          this.defaultIndex = this.listIndex
        }
      })
    },
    deletePlan () {
      this.$confirm('此操作将永久删除该配料单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productPlan.delete({
          id: this.list[this.listIndex].id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.go(-1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    productPlan.getByProduct({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    }).then((res) => {
      let data = res.data.data
      this.productInfo = data[0].product_info
      this.productInfo.sizePart = []
      this.productInfo.size_measurement.forEach((itemSize, indexSize) => {
        JSON.parse(itemSize.part_info).forEach((itemPart, indexPart) => {
          if (!this.productInfo.sizePart[indexPart]) {
            this.productInfo.sizePart[indexPart] = {
              part: '',
              size: []
            }
          }
          this.productInfo.sizePart[indexPart].part = itemPart.part
          this.productInfo.sizePart[indexPart].size.push(itemPart.size)
        })
      })
      this.list = data.map((item, index) => {
        if (item.is_default === 1) {
          this.listIndex = index
          this.defaultIndex = index
        }
        let mainArr = [{
          name: '大身信息',
          colourSizeArr: []
        }] // 大身
        let partArr = [] // 配件
        item.material_info.forEach((itemMat) => {
          let finded = mainArr[0].colourSizeArr.find((itemFind) => itemFind.size_name === itemMat.product_size && itemFind.colour_name === itemMat.product_color)
          if (finded) {
            finded.materials.push({
              name: itemMat.material_name,
              attr: itemMat.material_attribute,
              number: itemMat.weight,
              type: itemMat.type,
              unit: itemMat.unit
            })
          } else {
            mainArr[0].colourSizeArr.push({
              size_name: itemMat.product_size,
              colour_name: itemMat.product_color,
              materials: [{
                name: itemMat.material_name,
                attr: itemMat.material_attribute,
                number: itemMat.weight,
                type: itemMat.type,
                unit: itemMat.unit
              }]
            })
          }
        })
        item.part_info.forEach((itemPart, indexPart) => {
          partArr.push({
            name: itemPart.product_info.product_title,
            colourSizeArr: []
          })
          itemPart.material_info.forEach((itemMat) => {
            let finded = partArr[indexPart].colourSizeArr.find((itemFind) => itemFind.size_name === itemMat.product_size && itemFind.colour_name === itemMat.product_color)
            if (finded) {
              finded.materials.push({
                name: itemMat.material_name,
                attr: itemMat.material_attribute,
                number: itemMat.weight,
                type: itemMat.type,
                unit: itemMat.unit
              })
            } else {
              partArr[indexPart].colourSizeArr.push({
                size_name: itemMat.product_size,
                colour_name: itemMat.product_color,
                materials: [{
                  name: itemMat.material_name,
                  attr: itemMat.material_attribute,
                  number: itemMat.weight,
                  type: itemMat.type,
                  unit: itemMat.unit
                }]
              })
            }
          })
        })
        return {
          data: mainArr.concat(partArr),
          id: item.id
        }
      })
      // 大身新增物料比例字段，把物料总数加一加
      this.list.forEach((itemList) => {
        itemList.data[0].colourSizeArr.forEach((item) => {
          item.material_total = item.materials.reduce((total, current) => {
            return total + Number(current.number)
          }, 0)
        })
      })
      this.plan_id = this.list[0].id
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanDetail.less";
</style>
