<template>
  <div id='weaveTable'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{title}}{{orderInfo.inside_order_code ? '-' + orderInfo.inside_order_code : ''}}</span>
          <span class="item">
            <span class="label">联系人：</span>
            {{user_name}}
          </span>
          <span class="item">
            <span class="label">联系人电话：</span>
            {{user_tel}}
          </span>
          <span class="item">
            <span class="label">创建日期：</span>
            {{$getTime()}}
          </span>
        </div>
        <div class="right">
          <span class="text">扫一扫<br />更新生产进度</span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="二维码">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center w180">{{$route.params.orderType === '1' ? '订' : '样'}}单号</div>
          <div class="row_item left">{{orderInfo.order_code || orderInfo.title}}</div>
          <div class="row_item center w180">下单日期</div>
          <div class="row_item left flex08">{{orderInfo.order_time}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">订单公司</div>
          <div class="row_item left">{{orderInfo.client_name}}</div>
          <div class="row_item center w180">负责小组</div>
          <div class="row_item left flex08">{{orderInfo.group_name}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">生产单位</div>
          <div class="row_item left">{{filterClientTel(weaveInfo[0] ? weaveInfo[0].client_name : '')}}</div>
          <div class="row_item center w180">总价</div>
          <div class="row_item left flex08">{{weaveInfo|filterialTotal}}元</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center w180">产品信息</div>
          <div class="row_item center w180">尺码颜色</div>
          <div class="row_item center">图片</div>
          <div class="row_item center">类型/单价</div>
          <div class="row_item center">数量</div>
          <div class="row_item center">完成日期</div>
        </div>
        <div v-for="(itemPro,indexPro) in weaveInfo"
          :key="indexPro"
          :class="['print_row',indexPro === weaveInfo.length -1 ?  'has_marginBottom' : '']">
          <div class="row_item w180 center">{{itemPro.product_code}}<br />{{itemPro|filterType}}</div>
          <div class="row_item col">
            <span v-for="(itemColor,indexColor) in itemPro.color_info"
              :key="indexColor"
              :class="['print_row', indexColor === 0 ? 'noBorder':'']">
              <span class="row_item center w180">{{itemColor.size + '/' + itemColor.color}}<br />{{itemColor.sizeInfo.size_info}}cm<br />{{itemColor.sizeInfo.weight}}g</span>
              <span class="row_item center">
                <zh-img-list :list='itemPro.image'></zh-img-list>
              </span>
              <span class="row_item center">{{itemColor.process_type}}<br />{{itemColor.price}}元/{{itemPro.unit || '件'}}</span>
              <span class="row_item center">{{itemColor.number}}{{itemPro.unit || '件'}}</span>
              <span class="row_item center">{{itemColor.compiled_time}}</span>
            </span>
          </div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center w180">{{$route.query.type === '1' ? '原' : '辅'}}料信息</div>
          <div class="row_item center w180">{{$route.query.type === '1' ? '原' : '辅'}}料颜色</div>
          <div class="row_item center">{{$route.query.type === '1' ? '原' : '辅'}}料数量</div>
        </div>
        <div v-for="(itemMa,indexMa) in materialInfo"
          :key="indexMa + 'material'"
          class="print_row">
          <div class="row_item w180 center">{{itemMa.material_name}}</div>
          <div class="row_item col">
            <span v-for="(itemColor,indexColor) in itemMa.color_info"
              :key="indexColor"
              :class="['print_row', indexColor === 0 ? 'noBorder':'']">
              <span class="row_item w180 center">{{itemColor.material_attribute}}</span>
              <span class="row_item center">{{itemMa.material_type === 1 ? ($toFixed(itemColor.material_weight/1000) + 'kg') : (itemColor.material_weight + (itemColor.unit || '个'))}}</span>
            </span>
          </div>
        </div>
        <div class="print_row"
          v-if="materialInfo.length === 0">
          <span class="row_item center">暂无{{$route.query.type === '1' ? '原' : '辅'}}料</span>
        </div>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <div class="row_item center w180">备注</div>
          <div class="row_item left remark_span"
            v-html="remark"></div>
        </div>
      </div>
    </div>
    <div class="printTable"
      v-if="!(materialInfo.length === 0 && $route.query.type === '2')">
      <div class="print_head">
        <div class="left">
          <span class="title">{{titles}}{{orderInfo.inside_order_code ? '-' + orderInfo.inside_order_code : ''}}</span>
          <span class="item">
            <span class="label">联系人：</span>
            {{user_name}}
          </span>
          <span class="item">
            <span class="label">联系人电话：</span>
            {{user_tel}}
          </span>
          <span class="item">
            <span class="label">创建日期：</span>
            {{$getTime()}}
          </span>
        </div>
        <div class="right">
          <span class="text">扫一扫<br />更新生产进度</span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl2"
              alt="二维码">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center w180">{{$route.params.orderType === '1' ? '订' : '样'}}单号</div>
          <div class="row_item left">{{orderInfo.order_code || orderInfo.title}}</div>
          <div class="row_item center w180">下单日期</div>
          <div class="row_item left flex08">{{orderInfo.order_time}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">订单公司</div>
          <div class="row_item left">{{orderInfo.client_name}}</div>
          <div class="row_item center w180">负责小组</div>
          <div class="row_item left flex08">{{orderInfo.group_name}}</div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">生产单位</div>
          <div class="row_item left">{{filterClientTel(weaveInfo[0] ? weaveInfo[0].client_name : '')}}</div>
          <div class="row_item center w180">总重</div>
          <div class="row_item left flex08">{{materialInfo|filterialWeight}}{{$route.query.type === '1' ? 'kg' : '个'}}</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center w180">{{$route.query.type === '1' ? '原' : '辅'}}料信息</div>
          <div class="row_item center w180">{{$route.query.type === '1' ? '原' : '辅'}}料颜色</div>
          <div class="row_item center">{{$route.query.type === '1' ? '原' : '辅'}}料数量</div>
        </div>
        <div v-for="(itemMa,indexMa) in materialInfo"
          :key="indexMa + 'material'"
          class="print_row">
          <div class="row_item w180 center">{{itemMa.material_name}}</div>
          <div class="row_item col">
            <span v-for="(itemColor,indexColor) in itemMa.color_info"
              :key="indexColor"
              :class="['print_row', indexColor === 0 ? 'noBorder':'']">
              <span class="row_item w180 center">{{itemColor.material_attribute}}</span>
              <span class="row_item center">{{itemMa.material_type === 1 ? ($toFixed(itemColor.material_weight/1000) + 'kg') : (itemColor.material_weight + (itemColor.unit || '个'))}}</span>
            </span>
          </div>
        </div>
        <div class="print_row"
          v-if="materialInfo.length === 0">
          <span class="row_item center">暂无{{$route.query.type === '1' ? '原' : '辅'}}料</span>
        </div>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <div class="row_item center w180">备注</div>
          <div class="row_item left remark_span"
            v-html="remarks"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { print, order, weave, processing, sampleOrder, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      title: '',
      remark: '',
      titles: '',
      remarks: '',
      user_name: window.sessionStorage.getItem('user_name'),
      user_tel: window.localStorage.getItem('zhUsername'),
      qrCodeUrl: '',
      qrCodeUrl2: '',
      orderInfo: {},
      weaveInfo: [],
      materialInfo: [],
      clientList: []
    }
  },
  methods: {
    init (type, orderType) {
      if (+orderType === 1) {
        if (type === '1') {
          Promise.all([
            print.detail({
              type: 1
            }),
            print.detail({
              type: 3
            }),
            order.detail({
              id: this.$route.params.id
            }),
            weave.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            this.titles = res[1].data.data ? res[1].data.data.title : (window.sessionStorage.getItem('company_name') + '原料调拨单')
            this.remarks = res[1].data.data ? res[1].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[2].data.data
            // 处理织造分配数据
            let weaveInfo = res[3].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.product_info.size.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: '织造',
                sizeInfo: sizeInfo,
                material_info: item.material_assign
              }
            })
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'product_code', otherRule: [{ name: 'client_name' }, { name: 'product_title/name' }, { name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'image' }, { name: 'unit' }, { name: 'is_part' }], childrenName: 'color_info', childrenRule: { mainRule: ['size_id', 'color_id', 'price', 'compiled_time', 'process_type'], otherRule: [{ name: 'size' }, { name: 'color' }, { name: 'number', type: 'add' }, { name: 'img' }, { name: 'sizeInfo' }] } })
            let materialInfo = this.$mergeData(this.$flatten(weaveInfo.map(itemMa => itemMa.material_info)), { mainRule: ['material_name', 'material_type'], childrenName: 'color_info', childrenRule: { mainRule: ['material_attribute'], otherRule: [{ name: 'material_weight', type: 'add' }, { name: 'material_unit/unit' }] } })
            this.materialInfo = materialInfo
            setTimeout(() => {
              window.print()
            }, 1000)
          })
        } else if (type === '2') {
          Promise.all([
            print.detail({
              type: 2
            }),
            print.detail({
              type: 4
            }),
            order.detail({
              id: this.$route.params.id
            }),
            processing.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            }),
            processing.matDetail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            this.titles = res[1].data.data ? res[1].data.data.title : (window.sessionStorage.getItem('company_name') + '原料调拨单')
            this.remarks = res[1].data.data ? res[1].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[2].data.data
            // 处理织造分配数据
            let weaveInfo = res[3].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.product_info.size.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: item.type,
                sizeInfo: sizeInfo
              }
            })
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), {
              mainRule: 'product_code',
              otherRule: [
                { name: 'client_name' },
                { name: 'product_title/name' },
                { name: 'category_name' },
                { name: 'type_name' },
                { name: 'style_name' },
                { name: 'image' },
                { name: 'unit' },
                { name: 'is_part' }
              ],
              childrenName: 'color_info',
              childrenRule: {
                mainRule: ['size_id', 'color_id', 'price', 'compiled_time', 'process_type'],
                otherRule: [
                  { name: 'size' },
                  { name: 'color' },
                  { name: 'number', type: 'add' },
                  { name: 'img' },
                  { name: 'sizeInfo' }
                ]
              }
            })
            let materialInfo = this.$mergeData(res[4].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)), {
              mainRule: 'material_name',
              childrenName: 'color_info',
              childrenRule: {
                mainRule: 'material_attribute',
                otherRule: [
                  { name: 'weight/material_weight', type: 'add' },
                  { name: 'unit' }
                ]
              }
            })
            this.materialInfo = materialInfo
            setTimeout(() => {
              window.print()
            }, 1000)
          })
        }
      } else {
        if (type === '1') {
          Promise.all([
            print.detail({
              type: 1
            }),
            print.detail({
              type: 3
            }),
            sampleOrder.detail({
              id: this.$route.params.id
            }),
            weave.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            this.titles = res[1].data.data ? res[1].data.data.title : (window.sessionStorage.getItem('company_name') + '原料调拨单')
            this.remarks = res[1].data.data ? res[1].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[2].data.data
            // 处理织造分配数据
            let weaveInfo = res[3].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.product_info.size.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: '织造',
                sizeInfo: sizeInfo,
                material_info: item.material_assign
              }
            })
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'product_code', otherRule: [{ name: 'client_name' }, { name: 'product_title/name' }, { name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'image' }, { name: 'unit' }, { name: 'is_part' }], childrenName: 'color_info', childrenRule: { mainRule: ['size_id', 'color_id', 'price', 'compiled_time', 'process_type'], otherRule: [{ name: 'size' }, { name: 'color' }, { name: 'number', type: 'add' }, { name: 'img' }, { name: 'sizeInfo' }] } })
            let materialInfo = this.$mergeData(this.$flatten(weaveInfo.map(itemMa => itemMa.material_info)), { mainRule: ['material_name', 'material_type'], childrenName: 'color_info', childrenRule: { mainRule: ['material_attribute'], otherRule: [{ name: 'material_weight', type: 'add' }, { name: 'material_unit/unit' }] } })
            this.materialInfo = materialInfo
            setTimeout(() => {
              window.print()
            }, 1000)
          })
        } else if (type === '2') {
          Promise.all([
            print.detail({
              type: 2
            }),
            print.detail({
              type: 4
            }),
            sampleOrder.detail({
              id: this.$route.params.id
            }),
            processing.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            }),
            processing.matDetail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            this.titles = res[1].data.data ? res[1].data.data.title : (window.sessionStorage.getItem('company_name') + '原料调拨单')
            this.remarks = res[1].data.data ? res[1].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[2].data.data
            // 处理织造分配数据
            let weaveInfo = res[3].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.product_info.size.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: item.type,
                sizeInfo: sizeInfo
              }
            })
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'product_code', otherRule: [{ name: 'client_name' }, { name: 'product_title/name' }, { name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'image' }, { name: 'unit' }, { name: 'is_part' }], childrenName: 'color_info', childrenRule: { mainRule: ['size_id', 'color_id', 'price', 'compiled_time', 'process_type'], otherRule: [{ name: 'size' }, { name: 'color' }, { name: 'number', type: 'add' }, { name: 'img' }, { name: 'sizeInfo' }] } })
            let materialInfo = this.$mergeData(res[4].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)), {
              mainRule: 'material_name',
              childrenName: 'color_info',
              childrenRule: {
                mainRule: 'material_attribute',
                otherRule: [
                  { name: 'weight/material_weight', type: 'add' },
                  { name: 'unit' }
                ]
              }
            })
            this.materialInfo = materialInfo
            setTimeout(() => {
              window.print()
            }, 1000)
          })
        }
      }
    },
    filterClientTel (name) {
      let flag = this.clientList.find(item => item.name === name)
      if (flag) {
        return name + '(' + flag.phone + ')'
      } else {
        return name
      }
    }
  },
  created () {
    this.init(this.$route.query.type, this.$route.params.orderType)
    client.list().then(res => {
      if (res.data.status !== false) {
        this.clientList = res.data.data
      }
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    if (+this.$route.query.type === 1) {
      QRCode.toDataURL(window.location.origin + '/weavingProcessing/weavingDetail/' + this.$route.params.id + '/' + this.$route.params.type + '?showRouterPopup=true', { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          this.qrCodeUrl = url
        }
      })
      QRCode.toDataURL(window.location.origin + '/materialStock/materialStockDetail/' + this.$route.params.id + '/1/' + this.$route.params.type, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          this.qrCodeUrl2 = url
        }
      })
    } else {
      QRCode.toDataURL(window.location.origin + '/weavingProcessing/processingDetail/' + this.$route.params.id + '/' + this.$route.params.type + '?showRouterPopup=true', { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          this.qrCodeUrl = url
        }
      })
      QRCode.toDataURL(window.location.origin + '/materialStock/materialStockDetail/' + this.$route.params.id + '/2/' + this.$route.params.type, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          this.qrCodeUrl2 = url
        }
      })
    }
  },
  filters: {
    filterType (item) {
      if (item.is_part > 0) {
        return item.name
      } else {
        return [item.category_name, item.type_name, item.style_name].join('/')
      }
    },
    filterialTotal (item) {
      let price = 0
      item.forEach(item => {
        item.color_info.forEach(itemColor => {
          price += (Number(itemColor.number) || 0) * (Number(itemColor.price) || 0)
        })
      })
      return price
    },
    filterialWeight (item) {
      let weight = 0
      item.forEach(item => {
        item.color_info.forEach(itemWeight => {
          weight += (item.material_type === 1 ? Number(itemWeight.material_weight / 1000) : Number(itemWeight.material_weight))
        })
      })
      return weight
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/weavingProcessing/weaveTable.less";
</style>
