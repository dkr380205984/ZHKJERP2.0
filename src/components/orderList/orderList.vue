<template>
  <div class='orderList'>
    <div class="list">
      <el-table :data="selfList"
        style="width: 100%">
        <el-table-column fixed
          prop="order_code"
          label="订单号"
          width="180">
        </el-table-column>
        <el-table-column prop="client_name"
          fixed
          label="外贸公司"
          width="150">
        </el-table-column>
        <el-table-column label="产品图片"
          width="150"
          align="center">
          <template slot-scope="scope">
            <zh-img-list :list="scope.row.image"
              type='open'></zh-img-list>
          </template>
        </el-table-column>
        <el-table-column prop="product_code"
          label="产品编号"
          width="150">
        </el-table-column>
        <el-table-column label="下单数量"
          width="120">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-between;padding-right:15px">
              <span>{{scope.row.product_number}}</span>
              <div class="jtCtn"
                v-show="scope.row.product_info.length>1">
                <div class="jt el-icon-caret-top"
                  @click="checkPro(scope.row,'last')"></div>
                <div class="jt el-icon-caret-bottom"
                  @click="checkPro(scope.row,'next')"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="流程进度"
          width="150">
          <template>
            <div style="display:flex">

            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态"
          width="120">
          <template slot-scope="scope">
            <div class="stateCtn rowFlex"
              :class="{'red':scope.row.status === 2003 || scope.row.status === 2005,'green':scope.row.status === 2004,'blue':scope.row.status === 2002,'orange':scope.row.status === 2001}">
              <div class="state"
                style="margin-left:0"></div>
              <span class="name">{{scope.row.status|filterStatus}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_time"
          label="下单日期"
          width="120">
        </el-table-column>
        <el-table-column prop="total_number"
          label="下单总量"
          width="120">
        </el-table-column>
        <el-table-column prop="group_name"
          label="负责小组"
          width="120">
        </el-table-column>
        <el-table-column prop="order_time"
          label="发货日期"
          width="180">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-between;padding-right:15px">
              <span>第{{scope.row.timeIndex+1}}批：{{scope.row.dtime}}</span>
              <div class="jtCtn"
                v-show="scope.row.delivery_time.length>1">
                <div class="jt el-icon-caret-top"
                  @click="checkTime(scope.row,'last')"></div>
                <div class="jt el-icon-caret-bottom"
                  @click="checkTime(scope.row,'next')"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
          fixed="right"
          width="150">
          <template>
            <slot name="opr"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import './orderList.less'
export default {
  props: {
    list: {
      type: Array
    }
  },
  data () {
    return {
      selfList: []
    }
  },
  watch: {

  },
  methods: {

  },
  mounted () {
    // 重算下订单列表
  }
}
</script>
