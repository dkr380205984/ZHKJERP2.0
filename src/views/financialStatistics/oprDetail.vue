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
              <span class="label">订单金额</span>
              <span class="text">￥568.903</span>
            </div>
            <div class="block">
              <span class="label">状态</span>
              <span class="text blue">进行中</span>
            </div>
          </div>
        </div>
        <div :class="['statuIcon',status === 1 ? 'reasoning' : false,status === 3 ? 'pass' : false,status === 2 ? 'tongguo' : false]"></div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">样单编号：</span>
            <span class="text">19YABB041</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品名称：</span>
            <span class="text">2019新款披肩</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">样单编号：</span>
            <span class="text">19YABB041</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品名称：</span>
            <span class="text">2019新款披肩</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">多行情况：</span>
            <div class="lineCtn">
              <div class="line">1. 均码 10*20*30</div>
              <div class="line">1. 均码 10*20*30</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">样单编号：</span>
            <span class="text">19YABB041</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">样品描述：</span>
            <span class="text">此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择换行此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择换行</span>
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
    </div>
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
export default {
  data () {
    return {
      checkList: [],
      status: 1
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/oprDetail.less";
</style>
