# zwyknit2.0

## zh-input组件

>该组件高仿element-ui的input组件，主要针对项目中需要的输入框做了正则验证，在遇到需要输入特定内容的输入框可使用本组件，由于该组件没有搜索功能，因此遇到需要支持搜索的输入框建议使用el-input
代码路径：src/components/zhInput

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

#### type [String] [default:'text'] [输入类型] 
  - text 文本 
  - number 数字
  - positiveNumber 正数
  - mobile 手机号
  - telephone 固定电话
  - email 邮箱
  - webUrl 网址
  - Chinese 中文
  - IDcard 身份证
  - custom 自定义
#### customReg [String] [type为custom时生效，接收一个正则表达式字符串，用于自定义数据类型判断]
#### errorMsg [String] [type值不为空时生效，用于自定义错误提示信息]
#### errorPosition [String] [default:'right'] [错误信息提示位置]
  - right 右侧
  - bottom 下方
  - 没有上和左
#### errorShow [Boolean] [default:false] [是否展示错误信息，输入数据类型错误时不会展示错误信息，但边框仍会变"红"提示输入错误]  
#### mustFill [Boolean] [default:false] [输入框是否必填，该项会验证输入框的初始值是否为空]
#### clearable [Boolean] [default:false] [是否可清空]
#### maxLength [String,Number] [default:99] [字符数最大值]
#### minLenght [String,Number] [default:0] [字符数最小值]

## 使用keep-alive解决列表页状态记忆问题

>keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存，从而节省性能,被包裹在keep-alive中的组件的状态将会被保留

### 使用方式

```html

<keep-alive>
  <router-view />
</keep-alive>

```