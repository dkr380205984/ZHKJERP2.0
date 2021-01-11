<template>
  <div :class='`zh_editor_text_content ${isSelfSelect ? "select" : "" }`'
    @click.stop="selectThis"
    :ref="`${selfId}`">
    <div class="zh_editor_text_content_input"
      contenteditable
      :style="{
        'text-align':textAlign,
        'font-style':fontStyleItalic ? 'italic' : 'normal',
        'font-weight':fontWeightBold ? 'bold' : '400',
        'color':fontColor
      }">文本框</div>
    <span class="changeSize"
      v-show="isSelfSelect"
      @mousedown="changeSizeDown"></span>
    <div class="tools"
      v-show="isSelfSelect && !isChangeSize">
      <span :class="`iconFont left ${textAlign === 'left' ? 'active' : ''}`"
        @click="textAlign = 'left'"></span>
      <span :class="`iconFont center ${textAlign === 'center' ? 'active' : ''}`"
        @click="textAlign = 'center'"></span>
      <span :class="`iconFont right ${textAlign === 'right' ? 'active' : ''}`"
        @click="textAlign = 'right'"></span>
      <span :class="`iconFont italic ${fontStyleItalic ? 'active' : ''}`"
        @click="fontStyleItalic = !fontStyleItalic"></span>
      <span class="iconFont color"
        :style="`color:${fontColor}`">
        <el-color-picker class="color-picker"
          v-model="fontColor"
          size="mini">111</el-color-picker>
      </span>
      <span :class="`iconFont strong ${fontWeightBold ? 'active' : ''}`"
        @click="fontWeightBold = !fontWeightBold"></span>
    </div>
    <div class="subline"
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
  </div>
</template>

<script>
import { getNodeOutset } from '../index.js'
export default {
  props: {
    isSelect: [String, Boolean],
    pId: String
  },
  data () {
    return {
      refId: Math.random().toString(32).slice(2, 6),
      isChangeSize: false, // 是否在改动size
      textAlign: 'left',
      fontStyleItalic: false,
      fontWeightBold: false,
      fontColor: '#000000',
      selfNodeInfo: null,
      moveLeft: 0,
      moveTop: 0
    }
  },
  methods: {
    selectThis (e) {
      this.selfNode.addEventListener('mousedown', this.changePositon)
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
      this.selfNode.style.height = `${height > 0 ? (height <= 100 ? height : 100) : 0}%`
      this.updatedSelfNodeInfo()
    },
    changeSizeUp () {
      this.isChangeSize = false
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
    }
  },
  mounted () {
    this.updatedSelfNodeInfo()
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
