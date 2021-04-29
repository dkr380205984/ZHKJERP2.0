<template>
  <div id='receiveDispatchList'
    class='indexMain batchXpList'
    v-loading='loading'>
    <div class="module flexModle">
      <div class="dataItem">
        <span class="title">今日绑定数量</span>
        <span class="info">{{`${Number(statisticsInfo.today_bind && statisticsInfo.today_bind.number)}张/${Number(statisticsInfo.today_bind && statisticsInfo.today_bind.total)}条`}}</span>
      </div>
      <div class="dataItem">
        <span class="title">今日出库数量</span>
        <span class="info">{{`${Number(statisticsInfo.today_pop && statisticsInfo.today_pop.number)}张/${Number(statisticsInfo.today_pop && statisticsInfo.today_pop.total)}条`}}</span>
      </div>
      <div class="dataItem">
        <span class="title">今日回库数量</span>
        <span class="info">{{`${Number(statisticsInfo.today_back && statisticsInfo.today_back.number)}张/${Number(statisticsInfo.today_back && statisticsInfo.today_back.total)}条`}}</span>
      </div>
      <div class="dataItem">
        <span class="title">合计绑定数量</span>
        <span class="info">{{`${Number(statisticsInfo.total_bind && statisticsInfo.total_bind.number)}张/${Number(statisticsInfo.total_bind && statisticsInfo.total_bind.total)}条`}}</span>
      </div>
      <div class="dataItem">
        <span class="title">合计出库数量</span>
        <span class="info">{{`${Number(statisticsInfo.total_pop && statisticsInfo.total_pop.number)}张/${Number(statisticsInfo.total_pop && statisticsInfo.total_pop.total)}条`}}</span>
      </div>
      <div class="dataItem">
        <span class="title">合计回库数量</span>
        <span class="info">{{`${Number(statisticsInfo.total_back && statisticsInfo.total_back.number)}张/${Number(statisticsInfo.total_back && statisticsInfo.total_back.total)}条`}}</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入订单号按回车键查询">
              </el-input>
              <el-input class="filter_item"
                v-model="product_code"
                @change="changeRouter(1)"
                placeholder="输入产品编号按回车键查询">
              </el-input>
              <el-select class="filter_item"
                v-model="status"
                clearable
                placeholder="请选择状态"
                @change="changeRouter(1)">
                <el-option v-for="item in statusArr"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key">
                </el-option>
              </el-select>
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
              <div class="resetBtn"
                @click="reset"
                style="width:82px;box-sizing:border-box">重置</div>
            </div>
          </div>
        </div>
        <div class="filteCtn2"
          style="margin-bottom:8px">
          <div class="leftCtn"
            style="display:flex;flex-direction:row;justify-content:flex-end">
            <div class="btn btnWhiteBlue"
              @click="$router.push('/receiveDispatch/batchXpOpration/1')">芯片入库</div>
            <div class="btn btnWhiteBlue"
              @click="$router.push('/receiveDispatch/batchXpOpration/2')">芯片出库</div>
            <div class="btn btnWhiteBlue"
              @click="$router.push('/receiveDispatch/batchXpOpration/3')">芯片回库</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">芯片编号</span>
            </div>
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">产品信息</span>
            </div>
            <div class="col middle">
              <span class="text">产品图片</span>
            </div>
            <div class="col">
              <span class="text">尺码颜色</span>
            </div>
            <div class="col">
              <span class="text">数量/捆数</span>
            </div>
            <div class="col">
              <span class="text">次品数/原因</span>
            </div>
            <div class="col middle">
              <span class="text">状态</span>
            </div>
            <div class="col middle">
              <span class="text">更新时间</span>
            </div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">
              {{(Array(8).join(0) + item.id).slice(-8)}}
            </div>
            <div class="col">
              {{item.order_code}}
            </div>
            <div class="col">
              <span>{{item.product_info.product_code}}</span>
              <span>({{item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name}})</span>
            </div>
            <div class="col middle">
              <zh-img-list :list="item.product_info.image"></zh-img-list>
            </div>
            <div class="col">
              {{item.size_name + '/' + item.color_name}}
            </div>
            <div class="col">
              {{item.number}}({{item.count||0}}捆)
            </div>
            <div class="col"
              :style="{'color':item.shoddy_number&&Number(item.shoddy_number)>0?'#F5222D':'#ccc'}">
              {{item.shoddy_number||0}}<span v-if="item.shoddy_reason"
                style="color:#1a95ff;cursor:pointer"
                @click="$alert(item.shoddy_reason, '次品原因', {confirmButtonText: '确定'})">(查看)</span>
            </div>
            <div class="col middle"
              :class="item.statusInfoArr[item.showIndex].status === 1 && item.statusInfoArr[item.showIndex].statusColor">
              <div class="cutCtn">
                <span class="el-icon-caret-top"
                  :class="{'disabled':item.showIndex === 0}"
                  @click="changeShowIndex(item,-1)"></span>
                <!-- <span class="index"></span> -->
                <span class="el-icon-caret-bottom"
                  :class="{'disabled':item.showIndex === item.statusInfoArr.length - 1}"
                  @click="changeShowIndex(item,1)"></span>
              </div>
              {{item.statusInfoArr[item.showIndex].name}}
            </div>
            <!-- <div class="col">
              <div class="stateCtn"
                :class="{'green':item.is_chip===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_chip===1?'绑定日期：' + item.chip_time.slice(0,10):'未绑定'"
                  placement="top">
                  <span class="name">芯</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_weave_push===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_weave_push===1?'入库日期：' + item.weave_time.slice(0,10):'未入库'"
                  placement="top">
                  <span class="name">入</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_inspection===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_inspection===1?'检验日期：' + item.inspection_time.slice(0,10):'未检验'"
                  placement="top">
                  <span class="name">检</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_semi_pop===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_semi_pop===1?'出库日期：' + item.semi_pop_time.slice(0,10):'未出库'"
                  placement="top">
                  <span class="name">出</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_semi_push===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_semi_push===1?'回库日期：' + item.semi_push_time.slice(0,10):'未回库'"
                  placement="top">
                  <span class="name">回</span>
                </el-tooltip>
              </div>
            </div> -->
            <div class="col middle">
              <span class="text">{{(item.statusInfoArr[item.showIndex].time && item.statusInfoArr[item.showIndex].status === 1) ? $getTime(item.statusInfoArr[item.showIndex].time,'-',true) : '未操作'}}</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages">
          </el-pagination>
        </div>
      </div>
      <div class="bottomFixBar">
        <div class="main">
          <div class="btnCtn">
            <div class="btn btnBlue"
              @click="$message.warning('未开放')">下载芯片模块</div>
            <div class="btn btnBlue"
              @click="downloadXp">下载芯片控件</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { receiveDispatch } from '@/assets/js/api.js'
