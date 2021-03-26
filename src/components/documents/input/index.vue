<template>
  <div :class='`document_input_container ${rowModle && "rowModle" || ""}`'
    :style="`justify-content:${alignType === 'right' ? 'flex-end' : 'flex-start'}`"
    @click.stop="handleClickEvent">
    <span class="document_input_label"
      v-if="!noLabel">{{label}}</span>
    <textarea class="document_input_self"
      :style="`text-align:${innerAlign};${(rows===1 && 'white-space: nowrap;') || ''}` + (width ? `width:${width}!important;flex:none` : '')"
      :placeholder="placeholder"
      :readonly='readonly'
      v-model="innerValue"
      :rows='rows'
      @input="inputEvent"
      ref="input" />
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    label: String,
    placeholder: String,
    rows: {
      type: [Number, String],
      default: 1
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => {
        return value === 'text' || value === 'number' || value === 'float' || value === 'int' || value === 'telephone' || value === 'mobile'
      }
    },
    width: String,
    alignType: {
      type: String,
      default: 'left',
      validator: (value) => {
        return value === 'left' || value === 'right'
      }
    },
    innerAlign: {
      type: String,
      default: 'left',
      validator: (value) => {
        return value === 'left' || value === 'center' || value === 'right'
      }
    },
    rowModle: Boolean,
    noLabel: Boolean,
    readonly: Boolean
  },
  data () {
    return {
      innerValue: ''
    }
  },
  watch: {
    value (newVal) {
      if (!this.typeRegExp.test(newVal)) {
        this.$emit('input', '')
        return
      }
      this.innerValue = newVal
    }
  },
  methods: {
    handleClickEvent () {
      this.$refs.input.focus()
    },
    inputEvent () {
      if (!this.typeRegExp.test(this.innerValue)) {
        this.innerValue = this.value || ''
        return
      }
      this.$emit('input', this.innerValue)
    }
  },
  computed: {
    typeRegExp () {
      // 此处为type类型对应的正则表达式
      switch (this.type) {
        case 'text':
          return /\S?\s?/
        case 'int': // 整数
          return /^-?[1-9]+[0-9]*$/
        case 'number': // 所有数值
          return /^-?\d*\.?\d*$/
        case 'float': // 浮点数
          return /^-?\d*\.\d*$/
        case 'telephone': // 手机号
          return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
        case 'mobile': // 移动手机号
          return /^1[3456789]\d{9}$/
        default:
          return /\S?\s?/
      }
    }
  },
  created () {
    this.innerValue = this.value
  }
}
</script>

<style scoped lang='less'>
@import "./index.less";
</style>
