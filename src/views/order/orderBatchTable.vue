<template>
  <div class='printHtml'
    id='orderBatchTable'>
    <div class="printTable crosswise">
      <div class="print_head row">
        <div class="left">
          <span class="title">{{companyName}}生产布置单</span>
        </div>
        <div class="right">
          <span style="margin-right:24px">创建人：{{create_user}}</span>
          <span>创建时间：{{$getTime()}}</span>
        </div>
      </div>
      <template v-if="!$route.query.isB">
        <div class="print_body"
          v-for="(itemOrder,indexOrder) in orderBatchInfo"
          :key="indexOrder"
          style="page-break-inside: avoid;">
          <div class="print_row bgGray maxH32">
            <div class="row_item center flex04">序号</div>
            <div class="row_item center">下单日期</div>
            <div class="row_item left">订单号</div>
            <div class="row_item left">订单公司</div>
            <div class="row_item left">公司联系人</div>
            <div class="row_item left">创建人</div>
            <div class="row_item left">负责小组</div>
          </div>
          <div class="print_row">
            <div class="row_item center flex04">{{indexOrder + 1}}</div>
            <div class="row_item center">{{itemOrder.order_time}}</div>
            <div class="row_item left">{{itemOrder.order_code}}</div>
            <div class="row_item left">{{itemOrder.client_name}}</div>
            <div class="row_item left">{{itemOrder.contacts}}</div>
            <div class="row_item left">{{itemOrder.create_user}}</div>
            <div class="row_item left">{{itemOrder.group_name}}</div>
          </div>
          <div class="print_row maxH40">
            <div class="row_item center">交货日期</div>
            <div class="row_item center">批次名称</div>
            <div class="row_item center">批次类型</div>
            <div class="row_item center">产品编号</div>
            <div class="row_item center">产品名称</div>
            <div class="row_item center">尺码颜色</div>
            <div class="row_item center">产品尺寸</div>
            <div class="row_item center">产品克重</div>
            <div class="row_item center">单价</div>
            <div class="row_item center">数量</div>
            <div class="row_item center">总金额</div>
            <div class="row_item center flex12">产品图片</div>
            <div class="row_item center">批次备注</div>
          </div>
          <div class="print_row maxH68"
            v-for="(itemBatch,indexBatch) in itemOrder.batch_info"
            :key="indexBatch">
            <div class="row_item center bgOrange">{{itemBatch.delivery_time}}</div>
            <div class="row_item center">{{itemBatch.batch_title || `第${itemBatch.batch_id}批`}}</div>
            <div class="row_item center">{{itemBatch.batch_type || '无'}}</div>
            <div class="row_item center">{{itemBatch.product_code}}</div>
            <div class="row_item center">{{itemBatch.name}}</div>
            <div class="row_item center">{{`${itemBatch.size}/${itemBatch.color}`}}</div>
            <div class="row_item center">{{itemBatch.size_info && itemBatch.size_info.size_info || '/'}}</div>
            <div class="row_item center">{{itemBatch.size_info && itemBatch.size_info.weight || '/'}}</div>
            <div class="row_item center">{{itemBatch.price || '/'}}</div>
            <div class="row_item center">{{itemBatch.number || '/'}}</div>
            <div class="row_item center">{{itemBatch.total_price}}</div>
            <div class="row_item center flex12">
              <zh-img-list :list="itemBatch.images"></zh-img-list>
            </div>
            <div class="row_item center">{{itemBatch.batch_desc}}</div>
          </div>
          <div class="print_row maxH68">
            <div class="row_item center">订单备注</div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center borderTran"></div>
            <div class="row_item center"></div>
            <div class="row_item center">{{itemOrder.batch_info|filterTotalNumber}}</div>
            <div class="row_item center">{{itemOrder.batch_info|filterTotalPrice}}</div>
            <div class="row_item center flex22">
              <img :src="itemOrder.qrCodeUrl || defaultUrl"
                style="height:100%"
                alt="二维码">
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="print_body">
          <div class="print_row maxH40">
            <div class="row_item center">交货日期</div>
            <div class="row_item center">订单号</div>
            <div class="row_item center">订单公司</div>
            <div class="row_item center">批次名称</div>
            <div class="row_item center">批次类型</div>
            <div class="row_item center">产品编号</div>
            <div class="row_item center">产品名称</div>
            <div class="row_item center">尺码颜色</div>
            <div class="row_item center">单价</div>
            <div class="row_item center">数量</div>
            <div class="row_item center">总金额</div>
            <div class="row_item center flex12">产品图片</div>
            <div class="row_item center">批次备注</div>
          </div>
          <div class="print_row maxH68"
            v-for="(itemBatch,indexBatch) in orderBatchInfo"
            :key="indexBatch">
            <div class="row_item center bgOrange">{{itemBatch.delivery_time}}</div>
            <div class="row_item center">{{itemBatch.order_code}}</div>
            <div class="row_item center">{{itemBatch.client_name}}</div>
            <div class="row_item center">{{itemBatch.batch_title || `第${itemBatch.batch_id}批`}}</div>
            <div class="row_item center">{{itemBatch.batch_type || '无'}}</div>
            <div class="row_item center">{{itemBatch.product_code}}</div>
            <div class="row_item center">{{itemBatch.name}}</div>
            <div class="row_item center">{{`${itemBatch.size}/${itemBatch.color}`}}</div>
            <div class="row_item center">{{itemBatch.price || '/'}}</div>
            <div class="row_item center">{{itemBatch.number || '/'}}</div>
            <div class="row_item center">{{itemBatch.total_price}}</div>
            <div class="row_item center flex12">
              <zh-img-list :list="itemBatch.images"></zh-img-list>
            </div>
            <div class="row_item center">{{itemBatch.batch_desc}}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      companyName: window.sessionStorage.getItem('full_name'),
      create_user: window.sessionStorage.getItem('user_name'),
      orderBatchInfo: [],
      defaultUrl: require('@/assets/image/index/noPic.jpg')
    }
  },
  created () {
    const id = (this.$route.query.id && this.$route.query.id.split(',')) || []
    const QRCode = require('qrcode')
    Promise.all(
      id.map(itemM => {
        return order.detailInfo({
          id: itemM
        })
      })
    ).then(res => {
      if (this.$route.query.isB) {
        this.orderBatchInfo = res.map(itemM => {
          const orderDataItem = itemM.data.data
          return orderDataItem.batch_info.map(itemMB => {
            return itemMB.product_info.map(itemMP => {
              return {
                id: orderDataItem.id,
                order_time: orderDataItem.order_time,
                order_code: orderDataItem.order_code,
                client_name: orderDataItem.client_name,
                contacts: orderDataItem.contacts,
                create_user: orderDataItem.user_name,
                group_name: orderDataItem.group_name,
                batch_id: itemMB.batch_id,
                delivery_time: itemMB.delivery_time,
                batch_title: itemMB.batch_title,
                batch_type: itemMB.order_type,
                product_code: itemMP.product_code,
                name: itemMP.name,
                size: itemMP.size_name,
                color: itemMP.color_name,
                images: itemMP.image,
                price: itemMP.unit_price,
                number: itemMP.numbers,
                total_price: this.$toFixed(itemMP.numbers * itemMP.unit_price),
                batch_desc: itemMB.desc
              }
            })
          })
        }).flat(2).sort((a, b) => {
          return new Date(a.delivery_time).getTime() - new Date(b.delivery_time).getTime()
        })
      } else {
        this.orderBatchInfo = res.map(itemM => {
          const orderDataItem = itemM.data.data
          let obj = {
            id: orderDataItem.id,
            order_time: orderDataItem.order_time,
            order_code: orderDataItem.order_code,
            client_name: orderDataItem.client_name,
            contacts: orderDataItem.contacts,
            create_user: orderDataItem.user_name,
            group_name: orderDataItem.group_name,
            batch_info: orderDataItem.batch_info.map(itemMB => {
              return itemMB.product_info.map(itemMP => {
                return {
                  batch_id: itemMB.batch_id,
                  delivery_time: itemMB.delivery_time,
                  batch_title: itemMB.batch_title,
                  batch_type: itemMB.order_type,
                  product_code: itemMP.product_code,
                  name: itemMP.name,
                  size: itemMP.size_name,
                  color: itemMP.color_name,
                  size_info: itemMP.all_size.find(itemF => itemF.size_id === itemMP.size_id),
                  images: itemMP.image,
                  price: itemMP.unit_price,
                  number: itemMP.numbers,
                  total_price: this.$toFixed(itemMP.numbers * itemMP.unit_price),
                  batch_desc: itemMB.desc
                }
              })
            }).flat()
          }
          QRCode.toDataURL(window.location.origin + '/order/orderDetail/' + obj.id, { errorCorrectionLevel: 'H' }, (err, url) => {
            if (!err) {
              obj.qrCodeUrl = url || this.defaultUrl
            }
          })
          return obj
        })
      }
      setTimeout(() => {
        window.print()
      }, 2000)
    })
  },
  filters: {
    filterTotalNumber (item) {
      return item.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0)
    },
    filterTotalPrice (item) {
      return item.map(itemM => +itemM.total_price || 0).reduce((total, current) => total + current, 0)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderBatchTable.less";
</style>
