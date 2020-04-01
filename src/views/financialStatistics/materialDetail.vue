<template>
  <div class="indexMain"
    id="materialDetail"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料信息</span>
      </div>
      <div class="material">
        <span class="icon">原</span>
        <span class="name">{{$strToAscII($route.params.name,true)}}</span>
        <span class="date">统计时间段（2018-09-02 至 2019-02-02）</span>
      </div>
      <div class="flexBox">
        <div class="box">
          <span class="boxTop">合计使用</span>
          <span class="boxBottom">
            <span class="num">{{$formatNum(total.use_total)}}</span>
            <span class="em">千克</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">合计价格</span>
          <span class="boxBottom">
            <span class="num">{{$formatNum(total.total_price)}}</span>
            <span class="em">元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">库存剩余</span>
          <span class="boxBottom">
            <span class="num">{{$formatNum(total.stock_number)}}</span>
            <span class="em">千克</span>
          </span>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料订购</span>
      </div>
      <div class="listCtn">
        <div class="flexBox">
          <div class="box">
            <span class="boxTop">订购数量</span>
            <span class="boxBottom">
              <span class="num">{{$formatNum(WLDGStat.totalNum)}}</span>
              <span class="em">千克</span>
            </span>
          </div>
          <div class="box">
            <span class="boxTop">平均价格</span>
            <span class="boxBottom">
              <span class="num">{{WLDGStat.prePrice}}</span>
              <span class="em">元</span>
            </span>
          </div>
          <div class="box">
            <span class="boxTop">合计数量</span>
            <span class="boxBottom">
              <span class="num">{{$formatNum(WLDGStat.totalPrice)}}</span>
              <span class="em">元</span>
            </span>
          </div>
        </div>
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">
                <span class="text">
                  <span class="text"
                    v-show="!WLDGCMPFlag">订购公司
                    <i class="el-icon-search iconBtn"
                      @click="WLDGCMPFlag=true"></i>
                  </span>
                  <transition name="el-zoom-in-top">
                    <div v-show="WLDGCMPFlag"
                      class="filterBox">
                      <el-select v-model="WLDGCMP"
                        @change="getWLDGList"
                        clearable
                        filterable
                        placeholder="筛选公司">
                        <el-option v-for="(item,index) in companyArr"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </transition>
                </span>
              </div>
              <div class="tcolumn">订购时间</div>
              <div class="tcolumn">订购数量</div>
              <div class="tcolumn">订购单价</div>
              <div class="tcolumn">合计价格</div>
              <div class="tcolumn">操作人</div>
              <div class="tcolumn">订单号</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in  WLDGRender"
              :key="index">
              <div class="tcolumn">{{item.order_client}}</div>
              <div class="tcolumn">{{item.complete_time}}</div>
              <div class="tcolumn">{{item.weight}}</div>
              <div class="tcolumn">{{item.price}}</div>
              <div class="tcolumn">{{item.price*item.weight}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
              <div class="tcolumn">{{item.order_code}}</div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="WLDGTotal"
            :current-page.sync="WLDGPage"></el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料预订购</span>
      </div>
      <div class="listCtn">
        <div class="flexBox">
          <div class="box">
            <span class="boxTop">预订购数量</span>
            <span class="boxBottom">
              <span class="num">{{$formatNum(WLYDGStat.totalNum)}}</span>
              <span class="em">千克</span>
            </span>
          </div>
          <div class="box">
            <span class="boxTop">平均价格</span>
            <span class="boxBottom">
              <span class="num">{{WLYDGStat.prePrice}}</span>
              <span class="em">元</span>
            </span>
          </div>
          <div class="box">
            <span class="boxTop">合计价格</span>
            <span class="boxBottom">
              <span class="num">{{$formatNum(WLYDGStat.totalPrice)}}</span>
              <span class="em">元</span>
            </span>
          </div>
        </div>
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">
                <span class="text">
                  <span class="text"
                    v-show="!WLYDGCMPFlag">订购公司
                    <i class="el-icon-search iconBtn"
                      @click="WLYDGCMPFlag=true"></i>
                  </span>
                  <transition name="el-zoom-in-top">
                    <div v-show="WLYDGCMPFlag"
                      class="filterBox">
                      <el-select v-model="WLYDGCMP"
                        @change="getWLYDGList"
                        clearable
                        filterable
                        placeholder="筛选公司">
                        <el-option v-for="(item,index) in companyArr"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </transition>
                </span>
              </div>
              <div class="tcolumn">订购时间</div>
              <div class="tcolumn">入库数量</div>
              <div class="tcolumn">订购单价</div>
              <div class="tcolumn">合计价格</div>
              <div class="tcolumn">操作人</div>
              <div class="tcolumn">订单号</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in  WLYDGRender"
              :key="index">
              <div class="tcolumn">{{item.client_name}}</div>
              <div class="tcolumn">{{item.order_time}}</div>
              <div class="tcolumn">{{item.stock_number}}</div>
              <div class="tcolumn">{{item.price}}</div>
              <div class="tcolumn">{{item.price*item.stock_number}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
              <div class="tcolumn">{{item.order_code}}</div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="WLYDGTotal"
            :current-page.sync="WLYDGPage"></el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料出入库</span>
      </div>
      <div class="listCtn">
        <div class="flexBox">
          <div class="box">
            <span class="boxTop">计划数量</span>
            <span class="boxBottom">
              <span class="num">{{$formatNum(WLYDGStat.totalNum)}}</span>
              <span class="em">千克</span>
            </span>
          </div>
          <div class="box">
            <span class="boxTop">入库数量</span>
            <span class="boxBottom">
              <span class="num">{{WLYDGStat.prePrice}}</span>
              <span class="em">千克</span>
            </span>
          </div>
          <div class="box">
            <span class="boxTop">出库数量</span>
            <span class="boxBottom">
              <span class="num">{{$formatNum(WLYDGStat.totalPrice)}}</span>
              <span class="em">千克</span>
            </span>
          </div>
        </div>
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">
                <span class="text">
                  <span class="text"
                    v-show="!WLYDGCMPFlag">出入库单位
                    <i class="el-icon-search iconBtn"
                      @click="WLYDGCMPFlag=true"></i>
                  </span>
                  <transition name="el-zoom-in-top">
                    <div v-show="WLYDGCMPFlag"
                      class="filterBox">
                      <el-select v-model="WLYDGCMP"
                        @change="getWLYDGList"
                        clearable
                        filterable
                        placeholder="筛选公司">
                        <el-option v-for="(item,index) in companyArr"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </transition>
                </span>
              </div>
              <div class="tcolumn">出入库时间</div>
              <div class="tcolumn">出入库数量</div>
              <div class="tcolumn">出入库类型</div>
              <div class="tcolumn">操作人</div>
              <div class="tcolumn">关联订单号</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in  WLYDGRender"
              :key="index">
              <div class="tcolumn">{{item.client_name}}</div>
              <div class="tcolumn">{{item.order_time}}</div>
              <div class="tcolumn">{{item.stock_number}}</div>
              <div class="tcolumn">{{item.price}}</div>
              <div class="tcolumn">{{item.price*item.stock_number}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
              <div class="tcolumn">{{item.order_code}}</div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="WLYDGTotal"
            :current-page.sync="WLYDGPage"></el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存记录</span>
      </div>
      <div class="listCtn">
        <div class="flexTb"
          style="margin-top:24px">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">仓库名称</div>
              <div class="tcolumn">库存数量</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in  CKRender"
              :key="index">
              <div class="tcolumn">{{item.stock_name}}</div>
              <div class="tcolumn">{{item.total_weight}}</div>
              <div class="tcolumn">
                <span class="blue"
                  @click="$router.push('/stock/stockDetail/' + item.stock_id + '/undefined')">查看仓库</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="CKTotal"
            :current-page.sync="CKPage"></el-pagination>
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
  </div>
</template>

<script>
import { statistics, materialOrder, yarnStock, materialManage, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      total: {
        use_total: 0,
        total_price: 0,
        stock_number: 0
      },
      WLDGCMP: '', // 物料订购公司筛选id
      WLDGCMPFlag: false,
      WLYDGCMP: '',
      WLYDGCMPFlag: false,
      companyArr: [],
      WLDGList: [], // 物料订购列表
      WLDGPage: 1,
      WLDGTotal: 1,
      WLYDGList: [], // 预订购列表
      WLYDGPage: 1,
      WLYDGTotal: 1,
      CKList: [],
      CKPage: 1,
      CKTotal: 1
    }
  },
  computed: {
    WLDGRender () {
      return this.WLDGList.slice((this.WLDGPage - 1) * 5, this.WLDGPage * 5)
    },
    WLDGStat () {
      if (this.WLDGList.length === 0) {
        return {
          totalNum: 0,
          prePrice: 0,
          totalPrice: 0
        }
      } else {
        let numPrice = this.WLDGList.reduce((total, current) => {
          return {
            totalNum: Number(total.totalNum) + Number(current.weight),
            totalPrice: Number(total.totalPrice) + current.price * current.weight
          }
        }, {
          totalNum: 0,
          totalPrice: 0
        })
        numPrice.prePrice = (numPrice.totalPrice / numPrice.totalNum).toFixed(2)
        return numPrice
      }
    },
    WLYDGRender () {
      return this.WLYDGList.slice((this.WLYDGPage - 1) * 5, this.WLYDGPage * 5)
    },
    WLYDGStat () {
      if (this.WLYDGList.length === 0) {
        return {
          totalNum: 0,
          prePrice: 0,
          totalPrice: 0
        }
      } else {
        let numPrice = this.WLYDGList.reduce((total, current) => {
          return {
            totalNum: Number(total.totalNum) + Number(current.stock_number),
            totalPrice: Number(total.totalPrice) + current.price * current.stock_number
          }
        }, {
          totalNum: 0,
          totalPrice: 0
        })
        numPrice.prePrice = (numPrice.totalPrice / numPrice.totalNum).toFixed(2)
        return numPrice
      }
    },
    CKRender () {
      return this.CKList.slice((this.CKPage - 1) * 5, this.CKPage * 5)
    }
  },
  methods: {
    getWLDGList () {
      this.loading = true
      materialManage.detail({
        material_name: this.$strToAscII(this.$route.params.name, true),
        client_id: this.WLDGCMP
      }).then((res) => {
        this.WLDGList = res.data.data
        this.WLDGTotal = res.data.data.length
        this.loading = false
      })
    },
    getWLYDGList () {
      this.loading = true
      materialOrder.list({
        material_name: this.$strToAscII(this.$route.params.name, true),
        client_id: this.WLYDGCMP
      }).then((res) => {
        console.log(res)
        this.WLYDGList = res.data.data
        this.WLYDGTotal = res.data.data.length
        this.loading = false
      })
    }
  },
  mounted () {
    Promise.all([statistics.materialDetail({
      material_name: this.$strToAscII(this.$route.params.name, true),
      type: this.$route.params.type
    }), materialOrder.list({
      material_name: this.$strToAscII(this.$route.params.name, true)
    }), yarnStock.list({
      material_name: this.$strToAscII(this.$route.params.name, true)
    }), materialManage.detail({
      material_name: this.$strToAscII(this.$route.params.name, true)
    }), client.list()]).then((res) => {
      this.WLDGList = res[3].data.data
      this.WLDGTotal = res[3].data.data.length
      this.WLYDGList = res[1].data.data
      this.WLYDGTotal = res[1].data.data.length
      console.log(this.WLYDGList)
      this.CKList = res[2].data.data
      this.CKTotal = res[2].data.data.length
      this.total = res[0].data.data
      this.companyArr = res[4].data.data
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/materialDetail.less";
</style>
