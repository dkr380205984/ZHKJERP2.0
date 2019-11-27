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
              :class="{'blue':productInfo.name}">{{productInfo.name?productInfo.name:'无'}}</span>
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
                :key="index">{{item.measurement+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
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
      </div>
    </div>
    <div class="module"
      v-for="(item,index) in list"
      :key="index">
      <div class="titleCtn">
        <span class="title">{{item.name}}</span>
      </div>
      <div class="detailCtn">
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">尺码/配色</div>
              <div class="tcolumn">物料名称</div>
              <div class="tcolumn">物料属性</div>
              <div class="tcolumn">物料数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(itemCS,indexCS) in item.colourSizeArr"
              :key="indexCS">
              <div class="tcolumn">
                {{itemCS.size_name}}/{{itemCS.colour_name}}
              </div>
              <div class="tcolumn"
                style="flex:3">
                <div class="trow"
                  v-for="(itemMat,indexMat) in itemCS.materials"
                  :key="indexMat">
                  <div class="tcolumn">{{itemMat.name}}</div>
                  <div class="tcolumn">{{itemMat.attr}}</div>
                  <div class="tcolumn">{{itemMat.number}}{{itemMat.type===1?'g':'个'}}</div>
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
          <div class="btn btnBlue"
            @click="$router.push('/productPlan/productPlanUpdate/'+$route.params.id)">修改</div>
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
      list: []
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
  mounted () {
    this.loading = false
    productPlan.getByProduct({
      product_id: this.$route.params.id,
      type: 1
    }).then((res) => {
      let data = res.data.data
      this.productInfo = data[0].product_info
      this.list = data.map((item) => {
        let json = {
          name: item.part_type === 1 ? '大身物料' : item.product_info.product_title,
          colourSizeArr: []
        }
        item.material_info.forEach((itemMat) => {
          let finded = json.colourSizeArr.find((itemFind) => itemFind.size_name === itemMat.product_size && itemFind.colour_name === itemMat.product_color)
          if (finded) {
            finded.materials.push({
              name: itemMat.material_name,
              attr: itemMat.material_attribute,
              number: itemMat.weight,
              type: itemMat.type
            })
          } else {
            json.colourSizeArr.push({
              size_name: itemMat.product_size,
              colour_name: itemMat.product_color,
              materials: [{
                name: itemMat.material_name,
                attr: itemMat.material_attribute,
                number: itemMat.weight,
                type: itemMat.type
              }]
            })
          }
        })
        return json
      })
      console.log(this.list)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanDetail.less";
</style>
