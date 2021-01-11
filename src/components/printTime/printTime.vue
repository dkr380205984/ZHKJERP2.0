<template>
  <div class='printTime'
    @click.stop="()=>false">
    <template v-if="!changeFlag">
      {{time}}
    </template>
    <template v-else>
      <el-date-picker v-model="time"
        :clearable='false'
        type="date"
        style="width:140px;height:1em"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
    </template>
    <span class="changeBtn"
      @click.stop="openChange">{{changeFlag ? '完成' : '修改'}}</span>
  </div>
</template>

<script>
export default {
  props: {
    dataTime: String
  },
  data () {
    return {
      time: '',
      changeFlag: false
    }
  },
  methods: {
    closeChange () {
      this.changeFlag = false
      window.removeEventListener('click', this.closeChange)
      window.removeEventListener('contextmenu', this.closeChange)
    },
    openChange () {
      this.changeFlag = !this.changeFlag
      window.addEventListener('click', this.closeChange)
      window.addEventListener('contextmenu', this.closeChange)
    }
  },
  watch: {
    dataTime (newTime) {
      this.time = newTime
    }
  },
  mounted () {
    this.time = this.dataTime || this.$getTime()
  },
  created () {
  }
}
</script>

<style scoped lang='less'>
@import "./printTime.less";
</style>
