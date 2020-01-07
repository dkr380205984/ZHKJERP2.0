<template>
  <div id="productPlanUpdate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.type==='1'?'产':'样'}}品信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
            <span class="text">{{productInfo.product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.title}">{{productInfo.title?productInfo.title:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品品类：</span>
            <span class="text">{{productInfo.category_name}}/{{productInfo.type_name}}/{{productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品成分：</span>
            <span class="text">{{productInfo.component|filterMaterials}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品配色：</span>
            <span class="text">
              <span v-for="(item,index) in productInfo.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}
              </span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品规格：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in productInfo.size_measurement"
                :key="index">{{item.size_name + ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
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
                      <el-input :placeholder="item.chooseMaterial===1?'请输入物料颜色':'请输入物料属性'"
                        v-model="itemMaterial.attr"></el-input>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="inputs">
                      <zh-input placeholder="请输入物料数量"
                        type="number"
                        v-model="itemMaterial.number">
                      </zh-input>
                      <zh-input v-model="itemMaterial.unit"
                        class="unit"
                        placeholder="单位"></zh-input>
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
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
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
      let unit = this.list[index].chooseMaterial === 1 ? 'g' : ''
      this.list[index].colourSizeArr[this.list[index].colourSizeIndex].materials.push({
        name: '',
        attr: '',
        number: '',
        unit: unit
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
            unit: item.unit,
            attr: colourArr[index] ? colourArr[index].attr : ''
          }
        })
      } else {
        nowColorSize.materials = colourArr.map((item, index) => {
          return {
            name: item.name,
            attr: item.attr,
            unit: item.unit,
            number: sizeArr[index] ? sizeArr[index].number : ''
          }
        })
      }
    },
    submit () {
      let formData = []
      this.list.forEach((item, index) => {
        let json = {
          part_type: index === 0 ? 1 : 2,
          id: item.id,
          product_id: item.product_id,
          product_type: this.$route.params.type,
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
              unit: itemMat.unit,
              weight: itemMat.number
            })
          })
        })
        formData.push(json)
      })
      let error = null
      formData.forEach((item) => {
        item.material_info.forEach((item) => {
          if (!item.material_name) {
            error = '检测到有未填写物料名称，请填写'
          }
          if (!item.material_attribute) {
            error = '检测到有未填写物料属性/颜色，请填写'
          }
          if (!item.weight) {
            error = '检测到有未填写物料数量，请填写'
          }
          if (!item.unit) {
            error = '检测到有未填写物料单位名称，请填写'
          }
        })
      })
      if (error) {
        this.$message.error(error)
        return
      }
      this.loading = true
      productPlan.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.loading = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/productPlan/productPlanDetail/' + this.productInfo.product_id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#E6A23C">修改</span>了一张新配料单<span style="color:#1A95FF">' + this.productInfo.product_code + '</span>(' + this.productInfo.category_name + '/' + this.productInfo.type_name + '/' + this.productInfo.style_name + '/' + this.productInfo.flower_name + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/productPlan/productPlanDetail/' + this.productInfo.product_id + '/' + this.$route.params.type)
          }
        }
      })
    }
  },
  mounted () {
    Promise.all([productPlan.detail({
      id: this.$route.params.id
    }), yarn.list(),
    material.list(),
    yarnColor.list()
    ]).then((res) => {
      this.productInfo = res[0].data.data.product_info
      let data = res[0].data.data
      this.list = [{
        part_type: 1,
        material_info: data.material_info,
        id: data.id,
        product_info: data.product_info
      }].concat(data.part_info).map((item) => {
        let json = {
          colourSizeIndex: 0,
          name: item.part_type === 1 ? '大身信息' : item.product_info.product_title,
          chooseMaterial: item.material_info.length > 0 ? item.material_info[0].type === 1 ? 1 : 0 : 1,
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
              unit: itemMat.unit,
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
                unit: itemMat.unit,
                type: itemMat.type
              }]
            })
          }
        })
        return json
      })
      this.productInfo.size_measurement.forEach((itemSize) => {
        this.productInfo.color.forEach((itemColour) => {
          this.list.forEach((itemList) => {
            let finded = itemList.colourSizeArr.find((itemFind) => {
              return itemFind.colour_name === itemColour.color_name && itemFind.size_name === itemSize.size_name
            })
            if (!finded) {
              itemList.colourSizeArr.push({
                size_name: itemSize.size_name,
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
<style lang="less">
#productPlanUpdate {
  .unit {
    .zhInput {
      padding: 0;
      border: 0;
      height: 28px;
      text-align: center;
    }
  }
}
</style>
