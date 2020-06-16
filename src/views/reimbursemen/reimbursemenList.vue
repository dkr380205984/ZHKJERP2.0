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
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
          <div class="rightCtn">
            <div class="btn btnBlue"
              @click="$router.push('/reimbursemen/reimbursemenCreate')">添加报销单</div>
          </div>
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
              <span class="text">
                <span class="text"
                  v-show="!searchUserFlag">申请人
                  <i class="el-icon-search iconBtn"
                    @click="searchUserFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchUserFlag"
                    class="filterBox">
                    <el-select v-model="user_name"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选申请人">
                      <el-option v-for="(item,index) in userArr"
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
              <span class="text">申请报销(元)</span>
            </div>
            <div class="col">
              <span class="text">实际报销(元)</span>
            </div>
            <div class="col">
              <transition v-show="!searchStatusFlag"
                name="el-zoom-in-bottom">
                <span class="text">审核状态
                  <i class="el-icon-search iconBtn"
                    @click="searchStatusFlag=true"></i>
                </span>
              </transition>
              <transition name="el-zoom-in-top">
                <div v-show="searchStatusFlag"
                  class="filterBox">
                  <el-select v-model="status"
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
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">审核人</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">{{item.apply_user}}</div>
            <div class="col">{{item.apply_price}}</div>
            <div class="col">{{item.reality_price || '/'}}</div>
            <div class="col">
              <div :class="['stateCtn', 'rowFlex', item.status === 2 ? 'green' : item.status === 3 ? 'red' : 'blue']">
                <div class="state"></div>
                <span class="name">{{item.status|filterStatus}}</span>
              </div>
            </div>
            <div class="col">{{item.check_user}}</div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/reimbursemen/reimbursemenDetail/' + item.id)">详情</span>
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
export default {
  data () {
    return {
      loading: true,
      keyword: '',
      date: '',
      searchUserFlag: false,
      user_name: '',
      userArr: [],
      searchStatusFlag: false,
      status: '',
      statusArr: [
        {
          name: '待审核',
          id: 1
        }, {
          name: '通过',
          id: 2
        }, {
          name: '驳回',
          id: 3
        }
      ],
      list: [
        {
          code: '1111',
          create_time: '2020-06-05',
          apply_user: '隔壁老王',
          apply_price: 1000,
          reality_price: 800,
          status: 2,
          check_user: '王会计'
        }
      ],
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
    reset () {
      this.$router.push('/reimbursemen.reimbursemenList?keyword=&date=&applyUser=&status=')
    }
  },
  created () {
    this.loading = false
  },
  filters: {
    filterStatus (item) {
      return +item === 2 ? '通过' : +item === 3 ? '驳回' : '待审核'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursemen/reimbursemenList.less";
</style>
