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
              <span class="text">￥{{$formatNum(info.settle_price?info.settle_price:info.deduct_price)}}</span>
            </div>
            <div class="block">
              <span class="label">状态</span>
              <span class="text">{{info.status === 1 ? '待审核' : info.status === 2 ? '已通过' : '已驳回' }}</span>
            </div>
          </div>
        </div>
        <div :class="['statuIcon',info.status === 1 ? 'reasoning' : false,info.status === 3 ? 'pass' : false,info.status === 2 ? 'tongguo' : false]"></div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">{{$route.params.oprType}}编号：</span>
            <span class="text">{{info.settle_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{info.user_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">是否开票：</span>
            <span class="text">{{info.is_invoice===1?'已开票':'未开票'}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">结算时间：</span>
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
          <div class="colCtn">
            <span class="label">包含订单：</span>
            <span class="text">
              <el-tag style="margin-right:12px"
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">修改记录</span>
      </div>
      <div class="detailCtn">
        <div class="timeLine">
          <span class="circle"></span>
          <span class="time">
            2019-01-01
          </span>
          <span class="content">
            aaaaaaaaaaaaaaaaaaaaa
          </span>
        </div>
        <div class="timeLine">
          <span class="circle"></span>
          <span class="time">
            2019-01-01
          </span>
          <span class="content">
            aaaaaaaaaaaaaaaaaaaaa
          </span>
        </div>
        <div class="timeLine">
          <span class="circle"></span>
          <span class="time">
            2019-01-01
          </span>
          <span class="content">
            aaaaaaaaaaaaaaaaaaaaa
          </span>
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
            v-if="$route.params.oprType==='结算'">
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
                v-model="updateInfo.deduce_price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row"
            v-if="$route.params.oprType==='结算'">
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
import { settle, chargebacks, notify } from '@/assets/js/api.js'
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
      }
    }
  },
  methods: {
    checkFn () {
      let api = this.$route.params.oprType === '结算' ? settle : chargebacks
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
                content: '有一张报价单' + (this.ifPass ? '<span style="color:#01B48C">已审核通过</span>' : '<span style="color:#F5222D">已被驳回</span>'),
                router_url: '/financialStatistics/oprDetail/' + this.$route.params.client_id + '/' + this.$route.params.type + '/' + this.$route.params.oprId + '/' + this.$route.params.orderId + '/' + this.$route.params.oprType,
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
                content: '有一张报价单' + this.ifPass ? '<span style="color:#01B48C">已审核通过</span>' : '<span style="color:#F5222D">已被驳回</span>',
                router_url: '/financialStatistics/oprDetail/' + this.$route.params.client_id + '/' + this.$route.params.type + '/' + this.$route.params.oprId + '/' + this.$route.params.orderId + '/' + this.$route.params.oprType,
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

    },
    addInvoice () {
      this.updateInfo.invoice_info.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.updateInfo.invoice_info.splice(index, 1)
    }
  },
  mounted () {
    if (this.$route.params.oprType === '扣款') {
      chargebacks.log({
        client_id: this.$route.params.clentId,
        client_type: this.$route.params.type,
        order_id: this.$route.params.orderId
      }).then((res) => {
        this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
        this.updateInfo = this.$clone(this.info)
        this.loading = false
      })
    } else {
      settle.log({
        client_id: this.$route.params.clentId,
        client_type: this.$route.params.type,
        order_id: this.$route.params.orderId
      }).then((res) => {
        this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
        this.updateInfo = this.$clone(this.info)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/oprDetail.less";
</style>
