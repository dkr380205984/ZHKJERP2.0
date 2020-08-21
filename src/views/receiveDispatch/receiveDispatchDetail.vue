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
    <zh-file-module :orderId='$route.params.id'
      title_has_border />
    <div class="module"
      v-if="$route.params.type==='1'">
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
                        <span>{{itemChild.product_info.product_code}}</span>
                        <span>{{itemChild.product_info.category_name?itemChild.product_info.category_name+'/'+ itemChild.product_info.type_name+'/'+ itemChild.product_info.style_name:itemChild.product_info.product_title}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn"
                        style="color:#E6A23C">{{itemChild.number}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.inNum===0?'#ccc':'#01B48C'}">{{itemChild.inNum}}</div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="normalWeave(item.client_id,itemChild.product_id,itemChild.size_id + '/' + itemChild.color_id,itemChild.number-itemChild.inNum)">入库</span>
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
                        @change="selectProduct($event,index,'weave_data','weave_product')">
                        <el-option v-for="item in weave_product"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_info.product_code + '('+(item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title) +')'"></el-option>
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
                          :value="item.id"
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
    <div class="module"
      v-if="weaveLog.length>0 && $route.params.type==='1'">
      <div class="titleCtn">
        <span class="title">织造入库日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="deleteWeaveLog('all')">批量删除</div>
            <div class="btn btnWhiteBlue"
              @click="printTag">批量打印标签</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin:10px 32px">
            <div class="tableCtnLv2">
              <span class="tb_header">
                <span class="tb_row"
                  style="flex:0.4"></span>
                <span class="tb_row">加工单位</span>
                <span class="tb_row">产品信息</span>
                <span class="tb_row">尺码/颜色</span>
                <span class="tb_row"
                  style="flex:0.7">入库数量</span>
                <span class="tb_row"
                  style="flex:0.7">捆数</span>
                <span class="tb_row middle"
                  style="flex:0.7">其他信息</span>
                <span class="tb_row middle"
                  style="flex:0.7">操作</span>
              </span>
              <span class="tb_content"
                v-for="(item,index) in weaveLog"
                :key="index">
                <span class="tb_row"
                  style="flex:0.4">
                  <el-checkbox v-model="item.checked"></el-checkbox>
                </span>
                <span class="tb_row">{{item.client_name}}</span>
                <span class="tb_row">
                  {{item.product_code.code}}
                  <br />
                  {{item.category_info.category_name?(item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name):item.product_code.name}}
                </span>
                <span class="tb_row">
                  {{item.size_name}}/{{item.color_name}}
                </span>
                <span class="tb_row"
                  style="flex:0.7;color:#01B48C">{{item.number}}</span>
                <span class="tb_row"
                  style="flex:0.7">{{item.count}}</span>
                <span class="tb_row middle"
                  style="flex:0.7">
                  <span class="tb_handle_btn blue"
                    @click="lookDetail(item)">查看</span>
                </span>
                <span class="tb_row middle"
                  style="flex:0.7">
                  <span class="tb_handle_btn red"
                    @click="deleteWeaveLog(item.id,index)">删除</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="$route.params.type==='2'">
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
                    style="flex:7">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">工序</div>
                      <div class="tcolumn">分配数量</div>
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
                        <span>{{itemChild.product_info.product_code}}</span>
                        <span>{{itemChild.product_info.category_name?itemChild.product_info.category_name+'/'+ itemChild.product_info.type_name+'/'+ itemChild.product_info.style_name:itemChild.product_info.product_title}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn">{{itemChild.type}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div>
                      <div class="tcolumn"
                        style="flex-direction:row;align-items:center;justify-content:start">
                        <span class="btn noBorder"
                          style="padding:0;margin:0 16px 0 0"
                          @click="processIn(item.client_id,itemChild.product_id,itemChild.size_id + '/' + itemChild.color_id,itemChild.el-input-number,itemChild.type)">入库</span>
                        <span class="btn noBorder"
                          style="padding:0;margin:0 16px 0 0"
                          @click="processOut(item.client_id,itemChild.product_id,itemChild.size_id + '/' + itemChild.color_id,itemChild.number,itemChild.type)">出库</span>
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="bindxp(item.client_id,itemChild.product_id,itemChild.size_id + '/' + itemChild.color_id,itemChild.number,itemChild.type)">绑定芯片</span>
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
                        @change="selectProduct($event,index,'process_data','process_product')">
                        <el-option v-for="item in process_product"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_info.product_code + '('+(item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title) +')'"></el-option>
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
                      <span class="text">{{process_type!=='芯片绑定'?process_type+'数量':'每捆数量/捆数'}}</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content"
                      style="flex-direction:row;">
                      <zh-input v-if="process_type!=='芯片绑定'"
                        type="number"
                        :placeholder="'请输入'+process_type+'数量'"
                        v-model="itemChild.number">
                      </zh-input>
                      <zh-input v-if="process_type==='芯片绑定'"
                        style="width:150px"
                        type="number"
                        :placeholder="'请输入每捆数量'"
                        v-model="itemChild.number">
                      </zh-input>
                      <zh-input v-if="process_type==='芯片绑定'"
                        style="width:150px;margin-left: 18px;"
                        type="number"
                        :placeholder="'请输入捆数'"
                        v-model="itemChild.count">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3"
                    v-if="process_type === '芯片绑定'">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">尾捆每捆数量/捆数</span>
                      <span class="explanation">(数量不一致的时候填写)</span>
                    </div>
                    <div class="content">
                      <zh-input v-if="process_type==='芯片绑定'"
                        style="width:150px"
                        type="number"
                        :placeholder="'请输入每捆数量'"
                        v-model="itemChild.lastNumber">
                      </zh-input>
                      <zh-input style="width:150px;margin-left: 18px;"
                        type="number"
                        :placeholder="'请输入捆数'"
                        v-model="itemChild.lastCount">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3"
                    v-if="process_type !== '芯片绑定'">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">捆数</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        :placeholder="'请输入捆数'"
                        v-model="itemChild.count">
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0&&process_type!=='芯片绑定'"
                      @click="addColorSize('process_data',index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteColorSize('process_data',index,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.clientInfo"
                  :key="'client' + indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工单位</span>
                      <span class="explanation">(选填，没有选项时可以在备注栏填写)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-cascader placeholder="请选择加工单位"
                          v-model="itemChild.client_id"
                          :options="process_company"></el-cascader>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">{{process_type}}工序</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-autocomplete v-model="itemChild.production_type"
                          :fetch-suggestions="querySearchProcess"
                          :placeholder="'请输入'+process_type+'工序'"></el-autocomplete>
                      </div>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="item.clientInfo.push({
                        client_id:[],
                        production_type:''
                      })">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="item.clientInfo.splice(indexChild,1)">删除</div>
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
                  @click="bindXp()">绑定芯片</span>
                <span class="once"
                  v-if="!process_flag"
                  @click="processIn()">直接入库</span>
                <span class="once"
                  v-if="!process_flag"
                  @click="processOut()">直接出库</span>
                <span class="once cancle"
                  v-if="process_flag"
                  @click="cancleProcess">取消{{process_type}}</span>
                <span class="once normal"
                  v-if="process_flag"
                  @click="addProcess">添加产品</span>
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
    <div class="module"
      v-if="processLog.length>0&&$route.params.type==='2'">
      <div class="titleCtn">
        <span class="title">半成品加工出入库统计</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">产品名称</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">芯片绑定数量</div>
                      <div class="tcolumn">芯片绑定捆数</div>
                      <div class="tcolumn">入库数量</div>
                      <div class="tcolumn">入库捆数</div>
                      <div class="tcolumn">出库数量</div>
                      <div class="tcolumn">出库捆数</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in processLogSts"
                  :key="item.product_id">
                  <div class="tcolumn">
                    {{item.product_code.code}}
                    <br />
                    {{item.category_info.category_name?(item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name):item.product_code.name}}
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcolumn"
                        style="color:#E6A23C">{{itemChild.bindNum}}</div>
                      <div class="tcolumn">{{itemChild.bindCount}}</div>
                      <div class="tcolumn"
                        style="color:#01B48C">{{itemChild.inNum}}</div>
                      <div class="tcolumn">{{itemChild.inCount}}</div>
                      <div class="tcolumn"
                        style="color:#1A95FF">{{itemChild.outNum}}</div>
                      <div class="tcolumn">{{itemChild.outCount}}</div>
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
      v-if="processLog.length>0 && $route.params.type==='2'">
      <div class="titleCtn">
        <span class="title">半成品加工日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="deleteProcessLog('all')">批量删除</div>
            <div class="btn btnWhiteBlue"
              @click="printTag">批量打印标签</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin:10px 32px">
            <div class="tableCtnLv2">
              <span class="tb_header">
                <span class="tb_row"
                  style="flex:0.4"></span>
                <span class="tb_row">产品信息</span>
                <span class="tb_row">尺码/颜色</span>
                <span class="tb_row"
                  style="flex:0.7">绑定芯片</span>
                <span class="tb_row"
                  style="flex:0.7">出库数量</span>
                <span class="tb_row"
                  style="flex:0.7">入库数量</span>
                <span class="tb_row"
                  style="flex:0.7">捆数</span>
                <span class="tb_row middle"
                  style="flex:0.7">其他信息</span>
                <span class="tb_row middle"
                  style="flex:0.7">操作</span>
              </span>
              <span class="tb_content"
                v-for="(item,index) in processLog"
                :key="index">
                <span class="tb_row"
                  style="flex:0.4">
                  <el-checkbox v-model="item.checked"></el-checkbox>
                </span>
                <span class="tb_row">
                  {{item.product_code.code}}
                  <br />
                  {{item.category_info.category_name?(item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name):item.product_code.name}}
                </span>
                <span class="tb_row">
                  {{item.size_name}}/{{item.color_name}}
                </span>
                <span class="tb_row"
                  style="flex:0.7;"
                  :style="{'color':item.is_chip===0?'#ccc':'#E6A23C'}">{{item.is_chip===0?'未绑定':item.number}}</span>
                <span class="tb_row"
                  style="flex:0.7;"
                  :style="{'color':item.is_pop===0?'#ccc':'#1a95ff'}">{{item.is_pop===0?'未出库':item.number}}</span>
                <span class="tb_row"
                  style="flex:0.7;"
                  :style="{'color':item.is_push===0?'#ccc':'#01B48C'}">{{item.is_push===0?'未入库':item.number}}</span>
                <span class="tb_row"
                  style="flex:0.7">{{item.count}}</span>
                <span class="tb_row middle"
                  style="flex:0.7">
                  <span class="tb_handle_btn blue"
                    @click="lookDetail(item)">查看</span>
                </span>
                <span class="tb_row middle"
                  style="flex:0.7">
                  <span class="tb_handle_btn red"
                    @click="deleteProcessLog(item.id,index)">删除</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="xpflag">
      <div class="main"
        style="width:830px;">
        <div class="title">
          <div class="text">绑定芯片</div>
          <i class="el-icon-close"
            @click="cancleBind"></i>
        </div>
        <div class="content">
          <div class="stockTable">
            <div class="line line1">第{{nowLoop}}捆</div>
            <div class="line">
              <div class="rowCtn">
                <div class="label">操作日期</div>
                <div class="info">{{xpform.date}}</div>
              </div>
              <div class="rowCtn">
                <div class="label">产品信息</div>
                <div class="info twice">{{xpform.product_code}}({{xpform.colorSize}})</div>
              </div>
            </div>
            <div class="line"
              v-for="(item,index) in xpform.clientInfo"
              :key="index">
              <div class="rowCtn">
                <div class="label">工序</div>
                <div class="info">{{item.production_type}}</div>
              </div>
              <div class="rowCtn">
                <div class="label">单位名称</div>
                <div class="info twice">{{item.client_name}}</div>
              </div>
            </div>
            <div class="line">
              <div class="rowCtn">
                <div class="label noBorderBottom">产品数量</div>
                <div class="info noBorderBottom">{{xpform.number}}</div>
              </div>
              <div class="rowCtn">
                <div class="label noBorderBottom">备注信息</div>
                <div class="info noBorderBottom twice">
                  <el-input style="height:32px"
                    placeholder="请输入备注信息"
                    v-model="xpform.desc"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="stockState">
            <div class="icon"></div>
            <div class="message">
              <span v-if="xpState===1">请放入芯片</span>
              <span v-if="xpState===2">正在上传数据...</span>
              <span v-if="xpState===3">正在写入数据...</span>
              <span v-if="xpState===4">写入成功，请放入下一个芯片</span>
              <span v-if="xpState===5"
                style="color:#F5222D">写入失败，请换一个芯片</span>
              <span v-if="xpState===6"
                style="color:#01B48C">已完成所有芯片绑定，点击完成关闭页面</span>
              <span v-if="xpState===7"
                style="color:#F5222D">芯片已绑定，请换取下一个芯片</span>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="cancleBind">取消</div>
          <div class="btn btnBlue"
            @click="bindOver">完成</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { YOWORFIDReader } from '@/assets/js/YOWOCloudRFIDReader.js'
