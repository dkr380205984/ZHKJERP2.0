<template>
  <div class="zhTimeProcess">
    <div class="processCtn"
      :ref="'zhTimeProcess'+ id">
      <div class="processLine"
        v-for="(item,index) in renderData"
        :key="'processLine' + index"
        :style="{'width':item.width + 'px'}">{{item.percent * 100 + '%'}}({{item.name}})</div>
      <div class="timeNode unEdit">
        <span class="time">{{startTime}}</span>
        <!-- <span class="name">下单日期</span> -->
      </div>
      <div class="timeNode"
        @mousedown.left="startDrag($event,item)"
        @mouseup.left="endDrag(item)"
        @mousemove="dragging($event,item,index)"
        @mouseout="endDrag(item)"
        v-for="(item,index) in renderData"
        :key="'timeNode' + index"
        :class="{'unEdit':index===renderData.length-1}"
        :style="{'left':item.left + 'px'}">
        <span class="time">{{cmpDate(item.percent)}}</span>
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
    }
  },
  watch: {
    renderData (newVal) {
      this.$emit('input', newVal)
    }
  },
  data () {
    return {
      id: 1, // 用于标记当前组件的id，一个页面有多个该组件的时候可以用到
      startTime: '2020-01-01',
      endTime: '2020-03-01',
      needTime: 0, // 所需时间
      domWidth: 0,
      renderData: [],
      mousePosition: 0 // 记录鼠标位置
    }
  },
  methods: {
    cmpDate (percent) {
      let startTime = new Date(this.startTime)
      startTime.setDate(startTime.getDate() + Math.round(percent * this.needTime))
      return startTime.getFullYear() + '-' + (startTime.getMonth() < 9 ? '0' + (startTime.getMonth() + 1) : (startTime.getMonth() + 1)) + '-' + (startTime.getDate() < 10 ? '0' + (startTime.getDate()) : startTime.getDate())
    },
    startDrag (ev, item) {
      this.mousePosition = ev.clientX
      item.draggble = true
    },
    endDrag (item) {
      item.draggble = false
    },
    dragging (ev, item, index) {
      if (item.draggble) {
        let itemNext = this.renderData[index + 1]
        let deltX = ev.clientX - this.mousePosition
        item.left = item.left + deltX
        item.width = item.width + deltX
        item.percent = (item.width / this.domWidth).toFixed(2)
        itemNext.width = itemNext.width - deltX
        itemNext.percent = (itemNext.width / this.domWidth).toFixed(2)
        this.mousePosition = ev.clientX
        this.$forceUpdate()
      }
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
