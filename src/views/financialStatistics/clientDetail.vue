<template>
  <div class="indexMain"
    id="clientDetail">
    <div class="module">
      <div class="titleCtn">
        <span class="title">XXXX有限公司</span>
        <span class="clientType">(外贸公司)</span>
      </div>
      <div class="listHead">
        <div class="box">
          <div class="boxTop blue">合计</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop green">已结算</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop orange">待结算</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop red">已扣款</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">物料计划</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="tabCtn">
              <span class="tab"
                :class="{'active':type===1}"
                @click="type=1">订购</span>
              <span class="tab"
                :class="{'active':type===2}"
                @click="type=2">加工</span>
              <span class="tab"
                :class="{'active':type===3}"
                @click="type=3">转账</span>
            </div>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              @click="reset"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
            <span class="opr blue">操作记录</span>
            <span class="opr green"
              @click="chargebacksFlag=true">结算</span>
            <span class="opr red">扣款</span>
          </div>
        </div>
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row"
              style="flex:0.2">
              <el-checkbox v-model="value"></el-checkbox>
            </span>
            <span class="tb_row">产品品类</span>
            <span class="tb_row">尺码颜色</span>
            <span class="tb_row">下单数量</span>
            <span class="tb_row">库存数量</span>
            <span class="tb_row">原料损耗</span>
            <span class="tb_row">辅料损耗</span>
            <span class="tb_row">生产数量</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item>
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row"
                  style="flex:0.2">
                  <el-checkbox v-model="value"></el-checkbox>
                </span>
                <span class="tb_row">产品品类1</span>
                <span class="tb_row">尺码颜色1</span>
                <span class="tb_row">下单数量1</span>
                <span class="tb_row">库存数量1</span>
                <span class="tb_row">原料损耗1</span>
                <span class="tb_row">辅料损耗1</span>
                <span class="tb_row">生产数量1</span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品品类</span>
                  <span class="tb_row">尺码颜色</span>
                  <span class="tb_row">下单数量</span>
                  <span class="tb_row">库存数量</span>
                  <span class="tb_row">原料损耗</span>
                  <span class="tb_row">辅料损耗</span>
                  <span class="tb_row">生产数量</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row">下单数量2</span>
                  <span class="tb_row">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row">下单数量2</span>
                  <span class="tb_row">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row">下单数量2</span>
                  <span class="tb_row">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-collapse accordion>
            <el-collapse-item>
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row"
                  style="flex:0.2">
                  <el-checkbox v-model="value"></el-checkbox>
                </span>
                <span class="tb_row">产品品类1</span>
                <span class="tb_row">尺码颜色1</span>
                <span class="tb_row">下单数量1</span>
                <span class="tb_row">库存数量1</span>
                <span class="tb_row">原料损耗1</span>
                <span class="tb_row">辅料损耗1</span>
                <span class="tb_row">生产数量1</span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品品类</span>
                  <span class="tb_row">尺码颜色</span>
                  <span class="tb_row">下单数量</span>
                  <span class="tb_row">库存数量</span>
                  <span class="tb_row">原料损耗</span>
                  <span class="tb_row">辅料损耗</span>
                  <span class="tb_row">生产数量</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row">下单数量2</span>
                  <span class="tb_row">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row">下单数量2</span>
                  <span class="tb_row">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row">下单数量2</span>
                  <span class="tb_row">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="chargebacksFlag">
      <div class="main">
        <div class="title">
          <div class="text">订单结算</div>
          <i class="el-icon-close"
            @click="chargebacksFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">订单编号：</div>
            <div class="info">
              <el-tag closable>
                19ABA
              </el-tag>
              <el-tag closable>
                19ABA12
              </el-tag>
              <el-tag closable>
                19ABA123C
              </el-tag>
            </div>
          </div>
          <div class="row">
            <div class="label">结算日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="chargebacks.date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">结算金额：</div>
            <div class="info">
              <zh-input placeholder="请输入结算金额"
                type="number"
                v-model="chargebacks.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">是否开票：</div>
            <div class="info">
              <el-radio v-model="chargebacks.ifInvoice"
                :label="true">已开票</el-radio>
              <el-radio v-model="chargebacks.ifInvoice"
                :label="false">未开票</el-radio>
            </div>
          </div>
          <div v-show="chargebacks.ifInvoice"
            v-for="(item,index) in chargebacks.invoiceDetail"
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
                placeholder="请输入"
                v-model="chargebacks.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray">取消</div>
          <div class="btn btnBlue">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statistics } from '@/assets/js/api.js'
export default {
  data () {
    return {
      date: [],
      type: 1,
      value: false,
      chargebacksFlag: false,
      chargebacks: {
        date: '',
        price: '',
        ifInvoice: false,
        invoiceDetail: [{
          invoiceNum: '',
          invoicePrice: ''
        }],
        desc: ''
      }
    }
  },
  methods: {
    reset () {

    },
    addInvoice () {
      this.chargebacks.invoiceDetail.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.chargebacks.invoiceDetail.splice(index, 1)
    }
  },
  mounted () {
    Promise.all([statistics.clientDetailList({
      client_id: this.$route.params.id,
      client_type: this.$route.params.type
    }), statistics.clientDetailStatistics({
      client_id: this.$route.params.id,
      client_type: this.$route.params.type
    })]).then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/clientDetail.less";
</style>
<style lang="less">
#clientDetail {
  .el-collapse-item__header {
    position: relative;
    min-height: 54px;
    display: flex;
    .el-collapse-item__arrow {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%) rotateZ(90deg);
      color: #1a95ff;
      &.is-active {
        transform: translateY(-50%) rotateZ(270deg);
      }
    }
  }
  .el-collapse-item__wrap {
    background-color: #f2f4f7;
  }
}
</style>
