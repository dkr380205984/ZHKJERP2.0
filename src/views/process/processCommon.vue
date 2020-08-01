<template>
  <div id="processCommon"
    class="indexMain">

  </div>
</template>

<script>
import { order, sampleOrder } from '@/assets/js/api.js'
export default {
  methods: {
    init (api) {

    }
  },
  mounted () {
    let orderApi = this.$route.params.orderType === '1' ? order : sampleOrder
    this.init([orderApi.detail({
      id: this.$route.params.id
    })])
  }
}
</script>

<style>
</style>
