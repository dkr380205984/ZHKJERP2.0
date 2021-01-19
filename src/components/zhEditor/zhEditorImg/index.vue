<template>
  <div :class='`zh_editor_image_content ${isSelfSelect ? "select" : "" }`'
    @click.stop="selectThis"
    :ref="`${selfId}`"
    :style="{
      zIndex:zIndex,
      top:`${style.top||10}px`,
      left:`${style.left||10}px`,
      width:`${style.width||200}px`,
      height:`${style.height || 40}px`
    }">
    <div class="zh_editor_image_content__ctn"
      :style="`backgroundImage: url(${value.imgUrl})`"></div>
    <span class="changeSize"
      v-show="isSelfSelect"
      @mousedown.stop="changeSizeDown"></span>
    <div class="subline"
      @mousedown.stop="stopPropagationFun"
      v-show="isSelfSelect">
      <span class="left"
        :style="{'width':`${selfNodeInfo && selfNodeInfo.left || 0}px`}">
        <span class="after_value">{{selfNodeInfo && selfNodeInfo.left || 0}}</span>
      </span>
      <span class="top"
        :style="{'height':`${selfNodeInfo && selfNodeInfo.top || 0}px`}">
        <span class="after_value">{{selfNodeInfo && selfNodeInfo.top || 0}}</span>
      </span>
      <span class="right"
        :style="{'width':`${selfNodeInfo && selfNodeInfo.right || 0}px`}">
        <span class="after_value">{{selfNodeInfo && selfNodeInfo.right || 0}}</span>
      </span>
      <span class="bottom"
        :style="{'height':`${selfNodeInfo && selfNodeInfo.bottom || 0}px`}">
        <span class="after_value">{{selfNodeInfo && selfNodeInfo.bottom || 0}}</span>
      </span>
    </div>
    <div class="zIndexCtn"
      v-show="isSelfSelect">
      <span class="item"
        @click.stop="$emit('zIndex',false)">-</span>
      <span class="item"
        style="width:40px">{{zIndex}}</span>
      <span class="item"
        @click.stop="$emit('zIndex',true)">+</span>
    </div>
  </div>
</template>

<script>
import { getNodeOutset } from '../index.js'
export default {
  props: {
    isSelect: [String, Boolean],
    pId: String,
    value: [Object],
    zIndex: Number
  },
  data () {
    return {
      refId: Math.random().toString(32).slice(2, 6),
      style: {
        top: 10,
        left: 10,
        width: 200,
        height: 40
      },
      isChangeSize: false, // 是否在改动size
      selfNodeInfo: null,
      moveLeft: 0,
      moveTop: 0
    }
  },
  methods: {
    selectThis (e) {
      this.selfNode.addEventListener('mousedown', this.changePositon, false)
      this.updatedSelfNodeInfo()
      this.$emit('select', this.selfId)
    },
    changePositon (e) {
      if (this.isChangeSize) return
      this.moveLeft = e.clientX - this.selfNode.offsetLeft
      this.moveTop = e.clientY - this.selfNode.offsetTop
      document.body.style.cursor = 'all-scroll'
      this.selfNode.parentNode.addEventListener('mousemove', this.changePositonMove)
      this.selfNode.parentNode.addEventListener('mouseup', this.changePositonUp)
    },
    changePositonMove (e) {
      if (!this.isSelfSelect) return
      const left = e.clientX - this.moveLeft
      const maxLeft = this.selfNode.parentNode.offsetWidth - this.selfNode.offsetWidth
      const top = e.clientY - this.moveTop
      const maxTop = this.selfNode.parentNode.offsetHeight - this.selfNode.offsetHeight
      this.selfNode.style.left = `${(left > 0 ? (left <= maxLeft ? left : maxLeft) : 0)}px`
      this.selfNode.style.top = `${(top > 0 ? (top <= maxTop ? top : maxTop) : 0)}px`
      this.updatedSelfNodeInfo()
    },
    changePositonUp () {
      document.body.style.cursor = 'auto'
      this.triggerInput()
      this.selfNode.parentNode.removeEventListener('mousemove', this.changePositonMove)
      this.selfNode.parentNode.removeEventListener('mouseup', this.changePositonUp)
    },
    // 改变size事件
    changeSizeDown (e) {
      e.stopPropagation()
      if (!this.isSelfSelect) return
      this.isChangeSize = true
      this.selfNode.parentNode.addEventListener('mousemove', this.changeSizeMove)
      this.selfNode.parentNode.addEventListener('mouseup', this.changeSizeUp)
    },
    changeSizeMove (e) {
      e.stopPropagation()
      if (!this.isSelfSelect) return
      if (!this.isChangeSize) return
      // 跟随鼠标改变宽高
      const domInfo = getNodeOutset(this.selfNode, true)
      const width = Math.floor((e.clientX - domInfo.left) / this.selfNode.parentNode.offsetWidth * 100)
      const height = Math.floor((e.clientY - domInfo.top) / this.selfNode.parentNode.offsetHeight * 100)
      this.selfNode.style.width = `${width > 0 ? (width <= 100 ? width : 100) : 0}%`
      this.style.width = this.selfNode.style.width
      this.selfNode.style.height = `${height > 0 ? (height <= 100 ? height : 100) : 0}%`
      this.style.height = this.selfNode.style.height
      this.updatedSelfNodeInfo()
    },
    changeSizeUp () {
      this.isChangeSize = false
      this.triggerInput()
      this.selfNode.parentNode.removeEventListener('mousemove', this.changeSizeMove)
      this.selfNode.parentNode.removeEventListener('mouseup', this.changeSizeUp)
    },
    updatedSelfNodeInfo () {
      this.selfNodeInfo = {
        left: this.selfNode.offsetLeft,
        top: this.selfNode.offsetTop,
        right: Math.floor(this.selfNode.parentNode.offsetWidth - this.selfNode.offsetLeft - this.selfNode.offsetWidth),
        bottom: Math.floor(this.selfNode.parentNode.offsetHeight - this.selfNode.offsetTop - this.selfNode.offsetHeight)
      }
    },
    initCom () {
      this.style.top = this.value.top || 10
      this.style.left = this.value.left || 10
      this.style.width = this.value.width || 200
      this.style.height = this.value.height || 40
      this.triggerInput()
      this.$emit('select', this.selfId)
    },
    triggerInput () {
      this.$emit('input', {
        left: this.selfNode.offsetLeft,
        top: this.selfNode.offsetTop,
        width: this.selfNode.offsetWidth,
        height: this.selfNode.offsetHeight,
        imgUrl: this.value.imgUrl,
        refId: this.selfId
      })
    },
    stopPropagationFun () {
      return false
    }
  },
  mounted () {
    this.initCom()
    this.updatedSelfNodeInfo()
    this.selfNode.$getEditorNodeInfo = () => {
      return {
        type: '2',
        zIndex: this.zIndex,
        style: {
          left: this.selfNode.offsetLeft,
          top: this.selfNode.offsetTop,
          width: this.selfNode.offsetWidth,
          height: this.selfNode.offsetHeight,
          imgUrl: this.value.imgUrl
        }
      }
    }
  },
  computed: {
    selfId () {
      return `${this.pId}${this.refId}`
    },
    selfNode () {
      return this.$refs[this.selfId]
    },
    isSelfSelect () {
      if (this.isSelect === true || this.isSelect === this.selfId) {
        return true
      }
      return false
    }
  },
  watch: {
    isSelect (newVal) {
      if (!this.isSelfSelect) {
        this.selfNode.removeEventListener('mousedown', this.changePositon)
        this.changePositonUp()
        this.changeSizeUp()
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "./index.less";
</style>
