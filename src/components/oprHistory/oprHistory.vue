<template>
  <div class="oprHistory">
    <div class="oprHisBtn"
      @click="flag=true">操作记录</div>
    <div class="oprHisPopup "
      v-show="flag">
      <div class="main">
        <div class="title">
          <span class="text">操作记录</span>
          <span class="el-icon-close"
            @click="flag=false"></span>
        </div>
        <div class="content">
          <div class="tbCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">操作日期</div>
                <div class="tcolumn">操作类型</div>
                <div class="tcolumn">操作事件</div>
                <div class="tcolumn">操作人</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcolumn">2020-02-02</div>
                <div class="tcolumn">创建</div>
                <div class="tcolumn">创建产品</div>
                <div class="tcolumn">阿布吃</div>
              </div>
              <div class="trow">
                <div class="tcolumn">2020-02-02</div>
                <div class="tcolumn">修改</div>
                <div class="tcolumn">修改了XXX字段</div>
                <div class="tcolumn">阿布吃</div>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn"
            @click="flag=false">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './oprHistory.less'
export default {
  data () {
    return {
      flag: false
    }
  }
}
</script>
