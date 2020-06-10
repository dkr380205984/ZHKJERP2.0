<template>
  <div id='orderStatTable'
    class='printHtml'>
    <div class="printTable crosswise">
      <div class="print_head">
        <span class="top">
          <span class="title">{{companyName}}订单发货信息</span>
        </span>
      </div>
      <div class="print_body">
        <template v-for="(itemDate,indexDate) in list">
          <span class="print_row bgGray2"
            :key="indexDate + 'data'">
            <span class="row_item left noBorder">发货日期：{{itemDate.delivery_time}}</span>
            <span class="row_item right">合计数量：{{itemDate.total_number}}件</span>
          </span>
          <template v-for="(itemOrder,indexOrder) in itemDate.order_info">
            <span class="print_row bgGray"
              :key="indexOrder + '-' + indexDate + 'code'">
              <span class="row_item center w180">订单号</span>
              <span class="row_item left">{{itemOrder.order_code}}</span>
              <span class="row_item center w180">订单公司</span>
              <span class="row_item left">{{itemOrder.client_name}}</span>
              <span class="row_item center w180">批次信息</span>
              <span class="row_item left">{{itemOrder.batchInfo.join(',')}}</span>
            </span>
            <span class="print_row bgGray"
              :key="indexOrder + '-' + indexDate + 'group'">
              <span class="row_item center w180">负责小组</span>
              <span class="row_item left">{{itemOrder.group_name}}</span>
              <span class="row_item center w180">下单日期</span>
              <span class="row_item left">{{itemOrder.order_time}}</span>
              <span class="row_item center w180">批次数量</span>
              <span class="row_item left">{{itemOrder.number}}</span>
            </span>
            <span class="print_row has_marginBottom"
              v-for="(itemPro,indexPro) in itemOrder.production_data"
              :key="indexOrder + '-' + indexPro + '-' + indexDate">
              <span class="row_item col">
                <span class="print_row noBorder">
                  <span class="row_item w180 center">产品信息</span>
                  <span class="row_item w180 center">产品图片</span>
                  <span class="row_item col flex8">
                    <span class="print_row noBorder">
                      <span class="row_item mergeTitle w180">
                        <span class="top">尺码</span>
                        <span class="line"></span>
                        <span class="bottom">色组</span>
                      </span>
                      <span class="row_item left"
                        v-for="(itemSize,indexSize) in itemPro.size_info[0]"
                        :key="indexSize + 'size'">{{itemSize}}码</span>
                      <template v-if="itemPro.size_info[0].length < 7">
                        <span class="row_item left"
                          v-for="(itemB,indexB) in 7-itemPro.size_info[0].length"
                          :key='indexB + "buchong"'></span>
                      </template>
                    </span>
                  </span>
                </span>
                <span class="print_row">
                  <span class="row_item w180 center">
                    {{itemPro.product_code}}
                    <br />
                    {{itemPro.type.join('/')}}
                    <br />
                  </span>
                  <span class="row_item w180 center">
                    <zh-img-list :list='itemPro.image'></zh-img-list>
                  </span>
                  <span class="row_item col flex8">
                    <template v-for="(itemS,indexS) in itemPro.size_info">
                      <span class="print_row"
                        :key="indexS + 'title'"
                        v-if="indexS !== 0">
                        <span class="row_item mergeTitle w180">
                          <span class="top">尺码</span>
                          <span class="line"></span>
                          <span class="bottom">色组</span>
                        </span>
                        <span class="row_item left"
                          v-for="(itemSize,indexSize) in itemS"
                          :key="indexSize + 'size'">{{itemSize}}码</span>
                        <template v-if="itemS.length < 7">
                          <span class="row_item left"
                            v-for="(itemB,indexB) in 7-itemS.length"
                            :key='indexB + "buchong"'></span>
                        </template>
                      </span>
                      <span class="print_row"
                        v-for="(itemColor,indexColor) in itemPro.color_info"
                        :key="indexColor + '-' + indexS"
                        :class="indexColor === 0 && indexS === 0 ? 'noBorder' : ''">
                        <span class="row_item w180 center">{{itemColor.color_name}}</span>
                        <span class="row_item left"
                          v-for="(itemSize,indexSize) in itemS"
                          :key="indexSize">{{itemColor[itemSize]}}</span>
                        <template v-if="itemS.length < 7">
                          <span class="row_item left"
                            v-for="(itemB,indexB) in 7-itemS.length"
                            :key='indexB + "buchong"'></span>
                        </template>
                      </span>
                    </template>
                  </span>
                </span>
              </span>
            </span>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { orderBatch } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('company_name'),
      list: []
    }
  },
  methods: {
    init (data, idArr) {
      if (idArr.length === 0) {
        this.$message.warning('检测到未选择打印批次信息')
      } else {
        idArr = idArr.split(',')
        orderBatch.list(data).then(res => {
          if (res.data.status !== false) {
            let list = res.data.data.filter(itemF => idArr.indexOf(itemF.order_id + '-' + itemF.batch_id) !== -1).map(itemOrder => {
              let productInfo = this.$mergeData(itemOrder.product_info, { mainRule: 'product_id', otherRule: [{ name: 'product_code' }, { name: 'category_info' }, { name: 'image' }], childrenName: 'other_info' })
              return {
                order_code: itemOrder.order_code,
                client_name: itemOrder.client_name,
                group_name: itemOrder.group_name,
                order_time: itemOrder.order_time,
                number: itemOrder.numbers,
                batchInfo: ['第' + itemOrder.batch_id + '批', itemOrder.batch_title, itemOrder.batch_type, itemOrder.batch_desc],
                delivery_time: itemOrder.delivery_time,
                production_data: productInfo.map(itemM => {
                  let sizeArr = []
                  let colorArr = []
                  itemM.other_info.forEach(itemOther => {
                    if (sizeArr.indexOf(itemOther.size_name) === -1) {
                      sizeArr.push(itemOther.size_name)
                    }
                    let colorFlag = colorArr.find(itemColor => itemColor.color_name === itemOther.color_name)
                    if (!colorFlag) {
                      colorArr.push({
                        color_name: itemOther.color_name,
                        [itemOther.size_name]: itemOther.number
                      })
                    } else {
                      if (colorFlag[itemOther.size_name]) {
                        colorFlag[itemOther.size_name] = (Number(colorFlag[itemOther.size_name]) || 0) + (Number(itemOther.number) || 0)
                      } else {
                        colorFlag[itemOther.size_name] = itemOther.number
                      }
                    }
                  })
                  return {
                    product_code: itemM.product_code.code,
                    product_id: itemM.product_id,
                    type: [itemM.category_info.category_name, itemM.category_info.type_name, itemM.category_info.style_name],
                    image: itemM.image,
                    unit: itemM.category_info.unit,
                    size_info: this.$newSplice(sizeArr, 7),
                    color_info: colorArr
                  }
                })
              }
            })
            this.list = this.$mergeData(list, { mainRule: 'delivery_time', childrenName: 'order_info' }).map(itemDate => {
              return {
                delivery_time: itemDate.delivery_time,
                total_number: itemDate.order_info.map(itemO => (+itemO.number || 0)).reduce((a, b) => {
                  return a + b
                }, 0),
                order_info: itemDate.order_info
              }
            })
            setTimeout(() => {
              let lineArr = document.getElementsByClassName('line')
              for (let index in lineArr) {
                let item = lineArr[index]
                let lineParent = item.parentNode
                if (lineParent) {
                  let W = lineParent.offsetWidth
                  let H = lineParent.offsetHeight
                  let lineW = Math.sqrt(Math.pow(W, 2) + Math.pow(H, 2))
                  let jiaodu = Math.atan(H / W) * 180 / Math.PI
                  item.style.width = lineW + 'px'
                  item.style.transform = 'translateX(-50%) rotateZ(' + jiaodu + 'deg)'
                }
              }
              // window.print()
            }, 1000)
          }
        })
      }
    }
  },
  created () {
    let data = {
      limit: 10,
      page: this.$route.query.page,
      keyword: this.$route.query.keyword,
      start_time: this.$route.query.date.split(',')[0] || '',
      end_time: this.$route.query.date.split(',')[1] || '',
      client_id: this.$route.query.company_id,
      group_id: this.$route.query.group_id
    }
    this.init(data, this.$route.query.idArr)
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderStatTable.less";
</style>
