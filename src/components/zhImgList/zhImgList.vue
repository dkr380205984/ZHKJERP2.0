<template>
  <div class="zh_img_list"
    @click.stop="showBig">
    <div class="hover_bg">
      <div class="handle_btn_context">
        <span class="left el-icon-arrow-left handle_btn_item"
          @click.stop="firstFlag ? false : index--"></span>
        <span class="right el-icon-arrow-right handle_btn_item"
          @click.stop="lastFlag ? false : index++"></span>
      </div>
      <div class="index_info">
        <span>{{(index+1) + ' / ' + selfList.length}}</span>
        <span>点击查看</span>
      </div>
    </div>
    <img :src="selfList[index].thumb"
      class="img"
      :onerror="defaultImg">
    <div class="zh_img_screen"
      v-show="isClickFlag">
      <div class="close"
        @click.stop="isClickFlag = !isClickFlag">点此退出预览</div>
      <div class="zh_img_box">
        <img :src="selfList[index].image_url"
          :onerror="defaultImg"
          class="screen_img">
        <div class="left handle_btn_item el-icon-arrow-left"
          @click.stop="firstFlag ? false : index--"></div>
        <div class="right handle_btn_item el-icon-arrow-right"
          @click.stop="lastFlag ? false : index++"></div>
        <ul class="handle_indicator">
          <li v-for="(item,key) in selfList"
            :class="index === key ? 'active' : false"
            :key="key"
            @click="index = key"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    pro_id: [String, Number],
    type: {
      type: String,
      default: 'show',
      validator: (value) => {
        return value === 'show' || value === 'open'
      }
    }
  },
  data () {
    return {
      index: 0,
      lastFlag: false,
      firstFlag: true,
      isClickFlag: false,
      defaultImg: 'this.src="' + require('@/assets/image/index/noPic.jpg') + '"'
    }
  },
  watch: {
    index (newVal) {
      if (newVal === this.selfList.length - 1) {
        this.lastFlag = true
      } else {
        this.lastFlag = false
      }
      if (newVal === 0) {
        this.firstFlag = true
      } else {
        this.firstFlag = false
      }
    }
  },
  methods: {
    showBig () {
      this.isClickFlag = true
    }
  },
  computed: {
    selfList () {
      return this.list.length === 0 ? [{
        image_url: '',
        thumb: ''
      }] : this.list
    }
  },
  mounted () {
    if (this.list.length === 1 || this.list.length === 0) {
      this.firstFlag = true
      this.lastFlag = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./zhImgList.less";
</style>
