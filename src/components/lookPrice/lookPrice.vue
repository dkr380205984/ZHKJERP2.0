<template>
  <div class="lookPrice">
    <span class="lookPriceText"
      @click="showInfo=!showInfo"
      :class="{'noPrice':!has_price,'hasPrice':has_price}">{{has_price?showInfo?'关闭':'查看':'暂无'}}报价信息</span>
    <div class="price_popup"
      v-if="showInfo">
      <div class="main"
        v-if="whichPrice==='material_info'">
        <div class="once"
          v-for="(item,index) in material_info"
          :key="index">
          <span class="name">{{item.name}}</span>
          <span class="price">{{item.price}}元/kg</span>
        </div>
      </div>
      <div class="main"
        v-if="whichPrice==='assist_info'">
        <div class="once"
          v-for="(item,index) in assist_info"
          :key="index">
          <span class="name">{{item.name}}</span>
          <span class="price">{{item.total_price}}元/{{item.unit}}</span>
        </div>
      </div>
      <div class="main"
        v-if="whichPrice==='weave_info'">
        <div class="once"
          v-for="(item,index) in weave_info"
          :key="index"
          v-show="item.total_price">
          <span class="name">{{item.name}}({{item.product_code}})</span>
          <span class="price">{{item.total_price}}元</span>
        </div>
      </div>
      <div class="main"
        v-if="whichPrice==='semi_product_info'">
        <div class="once"
          v-for="(item,index) in semi_product_info"
          :key="index"
          v-show="item.total_price">
          <span class="name">{{item.name.join?item.name.join('/'):item.name}}({{item.product_code}})</span>
          <span class="price">{{item.total_price}}元</span>
        </div>
      </div>
      <div class="main"
        v-if="whichPrice==='production_info'">
        <div class="once"
          v-for="(item,index) in production_info"
          :key="index"
          v-show="item.total_price">
          <span class="name">{{item.name.join?item.name.join('/'):item.name}}({{item.product_code}})</span>
          <span class="price">{{item.total_price}}元</span>
        </div>
      </div>
      <div class="main"
        v-if="whichPrice==='pack_material_info'">
        <div class="once"
          v-for="(item,index) in pack_material_info"
          :key="index">
          <span class="name">{{item.name}}</span>
          <span class="price">{{item.total_price}}元</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './lookPrice.less'
import { price } from '../../assets/js/api.js'
export default {
  props: ['whichPrice', 'price_id'],
  data () {
    return {
      material_info: [],
      assist_info: [],
      weave_info: [],
      has_price: false,
      showInfo: false
    }
  },
  watch: {
    price_id (newVal) {
      if (newVal) {
        price.detail({
          id: newVal
        }).then((res) => {
          let data = res.data.data
          console.log(data)
          this.material_info = data.material_info ? JSON.parse(data.material_info) : []
          this.assist_info = data.assist_info ? JSON.parse(data.assist_info) : []
          this.weave_info = data.weave_info ? JSON.parse(data.weave_info) : []
          this.semi_product_info = data.semi_product_info ? JSON.parse(data.semi_product_info) : []
          this.production_info = data.production_info ? JSON.parse(data.production_info) : []
          this.pack_material_info = data.pack_material_info ? JSON.parse(data.pack_material_info) : []
          if (this[this.whichPrice].length > 0) {
            this.has_price = true
          }
        })
      }
    }
  }
}
</script>
