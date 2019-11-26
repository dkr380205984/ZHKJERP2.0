<template>
  <div id="productPlanCreate"
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
              :class="{'blue':productInfo.sample_title}">{{productInfo.sample_title?productInfo.sample_title:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">产品品类：</span>
            <span class="text">{{productInfo.category_info.product_category}}/{{productInfo.type_name}}/{{productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">产品成分：</span>
            <span class="text">{{productInfo.materials|filterMaterials}}</span>
          </div>
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
                v-for="(item,index) in productInfo.size"
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">大身信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">物料选择：</span>
              <div class="btnList">
                <div class="button"
                  :class="{'active':chooseMaterial[0]===1}"
                  @click="$set(chooseMaterial, 0, 1)">原料</div>
                <div class="button"
                  :class="{'active':chooseMaterial[0]===0}"
                  @click="$set(chooseMaterial, 0, 0)">辅料</div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">配色尺码：</span>
              <div class="selectBtnList">
                <div class="selectButton"
                  v-for="(item,index) in colourSizeArr"
                  :key="item.id"
                  :class="{'selected':colourSizeIndex===index,'success':colourSizeIndex!==index&&item.materials.length>0,'error':colourSizeIndex!==index&&item.materials.length===0}"
                  @click="colourSizeIndex=index">{{item.size_name}}/{{item.colour_name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">物料信息</div>
                  <div class="tcolumn">物料属性</div>
                  <div class="tcolumn">物料数量</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody"
                v-if="colourSizeArr.length>0">
                <div class="trow"
                  v-for="(item,index) in colourSizeArr[colourSizeIndex].materials"
                  :key="index">
                  <div class="tcolumn">
                    <span class="name"
                      v-show="!item.ifEdit">{{item.material}}</span>
                    <span class="inputs"
                      v-show="item.ifEdit">
                      <el-input placeholder="请输入物料信息"
                        v-model="item.material"></el-input>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="name"
                      v-show="!item.ifEdit">{{item.attr}}</span>
                    <span class="inputs"
                      v-show="item.ifEdit">
                      <el-input placeholder="请输入物料属性"
                        v-model="item.attr"></el-input>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="name"
                      v-show="!item.ifEdit">{{item.number}}</span>
                    <span class="inputs"
                      v-show="item.ifEdit">
                      <el-input placeholder="请输入物料数量"
                        v-model="item.number"></el-input>
                    </span>
                  </div>
                  <div class="tcolumn flexCenter">
                    <span class="opr"
                      @click="item.ifEdit = !item.ifEdit"
                      :style="{'color':item.ifEdit?'#01B48C':'#1A95FF'}">{{item.ifEdit?'保存':'编辑'}}</span>
                    <span class="opr"
                      @click="deleteMaterial(index)">删除</span>
                  </div>
                </div>
              </div>
              <div class="addRow"
                @click="addMaterial">+ 新增辅料</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">配件信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
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
            @click="submit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { product, craft, yarn, material, yarnColor } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      productInfo: {
        product_code: '',
        type_name: '',
        flower_id: '',
        style_name: '',
        category_info: {
          product_category: '',
          name: ''
        },
        color: [],
        materials: [],
        create_time: '',
        user_name: '',
        size: [],
        sample_title: ''
      },
      chooseMaterial: [1],
      colourSizeArr: [],
      colourSizeIndex: 0
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].ingredient_name) {
        arr.forEach((item) => {
          str += item.ingredient_name + item.ingredient_value + '%' + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  methods: {
    // 添加原料
    addMaterial () {
      this.colourSizeArr[this.colourSizeIndex].materials.push({
        name: '',
        attr: '',
        number: '',
        ifEdit: true
      })
    },
    deleteMaterial (index) {
      this.colourSizeArr[this.colourSizeIndex].materials.splice(index, 1)
    },
    submit () {

    }
  },
  mounted () {
    Promise.all([product.detail({
      id: this.$route.params.id
    }), yarn.list(),
    material.list(),
    yarnColor.list(),
    craft.getByProduct({
      product_id: this.$route.params.id
    })]).then((res) => {
      this.productInfo = res[0].data.data
      this.productInfo.size.forEach((itemSize) => {
        this.productInfo.color.forEach((itemColour) => {
          this.colourSizeArr.push({
            size_name: itemSize.measurement,
            size_id: itemSize.id,
            colour_name: itemColour.color_name,
            colour_id: itemColour.id,
            materials: []
          })
        })
      })
      this.colourSizeLen = this.productInfo.color.length * this.productInfo.size.length
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanCreate.less";
</style>
