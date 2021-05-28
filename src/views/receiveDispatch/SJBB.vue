<template>
  <div id="SJBB"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="order_code"
                @change="changeRouter(1)"
                placeholder="输入关联单号查询">
              </el-input>
              <el-select v-model="client_id"
                class="filter_item"
                filterable
                clearable
                placeholder="请输入单位名称搜索"
                @change="changeRouter(1)">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-date-picker class="filter_item"
                v-model="date"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                @change="changeRouter(1)">
              </el-date-picker>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">关联单号</span>
            </div>
            <div class="col flex12">
              <span class="text">订单公司</span>
            </div>
            <div class="col middle">
              <span class="text">产品信息</span>
            </div>
            <div class="col middle">
              <span class="text">尺码颜色</span>
            </div>
            <div class="col flex08">
              <span class="text">工序</span>
            </div>
            <div class="col flex08">
              <span class="text">下单数量</span>
            </div>
            <div class="col flex16">
              <span class="text">今日检验</span>
            </div>
            <div class="col flex08">
              <span class="text">次品数量</span>
            </div>
            <div class="col flex08">
              <span class="text">累计数量</span>
            </div>
            <div class="col flex08">
              <span class="text">累计次品</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col flex12">
              <span style="color:#1a95ff"
                item.order_code>{{item.order_code}}</span>
            </div>
            <div class="col flex12">
              <span class="text">{{item.client_name}}</span>
            </div>
            <div class="col middle">
              <span class="text">{{item.product_info.product_code}}</span>
              <span class="text">{{item.product_info.category_name}}/{{item.product_info.type_name}}/{{item.product_info.style_name}}</span>
            </div>
            <div class="col middle">
              <span class="text">{{item.size_name}}/{{item.color_name}}</span>
            </div>
            <div class="col flex08">
              <span class="text">{{item.process||'无'}}</span>
            </div>
            <div class="col flex08">
              <span class="text">{{item.order_number}}</span>
            </div>
            <div class="col flex08">
              <span class="text">{{item.number}}</span>
            </div>
            <div class="col flex08">
              <span class="text">{{item.shoddy_number||0}}</span>
              （<span style="color:rgb(230, 162, 60)">{{$toFixed(item.shoddy_number/item.number*100)}}%</span>）
            </div>
            <div class="col flex08">
              <span class="text"
                :style="{'color':item.total_number.total_number>=item.order_number?'#01B48C':'rgb(230, 162, 60)'}">{{item.total_number.total_number}}</span>
            </div>
            <div class="col flex08">
              <span class="text">{{item.total_number.total_shoddy_number}}</span>
              （<span style="color:rgb(230, 162, 60)">{{$toFixed(item.total_number.shoddy_number_ratio)}}%</span>）
            </div>
            <div class="col">
              <span class="text">
                <div class="opr"
                  @click="getHistory(item.id)">查看历史</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showHistory">
      <div class="main"
        style="width:800px">
        <div class="title">
          <div class="text">查看历史记录</div>
          <i class="el-icon-close"
            @click="showHistory=false"></i>
        </div>
        <div class="content">
          <div class="module">
            <div class="listCtn">
              <div class="list">
                <div class="title">
                  <div class="col">
                    <span class="text">检验时间</span>
                  </div>
                  <div class="col">
                    <span class="text">检验数量</span>
                  </div>
                  <div class="col">
                    <span class="text">次品数量</span>
                  </div>
                  <div class="col">
                    <span class="text">累计数量</span>
                  </div>
                  <div class="col">
                    <span class="text">累计次品</span>
                  </div>
                </div>
                <div class="row"
                  v-for="item in historyList"
                  :key="item.id">
                  <div class="col">
                    <span class="text">{{item.create_time.date.slice(0,10)}}</span>
                  </div>
                  <div class="col">
                    <span class="text">{{item.number}}</span>
                  </div>
                  <div class="col">
                    <span class="text">{{item.shoddy_number||0}}</span>
                    （<span style="color:rgb(230, 162, 60)">{{$toFixed(item.shoddy_number/item.number*100)}}%</span>）
                  </div>
                  <div class="col">
                    <span class="text">{{item.total}}</span>
                  </div>
                  <div class="col">
                    <span class="text">{{item.shoddy_total}}</span>
                    （<span style="color:rgb(230, 162, 60)">{{$toFixed(item.shoddy_total/item.total*100)}}%</span>）
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnBlue"
            @click="showHistory=false">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { receiveDispatchSJBB, client } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      value: '',
      list: [],
      pages: 1,
      total: 1,
      order_code: '',
      date: '',
      historyList: [],
      client_id: '',
      clientList: [],
      showHistory: false
    }
  },
  watch: {
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    searchClient (query) {
      if (query) {
      }
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/receiveDispatch/SJBB/page=' + pages + '&&order_code=' + this.order_code + '&&client_id=' + this.client_id + '&&date=' + this.date)
    },
    reset () {
      this.$router.push('/receiveDispatch/SJBB/page=1&&order_code=&&client_id=&&date=')
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.order_code = params.order_code || ''
      this.client_id = params.client_id || ''
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date
      } else {
        this.date = this.$getTime(new Date())
      }
    },
    getList () {
      this.loading = true
      receiveDispatchSJBB.list({
        order_code: this.order_code,
        create_time: this.date,
        client_id: this.client_id,
        limit: 10,
        page: 1
      }).then((res) => {
        this.list = this.$mergeData(res.data.data, {
          mainRule: ['order_code', 'product_id', 'size_id', 'color_id', 'process'],
          otherRule: [
            { name: 'id' },
            { name: 'order_number' },
            { name: 'client_name' },
            { name: 'product_info' },
            { name: 'create_time' },
            { name: 'color_name' },
            { name: 'size_name' },
            { name: 'total_number' },
            { name: 'number', type: 'add' },
            { name: 'shoddy_number', type: 'add' }
          ]
        })
        // this.total = res.data.meta.total
        this.loading = false
      })
    },
    getHistory (id) {
      this.loading = true
      receiveDispatchSJBB.history({
        id
      }).then((res) => {
        this.historyList = res.data.data.sort((a, b) => {
          return (new Date(a.create_time.date).getTime() - new Date(b.create_time.date).getTime())
        })
        let shoddyTotal = 0
        let total = 0
        this.historyList.forEach((item) => {
          shoddyTotal += (item.shoddy_number ? Number(item.shoddy_number) : 0)
          item.shoddy_total = shoddyTotal
          total += (item.number ? Number(item.number) : 0)
          item.total = total
        })
        this.showHistory = true
        this.loading = false
      })
    }
  },
  created () {
    client.list({
    }).then(res => {
      if (res.data.status !== false) {
        this.clientList = res.data.data.filter((item) => item.type.indexOf(1) !== -1 || item.type.indexOf(2) !== -1)
      }
    })
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/receiveDispatch/SJBB.less";
</style>
