<template>
  <div class="indexMain"
    id="oprDetail"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.oprType}}信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="otherInfo">
            <div class="block">
              <span class="label">{{$route.params.oprType}}金额</span>
              <span class="text">￥{{$formatNum(($route.params.oprType === '开票' && info.settle_price) || ($route.params.oprType === '扣款' && info.deduct_price ) || (($route.params.oprType === '收款' || $route.params.oprType === '付款') && info.price) || 0)}}</span>
            </div>
            <div class="block"
              v-if="$route.params.oprType !== '收款' && $route.params.oprType !== '付款'">
              <span class="label">状态</span>
              <span class="text">{{info.status === 1 ? '待审核' : info.status === 2 ? '已通过' : '已驳回' }}</span>
            </div>
          </div>
        </div>
        <div :class="['statuIcon',info.status === 1 ? 'reasoning' : false,info.status === 3 ? 'pass' : false,info.status === 2 ? 'tongguo' : false]"></div>
        <div class="rowCtn"
          v-if="$route.params.oprType !== '收款' && $route.params.oprType !== '付款'">
          <div class="colCtn flex3">
            <span class="label">{{$route.params.oprType}}编号：</span>
            <span class="text">{{info.settle_code || info.deduct_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">{{$route.params.oprType}}单位：</span>
            <span class="text">{{info.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{info.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">{{$route.params.oprType}}时间：</span>
            <span class="text">{{info.complete_time}}</span>
          </div>
        </div>
        <div class="rowCtn"
          v-if="info.is_invoice===1">
          <div class="colCtn">
            <span class="label">开票信息：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in info.invoice_info"
                :key="index">
                <span>发票号码：</span>
                <span>{{item.invoiceNum}}</span>
                <span style="margin-left:20px">发票金额：</span>
                <span>{{item.invoicePrice}}元</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <!-- <div class="colCtn flex3"
            v-if="$route.params.oprType !== '收款' && $route.params.oprType !== '付款'">
            <span class="label">是否开票：</span>
            <span class="text">{{info.is_invoice===1?'已开票':'未开票'}}</span>
          </div> -->
          <div class="colCtn flex3"
            v-if="$route.params.oprType === '收款' || $route.params.oprType === '付款'">
            <span class="label">{{$route.params.oprType}}方式：</span>
            <span class="text">{{info.type}}</span>
          </div>
          <div class="colCtn">
            <span class="label">包含订单：</span>
            <span class="text">
              <el-tag style="margin-right:12px"
                @click="$openUrl(info.order_type === 2 ? `/sample/sampleOrderDetail/${item.order_id}` : `/order/orderDetail/${item.order_id}`)"
                v-for="(item,index) in info.order_code"
                :key="index">{{item.order_code}}</el-tag>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{info.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="changeLogInfo.length>0">
      <div class="titleCtn">
        <span class="title">修改记录</span>
      </div>
      <div class="detailCtn">
        <div class="timeLine"
          v-for="(item,index) in changeLogInfo"
          :key="index">
          <span class="circle"></span>
          <span class="time">{{item.created_at}}</span>
          <span class="content">{{item|filterChangeStr}}</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="checkFlag">
      <div class="main">
        <div class="title">
          <div class="text">{{$route.params.oprType}}审核</div>
          <i class="el-icon-close"
            @click="checkFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">审核意见：</div>
            <div class="info"
              style="line-height:32px">
              <el-radio v-model="ifPass"
                :label="true">通过</el-radio>
              <el-radio v-model="ifPass"
                :label="false">驳回</el-radio>
            </div>
          </div>
          <div class="row">
            <div class="label">开启通知：</div>
            <div class="info"
              style="line-height:32px">
              <el-radio v-model="ifMsg"
                :label="1">总是通知</el-radio>
              <el-radio v-model="ifMsg"
                :label="2">只在驳回时通知</el-radio>
              <el-radio v-model="ifMsg"
                :label="3">关闭通知</el-radio>
              <el-radio v-model="ifMsg"
                :label="4">只在通过时通知</el-radio>
            </div>
          </div>
          <div class="row">
            <div class="label">驳回理由：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入备注信息（不超过30个字）"
                v-model="checkReason"
                :disabled="ifPass"
                maxlength="30"
                show-word-limit>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">常见选项：</div>
            <div class="info">
              <el-checkbox-group v-model="checkList">
                <el-checkbox :disabled="ifPass"
                  label="物料价格偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="织造费用偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="加工费用偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="包装费用偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="人工费用偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="运输费用偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="基本利润偏低"></el-checkbox>
                <el-checkbox :disabled="ifPass"
                  label="整体报价偏低"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="checkFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="checkFn">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="updateFlag">
      <div class="main">
        <div class="title">
          <div class="text">订单{{$route.params.oprType}}修改</div>
          <i class="el-icon-close"
            @click="updateFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">{{$route.params.oprType}}日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="updateInfo.complete_time"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row"
            v-if="$route.params.oprType==='开票'">
            <div class="label">{{$route.params.oprType}}金额：</div>
            <div class="info">
              <zh-input placeholder="请输入金额"
                type="number"
                v-model="updateInfo.settle_price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row"
            v-if="$route.params.oprType==='扣款'">
            <div class="label">{{$route.params.oprType}}金额：</div>
            <div class="info">
              <zh-input placeholder="请输入金额"
                type="number"
                v-model="updateInfo.deduct_price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row"
            v-if="$route.params.oprType==='收款' ||   $route.params.oprType === '付款'">
            <div class="label">{{$route.params.oprType}}金额：</div>
            <div class="info">
              <zh-input placeholder="请输入金额"
                type="number"
                v-model="updateInfo.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row"
            v-if="$route.params.oprType==='开票'">
            <div class="label">是否开票：</div>
            <div class="info">
              <el-radio v-model="updateInfo.is_invoice"
                :label="1">已开票</el-radio>
              <el-radio v-model="updateInfo.is_invoice"
                :label="2">未开票</el-radio>
            </div>
          </div>
          <div v-show="updateInfo.is_invoice === 1"
            v-for="(item,index) in updateInfo.invoice_info"
            :key="index">
            <div class="row">
              <div class="label">开票号码：</div>
              <div class="info">
                <el-input placeholder="请输入开票号码"
                  v-model="item.invoiceNum"></el-input>
              </div>
              <div class="editBtn blue"
                v-if="index===0"
                @click="addInvoice">添加</div>
              <div class="editBtn red"
                v-if="index>0"
                @click="deleteInvoice(index)">删除</div>
            </div>
            <div class="row">
              <div class="label">开票金额：</div>
              <div class="info">
                <el-input placeholder="请输入开票金额"
                  v-model="item.invoicePrice"></el-input>
              </div>
            </div>
          </div>
          <div class="row"
            v-if="$route.params.oprType === '收款' ||  $route.params.oprType === '付款'">
            <div class="label">{{$route.params.oprType}}方式：</div>
            <div class="info">
              <el-autocomplete v-model="updateInfo.type"
                clearable
                :fetch-suggestions="querySearchCollection"
                :placeholder="`请选择${$route.params.oprType}方式`"></el-autocomplete>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入备注信息"
                v-model="updateInfo.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="updateFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="updateFn">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnRed"
            @click="deleteLog">删除</div>
          <div class="btn btnBlue"
            v-if="$route.params.oprType === '扣款'"
            @click="$openUrl(`/deductTable/${$route.params.clientId}/${$route.params.type}/${$route.params.oprId}/扣款`)">打印</div>
          <div class="btn btnOrange"
            @click="updateFlag=true">修改</div>
          <div class="btn btnBlue"
            @click="checkFlag = true"
            v-if="has_check && info.status === 1">审核</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { settle, chargebacks, notify, collection } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      has_check: window.sessionStorage.getItem('has_check'),
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      checkList: [],
      ifPass: true,
      ifMsg: 2,
      checkFlag: false,
      checkReason: '',
      info: {
        complete_time: '',
        desc: '',
        id: null,
        invoice_info: [{ invoiceNum: '', invoicePrice: '' }],
        is_invoice: 1,
        order_code: [],
        settle_code: null,
        settle_price: 0,
        deduct_price: 0,
        status: 1
      },
      updateFlag: false,
      updateInfo: {
        complete_time: '',
        desc: '',
        id: null,
        invoice_info: [{ invoiceNum: '', invoicePrice: '' }],
        is_invoice: 1,
        order_code: [],
        settle_code: null,
        settle_price: 0,
        deduct_price: 0,
        status: 1
      },
      changeLogInfo: [],
      page: 1,
      total: 1
    }
  },
  methods: {
    querySearchCollection (queryString, cb) {
      let list = window.localStorage.getItem('zh_collection_type')
      list = list ? JSON.parse(list) : []
      list = queryString ? list.filter(itemF => itemF.value.indexOf(queryString) !== -1) : list
      // console.log(list)
      cb(list)
    },
    checkFn () {
      let api = this.$route.params.oprType === '开票' ? settle : chargebacks
      if (this.ifPass) {
        api.check({
          id: this.$route.params.oprId
        }).then((res) => {
          if (res.data.status) {
            let title = '您有一条消息通知'
            if (this.ifMsg === 1 || (this.ifMsg === 2 && !this.ifPass) || (this.ifMsg === 4 && this.ifPass)) {
              notify.create({
                title: title,
                type: '普通',
                tag: '审核',
                content: '有一张' + this.$route.params.oprType + '单' + (this.ifPass ? '<span style="color:#01B48C">已审核通过</span>' : '<span style="color:#F5222D">已被驳回</span>'),
                router_url: '/financialStatistics/oprDetail/' + this.$route.params.client_id + '/' + this.$route.params.type + '/' + this.$route.params.oprId + '/' + this.$route.params.oprType + '?orderId=' + '/' + this.$route.query.orderId,
                receive_user: [this.info.user_id]
              }).then((res) => {
                if (res.data.status) {
                  this.checkFlag = false
                  this.$message.success('审核成功')
                }
              })
            } else {
              this.checkFlag = false
              this.$message.success('审核成功')
            }
          }
        })
      } else {
        api.check({
          id: this.$route.params.oprId,
          reason: JSON.stringify(this.checkList),
          reason_text: this.checkReason
        }).then((res) => {
          if (res.data.status) {
            let title = '您有一条消息通知'
            if (this.ifMsg === 1 || (this.ifMsg === 2 && !this.ifPass) || (this.ifMsg === 4 && this.ifPass)) {
              notify.create({
                title: title,
                type: '普通',
                tag: '审核',
                content: '有一张' + this.$route.params.oprType + '单' + this.ifPass ? '<span style="color:#01B48C">已审核通过</span>' : '<span style="color:#F5222D">已被驳回</span>',
                router_url: '/financialStatistics/oprDetail/' + this.$route.params.client_id + '/' + this.$route.params.type + '/' + this.$route.params.oprId + '/' + this.$route.params.oprType + '?orderId=' + this.$route.query.orderId,
                receive_user: [this.info.user_id]
              }).then((res) => {
                if (res.data.status) {
                  this.checkFlag = false
                  this.$message.success('审核成功')
                }
              })
            } else {
              this.checkFlag = false
              this.$message.success('审核成功')
            }
          }
        })
      }
    },
    updateFn () {
      if (this.$submitLock()) return
      let data = null
      if (this.$route.params.oprType === '开票') {
        data = {
          id: this.updateInfo.id,
          client_id: this.$route.params.clientId,
          order_id: JSON.stringify(this.updateInfo.order_code.map(item => item.order_id)),
          order_type: this.$route.query.orderType || '',
          type: this.$route.params.type,
          desc: this.updateInfo.desc,
          complete_time: this.updateInfo.complete_time,
          is_invoice: this.updateInfo.is_invoice,
          settle_price: this.updateInfo.settle_price,
          invoice_info: JSON.stringify(this.updateInfo.invoice_info)
        }
      } else if (this.$route.params.oprType === '扣款') {
        data = {
          id: this.updateInfo.id,
          client_id: this.$route.params.clientId,
          order_id: JSON.stringify(this.updateInfo.order_code.map(item => item.order_id)),
          order_type: this.$route.query.orderType || '',
          type: this.$route.params.type,
          desc: this.updateInfo.desc,
          complete_time: this.updateInfo.complete_time,
          deduct_price: this.updateInfo.deduct_price
        }
      } else if (this.$route.params.oprType === '收款' || this.$route.params.oprType === '付款') {
        data = {
          id: this.updateInfo.id,
          client_id: this.$route.params.clientId,
          order_id: JSON.stringify(this.updateInfo.order_code.map(item => item.order_id)),
          order_type: this.$route.query.orderType || '',
          type: this.updateInfo.type,
          desc: this.updateInfo.desc,
          complete_time: this.updateInfo.complete_time,
          price: this.updateInfo.price
        }
      }
      const api = (this.$route.params.oprType === '开票' && settle) || ((this.$route.params.oprType === '收款' || this.$route.params.oprType === '付款') && collection) || (this.$route.params.oprType === '扣款' && chargebacks)
      api.create(data).then(res => {
        if (res.data.status !== false) {
          this.$message.success('修改成功')
          this.init()
          this.updateFlag = false
        }
      })
    },
    addInvoice () {
      this.updateInfo.invoice_info.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.updateInfo.invoice_info.splice(index, 1)
    },
    init () {
      this.loading = true
      if (this.$route.params.oprType === '扣款') {
        chargebacks.log({
          client_id: this.$route.params.clientId,
          type: [this.$route.params.type],
          order_id: this.$route.query.orderId || ''
        }).then((res) => {
          this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
          this.updateInfo = this.$clone(this.info)
          this.getChangeLog(this.info.id)
          this.loading = false
        })
      } else if (this.$route.params.oprType === '开票') {
        settle.log({
          client_id: this.$route.params.clientId,
          type: [this.$route.params.type],
          order_id: this.$route.query.orderId || ''
        }).then((res) => {
          this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
          this.updateInfo = this.$clone(this.info)
          this.getChangeLog(this.info.id)
          this.loading = false
        })
      } else if (this.$route.params.oprType === '收款' || this.$route.params.oprType === '付款') {
        collection.log({
          // client_id: this.$route.params.clientId
          // order_id: this.$route.query.orderId || ''
        }).then((res) => {
          this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
          this.updateInfo = this.$clone(this.info)
          // this.getChangeLog(this.info.id)
          this.loading = false
        })
      }
    },
    getChangeLog (id) {
      settle.changeLog({
        pid: id,
        type: this.$route.params.oprType === '开票' ? 1 : 2,
        operate_user: ''
      }).then(res => {
        if (res.data.status !== false) {
          res.data.data.forEach(item => {
            let flag = this.changeLogInfo.find(val => val.id === item.id)
            if (!flag) {
              this.changeLogInfo.push(item)
            }
          })
          this.changeLogInfo.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
        }
      })
    },
    deleteLog () {
      this.$confirm(`此操作将永久删除该${this.$route.params.oprType}记录, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const api = (this.$route.params.oprType === '开票' && settle) || (this.$route.params.oprType === '收款' && collection) || (this.$route.params.oprType === '扣款' && chargebacks)
        api.deleteLog({
          id: this.$route.params.oprId
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.go(-1)
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
  mounted () {
    this.init()
  },
  filters: {
    filterChangeStr (item) {
      let str = ''
      if (item.data_column === 'settle_price') {
        str += item.user_name + '修改了开票金额,'
        str += '由原“' + item.history_data + '”修改为“' + item.new_data + '”'
      } else if (item.data_column === 'complete_time') {
        str += item.user_name + '修改了开票日期,'
        str += '由原“' + item.history_data + '”修改为“' + item.new_data + '”'
      } else if (item.data_column === 'invoice_info') {
        str += item.user_name + '修改了开票信息,'
        str += '由原“' + item.history_data.split('invoiceNum').join('发票号码').split('invoicePrice').join('发票金额') + '”修改为“' + item.new_data.split('invoiceNum').join('发票号码').split('invoicePrice').join('发票金额') + '”'
      } else if (item.data_column === 'desc') {
        str += item.user_name + '修改了备注信息,'
        str += '由原“' + item.history_data + '”修改为“' + item.new_data + '”'
      } else if (item.data_column === 'deduct_price') {
        str += item.user_name + '修改了扣款金额,'
        str += '由原“' + item.history_data + '”修改为“' + item.new_data + '”'
      }
      return str
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/oprDetail.less";
</style>
