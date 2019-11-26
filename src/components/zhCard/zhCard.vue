<template>
  <div class="zh_card">
    <div class="zh_card_main is_active">
      <div class="zh_card_left">
        <el-image class="imgItem"
          :src="data.img[0] ? data.img[0].thumb : require('@/assets/image/index/noPic.jpg')"
          :preview-src-list="data.img.map(vals=>vals.image_url)">
        </el-image>
        <span class="blue">{{data.product_code}}</span>
        <span>{{data|filterType}}</span>
      </div>
      <ul class="zh_card_right">
        <li>
          <span class="title">产品编号:</span>
          <span class="info blue">{{data.product_code}}</span>
        </li>
        <li>
          <span class="title">产品品类:</span>
          <span class="info">{{data|filterType}}</span>
        </li>
        <li>
          <span class="title">颜色色组:</span>
          <span class="info">{{data.color.join('/')}}</span>
        </li>
        <li>
          <span class="title">尺码规格:</span>
          <span class="info">
            <div class="sizeCtn"
              v-for="(value,index) in data.size"
              :key="index">
              <span>{{value.measurement}}</span>
              (
              <span>{{value.size_info}}</span>
              <span>克重：{{value.weight}}g</span>
              )
            </div>
          </span>
        </li>
        <li>
          <span class="title">产品描述:</span>
          <span class="info">{{data.description ? data.description : '暂无描述信息'}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default () {
        return {
          product_code: '',
          img: [],
          category_name: '',
          type_name: '',
          style_name: '',
          color: [],
          size: [],
          description: ''
        }
      }
    }
  },
  data () {
    return {
    }
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
    }
  },
  created () {
    console.log(this.data)
  }
}
</script>

<style scoped lang="less">
@import "./zhCard.less";
</style>
