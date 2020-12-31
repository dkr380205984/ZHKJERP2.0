<template>
  <div class='indexMain'>
    <zh-editor class='zheditor' />
  </div>
</template>

<script>
import ZhEditor from '@/components/zhEditor/index.vue'
export default {
  data () {
    return {

    }
  },
  components: {
    ZhEditor
  },
  methods: {

  }
}
</script>

<style scoped lang='less'>
.zheditor {
  display: block;
  width: 800px;
  height: 800px;
  background: rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
</style>
