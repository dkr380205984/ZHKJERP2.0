<template>
  <div id="reimbursemenCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn"
        style="display:flex;align-items:center;justify-content: space-between;">
        <span class="title">报销信息
          <!-- <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent">
          </zh-message> -->
        </span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">报销人</span>
            </div>
            <div class="content">
              <el-select v-model="reimbursement_user"
                filterable
                allow-create
                default-first-option
                placeholder="请选择报销人">
                <el-option v-for="item in userArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <!-- <el-input placeholder="请输入报销人"
                v-model="reimbursement_user"></el-input> -->
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">同行人</span>
            </div>
            <div class="content">
              <el-select v-model="reimbursement_other_user"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择同行人员">
                <el-option v-for="item in userArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <!-- <el-input placeholder="请输入同行人"
                v-model="reimbursement_other_user"></el-input> -->
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">报销事由</span>
            </div>
            <div class="content">
              <el-input placeholder="请填写报销理由"
                v-model="reimbursement_content"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
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
              <template v-if="!item.editFlag">
                <div class="tb_row">{{item.name}}</div>
                <div class="tb_row">{{item.price}}</div>
                <div class="tb_row middle flex04">
                  <span class="tb_handle_btn blue"
                    @click="item.editFlag = true">编辑</span>
                  <span class="tb_handle_btn red"
                    @click="deleteItem(list,index)">删除</span>
                </div>
              </template>
              <template v-else>
                <div class="tb_row">
                  <zh-input placeholder="请输入报销内容"
                    class='tb_row_input'
                    v-model="item.name"></zh-input>
                </div>
                <div class="tb_row">
                  <zh-input placeholder="请输入报销内容"
                    class='tb_row_input'
                    type='number'
                    v-model="item.price"></zh-input>
                </div>
                <div class="tb_row middle flex04">
                  <span class="tb_handle_btn blue"
                    @click="editCompiled(item)">完成</span>
                  <span class="tb_handle_btn red"
                    @click="deleteItem(list,index)">删除</span>
                </div>
              </template>
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
import { staff } from '@/assets/js/api.js'
export default {
  data () {
    return {
      reimbursement_user: '',
      reimbursement_other_user: '',
      reimbursement_content: '',
      list: [
        {
          editFlag: false,
          name: '油费',
          price: 100
        },
        {
          editFlag: false,
          name: '打车费',
          price: 80
        },
        {
          editFlag: false,
          name: '住宿费',
          price: 400
        }
      ],
      remark: '',
      userArr: []
    }
  },
  methods: {
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    addItem (data, type) {
      if (type === 'detail') {
        data.push({
          editFlag: true,
          name: '',
          price: ''
        })
      }
    },
    editCompiled (item) {
      if (!item.name) {
        this.$message.warning('请输入报销内容')
        return
      }
      if (!item.price) {
        this.$message.warning('请输入报销金额')
        return
      }
      item.editFlag = false
    },
    submit () {
      if (!this.reimbursement_user) {
        this.$message.error('请输入报销人员')
        return
      }
      if (this.list.filter(item => item.editFlag).length > 0) {
        this.$message.error('检测到有正在编辑的报销明细未编辑完成')
        return
      }
      // console.log('提交成功')
      this.$message.success('提交成功')
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
      staff.list()
    ]).then(res => {
      this.userArr = res[0].data.data
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursemen/reimbursemenCreate.less";
</style>
