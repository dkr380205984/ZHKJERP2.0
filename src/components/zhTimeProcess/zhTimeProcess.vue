<template>
  <div class="zhTimeProcess">
    <div class="processCtn"
      :ref="'zhTimeProcess'+ id">
      <div class="processLine"
        v-for="(item,index) in renderData"
        :key="'processLine' + index"
        :style="{'width':item.width + 'px'}">{{Math.round(item.percent*needTime) + '天'}}({{$toFixed(item.percent * 100) + '%'}})</div>
      <div class="timeNode unEdit">
        <span class="time">{{startTime}}</span>
        <!-- <span class="name">下单日期</span> -->
      </div>
      <!-- @mousemove="dragging($event,item,index)"
        @mouseout="endDrag(item)" -->
      <div class="timeNode"
        @mousedown.left="startDrag($event,item,index)"
        @mouseup.left="endDrag(item)"
        v-for="(item,index) in renderData"
        :key="'timeNode' + index"
        :class="{'unEdit':index===renderData.length-1}"
        :style="{'left':item.left + 'px','z-index':99-index}">
        <span class="time"
          style="background-color:#FFF">{{cmpDate(item.percent,index)}}</span>
        <span class="name"
          style="background-color:#FFF;min-width:5em;text-align:center">{{item.name}}</span>
        <!-- <span class="name">{{item.name}}</span> -->
      </div>
    </div>
  </div>
</template>
<script>
import './zhTimeProcess.less'
export default {
  props: {
    processData: {
      type: Array,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    handleFlag: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    renderData (newVal) {
      this.$emit('input', newVal)
    },
    startTime (newVal) { // 页面初始化时数据没进来导致数据错误优化
      this.needTime = (new Date(this.endTime).getTime() - new Date(newVal).getTime()) / 1000 / 60 / 60 / 24
    },
    endTime (newVal) { // 页面初始化时数据没进来导致数据错误优化
      this.needTime = (new Date(newVal).getTime() - new Date(this.startTime).getTime()) / 1000 / 60 / 60 / 24
    },
    processData (newVal) {
      let left = 0
      this.renderData = newVal.map((item) => {
        item.width = Math.round(this.domWidth * item.percent)
        left = left + item.width
        item.left = left
        return item
      })
    }
  },
  data () {
    return {
      id: 1, // 用于标记当前组件的id，一个页面有多个该组件的时候可以用到
      needTime: 0, // 所需时间
      domWidth: 0,
      renderData: [],
      mousePosition: 0 // 记录鼠标位置
    }
  },
  methods: {
    cmpDate (percent, index) {
      let renderData = this.renderData.slice(0, index + 1).map(item => +item.percent)
      let totalPercent = renderData.length > 0 ? renderData.reduce((a, b) => {
        return a + b
      }) : 0
      let startTime = new Date(this.startTime)
      startTime.setDate(startTime.getDate() + Math.round(totalPercent * this.needTime))
      return this.$getTime(startTime)
    },
    startDrag (ev, item, index) {
      if (!this.handleFlag) {
        return false
      }
      this.mousePosition = ev.clientX
      item.draggble = true
      this.bodyEvent({
        item: item,
        index: index
      })
    },
    endDrag (item) {
      if (!this.handleFlag) {
        return false
      }
      item.draggble = false
      this.bodyEvent({ flag: true })
    },
    bodyEvent (item) {
      // console.log(item)
      let windowEvent = window.document.getElementsByTagName('body')[0]
      let evFun = (event) => {
        if (item.item.draggble) {
          let itemNext = this.renderData[item.index + 1]
          let deltX = event.clientX - this.mousePosition
          deltX = deltX > itemNext.width ? itemNext.width : deltX
          if (item.item.width + deltX > 0) {
            item.item.left = item.item.left + deltX
            item.item.width = item.item.width + deltX
            item.item.percent = (item.item.width / this.domWidth).toFixed(2)
            itemNext.width = itemNext.width - deltX
            itemNext.percent = (itemNext.width / this.domWidth).toFixed(2)
            this.mousePosition = event.clientX
            this.$forceUpdate()
          }
        }
        // console.log(event.clientX)
      }
      if (item.flag) {
        windowEvent.removeEventListener('mousemove', evFun)
        return
      }
      windowEvent.addEventListener('mousemove', evFun)
      windowEvent.addEventListener('mouseup', () => {
        item.item.draggble = false
        windowEvent.removeEventListener('mousemove', evFun)
      })
    },
    dragging (ev, item, index) {
      // if (!this.handleFlag) {
      //   return false
      // }
      // if (item.draggble) {
      //   // this.bodyEvent(true)
      //   let itemNext = this.renderData[index + 1]
      //   let deltX = event.clientX - this.mousePosition
      //   item.left = item.left + deltX
      //   item.width = item.width + deltX
      //   item.percent = (item.width / this.domWidth).toFixed(2)
      //   itemNext.width = itemNext.width - deltX
      //   itemNext.percent = (itemNext.width / this.domWidth).toFixed(2)
      //   this.mousePosition = event.clientX
      //   this.$forceUpdate()
      // }
      // console.log(ev)
    }
  },
  mounted () {
    this.needTime = (new Date(this.endTime).getTime() - new Date(this.startTime).getTime()) / 1000 / 60 / 60 / 24
    this.domWidth = this.$refs['zhTimeProcess' + this.id].offsetWidth
    let left = 0
    this.renderData = this.processData.map((item) => {
      item.width = Math.round(this.domWidth * item.percent)
      left = left + item.width
      item.left = left
      return item
    })
  }
}
</script>
