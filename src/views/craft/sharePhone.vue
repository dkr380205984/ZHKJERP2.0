<template>
  <div id="sharePhone"
    class="phoneCtn">
    <div class="module">
      <div class="title">基本信息</div>
      <div class="content">
        <div class="line">
          <div class="label">工艺单编号：</div>
          <div class="text">{{productInfo.craft_code}}</div>
        </div>
        <div class="line">
          <div class="label">创建人：</div>
          <div class="text">{{productInfo.user_name}}</div>
        </div>
        <div class="line">
          <div class="label">创建时间：</div>
          <div class="text">{{productInfo.create_time}}</div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="title">产品信息</div>
      <div class="content">
        <div class="line">
          <div class="label">产品编号：</div>
          <div class="text">{{productInfo.product_code}}</div>
        </div>
        <div class="line">
          <div class="label">产品名称：</div>
          <div class="text">{{productInfo.title || '无'}}</div>
        </div>
        <div class="line">
          <div class="label">成份信息：</div>
          <div class="text">{{productInfo.component|filterMaterials}}</div>
        </div>
        <div class="line"
          v-for="(item,index) in productInfo.size"
          :key="index">
          <div class="label">尺码净重：</div>
          <div class="text">{{item.size_name+ ' ' + item.size_info + 'cm ' + ' ' +item.weight + 'g'}}</div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="title">经向原料信息</div>
      <div class="content">
        <div class="line">
          <div class="label">主要原料：</div>
          <div class="text">{{yarn.yarnWarp.material_name}}</div>
        </div>
        <div class="colorCtn">
          <div class="label">主料配色：</div>
          <div class="colorOnce"
            v-for="(item,index) in yarn.yarnWarp.apply"
            :key="index">
            <div class="colorBox"
              style="background:#ccc">{{(filterMethods(item))}}</div>
            <div class="colorName">{{colorWeight.warp[item]==='NaN'?'0g':colorWeight.warp[item] + 'g'}}</div>
          </div>
        </div>
        <div v-for="(item,index) in yarn.yarnOtherWarp"
          :key="index">
          <div class="line">
            <div class="label">次要原料：</div>
            <div class="text">{{item.material_name}}</div>
          </div>
          <div class="colorCtn">
            <div class="label">次料配色：</div>
            <div class="colorOnce"
              v-for="(item,index) in item.apply"
              :key="index">
              <div class="colorBox"
                style="background:#ccc">{{(filterMethods(item))}}</div>
              <div class="colorName">{{colorWeight.warp[item]==='NaN'?'0g':colorWeight.warp[item] + 'g'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="title">经向配色信息</div>
      <div class="content">
        <div class="colorCtn"
          v-for="(item,index) in warpInfo.color_data"
          :key="index">
          <div class="label">{{item.product_color}}：</div>
          <div class="colorOnce"
            v-for="(itemColor,indexColor) in item.color_scheme"
            :key="indexColor"
            @click="getChangeColor(itemColor,indexColor,'warp',index)">
            <div class="colorBox"
              :style="{'background':itemColor.value}">{{(filterMethods(indexColor))}}</div>
            <div class="colorName">{{itemColor.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="title">纬向原料信息</div>
      <div class="content">
        <div class="line">
          <div class="label">主要原料：</div>
          <div class="text">{{yarn.yarnWeft.material_name}}</div>
        </div>
        <div class="colorCtn">
          <div class="label">主料配色：</div>
          <div class="colorOnce"
            v-for="(item,index) in yarn.yarnWeft.apply"
            :key="index">
            <div class="colorBox"
              style="background:#ccc">{{(filterMethods(item))}}</div>
            <div class="colorName">{{colorWeight.weft[item]==='NaN'?'0g':colorWeight.weft[item] + 'g'}}</div>
          </div>
        </div>
        <div v-for="(item,index) in yarn.yarnOtherWeft"
          :key="index">
          <div class="line">
            <div class="label">次要原料：</div>
            <div class="text">{{item.material_name}}</div>
          </div>
          <div class="colorCtn">
            <div class="label">次料配色：</div>
            <div class="colorOnce"
              v-for="(item,index) in item.apply"
              :key="index">
              <div class="colorBox"
                style="background:#ccc">{{(filterMethods(item))}}</div>
              <div class="colorName">{{colorWeight.weft[item]==='NaN'?'0g':colorWeight.weft[item] + 'g'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="title">纬向配色信息</div>
      <div class="content">
        <div class="colorCtn"
          v-for="(item,index) in weftInfo.color_data"
          :key="index">
          <div class="label">{{item.product_color}}：</div>
          <div class="colorOnce"
            v-for="(itemColor,indexColor) in item.color_scheme"
            :key="indexColor"
            @click="getChangeColor(itemColor,indexColor,'weft',index)">
            <div class="colorBox"
              :style="{'background':itemColor.value}">{{(filterMethods(indexColor))}}</div>
            <div class="colorName">{{itemColor.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出框，搜索颜色 -->
    <div v-show="colorFlag"
      class="popup">
      <div class="searchCtn">
        <input v-model="searchValue"
          class="searchInput"
          placeholder="请输入你想搜索的颜色名称/潘通色号"
          @change="searchColor" />
        <i class="el-icon-search"
          @click="searchColor"></i>
      </div>
      <div class="resultCtn">
        <div class="line">
          <div class="content">
            <div class="colorCtn">
              <div class="label">替换颜色：</div>
              <div class="colorOnce">
                <div class="colorBox"
                  :style="{'background':changeColor.value}">{{(filterMethods(changeColor.apply))}}</div>
                <div class="colorName">{{changeColor.name}}</div>
              </div>
            </div>
            <div class="colorCtn">
              <div class="label">已使用颜色：</div>
              <div class="colorOnce"
                v-for="(item,index) in craftColorArr"
                :key="index"
                @click="getNewColor(item)">
                <div class="colorBox"
                  :style="{'background':item.value}"></div>
                <div class="colorName">{{item.name}}</div>
              </div>
            </div>
            <div class="colorCtn"
              v-if="searchValue">
              <div class="label">搜索结果：</div>
              <div class="colorOnce"
                v-for="(item,index) in searchColorArray"
                :key="index"
                @click="getNewColor(item)">
                <div class="colorBox"
                  :style="{'background':item.value}"></div>
                <div class="colorName">{{item.name}}</div>
              </div>
              <div style="color:#ccc;line-height:20px"
                v-if="searchColorArray.length===0">暂无搜索结果</div>
            </div>
          </div>
        </div>
      </div>
      <div class="closeBtn"
        @click="colorFlag=false">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div v-show="canvasFlag"
      class="popup">
      <div class="closeBtn canvas"
        @click="canvasFlag=false">
        <i class="el-icon-close"></i>
      </div>
      <div class="canvasCtn">
        <canvas ref="myCanvas"
          style="display:none"
          :width="imageWidth*4"
          :height="!backFlag?canvasHeight:0"></canvas>
        <img ref="img"
          :style="{'height':!backFlag?canvasHeight/4 + 'px':0,'width':imageWidth + 'px'}"
          src="" />
        <!-- 反面 -->
        <canvas ref="myCanvasBack"
          style="display:none"
          :width="imageWidth*4"
          :height="backFlag?canvasHeight:0">
        </canvas>
        <img ref="imgBack"
          :style="{'height':backFlag?canvasHeight/4 + 'px':0,'width':imageWidth + 'px'}"
          src="" />
      </div>
    </div>
    <div class="bottomNav">
      <div class="btn orangeBack">提交修改方案</div>
      <div class="btn blueBack"
        v-show="warpInfo.back_status===0&&weftInfo.back_status===0"
        @click="chooseColour(false)">{{showImageLoading?'拼命加载中...':'查看效果图'}}</div>
      <div class="btn blueBack"
        v-show="warpInfo.back_status===1||weftInfo.back_status===1"
        @click="chooseColour(false)">{{showImageLoading?'拼命加载中...':'查看正面'}}</div>
      <div class="btn blueBack"
        v-show="warpInfo.back_status===1||weftInfo.back_status===1"
        @click="chooseColour(true)">{{showImageLoading?'拼命加载中...':'查看反面'}}</div>
    </div>
    <div class="popup toast"
      v-show="helpFlag">
      <div class="main">
        <div class="title">使用帮助</div>
        <div class="content">
          <p>1.提交修改方案以及查看效果图需要注册登录才能使用</p>
          <p>2.修改配色信息可以点击配色组中的小方块进行修改</p>
          <p>3.请勿重复提交修改方案！</p>
        </div>
        <div class="btnCtn">
          <div class="btn blueBack"
            @click="helpFlag = false">确认</div>
        </div>
      </div>
    </div>
    <div class="question"
      @click="helpFlag = true">使用帮助</div>
  </div>
</template>

<script>
import { craft, pantongList, yarnColor } from '@/assets/js/api'
export default {
  data () {
    return {
      showImageLoading: false,
      canvasFlag: false,
      backFlag: false,
      helpFlag: false,
      colorFlag: false,
      craftColorArr: [],
      searchColorArray: [],
      searchValue: '',
      changeColor: {
        name: '',
        value: '',
        index: '',
        type: '',
        apply: ''
      },
      productInfo: {
        product_code: '',
        type_name: '',
        flower_id: '',
        style_name: '',
        category_info: {
          product_category: '',
          name: ''
        },
        component: [],
        color: [],
        materials: [],
        create_time: '',
        user_name: '',
        size: []
      },
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
      yarn: {
        yarnWarp: {
          material_name: '',
          apply: []
        },
        yarnWeft: {
          material_name: '',
          apply: []
        },
        yarnOtherWarp: [],
        yarnOtherWeft: []
      },
      material: {
        materialWarp: [],
        materialWeft: []
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
      remarkGL: '',
      // GL:graphic layout 纹版图缩写
      GL: [[['', '', '']]],
      GLFlag: 'normal',
      GLRepeat: [[{
        start: '',
        end: '',
        repeat: ''
      }]],
      GLFuck: [[[{ value: '', mark: '' }, { value: '', mark: '' }, { value: '', mark: '' }]]], // 这个对象用于存储新的纹版图数据结构
      GLMapArr: [['']],
      GLShow: [], // 原先的纹版图复制到这里了，原先的纹版图被结合GLRepeat改造掉了
      GLXuhao: [],
      alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      romanNum: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
      canvasHeight: 0, // 图像高度
      warpCanvas: [], // 经纬向绘图数据
      weftCanvas: [],
      warpCanvasBack: [], // 反面
      weftCanvasBack: [],
      selectColour: -1, // 选择配色方案
      colorNumber: {
        warp: [],
        weft: []
      }, // 根数信息
      colorWeight: {
        warp: [],
        weft: []
      },
      weight: 0,
      coefficient: [],
      desc: '',
      ZDYMC: '',
      DSGG: '',
      DSKZ: '',
      others_info: '',
      imageWidth: 0 // 手机端屏幕宽度需要获取手机尺寸确定
    }
  },
  filters: {
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
    }
  },
  methods: {
    // backFlag 用于标记看正面还是反面
    chooseColour (backFlag) {
      this.backFlag = backFlag
      if (this.warpInfo.color_data.length === 1) {
        this.getColour(0)
      }
    },
    getNewColor (info) {
      this[this.changeColor.type + 'Info'].color_data[this.changeColor.index].color_scheme[this.changeColor.apply].name = info.name
      this[this.changeColor.type + 'Info'].color_data[this.changeColor.index].color_scheme[this.changeColor.apply].value = info.value
      this.colorFlag = false
    },
    getChangeColor (info, apply, type, index) {
      this.changeColor = {
        name: info.name,
        value: info.value,
        index: index,
        apply: apply,
        type: type
      }
      this.colorFlag = true
    },
    // 搜索颜色
    searchColor () {
      if (!this.searchValue) {
        return
      }
      Promise.all([yarnColor.list(), pantongList({
        keyword: this.searchValue
      })])
        .then((res) => {
          this.searchColorArray = res[0].data.data.filter((item) => {
            return item.name.indexOf(this.searchValue) !== -1
          }).concat(res[1].data.data).map((item) => {
            return {
              name: item.name,
              value: item.color_code
            }
          })
        })
    },
    // 获取特殊数据,用于处理 乘以[n]遍，最后一遍去掉[x]列到[y]列
    getSpecial (info) {
      if (Number(info)) {
        return {
          number: Number(info)
        }
      }
      if (info === '顺一遍倒一遍') {
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
    // 展平合并信息
    getFlatTable (table, type, merge) {
      let tableArr = JSON.parse(table)
      let mergeTable = JSON.parse(this[type][merge])
      let firstMerge = this.getMergeInfo(mergeTable, 3, tableArr[0].length)
      let secondMerge = this.getMergeInfo(mergeTable, 4, tableArr[0].length)
      // 处理合并项的合并信息
      let firstArr = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < (item.col + item.colspan); i++) {
          temporaryStorage.push({
            order: parseInt(tableArr[0][i]),
            color: tableArr[1][i],
            number: tableArr[2][i],
            GLorPM: tableArr[5][i]
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
          // 在这里倒一遍，根据py暗号state = special
          if (forNum.state === 'special') {
            secondArr.push(this.$clone(realStorage).map((item) => {
              return item.reverse()
            }).reverse()) // 注意reverse会改变原数组
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
    // 匹配主/夹名称
    filterMethods (index) {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    },
    // 换颜色
    getColour (index) {
      // this.loading = true
      this.showImageLoading = true
      this.selectColour = index
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
        let warpWidthPJ = this.imageWidth / this.warpCanvas.reduce((total, cur) => {
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
          reverseWeftBack.reduce((totalWeft, itemWeft) => {
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
        ctx.clearRect(0, 0, this.imageWidth * 4, this.canvasHeight)
        canvasMatrix.forEach((item) => {
          ctx.fillStyle = item.color
          ctx.fillRect(item.x, item.y, item.width, item.height)
        })
        let domBack = this.$refs.myCanvasBack
        let ctxBack = domBack.getContext('2d')
        ctxBack.beginPath()
        ctxBack.clearRect(0, 0, this.imageWidth * 4, this.canvasHeight)
        canvasMatrixBack.forEach((item) => {
          ctxBack.fillStyle = item.color
          ctxBack.fillRect(item.x, item.y, item.width, item.height)
        })
        let img = this.$refs.img
        img.src = dom.toDataURL() // canvas转图片
        let imgBack = this.$refs.imgBack
        imgBack.src = domBack.toDataURL()
        this.showImageLoading = false
        this.canvasFlag = true
        // this.loading = false
      }, 100)
    },
    init (data) {
      this.imgSrc = data.image
      this.selectColour = -1
      this.weight = 0
      this.ZDYMC = data.title
      this.DSGG = data.size
      this.DSKZ = data.weight
      this.others_info = data.other_info
      this.productInfo = data.product_info
      this.productInfo.craft_code = data.craft_code
      this.productInfo.user_name = data.user_name
      this.productInfo.create_time = data.create_time
      this.colorWeight = {
        warp: [],
        weft: []
      }
      this.colorNumber = {
        warp: [],
        weft: []
      }
      this.warpInfo = data.warp_data
      this.weftInfo = data.weft_data
      this.warpInfo.color_data.forEach((item) => {
        item.color_scheme.forEach((itemColor) => {
          if (!this.craftColorArr.find((itemFind) => itemFind.name === itemColor.name && itemFind.value === itemColor.value)) {
            this.craftColorArr.push(itemColor)
          }
        })
      })
      this.weftCmp = this.warpInfo.weight_calculate_formula
      this.yarn.yarnWarp = this.warpInfo.material_data.find((item) => item.type_material === 1)
      this.yarn.yarnWeft = this.weftInfo.material_data.find((item) => item.type_material === 1)
      this.yarn.yarnOtherWarp = this.warpInfo.material_data.filter((item) => item.type_material === 2)
      this.yarn.yarnOtherWeft = this.weftInfo.material_data.filter((item) => item.type_material === 2)
      this.material.materialWarp = this.warpInfo.assist_material
      this.material.materialWeft = this.weftInfo.assist_material
      this.coefficient = data.yarn_coefficient
      this.desc = data.desc
      // this.tableData.warp.data = JSON.parse(this.warpInfo.warp_rank).map((item, index) => {
      //   return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      // })
      // this.tableData.weft.data = JSON.parse(this.weftInfo.weft_rank).map((item, index) => {
      //   return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      // })
      // this.tableData.warpBack.data = JSON.parse(this.warpInfo.warp_rank_back).map((item, index) => {
      //   return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      // })
      // this.tableData.weftBack.data = JSON.parse(this.weftInfo.weft_rank_back).map((item, index) => {
      //   return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      // })
      // this.tableData.warp.mergeCells = JSON.parse(this.warpInfo.merge_data)
      // this.tableData.weft.mergeCells = JSON.parse(this.weftInfo.merge_data)
      // this.tableData.warpBack.mergeCells = JSON.parse(this.warpInfo.merge_data_back)
      // this.tableData.weftBack.mergeCells = JSON.parse(this.weftInfo.merge_data_back)
      this.GLFuck = this.$clone(data.draft_method.GL).map((item) => {
        return item.map((item2) => {
          return item2.map((item3) => {
            if (typeof (item3) === 'string') {
              return {
                value: item3,
                mark: ''
              }
            } else if (!item3) {
              return {
                value: '',
                mark: ''
              }
            } else {
              return item3
            }
          })
        })
      })
      this.GLShow = this.$clone(data.draft_method.GL).map((item) => {
        return item.map((item2) => {
          return item2.map((item3) => {
            if (typeof (item3) === 'string') {
              return item3
            } else if (!item3) {
              return ''
            } else {
              return item3.value
            }
          })
        })
      })
      this.GLFlag = data.draft_method.GLFlag
      this.PM = data.draft_method.PM
      this.PMFlag = data.draft_method.PMFlag
      this.remarkPM = data.draft_method.desc
      this.remarkGL = data.weft_data.contract_ratio
      this.GLRepeat = this.$clone(data.draft_method.GLRepeat) || []
      this.GLRepeat.forEach((item) => {
        let addNum = 0
        item.forEach((itemChild) => {
          itemChild.start += addNum
          itemChild.end += addNum
          addNum += (itemChild.end - itemChild.start + 1) * (itemChild.repeat - 1)
        })
      })
      // 将纹版图循环补充完整
      // 例如1-2循环2次，5-6循环两次，补充3-4循环1次进去
      let GLRepeatComplete = []
      if (this.GLRepeat.length > 0 && !this.GLRepeat[0][0].start) {
        this.GLRepeat = []
      }
      this.GLRepeat.forEach((item, index) => {
        GLRepeatComplete.push([])
        let start = 1
        item.forEach((itemChild) => {
          if (itemChild.start - start > 0) {
            GLRepeatComplete[index].push({
              start: start,
              end: itemChild.start - 1,
              repeat: 1
            })
          }
          GLRepeatComplete[index].push(itemChild)
          start = itemChild.end + 1
        })
        if (this.GLShow[index].length >= start) {
          GLRepeatComplete[index].push({
            start: start,
            end: this.GLShow[index].length,
            repeat: 1
          })
        }
      })
      // 如果没有纹板图循环，直接生成一个GLRepeatComplete
      if (this.GLRepeat.length === 0) {
        this.GLShow.forEach((item) => {
          GLRepeatComplete.push([{
            start: 1,
            end: item.length,
            repeat: 1
          }])
        })
      }
      // 序号计算
      GLRepeatComplete.forEach((item, index) => {
        this.GLXuhao.push([])
        let addNum = 0
        item.forEach((itemChild) => {
          for (let i = itemChild.start; i <= itemChild.end; i++) {
            this.GLXuhao[index].push(i + addNum)
          }
          addNum += (itemChild.end - itemChild.start + 1) * (itemChild.repeat - 1)
        })
      })
      GLRepeatComplete.forEach((item, index) => {
        this.GL[index] = []
        item.forEach((itemChild) => {
          for (let j = 0; j < itemChild.repeat; j++) {
            for (let i = itemChild.start; i <= itemChild.end; i++) {
              this.GL[index].push(this.GLShow[index][i - 1])
            }
          }
        })
      })
      this.GLMapArr = data.reserve_column ? JSON.parse(data.reserve_column) : this.GLXuhao.map((item, index) => {
        return item.map((itemChild, indexChild) => {
          return this.GLMapArr[index] ? (this.GLMapArr[index][indexChild] || '') : ''
        })
      })
      // 高度计算，不包含让位，计算克重的时候需要包汉让位
      this.canvasHeight = (this.weftInfo.neichang) / (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * 600 * 4
      console.log(this.weftInfo.neichang, this.warpInfo.reed_width, this.weftCmp)
      // 计算克重信息
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
      // 将展平的数据用于克重计算
      warpTable.forEach((item) => {
        this.colorNumber.warp[item.color] = this.colorNumber.warp[item.color] ? this.colorNumber.warp[item.color] : 0
        this.colorNumber.warp[item.color] += Number(item.number)
      })
      weftTable.forEach((item) => {
        this.colorNumber.weft[item.color] = this.colorNumber.weft[item.color] ? this.colorNumber.weft[item.color] : 0
        this.colorNumber.weft[item.color] += Number(item.number)
      })
      warpTableBack.forEach((item) => {
        this.colorNumber.warp[item.color] = this.colorNumber.warp[item.color] ? this.colorNumber.warp[item.color] : 0
        this.colorNumber.warp[item.color] += Number(item.number)
      })
      weftTableBack.forEach((item) => {
        this.colorNumber.weft[item.color] = this.colorNumber.weft[item.color] ? this.colorNumber.weft[item.color] : 0
        this.colorNumber.weft[item.color] += Number(item.number)
      })

      this.warpInfo.material_data.forEach((item) => {
        item.apply.forEach((itemChild) => {
          this.colorWeight.warp[itemChild] = (this.colorNumber.warp[itemChild] * (this.weftInfo.neichang + this.weftInfo.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
        })
      })
      this.weftInfo.material_data.forEach((item) => {
        item.apply.forEach((itemChild) => {
          this.colorWeight.weft[itemChild] = (this.colorNumber.weft[itemChild] * (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
        })
      })
      this.material.materialWarp.forEach((item) => {
        item.apply = item.apply.map((index) => {
          return {
            number: index,
            weight: item.number * (this.colorNumber.warp[index] * (this.weftInfo.neichang + this.weftInfo.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
          }
        })
      })
      this.material.materialWeft.forEach((item) => {
        item.apply = item.apply.map((index) => {
          return {
            number: index,
            weight: item.number * (this.colorNumber.weft[index] * (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1) || 0
          }
        })
      })
      this.colorWeight.warp.forEach((item) => {
        this.weight += item === 'NaN' ? 0 : Number(item)
      })
      this.colorWeight.weft.forEach((item) => {
        this.weight += item === 'NaN' ? 0 : Number(item)
      })
      this.material.materialWarp.forEach((item) => {
        item.apply.forEach((itemApply) => {
          this.weight += (Number(itemApply.weight) === 'NaN' ? 0 : Number(itemApply.weight))
        })
      })
      this.material.materialWeft.forEach((item) => {
        item.apply.forEach((itemApply) => {
          this.weight += (Number(itemApply.weight) === 'NaN' ? 0 : Number(itemApply.weight))
        })
      })
      this.weight = this.weight.toFixed(1)
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
        } else {
          // 穿综法普通逻辑
          // let PM = this.PM[this.romanNum.indexOf(item.PM)]
          // let PMArr = PM.value.split(',')
          // let times = parseInt(item.number / PMArr.length)
          // let remainder = PM.number % PMArr.length
          // for (let i = 0; i < times; i++) {
          //   warpGetPM = warpGetPM.concat(PMArr)
          // }
          // warpGetPM = warpGetPM.concat(PMArr.filter((item, index) => index < remainder))
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
        } else {
          // let PM = this.PM[this.romanNum.indexOf(item.PM)]
          // let PMArr = PM.value.split(',')
          // let times = parseInt(PM.number / PMArr.length)
          // let remainder = item.number % PMArr.length
          // for (let i = 0; i < times; i++) {
          //   warpGetPMBack = warpGetPMBack.concat(PMArr)
          // }
          // warpGetPMBack = warpGetPMBack.concat(PMArr.filter((item, index) => index < remainder))
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
    }
  },
  mounted () {
    // 设置rem，20等分
    let deviceWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.querySelector('html')
    htmlDom.style.fontSize = deviceWidth / 20 + 'px'
    this.imageWidth = deviceWidth - 24
    craft.detail({
      id: this.$route.params.id
    }).then((res) => {
      if (res.data.status) {
        this.init(res.data.data)
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/phoneCtn.less";
@import "~@/assets/less/craft/sharePhone.less";
</style>
<style lang="less">
html,
body {
  margin: 0;
  height: auto;
  font-family: Arial, Helvetica, sans-serif;
  min-width: 0 !important;
}
</style>