import { downloadExcel } from '@/assets/js/common.js'
import { order, weave, processing, client, receiveDispatch, process } from '@/assets/js/api.js'
export default {
  data () {
    return {
      // 芯片写入数据
      xpflag: false,
      xpform: {
        product_id: '',
        product_code: '',
        colorSize: '',
        color_id: '',
        size_id: '',
        desc: '',
        number: '',
        count: '',
        index: 1,
        clientInfo: [],
        date: this.$getTime(new Date())
      },
      nowLoop: 1,
      xpState: 1,
      rfidreader: null,
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
      processLog: [],
      processLogSts: [],
      weaveLog: [],
      readTimer: '',
      dataBuffer: []// 数据缓冲区，数组专门存放已经提交过的芯片id，用于过滤已经写数据过的芯片
    }
  },
  watch: {
    process_data (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    },
    weave_data (val) {
      this.$nextTick(() => {
        this.$fuckSelect()
      })
    }
  },
  methods: {
    cancleBind () {
      this.$confirm('是否要停止绑定芯片,已经绑定的芯片数据会提交，如果数据无效请手动删除日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.xpflag = false
        clearInterval(this.readTimer)
        this.readTimer = null
        this.xpState = 1
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    ReadBlock () {
      let StartPos = 0 // 读的地址起点，直接设0就完事了
      this.rfidreader.KeyStringMode = 1
      this.rfidreader.KeyString = '0'
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_Read(3, StartPos, 8, 1)
    },
    WriteBlock (id) {
      let StartPos = 0 // 写的地址起点，直接设0就完事了
      let writeContont = (Array(8).join(0) + id).slice(-8) // 保证八位
      this.dataBuffer.push(writeContont)
      this.rfidreader.KeyStringMode = 1
      this.rfidreader.KeyString = '0'
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_Write(3, StartPos, 1, writeContont)
    },
    CheckConnected () {
      if (!this.rfidreader.Connected()) {
        alert('连接RFID读写器云服务失败，重新下载安装！')
        return false
      }
      return true
    },
    GetErrStr (ErrCode) {
      let ErrText = '未知错误'
      switch (ErrCode) {
        case -1: ErrText = '没有找到IC卡读卡器，支持型号：YW-605HA或者YW-607,YW-627'; break
        case -3: ErrText = '寻卡失败'; break
        case -4: ErrText = '寻卡失败'; break
        case -5: ErrText = '卡休眠失败'; break
        case -6: ErrText = '密钥认证失败'; break
        case -7: ErrText = '读失败'; break
        case -8: ErrText = '写失败'; break
        case -9: ErrText = '钱包初始化失败'; break
        case -10: ErrText = '钱包读余额失败'; break
        case -11: ErrText = '钱包充值失败'; break
        case -12: ErrText = '钱包减值失败'; break
        case -13: ErrText = '复位错误'; break
        case -14: ErrText = 'COS执行错误'; break
        case -101: ErrText = '参数错误'; break
        case -102: ErrText = 'DES校验错误'; break
        case -103: ErrText = '读卡器不支持'; break
        case -600: ErrText = '没找到YW-602系列UHF读卡器'; break
        case -601: ErrText = '寻G2标签失败'; break
        case -602: ErrText = '读G2标签失败'; break
        case -603: ErrText = '写G2标签失败'; break
        case -604: ErrText = '执行失败'; break
      }
      return ErrText
    },
    G2Inventory () {
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_Inventory(0)
    },
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
        { title: '尺码', key: 'size_name' },
        { title: '颜色', key: 'color_name' },
        { title: '件数', key: 'count' },
        { title: '数量', key: 'number' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    printTag () {
      let flag = this.log.filter(items => items.checked)
      if (flag.length === 0) {
        this.$message.warning('请勾选您需要打印成标签的日志')
        return
      }
      this.$openUrl('/receiveDispatchTable/' + this.$route.params.id + '?logId=' + flag.map(item => item.id).join(','))
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
            name: item.size_name + '/' + item.color_name,
            id: item.size_id + '/' + item.color_id
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: ''
        }],
        client_id: client,
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
                name: item.size_name + '/' + item.color_name,
                id: item.size_id + '/' + item.color_id
              }
            }),
            product_info: [{
              colorSize: itemChild.size_id + '/' + itemChild.color_id,
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
      }
      let formData = []
      this.weave_data.forEach((item) => {
        item.product_info.forEach((itemChild) => {
          formData.push({
            order_id: this.$route.params.id,
            product_id: item.product_id,
            client_id: item.client_id,
            size_id: itemChild.colorSize.split('/')[0],
            color_id: itemChild.colorSize.split('/')[1],
            count: itemChild.count,
            number: itemChild.number,
            complete_time: item.date,
            desc: item.desc
          })
        })
      })
      receiveDispatch.weaveCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.weave_data = []
          this.weave_flag = false
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个织造入库信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id)
            this.init()
          }
        }
      })
    },
    addColorSize (data, index) {
      if (data === 'process_data' && this.process_type === '芯片绑定') {
        this.$message.error('绑定芯片只能同时绑定一种尺码颜色')
      }
      this[data][index].product_info.push({
        colorSize: '',
        number: '',
        count: ''
      })
    },
    deleteColorSize (data, index, indexChild) {
      this[data][index].product_info.splice(index, 1)
    },
    selectProduct (id, index, data, fromData) {
      this[data][index].colorSizeArr = this[fromData].find((item) => {
        return item.product_id === id
      }).childrenMergeInfo.map((item) => {
        return {
          name: item.size_name + '/' + item.color_name,
          id: item.size_id + '/' + item.color_id
        }
      })
    },
    bindxp (client, product, colorSize, number, type) {
      this.process_type = '芯片绑定'
      this.process_flag = true
      this.process_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.process_product.find((item) => {
          return item.product_id === product
        }).childrenMergeInfo.map((item) => {
          return {
            name: item.size_name + '/' + item.color_name,
            id: item.size_id + '/' + item.color_id
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: '',
          count: ''
        }],
        clientInfo: [{
          production_type: type, // 工序
          client_id: client ? ['已分配单位', client] : []
        }],
        date: this.$getTime(new Date()),
        desc: ''
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
            name: item.size_name + '/' + item.color_name,
            id: item.size_id + '/' + item.color_id
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: ''
        }],
        clientInfo: [{
          production_type: type, // 工序
          client_id: client ? ['已分配单位', client] : []
        }],
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
            name: item.size_name + '/' + item.color_name,
            id: item.size_id + '/' + item.color_id
          }
        }) : [],
        product_info: [{
          colorSize: colorSize || '',
          number: number || '',
          count: ''
        }],
        clientInfo: [{
          production_type: type, // 工序
          client_id: client ? ['已分配单位', client] : []
        }],
        date: this.$getTime(new Date()),
        desc: ''
      })
    },
    bindXp (client, product, colorSize, number, type) {
      this.process_type = '芯片绑定'
      this.process_flag = true
      this.process_data.push({
        product_id: product || '',
        colorSizeArr: product ? this.process_product.find((item) => {
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
          count: ''
        }],
        clientInfo: [{
          production_type: type, // 工序
          client_id: client ? ['已分配单位', client.toString()] : []
        }],
        date: this.$getTime(new Date()),
        desc: ''
      })
    },
    processInAll () {
      this.process_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          if (itemChild.number - itemChild.inNum > 0) {
            this.process_data.push({
              product_id: itemChild.product_id,
              colorSizeArr: this.process_product.find((itemFind) => {
                return itemFind.product_id === itemChild.product_id
              }).childrenMergeInfo.map((item) => {
                return {
                  name: item.size_name + '/' + item.color_name,
                  id: item.size_id + '/' + item.color_id
                }
              }),
              product_info: [{
                colorSize: itemChild.size_id + '/' + itemChild.color_id || '',
                number: itemChild.number - itemChild.inNum,
                count: ''
              }],
              production_type: itemChild.type, // 工序
              client_id: item.client_id.toString(),
              date: this.$getTime(new Date()),
              desc: ''
            })
          }
        })
      })
      if (this.process_data.length > 0) {
        this.process_type = '入库'
        this.process_flag = true
      } else {
        this.$message.warning('产品已全部入库，如有需要可以手动入库')
      }
    },
    processOutAll () {
      this.process_detail.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          if (itemChild.number - itemChild.outNum > 0) {
            this.process_data.push({
              product_id: itemChild.product_id,
              colorSizeArr: this.process_product.find((itemFind) => {
                return itemFind.product_id === itemChild.product_id
              }).childrenMergeInfo.map((item) => {
                return {
                  name: item.size_name + '/' + item.color_name,
                  id: item.size_id + '/' + item.color_id
                }
              }),
              product_info: [{
                colorSize: itemChild.size_id + '/' + itemChild.color_id || '',
                number: itemChild.number - itemChild.outNum,
                count: ''
              }],
              production_type: itemChild.type, // 工序
              client_id: item.client_id.toString(),
              date: this.$getTime(new Date()),
              desc: ''
            })
          }
        })
      })
      if (this.process_data.length > 0) {
        this.process_type = '出库'
        this.process_flag = true
      } else {
        this.$message.warning('产品已全部出库，如有需要可以手动出库')
      }
    },
    cancleProcess () {
      this.process_data = []
      this.process_flag = false
    },
    addProcess () {
      if (this.process_type === '芯片绑定') {
        this.$message.error('绑定芯片操作只能同时绑定一个产品配色/尺码')
        return
      }
      this.process_data.push({
        product_id: '',
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          number: '',
          count: ''
        }],
        clientInfo: [{
          production_type: '', // 工序
          client_id: []
        }],
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
          } else if (!itemChild.count && this.process_type === '芯片绑定') {
            errorFlag = true
            errorMsg = '请输入每捆数量'
          }
        })
      })
      if (errorFlag) {
        this.$message.error(errorMsg)
        return
      }
      if (this.process_type === '芯片绑定') {
        this.xpform = {
          product_id: this.process_data[0].product_id,
          product_code: this.process_product.find((item) => {
            return item.product_id === this.process_data[0].product_id
          }).product_info.product_code,
          colorSize: this.process_data[0].colorSizeArr.find((item) => item.id === this.process_data[0].product_info[0].colorSize).name,
          color_id: this.process_data[0].product_info[0].colorSize.split('/')[1],
          size_id: this.process_data[0].product_info[0].colorSize.split('/')[0],
          desc: this.process_data[0].desc,
          number: this.process_data[0].product_info[0].number,
          clientInfo: this.process_data[0].clientInfo.map((item) => {
            return {
              client_id: item.client_id[1],
              client_name: this.process_company[1].children.find((itemFind) => {
                return Number(itemFind.value) === Number(item.client_id[1])
              }).label,
              production_type: item.production_type
            }
          }),
          date: this.process_data[0].date
        }
        this.nowLoop = 1
        this.xpflag = true
        this.startRead()
      } else {
        let formData = []
        this.process_data.forEach((item) => {
          item.product_info.forEach((itemChild) => {
            formData.push({
              order_id: this.$route.params.id,
              product_id: item.product_id,
              size_id: itemChild.colorSize.split('/')[0],
              color_id: itemChild.colorSize.split('/')[1],
              count: itemChild.count,
              number: itemChild.number,
              complete_time: item.date,
              client_info: JSON.stringify(item.clientInfo.map((item) => {
                return {
                  production_type: item.production_type,
                  client_id: item.client_id[1]
                }
              })),
              is_push: this.process_type === '出库' ? 0 : 1,
              is_pop: this.process_type === '出库' ? 1 : 0,
              is_chip: 0,
              desc: item.desc
            })
          })
        })
        receiveDispatch.semiCreate({ data: formData }).then((res) => {
          if (res.data.status) {
            this.$message.success(this.process_type + '成功')
            this.process_data = []
            this.process_flag = false
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id
              this.msgContent = '<span style="color:#1A95FF">添加</span>了一个半成品加工' + this.process_type + '信息,订单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
              this.msgSwitch = true
            } else {
              this.$router.push('/receiveDispatch/receiveDispatchDetail/' + this.$route.params.id)
              this.init()
            }
          }
        })
      }
    },
    deleteWeaveLog (id, index) {
      if (id === 'all' && this.weaveLog.filter((item) => item.checked).length === 0) {
        this.$message.error('请选择至少一条日志进行批量删除')
        return
      }
      this.$confirm('是否要删除该日志信息', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          receiveDispatch.weaveDelete({
            id: this.weaveLog.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            this.$message.success('删除成功')
            this.init()
          })
        } else {
          receiveDispatch.weaveDelete({
            id: [id]
          }).then((res) => {
            this.$message.success('删除成功')
            this.init()
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteProcessLog (id, index) {
      if (id === 'all' && this.processLog.filter((item) => item.checked).length === 0) {
        this.$message.error('请选择至少一条日志进行批量删除')
        return
      }
      this.$confirm('是否要删除该日志信息', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          receiveDispatch.semiDelete({
            id: this.processLog.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            this.$message.success('删除成功')
            this.init()
          })
        } else {
          receiveDispatch.semiDelete({
            id: [id]
          }).then((res) => {
            this.$message.success('删除成功')
            this.init()
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    startRead () {
      this.readTimer = setInterval(() => {
        this.ReadBlock()
      }, 1000)
    },
    // 完成绑定
    bindOver () {
      this.process_data = []
      this.process_flag = false
      this.xpflag = false
      clearInterval(this.readTimer)
      this.readTimer = null
      this.xpState = 1
      this.init()
    },
    submitXp () {
      let formData = [{
        order_id: this.$route.params.id,
        product_id: this.xpform.product_id,
        size_id: this.xpform.size_id,
        color_id: this.xpform.color_id,
        count: 1,
        number: this.xpform.number,
        complete_time: this.xpform.date,
        client_info: JSON.stringify(this.xpform.clientInfo.map((item) => {
          return {
            production_type: item.production_type,
            client_id: item.client_id
          }
        })),
        is_push: 0,
        is_pop: 0,
        is_chip: 1,
        desc: this.xpform.desc
      }]
      receiveDispatch.semiCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          this.WriteBlock(res.data.data[0])
          this.xpState = 3
        }
      })
    },
    goNext () {
      if (this.nowLoop < this.process_data[0].product_info[0].count) {
        this.nowLoop++
        this.startRead()
        return
      }
      if (this.nowLoop === this.process_data[0].product_info[0].count && this.process_data[0].product_info[0].lastNumber) {
        this.nowLoop++
        this.xpform.number = this.process_data[0].product_info[0].lastNumber
        this.startRead()
        return
      }
      if (this.nowLoop > this.process_data[0].product_info[0].count && this.nowLoop < (Number(this.process_data[0].product_info[0].count) + Number(this.process_data[0].product_info[0].lastCount))) {
        this.nowLoop++
        this.startRead()
        return
      }
      if (this.nowLoop > this.process_data[0].product_info[0].count && this.nowLoop === (Number(this.process_data[0].product_info[0].count) + Number(this.process_data[0].product_info[0].lastCount))) {
        this.xpState = 6
      }
    },
    dateToString (date) {
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      month = month > 9 ? month : ('0' + month)
      day = day > 9 ? day : ('0' + day)
      hour = hour > 9 ? hour : ('0' + hour)
      minute = minute > 9 ? minute : ('0' + minute)
      second = second > 9 ? second : ('0' + second)
      const dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return dateTime
    },
    lookDetail (detail) {
      const h = this.$createElement
      this.$msgbox({
        title: '其他信息',
        message: h('div', null, [
          h('div', null, [
            h('span', { style: 'color:#333333' }, '操作人：'),
            h('span', { style: 'color:#01B48C' }, detail.user_name)
          ]),
          h('div', null, [
            h('span', { style: 'color:#333333' }, '操作日期：'),
            h('span', { style: 'color:#01B48C' }, this.$getTime(detail.complete_time))
          ]),
          h('div', null, [
            h('span', { style: 'color:#333333' }, '备注信息：'),
            h('span', { style: 'color:#01B48C' }, detail.desc)
          ])
        ])
      })
      if (detail.client_info) {
        this.$msgbox({
          title: '其他信息',
          message: h('div', null, [
            h('div', null, [
              h('span', { style: 'color:#333333' }, '操作人：'),
              h('span', { style: 'color:#01B48C' }, detail.user_name)
            ]),
            h('div', null, [
              h('span', { style: 'color:#333333' }, '操作日期：'),
              h('span', { style: 'color:#01B48C' }, this.$getTime(detail.complete_time))
            ]),
            h('div', null, [
              h('span', { style: 'color:#333333' }, '公司信息：'),
              h('span', { style: 'color:#01B48C' }, detail.client_info.map((item) => {
                return item.client_name + '(' + item.production_type + ')'
              }).join(','))
            ]),
            h('div', null, [
              h('span', { style: 'color:#333333' }, '备注信息：'),
              h('span', { style: 'color:#01B48C' }, detail.desc)
            ])
          ])
        })
      } else {
        this.$msgbox({
          title: '其他信息',
          message: h('div', null, [
            h('div', null, [
              h('span', { style: 'color:#333333' }, '操作人：'),
              h('span', { style: 'color:#01B48C' }, detail.user_name)
            ]),
            h('div', null, [
              h('span', { style: 'color:#333333' }, '操作日期：'),
              h('span', { style: 'color:#01B48C' }, this.$getTime(detail.complete_time))
            ]),
            h('div', null, [
              h('span', { style: 'color:#333333' }, '备注信息：'),
              h('span', { style: 'color:#01B48C' }, detail.desc)
            ])
          ])
        })
      }
    },
    init () {
      this.loading = true
      Promise.all([order.detail({
        id: this.$route.params.id
      }), weave.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }), processing.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }), client.list(),
      receiveDispatch.weaveDetail({
        order_id: this.$route.params.id,
        order_type: 1
      }), receiveDispatch.semiDetail({
        order_id: this.$route.params.id,
        order_type: 1,
        start_time: null,
        end_time: null,
        product_code: null,
        operate_user: null,
        order_code: null
      }), process.list()]).then((res) => {
        this.orderInfo = res[0].data.data
        this.weave_detail = this.$mergeData(res[1].data.data, {
          mainRule: 'client_name',
          otherRule: [
            { name: 'client_id' }
          ],
          childrenRule: {
            mainRule: ['product_id', 'size_id', 'color_id'],
            otherRule: [
              { name: 'number', type: 'add' },
              { name: 'size_name' },
              { name: 'color_name' },
              { name: 'complete_time' },
              { name: 'product_info' }
            ]
          }
        })
        this.process_detail = this.$mergeData(res[2].data.data, {
          mainRule: 'client_name',
          otherRule: [
            { name: 'client_id' }
          ],
          childrenRule: {
            mainRule: ['product_id', 'size_id', 'color_id', 'type'],
            otherRule: [
              { name: 'number', type: 'add' },
              { name: 'size_name' },
              { name: 'color_name' },
              { name: 'complete_time' },
              { name: 'product_info' }
            ]
          }
        })

        this.weave_product = this.$mergeData(res[1].data.data, { mainRule: 'product_id', otherRule: [{ name: 'category_info' }, { name: 'product_info' }] })
        this.process_product = this.$mergeData(res[2].data.data, { mainRule: 'product_id', otherRule: [{ name: 'category_info' }, { name: 'product_info' }] })
        this.weave_company = res[3].data.data.filter((item) => {
          return item.type.indexOf(4) !== -1
        })
        this.process_company = [{
          value: '已分配单位',
          label: '已分配单位',
          children: this.process_detail.map((item) => {
            return {
              value: item.client_id,
              label: item.client_name
            }
          })
        }, {
          value: '所有加工单位',
          label: '所有加工单位',
          children: res[3].data.data.filter((item) => {
            let flag = false
            item.type.forEach((itemChild) => {
              if (itemChild === 5) {
                flag = true
              }
              if (itemChild >= 12 && itemChild <= 25) {
                flag = true
              }
            })
            return flag
          }).map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }]

        this.weaveLog = res[4].data.data
        this.processLog = res[5].data.data
        console.log(this.processLog)
        this.weave_detail.forEach((item) => {
          item.childrenMergeInfo.forEach((itemChild) => {
            itemChild.inNum = res[4].data.data.filter((itemFilter) => {
              return itemChild.product_id === itemFilter.product_id && itemFilter.size_id === itemChild.size_id && itemFilter.color_id === itemChild.color_id && itemFilter.client_name === item.client_name
            }).reduce((total, current) => {
              return total + current.number
            }, 0)
          })
        })
        this.processLogSts = this.$mergeData(res[5].data.data.map((item) => {
          item.bindNum = item.is_chip === 1 ? item.number : 0
          item.bindCount = item.is_chip === 1 ? item.count : 0
          item.inNum = item.is_push === 1 ? item.number : 0
          item.outNum = item.is_pop === 1 ? item.number : 0
          item.inCount = item.is_push === 1 ? item.count : 0
          item.outCount = item.is_pop === 1 ? item.count : 0
          return item
        }), {
          mainRule: 'product_id',
          otherRule: [{ name: 'category_info' }, { name: 'product_code' }],
          childrenRule: {
            mainRule: ['size_id', 'color_id'],
            otherRule: [
              { name: 'inNum', type: 'add' },
              { name: 'outNum', type: 'add' },
              { name: 'bindNum', type: 'add' },
              { name: 'inCount', type: 'add' },
              { name: 'outCount', type: 'add' },
              { name: 'bindCount', type: 'add' },
              { name: 'size_name' },
              { name: 'color_name' }
            ]
          }
        })
        console.log(this.processLogSts)
        // 出入库数量统计不了
        // this.process_detail.forEach((item) => {
        //   item.childrenMergeInfo.forEach((itemChild) => {
        //     itemChild.inNum = res[4].data.data.filter((itemFilter) => {
        //       return itemChild.product_id === itemFilter.product_id && itemFilter.size_id === itemChild.size_id && itemFilter.color_id === itemChild.color_id && itemFilter.client_name === item.client_name && itemFilter.production_type === itemChild.type
        //     }).reduce((total, current) => {
        //       return total + current.number
        //     }, 0)
        //   })
        // })
        // this.process_detail.forEach((item) => {
        //   item.childrenMergeInfo.forEach((itemChild) => {
        //     itemChild.outNum = res[5].data.data.filter((itemFilter) => {
        //       return itemChild.product_id === itemFilter.product_id && itemFilter.size_id === itemChild.size_id && itemFilter.color_id === itemChild.color_id && itemFilter.client_name === item.client_name && itemFilter.production_type === itemChild.type
        //     }).reduce((total, current) => {
        //       return total + current.number
        //     }, 0)
        //   })
        // })
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
            this.selectProduct(flag.product_id, 0, 'process_data', 'process_product')
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
            this.selectProduct(flag.product_id, 0, 'process_data', 'process_product')
          }
        }
        this.loading = false
      })
    }
  },
  mounted () {
    this.init()
    try {
      this.rfidreader = YOWORFIDReader.createNew()
    } catch (e) {
      this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
    }

    if (!this.rfidreader.TryConnect()) {
      this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
    }
    // this.rfidreader.Disconnect()
    this.rfidreader.onResult((resultdata) => {
      switch (resultdata.FunctionID) {
        // 寻标签，也就是硬件的唯一id
        case 23:
          if (resultdata.Result > 0) {
            console.log(resultdata.CardNo)
          } else {
            console.log(this.GetErrStr(resultdata.Result))
          }
          break
        // 读用户区
        case 24:
          if (resultdata.Result > 0) {
            console.log(resultdata.strData)
            if (this.dataBuffer.indexOf(resultdata.strData) !== -1) {
              this.xpState = 7
            } else {
              clearInterval(this.readTimer)
              this.readTimer = null
              this.xpState = 2
              this.submitXp()
            }
          } else {
            if (resultdata.Result === '没找到YW-602系列UHF读卡器') {
              this.$message.error('没找到YW-602系列UHF读卡器，请插入设备后使用该功能')
              clearInterval(this.readTimer)
              this.readTimer = null
              this.xpflag = false
            }
            console.log('读取失败，错误：' + this.GetErrStr(resultdata.Result))
          }
          break
        // 写用户区
        case 25:
          if (resultdata.Result > 0) {
            console.log(resultdata.strData)
            this.xpState = 4
            this.goNext()
          } else {
            this.xpState = 5
            console.log('写入失败，错误：' + this.GetErrStr(resultdata.Result))
            clearInterval(this.readTimer)
            this.readTimer = null
            this.startRead()
          }
          break
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/receiveDispatch/receiveDispatchDetail.less";
</style>
