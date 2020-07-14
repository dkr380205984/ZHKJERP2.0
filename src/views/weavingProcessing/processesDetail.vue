<template>
  <div id="processesDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="$winReload"></zh-message>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code || orderInfo.title}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data="orderInfo.batch_info"></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}
              <order-warning :progress="orderInfo.time_progress"></order-warning>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':orderInfo.desc}">{{orderInfo.desc?orderInfo.desc:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">工序分配</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <el-tooltip class="item"
              effect="dark"
              :content="checkWeaveList.length===0?'请选取一款产品进行批量分配操作':'批量分配'"
              placement="top">
              <div class="btn "
                :class="{'btnGray':checkWeaveList.length===0,'btnWhiteBlue':checkWeaveList.length>0}"
                @click="easyWeaving()">批量分配</div>
            </el-tooltip>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">选择</div>
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn noPad"
                    style="flex:3">
                    <div class="trow">
                      <div class="tcolumn">尺码配色</div>
                      <div class="tcolumn">可分配数</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_info"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"
                      @change="getAll"></el-checkbox>
                  </div>
                  <div class="tcolumn">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <el-checkbox v-model="itemChild.checked">{{itemChild.size_name}}/{{itemChild.color_name}}</el-checkbox>
                      </div>
                      <div class="tcolumn">{{itemChild.production_number}}{{itemChild.unit}}</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="normalWeaving(item.product_id,itemChild.size_id,itemChild.color_id,itemChild.production_number)">工序分配</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in weaving_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteWeaving(index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择产品</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.product_id"
                        filterable
                        placeholder="请选择需要织造的产品"
                        @change="selectColorSize(index,$event)">
                        <el-option v-for="item in weaving_info"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_code + '(' + item.category_name +'/'+ item.type_name + '/' + item.style_name +')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.companyRate"
                  :key="'zhizao'+ indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">选择单位</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="itemChild.company_id"
                        filterable
                        :filter-method="searchClient"
                        placeholder="请选择单位">
                        <el-option v-for="item in clientArrReal"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">工序名称</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="content">
                      <el-cascader v-model="itemChild.process"
                        :options="processArr"></el-cascader>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">单价信息</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        v-model="itemChild.price"
                        placeholder="请输入单价信息">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addCompanyRate(index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteCompanyRate(index,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.mixedData"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">尺码/颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="itemChild.colorSize"
                        no-data-text="请先选择产品"
                        placeholder="请选择尺码/颜色">
                        <el-option v-for="item in item.colorSizeArr"
                          :key="item.size_id + '/' + item.color_id"
                          :value="item.size_id + '/' + item.color_id"
                          :label="item.size_name + '/' + item.color_name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">分配数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        @input="changeLoss(itemChild)"
                        v-model="itemChild.number"
                        placeholder="请输入分配数量">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">机动数</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content"
                      style="display:flex">
                      <zh-input type="number"
                        v-model="itemChild.loss"
                        @input="changeLoss(itemChild)"
                        placeholder="请输入百分比">
                        <template slot="append">%</template>
                      </zh-input>
                      <zh-input style="margin-left:12px"
                        v-model="itemChild.lossNum"
                        placeholder="请输入机动数">
                        <template slot="append">件</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addMixedData(index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteMixedData(index,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
                    <div class="label">
                      <span class="text">截止日期</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-date-picker v-model="item.complete_time"
                        value-format="yyyy-MM-dd"
                        style="width:100%"
                        type="date"
                        placeholder="选择截止日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">备注信息</span>
                    </div>
                    <div class="content">
                      <el-input placeholder="请输入备注信息"
                        v-model="item.desc"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="addRows">
                <span class="once"
                  v-if="!weaving_flag"
                  @click="normalWeaving()">普通分配</span>
                <span class="once cancle"
                  v-if="weaving_flag"
                  @click="cancleWeaving">取消分配</span>
                <span class="once normal"
                  v-if="weaving_flag"
                  @click="addWeaving">添加产品</span>
                <span class="once ok"
                  v-if="weaving_flag"
                  @click="saveWeaving">确认分配
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, sampleOrder, materialPlan, weave, client, process } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      orderInfo: {
        order_code: '',
        client_name: '',
        user_name: '',
        group_name: '',
        order_time: '',
        order_batch: [],
        desc: ''
      },
      weaving_info: [],
      weaving_data: [],
      weaving_flag: false,
      processArr: [{
        value: '织片',
        label: '织片'
      }, {
        value: '套缝',
        label: '套缝'
      }, {
        value: '整烫',
        label: '整烫'
      }, {
        value: '其它',
        label: '其它',
        children: []
      }]
    }
  },
  computed: {
    checkWeaveList () {
      return this.weaving_info.filter((item) => item.checked)
    }
  },
  methods: {
    searchClient (query) {
      this.clientArrReal = []
      if (query) {
        // 判断一个字符串是否包含某几个字符,所有的indexOf!==-1 且字符是从左往右的,也就是从小到大的
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          this.clientArrReal = this.companyArr.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        } else {
          const queryArr = query.split('')
          this.companyArr.forEach((item) => {
            let flag = true
            let indexPinyin = 0
            queryArr.forEach((itemQuery) => {
              indexPinyin = item.name_pinyin.substr(indexPinyin, item.name_pinyin.length).indexOf(itemQuery)
              if (indexPinyin === -1) {
                flag = false
                // 可以通过throw new Error('')终止循环,如果需要优化的话
              }
            })
            if (flag) {
              this.clientArrReal.push(item)
            }
          })
        }
      } else {
        this.clientArrReal = this.$clone(this.companyArr)
      }
    },
    normalWeaving (id, size, color, number) {
      console.log(id, size, color, number)
      this.weaving_flag = true
      this.weaving_data.push({
        companyRate: [{
          company_id: '',
          process: '织造',
          price: ''
        }],
        product_id: id || '',
        mixedData: [{
          colorSize: id ? size + '/' + color : '',
          number: number || '',
          loss: 3,
          lossNum: number ? parseInt(number * 0.03) : ''
        }],
        complete_time: '',
        colorSizeArr: [],
        desc: ''
      })
      if (id) {
        this.selectColorSize(this.weaving_data.length - 1, id)
      }
    },
    easyWeaving () {
      if (this.weaving_data.length > 0) {
        this.$message.warning('检测到有未完成的工序分配操作，请完成已有的操作后再进行批量分配')
        return
      }
      if (this.checkWeaveList.length === 0) {
        this.$message.warning('请至少选择一种产品进行分配')
        return
      }
      this.easyWeaving_flag = true
    },
    addWeaving () {
      this.weaving_data.push({
        companyRate: [{
          company_id: '',
          price: '',
          process: '织造'
        }],
        product_id: '',
        mixedData: [{
          colorSize: '',
          number: '',
          loss: '',
          lossNum: ''
        }],
        complete_time: '',
        colorSizeArr: [],
        desc: ''
      })
    },
    deleteWeaving (index) {
      if (this.weaving_data.length === 1) {
        this.weaving_flag = false
      }
      this.weaving_data.splice(index, 1)
    },
    cancleWeaving () {
      this.weaving_data = []
      this.weaving_flag = false
    },
    saveWeaving () {
      let errorFlag = false
      let errMsg = ''
      this.weaving_data.forEach((item) => {
        if (!item.product_id) {
          errorFlag = true
          errMsg = '请选择产品'
        } else if (!item.complete_time) {
          errorFlag = true
          errMsg = '请选择截至日期'
        }
        item.companyRate.forEach((itemChild) => {
          if (!itemChild.company_id) {
            errorFlag = true
            errMsg = '请选择单位名称'
          } else if (!itemChild.price) {
            errorFlag = true
            errMsg = '请输入单价'
          } else if (itemChild.process === '') {
            errorFlag = true
            errMsg = '请输入分配工序'
          }
        })
        item.mixedData.forEach((itemChild) => {
          if (!itemChild.colorSize) {
            errorFlag = true
            errMsg = '请选择尺码颜色信息'
          } else if (!itemChild.number) {
            errorFlag = true
            errMsg = '请输入分配数量'
          } else if (itemChild.price === '') {
            errorFlag = true
            errMsg = '请输入单价信息'
          }
        })
      })
      if (errorFlag) {
        this.$message.error(errMsg)
      }
      let formData = []
      this.weaving_data.forEach((item) => {
        item.mixedData.forEach((itemChild) => {
          let colorSize = itemChild.colorSize.split('/')
          item.companyRate.forEach((itemCmp) => {
            formData.push({
              order_id: this.$route.params.id,
              order_type: this.$route.params.orderType,
              product_id: item.product_id,
              client_id: itemCmp.company_id,
              complete_time: this.$getTime(item.complete_time),
              desc: item.desc,
              price: itemCmp.price,
              motorise_number: itemChild.lossNum,
              number: itemChild.number,
              size_id: colorSize[0],
              color_id: colorSize[1],
              is_part: 2,
              process: itemCmp.process
            })
          })
        })
      })
      weave.dressCreate({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('分配成功，请手动分配物料信息')
          this.weaving_flag = false
          this.weaving_data.forEach((item) => {
            item.companyRate.forEach((itemClient) => {
              if (!this.weaving_mat.find((itemFind) => { return itemFind.company_id === itemClient.company_id })) {
                this.weaving_mat.push({
                  company_id: itemClient.company_id,
                  client_name: this.companyArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
                  material_merge: [{
                    id: null,
                    canbeEdit: true,
                    material_name: '',
                    material_attribute: '',
                    number: ''
                  }]
                })
              }
            })
          })
          this.showMaterialPopup = true
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/weavingProcessing/weavingDetail/' + this.$route.params.id + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个工序分配信息,' + (this.$route.params.orderType === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          }
        }
      })
    },
    addMixedData (index) {
      this.weaving_data[index].mixedData.push({
        colorSize: '',
        loss: '',
        number: '',
        lossNum: ''
      })
    },
    deleteMixedData (index, indexChild) {
      this.weaving_data[index].mixedData.splice(indexChild, 1)
    },
    addCompanyRate (index) {
      this.weaving_data[index].companyRate.push({
        company_id: '',
        price: '',
        process: ''
      })
    },
    deleteCompanyRate (index, indexChild) {
      this.weaving_data[index].companyRate.splice(indexChild, 1)
    },
    selectColorSize (index, id) {
      this.weaving_data[index].colorSizeArr = this.weaving_info.find((item) => item.product_id === id).childrenMergeInfo
    },
    getAll () {

    }
  },
  mounted () {
    let api = this.$route.params.orderType === '1' ? order : sampleOrder
    Promise.all([
      api.detail({
        id: this.$route.params.id
      }),
      materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }),
      client.list(),
      process.list()
    ]).then((res) => {
      this.orderInfo = res[0].data.data
      // 没有物料计划单就拿批次信息里的产品计划值
      let productInfo = []
      if (this.orderInfo.has_plan === 0) {
        this.orderInfo.batch_info.forEach((item) => {
          item.product_info.forEach((itemPro) => {
            let finded = productInfo.find((itemFind) => {
              return itemFind.size_id === itemPro.size_id && itemFind.color_id === itemPro.color_id && itemFind.product_id === itemPro.product_id
            })
            if (!finded) {
              productInfo.push({
                color_name: itemPro.color_name,
                color_id: itemPro.color_id,
                size_name: itemPro.size_name,
                size_id: itemPro.size_id,
                product_id: itemPro.product_id,
                production_number: parseInt(itemPro.numbers),
                category_name: itemPro.category_info.category_name,
                style_name: itemPro.category_info.style_name,
                type_name: itemPro.category_info.type_name,
                unit: itemPro.category_info.unit,
                product_code: itemPro.product_code
              })
            } else {
              finded.production_number += parseInt(itemPro.numbers)
            }
          })
        })
      } else {
        res[1].data.data.product_info.forEach((item) => {
          let finded = productInfo.find((itemFind) => {
            return itemFind.size_id === item.size_id && itemFind.color_id === item.color_id && itemFind.product_id === item.product_id
          })
          if (finded) {
            finded.production_number += Number(item.production_number)
          } else {
            productInfo.push(item)
          }
        })
      }
      this.weaving_info = this.$mergeData(productInfo, { mainRule: 'product_code', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'product_id' }] })
      this.companyArr = res[2].data.data.filter((item) => {
        return item.type.indexOf(4) !== -1 || item.type.indexOf(5) !== -1
      })
      this.companyArr.forEach((item) => {
        item.name_pinyin = item.name_pinyin.join('')
      })
      this.clientArrReal = this.$clone(this.companyArr)
      this.processArr[3].children = res[3].data.data.filter(item => item.type === 2).map((item) => {
        return {
          value: item.name,
          label: item.name
        }
      })
      console.log(this.weaving_info)
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/processesDetail.less";
</style>
<style lang="less">
#processesDetail {
  .popup {
    .el-timeline-item {
      padding-bottom: 0px;
      margin-bottom: -9px;
    }
    .el-collapse-item__header {
      min-height: 46px;
      height: 46px;
    }
    .el-timeline-item__tail {
      margin-top: 14px;
    }
    .el-timeline-item__node--normal {
      margin-top: 14px;
    }
    .collapseBox {
      display: flex;
      margin: 12px;
      .info {
        flex: 1;
      }
    }
  }
}
</style>
