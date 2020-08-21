<template>
  <div id="weavingDetail"
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
        <span class="title">织造信息</span>
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
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">尺码配色</div>
                      <div class="tcolumn noPad"
                        style="flex:4">
                        <div class="trow">
                          <div class="tcolumn">产品部件</div>
                          <div class="tcolumn">计划数量</div>
                          <div class="tcolumn">分配数量</div>
                          <div class="tcolumn">操作</div>
                        </div>
                      </div>
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
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                  <div class="tcolumn">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemSize,indexSize) in item.childrenMergeInfo"
                      :key="indexSize">
                      <div class="tcolumn">{{itemSize.size_name}}/{{itemSize.color_name}}</div>
                      <div class="tcolumn noPad"
                        style="flex:4">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in itemSize.part_data"
                          :key="indexChild">
                          <div class="tcolumn">{{itemChild.name}}</div>
                          <div class="tcolumn">{{itemChild.number}}</div>
                          <div class="tcolumn">{{itemChild.weavingNum}}</div>
                          <div class="tcolumn">
                            <span class="btn noBorder"
                              style="padding:0;margin:0"
                              @click="normalWeaving(item.product_code,itemSize.size_id,itemSize.color_id,itemChild.id,itemChild.number - itemChild.weavingNum)">织造分配</span>
                          </div>
                        </div>
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
                      <span class="text">织造单位</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-cascader v-model="item.company_id"
                        :show-all-levels='false'
                        placeholder="请选择织造单位"
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
                      <el-select v-model="item.product_name"
                        filterable
                        placeholder="请选择需要织造的产品"
                        @change="selectPart(index,$event)">
                        <el-option v-for="item in productArr"
                          :key="item.name"
                          :value="item.code"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.mixedData"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">配件/尺码/颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="itemChild.partColorSize"
                        no-data-text="请先选择产品"
                        placeholder="请选择配件/尺码/颜色">
                        <el-option v-for="item in item.part_data"
                          :key="item.id + '/' +item.size_id + '/' + item.color_id"
                          :value="item.id + '/' +item.size_id + '/' + item.color_id"
                          :label="item.name + '/' +item.size + '/' + item.color"></el-option>
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
                        v-model="itemChild.number"
                        placeholder="请输入分配数量">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        v-model="itemChild.price"
                        placeholder="请输入单价">
                        <template slot="append">元</template>
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
                <!-- <span class="once"
                  v-if="!weaving_flag"
                  @click="easyWeaving">一键分配</span> -->
                <span class="once cancle"
                  v-if="weaving_flag"
                  @click="cancleWeaving">取消分配</span>
                <span class="once normal"
                  v-if="weaving_flag"
                  @click="addWeaving">添加织造单位</span>
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
    <div class="module"
      v-if="weaving_detail.length>0">
      <div class="titleCtn">
        <span class="title">织造分配详情</span>
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
                      <div class="tcolumn">单价(元)</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">总价</div>
                      <div class="tcolumn">完成时间</div>
                    </div>
                  </div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <span>{{itemChild.product_info.product_code}}</span>
                        <span>{{itemChild.product_info.category_name?itemChild.product_info.category_name+'/'+ itemChild.product_info.type_name+'/'+ itemChild.product_info.style_name:itemChild.product_info.product_title}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn">{{itemChild.price}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div>
                      <div class="tcolumn">{{$toFixed(itemChild.price*itemChild.number)}}</div>
                      <div class="tcolumn">{{$getTime(itemChild.complete_time)}}</div>
                    </div>
                  </div>
                  <div class="tcolumn">
                    <span class="btn noBorder"
                      style="padding:0;margin:0"
                      @click="$openUrl('/weaveTable/' + $route.params.id + '/' + $route.params.orderType + '?type=1&clientId=' + item.client_id)">打印</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module log"
      v-if="weaving_log.length>0">
      <div class="titleCtn">
        <span class="title">织造分配日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="btnCtn_page"
          style="margin-left:64px;display:inline-block">
          <div class="btn noBorder noMargin"
            @click="deleteLog('all')">批量删除</div>
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
                      @change="getAll"></el-checkbox>
                  </div>
                  <div class="tcolumn"
                    style="flex:1.2">完成日期</div>
                  <div class="tcolumn"
                    style="flex:1.5">织造单位</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn"
                    style="flex:1.2">尺码颜色</div>
                  <div class="tcolumn">单价(元)</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">总价(元)</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_log"
                  :key="index">
                  <span class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </span>
                  <div class="tcolumn"
                    style="flex:1.2">{{item.complete_time.slice(0,10)}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">{{item.client_name}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">
                    <span>{{item.product_info.product_code}}</span>
                    <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
                  </div>
                  <div class="tcolumn"
                    style="flex:1.2">
                    <span>{{item.size_name}}</span>
                    <span>{{item.color_name}}</span>
                  </div>
                  <div class="tcolumn">{{item.price}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{$toFixed(item.price*item.number)}}</div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
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
      v-if="weaving_detail.length>0">
      <div class="titleCtn">
        <span class="title">原料分配信息</span>
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
                      <!-- <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">分配数量</div> -->
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow">
                          <div class="tcolumn">原料名称</div>
                          <div class="tcolumn">原料颜色</div>
                          <div class="tcolumn">原料数量</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcolumn center">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <!-- <div class="tcolumn">
                      <span>{{itemChild.product_info.code}}</span>
                      <span>{{itemChild.category_info.category_name?itemChild.category_info.category_name+'/'+ itemChild.category_info.type_name+'/'+ itemChild.category_info.style_name:itemChild.product_info.name}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size}}/{{itemChild.color}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div> -->
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow"
                          v-for="(itemMat,indexMat) in itemChild.material_assign"
                          :key="indexMat">
                          <div class="tcolumn">{{itemMat.material_name}}</div>
                          <div class="tcolumn">{{itemMat.material_attribute}}</div>
                          <div class="tcolumn">{{itemMat.material_type===1?$toFixed(itemMat.material_weight/1000):itemMat.material_weight}}{{itemMat.material_type===1?'kg':itemMat.material_unit}}</div>
                        </div>
                        <div class="trow"
                          v-if="itemChild.material_assign.length===0">
                          <div class="tcolumn"
                            style="text-align: center;flex-direction: row;align-items: center;">
                            无法统计原料分配信息，这可能是因为物料计划单未
                            <span class="blue">填写</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcolumn center">
                    <span class="trow">
                      <span class="btn noBorder"
                        style="margin:0;padding:0"
                        @click="replenishFn(item)">补纱</span>
                      <span class="btn noBorder"
                        style="margin:0 0 0 16px;padding:0"
                        @click="printReplenish(item.client_name)">打印补纱单</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module log"
      v-if="replenish_log.length>0">
      <div class="titleCtn">
        <span class="title">补纱日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="btnCtn_page"
          style="margin-left:64px;display:inline-block">
          <div class="btn noBorder noMargin"
            @click="deleteReplenishLog('all')">批量删除</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2"></div>
                  <div class="tcolumn">补纱工厂</div>
                  <div class="tcolumn">补纱日期</div>
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">补纱数量</div>
                  <div class="tcolumn">承担金额</div>
                  <div class="tcolumn">备注信息</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in replenish_log"
                  :key="index">
                  <span class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </span>
                  <div class="tcolumn">{{item.replenish_name}}</div>
                  <div class="tcolumn">{{item.created_at.slice(0,10)}}</div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_color}}</div>
                  <div class="tcolumn">{{item.need_weight}}</div>
                  <div class="tcolumn">
                    <span v-for="(itemChild,indexChild) in item.client_info"
                      :key="indexChild">{{itemChild.client_name}}({{itemChild.percent}}元)</span>
                  </div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteReplenishLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyWeaving_flag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyWeaving_flag=false"></i>
        </div>
        <div class="content"
          style="max-height:600px">
          <div class="tips">
            提示信息：本步骤可以统一选择织造单位,织造单价和截止日期，如不需要可以选择直接跳过该步骤。
          </div>
          <div style="background: #f4f4f4;padding: 8px;margin: 12px 0;"
            v-for="(item,index) in checkWeaveList"
            :key="index">
            <div class="row">
              <div class="label">产品名称：</div>
              <div class="info">
                <span class="text">{{item.product_code}}({{item.category_name}}/{{item.type_name}}/{{item.style_name}})</span>
              </div>
            </div>
            <div class="row">
              <div class="label">选择部件：</div>
              <div class="info">
                <el-select placeholder="请选择产品部件"
                  v-model="item.checkPart">
                  <el-option v-for="(itemChild,indexChild) in item.childrenMergeInfo[0].part_data"
                    :key="indexChild"
                    :label="itemChild.name"
                    :value="itemChild.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">织造单位：</div>
              <div class="info">
                <el-cascader v-model="commonCompany[index]"
                  :show-all-levels='false'
                  placeholder="请选择织造单位"
                  :options="clientArrReal"
                  :filter-method='searchClient'
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                  filterable></el-cascader>
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
                  placeholder="选择截止日期">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <!-- <div class="btn btnGray"
            @click="easyWeaving_flag = false">直接跳过</div> -->
          <div class="btn btnBlue"
            @click="commonFn">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="replenish_flag">
      <div class="main"
        style="width:800px">
        <div class="title">
          <div class="text">补纱</div>
          <i class="el-icon-close"
            @click="replenish_flag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：请按实际情况填写承担金额。
          </div>
          <div class="row"
            v-for="(item,index) in replenish_data.yarn_info"
            :key="index">
            <div class="label"
              :style="{'visibility':index>0?'hidden':'inhert'}">补纱信息：</div>
            <div class="info"
              style="display:flex">
              <el-select v-model="item.yarn"
                filterable
                placeholder="请选择纱线">
                <el-option v-for="item in replenish_yarn"
                  :key="item.name"
                  :value="item.name"
                  :label="item.name"></el-option>
              </el-select>
              <el-input style="margin-left:5px"
                v-model="item.weight"
                placeholder="请输入重量">
                <template slot="append">kg</template>
              </el-input>
            </div>
            <div class="editBtn blue"
              v-if="index===0"
              @click="addReplenish">添加</div>
            <div class="editBtn red"
              v-if="index>0"
              @click="deleteReplenish(index)">删除</div>
          </div>
          <div class="row"
            v-for="(item,index) in replenish_data.client_info"
            :key="index +'aaa'">
            <div class="label"
              :style="{'visibility': (index>0?'hidden':'visible')}">承担金额：</div>
            <div class="info input-with-select">
              <el-input v-model="item.percent"
                placeholder="请输入承担金额">
                <template slot="append">元</template>
                <template slot="prepend">
                  <el-select style="width:200px"
                    placeholder="单位"
                    v-model="item.id">
                    <el-option v-for="(item) in replenishClientArr"
                      :key="item.client_id"
                      :value="item.client_id"
                      :label="item.client_name"></el-option>
                  </el-select>
                </template>
              </el-input>
            </div>
            <div class="editBtn blue"
              v-if="index===0"
              @click="addClient">添加</div>
            <div class="editBtn red"
              v-if="index>0"
              @click="deleteClient(index)">删除</div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <!-- <el-input v-model="replenish_data.desc"
                placeholder="请输入备注信息"></el-input> -->
              <el-autocomplete v-model="replenish_data.desc"
                :fetch-suggestions="querySearchReplenish"
                placeholder="请输入备注信息"></el-autocomplete>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="replenish_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="saveReplenish">确定</div>
        </div>
      </div>
    </div>
    <!-- 补纱打印 -->
    <div class="popup"
      v-show="printPopup">
      <div class="main"
        style="width:788px">
        <div class="title">
          <div class="text">补纱打印{{printInfo[0] ? '-' + printInfo[0].client_name : ''}}</div>
          <i class="el-icon-close"
            @click="printPopup=false"></i>
        </div>
        <div class="content">
          <div class="tableCtnLv2 lineHeight40 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex03"></span>
              <span class="tb_row flex06">补纱日期</span>
              <span class="tb_row">纱线名称</span>
              <span class="tb_row flex06">颜色</span>
              <span class="tb_row flex06">重量</span>
              <span class="tb_row">承担金额</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in printInfo"
              :key='index'>
              <span class="tb_row flex03">
                <el-checkbox v-model="item.checked"></el-checkbox>
              </span>
              <span class="tb_row flex06">{{item.created_at}}</span>
              <span class="tb_row">{{item.material_name}}</span>
              <span class="tb_row flex06">{{item.material_color}}</span>
              <span class="tb_row flex06">{{item.need_weight}}</span>
              <span class="tb_row">
                <template v-for="(value,key) in item.percent_info">
                  {{value}}
                  <br :key='key' />
                </template>
              </span>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="printPopup=false">取消</div>
          <div class="btn btnBlue"
            @click="goPrint">去打印</div>
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
              @click="$router.push('/inspection/semiFinishedDetail/' + $route.params.id)">半成品检验</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/inspection/finishedDetail/' + $route.params.id)">成品检验</div>
          </div>
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/receiveDispatch/receiveDispatchDetail/' + $route.params.id)">产品收发</div>
            <div style="width:6em;height:32px;text-align:center;margin-right:16px;padding: 0 23px;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showReplenishPopup">
      <div class="main">
        <div class="title">
          <span style="display:flex;justify-content:center;flex:auto">请选择需要您要跳转的页面</span>
          <span class="el-icon-close"
            @click="showReplenishPopup = false"></span>
        </div>
        <div class="content">
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/1/' + $route.params.orderType + '/normal')">原料订购</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/1/' + $route.params.orderType)">原料出入库</div>
          </div>
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
          <div class="btn btnBlue"
            @click="$router.push('/weavingProcessing/processingDetail/' + $route.params.id + '/' + $route.params.orderType)">转到半成品分配</div>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { order, materialPlan, client, weave, replenish, sampleOrder, materialStock, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      checkAll: false,
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
      productArr: [],
      clientArrReal: [],
      weaving_data: [],
      weaving_detail: [],
      weaving_log: [],
      weaving_flag: false,
      easyWeaving_flag: false,
      commonCompany: [],
      commonPrice: [],
      commonDate: [],
      replenish_flag: false,
      replenish_yarn: [],
      replenish_data: {
        yarn_info: [],
        client_info: [{
          name: '',
          id: '',
          percent: ''
        }, {
          name: '',
          id: '',
          percent: ''
        }],
        desc: '补纱'
      },
      replenish_log: [],
      replenishRemarkList: [
        { value: '工艺算错' },
        { value: '纱线算错' },
        { value: '条数多织' },
        { value: '次品重织' },
        { value: '其它原因' }
      ],
      printInfo: [],
      printPopup: false,
      showRouterPopup: false,
      showReplenishPopup: false,
      replenishClientArr: [],
      deductLogPopupFlag: false,
      deductLogList: []
    }
  },
  computed: {
    checkWeaveList () {
      return this.weaving_info.filter((item) => item.checked)
    }
  },
  watch: {
    weaving_data (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    }
  },
  methods: {
    // 获取扣款日志
    getDeductLog () {
      chargebacks.log({
        order_type: 1,
        order_id: this.$route.params.id,
        type: [99]
      }).then((res) => {
        this.deductLogList = res.data.data
      })
    },
    querySearchReplenish (queryString, cb) {
      cb(queryString ? this.replenishRemarkList.filter(itemF => itemF.value.indexOf(queryString) !== -1) : this.replenishRemarkList)
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
    // 补纱打印
    printReplenish (client) {
      this.printPopup = true
      this.printInfo = this.replenish_log.filter(item => item.replenish_name === client).map(item => {
        return {
          checked: false,
          id: item.id,
          material_color: item.material_color,
          client_name: item.replenish_name,
          material_name: item.material_name,
          created_at: this.$getTime(item.created_at),
          need_weight: item.need_weight,
          percent_info: item.client_info.map(value => {
            return (+value.client_id === 0 ? '本厂' : value.client_name) + '(' + value.percent + '元)'
          })
        }
      })
    },
    goPrint () {
      let idArr = this.printInfo.filter(item => item.checked).map(item => item.id)
      if (idArr.length === 0) {
        this.$message.warning('请选择需要打印的补纱日志')
        return
      }
      this.$openUrl('/replenishTable/' + this.$route.params.id + '/' + this.$route.params.orderType + '?id=' + idArr.join(','))
    },
    normalWeaving (code, size, color, id, number) {
      if (number !== 'undefined' && number <= 0) {
        this.$message.warning('该部件已分配完毕')
        return
      }
      this.weaving_flag = true
      this.weaving_data.push({
        company_id: '',
        product_name: code || '',
        mixedData: [{
          partColorSize: id ? id + '/' + size + '/' + color : '',
          price: '',
          number: ''
        }],
        complete_time: '',
        part_data: [],
        desc: ''
      })
      if (code) {
        this.selectPart(this.weaving_data.length - 1, code)
      }
    },
    easyWeaving () {
      if (this.weaving_data.length > 0) {
        this.$message.warning('检测到有未完成的织造分配操作，请完成已有的操作后再进行批量分配')
        return
      }
      if (this.checkWeaveList.length === 0) {
        this.$message.warning('请至少选择一种产品进行分配')
        return
      }
      this.easyWeaving_flag = true
      console.log(this.checkWeaveList)
      // this.checkWeaveList.forEach((item) => {
      //   let mixedData = []
      //   item.childrenMergeInfo.forEach((itemChild) => {
      //     if (itemChild.part_data[0].number - itemChild.part_data[0].weavingNum > 0) {
      //       mixedData.push({
      //         partColorSize: itemChild.part_data[0].id + '/' + itemChild.size + '/' + itemChild.color,
      //         price: '',
      //         number: itemChild.part_data[0].number - itemChild.part_data[0].weavingNum
      //       })
      //     }
      //   })
      //   if (mixedData.length > 0) {
      //     this.weaving_data.push({
      //       company_id: '',
      //       product_name: item.product_code,
      //       mixedData: mixedData,
      //       complete_time: '',
      //       part_data: this.productArr.find((itemFind) => itemFind.code === item.product_code).part_data,
      //       desc: ''
      //     })
      //   }
      // })
      // if (this.weaving_data.length === 0) {
      //   this.$message.warning('所有大身信息已分配完毕，如需分配其他部件，请手动分配')
      // } else {
      //   this.weaving_flag = true
      //   this.easyWeaving_flag = true
      // }
    },
    addWeaving () {
      this.weaving_data.push({
        company_id: '',
        product_part: '',
        mixedData: [{
          partColorSize: '',
          price: '',
          number: ''
        }],
        complete_time: '',
        part_data: [],
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
        if (!item.company_id || !item.company_id[1]) {
          errorFlag = true
          errMsg = '请选择织造单位'
        } else if (!item.product_name) {
          errorFlag = true
          errMsg = '请选择产品'
        } else if (!item.complete_time) {
          errorFlag = true
          errMsg = '请选择截至日期'
        }
        item.mixedData.forEach((itemChild) => {
          if (!itemChild.partColorSize) {
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
        return
      }
      let formData = []
      this.weaving_data.forEach((item) => {
        item.mixedData.forEach((itemChild) => {
          let partColorSize = itemChild.partColorSize.split('/')
          let partFlag = item.part_data.find((itemFind) => Number(itemFind.id) === Number(partColorSize[0])).name === '大身' // 判断是否为大身
          formData.push({
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType,
            product_id: partColorSize[0], // 配件id
            client_id: item.company_id && item.company_id[1],
            complete_time: this.$getTime(item.complete_time),
            desc: item.desc,
            price: itemChild.price,
            number: itemChild.number,
            size_id: partColorSize[1],
            color_id: partColorSize[2],
            is_part: partFlag ? 1 : 2,
            proportion: 100,
            process: '织造'
          })
        })
      })
      weave.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('分配成功，请刷新页面后查看织造分配数量')
          this.weaving_data = []
          this.weaving_flag = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/weavingProcessing/weavingDetail/' + this.$route.params.id + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个织造分配信息,' + (this.$route.params.orderType === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/weavingProcessing/weavingDetail/' + this.$route.params.id + '/' + this.$route.params.orderType)
            this.$winReload()
          }
        }
      })
    },
    selectPart (index, name) {
      this.weaving_data[index].part_data = this.productArr.find((item) => item.code === name).part_data
    },
    addMixedData (index) {
      this.weaving_data[index].mixedData.push({
        partColorSize: '',
        price: '',
        number: ''
      })
    },
    deleteMixedData (index, indexChild) {
      this.weaving_data[index].mixedData.splice(indexChild, 1)
    },
    // 填写公共信息
    commonFn () {
      this.checkWeaveList.forEach((item) => {
        if (!item.checkPart) {
          item.checkPart = item.childrenMergeInfo.part_data[0].id
        }
      })
      this.checkWeaveList.forEach((item) => {
        let mixedData = []
        item.childrenMergeInfo.forEach((itemChild) => {
          let part = itemChild.part_data.find((itemFind) => { return Number(itemFind.id) === Number(item.checkPart) })
          console.log(part)
          if (part.number - part.weavingNum > 0) {
            mixedData.push({
              partColorSize: part.id + '/' + itemChild.size_id + '/' + itemChild.color_id,
              price: '',
              number: part.number - part.weavingNum
            })
          }
        })
        if (mixedData.length > 0) {
          this.weaving_data.push({
            company_id: '',
            product_name: item.product_code,
            mixedData: mixedData,
            complete_time: '',
            part_data: this.productArr.find((itemFind) => itemFind.code === item.product_code).part_data,
            desc: ''
          })
        }
      })
      if (this.weaving_data.length === 0) {
        this.$message.warning('已选择的产品部件已分配完毕，如需分配其他部件，请手动分配')
      } else {
        this.weaving_flag = true
        this.easyWeaving_flag = true
      }
      this.weaving_data.forEach((item, index) => {
        item.company_id = this.commonCompany[index]
        item.mixedData.forEach((itemChild) => {
          itemChild.price = this.commonPrice[index]
        })
        item.complete_time = this.commonDate[index]
        this.easyWeaving_flag = false
      })
    },
    deleteLog (id, index) {
      this.$confirm('请确认该分配信息还未出库物料', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          weave.delete({
            id: this.weaving_log.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$winReload()
            }
          })
        } else {
          weave.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看分配信息变化'
              })
              this.weaving_log.splice(index, 1)
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
    replenishFn (data) {
      data.childrenMergeInfo.forEach((item) => {
        item.material_assign.forEach((itemMat) => {
          let name = itemMat.material_name + '/' + itemMat.material_attribute
          if (!this.replenish_yarn.find((itemFind) => itemFind.name === name)) {
            this.replenish_yarn.push({
              name: name
            })
          }
        })
      })
      this.replenish_data.yarn_info = [{
        yarn: '',
        weight: ''
      }]
      this.replenish_data.client_info = [{
        client_name: data.client_name,
        id: data.client_id,
        percent: ''
      }, {
        client_name: '本厂',
        id: null,
        percent: ''
      }]
      this.replenish_data.replenishClientId = data.client_id
      this.replenish_flag = true
    },
    addReplenish () {
      this.replenish_data.yarn_info.push({
        yarn: '',
        weight: ''
      })
    },
    deleteReplenish (index) {
      this.replenish_data.yarn_info.splice(index, 1)
    },
    saveReplenish () {
      let errorFlag = false
      let errMsg = ''
      // this.replenish_data.client_info.forEach((item) => {
      //   if (!item.percent) {
      //     item.percent = 0
      //   }
      // })
      this.replenish_data.yarn_info.forEach((item) => {
        if (!item.yarn) {
          errorFlag = true
          errMsg = '你有未选择的纱线原料'
        } else if (!item.weight) {
          errorFlag = true
          errMsg = '你有未填写的补纱重量'
        }
      })
      if (errorFlag) {
        this.$message.error(errMsg)
        return
      }
      let formData = {
        type: 1,
        id: null,
        order_id: this.$route.params.id,
        yarn_info: this.replenish_data.yarn_info.map((item) => {
          return {
            weight: item.weight,
            name: item.yarn.split('/')[0],
            color: item.yarn.split('/')[1]
          }
        }),
        client_info: this.replenish_data.client_info,
        desc: this.replenish_data.desc,
        replenish_client: this.replenish_data.replenishClientId
      }
      replenish.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('补纱成功,请通知物料管理员订购/调取所需物料')
          this.replenish_flag = false
          this.$winReload()
        }
      })
    },
    deleteReplenishLog (id, index) {
      this.$confirm('请确认是否删除该日志', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          replenish.delete({
            id: this.replenish_log.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$winReload()
            }
          })
        } else {
          replenish.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看补纱信息变化'
              })
              this.replenish_log.splice(index, 1)
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
    addClient () {
      this.replenish_data.client_info.push({
        name: '',
        id: '',
        percent: ''
      })
    },
    deleteClient (index) {
      this.replenish_data.client_info.splice(index, 1)
    },
    getAll () {
      this.weaving_log.forEach((item) => {
        item.checked = this.checkAll
      })
    }
  },
  created () {
    let api = this.$route.params.orderType === '1' ? order : sampleOrder
    if (this.$route.query.showRouterPopup === 'true') {
      this.showRouterPopup = true
    }
    if (this.$route.query.showReplenishPopup === 'true') {
      this.showReplenishPopup = true
    }
    this.getDeductLog()
    Promise.all([
      api.detail({
        id: this.$route.params.id
      }),
      materialPlan.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }),
      client.list(),
      weave.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }),
      replenish.list({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }),
      materialStock.init({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      })
    ]).then((res) => {
      this.orderInfo = res[0].data.data
      let productInfo = []
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
      productInfo.forEach((item) => {
        item.part_data.forEach((itemChild) => {
          itemChild.number = itemChild.size_info.find((itemFind) => itemFind.size_id === item.size_id).number * item.production_number
          itemChild.color = item.color_name
          itemChild.color_id = item.color_id
          itemChild.size = item.size_name
          itemChild.size_id = item.size_id
        })
        item.part_data.unshift({
          name: '大身',
          number: item.production_number,
          id: item.product_id,
          color: item.color_name,
          color_id: item.color_id,
          size: item.size_name,
          size_id: item.size_id
        })
      })
      this.weaving_info = this.$mergeData(productInfo, { mainRule: 'product_code/product_code', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }] })
      this.weaving_info.forEach((item) => {
        let mixedData = []
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.part_data.forEach((itemPart) => {
            mixedData.push(itemPart)
          })
        })
        this.productArr.push({
          name: item.product_code + '(' + item.category_name + '/' + item.type_name + '/' + item.style_name + ')',
          code: item.product_code,
          part_data: mixedData
        })
      })
      this.clientArrReal = this.$getClientOptions(res[2].data.data, companyType, { type: [13, 14] })
      this.weaving_log = res[3].data.data.map((item) => {
        item.check = false
        return item
      })
      this.weaving_detail = this.$mergeData(this.weaving_log, { mainRule: 'client_name', otherRule: [{ name: 'client_id' }] })
      // 根据织造日志统计一下分配数量
      this.weaving_info.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.part_data.forEach((itemPart) => {
            itemPart.weavingNum = this.weaving_log.filter((item) => {
              return item.product_id === itemPart.id && item.size_id === itemPart.size_id && item.color_id === itemPart.color_id
            }).reduce((total, current) => {
              return total + current.number
            }, 0)
          })
        })
      })
      this.replenish_log = res[4].data.data.map((item) => {
        item.check = false
        return item
      })
      this.replenishClientArr = this.$mergeData(res[5].data.data.material_process_client.concat(res[5].data.data.material_order_client).concat(res[5].data.data.order_weave_client).concat(res[5].data.data.order_semi_product_client).concat([{ client_name: '本厂', client_id: null }]), { mainRule: ['client_name', 'client_id'] })
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/weavingDetail.less";
</style>
<style lang="less">
#weavingDetail {
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
