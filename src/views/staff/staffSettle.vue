<template>
  <div id='staffSettle'
    class='indexMain'
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=')">
        <span class="icon staffList"></span>
        <span class="name">员工列表</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/staff/staffPay')">
        <span class="icon staffDay"></span>
        <span class="name">日常工资结算</span>
      </div>
      <div class="cut_item active">
        <span class="icon staffTotal"></span>
        <span class="name">合计工资结算</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">合计工资结算单</span>
        <div class="titleBtnCtn">
          <div class="btn btnWhiteBlue"
            @click="$openUrl('/staffAnnualTable?year=' + date.split('-')[0] + '&month=' + date.split('-')[1] + '&departmentId=' + department)">打印</div>
          <div class="btn btnWhiteBlue"
            @click="showPopup=true">添加结算人员</div>
        </div>
      </div>
      <div class="listCtn hasBorder_top">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-select @change="getList"
                class='filter_item'
                v-model="department"
                clearable
                placeholder="请选择部门">
                <el-option v-for="(item,index) in departmentArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-date-picker v-model="date"
                class='filter_item'
                @change="init"
                :clearable="false"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择结算月份">
              </el-date-picker>

            </div>
          </div>
        </div>
        <div class="list">
          <el-table :data="list"
            border
            style="width: 100%">
            <el-table-column fixed
              prop="name"
              label="姓名"
              width="150">
            </el-table-column>
            <el-table-column label="基本工资"
              align='center'
              width="950">
              <el-table-column prop="wage_hourly"
                label="计时总计"
                width="150">
              </el-table-column>
              <el-table-column prop="wage_order_other"
                label="订单/其它方式结算"
                width="150">
              </el-table-column>
              <el-table-column prop="wage_basic"
                label="基本工资"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.wage_basic"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.wage_basic}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="wage_extra_work"
                label="加班工资"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.wage_extra_work"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.wage_extra_work}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="wage_labor"
                label="劳务工资"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.wage_labor"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.wage_labor}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="wage_live_allow"
                label="生活补贴"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.wage_live_allow"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.wage_live_allow}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="wage_other"
                label="其它"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.wage_other"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.wage_other}}
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="扣除部分"
              align='center'
              width="450">
              <el-table-column prop="deduct_annuity"
                label="养老金"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.deduct_annuity"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.deduct_annuity}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="deduct_income_tax"
                label="个税"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.deduct_income_tax"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.deduct_income_tax}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="deduct_other"
                label="其它"
                width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <zh-input v-model="scope.row.deduct_other"
                      placeholder='金额'></zh-input>
                  </template>
                  <template v-else>
                    {{scope.row.deduct_other}}
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="reality_wage"
              label="实发工资"
              width="150">
            </el-table-column>
            <el-table-column fixed="right"
              align="center"
              label="操作"
              width="150">
              <div slot-scope="scope"
                class="display:flex">
                <span class="btn noBorder orange"
                  v-if="!scope.row.isEdit"
                  @click="scope.row.isEdit = true">修改</span>
                <span class="btn noBorder"
                  v-else
                  @click="scope.row.isEdit = false">完成</span>
                <span class="btn noBorder red"
                  v-if="!scope.row.isEdit">删除</span>
                <span class="btn noBorder"
                  v-else
                  @click="scope.row.isEdit = false">取消</span>
              </div>
            </el-table-column>
          </el-table>

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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$router.push('/staff/staffPay')">转至日常结算</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <div class="main"
        style="width:800px">
        <div class="title">
          <div class="text">添加结算人员</div>
          <i class="el-icon-close"
            @click="showPopup=false"></i>
        </div>
        <div class="content"
          style="padding:16px 30px">
          <div class="row">
            <div class="info">
              <el-select style="width:180px"
                v-model="departmentPopup"
                placeholder="选择部门筛选人员"
                clearable>
                <el-option v-for="(item,index) in departmentArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select style="margin-left:16px;width:180px"
                v-model="staffTagKeyWord"
                placeholder="选择标签筛选人员"
                clearable>
                <el-option v-for="(item,index) in staffTagList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <span class="tableCtnLv2">
                <span class="tb_header min40">
                  <span class="tb_row"
                    style="flex:0.4">
                    <el-checkbox v-model="isCheckedAll"
                      @change="$forceUpdate()"></el-checkbox>
                  </span>
                  <span class="tb_row">所属部门</span>
                  <span class="tb_row">姓名</span>
                  <span class="tb_row"
                    style="flex:2.5">所含标签</span>
                  <span class="tb_row"
                    style="flex:0.4"> </span>
                </span>
                <span class="tb_content_box">
                  <span class="tb_content min40"
                    v-for="(item,index) in staffAllArr"
                    :key="index">
                    <span class="tb_row"
                      style="flex:0.4">
                      <el-checkbox v-model="item.checked"
                        @change="$forceUpdate()"></el-checkbox>
                    </span>
                    <span class="tb_row">{{item.department_name}}</span>
                    <span class="tb_row">{{item.name}}</span>
                    <span class="tb_row tb_row_tag_box"
                      style="flex:2.5">
                      <template v-for="(itemTag,indexTag) in item.staff_tag">
                        <!-- <span class="tb_row_tag"
                          :key="indexTag"
                          v-if="indexTag < 5">{{itemTag}}</span> -->
                        <el-tag :key="indexTag"
                          v-if="indexTag < 3"
                          style="height:24px;line-height:24px;margin-right:8px">{{itemTag}}</el-tag>
                      </template>
                    </span>
                    <span class="tb_row"
                      style="flex:0.4">
                      <el-popover placement="right"
                        v-if="item.staff_tag.length>3"
                        width="200"
                        trigger="click">
                        <el-tag v-for="(itemTag,indexTag) in item.staff_tag"
                          :key="indexTag"
                          style="height:24px;line-height:24px;margin-right:8px">{{itemTag}}</el-tag>
                        <span class="btn noBorder"
                          style="padding:0"
                          slot="reference">更多</span>
                      </el-popover>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showPopup=false">取消</div>
          <div class="btn btnBlue"
            @click="checkStaff">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff, station, staffTag } from '@/assets/js/api.js'
