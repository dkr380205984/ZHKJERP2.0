<template>
  <div class="zhInputCtn"
    @click.stop>
    <!-- 前置元素 -->
    <div class="zhInputPrepend"
      v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <div class="zhInputBox"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false">
      <input class="zhInput"
        :class="{'typeError':!unShowError,'hasAppend':$slots.append,'hasPrepend':$slots.prepend}"
        :type="type"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @mousewheel="handleMouseWheel"
        v-bind="$attrs"
        v-model="selfValue"
        ref="input" />
      <div class="zhInputClose"
        v-show="!($attrs.disabled===''|| $attrs.disabled) && clearable && (focused || hovering)"
        @mousedown="clear">×</div>
    </div>
    <zh-boarderkey v-if="keyBoard"
      v-show="showKeyBorder"
      :left="left"
      :top="top"
      @getNum="getValue"></zh-boarderkey>
    <!-- 后置元素 -->
    <div class="zhInputAppend"
      v-if="$slots.append">
      <slot name="append"></slot>
    </div>
    <!-- 错误信息 -->
    <div class="zhErrorMsg"
      :class="errorPosition"
      v-show="!unShowError && errorShow">{{errorMessage}}</div>
  </div>
</template>

<script>
import zhBoarderkey from './zhBoarderkey.vue'
import './zhInput.less'
import { evil } from '../common.js'
export default {
  components: {
    zhBoarderkey
  },
  props: {
    value: [String, Number],
    // 数据类型
    type: {
      type: String,
      default: 'text'
    },
    keyBoard: {
      type: Boolean,
      default: false
    },
    // 数据类型为custom时生效，传入一个正则表达式
    customReg: {
      validator: function (value) {
        if (!(evil(value) instanceof RegExp)) {
          console.error('请传入正确的正则表达式')
        }
        return evil(value) instanceof RegExp
      }
    },
    // 有type值生效
    errorMsg: {
      type: String
    },
    // 有type值生效
    errorPosition: {
      type: String,
      default: 'bottom',
      validator: function (value) {
        return ['bottom', 'right'].indexOf(value) !== -1
      }
    },
    // 是否展示错误信息
    errorShow: {
      type: Boolean,
      default: true
    },
    // 是否必填项
    mustFill: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false
    },
    maxLength: {
      default: 99
    },
    minLength: {
      default: 0
    }
  },
  data () {
    return {
      selfValue: '',
      focused: false,
      unShowError: true,
      errorMessage: '',
      hovering: false,
      showKeyBorder: false,
      left: 0,
      top: 0
    }
  },
  watch: {
    // props value 突变触发更新
    value (val) {
      // this.getInputDom().value = (val === null || val === undefined ? '' : String(val))
      this.selfValue = (val === null || val === undefined ? '' : String(val))
    }
  },
  computed: {
    nativeInputValue () {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    }
  },
  methods: {
    // 禁止滚轮滚动时数值变化
    handleMouseWheel (event) {
      event = event || window.event
      event.preventDefault()
      return false
    },
    getInputDom () {
      return this.$refs.input
    },
    errorRegExp (val) {
      // 非必填项忽略空值
      if (this.type === 'number') {
        this.unShowError = this.mustFill ? /^-?\d+\.?\d*$/.test(val) : !val || /^-?\d+\.?\d*$/.test(val)
      } else if (this.type === 'positiveNumber') {
        this.unShowError = this.mustFill ? /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(val) : !val || /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(val)
      } else if (this.type === 'mobile') {
        this.unShowError = this.mustFill ? /^1[3456789]\d{9}$/.test(val) : !val || /^1[3456789]\d{9}$/.test(val)
      } else if (this.type === 'telephone') {
        this.unShowError = this.mustFill ? /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(val) : !val || /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(val)
      } else if (this.type === 'email') {
        this.unShowError = this.mustFill ? /^\w+[@]\w{2,5}([.]\w{2,3}){1,3}$/i.test(val) : !val || /^\w+[@]\w{2,5}([.]\w{2,3}){1,3}$/i.test(val)
      } else if (this.type === 'webUrl') {
        this.unShowError = this.mustFill ? /[a-zA-z]+:\/\/[^\s]*/.test(val) : !val || /[a-zA-z]+:\/\/[^\s]*/.test(val)
      } else if (this.type === 'Chinese') {
        this.unShowError = this.mustFill ? /^[\u4e00-\u9fa5]{0,}$/.test(val) : !val || /^[\u4e00-\u9fa5]{0,}$/.test(val)
      } else if (this.type === 'IDcard') {
        this.unShowError = this.mustFill ? /^\d{15}|\d{18}$/.test(val) : !val || /^\d{15}|\d{18}$/.test(val)
      } else if (this.type === 'custom') {
        let reg = evil(this.customReg)
        if (reg instanceof RegExp) {
          this.unShowError = this.mustFill ? reg.test(val) : !val || reg.test(val)
        }
      } else {
        this.unShowError = !(this.mustFill && !val)
      }
    },
    errorMessageInit () {
      if (this.type === 'number') {
        this.errorMessage = this.errorMsg || '请输入数字！'
      } else if (this.type === 'positiveNumber') {
        this.errorMessage = this.errorMsg || '请输入正数！'
      } else if (this.type === 'telephone') {
        this.errorMessage = this.errorMsg || '请输入正确格式固话号！'
      } else if (this.type === 'mobile') {
        this.errorMessage = this.errorMsg || '请输入正确格式手机号！'
      } else if (this.type === 'email') {
        this.errorMessage = this.errorMsg || '请输入正确格式邮箱！'
      } else if (this.type === 'webUrl') {
        this.errorMessage = this.errorMsg || '请输入正确格式网址！'
      } else if (this.type === 'Chinese') {
        this.errorMessage = this.errorMsg || '请输入中文！'
      } else if (this.type === 'IDcard') {
        this.errorMessage = this.errorMsg || '请输入正确身份证号'
      } else if (this.type === 'custom') {
        let reg = evil(this.customReg)
        if (reg instanceof RegExp) {
          this.errorMessage = this.errorMsg || '请输入正确值'
        }
      } else {
        this.errorMessage = this.errorMsg
      }
    },
    // 输入触发父组件value更新
    handleInput (ev) {
      if (this.type === 'number') {
        this.$emit('input', ev.target.value ? +ev.target.value : '')
      } else {
        this.$emit('input', ev.target.value)
      }
      if (ev.target.value.length >= Number(this.minLength) && ev.target.value.length <= Number(this.maxLength)) {
        this.errorMessageInit()
        this.errorRegExp(ev.target.value)
      } else {
        this.errorMessage = this.errorMsg || '请输入' + Number(this.minLength) + '~' + Number(this.maxLength) + '个字符!'
        this.unShowError = false
      }
    },
    getValue (num) {
      this.$nextTick(() => {
        this.showKeyBorder = true
      })
      if (num === '删除') {
        this.selfValue = this.selfValue.substring(0, this.selfValue.length - 1)
      } else {
        this.selfValue += num.toString()
      }
      this.$emit('input', this.selfValue)
    },
    handleChange (ev) {
      this.$emit('change', ev.target.value)
    },
    // getAbsoluteLocation (element) {
    //   if (arguments.length !== 1 || element == null) {
    //     return null
    //   }
    //   var scrollTop = element.scrollTop
    //   var offsetTop = element.offsetTop
    //   var offsetLeft = element.offsetLeft
    //   var offsetWidth = element.offsetWidth
    //   var offsetHeight = element.offsetHeight
    //   while (element.offsetParent) {
    //     element = element.offsetParent
    //     offsetTop += element.offsetTop
    //     offsetLeft += element.offsetLeft
    //     scrollTop += element.scrollTop
    //   }
    //   return {
    //     scrollTop: scrollTop,
    //     absoluteTop: offsetTop,
    //     absoluteLeft: offsetLeft,
    //     offsetWidth: offsetWidth,
    //     offsetHeight: offsetHeight
    //   }
    // },
    handleFocus (ev) {
      this.focused = true
      this.$emit('focus', ev.target.value)
      document.body.click()
      this.$nextTick(() => {
        this.getPosition(ev)
      })
    },
    getPosition (ev) {
      let position = ev.target.getBoundingClientRect()
      this.left = position.left
      this.top = position.top
      this.showKeyBorder = true
    },
    handleBlur (ev) {
      this.focused = false
      this.$emit('blur', ev.target.value)
      // 输入值不符合时触发
      if (!this.unShowError) {
        this.$emit('errorInput', ev.target.value)
      }
    },
    // 清空输入库
    clear () {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
      this.errorRegExp()
    },
    closeNum () {
      this.showKeyBorder = false
    }
  },
  mounted () {
    // 初始化输入框
    // this.getInputDom().value = this.nativeInputValue
    this.selfValue = this.nativeInputValue
    // 初始化errorMessage
    this.errorMessageInit()
    this.errorRegExp(this.nativeInputValue)
    document.body.removeEventListener('click', this.closeNum)
    document.body.addEventListener('click', this.closeNum)
  },
  beforeDestroy () {
    // 组件销毁，销毁所有keyboard
    const keyBoard = document.getElementsByClassName('keyBoard')
    for (let i = 0; i < keyBoard.length; i++) {
      keyBoard[i].parentNode.removeChild(keyBoard[i])
    }
  }
}
</script>
