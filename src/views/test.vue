<template>
  <div class='indexMain'>
    <div style="width:400px;height:100px">
      <documentSelect :optionData='optionData'
        v-model="data"
        :multiple='true'
        filterable
        optionLabel='a'
        optionValue='a' />
    </div>
  </div>
</template>

<script>
import documentSelect from '@/components/documents/select/index.vue'
export default {
  data () {
    return {
      data: '',
      optionData: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }]
    }
  },
  components: {
    documentSelect
  },
  methods: {
  }
}
</script>

<style scoped lang='less'>
</style>
