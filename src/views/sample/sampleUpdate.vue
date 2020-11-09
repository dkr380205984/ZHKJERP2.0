<template>
  <div id="sampleUpdate"
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
              <span class="text">样品编号
                <el-tooltip class="item"
                  effect="dark"
                  content="选填：未填写则使用系统默认生成编号"
                  placement="top-start">
                  <span class="el-icon-question"></span>
                </el-tooltip>
              </span>
            </div>
            <div class="content">
              <zh-input :placeholder="`${sampleCode}(默认)`"
                v-model="product_code">
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">样品名称</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入样品名称"
                v-model="name">
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">客户款号</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入客户款号"
                v-model="model_code">
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
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
              <span class="text">样品纱线</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入纱线信息">
              </el-autocomplete>
            </div>
            <div class="editBtn"
              :class="{'addBtn':index===0,'deleteBtn':index>0}"
              @click="index===0?addIngredient():deleteIngredient(index)">{{index===0?'添加':'删除'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">样品规格</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content"
              style="height:auto">
              <div class="tableCtn">
                <div class="line">
                  <div class="once">
                    <div class="biaotou rightTop">规格</div>
                    <div class="xiexian"></div>
                    <div class="biaotou leftBottom">部位</div>
                  </div>
                  <div class="once"
                    v-for="(item,index) in size"
                    :key="index">
                    <el-select v-model="item.size"
                      filterable
                      @change="selectSize(item)"
                      placeholder="选规格">
                      <el-option v-for="(item,index) in sizeArr"
                        :key="index"
                        :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </div>
                  <div class="once">
                    <span style="color:#1a95ff;cursor:pointer"
                      @click="addSize">新增</span>
                    <span style="margin:0 5px;color:#e9e9e9;vertical-align: 1px;">|</span>
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteSize">删除</span>
                  </div>
                </div>
                <div class="line"
                  v-for="(item,index) in sizePartArr"
                  :key="index">
                  <div class="once">
                    <el-input v-model="item.part"
                      placeholder="部位名称"></el-input>
                  </div>
                  <div class="once"
                    v-for="(itemNum,indexNum) in item.size"
                    :key="indexNum">
                    <el-input placeholder="部位信息"
                      v-model="itemNum.number"></el-input>
                  </div>
                  <div class="once"></div>
                </div>
                <div class="line">
                  <div class="once">
                    <span style="color:#1a95ff;cursor:pointer"
                      @click="addPart">新增</span>
                    <span style="margin:0 5px;color:#e9e9e9;vertical-align: 1px;">|</span>
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deletePart">删除</span>
                  </div>
                  <div class="once"
                    v-for="(item,index) in size"
                    :key="index"></div>
                  <div class="once"></div>
                </div>
                <div class="line">
                  <div class="once">
                    总克重
                  </div>
                  <div class="once"
                    v-for="(item,index) in size"
                    :key="index">
                    <el-input v-model="item.total"
                      placeholder="输入克重"></el-input>
                  </div>
                  <div class="once"></div>
                </div>
              </div>
            </div>
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
                @select='changeColor(item)'
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
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :on-success="successFile"
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
import { productType, flower, yarn, colour, getToken, material, sample } from '@/assets/js/api.js'
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
      model_code: '',
      // 配件类型从辅料里面选
      materialArr: [],
      needleType: '',
      sizePartArr: []
    }
  },
  methods: {
    selectSize (item) {
      let filterList = this.size.filter(itemF => itemF.size === item.size)
      if (filterList.length > 1) {
        this.$message.warning('请勿选择重复的尺码信息')
        item.size = ''
      }
    },
    changeColor (item) {
      let filterList = this.colour.filter(itemF => itemF.colour === item.colour)
      if (filterList.length > 1) {
        this.$message.warning('请勿输入重复的配色信息')
        item.colour = ''
      }
    },
    getUnit (ev, item) {
      item.unit = ev.unit
    },
    addIngredient () {
      this.ingredient.push({ ingredient_name: '', ingredient_value: '' })
    },
    deleteIngredient (index) {
      this.ingredient.splice(index, 1)
    },
    addSize () {
      this.size.push({ size: '', total: '' })
      this.sizePartArr.forEach((item) => {
        item.size.push({
          number: ''
        })
      })
    },
    deleteSize () {
      if (this.size.length === 1) {
        this.$message.error('至少有一种规格')
        return
      }
      this.size.pop()
      this.sizePartArr.forEach((item) => {
        item.size.pop()
      })
    },
    addPart () {
      this.sizePartArr.push({
        part: '',
        size: this.size.map((item) => {
          return {
            number: ''
          }
        })
      })
    },
    deletePart (index) {
      if (this.sizePartArr.length === 1) {
        this.$message.error('至少有一个部位')
        return
      }
      this.sizePartArr.pop()
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
    successFile (response, file, fileList) {
      this.addArr.push('https://zhihui.tlkrzf.com/' + response.key)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
    },
    submit () {
      if (this.$submitLock()) return
      let error = false
      if (this.type.length <= 0) {
        this.$message.error('请选择样品品类')
        return
      }
      if (!this.flower) {
        this.$message.error('请选择样品花型')
        return
      }
      error = this.size.some((item) => {
        return !item.size
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
      // const imgArr = this.$refs.uploada.uploadFiles.map((item) => { return (item.response ? 'https://zhihui.tlkrzf.com/' + item.response.key : item.url) })
      let formData = {
        id: this.$route.params.id,
        sample_product_code: this.product_code || this.sample_code.join(''),
        is_user_input: this.product_code ? 1 : 0,
        style_code: this.model_code,
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
            color_id: item.color_id || null,
            color_name: item.colour
          }
        }),
        data_component: this.ingredient.map(item => { return { component_name: item.ingredient_name, number: item.ingredient_value } }),
        data_size: this.size.map((item, index) => {
          return {
            size_id: item.size_id || null,
            weight: item.total,
            size_name: item.size,
            size_info: item.desc,
            part_info: JSON.stringify(this.sizePartArr.map((item) => {
              return {
                part: item.part,
                size: item.size[index].number
              }
            }))
          }
        })
      }
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
  mounted () {
    Promise.all([
      productType.list(),
      flower.list(),
      yarn.list(),
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
          id: item.id,
          url: item.image_url
        }
      })
      this.size = productInfo.size.map(item => {
        return {
          size_id: item.size_id || null,
          size: item.size_name,
          total: item.weight
        }
      })
      productInfo.size.forEach((itemSize, indexSize) => {
        if (itemSize.part_info) {
          JSON.parse(itemSize.part_info).forEach((itemPart, indexPart) => {
            if (!this.sizePartArr[indexPart]) {
              this.sizePartArr[indexPart] = {
                part: '',
                size: []
              }
            }
            this.sizePartArr[indexPart].part = itemPart.part
            this.sizePartArr[indexPart].size.push({ number: itemPart.size })
          })
        }
      })
      this.product_code = productInfo.product_code
      this.colour = productInfo.color.map(item => {
        return {
          colour: item.color_name,
          color_id: item.color_id || null
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
      this.model_code = productInfo.style_code
      this.needleType = productInfo.needle_type
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/sample/sampleUpdate.less";
</style>
