<template>
  <div id="screenShipments"
    class="indexMain"
    v-loading='loading'>
    <!-- 头部 -->
    <div class="head">
      <h1>订单发货详情表</h1>
    </div>
    <!-- 轮播区域 -->
    <div class="label">
      <div class="title">
        <span class="center">
          类型
          <span class="title_cut_icon"
            @click="cutOrderType">
            <i class="el-icon-sort-down"
              :class="{'active':orderType}"></i>
            <i class="el-icon-sort-up"
              :class="{'active':!orderType}"></i>
          </span>
        </span>
        <span>订单号</span>
        <span class="flex18">订单公司</span>
        <span>订单数量<br />下单日期</span>
        <span class="flex3 center">进度</span>
        <span>负责小组</span>
        <span class="center">交货日期</span>
        <span>已用工时</span>
        <span class="center">当前状态</span>
      </div>
      <!-- 轮播dom -->
      <div class="content">
        <el-carousel trigger="click"
          height="100%"
          style="height:100%"
          indicator-position='none'
          :autoplay='false'
          arrow='never'
          ref='carousel'>
          <el-carousel-item v-for="(items,keys) in filterList[orderType ? 'order' : 'sample']"
            :key="keys">
            <ul class="tableCtnLv2">
              <li class="tb_content"
                v-for="(item,key) in items"
                :key="key">
                <span class="tb_row middle">
                  <div class="iconType sample"
                    v-if="item.order_type === 2">{{'样'}}</div>
                  <div class="iconType"
                    v-else>{{'订'}}</div>
                </span>
                <span class="tb_row">{{item.order_code}}</span>
                <span class="tb_row flex18">{{item.client_name}}</span>
                <span class="tb_row"
                  style="flex-direction:column;justify-content: center;align-items: flex-start;">
                  <span>{{item.total_number ? item.total_number : 0}}件</span>
                  <span style="color:#1A94FF">{{item.order_time}}</span>
                </span>
                <span class="tb_row flex3">
                  <div class="progress_item">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.has_plan > 0 ? 100 : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon order"></span>
                  </div>
                  <div class="progress_item">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.material_order_progress.y_percent ? (item.material_order_progress.y_percent > 100 ? 100 : item.material_order_progress.y_percent) : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon orderMaterial"></span>
                  </div>
                  <div class="progress_item">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.material_push_progress.r_pop ? (item.material_push_progress.r_pop > 100 ? 100 : item.material_push_progress.r_pop) : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon stock"></span>
                  </div>
                  <div class="progress_item">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.product_weave_progress.product ? (item.product_weave_progress.product > 100 ? 100 : item.product_weave_progress.product) : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon weave"></span>
                  </div>
                  <div class="progress_item">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.product_push_progress ? (item.product_push_progress > 100 ? 100 : item.product_push_progress) : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon receive_dispatch"></span>
                  </div>
                  <div class="progress_item"
                    v-if="item.order_type !== 2">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.product_inspection_progress.r_product ? (item.product_inspection_progress.r_product > 100 ? 100 : item.product_inspection_progress.r_product) : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon inspection"></span>
                  </div>
                  <div class="progress_item"
                    v-if="item.order_type !== 2">
                    <el-progress type="circle"
                      color="#1A94FF"
                      :percentage="item.pack_real_progress ? (item.pack_real_progress > 100 ? 100 : item.pack_real_progress) : 0"
                      :stroke-width='10'
                      :show-text='false'></el-progress>
                    <span class="inner_icon outBound"></span>
                  </div>
                </span>
                <span class="tb_row">{{item.group_name}}</span>
                <span class="tb_row middle"
                  :style="{'color':isToday(item.delivery_time)}">{{item.delivery_time}}</span>
                <span class="tb_row"
                  style="flex-direction:column;justify-content: center;align-items: flex-start;">
                  <span>{{computedTime(item.delivery_time,item.order_time)[0]+'天'}}</span>
                  <span v-if="computedTime(item.delivery_time,item.order_time)[1] && setType(item.delivery_time,item.status) === 'overdue'"
                    style="color:#FF4D4D">{{computedTime(item.delivery_time,item.order_time)[1]}}</span>
                </span>
                <span class="tb_row middle">
                  <div :class="['nowType',setType(item.delivery_time,item.status)]"></div>
                </span>
              </li>
              <li v-if="keys === Math.ceil(filterList[orderType ? 'orderCount' : 'sampleCount'] / 10) - 1 && items.length < 10"
                class="tb_content"
                :style="{color:'#CCC',flex: 10 - items.length}">
                <span class="tb_row middle">已到最后一页</span>
              </li>
            </ul>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 页脚控件及logo -->
    <div class="footed">
      <el-pagination background
        layout="pager"
        :page-size="10"
        :current-page.sync="pages"
        @current-change='setActiveItem(pages)'
        :total="filterList[orderType ? 'orderCount' : 'sampleCount']">
      </el-pagination>
    </div>
    <!-- 时间区域 -->
    <div class="timeInfo">
      <span>{{year}}/{{month}}/{{date}}</span><span style="margin-left:32px">{{hours}}:{{minutes}}:{{seconds}}</span>
    </div>
    <!--icon区域-->
    <div class="client-info">
      <div class="logo">
        <img src="../../assets/image/login/logo.png"
          alt="logo">
        <span>织为云-协同制造云平台</span>
      </div>
    </div>
    <!-- 工厂名称 -->
    <div class="company-name">{{company_name}}</div>
  </div>
