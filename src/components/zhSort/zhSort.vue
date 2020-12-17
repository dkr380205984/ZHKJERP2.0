<template>
  <div class='zhSortCtn'
    @click="onChange">
    <i class="el-icon-caret-top top"
      :class="{'active':selfValue === 1}"></i>
    <i class="el-icon-caret-bottom bottom"
      :class="{'active':selfValue === 2}"></i>
  </div>
</template>

<script>
export default {
  props: {
    'value': {
      type: Number,
      default: 0 // 0 none;1 up;2 down
    },
    'specialKey': {
      type: String
    }
  },
  watch: {
    value (newVal) {
      this.selfValue = newVal
    }
  },
  data () {
    return {
      selfValue: 0
    }
  },
  methods: {
    onChange () {
      let value = (+this.selfValue + 1) % 3
      this.$emit('input', value)
      this.$emit('change', {
        value,
        specialKey: this.specialKey || null
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import "./zhSort.less";
</style>
