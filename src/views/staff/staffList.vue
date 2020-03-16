<template>
  <div class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入姓名按回车键查询">
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
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
              <span class="text">员工姓名</span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchDepartment">部门
                  <i class="el-icon-search iconBtn"
                    @click="searchDepartment=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchDepartment"
                    class="filterBox">
                    <el-select v-model="department"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选部门">
                      <el-option v-for="(item,index) in departmentArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">手机号</span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchType">工种
                  <i class="el-icon-search iconBtn"
                    @click="searchType=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchType"
                    class="filterBox">
                    <el-select v-model="type"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选工种">
                      <el-option v-for="(item,index) in typeArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">在职时间</span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchState">员工状态
                  <i class="el-icon-search iconBtn"
                    @click="searchState=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchState"
                    class="filterBox">
                    <el-select v-model="state"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选员工状态">
                      <el-option v-for="(item,index) in stateArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">
              <span class="text">暂无</span>
            </div>
            <div class="col">
              <span class="text">{{item.name}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.department_name}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.phone}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.type === 1?'合同工':'临时工'}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.work_time}}</span>
            </div>
            <div class="col">
              <span class="text">还没做</span>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/staff/staffDetail/' + item.id)">详情</span>
              <span class="opr">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="$router.push('/staff/staffUpdate/'+ item.id)">
                      <span class="updated">修改</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="deleteStaff(item.id)">
                      <span class="delete">删除</span>
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
            :current-page.sync="page"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { staff, station } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      date: '',
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
      searchDepartment: false,
      searchType: false,
      searchState: false,
      state: '',
      stateArr: [],
      department: '',
      departmentArr: [],
      type: '',
      typeArr: [],
      keyword: '',
      total: 1,
      page: 1,
      list: []
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getList () {
      this.loading = true
      staff.list({
        keyword: this.keyword,
        // state:this.state,
        // type:this.type,
        // department:this.department,
        //  start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        // end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
        limit: 10,
        page: this.page
      }).then((res) => {
        console.log(res)
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.loading = false
      })
    },
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.type = params.type || ''
      this.state = params.state || ''
      this.department = params.department || ''
      if (this.type) {
        this.searchType = true
      }
      if (this.state) {
        this.searchState = true
      }
      if (this.department) {
        this.department = true
      }
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/staff/staffList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&department=' + this.department + '&&type=' + this.type + '&&state=' + this.state)
    },
    reset () {
      this.$router.push('/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=')
    },
    deleteStaff (id) {
      this.$confirm('是否删除该员工, 删除后相关的结算信息不保留?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        staff.delete({
          staff_id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$winReload()
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
    station.list({
      type: 2
    }).then((res) => {
      this.departmentArr = res.data.data
    })
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/staff/staffList.less";
</style>
