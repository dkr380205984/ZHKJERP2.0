<template>
  <div class='comModule'
    v-if="!isNotInfo || canChange">
    <div class="titleCtn">
      <span class="title">
        <span class="title"
          :class="{'hasBorder':title_has_border}">{{title_content}}</span>
      </span>
      <span class="rightBtn blue"
        v-if="canChange"
        @click="changeConfirm">修改意见</span>
    </div>
    <div class="detailCtn">
      <template v-if="!isNotInfo">
        <div class="tableCtnLv2">
          <span class="tb_header">
            <span class="tb_row">标题</span>
            <span class="tb_row"
              style="flex:0.5">意见</span>
            <span class="tb_row"
              style="flex:2">内容</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">尺码</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.size === 2,'green':confirmInfo.size === 1}"
              style="flex:0.5">{{confirmInfo.size ? (confirmInfo.size === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.size_info && (confirmInfo.size === 2)) ? confirmInfo.size_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">重量</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.weight === 2,'green':confirmInfo.weight === 1}"
              style="flex:0.5">{{confirmInfo.weight ? (confirmInfo.weight === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.weight_info && (confirmInfo.weight === 2)) ? confirmInfo.weight_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">颜色</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.color === 2,'green':confirmInfo.color === 1}"
              style="flex:0.5">{{confirmInfo.color ? (confirmInfo.color === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.color_info && (confirmInfo.color === 2)) ? confirmInfo.color_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">手感</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.feel === 2,'green':confirmInfo.feel === 1}"
              style="flex:0.5">{{confirmInfo.feel ? (confirmInfo.feel === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.feel_info && (confirmInfo.feel === 2)) ? confirmInfo.feel_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">品质</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.quality === 2,'green':confirmInfo.quality === 1}"
              style="flex:0.5">{{confirmInfo.quality ? (confirmInfo.quality === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.quality_info && (confirmInfo.quality === 2)) ? confirmInfo.quality_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">成分</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.component === 2,'green':confirmInfo.component === 1}"
              style="flex:0.5">{{confirmInfo.component ? (confirmInfo.component === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.component_info && (confirmInfo.component === 2)) ? confirmInfo.component_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">图案</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.pattern === 2,'green':confirmInfo.pattern === 1}"
              style="flex:0.5">{{confirmInfo.pattern ? (confirmInfo.pattern === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.pattern_info && (confirmInfo.pattern === 2)) ? confirmInfo.pattern_info : '/'}}</span>
          </span>
          <span class="tb_content">
            <span class="tb_row">其他</span>
            <span class="tb_row"
              :class="{'orange':confirmInfo.others === 2,'green':confirmInfo.others === 1}"
              style="flex:0.5">{{confirmInfo.others ? (confirmInfo.others === 1 ? '确认' : '不确认') : '/'}}</span>
            <span class="tb_row"
              style="flex:2">{{(confirmInfo.others_info && (confirmInfo.others === 2)) ? confirmInfo.others_info : '/'}}</span>
          </span>
        </div>
        <div class="rowCtn">
          <span class="label">图片信息：</span>
          <span class="text">
            <el-image style="width: 300px; height: 150px"
              :src="confirmComImg[0]"
              :preview-src-list="confirmComImg">
              <div slot="error"
                class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </span>
        </div>
      </template>
      <template v-else>
        暂未提交过意见表
      </template>
    </div>

    <div class="popup"
      v-if="showChangePopup && canChange">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改意见</span>
          <span class="el-icon-close close_icon"
            @click="closePopup"></span>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span class="label">尺寸：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.size"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.size === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.size_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">克重：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.weight"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.weight === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.weight_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">颜色：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.color"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.color === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.color_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">手感：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.feel"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.feel === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.feel_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">品质：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.quality"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.quality === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.quality_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">成分：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.component"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.component === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.component_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">图案：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.pattern"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.pattern === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.pattern_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">其他：</span>
            <span class="info col">
              <el-radio-group v-model="confirmEditInfo.others"
                style="height:32px;display:flex;align-items:center">
                <el-radio :label="1">确认</el-radio>
                <el-radio :label="2">不确认</el-radio>
              </el-radio-group>
              <el-input type="textarea"
                v-if="confirmEditInfo.others === 2"
                :rows="2"
                placeholder="请输入内容"
                v-model="confirmEditInfo.others_info">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">文件上传：</span>
            <span class="info col">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                multiple
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :file-list="confirmEditInfo.file_url"
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
            @click='saveConfirmChange'>提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, sampleOrder } from '@/assets/js/api.js'
export default {
  props: {
    title_has_border: {
      type: Boolean,
      default: false
    },
    title_content: {
      type: String,
      default: '修改意见表'
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
      default: 2,
      validator: (value) => {
        return !isNaN(Number(value))
      }
    },
    token: String,
    orderInfo: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      loading: true,
      showChangePopup: false,
      postData: { token: '' },
      confirmInfo: {},
      confirmEditInfo: {},
      isNotInfo: false
    }
  },
  methods: {
    closePopup () {
      this.showChangePopup = false
    },
    getConfirmInfo (orderInfo) {
      if (!orderInfo.confirm_info) {
        this.isNotInfo = true
      } else {
        this.isNotInfo = false
      }
      this.confirmInfo = (orderInfo && orderInfo.confirm_info) || {}
      this.confirmInfo.file_url = this.confirmInfo.file_url && JSON.parse(this.confirmInfo.file_url).map(itemF => {
        return {
          name: itemF.replace('https://zhihui.tlkrzf.com/', ''),
          url: itemF
        }
      })
    },
    // 点击修改意见时
    changeConfirm () {
      let obj = {}
      for (const key in this.confirmInfo) {
        if (this.confirmInfo[key]) {
          obj[key] = this.confirmInfo[key]
        }
      }
      this.confirmEditInfo = Object.assign({
        size: 1,
        weight: 1,
        color: 1,
        feel: 1,
        quality: 1,
        component: 1,
        pattern: 1,
        others: 1,
        size_info: '',
        weight_info: '',
        color_info: '',
        feel_info: '',
        quality_info: '',
        component_info: '',
        pattern_info: '',
        others_info: '',
        file_url: []
      }, obj)
      this.showChangePopup = true
    },
    // 保存修改意见
    saveConfirmChange () {
      if (this.$submitLock()) return
      let fileArr = this.$refs.fileRef.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      sampleOrder.saveConfirmInfo({
        order_id: this.orderId,
        id: this.confirmEditInfo.id || null,
        size: this.confirmEditInfo.size,
        weight: this.confirmEditInfo.weight,
        color: this.confirmEditInfo.color,
        feel: this.confirmEditInfo.feel,
        quality: this.confirmEditInfo.quality,
        component: this.confirmEditInfo.component,
        pattern: this.confirmEditInfo.pattern,
        others: this.confirmEditInfo.others,
        size_info: this.confirmEditInfo.size === 2 ? this.confirmEditInfo.size_info : '',
        weight_info: this.confirmEditInfo.weight === 2 ? this.confirmEditInfo.weight_info : '',
        color_info: this.confirmEditInfo.color === 2 ? this.confirmEditInfo.color_info : '',
        feel_info: this.confirmEditInfo.feel === 2 ? this.confirmEditInfo.feel_info : '',
        quality_info: this.confirmEditInfo.quality === 2 ? this.confirmEditInfo.quality_info : '',
        component_info: this.confirmEditInfo.component === 2 ? this.confirmEditInfo.component_info : '',
        pattern_info: this.confirmEditInfo.pattern === 2 ? this.confirmEditInfo.pattern_info : '',
        others_info: this.confirmEditInfo.others === 2 ? this.confirmEditInfo.others_info : '',
        file_url: JSON.stringify(fileArr)
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('修改成功')
          this.closePopup()
          this.$emit('change')
        }
      })
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
    }
  },
  watch: {
    orderInfo: {
      deep: true,
      handler (newVal) {
        this.getConfirmInfo(this.$clone(newVal))
      }
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
    this.getConfirmInfo(this.orderInfo)
  },
  computed: {
    confirmComImg () {
      let arr = this.confirmInfo.file_url && this.confirmInfo.file_url.map(itemM => itemM.url)
      return (arr.length > 0 && arr) || [require('@/assets/image/index/noPic.jpg')]
    }
  }
}
</script>

<style scoped lang='less'>
@import "./zhConfirmModule.less";
</style>
