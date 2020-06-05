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
        <span class="title">{{index===0?'成衣信息':'配件'+ chinaNum[index - 1]}}</span>
        <el-tooltip class="item"
          effect="dark"
          content="智能同步可以同步原料信息,相同配色的物料属性信息,以及相同尺码物料数量信息,请在有多个尺码和配色的时候使用该功能"
          placement="top">
          <span class="btn btnBlue"
            style="height:32px;float:right;margin-top:11px"
            @click="shortcutOpr(item)">智能同步物料数据</span>
        </el-tooltip>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="titleNum"
          v-if="index>0">{{item.name}}（ 所需数量：{{item.colorInfo[item.colorIndex].sizeInfo[item.colorInfo[item.colorIndex].sizeIndex].partNum}} ）</div>
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
              <span class="text">产品配色：</span>
              <div class="selectBtnList">
                <div class="selectButton"
                  v-for="(itemColor,indexColor) in item.colorInfo"
                  :key="itemColor.color_id"
                  :class="{'selected': item.colorIndex === indexColor,'success': item.colorIndex !== indexColor && itemColor.materials.length > 0,'error':item.colorIndex !== indexColor && itemColor.materials.length === 0}"
                  @click="item.colorIndex = indexColor">{{itemColor.color_name}}</div>
                <div class="btn btnWhiteBlue"
                  style="margin-bottom:16px"
                  @click="item.isShowSize = !item.isShowSize">{{!item.isShowSize ? '展开' : '收起'}}尺码</div>
              </div>
              <div v-if="index>0"
                style="font-size:12px;color:#E6A23C">注意,以下为一个{{item.name}}所需数量 (例:一个产品需要5个纽扣,配料单里每个纽扣需要1个纽扣,因此填1即可)</div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-if="item.isShowSize">
          <div class="colCtn">
            <div class="label">
              <span class="text">产品尺码：</span>
              <div class="selectBtnList">
                <div class="selectButton"
                  v-for="(itemSize,indexSize) in (item.colorInfo[item.colorIndex] ? item.colorInfo[item.colorIndex].sizeInfo : [])"
                  :key="itemSize.size_id"
                  :class="{'selected' : item.colorInfo[item.colorIndex].sizeIndex === indexSize,'success': item.colorInfo[item.colorIndex].sizeIndex !== indexSize && itemSize.materials.length > 0,'error': item.colorInfo[item.colorIndex].sizeIndex !== indexSize && itemSize.materials.length === 0}"
                  @click="item.colorInfo[item.colorIndex].sizeIndex = indexSize">{{itemSize.size_name}}</div>
              </div>
              <!-- <div v-if="index>0"
                style="font-size:12px;color:#E6A23C">注意,以下为一个{{item.name}}所需数量 (例:一个产品需要5个纽扣,配料单里每个纽扣需要1个纽扣,因此填1即可)</div> -->
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
                v-if="item.colorInfo.length > 0">
                <div class="trow"
                  v-for="(itemMa,indexMa) in (item.isShowSize ? item.colorInfo[item.colorIndex].sizeInfo[item.colorInfo[item.colorIndex].sizeIndex].materials :item.colorInfo[item.colorIndex].materials)"
                  :key="indexMa">
                  <div class="tcolumn">
                    <span class="inputs">
                      <el-autocomplete v-if="item.chooseMaterial===1"
                        v-model="itemMa.name"
                        :fetch-suggestions="searchYarn"
                        @select="selectMaterial($event,itemMa)"
                        @input="changeMaterialInfo(item)"
                        placeholder="请输入原料名称">
                      </el-autocomplete>
                      <el-autocomplete v-if="item.chooseMaterial===0"
                        v-model="itemMa.name"
                        :fetch-suggestions="searchMaterial"
                        placeholder="请输入辅料名称"
                        @select="selectMaterial($event,itemMa)"
                        @input="changeMaterialInfo(item)">
                      </el-autocomplete>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="inputs">
                      <!-- <el-input :placeholder="item.chooseMaterial===1?'请输入物料颜色':'请输入物料属性'"
                        v-model="itemMaterial.attr"></el-input> -->
                      <el-autocomplete v-model="itemMa.attr"
                        :fetch-suggestions="querySearch"
                        :placeholder="item.chooseMaterial===1?'请输入物料颜色':'请输入物料属性'"
                        @input="changeMaterialInfo(item)"></el-autocomplete>
                    </span>
                  </div>
                  <div class="tcolumn">
                    <span class="inputs">
                      <zh-input placeholder="请输入物料数量"
                        type="number"
                        v-model="itemMa.number"
                        @input="changeMaterialInfo(item)">
                      </zh-input>
                      <zh-input v-model="itemMa.unit"
                        class="unit"
                        placeholder="单位"
                        @input="changeMaterialInfo(item)"></zh-input>
                    </span>
                  </div>
                  <div class="tcolumn flexCenter">
                    <span class="opr"
                      @click="copyItem(item,itemMa)">复制</span>
                    <span class="opr"
                      @click="deleteMaterial(item,indexMa)">删除</span>
                  </div>
                </div>
              </div>
              <div class="addRow"
                @click="addMaterial(item)">+ 新增{{item.chooseMaterial===0?'辅料':'原料'}}</div>
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
import { product, sample, yarn, material, yarnColor, productPlan, pantongList } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      lock: true,
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
        name: '成衣信息',
        product_id: '',
        chooseMaterial: 1,
        colorInfo: [],
        colorIndex: 0,
        isShowSize: false
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
          str += item.component_name + ' / '
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
    addMaterial (item) {
      let unit = item.chooseMaterial === 1 ? 'g' : ''
      let materials = !item.isShowSize ? item.colorInfo[item.colorIndex].materials : item.colorInfo[item.colorIndex].sizeInfo[item.colorInfo[item.colorIndex].sizeIndex].materials
      materials.push({
        name: '',
        attr: '',
        number: '',
        unit: unit
      })
    },
    // 触发修改数据时
    changeMaterialInfo (item) {
      if (!item.isShowSize) {
        let materials = item.colorInfo[item.colorIndex].materials
        item.colorInfo[item.colorIndex].sizeInfo.forEach(itemSize => {
          itemSize.materials = this.$clone(materials)
        })
      }
    },
    // 复制行数据
    copyItem (item, itemMa) {
      let materials = !item.isShowSize ? item.colorInfo[item.colorIndex].materials : item.colorInfo[item.colorIndex].sizeInfo[item.colorInfo[item.colorIndex].sizeIndex].materials
      materials.push(this.$clone(itemMa))
    },
    deleteMaterial (item, indexMa) {
      this.$confirm('是否删除本列?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let materials = !item.isShowSize ? item.colorInfo[item.colorIndex].materials : item.colorInfo[item.colorIndex].sizeInfo[item.colorInfo[item.colorIndex].sizeIndex].materials
        materials.splice(indexMa, 1)
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
    shortcutOpr (item) {
      let filter = item.colorInfo.filter(itemF => itemF.materials.length > 0)
      if (filter.length > 0) {
        let standardData = filter[0]
        item.colorInfo.forEach(itemC => {
          if (itemC.color_id !== standardData.color_id) {
            itemC.materials = standardData.materials.map(itemMa => {
              return {
                name: itemMa.name,
                attr: '',
                number: itemMa.number,
                unit: itemMa.unit
              }
            })
            itemC.sizeInfo.forEach(itemS => {
              let flag = standardData.sizeInfo.find(itemF => itemF.size_id === itemS.size_id)
              if (flag) {
                itemS.materials = flag.materials.map(itemMa => {
                  return {
                    name: itemMa.name,
                    attr: '',
                    number: itemMa.number,
                    unit: itemMa.unit
                  }
                })
              } else {
                itemS.materials = standardData.materials.map(itemMa => {
                  return {
                    name: itemMa.name,
                    attr: '',
                    number: itemMa.number,
                    unit: itemMa.unit
                  }
                })
              }
            })
          }
        })
        this.$message.success('智能同步完成')
      } else {
        this.$message.warning('检测到没有可同步的数据')
      }
    },
    submit () {
      if (!this.lock) {
        this.$message.error('请勿重复点击')
        return
      }
      let formData = this.list.map((item, index) => {
        let materialInfo = []
        item.colorInfo.forEach(itemC => {
          itemC.sizeInfo.forEach(itemS => {
            itemS.materials.forEach(itemMa => {
              materialInfo.push({
                type: item.chooseMaterial === 1 ? 1 : 2,
                color_id: itemC.color_id,
                size_id: itemS.size_id,
                material_name: itemMa.name,
                material_attribute: itemMa.attr,
                weight: itemMa.number,
                unit: itemMa.unit
              })
            })
          })
        })
        return {
          part_type: index === 0 ? 1 : 2,
          id: null,
          product_id: item.product_id,
          product_type: this.$route.params.type,
          material_info: materialInfo
        }
      })
      let error = null
      formData.forEach((item) => {
        // if (item.material_info.length === 0) {
        //   error = '检测到有未填写物料的成衣/配件，请添加至少一种物料'
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
      this.lock = false
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
        this.lock = true
      })
    }
  },
  mounted () {
    let sampleOrProduct = this.$route.params.type === '1' ? product : sample
    Promise.all([
      sampleOrProduct.detail({
        id: this.$route.params.id
      }),
      yarn.list(),
      material.list(),
      yarnColor.list()
    ]).then((res) => {
      this.productInfo = res[0].data.data
      this.list[0].product_id = this.productInfo.id
      this.colorList = res[3].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.list[0].colorInfo = this.productInfo.color.map(itemColor => {
        return {
          color_id: itemColor.color_id,
          color_name: itemColor.color_name,
          sizeInfo: this.productInfo.size.map(itemSize => {
            return {
              size_name: itemSize.size_name,
              size_id: itemSize.size_id,
              materials: this.productInfo.component.map(itemC => { // 将产品里成分同步到每个色组尺码
                return {
                  name: itemC.component_name,
                  attr: '',
                  number: '',
                  unit: 'g'
                }
              })
            }
          }),
          sizeIndex: 0,
          materials: this.productInfo.component.map(itemC => { // 将产品里成分同步到每个色组尺码
            return {
              name: itemC.component_name,
              attr: '',
              number: '',
              unit: 'g'
            }
          })
        }
      })
      let part = this.productInfo.part_info || this.productInfo.part_data
      part.forEach((itemPart) => {
        let json = {
          name: itemPart.part_title || itemPart.name,
          product_id: itemPart.id,
          chooseMaterial: 0,
          colorInfo: [],
          colorIndex: 0,
          isShowSize: false
        }
        let colorInfo = this.$clone(this.list[0].colorInfo)
        colorInfo.forEach((item) => {
          item.sizeInfo.forEach(itemSize => {
            let finded = itemPart.size.find((itemFind) => itemFind.size_id === itemSize.size_id)
            itemSize.partNum = finded.number
            itemSize.materials = [{
              name: itemPart.part_title || itemPart.name,
              attr: item.color_name,
              number: 1,
              unit: itemPart.unit
            }]
          })
          item.materials = [{
            name: itemPart.part_title || itemPart.name,
            attr: item.color_name,
            number: 1,
            unit: itemPart.unit
          }]
        })
        json.colorInfo = colorInfo
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
