<template>
  <div id='screenShipments'
    class='indexMain'
    :style="`background-image:url(${require('@/assets/image/bigScreenBg/zhihui_big_screen_shipment_bg.jpg')})`">
    <div class="header">
      <div class="left">
        <span>今日发货数据</span>
        <span>共有<span class="important">{{toDayShippingInfo.today_batch_number}}</span>个订单需要发货</span>
        <span>合计<span class="important">{{$toFixed(toDayShippingInfo.today_product_number / 10000)}}</span>万件</span>
      </div>
      <div class="right">
        <span>页面刷新倒计时</span>
        <span class="important">{{countDown}}</span>
        <span>当前时间</span>
        <span class="important">{{`${date.day} ${date.time}`}}</span>
      </div>
    </div>
    <div class="content">
      <div class="tb_head">
        <!-- <div class="tb_row">订单类型</div> -->
        <div class="tb_row flex15">订单号</div>
        <div class="tb_row flex15">订单公司</div>
        <div class="tb_row flex15 center">产品编号</div>
        <div class="tb_row center">产品图片</div>
        <div class="tb_row right">下单总数</div>
        <div class="tb_row center flex02"></div>
        <div class="tb_row flex2 center">系统流程进度</div>
        <div class="tb_row center">负责小组</div>
        <div class="tb_row center">下单日期</div>
        <div class="tb_row center">交货日期</div>
        <div class="tb_row center">已用工时</div>
        <div class="tb_row center">批次状态</div>
        <div class="tb_row flex3 center">当前最新自定义进度</div>
        <div class="tb_row center">更新时间</div>
      </div>
      <el-carousel indicator-position="outside"
        class="carousel"
        :arrow='carouselParams.arrow'
        :autoplay='carouselParams.autoplay'
        :indicatorPosition='carouselParams.indicatorPosition'
        ref="carousel">
        <el-carousel-item v-for="(item,index) in showData[showKey]"
          :key="index">
          <div class="tb_content"
            v-for="(itemOrder,indexOrder) in item"
            :key="indexOrder">
            <div class="tb_row flex15">
              <span class="text">{{itemOrder.order.order_code}}</span>
            </div>
            <div class="tb_row flex15">
              <span class="text">{{itemOrder.order.client.name}}</span>
            </div>
            <div class="tb_row flex15 center">{{itemOrder.product_info[itemOrder.batchShowProductIndex].product_code.product_code}}</div>
            <div class="tb_row center">
              <zh-img-list :list="itemOrder.product_info[itemOrder.batchShowProductIndex].image"
                type='open'></zh-img-list>
            </div>
            <div class="tb_row right">{{itemOrder.product_info[itemOrder.batchShowProductIndex].number}}</div>
            <div class="tb_row center flex02">
              <div class="cutCtn">
                <span :class="`el-icon-caret-top ${itemOrder.batchShowProductIndex === 0 && 'disabled'}`"
                  @click="changeShowIndex(itemOrder,-1)"></span>
                <span class="index">{{`${itemOrder.batchShowProductIndex + 1}/${itemOrder.product_info.length}`}}</span>
                <span :class="`el-icon-caret-bottom ${(itemOrder.batchShowProductIndex === itemOrder.product_info.length - 1) && 'disabled'}`"
                  @click="changeShowIndex(itemOrder,1)"></span>
              </div>
            </div>
            <div class="tb_row flex2 center">
              <div class="statusCtn">
                <span :class="`statusItem ${itemOrder.order.has_plan > 0 && 'green'}`">计</span>
                <span :class="`statusItem ${itemOrder.order.material_order_progress.y_percent > 0 && 'orange'} ${itemOrder.order.material_order_progress.y_percent >= 100 && 'green'}`">入</span>
                <span :class="`statusItem ${itemOrder.order.material_push_progress.r_pop > 0 && 'orange'} ${itemOrder.order.material_push_progress.r_pop >= 100 && 'green'}`">出</span>
                <span :class="`statusItem ${itemOrder.order.product_push_progress > 0 && 'orange'} ${itemOrder.order.product_push_progress >= 100 && 'green'}`">检</span>
                <span :class="`statusItem ${itemOrder.order.semi_push_progress > 0 && 'orange'} ${itemOrder.order.semi_push_progress >= 100 && 'green'}`">回</span>
                <span :class="`statusItem ${itemOrder.order.pack_real_progress > 0 && 'orange'} ${itemOrder.order.pack_real_progress >= 100 && 'green'}`">箱</span>
              </div>
            </div>
            <div class="tb_row center">{{itemOrder.order.group.name}}</div>
            <div class="tb_row center">{{itemOrder.order.order_time}}</div>
            <div class="tb_row center"
              style="display:flex;flex-direction:column">
              <span>{{`#${itemOrder.batch_id}批`}}</span>
              <span>{{itemOrder.delivery_time}}</span>
            </div>
            <div class="tb_row center"
              style="display:flex;flex-direction:column">
              <span>{{itemOrder.timeInfoCom.workDay}}天</span>
              <span v-if="itemOrder.timeInfoCom.status !== 1"
                :class="`${(itemOrder.timeInfoCom.surplusDay <= 3) && 'orange'}`">{{`${itemOrder.timeInfoCom.surplusDay >= 0 ? '剩余' : '逾期'}${Math.abs(itemOrder.timeInfoCom.surplusDay)}天`}}</span>
            </div>
            <div class="tb_row center">
              <div :class="`statusMode status${itemOrder.timeInfoCom.status}`">{{itemOrder.timeInfoCom.status|filterBatchStatus}}</div>
            </div>
            <div class="tb_row flex3 center">
              <span class="text"
                v-if="itemOrder.order_batch_detail && itemOrder.order_batch_detail.description">{{itemOrder.order_batch_detail.description}}</span>
              <span class="text"
                style="color:#AAA"
                v-else>暂无描述信息</span>
            </div>
            <div class="tb_row center">{{$getTime(itemOrder.updated_at.date)}}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="footer">
      <div class="left">{{companyName}}</div>
      <div class="pageCtn">
        <el-pagination background
          layout="prev, pager, next"
          :page-size="limit"
          :current-page="pages"
          :total="total"
          @current-change='changePages'>
        </el-pagination>
      </div>
      <div class="right">
        <img class="logo"
          src="../../assets/image/login/logo.png"
          alt="logo">
        <span>织为云-协同制造云平台</span>
      </div>
    </div>
  </div>
