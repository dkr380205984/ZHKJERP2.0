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
        <span>{{(index+1) + ' / ' + list.length}}</span>
        <span>点击查看</span>
      </div>
    </div>
    <img :src="list[index]"
      class="img"
      alt="">
    <div class="zh_img_screen"
      v-show="isClickFlag">
      <div class="close"
        @click.stop="isClickFlag = !isClickFlag">点此退出预览</div>
      <div class="zh_img_box">
        <img :src="list[index]"
          alt=""
          class="screen_img">
        <div class="left handle_btn_item el-icon-arrow-left"
          @click.stop="firstFlag ? false : index--"></div>
        <div class="right handle_btn_item el-icon-arrow-right"
          @click.stop="lastFlag ? false : index++"></div>
        <ul class="handle_indicator">
          <li v-for="(item,key) in list"
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
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      index: 0,
      lastFlag: false,
      firstFlag: true,
      isClickFlag: false
    }
  },
  watch: {
    index (newVal) {
      if (newVal === this.list.length - 1) {
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
      console.log(1)
    }
  },
  created () {
    if (this.list.length === 1) {
      this.firstFlag = true
      this.lastFlag = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./zhImgList.less";
</style>
