<template>
  <div class="indexMain"
    id="materialDetail">
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料信息</span>
      </div>
      <div class="material">
        <span class="icon">原</span>
        <span class="name">32支上光晴纶</span>
        <span class="date">统计时间段（2018-09-02 至 2019-02-02）</span>
      </div>
      <div class="flexBox">
        <div class="box">
          <span class="boxTop">合计使用</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">合计价格</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">库存剩余</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料订购</span>
      </div>
      <div class="flexBox">
        <div class="box">
          <span class="boxTop">订购数量</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">平均价格</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">合计数量</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
      </div>
      <div class="flexTb">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">订购公司</div>
            <div class="tcolumn">订购时间</div>
            <div class="tcolumn">订购数量</div>
            <div class="tcolumn">订购单价</div>
            <div class="tcolumn">合计价格</div>
            <div class="tcolumn">操作人</div>
            <div class="tcolumn">订单号</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"></div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料预订购</span>
      </div>
      <div class="flexBox">
        <div class="box">
          <span class="boxTop">预订购数量</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">平均价格</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
        <div class="box">
          <span class="boxTop">合计价格</span>
          <span class="boxBottom">
            <span class="num">123,456</span>
            <span class="em">万元</span>
          </span>
        </div>
      </div>
      <div class="flexTb">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">订购公司</div>
            <div class="tcolumn">订购时间</div>
            <div class="tcolumn">入库数量</div>
            <div class="tcolumn">订购单价</div>
            <div class="tcolumn">合计价格</div>
            <div class="tcolumn">操作人</div>
            <div class="tcolumn">订单号</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"></div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">库存记录</span>
      </div>
      <div class="flexTb"
        style="margin-top:24px">
        <div class="thead">
          <div class="trow">
            <div class="tcolumn">仓库名称</div>
            <div class="tcolumn">库存数量</div>
            <div class="tcolumn">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"></div>
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
@import "~@/assets/less/financialStatistics/materialDetail.less";
</style>
