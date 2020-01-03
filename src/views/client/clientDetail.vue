<template>
  <div id='clientUpdate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">客户信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户名称：</span>
            <span class="text">{{clientInfo.name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">客户简称：</span>
            <span class="text">{{clientInfo.abbreviation}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户状态：</span>
            <span class="text">{{clientInfo.status === 1 ? '合作中' : '暂停合作'}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">客户类型：</span>
            <span class="text">{{clientInfo.type.join(',')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系电话：</span>
            <span class="text">{{clientInfo.phone}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">公司地址：</span>
            <span class="text">{{clientInfo.address}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="clientInfo.contacts.length > 0">
      <div class="titleCtn">
        <span class="title">客户联系人</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row middle">姓名</span>
              <span class="tb_row middle">职务</span>
              <span class="tb_row middle">联系电话</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in clientInfo.contacts"
              :key="index">
              <span class="tb_row middle">{{item.name}}</span>
              <span class="tb_row middle">{{item.station}}</span>
              <span class="tb_row middle">{{item.phone}} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push('/client/clientUpdate/' + $route.params.id)">修改</div>
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
      companyType: companyType,
      clientInfo: {
        type: [],
        contacts: []
      }
    }
  },
  methods: {

  },
  created () {
    client.detail({
      id: this.$route.params.id
    }).then(res => {
      if (res.data.status !== false) {
        this.clientInfo = this.$clone(res.data.data)
        this.clientInfo.type = this.clientInfo.type.map(item => {
          let flag = this.companyType.find(value => value.value === item)
          return flag ? flag.name : ''
        })
        this.loading = false
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/common.less";
</style>
