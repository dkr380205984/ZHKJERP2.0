<template>
  <div id='staffSettle'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">合计工资结算单</span>
      </div>
      <div class="detailCtn">
        <div class="excelTable">
          <div class="title">
            <div class="block">
              <div class="selectCtn">
                <el-select @change="getList"
                  v-model="department"
                  clearable
                  placeholder="请选择部门">
                  <el-option v-for="(item,index) in departmentArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="selectCtn"
                style="width:auto">
                <span class="label"
                  style="margin-left:15px">请选择结算月份：</span>
                <el-date-picker v-model="date"
                  @change="getList"
                  :clearable="false"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择结算月份">
                </el-date-picker>
              </div>
            </div>
            <!-- <div class="block">合计</div> -->
          </div>
          <div class="tabelBodyCtn">
            <div class="tabelBodyMain hasBorder">
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">结算工资(元)</div>
              </div>
              <div class="box">
                <div class="label">额外部分(元)</div>
              </div>
              <div class="box">
                <div class="label">扣除部分(元)</div>
              </div>
              <div class="box">
                <div class="label">实发工资(元)</div>
              </div>
              <div class="box">
                <div class="label">更新日期</div>
              </div>
            </div>
          </div>
          <div class="tabelBodyCtn"
            v-for="(item,index) in list"
            :key="index">
            <div class="tabelBodyMain"
              :class="{'hasBorder':index<list.length-1}">
              <div class="box">
                <div class="label">
                  <i class="el-icon-caret-right"
                    v-if="!item.checked"
                    @click="item.checked=true"></i>
                  <i class="el-icon-caret-bottom"
                    v-if="item.checked"
                    @click="item.checked=false"></i>
                  {{item.name}}
                </div>
              </div>
              <div class="box">
                <div class="label">{{item.staff_code}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.price}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.extra_price}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.deduct_price}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.realityTotal}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.updated_at}}</div>
              </div>
            </div>
            <div class="tableBodyList"
              v-show="item.checked">
              <div class="titleLine">
                <div class="leftCtn">
                  <span class="text">结算工资</span>
                </div>
                <div class="rightCtn">
                  <span class="text">金额(元)</span>
                  <span class="text oprCtn">操作</span>
                </div>
              </div>
              <div class="normalLine"
                v-for="(itemChild,indexChild) in item.total"
                :key="indexChild + '结算工资'">
                <div class="leftCtn">
                  <span class="text">{{itemChild.reason}}</span>
                </div>
                <div class="middleCtn">
                  ………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………
                </div>
                <div class="rightCtn">
                  <span class="text">{{itemChild.price}}</span>
                  <span class="text oprCtn">
                    <span class="opr blue"
                      @click="$router.push('/staff/staffDetail/'+ item.id)">详情</span>
                  </span>
                </div>
              </div>
              <div class="titleLine">
                <div class="leftCtn">
                  <span class="text">额外部分
                    <span class="addIcon"
                      @click="addExtra(item)">
                      <i class="el-icon-circle-plus"></i>
                    </span>
                  </span>
                </div>
              </div>
              <div class="normalLine"
                v-for="(itemExtra,indexExtra) in item.extra"
                :key="indexExtra+'额外部分'">
                <div class="leftCtn">
                  <el-input class="inputs"
                    placeholder="费用名称"
                    v-if="itemExtra.edit"
                    v-model="itemExtra.reason"></el-input>
                  <span v-if="!itemExtra.edit"
                    class="text">{{itemExtra.reason}}</span>
                </div>
                <div class="middleCtn">
                  ………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………
                </div>
                <div class="rightCtn">
                  <zh-input class="inputs"
                    @change="cmpTotal(item)"
                    placeholder="费用金额"
                    type="number"
                    v-if="itemExtra.edit"
                    v-model="itemExtra.price"></zh-input>
                  <span v-if="!itemExtra.edit"
                    class="text">{{itemExtra.price}}</span>
                  <span class="text oprCtn">
                    <span class="opr orange"
                      v-if="!itemExtra.edit"
                      @click="updateExtra(itemExtra)">修改</span>
                    <span class="opr blue"
                      v-if="itemExtra.edit"
                      @click="saveExtra(itemExtra,item)">完成</span>
                    <span class="opr red"
                      @click="deleteExtra(item,indexExtra)">删除</span>
                  </span>
                </div>
              </div>
              <div class="titleLine">
                <div class="leftCtn">
                  <span class="text">扣除部分
                    <span class="addIcon"
                      @click="addDeduct(item)">
                      <i class="el-icon-circle-plus"></i>
                    </span>
                  </span>
                </div>
              </div>
              <div class="normalLine"
                v-for="(itemDeduct,indexDeduct) in item.deduct"
                :key="indexDeduct+'扣除部分'">
                <div class="leftCtn">
                  <el-input class="inputs"
                    placeholder="费用名称"
                    v-if="itemDeduct.edit"
                    v-model="itemDeduct.reason"></el-input>
                  <span v-if="!itemDeduct.edit"
                    class="text">{{itemDeduct.reason}}</span>
                </div>
                <div class="middleCtn">
                  ………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………
                </div>
                <div class="rightCtn">
                  <zh-input class="inputs"
                    @change="cmpTotal(item)"
                    placeholder="费用金额"
                    type="number"
                    v-if="itemDeduct.edit"
                    v-model="itemDeduct.price"></zh-input>
                  <span v-if="!itemDeduct.edit"
                    class="text">{{itemDeduct.price}}</span>
                  <span class="text oprCtn">
                    <span class="opr orange"
                      v-if="!itemDeduct.edit"
                      @click="updateDeduct(itemDeduct)">修改</span>
                    <span class="opr blue"
                      @click="saveDeduct(itemDeduct,item)"
                      v-if="itemDeduct.edit">完成</span>
                    <span class="opr red"
                      @click="deleteDeduct(item,indexDeduct)">删除</span>
                  </span>
                </div>
              </div>
              <div class="titleLine">
                <div class="leftCtn">
                  <span class="text">实发工资</span>
                </div>
                <div class="rightCtn">
                  <span class="text oprCtn">金额</span>
                </div>
              </div>
              <div class="normalLine">
                <div class="leftCtn">
                  <span class="text">实发工资</span></div>
                <div class="middleCtn">
                  ………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………
                </div>
                <div class="rightCtn">
                  <span class="text oprCtn">{{item.realityTotal}}</span></div>
              </div>
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff, station } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      department: '',
      departmentArr: [],
      date: '',
      list: [],
      page: 1,
      total: 1
    }
  },
  methods: {
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
      staff.payList({
        page: this.page,
        limit: 10,
        department_id: this.department,
        year: this.date.split('-')[0],
        month: Math.round(this.date.split('-')[1])
      }).then((res) => {
        this.list = res.data.data.map((item) => {
          item.checked = false
          item.total = [{
            reason: '按时结算总计',
            price: item.child_data.reduce((total, current) => {
              if (current.settle_type === '按时结算' || current.settle_type === '按日结算' || current.settle_type === '按月结算') {
                return Number(current.total_price) + total
              } else {
                return total
              }
            }, 0)
          }, {
            reason: '订单/其他方式结算',
            price: item.child_data.reduce((total, current) => {
              if (current.settle_type !== '按时结算' && current.settle_type !== '按日结算' && current.settle_type !== '按月结算') {
                return Number(current.total_price) + total
              } else {
                return total
              }
            }, 0)
          }]
          item.price = item.total.reduce((total, current) => {
            return total + current.price
          }, 0)
          item.extra = item.deduct_data.filter((item) => item.type === 1)
          if (item.deduct_data.length === 0) {
            item.extra = [{
              edit: true,
              reason: '加班工资',
              price: 0
            }]
          }
          item.extra_price = item.extra.reduce((total, current) => {
            return total + current.price
          }, 0)
          item.deduct = item.deduct_data.filter((item) => item.type === 2)
          if (item.deduct_data.length === 0) {
            item.deduct = [{
              edit: true,
              reason: '五险一金',
              price: 0
            }]
          }
          item.deduct_price = item.deduct.reduce((total, current) => {
            return total + current.price
          }, 0)
          item.realityTotal = item.total.reduce((total, current) => {
            return current.price + total
          }, 0) + item.extra.reduce((total, current) => {
            return current.price + total
          }, 0) - item.deduct.reduce((total, current) => {
            return current.price + total
          }, 0)
          return item
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    }
  },
  mounted () {
    // 设置默认日期
    let now = new Date()
    this.date = now.getFullYear() + '-' + (now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1))
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
@import "~@/assets/less/staff/staffSettle.less";
</style>
