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
    <div class="table">
      <div class="thead">
        <div class="trow">
          <div class="tcolumn"
            style="flex:2">
            <div class="trow">
              <div class="tcolumn">标题</div>
              <div class="tcolumn">不是很短</div>
            </div>
          </div>
          <div class="tcolumn">比较短</div>
          <div class="tcolumn">不是很短</div>
          <div class="tcolumn">这个算普通</div>
          <div class="tcolumn">这个就比较长</div>
          <div class="tcolumn">这个特别特别长</div>
        </div>
      </div>
      <div class="tbody">
        <div class="trow">
          <div class="tcolumn"
            style="flex:2">
            <div class="trow ">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">
                不是很短
              </div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
          </div>
          <div class="tcolumn important">比较短</div>
          <div class="tcolumn">不是很短</div>
          <div class="tcolumn">这个算普通</div>
          <div class="tcolumn">这个就比较长</div>
          <div class="tcolumn">这个特别特别长</div>
        </div>
        <div class="trow">
          <div class="tcolumn"
            style="flex:2">
            <div class="trow ">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
          </div>
          <div class="tcolumn important">比较短</div>
          <div class="tcolumn">不是很短</div>
          <div class="tcolumn">这个算普通</div>
          <div class="tcolumn">这个就比较长</div>
          <div class="tcolumn">这个特别特别长</div>
        </div>
        <div class="trow">
          <div class="tcolumn"
            style="flex:2">
            <div class="trow ">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
          </div>
          <div class="tcolumn important">比较短</div>
          <div class="tcolumn">不是很短</div>
          <div class="tcolumn">这个算普通</div>
          <div class="tcolumn">这个就比较长</div>
          <div class="tcolumn">这个特别特别长</div>
        </div>
        <div class="trow important">
          <div class="tcolumn"
            style="flex:2">
            <div class="trow ">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
          </div>
          <div class="tcolumn important">比较短</div>
          <div class="tcolumn">不是很短</div>
          <div class="tcolumn">这个算普通</div>
          <div class="tcolumn">这个就比较长</div>
          <div class="tcolumn">这个特别特别长</div>
        </div>
        <div class="trow">
          <div class="tcolumn"
            style="flex:2">
            <div class="trow ">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
            <div class="trow">
              <div class="tcolumn">比较短</div>
              <div class="tcolumn">不是很短</div>
            </div>
          </div>
          <div class="tcolumn important">比较短</div>
          <div class="tcolumn">不是很短</div>
          <div class="tcolumn">这个算普通</div>
          <div class="tcolumn">这个就比较长</div>
          <div class="tcolumn">这个特别特别长</div>
        </div>
      </div>
    </div>
    <button @click="$router.push('/index')">进入首页</button>
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

<style lang="less" scoped>
.table {
  margin: 20px;
  width: 1200px;
  border: 1px solid #ccc;
  .thead {
    background: #ddd;
    height: 40px;
  }
  .tbody {
    background: #fff;
  }
  .trow {
    width: 100%;
    min-height: 40px;
    border-bottom: 1px solid #ccc;
    &:nth-last-child(1) {
      border-bottom: 0;
    }
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    &.important {
      color: #1a95ff;
    }
  }
  .tcolumn {
    min-height: 40px;
    border-right: 1px solid #ccc;
    justify-content: center;
    text-align: center;
    &:nth-last-child(1) {
      border-right: 0;
    }
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &.important {
      color: #1a95ff;
    }
  }
}
</style>
