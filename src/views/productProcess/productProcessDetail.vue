<template>
  <div id="productProcessDetail"
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
    <div class="module processCtn">
      <div class="process hover"
        v-for="(item,index) in processChoose"
        :key="index"
        :class="{'active':processType===item}"
        @click="getModule(item)">
        <span class="sort">{{index+1}}</span>
        <span class="name">{{item}}</span>
      </div>
      <div class="process">
        <el-dropdown trigger="click"
          @command="createProcess">
          <div>
            <span class="sort"
              style="color:#1a95ff;border-color:#1a95ff"><i class="el-icon-plus"></i></span>
            <span class="name"
              style="font-size:16px;color:#1a95ff">新增工序</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in processArr"
              :key="item.id"
              :command="item.label">{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="module progress">
      <div class="line1"
        style="color:#E6A23C">{{rate.insNum}}/{{rate.allNum}}</div>
      <div class="line2"
        style="overflow:hidden">
        <div class="rate"
          :style="{'width':(rate.insNum/rate.allNum*100).toFixed(2)+'%'}"></div>
      </div>
      <div class="line3">
        完成度：<span style="color:#01B48C">{{(rate.insNum/rate.allNum*100).toFixed(2)}}%</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">下单信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow">
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">下单数量</div>
                      <div class="tcolumn">加工检验数量</div>
                      <div class="tcolumn">次品数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in inspection_detail"
                  :key="index">
                  <div class="tcolumn">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn">{{itemChild.production_number}}</div>
                      <div class="tcolumn"
                        style="color:#E6A23C">{{itemChild.inspectionNum}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.rejectNum>0?'#F5222D':'#01B48C'}">{{itemChild.rejectNum}}</div>
                      <div class="tcolumn">
                        <span class="blue"
                          @click="normalProcess(item,itemChild)">加工</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{processType}}加工</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:32px">
            <div class="filterCtn">
              <div class="label">选择产品：</div>
              <!-- 切换产品需要询问是否切换，并初始化尺码颜色 -->
              <el-select class="inputs"
                v-model="inspectionForm.product_id"
                placeholder="请选择产品"
                @change="getInspectionPro">
                <el-option v-for="item in inspection_detail"
                  :key="item.product_id"
                  :value="item.product_id"
                  :label="item.product_code + '(' + item.category_name +'/' + item.type_name + '/' + item.style_name +')'"></el-option>
              </el-select>
            </div>
            <div class="filterCtn">
              <div class="label">选择单位：</div>
              <el-cascader @change="getClientAuth"
                v-model="inspectionForm.clientAuth"
                :options="clientAuthArr"
                :props="{multiple: true}"
                collapse-tags
                clearable></el-cascader>
              <span>
                <el-tooltip class="item"
                  effect="dark"
                  content="常用人员设置"
                  placement="top">
                  <i class="el-icon-setting"
                    @click="inspectionSetting.flag=true"></i>
                </el-tooltip>
                <div class="selfSelect"
                  style="transform: translate(calc(8px - 50%), calc(-100% - 32px));"
                  v-show="inspectionSetting.flag">
                  <div class="checkBoxCtn"
                    style="height:auto">
                    <el-checkbox @change="filterSettingAuthArr($event,item.name)"
                      v-model="item.checked"
                      v-for="item in departmentArr"
                      :key="item.id"
                      :value="item.name"
                      :label="item.name">
                      <span>{{item.name}}</span>
                    </el-checkbox>
                  </div>
                  <div class="checkBoxCtn">
                    <el-checkbox v-model="item.checked"
                      v-for="item in settingAuthArr"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                      <span>{{item.name}}</span>
                    </el-checkbox>
                  </div>
                  <div class="oprCtn">
                    <div class="btnCancle"
                      @click="inspectionSetting.flag=false">取消</div>
                    <div class="btnConfirm"
                      @click="saveInspectionSetting">保存常用人员</div>
                  </div>
                </div>
              </span>
            </div>
            <div class="filterCtn">
              <div class="label">结算单价：</div>
              <el-input class="inputs"
                v-model="inspectionForm.price"
                placeholder="请输入人员结算单价">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">来源单位/人员</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">配色/尺码</div>
                      <div class="tcolumn">加工数</div>
                      <div class="tcolumn">次品数</div>
                      <div class="tcolumn"
                        style="flex:1.2">次品原因</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in inspectionForm.detail"
                  :key="index">
                  <div class="tcolumn">
                    <div style="height:32px">
                      <el-cascader v-model="item.client_auth"
                        :options="clientAuthArr"
                        collapse-tags
                        clearable></el-cascader>
                    </div>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.colorSize"
                      :key="indexChild">
                      <div class="tcolumn">
                        <div style="height:32px">
                          <el-select class="inputs"
                            v-model="itemChild.colorSize"
                            no-data-text="请先选择产品"
                            placeholder="请选择配色/尺码">
                            <el-option v-for="item in inspectionForm.colorSizeArr"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="tcolumn">
                        <div style="height:32px">
                          <el-input v-model="itemChild.number"
                            placeholder="加工数"></el-input>
                        </div>
                      </div>
                      <div class="tcolumn">
                        <div style="height:32px">
                          <el-input v-model="itemChild.substandard"
                            placeholder="次品数"></el-input>
                        </div>
                      </div>
                      <div class="tcolumn"
                        style="flex:1.2">
                        <div style="height:32px">
                          <el-select multiple
                            v-model="itemChild.reason"
                            placeholder="请选择次品原因"
                            clearable>
                            <el-option v-for="item in defectiveType"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="tcolumn"
                        style="flex-direction:row;align-items:center;justify-content:flex-start">
                        <span class="btn noBorder"
                          style="padding:0;margin:0 5px 0 0">
                          <span @click="inspectionForm.colorSizeArr.length>0?itemChild.showCheck=true:$message.warning('请先选择产品')">批量选择</span>
                          <div class="selfSelect"
                            style="transform: translate(8px, calc(-100% - 32px));"
                            v-if="itemChild.showCheck">
                            <div class="checkBoxCtn">
                              <el-checkbox v-model="inspectionForm.checkedAllOption"
                                @change="checkedAllOption($event,inspectionForm.colorSizeArr)">全选 </el-checkbox>
                              <el-checkbox v-for="(itemCheck,indexCheck) in inspectionForm.colorSizeArr"
                                :key="indexCheck"
                                v-model="itemCheck.checked">
                                <span>{{itemCheck.color_name + '/' + itemCheck.size_name}}</span>
                              </el-checkbox>
                            </div>
                            <div class="oprCtn">
                              <div class="btnCancle"
                                @click="itemChild.showCheck=false">取消</div>
                              <div class="btnCancle"
                                @click="cancleInspectionColorSize">清空</div>
                              <div class="btnConfirm"
                                @click="selectInspectionColorSize(item)">确认</div>
                            </div>
                          </div>
                        </span>
                        <span class="btn noBorder"
                          style="padding:0;margin:0 5px"
                          @click="item.colorSize.push({
                              showCheck:false,
                              colorSize: '',
                              number: '',
                              price: '',
                              substandard: '',
                              reason: []
                            })"
                          v-if="indexChild===0">新增</span>
                        <span class="btn noBorder"
                          style="padding:0;margin:0 5px;color:#F5222D"
                          @click="spliceInspection(item,indexChild)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="addRows">
                <span class="once"
                  v-if="inspectionForm.detail.length === 0"
                  @click="addProcess">新增记录</span>
                <span class="once cancle"
                  v-if="inspectionForm.detail.length > 0"
                  @click="inspectionForm.detail = []">取消</span>
                <span class="once normal"
                  v-if="inspectionForm.detail.length > 0"
                  @click="addProcess">新增记录</span>
                <span class="once ok"
                  v-if="inspectionForm.detail.length > 0"
                  @click="saveInspection">确认加工</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="inspectionList.length>0">
      <div class="titleCtn">
        <span class="title">加工检验信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">来源单位/人员</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">产品名称</div>
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow">
                          <div class="tcolumn">配色尺码</div>
                          <div class="tcolumn">加工检验数量</div>
                          <div class="tcolumn">次品数量</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in inspectionList"
                  :key="item.from">
                  <div class="tcolumn">{{item.from}}</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="itemChild in item.childrenMergeInfo"
                      :key="itemChild.product_id">
                      <div class="tcolumn">
                        <span>{{itemChild.product_info.product_code}}</span>
                        <span>{{itemChild.product_info.category_name + '/' + itemChild.product_info.type_name + '/' + itemChild.product_info.style_name }}</span>
                      </div>
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow"
                          v-for="(itemSon,indexSon) in itemChild.childrenMergeInfo"
                          :key="indexSon">
                          <div class="tcolumn">{{itemSon.color_name + '/' + itemSon.size_name}}</div>
                          <div class="tcolumn"
                            style="color:#e6a23c">{{itemSon.number}}</div>
                          <div class="tcolumn"
                            :style="{'color':itemSon.count?'#F5222D':'#01b48c'}">{{itemSon.count || 0}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="inspection_log.length>0">
      <div class="titleCtn">
        <span class="title">成品加工日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="deleteLog('all')">批量删除</div>
            <div class="btn btnWhiteBlue"
              @click="download">批量导出excel</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="checkAll"
                      @change="checkAllLog"></el-checkbox>
                  </div>
                  <div class="tcolumn">添加日期</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn">颜色尺码</div>
                  <div class="tcolumn">结算单价</div>
                  <div class="tcolumn"
                    style="flex:1.2">来源单位/人员</div>
                  <div class="tcolumn"> 加工检验数量 </div>
                  <div class="tcolumn">次品数量</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in inspection_log"
                  :key="index">
                  <span class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"
                      @change="$forceUpdate()"></el-checkbox>
                  </span>
                  <div class="tcolumn">{{item.complete_time}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">
                    <span>{{item.product_info.product_code}}</span>
                    <span>{{item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name }}</span>
                  </div>
                  <div class="tcolumn">{{item.color_name + '/' + item.size_name}}</div>
                  <div class="tcolumn">{{item.price || '/'}}</div>
                  <div class="tcolumn"
                    style="flex:1.2">{{item.inspection_user || item.client_name}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn"
                    style="color:#F5222D;font-weight:bold;flex-direction:row;align-items:center;justify-content: flex-start;line-height:32px">{{JSON.parse(item.rejects_info).number}}
                    <template v-if="JSON.parse(item.rejects_info).number">
                      <el-popover placement="right"
                        width="60"
                        trigger="click">
                        {{JSON.parse(item.rejects_info).reason.join(',')}}
                        <span style="color:#1a95ff;cursor:pointer;font-weight:400"
                          slot="reference">(查看原因)</span>
                      </el-popover>
                    </template>
                  </div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn"
                    style="flex-direction:row;align-items: center;justify-content: flex-start;">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
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
    <history-pendant prefix="/productProcess/productProcessDetail"></history-pendant>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { downloadExcel } from '@/assets/js/common.js'
import { order, materialPlan, client, inspection, chargebacks, staff, course, station } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      checkAll: false,
      rate: {
        allNum: 1,
        insNum: 1
      },
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
      deductLogList: [],
      processChoose: [],
      processType: '',
      processArr: [],
      inspectionForm: {
        process: '',
        product_id: '',
        colorSizeArr: [],
        clientAuth: [],
        detail: [{
          client_auth: '',
          colorSize: [{
            showCheck: false,
            colorSize: '',
            number: '',
            substandard: '',
            reason: []
          }]
        }]
      },
      inspectionSetting: {
        flag: false,
        authArr: []
      },
      clientAuthArr: [],
      departmentArr: [],
      settingAuthArr: [],
      inspectionList: []
    }
  },
  watch: {
    processType (newval) {
      this.init(true)
    }
  },
  methods: {
    checkedAllOption (e, colroSizeArr) {
      colroSizeArr.forEach(item => {
        item.checked = e
      })
      this.$forceUpdate()
    },
    addProcess () {
      this.inspectionForm.detail.push({
        client_auth: '',
        colorSize: [{
          showCheck: false,
          colorSize: '',
          number: '',
          substandard: '',
          reason: []
        }]
      })
    },
    searchClient (node, query) {
      let flag = true
      if (query) {
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          flag = node.data.label.includes(query)
        } else {
          const queryArr = query.split('')
          for (const item of queryArr) {
            if (!node.data.name_pinyin.includes(item)) {
              flag = false
              break
            }
          }
        }
      }
      return flag
    },
    checkAllLog (ev) {
      this.inspection_log.forEach((item) => {
        item.checked = ev
      })
    },
    normalProcess (obj, objChild) {
      if (this.inspectionForm.product_id && this.inspectionForm.product_id !== obj.product_id) {
        this.$message.error('只能同时加工一种产品')
      }
      this.inspectionForm.product_id = obj.product_id
      this.getInspectionPro(obj.product_id)
      if (this.inspectionForm.detail.length === 1 && !this.inspectionForm.detail[0].colorSize[0].colorSize && objChild) {
        this.inspectionForm.detail.splice(0, 1)
      }
      this.inspectionForm.detail.push({
        client_auth: '',
        colorSize: [{
          showCheck: false,
          colorSize: objChild.color_id + '/' + objChild.size_id,
          number: '',
          substandard: '',
          reason: []
        }]
      })
    },
    // 获取加工产品，初始化尺码配色信息
    getInspectionPro (ev) {
      let colorSizeArr = []
      this.inspection_detail.find((item) => item.product_id === ev).childrenMergeInfo.forEach((item) => {
        this.commonFind(colorSizeArr, item, ['size_id', 'color_id'], [])
      })
      this.inspectionForm.colorSizeArr = colorSizeArr.map((item) => {
        return {
          color_name: item.color_name,
          color_id: item.color_id,
          size_name: item.size_name,
          size_id: item.size_id,
          value: item.color_id + '/' + item.size_id,
          label: item.color_name + '/' + item.size_name
        }
      })
      console.log(this.inspectionForm.colorSizeArr)
      // if (this.nativeData.inspectionLog.filter((itemUser) => itemUser.inspection_user_id && itemUser.product_id === ev).length > 0) {
      //   this.formData.inspectionForm.detail = Array.from(new Set(this.nativeData.inspectionLog.filter((item) => item.inspection_user_id && item.product_id === ev).map((item) => item.inspection_user_id))).map((item) => {
      //     return {
      //       client_auth: ['来源工序人员', Number(item)],
      //       colorSize: []
      //     }
      //   })
      //   this.formData.inspectionForm.detail.forEach((item) => {
      //     this.nativeData.inspectionLog.forEach((itemUser) => {
      //       if (Number(item.client_auth[1]) === Number(itemUser.inspection_user_id) && itemUser.product_id === ev) {
      //         if (!item.colorSize.find((itemFind) => itemFind.colorSize === (itemUser.color_id + '/' + itemUser.size_id))) {
      //           item.colorSize.push({
      //             showCheck: false,
      //             colorSize: itemUser.color_id + '/' + itemUser.size_id,
      //             number: '',
      //             substandard: '',
      //             reason: []
      //           })
      //         }
      //       }
      //     })
      //   })
      // }
    },
    getClientAuth (ev) {
      let detail = []
      detail = ev.map((item) => {
        let colorSize = [{
          showCheck: false,
          colorSize: '',
          number: '',
          price: '',
          substandard: '',
          reason: []
        }]
        let finded = this.inspectionForm.detail.find((itemFind) => {
          return itemFind.client_auth[0] === item[0] && itemFind.client_auth[1] === item[1]
        })
        if (finded) {
          colorSize = finded.colorSize
        }
        return {
          client_auth: item,
          colorSize: colorSize
        }
      })
      this.inspectionForm.detail = detail
    },
    createProcess (ev) {
      this.processChoose.push(ev)
      this.processType = ev
    },
    // 确认检验
    saveInspection () {
      let error = ''
      this.inspectionForm.detail.forEach((item) => {
        if (item.client_auth.length === 0) {
          error = '请选择来源工序人员/单位'
        }
        item.colorSize.forEach((itemChild) => {
          if (!itemChild.colorSize) {
            error = '请选择尺码颜色'
          }
          if (!itemChild.number) {
            error = '请输入检验数量'
          }
        })
      })

      if (error) {
        this.$message.error(error)
        return
      }
      this.loading = true
      let formData = []
      this.inspectionForm.detail.forEach((item) => {
        item.colorSize.forEach((itemChild) => {
          formData.push({
            order_type: this.$route.params.orderType,
            product_flow: this.processType,
            order_id: this.$route.params.id,
            product_id: this.inspectionForm.product_id,
            size_id: itemChild.colorSize.split('/')[1],
            color_id: itemChild.colorSize.split('/')[0],
            client_id: (item.client_auth[0] !== '所有人员' && item.client_auth[0] !== '常用人员' && item.client_auth[0] !== '工序负责人员') ? item.client_auth[1] : '',
            inspection_user: item.client_auth[0] === '所有人员' || item.client_auth[0] === '常用人员' || item.client_auth[0] === '工序负责人员' ? item.client_auth[1] : '',
            number: itemChild.number,
            rejects_info: JSON.stringify({ reason: itemChild.reason, number: itemChild.substandard }),
            complete_time: this.$getTime(new Date()),
            desc: ''
          })
        })
      })
      inspection.finishedCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          let payArr = formData.filter((item) => item.inspection_user).map((item) => {
            return {
              id: null,
              staff_id: item.inspection_user,
              complete_time: this.$getTime(new Date()),
              work_type: this.processType,
              year: this.$getTime(new Date()).split('-')[0],
              month: Number(this.$getTime(new Date()).split('-')[1]),
              settle_type: this.orderInfo.order_code || this.orderInfo.title,
              price: this.inspectionForm.price || 0,
              number: item.number,
              unit: '',
              total_price: this.inspectionForm.price ? this.inspectionForm.price * item.number : 0,
              desc: item.desc
            }
          })
          if (payArr.length > 0) {
            staff.createPay({ data: payArr }).then((res) => {
              if (res.data.status) {
                this.$message.success('检验成功')
                this.inspectionForm.detail = [{
                  client_auth: '',
                  colorSize: [{
                    showCheck: false,
                    colorSize: '',
                    number: '',
                    price: '',
                    substandard: '',
                    reason: []
                  }]
                }]
                this.loading = false
              }
            })
          } else {
            this.$message.success('检验成功')
            this.inspectionForm.detail = [{
              client_auth: '',
              colorSize: [{
                showCheck: false,
                colorSize: '',
                number: '',
                price: '',
                substandard: '',
                reason: []
              }]
            }]
            this.loading = false
          }
          this.init()
        }
      })
    },
    getModule (type) {
      this.processType = type
    },
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
        { title: '加工日期', key: 'complete_time' },
        { title: '产品编号', key: 'product_code' },
        { title: '产品品类', key: 'product_types' },
        { title: '尺码', key: 'size_name' },
        { title: '颜色', key: 'color_name' },
        { title: '加工数量', key: 'number' },
        { title: '次品数量', key: 'rejects_number' },
        { title: '次品原因', key: 'rejects_infos' },
        { title: '承担单位', key: 'rejects_client' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
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
              this.init()
            }
          })
        } else {
          inspection.finishedDelete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.inspection_log.splice(index, 1)
              this.init()
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
    // 搜索常用人员
    getSettingAuthArr (ev) {
      if (ev) {
        this.settingAuthArr = this.authArr.filter((item) => item.name.search(ev) !== -1)
      } else {
        this.settingAuthArr = this.$clone(this.authArr)
      }
    },
    filterSettingAuthArr (ev, type) {
      this.settingAuthArr.forEach((item) => {
        if (item.department_name === type) {
          item.checked = ev
        }
      })
    },
    // 设置常用人员
    saveInspectionSetting () {
      window.localStorage.setItem('inspectionUser', JSON.stringify(this.settingAuthArr.filter((item) => item.checked)))
      this.inspectionSetting.flag = false
      this.$message.success('保存常用人员成功,刷新页面后才能生效')
    },
    cancleInspectionColorSize () {
      this.inspectionForm.colorSizeArr.forEach((item) => {
        item.checked = false
      })
    },
    spliceInspection (item, index) {
      item.colorSize.splice(index, 1)
      this.inspectionForm.detail = this.inspectionForm.detail.filter((item) => item.colorSize.length > 0)
    },
    // 批量选择加工尺码信息
    selectInspectionColorSize (obj) {
      obj.colorSize = []
      obj.colorSize = this.inspectionForm.colorSizeArr.filter((item) => item.checked).map((item) => {
        return {
          showCheck: false,
          colorSize: item.value,
          number: '',
          price: '',
          substandard: '',
          reason: []
        }
      })
      this.inspectionForm.detail = this.inspectionForm.detail.filter((item) => item.colorSize.length > 0)
    },
    // 注意！这个方法会改变传进来的findArr数组
    // findArr 需要查找的数组
    // compare 需要对比的数据
    // findWhich 需要比对哪些数据相同
    // addWhich 相同的数据需要相加的数据
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
    init (ifFirst) {
      this.loading = true
      Promise.all([
        order.detail({
          id: this.$route.params.id
        }),
        materialPlan.init({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        client.list(),
        inspection.finishedDetail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        staff.list(),
        course.list({
          type: 3
        }),
        station.list({
          type: 2
        })
      ]).then((res) => {
        this.orderInfo = res[0].data.data
        this.processArr = res[5].data.data.filter(item => item.type === 3).map((item) => {
          return {
            value: item.name,
            label: item.name
          }
        })
        if (this.processArr.length === 0) {
          this.$alert('未在设置页面添加任何结算工序，请先添加结算工序！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.go(-1)
            }
          })
          return
        }
        this.processArr = this.processArr.slice(3, this.processArr.length)
        // 工序字段初始化一次就够了
        if (!ifFirst) {
          this.processChoose = res[5].data.data.slice(0, 3).map((item) => item.name)
        }
        if (!this.processType) {
          this.processType = this.processChoose[0]
        }
        this.inspection_detail = this.$mergeData(res[1].data.data.product_info, { mainRule: 'product_id', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'product_code' }] })
        this.companyArr = res[2].data.data.filter((item) => {
          return item.type.indexOf(27) !== -1
        })
        this.settingAuthArr = this.$clone(res[4].data.data)
        this.clientAuthArr = [{
          value: '常用人员',
          label: '常用人员',
          children: window.localStorage.getItem('inspectionUser') ? JSON.parse(window.localStorage.getItem('inspectionUser')).map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          }) : []
        }, {
          value: '工序负责人员',
          label: '工序负责人员',
          children: res[4].data.data.filter((item) => {
            return item.station_id && item.station_id.map((item) => item.name).indexOf(this.processType) !== -1
          }).map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }, {
          value: '所有人员',
          label: '所有人员',
          children: res[4].data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }].concat(this.$getClientOptions(res[2].data.data, companyType, { typeScope: [29, 34] }))
        res[3].data.data.forEach((item) => {
          this.processChoose.push(item.product_flow)
        })
        this.processChoose = Array.from(new Set(this.processChoose))
        this.inspection_log = res[3].data.data.filter((item) => item.product_flow === this.processType)
        this.inspection_log.forEach((item) => {
          item.from = item.inspection_user || item.client_name
          item.count = Number(JSON.parse(item.rejects_info).number) || 0
        })
        this.inspection_detail.forEach((item) => {
          item.childrenMergeInfo.forEach((itemChild) => {
            let findArr = this.inspection_log.filter((itemFilter) => {
              return itemFilter.product_id === item.product_id && itemFilter.size_id === itemChild.size_id && itemFilter.color_id === itemChild.color_id
            })
            itemChild.inspectionNum = findArr.reduce((total, current) => {
              return total + current.number
            }, 0)
            itemChild.rejectNum = findArr.reduce((total, current) => {
              return total + Number(JSON.parse(current.rejects_info).number || 0)
            }, 0)
          })
        })
        let inspectionList = []
        this.$clone(this.inspection_log).forEach((item) => {
          this.commonFind(inspectionList, item, ['product_flow', 'product_id', 'color_id', 'size_id', 'from'], ['number', 'count'])
        })
        this.inspectionList = this.$mergeData(inspectionList, { mainRule: 'from', childrenRule: { mainRule: 'product_id', otherRule: [{ name: 'product_info' }] } })
        this.rate.allNum = this.inspection_detail.reduce((total, current) => {
          return total + current.childrenMergeInfo.reduce((total2, current2) => {
            return total2 + Number(current2.production_number)
          }, 0)
        }, 0)
        this.rate.insNum = this.inspection_detail.reduce((total, current) => {
          return total + current.childrenMergeInfo.reduce((total2, current2) => {
            return total2 + Number(current2.inspectionNum)
          }, 0)
        }, 0)
        this.departmentArr = res[6].data.data
        this.loading = false
      })
    }
  },
  mounted () {
    this.getDeductLog()
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productProcess/productProcessDetail.less";
</style>
<style lang="less">
#productProcessDetail {
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
  .cut_item {
    &.add {
      border: 1px dashed rgb(204, 204, 204);
      &:hover {
        border-color: #1a95ff;
      }
    }
  }
  .filterCtn {
    height: 32px;
    display: inline-flex;
    align-items: center;
    margin-left: 32px;
    .label {
      width: 100px;
    }
    .inputs {
      height: 32px;
    }
  }
  .el-icon-setting {
    color: #ccc;
    cursor: pointer;
    margin-left: 8px;
    &:hover {
      color: #1a95ff;
    }
  }
}
</style>
