<template>
  <div class="zhBatch">
    <span class="zhText">共{{data.length}}批
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
                <div class="tcolumn">批次备注</div>
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
                <div class="tcolumn"
                  style="padding:12px 0;line-height:1em">
                  <span style="font-size:16px;font-weight:bold;margin-bottom:4px">第{{item.batch_id}}批</span>
                  <span style="margin-bottom:4px">({{item.batch_title || '无'}})</span>
                  <span style="margin-bottom:4px">{{item.delivery_time}}</span>
                  <span>{{item.order_type}}</span>
                </div>
                <div class="tcolumn">
                  <span>
                    <template v-if="!item.desc">无</template>
                    <el-popover placement="top-start"
                      v-else
                      title="批次备注"
                      width="200"
                      trigger="hover"
                      :content="(item.desc).toString()">
                      <span style="cursor: pointer;color:#1A95FF"
                        slot="reference">查看备注</span>
                    </el-popover>
                  </span>
                </div>
                <div class="tcolumn"
                  style="flex:4">
                  <div class="trow"
                    v-for="(itemPro,indexPro) in item.product_info"
                    :key="indexPro">
                    <div class="tcolumn">{{itemPro.product_code}}</div>
                    <div class="tcolumn">
                      <div class="col middle">
                        <zh-img-list :list="itemPro.image"></zh-img-list>
                      </div>
                    </div>
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
