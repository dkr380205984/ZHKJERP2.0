<template>
  <div id="finishedDetail"
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
            <span class="text">{{orderInfo.order_code}}</span>
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
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
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
        <span class="title">成品检验</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="btnCtn_page"
              style="float:right;margin-bottom:0px">
              <div class="btn btnWhiteBlue"
                @click="easyInspection">批量检验</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb"
              style="margin:0">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:2">产品编号</div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow">
                      <div class="tcolumn"
                        style="flex:1.7">颜色尺码</div>
                      <div class="tcolumn">发货数量</div>
                      <div class="tcolumn">检验数量</div>
                      <div class="tcolumn">次品数量</div>
                      <div class="tcolumn">次品率</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in inspection_detail"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:2">
                    <el-checkbox v-model="item.checked"
                      @change="getAllColorSize($event,item)">
                      <span>{{item.product_code}}</span>
                      <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                    </el-checkbox>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn"
                        style="flex:1.7">
                        <el-checkbox v-model="itemChild.checked"
                          @change="$forceUpdate()">
                          {{itemChild.color_name}}/{{itemChild.size_name}}
                        </el-checkbox>
                      </div>
                      <div class="tcolumn">{{itemChild.numbers}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.inspectionNum===0?'#ccc':'#01B48C'}">{{itemChild.inspectionNum}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.rejectNum===0?'#ccc':'#F5222D'}">{{itemChild.rejectNum}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.rejectNum===0?'#ccc':'#F5222D'}">{{itemChild.rejectNum>0?(itemChild.rejectNum/itemChild.inspectionNum*100).toFixed(2):0}}%</div>
                      <div class="tcolumn">
                        <span class="blue"
                          @click="normalInspection(item.product_id,itemChild.size_id + '/' + itemChild.color_id,itemChild.numbers)">检验</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in inspection_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteInspection(index)">
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
                        placeholder="请选择检验产品"
                        @change="selectProduct($event,index)">
                        <el-option v-for="item in inspection_detail"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_code + '('+item.category_name+'/'+ item.type_name+'/'+ item.style_name +')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.product_info"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">尺码颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select placeholder="请选择尺码颜色"
                        no-data-text="请先选择产品"
                        v-model="itemChild.colorSize">
                        <el-option v-for="(item,index) in item.colorSizeArr"
                          :key="index"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">检验数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入检验数量"
                        v-model="itemChild.number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">次品数量/原因</span>
                    </div>
                    <div class="content"
                      style="display:flex;justify-content: space-between;">
                      <zh-input type="number"
                        placeholder="数量"
                        v-model="itemChild.substandard"
                        style="width:154px">
                      </zh-input>
                      <el-autocomplete style="width:154px"
                        v-model="itemChild.reason"
                        :fetch-suggestions="querySearchDefective"
                        placeholder="原因"></el-autocomplete>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addProduct(index)">添加尺码</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteProduct(index,indexChild)">删除尺码</div>
                  </div>
                </div>
              </div>
              <div class="addRows">
                <span class="once"
                  v-if="!inspection_flag"
                  @click="normalInspection()">添加检验</span>
                <span class="once cancle"
                  v-if="inspection_flag"
                  @click="cancleInspection">取消检验</span>
                <span class="once normal"
                  v-if="inspection_flag"
                  @click="addInspection">添加检验</span>
                <span class="once ok"
                  v-if="inspection_flag"
                  @click="saveInspection">确认检验
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="inspection_log.length>0">
      <div class="titleCtn">
        <span class="title">成品检验日志</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          style="float:right;margin-bottom:16px">
          <div class="btn btnWhiteBlue"
            @click="deleteLog('all')">批量删除</div>
          <div class="btn btnWhiteBlue"
            @click="download">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">检验日期</span>
            <span class="tb_row flex12">产品名称</span>
            <span class="tb_row">配色尺码</span>
            <span class="tb_row">检验数量</span>
            <span class="tb_row">次品数量</span>
            <span class="tb_row">次品原因</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in inspection_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{item.complete_time}}</span>
            <span class="tb_row flex12">{{item.product_info.product_code}}<br />{{item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name}}</span>
            <span class="tb_row">{{item.color_name}}/{{item.size_name}}</span>
            <span class="tb_row">{{item.number}}</span>
            <span class="tb_row"
              :style="{'color':JSON.parse(item.rejects_info).substandard>0?'#F5222D':'#ccc'}">
              {{JSON.parse(item.rejects_info).substandard}}
            </span>
            <span class="tb_row">{{JSON.parse(item.rejects_info).reason}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteLog(item.id,index)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="rejects_flag">
      <div class="main">
        <div class="title">
          <div class="text">次品信息</div>
          <i class="el-icon-close"
            @click="rejects_flag=false"></i>
        </div>
        <div class="content"
          v-for="(item,index) in rejects_info"
          :key="index">
          <div class="row">
            <div class="label">次品数量：</div>
            <div class="info text">
              {{item.number}}
            </div>
          </div>
          <div class="row"
            v-for="(itemChild,indexChild) in item.reason"
            :key="indexChild">
            <div class="label"
              :style="{'visibility':indexChild>0?'hidden':''}">次品原因：</div>
            <div class="info text">
              {{indexChild+1}}.{{itemChild}}
            </div>
          </div>
          <div class="row">
            <div class="label">承担单位：</div>
            <div class="info text">
              {{item.client_id}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 扣款窗口 -->
    <div class="popup"
      v-if="deductPopupFlag">
      <div class="main">
        <div class="title">
          单位扣款
          <span class="el-icon-close"
            @click="deductPopupFlag = false"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">扣款单位：</span>
            <span class="info">
              <el-select v-model="deductInfo.client_id"
                filterable
                placeholder="请选择需要扣款的单位">
                <el-option v-for="item in clientArr"
                  :key="item.client_id"
                  :label="item.client_name"
                  :value="item.client_id + '-' + item.type">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">扣款金额：</span>
            <span class="info">
              <zh-input type='number'
                v-model=" deductInfo.price"
                placeholder="请输入需要扣除款项的金额">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">扣款备注：</span>
            <span class="info">
              <zh-input v-model=" deductInfo.remark"
                placeholder="请输入扣款备注">
              </zh-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="deductPopupFlag = false">取消</span>
          <span class="btn btnBlue"
            @click="clientDeduct">确定</span>
        </div>
      </div>
    </div>
    <!-- 操作记录 -->
    <div class="popup"
      v-show="deductLogPopupFlag">
      <div class="main">
        <div class="title">
          <div class="text">扣款记录</div>
          <i class="el-icon-close"
            @click="deductLogPopupFlag=false"></i>
        </div>
        <div class="content">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in deductLogList"
              :key="index">
              <el-collapse>
                <el-collapse-item>
                  <template slot="title">
                    <span style="color:rgba(0,0,0,0.65);">{{item.complete_time?item.complete_time:'有问题'}}</span>
                    <span style="margin-left:20px;color:#F5222D">扣款</span>
                    <span style="margin-left:20px">金额：
                      <span style="font-size:14px">{{$formatNum(item.deduct_price)}}</span>
                    </span>
                  </template>
                  <div class="collapseBox">
                    <span class="label">操作：</span>
                    <span class="info">
                      <span class="blue"
                        @click="$router.push('/financialStatistics/oprDetail/' + item.client_id + '/' +item.type + '/' + item.id + '/扣款?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)">查看详情</span>
                    </span>
                  </div>
                  <div class="collapseBox">
                    <span class="label">扣款单位：</span>
                    <span class="info">{{item.client_name}} </span>
                  </div>
                  <div class="collapseBox">
                    <span class="label">扣款原因：</span>
                    <span class="info">{{item.desc}}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="deductLogPopupFlag=false">关闭</div>
          <div class="btn btnBlue"
            @click="deductLogPopupFlag=false">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnWhiteBlue"
            @click="deductLogPopupFlag = true">扣款日志</div>
          <div class="btn btnWhiteRed"
            @click="deductPopupFlag = true">单位扣款</div>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, inspection, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      defectiveType: [
        {
          value: '织造原因'
        },
        {
          value: '捻须原因'
        },
        {
          value: '拉毛原因'
        },
        {
          value: '刺毛原因'
        },
        {
          value: '水洗原因'
        },
        {
          value: '车缝原因'
        },
        {
          value: '套口原因'
        },
        {
          value: '整烫原因'
        },
        {
          value: '手工原因'
        },
        {
          value: '其它原因'
        }
      ],
      orderInfo: {
        order_code: '',
        client_name: '',
        user_name: '',
        group_name: '',
        order_time: '',
        order_batch: [],
        desc: ''
      },
      rejects_info: [],
      companyArr: [],
      inspection_detail: [],
      inspection_product: [],
      inspection_data: [],
      inspection_log: [],
      inspection_flag: false,
      rejects_flag: false,
      // 扣款窗口数据
      deductPopupFlag: false,
      clientArr: [],
      deductInfo: {
        client_id: '',
        price: '',
        remark: ''
      },
      deductLogPopupFlag: false,
      deductLogList: []
    }
  },
  watch: {
    inspection_data (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    }
  },
  methods: {
    // 次品原因建议
    querySearchDefective (queryString, cb) {
      let list = this.defectiveType
      let returnList = queryString ? list.filter(item => item.value.indexOf(queryString) !== -1) : list
      cb(returnList)
    },
    // 扣款提交
    clientDeduct () {
      if (!this.deductInfo.client_id) {
        this.$message.error('请选择需要扣款的合作单位')
        return
      }
      if (!this.deductInfo.price) {
        this.$message.error('请填写需要扣除款项的金额')
        return
      }
      chargebacks.create({
        id: null,
        client_id: this.deductInfo.client_id.split('-')[0],
        order_id: JSON.stringify([this.$route.params.id]),
        complete_time: this.$getTime(),
        deduct_price: this.deductInfo.price,
        desc: this.deductInfo.remark,
        order_type: 1,
        type: this.deductInfo.client_id.split('-')[1]
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣款成功')
          this.deductPopupFlag = false
          this.getDeductLog()
        }
      })
    },
    // 获取扣款日志
    getDeductLog () {
      chargebacks.log({
        order_type: 1,
        order_id: this.$route.params.id,
        type: [4, 5]
      }).then((res) => {
        this.deductLogList = res.data.data
      })
    },
    // 批量导出excel
    download () {
      let data = this.inspection_log.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        if (item.rejects_info !== 0) {
          item.rejects_number = item.rejects_info.reduce((total, current) => {
            return total + Number(current.number)
          }, 0)
          item.rejects_infos = ''
          item.rejects_client = ''
          item.rejects_info.forEach((val, key) => {
            // item.rejects_infos += val.reason.join(',')
            item.rejects_infos += val.reason
            item.rejects_client += val.client_id + '<br />'
          })
        } else {
          item.rejects_number = 0
          item.rejects_infos = ''
          item.rejects_client = ''
        }
        return item
      })
      downloadExcel(data, [
        { title: '检验日期', key: 'complete_time' },
        { title: '产品编号', key: 'product_code' },
        { title: '产品品类', key: 'product_types' },
        { title: '尺码', key: 'size_name' },
        { title: '颜色', key: 'color_name' },
        { title: '检验数量', key: 'number' },
        { title: '次品数量', key: 'rejects_number' },
        { title: '次品原因', key: 'rejects_infos' },
        { title: '承担单位', key: 'rejects_client' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    normalInspection (product, colorSize, number) {
      if (number && number <= 0) {
        this.$message.warning('该产品已检验完成')
        return
      }
      this.inspection_flag = true
      this.inspection_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.inspection_detail.find((item) => {
          return item.product_id === product
        }).childrenMergeInfo.map((item) => {
          return {
            name: item.size_name + '/' + item.color_name,
            id: item.size_id + '/' + item.color_id
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          substandard: 0,
          reason: ''
        }],
        date: this.$getTime(new Date())
      })
    },
    easyInspection () {
      if (this.inspection_data.length > 0) {
        this.$message.error('请提交已填写的信息再操作')
        return
      }
      this.inspection_detail.forEach((item) => {
        let filterArr = item.childrenMergeInfo.filter((itemChild) => itemChild.checked)
        if (filterArr.length > 0) {
          this.inspection_data.push({
            product_id: item.product_id,
            colorSizeArr: this.inspection_detail.find((itemFind) => {
              return item.product_id === itemFind.product_id
            }).childrenMergeInfo.map((item) => {
              return {
                name: item.size_name + '/' + item.color_name,
                id: item.size_id + '/' + item.color_id
              }
            }),
            product_info: filterArr.map((itemChild) => {
              return {
                colorSize: itemChild.size_id + '/' + itemChild.color_id,
                number: '',
                count: '',
                substandard: 0,
                reason: ''
              }
            }),
            date: this.$getTime(new Date())
          })
        }
      })
      if (this.inspection_data.length > 0) {
        this.inspection_flag = true
        this.$message.success('请填写检验数量')
      } else {
        this.$message.warning('请选择至少一个配色尺码')
      }
    },
    addInspection () {
      this.inspection_data.push({
        product_id: '',
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          number: '',
          count: '',
          substandard: [{
            number: '',
            reason: [],
            client_id: ''
          }]
        }],
        date: this.$getTime(new Date())
      })
    },
    deleteInspection (index) {
      this.inspection_data.splice(index, 1)
      if (this.inspection_data.length === 0) {
        this.inspection_flag = false
      }
    },
    cancleInspection () {
      this.inspection_data = []
      this.inspection_flag = false
    },
    saveInspection () {
      let errorFlag = false
      let errorMsg = ''
      this.inspection_data.forEach((item) => {
        if (!item.product_id) {
          errorFlag = true
          errorMsg = '请选择产品'
        } else {
          item.product_info.forEach((itemChild) => {
            if (!itemChild.number) {
              errorFlag = true
              errorMsg = '请填写检验数量'
            } else if (!itemChild.colorSize) {
              errorFlag = true
              errorMsg = '请选择尺码颜色'
            }
          })
        }
      })
      if (errorFlag) {
        this.$message.warning(errorMsg)
        return
      }
      let formData = []
      this.inspection_data.forEach((item) => {
        item.product_info.forEach((itemChild) => {
          formData.push({
            order_id: this.$route.params.id,
            product_id: item.product_id,
            size_id: itemChild.colorSize.split('/')[0],
            color_id: itemChild.colorSize.split('/')[1],
            count: itemChild.count,
            number: itemChild.number,
            complete_time: item.date,
            rejects_info: JSON.stringify({
              substandard: itemChild.substandard,
              reason: itemChild.reason
            }),
            desc: item.desc
          })
        })
      })
      inspection.finishedCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('成品检验完成，请刷新页面后查看检验数量更新')
          this.inspection_data = []
          this.inspection_flag = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/inspection/finishedDetail/' + this.$route.params.id
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个成品检验信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/inspection/finishedDetail/' + this.$route.params.id)
            this.$winReload()
          }
        }
      })
    },
    addProduct (index) {
      this.inspection_data[index].product_info.push({
        colorSize: '',
        number: '',
        substandard: 0,
        reason: ''
      })
    },
    deleteProduct (index, indexChild) {
      this.inspection_data[index].product_info.splice(indexChild, 1)
    },
    selectProduct (id, index) {
      this.inspection_data[index].colorSizeArr = this.inspection_detail.find((item) => {
        return item.product_id === id
      }).childrenMergeInfo.map((item) => {
        return {
          name: item.size_name + '/' + item.color_name,
          id: item.size_id + '/' + item.color_id
        }
      })
    },
    addSubstandard (index, indexChild) {
      this.inspection_data[index].product_info[indexChild].substandard.push({
        number: '',
        reason: [],
        reasonDesc: '' // 次品备注
      })
    },
    deleteSubstandard (index, indexChild, indexSon) {
      this.inspection_data[index].product_info[indexChild].substandard.splice(index, 1)
    },
    rejectsDetail (detail) {
      this.rejects_info = detail
      this.rejects_flag = true
    },
    deleteLog (id, index) {
      this.$confirm('是否要删除此日志', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          inspection.finishedDelete({
            id: this.inspection_log.filter(item => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.$winReload()
            }
          })
        } else {
          inspection.finishedDelete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功，请刷新页面后查看检验数量变化')
              this.inspection_log.splice(index, 1)
              this.$winReload()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    commonFind (findArr, compare, findWhich, addWhich) {
      if (typeof (findWhich) === 'string') {
        return findArr.find((itemFind) => {
          return itemFind[findWhich] === compare[itemFind]
        })
      } else if (findWhich.constructor === Array) {
        let finded = findArr.find((itemFind) => {
          let flag = true
          findWhich.forEach((item) => {
            if (compare[item] !== itemFind[item]) {
              flag = false
            }
          })
          return flag
        })
        if (!finded) {
          findArr.push(compare)
        } else {
          if (addWhich.constructor === Array) {
            addWhich.forEach((item) => {
              finded[item] += Number(compare[item])
            })
          }
        }
      } else {
        console.error('第三个参数必须为字符串或数组格式')
      }
    },
    getAllColorSize (ev, item) {
      item.childrenMergeInfo.forEach((itemChild) => {
        itemChild.checked = ev
      })
    }
  },
  mounted () {
    this.getDeductLog()
    Promise.all([
      order.detail({
        id: this.$route.params.id
      }),
      inspection.finishedDetail({
        order_id: this.$route.params.id,
        order_type: 1
      })
    ]).then((res) => {
      this.orderInfo = res[0].data.data
      // this.inspection_detail = this.$mergeData(res[1].data.data.product_info, { mainRule: 'product_id', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'product_code' }] })
      // this.companyArr = res[1].data.data.filter((item) => {
      //   return item.type.indexOf(5) !== -1
      // })
      // this.inspection_log = res[3].data.data.map(item => {
      //   let flag = false
      //   // 检查是否有次品
      //   JSON.parse(item.rejects_info).forEach((itemChild) => {
      //     if (Number(itemChild.number) > 0) {
      //       flag = true
      //     }
      //   })
      //   if (flag) {
      //     item.rejects_info = JSON.parse(item.rejects_info)
      //   } else {
      //     item.rejects_info = 0
      //   }
      //   let productInfo = this.inspection_detail.find(value => value.product_id === item.product_id)
      //   return {
      //     ...item,
      //     product_code: productInfo ? productInfo.product_code : '',
      //     product_types: productInfo ? [productInfo.category_name, productInfo.type_name, productInfo.style_name].join('/') : '',
      //     checked: false
      //   }
      // })
      // this.clientArr = this.$unique(res[4].data.data.map(item => {
      //   return {
      //     client_name: item.client_name,
      //     client_id: item.client_id,
      //     type: 4
      //   }
      // }), 'client_id').concat(this.$unique(res[5].data.data.map(item => {
      //   return {
      //     client_name: item.client_name,
      //     client_id: item.client_id,
      //     type: 5
      //   }
      // }), 'client_id'))
      let allocationList = []
      this.orderInfo.batch_info.forEach((itemBatch) => {
        itemBatch.product_info.forEach((itemPro) => {
          this.commonFind(allocationList, itemPro, ['color_id', 'size_id', 'product_id'], ['numbers'])
        })
      })
      allocationList = allocationList.sort((a, b) => (a.color_id - b.color_id))
      this.inspection_detail = this.$mergeData(allocationList.map((item) => {
        item.category_name = item.category_info.category_name
        item.type_name = item.category_info.type_name
        item.style_name = item.category_info.style_name
        return item
      }), { mainRule: 'product_id', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'category_info' }, { name: 'product_code' }] })
      this.inspection_log = res[1].data.data
      this.inspection_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          let findArr = this.inspection_log.filter((itemFilter) => {
            return itemFilter.product_id === item.product_id && itemFilter.size_id === itemChild.size_id && itemFilter.color_id === itemChild.color_id
          })
          itemChild.inspectionNum = findArr.reduce((total, current) => {
            return total + current.number
          }, 0)
          itemChild.rejectNum = findArr.reduce((total, current) => {
            return total + (JSON.parse(current.rejects_info).substandard === 0 ? 0 : JSON.parse(current.rejects_info).substandard)
          }, 0)
        })
      })
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/inspection/finishedDetail.less";
</style>
<style lang="less">
#finishedDetail {
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
      margin: 12px;
    }
  }
}
</style>
