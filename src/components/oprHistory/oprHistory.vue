<template>
  <div class="oprHistory">
    <div class="oprHisBtn"
      @click="getData">操作记录</div>
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
                <div class="tcolumn">操作事件</div>
                <div class="tcolumn">操作人</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in list"
                :key="item.id">
                <div class="tcolumn">{{item.created_at}}</div>
                <div class="tcolumn">{{item.description}}</div>
                <div class="tcolumn">{{item.user_name}}</div>
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
import { oprHistory } from '@/assets/js/api.js'
export default {
  props: ['type', 'id'],
  data () {
    return {
      flag: false,
      list: []
    }
  },
  methods: {
    getData () {
      if (this.type === 'product') {
        oprHistory.product({
          product_id: this.id
        }).then((res) => {
          if (res.data.status) {
            this.flag = true
            this.list = this.adaptor(res.data.data)
          }
        })
      } else if (this.type === 'order') {
        oprHistory.order({
          order_id: this.id
        }).then((res) => {
          if (res.data.status) {
            this.flag = true
            console.log(res)
            this.list = this.adaptor(res.data.data)
          }
        })
      } else if (this.type === 'sampleOrder') {
        oprHistory.sampleOrder({
          sample_order_id: this.id
        }).then((res) => {
          if (res.data.status) {
            this.flag = true
            this.list = this.adaptor(res.data.data)
          }
        })
      } else if (this.type === 'sample') {
        oprHistory.sample({
          sample_product_id: this.id
        }).then((res) => {
          if (res.data.status) {
            this.flag = true
            this.list = this.adaptor(res.data.data)
          }
        })
      }
    },
    adaptor (data) {
      return data.map((item) => {
        return {
          description: item.description,
          user_name: item.user.name,
          created_at: item.created_at,
          id: item.id
        }
      })
    }
  }
}
</script>
