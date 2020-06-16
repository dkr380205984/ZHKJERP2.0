<template>
  <div id="reimnursemenDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">报销信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">报销人：</span>
            <span class="text">{{reimbursemenInfo.reimbursemen_user}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">同行人：</span>
            <span class="text">{{reimbursemenInfo.reimbursemen_other_user || ''}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">审核状态：</span>
            <span class="text"
              :class="{'red':reimbursemenInfo.status === 3,'blue':reimbursemenInfo.status === 1,'green':reimbursemenInfo.status === 2}">{{reimbursemenInfo.status|filterStatus}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">报销事由：</span>
            <span class="text">{{reimbursemenInfo.reimbursemen_content || ''}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">报销明细</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <div class="tb_row">报销内容</div>
              <div class="tb_row">申请报销金额(元)</div>
              <div class="tb_row right">实际报销金额(元)</div>
            </div>
            <div class="tb_content"
              v-for="(item,index) in list"
              :key="index">
              <div class="tb_row">{{item.name}}</div>
              <div class="tb_row">{{item.apply_price}}</div>
              <div class="tb_row">{{item.reality_price}}</div>
            </div>
            <div class="tb_header">
              <div class="tb_row strong">合计费用</div>
              <div class="tb_row">{{list|filterApplyTotal}}</div>
              <div class="tb_row right">{{list|filterRealityTotal}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">付款方式：</span>
            <span class="text">
              <span class="iconFont zfb">支付宝</span>
              <span class="iconFont wx">微信</span>
              <span class="iconFont yh">银行转账</span>
              <span class="iconFont xj">现金支付</span>
              <span class="iconFont jk">借款扣除</span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{reimbursemenInfo.remark}} </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="checkShow">审核</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showPopup">
      <div class="main"
        style="width:800px;">
        <div class="title">
          <span class="text">审核报销</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="content"
          style="max-height:600px;">
          <div class="row">
            <span class="label">审核结果：</span>
            <span class="text center">
              <el-radio-group v-model="checkInfo.status">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">驳回</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="row">
            <div class="tableCtnLv2">
              <span class="tb_header">
                <span class="tb_row">报销内容</span>
                <span class="tb_row">申请报销金额(元)</span>
                <span class="tb_row">实际报销金额(元)</span>
              </span>
              <span class="tb_content"
                v-for="(item,index) in checkInfo.list"
                :key="index">
                <span class="tb_row">{{item.name}}</span>
                <span class="tb_row">{{item.apply_price}}</span>
                <span class="tb_row">
                  <zh-input placeholder="请输入"
                    :disabled="checkInfo.status === 2"
                    class="tb_row_input"
                    v-model="item.reality_price"></zh-input>
                </span>
              </span>
              <span class="tb_header">
                <span class="tb_row">合计金额</span>
                <span class="tb_row">{{checkInfo.list|filterApplyTotal}}</span>
                <span class="tb_row">{{checkInfo.list|filterRealityTotal}}</span>
              </span>
            </div>
          </div>
          <div class="row">
            <span class="label">付款方式：</span>
            <span class="text">
              <el-radio-group v-model="checkInfo.pay_type"
                class="radioBox">
                <el-radio :label="1"
                  :disabled="checkInfo.status === 2"
                  class="radio_item">
                  <span class="iconFont zfb">支付宝</span>
                </el-radio>
                <el-radio :label="2"
                  :disabled="checkInfo.status === 2"
                  class="radio_item">
                  <span class="iconFont wx">微信</span>
                </el-radio>
                <el-radio :label="3"
                  :disabled="checkInfo.status === 2"
                  class="radio_item">
                  <span class="iconFont yh">银行转账</span>
                </el-radio>
                <el-radio :label="4"
                  :disabled="checkInfo.status === 2"
                  class="radio_item">
                  <span class="iconFont xj">现金支付</span>
                </el-radio>
                <el-radio :label="5"
                  :disabled="checkInfo.status === 2"
                  class="radio_item">
                  <span class="iconFont jk">借款扣除</span>
                </el-radio>
              </el-radio-group>
            </span>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="closePopup">取消</span>
          <span class="btn btnBlue">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { chinaNum } from '@/assets/js/dictionary.js'
// import { product, craft, auth, assignCraftOrPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      reimbursemenInfo: {
        reimbursemen_user: '隔壁老王',
        reimbursemen_other_user: '老李',
        status: 2,
        reimbursemen_content: '外出办公',
        pay_type: 3,
        remark: '备注信息，长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本。'
      },
      list: [
        {
          name: '油费',
          apply_price: 100,
          reality_price: ''
        },
        {
          name: '打车费',
          apply_price: 80,
          reality_price: ''
        },
        {
          name: '住宿费',
          apply_price: 300,
          reality_price: ''
        }
      ],
      showPopup: false,
      checkInfo: {
        status: 1,
        list: [],
        pay_type: 1
      }
    }
  },
  filters: {
    filterApplyTotal (item) {
      return item.map(itemM => (+itemM.apply_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
    },
    filterRealityTotal (item) {
      return item.map(itemM => (+itemM.reality_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
    },
    filterStatus (item) {
      return +item === 2 ? '通过' : +item === 3 ? '驳回' : '待审核'
    }
  },
  methods: {
    checkShow () {
      this.checkInfo = {
        status: 1,
        list: this.$clone(this.list),
        pay_type: 1
      }
      this.showPopup = true
    },
    closePopup () {
      this.showPopup = false
      this.checkInfo = {
        status: 1,
        list: [],
        pay_type: 1
      }
    }
  },
  created () {
    this.loading = false
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursemen/reimbursemenDetail.less";
</style>
