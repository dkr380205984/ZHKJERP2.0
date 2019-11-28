<template>
  <div id='materialPlanList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入编号按回车键查询">
            </el-input>
            <el-date-picker v-model="date"
              style="width:290px"
              class="inputs"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeRouter(1)">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <!-- <div class="rightCtn">
            <div class="btn btnWhiteBlue">批量操作</div>
          </div> -->
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">订购日期</span>
            </div>
            <div class="col flex12">
              <span class="text">订单公司</span>
            </div>
            <div class="col flex08">
              <span class="text">预付款</span>
            </div>
            <div class="col flex08">
              <span class="text">预定总量(kg)</span>
            </div>
            <div class="col flex08">
              <span class="text">已入库量(kg)</span>
            </div>
            <div class="col middle">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex12">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col flex08">{{itemOrder.number}}</div>
            <div class="col flex08">{{itemOrder.group_name}}</div>
            <div class="col flex08">{{itemOrder.group_name}}</div>
            <div class="col middle">
              <span class="opr"
                @click="$router.push('/order/orderDetail/' + itemOrder.id)">详情</span>
              <span class="opr">入库</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0
    }
  },
  methods: {
    getOrderList () {
      this.loading = true
      order.list({
        limit: 10,
        page: this.pages
      }).then(res => {
        this.list = res.data.data.map(item => {
          let img = []
          let number = 0
          for (let prop in item.order_batch) {
            let val = item.order_batch[prop]
            val.forEach(valBatch => {
              number += Number(valBatch.numbers)
              img.push(...valBatch.category_info.images)
            })
          }
          return {
            id: item.id,
            order_code: item.order_code,
            client_name: item.client_name,
            image: img,
            number: number,
            group_name: item.group_name,
            order_time: item.order_time
          }
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    handleCommand (type, id) {
      if (type === 'change') {
        this.$router.push('/order/orderUpdate/' + id)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          order.delete({
            id: id
          }).then(res => {
            if (res.data.status) {
              this.$message.success('删除成功')
              setTimeout(() => {
                window.location.reload()
              }, 300)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.warning('未知命令')
      }
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialPlanList.less";
</style>
