<template>
  <div id='weaveTable'
    class='printHtml'>
    <div class="printTable crosswise"
      v-for="(itemWeave,indexWeave) in weaveInfo"
      :key="indexWeave">
      <div class="print_head leftRight">
        <div class="left">
          <span class="title">{{title}}</span>
          <!-- <span class="content"> -->
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
          <!-- </span> -->
        </div>
        <div class="right">
          <span class="qrCode_box"
            style="margin-right:8px">
            <img :src="itemWeave.category_info.image[0] ? itemWeave.category_info.image[0].image_url : errorImg"
              alt="">
          </span>
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
          <div class="row_item center w180">订单公司</div>
          <div class="row_item left">{{orderInfo.client_name}}</div>
          <div class="row_item center w180">下单日期</div>
          <div class="row_item left">{{orderInfo.order_time}}</div>
          <div class="row_item center w180">负责小组</div>
          <div class="row_item left">{{orderInfo.group_name}}</div>
        </div>
        <div class="print_row">
          <div class="row_item center w180">生产单位</div>
          <div class="row_item left">{{itemWeave.client_name || ''}}</div>
          <div class="row_item center w180">工序</div>
          <div class="row_item left">{{itemWeave.process_type || ''}}</div>
          <div class="row_item center w180">均价</div>
          <div class="row_item left">{{showFlag ? ($toFixed(itemWeave.totalPrice/itemWeave.orderInfo.total_number) + '元') : ''}}</div>
          <div class="row_item center w180">总价</div>
          <div class="row_item left showPriceCtn">
            {{showFlag ? ((itemWeave.totalPrice || 0) + '元') : ''}}
            <span class="showPriceBtn"
              @click="showFlag = !showFlag">{{showFlag ? '隐藏' : '显示'}}价格</span>
          </div>
        </div>
        <div class="print_row has_marginBottom">
          <div class="row_item center w180">产品品类</div>
          <div class="row_item left">{{itemWeave.product_code}}<br />{{itemWeave|filterType}}</div>
          <div class="row_item center w180">产品名称</div>
          <div class="row_item left">{{itemWeave.name || ''}}</div>
          <div class="row_item center w180">均重</div>
          <div class="row_item left">{{itemWeave.weight || ''}}</div>
          <div class="row_item center w180">下机时间</div>
          <div class="row_item left">{{itemWeave.complete_time || ''}}</div>
        </div>
        <template v-for="(itemOrder,indexOrder) in itemWeave.orderInfo.sizeArr">
          <div class="print_row bgGray"
            :key="'orderTitle' + indexOrder">
            <div class="row_item mergeTitle w180">
              <span class="top">数量</span>
              <span class="line"></span>
              <span class="bottom">色组</span>
            </div>
            <div class="row_item col"
              v-for="(itemSize,indexSize) in itemOrder"
              :key="indexSize">
              <span class="print_row noBorder">
                <span class="row_item center">{{itemSize.size_name}}</span>
              </span>
              <span class="print_row">
                <span class="row_item center">分配数</span>
                <span class="row_item center"
                  v-if="$route.query.type === '1'">机动数</span>
              </span>
            </div>
            <div class="row_item col"
              v-for="(itemB,indexB) in 6 - itemOrder.length"
              :key="'buchong' + indexB">
              <span class="print_row noBorder">
                <span class="row_item center"></span>
              </span>
              <span class="print_row">
                <span class="row_item center"></span>
                <span class="row_item center"
                  v-if="$route.query.type === '1'"></span>
              </span>
            </div>
            <div class="row_item center w180"
              v-if="indexOrder === itemWeave.orderInfo.sizeArr.length - 1">合计</div>
          </div>
          <div class="print_row"
            v-for="(itemColor,indexColor) in itemWeave.orderInfo.colorArr"
            :key="'color' + indexOrder + '-' + indexColor">
            <div class="row_item w180 center">{{itemColor.color_name}}</div>
            <div class="row_item col"
              v-for="(itemSize,indexSize) in itemOrder"
              :key="indexSize">
              <div class="print_row noBorder">
                <div class="row_item center">{{itemColor[itemSize.size_name].number}}</div>
                <div class="row_item center"
                  v-if="$route.query.type === '1'">{{itemColor[itemSize.size_name].motorise_number}}</div>
              </div>
            </div>
            <div class="row_item col"
              v-for="(itemB,indexB) in 6 - itemOrder.length"
              :key="'buchong' + indexB">
              <span class="print_row noBorder">
                <span class="row_item center"></span>
                <span class="row_item center"
                  v-if="$route.query.type === '1'"></span>
              </span>
            </div>
            <div class="row_item center w180"
              v-if="indexOrder === itemWeave.orderInfo.sizeArr.length - 1">{{itemColor.totalNumber_color}}</div>
          </div>
          <div class="print_row has_marginBottom"
            :key="'total' + indexOrder">
            <div class="row_item w180 center">合计</div>
            <div class="row_item col"
              v-for="(itemSize,indexSize) in itemOrder"
              :key="indexSize">{{itemSize.totalNumber_size}}</div>
            <div class="row_item"
              v-for="(itemB,indexB) in 6 - itemOrder.length"
              :key="'buchong' + indexB">
            </div>
            <div class="row_item center w180"
              v-if="indexOrder === itemWeave.orderInfo.sizeArr.length - 1">{{itemWeave.orderInfo.total_number}}</div>
          </div>
        </template>
        <div class="print_row">
          <div class="row_item bgGray center">总{{$route.query.type === '1' ? '原' : '辅'}}料信息</div>
        </div>
        <div class="print_row"
          v-for="(itemMa,indexMa) in itemWeave.materialInfo"
          :key="indexMa">
          <template v-for="(itemMaI,indexMaI) in itemMa">
            <div class="row_item left"
              :key="indexMaI + 'name'">{{itemMaI.material_name}}</div>
            <div class="row_item left"
              :key="indexMaI + 'attr'">{{itemMaI.material_attribute}}</div>
            <div class="row_item left"
              :key="indexMaI + 'weight'">{{itemMaI.weight || 0}}{{itemMaI.unit}}</div>
          </template>
          <template v-if="itemMa.length === 1">
            <div class="row_item left"></div>
            <div class="row_item left"></div>
            <div class="row_item left"></div>

          </template>
        </div>
        <div class="print_row"
          v-if="itemWeave.materialInfo.length === 0">
          <span class="row_item center">暂无{{$route.query.type === '1' ? '原' : '辅'}}料数据</span>
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
      errorImg: require('@/assets/image/index/noPic.jpg'),
      qrCodeUrl: '',
      qrCodeUrl2: '',
      orderInfo: {},
      weaveInfo: [],
      materialInfo: [],
      clientList: [],
      showFlag: false
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
            order.detail({
              id: this.$route.params.id
            }),
            weave.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            }),
            weave.getDressMat({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[1].data.data
            // 处理织造分配数据
            let weaveInfo = res[2].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.category_info.size_measurement.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                category_info: item.category_info,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: +item.number || 0,
                compiled_time: this.$getTime(item.complete_time),
                process_type: item.process,
                img: item.category_info.image,
                sizeInfo: sizeInfo,
                material_info: item.material_assign,
                motorise_number: +item.motorise_number || 0
              }
            })
            // 筛选原料数据
            let materialInfo = this.$newSplice(this.$mergeData(res[3].data.data.filter(itemF => +itemF.client_id === +this.$route.query.clientId && +itemF.material_type === 1), { mainRule: ['material_name', 'material_attribute'], otherRule: [{ name: 'weight', type: 'add' }, { name: 'unit' }, { name: 'material_type' }] }).map(item => {
              return {
                material_type: item.material_type,
                material_name: item.material_name,
                material_attribute: item.material_attribute,
                weight: item.weight,
                unit: 'kg'
              }
            }).sort((a, b) => {
              return a.material_name.localeCompare(b.material_name)
            }), 2)
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'code/product_code', otherRule: [{ name: 'client_name' }, { name: 'name' }, { name: 'category_info' }, { name: 'is_part' }, { name: 'process_type' }, { name: 'compiled_time/complete_time' }], childrenName: 'data_info' })
            this.weaveInfo.forEach(itemPro => {
              let sizeArr = []
              let colorArr = []
              itemPro.data_info.forEach(itemInfo => {
                let flagSize = sizeArr.find(itemSize => itemSize.size_id === itemInfo.size_id)
                if (!flagSize) {
                  sizeArr.push({
                    size_name: itemInfo.size,
                    size_id: itemInfo.size_id,
                    totalNumber_size: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 尺码的总订单数
                  })
                } else {
                  flagSize.totalNumber_size = (Number(flagSize.totalNumber_size) || 0) + (+itemInfo.number || 0) + (itemInfo.motorise_number || 0) // 尺码的总订单数
                }
                let flagColor = colorArr.find(itemColor => itemColor.color_id === itemInfo.color_id)
                if (!flagColor) {
                  colorArr.push({
                    color_name: itemInfo.color,
                    color_id: itemInfo.color_id,
                    [itemInfo.size]: {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    },
                    totalNumber_color: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                  })
                } else {
                  if (flagColor[itemInfo.size]) {
                    flagColor[itemInfo.size].number = (+flagColor[itemInfo.size].number || 0) + (+itemInfo.number || 0)
                    flagColor[itemInfo.size].motorise_number = (+flagColor[itemInfo.size].motorise_number || 0) + (+itemInfo.motorise_number || 0)
                  } else {
                    flagColor[itemInfo.size] = {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    }
                  }
                  flagColor.totalNumber_color = (Number(flagColor.totalNumber_color) || 0) + (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                }
              })
              itemPro.totalPrice = itemPro.data_info.map(itemInfo => ((+itemInfo.number || 0) + (+itemInfo.motorise_number || 0)) * (+itemInfo.price || 0)).reduce((a, b) => {
                return a + b
              })
              itemPro.orderInfo = {
                sizeArr: this.$newSplice(this.$clone(sizeArr), 6),
                colorArr: colorArr,
                total_number: sizeArr.map(itemSize => (+itemSize.totalNumber_size || 0)).reduce((a, b) => {
                  return a + b
                })
              }
              itemPro.materialInfo = materialInfo
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
              window.print()
            }, 1000)
          })
        } else if (type === '2') {
          Promise.all([
            print.detail({
              type: 2
            }),
            order.detail({
              id: this.$route.params.id
            }),
            processing.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[1].data.data
            // 处理织造分配数据
            let weaveInfo = res[2].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.category_info.size_measurement.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                category_info: item.category_info,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: item.type,
                img: item.category_info.image,
                sizeInfo: sizeInfo,
                material_info: item.part_assign
              }
            })
            // 筛选原料数据
            let materialInfo = this.$newSplice(this.$mergeData(this.$flatten(weaveInfo.map(item => item.material_info)), { mainRule: ['name/material_name', 'material_attribute'], otherRule: [{ name: 'number/weight', type: 'add' }, { name: 'unit' }] }).map(item => {
              return {
                material_type: 2,
                material_name: item.material_name,
                material_attribute: item.material_attribute,
                weight: item.weight,
                unit: item.unit || '个'
              }
            }).sort((a, b) => {
              return a.material_name.localeCompare(b.material_name)
            }), 2)
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'code/product_code', otherRule: [{ name: 'client_name' }, { name: 'name' }, { name: 'category_info' }, { name: 'is_part' }, { name: 'process_type' }, { name: 'compiled_time/complete_time' }], childrenName: 'data_info' })
            this.weaveInfo.forEach(itemPro => {
              let sizeArr = []
              let colorArr = []
              itemPro.data_info.forEach(itemInfo => {
                let flagSize = sizeArr.find(itemSize => itemSize.size_id === itemInfo.size_id)
                if (!flagSize) {
                  sizeArr.push({
                    size_name: itemInfo.size,
                    size_id: itemInfo.size_id,
                    totalNumber_size: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 尺码的总订单数
                  })
                } else {
                  flagSize.totalNumber_size = (Number(flagSize.totalNumber_size) || 0) + (+itemInfo.number || 0) + (itemInfo.motorise_number || 0) // 尺码的总订单数
                }
                let flagColor = colorArr.find(itemColor => itemColor.color_id === itemInfo.color_id)
                if (!flagColor) {
                  colorArr.push({
                    color_name: itemInfo.color,
                    color_id: itemInfo.color_id,
                    [itemInfo.size]: {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    },
                    totalNumber_color: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                  })
                } else {
                  if (flagColor[itemInfo.size]) {
                    flagColor[itemInfo.size].number = (+flagColor[itemInfo.size].number || 0) + (+itemInfo.number || 0)
                    flagColor[itemInfo.size].motorise_number = (+flagColor[itemInfo.size].motorise_number || 0) + (+itemInfo.motorise_number || 0)
                  } else {
                    flagColor[itemInfo.size] = {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    }
                  }
                  flagColor.totalNumber_color = (Number(flagColor.totalNumber_color) || 0) + (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                }
              })
              itemPro.totalPrice = itemPro.data_info.map(itemInfo => (+itemInfo.number || 0) * (+itemInfo.price || 0)).reduce((a, b) => {
                return a + b
              })
              itemPro.orderInfo = {
                sizeArr: this.$newSplice(this.$clone(sizeArr), 6),
                colorArr: colorArr,
                total_number: sizeArr.map(itemSize => (+itemSize.totalNumber_size || 0)).reduce((a, b) => {
                  return a + b
                })
              }
              itemPro.materialInfo = materialInfo
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
            sampleOrder.detail({
              id: this.$route.params.id
            }),
            weave.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            }),
            weave.getDressMat({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[1].data.data
            // 处理织造分配数据
            let weaveInfo = res[2].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.category_info.size_measurement.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                category_info: item.category_info,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: '织造',
                img: item.category_info.image,
                sizeInfo: sizeInfo,
                material_info: item.material_assign,
                motorise_number: +item.motorise_number || 0
              }
            })
            // 筛选原料数据
            let materialInfo = this.$newSplice(this.$mergeData(res[3].data.data.filter(itemF => +itemF.client_id === +this.$route.query.clientId && +itemF.material_type === 1), { mainRule: ['material_name', 'material_attribute'], otherRule: [{ name: 'weight', type: 'add' }, { name: 'unit' }, { name: 'material_type' }] }).map(item => {
              return {
                material_type: item.material_type,
                material_name: item.material_name,
                material_attribute: item.material_attribute,
                weight: item.weight,
                unit: 'kg'
              }
            }).sort((a, b) => {
              return a.material_name.localeCompare(b.material_name)
            }), 2)
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'code/product_code', otherRule: [{ name: 'client_name' }, { name: 'name' }, { name: 'category_info' }, { name: 'is_part' }, { name: 'process_type' }, { name: 'compiled_time/complete_time' }], childrenName: 'data_info' })
            this.weaveInfo.forEach(itemPro => {
              let sizeArr = []
              let colorArr = []
              itemPro.data_info.forEach(itemInfo => {
                let flagSize = sizeArr.find(itemSize => itemSize.size_id === itemInfo.size_id)
                if (!flagSize) {
                  sizeArr.push({
                    size_name: itemInfo.size,
                    size_id: itemInfo.size_id,
                    totalNumber_size: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 尺码的总订单数
                  })
                } else {
                  flagSize.totalNumber_size = (Number(flagSize.totalNumber_size) || 0) + (+itemInfo.number || 0) + (itemInfo.motorise_number || 0) // 尺码的总订单数
                }
                let flagColor = colorArr.find(itemColor => itemColor.color_id === itemInfo.color_id)
                if (!flagColor) {
                  colorArr.push({
                    color_name: itemInfo.color,
                    color_id: itemInfo.color_id,
                    [itemInfo.size]: {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    },
                    totalNumber_color: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                  })
                } else {
                  if (flagColor[itemInfo.size]) {
                    flagColor[itemInfo.size].number = (+flagColor[itemInfo.size].number || 0) + (+itemInfo.number || 0)
                    flagColor[itemInfo.size].motorise_number = (+flagColor[itemInfo.size].motorise_number || 0) + (+itemInfo.motorise_number || 0)
                  } else {
                    flagColor[itemInfo.size] = {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    }
                  }
                  flagColor.totalNumber_color = (Number(flagColor.totalNumber_color) || 0) + (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                }
              })
              itemPro.totalPrice = itemPro.data_info.map(itemInfo => (+itemInfo.number || 0) * (+itemInfo.price || 0)).reduce((a, b) => {
                return a + b
              })
              itemPro.orderInfo = {
                sizeArr: this.$newSplice(this.$clone(sizeArr), 6),
                colorArr: colorArr,
                total_number: sizeArr.map(itemSize => (+itemSize.totalNumber_size || 0)).reduce((a, b) => {
                  return a + b
                })
              }
              itemPro.materialInfo = materialInfo
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
              window.print()
            }, 1000)
          })
        } else if (type === '2') {
          Promise.all([
            print.detail({
              type: 2
            }),
            sampleOrder.detail({
              id: this.$route.params.id
            }),
            processing.detail({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType
            })
          ]).then(res => {
            this.title = res[0].data.data ? res[0].data.data.title : (window.sessionStorage.getItem('company_name') + '生产加工通知单')
            this.remark = res[0].data.data ? res[0].data.data.desc : ''
            // 处理订单信息
            this.orderInfo = res[1].data.data
            // 处理织造分配数据
            let weaveInfo = res[2].data.data.filter(item => Number(item.client_id) === Number(this.$route.query.clientId)).map(item => {
              let flag = item.category_info.size_measurement.find(itemPro => itemPro.size_id === item.size_id)
              let sizeInfo = flag || {}
              return {
                ...item.product_info,
                is_part: item.is_part,
                category_info: item.category_info,
                client_name: item.client_name,
                size: item.size_name,
                size_id: item.size_id,
                color: item.color_name,
                color_id: item.color_id,
                price: item.price,
                number: item.number,
                compiled_time: this.$getTime(item.complete_time),
                process_type: item.type,
                img: item.category_info.image,
                sizeInfo: sizeInfo,
                material_info: item.part_assign
              }
            })
            // 筛选原料数据
            let materialInfo = this.$newSplice(this.$mergeData(this.$flatten(weaveInfo.map(item => item.material_info)), { mainRule: ['name/material_name', 'material_attribute'], otherRule: [{ name: 'number/weight', type: 'add' }, { name: 'unit' }] }).map(item => {
              return {
                material_type: 2,
                material_name: item.material_name,
                material_attribute: item.material_attribute,
                weight: item.weight,
                unit: item.unit || '个'
              }
            }).sort((a, b) => {
              return a.material_name.localeCompare(b.material_name)
            }), 2)
            this.weaveInfo = this.$mergeData(this.$clone(weaveInfo), { mainRule: 'code/product_code', otherRule: [{ name: 'client_name' }, { name: 'name' }, { name: 'category_info' }, { name: 'is_part' }, { name: 'process_type' }, { name: 'compiled_time/complete_time' }], childrenName: 'data_info' })
            this.weaveInfo.forEach(itemPro => {
              let sizeArr = []
              let colorArr = []
              itemPro.data_info.forEach(itemInfo => {
                let flagSize = sizeArr.find(itemSize => itemSize.size_id === itemInfo.size_id)
                if (!flagSize) {
                  sizeArr.push({
                    size_name: itemInfo.size,
                    size_id: itemInfo.size_id,
                    totalNumber_size: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 尺码的总订单数
                  })
                } else {
                  flagSize.totalNumber_size = (Number(flagSize.totalNumber_size) || 0) + (+itemInfo.number || 0) + (itemInfo.motorise_number || 0) // 尺码的总订单数
                }
                let flagColor = colorArr.find(itemColor => itemColor.color_id === itemInfo.color_id)
                if (!flagColor) {
                  colorArr.push({
                    color_name: itemInfo.color,
                    color_id: itemInfo.color_id,
                    [itemInfo.size]: {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    },
                    totalNumber_color: (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                  })
                } else {
                  if (flagColor[itemInfo.size]) {
                    flagColor[itemInfo.size].number = (+flagColor[itemInfo.size].number || 0) + (+itemInfo.number || 0)
                    flagColor[itemInfo.size].motorise_number = (+flagColor[itemInfo.size].motorise_number || 0) + (+itemInfo.motorise_number || 0)
                  } else {
                    flagColor[itemInfo.size] = {
                      number: (+itemInfo.number || 0),
                      motorise_number: (+itemInfo.motorise_number || 0)
                    }
                  }
                  flagColor.totalNumber_color = (Number(flagColor.totalNumber_color) || 0) + (+itemInfo.number || 0) + (+itemInfo.motorise_number || 0) // 颜色的总订单数
                }
              })
              itemPro.totalPrice = itemPro.data_info.map(itemInfo => (+itemInfo.number || 0) * (+itemInfo.price || 0)).reduce((a, b) => {
                return a + b
              })
              itemPro.orderInfo = {
                sizeArr: this.$newSplice(this.$clone(sizeArr), 6),
                colorArr: colorArr,
                total_number: sizeArr.map(itemSize => (+itemSize.totalNumber_size || 0)).reduce((a, b) => {
                  return a + b
                })
              }
              itemPro.materialInfo = materialInfo
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
    },
    returnSize (str) {
      let num = 0
      for (let i = 0; i < str.length; i++) {
        let leg = str.charCodeAt(i)
        if (leg > 255) {
          num += 2
        } else {
          num++
        }
      }
      if (num < 23) {
        return 20
      } else if (num > 23 && num < 50) {
        return 18
      } else {
        return 14
      }
    },
    newSplitLine (data, length, newArr, arr) {
      data = data || [] // 切割的数据
      length = length || 5// 切割单个数组的长度
      newArr = newArr || []// 用于存储切割后的数组
      arr = arr || [] // 单个数组存储数据
      for (let index in data) {
        let item = data[index]
        let arrLengthArr = arr.map(val => val.rowNum)
        let arrLength = arrLengthArr.length > 0 ? arrLengthArr.reduce((a, b) => {
          return a + b
        }) : 0
        if (arrLength + item.rowNum < length) {
          arr.push(...data.splice(0, 1))
          if (data.length > 0) {
            this.newSplitLine(data, length, newArr, arr)
          } else {
            newArr.push(arr)
          }
          break
        } else if (arrLength + item.rowNum === length) {
          arr.push(...data.splice(0, 1))
          newArr.push(arr)
          if (data.length > 0) {
            this.newSplitLine(data, length, newArr)
          }
          break
        } else if (arrLength < length && arrLength + item.rowNum > length) {
          let spliceLength = length - arrLength
          let obj = {
            material_name: item.material_name,
            material_type: item.material_type,
            rowNum: 0,
            color_info: {}
          }
          item.rowNum = 0
          for (let prop in item.color_info) {
            let itemColor = item.color_info[prop]
            obj.color_info[prop] = itemColor.splice(0, spliceLength)
            if (itemColor.length > item.rowNum) {
              item.rowNum = itemColor.length
            }
          }
          for (let prop in obj.color_info) {
            if (obj.color_info[prop].length > obj.rowNum) {
              obj.rowNum = obj.color_info[prop].length
            }
          }
          arr.push(obj)
          newArr.push(arr)
          break
        }
      }
      if (data.length > 0) {
        this.newSplitLine(data, length, newArr)
      } else {
        return newArr
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
    } else {
      QRCode.toDataURL(window.location.origin + '/weavingProcessing/processingDetail/' + this.$route.params.id + '/' + this.$route.params.type + '?showRouterPopup=true', { errorCorrectionLevel: 'H' }, (err, url) => {
        if (!err) {
          this.qrCodeUrl = url
        }
      })
    }
  },
  filters: {
    filterType (item) {
      // if (item.is_part > 0) {
      //   return item.name
      // } else {
      return item.category_info.category_name ? [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/') : item.name
      // }
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
    },
    filterMaColorNum (item) {
      if (item) {
        return item.number + item.material_unit
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/weavingProcessing/weaveTable.less";
</style>
