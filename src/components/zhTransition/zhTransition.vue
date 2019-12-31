<template>
  <div class="translationCtn"
    ref="translationCtn">
    <div class="translation">
      <div class="clickBtn atLeft"
        @click="scrollLeft"
        v-show="ifTranslate">
        <div class="leftBtn"></div>
      </div>
      <div class="mainCtn"
        :style="{'transform':'translateX('+translate+'px)'}">
        <div class="translationList"
          :class="[{'active':activeIndex===index},'translationList' + id]"
          v-for="(item,index) in list"
          :key="index"
          @click="choosed(item,index)">{{item[showKey]}}</div>
      </div>
      <div class="clickBtn atRight"
        @click="scrollRight"
        v-show="ifTranslate">
        <div class="rightBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import './zhTransition.less'
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    showKey: {
      type: String,
      default: 'name'
    },
    defautChoose: {
      type: Number
    }, // 默认选第几个
    markId: {
      default: 1
    } // 组件唯一标识符，一个页面同时用到两个该组件时必须有唯一标识符
  },
  data () {
    return {
      id: this.markId ? this.markId : 1,
      activeIndex: this.defautChoose ? this.defautChoose : 0,
      translate: 0,
      tranlateIndex: 0, // 标记当前处于哪个dom元素，暂时没有需要知道这个
      ifTranslate: false // 判断是否需要平移元素
    }
  },
  methods: {
    choosed (item, index) {
      this.activeIndex = index
      this.$emit('changed', item)
    },
    scrollLeft () {
      if (this.tranlateIndex === 0) {
        this.$message.warning('已经是第一个')
        return
      }
      this.tranlateIndex--
      this.translate += Array.from(document.getElementsByClassName('translationList' + this.id))[this.tranlateIndex].offsetWidth
    },
    scrollRight () {
      if (this.tranlateIndex === (this.list.length - 1)) {
        this.$message.warning('已经是最后一个')
        return
      }
      this.translate -= Array.from(document.getElementsByClassName('translationList' + this.id))[this.tranlateIndex].offsetWidth
      this.tranlateIndex++
    }
  },
  mounted () {
    let fatherWidth = this.$refs.translationCtn.offsetWidth - 64 // 64是padding值
    let sonWidth = Array.from(document.getElementsByClassName('translationList' + this.id)).reduce((total, current) => {
      return total + Number(current.offsetWidth)
    }, 0)
    if (sonWidth > fatherWidth) {
      this.ifTranslate = true
    }
  }
}
</script>
