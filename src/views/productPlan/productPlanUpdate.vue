<template>
  <div id="productPlanUpdate"
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
        <span class="title">{{index===0?'大身信息':'配件'+ chinaNum[index - 1]}}</span>
        <span class="atRight"
          @click="shortcutOpr(index)">智能同步</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="titleNum"
          v-if="index>0">{{item.name}}</div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">物料选择：</span>
              <div class="btnList">
                <div class="button"
                  :class="{'active':item.chooseMaterial===1}"
                  @click="item.chooseMaterial=1">原料</div>
                <div class="button"
                  :class="{'active':item.chooseMaterial===0}"
                  @click="item.chooseMaterial=0">辅料</div>
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
                  v-for="(itemColorSize,indexColorSize) in item.colourSizeArr"
                  :key="itemColorSize.id"
                  :class="{'selected':item.colourSizeIndex===indexColorSize,'success':item.colourSizeIndex!==indexColorSize&&itemColorSize.materials.length>0,'error':item.colourSizeIndex!==indexColorSize&&itemColorSize.materials.length===0}"
                  @click="item.colourSizeIndex=indexColorSize">{{itemColorSize.size_name}}/{{itemColorSize.colour_name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">物料属性</div>
                  <div class="tcolumn">物料数量</div>
                  <div class="tcolumn center">操作</div>
                </div>
              </div>
              <div class="tbody"
                v-if="item.colourSizeArr.length>0">
                <div class="trow"
                  v-for="(itemMaterial,indexMaterial) in item.colourSizeArr[item.colourSizeIndex].materials"
                  :key="indexMaterial">
                  <div class="tcolumn">
                    <span class="inputs">
                      <el-autocomplete v-if="item.chooseMaterial===1"
                        v-model="itemMaterial.name"
                        :fetch-suggestions="searchYarn"
                        placeholder="请输入原料名称">
                      </el-autocomplete>
                      <el-autocomplete v-if="item.chooseMaterial===0"
                        v-model="itemMaterial.name"
                        :fetch-suggestions="searchMaterial"
                        placeholder="请输入辅料名称">
                      </el-autocomplete>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="inputs">
                      <el-input placeholder="请输入物料属性"
                        v-model="itemMaterial.attr"></el-input>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="inputs">
                      <zh-input placeholder="请输入物料数量"
                        type="number"
                        v-model="itemMaterial.number">
                        <template v-if="item.chooseMaterial===1"
                          slot="append">g</template>
                      </zh-input>
                    </span>
                  </div>
                  <div class="tcolumn flexCenter">
                    <span class="opr"
                      @click="deleteMaterial(index,indexMaterial)">删除</span>
                  </div>
                </div>
              </div>
              <div class="addRow"
                @click="addMaterial(index)">+ 新增{{item.chooseMaterial===0?'辅料':'原料'}}</div>
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
            @click="submit">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { yarn, material, yarnColor, productPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
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
        name: '大身信息',
        product_id: '',
        chooseMaterial: 1,
        colourSizeArr: [],
        colourSizeIndex: 0
      }],
      yarnList: [],
      materialList: []
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
    // 添加原料
    addMaterial (index) {
      this.list[index].colourSizeArr[this.list[index].colourSizeIndex].materials.push({
        name: '',
        attr: '',
        number: ''
      })
    },
    deleteMaterial (index, indexMaterial) {
      this.$confirm('是否删除本列?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].colourSizeArr[this.list[index].colourSizeIndex].materials.splice(indexMaterial, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    searchYarn (queryString, cb) {
      let result = queryString ? this.yarnList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarnList
      cb(result)
    },
    searchMaterial (queryString, cb) {
      let result = queryString ? this.materialList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.materialList
      cb(result)
    },
    // 快捷操作 同步尺寸或者配色相同的信息
    shortcutOpr (index) {
      console.log(this.list)
      let nowList = this.list[index]
      let nowColorSize = nowList.colourSizeArr[nowList.colourSizeIndex]
      // 第一步，找尺码相同的数据
      let sizeArr = []
      nowList.colourSizeArr.forEach((item) => {
        if (item.size_name === nowColorSize.size_name && item.materials.length > sizeArr.length) {
          sizeArr = JSON.parse(JSON.stringify(item.materials))
        }
      })
      // 第二步，找配色相同的数据
      let colourArr = []
      nowList.colourSizeArr.forEach((item) => {
        if (item.colour_name === nowColorSize.colour_name && item.materials.length > colourArr.length) {
          colourArr = JSON.parse(JSON.stringify(item.materials))
        }
      })
      // 合并尺码相同的数据和配色相同的数据
      if (sizeArr.length > colourArr.length) {
        nowColorSize.materials = sizeArr.map((item, index) => {
          return {
            name: item.name,
            number: item.number,
            attr: colourArr[index] ? colourArr[index].attr : ''
          }
        })
      } else {
        nowColorSize.materials = colourArr.map((item, index) => {
          return {
            name: item.name,
            attr: item.attr,
            number: sizeArr[index] ? sizeArr[index].number : ''
          }
        })
      }
    },
    submit () {
      this.loading = true
      let formData = []
      this.list.forEach((item, index) => {
        let json = {
          part_type: index === 0 ? 1 : 2,
          id: item.id,
          product_id: item.product_id,
          product_type: 1,
          material_info: []
        }
        item.colourSizeArr.forEach((itemCS) => {
          itemCS.materials.forEach((itemMat) => {
            json.material_info.push({
              type: item.chooseMaterial === 1 ? 1 : 2,
              product_color: itemCS.colour_name,
              product_size: itemCS.size_name,
              material_name: itemMat.name,
              material_attribute: itemMat.attr,
              weight: itemMat.number
            })
          })
        })
        formData.push(json)
      })
      productPlan.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.loading = false
          this.$router.push('/productPlan/productPlanDetail/' + this.$route.params.id)
        }
      })
    }
  },
  mounted () {
    Promise.all([productPlan.getByProduct({
      product_id: this.$route.params.id,
      type: 1
    }), yarn.list(),
    material.list(),
    yarnColor.list()
    ]).then((res) => {
      this.productInfo = res[0].data.data[0].product_info
      this.list = res[0].data.data.map((item) => {
        let json = {
          colourSizeIndex: 0,
          name: item.part_type === 1 ? '大身信息' : item.product_info.product_title,
          chooseMaterial: item.material_info[0].type === 1 ? 1 : 0,
          colourSizeArr: [],
          product_id: item.product_info.product_id,
          id: item.id
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
      this.productInfo.size_measurement.forEach((itemSize) => {
        this.productInfo.color.forEach((itemColour) => {
          this.list.forEach((itemList) => {
            let finded = itemList.colourSizeArr.find((itemFind) => {
              return itemFind.colour_name === itemColour.color_name && itemFind.size_name === itemSize.measurement
            })
            if (!finded) {
              itemList.colourSizeArr.push({
                size_name: itemSize.measurement,
                size_id: itemSize.id,
                colour_name: itemColour.color_name,
                colour_id: itemColour.id,
                materials: []
              })
            }
          })
        })
      })
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
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanUpdate.less";
</style>
