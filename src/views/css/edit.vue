<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">zh-input组件</span>
      </div>
      <div class="editCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">数字类型</span>
              <span class="explanation">(type='number',type可选项见文档)</span>
            </div>
            <div class="content">
              <zh-input placeholder="数字类型"
                type="number"
                v-model="str[0]">
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">必填项</span>
              <span class="explanation">(mustFill=true)</span>
            </div>
            <div class="content">
              <zh-input placeholder="必填项类型"
                :mustFill="true"
                v-model="str[1]">
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">必填项</span>
              <span class="explanation">(mustFill=true,errorMsg='......')</span>
            </div>
            <div class="content">
              <zh-input placeholder="必填项类型"
                errorMsg="必填项错误提示信息需要传入参数"
                :mustFill="true"
                v-model="str[2]">
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">错误提示在右边</span>
              <span class="explanation">(errorPosition='right')</span>
            </div>
            <div class="content">
              <div class="content">
                <zh-input placeholder="必填项类型"
                  errorPosition='right'
                  errorMsg="报错信息"
                  :mustFill="true"
                  v-model="str[3]">
                </zh-input>
              </div>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">有前后slot</span>
              <span class="explanation">(slot='append/prepend')</span>
            </div>
            <div class="content">
              <div class="content">
                <zh-input placeholder="有前后append"
                  v-model="str[4]">
                  <template slot="append">后提示</template>
                  <template slot="prepend">前提示</template>
                </zh-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他样式</span>
      </div>
      <div class="editCtn">
        <span class="titleNum">模块1</span>
        <span class="deleteIcon el-icon-close"></span>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">el-input</span>
              <span class="explanation">(基本不用input功能,使用的都是输入搜索功能)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="str[5]"
                :fetch-suggestions="search"
                placeholder="搜索功能">
              </el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">el-select</span>
              <span class="explanation">(mustFill=true)</span>
            </div>
            <div class="content">
              <el-select placeholder="下拉框组件"
                v-model="str[6]"></el-select>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">el-cascader</span>
              <span class="explanation">(mustFill=true,errorMsg='......')</span>
            </div>
            <div class="content">
              <el-cascader v-model="arr"
                placeholder="级联选择器"
                :options="arr"
                :props="{ expandTrigger: 'hover' }">
              </el-cascader>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">添加/删除按钮</span></div>
            <div class="content">
              <el-input placeholder="输入框"></el-input>
            </div>
            <div class="editBtn addBtn">添加</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="content">
              <el-input placeholder="输入框"></el-input>
            </div>
            <div class="editBtn deleteBtn">删除</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">文件上传功能</span>
              <span class="explanation">(选填)</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :file-list="arr"
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
              <span class="text">文本框</span>
              <span class="explanation">(选填)</span>
            </span>
            <span class="content autoHeight">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="str[7]"
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
export default {
  data () {
    return {
      arr: [],
      str: [],
      postData: { token: '' }
    }
  },
  methods: {
    search () {

    },
    beforeAvatarUpload () {

    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/common.less";
</style>
