<template>
  <div id="sampleCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">大身信息</span>
        <span class="content">{{product_code_cmp}}</span>
      </div>
      <div class="editCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">样品名称</span>
              <span class="explanation">(选填)</span>
            </span>
            <span class="content">
              <zh-input v-model="sampleName"
                placeholder="请填写样品名称"></zh-input>
            </span>
          </div>
          <div class="colCtn">
            <span class="label">
              <span class="text">样品分类</span>
            </span>
            <span class="content">
              <el-cascader v-model="types"
                placeholder="请选择样品分类"
                :options="treeData"
                :props="{ expandTrigger: 'hover' }">
              </el-cascader>
            </span>
          </div>
          <div class="colCtn">
            <span class="label">
              <span class="text">样品花型</span>
            </span>
            <span class="content">
              <el-select v-model="flower"
                placeholder="请选择样品花型">
                <el-option v-for="item in flowerArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemIngred,indIngred) in ingredient"
          :key="indIngred + 'ingredient'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="indIngred === 0">
              <span class="text">样品成分</span>
            </span>
            <span class="content">
              <el-autocomplete class="inline-input"
                v-model="itemIngred.ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入样品成分">
              </el-autocomplete>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="indIngred === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字,并保证成分总值为100%!"
                placeholder="请输入成分百分比"
                v-model="itemIngred.ingredient_value">
                <template slot="append">
                  <span>%</span>
                </template>
              </zh-input>
            </span>
            <div class="editBtn addBtn"
              v-if="indIngred === 0"
              @click="addIngredient(ingredient)">添加</div>
            <div class="editBtn deleteBtn"
              v-else
              @click="deleteIngredient(ingredient,indIngred)">删除</div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemSize,indSize) in size"
          :key="indSize +'size'">
          <div class="colCtn">
            <span class="label"
              v-if="indSize === 0">
              <span class="text">样品规格</span>
            </span>
            <span class="content">
              <el-select v-model="itemSize.size"
                placeholder="请选择规格">
                <el-option v-for="item in sizeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-if="indSize === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="itemSize.weight"
                type="number"
                placeholder="请输入克重">
                <template slot="append">
                  <span>g</span>
                </template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-if="indSize === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="itemSize.desc"
                placeholder="请输入尺寸信息">
                <template slot="append">
                  <span>cm</span>
                </template>
              </zh-input>
            </span>
            <div class="editBtn addBtn"
              v-if="indSize === 0"
              @click="addSize(size)">添加</div>
            <div class="editBtn deleteBtn"
              v-else
              @click="deleteSize(size,indSize)">删除</div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemColor,indColor) in color"
          :key="indColor + 'color'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="indColor === 0">
              <span class="text">样品配色组</span>
            </span>
            <span class="content">
              <el-autocomplete class="inline-input"
                v-model="itemColor.color"
                :fetch-suggestions="searchColor"
                placeholder="请输入配色信息">
              </el-autocomplete>
            </span>
            <div class="editBtn addBtn"
              v-if="indColor === 0"
              @click="addColour(color,false)">添加</div>
            <div class="editBtn deleteBtn"
              v-else
              @click="deleteColour(color,indColor)">删除</div>
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
      <template v-if="hasFitting">
        <div class="editCtn"
          v-for="(itemFitting,indFitting) in fittingInfo"
          :key="indFitting">
          <span class="titleNum">配件{{chinaNum[indFitting]}}</span>
          <span class="deleteIcon el-icon-close"
            @click="deleteFitting(indFitting)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <span class="label">
                <span class="text">配件名称</span>
              </span>
              <span class="content">
                <zh-input placeholder="请输入配件名称"
                  v-model="itemFitting.fitting_name" />
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label">
                <span class="text">配件分类</span>
              </span>
              <span class="content">
                <el-cascader v-model="itemFitting.type"
                  placeholder="请选择配件分类"
                  :options="treeData"
                  :props="{ expandTrigger: 'hover' }">
                </el-cascader>
              </span>
            </div>
          </div>
          <div class="rowCtn"
            v-for="(itemColor,indColor) in itemFitting.color"
            :key="indColor + 'color'">
            <div class="colCtn flex3">
              <span class="label"
                v-if="indColor === 0">
                <span class="text">配件色组</span>
              </span>
              <span class="content">
                <el-autocomplete class="inline-input"
                  v-model="itemColor.color"
                  :fetch-suggestions="searchIngredient"
                  placeholder="请选择对应色组">
                </el-autocomplete>
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label"
                v-if="indColor === 0">
                <span class="text">配件数量</span>
              </span>
              <span class="content">
                <zh-input type="number"
                  errorPosition="bottom"
                  errorMsg="请输入数字"
                  placeholder="请输入配件数量"
                  v-model="itemColor.fitting_number">
                  <template slot="append">
                    <span>个</span>
                  </template>
                </zh-input>
              </span>
              <div class="editBtn addBtn"
                v-if="indColor === 0"
                @click="addColour(itemFitting.color,true)">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteColour(itemFitting.color,indColor)">删除</div>
            </div>
          </div>
          <div class="rowCtn"
            v-for="(itemIngred,indIngred) in itemFitting.ingredient"
            :key="indIngred + 'ingred'">
            <div class="colCtn flex3">
              <span class="label"
                v-if="indIngred === 0">
                <span class="text">配件成分</span>
                <span class="explanation">(选填)</span>
              </span>
              <span class="content">
                <el-autocomplete class="inline-input"
                  v-model="itemIngred.ingredient_name"
                  :fetch-suggestions="searchIngredient"
                  placeholder="请选择成分">
                </el-autocomplete>
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label"
                v-if="indIngred === 0">
                <span class="text"></span>
              </span>
              <span class="content">
                <zh-input type="number"
                  errorPosition="bottom"
                  errorMsg="请输入数字,并保证成分总值为100%!"
                  placeholder="请输入成分百分比"
                  v-model="itemIngred.ingredient_value">
                  <template slot="append">
                    <span>%</span>
                  </template>
                </zh-input>
              </span>
              <div class="editBtn addBtn"
                v-if="indIngred === 0"
                @click="addIngredient(itemFitting.ingredient)">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteIngredient(itemFitting.ingredient,indIngred)">删除</div>
            </div>
          </div>
          <div class="rowCtn"
            v-for="(itemSize,indSize) in itemFitting.size"
            :key="indSize + 'size'">
            <div class="colCtn flex3">
              <span class="label"
                v-if="indSize === 0">
                <span class="text">配件规格</span>
                <span class="explanation">(选填)</span>
              </span>
              <span class="content">
                <el-select v-model="itemSize.size"
                  placeholder="请选择规格">
                  <el-option v-for="item in sizeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label"
                v-if="indSize === 0">
                <span class="text"></span>
              </span>
              <span class="content">
                <zh-input v-model="itemSize.weight"
                  type="number"
                  placeholder="请输入克重">
                  <template slot="append">
                    <span>g</span>
                  </template>
                </zh-input>
              </span>
            </div>
            <div class="colCtn flex3">
              <span class="label"
                v-if="indSize === 0">
                <span class="text"></span>
              </span>
              <span class="content">
                <zh-input v-model="itemSize.desc"
                  placeholder="请输入尺寸信息">
                  <template slot="append">
                    <span>cm</span>
                  </template>
                </zh-input>
              </span>
              <div class="editBtn addBtn"
                v-if="indSize === 0"
                @click="addSize(itemFitting.size)">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteSize(itemFitting.size,indSize)">删除</div>
            </div>
          </div>
        </div>
        <div class="btn btnWhiteBlue add_fitting_btn"
          @click="addFitting">添加配件</div>
      </template>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他信息</span>
      </div>
      <div class="editCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">样品图片</span>
              <span class="explanation">(选填)</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
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
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">备注信息</span>
              <span class="explanation">(选填)</span>
            </span>
            <span class="content autoHeight">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="desc"
                placeholder="请输入备注信息"></el-input>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { productType, flower, ingredient, colour, getToken } from '@/assets/js/api.js'
