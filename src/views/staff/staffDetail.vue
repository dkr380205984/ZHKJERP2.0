<template>
  <div id="staffDetail"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">员工信息</span>
      </div>
      <div class="detailCtn">
        <div class="excelTable">
          <div class="title">
            <div class="block">
              <span class="username">{{staffInfo.name}}</span>
              <span class="state">入职</span>
            </div>
            <div class="block">入职时间：{{staffInfo.work_time}}</div>
          </div>
          <div class="tabelBody">
            <div class="box">
              <div class="label">员工编号：</div>
              <div class="content">{{staffInfo.staff_code}}</div>
            </div>
            <div class="box">
              <div class="label">年龄：</div>
              <div class="content">{{staffInfo.age}}</div>
            </div>
            <div class="box">
              <div class="label">性别：</div>
              <div class="content">{{staffInfo.sex === 1?'男':'女'}}</div>
            </div>
          </div>
          <div class="tabelBody">
            <div class="box">
              <div class="label">民族：</div>
              <div class="content">{{staffInfo.nation}}</div>
            </div>
            <div class="box">
              <div class="label">地址：</div>
              <div class="content">{{staffInfo.address}}</div>
            </div>
            <div class="box">
              <div class="label">学历：</div>
              <div class="content">{{staffInfo.academic}}</div>
            </div>
          </div>
          <div class="tabelBody">
            <div class="box">
              <div class="label">联系电话：</div>
              <div class="content">{{staffInfo.phone}}</div>
            </div>
            <div class="box">
              <div class="label">所属部门：</div>
              <div class="content">{{staffInfo.department_name}}</div>
            </div>
            <div class="box">
              <div class="label">岗位：</div>
              <div class="content">{{staffInfo.station_id}}</div>
            </div>
          </div>
          <div class="tabelBody">
            <div class="box">
              <div class="label">银行名称：</div>
              <div class="content">{{staffInfo.bank_card_name}}</div>
            </div>
            <div class="box">
              <div class="label">银行卡号：</div>
              <div class="content">{{staffInfo.bank_card_code}}</div>
            </div>
            <div class="box">
              <div class="label">身份证号：</div>
              <div class="content">{{staffInfo.id_card}}</div>
            </div>
          </div>
          <div class="tabelBody">
            <div class="box">
              <div class="label">健康状态：</div>
              <div class="content">{{staffInfo.healthy_info}}</div>
            </div>
            <div class="box">
              <div class="label">紧急电话：</div>
              <div class="content">{{staffInfo.urgent_phone}}</div>
            </div>
            <div class="box">
              <div class="label">工种：</div>
              <div class="content">{{staffInfo.type=== 1?'合同工':'临时工'}}</div>
            </div>
          </div>
          <div class="tabelBody">
            <div class="box">
              <div class="label"
                style="max-width:132px">备注信息：</div>
              <div class="content">{{staffInfo.desc}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">日常工资结算表</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="block">
              <div class="selectCtn">
                <el-tabs v-model="date"
                  type="card">
                  <el-tab-pane v-for="(item,index) in yearMonth"
                    :key="index"
                    :name="item.date"
                    :label="item.name"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">日期</div>
                  <div class="tcolumn">工序</div>
                  <div class="tcolumn">结算方式</div>
                  <div class="tcolumn">单价(元)</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">合计金额(元)</div>
                  <div class="tcolumn">备注信息</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in payList"
                  :key="index">
                  <div class="tcolumn">{{item.complete_time}}</div>
                  <div class="tcolumn">{{item.work_type}}</div>
                  <div class="tcolumn">{{item.settle_type}}</div>
                  <div class="tcolumn">{{item.price}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{item.total_price}}</div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn"></div>
                </div>
              </div>
              <div class="thead"
                style="border-bottom:0">
                <div class="trow">
                  <div class="tcolumn"
                    style="display:flex;justify-content:space-between;line-height:54px;flex-direction: row;padding-right:44px">
                    <span style="font-size:20px">总计</span>
                    <span style="color:#1595ff;font-size:20px">{{payTotal}}元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">合计工资结算单</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="block">
              <div class="selectCtn">
                <el-tabs v-model="otherDate"
                  type="card">
                  <el-tab-pane v-for="(item,index) in payOtherInfo"
                    :key="index"
                    :name="item.year+'-'+item.month"
                    :label="item.year + '年' + Number(item.month) + '月份结算单'"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">结算工资(元)</div>
                  <div class="tcolumn">额外工资(元)</div>
                  <div class="tcolumn">扣除工资(元)</div>
                  <div class="tcolumn">实发工资(元)</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcolumn">{{otherpayJSON.total_price}}</div>
                  <div class="tcolumn">{{otherpayJSON.extra_price}}</div>
                  <div class="tcolumn">{{otherpayJSON.deduct_price}}</div>
                  <div class="tcolumn">{{otherpayJSON.total_price + otherpayJSON.extra_price - otherpayJSON.deduct_price}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff } from '@/assets/js/api.js'
export default {
  data () {
    return {
      staffInfo: {
        name: '',
        department_name: '',
        phone: '',
        age: '',
        id_card: '',
        sex: '',
        bank_card_name: '',
        bank_card_code: '',
        station_name: '',
        healthy_info: '',
        urgent_phone: '',
        work_time: '',
        desc: '',
        staff_code: '',
        child_data: [],
        nation: '',
        address: '',
        academic: ''
      },
      payInfo: [],
      payOtherInfo: [],
      date: '',
      otherDate: ''
    }
  },
  computed: {
    payList () {
      let year = this.date.split('-')[0]
      let month = this.date.split('-')[1]
      let findYear = this.payInfo.find((item) => item.year === year)
      if (!findYear) {
        return []
      }
      let findMonth = findYear.childrenMergeInfo.find((item) => Number(item.month) === Number(month))
      return findMonth ? findMonth.childrenMergeInfo : []
    },
    otherpayJSON () {
      let year = this.date.split('-')[0]
      let month = this.date.split('-')[1]
      let finded = this.payOtherInfo.find((item) => item.month === month && item.year === year)
      return finded || {
        total_price: 0,
        deduct_price: 0,
        extra_price: 0
      }
    },
    payTotal () {
      return this.payList.reduce((total, current) => {
        return Number(current.total_price) + total
      }, 0)
    },
    yearMonth () {
      let arr = []
      this.payInfo.forEach((itemYear) => {
        itemYear.childrenMergeInfo.forEach((itemMonth) => {
          arr.push({
            date: itemYear.year + '-' + (Number(itemMonth.month) < 10 ? '0' + Number(itemMonth.month) : Number(itemMonth.month)),
            name: itemYear.year + '年' + Number(itemMonth.month) + '月份结算表'
          })
        })
      })
      return arr
    }
  },
  mounted () {
    staff.detail({
      id: this.$route.params.id
    }).then((res) => {
      this.staffInfo = res.data.data
      this.payInfo = this.$mergeData(this.staffInfo.child_data, { mainRule: 'year', childrenRule: { mainRule: 'month' } })
      let otherPay = this.$mergeData(this.staffInfo.deduct_data, { mainRule: 'year', childrenRule: { mainRule: 'month' } })
      otherPay.forEach((itemYear) => {
        itemYear.childrenMergeInfo.forEach((itemMonth) => {
          itemMonth.month = Number(itemMonth.month) < 10 ? '0' + Number(itemMonth.month) : Number(itemMonth.month)
          this.payOtherInfo.push({
            year: itemYear.year,
            month: itemMonth.month,
            total_price: this.staffInfo.child_data.filter((item) => Number(item.year) === Number(itemYear.year) && Number(item.month) === Number(itemMonth.month)).reduce((total, current) => {
              return total + Number(current.total_price)
            }, 0),
            deduct_price: itemMonth.childrenMergeInfo.filter((item) => item.type === 1).reduce((total, current) => {
              return total + Number(current.price)
            }, 0),
            extra_price: itemMonth.childrenMergeInfo.filter((item) => item.type === 2).reduce((total, current) => {
              return total + Number(current.price)
            }, 0)
          })
        })
      })
      console.log(this.payInfo)
      this.date = this.$getTime(new Date()).slice(0, 7)
      this.otherDate = this.$getTime(new Date()).slice(0, 7)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/staff/staffDetail.less";
</style>
