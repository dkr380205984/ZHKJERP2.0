<template>
  <div id='packPlanCreate'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单信息</div>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnBlue"
              @click="cutPlanTb()">新增装箱单</div>
          </div>
        </div>
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
              <zh-batch :data='$route.params.id'></zh-batch>
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
        <div class="swichCtn"
          v-if="planTb.length>0">
          <div class="swichCtnBox"
            style="left: 32px;">
            <span v-for="(item,index) in planTb"
              :class="{'swich':true, 'active':activePlanId === item.id}"
              :key="index"
              @click="cutPlanTb(item.id)">装箱计划单{{chinaNum[index]}}</span>
          </div>
          <span class="handleBtn left"></span>
          <span class="handleBtn right"></span>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">计划装箱</div>
      </div>
      <div class="editCtn hasBorderTop"
        v-for="(itemPlan,indexPlan) in packPlanInfo"
        :key="indexPlan">
        <div class="titleNum">{{chinaNum[indexPlan]}}级包装</div>
        <div class="deleteIcon el-icon-close"
          @click="deleteItem(packPlanInfo,indexPlan,'out')"></div>
        <div class="editRow">
          <div class="editItem"
            v-for="(itemPack,indexPack) in itemPlan"
            :key="indexPack">
            <div class="deleteIcon_page el-icon-circle-close"
              @click="deleteItem(packPlanInfo,indexPlan,'inner',indexPack)"></div>
            <div class="editItem__innerRow">
              <span class="label">包装类型<em class="code">{{itemPack.pack_code}}</em><span class="btn noBorder"
                  @click="copyItem(itemPlan,indexPlan,indexPack)">复制</span></span><!-- {{indexPack + 1}}{{letterArr[indexPlan]}} -->
              <span class="content">
                <span class="content__inner">
                  <el-select v-model="itemPack.pack_name"
                    placeholder="请选择包装"
                    filterable
                    default-first-option>
                    <el-option v-for="item in packList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </span>
              </span>
            </div>
            <div class="editItem__innerRow"
              v-for="(itemPackInner,indexPackInner) in itemPack.pack_info"
              :key="indexPackInner">
              <span class="label">{{indexPlan === 0 ? '产品' : '包装'}}{{chinaNum[indexPackInner]}}</span>
              <span class="content">
                <span class="content__inner">
                  <template v-if="indexPlan === 0">
                    <el-select v-model="itemPackInner.name"
                      placeholder=" 请选择产品"
                      @change="getSizeColor(itemPackInner,indexPlan)">
                      <el-option v-for="item in getPackArr(packPlanInfo,indexPlan)"
                        :key="item.product_id"
                        :label="item.product_code"
                        :value="item.product_id">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else>
                    <el-select v-model="itemPackInner.name"
                      placeholder="请选择包装"
                      @change="getSizeColor(itemPackInner,indexPlan)">
                      <el-option v-for="item in getPackArr(packPlanInfo,indexPlan)"
                        :key="item.value"
                        :label="item.value + '-' + item.pack_name "
                        :value="item.value">
                        <span style="float: left">{{ item.value }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.pack_name }}</span>
                      </el-option>
                    </el-select>
                  </template>
                  <span class="handleCtn red"
                    @click="deleteItem(itemPack.pack_info,indexPackInner)">删除</span>
                </span>
                <span class="content__inner">
                  <el-cascader v-model="itemPackInner.size_color"
                    :key="itemPackInner.name + indexPackInner"
                    v-if="indexPlan === 0"
                    placeholder="尺码颜色"
                    class="width169"
                    :options="itemPackInner.sizeColor"></el-cascader>
                  <zh-input v-model="itemPackInner.number"
                    :class="indexPlan === 0 ? 'width139' : ''"
                    placeholder="数量">
                    <!-- <template slot="append">条</template> -->
                  </zh-input>
                </span>
              </span>
            </div>
            <div class="editItem__innerRow">
              <span class="content">
                <span class="content__inner">
                  <span class="btn btnWhiteBlue noMargin"
                    @click="addItem(itemPack.pack_info,'packInfo')">添加{{indexPlan === 0 ? '产品' : '包装'}}</span>
                </span>
              </span>
            </div>
            <el-collapse-transition>
              <div class="editItem__innerRow"
                v-if="showHiddle">
                <span class="content">
                  <span class="content__inner noMargin">
                    <div class="editItem__innerRow width169">
                      <span class="label">毛重</span>
                      <span class="content">
                        <zh-input v-model="itemPack.gross_weight"
                          placeholder="净重"
                          type='number'></zh-input>
                      </span>
                    </div>
                    <div class="editItem__innerRow width139">
                      <span class="label">净重</span>
                      <span class="content">
                        <zh-input v-model="itemPack.net_weight"
                          placeholder="净重"
                          type='number'></zh-input>
                      </span>
                    </div>
                  </span>
                  <span class="content__inner">
                    <span class="content__inner width169 noPadding">
                      <zh-input v-model="itemPack.start_box"
                        placeholder="起始箱"
                        type='number'
                        @input="comBox(itemPack)"></zh-input>
                      ~
                      <zh-input v-model="itemPack.end_box"
                        placeholder="结束箱"
                        type='number'
                        @input="comBox(itemPack)"></zh-input>
                    </span>
                    <zh-input v-model="itemPack.total_box"
                      placeholder="总箱数"
                      disabled
                      class="width139"></zh-input>
                  </span>
                </span>
              </div>
            </el-collapse-transition>
            <span class="showHiddle"
              @click="showHiddle = !showHiddle"><span :class="['el-icon-d-arrow-right', showHiddle ? 'top_icon' : 'bottom_icon']"></span>重量箱号</span>
          </div>
          <div class="editItem addItem"
            @click="addItem(itemPlan,'addPack',indexPlan)">+添加包装</div>
        </div>
        <div class="rowCtn"
          v-if="indexPlan === packPlanInfo.length -1">
          <div class="btn btnWhiteBlue"
            @click="addItem(packPlanInfo,'planInfo')">添加级别</div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包装辅料信息</div>
        <div class="right">
          <div class="btn noBorder"
            @click="statisticalPack">自动计算</div>
        </div>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn"
          v-for="(itemPack,indexPack) in packPlanTotal"
          :key="indexPack">
          <div class="colCtn flex4 margin36">
            <div class="label"
              v-if="indexPack === 0">
              <div class="text">已选包装</div>
            </div>
            <div class="content">
              <el-select v-model="itemPack.pack_name"
                placeholder="请选择包装"
                disabled>
                <el-option v-for="item in packList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn flex4 margin36">
            <div class="label"
              v-if="indexPack === 0">
              <div class="text">所属组合</div>
            </div>
            <div class="content greenInput">
              <el-select v-model="itemPack.item_id"
                placeholder="请选择包装"
                multiple
                disabled>
                <el-option v-for="item in []"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn flex4 margin36">
            <div class="label"
              v-if="indexPack === 0">
              <div class="text">包装规格</div>
            </div>
            <div class="content">
              <zh-input v-model="itemPack.size_info"
                placeholder="请输入包装规格"></zh-input>
            </div>
          </div>
          <div class="colCtn flex4 margin36">
            <div class="label"
              v-if="indexPack === 0">
              <div class="text">属性</div>
            </div>
            <div class="content">
              <zh-input v-model="itemPack.attr"
                placeholder="请输入包装属性"></zh-input>
            </div>
          </div>
          <div class="colCtn flex4 margin36">
            <div class="label"
              v-if="indexPack === 0">
              <div class="text">所需数量</div>
            </div>
            <div class="content">
              <zh-input v-model="itemPack.number"
                placeholder="请输入所需数量"
                type='number'></zh-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray">返回</div>
          <div class="btn btnBlue"
            @click="saveAll">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { letterArr, chinaNum } from '@/assets/js/dictionary.js'
