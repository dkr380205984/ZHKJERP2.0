<template>
  <div id="productList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              placeholder="请输入编号查询"></el-input>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <div class="col"><span class="text">编号</span></div>
            </div>
            <div class="col"
              style="flex:1.5">
              <transition v-show="!searchTypeFlag"
                name="el-zoom-in-bottom">
                <span class="text">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
              </transition>
              <transition name="el-zoom-in-top">
                <div v-show="searchTypeFlag"
                  class="filterBox">
                  <el-cascader class="filter"
                    placeholder="筛选品类"
                    :options="typeArr"
                    clearable
                    filterable>
                  </el-cascader>
                </div>
              </transition>
            </div>
            <div class="col"
              style="flex:0.5"><span class="text">花型</span></div>
            <div class="col"><span class="text">名称</span></div>
            <div class="col"><span class="text middle">图片</span></div>
            <div class="col"><span class="text">创建人</span></div>
            <div class="col">
              <span class="text">创建时间
                <span class="iconCtn">
                  <i class="el-icon-caret-top green"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col"><span class="text">状态</span></div>
            <div class="col"><span class="text">操作</span></div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.product_code}}</div>
            <div class="col"
              style="flex:1.5">{{item.category_info.product_category + ' / ' + item.type_name + ' / ' + item.style_name}}</div>
            <div class="col"
              style="flex:0.5">{{item.flower_id}}</div>
            <div class="col">{{item.sample_title?item.sample_title:'无'}}</div>
            <div class="col">
              <zh-img-list :list="item.img"></zh-img-list>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">
              <div class="stateCtn"
                :class="{'green':item.has_craft===1}">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div class="stateCtn"
                :class="{'green':item.has_plan===1}">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div class="stateCtn"
                :class="{'green':item.quotation_id>0}">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/product/productDetail/' + item.id)">详情</span>
              <span class="opr">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span class="edit">修改产品</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span class="delete">删除产品</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!item.has_craft">
                      <span class="create">添加工艺单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_craft">
                      <span class="detail">工艺单详情</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_craft">
                      <span class="edit">修改工艺单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_craft">
                      <span class="delete">删除工艺单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!item.has_plan">
                      <span class="create">添加配料单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan">
                      <span class="detail">配料单详情</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan">
                      <span class="edit">修改配料单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan">
                      <span class="delete">删除配料单</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { product } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      searchTypeFlag: false,
      typeArr: [],
      loading: true,
      list: [],
      keyword: '',
      date: '',
      total: 1,
      page: 1
    }
  },
  watch: {
    page (newVal) {
      this.$router.push('/product/productList/page=' + this.page)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.getList()
    }
  },
  methods: {
    getList () {
      this.loading = true
      product.list({
        limit: 10,
        page: this.page,
        type: 1
      }).then((res) => {
        console.log(res)
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    }
  },
  created () {
    let params = getHash(this.$route.params.params)
    this.page = Number(params.page)
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productList.less";
</style>
