<template>
  <div id="materialOrderDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料预订购信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="detailCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订购单位：</span>
            <span class="text">{{detail.client_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">订购总量：</span>
            <span class="text">{{detail.total_weight}}kg</span>
          </div>
          <div class="colCtn">
            <span class="label">预付款：</span>
            <span class="text">{{detail.total_price}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订购日期：</span>
            <span class="text">{{detail.order_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">入库总量：</span>
            <span class="text blue">{{detail.stock_total_weight?detail.stock_total_weight:0}}kg</span>
          </div>
          <div class="colCtn">
            <span class="label">入库总价：</span>
            <span class="text blue">{{detail.stock_total_price?detail.stock_total_price:0}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">备注信息：</span>
            <span class="text">{{detail.desc}}</span>
          </div>
          <div class="colCtn">
            <span class="label">剩余总量：</span>
            <span class="text orange">{{detail.stock_total_weight?detail.total_weight-detail.stock_total_weight:detail.total_weight}}kg</span>
          </div>
          <div class="colCtn">
            <span class="label">{{detail.stock_total_price - detail.total_price>0?'剩余尾款':'预付余额'}}：</span>
            <span class="text"
              :class="{'red':detail.stock_total_price - detail.total_price>0,'green':detail.stock_total_price - detail.total_price<=0}">{{detail.stock_total_price?Math.abs(detail.stock_total_price - detail.total_price):detail.total_price}}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">入库物料</span>
      </div>
      <div class="detailCtn hasBorderTop">
        <div class="normalTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">物料名称</div>
              <div class="tcolumn"
                style="flex:0.5">物料颜色</div>
              <div class="tcolumn"
                style="flex:0.7">物料价格(元/kg)</div>
              <div class="tcolumn"
                style="flex:0.7">订购数量(kg)</div>
              <div class="tcolumn"
                style="flex:0.7">入库总量(kg)</div>
              <div class="tcolumn">入库仓库</div>
              <div class="tcolumn">本次入库</div>
              <div class="tcolumn"
                style="flex:0.5">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in material_info"
              :key="index">
              <div class="tcolumn">{{item.material_name}}</div>
              <div class="tcolumn"
                style="flex:0.5">{{item.color_code}}</div>
              <div class="tcolumn"
                style="flex:0.7">{{item.price}}</div>
              <div class="tcolumn"
                style="flex:0.7;flex-direction: row;line-height: 54px;text-align: left;justify-content: start;">
                <span class="icon"
                  v-if="detail.type===2">合</span>
                <span>{{item.weight}}</span>
              </div>
              <div class="tcolumn"
                style="flex:0.7">{{Number(item.stock_total_weight)}}</div>
              <div class="tcolumn">
                <div class="inputs">
                  <el-select placeholder="请选择仓库"
                    :disabled="!item.editing"
                    v-model="item.stock_id">
                    <el-option v-for="itemStock in stockArr"
                      :key="itemStock.id"
                      :label="itemStock.name"
                      :value="itemStock.id"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="tcolumn">
                <el-input class="inputs"
                  :disabled="!item.editing"
                  placeholder="请输入入库数量"
                  v-model="item.in_weight"></el-input>
              </div>
              <div class="tcolumn"
                style="flex:0.5">
                <span class="opr"
                  v-if="item.editing"
                  @click="submit(item)">确认入库</span>
                <span class="opr"
                  v-if="!item.editing"
                  @click="reset(item)">继续入库</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="module">
      <div class="titleCtn">
        <div class="title">入库日志</div>
      </div>
      <div class="detailCtn hasBorderTop"
        style="overflow:hidden">
        <div class="normalTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">入库时间</div>
              <div class="tcolumn">物料名称</div>
              <div class="tcolumn">物料颜色</div>
              <div class="tcolumn">入库仓库</div>
              <div class="tcolumn">入库重量</div>
              <div class="tcolumn">备注信息</div>
              <div class="tcolumn">操作人</div>
              <div class="tcolumn">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in logArr"
              :key="index">
              <div class="tcolumn">{{item.create_time.slice(0,10)}}</div>
              <div class="tcolumn">{{item.material_name}}</div>
              <div class="tcolumn">{{item.color_code}}</div>
              <div class="tcolumn">{{item.stock_name}}</div>
              <div class="tcolumn">{{item.weight}}</div>
              <div class="tcolumn">{{item.desc?item.desc:'无'}}</div>
              <div class="tcolumn">{{item.user_name}}</div>
              <div class="tcolumn">
                <span class="red"
                  @click="deleteLog(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="getLogList">
          </el-pagination>
        </div>
      </div>
    </div> -->
    <div class="module">
      <div class="titleCtn">
        <span class="title">入库日志</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page">
          <div class="btn noBorder noMargin"
            @click="download">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row"
              style="flex:0.4"></span>
            <span class="tb_row">入库时间</span>
            <span class="tb_row">物料名称</span>
            <span class="tb_row">物料颜色</span>
            <span class="tb_row">入库仓库</span>
            <span class="tb_row">入库重量</span>
            <span class="tb_row">备注信息</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in logArr"
            :key="index">
            <span class="tb_row"
              style="flex:0.4">
              <el-checkbox v-model="item.checked"
                @change="checkLogEvent($event,item)"></el-checkbox>
            </span>
            <span class="tb_row">{{$getTime(item.create_time)}}</span>
            <span class="tb_row">{{item.material_name}}</span>
            <span class="tb_row">{{item.color_code}}</span>
            <span class="tb_row">{{item.stock_name}}</span>
            <span class="tb_row">{{item.weight}}</span>
            <span class="tb_row">{{item.desc?item.desc:'无'}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteLog(item.id)">删除</span>
            </span>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="page"
              @current-change="getLogList">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnGreen"
            @click="$openUrl('/materialOrderTable/'+$route.params.id)">打印</div>
          <div class="btn btnOrange"
            @click="$router.push('/materialOrder/materialOrderUpdate/'+$route.params.id)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { materialOrder, stock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      value: '',
      detail: {
        client_name: '',
        create_time: '',
        desc: '',
        order_time: '',
        total_price: 0,
        total_weight: 0,
        stock_total_price: 0,
        stock_total_weight: 0
      },
      material_info: [],
      stockArr: [],
      logArr: [],
      checkLogArr: [],
      page: 1,
      total: 1
    }
  },
  methods: {
    // 批量导出excel
    download () {
      let data = this.checkLogArr.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      downloadExcel(data, [
        { title: '入库时间', key: 'create_time' },
        { title: '物料名称', key: 'material_name' },
        { title: '物料颜色', key: 'color_code' },
        { title: '入库仓库', key: 'stock_name' },
        { title: '入库重量', key: 'weight' },
        { title: '备注信息', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ])
    },
    checkLogEvent (event, item) {
      if (event) {
        this.checkLogArr.push(this.$clone(item))
      } else {
        let flag = this.checkLogArr.find(value => value.id === item.id)
        if (flag) {
          flag.checked = false
          this.checkLogArr = this.checkLogArr.filter(value => value.checked)
        }
      }
    },
    submit (item) {
      if (!item.stock_id || !item.in_weight) {
        this.$message.error('请输入正确信息')
        return
      }
      this.$prompt('请输入备注信息(也可以点击确定直接入库)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        materialOrder.stockIn({
          reserve_order_id: item.id,
          material_info: [{
            material_name: item.material_name,
            color_code: item.color_code,
            stock_id: item.stock_id,
            type: 1,
            vat_code: '',
            attribute: '',
            weight: item.in_weight,
            desc: value
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('入库成功')
            this.detail.stock_total_weight = Number(this.detail.stock_total_weight || 0) + Number(item.in_weight)
            this.detail.stock_total_price = Number(this.detail.stock_total_price || 0) + Number(item.in_weight) * item.price
            item.stock_total_weight = Number(item.stock_total_weight) + Number(item.in_weight)
            item.editing = false
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/materialOrder/materialOrderDetail/' + this.$route.params.id
              this.msgContent = '<span style="color:#1A95FF">预订购入库</span>' + item.material_name + '(' + item.color_code + ')' + item.in_weight + 'kg'
              this.msgSwitch = true
            } else {
              this.$router.push('/materialOrder/materialOrderDetail/' + this.$route.params.id)
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消入库'
        })
      })
    },
    reset (item) {
      item.in_weight = ''
      item.stock_id = ''
      item.editing = true
    },
    getLogList () {
      this.loading = true
      materialOrder.log({
        reserve_order_id: this.$route.params.id,
        stock_id: null,
        action: null,
        material_name: '',
        limit: 5,
        page: this.page
      }).then((res) => {
        this.logArr = res.data.data.map(item => {
          return {
            ...item,
            checked: false
          }
        })
        this.loading = false
      })
    },
    deleteLog (id) {
      this.$confirm('是否删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        materialOrder.logDelete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.getLogList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created () {
    Promise.all([materialOrder.detail({
      id: this.$route.params.id
    }), stock.list({ type: [1] }),
    materialOrder.log({
      reserve_order_id: this.$route.params.id,
      stock_id: null,
      action: null,
      material_name: '',
      limit: 5,
      page: 1
    })]).then((res) => {
      this.detail = res[0].data.data
      this.material_info = this.detail.material_info.map((item) => {
        return {
          color_code: item.color_code,
          id: this.detail.id,
          in_weight: '',
          price: item.price,
          material_name: item.material_name,
          residue_weight: item.residue_weight,
          editing: true,
          stock_id: '',
          stock_total_weight: item.stock_total_weight,
          weight: item.weight
        }
      })
      this.stockArr = res[1].data.data
      this.logArr = res[2].data.data
      this.total = res[2].data.meta.total
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/materialOrder/materialOrderDetail.less";
</style>
<style lang="less">
.el-message-box__input {
  height: 32px;
  .el-input {
    height: 32px;
  }
}
</style>
