<template>
  <div id="login">
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
    <div style="height:2000px;background:#ccc">增加页面滚动条</div>
    <button @click="$router.push('/index')">点击跳转页面</button>
  </div>
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
  },
  mounted () {

  }
}
</script>

<style>
</style>
