<template>
  <div id="productPlanCreate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type==='1'?'产':'样'}}品信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
            <span class="text">{{$route.params.type==='1'?productInfo.product_code:productInfo.sample_product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.name}">{{productInfo.name?productInfo.name:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品品类：</span>
            <span class="text">{{$route.params.type==='1'?productInfo.category_info.product_category+'/'+productInfo.type_name+'/'+productInfo.style_name:productInfo.category_name+'/'+productInfo.type_name+'/'+productInfo.style_name}}</span>
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
                v-for="(item,index) in productInfo.size"
                :key="index">{{(item.size_name)+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
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
        <el-tooltip class="item"
          effect="dark"
          content="智能同步可以同步原料信息,相同配色的物料属性信息,以及相同尺码物料数量信息,请在有多个尺码和配色的时候使用该功能"
          placement="top">
          <span class="btn btnBlue"
            style="height:32px;float:right;margin-top:11px"
            @click="shortcutOpr(index)">智能同步</span>
        </el-tooltip>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="titleNum"
          v-if="index>0">{{item.name}}（ 所需数量：{{item.colourSizeArr[item.colourSizeIndex].partNum}} ）</div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">物料选择：</span>
              <div class="btnList">
                <div class="button"
                  :class="{'active':item.chooseMaterial===1}"
                  @click="changeMaterialType(item,1)">原料</div>
                <div class="button"
                  :class="{'active':item.chooseMaterial===0}"
                  @click="changeMaterialType(item,0)">辅料</div>
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
              <div v-if="index>0"
                style="font-size:12px;color:#E6A23C">注意,以下为一个{{item.name}}所需数量 (例:一个产品需要5个纽扣,配料单里每个纽扣需要1个纽扣,因此填1即可)</div>
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
                        @select="selectMaterial($event,itemMaterial)"
                        placeholder="请输入原料名称">
                      </el-autocomplete>
                      <el-autocomplete v-if="item.chooseMaterial===0"
                        v-model="itemMaterial.name"
                        :fetch-suggestions="searchMaterial"
                        placeholder="请输入辅料名称"
                        @select="selectMaterial($event,itemMaterial)">
                      </el-autocomplete>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="inputs">
                      <!-- <el-input :placeholder="item.chooseMaterial===1?'请输入物料颜色':'请输入物料属性'"
                        v-model="itemMaterial.attr"></el-input> -->
                      <el-autocomplete v-model="itemMaterial.attr"
                        :fetch-suggestions="querySearch"
                        :placeholder="item.chooseMaterial===1?'请输入物料颜色':'请输入物料属性'"></el-autocomplete>
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
                      @click="item.colourSizeArr[item.colourSizeIndex].materials.push($clone(itemMaterial))">复制</span>
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
            @click="submit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { product, sample, craft, yarn, material, yarnColor, productPlan, pantongList } from '@/assets/js/api.js'
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
        category_info: {
          product_category: '',
          name: ''
        },
        color: [],
        component: [],
        create_time: '',
        user_name: '',
        size: [],
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
      materialList: [],
      colorList: []
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
    changeMaterialType (item, type) {
      this.$confirm('切换物料类型会清空已填写的' + (type === 1 ? '辅料' : '原料') + '信息,是否切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.chooseMaterial = type
        item.colourSizeArr.forEach((itemChild) => {
          itemChild.materials = []
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消切换'
        })
      })
    },
    querySearch (queryString, cb) {
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
          let filterArr = queryString ? this.colorList.filter(item => item.value.indexOf(queryString) !== -1) : this.colorList
          cb(filterArr)
        })
      } else {
        let filterArr = queryString ? this.colorList.filter(item => item.value.indexOf(queryString) !== -1) : this.colorList
        cb(filterArr)
      }
    },
    selectMaterial (ev, itemMaterial) {
      itemMaterial.unit = ev.unit
    },
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
    searchColor (queryString, cb) {
      let result = queryString ? this.colorList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colorList
      cb(result)
    },
    // 快捷操作 同步尺寸或者配色相同的信息
    shortcutOpr (index) {
      let nowList = this.list[index]
      let nowColorSize = nowList.colourSizeArr[nowList.colourSizeIndex]
      // 第一步，找尺码相同的数据
      let sizeArr = []
      nowList.colourSizeArr.forEach((item) => {
        if (item.size_id === nowColorSize.size_id && item.materials.length > sizeArr.length) {
          sizeArr = this.$clone(item.materials)
        }
      })
      // 第二步，找配色相同的数据
      let colourArr = []
      nowList.colourSizeArr.forEach((item) => {
        if (item.color_id === nowColorSize.color_id && item.materials.length > colourArr.length) {
          colourArr = this.$clone(item.materials)
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
      if (this.loading) {
        this.$message.error('请勿重复点击')
        return
      }
      let formData = []
      this.list.forEach((item, index) => {
        let json = {
          part_type: index === 0 ? 1 : 2,
          id: null,
          product_id: item.product_id,
          product_type: this.$route.params.type,
          material_info: []
        }
        item.colourSizeArr.forEach((itemCS) => {
          itemCS.materials.forEach((itemMat) => {
            json.material_info.push({
              type: item.chooseMaterial === 1 ? 1 : 2,
              color_id: itemCS.color_id,
              size_id: itemCS.size_id,
              material_name: itemMat.name,
              material_attribute: itemMat.attr,
              weight: itemMat.number,
              unit: itemMat.unit
            })
          })
        })
        formData.push(json)
      })
      let error = null
      formData.forEach((item) => {
        // if (item.material_info.length === 0) {
        //   error = '检测到有未填写物料的大身/配件，请添加至少一种物料'
        // }
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
          this.$message.success('添加成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/productPlan/productPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一张新配料单<span style="color:#1A95FF">' + this.productInfo.product_code + '</span>(' + this.productInfo.category_info.product_category + '/' + this.productInfo.type_name + '/' + this.productInfo.style_name + '/' + this.productInfo.flower_id + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/productPlan/productPlanDetail/' + this.$route.params.id + '/' + this.$route.params.type)
          }
        }
      })
    }
  },
  mounted () {
    let sampleOrProduct = this.$route.params.type === '1' ? product : sample
    Promise.all([sampleOrProduct.detail({
      id: this.$route.params.id
    }), yarn.list(),
    material.list(),
    yarnColor.list(),
    craft.getByProduct({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    })]).then((res) => {
      this.productInfo = res[0].data.data
      this.list[0].product_id = this.productInfo.id
      this.colorList = res[3].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.productInfo.size.forEach((itemSize) => {
        this.productInfo.color.forEach((itemColour) => {
          this.list[0].colourSizeArr.push({
            size_name: itemSize.size_name,
            size_id: itemSize.size_id,
            colour_name: itemColour.color_name,
            color_id: itemColour.color_id,
            materials: []
          })
        })
      })

      let part = this.productInfo.part_info || this.productInfo.part_data
      part.forEach((itemPart) => {
        let json = {
          name: itemPart.part_title || itemPart.name,
          product_id: itemPart.id,
          chooseMaterial: 0,
          colourSizeArr: [],
          colourSizeIndex: 0
        }
        // 找一下有没有配件的工艺单
        let craft = res[4].data.data
        let findPart = craft.length === 0 ? null : ((craft.length === 1 ? craft[0] : craft.find((itemFind) => itemFind.is_default === 1)).part_craft_data.find((itemFind) => itemFind.name === (itemPart.part_title || itemPart.name)))
        if (findPart) {
          json.chooseMaterial = 1
        }
        let colourSizeArr = JSON.parse(JSON.stringify(this.list[0].colourSizeArr))
        colourSizeArr.forEach((item) => {
          let finded = itemPart.size.find((itemFind) => itemFind.size_id === item.size_id)
          item.partNum = finded.number
          if (findPart && findPart.peise_yarn_weight[item.colour_name]) {
            item.materials = []
            for (let keyColor in findPart.peise_yarn_weight[item.colour_name]) {
              for (let keyMat in findPart.peise_yarn_weight[item.colour_name][keyColor]) {
                item.materials.push({
                  name: keyMat,
                  attr: keyColor,
                  number: findPart.peise_yarn_weight[item.colour_name][keyColor][keyMat],
                  unit: 'g'
                })
              }
            }
          } else {
            item.materials = [{
              name: itemPart.part_title || itemPart.name,
              attr: item.colour_name,
              number: 1,
              unit: itemPart.unit
            }]
          }
        })
        json.colourSizeArr = colourSizeArr
        this.list.push(json)
      })

      this.yarnList = res[1].data.data.map((item) => {
        return {
          value: item.name,
          unit: 'g'
        }
      })
      this.materialList = res[2].data.data.map((item) => {
        return {
          value: item.name,
          unit: item.unit
        }
      })
      let craft = res[4].data.data
      // 导入工艺单数据
      if (craft.length > 0) {
        this.$alert('检测到该产品已有工艺单信息，已自动为您同步了工艺单原料信息', '提示', {
          confirmButtonText: '确定'
        })
        let craftMat = {}
        craft.forEach((item) => {
          for (let key in item.peise_yarn_weight) {
            craftMat[key] = item.peise_yarn_weight[key]
          }
        })
        this.list[0].colourSizeArr.forEach((item) => {
          if (craftMat[item.colour_name]) {
            let arr = []
            Object.keys(craftMat[item.colour_name]).forEach((keyMat) => {
              Object.keys(craftMat[item.colour_name][keyMat]).forEach((keyColor) => {
                arr.push({
                  name: keyColor,
                  attr: keyMat,
                  number: this.$toFixed(Number(craftMat[item.colour_name][keyMat][keyColor]) || 0) || '',
                  unit: 'g'
                })
              })
            })
            item.materials = arr
          }
        })
      }
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanCreate.less";
</style>
<style lang="less">
#productPlanCreate {
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
