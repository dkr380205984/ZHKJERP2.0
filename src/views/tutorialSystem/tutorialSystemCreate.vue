<template>
  <div id="tutorialSystemCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <div class="title">系统教程添加</div>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">管理模块</span>
            </span>
            <span class="content">
              <el-select v-model="moduleId"
                filterable
                placeholder="请选择管理模块">
                <el-option v-for="item in moduleArr"
                  :key="item.id"
                  :label="item.module"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex2">
            <span class="label">
              <span class="text">教程标题</span>
            </span>
            <span class="content">
              <zh-input v-model="questionTitle"
                placeholder="请输入问题标题" />
            </span>
          </div>
        </div>
        <template v-for="(item,index) in stepsInfo">
          <div class="rowCtn"
            :key="index + 'text'">
            <div class="colCtn flex2">
              <span class="label">
                <span class="text">第{{chinaNum[index]}}步</span>
              </span>
              <span class="content"
                style="height:auto">
                <!-- <zh-input v-model="item.text"
                  placeholder="请输入步骤描述" /> -->
                <el-input type="textarea"
                  :rows="2"
                  placeholder="请输入步骤描述"
                  v-model="item.text">
                </el-input>
              </span>
              <span class="editBtn">
                <div class="btn noBorder"
                  @click="addItem"
                  v-if="index === 0">添加步骤</div>
                <div class="btn noBorder red"
                  @click="deleteItem(index)"
                  v-if="index !== 0">删除步骤</div>
              </span>
            </div>
          </div>
          <div class="rowCtn"
            :key="index + 'image'">
            <div class="colCtn flex2">
              <div class="content"
                style="height:auto">
                <el-upload action="https://upload.qiniup.com/"
                  drag
                  :before-upload="beforeAvatarUpload"
                  :data="postData"
                  :file-list="fileArr"
                  list-type="picture-card"
                  ref="uploada_image">
                  <i class="el-icon-plus"
                    slot="default"
                    style="font-size:30px;">
                    <br />
                    <span style="font-size:14px">点击上传图片描述</span>
                  </i>
                </el-upload>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray">返回</div>
          <div class="btn btnBlue">添加</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissions, chinaNum } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
      moduleId: '',
      moduleArr: permissions,
      questionTitle: '',
      stepsInfo: [
        {
          text: ''
        }
      ],
      postData: { token: '' },
      fileArr: []
    }
  },
  methods: {
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
    addItem () {
      this.stepsInfo.push({
        text: ''
      })
    },
    deleteItem (key) {
      this.stepsInfo.splice(key, 1)
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/tutorialSystem/tutorialSystemCreate.less";
</style>
<style lang="less">
#tutorialSystemCreate {
  .el-upload--picture-card {
    border: none;
    height: auto;
    width: auto;
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .red {
    color: #f5222d;
  }
}
</style>
