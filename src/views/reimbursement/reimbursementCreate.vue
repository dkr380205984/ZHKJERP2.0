<template>
  <div id="reimbursementCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">报销明细</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <div class="tb_row">报销内容</div>
              <div class="tb_row">报销金额(元)</div>
              <div class="tb_row middle flex04">操作</div>
            </div>
            <div class="tb_content"
              v-for="(item,index) in list"
              :key="index">
              <div class="tb_row">
                <!-- <zh-input placeholder="请输入报销内容"
                  class='tb_row_input'
                  v-model="item.name"></zh-input> -->
                <el-autocomplete class="tb_row_input"
                  style="height:32px"
                  v-model="item.name"
                  :fetch-suggestions="querySearchReimburse"
                  placeholder="请输入报销内容"></el-autocomplete>
              </div>
              <div class="tb_row">
                <zh-input placeholder="请输入报销内容"
                  class='tb_row_input'
                  type='number'
                  v-model="item.price"></zh-input>
              </div>
              <div class="tb_row middle flex04">
                <span class="tb_handle_btn red"
                  @click="deleteItem(list,index)">删除</span>
              </div>
            </div>
            <div class="tb_header">
              <div class="tb_row strong">合计费用</div>
              <div class="tb_row">{{list|filterTotal}}</div>
              <div class="tb_row flex04"></div>
            </div>
            <div class="tb_content">
              <div class="tb_row tb_row_handle_btn"
                @click="addItem(list,'detail')">
                <span class="tb_handle_btn">+ 新增明细</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">上传报销凭证</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                multiple
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="reimbursementFile"
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
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="content"
              style="height:auto">
              <el-input type="textarea"
                :rows="4"
                placeholder="请输入备注信息"
                v-model="remark">
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <span class="btn btnGray"
            @click="$router.go(-1)">返回</span>
          <span class="btn btnBlue"
            @click="submit">提交</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff, getToken, reimbursement } from '@/assets/js/api.js'
export default {
  data () {
    return {
      list: [
        {
          name: '',
          price: ''
        }
      ],
      remark: '',
      userArr: [],
      postData: { token: '' }
    }
  },
  methods: {
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    addItem (data, type) {
      if (type === 'detail') {
        data.push({
          name: '',
          price: ''
        })
      }
    },
    submit () {
      let list = this.list.filter(itemF => (itemF.name || itemF.price))
      if (list.filter(item => (!item.name || !item.price)).length > 0) {
        this.$message.error('检测到有报销明细未填写完成')
        return
      }
      let invoiceFile = this.$refs.reimbursementFile.uploadFiles.map(item => {
        return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key))
      })
      reimbursement.create({
        detail_data: JSON.stringify(list),
        invoice_image: null,
        invoice_file: invoiceFile,
        apply_text: this.remark,
        id: null
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('提交成功')
          this.$router.push('/reimbursement/reimbursementList')
        }
      })
    },
    beforeAvatarUpload (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = new Date().getTime() + '.' + fileFormat
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 10MB!')
        return false
      }
    },
    querySearchReimburse (queryString, cb) {
      let list = [
        { value: '油费' },
        { value: '材料费' },
        { value: '打车费' },
        { value: '车票费' },
        { value: '餐饮费' },
        { value: '住宿费' },
        { value: '招待费' }
      ]
      let returnList = queryString ? list.filter(itemF => (itemF.value.indexOf(queryString) !== -1)) : list
      cb(returnList)
    }
  },
  filters: {
    filterTotal (item) {
      return item.map(itemM => (+itemM.price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
    }
  },
  created () {
    this.reimbursement_user = window.sessionStorage.getItem('user_name')
    Promise.all([
      staff.list(),
      getToken()
    ]).then(res => {
      this.userArr = res[0].data.data
      this.postData.token = res[1].data.data
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursement/reimbursementCreate.less";
</style>
