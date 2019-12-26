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
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in productInfo.size_measurement"
                :key="index">{{(item.measurement || item.size_name)+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
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
                  <div class="tcolumn">{{itemMat.number}}{{itemMat.unit}}</div>
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
          <div class="btn btnOrange"
            @click="$openUrl('/productPlanTable/' + $route.params.id + '/' + $route.params.type + '/' + list[listIndex].id)">打印</div>
          <div class="btn btnBlue"
            @click="$router.push('/productPlan/productPlanUpdate/'+list[listIndex].id + '/' + $route.params.type)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
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
        name: ''
      },
      list: [{
        data: [],
        id: ''
      }],
      listIndex: 0,
      defaultIndex: 0,
      plan_id: 0
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
    }
  },
  mounted () {
    productPlan.getByProduct({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    }).then((res) => {
      let data = res.data.data
      this.productInfo = data[0].product_info
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
      this.plan_id = this.list[0].id
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanDetail.less";
</style>
