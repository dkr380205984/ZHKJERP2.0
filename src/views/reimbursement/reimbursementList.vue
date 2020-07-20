<template>
  <div id="reimbursementList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入编号按回车键查询">
              </el-input>
              <el-select v-model="user_name"
                class="filter_item"
                filterable
                @change="changeRouter(1)"
                clearable
                placeholder="筛选申请人">
                <el-option v-for="(item,index) in userArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="status"
                class="filter_item"
                @change="changeRouter(1)"
                filterable
                clearable
                placeholder="筛选审核状态">
                <el-option v-for="(item,index) in statusArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
          </div>
        </div>
        <div class="addCtn">
          <div class="btn btnBlue"
            @click="$router.push('/reimbursement/reimbursementCreate')">添加报销单</div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
              <span class="text">创建时间</span>
            </div>
            <div class="col">
              <span class="text">申请人</span>
            </div>
            <div class="col">
              <span class="text">申请报销(元)</span>
            </div>
            <div class="col">
              <span class="text">实际报销(元)</span>
            </div>
            <div class="col">
              <span class="text">审核状态</span>
            </div>
            <div class="col">
              <span class="text">审核人</span>
            </div>
            <div class="col middle">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">{{item.reimburse_user}}</div>
            <div class="col">{{item.detail_data|filterTotal}}</div>
            <div class="col">{{item.real_data|filterRealTotal}}</div>
            <div class="col">
              <div :class="['stateCtn', 'rowFlex', item.status === 1 ? 'green' : item.status === 2 ? 'red' : 'blue']">
                <div class="state"></div>
                <span class="name">{{item.status|filterStatus}}</span>
              </div>
            </div>
            <div class="col">{{item.check_user}}</div>
            <div class="col middle">
              <span class="opr orange"
                :class="{'gray' : item.status === 1 }"
                @click="item.status === 1 ? ()=> false : $router.push('/reimbursement/reimbursementUpdate/' + item.id)">修改</span>
              <span class="opr"
                @click="$router.push('/reimbursement/reimbursementDetail/' + item.id)">详情</span>
              <span class="opr red"
                :class="{'gray' : item.status === 1 }"
                @click="item.status === 1 ? ()=> false : deleteReimbursement(item)">删除</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, reimbursement } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      keyword: '',
      date: '',
      user_name: '',
      userArr: [],
      status: '',
      statusArr: [
        {
          name: '待审核',
          id: '1'
        }, {
          name: '通过',
          id: '2'
        }, {
          name: '驳回',
          id: '3'
        }
      ],
      list: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      total: 1,
      pages: 1
    }
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    reset () {
      this.$router.push('/reimbursement/reimbursementList/page=1&&keyword=&&date=&&applyUser=&&status=')
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.user_name = params.applyUser
      this.status = params.status
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/reimbursement/reimbursementList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&applyUser=' + this.user_name + '&&status=' + this.status)
    },
    getList () {
      this.loading = true
      reimbursement.list({
        limit: 10,
        page: this.pages
      }).then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data
          this.total = res.data.meta.total
          this.loading = false
        }
      })
    },
    deleteReimbursement (item) {
      this.$confirm(`此操作将永久删除编号为${item.code}的报销单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reimbursement.delete({
          id: item.id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.getList()
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
    this.getFilters()
    this.getList()
    Promise.all([
      auth.list()
    ]).then(res => {
      this.userArr = res[0].data.data
    })
  },
  filters: {
    filterStatus (item) {
      return +item === 1 ? '通过' : +item === 2 ? '驳回' : '待审核'
    },
    filterTotal (item) {
      return item ? JSON.parse(item).map(itemM => (+itemM.price || 0)).reduce((a, b) => {
        return a + b
      }, 0) : 0
    },
    filterRealTotal (item) {
      return item ? JSON.parse(item).map(itemM => (+itemM.price || 0)).reduce((a, b) => {
        return a + b
      }, 0) : 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursement/reimbursementList.less";
</style>
