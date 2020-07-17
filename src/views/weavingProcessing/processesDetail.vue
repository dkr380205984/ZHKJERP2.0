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
            <div class="btn btnWhiteBlue"
              @click="easyWeaving()">批量分配</div>
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
                  <div class="tcolumn">
                    <el-checkbox v-model="item.checked"
                      @change="getAll($event,item)">
                      <div style="display:flex;flex-direction:column;position: relative;bottom: 7px;"><span>{{item.product_code}}</span>
                        <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span></div>
                    </el-checkbox>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <el-checkbox @change="$forceUpdate()"
                          v-model="itemChild.checked">{{itemChild.size_name}}/{{itemChild.color_name}}</el-checkbox>
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
                      <el-cascader placeholder="选择工序"
                        v-model="itemChild.process"
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
    <div class="module"
      v-if="weaving_detail.length>0">
      <div class="titleCtn">
        <span class="title">工序分配详情</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">单位名称</div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">单价(元)</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">机动数</div>
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
                  <div class="tcolumn">{{item.client_name}}<span style="color:#1a95ff">({{item.process}})</span></div>
                  <div class="tcolumn noPad"
                    style="flex:7">
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
                      <div class="tcolumn">+{{parseInt(itemChild.motorise_number)}}</div>
                      <div class="tcolumn">{{$toFixed(itemChild.price*itemChild.number + parseInt(itemChild.motorise_number)*itemChild.price)}}</div>
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
    <!-- 物料入库信息只在非物料计划且客供纱的情况下显示 -->
    <div class="module"
      v-if="materialStockInfo.length>0 && orderInfo.has_plan===0">
      <div class="titleCtn">
        <span class="title">物料入库信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">原料名称</div>
                  <div class="tcolumn noPad"
                    style="flex:2">
                    <div class="trow">
                      <div class="tcolumn">原料颜色</div>
                      <span class="tcolumn">已入库数量</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in materialStockInfo"
                  :key="index">
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:2">
                    <div class="trow"
                      v-for="(itemColor,indexColor) in item.childrenMergeInfo"
                      :key="indexColor">
                      <div class="tcolumn">{{itemColor.material_color}}</div>
                      <span class="tcolumn green">{{$toFixed(itemColor.total_weight || 0)}}{{itemColor.material_type===1?'kg':itemColor.unit}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="normalCtn hasBorderTop"
        v-if="materialStockInfo.length===0">暂无入库信息</div>
    </div>
    <div class="module"
      v-if="material_detail.length>0">
      <div class="titleCtn">
        <span class="title">物料分配信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="updateMat()">修改物料分配</div>
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
                    </div>
                  </div>
                  <div class="tcolumn center">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in material_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}} <span style="color:#1a95ff">({{item.process}})</span></div>
                  <div class="tcolumn noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in item.childrenMergeInfo"
                      :key="indexMat">
                      <div class="tcolumn">{{itemMat.material_name}}</div>
                      <div class="tcolumn">{{itemMat.material_attribute}}</div>
                      <div class="tcolumn">{{itemMat.weight}}{{itemMat.material_type===1?'kg':itemMat.unit}}</div>
                    </div>
                    <div class="trow"
                      v-if="item.childrenMergeInfo.length===0">
                      <div class="tcolumn"
                        style="text-align: center;flex-direction: row;align-items: center;">
                        无法统计原料分配信息，这可能是因为物料计划单未
                        <span class="blue">填写</span></div>
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
      v-if="weaving_log.length>0">
      <div class="titleCtn">
        <span class="title">工序分配日志</span>
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
                    <el-checkbox v-model="checkAll"></el-checkbox>
                  </div>
                  <div class="tcolumn"
                    style="flex:1.2">完成日期</div>
                  <div class="tcolumn"
                    style="flex:1.5">单位名称</div>
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
                  <div class="tcolumn">{{item.number}}+{{parseInt(item.motorise_number)}}</div>
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
            提示信息：本步骤可以统一选择单位名称,织造单价和截止日期，如不需要可以选择直接跳过该步骤。
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
              <div class="label">单位名称：</div>
              <div class="info">
                <el-select v-model="commonCompany[index]"
                  filterable
                  :filter-method="searchClient"
                  placeholder="请选择单位名称">
                  <el-option v-for="item in clientArrReal"
                    :key="item.id"
                    :value="item.id"
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
              <div class="label">机动数：</div>
              <div class="info">
                <zh-input v-model="commonLoss[index]"
                  placeholder="请输入机动数">
                  <template slot="append">%</template>
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
          <div class="btn btnBlue"
            @click="commonFn">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="replenish_flag">
      <div class="main">
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
                  <el-select style="width:120px"
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
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/1/' + $route.params.orderType+'/normal')">原料订购</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/1/' + $route.params.orderType)">原料出入库</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 织造分配完成后确认物料信息 -->
    <div class="popup"
      v-show="showMaterialPopup">
      <div class="main"
        style="width:1200px">
        <div class="title">
          <div class="text">{{step===0?'计算物料信息':'物料分配填写表'}}</div>
          <span class="el-icon-close"
            @click="closeMat"></span>
        </div>
        <div class="content"
          style="padding:20px">
          <!-- 第一步，提供一个能看的懂的表格方便他们计算物料 -->
          <template v-if="step===0">
            <div class="editCtn hasBorderTop"
              style="margin:20px 0">
              <div class="zh_batch_item"
                v-for="(itemClient,indexClient) in SBdata"
                :key="indexClient">
                <div class="line">
                  <span class="line_item">分配单位：{{itemClient.client_name}}</span>
                  <span class="line_item">工序名称：<span style="color:#1595ff">{{itemClient.process}}</span></span>
                  <span class="line_item">产品信息：{{itemClient.product_info}}</span>
                </div>
                <div class="line">
                  <div class="batchTable">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn twoTitleItem">
                          <span class="leftBottom">色组</span>
                          <span class="obliqueLine"></span>
                          <span class="rightTop">物料</span>
                        </span>
                        <span class="tcolumn"
                          v-for="(itemMat,indexMat) in itemClient.materialInfo"
                          :key="indexMat">{{itemMat.material_name}}
                          <span style="color:#1595ff">{{itemMat.material_color}}</span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(itemColor,indexColor) in itemClient.colorArr"
                        :key="indexColor">
                        <span class="tcolumn"
                          style="background:#fafafa">{{itemColor.color_name}}</span>
                        <span class="tcolumn"
                          v-for="(itemNum,indexNum) in  itemClient.materialInfo"
                          :key="indexNum">
                          <el-input class="inputs"
                            v-model="itemNum.colorObj[itemColor.color_name].weight"
                            placeholder="均重/数量">
                            <template slot="append">{{itemNum.unit}}</template>
                          </el-input>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="step===1">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">单位名称</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">物料名称</div>
                      <div class="tcolumn">物料颜色</div>
                      <div class="tcolumn"
                        style="flex:1.5">物料数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in weaving_mat"
                  :key="item.company_id"
                  v-show="item.material_merge.length>0">
                  <div class="tcolumn">{{item.client_name}}
                    <span style="color:#1a95ff">({{item.process}})</span>
                    <el-switch v-model="item.material_type"
                      active-text="分配原料"
                      inactive-text="分配辅料">
                    </el-switch>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.material_merge"
                      :key="indexChild">
                      <div class="tcolumn">
                        <el-input style="height:40px"
                          v-model="itemChild.material_name"
                          placeholder="请输入物料名称">'
                          <template slot="prepend">
                            <el-tooltip class="item"
                              effect="dark"
                              content="可以通过左边切换按钮切换当前物料属性，该属性会影响物料出入库页面的信息，请正确填写"
                              placement="top">
                              <span style="color:#1a95ff;cursor:pointer">{{item.material_type?'原':'辅'}}</span>
                            </el-tooltip>
                          </template>
                        </el-input>
                      </div>
                      <div class="tcolumn">
                        <el-input style="height:40px"
                          v-model="itemChild.material_attribute"
                          placeholder="请输入物料颜色"></el-input>
                      </div>
                      <div style="flex:1.5"
                        class="tcolumn fuckUnit">
                        <el-input style="height:40px"
                          v-model="itemChild.number"
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
                        style="flex-direction: row;align-items: center;">
                        <div style="color:#1a95ff;cursor:pointer;margin-right:12px"
                          @click="addMat(item.material_merge)">新增物料</div>
                        <div style="color:#F5222D;cursor:pointer"
                          @click="deleteMat(item.material_merge,indexChild)">删除物料</div>
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
            @click="closeMat">取消</div>
          <div class="btn btnBlue"
            @click="step===0?nextStep():saveWeavingMat()">{{step===0?'计算所需物料':'确认分配'}}</div>
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
            v-show="deductLogList.length>0"
            @click="deductLogPopupFlag = true">扣款日志</div>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, sampleOrder, materialPlan, weave, client, process, replenish, materialStock, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      checkAll: false,
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
      companyArr: [],
      clientArrReal: [],
      weaving_data: [],
      weaving_detail: [],
      weaving_mat: [], // 这个参数和weaving_deitai都是织造分配物料信息,这个参数用于被修改提交
      weaving_log: [],
      weaving_flag: false,
      easyWeaving_flag: false,
      commonCompany: [],
      commonLoss: [],
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
      showMaterialPopup: false,
      deductLogPopupFlag: false,
      deductLogList: [],
      replenishClientArr: [],
      material_detail: [],
      material_use: [],
      materialStockInfo: [],
      flatMaterialStockInfo: [],
      ifUpdate: false, // 判断物料分配是新增还是修改,新增的时候不能超过剩余物料数量,修改的时候不能超过计划值
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
      }],
      checkWeaveList: [],
      SBdata: [], // 给傻子用户提供一个方便他们理解的计算公式方便他们计算
      step: 0
    }
  },
  watch: {
    checkAll (val) {
      this.weaving_log.forEach((item) => {
        item.checked = val
      })
    }
  },
  methods: {
    replenishFn (data) {
      data.childrenMergeInfo.forEach((item) => {
        let name = item.material_name + '/' + item.material_attribute
        if (!this.replenish_yarn.find((itemFind) => itemFind.name === name)) {
          this.replenish_yarn.push({
            name: name
          })
        }
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
      this.weaving_flag = true
      this.weaving_data.push({
        companyRate: [{
          company_id: '',
          process: ['织片'],
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
      this.checkWeaveList = this.weaving_info.filter((item) => {
        return item.childrenMergeInfo.filter((itemChild) => itemChild.checked).length > 0
      }).map((item) => {
        item.checkList = item.childrenMergeInfo.filter((itemChild) => {
          return itemChild.checked === true
        })
        return item
      })
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
    // 填写公共信息
    commonFn () {
      this.checkWeaveList.forEach((item) => {
        let mixedData = []
        item.checkList.forEach((itemChild) => {
          mixedData.push({
            colorSize: itemChild.size_id + '/' + itemChild.color_id,
            loss: '',
            number: itemChild.production_number,
            lossNum: ''
          })
        })
        if (mixedData.length > 0) {
          this.weaving_data.push({
            companyRate: [{
              company_id: '',
              price: '0',
              process: ['织片']
            }],
            product_id: item.product_id,
            mixedData: mixedData,
            complete_time: '',
            colorSizeArr: this.weaving_info.find((itemFind) => item.product_id === itemFind.product_id).childrenMergeInfo,
            desc: ''
          })
        }
      })

      this.weaving_flag = true
      this.easyWeaving_flag = true

      this.weaving_data.forEach((item, index) => {
        item.companyRate[0].company_id = this.commonCompany[index]
        item.companyRate[0].price = this.commonPrice[index]
        item.mixedData.forEach((itemChild) => {
          itemChild.loss = this.commonLoss[index]
          itemChild.lossNum = parseInt(itemChild.number * itemChild.loss / 100)
        })
        item.complete_time = this.commonDate[index]
        this.easyWeaving_flag = false
      })
    },
    addWeaving () {
      this.weaving_data.push({
        companyRate: [{
          company_id: '',
          price: '',
          process: ['织片']
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
      this.SBdata = []
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
          } else if (itemChild.process.length === 0) {
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
        return
      }
      this.weaving_mat = []
      this.SBdata = []
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
              process: itemCmp.process.join('/')
            })
          })
        })
      })
      let list = []
      this.weaving_data.forEach((item) => {
        item.companyRate.forEach((itemClient) => {
          item.mixedData.forEach((itemColor) => {
            let finded = list.find((itemFind) => {
              return itemFind.product_id === item.product_id && itemFind.client_id === itemClient.company_id && itemFind.process === itemClient.process.join('/') && itemFind.color_id === itemColor.colorSize.split('/')[1]
            })
            if (finded) {
              finded.number += Number(itemColor.number)
            } else {
              let productInfo = this.weaving_info.find((itemFind) => Number(itemFind.product_id) === Number(item.product_id))
              list.push({
                product_id: item.product_id,
                product_info: productInfo.product_code + '(' + productInfo.category_name + '/' + productInfo.type_name + '/' + productInfo.style_name + ')',
                client_id: itemClient.company_id,
                client_name: this.companyArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
                process: itemClient.process.join('/'),
                price: itemClient.price,
                number: itemColor.number,
                color_id: itemColor.colorSize.split('/')[1],
                color_name: item.colorSizeArr.find((itemFind) => Number(itemFind.color_id) === Number(itemColor.colorSize.split('/')[1])).color_name
              })
            }
          })
        })
      })
      list.forEach((item) => {
        let finded = this.SBdata.find((itemFind) => {
          return itemFind.product_id === item.product_id && itemFind.client_id === item.client_id && itemFind.process === item.process
        })
        if (finded) {
          finded.colorArr.push({
            color_name: item.color_name,
            color_id: item.color_id,
            number: item.number
          })
        } else {
          this.SBdata.push({
            product_id: item.product_id,
            product_info: item.product_info,
            client_name: item.client_name,
            client_id: item.client_id,
            process: item.process,
            colorArr: [{
              color_name: item.color_name,
              color_id: item.color_id,
              number: item.number
            }],
            materialInfo: []
          })
        }
      })
      // 没有物料计划就考虑客供纱
      if (this.orderInfo.has_plan === 0) {
        // 客供纱一个都没入库的情况下就直接让他手动去填就完事了,有客供纱初始化计算数据
        if (this.materialStockInfo.length === 0) {
          this.weaving_data.forEach((item) => {
            item.companyRate.forEach((itemClient) => {
              if (!this.weaving_mat.find((itemFind) => { return itemFind.company_id === itemClient.company_id && itemFind.process === itemClient.process.join('/') })) {
                this.weaving_mat.push({
                  process: itemClient.process.join('/'),
                  company_id: itemClient.company_id,
                  client_name: this.companyArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
                  material_type: true,
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
          this.step = 1
        } else {
          this.SBdata.forEach((item) => {
            item.materialInfo = this.flatMaterialStockInfo.map((itemMat) => {
              let colorObj = {}
              item.colorArr.forEach((itemColor) => {
                colorObj[itemColor.color_name] = {
                  number: itemColor.number,
                  weight: ''
                }
              })
              return {
                material_name: itemMat.material_name,
                material_color: itemMat.material_color,
                material_type: itemMat.material_type,
                unit: itemMat.unit,
                colorObj: colorObj
              }
            })
          })
          this.step = 0
        }
      } else {
        weave.getDressMatInit({
          order_id: this.$route.params.id,
          order_type: this.$route.params.orderType,
          product_data: formData.map((item) => {
            return {
              product_id: item.product_id,
              size_id: item.size_id,
              color_id: item.color_id,
              number: item.number
            }
          })
        }).then((res) => {
          let materialInfo = []
          res.data.data.forEach((item) => {
            item.forEach((itemMat) => {
              if (!materialInfo.find((itemFind) => itemFind.material_name === itemMat.material_name && itemFind.material_color === itemMat.material_attribute)) {
                materialInfo.push({
                  material_name: itemMat.material_name,
                  material_color: itemMat.material_attribute,
                  unit: itemMat.material_unit,
                  material_type: itemMat.material_type
                })
              }
            })
          })
          this.SBdata.forEach((item) => {
            item.materialInfo = materialInfo.map((itemMat) => {
              let colorObj = {}
              item.colorArr.forEach((itemColor) => {
                colorObj[itemColor.color_name] = {
                  number: itemColor.number,
                  weight: ''
                }
              })
              return {
                material_name: itemMat.material_name,
                material_color: itemMat.material_color,
                unit: itemMat.unit,
                material_type: itemMat.material_type,
                colorObj: colorObj
              }
            })
          })
          this.step = 0
          this.loading = false
        })
      }
      this.showMaterialPopup = true
    },
    // 把原料名称和颜色相同的数据进行合并
    mergeMat (data) {
      data.forEach((item) => {
        item.material_merge = []
        item.client_name = item.client_name || this.companyArr.find((itemFind) => itemFind.id === item.client_id).name
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.material_assign.forEach((itemMat) => {
            let finded = item.material_merge.find((itemFind) => {
              return itemFind.material_name === itemMat.material_name && itemFind.material_attribute === itemMat.material_attribute
            })
            if (finded) {
              finded.material_weight += itemMat.material_weight
            } else {
              item.material_merge.push(itemMat)
            }
          })
        })
        item.material_merge.forEach((itemMat) => {
          itemMat.unit = itemMat.material_type === 1 ? 'kg' : itemMat.unit
          itemMat.material_weight = itemMat.material_type === 1 ? this.$toFixed(itemMat.material_weight / 1000) : itemMat.material_weight
          itemMat.number = ''
        })
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
    getAll (ev, item) {
      item.childrenMergeInfo.forEach((itemChild) => {
        itemChild.checked = ev
      })
    },
    changeLoss (obj) {
      obj.lossNum = parseInt(obj.number * obj.loss / 100)
    },
    addMat (item) {
      item.push({
        unit: 'kg',
        material_weight: 0, // 计划数量，有物料计划的时候会用到
        material_name: '',
        material_attribute: '',
        number: ''
      })
    },
    deleteMat (item, matIndex) {
      // 不能编辑说明是修改操作
      if (item[matIndex].canbeEdit) {
        this.$confirm('该工序是否不需要此物料, 删除后将无法恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          weave.deleteDress({
            id: item[matIndex].id
          }).then((res) => {
            if (res.data.status) {
              item.splice(matIndex, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$forceUpdate()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        if (item.length > 1) {
          item.splice(matIndex, 1)
          this.$forceUpdate()
        } else {
          this.$message.error('物料数量不能少于一项')
        }
      }
    },
    updateMat () {
      console.log(this.material_detail)
      if (this.material_detail.length === 0) {
        return
      }
      this.weaving_mat = this.material_detail.map((item) => {
        return {
          company_id: item.client_id,
          client_name: item.client_name,
          process: item.process,
          material_type: item.material_type === 1,
          material_merge: item.childrenMergeInfo.map((itemChild) => {
            return {
              id: itemChild.id,
              canbeEdit: true, // 这个状态用于标记物料是否是原有的，原有的删除会调删除接口
              material_name: itemChild.material_name,
              material_attribute: itemChild.material_attribute,
              number: itemChild.weight,
              unit: itemChild.unit
            }
          })
        }
      })
      this.step = 1
      this.showMaterialPopup = true
    },
    closeMat () {
      this.ifUpdate = false
      this.showMaterialPopup = false
    },
    // 把方便计算的表格转成原有的数据
    nextStep () {
      this.SBdata.forEach((item) => {
        let finded = this.weaving_mat.find((itemFind) => { return itemFind.company_id === item.client_id && itemFind.process === item.process })
        if (finded) {
          finded.material_merge = this.materialCmp(finded.material_merge, item.materialInfo)
        } else {
          this.weaving_mat.push({
            process: item.process,
            company_id: item.client_id,
            client_name: item.client_name,
            material_type: true,
            material_merge: this.materialCmp([], item.materialInfo)
          })
        }
      })
      this.weaving_mat = this.weaving_mat.filter((item) => item.material_merge.length > 0)
      if (this.weaving_mat.length === 0) {
        this.$message.warning('未填写任何信息，请手动输入物料信息')
        this.weaving_data.forEach((item) => {
          item.companyRate.forEach((itemClient) => {
            if (!this.weaving_mat.find((itemFind) => { return itemFind.company_id === itemClient.company_id && itemFind.process === itemClient.process.join('/') })) {
              this.weaving_mat.push({
                process: itemClient.process.join('/'),
                company_id: itemClient.company_id,
                client_name: this.companyArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
                material_type: true,
                material_merge: [{
                  id: null,
                  canbeEdit: true,
                  material_name: '',
                  material_attribute: '',
                  number: '',
                  unit: 'kg'
                }]
              })
            }
          })
        })
      }
      this.step = 1
    },
    // 物料数据计算
    materialCmp (matArr, matInfo) {
      matInfo.forEach((item) => {
        let finded = matArr.find((itemFind) => itemFind.material_color === item.material_color && itemFind.material_name === item.material_name)
        let weight = 0
        Object.keys(item.colorObj).forEach((itemWeight) => {
          let weightChild = Number(item.colorObj[itemWeight].weight) || 0
          weight += Number(weightChild * item.colorObj[itemWeight].number)
        })
        if (finded) {
          finded.number += weight
        } else {
          if (weight > 0) {
            matArr.push({
              id: null,
              canbeEdit: true,
              material_name: item.material_name,
              material_attribute: item.material_color,
              material_type: item.material_type,
              unit: item.material_type === 1 ? 'kg' : item.unit,
              number: weight
            })
          }
        }
      })
      matArr.forEach((item) => { if (item.material_type === 1) { item.number = (item.number / 1000).toFixed(2) } })
      return matArr
    },
    // 保存纱线原料分配信息
    saveWeavingMat () {
      let formData1 = []
      let error = ''
      this.weaving_mat.forEach((item) => {
        item.material_merge.forEach((itemMat) => {
          formData1.push({
            id: itemMat.id || '',
            client_id: item.company_id,
            material_name: itemMat.material_name,
            material_attribute: itemMat.material_attribute,
            material_type: item.material_type ? 1 : 2,
            unit: itemMat.unit,
            weight: itemMat.number,
            product_flow: item.process
          })
        })
      })
      if (error) {
        this.$message.error(error)
        return
      }
      this.loading = true
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
              process: itemCmp.process.join('/')
            })
          })
        })
      })
      Promise.all([
        weave.dressCreate({
          data: formData
        }), weave.saveDressMat({
          order_id: this.$route.params.id,
          order_type: this.$route.params.orderType,
          material_data: formData1
        })
      ]).then((res) => {
        this.$message.success('分配成功')
        this.weaving_flag = false
        this.weaving_data = []
        this.showMaterialPopup = false
        this.loading = false
        this.$winReload()
      })
    },
    deleteLog (id, index) {
      this.$confirm('请确认该分配信息还未出库物料,删除织造分配日志还需要手动调整物料分配信息', '提示', {
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
                message: '删除成功,请重新确认物料信息!'
              })
              this.updateMat()
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
              this.updateMat()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
      process.list(),
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
      }),
      weave.getDressMat({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      }),
      materialStock.detail({
        order_id: this.$route.params.id,
        order_type: this.$route.params.orderType
      })
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
      this.weaving_log = res[4].data.data.map((item) => {
        item.check = false
        return item
      })
      this.replenish_log = res[5].data.data.map((item) => {
        item.check = false
        return item
      })
      this.weaving_detail = this.$mergeData(this.weaving_log, { mainRule: ['client_id', 'process'], otherRule: [{ name: 'client_name' }] })
      this.materialStockInfo = this.$mergeData(res[8].data.data, { mainRule: 'material_name', childrenRule: { mainRule: 'material_color', otherRule: [{ name: 'material_type' }, { name: 'total_weight' }, { name: 'unit' }] } })
      this.materialStockInfo.forEach((item) => {
        item.childrenMergeInfo.forEach((itemColor) => {
          this.flatMaterialStockInfo.push({
            material_name: item.material_name,
            material_color: itemColor.material_color,
            material_type: itemColor.material_type,
            unit: itemColor.material_type === 1 ? 'g' : itemColor.unit
          })
        })
      })
      console.log(this.flatMaterialStockInfo)
      this.material_detail = this.$mergeData(res[7].data.data, { mainRule: ['client_id', 'product_flow/process'], otherRule: [{ name: 'client_name' }, { name: 'material_type' }] })
      this.replenishClientArr = this.$mergeData(res[6].data.data.material_process_client.concat(res[6].data.data.material_order_client).concat(res[6].data.data.order_weave_client).concat(res[6].data.data.order_semi_product_client).concat([{ client_name: '本厂', client_id: null }]), { mainRule: ['client_name', 'client_id'] })
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
    .zh_batch_item {
      background-color: rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      padding-top: 20px;
      .line {
        margin-bottom: 12px;
        display: flex;
        padding: 0 16px;
        box-sizing: border-box;
        width: 100%;
        overflow-x: auto;
        .line_item {
          min-width: 200px;
          font-size: 14px;
        }
        .batchTable {
          display: block;
          border: 1px solid transparent;
          border-bottom-color: #e9e9e9;
          font-size: 14px;
          .thead {
            background: #fafafa;
            color: rgba(0, 0, 0, 0.85);
            border-bottom: 1px solid #e9e9e9;
          }
          .tbody {
            background: #fff;
            color: rgba(0, 0, 0, 0.65);
          }
          .trow {
            width: 100%;
            min-height: 54px;
            border-bottom: 1px solid #e9e9e9;
            &:nth-last-child(1) {
              border-bottom: 0;
            }
            display: flex;
            flex-direction: row;
            justify-content: center;
            text-align: center;
            &.important {
              color: #1a95ff;
            }
          }
          .tcolumn {
            flex: 1;
            min-height: 54px;
            min-width: 100px;
            border-right: 1px solid #e9e9e9;
            justify-content: center;
            display: flex;
            flex-direction: column;
            padding: 0 10px;
            flex-wrap: wrap;
            word-break: break-all;
            .inputs {
              height: 32px;
            }
            &:nth-first-child(1) {
              border-left: 0;
            }
            &:nth-last-child(1) {
              border-right: 0;
            }
            &.center {
              align-items: center;
            }
            &.noPad {
              padding: 0;
            }
            &.important {
              color: #1a95ff;
            }
            &.twoTitleItem {
              position: relative;
              line-height: 1em;
              .leftBottom {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-45px, 40%);
              }
              .rightTop {
                position: absolute;
                bottom: 50%;
                right: 50%;
                transform: translate(45px, 10%);
              }
              .obliqueLine {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 133px;
                height: 1px;
                border-bottom: 1px solid #e9e9e9;
                transform: translateX(-50%) rotateZ(24deg);
              }
            }
            &.w180 {
              width: 180px;
            }
          }
        }
      }
    }
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
  .fuckUnit {
    .el-input-group__append {
      padding: 0;
      width: 70px;
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
}
</style>
