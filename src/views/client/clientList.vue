<template>
  <div id='clientList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入编号按回车键查询">
            </el-input>
            <el-date-picker v-model="date"
              style="width:290px"
              class="inputs"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeRouter(1)">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
            <div class="btn btnWhiteBlue"
              @click="$router.push('/client/clientCreate')">新增客户</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">客户名称</span>
            </div>
            <div class="col">
              <span class="text">客户简称</span>
            </div>
            <div class="col flex12">
              <span class="text">客户类型</span>
            </div>
            <div class="col flex08">
              <span class="text">人员数量</span>
            </div>
            <div class="col flex08">
              <span class="text">联系电话</span>
            </div>
            <div class="col flex12">
              <span class="text">更新时间</span>
            </div>
            <div class="col middle flex08">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemClient,indexClient) in list"
            :key="indexClient">
            <div class="col flex12">{{itemClient.name}}</div>
            <div class="col">{{itemClient.abbreviation}}</div>
            <div class="col flex12">{{computedType(itemClient.type)}}</div>
            <div class="col flex08">{{itemClient.contacts.length}}</div>
            <div class="col flex08">{{itemClient.phone}}</div>
            <div class="col flex12">{{itemClient.update_time}}</div>
            <div class="col middle flex08">
              <span class="opr"
                @click="$router.push('/client/clientDetail/' + itemClient.id)">详情</span>
              <span class="opr"
                @click="$router.push('/client/clientUpdate/' + itemClient.id)">修改</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getClientList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { companyType } from '@/assets/js/dictionary.js'
import { client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      client_type: '',
      pages: 1,
      total: 0,
      companyType: companyType
    }
  },
  methods: {
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.client_type = params.clientType
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/client/clientList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&clientType=' + this.client_type)
    },
    getClientList () {
      this.loading = true
      client.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword
      }).then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        }
      })
    },
    computedType (type) {
      return type.map(item => {
        let flag = this.companyType.find(value => value.value === item)
        return flag.name || ''
      }).join(',')
    }
  },
  created () {
    this.getFilters()
    this.getClientList()
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      this.getFilters()
      this.getClientList()
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/client/clientList.less";
</style>
