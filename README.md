# zwyknit2.0

## zh-input组件

>该组件高仿element-ui的input组件，主要针对项目中需要的输入框做了正则验证，在遇到需要输入特定内容的输入框可使用本组件，由于该组件没有搜索功能，因此遇到需要支持搜索的输入框建议使用el-input。

### 新增功能

- 数据类型的正则判断
- 数据是否必填

### 未仿制功能

- textarea
- 搜索功能
- resize

### 使用示例
```html
<template>
  <zh-input v-model="msg"
    placeholder="输入数字测试"
    type="number"
    clearable
    minLength="5"
    maxLength="10"
    @change="test">
    <template slot="prepend">
      前置元素
    </template>
  </zh-input>
</template>
<script>
export default {
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    test () {
      console.log(this.msg)
    }
  }
}
</script>

```

### 详细参数

|参数名称|参数类型|是否必填|默认值|说明|
|:------:|:------:|:------:|:------:|:- |
|type|String|否|text|输入类型|
|customReg|String|否|无|type为custom时生效，接收一个正则表达式字符串，用于自定义数据类型判断|
|errorMsg|String|否|根据type值变化|type值不为空时生效，用于自定义错误提示信息|
|errorPosition|String|否|right|错误信息提示位置|
|errorShow|Boolean|否|false|是否展示错误信息，输入数据类型错误时不会展示错误信息，但边框仍会变"红"提示输入错误|
|mustFill|Boolean|否|false|输入框是否必填，该项会验证输入框的初始值是否为空|
|clearable|Boolean|否|false|是否可清空|
|maxLength|String,Number|否|99|字符数最大值|
|minLenght|String,Number|否|0|字符数最小值|

## 使用keep-alive解决列表页状态记忆问题

>keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存，从而节省性能,被包裹在keep-alive中的组件的状态将会被保留

### 使用方式

```html

<keep-alive>
  <router-view />
</keep-alive>

```

## table样式统一

## log样式统一

## 弹窗样式统一（除查看大图）