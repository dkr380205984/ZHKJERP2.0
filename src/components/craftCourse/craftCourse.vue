<template>
  <div class='craftCourse'>
    <div class="showCtn"
      @click.stop="showPopup = !showPopup">
      <slot name="show" />
    </div>
    <div class="popup"
      v-if="showPopup">
      <div class="main">
        <span class="close el-icon-circle-close"
          @click.stop="showPopup = !showPopup"></span>
        <div class="leftCtn">
          <div class="title">工艺单使用教程</div>
          <div class="content">
            <div class="out_item"
              v-for="(item,index) in allCourse"
              :key="index">
              <span class="label">{{item.title}}</span>
              <div :class="`inner_item ${itemInner.title === nowCourseDetail.title && 'active' || ''}`"
                v-for="(itemInner,indexInner) in item.content"
                :key="indexInner"
                :number='indexInner + 1'
                @click="nowCourseDetail = itemInner">{{itemInner.title}}</div>
            </div>
          </div>
        </div>
        <div class="rightCtn">
          <div class="title">{{nowCourseDetail.title || '标题'}}</div>
          <div class="content">
            <el-image v-for="(item,index) in nowCourseDetail.content"
              :key="index"
              :src="item"
              class="content_el_image"
              :preview-src-list="nowCourseDetail.content"></el-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: { // 是否默认显示
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: false,
      nowCourseDetail: {
        title: '',
        content: []
      },
      allCourse: [
        {
          title: '添加主夹信息教程',
          content: [
            {
              title: '如何添加主夹颜色？',
              content: [
                require('@/assets/image/craftCourse/1/1.png'),
                require('@/assets/image/craftCourse/1/2.png'),
                require('@/assets/image/craftCourse/1/3.png')
              ]
            },
            {
              title: '如何添加主夹纱线？',
              content: [
                require('@/assets/image/craftCourse/2/1.png'),
                require('@/assets/image/craftCourse/2/2.png')
              ]
            },
            {
              title: '如何使用排列表格？',
              content: [
                require('@/assets/image/craftCourse/3/1.png'),
                require('@/assets/image/craftCourse/3/2.png'),
                require('@/assets/image/craftCourse/3/3.png'),
                require('@/assets/image/craftCourse/3/4.png'),
                require('@/assets/image/craftCourse/3/5.png'),
                require('@/assets/image/craftCourse/3/6.png'),
                require('@/assets/image/craftCourse/3/7.png')
              ]
            }
          ]
        },
        {
          title: '添加纹版图教程',
          content: [
            {
              title: '如何使用纹版图？',
              content: [
                require('@/assets/image/craftCourse/4/1.png'),
                require('@/assets/image/craftCourse/4/2.png'),
                require('@/assets/image/craftCourse/4/3.png')
              ]
            },
            {
              title: '如何使用穿综循环？',
              content: [
                require('@/assets/image/craftCourse/5/1.png'),
                require('@/assets/image/craftCourse/5/2.png')
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {

  },
  created () {
    this.showPopup = this.show
    this.nowCourseDetail = this.allCourse[0].content[0]
  }
}
</script>

<style scoped lang='less'>
@import "./craftCourse.less";
</style>
