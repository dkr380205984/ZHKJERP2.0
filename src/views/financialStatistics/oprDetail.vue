<template>
  <div class="indexMain"
    id="oprDetail">
    <div class="module">
      <div class="titleCtn">
        <span class="title">操作信息</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="otherInfo">
            <div class="block">
              <span class="label">结算金额</span>
              <span class="text">￥{{$formatNum(info.settle_price)}}</span>
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
            <span class="label">创建时间：</span>
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
    <!-- <div class="popup"
      v-show="false">
      <div class="main">
        <div class="title">
          <div class="text">财务审核</div>
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
            @click="checkPrice">确定</div>
        </div>
      </div>
    </div> -->
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange">修改</div>
          <div class="btn btnBlue">审核</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { settle, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      checkList: [],
      info: {
        complete_time: '',
        desc: '',
        id: null,
        invoice_info: [{ invoiceNum: '', invoicePrice: '' }],
        is_invoice: 1,
        order_code: [],
        settle_code: null,
        settle_price: 0,
        status: 1
      }
    }
  },
  mounted () {
    if (this.$route.params.oprType === '扣款') {
      chargebacks.log({
        client_id: this.$route.params.clentId,
        client_type: this.$route.params.type,
        order_id: this.$route.params.orderId
      }).then((res) => {
        if (res.data.status) {
          this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
        }
      })
    } else {
      settle.log({
        client_id: this.$route.params.clentId,
        client_type: this.$route.params.type,
        order_id: this.$route.params.orderId
      }).then((res) => {
        if (res.data.status) {
          this.info = res.data.data.find((item) => item.id === Number(this.$route.params.oprId))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/oprDetail.less";
</style>
