<template>
  <div id="semiFinishedDetail"
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
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
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
        <span class="title">半成品检验</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">织造单位</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">织造数量</div>
                      <div class="tcolumn">检验数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weave_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <span>{{itemChild.product_info.code}}</span>
                        <span>{{itemChild.category_info.category_name?itemChild.category_info.category_name+'/'+ itemChild.category_info.type_name+'/'+ itemChild.category_info.style_name:itemChild.product_info.name}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size}}/{{itemChild.color}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div>
                      <div class="tcolumn"
                        :class="{'green':itemChild.inspectionNum>=itemChild.number,'orange':itemChild.inspectionNum<itemChild.number}">{{itemChild.inspectionNum}}</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="normalInspection(item.client_id,itemChild.product_id,itemChild.size + '/' + itemChild.color,itemChild.number - itemChild.inspectionNum)">检验</span>
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
                        <el-option v-for="item in inspection_product"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_info.code + '('+(item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name) +')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">织造单位</span>
                      <span class="explanation">(选填，没有选项时可以在备注栏填写)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-select v-model="item.client_id"
                          placeholder="请选择织造单位"
                          filterable>
                          <el-option v-for="item in companyArr"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  style="background:#f0f0f0"
                  v-for="(itemChild,indexChild) in item.product_info"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">尺码颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select placeholder="请选择尺码颜色"
                        no-data-text="请先选择产品"
                        v-model="itemChild.colorSize">
                        <el-option v-for="(item,index) in item.colorSizeArr"
                          :key="index"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
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
                    <div class="label">
                      <span class="text">捆数</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入检验捆数"
                        v-model="itemChild.count">
                        <template slot="append">捆</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addProduct(index)">添加产品</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteProduct(index,indexChild)">删除产品</div>
                  </div>
                  <div class="rowCtn width100"
                    v-for="(itemSon,indexSon) in itemChild.substandard"
                    :key="indexSon">
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexSon===0">
                        <span class="text">次品数量</span>
                      </div>
                      <div class="content">
                        <zh-input type="number"
                          placeholder="请输入次品数量"
                          v-model="itemSon.number"></zh-input>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexSon===0">
                        <span class="text">次品原因</span>
                        <span class="explanation">(多选)</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemSon.reason"
                          placeholder="请选择次品原因"
                          multiple>
                          <el-option v-for="(item,index) in defectiveType"
                            :key="index"
                            :label="item"
                            :value="item"></el-option>
                        </el-select>
                      </div>
                      <div class="editBtn addBtn"
                        v-if="indexSon===0"
                        @click="addSubstandard(index,indexChild)">添加次品</div>
                      <div class="editBtn deleteBtn"
                        v-if="indexSon>0"
                        @click="deleteSubstandard(index,indexChild,indexSon)">删除次品</div>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">检验日期</span>
                      <span class="explanation">(默认今天)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-date-picker v-model="item.date"
                          value-format="yyyy-MM-dd"
                          style="width:100%"
                          type="date"
                          placeholder='选择检验日期'>
                        </el-date-picker>
                      </div>
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
                  v-if="!inspection_flag"
                  @click="normalInspection()">普通检验</span>
                <span class="once"
                  v-if="!inspection_flag"
                  @click="easyInspection">一键检验</span>
                <span class="once cancle"
                  v-if="inspection_flag"
                  @click="cancleInspection">取消检验</span>
                <span class="once normal"
                  v-if="inspection_flag"
                  @click="addInspection">添加织造单位</span>
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
    <!-- <div class="module log">
      <div class="titleCtn">
        <span class="title">半成品检验日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.2">检验日期</div>
                  <div class="tcolumn"
                    style="flex:1.5">织造单位</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn"
                    style="flex:1.2">尺码颜色</div>
                  <div class="tcolumn">检验数量</div>
                  <div class="tcolumn"
                    style="flex:1.5">次品信息</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in inspection_log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.2">{{item.complete_time}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">{{item.client_name}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">{{item.product_name}}</div>
                  <div class="tcolumn"
                    style="flex:1.2">{{item.size + '/' + item.color}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">
                    <span class="green"
                      v-if="item.rejects_info===0">无次品</span>
                    <span class="blue"
                      v-if="item.rejects_info!==0"
                      @click="rejectsDetail(item.rejects_info)">有次品(查看)</span>
                  </div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn">
                    <span style="cursor:pointer;color:#F5222D"
                      @click="deleteLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="module">
      <div class="titleCtn">
        <span class="title">半成品检验日志</span>
      </div>
      <div class="listCtn hasBorderTop">
        <!-- <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.2">检验日期</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn"
                    style="flex:1.2">尺码颜色</div>
                  <div class="tcolumn">检验数量</div>
                  <div class="tcolumn"
                    style="flex:1.5">次品信息</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in inspection_log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.2">{{item.complete_time}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn"
                    style="flex:1.2">{{item.size + '/' + item.color}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">
                    <span class="green"
                      v-if="item.rejects_info===0">无次品</span>
                    <span class="blue"
                      v-if="item.rejects_info!==0"
                      @click="rejectsDetail(item.rejects_info)">有次品(查看)</span>
                  </div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">
                    <span class="red"
                      @click="deleteLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div> -->
        <div class="btnCtn_page">
          <!-- <div class="btn noBorder noMargin"
            @click="deleteLog('all',orderLog)">批量删除</div> -->
          <div class="btn noBorder noMargin"
            @click="download">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">检验日期</span>
            <span class="tb_row">织造单位</span>
            <span class="tb_row flex12">产品名称</span>
            <span class="tb_row">尺码颜色</span>
            <span class="tb_row flex08">检验数量</span>
            <span class="tb_row flex12">次品信息</span>
            <span class="tb_row flex08">备注</span>
            <span class="tb_row flex08 middle">操作人</span>
            <span class="tb_row flex08 middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in inspection_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{item.complete_time}}</span>
            <span class="tb_row">{{item.client_name}}</span>
            <span class="tb_row flex12">{{item.product_name}}</span>
            <span class="tb_row">{{item.size}}/{{item.color}}</span>
            <span class="tb_row flex08">{{item.number}}</span>
            <span class="tb_row flex12">
              <span class="green"
                v-if="item.rejects_info===0">无次品</span>
              <span class="blue"
                v-if="item.rejects_info!==0"
                @click="rejectsDetail(item.rejects_info)">有次品(查看)</span>
            </span>
            <span class="tb_row flex08">{{item.desc}}</span>
            <span class="tb_row flex08 middle">{{item.user_name}}</span>
            <span class="tb_row flex08 middle">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, weave, inspection, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      // 次品原因
      defectiveType: ['跳线', '污迹', '经纬断线', '严重破损', '边型问题', '流苏问题', '颜色问题', '花型问题', '款型问题', '克重问题', '长度问题', '工序问题', '质量问题', '加工问题', '其他问题'],
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
      companyArr: [],
      weave_detail: [],
      inspection_detail: [],
      inspection_product: [],
      inspection_data: [],
      inspection_log: [],
      rejects_flag: false,
      rejects_info: [{
        number: '',
        reason: []
      }],
      inspection_flag: false
    }
  },
  methods: {
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
            item.rejects_infos += val.reason.join(',')
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
        { title: '织造单位', key: 'client_name' },
        { title: '产品名称', key: 'product_name' },
        { title: '尺码', key: 'size' },
        { title: '颜色', key: 'color' },
        { title: '检验数量', key: 'number' },
        { title: '次品数量', key: 'rejects_number' },
        { title: '次品原因', key: 'rejects_infos' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    normalInspection (client, product, colorSize, number) {
      if (number && number <= 0) {
        this.$message.warning('该产品已检验完成')
        return
      }
      this.inspection_flag = true
      this.inspection_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.inspection_product.find((item) => {
          return item.product_id === product
        }).childrenMergeInfo.map((item) => {
          return {
            name: item.size + '/' + item.color
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: '',
          substandard: [{
            number: 0,
            reason: [],
            reasonDesc: '' // 次品备注
          }]
        }],
        client_id: client ? client.toString() : '',
        date: this.$getTime(new Date())
      })
    },
    easyInspection () {
      this.weave_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          if ((itemChild.number - itemChild.inspectionNum) > 0) {
            this.inspection_data.push({
              product_id: itemChild.product_id,
              colorSizeArr: this.inspection_product.find((item) => {
                return item.product_id === itemChild.product_id
              }).childrenMergeInfo.map((item) => {
                return {
                  name: item.size + '/' + item.color
                }
              }),
              product_info: [{
                colorSize: itemChild.size + '/' + itemChild.color,
                number: itemChild.number - itemChild.inspectionNum,
                count: '',
                substandard: [{
                  number: 0,
                  reason: []
                }]
              }],
              client_id: item.client_id.toString(),
              date: this.$getTime(new Date())
            })
          }
        })
      })
      if (this.inspection_data.length > 0) {
        this.inspection_flag = true
      } else {
        this.$message.warning('产品已全部检验完毕')
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
            reason: []
          }]
        }],
        client_id: '',
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
            order_type: 1,
            order_id: this.$route.params.id,
            product_id: item.product_id,
            size: itemChild.colorSize.split('/')[0],
            color: itemChild.colorSize.split('/')[1],
            client_id: item.client_id,
            count: itemChild.count,
            number: itemChild.number,
            rejects_info: JSON.stringify(itemChild.substandard),
            complete_time: item.date,
            desc: item.desc
          })
        })
      })
      inspection.semiFinishedCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('半成品检验完成，请刷新页面后查看检验数量更新')
          this.inspection_data = []
          this.inspection_flag = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/inspection/semiFinishedDetail/' + this.$route.params.id
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个半成品检验信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/inspection/semiFinishedDetail/' + this.$route.params.id)
          }
        }
      })
    },
    addProduct (index) {
      this.inspection_data[index].product_info.push({
        colorSize: '',
        number: '',
        count: '',
        substandard: [{
          number: '',
          reason: [],
          reasonDesc: '' // 次品备注
        }]
      })
    },
    deleteProduct (index, indexChild) {
      this.inspection_data[index].product_info.splice(indexChild, 1)
    },
    selectProduct (id, index) {
      this.inspection_data[index].colorSizeArr = this.inspection_product.find((item) => {
        return item.product_id === id
      }).childrenMergeInfo.map((item) => {
        return {
          name: item.size + '/' + item.color
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
      console.log(detail)
      this.rejects_info = detail
      this.rejects_flag = true
    },
    deleteLog (id, index) {
      this.$confirm('是否要删除此日志', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        inspection.semiFinishedDelete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功，请刷新页面后查看检验数量变化')
            this.inspection_log.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    Promise.all([order.detail({
      id: this.$route.params.id
    }), weave.detail({
      order_id: this.$route.params.id,
      order_type: 1
    }), client.list(), inspection.semiFinishedDetail({
      order_id: this.$route.params.id,
      order_type: 1
    })]).then((res) => {
      this.orderInfo = res[0].data.data
      let mergeData = []
      res[1].data.data.forEach((item) => {
        let finded = mergeData.find((itemFind) => itemFind.size === item.size && itemFind.color === item.color && itemFind.product_info.code === item.product_info.code && itemFind.client_id === item.client_id)
        if (finded) {
          finded.number += item.number
        } else {
          mergeData.push(item)
        }
      })
      this.weave_detail = this.$mergeData(mergeData, { mainRule: 'client_name', otherRule: [{ name: 'client_id' }] })
      this.inspection_product = this.$mergeData(res[1].data.data, { mainRule: 'product_id', otherRule: [{ name: 'category_info' }, { name: 'product_info' }] })
      this.companyArr = res[2].data.data.filter((item) => {
        return item.type.indexOf(4) !== -1
      })
      this.inspection_log = res[3].data.data
      this.inspection_log.forEach((item) => {
        let flag = false
        // 检查是否有次品
        JSON.parse(item.rejects_info).forEach((itemChild) => {
          if (Number(itemChild.number) > 0) {
            flag = true
          }
        })
        if (flag) {
          item.rejects_info = JSON.parse(item.rejects_info)
        } else {
          item.rejects_info = 0
        }
      })
      console.log(this.weave_detail)
      this.weave_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.inspectionNum = this.inspection_log.filter((itemFilter) => {
            return itemFilter.product_id === itemChild.product_id && itemFilter.size === itemChild.size && itemFilter.color === itemChild.color && itemFilter.client_id === item.client_id
          }).reduce((total, current) => {
            return total + current.number
          }, 0)
        })
      })
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/inspection/semiFinishedDetail.less";
</style>
