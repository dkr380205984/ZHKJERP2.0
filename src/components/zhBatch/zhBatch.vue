<template>
  <div class="zhBatch">
    <span class="zhText">共{{test.length}}批
      <span class="blue"
        @click="showPopup=true">(点击查看详情)</span>
    </span>
    <div class="zhPopup"
      v-show="showPopup">
      <div class="main">
        <div class="title">
          <div class="text">批次信息列表</div>
          <i class="el-icon-close"
            @click="showPopup=false"></i>
        </div>
        <div class="content">
          <div class="zhTable">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">发货批次</div>
                <div class="tcolumn">产品编号</div>
                <div class="tcolumn">产品图片</div>
                <div class="tcolumn">尺码/配色</div>
                <div class="tcolumn">发货数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in data"
                :key="index">
                <div class="tcolumn">
                  <span>第{{index+1}}批</span>
                  <span>{{item.delivery_time}}</span>
                </div>
                <div class="tcolumn"
                  style="flex:4">
                  <div class="trow"
                    v-for="(itemPro,indexPro) in item.product_info"
                    :key="indexPro">
                    <div class="tcolumn">产品编号</div>
                    <div class="tcolumn">产品图片</div>
                    <div class="tcolumn">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                    <div class="tcolumn">{{itemPro.numbers}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './zhBatch.less'
export default {
  props: ['data'],
  data () {
    return {
      test: [[{
        color_name: '粉红色',
        size_name: '均码',
        unit_price: 12,
        number: 500,
        delivery_time: '2019-12-26'
      }, {
        color_name: '粉红色',
        size_name: '均码',
        unit_price: 12,
        number: 500,
        delivery_time: '2019-12-26'
      }], [{
        color_name: '粉红色',
        size_name: '均码',
        unit_price: 12,
        number: 500,
        delivery_time: '2019-12-26'
      }, {
        color_name: '粉红色',
        size_name: '均码',
        unit_price: 12,
        number: 500,
        delivery_time: '2019-12-26'
      }]],
      showPopup: false
    }
  }
}
</script>
