<template>
  <div id="reimbursementDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">报销信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">报销单号：</span>
            <span class="text">{{reimbursemenInfo.code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">报销人：</span>
            <span class="text">{{reimbursemenInfo.reimburse_user}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">审核状态：</span>
            <span class="text"
              :class="{'red':reimbursemenInfo.status === 2,'blue':reimbursemenInfo.status === 0,'green':reimbursemenInfo.status === 1}">{{reimbursemenInfo.status|filterStatus}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">审核人：</span>
            <span class="text">{{reimbursemenInfo.check_user}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">审核时间：</span>
            <span class="text">{{reimbursemenInfo.check_time || ''}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">审核意见：</span>
            <span class="text">{{reimbursemenInfo.check_text}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">报销凭证：</span>
            <span class="text text-warp">
              <span v-for="(item,index) in reimbursemenInfo.invoice_file"
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
              <div class="tb_row right">{{item.reality_price}}</div>
            </div>
            <div class="tb_header">
              <div class="tb_row strong">合计费用</div>
              <div class="tb_row">{{list|filterApplyTotal}}</div>
              <div class="tb_row right">{{list|filterRealityTotal}}</div>
            </div>
          </div>
        </div>
        <!-- <div class="rowCtn">
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
        </div> -->
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{reimbursemenInfo.apply_text}} </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$openUrl('/reimbursementTable/' + $route.params.id)">打印</div>
          <div class="btn btnBlue"
            @click="checkShow"
            v-if="hasCheckStatus">审核</div>
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
            <span class="label">审核意见：</span>
            <span class="text center">
              <el-radio-group v-model="checkInfo.status">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">驳回</el-radio>
              </el-radio-group>
            </span>
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
                    type='number'
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
          <!-- <div class="row">
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
          </div> -->
          <div class="row">
            <span class="label">审核备注：</span>
            <span class="text"
              style="width:100%">
              <el-input type="textarea"
                :rows="2"
                placeholder="请输入审核备注"
                v-model="checkInfo.check_remark">
              </el-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="closePopup">取消</span>
          <span class="btn btnBlue"
            @click="checkSave">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { chinaNum } from '@/assets/js/dictionary.js'
import { reimbursement, notify } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      ifMsg: 1,
      reimbursemenInfo: {},
      list: [],
      showPopup: false,
      checkInfo: {
        status: 1,
        list: [],
        check_remark: ''
      },
      hasCheckStatus: false
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
      return +item === 1 ? '通过' : +item === 2 ? '驳回' : '待审核'
    }
  },
  methods: {
    checkShow () {
      this.checkInfo = {
        status: 1,
        list: this.list.map(itemM => {
          // itemM.reality_price = itemM.apply_price
          return {
            name: itemM.name,
            apply_price: itemM.apply_price,
            reality_price: itemM.apply_price
          }
        }),
        check_remark: ''
      }
      this.showPopup = true
    },
    closePopup () {
      this.showPopup = false
      this.checkInfo = {
        status: 1,
        list: [],
        check_remark: ''
      }
      this.ifMsg = 1
    },
    checkSave () {
      if (!this.checkInfo.status) {
        this.$message.error('请选择审核结果')
        return
      }
      this.loading = true
      reimbursement.check({
        id: this.$route.params.id,
        status: this.checkInfo.status,
        real_data: this.checkInfo.status === 1 ? JSON.stringify(this.checkInfo.list.map(itemM => {
          return {
            name: itemM.name,
            price: itemM.reality_price
          }
        })) : [],
        check_text: this.checkInfo.check_remark
      }).then(res => {
        if (res.data.status !== false) {
          let title = '您有一条消息通知'
          if (this.ifMsg === 1 || (this.ifMsg === 2 && this.checkInfo.status === 2) || (this.ifMsg === 4 && this.checkInfo.status === 1)) {
            notify.create({
              title: title,
              type: '普通',
              tag: '工序',
              content: '有一张报销单' + (this.checkInfo.status === 1 ? '<span style="color:#01B48C">已审核通过</span>' : '<span style="color:#F5222D">已被驳回</span>'),
              router_url: '/reimbursement/reimbursementDetail/' + this.$route.params.id,
              receive_user: [this.reimbursemenInfo.user_id]
            }).then((res) => {
              if (res.data.status) {
                this.showPopup = false
                this.$message.success('审核成功')
                this.loading = false
                this.init()
              }
            })
          } else {
            this.showPopup = false
            this.$message.success('审核成功')
            this.loading = false
            this.init()
          }
        }
      })
    },
    init () {
      this.loading = true
      this.hasCheckStatus = +window.sessionStorage.getItem('has_check') > 0
      reimbursement.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          this.reimbursemenInfo = res.data.data
          this.reimbursemenInfo.invoice_file = this.reimbursemenInfo.invoice_file.map(itemM => {
            return {
              name: itemM.replace('https://zhihui.tlkrzf.com/', ''),
              url: itemM
            }
          })
          this.list = this.reimbursemenInfo.detail_data ? JSON.parse(this.reimbursemenInfo.detail_data).map(itemM => {
            return {
              name: itemM.name,
              apply_price: itemM.price
            }
          }) : []
          if (this.reimbursemenInfo.real_data) {
            JSON.parse(this.reimbursemenInfo.real_data).forEach(item => {
              let flag = this.list.find(itemF => itemF.name === item.name)
              if (flag) {
                flag.reality_price = item.price
              } else {
                this.list.push({
                  name: item.name,
                  apply_price: 0,
                  reality_price: item.price
                })
              }
            })
          }
        }
        this.loading = false
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursement/reimbursementDetail.less";
</style>
