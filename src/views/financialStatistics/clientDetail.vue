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
          <div class="boxTop">合计</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">已结算</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">待结算</div>
          <div class="boxBottom">
            <span class="num"></span>
            <span class="em">万元</span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">已扣款</div>
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
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row">产品品类</span>
            <span class="tb_row">尺码颜色</span>
            <span class="tb_row flex08">下单数量</span>
            <span class="tb_row flex08">库存数量</span>
            <span class="tb_row">原料损耗</span>
            <span class="tb_row">辅料损耗</span>
            <span class="tb_row">生产数量</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item>
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row">产品品类1</span>
                <span class="tb_row">尺码颜色1</span>
                <span class="tb_row flex08">下单数量1</span>
                <span class="tb_row flex08">库存数量1</span>
                <span class="tb_row">原料损耗1</span>
                <span class="tb_row">辅料损耗1</span>
                <span class="tb_row">生产数量1</span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品品类</span>
                  <span class="tb_row">尺码颜色</span>
                  <span class="tb_row flex08">下单数量</span>
                  <span class="tb_row flex08">库存数量</span>
                  <span class="tb_row">原料损耗</span>
                  <span class="tb_row">辅料损耗</span>
                  <span class="tb_row">生产数量</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row flex08">下单数量2</span>
                  <span class="tb_row flex08">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row flex08">下单数量2</span>
                  <span class="tb_row flex08">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row flex08">下单数量2</span>
                  <span class="tb_row flex08">库存数量2</span>
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
                <span class="tb_row">产品品类1</span>
                <span class="tb_row">尺码颜色1</span>
                <span class="tb_row flex08">下单数量1</span>
                <span class="tb_row flex08">库存数量1</span>
                <span class="tb_row">原料损耗1</span>
                <span class="tb_row">辅料损耗1</span>
                <span class="tb_row">生产数量1</span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">产品品类</span>
                  <span class="tb_row">尺码颜色</span>
                  <span class="tb_row flex08">下单数量</span>
                  <span class="tb_row flex08">库存数量</span>
                  <span class="tb_row">原料损耗</span>
                  <span class="tb_row">辅料损耗</span>
                  <span class="tb_row">生产数量</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row flex08">下单数量2</span>
                  <span class="tb_row flex08">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row flex08">下单数量2</span>
                  <span class="tb_row flex08">库存数量2</span>
                  <span class="tb_row">原料损耗2</span>
                  <span class="tb_row">辅料损耗2</span>
                  <span class="tb_row">生产数量2</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight">
                  <span class="tb_row">产品品类2</span>
                  <span class="tb_row">尺码颜色2</span>
                  <span class="tb_row flex08">下单数量2</span>
                  <span class="tb_row flex08">库存数量2</span>
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
  </div>
</template>

<script>
export default {

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
