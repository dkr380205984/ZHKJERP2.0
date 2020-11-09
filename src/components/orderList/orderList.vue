<template>
  <div id='orderListComponent'>
    <div class="list">
      <el-table :data="selfList"
        type="index"
        style="width: 100%">
        <el-table-column fixed
          prop="order_code"
          :label="Number(orderType)===1?'订单号':'样单号'"
          width="180">
          <template slot-scope="scope">
            <!-- 这个插值专门预留给需要勾选改行进行多个数据操作的 -->
            <slot name="codeCheck"
              :itemOrder="scope.row"></slot>
            <span>{{scope.row.order_code}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="client_name"
          fixed
          label="外贸公司"
          :width="320-oprWidth">
        </el-table-column>
        <el-table-column :label="Number(orderType)===1?'产品图片':'样品图片'"
          width="150"
          align="center">
          <template slot-scope="scope">
            <zh-img-list :order_type="Number(orderType)===1?'product':'sample'"
              :list="scope.row.image"
              type='open'></zh-img-list>
          </template>
        </el-table-column>
        <el-table-column prop="product_code"
          :label="Number(orderType)===1?'产品编号':'样品编号'"
          width="150">
        </el-table-column>
        <el-table-column :label="Number(orderType)===1?'订单数量':'样单数量'"
          width="120">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-between;padding-right:15px">
              <span>{{scope.row.product_number}}</span>
              <div class="jtCtn"
                v-show="scope.row.product_info&&scope.row.product_info.length>1">
                <div class="jt el-icon-caret-top"
                  @click="checkPro(scope.row,'last',scope.$index)"></div>
                <div class="jt el-icon-caret-bottom"
                  @click="checkPro(scope.row,'next',scope.$index)"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="流程进度"
          width="160">
          <template slot-scope="scope">
            <slot name="state"
              :itemOrder="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column prop="order_time"
          label="下单日期"
          width="110">
        </el-table-column>
        <el-table-column prop="total_number"
          label="下单总量"
          width="110">
        </el-table-column>
        <el-table-column label="发货日期"
          width="180">
          <template slot-scope="scope">
            <template v-if="Number(orderType)===1">
              <div style="display:flex;justify-content:space-between;padding-right:15px">
                <span>第{{scope.row.timeIndex+1}}批：{{scope.row.dtime}}</span>
                <div class="jtCtn"
                  v-if="scope.row.delivery_time&&scope.row.delivery_time.length>1">
                  <div class="jt el-icon-caret-top"
                    @click="checkTime(scope.row,'last',scope.$index)"></div>
                  <div class="jt el-icon-caret-bottom"
                    @click="checkTime(scope.row,'next',scope.$index)"></div>
                </div>
              </div>
            </template>
            <template v-else>{{scope.row.delivery_time}}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作"
          fixed="right"
          :width="oprWidth">
          <template slot-scope="scope">
            <slot name="opr"
              :itemOrder="scope.row"></slot>
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
    },
    oprWidth: {
      default: 150 // 操作框的宽度
    },
    orderType: {
      default: 1 // 默认是订单
    }
  },
  data () {
    return {
      selfList: []
    }
  },
  watch: {
    list (newVal) {
      if (Number(this.orderType) === 1) {
        this.selfList = newVal.map(item => {
          item.nowIndex = 0
          item.timeIndex = 0
          item.product_info = this.$mergeData(item.product_info, { mainRule: ['product_code', 'product_id'], otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] })
          item.total_number = item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
            return Number(total) + Number(itemNum)
          }, 0)
          this.checkPro(item, 'init')
          this.checkTime(item, 'init')
          return item
        })
      } else {
        this.selfList = newVal.map(item => {
          item.nowIndex = 0
          item.timeIndex = 0
          item.product_info = this.$mergeData(item.product_info, { mainRule: ['product_code', 'product_id'], otherRule: [{ name: 'numbers', type: 'add' }, { name: 'image' }] })
          item.total_number = item.product_info.map(itemPro => itemPro.numbers).reduce((total, itemNum) => {
            return Number(total) + Number(itemNum)
          }, 0)
          this.checkPro(item, 'init')
          return item
        })
      }
    }
  },
  methods: {
    checkTime (item, opr, index) {
      if (item.product_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.dtime = item.delivery_time[item.timeIndex]
          this.$set(this.selfList, index, item)
        }
        if (opr === 'next') {
          if (item.timeIndex === item.delivery_time.length - 1) {
            item.timeIndex = 0
            this.$set(this.selfList, index, item)
            this.checkTime(item)
          } else {
            item.timeIndex += 1
            this.$set(this.selfList, index, item)
            this.checkTime(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.timeIndex === 0) {
            item.timeIndex = item.delivery_time.length - 1
            this.$set(this.selfList, index, item)
            this.checkTime(item)
          } else {
            item.timeIndex -= 1
            this.$set(this.selfList, index, item)
            this.checkTime(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.product_code = '无产品'
        item.product_number = 0
      }
    },
    checkPro (item, opr, index) {
      if (item.product_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.product_code = item.product_info[item.nowIndex].product_code
          item.image = item.product_info[item.nowIndex].image.length > 0 ? item.product_info[item.nowIndex].image.map(itemImg => {
            return {
              ...itemImg,
              product_id: item.product_info[item.nowIndex].product_id
            }
          }) : [{
            image_url: '',
            thumb: '',
            product_id: item.product_info[item.nowIndex].product_id
          }]
          item.product_number = item.product_info[item.nowIndex].numbers
          this.$set(this.selfList, index, item)
        }
        if (opr === 'next') {
          if (item.nowIndex === item.product_info.length - 1) {
            item.nowIndex = 0
            this.$set(this.selfList, index, item)
            this.checkPro(item)
          } else {
            item.nowIndex += 1
            this.$set(this.selfList, index, item)
            this.checkPro(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.nowIndex === 0) {
            item.nowIndex = item.product_info.length - 1
            this.$set(this.selfList, index, item)
            this.checkPro(item)
          } else {
            item.nowIndex -= 1
            this.$set(this.selfList, index, item)
            this.checkPro(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.product_code = '无产品'
        item.product_number = 0
      }
    }
  },
  mounted () {
  }
}
</script>
