<template>
  <div id="productUpdate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
        <span class="productCode">{{sample_product_code}}</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">名称/款号</span>
            </div>
            <div class="content">
              <zh-input errorMsg="样品名称不能超过10个字"
                placeholder="请输入样品名称或款号"
                maxLength="10"
                v-model="name">
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">样品品类</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-cascader v-model="type"
                placeholder="请选择样品品类"
                :options="typeArr">
              </el-cascader>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">样品花型</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select placeholder="请选择样品花型"
                v-model="flower">
                <el-option v-for="(item,index) in flowerArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">针型名称</span>
            </div>
            <div class="content">
              <zh-input errorMsg="针型名称不能超过5个字"
                placeholder="请输入针型名称"
                maxLength="5"
                v-model="needleType">
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in ingredient"
          :key="'ingredient' + index">
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
              <span class="text">样品成分</span>
              <!-- <span class="explanation">(必填,成分比例相加为100%)</span> -->
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入成分信息">
              </el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
            </div>
            <div class="content">
              <zh-input type="number"
                placeholder="请输入比例"
                v-model="item.ingredient_value">
                <template slot="append">%</template>
              </zh-input>
            </div>
            <div class="editBtn"
              :class="{'addBtn':index===0,'deleteBtn':index>0}"
              @click="index===0?addIngredient():deleteIngredient(index)">{{index===0?'添加':'删除'}}</div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in size"
          :key="'size'+ index">
          <div class="colCtn">
            <div class="label"
              v-show="index===0">
              <span class="text">样品规格</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="item.size"
                placeholder="请选择样品规格">
                <el-option v-for="(item,index) in sizeArr"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn">
            <div class="label"
              v-show="index===0">
            </div>
            <div class="content">
              <zh-input type="number"
                placeholder="请输入克重信息"
                v-model="item.weight">
                <template slot="append">g</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label"
              v-show="index===0">
            </div>
            <div class="content">
              <zh-input placeholder="请输入尺寸信息"
                v-model="item.desc">
                <template slot="append">cm</template>
              </zh-input>
            </div>
            <div class="editBtn"
              :class="{'addBtn':index===0,'deleteBtn':index>0}"
              @click="index===0?addSize():deleteSize(index)">{{index===0?'添加':'删除'}}</div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in colour"
          :key="'colour'+index">
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
              <span class="text">样品配色</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.colour"
                :fetch-suggestions="searchColour"
                placeholder="请输入配色信息">
              </el-autocomplete>
            </div>
            <div class="editBtn"
              :class="{'addBtn':index===0,'deleteBtn':index>0}"
              @click="index===0?addColour():deleteColour(index)">{{index===0?'添加':'删除'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">配件信息</span>
        <el-switch class="atTitle"
          style="margin-bottom:3px"
          v-model="hasFitting"
          active-color="#1A95FF"
          inactive-color="#dcdfe6">
        </el-switch>
      </div>
      <div v-show="hasFitting"
        class="editCtn hasBorderTop"
        v-for="(item,index) in fittingInfo"
        :key="index">
        <div class="titleNum">配件{{chinaNum[index]}}</div>
        <div class="deleteIcon el-icon-close"
          @click="deleteFitting(index,item.part_id)"></div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">配件名称</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-autocomplete class="inline-input"
                v-model="item.fitting_name"
                @select="getUnit($event,item)"
                :fetch-suggestions="searchMaterial"
                placeholder="请输入配件名称">
              </el-autocomplete>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">配件单位</span>
              <span class="explanation">(必填,默认是个)</span>
            </span>
            <span class="content">
              <el-input class="inline-input"
                v-model="item.unit"
                placeholder="请输入单位"></el-input>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemIngredient,indexIngredient) in item.ingredient"
          :key="'ingredient' + indexIngredient">
          <div class="colCtn flex3">
            <div class="label"
              v-show="indexIngredient===0">
              <span class="text">样品成分</span>
              <!-- <span class="explanation">(必填,成分比例相加为100%)</span> -->
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="itemIngredient.ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入成分信息">
              </el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label"
              v-show="indexIngredient===0">
            </div>
            <div class="content">
              <zh-input type="number"
                placeholder="请输入比例"
                v-model="itemIngredient.ingredient_value">
                <template slot="append">%</template>
              </zh-input>
            </div>
            <div class="editBtn"
              :class="{'addBtn':indexIngredient===0,'deleteBtn':indexIngredient>0}"
              @click="indexIngredient===0?addFittingIngredient(index):deleteFittingIngredient(index,indexIngredient)">{{indexIngredient===0?'添加':'删除'}}</div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemSize,indexSize) in item.size"
          :key="'size'+indexSize">
          <div class="colCtn">
            <span class="label"
              v-show="indexSize === 0">
              <span class="text">配件规格</span>
              <span class="explanation">(配件个数必填,不填默认为1个)</span>
            </span>
            <span class="content">
              <el-select v-model="itemSize.size"
                disabled
                placeholder="请选择样品规格">
                <el-option v-for="item in sizeArr"
                  :key="item.value"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-show="indexSize === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="itemSize.weight"
                type="number"
                placeholder="请输入克重">
                <template slot="append">g</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-show="indexSize === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="itemSize.desc"
                placeholder="请输入尺寸信息">
                <template slot="append">cm</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn">
            <div class="label"
              v-show="indexSize === 0">
              <span class="text"></span>
            </div>
            <div class="content">
              <zh-input v-model="itemSize.number"
                placeholder="请输入数量信息">
                <template slot="append">
                  <span>{{item.unit}}</span>
                </template>
              </zh-input>
            </div>
          </div>
        </div>
      </div>
      <div v-show="hasFitting"
        class="btn btnWhiteBlue add_fitting_btn"
        @click="addFitting">添加配件</div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">样品图片</span>
            </div>
            <div class="content autoHeight">
              <el-upload class="upload"
                :on-success="successFile"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                ref="uploada"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="content autoHeight">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="desc"
                placeholder="请输入备注信息"></el-input>
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
import { productType, flower, ingredient, colour, getToken, material, sample } from '@/assets/js/api.js'
export default {
  data () {
    return {
      addArr: [],
      deleteArr: [],
      lock: true,
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      sample_product_code: '',
      chinaNum: chinaNum,
      name: '',
      type: [],
      typeArr: [],
      flower: '',
      flowerArr: [],
      ingredientArr: [],
      ingredient: [{
        ingredient_name: '',
        ingredient_value: 100
      }],
      size: [{
        size: '',
        weight: '',
        desc: ''
      }],
      sizeArr: [],
      colour: [{ colour: '' }],
      colourArr: [],
      desc: '',
      postData: { token: '' },
      fileArr: [],
      hasFitting: false,
      fittingInfo: [{
        fitting_name: '',
        ingredient: [{
          ingredient_name: '',
          ingredient_value: ''
        }],
        size: [{ size: '', weight: '', desc: '', number: '1' }],
        unit: '个'
      }],
      // 配件类型从辅料里面选
      materialArr: [],
      needleType: ''
    }
  },
  methods: {
    addFitting () {
      this.fittingInfo.push({
        fitting_name: '',
        type: [],
        ingredient: [{
          ingredient_name: '',
          ingredient_value: ''
        }],
        size: this.size.map((itemPro) => {
          return {
            size: itemPro.size,
            weight: '',
            desc: '',
            number: '1'
          }
        }),
        unit: '个'
      })
    },
    deleteFitting (index, id) {
      this.$confirm('此操作将删除该配件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          sample.delete({
            id: id
          }).then((res) => {
            if (res.data.status) {
              this.fittingInfo.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        } else {
          this.fittingInfo.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addFittingIngredient (index) {
      this.fittingInfo[index].ingredient.push({ ingredient_name: '', ingredient_value: '' })
    },
    deleteFittingIngredient (index, indexIngredient) {
      this.fittingInfo[index].ingredient.splice(indexIngredient, 1)
    },
    addIngredient () {
      this.ingredient.push({ ingredient_name: '', ingredient_value: '' })
    },
    deleteIngredient (index) {
      this.ingredient.splice(index, 1)
    },
    addSize () {
      this.size.push({ size: '', weight: '', desc: '', number: '1' })
    },
    deleteSize (index) {
      this.size.splice(index, 1)
    },
    addColour () {
      this.colour.push({ colour: '' })
    },
    deleteColour (index) {
      this.colour.splice(index, 1)
    },
    searchIngredient (queryString, cb) {
      let result = queryString ? this.ingredientArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.ingredientArr
      cb(result)
    },
    searchColour (queryString, cb) {
      let result = queryString ? this.colourArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colourArr
      cb(result)
    },
    searchMaterial (queryString, cb) {
      let result = queryString ? this.materialArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.materialArr
      cb(result)
    },
    successFile (response, file, fileList) {
      this.addArr.push('https://zhihui.tlkrzf.com/' + response.key)
    },
    beforeAvatarUpload (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 6MB!')
        return false
      }
    },
    beforeRemove (file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteArr.push({
          id: file.id ? file.id : null,
          file_name: file.response ? file.response.key : file.url.split('https://zhihui.tlkrzf.com/')[1]
        })
        let deleteIndex = 0
        fileList.forEach((item, index) => {
          if (file.response) {
            if (item.response && (item.response.key === file.response.key)) {
              deleteIndex = index
            }
          } else {
            if (item.url === file.url) {
              deleteIndex = index
            }
          }
        })
        fileList.splice(deleteIndex, 1)
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // deleteFile({
        //   id: file.id ? file.id : null,
        //   file_name: file.response ? file.response.key : file.url.split('https://zhihui.tlkrzf.com/')[1]
        // }).then((res) => {
        //   if (res.data.status) {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        // let deleteIndex = 0
        // fileList.forEach((item, index) => {
        //   if (file.response) {
        //     if (item.response && (item.response.key === file.response.key)) {
        //       deleteIndex = index
        //     }
        //   } else {
        //     if (item.url === file.url) {
        //       deleteIndex = index
        //     }
        //   }
        // })
        // fileList.splice(deleteIndex, 1)
        //   }
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
    },
    getUnit (ev, item) {
      item.unit = ev.unit
    },
    submit () {
      if (!this.lock) {
        this.$message.warning('请勿频繁点击')
        return
      }
      let error = false
      if (this.type.length <= 0) {
        this.$message.error('请选择样品品类')
        return
      }
      if (!this.flower) {
        this.$message.error('请选择样品花型')
        return
      }
      // error = this.ingredient.some((item) => {
      //   return !item.ingredient_name || !item.ingredient_value
      // })
      // if (error) {
      //   this.$message.error('请将样品成分信息填写完整')
      //   return
      // }
      // let arr = this.ingredient.map(item => {
      //   return item.ingredient_value
      // })
      // let total = arr.reduce((total, item) => {
      //   return Number(total) + Number(item)
      // })
      // if (Number(total) !== 100) {
      //   this.$message.error('样品成分比例总和不等于100%，请检查比例')
      //   return
      // }
      error = this.size.some((item) => {
        return !item.size || !item.weight || !item.desc
      })
      if (error) {
        this.$message.error('请将样品规格信息填写完整')
        return
      }
      this.size.forEach((item, index) => {
        this.size.forEach((itemFind, indexFind) => {
          if (indexFind !== index && item.size === itemFind.size) {
            error = true
          }
        })
      })
      if (error) {
        this.$message.error('请不要选择重复的尺码信息')
        return
      }
      error = this.colour.some((item) => !item.colour)
      if (error) {
        this.$message.error('请将样品配色信息填写完整')
      }
      error = this.colour.some((item) => item.colour.search('/') !== -1)
      if (error) {
        this.$message.error('配色信息里面不得包含斜杠字符')
        return
      }
      // error = this.colour.some((item) => item.colour.length > 8)
      // if (error) {
      //   this.$message.error('配色信息长度不得超过8个字符')
      //   return
      // }
      if (this.hasFitting) {
        error = this.fittingInfo.some((item) => !item.fitting_name)
      }
      if (error) {
        this.$message.error('请输入配件名称')
        return
      }

      let partData = this.fittingInfo.map((item) => {
        return {
          part_id: item.part_id ? item.part_id : '',
          name: item.fitting_name,
          part_category: '',
          unit: item.unit,
          // part_color: this.colour.map((item) => {
          //   return { color_name: item.colour }
          // }),
          data_size: item.size.map((itemSize) => {
            return {
              size_id: itemSize.self_id || null,
              weight: itemSize.weight,
              size_name: itemSize.size,
              size_info: itemSize.desc,
              number: itemSize.number
            }
          }),
          data_component: item.ingredient.map(item => { return { component_name: item.ingredient_name, number: item.ingredient_value } })
        }
      })
      // const imgArr = this.$refs.uploada.uploadFiles.map((item) => { return (item.response ? 'https://zhihui.tlkrzf.com/' + item.response.key : item.url) })
      let formData = {
        id: this.$route.params.id,
        sample_product_code: this.sample_product_code,
        name: this.name,
        category_id: this.type[0],
        type_id: this.type[1],
        style_id: this.type[2],
        flower_id: this.flower,
        needle_type: this.needleType,
        description: this.desc,
        data_image: {
          file_data: this.addArr,
          delete_data: this.deleteArr
        },
        data_color: this.colour.map((item) => {
          return {
            color_name: item.colour,
            color_id: item.color_id || null
          }
        }),
        data_component: this.ingredient.map(item => { return { component_name: item.ingredient_name, number: item.ingredient_value } }),
        data_size: this.size.map(item => {
          return {
            size_id: item.size_id || null,
            weight: item.weight,
            size_name: item.size,
            size_info: item.desc
          }
        }),
        part_data: this.hasFitting ? partData : []
      }
      this.lock = false
      sample.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/sample/sampleDetail/' + this.$route.params.id
            this.msgContent = '<span style="color:#E6A23C">修改</span>了一个样品<span style="color:#1A95FF">' + res.data.data.sample_product_code + '</span>(' + res.data.data.category_name + '/' + res.data.data.type_name + '/' + res.data.data.style_name + '/' + res.data.data.flower_name + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/sample/sampleDetail/' + this.$route.params.id)
          }
        }
      })
    }
  },
  watch: {
    size: {
      deep: true,
      handler: function (newVal) {
        this.fittingInfo.forEach((item) => {
          let size = this.size.map((itemPro, indexPro) => {
            let flag = item.size.find(itemPS => itemPS.size_id && itemPS.size_id === itemPro.size_id)
            if (flag) {
              return {
                size_id: flag.size_id,
                self_id: flag.self_id || null,
                size: itemPro.size,
                weight: flag.weight || '',
                desc: flag.desc || '',
                number: flag.number
              }
            } else {
              return {
                size_id: itemPro.size_id || null,
                self_id: null,
                size: itemPro.size,
                weight: item.size[indexPro] ? item.size[indexPro].weight : '',
                desc: item.size[indexPro] ? item.size[indexPro].desc : '',
                number: item.size[indexPro] ? item.size[indexPro].number : ''
              }
            }
          })
          item.size = size
        })
      }
    }
  },
  mounted () {
    Promise.all([
      productType.list(),
      flower.list(),
      ingredient.list(),
      colour.list(),
      getToken(),
      material.list(),
      sample.editDetail({
        id: this.$route.params.id
      })
    ]).then((res) => {
      this.typeArr = res[0].data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
          sizeArr: item.sizeArr,
          child_size: item.child_size,
          children: item.child.length === 0 ? null : item.child.map((item) => {
            return {
              value: item.id,
              label: item.name,
              children: item.child.length === 0 ? null : item.child.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }
          })
        }
      })
      this.flowerArr = res[1].data.data
      this.ingredientArr = res[2].data.data
      this.ingredientArr.forEach((item) => {
        item.value = item.name
      })
      this.colourArr = res[3].data.data
      this.colourArr.forEach((item) => {
        item.value = item.name
      })
      this.postData.token = res[4].data.data
      this.materialArr = res[5].data.data
      this.materialArr.forEach((item) => {
        item.value = item.name
      })
      let productInfo = res[6].data.data
      this.sample_product_code = productInfo.product_code
      this.sampleName = productInfo.name
      this.fileArr = productInfo.image.map(item => {
        return {
          url: item.image_url
        }
      })
      this.size = productInfo.size.map(item => {
        return {
          size_id: item.size_id || null,
          size: item.size_name,
          desc: item.size_info,
          weight: item.weight
        }
      })
      this.product_code = productInfo.product_code
      this.colour = productInfo.color.map(item => {
        return {
          color_id: item.color_id || null,
          colour: item.color_name
        }
      })
      this.name = productInfo.name
      this.type = [productInfo.category_id.toString(), productInfo.type_id.toString(), productInfo.style_id.toString()]
      this.sizeArr = this.typeArr.find(item => item.value === this.type[0]).child_size
      this.flower = productInfo.flower_id
      this.ingredient = productInfo.component.map((item) => {
        return {
          ingredient_name: item.component_name,
          ingredient_value: item.number
        }
      })
      this.hasFitting = productInfo.part_data.length > 0
      this.fittingInfo = productInfo.part_data.map((item) => {
        return {
          part_id: item.id,
          fitting_name: item.name,
          ingredient: item.component.map((item) => {
            return {
              ingredient_name: item.component_name,
              ingredient_value: item.number
            }
          }),
          size: item.size.map((itemSize) => {
            return {
              self_id: itemSize.self_id || null,
              size_id: itemSize.size_id || null,
              size: itemSize.size_name,
              weight: itemSize.weight,
              desc: itemSize.size_info,
              number: itemSize.number
            }
          }),
          unit: item.unit
        }
      })
      this.needleType = productInfo.needle_type
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productUpdate.less";
</style>