import zhImgList from '../../components/zhImgList/zhImgList.vue'
export default {
  components: { zhImgList },
  data () {
    return {
      loading: true,
      keyword: '',
      product_code: '',
      status: '',
      statusArr: [
        { name: '芯片绑定', key: 'is_chip', keyValue: 1 },
        { name: '芯片入库', key: 'is_weave_push', keyValue: 1 },
        { name: '芯片检验', key: 'is_inspection', keyValue: 1 },
        { name: '芯片出库', key: 'is_semi_pop', keyValue: 1 },
        { name: '芯片回库', key: 'is_semi_push', keyValue: 1 }
      ],
      date: '',
      list: [],
      pages: 1,
      total: 10,
      statisticsInfo: {}
    }
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    changeShowIndex (item, type) {
      const nextIndex = item.showIndex + type
      if (nextIndex < 0 || nextIndex >= item.statusInfoArr.length) {
        return
      }
      item.showIndex = nextIndex
    },
    downloadXp () {
      window.location = 'http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe'
    },
    getFilters () {
      let params = this.$route.query
      this.pages = Number(params.page) || 1
      this.keyword = params.keyword || ''
      this.product_code = params.product_code || ''
      this.status = params.status
      if (params.date && params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
    },
    changeRouter (pages = 1) {
      this.$router.push(`/receiveDispatch/batchXpList?page=${pages}&keyword=${this.keyword}&product_code=${this.product_code}&status=${this.status}&date=${this.date}`)
    },
    reset () {
      this.$router.push('/receiveDispatch/batchXpList')
    },
    getList () {
      this.loading = true
      const obj = {
        is_chip: 1,
        [this.status]: 1
      }
      Promise.all([
        receiveDispatch.allDetail({
          ...obj,
          order_code: this.keyword,
          product_code: this.product_code,
          order_id: '',
          order_type: 1,
          limit: 10,
          page: this.pages,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
        }),
        receiveDispatch.allDetailStatistics({
          ...obj,
          order_code: this.keyword,
          product_code: this.product_code,
          // order_id: '',
          // order_type: 1,
          // limit: 10,
          // page: this.pages,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
        })
      ]).then(res => {
        this.list = res[0].data.data.map(item => {
          const statusInfoArr = [
            { name: '芯片绑定', status: item.is_chip, time: item.chip_time, statusColor: 'orange' },
            // { name: '芯片入库', status: item.is_weave_push, time: item.weave_time },
            // { name: '芯片检验', status: item.is_inspection, time: item.inspection_time },
            { name: '芯片出库', status: item.is_semi_pop, time: item.semi_pop_time, statusColor: 'blue' },
            { name: '芯片回库', status: item.is_semi_push, time: item.semi_push_time, statusColor: 'green' }
          ]
          const showIndex = statusInfoArr.map(itemM => itemM.status).lastIndexOf(1)
          return {
            ...item,
            statusInfoArr,
            showIndex: showIndex >= 0 ? showIndex : 0
          }
        })
        this.total = res[0].data.meta.total
        this.statisticsInfo = res[1].data.data
        this.loading = false
      })
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/receiveDispatch/receiveDispatchList.less";
</style>
