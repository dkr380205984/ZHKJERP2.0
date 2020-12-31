<template>
  <div class='zh_editor_content'
    :ref="refId"
    @click.right="showMeau">
    <zh-editor-text @select='selectComponent'
      :isSelect="selectId"
      :pId="refId" />
    <zh-editor-text @select='selectComponent'
      :isSelect="selectId"
      :pId="refId" />
  </div>
</template>

<script>
import ZhEditorText from './zhEditorText/index.vue'
import { getNodeOutset } from './index.js'
export default {
  name: 'zhkjEditor',
  data () {
    return {
      refId: Math.random().toString(32).slice(2, 8),
      offsetLeft: 0,
      offsetTop: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      selectId: ''
    }
  },
  methods: {
    showMeau (e) {
      e.preventDefault()
    },
    // 改变画布大小
    changeSize (e) {
      if (e.clientX <= (this.offsetWidth + this.offsetLeft + 1) && e.clientX >= (this.offsetWidth + this.offsetLeft - 5) && e.clientY <= (this.offsetHeight + this.offsetTop + 1) && e.clientY >= (this.offsetHeight + this.offsetTop - 5)) {
        // console.log(e.clientX, e.clientY)
        document.body.style.cursor = 'se-resize'
        window.addEventListener('mousedown', this.changeDowm)
      } else {
        document.body.style.cursor = 'auto'
        window.removeEventListener('mousedown', this.changeDowm)
      }
    },
    changeDowm (e) {
      this.selectId = ''
      window.addEventListener('mousemove', this.changeMove)
      window.addEventListener('mouseup', this.changeUp)
    },
    changeMove (e) {
      // 跟随鼠标改变宽高
      this.selfNode.style.width = `${e.clientX - this.offsetLeft}px`
      this.selfNode.style.height = `${e.clientY - this.offsetTop}px`
      // 更新width,height,left,top
      this.updateNodeInfo()
    },
    changeUp (e) {
      window.removeEventListener('mousemove', this.changeMove)
      window.removeEventListener('mouseup', this.changeUp)
    },
    selectComponent (id) {
      this.selectId = id
    },
    updateNodeInfo () {
      const nodeInfo = getNodeOutset(this.selfNode, true)
      this.offsetLeft = nodeInfo.left
      this.offsetTop = nodeInfo.top
      this.offsetWidth = this.selfNode.offsetWidth
      this.offsetHeight = this.selfNode.offsetHeight
    }
  },
  mounted () {
    this.updateNodeInfo()
    window.addEventListener('mousemove', this.changeSize)
    window.addEventListener('click', () => {
      this.selectId = ''
    })
  },
  computed: {
    selfNode () {
      return this.$refs[this.refId]
    }
  },
  components: {
    ZhEditorText
  }
}
</script>

<style scoped lang='less'>
@import "./index.less";
</style>
