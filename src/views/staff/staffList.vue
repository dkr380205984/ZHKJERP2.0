<template>
  <div class="indexMain">
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
          <div class="row">
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
              <span class="text">在职时间</span>
            </div>
            <div class="col">
              <span class="text">员工状态</span>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/staff/staffDetail/1')">详情</span>
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
      page: 1
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

    },
    // 更新筛选条件
    getFilters () {

    },
    changeRouter (page) {

    },
    reset () {

    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/staff/staffList.less";
</style>
