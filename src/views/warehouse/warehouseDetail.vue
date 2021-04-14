<template>
  <div id="warehouseDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">进仓编号：</span>
            <span class="text">{{detail.code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单编号：</span>
            <span class="text blueLink"
              v-for="(itemOrder,indexOrder) in detail.orders"
              :key="indexOrder"
              @click="$router.push('/order/orderDetail/' + itemOrder.id)">{{itemOrder.order_code}}{{indexOrder !== detail.orders.length - 1 ? ';' : ''}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">出货日期：</span>
            <span class="text">{{detail.complete_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">运输地址：</span>
            <span class="text">{{detail.address.join(',')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">总件数：</span>
            <span class="text">{{detail.total_number}}件</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">总毛重：</span>
            <span class="text">{{detail.total_gross_weight}}kg</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">总体积：</span>
            <span class="text">{{detail.cubic_number}}m³</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{detail.desc}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">文件信息：</span>
            <span class="text text-warp">
              <span v-for="(item,index) in detail.file_url"
                :key="index"
                class="linkBox">
                <i class="el-icon-view el-icon--right"></i>
                <a :href="item.url"
                  target="view_window"
                  :download="item.url">{{item.name}}</a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnRed"
            @click="deleteWarehouse"
            v-if="!$route.query.DC">删除</div>
          <div class="btn btnBlue">打印</div>
          <div class="btn btnOrange"
            @click="$router.push(`/warehouse/warehouseUpdate/${$route.params.id}`)"
            v-if="!$route.query.DC">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warehouse } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      detail: {
        address: [],
        file_url: []
      }
    }
  },
  methods: {
    deleteWarehouse () {
      this.$confirm(`此操作将永久删除编号为“${this.detail.code}”的进仓单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        warehouse.delete({
          id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.push('/warehouse/warehouseList/page=1&&keyword=&&date=&&address=')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    init () {
      this.loading = true
      warehouse.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          this.detail = res.data.data
          this.detail.address = this.detail.address ? JSON.parse(this.detail.address) : []
          this.detail.file_url = JSON.parse(this.detail.file_url).map(itemM => {
            return {
              name: itemM.replace('https://file.zwyknit.com/', ''),
              url: itemM
            }
          })
          this.loading = false
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/warehouse/warehouseDetail.less";
</style>
