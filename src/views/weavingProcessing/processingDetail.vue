<template>
  <div id="processingDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="$winReload"></zh-message>
        <div style="float:right">
          <look-price :price_id="orderInfo.quotation_id"
            whichPrice='semi_product_info'></look-price>
        </div>
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
    <template v-if="$route.params.orderType === '1'">
      <zh-file-module :orderId='$route.params.id'
        title_has_border />
    </template>
    <template v-else-if="$route.params.orderType === '2'">
      <zh-confirm-module title_has_border
        :orderId="$route.params.id"
        :orderInfo='orderInfo' />
    </template>
    <div class="module">
      <div class="titleCtn">
        <span class="title">半成品加工信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <el-tooltip class="item"
              effect="dark"
              :content="checkProcessList.length===0?'请选取一款产品进行批量分配操作':'批量分配'"
              placement="top">
              <div class="btn "
                :class="{'btnGray':checkProcessList.length===0,'btnWhiteBlue':checkProcessList.length>0}"
                @click="easyProcess()">批量分配</div>
            </el-tooltip>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">尺码配色</div>
                      <div class="tcolumn">计划数量</div>
                      <div class="tcolumn">分配数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_info"
                  :key="index">
                  <div class="tcolumn">
                    <el-checkbox v-model="item.checked"
                      style="display:flex;align-items:center">
                      <span>{{item.product_code}}</span>
                      <br />
                      <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                    </el-checkbox>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn">{{itemChild.production_number}}</div>
                      <div class="tcolumn">{{itemChild.processNum}}</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="normalProcess(item.product_id,itemChild.size_id,itemChild.color_id,((itemChild.production_number - itemChild.processNum)>0?(itemChild.production_number - itemChild.processNum):itemChild.production_number))">半成品加工分配</span>
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
                      <span class="text">加工单位</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-cascader v-model="item.company_id"
                        :show-all-levels='false'
                        placeholder="请选择加工单位"
                        :options="clientArrReal"
                        :filter-method='searchClient'
                        clearable
                        :props="{ expandTrigger: 'hover' }"
                        filterable></el-cascader>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择产品</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.product_id"
                        filterable
                        placeholder="请选择产品"
                        @change="selectProduct($event,index)">
                        <el-option v-for="item in process_info"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_code+'('+item.category_name + '/' + item.type_name + '/' + item.style_name + ')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择加工工序</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.process_type"
                        filterable
                        multiple
                        placeholder="请选择加工工序">
                        <el-option v-for="item in processArr"
                          :key="item.name"
                          :value="item.name"
                          :label="item.name"></el-option>
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
                      <el-select v-model="itemChild.colorSize"
                        placeholder="请选择尺码颜色"
                        no-data-text="请先选择产品">
                        <el-option v-for="(items,indexs) in item.colorSizeArr"
                          :key="indexs"
                          :value="items.id"
                          :label="items.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入单价"
                        v-model="itemChild.price"
                        type="number">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入数量"
                        v-model="itemChild.number"
                        type="number">
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      @click="addColorSize(index)"
                      v-if="indexChild===0">添加</div>
                    <div class="editBtn deleteBtn"
                      @click="deleteColorSize(index,indexChild)"
                      v-if="indexChild>0">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">产品总价</span>
                      <span class="explanation">(自动计算)</span>
                    </div>
                    <div class="content">
                      <div class="input">
                        <span class="span">{{totalPrice(item)}}</span>
                        <span class="append">元</span>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="content"
                      style="display:flex">
                      <div class="colCtn"
                        style="margin-right:16px">
                        <div class="label">
                          <span class="text">分配日期</span>
                          <span class="explanation">(必填)</span>
                        </div>
                        <div class="content">
                          <el-date-picker v-model="item.order_time"
                            value-format="yyyy-MM-dd"
                            style="width:100%"
                            type="date"
                            placeholder="选择分配日期">
                          </el-date-picker>
                        </div>
                      </div>
                      <div class="colCtn"
                        style="margin-right:0">
                        <div class="label">
                          <span class="text">截止日期</span>
                          <span class="explanation">(必填)</span>
                        </div>
                        <div class="content">
                          <el-date-picker v-model="item.complete_time"
                            value-format="yyyy-MM-dd"
                            style="width:100%"
                            type="date"
                            placeholder="选择截止日期"
                            :picker-options="{disabledDate:filterDate}">
                          </el-date-picker>
                          <div class="prompt orange"
                            v-if="item.complete_time === $getTime()">您的交货日期为今日，请再次确认！</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">是否需要分配物料</span>
                    </div>
                    <div class="content">
                      <el-radio style="line-height:32px"
                        v-model="item.part_id"
                        :label="true">需要</el-radio>
                      <el-radio v-model="item.part_id"
                        :label="false">不需要</el-radio>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
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
                  @click="normalProcess()">普通分配</span>
                <!-- <span class="once"
                  v-if="!process_flag"
                  @click="easyProcess">一键分配</span> -->
                <span class="once cancle"
                  v-if="process_flag"
                  @click="cancleProcess">取消分配</span>
                <span class="once normal"
                  v-if="process_flag"
                  @click="addProcess">添加加工单位</span>
                <span class="once ok"
                  v-if="process_flag"
                  @click="saveProcess">确认分配
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="process_detail.length>0">
      <div class="titleCtn">
        <span class="title">半成品加工分配信息</span>
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
                    style="flex:8">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">工序</div>
                      <div class="tcolumn"
                        style="flex:0.8">单价(元)</div>
                      <div class="tcolumn"
                        style="flex:0.8">数量</div>
                      <div class="tcolumn"
                        style="flex:0.8">总价</div>
                      <div class="tcolumn"
                        style="flex:1.2">截止时间</div>
                    </div>
                  </div>
                  <div class="tcolumn center"
                    style="flex:0.8">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:8">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn"
                        style="flex-direction:row;align-items:center;justify-content:flex-start">
                        <el-checkbox style="margin-right:4px"
                          v-model="itemChild.checked" />
                        <span>
                          {{itemChild.product_info.product_code}}
                          <br />
                          {{itemChild.product_info.category_name?itemChild.product_info.category_name+'/'+ itemChild.product_info.type_name+'/'+ itemChild.product_info.style_name:itemChild.product_info.product_title}}
                        </span>
                      </div>
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn">{{itemChild.type}}</div>
                      <div class="tcolumn"
                        style="flex:0.8">{{$toFixed(itemChild.price)}}</div>
                      <div class="tcolumn"
                        style="flex:0.8">{{$toFixed(itemChild.number)}}</div>
                      <div class="tcolumn"
                        style="flex:0.8">{{$toFixed(itemChild.price*itemChild.number)}}</div>
                      <div class="tcolumn"
                        style="flex:1.2"
                        v-html="itemChild.deliver_time ? $getZHTimeFormat(itemChild.deliver_time) : '未获取到截止日期'"></div>
                    </div>
                  </div>
                  <div class="tcolumn center"
                    style="flex:0.8">
                    <!-- v-if="havePartMaterial(item.childrenMergeInfo)" -->
                    <span class="btn noBorder"
                      style="padding:0;margin:0;height:1.4em"
                      @click="$openUrl('/weaveTable/' + $route.params.id + '/' + $route.params.orderType + '?type=2&clientId=' + item.client_id)">打印全部</span>
                    <span class="btn noBorder"
                      style="padding:0;margin:0;height:1.4em"
                      @click="printChecked(item)">打印勾选</span>
                    <!-- <span class="btn noBorder"
                      v-else
                      style="padding:0;margin:0;color:rgba(0,0,0,0.4);cursor: not-allowed;">无辅料信息</span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module log"
      v-if="process_log.length>0">
      <div class="titleCtn rightBtn">
        <span class="title">半成品加工分配日志</span>
        <div class="btn btnWhiteBlue"
          @click="changeRealityWeaveNumber">修改实际值</div>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="deleteLog('all')">批量删除</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.1">
                    <el-checkbox v-model="checkAll"
                      @change="checkAllLog"></el-checkbox>
                  </div>
                  <div class="tcolumn">创建日期</div>
                  <div class="tcolumn"
                    style="flex:1.6">加工单位</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn">尺码颜色</div>
                  <div class="tcolumn">单价(元)</div>
                  <div class="tcolumn">计划数量</div>
                  <div class="tcolumn">实际数量</div>
                  <div class="tcolumn">总价(元)</div>
                  <div class="tcolumn">其它信息</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.1">
                    <el-checkbox v-model="item.checked"
                      @change="$forceUpdate()"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{$getTime(item.created_at)}}</div>
                  <div class="tcolumn"
                    style="flex:1.6">
                    <span style="color:#01B48C">
                      {{item.type}}
                    </span>
                    <span>{{item.client_name}}</span>
                  </div>
                  <div class="tcolumn"
                    style="flex:1.5">
                    <span>{{item.product_info.product_code}}</span>
                    <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
                  </div>
                  <div class="tcolumn">
                    <span>{{item.size_name}}</span>
                    <span>{{item.color_name}}</span>
                  </div>
                  <div class="tcolumn">{{$toFixed(item.price)}}</div>
                  <div class="tcolumn">{{$toFixed(item.number)}}</div>
                  <div class="tcolumn">{{item.reality_number ? $toFixed(item.reality_number) : '/'}}</div>
                  <div class="tcolumn">{{$toFixed(item.price*(Number(item.reality_number) || item.number))}}</div>
                  <div class="tcolumn">
                    <el-popover placement="right"
                      trigger="click">
                      备注：{{item.desc}}<br />
                      操作人：{{item.user_name}}<br />
                      分配日期：{{$getTime(item.complete_time)}}
                      截止日期：{{item.deliver_time ? $getTime(item.deliver_time) : '/'}}
                      <div slot="reference"
                        class="btn noBorder"
                        style="margin:0;padding:0">查看</div>
                    </el-popover>
                  </div>
                  <div class="tcolumn">
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
    <div class="module"
      v-if="materialShow.length>0">
      <div class="titleCtn">
        <span class="title">物料分配信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="updateMaterial">修改物料分配</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">单位名称</div>
                  <div class="tcolumn noPad"
                    style="flex:3">
                    <div class="trow">
                      <div class="tcolumn">物料名称</div>
                      <div class="tcolumn">物料颜色</div>
                      <div class="tcolumn">物料数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in materialShow"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}} <span style="color:#01B48C">({{item.process}})</span></div>
                  <div class="tcolumn noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in item.childrenMergeInfo"
                      :key="indexMat">
                      <div class="tcolumn">{{itemMat.material_name}}</div>
                      <div class="tcolumn">{{itemMat.material_attribute}}</div>
                      <div class="tcolumn"
                        style="color:#01B48C">{{$toFixed(itemMat.unit==='g' ? itemMat.weight/1000 : itemMat.weight)}}{{itemMat.unit==='g'?'kg':itemMat.unit}}</div>
                      <div class="tcolumn">
                        <div style="color:#F5222D;cursor:pointer"
                          @click="deleteMatOut(itemMat.id)">删除</div>
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
    <div class="popup"
      v-show="easyProcess_flag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyProcess_flag=false"></i>
        </div>
        <div class="content"
          style="max-height:600px">
          <div class="tips">
            提示信息：本步骤可以统一选择加工单位,加工工序，加工单价和截止日期，如不需要可以选择直接跳过该步骤。
          </div>
          <div style="background: #f4f4f4;padding: 8px;margin: 12px 0;"
            v-for="(item,index) in checkProcessList"
            :key="index">
            <div class="row">
              <div class="label">产品名称：</div>
              <div class="info">
                <span class="text">{{item.product_code}}({{item.category_name}}/{{item.type_name}}/{{item.style_name}})</span>
              </div>
            </div>
            <div class="row">
              <div class="label">加工单位：</div>
              <div class="info">
                <el-cascader v-model="commonCompany[index]"
                  :show-all-levels='false'
                  placeholder="请选择加工单位"
                  :options="clientArrReal"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  filterable></el-cascader>
              </div>
            </div>
            <div class="row">
              <div class="label">加工工序：</div>
              <div class="info">
                <el-select v-model="commonProcess[index]"
                  filterable
                  multiple
                  placeholder="请选择加工工序">
                  <el-option v-for="item in processArr"
                    :key="item.name"
                    :value="item.name"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">单价：</div>
              <div class="info">
                <zh-input v-model="commonPrice[index]"
                  placeholder="请输入单价">
                  <template slot="append">元</template>
                </zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">截止日期：</div>
              <div class="info">
                <el-date-picker v-model="commonDate[index]"
                  value-format="yyyy-MM-dd"
                  style="width:100%"
                  type="date"
                  placeholder="选择截止日期"
                  :picker-options="{disabledDate:filterDate}">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyProcess_flag = false">直接跳过</div>
          <div class="btn btnBlue"
            @click="commonFn">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showRouterPopup">
      <div class="main">
        <div class="title">
          <span style="display:flex;justify-content:center;flex:auto">请选择需要您要跳转的页面</span>
          <span class="el-icon-close"
            @click="showRouterPopup = false"></span>
        </div>
        <div class="content">
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/receiveDispatch/receiveDispatchDetail/' + $route.params.id)">产品收发</div>
            <!-- <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/2/' + $route.params.type )">辅料订购</div> -->
          </div>
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id +'/1/' + $route.params.orderType)">原料出入库</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id +'/1/' + $route.params.orderType)">辅料出入库</div>
          </div>
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/inspection/semiFinishedDetail/' + $route.params.id)">半成品检验</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/inspection/finishedDetail/' + $route.params.id)">成品检验</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自定义物料分配模块 -->
    <div class="popup"
      v-show="material_flag">
      <div class="main"
        style="width:1000px">
        <div class="title">
          <div class="text">{{step===1?'选择所需物料':'确认所需物料'}}</div>
          <i class="el-icon-close"
            @click="material_flag=false"></i>
        </div>
        <div class="content">
          <template v-if="step===1">
            <div class="tips">
              提示信息：本步骤只需要选择你想要分配的配件或物料信息即可，选择后点击计算所需物料会自动计算出物料计划*分配数的物料总和，然后根据实际情况确认物料分配信息。（注意：配件和物料不能同时选择）
            </div>
            <div class="ctn">
              <div class="label">选择配件</div>
              <div class="checkCtn">
                <el-checkbox v-for="item in needMaterialArr.peijian"
                  v-model="item.checked"
                  :key="item.value">{{item.value}}</el-checkbox>
              </div>
            </div>
            <div class="ctn">
              <div class="label">选择原料</div>
              <div class="checkCtn">
                <el-checkbox v-for="item in needMaterialArr.wuliao"
                  v-model="item.checked"
                  :key="item.value">{{item.value}}</el-checkbox>
              </div>
            </div>
            <div class="ctn">
              <div class="label">选择辅料</div>
              <div class="checkCtn">
                <el-checkbox v-for="item in needMaterialArr.fuliao"
                  v-model="item.checked"
                  :key="item.value">{{item.value}}</el-checkbox>
              </div>
            </div>
          </template>
          <template v-if="step===2">
            <div class="flexTb"
              style="margin:0">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">单位名称</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">物料名称</div>
                      <div class="tcolumn"
                        style="flex:0.7">物料颜色</div>
                      <div class="tcolumn">物料数量</div>
                      <div class="tcolumn"
                        style="flex:0.5">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in materialTable"
                  :key="item.client_id"
                  v-show="item.material_info.length>0">
                  <div class="tcolumn">{{item.client_name}}
                    <span style="color:#1a95ff">({{item.process}})</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.material_info"
                      :key="indexChild">
                      <div class="tcolumn">
                        <el-autocomplete style="height:40px"
                          v-model="itemChild.material_name"
                          :fetch-suggestions="searchYarn"
                          placeholder="名称">
                          <template slot="prepend">
                            <span style="color:#1a95ff;">{{itemChild.material_type===1?'原':'辅'}}</span>
                          </template>
                        </el-autocomplete>
                      </div>
                      <div class="tcolumn"
                        style="flex:0.7">
                        <el-input style="height:40px"
                          v-model="itemChild.material_attribute"
                          placeholder="颜色/属性"></el-input>
                      </div>
                      <div class="tcolumn fuckUnit">
                        <el-input style="height:40px"
                          v-model="itemChild.total_weight"
                          placeholder="输入数量"
                          @input="$forceUpdate()">
                          <template slot="append">
                            <el-input class="fuck"
                              v-model="itemChild.unit"
                              placeholder="单位"></el-input>
                          </template>
                        </el-input>
                      </div>
                      <div class="tcolumn"
                        style="flex-direction: row;align-items: center;flex:0.5">
                        <div style="color:#1a95ff;cursor:pointer;margin-right:8px"
                          v-if="indexChild===0"
                          @click="item.material_info.push({
                            material_type: 2,
                            material_name: '',
                            material_attribute: '',
                            unit: '',
                            total_weight: ''
                          })">增加</div>
                        <div style="color:#F5222D;cursor:pointer"
                          v-if="indexChild>=0"
                          @click="deleteMat(item,itemChild,indexChild)">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="step=1"
            v-if="step===2">上一步</div>
          <div class="btn btnGray"
            @click="cancleMaterial()">取消分配物料</div>
          <div class="btn btnBlue"
            @click="step===1?cmpMaterial():saveMaterial()">{{step===1?'计算所需物料':'确认分配'}}</div>
        </div>
      </div>
    </div>
    <!-- 修改实际值 -->
    <div class="popup"
      v-if='showChangeRealityProcessPopup'>
      <div class="main"
        style="min-width:1000px">
        <div class="title">
          <span class="text">填写实际值</span>
          <span class="el-icon-close"
            @click="showChangeRealityProcessPopup = false"></span>
        </div>
        <div class="content"
          style="max-height:600px;">
          <div class="tableCtnLv2 height40">
            <div class="tb_header">
              <span class="tb_row flex12">分配日期</span>
              <span class="tb_row">织造单位</span>
              <span class="tb_row flex12">产品名称</span>
              <span class="tb_row">尺码颜色</span>
              <span class="tb_row flex08">单价(元)</span>
              <span class="tb_row flex08">分配数量</span>
              <span class="tb_row flex08">总价(元)</span>
              <span class="tb_row flex12 middle">实际数量</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in processLog"
              :key="index">
              <span class="tb_row flex12">{{$getTime(item.complete_time)}}</span>
              <span class="tb_row">{{item.client_name}}</span>
              <span class="tb_row flex12">
                {{item.product_info.product_code}}
                <br />
                {{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}
              </span>
              <span class="tb_row">
                {{item.size_name}}
                <br />
                {{item.color_name}}
              </span>
              <span class="tb_row flex08">{{item.price}}</span>
              <span class="tb_row flex08">{{item.number}}</span>
              <span class="tb_row flex08">{{$toFixed(item.price*item.number)}}</span>
              <span class="tb_row flex12 middle">
                <zh-input v-model="item.reality_number"
                  @input="item.isChange = true"></zh-input>
              </span>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showChangeRealityProcessPopup = false">取消</div>
          <div class="btn btnBlue"
            @click="saveRealityNumber">提交</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <zh-deduct :orderId='+$route.params.id'
            :orderType='+$route.params.orderType'
            :showType='deductPopupType'
            :logType='[5]'
            :clientList="clientArr"
            v-model="deductPopupFlag">
            <div class="btn btnWhiteBlue"
              @click="deductPopupFlag = true;deductPopupType = false">扣款日志</div>
            <div class="btn btnWhiteRed"
              @click="deductPopupFlag = true;deductPopupType = true">单位扣款</div>
          </zh-deduct>
          <div class="btn btnBlue"
            @click="$router.push('/weavingProcessing/weavingDetail/' + $route.params.id + '/' + $route.params.orderType)">转到织造分配</div>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { order, materialPlan, client, process, processing, sampleOrder } from '@/assets/js/api.js'
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
      yarnArr: [],
      clientArrReal: [],
      processArr: [],
      process_data: [],
      process_info: [],
      process_log: [],
      process_detail: [],
      easyProcess_flag: false,
      process_flag: false,
      commonCompany: [],
      commonPrice: [],
      commonDate: [],
      commonProcess: [],
      showRouterPopup: false,
      material_flag: false,
      step: 1,
      needMaterialArr: {
        peijian: [], // 配件
        wuliao: [], // 原料
        fuliao: []
      },
      materialTable: [{
        client_name: '',
        client_id: '',
        process: '',
        material_info: [{
          material_type: '',
          material_name: '',
          material_attribute: '',
          unit: '',
          total_weight: ''
        }]
      }],
      materialShow: [],
      checkAll: false,
      flatMaterial: [], // 物料展平的数据
      showChangeRealityProcessPopup: false,
      processLog: [],
      // 扣款数据
      deductPopupType: true,
      deductPopupFlag: false,
      clientArr: []
    }
  },
  watch: {
    process_data (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    }
  },
  computed: {
    checkProcessList () {
      return this.process_info.filter((item) => item.checked)
    }
  },
  methods: {
    deleteMatOut (id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        processing.matDelete({
          id
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.init()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    printChecked (item) {
      if (item.childrenMergeInfo.some(itemS => itemS.checked)) {
        this.$openUrl(`/weaveTable/${this.$route.params.id}/${this.$route.params.orderType}?type=2&clientId=${item.client_id}&logId=${item.childrenMergeInfo.filter(itemF => itemF.checked).map(itemM => itemM.id)}`)
      } else {
        this.$message.warning('请先勾选')
      }
    },
    filterDate (date) {
      return new Date(this.$getTime(date)).getTime() < new Date(this.$getTime()).getTime()
    },
    changeRealityWeaveNumber () {
      this.processLog = this.$clone(this.process_log)
      this.showChangeRealityProcessPopup = true
    },
    saveRealityNumber () {
      let data = this.processLog.filter(itemF => Number(itemF.reality_number) && itemF.isChange).map(itemM => {
        return {
          id: itemM.id,
          reality_number: itemM.reality_number
        }
      })
      if (data.length === 0) {
        this.$message.warning('未改动实际数量，无需提交')
        return
      }
      processing.setRealityNumber({
        data: data,
        type: 2
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('修改成功')
          this.showChangeRealityProcessPopup = false
          this.init()
        }
      })
    },
    checkAllLog (ev) {
      this.process_log.forEach((item) => {
        item.checked = ev
      })
    },
    updateMaterial () {
      this.materialTable = this.materialShow.map((item) => {
        return {
          client_id: item.client_id,
          client_name: item.client_name,
          process: item.process,
          material_info: item.childrenMergeInfo.map((itemChild) => {
            return {
              material_type: itemChild.material_type,
              id: itemChild.id,
              canbeEdit: true, // 这个状态用于标记物料是否是原有的，原有的删除会调删除接口
              material_name: itemChild.material_name,
              material_attribute: itemChild.material_attribute,
              total_weight: itemChild.weight,
              unit: itemChild.unit
            }
          })
        }
      })
      this.step = 2
      this.material_flag = true
    },
    deleteMat (item, itemChild, index) {
      if (itemChild.id) {
        processing.matDelete({
          id: itemChild.id
        }).then((res) => {
          if (res.data.status !== false) {
            item.material_info.splice(item, index)
          }
        })
      } else {
        item.material_info.splice(item, index)
      }
      this.$forceUpdate()
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
    searchYarn (queryString, cb) {
      let result = queryString ? this.yarnArr.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarnArr
      cb(result)
    },
    // 检测是否含有辅料（判断是否可以入打印页面）
    havePartMaterial (data) {
      let materialArr = []
      data.forEach(item => {
        materialArr.push(...item.part_assign)
      })
      return materialArr.length
    },
    normalProcess (id, size, color, number) {
      // if (number !== 'undefined' && number <= 0) {
      //   this.$message.warning('该产品已分配完毕')
      //   return
      // }
      this.process_flag = true
      this.process_data.push({
        product_id: id || '',
        company_id: '',
        process_type: [],
        colorSizeArr: id ? this.process_info.find((item) => item.product_id === id).childrenMergeInfo.map((item) => {
          return {
            name: item.size_name + '/' + item.color_name,
            id: item.size_id + '/' + item.color_id
          }
        }) : [],
        partDataArr: id ? this.process_info.find((item) => item.product_id === id).childrenMergeInfo[0].part_data : [],
        product_info: [{
          colorSize: size ? size + '/' + color : '',
          price: '',
          number: number || ''
        }],
        part_id: false,
        order_time: this.$getTime(),
        complete_time: '',
        desc: ''
      })
    },
    easyProcess () {
      if (this.process_data.length > 0) {
        this.$message.warning('检测到有未完成的半成品加工分配操作，请完成已有的操作后再进行批量分配')
        return
      }
      if (this.checkProcessList.length === 0) {
        this.$message.warning('请至少选择一种产品进行分配')
        return
      }
      this.checkProcessList.forEach((item) => {
        this.process_data.push({
          product_id: item.product_id,
          company_id: '',
          process_type: [],
          colorSizeArr: item.childrenMergeInfo.map((itemChild) => {
            return {
              name: itemChild.size_name + '/' + itemChild.color_name,
              id: itemChild.size_id + '/' + itemChild.color_id
            }
          }),
          partDataArr: item.childrenMergeInfo[0].part_data,
          product_info: item.childrenMergeInfo.map((itemChild) => {
            return {
              colorSize: itemChild.size_id + '/' + itemChild.color_id,
              price: '',
              number: itemChild.production_number
            }
          }),
          part_id: false,
          order_time: this.$getTime(),
          complete_time: '',
          desc: ''
        })
      })
      if (this.process_data.length === 0) {
        this.$message.warning('检测到已选的产品已分配完毕')
      } else {
        this.process_flag = true
        this.easyProcess_flag = true
      }
    },
    addProcess () {
      this.process_data.push({
        product_id: '',
        company_id: '',
        process_type: [],
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          price: '',
          number: ''
        }],
        part_id: false,
        order_time: this.$getTime(),
        complete_time: '',
        desc: ''
      })
    },
    deleteProcess (index) {
      this.process_data.splice(index, 1)
      if (this.process_data.length === 0) {
        this.process_flag = false
      }
    },
    cancleProcess () {
      this.process_data = []
      this.process_flag = false
    },
    saveProcess () {
      let errorFlag = false
      let errMsg = ''
      this.process_data.forEach((item) => {
        // 这个part_id实际上是是否需要物料的flag
        if (item.part_id) {
          this.material_flag = true
        }
        if (!item.company_id || !item.company_id[1]) {
          errorFlag = true
          errMsg = '请选择加工单位'
        } else if (!item.product_id) {
          errorFlag = true
          errMsg = '请选择产品'
        } else if (!item.order_time) {
          errorFlag = true
          errMsg = '请选择分配日期'
        } else if (!item.complete_time) {
          errorFlag = true
          errMsg = '请选择截止日期'
        } else if (item.process_type.length === 0) {
          errorFlag = true
          errMsg = '请选择加工工序'
        }
        item.product_info.forEach((itemChild) => {
          if (!itemChild.number) {
            errorFlag = true
            errMsg = '请输入分配数量'
          } else if (itemChild.price === '') {
            errorFlag = true
            errMsg = '请输入单价信息'
          } else if (!itemChild.colorSize) {
            errorFlag = true
            errMsg = '请选择尺码颜色'
          }
        })
      })
      if (errorFlag) {
        this.$message.error(errMsg)
        this.material_flag = false
        return
      }
      if (!this.material_flag) {
        this.submitProcess()
      }
      if (this.material_flag) {
        if (this.needMaterialArr.peijian.length === 0 && this.needMaterialArr.wuliao.length === 0 && this.needMaterialArr.fuliao.length) {
          this.materialTable = []
          this.process_data.forEach((item, index) => {
            this.materialTable.push({
              client_name: this.clientArrReal.find((itemFind) => itemFind.id === item.company_id).name,
              client_id: item.company_id && item.company_id[1],
              process: item.process_type.join('/'),
              material_info: [{
                material_type: 2,
                material_name: '',
                material_attribute: '',
                unit: 'kg',
                total_weight: ''
              }]
            })
          })
          this.step = 2
        }
      }
    },
    submitProcess () {
      let formData = []
      this.process_data.forEach((item) => {
        item.product_info.forEach((itemChild) => {
          formData.push({
            order_type: this.$route.params.orderType,
            order_id: this.$route.params.id,
            product_id: item.product_id,
            size_id: itemChild.colorSize.split('/')[0],
            color_id: itemChild.colorSize.split('/')[1],
            client_id: item.company_id && item.company_id[1],
            price: itemChild.price,
            number: itemChild.number,
            reality_number: itemChild.number,
            complete_time: item.order_time,
            deliver_time: item.complete_time,
            desc: item.desc,
            type: item.process_type.join('/')
          })
        })
      })
      processing.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('分配成功')
          this.process_data = []
          this.process_flag = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/weavingProcessing/processingDetail/' + this.$route.params.id + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个半成品加工分配信息,' + (this.$route.params.orderType === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/weavingProcessing/processingDetail/' + this.$route.params.id + '/' + this.$route.params.orderType)
            this.init()
          }
        }
      })
    },
    selectProduct (id, index) {
      let finded = this.process_info.find((item) => item.product_id === id)
      this.process_data[index].partDataArr = finded.childrenMergeInfo[0].part_data
      this.process_data[index].colorSizeArr = finded.childrenMergeInfo.map((item) => {
        return {
          name: item.size_name + '/' + item.color_name,
          id: item.size_id + '/' + item.color_id
        }
      })
    },
    addColorSize (index) {
      this.process_data[index].product_info.push({
        colorSize: '',
        price: '',
        number: ''
      })
    },
    deleteColorSize (index, indexChild) {
      this.process_data[index].product_info.splice(indexChild, 1)
    },
    // 计算总价
    totalPrice (item) {
      return item.product_info.reduce((total, current) => {
        return total + current.price * current.number
      }, 0)
    },
    cmpMaterial () {
      let filterPeijian = this.needMaterialArr.peijian.filter((item) => item.checked)
      let filterWuliao = this.needMaterialArr.wuliao.filter((item) => item.checked)
      let filterFuliao = this.needMaterialArr.fuliao.filter((item) => item.checked)
      if (filterPeijian.length > 0 && (filterWuliao.length > 0 || filterFuliao.length > 0)) {
        this.$message.error('只能选择配件或物料其中一种')
        return
      }
      if (filterPeijian.length === 0 && filterWuliao.length === 0 && filterFuliao.length === 0) {
        this.$message.error('你未选择任何物料，请自行填写分配物料')
        this.materialTable = []
        this.process_data.forEach((item, index) => {
          this.materialTable.push({
            client_name: this.clientArrReal.find((itemFind) => itemFind.value === item.company_id[0]).children.find(itemF => itemF.value === item.company_id[1]).label,
            client_id: item.company_id[1],
            process: item.process_type.join('/'),
            material_info: [{
              aterial_type: 2,
              material_name: '',
              material_attribute: '',
              unit: 'kg',
              total_weight: ''
            }]
          })
        })
        this.step = 2
        return
      }
      this.materialTable = []
      if (filterPeijian.length > 0) {
        this.process_data.forEach((item, index) => {
          this.materialTable.push({
            client_name: this.clientArrReal.find((itemFind) => itemFind.value === item.company_id[0]).children.find(itemF => itemF.value === item.company_id[1]).label,
            client_id: item.company_id[1],
            process: item.process_type.join('/'),
            material_info: []
          })
          if (item.part_id) {
            let materialInfo = []
            item.product_info.forEach((itemChild) => {
              item.partDataArr.forEach((itemPart) => {
                if (itemPart.size_info) {
                  itemPart.size_info.forEach((itemSize) => {
                    let finded = filterPeijian.find((itemFind) => {
                      return itemFind.value === itemPart.name
                    })
                    if (finded && itemSize.size_id === Number(itemChild.colorSize.split('/')[0])) {
                      materialInfo.push({
                        material_type: 2,
                        material_name: itemPart.name,
                        material_attribute: '无',
                        unit: itemPart.unit,
                        total_weight: itemChild.number * itemSize.number
                      })
                    }
                  })
                }
              })
            })
            this.materialTable[index].material_info = materialInfo
          }
          if (this.materialTable[index].material_info.length === 0) {
            this.materialTable[index].material_info = [{
              material_type: 2,
              material_name: '',
              material_attribute: '',
              unit: 'kg',
              total_weight: ''
            }]
          }
        })
      }
      if (filterWuliao.length > 0 || filterFuliao.length > 0) {
        this.process_data.forEach((item, index) => {
          this.materialTable.push({
            client_name: this.clientArrReal.find((itemFind) => itemFind.value === item.company_id[0]).children.find(itemF => itemF.value === item.company_id[1]).label,
            client_id: item.company_id[1],
            process: item.process_type.join('/'),
            material_info: []
          })
          if (item.part_id) {
            item.product_info.forEach((itemChild) => {
              let flatMaterialFilter = this.flatMaterial.filter((itemFind) => {
                return itemFind.product_id === item.product_id &&
                  itemFind.size_id === Number(itemChild.colorSize.split('/')[0]) &&
                  itemFind.color_id === Number(itemChild.colorSize.split('/')[1]) &&
                  (filterWuliao.find((itemFuck) => itemFuck.value.split('/')[0] === itemFind.material_name && itemFuck.value.split('/')[1] === itemFind.material_attribute) ||
                    filterFuliao.find((itemFuck) => itemFuck.value.split('/')[0] === itemFind.material_name && itemFuck.value.split('/')[1] === itemFind.material_attribute))
              })
              flatMaterialFilter.forEach((itemSon) => {
                itemSon.total_weight = itemSon.single_weight * itemChild.number
              })
              this.materialTable[index].material_info = this.materialTable[index].material_info.concat(flatMaterialFilter)
            })
          }
          if (this.materialTable[index].material_info.length === 0) {
            this.materialTable[index].material_info = [{
              material_type: 2,
              material_name: '',
              material_attribute: '',
              unit: 'kg',
              total_weight: ''
            }]
          }
        })
      }
      this.step = 2
    },
    saveMaterial () {
      let formData = []
      this.materialTable.forEach((item) => {
        item.material_info.forEach((itemMat) => {
          if (itemMat.material_name) {
            formData.push({
              id: itemMat.id || '',
              client_id: item.client_id,
              material_name: itemMat.material_name,
              material_attribute: itemMat.material_attribute,
              material_type: itemMat.material_type,
              unit: itemMat.unit,
              weight: itemMat.total_weight,
              product_flow: item.process
            })
          }
        })
      })
      this.loading = true
      if (formData.length > 0) {
        processing.saveMat({
          order_id: this.$route.params.id,
          order_type: this.$route.params.orderType,
          material_data: formData
        }).then((res) => {
          if (res.data.status) {
            if (this.process_data.length > 0) {
              this.submitProcess()
            } else {
              this.init()
            }
          }
        })
      } else {
        this.submitProcess()
      }
    },
    cancleMaterial () {
      this.submitProcess()
    },
    commonFn () {
      this.process_data.forEach((item, index) => {
        item.company_id = this.commonCompany[index]
        item.complete_time = this.commonDate[index]
        item.process_type = this.commonProcess[index]
        item.product_info.forEach((item) => {
          item.price = this.commonPrice[index]
        })
      })
      this.commonCompany = []
      this.commonDate = []
      this.commonProcess = []
      this.commonPrice = []
      this.$message.success('公共信息已经填写完毕，如有辅料信息请按需填写')
      this.easyProcess_flag = false
    },
    deleteLog (id, index) {
      this.$confirm('请确认该分配信息还未出库物料', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          processing.delete({
            id: this.process_log.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看分配信息变化'
              })
              this.init()
            }
          })
        } else {
          processing.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看分配信息变化'
              })
              this.process_log.splice(index, 1)
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
    init () {
      this.material_flag = false
      let api = this.$route.params.orderType === '1' ? order : sampleOrder
      if (this.$route.query.showRouterPopup === 'true') {
        this.showRouterPopup = true
      }
      Promise.all([api.detail({
        id: this.$route.params.id
      }), materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }), client.list(),
      process.list(),
      processing.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }), materialPlan.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }), processing.matDetail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      })]).then((res) => {
        res[1].data.data.product_info.forEach((item) => {
          item.part_data.unshift({
            name: '大身',
            unit: '条',
            materialArr: res[5].data.data.detail_data.filter((itemMat) => itemMat.pid === 0 && itemMat.product_id === item.product_id && itemMat.color_id === item.color_id && itemMat.size_id === item.size_id)
          })
          item.part_data.forEach((itemChild) => {
            if (itemChild.name !== '大身') {
              this.needMaterialArr.peijian.push(itemChild.name)
              itemChild.materialArr = []
            }
            res[5].data.data.detail_data.forEach((itemMat) => {
              if (itemMat.pid === item.product_id && itemMat.color_id === item.color_id && itemMat.name === itemChild.name && itemMat.size_id === item.size_id) {
                itemChild.materialArr.push(itemMat)
              }
            })
          })
        })
        this.needMaterialArr.wuliao = res[5].data.data.detail_data.filter((item) => item.material_type === 1).map((itemMat) => itemMat.material_name + '/' + itemMat.material_attribute)
        this.needMaterialArr.fuliao = res[5].data.data.detail_data.filter((item) => item.material_type === 2).map((itemMat) => itemMat.material_name + '/' + itemMat.material_attribute)
        this.needMaterialArr.peijian = Array.from(new Set(this.needMaterialArr.peijian)).map((item) => {
          return {
            value: item,
            check: false
          }
        })
        this.needMaterialArr.wuliao = Array.from(new Set(this.needMaterialArr.wuliao)).map((item) => {
          return {
            value: item,
            check: false
          }
        })
        this.needMaterialArr.fuliao = Array.from(new Set(this.needMaterialArr.fuliao)).map((item) => {
          return {
            value: item,
            check: false
          }
        })
        res[1].data.data.product_info.forEach((item) => {
          item.part_data.forEach((itemChild) => {
            itemChild.materialArr.forEach((itemSon) => {
              this.flatMaterial.push({
                color_id: item.color_id,
                size_id: item.size_id,
                product_id: item.product_id,
                material_name: itemSon.material_name,
                material_attribute: itemSon.material_attribute,
                material_type: itemSon.material_type,
                unit: itemSon.unit,
                single_weight: itemSon.single_weight
              })
            })
          })
        })
        this.orderInfo = res[0].data.data
        this.process_info = this.$mergeData(res[1].data.data.product_info, { mainRule: 'product_code/product_code', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'product_id' }] })
        this.clientArrReal = this.$getClientOptions(res[2].data.data, companyType, { typeScope: [15, 28] })
        this.processArr = res[3].data.data.filter(item => item.type === 2)
        this.process_log = res[4].data.data.map((item) => {
          item.check = false
          return item
        })
        this.clientArr = this.$unique(res[4].data.data, 'client_id').map(item => {
          return {
            client_id: item.client_id,
            client_name: item.client_name,
            type: 5
          }
        })
        this.process_detail = this.$mergeData(this.process_log, { mainRule: ['client_name', 'client_id'] })
        // 根据分配日志统计一下分配数量
        this.process_info.forEach((item) => {
          item.childrenMergeInfo.forEach((itemChild) => {
            itemChild.processNum = this.process_log.filter((itemFilter) => {
              return item.product_id === itemFilter.product_id && itemFilter.size_id === itemChild.size_id && itemFilter.color_id === itemChild.color_id
            }).reduce((total, current) => {
              return total + current.number
            }, 0)
          })
        })
        this.materialShow = this.$mergeData(res[6].data.data, { mainRule: ['client_id', 'product_flow/process'], otherRule: [{ name: 'client_name' }] })
        this.loading = false
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/processingDetail.less";
</style>
<style lang="less">
.fuckUnit {
  .el-input-group__append {
    padding: 0;
    width: 50px;
    border: 0;
  }
  .fuck {
    .el-input__inner {
      border-radius: 0;
      border-left: 1px solid rgba(0, 0, 0, 0) !important;
      &:focus {
        border-left: 1px solid #1a94ff !important;
      }
    }
  }
}
</style>
