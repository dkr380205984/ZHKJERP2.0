<template>
  <div id='packPlanDetailNew'
    class='indexMain'>
    <div class="listCutCtn">
      <div class="cut_item active">
        <span class="icon packPlan"></span>
        <span class="name">装箱计划</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packOrderDetail/' + $route.params.id)">
        <span class="icon packOrder"></span>
        <span class="name">包装订购</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packStock/' + $route.params.id)">
        <span class="icon packOut"></span>
        <span class="name">装箱出库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn"
        style="justify-content:start">
        <div class="title">
          订单信息
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent"
            :afterSend="$winReload"></zh-message>
        </div>
      </div>
      <div class="detailCtn">
        <!-- <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnBlue"
              @click="cutPlanTb()">新增装箱单</div>
          </div>
        </div> -->
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">发货批次：</span>
            <span class="text">
              <zh-batch :data='orderInfo.order_batch'></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.contacts}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">装箱资料：</span>
            <span class="text"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">装箱信息</div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="flexTb">
            <span class="leftBtn el-icon-d-arrow-left"
              v-if="canShow('scroll_row','scroll_item','left')"
              @mousedown="scrollX('scroll_row','scroll_item',false)"
              @mouseup="timer = false"></span>
            <span class="rightBtn el-icon-d-arrow-right"
              v-if="canShow('scroll_row','scroll_item','right')"
              @mousedown="scrollX('scroll_row','scroll_item',true)"
              @mouseup="timer = false"></span>
            <div class="thead"
              v-for="item in 1"
              :key="item">
              <!-- 这里用v-for是因为直接绑定ref时 下方body v-for中ref会覆盖掉head中的ref 导致滚动时 head 不去滚动 -->
              <span class="trow">
                <span class="tcolumn w120 center">装箱类型</span>
                <span class="scroll_row flex14"
                  ref="scroll_row">
                  <span class="scroll_item"
                    ref="scroll_item">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow">
                        <span class="tcolumn flex18">产品</span>
                        <span class="tcolumn flex18">尺码/颜色</span>
                        <span class="tcolumn flex08 right">袋装<br />(件/袋)</span>
                        <span class="tcolumn flex08 right">袋箱数量<br />(袋/箱)</span>
                        <span class="tcolumn flex08 right">总数量<br />(件)</span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08">箱号</span>
                    <span class="tcolumn flex08 right">箱数<br />(箱)</span>
                    <span class="tcolumn flex08 right">每箱毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">总毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">每箱净数<br />(kg)</span>
                    <span class="tcolumn flex08 right">总净重<br />(kg)</span>
                    <span class="tcolumn flex18">长*宽*高<br />(cm)</span>
                    <span class="tcolumn flex18">备注</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow"
                v-for="(itemType,indexType) in totalPlanPackInfo"
                :key="indexType">
                <span class="tcolumn w120 green center">装箱类型{{chinaNum[indexType]}}</span>
                <span class="scroll_row flex14"
                  ref="scroll_row">
                  <span class="scroll_item"
                    ref="scroll_item">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow"
                        v-for="(itemPro,indexPro) in itemType.product_info"
                        :key="indexPro">
                        <span class="tcolumn flex18">{{itemPro.product_code}}<br />{{itemPro.type}}</span>
                        <span class="tcolumn flex18">{{itemPro.sizeColorName.join('/')}}</span>
                        <span class="tcolumn flex08 right">{{itemPro.bags_number}}</span>
                        <span class="tcolumn flex08 right">{{itemPro.box_number}}</span>
                        <span class="tcolumn flex08 right">{{itemPro.total_number}}</span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08">{{itemType.first_box + '~' + itemType.last_box}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_box_number}}</span>
                    <span class="tcolumn flex08 right">{{itemType.gross_weight}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_gross_weight}}</span>
                    <span class="tcolumn flex08 right">{{itemType.net_weight}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_net_weight}}</span>
                    <span class="tcolumn flex18">{{[itemType.long,itemType.weight,itemType.height].join('*')}}</span>
                    <span class="tcolumn flex18">{{itemType.remark}}</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="rowCtn col"
          v-for="(itemType,indexType) in planPackInfo"
          :key="indexType">
          <span class="label">装箱类型{{chinaNum[indexType]}}
            <span class="tbBtn red"
              style="font-size:16px"
              @click="deleteItem(planPackInfo,indexType)">删除</span>
          </span>
          <div class="flexTb">
            <span class="leftBtn el-icon-d-arrow-left"
              v-if="canShow('scroll_row'+ indexType,'scroll_item'+ indexType,'left')"
              @mousedown="scrollX('scroll_row' + indexType,'scroll_item' + indexType,false)"
              @mouseup="timer = false"></span>
            <span class="rightBtn el-icon-d-arrow-right"
              v-if="canShow('scroll_row'+ indexType,'scroll_item'+ indexType,'right')"
              @mousedown="scrollX('scroll_row' + indexType,'scroll_item' + indexType,true)"
              @mouseup="timer = false"></span>
            <div class="thead">
              <span class="trow">
                <span class="tcolumn w120 center">操作</span>
                <span class="scroll_row flex14"
                  :ref="'scroll_row' + indexType">
                  <span class="scroll_item"
                    :ref="'scroll_item' + indexType">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow">
                        <span class="tcolumn flex18">产品</span>
                        <span class="tcolumn flex18">尺码/颜色</span>
                        <span class="tcolumn flex08 right">袋装<br />(件/袋)</span>
                        <span class="tcolumn flex08 right">袋箱数量<br />(袋/箱)</span>
                        <span class="tcolumn flex08 right">总数量<br />(件)</span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08">箱号</span>
                    <span class="tcolumn flex08 right">箱数<br />(箱)</span>
                    <span class="tcolumn flex08 right">每箱毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">总毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">每箱净数<br />(kg)</span>
                    <span class="tcolumn flex08 right">总净重<br />(kg)</span>
                    <span class="tcolumn flex18 center">长*宽*高<br />(cm)</span>
                    <span class="tcolumn flex18">备注</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow">
                <span class="tcolumn w120 center">
                  <span class="blue tbBtn"
                    @click="addItem(itemType.product_info,'product')">新增行</span>
                  <span class="red tbBtn"
                    @click="deleteItem(itemType.product_info)">删除行</span>
                </span>
                <span class="scroll_row flex14"
                  :ref="'scroll_row' + indexType">
                  <span class="scroll_item"
                    :ref="'scroll_item' + indexType">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow"
                        v-for="(itemPro,indexPro) in itemType.product_info"
                        :key="indexPro">
                        <span class="tcolumn flex18">
                          <el-select v-model="itemPro.product_id"
                            class="inputs"
                            placeholder="请选择产品"
                            @change="changeSizeColorArr(itemPro)">
                            <el-option v-for="item in productList"
                              :key="item.product_id"
                              :label="item.product_code + '(' + [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/') + ')'"
                              :value="item.product_id">
                            </el-option>
                          </el-select>
                        </span>
                        <span class="tcolumn flex18">
                          <el-cascader v-model="itemPro.sizeColor"
                            placeholder="尺码/颜色"
                            class="inputs"
                            :options="itemPro.sizeColorArr"
                            :props="{ expandTrigger: 'hover' }"></el-cascader>
                        </span>
                        <span class="tcolumn flex08 right">
                          <zh-input placeholder='数量'
                            v-model="itemPro.bags_number"
                            class="inputs noborderType right"
                            @input="changeBagsBoxNumber(itemPro)"
                            type='number'></zh-input>
                        </span>
                        <span class="tcolumn flex08 right">
                          <zh-input placeholder='数量'
                            v-model="itemPro.box_number"
                            class="inputs noborderType right"
                            @input="changeBagsBoxNumber(itemPro)"
                            type='number'></zh-input>
                        </span>
                        <span class="tcolumn flex08 right">
                          <!-- <zh-input placeholder='数量'
                            v-model="itemPro.total_number"
                            class="inputs noborderType right"
                            @input="changeBagsBoxNumber(itemPro)"
                            type='number'></zh-input> -->
                          {{itemPro.total_number || 0}}
                        </span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08 row">
                      <zh-input placeholder='首箱号'
                        v-model="itemType.first_box"
                        class="inputs noborderType center"
                        @input="changeBoxNumber(itemType)"
                        type='number'></zh-input>
                      <span style="margin:0 8px">~</span>
                      <zh-input placeholder='末箱号'
                        v-model="itemType.last_box"
                        class="inputs noborderType center"
                        @input="changeBoxNumber(itemType)"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='数量'
                        v-model="itemType.total_box_number"
                        class="inputs noborderType right"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='数量'
                        v-model="itemType.gross_weight"
                        class="inputs noborderType right"
                        @input="changeGrossWeight(itemType)"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <!-- <zh-input placeholder='数量'
                        v-model="itemType.total_gross_weight"
                        class="inputs noborderType right"
                        type='number'></zh-input> -->
                      {{itemType.total_gross_weight || 0}}
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='数量'
                        v-model="itemType.net_weight"
                        class="inputs noborderType right"
                        @input="changeNetWeight(itemType)"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <!-- <zh-input placeholder='数量'
                        v-model="itemType.total_net_weight"
                        class="inputs noborderType right"
                        type='number'></zh-input> -->
                      {{itemType.total_net_weight || 0}}
                    </span>
                    <span class="tcolumn flex18 row">
                      <zh-input placeholder='数量'
                        v-model="itemType.long"
                        class="inputs noborderType center"
                        type='number'></zh-input>
                      <span style="margin:0 8px">*</span>
                      <zh-input placeholder='数量'
                        v-model="itemType.width"
                        class="inputs noborderType center"
                        type='number'></zh-input>
                      <span style="margin:0 8px">*</span>
                      <zh-input placeholder='数量'
                        v-model="itemType.height"
                        class="inputs noborderType center"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex18">
                      <zh-input placeholder='备注'
                        v-model="itemType.remark"
                        class="inputs noborderType"></zh-input>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="rowCtn col">
          <div class="addRows">
            <div class="once"
              @click="addItem(planPackInfo,'type')">+添加装箱类型</div>
          </div>
        </div>
        <div class="rowCtn col">
          <span class="label">其他备注</span>
          <el-input type="textarea"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入内容"
            v-model="remark">
          </el-input>
        </div>
        <div class="rowCtn col">
          <span class="label">包装资料</span>
          <el-upload class="upload"
            multiple
            action="https://upload.qiniup.com/"
            :before-upload="beforeAvatarUpload"
            :data="postData"
            ref="packagUpload"
            :file-list="file_arr"
            list-type="picture">
            <div class="uploadBtn">
              <i class="el-icon-upload"></i>
              <span>上传文件</span>
            </div>
            <div slot="tip"
              class="el-upload__tip">上传的文件不可超过10M</div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { order, getToken } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      timer: true, // 长按按钮判断是否继续滑动
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      chinaNum: chinaNum,
      orderInfo: {},
      productList: [],
      planPackInfo: [
        {
          product_info: [
            {
              product_id: '',
              sizeColorArr: [],
              sizeColor: [],
              bags_number: '',
              box_number: '',
              total_number: ''
            }
          ],
          first_box: '',
          last_box: '',
          total_box_number: '',
          gross_weight: '',
          total_gross_weight: '',
          net_weight: '',
          total_net_weight: '',
          long: '',
          width: '',
          height: '',
          remark: ''
        }
      ],
      remark: '',
      postData: { token: '' },
      file_arr: []
    }
  },
  methods: {
    // 改变净重
    changeNetWeight (item) {
      item.total_net_weight = (item.net_weight || 0) * (item.total_box_number || 0)
    },
    // 改变毛重
    changeGrossWeight (item) {
      item.total_gross_weight = (item.gross_weight || 0) * (item.total_box_number || 0)
    },
    // 改变首箱号和末箱号
    changeBoxNumber (item) {
      // if (item.first_box > item.last_box) {
      //   item.first_box = item.last_box + item.first_box
      //   item.last_box = item.first_box - item.last_box
      //   item.first_box = item.first_box - item.last_box
      // }
      item.total_box_number = (item.last_box || 0) - (item.first_box || 0) + 1
      // this.$forceUpdate()
    },
    // 改变袋装数量与箱装数量时
    changeBagsBoxNumber (item) {
      item.total_number = (item.bags_number || 0) * (item.box_number || 0)
    },
    // 选择产品后切换尺码颜色数据
    changeSizeColorArr (item) {
      let flag = this.productList.find(itemF => itemF.product_id === item.product_id)
      item.sizeColor = []
      item.sizeColorArr = []
      if (flag) {
        item.sizeColorArr = flag.size.map(itemS => {
          return {
            value: itemS.size_id,
            label: itemS.size_name,
            children: flag.color.map(itemC => {
              return {
                value: itemC.color_id,
                label: itemC.color_name
              }
            })
          }
        })
      }
    },
    // 点击左右滑动按钮
    scrollX (per, son, bool) {
      // let perItem = document.getElementsByClassName(per)
      let perItem = this.$refs[per]
      let perWidth = perItem[0].offsetWidth
      // let sonDom = document.getElementsByClassName(son)
      let sonDom = this.$refs[son]
      let sonWidth = sonDom[0].offsetWidth
      let flag = true
      for (let index = 0; index < sonDom.length; index++) {
        let item = sonDom[index]
        let maxLeft = perWidth - sonWidth
        let left = parseInt(item.style.left) || 0
        let number = bool ? left - 20 : left + 20
        item.style.left = ((number > 0) ? 0 : ((number < maxLeft) ? maxLeft : number)) + 'px'
        if (((number > 0) ? 0 : ((number < maxLeft) ? maxLeft : number)) === 0 || ((number > 0) ? 0 : ((number < maxLeft) ? maxLeft : number)) === maxLeft) {
          flag = false
        }
      }
      if (this.timer && flag) {
        window.requestAnimationFrame(() => {
          this.scrollX(per, son, bool)
        })
      } else {
        this.timer = true
      }
      this.$forceUpdate() // 为了触发左右按钮是否显示函数
    },
    // 判断是否显示左右滑动按钮
    canShow (per, son, dir) {
      // let perDom = document.getElementsByClassName(per)[0]
      // let sonDom = document.getElementsByClassName(son)[0]
      let perDom = this.$refs[per] ? this.$refs[per][0] : undefined
      let sonDom = this.$refs[son] ? this.$refs[son][0] : undefined
      if (!perDom || !sonDom) {
        if (dir === 'right') {
          return true
        } else {
          return false
        }
      }
      let maxLeft = perDom.offsetWidth - sonDom.offsetWidth
      let sonDomLeft = parseInt(sonDom.style.left) || 0
      if (dir === 'left' && sonDomLeft !== 0) {
        return true
      } else if (dir === 'right' && sonDomLeft !== maxLeft) {
        return true
      }
    },
    addItem (item, type) {
      if (type === 'product') {
        item.push({
          product_id: '',
          sizeColorArr: [],
          sizeColor: [],
          bags_number: '',
          box_number: '',
          total_number: ''
        })
      } else if (type === 'type') {
        item.push({
          product_info: [
            {
              product_id: '',
              sizeColorArr: [],
              sizeColor: [],
              bags_number: '',
              box_number: '',
              total_number: ''
            }
          ],
          first_box: '',
          last_box: '',
          total_box_number: '',
          gross_weight: '',
          total_gross_weight: '',
          net_weight: '',
          total_net_weight: '',
          long: '',
          width: '',
          height: '',
          remark: ''
        })
      }
    },
    deleteItem (item, index) {
      if (index === 0 || index) {
        item.splice(index, 1)
      } else {
        item.pop()
      }
    },
    beforeAvatarUpload () {

    }
  },
  created () {
    Promise.all([
      order.editDetail({
        id: this.$route.params.id
      }),
      getToken()
    ]).then(res => {
      // 初始化产品信息 订单信息
      this.orderInfo = res[0].data.data
      let productList = []
      this.orderInfo.order_batch.forEach(itemBatch => {
        itemBatch.product_info.forEach(itemPro => {
          productList.push({
            product_id: itemPro.product_id,
            size: itemPro.all_size,
            color: itemPro.all_color,
            image: itemPro.image,
            product_code: itemPro.product_code,
            category_info: itemPro.category_info
          })
        })
      })
      this.productList = this.$unique(productList, 'product_id').map(itemPro => {
        let sizeColor = itemPro.size.map(itemSize => {
          return {
            label: itemSize.size_name,
            value: itemSize.size_id,
            children: itemPro.color.map(itemColor => {
              return {
                label: itemColor.color_name,
                value: itemColor.color_id
              }
            })
          }
        })
        return {
          ...itemPro,
          sizeColor: sizeColor
        }
      })
      // 初始化token
      this.postData.token = res[1].data.data
    })
  },
  computed: {
    totalPlanPackInfo () {
      return this.planPackInfo.map(itemType => {
        return {
          ...itemType,
          product_info: itemType.product_info.map(itemPro => {
            let flag = this.productList.find(itemF => itemF.product_id === itemPro.product_id)
            let flagSize = itemPro.sizeColorArr.find(itemF => itemF.value === itemPro.sizeColor[0])
            let flagColor = flagSize ? flagSize.children.find(itemF => itemF.value === itemPro.sizeColor[1]) : null
            return {
              ...itemPro,
              product_code: flag ? flag.product_code : '',
              type: flag ? [flag.category_info.category_name, flag.category_info.type_name, flag.category_info.style_name].join('/') : '',
              sizeColorName: flagSize && flagColor ? [flagSize.label, flagColor.label] : []
            }
          })
          // Object.assign(itemType, {
          // product_info: itemType.product_info.map(itemPro => {
          //   let flag = this.productList.find(itemF => itemF.product_id === itemPro.product_id)
          //   let flagSize = itemPro.sizeColorArr.find(itemF => itemF.value === itemPro.sizeColor[0])
          //   let flagColor = flagSize ? flagSize.children.find(itemF => itemF.value === itemPro.sizeColor[1]) : null
          //   return {
          //     ...itemPro,
          //     product_code: flag ? flag.product_code : '',
          //     type: flag ? [flag.category_info.category_name, flag.category_info.type_name, flag.category_info.style_name].join('/') : '',
          //     sizeColorName: flagSize && flagColor ? [flagSize.label, flagColor.label] : []
          //   }
          // })
          // })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packPlanDetailNew.less";
</style>
<style lang="less">
#packPlanDetailNew {
  .el-input__inner {
    height: 32px !important;
  }
  .greenInput {
    .el-tag {
      display: inline !important;
      padding: 0;
      border: 0px;
      background: transparent;
      &:nth-last-child(n + 2)::after {
        content: ",";
        color: #01b48c;
      }
      .el-select__tags-text {
        color: #01b48c;
      }
    }
  }
  .inputs {
    height: 32px !important;
    line-height: 32px !important;
    &.right {
      .zhInput {
        text-align: right;
      }
    }
    &.center {
      .zhInput {
        text-align: center;
      }
    }
    &.noborderType {
      height: 100% !important;
      .zhInputBox {
        height: 100% !important;
        .zhInput {
          height: inherit !important;
          border: none;
          padding: 0;
        }
      }
    }
  }
}
</style>
