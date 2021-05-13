<template>
  <div :class='`document_select_container ${rowModle && "rowModle" || ""}`'
    @click.stop="handleClickEvent">
    <span class="document_select_label"
      v-if="!noLabel">{{label}}</span>
    <textarea class="document_select_self"
      :style="`text-align:${innerAlign};${(rows===1 && 'white-space: nowrap;') || ''}` + (width ? `width:${width}!important;flex:none` : '')"
      :placeholder="placeholder"
      :readonly='readonlyCom'
      v-model="innerValue"
      :rows='rows'
      @input="inputEvent"
      ref="select"></textarea>
    <div :class="`document_option_container ${isActive && 'isActive' || ''}`"
      v-show='!readonly'
      :style="`
      width:${optionStyle.width || 0}px;
      top:${optionStyle.top + optionStyle.height || 0}px;
      left:${optionStyle.left || 0}px;
    `">
      <span class="document_container_arrow"></span>
      <ul class="document_option_ul">
        <li :class="`document_option_li ${(!multipleCom ? (itemOption[optionValue] === selectsValue && 'active') : (selectsValue && selectsValue.includes(itemOption[optionValue]) && 'active')) || ''}`"
          v-for="(itemOption,indexOption) in optionDataCom"
          :key="indexOption"
          @click.stop="selectItem(itemOption[optionValue],itemOption)">
          {{itemOption[optionLabel]}}
          <span class="el-icon-check checkIcon"></span>
        </li>
        <li class="not_data"
          v-if="optionDataCom.length === 0">无匹配数据</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Array, Number],
    label: String,
    placeholder: String,
    rows: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'select',
      validator: (value) => {
        return value === 'select' || value === 'autocomplete'
      }
    },
    width: String,
    rowModle: Boolean,
    noLabel: Boolean,
    innerAlign: {
      type: String,
      default: 'left',
      validator: (value) => {
        return value === 'left' || value === 'center' || value === 'right'
      }
    },
    readonly: Boolean,
    'optionData': {
      type: Array,
      default: () => {
        return []
      }
    },
    'optionLabel': {
      type: String,
      default: 'label'
    },
    'optionValue': {
      type: String,
      default: 'value'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      innerValue: '',
      selectsValue: '',
      isActive: false,
      optionStyle: {}
    }
  },
  watch: {
    value (newVal) {
      this.selectsValue = newVal
    },
    selectsValue (newVal) {
      this.$emit('input', newVal)
      this.innerValue = this.innerValueCom
    }
  },
  methods: {
    selectItem (item, itemObj) {
      if (!this.multipleCom) {
        if (this.selectsValue === item) return
        this.selectsValue = item
        this.windowClickEvent()
      } else {
        const findIndex = this.selectsValue ? this.selectsValue.findIndex(itemFI => itemFI === item) : -1
        if (findIndex >= 0) {
          this.selectsValue.splice(findIndex, 1)
        } else {
          if (Array.isArray(this.selectsValue)) {
            this.selectsValue.push(item)
          } else {
            this.selectsValue = [item]
          }
        }
        this.$refs.select.focus()
      }
      this.$emit('select', {
        value: item,
        valueObj: itemObj
      })
    },
    handleClickEvent () {
      this.$refs.select.focus()
      this.getOptionStyle()
      this.isActive = true
      // window.addEventListener('mousewheel', this.windowScrollEvent, true)
      window.addEventListener('click', this.windowClickEvent, true)
      window.addEventListener('contextmenu', this.windowClickEvent, true)
    },
    inputEvent () {
      if (this.type === 'autocomplete') {
        this.selectsValue = this.innerValue
      } else if (this.filterableCom && this.multipleCom) {
        this.innerValue.indexOf(this.innerValueCom) !== 0 && (this.innerValue = this.innerValueCom)
      }
    },
    getOptionStyle () {
      this.optionStyle = this.$refs.select.getBoundingClientRect()
    },
    // windowScrollEvent (e) {
    //   this.getOptionStyle()
    // },
    windowClickEvent (e) {
      this.isActive = false
      // window.removeEventListener('mousewheel', this.windowScrollEvent, true)
      window.removeEventListener('click', this.windowClickEvent, true)
      window.removeEventListener('contextmenu', this.windowClickEvent, true)
    }
  },
  computed: {
    optionDataCom () {
      const searchWord = this.multipleCom ? this.innerValue.split(this.innerValueCom).reverse()[0] : this.innerValue
      return searchWord ? this.optionData.filter(itemF => String(itemF[this.optionLabel]).indexOf(searchWord) >= 0) : this.optionData
    },
    innerValueCom () {
      if (this.type === 'autocomplete') return this.selectsValue
      let returnValue = null
      if (this.multipleCom) {
        returnValue = this.selectsValue ? this.selectsValue.map(itemM => {
          const innerValueFind = this.optionData.find(itemF => itemF[this.optionValue] === itemM)
          return (innerValueFind && innerValueFind[this.optionLabel]) || ''
        }).join(',') : ''
      } else {
        const innerValueFind = this.optionData.find(itemF => itemF[this.optionValue] === this.selectsValue)
        returnValue = (innerValueFind && innerValueFind[this.optionLabel]) || ''
      }
      return returnValue
    },
    filterableCom () {
      return (this.type === 'autocomplete' || this.filterable)
    },
    readonlyCom () {
      return this.readonly || !this.filterableCom || (this.type === 'select' && !this.multiple)
    },
    multipleCom () {
      return this.type === 'select' && this.multiple
    }
  },
  created () {
    this.selectsValue = this.value
  }
}
</script>

<style scoped lang='less'>
@import "./index.less";
</style>
