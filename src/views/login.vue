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
  </div>
</template>

<script>
import { login } from '@/assets/js/api.js'
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
    login({
      telephone: '17764530174',
      password: '123456'
    }).then((res) => {

    })
  }
}
</script>

<style>
</style>
