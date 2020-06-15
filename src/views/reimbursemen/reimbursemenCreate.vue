<template>
  <div id="reimbursemenCreate"
    class="indexMain">
    <div class="module">
      <div class="titleCtn"
        style="display:flex;align-items:center;justify-content: space-between;">
        <span class="title">报销信息
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent">
          </zh-message>
        </span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">报销人</span>
            </div>
            <div class="content">
              <el-input placeholder="请输入报销人"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">同行人</span>
            </div>
            <div class="content">
              <el-input placeholder="请输入同行人"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">报销事由</span>
            </div>
            <div class="content">
              <el-input placeholder="请填写报销理由"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">报销明细</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <div class="tb_row">产品</div>
              <div class="tb_row">产品</div>
              <div class="tb_row">产品</div>
              <div class="tb_row">产品</div>
              <div class="tb_row">产品</div>
            </div>
            <div class="tb_content">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/reimbursemen/reimbursemenCreate.less";
</style>
