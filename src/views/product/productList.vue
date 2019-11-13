<template>
  <div id="productList"
    class="indexMain">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              placeholder="请输入编号查询"></el-input>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <div class="rightCtn">
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
          </div>
          <div class="row">

          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: '',
      date: '',
      total: 100,
      pages: 1
    }
  },
  methods: {
    getList () {

    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productList.less";
</style>
