<template>
  <div id="sampleCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">大身信息</span>
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
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">样品成分</span>
            </span>
            <span class="content">
              <el-autocomplete class="inline-input"
                v-model="ingredient[0].ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入样品成分">
              </el-autocomplete>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字,并保证成分总值为100%!"
                placeholder="请输入成分百分比"
                v-model="ingredient[0].ingredient_value">
                <template slot="append">
                  <span>%</span>
                </template>
              </zh-input>
            </span>
            <div class="editBtn addBtn"
              @click="addIngredient">添加</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">样品规格</span>
            </span>
            <span class="content">
              <el-select v-model="size[0].size"
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
            <span class="label">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="size[0].weight"
                type="number"
                placeholder="请输入克重">
                <template slot="append">
                  <span>g</span>
                </template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn">
            <span class="label">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="size[0].desc"
                placeholder="请输入尺寸信息">
                <template slot="append">
                  <span>cm</span>
                </template>
              </zh-input>
            </span>
            <div class="editBtn addBtn">添加</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">样品配色组</span>
            </span>
            <span class="content">
              <el-autocomplete class="inline-input"
                v-model="color[0].color"
                :fetch-suggestions="searchColor"
                placeholder="请输入配色信息">
              </el-autocomplete>
            </span>
            <div class="editBtn addBtn">添加</div>
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
      hasFitting: false
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
    addIngredient () {
      this.ingredient.push({
        ingredient_name: '',
        ingredient_value: ''
      })
    },
    deleteIngredient (index) {
      this.ingredient.splice(index, 1)
    },
    addSize () {

    },
    deleteSize () {

    },
    addColour () {

    },
    deleteColour () {

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