import { packag, order, packPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
      letterArr: letterArr,
      orderInfo: {},
      packList: [],
      productList: [],
      packPlanInfo: [
        [
          {
            pack_code: '1A',
            pack_name: '',
            pack_info: [
              {
                name: '',
                size_color: '',
                number: ''
              }
            ],
            gross_weight: '',
            net_weight: '',
            start_box: '',
            end_box: '',
            total_box: ''
          }
        ]
      ],
      packPlanTotal: [
        {
          pack_name: '',
          attach_to: '',
          size_info: '',
          attr: '',
          number: ''
        }
      ],
      planTb: [],
      activePlanId: '',
      showHiddle: false
    }
  },
  methods: {
    deleteItem (item, index, flag, key) {
      this.$confirm('此操作将删除该项,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (flag === 'out') {
          if (index === item.length - 1) {
            item.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.warning('请先删除最后一级')
          }
        } else if (flag === 'inner') {
          let itemInner = item[index + 1]
          if (itemInner) {
            let flag = true
            let arr = []
            itemInner.forEach((itemInner1, indexInner1) => {
              itemInner1.pack_info.forEach(itemInner2 => {
                if (itemInner2.name === item[index][key].pack_code) {
                  flag = false
                  arr.push(this.chinaNum[index + 1] + '级包装' + itemInner1.pack_code)
                }
              })
            })
            if (flag) {
              item[index].splice(key, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message.warning('检测到' + arr.join(',') + '中已选中该包装,无法删除')
            }
          } else {
            item[index].splice(key, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        } else {
          item.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addItem (item, type, index) {
      if (type === 'planInfo') {
        if (item.length === 0) {
          item.push([
            {
              pack_code: '1A',
              pack_name: '',
              pack_info: [
                {
                  name: '',
                  size_color: '',
                  number: ''
                }
              ],
              gross_weight: '',
              net_weight: '',
              start_box: '',
              end_box: '',
              total_box: ''
            }
          ])
        } else {
          item.push([
            {
              pack_code: '1' + this.letterArr[item.length],
              pack_name: '',
              pack_info: [
                {
                  name: '',
                  number: ''
                }
              ],
              gross_weight: '',
              net_weight: '',
              start_box: '',
              end_box: '',
              total_box: ''
            }
          ])
        }
      } else if (type === 'addPack') {
        let lastNum = parseInt(this.$clone(item).sort((a, b) => {
          return parseInt(b.pack_code) - parseInt(a.pack_code)
        })[0].pack_code) + 1
        if (index === 0) {
          item.push({
            pack_code: lastNum + 'A',
            pack_name: '',
            pack_info: [
              {
                name: '',
                size_color: '',
                number: ''
              }
            ],
            gross_weight: '',
            net_weight: '',
            start_box: '',
            end_box: '',
            total_box: ''
          })
        } else {
          item.push({
            pack_code: lastNum + this.letterArr[index],
            pack_name: '',
            pack_info: [
              {
                name: '',
                number: ''
              }
            ],
            gross_weight: '',
            net_weight: '',
            start_box: '',
            end_box: '',
            total_box: ''
          })
        }
      } else if (type === 'packInfo') {
        item.push({
          name: '',
          size_color: '',
          number: ''
        })
      }
    },
    copyItem (item, index, key) {
      let copyData = this.$clone(item[key])
      let lastNum = parseInt(this.$clone(item).sort((a, b) => {
        return parseInt(b.pack_code) - parseInt(a.pack_code)
      })[0].pack_code) + 1
      copyData.pack_code = lastNum + this.letterArr[index]
      item.push(copyData)
      this.$message.success('复制成功')
    },
    getPackArr (item, index) {
      if (index === 0) {
        return this.productList
      } else {
        let arr = item[index - 1]
        return arr.map((itemInner, indexInner) => {
          let pack = this.packList.find(itemPack => itemPack.id === itemInner.pack_name)
          return {
            pack_name: pack ? pack.name : '',
            pack_id: itemInner.pack_name,
            value: itemInner.pack_code
          }
        })
      }
    },
    comBox (itemPack) {
      itemPack.total_box = ((itemPack.end_box - itemPack.start_box + 1) && (itemPack.end_box - itemPack.start_box + 1) > 0) ? (itemPack.end_box - itemPack.start_box + 1) : 0
    },
    statisticalPack () {
      let packPlanTotal = []
      this.packPlanInfo.forEach((item, index) => {
        item.forEach((itemInner, indexInner) => {
          packPlanTotal.push({
            pack_name: itemInner.pack_name,
            item_id: itemInner.pack_code,
            size_info: '',
            attr: '',
            number: itemInner.total_box
          })
        })
      })
      packPlanTotal = this.$mergeData(packPlanTotal, { mainRule: 'pack_name', otherRule: [{ name: 'size_info' }, { name: 'attr' }, { name: 'number', type: 'add' }], childrenName: 'item_id' })
      this.packPlanTotal = packPlanTotal.map(item => {
        item.item_id = item.item_id.map(value => value.item_id)
        return item
      })
    },
    cutPlanTb (id) {
      this.$confirm('请检测该计划单是否保存修改，该操作将不保留您修改的数据,请在提交修改后在进行切换计划单，是否继续切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          let flag = this.planTb.find(item => item.id === id)
          if (flag) {
            this.packPlanInfo = flag.packPlanInfo
            this.packPlanTotal = flag.packPlanTotal
            this.activePlanId = id
            if (this.planTb.filter(item => !item.id).length > 0) {
              this.getInitPlanInfo(id)
            }
          } else {
            this.$message.error('出现未知错误')
          }
        } else {
          this.packPlanInfo = [
            [
              {
                pack_code: '1A',
                pack_name: '',
                pack_info: [
                  {
                    name: '',
                    size_color: '',
                    number: ''
                  }
                ],
                gross_weight: '',
                net_weight: '',
                start_box: '',
                end_box: '',
                total_box: ''
              }
            ]
          ]
          this.packPlanTotal = [
            {
              pack_name: '',
              attach_to: '',
              size_info: '',
              attr: '',
              number: ''
            }
          ]
          this.activePlanId = ''
          this.planTb.push({ id: '' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getSizeColor (item, index) {
      if (index === 0) {
        item.sizeColor = []
        item.sizeColor = this.productList.find(itemPro => itemPro.product_id === item.name).sizeColor
      }
    },
    saveAll () {
      let data = {
        id: this.activePlanId,
        order_id: this.$route.params.id,
        order_type: 1,
        pack_info: JSON.stringify(this.packPlanInfo),
        material_info: JSON.stringify(this.packPlanTotal),
        desc: ''
      }
      // let packInfo = this.$clone(this.packPlanInfo).map((itemOut, indexOut) => {
      //   itemOut = itemOut.map((itemInner, indexInner) => {
      //     return {
      //       pack_code: itemInner.pack_code,
      //       pack_material_name: itemInner.pack_name,
      //       weight: itemInner.gross_weight,
      //       net_weight: itemInner.net_weight,
      //       desc: '',
      //       start_chest: itemInner.start_box,
      //       end_chest: itemInner.end_box,
      //       total_chest: itemInner.total_box,
      //       product_info: itemInner.pack_info.map(value => {
      //         return {
      //           product_code: value.name,
      //           size_name: value.size_color ? value.size_color[0] : '',
      //           color_name: value.size_color ? value.size_color[1] : '',
      //           number: value.number
      //         }
      //       })
      //     }
      //   })
      //   return itemOut
      // })
      // let arr = []
      // this.$clone(packInfo).forEach(item => {
      //   arr = arr.concat(item)
      // })
      // data.pack_info = arr
      // data.pack_info_material = this.packPlanTotal.map(item => {
      //   return {
      //     pack_material_name: item.pack_name,
      //     apply: JSON.stringify(item.item_id),
      //     pack_size: item.size_info,
      //     pack_attribute: item.attr,
      //     number: item.number
      //   }
      // })
      packPlan.create(data).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
        }
      })
      console.log(data)
    },
    getInitPlanInfo (id) {
      packPlan.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.stauts !== false) {
          // 初始化数据
          this.planTb = res.data.data.map(item => {
            return {
              id: item.id,
              packPlanInfo: JSON.parse(item.pack_info),
              packPlanTotal: JSON.parse(item.material_info)
            }
          })
          if (this.planTb.length > 0) {
            if (id) {
              this.activePlanId = id
              this.packPlanInfo = this.planTb.find(item => item.id === id).packPlanInfo
              this.packPlanTotal = this.planTb.find(item => item.id === id).packPlanTotal
            } else {
              this.activePlanId = this.planTb[0].id
              this.packPlanInfo = this.planTb[0].packPlanInfo
              this.packPlanTotal = this.planTb[0].packPlanTotal
            }
          } else {
            this.planTb = [
              {
                id: ''
              }
            ]
          }
        }
      })
    }
  },
  created () {
    Promise.all([
      packag.list(),
      order.editDetail({
        id: this.$route.params.id
      }),
      packPlan.detail({
        order_id: this.$route.params.id,
        order_type: 1
      })
    ]).then(res => {
      this.packList = res[0].data.data
      this.orderInfo = res[1].data.data
      let productList = this.orderInfo.order_batch.map(itemBatch => {
        return itemBatch.product_info.map(itemPro => itemPro.product_info)
      })
      let newProductList = []
      productList.forEach(item => {
        item.forEach(itemPro => {
          if (!(newProductList.find(value => value.product_id === itemPro.product_id))) {
            newProductList.push(itemPro)
          }
        })
      })
      this.productList = newProductList.map(itemPro => {
        let sizeColor = itemPro.size_measurement.map(itemSize => {
          return {
            label: itemSize.measurement,
            value: itemSize.measurement,
            children: itemPro.color.map(itemColor => {
              return {
                label: itemColor.color_name,
                value: itemColor.color_name
              }
            })
          }
        })
        return {
          ...itemPro,
          sizeColor: sizeColor
        }
      })
      this.getInitPlanInfo()
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packPlanCreate.less";
</style>
<style lang="less">
#packPlanCreate {
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
  // }
}
</style>