import { chinaNum } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      sampleName: '',
      treeData: [],
      types: [],
      warning: false,
      flowerArr: [],
      flower: '',
      ingredient: [{ ingredient_name: '', ingredient_value: '' }],
      ingredientArr: [],
      showError: false,
      size: [{ size: '', weight: '', desc: '' }],
      sizeArr: [],
      color: [{ color: '' }],
      colorArr: [],
      desc: '',
      postData: { token: '' },
      fileArr: [],
      hasFitting: false,
      fittingInfo: [{
        fitting_name: '',
        type: [],
        color: [{ color: '', fitting_number: '' }],
        ingredient: [{
          ingredient_name: '',
          ingredient_value: ''
        }],
        size: [{ size: '', weight: '', desc: '' }]
      }],
      chinaNum: chinaNum
    }
  },
  methods: {
    searchIngredient (queryString, cb) {
      let result = queryString ? this.ingredientArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.ingredientArr
      cb(result)
    },
    searchColor (queryString, cb) {
      let result = queryString ? this.colorArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.colorArr
      cb(result)
    },
    beforeAvatarUpload () {

    },
    addIngredient (item) {
      item.push({
        ingredient_name: '',
        ingredient_value: ''
      })
    },
    deleteIngredient (item, index) {
      item.splice(index, 1)
    },
    addSize (item) {
      console.log('size', item)
      item.push({ size: '', weight: '', desc: '' })
    },
    deleteSize (item, index) {
      item.splice(index, 1)
    },
    addColour (item, hasNum) {
      if (hasNum) {
        item.push({ color: '', fitting_number: '' })
      } else {
        item.push({ color: '' })
      }
    },
    deleteColour (item, index) {
      item.splice(index, 1)
    },
    addFitting () {
      this.fittingInfo.push({
        fitting_name: '',
        type: [],
        color: [{ color: '', fitting_number: '' }],
        ingredient: [{
          ingredient_name: '',
          ingredient_value: ''
        }],
        size: [{ size: '', weight: '', desc: '' }]
      })
    },
    deleteFitting (index) {
      this.$confirm('此操作将删除该配件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fittingInfo.splice(index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  computed: {
    product_code_cmp () {
      return '19ABA0001'
    }
  },
  mounted () {
    Promise.all([
      productType.list(),
      flower.list(),
      ingredient.list(),
      colour.list(),
      getToken()]).then((res) => {
      console.log(res)
      this.treeData = res[0].data.data.map((item) => {
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
      this.colorArr = res[3].data.data
      this.colorArr.forEach((item) => {
        item.value = item.name
      })
      this.postData.token = res[4].data.data
      this.loading = false
    })
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/sample/sampleCreate.less";
</style>
