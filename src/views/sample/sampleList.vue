<template>
  <div id="sampleList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入编号查询"></el-input>
            <el-date-picker class="inputs"
              v-model="value"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <!-- <div class="leftCtn">
            <div class="btn btnGray">新建样单</div>
            <div class="btn btnBlue">新建样品</div>
          </div> -->
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
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
                    :options="treeData"
                    clearable
                    filterable></el-cascader>
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">花型</span>
            </div>
            <div class="col">
              <span class="text">名称</span>
            </div>
            <div class="col">
              <span class="text">图片</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">创建时间
                <span class="iconCtn">
                  <i class="el-icon-caret-top active"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.product_code}}</div>
            <div class="col">{{item|filterType}}</div>
            <div class="col">{{item.flower_id}}</div>
            <div class="col">{{item.sample_title}}</div>
            <div class="col">
              <zh-img-list :list="item.img"></zh-img-list>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">
              <div :class="{'stateCtn':true, 'green':item.has_craft === 1}">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div :class="{'stateCtn':true, 'green':item.has_plan === 1}">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div :class="{'stateCtn':true, 'green':item.quotation_id === 1}">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
              <div :class="{'stateCtn':true, 'green':false}">
                <div class="state"></div>
                <span class="name">样</span>
              </div>
            </div>
            <div class="col">
              <span class="opr">详情</span>
              <span class="opr">
                <el-dropdown @command="handleCommand($event,item.id)">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='change'
                      style="color:#e6a23c">修改</el-dropdown-item>
                    <el-dropdown-item command='delete'
                      style="color:#f5222d">删除</el-dropdown-item>
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
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sample } from '@/assets/js/api'
export default {
  data () {
    return {
      loading: true,
      searchTypeFlag: false,
      value: '',
      total: 0,
      pages: 1,
      treeData: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }],
      list: []
    }
  },
  methods: {
    getList () {
      this.loading = true
      sample.list({
        limit: 10,
        page: this.pages,
        type: 2
      }).then(res => {
        if (res.data.status === false) {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        } else {
          this.list = res.data.data
          this.total = res.data.meta.total
        }
        this.loading = false
      })
    },
    handleCommand (type, id) {
      if (type === 'change') {
        this.$router.push('/sample/sampleUpdate/' + id)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该样品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '未知命令'
        })
      }
    }
  },
  created () {
    this.getList()
  },
  filters: {
    filterType (item) {
      return [item.category_info.product_category, item.type_name, item.style_name].join('/')
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/sample/sampleList.less";
</style>
