<template>
  <div id='staffSettle'
    class='indexMain'
    v-loading="loading">
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
                  @change="init"
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
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工部门</div>
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
                <div class="label noWarp">
                  <i class="el-icon-caret-right"
                    v-if="!item.checked"
                    @click="item.checked=true"></i>
                  <i class="el-icon-caret-bottom"
                    v-if="item.checked"
                    @click="item.checked=false"></i>
                  {{item.staff_code}}
                </div>
              </div>
              <div class="box">
                <div class="label">{{item.name}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.department_name}}</div>
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
                <div class="label">{{item.child_data.length>0?item.child_data[0].complete_time:"-"}}</div>
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
                    <!-- <span class="addIcon"
                      @click="addExtra(item)">
                      <i class="el-icon-circle-plus"></i>
                    </span> -->
                  </span>
                </div>
              </div>
              <div class="normalLine"
                v-for="(itemExtra,indexExtra) in item.extra"
                :key="indexExtra+'额外部分'">
                <div class="leftCtn">
                  <!-- <el-input class="inputs"
                    placeholder="费用名称"
                    v-if="itemExtra.edit"
                    v-model="itemExtra.reason"></el-input>
                     v-if="!itemExtra.edit" -->
                  <span class="text">{{itemExtra.reason}}</span>
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
                    <!-- <span class="opr red"
                      @click="deleteExtra(item,indexExtra)">删除</span> -->
                  </span>
                </div>
              </div>
              <div class="titleLine">
                <div class="leftCtn">
                  <span class="text">扣除部分
                    <!-- <span class="addIcon"
                      @click="addDeduct(item)">
                      <i class="el-icon-circle-plus"></i>
                    </span> -->
                  </span>
                </div>
              </div>
              <div class="normalLine"
                v-for="(itemDeduct,indexDeduct) in item.deduct"
                :key="indexDeduct+'扣除部分'">
                <div class="leftCtn">
                  <!-- <el-input class="inputs"
                    placeholder="费用名称"
                    v-if="itemDeduct.edit"
                    v-model="itemDeduct.reason"></el-input>
                     v-if="!itemDeduct.edit" -->
                  <span class="text">{{itemDeduct.reason}}</span>
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
                    <!-- <span class="opr red"
                      @click="deleteDeduct(item,indexDeduct)">删除</span> -->
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
        if (res.data.data) {
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
            item.extra = [
              {
                edit: true,
                reason: '基本工资',
                price: 0
              }, {
                edit: true,
                reason: '加班工资',
                price: 0
              }, {
                edit: true,
                reason: '劳务工资',
                price: 0
              }, {
                edit: true,
                reason: '生活补贴',
                price: 0
              }, {
                edit: true,
                reason: '其他',
                price: 0
              }
            ]
            item.deduct = [
              {
                edit: true,
                reason: '养老金',
                price: 0
              },
              {
                edit: true,
                reason: '个税',
                price: 0
              },
              {
                edit: true,
                reason: '其他',
                price: 0
              }
            ]
            item.deduct_data.forEach(itemInner => {
              if (itemInner.type === 1) {
                let flag1 = item.extra.find(val => val.reason === itemInner.reason)
                if (flag1) {
                  flag1.price = itemInner.price
                  flag1.edit = false
                }
              } else {
                let flag2 = item.deduct.find(val => val.reason === itemInner.reason)
                if (flag2) {
                  flag2.price = itemInner.price
                  flag2.edit = false
                }
              }
            })
            // item.extra = item.deduct_data.filter((item) => item.type === 1)
            // if (item.deduct_data.length === 0) {
            // }
            item.extra_price = item.extra.reduce((total, current) => {
              return total + current.price
            }, 0)
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
      // staff.payList({
      //   staff_id: this.staffAllList.filter((item) => item.checked).map((item) => item.id)
      // }).then((res) => {
      //   this.list = res.data.data.map((item) => {
      //     item.checked = false
      //     item.total = [{
      //       reason: '按时结算总计',
      //       price: item.child_data.reduce((total, current) => {
      //         if (current.settle_type === '按时结算' || current.settle_type === '按日结算' || current.settle_type === '按月结算') {
      //           return Number(current.total_price) + total
      //         } else {
      //           return total
      //         }
      //       }, 0)
      //     }, {
      //       reason: '订单/其他方式结算',
      //       price: item.child_data.reduce((total, current) => {
      //         if (current.settle_type !== '按时结算' && current.settle_type !== '按日结算' && current.settle_type !== '按月结算') {
      //           return Number(current.total_price) + total
      //         } else {
      //           return total
      //         }
      //       }, 0)
      //     }]
      //     item.price = item.total.reduce((total, current) => {
      //       return total + current.price
      //     }, 0)
      //     item.extra = item.deduct_data.filter((item) => item.type === 1)
      //     if (item.deduct_data.length === 0) {
      //       item.extra = [{
      //         edit: true,
      //         reason: '加班工资',
      //         price: 0
      //       }]
      //     }
      //     item.extra_price = item.extra.reduce((total, current) => {
      //       return total + current.price
      //     }, 0)
      //     item.deduct = item.deduct_data.filter((item) => item.type === 2)
      //     if (item.deduct_data.length === 0) {
      //       item.deduct = [{
      //         edit: true,
      //         reason: '五险一金',
      //         price: 0
      //       }]
      //     }
      //     item.deduct_price = item.deduct.reduce((total, current) => {
      //       return total + current.price
      //     }, 0)
      //     item.realityTotal = item.total.reduce((total, current) => {
      //       return current.price + total
      //     }, 0) + item.extra.reduce((total, current) => {
      //       return current.price + total
      //     }, 0) - item.deduct.reduce((total, current) => {
      //       return current.price + total
      //     }, 0)
      //     return item
      //   })
      //   this.loading = false
      // })
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
    this.date = now.getFullYear() + '-' + (now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1))
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