</template>

<script>
import { orderBatch, sampleOrder, company } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      orderLoading: true,
      sampleLoading: true,
      orderType: true, // true:订；false:样
      year: '',
      month: '',
      date: '',
      hours: '',
      minutes: '',
      seconds: '',
      pages: 1,
      count: 1,
      start_time: '',
      end_time: '',
      filterList: {
        order: [],
        orderCount: 1,
        sample: [],
        sampleCount: 1
      },
      searchList: {}, // 筛选条件
      company_name: '',
      loopTime: 30000,
      timer: null, // 定时器标识
      getNewDataTimer: null

    }
  },
  methods: {
    // 定时滚动任务
    $setInterval (time) {
      if (this.loading) {
        requestAnimationFrame(() => {
          this.$setInterval(time)
        })
        return
      }
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.filterList[this.orderType ? 'order' : 'sample'].length >= this.pages + 1) {
          if (this.pages < Math.ceil(this.filterList[this.orderType ? 'orderCount' : 'sampleCount'] / 10)) {
            this.pages++
          }
        }
        // if (this.pages > Math.ceil(this.filterList[this.orderType ? 'orderCount' : 'sampleCount'] / 10)) {
        //   this.pages = 1
        // }
        // console.log(this.pages)
      }, time)
    },
    // 判断是否为今日
    isToday (time) {
      if (this.$getTime() === this.$getTime(time)) {
        return '#1A94FF'
      } else if (new Date().getTime() > new Date(time).getTime()) {
        return '#E6A23C'
      } else if (new Date().getTime() < new Date(time).getTime()) {
        return false
      }
    },
    // 计算已用工时及是否超时
    computedTime (time, orderTime) {
      let useDay = Math.ceil((new Date().getTime() - new Date(orderTime).getTime()) / 1000 / 60 / 60 / 24)
      let dayNumber = Math.floor((new Date().getTime() - new Date(time).getTime()) / 1000 / 60 / 60 / 24)
      let str = dayNumber > 0 ? '逾期' + dayNumber + '天' : false
      return [useDay, str]
    },
    // 判断是否逾期
    setType (time, status) {
      if (+status === 2004 || +status === 3004) {
        return 'complete'
      } else if (new Date(this.$getTime()).getTime() > new Date(this.$getTime(time)).getTime()) {
        return 'overdue'
      } else {
        return 'running'
      }
    },
    // 获取当前时间戳
    getTime () {
      requestAnimationFrame(() => {
        let data = new Date()
        this.year = data.getFullYear()
        this.month = Number(data.getMonth()) > 8 ? Number(data.getMonth()) + 1 : '0' + (Number(data.getMonth()) + 1)
        this.date = Number(data.getDate()) > 9 ? Number(data.getDate()) : '0' + (Number(data.getDate()))
        this.hours = Number(data.getHours()) > 9 ? Number(data.getHours()) : '0' + (Number(data.getHours()))
        this.minutes = Number(data.getMinutes()) > 9 ? Number(data.getMinutes()) : '0' + (Number(data.getMinutes()))
        this.seconds = Number(data.getSeconds()) > 9 ? Number(data.getSeconds()) : '0' + (Number(data.getSeconds()))
        this.getTime()
        this.end_time = new Date(new Date().getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString()
      })
    },
    // 优化页面还未加载完成时,页码就跳转
    setActiveItem (pages) {
      if (this.filterList[this.orderType ? 'order' : 'sample'].length < pages) {
        this.$message('正在加载。。。')
      } else {
        this.$refs.carousel.setActiveItem(pages - 1)
        this.$setInterval(this.loopTime)
      }
    },
    getOrderData (item) {
      console.log('order')
      item = item || {}
      let pagesInner = item.page || 1
      let data = item.data || []
      if (pagesInner > Math.ceil(this.filterList.orderCount / 20)) {
        this.filterList.order.push(data.splice(0, 10))
        if (data.length > 0) {
          setTimeout(() => {
            this.getOrderData({
              page: pagesInner,
              data: data
            })
          }, 2000)
        }
      } else {
        orderBatch.list({
          'limit': 20,
          'page': pagesInner,
          'keyword': this.searchList.keyword,
          'client_id': this.searchList.company,
          'group_id': this.searchList.group,
          'start_time': this.searchList.start_time || this.start_time,
          'end_time': this.searchList.end_time || this.end_time
        }).then(res => {
          let batchData = res.data.data.data
          this.filterList.orderCount = res.data.data.count
          for (let prop in batchData) {
            let item = batchData[prop]
            data.push(...item.map(itemBatch => {
              let productInfo = itemBatch.batch_info.map(itemPro => {
                return {
                  number: itemPro.product_info.map(itemSize => (+itemSize.numbers || 0)).reduce((a, b) => {
                    return a + b
                  }),
                  product_id: itemPro.category_info.product_id,
                  image: itemPro.category_info.images.length > 0 ? itemPro.category_info.images.map(itemImg => {
                    itemImg.product_id = itemPro.category_info.product_id
                    itemImg.product_type = itemPro.category_info.product_type
                    return itemImg
                  }) : [{
                    product_id: itemPro.category_info.product_id,
                    product_type: itemPro.category_info.product_type
                  }]
                }
              })
              return {
                delivery_time: prop,
                order_code: itemBatch.order_code,
                client_name: itemBatch.client_name,
                image: productInfo.map(itemPro => itemPro.image).reduce((a, b) => {
                  return a.concat(b)
                }),
                status: itemBatch.status,
                order_id: itemBatch.order_id,
                batch_id: itemBatch.batch_id,
                group_name: itemBatch.group_name,
                total_number: productInfo.map(itemPro => (+itemPro.number || 0)).reduce((a, b) => {
                  return a + b
                }),
                order_time: itemBatch.order_time,
                ...itemBatch.log

              }
            })
            )
          }
          this.filterList.order.push(data.splice(0, 10))
          pagesInner++
          if (this.orderType) {
            this.loading = false
          }
          setTimeout(() => {
            this.getOrderData({
              page: pagesInner,
              data: data
            })
          }, 2000)
        })
      }
    },
    getSampleData (item) {
      console.log('sample')
      item = item || {}
      let pagesInner = item.page || 1
      let data = item.data || []
      if (pagesInner > Math.ceil(this.filterList.sampleCount / 20)) {
        this.filterList.sample.push(data.splice(0, 10))
        if (data.length > 0) {
          setTimeout(() => {
            this.getSampleData({
              page: pagesInner,
              data: data
            })
          }, 2000)
        }
      } else {
        sampleOrder.list({
          'limit': 20,
          'page': pagesInner,
          'keyword': this.searchList.keyword,
          'client_id': this.searchList.company,
          'group_id': this.searchList.group,
          'start_time': this.searchList.start_time || this.start_time,
          'end_time': this.searchList.end_time || this.end_time,
          'is_dispatch': 1
        }).then(res => {
          let batchData = res.data.data.sort((a, b) => {
            return new Date(a.deliver_time).getTime() - new Date(b.deliver_time).getTime()
          })
          this.filterList.sampleCount = res.data.meta.total
          data.push(...batchData.map(item => {
            return {
              order_type: 2,
              order_code: item.title,
              client_name: item.client_name,
              total_number: item.total_number.map(itemNum => (Number(itemNum.numbers) || 0)).reduce((a, b) => {
                return a + b
              }),
              order_time: item.order_time,
              group_name: item.group_name,
              delivery_time: item.deliver_time,
              status: item.status,
              has_plan: item.has_plan,
              material_order_progress: item.material_order_progress,
              material_push_progress: item.material_push_progress,
              product_weave_progress: item.product_weave_progress,
              product_push_progress: item.product_push_progress
            }
          }))
          this.filterList.sample.push(data.splice(0, 10))
          pagesInner++
          if (!this.orderType) {
            this.loading = false
          }
          setTimeout(() => {
            this.getSampleData({
              page: pagesInner,
              data: data
            })
          }, 2000)
        })
      }
    },
    cutOrderType () {
      this.orderType = !this.orderType
    }
  },
  created () {
    company.detail().then(res => {
      if (res.data.status) {
        this.company_name = res.data.data.company_name
      } else {
        this.$message({
          type: 'error',
          message: res.data.message
        })
      }
    })
    if (this.$route.query) {
      this.searchList = this.$route.query
    }
    // 按esc返回订单发货列表
    let html = document.getElementsByTagName('html')[0]
    html.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        setTimeout(() => {
          this.$router.push('/index/orderStat')
        }, 800)
      }
    }, false)
    this.start_time = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString()
    this.end_time = new Date(new Date().getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString()
    this.getTime()
    this.getOrderData()
    this.getSampleData()
    this.$setInterval(this.loopTime)
  },
  watch: {
    pages (newVal) {
      clearInterval(this.getNewDataTimer)
      if (newVal === 1) {
        this.$setInterval(this.loopTime)
      }
      this.$refs.carousel.setActiveItem(this.pages - 1) // 页码改变时改变走马灯展示视图
      if (newVal === Math.ceil(this.filterList[this.orderType ? 'orderCount' : 'sampleCount'] / 10)) { // 当页面为最后一页时添加定时任务，重新拉取最新数据
        this.getNewDataTimer = setTimeout(() => {
          clearInterval(this.timer) // 优化，清除页面在拉取最新数据时 页码一直在改变
          this.timer = null
          this.pages = 1 // 重置页码
          this.orderType = !this.orderType
          this.filterList[this.orderType ? 'sample' : 'order'] = [] // 清空旧数据
          this.orderType ? this.getSampleData() : this.getOrderData()
        }, this.loopTime)
      }
    },
    orderType (newVal) {
      clearInterval(this.getNewDataTimer)
      if (this.filterList[newVal ? 'order' : 'sample'].length === 0) {
        this.loading = true
      }
      this.pages = 1
      this.$setInterval(this.loopTime)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/screenShipments.less";
</style>
<style lang="less" scope>
#screenShipments {
  .el-progress {
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 6px;
    .el-progress-circle {
      width: inherit !important;
      height: inherit !important;
      .el-progress-circle__track {
        stroke: #324376;
      }
    }
    .el-progress__text {
      font-size: 16px !important;
      color: #53c5ca;
    }
  }
}
</style>
