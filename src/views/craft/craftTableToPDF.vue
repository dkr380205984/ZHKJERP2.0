<template>
  <div class='printHtml'
    id="craftTable">
    <div class="printTable">
      <div class="print_head"
        style="height:auto">
        <div class="left"
          style="width:100%;justify-content: center;">
          <span class="title"
            style="text-align:center">桐庐凯瑞针纺有限公司工艺单设计稿</span>
          <div class="info">
            <span class="item">
              <span class="label">创建人：</span>
              <!-- {{craftDetail.user_name}} -->
            </span>
            <span class="item">
              <span class="label">创建日期：</span>
              {{$getTime()}}
              <!-- {{craftDetail.create_time}} -->
            </span>
          </div>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item w100 center">产品编号</span>
          <span class="row_item w180 left">
            <!-- {{craftDetail.product_info.product_code}} -->
          </span>
          <span class="row_item w100 center">产品品类</span>
          <span class="row_item w180 left">
            <!-- {{craftDetail.product_info|filterType}} -->
          </span>
          <span class="row_item w100 center">产品名称</span>
          <span class="row_item left">
            <!-- {{craftDetail.product_info.title}} -->
          </span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">工艺单名称</span>
          <span class="row_item w180 left">
            <!-- {{craftDetail.title || ''}} -->
          </span>
          <span class="row_item w100 center">产品成分</span>
          <span class="row_item left">
            <!-- {{craftDetail.size ? craftDetail.size + 'cm' : ''}} -->
          </span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">产品配色</span>
          <span class="row_item w180 left">
            <!-- {{craftDetail.title || ''}} -->
          </span>
          <span class="row_item w100 center">产品规格</span>
          <span class="row_item left">
            <!-- {{craftDetail.size ? craftDetail.size + 'cm' : ''}} -->
          </span>
        </div>
        <!-- 中间图片，高度得自己去定义 -->
        <div class="print_row">
        </div>
      </div>
      <!-- 下面部分 -->
      <div class="print_remark"
        style="flex-direction: column;">
        <span class="print_row h40 noBorder">
          <span class="row_item w180 left">经纬编号</span>
          <span class="row_item center"
            v-for="item in 7"
            :key="item">{{item}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">色号</span>
          <span class="row_item center"
            v-for="item in 7"
            :key="item">{{item}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">使用原料</span>
          <span class="row_item center"
            v-for="item in 7"
            :key="item">{{item}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">原料克重</span>
          <span class="row_item center"
            v-for="item in 7"
            :key="item">{{item}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">比例</span>
          <span class="row_item center"
            v-for="item in 7"
            :key="item">{{item}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { craft } from '@/assets/js/api.js'
// import { letterArr } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      // loading: true,
      // qrCodeUrl: '',
      // craftDetail: {
      //   product_info: {
      //     category_info: {},
      //     size: [],
      //     materials: []
      //   },
      //   draft_method: {
      //     GL: []
      //   }
      // },
      // warp_data: {
      //   material_data: [],
      //   assist_material: [],
      //   warp_rank: [[], [], [], [], [], []],
      //   merge_data: [],
      //   warp_rank_back: [[], [], [], [], [], []],
      //   merge_data_back: [],
      //   length_is: 0,
      //   length_back: 0
      // },
      // weft_data: {
      //   material_data: [],
      //   assist_material: [],
      //   weft_rank: [[], [], [], [], [], []],
      //   merge_data: [],
      //   weft_rank_back: [[], [], [], [], [], []],
      //   merge_data_back: [],
      //   length_is: 0,
      //   length_back: 0
      // },
      // color_data: [],
      // colorWeight: {
      //   warp: [],
      //   weft: []
      // },
      // zhujia_info: [],
      // letterArr: letterArr
    }
  },
  methods: {
    // 给合并规则里添加value
    // pushValue (item, key, index) {
    //   let valueArr = item[key] // value来源数组
    //   item[index].forEach(val => {
    //     val.value = this.$clone(valueArr[val.row]).splice(val.col, val.colspan).filter(num => num)[0]
    //   })
    //   this.changeMergeMethod(item[index], Math.ceil(item[key][0].length / 16)) // 处理合并规则
    // },
    // // 对合并规则进行处理
    // changeMergeMethod (item, key) {
    //   for (let i = 1; i < key; i++) {
    //     item.forEach(val => {
    //       if (i * 16 > val.col && (val.col + val.colspan - 1) >= i * 16) {
    //         item.push({
    //           col: i * 16,
    //           colspan: val.colspan - (i * 16 - val.col),
    //           removed: val.removed,
    //           row: val.row,
    //           rowspan: val.rowspan,
    //           split: true,
    //           noLeftJianTou: true,
    //           value: val.value
    //         })
    //         val.colspan = i * 16 - val.col
    //         val.split = true
    //         if (!val.noLeftJianTou) {
    //           val.noRightJianTou = true
    //         } else {
    //           val.noLeftJianTou = false
    //           val.noJianTou = true
    //         }
    //       }
    //       // console.log(JSON.stringify(val))
    //     })
    //   }
    // },
    // // 合并单元格
    // mergeSpan (item, index, key, mergeIndex, callBack, keys) {
    //   let mergeALLMathod = item[mergeIndex]
    //   let mergeMethod = mergeALLMathod.filter(val => Number(val.row) === Number(index)) // 合并规则
    //   let isMergeData = callBack ? callBack(item[key][index], keys, true) : item[key][index] // 需要合并的数据
    //   let mergeData = [] // 合并后的数据
    //   for (let ind = 0; ind < isMergeData.length; ind++) {
    //     let val = isMergeData[ind]
    //     let mergeItem = mergeMethod.find(mergeItem => ind >= (mergeItem.col - (keys || 0) * 16) && ((mergeItem.col - (keys || 0) * 16) + mergeItem.colspan - 1) >= ind)
    //     if (mergeItem) {
    //       // console.log(JSON.stringify(mergeItem))
    //       mergeData.push({ value: mergeItem.value, colspan: mergeItem.colspan, isSplit: mergeItem.split, noLeftJianTou: mergeItem.noLeftJianTou, noRightJianTou: mergeItem.noRightJianTou, noJianTou: mergeItem.noJianTou })
    //       ind += (mergeItem.colspan - 1)
    //     } else {
    //       mergeData.push({ value: val, colspan: 1 })
    //     }
    //   }
    //   return mergeData
    // },
    // // 返回字号
    // returnSize (str) {
    //   let num = 0
    //   str.split('').forEach(item => {
    //     num += (item.charCodeAt(0) > 255 ? 2 : 1)
    //   })
    //   if (num < 7) {
    //     return '18px'
    //   } else if (num < 9) {
    //     return '16px'
    //   } else if (num < 11) {
    //     return '14px'
    //   } else if (num < 13) {
    //     return '12px'
    //   } else {
    //     return '10px'
    //   }
    // },
    // // 拆分单元格
    // splitData (item, index) {
    //   return this.$clone(item).splice(index * 16, 16)
    // }
  },
  created () {
    // craft.getByProduct({
    //   product_id: this.$route.params.id,
    //   product_type: this.$route.params.type
    // }).then(res => {
    //   if (res.data.stauts !== false) {
    //     let data = null
    //     if (this.$route.params.type === '1') {
    //       data = res.data.data
    //     } else {
    //       data = res.data.data.find(item => item.id === this.$route.params.craftId)
    //     }
    //     if (!data) {
    //       this.$message('未找到工艺单ID为' + this.$route.params.craftId + '的工艺单')
    //       return
    //     }
    //     data.warp_data.merge_data = JSON.parse(data.warp_data.merge_data)
    //     data.warp_data.merge_data_back = JSON.parse(data.warp_data.merge_data_back)
    //     data.warp_data.warp_rank = JSON.parse(data.warp_data.warp_rank)
    //     data.warp_data.warp_rank_back = JSON.parse(data.warp_data.warp_rank_back)
    //     data.weft_data.merge_data = JSON.parse(data.weft_data.merge_data)
    //     data.weft_data.merge_data_back = JSON.parse(data.weft_data.merge_data_back)
    //     data.weft_data.weft_rank = JSON.parse(data.weft_data.weft_rank)
    //     data.weft_data.weft_rank_back = JSON.parse(data.weft_data.weft_rank_back)
    //     this.craftDetail = this.$clone(data)
    //     this.warp_data = this.$clone(data.warp_data)
    //     this.warp_data.length_is = this.warp_data.warp_rank[0].length
    //     this.warp_data.length_back = this.warp_data.warp_rank_back[0].length
    //     this.weft_data = this.$clone(data.weft_data)
    //     this.weft_data.length_is = this.weft_data.weft_rank[0].length
    //     this.weft_data.length_back = this.weft_data.weft_rank_back[0].length
    //     this.pushValue(this.warp_data, 'warp_rank', 'merge_data') // 给合并规则里附上value
    //     this.pushValue(this.warp_data, 'warp_rank_back', 'merge_data_back')// 给合并规则里附上value
    //     this.pushValue(this.weft_data, 'weft_rank', 'merge_data')// 给合并规则里附上value
    //     this.pushValue(this.weft_data, 'weft_rank_back', 'merge_data_back')// 给合并规则里附上value
    //     let colorData = []
    //     this.warp_data.color_data.forEach(item => {
    //       let colorFlag = colorData.find(key => key.product_color === item.product_color)
    //       if (!colorFlag) {
    //         colorData.push({
    //           product_color: item.product_color,
    //           color_scheme: {
    //             warp: item.color_scheme,
    //             weft: []
    //           }
    //         })
    //       } else {
    //         colorFlag.color_scheme.warp = item.color_scheme
    //       }
    //     })
    //     this.weft_data.color_data.forEach(item => {
    //       let colorFlag = colorData.find(key => key.product_color === item.product_color)
    //       if (!colorFlag) {
    //         colorData.push({
    //           product_color: item.product_color,
    //           color_scheme: {
    //             warp: [],
    //             weft: item.color_scheme
    //           }
    //         })
    //       } else {
    //         colorFlag.color_scheme.weft = item.color_scheme
    //       }
    //     })
    //     this.color_data = colorData
    //     // 初始化主夹信息
    //     this.warp_data.material_data.forEach(item => {
    //       item.apply.forEach(val => {
    //         if (this.zhujia_info.indexOf(val) === -1) {
    //           this.zhujia_info.push(val)
    //         }
    //       })
    //     })
    //     this.weft_data.material_data.forEach(item => {
    //       item.apply.forEach(val => {
    //         if (this.zhujia_info.indexOf(val) === -1) {
    //           this.zhujia_info.push(val)
    //         }
    //       })
    //     })
    //     // 计算克重信息
    //     let arrWarp = data.warp_data.warp_rank.slice(1, 5)
    //     data.warp_data.merge_data.forEach((item) => {
    //       if (item.row === 3 || item.row === 4) {
    //         for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
    //           arrWarp[item.row - 1][i] = arrWarp[item.row - 1][item.col]
    //         }
    //       }
    //     })
    //     let arrWeft = data.weft_data.weft_rank.slice(1, 5)
    //     data.weft_data.merge_data.forEach((item) => {
    //       if (item.row === 3 || item.row === 4) {
    //         for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
    //           arrWeft[item.row - 1][i] = arrWeft[item.row - 1][item.col]
    //         }
    //       }
    //     })
    //     let arrWarpBack = data.warp_data.warp_rank_back.slice(1, 5)
    //     data.warp_data.merge_data_back.forEach((item) => {
    //       if (item.row === 3 || item.row === 4) {
    //         for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
    //           arrWarpBack[item.row - 1][i] = arrWarpBack[item.row - 1][item.col]
    //         }
    //       }
    //     })
    //     let arrWeftBack = data.weft_data.weft_rank_back.slice(1, 5)
    //     data.weft_data.merge_data_back.forEach((item) => {
    //       if (item.row === 3 || item.row === 4) {
    //         for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
    //           arrWeftBack[item.row - 1][i] = arrWeftBack[item.row - 1][item.col]
    //         }
    //       }
    //     })
    //     let colorNumber = {
    //       warp: [],
    //       weft: []
    //     }
    //     for (let i = 0; i < arrWarp[0].length; i++) {
    //       const x = arrWarp[1][i] ? arrWarp[1][i] : 1
    //       const y = arrWarp[2][i] ? arrWarp[2][i] : 1
    //       const z = arrWarp[3][i] ? arrWarp[3][i] : 1
    //       colorNumber.warp[arrWarp[0][i]] = colorNumber.warp[arrWarp[0][i]] ? colorNumber.warp[arrWarp[0][i]] : 0
    //       colorNumber.warp[arrWarp[0][i]] += x * y * z
    //     }
    //     for (let i = 0; i < arrWeft[0].length; i++) {
    //       const x = arrWeft[1][i] ? arrWeft[1][i] : 1
    //       const y = arrWeft[2][i] ? arrWeft[2][i] : 1
    //       const z = arrWeft[3][i] ? arrWeft[3][i] : 1
    //       colorNumber.weft[arrWeft[0][i]] = colorNumber.weft[arrWeft[0][i]] ? colorNumber.weft[arrWeft[0][i]] : 0
    //       colorNumber.weft[arrWeft[0][i]] += x * y * z
    //     }
    //     for (let i = 0; i < arrWarpBack[0].length; i++) {
    //       const x = arrWarpBack[1][i] ? arrWarpBack[1][i] : 1
    //       const y = arrWarpBack[2][i] ? arrWarpBack[2][i] : 1
    //       const z = arrWarpBack[3][i] ? arrWarpBack[3][i] : 1
    //       colorNumber.warp[arrWarpBack[0][i]] = colorNumber.warp[arrWarpBack[0][i]] ? colorNumber.warp[arrWarpBack[0][i]] : 0
    //       colorNumber.warp[arrWarpBack[0][i]] += x * y * z
    //     }
    //     for (let i = 0; i < arrWeftBack[0].length; i++) {
    //       const x = arrWeftBack[1][i] ? arrWeftBack[1][i] : 1
    //       const y = arrWeftBack[2][i] ? arrWeftBack[2][i] : 1
    //       const z = arrWeftBack[3][i] ? arrWeftBack[3][i] : 1
    //       colorNumber.weft[arrWeftBack[0][i]] = colorNumber.weft[arrWeftBack[0][i]] ? colorNumber.weft[arrWeftBack[0][i]] : 0
    //       colorNumber.weft[arrWeftBack[0][i]] += x * y * z
    //     }
    //     this.warp_data.material_data.forEach((item) => {
    //       item.apply.forEach((itemChild) => {
    //         this.colorWeight.warp[itemChild] = this.$toFixed(colorNumber.warp[itemChild] * (this.weft_data.neichang + this.weft_data.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100)
    //       })
    //     })
    //     this.weft_data.material_data.forEach((item) => {
    //       item.apply.forEach((itemChild) => {
    //         this.colorWeight.weft[itemChild] = this.$toFixed(colorNumber.weft[itemChild] * this.warp_data.reed_width * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100)
    //       })
    //     })
    //     setTimeout(() => {
    //       window.print()
    //     }, 1000)
    //   }
    // })
  },
  mounted () {
    // const QRCode = require('qrcode')
    // QRCode.toDataURL(window.location.origin + '/craft/craftDetail/' + this.$route.params.id + '/' + this.$route.params.type, { errorCorrectionLevel: 'H' }, (err, url) => {
    //   if (!err) {
    //     this.qrCodeUrl = url
    //   }
    // })
  },
  filters: {
    // filterType (item) {
    //   return [item.category_info.product_category, item.type_name, item.style_name, item.flower_id].join('/')
    // },
    // filterMaterial (item) {
    //   return item.map(value => value.number + '%' + value.component_name).join('.')
    // },
    // filterMaterialClass (item) {
    //   let arr = []
    //   item.forEach(value => {
    //     if (value !== 0) {
    //       arr.push('夹' + value)
    //     } else {
    //       arr.push('主')
    //     }
    //   })
    //   return arr.join('/')
    // },
    // filterThroughMethod (items) {
    //   let str = ''
    //   let romanNum = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ']
    //   if (items.PMFlag === 'normal') {
    //     items.PM.forEach((item, key) => {
    //       str += romanNum[key] + '【' + item.number + '根（' + item.value + '）' + '】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (key !== items.PM.length - 1 ? '。' : '')
    //     })
    //   } else if (items.PMFlag === 'complex') {
    //     items.PM.forEach((item, key) => {
    //       str += romanNum[key]
    //       item.children.forEach((value, index) => {
    //         str += ('【' + value.number + '根')
    //         value.children.forEach((val, ind) => {
    //           str += '（' + val.value + '）' + (val.repeat && val.repeat !== 1 ? 'x' + val.repeat + '遍' : '') + (ind !== value.children.length - 1 ? '，' : '')
    //         })
    //         str += ('】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (index !== item.children.length - 1 ? '。' : ''))
    //       })
    //     })
    //   }
    //   return str
    // }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/craft/craftTable.less";
#craftTable {
  .info {
    display: flex;
    justify-content: space-between;
  }
}
</style>
