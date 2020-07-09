<template>
  <div class="indexMain"
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item active"
        @click="$router.push('/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="name">员工列表</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/staff/staffPay')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="name">日常工资结算</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/staff/staffSettle')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpinchanliangtongji"></use>
        </svg>
        <span class="name">合计工资结算</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入姓名按回车键查询">
              </el-input>
              <el-select v-model="department"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选部门">
                <el-option v-for="(item,index) in departmentArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="type"
                class="filter_item"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选工种">
                <el-option v-for="(item,index) in typeArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="state"
                class="filter_item"
                style="width:160px"
                @change="changeRouter(1)"
                clearable
                placeholder="筛选员工状态">
                <el-option v-for="(item,index) in stateArr"
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
            @click="$router.push('/staff/staffCreate')">添加员工</div>
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
              <span class="text">部门</span>
            </div>
            <div class="col">
              <span class="text">手机号</span>
            </div>
            <div class="col">
              <span class="text">工种</span>
            </div>
            <div class="col">
              <span class="text">入职时间</span>
            </div>
            <div class="col">
              <span class="text">员工状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">
              <span class="text">{{item.staff_code}}</span>
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
              <span class="text"
                :style="{'color':item.status===1?'#1a95ff':'#E6A23C'}">{{item.status===1?'在职':'离职'}}</span>
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
                    <el-dropdown-item @click.native="showBan(item.id)">
                      <span class="create">离职</span>
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
      <div class="popup"
        v-show="banFlag">
        <div class="main">
          <div class="title">
            <div class="text">填写离职信息</div>
            <i class="el-icon-close"
              @click="banFlag=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">离职时间：</div>
              <div class="info">
                <el-date-picker v-model="banDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择离职时间">
                </el-date-picker>
              </div>
            </div>
            <div class="row">
              <div class="label">离职原因：</div>
              <div class="info">
                <el-input placeholder="请输入离职原因"
                  v-model="banReason"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="banFlag = false">取消</div>
            <div class="btn btnBlue"
              @click="banStaff">确定</div>
          </div>
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
      stateArr: [
        {
          name: '在职',
          id: '1'
        },
        {
          name: '离职',
          id: '2'
        }
      ],
      department: '',
      departmentArr: [],
      type: '',
      typeArr: [{
        value: '1',
        name: '合同工'
      }, {
        value: '2',
        name: '临时工'
      }],
      keyword: '',
      total: 1,
      page: 1,
      list: [],
      staffId: '',
      banReason: '',
      banDate: '',
      banFlag: false
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
        state: this.state,
        type: this.type,
        department_id: this.department,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        limit: 10,
        page: this.page
      }).then((res) => {
        this.list = res.data.data
        this.total = res.data.meta.total
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
      this.department = Number(params.department) || ''
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
    },
    showBan (id) {
      this.staffId = id
      this.banFlag = true
    },
    banStaff () {
      console.log(this.banDate)
      staff.ban({
        id: this.staffId,
        leave_reason: this.banReason,
        leave_time: this.banDate
      }).then((res) => {
        this.banFlag = false
        this.$message.success('修改成功')
        this.getList()
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
