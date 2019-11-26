<template>
  <div class='zh_card_position'>
    <slot />
    <div class="zh_card_position__item"
      :style="this.position">
      <zh-card :data='data'></zh-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
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
    },
    position: {
      type: Object,
      default () {
        return {
          bottom: 0,
          left: 0
        }
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
  }
}
</script>

<style scoped lang='less'>
@import "./zhCardPosition.less";
</style>
