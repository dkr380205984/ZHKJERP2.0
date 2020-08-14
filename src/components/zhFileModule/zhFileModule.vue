<template>
  <div class='comModule'>
    <div class="titleCtn">
      <span class="title">
        <span class="title"
          :class="{'hasBorder':title_has_border}">{{title_content}}</span>
      </span>
      <span class="rightBtn blue"
        v-if="canChange"
        @click="showChangePopup = true">更新资料</span>
    </div>
    <div class="detailCtn">
      <el-timeline v-if="fileInfo.length > 0">
        <el-timeline-item v-for="(itemFile, indexFile) in fileInfo"
          :key="indexFile">
          <div class="infoCtn">
            <div class="title"
              @click="itemFile.show = !itemFile.show">{{itemFile.title}}</div>
            <el-collapse-transition>
              <div class="content"
                v-show="itemFile.show">
                <div class="info">
                  <span class="item">{{itemFile.user_name}}</span>
                  <span class="item">{{itemFile.prot || '暂无岗位'}}</span>
                  <span class="item">{{itemFile.create_time}}</span>
                  <span class="redBtn"
                    v-if="canChange"
                    @click="deleteFileLog(itemFile)">删除该记录</span>
                </div>
                <div class="info"
                  v-if="itemFile.remark">{{itemFile.remark}}</div>
                <div class="info fileModule"
                  v-if="itemFile.fileArr.length !== 0">
                  <div class="fileItem"
                    v-for="(itemF,indexF) in itemFile.fileArr"
                    :key="indexF">
                    <span class="el-icon-tickets name">{{itemF.name}}</span>
                    <span class="see"
                      @click="$openUrl(itemF.url)">查看</span>
                    <!-- <span class="down">
                      <a :href="itemF.url"
                        :download="itemF.name">下载</a>
                    </span> -->
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </el-timeline-item>
      </el-timeline>
      <template v-else>暂无文件</template>
    </div>
    <div class="popup"
      v-if="showChangePopup">
      <div class="main">
        <div class="titleCtn">
          <span class="text">订单最新资料更新</span>
          <span class="el-icon-close close_icon"
            @click="closePopup"></span>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span class="label isMust">资料标题：</span>
            <span class="info">
              <zh-input v-model="editFileInfo.title"
                placeholder='请输入标题' />
            </span>
          </div>
          <div class="row">
            <span class="label">备注信息：</span>
            <span class="info">
              <el-input v-model="editFileInfo.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入内容">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">相关文件：</span>
            <span class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                multiple
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="fileRef"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="oprCtn">
          <div class="opr"
            @click="closePopup">取消</div>
          <div class="opr blue"
            @click='saveFile'>提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, orderFile } from '@/assets/js/api.js'
export default {
  props: {
    title_has_border: {
      type: Boolean,
      default: false
    },
    title_content: {
      type: String,
      default: '订单文件资料更新'
    },
    canChange: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: [Number, String],
      require: true,
      validator: (value) => {
        return !isNaN(Number(value))
      }
    },
    orderType: {
      type: [Number, String],
      default: 1,
      validator: (value) => {
        return !isNaN(Number(value))
      }
    },
    token: String
  },
  data () {
    return {
      loading: true,
      fileInfo: [],
      showChangePopup: false,
      postData: { token: '' },
      editFileInfo: {
        title: '',
        remark: ''
      }
    }
  },
  methods: {
    closePopup () {
      this.showChangePopup = false
    },
    beforeAvatarUpload (file) {
      this.postData.key = file.name
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 10MB!')
        return false
      }
    },
    init () {
      this.loading = true
      orderFile.list({
        order_id: this.orderId
      }).then(res => {
        if (res.data.status !== false) {
          this.fileInfo = res.data.data.map(itemM => {
            return {
              id: itemM.id,
              title: itemM.title,
              show: false,
              user_name: itemM.user_name,
              prot: itemM.user_station,
              create_time: itemM.create_time,
              fileArr: itemM.file_url.map(itemF => {
                return {
                  name: itemF.replace('https://zhihui.tlkrzf.com/', ''),
                  url: itemF
                }
              })
            }
          })
        }
        this.loading = false
      })
    },
    saveFile () {
      if (this.$submitLock()) return
      if (!this.editFileInfo.title) {
        this.$message.error('请输入标题')
        return
      }
      let fileArr = this.$refs.fileRef.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      // if (fileArr.length === 0) {
      //   this.$message.error('检测到未上传文件')
      //   return
      // }
      orderFile.create({
        order_id: this.orderId,
        title: this.editFileInfo.title,
        desc: this.editFileInfo.remark,
        file_url: fileArr
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('更新成功')
          this.editFileInfo = {
            title: '',
            remark: ''
          }
          this.closePopup()
          this.init()
        }
      })
    },
    deleteFileLog (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderFile.delete({
          id: item.id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created () {
    if (!this.token) {
      getToken().then(res => {
        if (res.data.status !== false) {
          this.postData.token = res.data.data
        }
      })
    } else {
      this.postData.token = this.token
    }
    this.init()
  }
}
</script>

<style scoped lang='less'>
@import "./zhFileModule.less";
</style>
<style lang="less">
.fileModule {
  .el-timeline {
    padding: 0;
  }
  // .el-timeline-item {
  //   padding-bottom: 0px;
  //   margin-bottom: -9px;
  // }
}
</style>
