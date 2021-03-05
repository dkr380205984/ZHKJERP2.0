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
              <div class="label">{{item.title}}</div>
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
          title: '如何添加主夹颜色？',
          content: [
            {
              title: '如何添加原料颜色名称？',
              content: [
                require('@/assets/image/craftCourse/1/1.png')
              ]
            },
            {
              title: '如何查找潘通色号？',
              content: [
                require('@/assets/image/craftCourse/1/2.png')
              ]
            },
            {
              title: '如何添加新的潘通色号？',
              content: [
                require('@/assets/image/craftCourse/1/3.png')
              ]
            }
          ]
        },
        {
          title: '如何添加主夹纱线？',
          content: [
            {
              title: '如何添加金丝:银丝？',
              content: [
                require('@/assets/image/craftCourse/2/1.png')
              ]
            },
            {
              title: '如何设置次要原料？',
              content: [
                require('@/assets/image/craftCourse/2/2.png')
              ]
            }
          ]
        },
        {
          title: '如何使用排列表格？',
          content: [
            {
              title: '如何使用复制粘贴功能？',
              content: [
                require('@/assets/image/craftCourse/3/1.png')
              ]
            },
            {
              title: '如何使用删除列功能？',
              content: [
                require('@/assets/image/craftCourse/3/2.png')
              ]
            },
            {
              title: '如何添加合并型？',
              content: [
                require('@/assets/image/craftCourse/3/3.png')
              ]
            },
            {
              title: '如何设置穿综法？',
              content: [
                require('@/assets/image/craftCourse/3/4.png')
              ]
            },
            {
              title: '如何设置X几遍最后去掉波浪线？',
              content: [
                require('@/assets/image/craftCourse/3/5.png')
              ]
            },
            {
              title: '如何设置顺一遍倒一遍？',
              content: [
                require('@/assets/image/craftCourse/3/6.png')
              ]
            },
            {
              title: '如何设置停撬？',
              content: [
                require('@/assets/image/craftCourse/3/7.png')
              ]
            }
          ]
        },
        {
          title: '如何使用纹版图？',
          content: [
            {
              title: '普通和高级纹版图的区别？',
              content: [
                require('@/assets/image/craftCourse/4/1.png')
              ]
            },
            {
              title: '如何设置A,B纹版图？',
              content: [
                require('@/assets/image/craftCourse/4/2.png')
              ]
            },
            {
              title: '如何设置纹板图x多遍？',
              content: [
                require('@/assets/image/craftCourse/4/3.png')
              ]
            }
          ]
        },
        {
          title: '如何使用穿综循环？',
          content: [
            {
              title: '普通和高级穿综法的区别？',
              content: [
                require('@/assets/image/craftCourse/5/1.png')
              ]
            },
            {
              title: '如何设置多循环的穿综法？',
              content: [
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
