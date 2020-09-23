<template>
  <div class='scannerWatcher'
    style="display:none">
    <!-- 不做任何展示，此组件仅创建时产生一个window监听事件，销毁时去除监听事件 -->
  </div>
</template>

<script>
export default {
  props: {
    scannerEvent: { // 用户自行操作函数
      type: Function
    }
  },
  data () {
    return {
      code: '',
      lastTime: new Date().getTime()
    }
  },
  methods: {
    watchFun (e) {
      let curryCode = e.which || e.keyCode
      const curryTime = new Date().getTime()
      if (curryCode === 13 && curryTime - this.lastTime <= 30) { // 当按键为enter时调用callback
        if (!this.code) return
        if (this.scannerEvent) {
          this.scannerEvent(this.code)
        } else { // 默认开新窗口跳转页面
          this.$openUrl(this.code)
        }
        this.code = ''
      } else if (curryCode === 16) {
        this.lastTime = curryTime
      } else if (curryCode === 13) {
        this.lastTime = curryTime
      } else {
        if (curryTime - this.lastTime <= 30) {
          this.code += e.key
        } else if (curryTime - this.lastTime > 100) {
          this.code = e.key
        }
        this.lastTime = curryTime
      }
    }
  },
  created () {
    window.addEventListener('keydown', this.watchFun, false)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.watchFun, false)
  }
}
</script>
