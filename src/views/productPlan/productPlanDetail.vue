<template>
  <div id="productPlanDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">产品信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品编号：</span>
            <span class="text">{{productInfo.product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">产品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.sample_title}">{{productInfo.sample_title?productInfo.sample_title:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">产品品类：</span>
            <span class="text">{{productInfo.category_info.product_category}}/{{productInfo.type_name}}/{{productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">产品成分：</span>
            <span class="text">{{productInfo.materials|filterMaterials}}</span>
          </div>
          <div class="colCtn">
            <span class="label">产品配色：</span>
            <span class="text">
              <span v-for="(item,index) in productInfo.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}
              </span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品规格：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in productInfo.size"
                :key="index">{{item.measurement+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':productInfo.description}">{{productInfo.description?productInfo.description:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料信息</span>
      </div>
      <div class="detailCtn">
        <div class="titleNum">36支单股晴纶</div>
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow">
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn"
                style="flex:3">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1">复杂表格</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1">复杂表格</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tcolumn">复杂表格</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      productInfo: {
        product_code: '',
        type_name: '',
        flower_id: '',
        style_name: '',
        category_info: {
          product_category: '',
          name: ''
        },
        color: [],
        materials: [],
        create_time: '',
        user_name: '',
        size: [],
        sample_title: ''
      }
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].ingredient_name) {
        arr.forEach((item) => {
          str += item.ingredient_name + item.ingredient_value + '%' + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  mounted () {
    this.loading = false
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanDetail.less";
</style>
