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
      lastTime: 0
    }
  },
  methods: {
    watchFun (e) {
      let curryCode = e.which
      if (curryCode === 13) { // 当按键为enter时调用callback
        if (this.scannerEvent) {
          this.scannerEvent(this.code)
        } else { // 默认开新窗口跳转页面
          this.$openUrl(this.code)
        }
        this.code = ''
        this.lastTime = 0
      } else {
        const curryTime = new Date().getTime()
        if (this.lastTime > 0) {
          if (curryTime - this.lastTime <= 300) {
            this.code += String.fromCharCode(curryCode)
          } else if (curryTime - this.lastTime > 1000) {
            this.code = ''
            this.lastTime = 0
          }
        } else {
          this.code += String.fromCharCode(curryCode)
        }
      }
    }
  },
  created () {
    window.addEventListener('keypress', this.watchFun)
  },
  beforeDestroy () {
    window.removeEventListener('keypress', this.watchFun)
  }
}
</script>
