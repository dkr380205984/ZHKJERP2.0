<template>
  <div class='printHtml'
    id="productPlanTable">
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{company_name}}配料单</span>
          <span class="item">
            <span class="label">配料单编号：</span>
            {{productInfo.product_code}}
          </span>
          <span class="item">
            <span class="label">创建人：</span>
            {{user_name}}
          </span>
          <span class="item">
            <span class="label">创建时间：</span>
            {{update_time}}
          </span>
        </div>
        <div class="right">
          <span class="text">
            扫一扫
            <br />
            查看配料单
          </span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item center w180">产品编号</span>
          <span class="row_item left">{{productInfo.product_code}}</span>
          <span class="row_item center w180">产品名称</span>
          <span class="row_item left">{{productInfo.product_title}}</span>
        </div>
        <div class="print_row">
          <span class="row_item center w180">产品品类</span>
          <span class="row_item left">{{productInfo|filterType}}</span>
          <span class="row_item center w180">产品成分</span>
          <span class="row_item left">{{productInfo.component|filterMaterial}}</span>
        </div>
        <div class="print_row">
          <span class="row_item center w180">产品配色</span>
          <span class="row_item left">{{productInfo.color.map(item=>item.color_name).join('/')}}</span>
        </div>
        <div class="print_row h120">
          <span class="row_item center w180">产品描述</span>
          <span class="row_item left">{{productInfo.description}}</span>
        </div>
        <template v-for="(item,index) in materialInfo">
          <div class="print_row bgGray"
            :key='index + "title"'>
            <div class="row_item noBorder left">{{item.size + '/' + item.color}}</div>
            <div class="row_item noBorder right">
              <span>尺码：{{item.size_info}}cm</span>
              <span style="margin-left:16px">克重：{{$toFixed(item.weight)}}g</span>
            </div>
          </div>
          <div class="print_row"
            v-for="(itemMa,indexMa) in item.material_info"
            :key='index + "body" + indexMa'>
            <span class="row_item w180 center">{{itemMa.material_name}}</span>
            <span class="row_item">
              <span class="print_row noBorder canWarp">
                <span class="row_item center warpMax4"
                  v-for="(itemColor,indexColor) in itemMa.color_info"
                  :key="indexColor">{{itemColor.attr}}<br />{{$toFixed(itemColor.weight) +itemColor.unit}}</span>
                <span class="row_item center warpMax4"
                  v-for="(itemColor,indexColor) in 4-(itemMa.color_info.length%4)"
                  :key="indexColor + 'false'"></span>
              </span>
            </span>
          </div>
        </template>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <span class="row_item w180 center">备注</span>
          <span class="row_item left"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      update_time: '',
      user_name: '',
      productInfo: {
        color: [],
        component: []
      },
      materialInfo: []
    }
  },
  methods: {
  },
  created () {
    Promise.all([
      productPlan.getByProduct({
        product_id: this.$route.params.id,
        product_type: this.$route.params.type
      })
    ]).then(res => {
      let data = res[0].data.data.find(item => Number(item.id) === Number(this.$route.params.index))
      if (data) {
        this.user_name = data.user_name
        this.update_time = data.update_time
        this.productInfo = data.product_info
        let materialInfo = data.material_info.concat(...data.part_info.map(itemPart => itemPart.material_info))
        this.materialInfo = this.$mergeData(materialInfo, { mainRule: ['product_size/size', 'product_color/color'], childrenName: 'material_info', childrenRule: { mainRule: ['material_name', 'type'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'unit' }, { name: 'weight', type: 'add' }] } } })
        this.materialInfo.forEach(itemSize => {
          let flag = this.productInfo.size_measurement.find(item => item.size_name === itemSize.size)
          if (flag) {
            itemSize.weight = flag.weight
            itemSize.size_info = flag.size_info
          }
        })
      } else {
        this.$message.error('未找到相关配料单')
      }
      setTimeout(() => {
        window.print()
      }, 1000)
    })
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name, item.flower_name].join('/')
    },
    filterMaterial (item) {
      return item.map(val => val.number + '%' + val.component_name).join(',')
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/productPlan/productPlanDetail/' + this.productInfo.product_id + '/' + this.$route.params.type, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/productPlan/productPlanTable.less";
</style>
