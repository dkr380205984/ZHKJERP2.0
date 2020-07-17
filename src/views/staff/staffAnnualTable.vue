<template>
  <div class='printHtml'
    id='staffAnnualTable'
    v-loading='loading'>
    <div class="printTable crosswise"
      v-for="(itemPage,indexPage) in list"
      :key="indexPage">
      <div class="print_head">
        <div class="top">
          <span class="title">{{companyName}}合计工资结算单</span>
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
          <span class="row_item center">序号</span>
          <span class="row_item center">姓名</span>
          <span class="row_item flex7 col smallFont">
            <span class="print_row noBorder smallHeight">
              <span class="row_item center">应得部分</span>
            </span>
            <span class="print_row">
              <span class="row_item center">计件工资</span>
              <span class="row_item center">计时工资</span>
              <span class="row_item center">基本工资</span>
              <span class="row_item center">职务工资</span>
              <span class="row_item center">加班工资</span>
              <span class="row_item center">生活补贴</span>
              <span class="row_item center">其他</span>
            </span>
          </span>
          <span class="row_item flex3 col smallFont">
            <span class="print_row noBorder smallHeight">
              <span class="row_item center">扣除部分</span>
            </span>
            <span class="print_row">
              <span class="row_item center">养老金</span>
              <span class="row_item center">个税</span>
              <span class="row_item center">其他</span>
            </span>
          </span>
          <span class="row_item center">实发工资</span>
          <span class="row_item center">签字</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in itemPage"
          :key="index">
          <span class="row_item center">{{ indexPage * 15 + index + 1}}</span>
          <span class="row_item center">{{item.name}}</span>
          <span class="row_item col flex7">
            <div class="print_row noBorder">
              <span class="row_item center">{{$toFixed(item.jijianPrice || 0)}}</span>
              <span class="row_item center">{{$toFixed(item.jishiPrice || 0)}}</span>
              <span class="row_item center">{{item.jibenPrice ? item.jibenPrice.price : 0}}</span>
              <span class="row_item center">{{item.zhiwuPrice ? item.zhiwuPrice.price : 0}}</span>
              <span class="row_item center">{{item.jiabanPrice ? item.jiabanPrice.price : 0}}</span>
              <span class="row_item center">{{item.shenghuoPrice ? item.shenghuoPrice.price : 0}}</span>
              <span class="row_item center">{{item.otherPrice ? item.otherPrice.price : 0}}</span>
            </div>
          </span>
          <span class="row_item col flex3">
            <div class="print_row noBorder">
              <span class="row_item center">{{item.yanglaoPrice ? item.yanglaoPrice.price : 0}}</span>
              <span class="row_item center">{{item.geshuiPrice ? item.geshuiPrice.price : 0}}</span>
              <span class="row_item center">{{item.qitaPrice ? item.qitaPrice.price : 0}}</span>
            </div>
          </span>
          <span class="row_item center">{{filterTotal(item)}}</span>
          <span class="row_item center"></span>
        </div>
        <div class="print_row bgGray"
          v-if="indexPage === list.length - 1">
          <span class="row_item center">合计</span>
          <span class="row_item center"></span>
          <span class="row_item col flex7">
            <div class="print_row noBorder">
              <span class="row_item center"></span>
              <span class="row_item center"></span>
              <span class="row_item center"></span>
              <span class="row_item center"></span>
              <span class="row_item center"></span>
              <span class="row_item center"></span>
              <span class="row_item center"></span>
            </div>
          </span>
          <span class="row_item col flex3">
            <div class="print_row noBorder">
              <span class="row_item center"></span>
              <span class="row_item center"></span>
              <span class="row_item center"></span>
            </div>
          </span>
          <span class="row_item center">{{totalPrice}}</span>
          <span class="row_item center"></span>
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
        let data = res.data.data.map(item => {
          let thisMonthData = item.child_data.filter(itemF => new Date(itemF.complete_time).getMonth() === +this.$route.query.month - 1)
          let jijian = thisMonthData.filter(value => value.settle_type !== '按时结算').map(value => Number(value.total_price))
          let jishi = thisMonthData.filter(value => value.settle_type === '按时结算').map(value => Number(value.total_price))
          let obj = {
            name: item.name,
            jijianPrice: jijian.length > 0 ? jijian.reduce((a, b) => {
              return a + b
            }) : 0,
            jishiPrice: jishi.length > 0 ? jishi.reduce((a, b) => {
              return a + b
            }) : 0,
            jibenPrice: item.deduct_data.find(value => value.type === 1 && value.reason === '基本工资'),
            zhiwuPrice: item.deduct_data.find(value => value.type === 1 && value.reason === '职务工资'),
            jiabanPrice: item.deduct_data.find(value => value.type === 1 && value.reason === '加班工资'),
            shenghuoPrice: item.deduct_data.find(value => value.type === 1 && value.reason === '生活补贴'),
            otherPrice: item.deduct_data.find(value => value.type === 1 && value.reason === '其他'),
            yanglaoPrice: item.deduct_data.find(value => value.type === 2 && value.reason === '养老金'),
            geshuiPrice: item.deduct_data.find(value => value.type === 2 && value.reason === '个税'),
            qitaPrice: item.deduct_data.find(value => value.type === 2 && value.reason === '其他')
          }
          return obj
        })
        arr.push(...data)
        let lastPage = res.data.meta.last_page
        if (lastPage > page) {
          page++
          this.getAllData(page, arr)
        } else {
          this.list = this.$newSplice(arr, 15)
          this.loading = false
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      })
    },
    filterTotal (item) {
      let arr = [
        item.jijianPrice || 0,
        item.jishiPrice || 0,
        item.jibenPrice ? item.jibenPrice.price : 0,
        item.zhiwuPrice ? item.zhiwuPrice.price : 0,
        item.jiabanPrice ? item.jiabanPrice.price : 0,
        item.shenghuoPrice ? item.shenghuoPrice.price : 0,
        item.otherPrice ? item.otherPrice.price : 0
      ]
      let deductArr = [
        item.yanglaoPrice ? item.yanglaoPrice.price : 0,
        item.geshuiPrice ? item.geshuiPrice.price : 0,
        item.qitaPrice ? item.qitaPrice.price : 0
      ]
      return this.$toFixed(arr.map(value => Number(value) || 0).reduce((a, b) => {
        return a + b
      }, 0) - deductArr.map(value => Number(value) || 0).reduce((a, b) => {
        return a + b
      }, 0))
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
    // const QRCode = require('qrcode')
    // QRCode.toDataURL(window.location.origin + '/materialOrder/materialOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
    //   if (!err) {
    //     this.qrCodeUrl = url
    //   }
    // })
  },
  computed: {
    totalPrice () {
      let total = this.list.map(itemA => {
        let total = itemA.map(itemB => {
          let arr = [
            itemB.jijianPrice || 0,
            itemB.jishiPrice || 0,
            itemB.jibenPrice ? itemB.jibenPrice.price : 0,
            itemB.zhiwuPrice ? itemB.zhiwuPrice.price : 0,
            itemB.jiabanPrice ? itemB.jiabanPrice.price : 0,
            itemB.shenghuoPrice ? itemB.shenghuoPrice.price : 0,
            itemB.otherPrice ? itemB.otherPrice.price : 0
          ]
          let deductArr = [
            itemB.yanglaoPrice ? itemB.yanglaoPrice.price : 0,
            itemB.geshuiPrice ? itemB.geshuiPrice.price : 0,
            itemB.qitaPrice ? itemB.qitaPrice.price : 0
          ]
          return arr.map(value => Number(value) || 0).reduce((a, b) => {
            return a + b
          }, 0) - deductArr.map(value => Number(value) || 0).reduce((a, b) => {
            return a + b
          }, 0)
        })
        return total.reduce((a, b) => {
          return a + b
        }, 0)
      })
      return this.$toFixed(total.reduce((a, b) => {
        return a + b
      }, 0))
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/staff/staffAnnualTable.less";
</style>
