<template>
  <div id='staffSettle'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">合计工资结算单</span>
      </div>
      <div class="detailCtn">
        <div class="excelTable">
          <div class="title">
            <div class="block">
              <div class="selectCtn">
                <el-select v-model="department"
                  placeholder="请选择部门">
                  <el-option v-for="(item,index) in departmentArr"
                    @change="getList"
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
                <div class="label">合计工资</div>
              </div>
              <div class="box">
                <div class="label">额外部分</div>
              </div>
              <div class="box">
                <div class="label">扣除部分</div>
              </div>
              <div class="box">
                <div class="label">实发工资</div>
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
                <div class="label">合计工资</div>
              </div>
              <div class="box">
                <div class="label">额外部分</div>
              </div>
              <div class="box">
                <div class="label">扣除部分</div>
              </div>
              <div class="box">
                <div class="label">实发工资</div>
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
                  <span class="text">金额</span>
                  <span class="text oprCtn">操作</span>
                </div>
              </div>
              <div class="normalLine"
                v-for="(itemChild,indexChild) in item.total"
                :key="indexChild + '结算工资'">
                <div class="leftCtn">
                  <span class="text">{{itemChild.settle_type}}</span>
                </div>
                <div class="middleCtn">
                  ………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………
                </div>
                <div class="rightCtn">
                  <span class="text">{{itemChild.total_price}}</span>
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
                    v-model="itemExtra.settle_type"></el-input>
                  <span v-if="!itemExtra.edit"
                    class="text">{{itemExtra.settle_type}}</span>
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
                    v-model="itemExtra.total_price"></zh-input>
                  <span v-if="!itemExtra.edit"
                    class="text">{{itemExtra.total_price}}</span>
                  <span class="text oprCtn">
                    <span class="opr blue"
                      @click="saveExtra(itemExtra)">完成</span>
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
                    v-model="itemDeduct.settle_type"></el-input>
                  <span v-if="!itemDeduct.edit"
                    class="text">{{itemDeduct.settle_type}}</span>
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
                    v-model="itemDeduct.total_price"></zh-input>
                  <span v-if="!itemDeduct.edit"
                    class="text">{{itemDeduct.total_price}}</span>
                  <span class="text oprCtn">
                    <span class="opr blue"
                      @click="saveDeduct(itemDeduct)">完成</span>
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
            @change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">提交</div>
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
        settle_type: '',
        total_price: ''
      })
    },
    addDeduct (item) {
      item.deduct.push({
        edit: true,
        settle_type: '',
        total_price: ''
      })
    },
    deleteExtra (item, index) {
      item.extra.splice(index, 1)
      this.cmpTotal(item)
    },
    deleteDeduct (item, index) {
      item.deduct.splice(index, 1)
      this.cmpTotal(item)
    },
    saveExtra (item) {
      if (!item.settle_type) {
        this.$message.error('请输入费用名称')
        return
      }
      if (!item.total_price) {
        this.$messsage.error('请输入费用金额')
        return
      }
      console.log(item)
    },
    saveDeduct (item) {
      if (!item.settle_type) {
        this.$message.error('请输入扣款名称')
        return
      }
      if (!item.total_price) {
        this.$messsage.error('请输入扣款金额')
        return
      }
      console.log(item)
    },
    cmpTotal (item) {
      item.realityTotal = item.total.reduce((total, current) => {
        return current.total_price + total
      }, 0) + item.extra.reduce((total, current) => {
        return Number(current.total_price) + total
      }, 0) - item.deduct.reduce((total, current) => {
        return Number(current.total_price) + total
      }, 0)
    },
    getList () {
      staff.payList({
        page: this.page,
        limit: 10,
        department_id: this.department
      }).then((res) => {
        this.list = res.data.data.map((item) => {
          item.checked = false
          item.total = item.total || [{
            settle_type: '按时结算总计',
            total_price: item.child_data.reduce((total, current) => {
              if (current.settle_type === '按时结算' || current.settle_type === '按日结算' || current.settle_type === '按月结算') {
                return Number(current.total_price) + total
              } else {
                return total
              }
            }, 0)
          }, {
            settle_type: '订单/其他方式结算',
            total_price: item.child_data.reduce((total, current) => {
              if (current.settle_type !== '按时结算' && current.settle_type !== '按日结算' && current.settle_type !== '按月结算') {
                return Number(current.total_price) + total
              } else {
                return total
              }
            }, 0)
          }]
          item.extra = item.extra || []
          item.deduct = item.deduct || []
          item.realityTotal = item.total.reduce((total, current) => {
            return current.total_price + total
          }, 0) + item.extra.reduce((total, current) => {
            return current.total_price + total
          }, 0) + item.deduct.reduce((total, current) => {
            return current.total_price + total
          }, 0)
          return item
        })
        this.total = res.data.meta.total
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
