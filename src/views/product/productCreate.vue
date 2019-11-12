<template>
  <div class="indexMain"
    id="productCreate">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
        <span class="productCode">19ABA0123</span>
      </div>
      <div class="editCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">产品名称</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入产品名称"
                type="number"
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
        <div class="rowCtn"
          v-for="(item,index) in ingredient"
          :key="'ingredient' + index">
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
              <span class="text">样品成分</span>
              <span class="explanation">(必填,成分比例相加为100%)</span>
            </div>
            <div class="content">
              <el-select v-model="item.ingredient_name">
                <el-option v-for="(item,index) in ingredientArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
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
              <span class="text">产品规格</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="item.size">
                <el-option v-for="(item,index) in sizeArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
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
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label"
              v-show="index===0">
            </div>
            <div class="content">
              <zh-input type="number"
                placeholder="请输入尺寸信息"
                v-model="item.desc">
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
              <span class="text">产品配色</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.colour"
                :fetch-suggestions="searchCoulor"
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
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他信息</span>
      </div>
      <div class="editCtn">
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
              <span class="explanation">(选填)</span>
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
          <div class="btn btnGray">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      hasFitting: false
    }
  },
  methods: {
    addIngredient () {
      console.log('kljklj')
      this.ingredient.push({ ingredient_name: '', ingredient_value: '' })
    },
    deleteIngredient (index) {
      this.ingredient.splice(index, 1)
    },
    addSize () {
      this.size.push({ size: '', weight: '', desc: '' })
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
    searchCoulor () {

    },
    beforeAvatarUpload () {

    }
  }

}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productCreate.less";
</style>
