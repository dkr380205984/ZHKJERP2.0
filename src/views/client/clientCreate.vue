<template>
  <div id='clientCreate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加客户</div>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">客户类型</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content content_middle">
              <el-radio-group v-model="type">
                <el-radio :label="false">个体户</el-radio>
                <el-radio :label="true">公司</el-radio>
              </el-radio-group>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">客户名称</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content content_middle">
              <el-autocomplete v-model="client_name"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"></el-autocomplete>
            </span>
          </div>
          <div class="colCtn flex3"
            v-if="type">
            <span class="label">
              <span class="text">客户简称</span>
            </span>
            <span class="content content_middle">
              <zh-input v-model="client_abb"
                placeholder="请输入客户简称"></zh-input>
            </span>
          </div>
          <div class="colCtn flex3"
            v-else>
            <span class="label">
              <span class="text">联系电话</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content content_middle">
              <zh-input v-model="phone"
                placeholder="请输入联系电话"></zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">客户类型</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content content_middle">
              <el-cascader v-model="client_type"
                :options="companyType"
                collapse-tags
                :props="{ multiple: true }"
                placeholder="请选择客户类型"
                clearable></el-cascader>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="type">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">合作状态</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content content_middle">
              <el-radio-group v-model="cooperation">
                <el-radio :label="true">合作中</el-radio>
                <el-radio :label="false">暂停合作</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">联系电话</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content content_middle">
              <zh-input v-model="phone"
                placeholder="请输入联系电话"></zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">公司地址</span>
            </span>
            <span class="content content_middle">
              <zh-input v-model="address"
                placeholder="请输入公司地址"></zh-input>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="type">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row flex01"></span>
              <span class="tb_row">姓名</span>
              <span class="tb_row">职务</span>
              <span class="tb_row">联系电话</span>
              <span class="tb_row middle flex05">操作</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in contacts"
              :key="index">
              <span class="tb_row flex01"></span>
              <span class="tb_row">
                <zh-input v-model="item.name"
                  class="tb_input"
                  placeholder="请输入姓名"></zh-input>
              </span>
              <span class="tb_row">
                <zh-input v-model="item.post"
                  class="tb_input"
                  placeholder="请输入职务"></zh-input>
              </span>
              <span class="tb_row">
                <zh-input v-model="item.telephone"
                  class="tb_input"
                  placeholder="请输入联系电话"></zh-input>
              </span>
              <span class="tb_row middle flex05">
                <span class="tb_handle_btn red"
                  @click="deleteItem(contacts,index)">删除</span>
              </span>
            </div>
            <div class="tb_content noPadding">
              <span class="tb_row tb_row_handle_btn"
                @click="addItem(contacts)"><span class="el-icon-plus"></span> 联系人</span>
            </div>
            <!-- <div class="addRows">
              <div class="once"> <span class="el-icon-plus"></span> 联系人</div>
            </div> -->
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
            @click="saveAll">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      companyType: [{
        label: '加工单位',
        value: '加工单位',
        children: []
      }],
      type: true,
      client_name: '',
      client_abb: '',
      client_type: '',
      cooperation: true,
      phone: '',
      address: '',
      contacts: [
        {
          name: '',
          post: '',
          telephone: ''
        }
      ]
    }
  },
  methods: {
    addItem (item) {
      item.push({
        name: '',
        post: '',
        telephone: ''
      })
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    saveAll () {
      if (this.$submitLock()) return
      if (!this.client_name) {
        this.$message.error('检测到未填写客户名称，请填写')
        return
      }
      if (this.client_type.length < 0) {
        this.$message.error('检测到未选择客户类型，请选择')
        return
      }
      console.log(!this.phone, this.phone)
      if (!this.phone) {
        this.$message.error('检测到未填写联系电话，请填写')
        return
      }
      if (this.type && this.contacts.filter(item => item.name || item.post || item.telephone).length === 0) {
        this.$message.error('检测到未填写联系人信息，请填写')
        return
      }
      client.create({
        name: this.client_name,
        abbreviation: this.client_abb,
        phone: this.phone,
        address: this.address,
        status: this.cooperation ? 1 : 2,
        contacts: this.contacts.filter(item => item.name || item.post || item.telephone).map(item => {
          return {
            name: item.name,
            station: item.post,
            phone: item.telephone
          }
        }),
        type: this.client_type.map((item) => {
          return item.length > 1 ? item[1] : item[0]
        })
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('保存成功，即将跳转至客户列表')
          setTimeout(() => {
            this.$router.push('/client/clientListEasy/page=1&&keyword=&&date==&&clientType=')
          }, 300)
        }
      })
    },
    querySearchAsync (queryString, cb) {
      client.list({
        limit: 20,
        page: 1,
        keyword: queryString,
        type: null
      }).then(res => {
        cb(res.data.data.map((item) => {
          return {
            value: item.name
          }
        }))
      })
    }
  },
  mounted () {
    this.companyType = this.$mergeData(companyType, { mainRule: 'type', childrenName: 'children' }).map(itemM => {
      return {
        value: itemM.type,
        label: itemM.type,
        children: itemM.children
      }
    })
    this.loading = false
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/client/clientCreate.less";
</style>
