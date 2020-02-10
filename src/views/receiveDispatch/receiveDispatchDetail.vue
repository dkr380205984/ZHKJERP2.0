<template>
  <div id="receiveDispatchDetail"
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
        <span class="title">织造入库</span>
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
                      <div class="tcolumn">分配数量</div>
                      <div class="tcolumn">入库数量</div>
                      <div class="tcolumn">截止日期</div>
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
                      <div class="tcolumn">{{itemChild.inNum}}</div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="normalWeave(item.client_id,itemChild.product_id,itemChild.size + '/' + itemChild.color,itemChild.number-itemChild.inNum)">入库</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in weave_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteWeave(index)">
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
                        placeholder="请选择入库产品"
                        @change="selectProduct($event,index,'weave_data')">
                        <el-option v-for="item in weave_product"
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
                          <el-option v-for="item in weave_company"
                            :key="item.id"
                            :value="Number(item.id)"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
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
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">入库数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入入库数量"
                        v-model="itemChild.number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">捆数</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入入库捆数"
                        v-model="itemChild.count">
                        <template slot="append">捆</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addColorSize('weave_data',index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteColorSize('weave_data',index,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">入库日期</span>
                      <span class="explanation">(默认今天)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-date-picker v-model="item.date"
                          value-format="yyyy-MM-dd"
                          style="width:100%"
                          type="date"
                          placeholder="选择入库日期">
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
                  v-if="!weave_flag"
                  @click="normalWeave()">普通入库</span>
                <span class="once"
                  v-if="!weave_flag"
                  @click="easyWeave">一键入库</span>
                <span class="once cancle"
                  v-if="weave_flag"
                  @click="cancleWeave">取消入库</span>
                <span class="once normal"
                  v-if="weave_flag"
                  @click="addWeave">添加织造单位</span>
                <span class="once ok"
                  v-if="weave_flag"
                  @click="saveWeave">确认入库
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">半成品加工出入库</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">加工单位</div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">工序</div>
                      <div class="tcolumn">分配数量</div>
                      <div class="tcolumn">出库数量</div>
                      <div class="tcolumn">入库数量</div>
                      <div class="tcolumn">截止日期</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <span>{{itemChild.product_info.code}}</span>
                        <span>{{itemChild.category_info.category_name?itemChild.category_info.category_name+'/'+ itemChild.category_info.type_name+'/'+ itemChild.category_info.style_name:itemChild.product_info.name}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size}}/{{itemChild.color}}</div>
                      <div class="tcolumn">{{itemChild.type}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div>
                      <div class="tcolumn">{{itemChild.outNum}}</div>
                      <div class="tcolumn">{{itemChild.inNum}}</div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                      <div class="tcolumn"
                        style="flex-direction:row;align-items:center;justify-content:start">
                        <span class="btn noBorder"
                          style="padding:0;margin:0 16px 0 0"
                          @click="processIn(item.client_id,itemChild.product_id,itemChild.size + '/' + itemChild.color,itemChild.number-itemChild.inNum,itemChild.type)">入库</span>
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="processOut(item.client_id,itemChild.product_id,itemChild.size + '/' + itemChild.color,itemChild.number-itemChild.outNum,itemChild.type)">出库</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in process_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteProcess(index)">
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
                        :placeholder="'请选择'+process_type+'产品'"
                        @change="selectProduct($event,index,'process_data')">
                        <el-option v-for="item in process_product"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_info.code + '('+(item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name) +')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">加工单位</span>
                      <span class="explanation">(选填，没有选项时可以在备注栏填写)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-select v-model="item.client_id"
                          placeholder="请选择加工单位"
                          filterable>
                          <el-option v-for="item in process_company"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">{{process_type}}工序</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <!-- <el-input :placeholder="'请输入'+process_type+'工序'"
                          v-model="item.production_type"></el-input> -->
                        <el-autocomplete v-model="item.production_type"
                          :fetch-suggestions="querySearchProcess"
                          :placeholder="'请输入'+process_type+'工序'"></el-autocomplete>
                      </div>
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
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">{{process_type}}数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        :placeholder="'请输入'+process_type+'数量'"
                        v-model="itemChild.number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">捆数</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入入库捆数"
                        v-model="itemChild.count">
                        <template slot="append">件</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addColorSize('process_data',index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteColorSize('process_data',index,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">{{process_type}}日期</span>
                      <span class="explanation">(默认今天)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-date-picker v-model="item.date"
                          value-format="yyyy-MM-dd"
                          style="width:100%"
                          type="date"
                          :placeholder="'选择'+process_type+'日期'">
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
                  v-if="!process_flag"
                  @click="processIn()">入库</span>
                <span class="once"
                  v-if="!process_flag"
                  @click="processOut()">出库</span>
                <span class="once cancle"
                  v-if="process_flag"
                  @click="cancleProcess">取消{{process_type}}</span>
                <span class="once normal"
                  v-if="process_flag"
                  @click="addProcess">添加加工单位</span>
                <span class="once ok"
                  v-if="process_flag"
                  @click="saveProcess">确认{{process_type}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">产品出入库日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <!-- <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.2">操作日期</div>
                  <div class="tcolumn">加工单位</div>
                  <div class="tcolumn">收发类型</div>
                  <div class="tcolumn"
                    style="flex:2">产品信息</div>
                  <div class="tcolumn">尺码颜色</div>
                  <div class="tcolumn">捆数</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.2">{{item.complete_time.slice(0,10)}}</div>
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn">{{item.flag}}</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <span>{{item.product_code.code}}</span>
                    <span>{{item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name}}</span>
                  </div>
                  <div class="tcolumn">
                    <span>{{item.size}}</span>
                    <span>{{item.color}}</span>
                  </div>
                  <div class="tcolumn">{{item.count}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteLog(item.id,item.flag,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div class="rowCtn">
          <div class="colCtn"
            style="margin:10px 32px">
            <div class="tableCtnLv2">
              <span class="tb_btn top_right">
                <div class="btn noBorder"
                  @click="printTag">打印收发标签</div>
              </span>
              <span class="tb_header">
                <span class="tb_row"
                  style="flex:0.4"></span>
                <span class="tb_row"
                  style="flex:1.2">操作日期</span>
                <span class="tb_row">加工单位</span>
                <span class="tb_row">收发类型</span>
                <span class="tb_row"
                  style="flex:1.8">产品信息</span>
                <span class="tb_row">尺码颜色</span>
                <span class="tb_row">捆数</span>
                <span class="tb_row">数量</span>
                <span class="tb_row">备注</span>
                <span class="tb_row">操作人</span>
                <span class="tb_row middle">操作</span>
              </span>
              <span class="tb_content"
                v-for="(item,index) in log"
                :key="index">
                <span class="tb_row"
                  style="flex:0.4">
                  <el-checkbox v-model="item.checked"
                    @change="handleClickLog(item)"></el-checkbox>
                </span>
                <span class="tb_row"
                  style="flex:1.2">{{$getTime(item.complete_time)}}</span>
                <span class="tb_row">{{item.client_name}}</span>
                <span class="tb_row">{{item.flag}}</span>
                <span class="tb_row"
                  style="flex:1.8">
                  {{item.product_code.code}}
                  <br />
                  {{item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name}}
                </span>
                <span class="tb_row">
                  {{item.size}}
                  <br />
                  {{item.color}}
                </span>
                <span class="tb_row">{{item.count}}</span>
                <span class="tb_row">{{item.number}}</span>
                <span class="tb_row">{{item.desc}}</span>
                <span class="tb_row">{{item.user_name}}</span>
                <span class="tb_row middle">
                  <span class="tb_handle_btn red"
                    @click="deleteLog(item.id,item.flag,index)">删除</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, weave, processing, client, receive, dispatch, process } from '@/assets/js/api.js'
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
      weave_detail: [],
      process_detail: [],
      weave_data: [],
      process_data: [],
      weave_product: [],
      process_product: [],
      weave_company: [],
      process_company: [],
      weave_flag: false,
      easyWeave_flag: false,
      process_flag: false,
      process_type: '入库',
      log: []
    }
  },
  methods: {
    // 批量导出excel
    download () {
      let data = this.log.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.product_types = [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/')
        item.product_code = item.product_code.code
        return item
      })
      downloadExcel(data, [
        { title: '操作日期', key: 'complete_time' },
        { title: '加工单位', key: 'client_name' },
        { title: '收发类型', key: 'flag' },
        { title: '产品编号', key: 'product_code' },
        { title: '产品品类', key: 'product_types' },
        { title: '尺码', key: 'size' },
        { title: '颜色', key: 'color' },
        { title: '件数', key: 'count' },
        { title: '数量', key: 'number' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    printTag () {
      if (this.log.filter(item => item.checked).length > 1) {
        this.$message.warning('该功能仅限单个日志打印')
        return
      }
      let flag = this.log.find(items => items.checked)
      if (flag) {
        this.$openUrl('/receiveDispatchTable/' + this.$route.params.id + '?logId=' + flag.id + '&type=' + (flag.flag === '入库' ? 1 : 2))
      } else {
        this.$message.warning('请勾选您需要打印成标签的日志')
      }
    },
    querySearchProcess (queryString, cb) {
      var restaurants = this.processTypeList
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    normalWeave (client, product, colorSize, number) {
      this.weave_flag = true
      this.weave_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.weave_product.find((item) => {
          return item.product_id === product
        }).childrenMergeInfo.map((item) => {
          return {
            name: item.size + '/' + item.color
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: ''
        }],
        client_id: client ? client.toString() : '',
        date: this.$getTime(new Date()),
        desc: ''
      })
    },
    easyWeave () {
      this.weave_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          this.weave_data.push({
            product_id: itemChild.product_id,
            colorSizeArr: this.weave_product.find((item) => {
              return item.product_id === itemChild.product_id
            }).childrenMergeInfo.map((item) => {
              return {
                name: item.size + '/' + item.color
              }
            }),
            product_info: [{
              colorSize: itemChild.size + '/' + itemChild.color,
              number: itemChild.number - itemChild.inNum,
              count: ''
            }],
            desc: '',
            client_id: item.client_id,
            date: this.$getTime(new Date())
          })
        })
      })
      this.weave_flag = true
    },
    addWeave () {
      this.weave_data.push({
        product_id: '',
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          number: '',
          count: ''
        }],
        desc: '',
        client_id: '',
        date: this.$getTime(new Date())
      })
    },
    deleteWeave (index) {
      this.weave_data.splice(index, 1)
      if (this.weave_data.length === 0) {
        this.weave_flag = false
      }
    },
    cancleWeave () {
      this.weave_data = []
      this.weave_flag = false
    },
    saveWeave () {
      let errorFlag = false
      let errorMsg = ''
      this.weave_data.forEach((item) => {
        if (!item.product_id) {
          errorFlag = true
          errorMsg = '请选择产品信息'
        } else if (!item.date) {
          errorFlag = true
          errorMsg = '请选择入库日期'
        }
        item.product_info.forEach((itemChild) => {
          if (!itemChild.colorSize) {
            errorFlag = true
            errorMsg = '请选择尺码颜色'
          } else if (!itemChild.number) {
            errorFlag = true
            errorMsg = '请输入入库数量'
          }
        })
      })
      if (errorFlag) {
        this.$message.error(errorMsg)
        return
      }
      let formData = []
      this.weave_data.forEach((item) => {
        item.product_info.forEach((itemChild) => {
          formData.push({
            order_id: this.$route.params.id,
            order_type: 1,
            product_id: item.product_id,
            type: 1, // 类型，1 织造 2 加工
            client_id: item.client_id,
            size: itemChild.colorSize.split('/')[0],
            color: itemChild.colorSize.split('/')[1],
            count: itemChild.count,
            number: itemChild.number,
            complete_time: item.date,
            production_type: '织造',
            desc: item.desc
          })
        })
      })
      receive.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功，刷新页面后更新入库数量')
          this.weave_data = []
          this.weave_flag = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个织造入库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id)
          }
        }
      })
    },
    addColorSize (data, index) {
      this[data][index].product_info.push({
        colorSize: '',
        number: '',
        count: ''
      })
    },
    deleteColorSize (data, index, indexChild) {
      this[data][index].product_info.splice(index, 1)
    },
    selectProduct (id, index, data) {
      this[data][index].colorSizeArr = this.weave_product.find((item) => {
        return item.product_id === id
      }).childrenMergeInfo.map((item) => {
        return {
          name: item.size + '/' + item.color
        }
      })
    },
    processIn (client, product, colorSize, number, type) {
      this.process_type = '入库'
      this.process_flag = true
      this.process_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.process_product.find((item) => {
          return item.product_id === product
        }).childrenMergeInfo.map((item) => {
          return {
            name: item.size + '/' + item.color
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: ''
        }],
        production_type: type, // 工序
        client_id: client ? client.toString() : '',
        date: this.$getTime(new Date()),
        desc: ''
      })
    },
    processOut (client, product, colorSize, number, type) {
      this.process_type = '出库'
      this.process_flag = true
      this.process_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.process_product.find((item) => {
          return item.product_id === product
        }).childrenMergeInfo.map((item) => {
          return {
            name: item.size + '/' + item.color
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: ''
        }],
        production_type: type, // 工序
        client_id: client ? client.toString() : '',
        date: this.$getTime(new Date()),
        desc: ''
      })
    },
    cancleProcess () {
      this.process_data = []
      this.process_flag = false
    },
    addProcess () {
      this.process_data.push({
        product_id: '',
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          number: '',
          count: ''
        }],
        production_type: '',
        client_id: '',
        date: this.$getTime(new Date())
      })
    },
    deleteProcess (index) {
      this.process_data.splice(index, 1)
      if (this.process_data.length === 0) {
        this.process_flag = false
      }
    },
    saveProcess () {
      let errorFlag = false
      let errorMsg = ''
      this.process_data.forEach((item) => {
        if (!item.product_id) {
          errorFlag = true
          errorMsg = '请选择产品信息'
        } else if (!item.date) {
          errorFlag = true
          errorMsg = '请选择入库日期'
        }
        item.product_info.forEach((itemChild) => {
          if (!itemChild.colorSize) {
            errorFlag = true
            errorMsg = '请选择尺码颜色'
          } else if (!itemChild.number) {
            errorFlag = true
            errorMsg = '请输入数量'
          }
        })
      })
      if (errorFlag) {
        this.$message.error(errorMsg)
        return
      }
      let formData = []
      this.process_data.forEach((item) => {
        item.product_info.forEach((itemChild) => {
          formData.push({
            order_id: this.$route.params.id,
            order_type: 1,
            product_id: item.product_id,
            type: 2, // 类型，1 织造 2 加工
            client_id: item.client_id,
            size: itemChild.colorSize.split('/')[0],
            color: itemChild.colorSize.split('/')[1],
            count: itemChild.count,
            number: itemChild.number,
            complete_time: item.date,
            production_type: item.production_type,
            desc: item.desc
          })
        })
      })
      if (this.process_type === '入库') {
        receive.create({ data: formData }).then((res) => {
          if (res.data.status) {
            this.$message.success('入库成功，刷新页面后更新入库数量')
            this.process_data = []
            this.process_flag = false
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id
              this.msgContent = '<span style="color:#1A95FF">添加</span>了一个半成品加工入库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.$router.push('/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id)
            }
          }
        })
      } else {
        dispatch.create({ data: formData }).then((res) => {
          if (res.data.status) {
            this.$message.success('出库成功，刷新页面后更新出库数量')
            this.process_data = []
            this.process_flag = false
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id
              this.msgContent = '<span style="color:#1A95FF">添加</span>了一个半成品加工出库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.$router.push('/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id)
            }
          }
        })
      }
    },
    deleteLog (id, flag, index) {
      if (flag === '入库') {
        receive.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功，请刷新页面后查看入库变化')
            this.log.splice(index, 1)
          }
        })
      } else {
        dispatch.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功，请刷新页面后查看入库变化')
            this.log.splice(index, 1)
          }
        })
      }
    }
  },
  mounted () {
    Promise.all([order.detail({
      id: this.$route.params.id
    }), weave.detail({
      order_id: this.$route.params.id,
      order_type: 1
    }), processing.detail({
      order_id: this.$route.params.id,
      order_type: 1
    }), client.list(),
    receive.detail({
      order_id: this.$route.params.id,
      order_type: 1
    }), dispatch.detail({
      order_id: this.$route.params.id,
      order_type: 1
    }), process.list()]).then((res) => {
      this.orderInfo = res[0].data.data
      this.weave_detail = this.$mergeData(res[1].data.data, { mainRule: 'client_name', otherRule: [{ name: 'client_id' }] })
      this.process_detail = this.$mergeData(res[2].data.data, { mainRule: 'client_name', otherRule: [{ name: 'client_id' }] })
      this.weave_product = this.$mergeData(res[1].data.data, { mainRule: 'product_id', otherRule: [{ name: 'category_info' }, { name: 'product_info' }] })
      this.process_product = this.$mergeData(res[2].data.data, { mainRule: 'product_id', otherRule: [{ name: 'category_info' }, { name: 'product_info' }] })
      this.weave_company = res[3].data.data.filter((item) => {
        return item.type.indexOf(4) !== -1
      })
      this.process_company = res[3].data.data.filter((item) => {
        return item.type.indexOf(5) !== -1
      })
      res[4].data.data.forEach((item) => {
        item.flag = '入库'
        item.checked = false
        this.log.push(item)
      })
      res[5].data.data.forEach((item) => {
        item.flag = '出库'
        item.checked = false
        this.log.push(item)
      })
      this.weave_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.inNum = res[4].data.data.filter((itemFilter) => {
            return itemChild.product_id === itemFilter.product_id && itemFilter.size === itemChild.size && itemFilter.color === itemChild.color && itemFilter.client_name === item.client_name
          }).reduce((total, current) => {
            return total + current.number
          }, 0)
        })
      })
      this.process_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.inNum = res[4].data.data.filter((itemFilter) => {
            return itemChild.product_id === itemFilter.product_id && itemFilter.size === itemChild.size && itemFilter.color === itemChild.color && itemFilter.client_name === item.client_name
          }).reduce((total, current) => {
            return total + current.number
          }, 0)
        })
      })
      this.process_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.outNum = res[5].data.data.filter((itemFilter) => {
            return itemChild.product_id === itemFilter.product_id && itemFilter.size === itemChild.size && itemFilter.color === itemChild.color && itemFilter.client_name === item.client_name
          }).reduce((total, current) => {
            return total + current.number
          }, 0)
        })
      })
      this.processTypeList = res[6].data.data.filter(item => item.type === 2).map(item => {
        return {
          value: item.name
        }
      })
      if (this.$route.query.logId && this.$route.query.type === '1') {
        let flag = res[4].data.data.find(item => Number(item.id) === Number(this.$route.query.logId))
        this.process_type = '出库'
        this.process_flag = true
        if (flag) {
          this.process_data.push({
            client_id: '',
            colorSizeArr: [],
            date: this.$getTime(flag.complete_time),
            desc: flag.desc,
            product_id: flag.product_id,
            product_info: [{
              colorSize: [flag.size, flag.color].join('/'),
              count: flag.count,
              number: flag.number
            }],
            production_type: flag.production_type
          })
          this.selectProduct(flag.product_id, 0, 'process_data')
        }
      } else if (this.$route.query.logId && this.$route.query.type === '2') {
        let flag = res[5].data.data.find(item => Number(item.id) === Number(this.$route.query.logId))
        this.process_type = '入库'
        this.process_flag = true
        if (flag) {
          this.process_data.push({
            client_id: '',
            colorSizeArr: [],
            date: this.$getTime(flag.complete_time),
            desc: flag.desc,
            product_id: flag.product_id,
            product_info: [{
              colorSize: [flag.size, flag.color].join('/'),
              count: flag.count,
              number: flag.number
            }],
            production_type: flag.production_type
          })
          this.selectProduct(flag.product_id, 0, 'process_data')
        }
      }
      this.loading = false
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/receiveDispatch/receiveDispatchDetail.less";
</style>