</template>

<script>
import { orderBatch } from '@/assets/js/api.js'
export default {
  data () {
    return {
      date: {
        id: '',
        day: '',
        time: ''
      },
      toDayShippingInfo: {},
      companyName: window.sessionStorage.getItem('full_name'),
      carouselParams: {
        autoplay: false,
        indicatorPosition: 'none',
        arrow: 'never'
      },
      showKey: true, // 当前显示的showData列表key
      showData: {
        true: [],
        false: []
      },
      lastCutPagesTime: '',
      cutPagesInterval: 120,
      pages: 1,
      limit: 12, // 修改该值需要去修改tb_content的高度
      total: 1
    }
  },
  methods: {
    changeShowIndex (item, type) {
      const nextIndex = item.batchShowProductIndex + type
      if (nextIndex >= 0 && nextIndex < item.product_info.length) {
        item.batchShowProductIndex = nextIndex
      }
    },
    /**
     * 计算以用工时
     * @param {any} item 批次数据
     *
     * 计算方式
     *
     * 批次状态 1 || 4 时 updated_at - order_time
     *
     * 批次状态 0 || 2 || 3 时 now_time - order_time
     *
     * @returns {{ status: 1 | 2 | 3 | 4 | 5 , workDay: Number, surplusDay: Number }}
     * status     1 => 已完成;2 => 紧急;3 => 即将发货;4 => 进行中; 5 => 已逾期
     *
     * workDay    已用工时
     *
     * surplusDay 剩余天数 小于零时为逾期天数
     */
    getUseWorkTime (item) {
      let returnObj = {
        status: 1,
        workDay: null,
        surplusDay: null
      }
      if (item.status === 1) {
        returnObj.workDay = new Date(item.updated_at.date) - new Date(item.order.order_time)
        returnObj.status = 1
      } else if (item.status === 3) {
        returnObj.status = 2
        returnObj.workDay = Math.ceil((new Date() - new Date(item.order.order_time)) / (24 * 60 * 60 * 1000))
      } else if (item.status === 0 || item.status === 2) {
        const nowTime = new Date().valueOf() // 当前时间戳
        const deliveryMinTime = new Date(item.delivery_time).valueOf()
        const deliveryMaxTime = deliveryMinTime + 24 * 60 * 60 * 1000 // 最晚发货时间戳
        returnObj.workDay = Math.ceil((new Date() - new Date(item.order.order_time)) / (24 * 60 * 60 * 1000))
        if (nowTime < deliveryMaxTime && nowTime >= (deliveryMinTime - (3 * 24 * 60 * 60 * 1000))) {
          returnObj.status = 3
        } else if (nowTime < deliveryMinTime) {
          returnObj.status = 4
        } else {
          returnObj.status = 5
        }
      }
      // if (item.status === 1 || item.status === 4) {
      // } else if (item.status === 0 || item.status === 2 || item.status === 3) {
      // }
      returnObj.surplusDay = Math.ceil((new Date(item.delivery_time) - new Date()) / (24 * 60 * 60 * 1000))
      return returnObj
    },
    /**
     * @param {Number} pages 当前获取的页码 默认值“1”
     * @param {Array} data 数据集合
     * @param {Number} limit 默认页面limit的2倍
     * @param {number} interval 获取数据间隔时间毫秒数 默认“2000”
     * @param {bool} getNewDataFlag 判断是否获取最新数据
     * @param {bool} isPushReverseShowKey 判断是否反向showKey
    */
    getShowData ({ pages, data, limit, total } = { pages: 1, data: [], limit: this.limit * 2, total: null }, interval = 2000, getNewDataFlag = true, isPushReverseShowKey = false) {
      if (total === 0) return
      if (total && pages > Math.ceil(total / limit)) {
        if (getNewDataFlag) {
          this.getShowData(undefined, undefined, false, true) // 获取最新数据已待轮播最后一页后及时更新数据
          getNewDataFlag = false
        }
        this.showData[isPushReverseShowKey ? !this.showKey : this.showKey].push(data.splice(0, this.limit))
        if (data.length > 0) {
          setTimeout(() => {
            this.getShowData({
              pages,
              data,
              limit,
              total
            }, interval, getNewDataFlag, isPushReverseShowKey)
          }, interval)
        }
      } else {
        orderBatch.bigScreenShipmentsList({
          'limit': limit,
          'page': pages,
          'keyword': this.queryInfo.keyword,
          'client_id': this.queryInfo.company_id,
          'group_id': this.queryInfo.group_id,
          'start_time': this.queryInfo.start_time,
          'end_time': this.queryInfo.end_time
        }).then(res => {
          if (res.data.status !== false) {
            data.push(...res.data.data.map(itemM => {
              return {
                ...itemM,
                timeInfoCom: this.getUseWorkTime(itemM),
                batchShowProductIndex: 0
              }
            }))
            this.total = res.data.meta.total
            this.showData[isPushReverseShowKey ? !this.showKey : this.showKey].push(data.splice(0, this.limit))
            setTimeout(() => {
              this.getShowData({
                pages: ++pages,
                data,
                limit,
                total: res.data.meta.total
              }, interval, getNewDataFlag, isPushReverseShowKey)
            }, interval)
          }
        })
      }
    },
    changePages (pages) { // 切换pages事件
      if (this.pages !== pages) {
        if (pages > this.lastPage) {
          this.pages = 1
          this.showKey = !this.showKey
        } else {
          this.pages = pages
        }
      }
      this.$refs.carousel.setActiveItem(this.pages - 1)
      this.setLastCutPagesTime()
    },
    setLastCutPagesTime () { // 更新上一次切换pages的时间
      this.lastCutPagesTime = new Date(`${this.date.day} ${this.date.time}`).getTime()
    },
    getTime () { // 更新右上角时间
      this.date.day = this.$getTime()
      const nowDate = new Date()
      const hours = nowDate.getHours()
      const minutes = nowDate.getMinutes()
      const seconds = nowDate.getSeconds()
      this.date.time = [hours < 10 ? `0${hours}` : hours, minutes < 10 ? `0${minutes}` : minutes, seconds < 10 ? `0${seconds}` : seconds].join(':')
      this.date.id = requestAnimationFrame(this.getTime)
    },
    escEvent (e) {
      if (e.keyCode === 27) {
        setTimeout(() => {
          this.$router.push('/order/orderStat')
        }, 800)
      }
    }
  },
  created () {
    // this.showData = JSON.parse(window.localStorage.getItem('testOrderData'))
    this.getTime()
    // 按esc返回订单发货列表
    // let html = document.getElementsByTagName('html')[0]
    document.addEventListener('keydown', this.escEvent, false)
  },
  mounted () {
    orderBatch.toDayShippingData().then(res => {
      if (res.data.status !== false) {
        this.toDayShippingInfo = res.data.data
      }
    })
    this.getShowData()
    this.setLastCutPagesTime()
  },
  watch: {
    countDown (newVal) {
      if (newVal <= 0) { // 当倒计时为0时
        this.setLastCutPagesTime()
        this.changePages(this.pages + 1)
      }
    },
    showKey (newVal) {
      this.showData[!newVal] = []
      this.getShowData(undefined, undefined, true) // 获取最新数据已待轮播最后一页后及时更新数据
    }
  },
  computed: {
    countDown () { // 倒计时
      return Math.ceil(this.cutPagesInterval - (new Date(`${this.date.day} ${this.date.time}`).getTime() - this.lastCutPagesTime) / 1000)
    },
    lastPage () { // 最后一页页码
      return Math.ceil(this.total / this.limit)
    },
    queryInfo () {
      return {
        keyword: this.$route.query.keyword || '',
        start_time: this.$route.query.start_time || this.$getTime(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)),
        end_time: this.$route.query.end_time || this.$getTime(new Date().getTime() + (20 * 24 * 60 * 60 * 1000)),
        group_id: this.$route.query.group_id || '',
        company_id: (this.$route.query.company_id && this.$route.query.company_id.split(',') && this.$route.query.company_id.split(',')[1]) || ''
      }
    }
  },
  filters: {
    filterBatchStatus (status) {
      switch (status) {
        case 1:
          return '已完成'
        case 2:
          return '紧急'
        case 3:
          return '即将发货'
        case 4:
          return '进行中'
        case 5:
          return '已逾期'
        default:
          return '未知状态'
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.escEvent, false) // 页面销毁前清除下 全局keydown监听
    cancelAnimationFrame(this.date.id) // 页面销毁前清除下 requestAnimationFrame
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/screenShipments.less";
</style>
<style lang="less">
#screenShipments {
  .el-pagination {
    .el-pager .number,
    .el-pager .el-icon,
    .btn-next,
    .btn-prev {
      &.number.active,
      &:hover {
        background-color: #004b8d !important;
      }
      color: white !important;
      background: transparent !important;
    }
  }
  .carousel {
    width: 100%;
    flex: 1;
    .el-carousel__container {
      height: 100%;
    }
  }
}
</style>
