<template>
  <div class='printHtml'
    id='staffAnnualTable'
    v-loading='loading'>
    <div class="printTable crosswise"
      v-for="(itemPage,indexPage) in list"
      :key="indexPage">
      <div class="print_head">
        <div class="top">
          <span class="title">{{companyName}}日常工资结算单</span>
        </div>
        <div class="bottom">
          <span>结算月份：{{$route.query.year + '-' + $route.query.month}}</span>
          <span>创建时间：{{$getTime()}}</span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row has_marginBottom">
          <span class="row_item center w180">生产部门</span>
          <span class="row_item left">{{departmentName ? departmentName.name : '所有部门'}}</span>
          <span class="row_item center w180">操作人</span>
          <span class="row_item left">{{userName}}</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item center">员工编号</span>
          <span class="row_item center">姓名</span>
          <span class="row_item flex7 col smallFont">
            <span class="print_row noBorder">
              <span class="row_item center">结算日期</span>
              <span class="row_item center">工序</span>
              <span class="row_item center">结算方式</span>
              <span class="row_item left">单价(元)</span>
              <span class="row_item left">数量</span>
              <span class="row_item left">合计金额(元)</span>
              <span class="row_item left">备注</span>
            </span>
          </span>
          <span class="row_item center">总计</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in itemPage"
          :key="index">
          <span class="row_item center">{{ indexPage * 15 + index + 1}}</span>
          <span class="row_item center">{{item.name}}</span>
          <span class="row_item col flex7">
            <div class="print_row"
              v-for="(itemInner,indexInner) in item.data_info"
              :key="indexInner"
              :class="indexInner === 0 ? 'noBorder' : ''">
              <span class="row_item center">{{$getTime(itemInner.complete_time)}}</span>
              <span class="row_item center">{{itemInner.work_type}}</span>
              <span class="row_item center">{{itemInner.settle_type}}</span>
              <span class="row_item left">{{itemInner.price || 0}}</span>
              <span class="row_item left">{{itemInner.number || 0}}</span>
              <span class="row_item left">{{itemInner.total_price || 0}}</span>
              <span class="row_item left">{{itemInner.desc || '/'}}</span>
            </div>
          </span>
          <span class="row_item center">{{$toFixed(item.totalPrice)}}</span>
        </div>
        <div class="print_row bgGray"
          v-if="indexPage === list.length - 1">
          <span class="row_item center noBorder">合计</span>
          <span class="row_item center noBorder"></span>
          <span class="row_item col flex7 noBorder">
            <div class="print_row noBorder">
              <span class="row_item center noBorder"></span>
              <span class="row_item center noBorder"></span>
              <span class="row_item center noBorder"></span>
              <span class="row_item left noBorder"></span>
              <span class="row_item left noBorder"></span>
              <span class="row_item left noBorder"></span>
              <span class="row_item left noBorder"></span>
            </div>
          </span>
          <span class="row_item center">{{totalPrice}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { company, staff, station } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      companyName: '',
      userName: window.sessionStorage.getItem('user_name'),
      departmentName: '',
      qrCodeUrl: '',
      list: [],
      logDetail: []
    }
  },
  methods: {
    getAllData (page, arr) {
      page = page || 1
      arr = arr || []
      staff.payList({
        limit: 20,
        page: page,
        department_id: this.$route.query.departmentId,
        year: this.$route.query.year,
        month: Number(this.$route.query.month)
      }).then(res => {
        res.data.data.forEach(item => {
          let thisMonthData = item.child_data
          let totalPrice = thisMonthData.map(value => Number(value.total_price) || 0)
          let data = thisMonthData.map(value => {
            return {
              name: item.name,
              code: item.staff_code,
              totalPrice: totalPrice.reduce((a, b) => {
                return a + b
              }, 0),
              ...value
            }
          })
          arr.push(...data)
        })
        let lastPage = res.data.meta.last_page
        if (lastPage > page) {
          page++
          this.getAllData(page, arr)
        } else {
          this.list = this.$newSplice(arr, 14).map(item => this.$mergeData(item, { mainRule: ['code', 'name'], otherRule: [{ name: 'totalPrice' }], childrenName: 'data_info' }))
          let arrList = this.list.map(item => {
            let arr = item.map(itemInner => +itemInner.totalPrice || 0)
            return arr.length > 0 ? arr.reduce((a, b) => {
              return a + b
            }, 0) : 0
          })
          this.totalPrice = arrList.length > 0 ? this.$toFixed(arrList.reduce((a, b) => {
            return a + b
          }, 0)) : 0
          this.loading = false
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      })
    }
  },
  created () {
    Promise.all([
      company.detail(),
      station.list({
        type: 2
      })
    ]).then(res => {
      this.companyName = res[0].data.data.company_name
      this.departmentName = res[1].data.data.find(item => +item.id === +this.$route.query.departmentId)
      this.getAllData()
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/materialOrder/materialOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  filters: {
    filterTotal (item) {
      let arr = [
        item.jijianPrice || 0,
        item.jishiPrice || 0,
        item.jibenPrice ? item.jibenPrice.price : 0,
        item.zhiwuPrice ? item.zhiwuPrice.price : 0,
        item.jiabanPrice ? item.jiabanPrice.price : 0,
        item.shenghuoPrice ? item.shenghuoPrice.price : 0,
        item.otherPrice ? item.otherPrice.price : 0,
        item.yanglaoPrice ? item.yanglaoPrice.price : 0,
        item.geshuiPrice ? item.geshuiPrice.price : 0,
        item.qitaPrice ? item.qitaPrice.price : 0
      ]
      return arr.map(value => Number(value) || 0).reduce((a, b) => {
        return a + b
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/staff/staffAnnualTable.less";
</style>
