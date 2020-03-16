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
              <span class="state">在职</span>
            </div>
            <div class="block">在职时间：{{staffInfo.work_time}}</div>
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
              <div class="content">{{staffInfo.sex}}</div>
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
              <div class="content">{{staffInfo.station_name}}</div>
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
              <div class="content">{{staffInfo.type}}</div>
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
        <span class="title hasBorder">员工结算单信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="block">
              <div class="selectCtn">
                <el-date-picker v-model="date"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择结算时间">
                </el-date-picker>
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
                  <div class="tcolumn">单价</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">合计金额</div>
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
        child_data: []
      },
      payInfo: [],
      date: ''
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
      let findMonth = findYear.childrenMergeInfo.find((item) => item.month === month)
      return findMonth ? findMonth.childrenMergeInfo : []
    },
    payTotal () {
      return this.payList.reduce((total, current) => {
        return Number(current.total_price) + total
      }, 0)
    }
  },
  mounted () {
    staff.detail({
      id: this.$route.params.id
    }).then((res) => {
      this.staffInfo = res.data.data
      this.payInfo = this.$mergeData(this.staffInfo.child_data, { mainRule: 'year', childrenRule: { mainRule: 'month' } })
      console.log(this.payInfo)
      this.date = this.$getTime(new Date())
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/staff/staffDetail.less";
</style>
