<template>
  <div class='printHtml'
    id="craftTable">
    <div class="printTable">
      <div class="print_head"
        style="height:auto">
        <div class="left"
          style="width:100%;justify-content: center;">
          <span class="title"
            style="text-align:center">{{companyName}}工艺单设计稿</span>
          <div class="info">
            <span class="item">
              <span class="label">创建人：</span>
              {{craftDetail.user_name}}
            </span>
            <span class="item">
              <span class="label">创建日期：</span>
              {{$getTime(craftDetail.create_time)}}
            </span>
          </div>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item w100 center">产品编号</span>
          <span class="row_item w180 left">
            {{craftDetail.product_info.product_code|| '/'}}
          </span>
          <span class="row_item w100 center">产品品类</span>
          <span class="row_item w180 left">
            {{craftDetail.product_info|filterType}}
          </span>
          <span class="row_item w100 center">产品名称</span>
          <span class="row_item left">
            {{craftDetail.product_info.title || '/'}}
          </span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">工艺单名称</span>
          <span class="row_item w180 left">
            {{craftDetail.title || '无'}}
          </span>
          <span class="row_item w100 center">产品成分</span>
          <span class="row_item left">
            {{craftDetail.product_info.component |filterMaterials}}
          </span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">产品配色</span>
          <span class="row_item w180 left">
            {{color_data.length>0?color_data[$route.params.colorIndex].product_color:''}}
          </span>
          <span class="row_item w100 center">产品规格</span>
          <span class="row_item left">
            {{craftDetail.product_info.size.length>0?craftDetail.product_info.size[0].size_name:''}}
          </span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">产品长度</span>
          <span class="row_item w180 left">
            {{Number(weftInfo.neichang + this.weftInfo.rangwei) }}cm
          </span>
          <span class="row_item w100 center">产品宽度</span>
          <span class="row_item left">
            {{Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu}}cm
          </span>
        </div>
        <!-- 中间图片，高度得自己去定义 -->
        <div class="print_row"
          style="display:flex;justify-content: center;padding:20px 0">
          <div class="canvasCtn"
            style="position:relative">
            <div class="mark"
              style="width: 0px;
                    height: 0px;
                    position: absolute;
                    border: 40px solid;
                    border-color:#1a95ff #1a95ff rgba(0,0,0,0) rgba(0,0,0,0);
                    right: 0px;
                    top: 0;
                    white-space: nowrap;">
              <span style="position: absolute;
                          color: #fff;
                          width: 100px;
                          text-align: center;
                          font-size: 16px;
                          transform: rotate(45deg) translate(-41px,10px);">正面</span>
            </div>
            <canvas ref="myCanvas"
              style="display:none"
              width="2400"
              :height="canvasHeight"></canvas>
            <img ref="img"
              :style="{'height':canvasHeight/6 + 'px'}"
              src="" />
          </div>
          <div class="canvasCtn"
            v-show="(warpInfo.back_status===1||weftInfo.back_status===1)"
            style="margin-left:20px;position: relative;">
            <div class="mark"
              style="width: 0px;
                    height: 0px;
                    position: absolute;
                    border: 40px solid;
                    border-color:#1a95ff #1a95ff rgba(0,0,0,0) rgba(0,0,0,0);
                    right: 0px;
                    top: 0;
                    white-space: nowrap;">
              <span style="position: absolute;
                    color: #fff;
                    width: 100px;
                    text-align: center;
                    font-size: 16px;
                    transform: rotate(45deg) translate(-41px,10px);">反面</span>
            </div>
            <canvas ref="myCanvasBack"
              style="display:none"
              width="2400"
              :height="canvasHeight">
            </canvas>
            <!-- canvas转图像的容器 -->
            <img ref="imgBack"
              :style="{'height':canvasHeight/6 + 'px'}"
              src="" />
          </div>
        </div>
      </div>
      <!-- 下面部分 -->
      <div class="print_remark"
        style="flex-direction: column;"
        v-for="(item,index) in bottomArr"
        :key="index">
        <span class="print_row h40 noBorder">
          <span class="row_item w180 left">经纬编号</span>
          <span class="row_item center"
            v-for="(itemChild,indexChild) in item"
            :key="indexChild">{{itemChild.warpOrWeft}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">色号</span>
          <span class="row_item center"
            style="display:flex;flex-direction:column;padding:12px 0"
            v-for="(itemChild,indexChild) in item"
            :key="indexChild">
            <div style="width:80px;height:25px"
              :style="{'background':itemChild.colorValue}"></div>
            <span>{{itemChild.colorName}}</span>
          </span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">使用原料</span>
          <span class="row_item center"
            v-for="(itemChild,indexChild) in item"
            :key="indexChild">{{itemChild.material_name}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">原料克重(g)</span>
          <span class="row_item center"
            v-for="(itemChild,indexChild) in item"
            :key="indexChild">{{itemChild.weight}}</span>
        </span>
        <span class="print_row h40">
          <span class="row_item w180 left">比例</span>
          <span class="row_item center"
            v-for="(itemChild,indexChild) in item"
            :key="indexChild">{{itemChild.rate}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { craft } from '@/assets/js/api.js'
import { letterArr } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      companyName: window.sessionStorage.getItem('full_name'),
      qrCodeUrl: '',
      craftDetail: {
        product_info: {
          component: [],
          category_info: {},
          size: [],
          materials: []
        },
        draft_method: {
          GL: []
        }
      },
      warp_data: {
        material_data: [],
        assist_material: [],
        warp_rank: [[], [], [], [], [], []],
        merge_data: [],
        warp_rank_back: [[], [], [], [], [], []],
        merge_data_back: [],
        length_is: 0,
        length_back: 0
      },
      weft_data: {
        material_data: [],
        assist_material: [],
        weft_rank: [[], [], [], [], [], []],
        merge_data: [],
        weft_rank_back: [[], [], [], [], [], []],
        merge_data_back: [],
        length_is: 0,
        length_back: 0
      },
      coefficient: [],
      warpInfo: {
        color_data: '',
        weft: null, // 总头纹
        side_id: null, // 边形
        width: null, // 整经门幅
        machine_id: null, // 机型
        reed: null, // 筘号
        reed_method: null, // 穿筘法
        reed_width: null, // 筘幅
        reed_width_data: null, // 筘幅说明
        sum_up: null, // 综页
        drafting_method: null // 穿综法
        // additional_data: null// 穿综法备注
      },
      weftInfo: {
        color_data: '',
        organization_id: null, // 组织法
        peifu: null, // 胚服
        peifu_data: null, // 胚幅说明
        weimi: null, // 纬密
        shangchiya: null, // 上齿牙
        xiachiya: null, // 下齿牙
        neichang: null, // 内长
        rangwei: null, // 让位
        total: null // 总计
      },
      PMFlag: 'normal',
      PM: [{
        value: '', // 循环的值，用逗号分割
        repeat: '', // 循环次数
        number: '', // 纱线根数
        GL: '', // 高级穿综法选纹版图
        total: 0, // 高级穿综法统计值
        children: [{
          number: '',
          children: [{
            value: '',
            repeat: ''
          }]
        }]
      }],
      remarkPM: '',
      alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      romanNum: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
      // GL:graphic layout 纹版图缩写
      GL: [[['', '', '']]],
      GLFlag: 'normal',
      canvasHeight: 0, // 图像高度
      warpCanvas: [], // 经纬向绘图数据
      weftCanvas: [],
      warpCanvasBack: [], // 反面
      weftCanvasBack: [],
      color_data: [],
      colorWeight: {
        warp: [],
        weft: []
      },
      zhujia_info: [],
      letterArr: letterArr,
      bottomArr: [[]],
      weftCmp: ''
    }
  },
  methods: {
    // 给合并规则里添加value
    pushValue (item, key, index) {
      let valueArr = item[key] // value来源数组
      item[index].forEach(val => {
        val.value = this.$clone(valueArr[val.row]).splice(val.col, val.colspan).filter(num => num)[0]
      })
      this.changeMergeMethod(item[index], Math.ceil(item[key][0].length / 16)) // 处理合并规则
    },
    // 对合并规则进行处理
    changeMergeMethod (item, key) {
      for (let i = 1; i < key; i++) {
        item.forEach(val => {
          if (i * 16 > val.col && (val.col + val.colspan - 1) >= i * 16) {
            item.push({
              col: i * 16,
              colspan: val.colspan - (i * 16 - val.col),
              removed: val.removed,
              row: val.row,
              rowspan: val.rowspan,
              split: true,
              noLeftJianTou: true,
              value: val.value
            })
            val.colspan = i * 16 - val.col
            val.split = true
            if (!val.noLeftJianTou) {
              val.noRightJianTou = true
            } else {
              val.noLeftJianTou = false
              val.noJianTou = true
            }
          }
          // console.log(JSON.stringify(val))
        })
      }
    },
    // 合并单元格
    mergeSpan (item, index, key, mergeIndex, callBack, keys) {
      let mergeALLMathod = item[mergeIndex]
      let mergeMethod = mergeALLMathod.filter(val => Number(val.row) === Number(index)) // 合并规则
      let isMergeData = callBack ? callBack(item[key][index], keys, true) : item[key][index] // 需要合并的数据
      let mergeData = [] // 合并后的数据
      for (let ind = 0; ind < isMergeData.length; ind++) {
        let val = isMergeData[ind]
        let mergeItem = mergeMethod.find(mergeItem => ind >= (mergeItem.col - (keys || 0) * 16) && ((mergeItem.col - (keys || 0) * 16) + mergeItem.colspan - 1) >= ind)
        if (mergeItem) {
          // console.log(JSON.stringify(mergeItem))
          mergeData.push({ value: mergeItem.value, colspan: mergeItem.colspan, isSplit: mergeItem.split, noLeftJianTou: mergeItem.noLeftJianTou, noRightJianTou: mergeItem.noRightJianTou, noJianTou: mergeItem.noJianTou })
          ind += (mergeItem.colspan - 1)
        } else {
          mergeData.push({ value: val, colspan: 1 })
        }
      }
      return mergeData
    },
    // 返回字号
    returnSize (str) {
      let num = 0
      str.split('').forEach(item => {
        num += (item.charCodeAt(0) > 255 ? 2 : 1)
      })
      if (num < 7) {
        return '18px'
      } else if (num < 9) {
        return '16px'
      } else if (num < 11) {
        return '14px'
      } else if (num < 13) {
        return '12px'
      } else {
        return '10px'
      }
    },
    // 拆分单元格
    splitData (item, index) {
      return this.$clone(item).splice(index * 16, 16)
    },
    // 展平合并信息
    getFlatTable (table, type, merge) {
      let tableArr = table
      let mergeTable = this[type][merge]
      let firstMerge = this.getMergeInfo(mergeTable, 3, tableArr[0].length)
      let secondMerge = this.getMergeInfo(mergeTable, 4, tableArr[0].length)
      // 处理合并项的合并信息
      let firstArr = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < (item.col + item.colspan); i++) {
          temporaryStorage.push({
            order: tableArr[0][i],
            color: tableArr[1][i],
            number: tableArr[2][i]
            // GLorPM: tableArr[5][i]
          })
        }
        let forNum = this.getSpecial(tableArr[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === (forNum.number - 1)) {
            realStorage = temporaryStorage.filter((item) => {
              return item.order < forNum.start || item.order > forNum.end
            })
          }
          firstArr.push(realStorage)
        }
      })
      let secondArr = []
      secondMerge.forEach((item) => {
        let temporaryStorage = firstArr.filter((itemFilter) => {
          return itemFilter[0].order > item.col && itemFilter[0].order <= (item.col + item.colspan)
        })
        let forNum = this.getSpecial(tableArr[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === (forNum.number - 1)) {
            realStorage = temporaryStorage.filter((item) => {
              let flag = true
              item.forEach((itemChild) => {
                if (itemChild.order >= forNum.start && itemChild.order <= forNum.end) {
                  flag = false
                }
              })
              return flag
            })
          }
          secondArr.push(realStorage)
          if (forNum.state === 'special') {
            secondArr.push(this.$clone(realStorage).reverse()) // 注意reverse会改变原数组
          }
        }
      })
      // 多维数组展平
      let flattenArr = this.mergeArray(secondArr)
      return flattenArr
    },
    // 合并项信息处理
    getMergeInfo (mergeTable, row, length) {
      let mergeArr = mergeTable.filter(item => item.row === row).sort((a, b) => { return a.col - b.col })
      let saveMerge = []
      let col = 0
      let mergeIndex = 0
      while (col < length) {
        if (mergeArr[mergeIndex]) {
          if (col < mergeArr[mergeIndex].col) {
            for (let i = 0; i < mergeArr[mergeIndex].col - col; i++) {
              saveMerge.push({
                col: i + col,
                colspan: 1,
                row: row
              })
            }
            col = mergeArr[mergeIndex].col
          } else {
            saveMerge.push({
              col: mergeArr[mergeIndex].col,
              colspan: mergeArr[mergeIndex].colspan,
              row: row
            })
            col = mergeArr[mergeIndex].col + mergeArr[mergeIndex].colspan
            mergeIndex++
          }
        } else {
          for (let i = col; i < length; i++) {
            saveMerge.push({
              col: i,
              colspan: 1,
              row: row
            })
          }
          col = length
        }
      }
      return saveMerge
    },
    // 合并数组
    mergeArray (arr, saveArr) {
      let array = saveArr || []
      arr.forEach((item) => {
        if (Array.isArray(item)) {
          this.mergeArray(item, array)
        } else {
          array.push(item)
        }
      })
      return array
    },
    // 获取特殊数据,用于处理 乘以[n]遍，最后一遍去掉[x]列到[y]列
    getSpecial (info) {
      if (Number(info)) {
        return {
          number: Number(info)
        }
      }
      if (info === '倒一遍') {
        return {
          number: 1,
          state: 'special'
        }
      }
      // 只解析上列字符串，别的不管
      let arr = info.split(']')
      return {
        number: arr[0].split('[')[1],
        start: arr[1].split('[')[1],
        end: arr[2].split('[')[1]
      }
    },
    init (data) {
      this.warpInfo = data.warp_data
      this.weftInfo = data.weft_data
      this.weftCmp = this.warpInfo.weight_calculate_formula
      this.GL = data.draft_method.GL
      this.GLFlag = data.draft_method.GLFlag
      this.PM = data.draft_method.PM
      this.PMFlag = data.draft_method.PMFlag
      this.remarkPM = data.draft_method.desc
      this.canvasHeight = (this.weftInfo.neichang + this.weftInfo.rangwei) / (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * 400 * 4
      // 展平合并信息
      let warpTable = this.getFlatTable(this.warpInfo.warp_rank, 'warpInfo', 'merge_data').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'Ⅰ'
        }
        return item
      })
      let weftTable = this.getFlatTable(this.weftInfo.weft_rank, 'weftInfo', 'merge_data').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'A'
        }
        return item
      })
      let warpTableBack = this.getFlatTable(this.warpInfo.warp_rank_back, 'warpInfo', 'merge_data_back').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'Ⅰ'
        }
        return item
      })
      let weftTableBack = this.getFlatTable(this.weftInfo.weft_rank_back, 'weftInfo', 'merge_data_back').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'A'
        }
        return item
      })
      // 将展开的合并信息结合穿综和纹版信息
      let warpGetPMNum = []
      let weftGetGLNum = []
      let warpGetPMNumBack = []
      let weftGetGLNumBack = []
      warpTable.forEach((item) => {
        let len = warpGetPMNum.length
        if (len > 0) {
          if (warpGetPMNum[len - 1].PM === item.GLorPM) {
            warpGetPMNum[len - 1].number += parseInt(item.number)
          } else {
            warpGetPMNum.push({
              PM: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          warpGetPMNum.push({
            PM: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      weftTable.forEach((item) => {
        let len = weftGetGLNum.length
        if (len > 0) {
          if (weftGetGLNum[len - 1].GL === item.GLorPM) {
            weftGetGLNum[len - 1].number += parseInt(item.number)
          } else {
            weftGetGLNum.push({
              GL: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          weftGetGLNum.push({
            GL: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      warpTableBack.forEach((item) => {
        let len = warpGetPMNumBack.length
        if (len > 0) {
          if (warpGetPMNumBack[len - 1].PM === item.GLorPM) {
            warpGetPMNumBack[len - 1].number += parseInt(item.number)
          } else {
            warpGetPMNumBack.push({
              PM: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          warpGetPMNumBack.push({
            PM: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      weftTableBack.forEach((item) => {
        let len = weftGetGLNumBack.length
        if (len > 0) {
          if (weftGetGLNumBack[len - 1].GL === item.GLorPM) {
            weftGetGLNumBack[len - 1].number += parseInt(item.number)
          } else {
            weftGetGLNumBack.push({
              GL: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          weftGetGLNumBack.push({
            GL: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      let warpGetPM = []
      let weftGetGL = []
      let warpGetPMBack = []
      let weftGetGLBack = []
      warpGetPMNum.forEach((item) => {
        // 高级穿综
        if (this.PMFlag === 'complex') {
          let PM = this.PM[this.romanNum.indexOf(item.PM)]
          let PMFlatArr = []
          PM.children.forEach((itemPM) => {
            let PMVal = []
            itemPM.children.forEach((itemChildren) => {
              for (let i = 0; i < parseInt(itemChildren.repeat); i++) {
                PMVal = PMVal.concat(itemChildren.value.split(','))
              }
            })
            let times = parseInt(itemPM.number / PMVal.length) // 循环次数
            let remainder = itemPM.number % PMVal.length // 取余数
            for (let i = 0; i < times; i++) {
              PMFlatArr = PMFlatArr.concat(PMVal)
            }
            PMFlatArr = PMFlatArr.concat(PMVal.filter((item, index) => index < remainder))
          })
          let times = parseInt(item.number / PMFlatArr.length)
          let remainder = item.number % PMFlatArr.length
          for (let i = 0; i < times; i++) {
            warpGetPM = warpGetPM.concat(PMFlatArr)
          }
          warpGetPM = warpGetPM.concat(PMFlatArr.filter((item, index) => index < remainder))
        }
      })
      // 穿综法普通逻辑独立
      if (this.PMFlag === 'normal') {
        this.PM.forEach((item) => {
          let PMArr = item.value.split(',')
          let times = parseInt(item.number / PMArr.length)
          let remainder = item.number % PMArr.length
          for (let i = 0; i < times; i++) {
            warpGetPM = warpGetPM.concat(PMArr)
          }
          warpGetPM = warpGetPM.concat(PMArr.filter((item, index) => index < remainder))
        })
      }
      weftGetGLNum.forEach((item) => {
        let GL = this.mergeArray(this.GL[this.alphabet.indexOf(item.GL)]).filter((item) => item) // 剔除null
        let times = parseInt(item.number / GL.length)
        let remainder = item.number % GL.length
        for (let i = 0; i < times; i++) {
          weftGetGL = weftGetGL.concat(GL)
        }
        weftGetGL = weftGetGL.concat(GL.filter((item, index) => index < remainder))
      })
      warpGetPMNumBack.forEach((item) => {
        // 高级穿综
        if (this.PMFlag === 'complex') {
          let PM = this.PM[this.romanNum.indexOf(item.PM)]
          let PMFlatArr = []
          PM.children.forEach((itemPM) => {
            let PMVal = []
            itemPM.children.forEach((itemChildren) => {
              for (let i = 0; i < parseInt(itemChildren.repeat); i++) {
                PMVal = PMVal.concat(itemChildren.value.split(','))
              }
            })
            let times = parseInt(itemPM.number / PMVal.length) // 循环次数
            let remainder = itemPM.number % PMVal.length // 取余数
            for (let i = 0; i < times; i++) {
              PMFlatArr = PMFlatArr.concat(PMVal)
            }
            PMFlatArr = PMFlatArr.concat(PMVal.filter((item, index) => index < remainder))
          })
          let times = parseInt(item.number / PMFlatArr.length)
          let remainder = item.number % PMFlatArr.length
          for (let i = 0; i < times; i++) {
            warpGetPMBack = warpGetPMBack.concat(PMFlatArr)
          }
          warpGetPMBack = warpGetPMBack.concat(PMFlatArr.filter((item, index) => index < remainder))
        }
      })
      // 穿综法普通逻辑独立 -背面
      if (this.PMFlag === 'normal') {
        this.PM.forEach((item) => {
          let PMArr = item.value.split(',')
          let times = parseInt(item.number / PMArr.length)
          let remainder = item.number % PMArr.length
          for (let i = 0; i < times; i++) {
            warpGetPMBack = warpGetPMBack.concat(PMArr)
          }
          warpGetPMBack = warpGetPMBack.concat(PMArr.filter((item, index) => index < remainder))
        })
      }
      weftGetGLNumBack.forEach((item) => {
        let GL = this.mergeArray(this.GL[this.alphabet.indexOf(item.GL)]).filter((item) => item) // 剔除null
        let times = parseInt(item.number / GL.length)
        let remainder = item.number % GL.length
        for (let i = 0; i < times; i++) {
          weftGetGLBack = weftGetGLBack.concat(GL)
        }
        weftGetGLBack = weftGetGLBack.concat(GL.filter((item, index) => index < remainder))
      })
      // 获取画图数据
      let warpCanvas = []
      let weftCanvas = []
      let warpCanvasBack = []
      let weftCanvasBack = []
      warpTable.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvas.push({
            color: item.color,
            PM: warpGetPM[warpCanvas.length]
          })
        }
      })
      weftTable.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvas.push({
            color: item.color,
            GL: weftGetGL[weftCanvas.length]
          })
        }
      })
      warpTableBack.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvasBack.push({
            color: item.color,
            PM: warpGetPMBack[warpCanvasBack.length]
          })
        }
      })
      weftTableBack.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvasBack.push({
            color: item.color,
            GL: weftGetGLBack[weftCanvasBack.length]
          })
        }
      })
      // 保存下画图数据，方便在切换配色的时候使用
      this.warpCanvas = warpCanvas
      this.weftCanvas = weftCanvas
      if (this.warpInfo.back_status === 1 && this.weftInfo.back_status === 1) {
        this.warpCanvasBack = warpCanvasBack
        this.weftCanvasBack = weftCanvasBack
      } else if (this.warpInfo.back_status === 1 && this.weftInfo.back_status === 0) {
        this.warpCanvasBack = warpCanvasBack
        this.weftCanvasBack = weftCanvas
      } else if (this.warpInfo.back_status === 0 && this.weftInfo.back_status === 1) {
        this.warpCanvasBack = warpCanvas
        this.weftCanvasBack = weftCanvasBack
      }
    },
    // 换颜色
    getColour (index) {
      setTimeout(() => {
        let warpColor = this.warpInfo.color_data[index].color_scheme
        let weftColor = this.weftInfo.color_data[index].color_scheme
        let canvasMatrix = []
        let canvasMatrixBack = []
        let warpCK = []
        this.warpInfo.material_data.forEach((item) => {
          item.apply.forEach((itemChild) => {
            warpCK[itemChild] = this.coefficient.find((itemFind) => itemFind.name === item.material_name).chuankou ? 1 / this.coefficient.find((itemFind) => itemFind.name === item.material_name).chuankou : 1
          })
        })
        let warpWidthPJ = 600 / this.warpCanvas.reduce((total, cur) => {
          return total + Number(warpCK[cur.color])
        }, 0) * 4 // 经向平均长度
        let weftWidth = this.canvasHeight / this.weftCanvas.length
        this.warpCanvas.reduce((totalWarp, itemWarp) => {
          let warpWidth = warpWidthPJ * warpCK[itemWarp.color]// 重新计算经向，用穿筘法
          let reverseWeft = [...this.weftCanvas].reverse() // 纬向要反着画,我也不知道为啥,注意reverse会改变原数组,所以修改下指向
          reverseWeft.reduce((totalWeft, itemWeft) => {
            canvasMatrix.push({
              x: totalWarp,
              y: totalWeft,
              width: warpWidth,
              height: weftWidth,
              color: itemWeft.GL.replace(/，/g, ',').split(',').find((item) => item === itemWarp.PM) ? warpColor[itemWarp.color].value : weftColor[itemWeft.color].value
            })
            return totalWeft + weftWidth
          }, 0)
          return totalWarp + warpWidth
        }, 0)
        this.warpCanvasBack.reduce((totalWarp, itemWarp) => {
          let warpWidth = warpWidthPJ * warpCK[itemWarp.color]// 重新计算经向，用穿筘法
          let reverseWeftBack = [...this.weftCanvasBack].reverse() // 纬向要反着画,我也不知道为啥,注意reverse会改变原数组,所以修改下指向
          reverseWeftBack.reverse().reduce((totalWeft, itemWeft) => {
            canvasMatrixBack.push({
              x: totalWarp,
              y: totalWeft,
              width: warpWidth,
              height: weftWidth,
              color: itemWeft.GL.replace(/，/g, ',').split(',').find((item) => item === itemWarp.PM) ? warpColor[itemWarp.color].value : weftColor[itemWeft.color].value
            })
            return totalWeft + weftWidth
          }, 0)
          return totalWarp + warpWidth
        }, 0)
        let dom = this.$refs.myCanvas
        let ctx = dom.getContext('2d')
        ctx.beginPath()
        ctx.clearRect(0, 0, 2400, this.canvasHeight)
        canvasMatrix.forEach((item) => {
          ctx.fillStyle = item.color
          ctx.fillRect(item.x, item.y, item.width, item.height)
        })
        let domBack = this.$refs.myCanvasBack
        let ctxBack = domBack.getContext('2d')
        ctxBack.beginPath()
        ctxBack.clearRect(0, 0, 2400, this.canvasHeight)
        canvasMatrixBack.forEach((item) => {
          ctxBack.fillStyle = item.color
          ctxBack.fillRect(item.x, item.y, item.width, item.height)
        })
        let img = this.$refs.img
        img.src = dom.toDataURL() // canvas转图片
        let imgBack = this.$refs.imgBack
        imgBack.src = domBack.toDataURL()
      }, 100)
    }
  },
  created () {
    craft.getByProduct({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    }).then(res => {
      if (res.data.stauts !== false) {
        let data = null
        data = res.data.data.find(item => item.id === this.$route.params.craftId)
        if (!data) {
          this.$message('未找到工艺单ID为' + this.$route.params.craftId + '的工艺单')
          return
        }
        data.warp_data.merge_data = JSON.parse(data.warp_data.merge_data)
        data.warp_data.merge_data_back = JSON.parse(data.warp_data.merge_data_back)
        data.warp_data.warp_rank = JSON.parse(data.warp_data.warp_rank)
        data.warp_data.warp_rank_back = JSON.parse(data.warp_data.warp_rank_back)
        data.weft_data.merge_data = JSON.parse(data.weft_data.merge_data)
        data.weft_data.merge_data_back = JSON.parse(data.weft_data.merge_data_back)
        data.weft_data.weft_rank = JSON.parse(data.weft_data.weft_rank)
        data.weft_data.weft_rank_back = JSON.parse(data.weft_data.weft_rank_back)
        this.craftDetail = this.$clone(data)
        this.warp_data = this.$clone(data.warp_data)
        this.warp_data.length_is = this.warp_data.warp_rank[0].length
        this.warp_data.length_back = this.warp_data.warp_rank_back[0].length
        this.weft_data = this.$clone(data.weft_data)
        this.weft_data.length_is = this.weft_data.weft_rank[0].length
        this.weft_data.length_back = this.weft_data.weft_rank_back[0].length
        this.coefficient = data.yarn_coefficient
        this.pushValue(this.warp_data, 'warp_rank', 'merge_data') // 给合并规则里附上value
        this.pushValue(this.warp_data, 'warp_rank_back', 'merge_data_back')// 给合并规则里附上value
        this.pushValue(this.weft_data, 'weft_rank', 'merge_data')// 给合并规则里附上value
        this.pushValue(this.weft_data, 'weft_rank_back', 'merge_data_back')// 给合并规则里附上value
        let colorData = []
        this.warp_data.color_data.forEach(item => {
          let colorFlag = colorData.find(key => key.product_color === item.product_color)
          if (!colorFlag) {
            colorData.push({
              product_color: item.product_color,
              color_scheme: {
                warp: item.color_scheme,
                weft: []
              }
            })
          } else {
            colorFlag.color_scheme.warp = item.color_scheme
          }
        })
        this.weft_data.color_data.forEach(item => {
          let colorFlag = colorData.find(key => key.product_color === item.product_color)
          if (!colorFlag) {
            colorData.push({
              product_color: item.product_color,
              color_scheme: {
                warp: [],
                weft: item.color_scheme
              }
            })
          } else {
            colorFlag.color_scheme.weft = item.color_scheme
          }
        })
        this.color_data = colorData
        // 初始化主夹信息
        this.warp_data.material_data.forEach(item => {
          item.apply.forEach(val => {
            if (this.zhujia_info.indexOf(val) === -1) {
              this.zhujia_info.push(val)
            }
          })
        })
        this.weft_data.material_data.forEach(item => {
          item.apply.forEach(val => {
            if (this.zhujia_info.indexOf(val) === -1) {
              this.zhujia_info.push(val)
            }
          })
        })
        let colorNumber = {
          warp: [],
          weft: []
        }
        // 展平合并信息
        let warpTable = this.getFlatTable(this.warp_data.warp_rank, 'warp_data', 'merge_data').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'Ⅰ'
          }
          return item
        })
        let weftTable = this.getFlatTable(this.weft_data.weft_rank, 'weft_data', 'merge_data').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'A'
          }
          return item
        })
        let warpTableBack = this.getFlatTable(this.warp_data.warp_rank_back, 'warp_data', 'merge_data_back').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'Ⅰ'
          }
          return item
        })
        let weftTableBack = this.getFlatTable(this.weft_data.weft_rank_back, 'weft_data', 'merge_data_back').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'A'
          }
          return item
        })
        // 将展平的数据用于克重计算
        warpTable.forEach((item) => {
          colorNumber.warp[item.color] = colorNumber.warp[item.color] ? colorNumber.warp[item.color] : 0
          colorNumber.warp[item.color] += Number(item.number)
        })
        weftTable.forEach((item) => {
          colorNumber.weft[item.color] = colorNumber.weft[item.color] ? colorNumber.weft[item.color] : 0
          colorNumber.weft[item.color] += Number(item.number)
        })
        warpTableBack.forEach((item) => {
          colorNumber.warp[item.color] = colorNumber.warp[item.color] ? colorNumber.warp[item.color] : 0
          colorNumber.warp[item.color] += Number(item.number)
        })
        weftTableBack.forEach((item) => {
          colorNumber.weft[item.color] = colorNumber.weft[item.color] ? colorNumber.weft[item.color] : 0
          colorNumber.weft[item.color] += Number(item.number)
        })
        this.warp_data.material_data.forEach((item) => {
          item.apply.forEach((itemChild) => {
            this.colorWeight.warp[itemChild] = {
              weight: this.$toFixed(colorNumber.warp[itemChild] * (this.weft_data.neichang + this.weft_data.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100),
              material_name: item.material_name,
              colorName: this.color_data[this.$route.params.colorIndex].color_scheme.warp[itemChild].name,
              colorValue: this.color_data[this.$route.params.colorIndex].color_scheme.warp[itemChild].value,
              warpOrWeft: '经' + this.letterArr[itemChild]
            }
          })
        })
        this.weft_data.material_data.forEach((item) => {
          item.apply.forEach((itemChild) => {
            this.colorWeight.weft[itemChild] = {
              weight: this.$toFixed(colorNumber.weft[itemChild] * this.warp_data.reed_width * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100),
              material_name: item.material_name,
              colorName: this.color_data[this.$route.params.colorIndex].color_scheme.weft[itemChild].name,
              colorValue: this.color_data[this.$route.params.colorIndex].color_scheme.weft[itemChild].value,
              warpOrWeft: '纬' + this.letterArr[itemChild]
            }
          })
        })
        let bottomIndex = 0
        this.colorWeight.warp.forEach((item, index) => {
          if (this.bottomArr[bottomIndex].length < 7) {
            this.bottomArr[bottomIndex].push(item)
          } else {
            bottomIndex++
            this.bottomArr[bottomIndex] = [item]
          }
        })
        this.colorWeight.weft.forEach((item, index) => {
          if (this.bottomArr[bottomIndex].length < 7) {
            this.bottomArr[bottomIndex].push(item)
          } else {
            bottomIndex++
            this.bottomArr[bottomIndex] = [item]
          }
        })
        let allWeigth = 0
        this.bottomArr.forEach((item) => {
          item.forEach((itemChild) => {
            itemChild.weight = itemChild.weight ? itemChild.weight : 0
            allWeigth += itemChild.weight
          })
        })
        this.bottomArr.forEach((item) => {
          item.forEach((itemChild) => {
            itemChild.rate = this.$toFixed(itemChild.weight / allWeigth * 100) + '%'
          })
        })
        this.bottomArr.forEach((item) => {
          item.forEach((itemChild) => {
            allWeigth += (itemChild.weight ? itemChild.weight : 0)
          })
        })
        while (this.bottomArr[bottomIndex].length < 7) {
          this.bottomArr[bottomIndex].push({
            weight: '',
            material_name: '',
            colorName: '',
            colorValue: '',
            warpOrWeft: ''
          })
        }
        this.init(this.$clone(data))
        this.getColour(this.$route.params.colorIndex)
        // setTimeout(() => {
        //   window.print()
        // }, 1000)
      }
    })
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
    filterType (item) {
      return item.category_info ? [item.category_info.product_category, item.type_name, item.style_name, item.flower_id].join('/') : '/'
    },
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].component_name) {
        arr.forEach((item) => {
          str += item.component_name + item.number + '%' + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    },
    filterMaterialClass (item) {
      let arr = []
      item.forEach(value => {
        if (value !== 0) {
          arr.push('夹' + value)
        } else {
          arr.push('主')
        }
      })
      return arr.join('/')
    },
    filterThroughMethod (items) {
      let str = ''
      let romanNum = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ']
      if (items.PMFlag === 'normal') {
        items.PM.forEach((item, key) => {
          str += romanNum[key] + '【' + item.number + '根（' + item.value + '）' + '】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (key !== items.PM.length - 1 ? '。' : '')
        })
      } else if (items.PMFlag === 'complex') {
        items.PM.forEach((item, key) => {
          str += romanNum[key]
          item.children.forEach((value, index) => {
            str += ('【' + value.number + '根')
            value.children.forEach((val, ind) => {
              str += '（' + val.value + '）' + (val.repeat && val.repeat !== 1 ? 'x' + val.repeat + '遍' : '') + (ind !== value.children.length - 1 ? '，' : '')
            })
            str += ('】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (index !== item.children.length - 1 ? '。' : ''))
          })
        })
      }
      return str
    }
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
