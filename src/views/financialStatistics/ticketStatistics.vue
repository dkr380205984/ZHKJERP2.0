<template>
  <div id='ticketStatistics'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item"
        :class="{'active':type==='开票管理'}"
        @click="type='开票管理';getList()">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-kaipiaoguanli"></use>
        </svg>
        <span class="name">开票管理</span>
      </div>
      <div class="cut_item"
        :class="{'active':type==='扣款管理'}"
        @click="type='扣款管理';getList()">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-koukuanguanli"></use>
        </svg>
        <span class="name">扣款管理</span>
      </div>
      <div class="cut_item"
        :class="{'active':type==='付款管理'}"
        @click="type='付款管理';getList()">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-fukuanguanli"></use>
        </svg>
        <span class="name">付款管理</span>
      </div>
      <div class="cut_item"
        :class="{'active':type==='收款管理'}"
        @click="type='收款管理';getList()">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-shoukuanguanli"></use>
        </svg>
        <span class="name">收款管理</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">开票列表</span>
        <!-- <div class="btn btnBlue"
          @click="goSettle(true)">新增开票</div> -->
      </div>
      <div class="listCtn hasBorderTop">
        <template v-if="type==='开票管理'">
          <div class="list">
            <div class="title">
              <div class="col">
                <span class="text">开票编号</span>
              </div>
              <div class="col">
                <span class="text">关联订单</span>
              </div>
              <div class="col">
                <span class="text">开票日期</span>
              </div>
              <div class="col">
                <span class="text">开票号码</span>
              </div>
              <div class="col">
                <span class="text">开票金额</span>
              </div>
              <div class="col">
                <span class="text">开票合计</span>
              </div>
              <div class="col">
                <span class="text">图片信息</span>
              </div>
              <div class="col">
                <span class="text">审核状态</span>
              </div>
              <div class="col">
                <span class="text">操作</span>
              </div>
            </div>
            <div class="row"
              v-for="item in settleList"
              :key="item.id">
              <div class="col">
                <span class="text">{{item.settle_code}}</span>
              </div>
              <div class="col">
                <span class="text">
                  <span style="cursor:pointer;color:#1a95ff"
                    v-for="order in item.order_code"
                    :key="order.order_id"
                    @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span>
                </span>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.complete_time)}}</span>
              </div>
              <div class="col">
                <div style="display:flex;justify-content:space-between;padding-right:15px">
                  <span style="line-height:28px">{{item.invoiceNum}}</span>
                  <div class="jtCtn"
                    v-show="item.invoice_info&&item.invoice_info.length>1">
                    <div class="jt el-icon-caret-top"
                      @click="checkWhich(item,'last',index)"></div>
                    <div class="jt el-icon-caret-bottom"
                      @click="checkWhich(item,'next',index)"></div>
                  </div>
                </div>
              </div>
              <div class="col">
                <span class="text">{{item.invoicePrice}}元</span>
              </div>
              <div class="col">
                <span class="text">{{item.allPrice}}元</span>
              </div>
              <div class="col">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.file_url"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="col">
                <span class="text">{{item.status === 1 ? '待审核' : item.status === 2 ? '已通过' : '已驳回'}}</span>
              </div>
              <div class="col">
                <span class="text">
                  <span class="opr"
                    @click="goSettleDeductDetail(item)">详情</span>
                  <span class="opr red"
                    @click="deleteLog(item.id)">删除</span>
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="type==='扣款管理'">
          <div class="list">
            <div class="title">
              <div class="col">
                <span class="text">扣款编号</span>
              </div>
              <div class="col">
                <span class="text">关联订单</span>
              </div>
              <div class="col">
                <span class="text">扣款日期</span>
              </div>
              <div class="col">
                <span class="text">扣款金额</span>
              </div>
              <div class="col">
                <span class="text">扣款原因</span>
              </div>
              <div class="col">
                <span class="text">图片信息</span>
              </div>
              <div class="col">
                <span class="text">审核状态</span>
              </div>
              <div class="col">
                <span class="text">操作</span>
              </div>
            </div>
            <div class="row"
              v-for="item in chargebacksList"
              :key="item.id">
              <div class="col">
                <span class="text">{{item.deduct_code}}</span>
              </div>
              <div class="col">
                <span class="text"> <span style="cursor:pointer;color:#1a95ff"
                    v-for="order in item.order_code"
                    :key="order.order_id"
                    @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span></span>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.complete_time)}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.deduct_price}}元</span>
              </div>
              <div class="col">
                <span class="text">{{item.desc}}</span>
              </div>
              <div class="col">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.file_url"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="col">
                <span class="text"><span class="text">{{item.status === 1 ? '待审核' : item.status === 2 ? '已通过' : '已驳回'}}</span></span>
              </div>
              <div class="col">
                <span class="text">
                  <span class="opr green"
                    @click.stop="$openUrl(`/deductTable/${item.client_id}/${item.type}/${item.id}/扣款`)">打印</span>
                  <span class="opr"
                    @click="goSettleDeductDetail(item)">详情</span>
                  <span class="opr red"
                    @click="deleteLog(item.id)">删除</span>
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="listCtn hasBorderTop">
            <div class="list">
              <div class="title">
                <div class="col">
                  <span class="text">{{type === '收款管理' ?'收款':'付款'}}编号</span>
                </div>
                <div class="col">
                  <span class="text">关联订单</span>
                </div>
                <div class="col">
                  <span class="text">{{type === '收款管理'?'收款':'付款'}}日期</span>
                </div>
                <div class="col">
                  <span class="text">{{type === '收款管理'?'收款':'付款'}}方式</span>
                </div>
                <div class="col">
                  <span class="text">{{type === '收款管理'?'收款':'付款'}}金额</span>
                </div>
                <div class="col">
                  <span class="text">图片信息</span>
                </div>
                <div class="col">
                  <span class="text">操作</span>
                </div>
              </div>
              <div class="row"
                v-for="item in collectionList"
                :key="item.id">
                <div class="col">
                  <span class="text">{{item.deduct_code}}</span>
                </div>
                <div class="col">
                  <span class="text"> <span style="cursor:pointer;color:#1a95ff"
                      v-for="order in item.order_code"
                      :key="order.order_id"
                      @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span></span>
                </div>
                <div class="col">
                  <span class="text">{{$getTime(item.complete_time)}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.type}}</span>
                </div>
                <div class="col">
                  <span class="text">{{item.price}}元</span>
                </div>
                <div class="col">
                  <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                    :src="item.file_url"
                    :preview-src-list="[item.file_url]">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
                <div class="col">
                  <span class="text">
                    <span class="opr"
                      @click="goSettleDeductDetail(item)">详情</span>
                    <span class="opr red"
                      @click="deleteLog(item.id)">删除</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { settle, chargebacks, collection } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      type: '开票管理',
      chargebacksList: [],
      settleList: [],
      collectionList: [],
      postData: { token: '' },
      page: 1,
      total: 1,
      fileArr: [],
      fileUrl: ''
    }
  },
  methods: {
    goSettleDeductDetail (item) {
      this.$router.push('/financialStatistics/oprDetail/' + item.client_id + '/' + item.type + '/' + item.id + '/' + this.type.slice(0, 2) + '?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)
    },
    checkWhich (item, opr, index) {
      if (item.invoice_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.invoicePrice = item.invoice_info[item.nowIndex || 0].invoicePrice
          item.invoiceNum = item.invoice_info[item.nowIndex || 0].invoiceNum
          this.$set(this.settleList, index, item)
        }
        if (opr === 'next') {
          if (item.nowIndex === item.invoice_info.length - 1) {
            item.nowIndex = 0
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          } else {
            item.nowIndex += 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.nowIndex === 0) {
            item.nowIndex = item.product_info.length - 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          } else {
            item.nowIndex -= 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.invoicePrice = 0
        item.invoiceNum = '无票号'
      }
    },
    getChargeBack () {
      chargebacks.log({
        limit: 10,
        page: this.page
      }).then((res) => {
        this.chargebacksList = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    getSettle () {
      settle.log({
        limit: 10,
        page: this.page
      }).then((res) => {
        this.settleList = res.data.data
        this.total = res.data.meta.total
        this.settleList.forEach((item) => {
          this.checkWhich(item, 'init')
          item.allPrice = item.invoice_info.reduce((total, current) => {
            return total + Number(current.invoicePrice)
          }, 0)
        })
        this.loading = false
      })
    },
    getCollection () {
      collection.log({
        limit: 10,
        page: this.page,
        transfer_type: this.type === '收款管理' ? 1 : 0
      }).then((res) => {
        this.collectionList = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    getList () {
      this.loading = true
      if (this.type === '开票管理') {
        this.getSettle()
      } else if (this.type === '扣款管理') {
        this.getChargeBack()
      } else {
        this.getCollection()
      }
    },
    deleteLog (id) {
      this.$confirm('是否删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.type === '开票管理') {
          settle.deleteLog({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        } else if (this.type === '扣款管理') {
          chargebacks.deleteLog({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        } else {
          collection.deleteLog({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/ticketStatistics.less";
</style>
