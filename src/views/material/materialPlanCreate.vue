<template>
  <div id='materialPlanCreate'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">订单号：</span>
            <span class="text"></span>
          </div>
          <div class="colCtn">
            <span class="label">订单公司：</span>
            <span class="text"></span>
          </div>
          <div class="colCtn">
            <span class="label">系统编号：</span>
            <span class="text"></span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">联系人：</span>
            <span class="text"></span>
          </div>
          <div class="colCtn">
            <span class="label">负责小组：</span>
            <span class="text"></span>
          </div>
          <div class="colCtn">
            <span class="label">下单日期：</span>
            <span class="text"></span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料计划</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row">产品品类</span>
            <span class="tb_row">尺码颜色</span>
            <span class="tb_row">下单数量</span>
            <span class="tb_row">库存数量</span>
            <span class="tb_row">库存调取</span>
            <span class="tb_row">原料损耗</span>
            <span class="tb_row">辅料损耗</span>
            <span class="tb_row">生产数量</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item>
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row two_line">19<br />666</span>
                <span class="tb_row">a</span>
                <span class="tb_row">s</span>
                <span class="tb_row">d</span>
                <span class="tb_row">f</span>
                <span class="tb_row">g</span>
                <span class="tb_row">h</span>
                <span class="tb_row">j</span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品部位</span>
                  <span class="tb_row flex12">物料名称</span>
                  <span class="tb_row">物料颜色</span>
                  <span class="tb_row flex08">单件数量</span>
                  <span class="tb_row flex08">合计数量</span>
                  <span class="tb_row flex08">原料损耗</span>
                  <span class="tb_row flex08">最终数量</span>
                  <span class="tb_row middle flex08">操作</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">不唯一</span>
                  <span class="tb_row flex12">36支晴纶</span>
                  <span class="tb_row">tx-165284</span>
                  <span class="tb_row flex08">100g</span>
                  <span class="tb_row flex08">500g</span>
                  <span class="tb_row flex08">10%</span>
                  <span class="tb_row flex08">1kg</span>
                  <span class="tb_row middle flex08">
                    <span class="tb_handle_btn blue"
                      @click="change">编辑</span>
                  </span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">所需物料</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="tableCtnLv2">
          <div class="tb_header">
            <span class="tb_row flex12">名称</span>
            <span class="tb_row">颜色</span>
            <span class="tb_row flex08">所需数量</span>
            <span class="tb_row flex08">原料损耗</span>
            <span class="tb_row flex08">最终数量</span>
          </div>
          <div class="tb_content">
            <span class="tb_row flex12">36支晴纶</span>
            <span class="tb_row">绿色</span>
            <span class="tb_row flex08">7kg</span>
            <span class="tb_row flex08">10%</span>
            <span class="tb_row flex08">
              <span class="align"><em class="bigNum">7</em>kg</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="this.$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveAll">提交</div>
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
  },
  methods: {
    saveAll () {

    },
    change () {

    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialPlanCreate.less";
</style>
<style lang="less">
#materialPlanCreate {
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