export default {
  data () {
    return {
      showPopup: false,
      loading: true,
      department: '',
      departmentPopup: '',
      departmentArr: [],
      date: '',
      list: [],
      page: 1,
      total: 1,
      staffAllList: [],
      isCheckedAll: false,
      staffTagList: [],
      staffTagKeyWord: ''
    }
  },
  methods: {
    updateRow (item) {
      console.log(item)
    },
    init () {
      this.loading = true
      staff.getMonthStaffUser({
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1])
      }).then(res => {
        if (res.data.status !== false && res.data.data) {
          let filterUser = res.data.data.staff_data ? JSON.parse(res.data.data.staff_data) : []
          this.staffAllList.forEach(item => {
            if (filterUser.indexOf(item.id) !== -1) {
              item.checked = true
            }
          })
          this.getList()
        } else {
          this.list = []
          this.loading = false
        }
      })
    },
    addExtra (item) {
      item.extra.push({
        edit: true,
        reason: '',
        price: ''
      })
    },
    addDeduct (item) {
      item.deduct.push({
        edit: true,
        reason: '',
        price: ''
      })
    },
    deleteExtra (item, index) {
      this.$confirm('是否删除该工资结算信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        staff.deleteOtherPay({
          id: item.id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            item.extra.splice(index, 1)
            this.cmpTotal(item)
            this.loading = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteDeduct (item, index) {
      this.$confirm('是否删除该工资结算信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        staff.deleteOtherPay({
          id: item.id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            item.extra.splice(index, 1)
            this.cmpTotal(item)
            this.loading = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveExtra (item, itemFather) {
      if (!item.reason) {
        this.$message.error('请输入费用名称')
        return
      }
      if (!item.price) {
        this.$messsage.error('请输入费用金额')
        return
      }
      this.loading = true
      staff.createOtherPay({
        id: item.id, // 修改的时候id不为空
        staff_id: itemFather.id,
        type: 1,
        reason: item.reason,
        price: item.price,
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1])
      }).then((res) => {
        if (res.data.status) {
          if (!item.id) {
            this.$message.success('添加成功')
            itemFather.extra_price = itemFather.extra_price + Number(item.price)
            itemFather.price = itemFather.price + Number(item.price)
          } else {
            this.$message.success('修改成功')
          }
          item.edit = false
          this.loading = false
        }
      })
    },
    saveDeduct (item, itemFather) {
      if (!item.reason) {
        this.$message.error('请输入扣款名称')
        return
      }
      if (!item.price) {
        this.$messsage.error('请输入扣款金额')
        return
      }
      this.loading = true
      staff.createOtherPay({
        id: item.id, // 修改的时候id不为空
        staff_id: itemFather.id,
        type: 2,
        reason: item.reason,
        price: item.price,
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1])
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣除成功')
          itemFather.deduct_price = itemFather.deduct_price + Number(item.price)
          itemFather.price = itemFather.price - item.price
        } else {
          this.$message.success('修改成功')
        }
        item.edit = false
        this.loading = false
      })
    },
    updateExtra (item) {
      item.edit = true
      this.$forceUpdate()
    },
    updateDeduct (item) {
      item.edit = true
      this.$forceUpdate()
    },
    cmpTotal (item) {
      item.realityTotal = item.total.reduce((total, current) => {
        return current.price + total
      }, 0) + item.extra.reduce((total, current) => {
        return Number(current.price) + total
      }, 0) - item.deduct.reduce((total, current) => {
        return Number(current.price) + total
      }, 0)
    },
    getList () {
      this.loading = true
      this.noPage = false
      if (this.department) {
        this.departmentPopup = this.department
      }
      staff.payList({
        page: this.page,
        limit: 10,
        department_id: this.department,
        year: this.date.split('-')[0],
        month: Math.round(this.date.split('-')[1])
      }).then((res) => {
        if (res.data.status !== false) {
          this.list = res.data.data.map((item) => {
            const hourluWage = item.child_data.reduce((total, current) => {
              if (current.settle_type === '按时结算' || current.settle_type === '按日结算' || current.settle_type === '按月结算') {
                return Number(current.total_price) + total
              } else {
                return total
              }
            }, 0)
            const orderOtherWage = item.child_data.reduce((total, current) => {
              if (current.settle_type !== '按时结算' && current.settle_type !== '按日结算' && current.settle_type !== '按月结算') {
                return Number(current.total_price) + total
              } else {
                return total
              }
            }, 0)
            const wageList = item.deduct_data.filter(itemF => itemF.type === 1)
            const deductList = wageList.filter(itemF => itemF.type === 2)
            const basicWage = wageList.find(itemF => itemF.reason === '基本工资')
            const extraWorkWage = wageList.find(itemF => itemF.reason === '加班工资')
            const laborWage = wageList.find(itemF => itemF.reason === '劳务工资')
            const liveAllowWage = wageList.find(itemF => itemF.reason === '生活补贴')
            const otherWage = wageList.find(itemF => itemF.reason === '其他')
            const annuityDeduct = deductList.find(itemF => itemF.reason === '养老金')
            const incomeTaxDeduct = deductList.find(itemF => itemF.reason === '个税')
            const otherDeduct = deductList.find(itemF => itemF.reason === '其它')
            return {
              isEdit: false,
              name: item.name,
              id: item.id,
              wage_hourly: hourluWage || 0,
              wage_order_other: orderOtherWage || 0,
              wage_basic: basicWage ? basicWage.price : '',
              wage_extra_work: extraWorkWage ? extraWorkWage.price : '',
              wage_labor: laborWage ? laborWage.price : '',
              wage_live_allow: liveAllowWage ? liveAllowWage.price : '',
              wage_other: otherWage ? otherWage.price : '',
              deduct_annuity: annuityDeduct ? annuityDeduct.price : '',
              deduct_income_tax: incomeTaxDeduct ? incomeTaxDeduct.price : '',
              deduct_other: otherDeduct ? otherDeduct.price : '',
              reality_wage: this.$toFixed(([
                hourluWage || 0,
                orderOtherWage || 0,
                basicWage ? basicWage.price : 0,
                extraWorkWage ? extraWorkWage.price : 0,
                laborWage ? laborWage.price : 0,
                liveAllowWage ? liveAllowWage.price : 0,
                otherWage ? otherWage.price : 0
              ].reduce((a, b) => {
                return Number(a) + Number(b)
              }, 0)) - ([
                annuityDeduct ? annuityDeduct.price : 0,
                incomeTaxDeduct ? incomeTaxDeduct.price : 0,
                otherDeduct ? otherDeduct.price : 0
              ].reduce((a, b) => {
                return Number(a) + Number(b)
              }, 0)))
            }
          })
          this.total = res.data.meta.total
        }
        this.loading = false
      })
    },
    checkStaff () {
      this.loading = true
      this.showPopup = false
      staff.settingMonthStaffUser({
        staff_data: this.staffAllList.filter((item) => item.checked).map((item) => item.id),
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1])
      }).then((res) => {
        if (res.data.stauts !== false) {
          this.$message.success('已成功为您更新' + this.date + '的人员结算信息')
          this.init()
        } else {
          this.loading = false
        }
      })
    }
  },
  computed: {
    staffAllArr () {
      let filterArr = this.staffAllList
      if (this.departmentPopup) {
        filterArr = filterArr.filter((item) => {
          return Number(item.department_id) === Number(this.departmentPopup)
        })
      }
      if (this.staffTagKeyWord) {
        filterArr = filterArr.filter((item) => {
          return item.staff_tag.indexOf(this.staffTagKeyWord) !== -1
        })
      }
      return filterArr
    }
  },
  mounted () {
    // 设置默认日期
    let now = new Date()
    this.date = now.getFullYear() + '-' + (now.getMonth() < 9 ? ('0' + (now.getMonth())) : (now.getMonth()))
    this.init()
    Promise.all([
      station.list({
        type: 2
      }),
      staff.list(),
      staffTag.list()
    ]).then((res) => {
      this.departmentArr = res[0].data.data
      this.staffAllList = res[1].data.data
      this.staffTagList = res[2].data.data
    })
  },
  watch: {
    isCheckedAll (newVal) {
      this.staffAllList.forEach(item => {
        if (!this.departmentPopup && !this.staffTagKeyWord) {
          item.checked = newVal
          this.$forceUpdate()
        } else if (this.departmentPopup && !this.staffTagKeyWord && item.department_id === this.departmentPopup) {
          item.checked = newVal
          this.$forceUpdate()
        } else if (this.departmentPopup && this.staffTagKeyWord && item.department_id === this.departmentPopup && item.staff_tag.indexOf(this.staffTagKeyWord) !== -1) {
          item.checked = newVal
          this.$forceUpdate()
        } else if (!this.departmentPopup && this.staffTagKeyWord && item.staff_tag.indexOf(this.staffTagKeyWord) !== -1) {
          item.checked = newVal
          this.$forceUpdate()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/staff/staffSettle.less";
</style>
