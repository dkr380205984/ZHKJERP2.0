<template>
  <div id="productUpdate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn"
        style="display:flex;align-items:center;justify-content: space-between;">
        <span class="title">
          基本信息
          <span class="productCode">{{productCode}}</span>
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent">
          </zh-message>
        </span>
        <el-autocomplete v-model="importKeyword"
          style="width:200px;height:32px"
          :fetch-suggestions="querySearchProduct"
          placeholder="输入产品编号导入产品"
          :trigger-on-focus="false"
          @select="importPorduct"></el-autocomplete>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">名称/款号</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入产品名称或款号"
                v-model="name">
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">产品品类</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-cascader v-model="type"
                placeholder="请选择产品品类"
                :options="typeArr">
              </el-cascader>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">产品花型</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select placeholder="请选择产品花型"
                filterable
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
              <span class="text">产品纱线</span>
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
          <!-- <div class="colCtn flex3">
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
          </div> -->
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">产品规格</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select style="width:360px"
                placeholder="可选择常用衣服类型"
                filterable
                v-model="part"
                @change="getPart">
                <el-option v-for="(item,index) in partArr"
                  :key="index"
                  :label="item.name"
                  :value="item.part_info">
                </el-option>
              </el-select>
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
              <span class="text">产品配色</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.colour"
                :fetch-suggestions="searchColour"
                @select="changeColor(item)"
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
              <span class="text">产品图片</span>
            </div>
            <div class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :on-success="successFile"
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
            @click="submit">添加</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum, letterArr } from '@/assets/js/dictionary.js'
import { productType, flower, yarn, colour, getToken, product, productPart } from '@/assets/js/api.js'
export default {
  data () {
    return {
      addArr: [],
      deleteArr: [],
      loading: true,
      msgSwitch: false,
      letterArr: letterArr,
      msgUrl: '',
      msgContent: '',
      product_code: ['C', '00', 'X', 'X', 'X', '00'],
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
      // 配件类型从辅料里面选
      needleType: '',
      importKeyword: '',
      sizePartArr: [{
        type: '',
        size: [{ number: '' }]
      }],
      partArr: [],
      part: ''
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
        this.$message.error('图片大小不能超过 10MB!')
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
      let error = false
      if (this.type.length <= 0) {
        this.$message.error('请选择产品品类')
        return
      }
      if (!this.flower) {
        this.$message.error('请选择产品花型')
        return
      }
      error = this.size.some((item) => {
        return !item.size
      })
      if (error) {
        this.$message.error('请将产品规格信息填写完整')
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
        this.$message.error('请将产品配色信息填写完整')
        return
      }
      error = this.colour.some((item) => item.colour.search('/') !== -1)
      if (error) {
        this.$message.error('配色信息里面不得包含斜杠字符')
        return
      }
      let formData = {
        product_code: this.product_code.join(''),
        name: this.name,
        category_id: this.type[0],
        type_id: this.type[1],
        style_id: this.type[2],
        type: 1,
        flower_id: this.flower,
        needle_type: this.needleType,
        description: this.desc,
        image: {
          file_data: this.addArr,
          delete_data: this.deleteArr
        },
        color: this.colour.map((item) => {
          return {
            color_name: item.colour,
            color_id: null
          }
        }),
        component: this.ingredient.map((item) => {
          return {
            component_name: item.ingredient_name,
            number: item.ingredient_value
          }
        }),
        size: this.size.map((item, index) => {
          return {
            size_id: null,
            weight: item.total,
            size_name: item.size,
            size_info: null,
            part_info: JSON.stringify(this.sizePartArr.map((item) => {
              return {
                part: item.part,
                size: item.size[index].number
              }
            }))
          }
        })
      }
      product.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/product/productDetail/' + res.data.data.id
            this.msgContent = '<span style="color:#E6A23C">添加</span>了一个产品<span style="color:#1A95FF">' + res.data.data.product_code + '</span>(' + res.data.data.category_info.product_category + '/' + res.data.data.type_name + '/' + res.data.data.style_name + '/' + res.data.data.flower_id + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/product/productDetail/' + res.data.data.id)
          }
        }
      })
    },
    querySearchProduct (queryString, cb) {
      product.list({
        product_code: queryString,
        page: 1,
        limit: 9999
      }).then(res => {
        if (res.data.status !== false) {
          cb(res.data.data.map(item => {
            return {
              value: item.product_code,
              id: item.id
            }
          }))
        }
      })
    },
    importPorduct (eve) {
      this.sizePartArr = []
      this.loading = true
      product.detail({
        id: eve.id
      }).then(res => {
        if (res.data.status !== false) {
          let productInfo = res.data.data
          this.name = productInfo.name
          this.fileArr = productInfo.image.map(item => {
            return {
              id: item.id,
              url: item.image_url
            }
          })
          this.size = productInfo.size.map(item => {
            return {
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
          this.colour = productInfo.color.map(item => {
            return {
              colour: item.color_name
            }
          })
          this.type = [productInfo.category_id.toString(), productInfo.type_id.toString(), productInfo.style_id.toString()]
          this.sizeArr = this.typeArr.find(item => item.value === this.type[0]).child_size
          this.flower = productInfo.flower_id_new
          this.ingredient = productInfo.component.map((item) => {
            return {
              ingredient_name: item.component_name,
              ingredient_value: item.number
            }
          })
          this.needleType = productInfo.needle_type
          this.loading = false
        }
      })
    },
    getPart (part) {
      if (this.sizePartArr.length > 1) {
        this.$confirm('此操作将重置已填写的信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sizePartArr = []
          JSON.parse(part).forEach((item) => {
            this.sizePartArr.push({
              part: item.value,
              size: this.size.map((item) => {
                return {
                  number: ''
                }
              })
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.sizePartArr = []
        JSON.parse(part).forEach((item) => {
          this.sizePartArr.push({
            part: item.value,
            size: this.size.map((item) => {
              return {
                number: ''
              }
            })
          })
        })
      }
    }
  },
  watch: {
    type (newVal) {
      this.product_code[2] = 'X'
      this.product_code[3] = 'X'
      this.product_code[4] = 'X'
      if (newVal.length !== 0) {
        const obj = this.typeArr.find((item) => item.value === newVal[0])
        this.sizeArr = obj.child_size
        this.child_size = obj.sizeArr
      }
      this.typeArr.forEach((item, index) => {
        if (item.value === newVal[0]) {
          this.$set(this.product_code, 2, letterArr[index])
        }
        if (item.children) {
          item.children.forEach((item2, index2) => {
            if (item2.value === newVal[1]) {
              this.$set(this.product_code, 3, letterArr[index2])
            }
            if (item2.children) {
              item2.children.forEach((item3, index3) => {
                if (item3.value === newVal[2]) {
                  this.$set(this.product_code, 4, letterArr[index3])
                }
              })
            }
          })
        }
      })
    },
    flower (newVal) {
      this.flowerArr.forEach((item, index) => {
        if (item.id === newVal) {
          let code = index + 1
          if (code < 10) {
            code = '0' + code
          }
          this.$set(this.product_code, 5, code)
        }
      })
    }
  },
  mounted () {
    this.product_code[1] = new Date().getFullYear().toString().substring(2, 4)
    Promise.all([
      productType.list(),
      flower.list(),
      yarn.list(),
      colour.list(),
      getToken(),
      productPart.list()
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
      this.partArr = res[5].data.data
      if (this.$route.query.productId) {
        this.importPorduct({ id: this.$route.query.productId })
      }
      this.loading = false
    })
  },
  computed: {
    productCode () {
      return this.product_code.join('')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productUpdate.less";
</style>
