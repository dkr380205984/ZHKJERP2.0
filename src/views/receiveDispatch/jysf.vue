<template>
  <!-- jysf就是检验收发的拼音缩写 -->
  <div id="receiveDispatchDetail"
    class="indexMain"
    v-loading="otherData.loading">
    <div class="module">
      <div class="titleCtn"
        style="display:flex;justify-content:space-between;align-items: center;">
        <span class="title">订单信息</span>
        <!-- <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"
          :afterSend="$winReload"></zh-message> -->
        <!-- <div class="btn btnWhiteBlue">确认成品信息</div> -->
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{renderData.orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{renderData.orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data="renderData.orderInfo.batch_info"></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{renderData.orderInfo.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{renderData.orderInfo.group_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{renderData.orderInfo.order_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':renderData.orderInfo.desc}">{{renderData.orderInfo.desc?renderData.orderInfo.desc:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <zh-file-module :orderId='$route.params.id' />
    <div class="module"
      v-if="renderData.allocation.length>0">
      <div class="titleCtn rightBtn">
        <span class="title">织造加工分配</span>
        <div style="display:flex">
          <div class="btn btnWhiteBlue"
            @click="downloadXp">下载芯片控件</div>
          <div class="btn btnBlue"
            @click="getConfirmDetail">产前信息确认</div>
        </div>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">单位名称/工序</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow">
                          <div class="tcolumn">尺码颜色</div>
                          <div class="tcolumn">分配数量</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="itemClient in renderData.allocation"
                  :key="itemClient.client_id + itemClient.process">
                  <div class="tcolumn">{{itemClient.client_name}}
                    <span style="color:#01B48C">({{itemClient.process}})</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="itemPro in itemClient.childrenMergeInfo"
                      :key="itemPro.product_id">
                      <div class="tcolumn">
                        <span style="color:#01B48C">{{itemPro.product_info.product_code}}</span>
                        <span>({{itemPro.product_info.category_name+'/'+ itemPro.product_info.type_name+'/'+ itemPro.product_info.style_name}})</span>
                      </div>
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow"
                          v-for="itemChild in itemPro.childrenMergeInfo"
                          :key="itemChild.color_id + '/' +  itemChild.size_id">
                          <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                          <div class="tcolumn"
                            :style="{'color':itemChild.number>0?'#01B48C':'#ccc'}">{{itemChild.number}}</div>
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">收发检验统计</span>
        <el-switch style="float:right;margin-top:20px;margin-right:32px"
          v-model="keyBoard"
          active-text="打开键盘"
          inactive-text="关闭键盘">
        </el-switch>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <!-- <div class="btn btnWhiteBlue"
              @click="addLog()">新增记录</div> -->
            <div class="btn btnWhiteBlue"
              @click="batchAddLog">批量新增</div>
            <div class="btn btnWhiteBlue"
              @click="otherData.batchFlag = true">批量绑定芯片</div>
            <!-- <div class="btn btnWhiteBlue"
              @click="saveAll">确认添加</div> -->
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">产品信息</div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow">
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">下单数量</div>
                      <div class="tcolumn">入库数量</div>
                      <div class="tcolumn">次品数量</div>
                      <div class="tcolumn">出库数量</div>
                      <div class="tcolumn">回库数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="itemPro in renderData.statistics"
                  :key="itemPro.product_id">
                  <div class="tcolumn">
                    <el-checkbox v-model="itemPro.checked"
                      style="align-items: center;display: flex;"
                      @change="checkAllColorSize($event,itemPro)">
                      <div style="display:flex;flex-direction:column">
                        <span style="color:#01B48C">{{itemPro.product_code}}</span>
                        <span>({{itemPro.category_info.category_name+'/'+ itemPro.category_info.type_name+'/'+ itemPro.category_info.style_name}})</span>
                      </div>
                    </el-checkbox>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:7">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <el-checkbox v-model="itemChild.checked"
                          @change="$forceUpdate()">{{itemChild.size_name}}/{{itemChild.color_name}}</el-checkbox>
                      </div>
                      <div class="tcolumn">{{itemChild.numbers}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.inNum===0?'#ccc':'#01B48C'}">{{itemChild.inNum}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.cpNum===0?'#ccc':'#F5222D'}">{{itemChild.cpNum}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.outNum===0?'#ccc':'#01B48C'}">{{itemChild.outNum}}</div>
                      <div class="tcolumn"
                        :style="{'color':itemChild.backNum===0?'#ccc':'#01B48C'}">{{itemChild.backNum}}</div>
                      <div class="tcolumn">
                        <div class="opr"
                          @click="addLog(itemPro.product_id, itemChild.size_id, itemChild.color_id,itemChild.numbers)">新增记录</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div style="padding:16px 32px;width:1272px;background:#FAFAFA;box-sizing:border-box"
              v-if="formData.tableData.length > 0">
              <el-table :data="formData.tableData"
                style="width:100%">
                <el-table-column fixed
                  label="产品名称"
                  width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.product_id"
                      @change="selectProduct($event,scope.$index)"
                      placeholder="选择产品">
                      <el-option v-for="item in selectData.productArr"
                        :key="item.product_id"
                        :value="item.product_id"
                        :label="item.product_code + '('+item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name+')'"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column fixed
                  label="尺码颜色"
                  width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.colorSize"
                      no-data-text="请先选择产品"
                      placeholder="选择尺码颜色">
                      <el-option v-for="item in scope.row.colorSizeArr"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="织造分配单位"
                  width="200">
                  <template slot-scope="scope">
                    <el-cascader v-model="scope.row.weave_client_id"
                      placeholder="选择织造单位"
                      :options="selectData.weaveClient">
                    </el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="数量"
                  width="200">
                  <template slot-scope="scope">
                    <zh-input :keyBoard="keyBoard"
                      v-model="scope.row.number"
                      placeholder="数量"></zh-input>
                  </template>
                </el-table-column>
                <el-table-column label="捆数"
                  width="200">
                  <template slot-scope="scope">
                    <zh-input :keyBoard="keyBoard"
                      v-model="scope.row.count"
                      placeholder="捆数"></zh-input>
                  </template>
                </el-table-column>
                <el-table-column label="次品数量"
                  width="200">
                  <template slot-scope="scope">
                    <zh-input :keyBoard="keyBoard"
                      v-model="scope.row.cpNum"
                      placeholder="次品数量"></zh-input>
                  </template>
                </el-table-column>
                <el-table-column label="次品原因"
                  width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.reason"
                      placeholder="选择次品原因"
                      collapse-tags
                      multiple>
                      <el-option v-for="(item,index) in selectData.defectiveType"
                        :key="index"
                        :label="item"
                        :value="item"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="出库单位"
                  width="200">
                  <template slot-scope="scope">
                    <el-cascader v-model="scope.row.semi_client_id"
                      placeholder="选择出库单位"
                      collapse-tags
                      :disabled="scope.row.back_client_id.length>0"
                      :props="{multiple:true}"
                      :options="selectData.semiClient">
                    </el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="回库单位"
                  width="200">
                  <template slot-scope="scope">
                    <el-cascader v-model="scope.row.back_client_id"
                      placeholder="选择回库单位"
                      collapse-tags
                      :disabled="scope.row.semi_client_id.length>0"
                      :props="{multiple:true}"
                      :options="selectData.backClient">
                    </el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="备注信息"
                  width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.desc"
                      placeholder="输入备注"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="绑定芯片"
                  width="200">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.is_xp"
                      active-text="绑定"
                      inactive-text="不绑定">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <div style="cursor:pointer;color:#F5222D"
                      @click="formData.tableData.splice(scope.$index,1)">删除</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="addRows"
              style="margin:0 32px">
              <span class="once"
                v-if="formData.tableData.length === 0"
                @click="addLog()">新增记录</span>
              <span class="once cancle"
                v-if="formData.tableData.length > 0"
                @click="formData.tableData = []">取消</span>
              <span class="once normal"
                v-if="formData.tableData.length > 0"
                @click="addLog()">新增记录</span>
              <span class="once ok"
                v-if="formData.tableData.length > 0"
                @click="saveAll">确认添加</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="nativeData.log.length>0">
      <div class="titleCtn">
        <span class="title">收发检验日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <div class="btn btnWhiteBlue"
              @click="batchUpdateLog('is_weave_push')">批量入库</div>
            <div class="btn btnWhiteBlue"
              @click="batchUpdateLog('is_semi_pop')">批量出库</div>
            <div class="btn btnWhiteBlue"
              @click="batchUpdateLog('is_semi_push')">批量回库</div>
            <div class="btn btnWhiteBlue"
              @click="deleteLog('all')">批量删除</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="padding:32px;width:1272px;background:#FAFAFA">
            <el-table ref="multipleTable"
              @selection-change="selectLog"
              :data="nativeData.log"
              style="width:100%">
              <el-table-column type="selection"
                width="55">
              </el-table-column>
              <el-table-column label="产品名称"
                width="200">
                <template slot-scope="scope">
                  <div style="display:flex;flex-direction:column">
                    <span style="color:#01B48C">
                      {{scope.row.product_code}}
                    </span>
                    <span>({{scope.row.category_info}})</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="尺码颜色"
                width="200">
                <template slot-scope="scope">
                  {{scope.row.colorSize}}
                </template>
              </el-table-column>
              <el-table-column label="数量"
                width="200">
                <template slot-scope="scope">
                  {{scope.row.number}}
                </template>
              </el-table-column>
              <el-table-column label="捆数"
                width="200">
                <template slot-scope="scope">
                  {{scope.row.count}}捆
                </template>
              </el-table-column>
              <el-table-column label="状态"
                width="200">
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;">
                    <div class="stateCtn"
                      :class="{'green':scope.row.is_chip===1}">
                      <div class="state"></div>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="scope.row.is_chip===1?'绑定日期：' + scope.row.chip_time.slice(0,10):'未绑定'"
                        placement="top">
                        <span class="name">芯</span>
                      </el-tooltip>
                    </div>
                    <div class="stateCtn"
                      :class="{'green':scope.row.is_weave_push===1}">
                      <div class="state"></div>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="scope.row.is_weave_push===1?'入库日期：' + scope.row.weave_time.slice(0,10):'未入库'"
                        placement="top">
                        <span class="name">入</span>
                      </el-tooltip>
                    </div>
                    <div class="stateCtn"
                      :class="{'green':scope.row.is_inspection===1}">
                      <div class="state"></div>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="scope.row.is_inspection===1?'检验日期：' + scope.row.inspection_time.slice(0,10):'未检验'"
                        placement="top">
                        <span class="name">检</span>
                      </el-tooltip>
                    </div>
                    <div class="stateCtn"
                      :class="{'green':scope.row.is_semi_pop===1}">
                      <div class="state"></div>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="scope.row.is_semi_pop===1?'出库日期：' + scope.row.semi_pop_time.slice(0,10):'未出库'"
                        placement="top">
                        <span class="name">出</span>
                      </el-tooltip>
                    </div>
                    <div class="stateCtn"
                      :class="{'green':scope.row.is_semi_push===1}">
                      <div class="state"></div>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="scope.row.is_semi_push===1?'回库日期：' + scope.row.semi_push_time.slice(0,10):'未回库'"
                        placement="top">
                        <span class="name">回</span>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="次品数量"
                width="200">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                    v-model="scope.row.cpNum"
                    placeholder="次品数量"></el-input>
                  <span v-if="!scope.row.isEdit"
                    :style="{'color':(scope.row.shoddy_number && scope.row.shoddy_number>0)?'#F5222D':'#ccc'}">{{scope.row.shoddy_number||0}}</span>
                </template>
              </el-table-column>
              <el-table-column label="次品原因"
                width="200">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit"
                    v-model="scope.row.reason"
                    placeholder="选择次品原因"
                    collapse-tags
                    multiple>
                    <el-option v-for="(item,index) in selectData.defectiveType"
                      :key="index"
                      :label="item"
                      :value="item"></el-option>
                  </el-select>
                  <span v-if="!scope.row.isEdit && scope.row.reason && scope.row.reason.length>0"
                    style="cursor:pointer;color:#1a95ff"
                    @click="lookDetail('reason',scope.row.reason)">查看原因</span>
                  <span v-if="!scope.row.isEdit && scope.row.reason && scope.row.reason.length === 0"
                    style="color:#ccc">暂无</span>
                </template>
              </el-table-column>
              <el-table-column label="织造分配单位"
                width="200">
                <template slot-scope="scope">
                  <el-cascader v-if="scope.row.isEdit"
                    v-model="scope.row.weave_client_id"
                    placeholder="选择织造单位"
                    :options="selectData.weaveClient">
                  </el-cascader>
                  <span v-if="!scope.row.isEdit">{{scope.row.weave_client_name||'暂无'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="半成品加工单位"
                width="200">
                <template slot-scope="scope">
                  <el-cascader v-if="scope.row.isEdit"
                    v-model="scope.row.semi_client_id"
                    placeholder="选择半成品加工单位"
                    collapse-tags
                    :props="{multiple:true}"
                    :options="selectData.semiClient">
                  </el-cascader>
                  <span v-if="!scope.row.isEdit&&scope.row.semi_client_info.length>0"
                    style="cursor:pointer;color:#1a95ff"
                    @click="lookDetail('client',scope.row.semi_client_info)">查看单位</span>
                  <span v-if="!scope.row.isEdit&&scope.row.semi_client_info.length===0"
                    style="color:#ccc">暂无</span>
                </template>
              </el-table-column>
              <el-table-column label="备注信息"
                width="200">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit"
                    v-model="scope.row.desc"
                    placeholder="输入备注"></el-input>
                  <span v-if="!scope.row.isEdit"
                    style="color:#ccc">{{scope.row.desc||'暂无'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                fixed="right"
                width="200">
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;justify-content:center;margin-bottom:5px">
                    <span style="cursor:pointer;color:#01B48C;padding:0 5px;border-right:1px solid #E8E8E8"
                      @click="updateLog(scope.row,'is_weave_push')">入库</span>
                    <span style="cursor:pointer;color:#01B48C;padding:0 5px;border-right:1px solid #E8E8E8"
                      @click="updateLog(scope.row,'is_semi_pop')">出库</span>
                    <span style="cursor:pointer;color:#01B48C;padding:0 5px;"
                      @click="updateLog(scope.row,'is_semi_push')">回库</span>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:center">
                    <span style="cursor:pointer;color:#E6A23C;padding:0 5px;border-right:1px solid #E8E8E8"
                      @click="scope.row.isEdit=true">编辑</span>
                    <span style="cursor:pointer;color:#1A95FF;padding:0 5px;border-right:1px solid #E8E8E8"
                      @click="updateLog(scope.row)">提交</span>
                    <span style="cursor:pointer;color:#F5222D;padding:0 5px;"
                      @click="deleteLog(scope.row.id)">删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="otherData.batchFlag">
      <div class="main">
        <div class="title">
          <div class="text">批量绑定芯片</div>
          <i class="el-icon-close"
            @click="otherData.batchFlag = false"></i>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">选择产品：</span>
            <span class="info">
              <el-select v-model="formData.batchData.product_id"
                @change="selectPopupProduct($event)"
                placeholder="选择产品">
                <el-option v-for="item in selectData.productArr"
                  :key="item.product_id"
                  :value="item.product_id"
                  :label="item.product_code + '('+item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name+')'"></el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">尺码颜色：</span>
            <span class="info">
              <el-select v-model="formData.batchData.colorSize"
                no-data-text="请先选择产品"
                placeholder="选择尺码颜色">
                <el-option v-for="item in formData.batchData.colorSizeArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">织造单位：</span>
            <span class="info">
              <el-cascader v-model="formData.batchData.weave_client_id"
                placeholder="选择单位"
                collapse-tags
                :options="selectData.weaveClient">
              </el-cascader>
            </span>
          </div>
          <div class="row">
            <span class="label">加工单位：</span>
            <span class="info">
              <el-cascader v-model="formData.batchData.semi_client_id"
                placeholder="选择单位"
                collapse-tags
                :options="selectData.semiClient"
                :props="{multiple:true}">
              </el-cascader>
            </span>
          </div>
          <div class="row">
            <span class="label">每捆数量：</span>
            <span class="info">
              <el-input style="height:32px;"
                v-model="formData.batchData.number"
                placeholder="每捆数量"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">捆数：</span>
            <span class="info">
              <el-input style="height:32px;"
                v-model="formData.batchData.count"
                placeholder="捆数">
                <template slot="append">捆</template>
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">尾捆数量：</span>
            <span class="info">
              <el-input style="height:32px;"
                v-model="formData.batchData.lastNumber"
                placeholder="尾捆每捆数量"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">尾捆捆数：</span>
            <span class="info">
              <el-input style="height:32px;"
                v-model="formData.batchData.lastCount"
                placeholder="尾捆捆数">
                <template slot="append">捆</template>
              </el-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <span class="btn btnGray"
            @click="otherData.batchFlag = false">取消</span>
          <span class="btn btnBlue"
            @click="batchBindXp">确定</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="otherData.xpFlag">
      <div class="main"
        style="width:830px;">
        <div class="title">
          <div class="text">绑定芯片</div>
          <i class="el-icon-close"
            @click="cancleBind"></i>
        </div>
        <div class="content">
          <div class="stockTable">
            <div class="line line1">第{{formData.xpform.count}}捆</div>
            <div class="line">
              <div class="rowCtn">
                <div class="label">操作日期</div>
                <div class="info">{{$getTime(new Date())}}</div>
              </div>
              <div class="rowCtn">
                <div class="label">产品信息</div>
                <div class="info twice">{{formData.xpform.product_code}}({{formData.xpform.colorSize}})</div>
              </div>
            </div>
            <div class="line"
              v-for="(item,index) in formData.xpform.clientInfo"
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
                <div class="info noBorderBottom">{{formData.xpform.number}}</div>
              </div>
              <div class="rowCtn">
                <div class="label noBorderBottom">备注信息</div>
                <div class="info noBorderBottom twice">
                  {{formData.xpform.desc}}
                </div>
              </div>
            </div>
          </div>
          <div class="stockState">
            <div class="icon"></div>
            <div class="message">
              <span v-if="otherData.xpState===1">请放入芯片</span>
              <span v-if="otherData.xpState===2">正在上传数据...</span>
              <span v-if="otherData.xpState===3">正在写入数据...</span>
              <span v-if="otherData.xpState===4">写入成功，请放入下一个芯片</span>
              <span v-if="otherData.xpState===5"
                style="color:#F5222D">写入失败，请换一个芯片</span>
              <span v-if="otherData.xpState===6"
                style="color:#01B48C">已完成所有芯片绑定，点击完成关闭页面</span>
              <span v-if="otherData.xpState===7"
                style="color:#F5222D">芯片已绑定，请换取下一个芯片</span>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="cancleBind">取消</div>
          <div class="btn btnBlue"
            @click="bindOver">确认完成</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="otherData.batchAddFlag">
      <div class="main">
        <div class="title">
          <div class="text">选择单位</div>
          <i class="el-icon-close"
            @click="otherData.batchAddFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">织造单位：</span>
            <span class="info">
              <el-cascader v-model="otherData.commonInfo.weave_client_id"
                placeholder="选择单位"
                collapse-tags
                :options="selectData.weaveClient">
              </el-cascader>
            </span>
          </div>
          <div class="row">
            <span class="label">加工单位：</span>
            <span class="info">
              <el-cascader v-model="otherData.commonInfo.semi_client_id"
                placeholder="选择单位"
                collapse-tags
                :disabled="otherData.commonInfo.back_client_id.length>0"
                :options="selectData.semiClient"
                :props="{multiple:true}">
              </el-cascader>
            </span>
          </div>
          <div class="row">
            <span class="label">回库单位：</span>
            <span class="info">
              <el-cascader v-model="otherData.commonInfo.back_client_id"
                placeholder="选择单位"
                collapse-tags
                :disabled="otherData.commonInfo.semi_client_id.length>0"
                :options="selectData.backClient"
                :props="{multiple:true}">
              </el-cascader>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="otherData.batchAddFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="commonFn">完成</div>
        </div>
      </div>
    </div>
    <!-- 扫码枪扫进来的 -->
    <div class="popup"
      v-show="otherData.codeFlag">
      <div class="main">
        <div class="title">
          <div class="text">扫码详情</div>
          <i class="el-icon-close"
            @click="otherData.codeFlag=false"></i>
        </div>
        <div class="content"
          style="position:relative">
          <div style="background:#ccc;color:rgba(0,0,0,0.85);font-size:14px;padding:8px;border-radius:4px">请仔细核对订单信息，产品信息是否匹配！！！</div>
          <div class="row">
            <span class="label">产品图片：</span>
            <span class="info">
              <img v-for="(itemImg,indexImg) in formData.codeData.image"
                :key="indexImg"
                :src="itemImg.thumb" />
              <span v-if="formData.codeData.image.length===0">暂无图片</span>
            </span>
          </div>
          <div class="row">
            <span class="label">选择产品：</span>
            <span class="info">
              <el-select v-model="formData.codeData.product_id"
                @change="getColorSize($event)"
                placeholder="选择产品">
                <el-option v-for="item in selectData.productArr"
                  :key="item.product_id"
                  :value="Number(item.product_id)"
                  :label="item.product_code + '('+item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name+')'"></el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">尺码颜色：</span>
            <span class="info">
              <el-select v-model="formData.codeData.colorSize"
                no-data-text="请先选择产品"
                placeholder="选择尺码颜色">
                <el-option v-for="item in formData.codeData.colorSizeArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">织造单位：</span>
            <span class="info">
              <el-cascader v-model="formData.codeData.weave_client_id"
                placeholder="选择织造单位"
                :options="selectData.weaveClient">
              </el-cascader>
            </span>
          </div>
          <div class="row"
            style="position:relative">
            <span class="label">入库数量：</span>
            <span class="info"
              style="position:relative">
              <zh-input :keyBoard="keyBoard"
                v-model="formData.codeData.number"
                placeholder="入库数量"></zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">次品数量：</span>
            <span class="info">
              <zh-input :keyBoard="keyBoard"
                v-model="formData.codeData.cpNum"
                placeholder="次品数量"></zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">次品原因：</span>
            <span class="info">
              <el-select v-model="formData.codeData.reason"
                placeholder="选择次品原因"
                collapse-tags
                multiple>
                <el-option v-for="(item,index) in selectData.defectiveType"
                  :key="index"
                  :label="item"
                  :value="item"></el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">绑定芯片：</span>
            <span class="info"
              style="display:flex;align-items:center">
              <el-switch v-model="formData.codeData.is_xp"
                active-text="绑定"
                inactive-text="不绑定">
              </el-switch>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="otherData.codeFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="codeSubmit">提交</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="otherData.showCompare">
      <div class="main"
        style="width:800px">
        <div class="title">
          <div class="text">半成品信息确认</div>
          <i class="el-icon-close"
            @click="otherData.showCompare=false"></i>
        </div>
        <div class="content"
          style="align-items:baseline">
          <div class="tips"
            v-if="otherData.showCompare === 2">
            提示信息：首次半成品检验需要确认半成品信息是否和样品相同，请按照实际情况填写下列信息。
          </div>
          <div class="popupTable">
            <div class="row"
              v-for="(item,index) in otherData.compareInfo"
              :key="index">
              <div class="col hasBack"
                style="width:6em;flex:none">{{item.name}}</div>
              <div class="col"
                v-if="!item.isRemarkItem">
                <template v-if="otherData.showCompare === 1">
                  <span :class="{'green':item.status,'orange': !item.status }">{{`${item.status ? '无差异' :'差异较大'}`}}</span>
                </template>
                <template v-else>
                  <el-radio v-model="item.status"
                    :label="true"
                    @change="item.info = ''">无差异</el-radio>
                  <el-radio v-model="item.status"
                    :label="false">差异较大</el-radio>
                </template>
              </div>
              <div class="col"
                :style="{'flex':item.isRemarkItem ? 2.8 : 1.8}"
                v-if="otherData.showCompare === 1">
                <template v-if="Array.isArray(item.info)">
                  {{item.info.join(';') || '无'}}
                </template>
                <template v-else>
                  {{item.info || '无'}}
                </template>
              </div>
              <div class="col"
                :style="{'flex':item.isRemarkItem ? 2.8 : 1.8}"
                v-if="otherData.showCompare === 2">
                <template v-if="item.isSelect">
                  <el-select v-model="item.info"
                    :disabled='item.status'
                    filterable
                    clearable
                    multiple
                    collapse-tags
                    :placeholder="item.selectPlaceholder || '请选择不符合的产品'">
                    <el-option v-for="item in otherData.compareOptions[item.optionsName]"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-input v-model="item.info"
                    :disabled="item.status && !item.isRemarkItem"
                    placeholder="请输入备注信息"></el-input>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="otherData.showCompare=false">{{otherData.showCompare === 2 ? '取消' : '关闭'}}</div>
          <div class="btn btnBlue"
            v-if="otherData.showCompare === 2"
            @click="compareSubmit">确定</div>
          <div class="btn btnOrange"
            v-else
            @click="confirmBeforeProductionInfo">修改</div>
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
    <history-pendant prefix="/receiveDispatch/jysf"></history-pendant>
  </div>
</template>

<script>
import { YOWORFIDReader } from '@/assets/js/YOWOCloudRFIDReader.js'
import { order, weave, processing, client, process, receiveDispatch, compare } from '@/assets/js/api.js'
export default {
  data () {
    return {
      rfidreader: null,
      keyBoard: true,
      // 渲染层，用于渲染页面的数据
      renderData: {
        orderInfo: {
          order_code: '',
          client_name: '',
          user_name: '',
          group_name: '',
          order_time: '',
          order_batch: [],
          desc: ''
        },
        allocation: [],
        statistics: []
      },
      // 表单数据，用于提交的数据
      formData: {
        // 二维码扫进来提交的表单
        codeData: {
          image: [],
          product_id: '',
          product_code: '',
          colorSize: '',
          colorSizeArr: [],
          weave_client_id: [],
          semi_client_id: [],
          back_client_id: [],
          number: '',
          cpNum: '',
          count: '',
          is_xp: true,
          cpNumber: '',
          reason: '',
          desc: ''
        },
        tableData: [],
        batchData: {
          product_id: '',
          colorSize: '',
          colorSizeArr: [],
          weave_client_id: '',
          semi_client_id: '',
          number: '',
          count: '',
          ifXp: false,
          date: this.$getTime(new Date())
        },
        xpformArr: [], // 芯片数据缓存队列
        xpform: {
          product_code: '',
          colorSize: '',
          desc: '',
          number: '',
          count: '',
          clientInfo: []
        }
      },
      // 原始数据，往往来源于接口
      nativeData: {
        resSort: {
          common: [],
          receiveDispatch: []
        },
        log: [],
        selectedLog: [],
        allClient: []
      },
      // 下拉框，搜索框的数据
      selectData: {
        productArr: [],
        weaveClient: [{
          value: '已分配单位',
          label: '已分配单位',
          children: []
        }, {
          client_name: '针织织造单位',
          label: '针织织造单位',
          children: []
        }, {
          value: '梭织织造单位',
          label: '梭织织造单位',
          children: []
        }],
        semiClient: [{
          value: '已分配单位',
          label: '已分配单位',
          children: []
        }, {
          value: '半成品加工单位',
          label: '半成品加工单位',
          children: []
        }],
        defectiveType: ['跳线', '污迹', '经纬断线', '严重破损', '边型问题', '流苏问题', '颜色问题', '花型问题', '款型问题', '克重问题', '长度问题', '工序问题', '质量问题', '加工问题', '其他问题']
      },
      // 其他数据，一般是控制页面显隐的锁
      otherData: {
        loading: true,
        batchFlag: false,
        xpFlag: false,
        codeFlag: false,
        xpLoop: 0,
        xpState: 1,
        readTimer: null,
        checkAll: false,
        batchAddFlag: false,
        commonInfo: {
          weave_client_id: [],
          semi_client_id: [],
          back_client_id: []
        },
        // 产前信息确认
        showCompare: false, // false不展示弹窗 1为详情 2为修改
        compareInfo: [
          {
            name: '半成品尺寸', // 第一项为原料title 第二项辅料title
            status: true,
            info: '',
            isSelect: true,
            optionsName: 'productList'
          }, {
            name: '半成品花型',
            status: true,
            info: '',
            isSelect: true,
            optionsName: 'productList'
          }, {
            name: '半成品配色',
            status: true,
            info: '',
            isSelect: true,
            optionsName: 'productList'
          }, {
            isRemarkItem: true,
            name: '其它备注',
            info: ''
          }
        ],
        compareOptions: {
          productList: []
        },
        dataBuffer: [], // xp缓存日志id
        commonApi: [{
          api: order.detail,
          params: { id: this.$route.params.id },
          type: 'common'
        }, {
          api: client.list,
          params: {},
          type: 'common'
        }, {
          api: process.list,
          params: {},
          type: 'common'
        }, {
          api: weave.detail,
          params: {
            order_id: this.$route.params.id,
            order_type: 1
          },
          type: 'common'
        }, {
          api: processing.detail,
          params: {
            order_id: this.$route.params.id,
            order_type: 1
          },
          type: 'common'
        }],
        otherApi: [{
          api: receiveDispatch.allDetail,
          params: {
            order_id: this.$route.params.id,
            order_type: 1
          },
          type: 'receiveDispatch'
        }]
      }
    }
  },
  methods: {
    getConfirmDetail () {
      this.loading = true
      compare.detail({
        id: this.$route.params.id
      }).then(res => {
        this.loading = false
        if (res.data.status !== false) {
          if (res.data.data.product_inspection_confirm) {
            this.otherData.compareInfo = JSON.parse(res.data.data.product_inspection_confirm).compareInfo
            this.otherData.showCompare = 1
          } else {
            this.confirmBeforeProductionInfo()
          }
        }
      })
    },
    // 产前信息确认
    confirmBeforeProductionInfo () {
      this.otherData.compareOptions.productList = this.$unique(this.renderData.allocation.map(itemC => {
        return itemC.childrenMergeInfo.map(itemP => {
          return itemP.childrenMergeInfo.map(itemSC => {
            return `${itemP.product_info.product_code}/${itemSC.size_name}/${itemSC.color_name}`
          })
        })
      }).flat(Infinity))
      this.otherData.showCompare = 2
    },
    // 提交确认信息
    compareSubmit () {
      compare.create({
        order_id: this.$route.params.id,
        product_inspection_confirm: JSON.stringify({
          compareInfo: this.otherData.compareInfo,
          user_name: window.sessionStorage.getItem('user_name'),
          update_time: this.$getTime()
        })
      }).then(res => {
        if (res.data.stauts !== false) {
          this.$message.success('确认成功')
          this.otherData.showCompare = false
        }
      })
    },
    downloadXp () {
      window.location = 'http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe'
    },
    init (api) {
      let apiArr = api || this.otherData.otherApi
      this.otherData.loading = true
      Promise.all(apiArr.map((item) => {
        return item.api.call(null, item.params)
      })).then((res) => {
        this.nativeData.resSort.receiveDispatch = []
        apiArr.forEach((item, index) => {
          this.nativeData.resSort[item.type].push(res[index])
        })
        if (api) {
          this.getCommon(this.nativeData.resSort.common)
          // 处理扫码枪逻辑
          if (this.$route.query && this.$route.query.client_id) {
            this.formData.codeData = {
              product_id: Number(this.$route.query.product_id),
              product_code: '',
              colorSize: '',
              colorSizeArr: [],
              weave_client_id: ['已分配单位', this.$route.query.client_id + '/织造'],
              semi_client_id: [],
              back_client_id: [],
              number: '',
              cpNum: '',
              count: '1',
              is_xp: true,
              cpNumber: '',
              reason: '',
              desc: ''
            }
            this.getColorSize(Number(this.$route.query.product_id))
            this.otherData.codeFlag = true
          }
        }
        this.getReceiveDispatch(this.nativeData.resSort.receiveDispatch)
        this.otherData.loading = false
      })
    },
    // 处理公共数据，一般只处理一次
    getCommon (resArr) {
      this.renderData.orderInfo = resArr[0].data.data
      // 初始化织造加工分配表
      let allocation = resArr[3].data.data.map((item) => {
        return {
          client_id: item.client_id,
          client_name: item.client_name,
          color_id: item.color_id,
          color_name: item.color_name,
          size_name: item.size_name,
          size_id: item.size_id,
          process: item.process,
          product_id: item.product_id,
          product_info: item.product_info,
          number: item.number
        }
      }).concat(resArr[4].data.data.map((item) => {
        return {
          client_id: item.client_id,
          client_name: item.client_name,
          color_id: item.color_id,
          color_name: item.color_name,
          size_name: item.size_name,
          size_id: item.size_id,
          process: item.type,
          product_id: item.product_id,
          product_info: item.product_info,
          number: item.number
        }
      }))
      let allocationAdd = []
      allocation.forEach((item) => {
        this.$commonFind(allocationAdd, item, ['color_id', 'product_id', 'size_id', 'client_id', 'process'], ['number'])
      })
      let allocationMerge = this.$mergeData(allocationAdd, {
        mainRule: ['client_id', 'process'],
        otherRule: [
          { name: 'client_name' }
        ],
        childrenRule: {
          mainRule: ['product_id'],
          otherRule: [
            { name: 'product_info' }
          ]
        }
      })
      this.renderData.allocation = allocationMerge
      let productFlat = []
      resArr[0].data.data.batch_info.forEach((itemBatch) => {
        itemBatch.product_info.forEach((itemPro) => {
          productFlat.push(itemPro)
        })
      })
      this.selectData.productArr = this.$mergeData(productFlat, {
        mainRule: 'product_id',
        otherRule: [{ name: 'category_info' }, { name: 'product_code' }, { name: 'image' }],
        childrenRule: {
          mainRule: ['color_id', 'size_id'],
          otherRule: [
            { name: 'color_name' },
            { name: 'size_name' },
            { name: 'numbers', type: 'add' }
          ]
        }
      })
      this.renderData.statistics = this.$clone(this.selectData.productArr)
      this.nativeData.allClient = resArr[1].data.data
      this.selectData.weaveClient = [{
        value: '已分配单位',
        label: '已分配单位',
        children: this.$mergeData(allocation.filter((item) => item.process === '织造'), {
          mainRule: ['client_id', 'process'],
          otherRule: [{ name: 'client_name' }]
        }).map((item) => {
          console.log(item)
          return {
            value: item.client_id + '/' + item.process,
            label: item.client_name + '/' + item.process
          }
        })
      }, {
        value: '针织织造单位',
        label: '针织织造单位',
        children: resArr[1].data.data.filter((item) => item.type.indexOf(14) !== -1).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }, {
        label: '梭织织造单位',
        value: '梭织织造单位',
        children: resArr[1].data.data.filter((item) => item.type.indexOf(13) !== -1).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }]
      this.selectData.semiClient = [{
        value: '已分配单位',
        label: '已分配单位',
        children: this.$mergeData(allocation.filter((item) => item.process !== '织造'), {
          mainRule: ['client_id', 'process'],
          otherRule: [{ name: 'client_name' }]
        }).map((item) => {
          return {
            value: item.client_id + '/' + item.process,
            label: item.client_name + '/' + item.process
          }
        })
      }, {
        value: '半成品加工单位',
        label: '半成品加工单位',
        children: resArr[1].data.data.filter((item) => {
          return item.type.some((itemSome) => {
            return itemSome <= 28 || itemSome >= 15
          })
        }).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }]
      this.selectData.backClient = [{
        value: '已分配单位',
        label: '已分配单位',
        children: this.$mergeData(allocation.filter((item) => item.process !== '织造'), {
          mainRule: ['client_id', 'process'],
          otherRule: [{ name: 'client_name' }]
        }).map((item) => {
          return {
            value: item.client_id + '/' + item.process,
            label: item.client_name + '/' + item.process
          }
        })
      }, {
        value: '半成品加工单位',
        label: '半成品加工单位',
        children: resArr[1].data.data.filter((item) => {
          return item.type.some((itemSome) => {
            return itemSome <= 28 || itemSome >= 15
          })
        }).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }, {
        value: '针织织造单位',
        label: '针织织造单位',
        children: resArr[1].data.data.filter((item) => item.type.indexOf(14) !== -1).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }, {
        label: '梭织织造单位',
        value: '梭织织造单位',
        children: resArr[1].data.data.filter((item) => item.type.indexOf(13) !== -1).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }]
    },
    getReceiveDispatch (resArr) {
      this.nativeData.log = resArr[0].data.data.map((item) => {
        return {
          isEdit: false,
          id: item.id,
          product_id: item.product_id,
          size_id: item.size_id,
          color_id: item.color_id,
          product_code: item.product_info.product_code,
          category_info: item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name,
          colorSize: item.size_name + '/' + item.color_name,
          weave_client_id: [],
          weave_client_name: item.weave_client_name,
          weave_client_old_id: item.weave_client_id,
          semi_client_id: [],
          semi_client_info: item.semi_client_info,
          back_client_id: [],
          number: item.number,
          cpNum: item.shoddy_number, // 这个是编辑框的次品数量
          shoddy_number: item.shoddy_number, // 这个是老的次品数量
          count: item.count,
          is_weave_push: item.is_weave_push,
          is_chip: item.is_chip,
          is_inspection: item.is_inspection,
          is_semi_pop: item.is_semi_pop,
          is_semi_push: item.is_semi_push,
          reason: item.shoddy_reason ? item.shoddy_reason.split(',') : [],
          semi_pop_time: item.semi_pop_time,
          semi_push_time: item.semi_push_time,
          chip_time: item.chip_time,
          inspection_time: item.inspection_time,
          weave_time: item.weave_time,
          desc: item.desc
        }
      })
      // 根据日志统计数据
      // if (this.nativeData.log.length === 0) {
      //   this.otherData.showCompare = true
      // }
      this.renderData.statistics.forEach((itemPro) => {
        itemPro.childrenMergeInfo.forEach((itemChild) => {
          itemChild.inNum = this.nativeData.log.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id && itemFind.is_weave_push === 1).reduce((total, current) => {
            return total + current.number
          }, 0)
          itemChild.outNum = this.nativeData.log.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id && itemFind.is_semi_pop === 1).reduce((total, current) => {
            return total + current.number
          }, 0)
          itemChild.cpNum = this.nativeData.log.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id).reduce((total, current) => {
            return total + current.shoddy_number
          }, 0)
          itemChild.backNum = this.nativeData.log.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id && itemFind.is_semi_push === 1).reduce((total, current) => {
            return total + current.number
          }, 0)
        })
      })
    },
    addLog (productId, sizeId, colorId, number) {
      this.formData.tableData.push({
        product_id: productId || '',
        product_code: '',
        colorSize: productId ? sizeId + '/' + colorId : '',
        colorSizeArr: [],
        weave_client_id: [],
        semi_client_id: [],
        back_client_id: [],
        number: number || '',
        cpNum: '',
        count: '',
        is_xp: false,
        cpNumber: '',
        reason: '',
        desc: ''
      })
      if (productId) {
        this.selectProduct(productId, this.formData.tableData.length - 1)
      }
    },
    checkAllColorSize (ev, itemPro) {
      itemPro.childrenMergeInfo.forEach((item) => {
        item.checked = ev
      })
    },
    batchAddLog () {
      if (this.formData.tableData.length > 0) {
        this.$message.error('请先提交已填写的记录')
        return
      }
      this.renderData.statistics.forEach((itemPro) => {
        itemPro.childrenMergeInfo.forEach((itemChild) => {
          if (itemChild.checked) {
            this.formData.tableData.push({
              product_id: itemPro.product_id,
              product_code: '',
              colorSize: itemChild.size_id + '/' + itemChild.color_id,
              colorSizeArr: itemPro.childrenMergeInfo.map((item) => {
                return {
                  name: item.size_name + '/' + item.color_name,
                  id: item.size_id + '/' + item.color_id
                }
              }),
              weave_client_id: [],
              semi_client_id: [],
              back_client_id: [],
              number: itemChild.numbers,
              cpNum: '',
              count: '',
              is_xp: false,
              cpNumber: '',
              reason: '',
              desc: ''
            })
          }
        })
      })
      if (this.formData.tableData.length === 0) {
        this.$message.error('请至少选择一种配色尺码')
        return
      }
      this.otherData.batchAddFlag = true
    },
    commonFn () {
      this.formData.tableData.forEach((item) => {
        item.weave_client_id = this.$clone(this.otherData.commonInfo.weave_client_id)
        item.semi_client_id = this.$clone(this.otherData.commonInfo.semi_client_id)
        item.back_client_id = this.$clone(this.otherData.commonInfo.back_client_id)
      })
      this.otherData.batchAddFlag = false
    },
    batchBindXp () {
      let errorMsg = ''
      if (!this.formData.batchData.count) {
        errorMsg = '请输入捆数'
      }
      if (!this.formData.batchData.number) {
        errorMsg = '请输入每捆数量'
      }
      if (!this.formData.batchData.weave_client_id && !this.formData.batchData.semi_client_id) {
        errorMsg = '请选择单位'
      }
      if (!this.formData.batchData.colorSize) {
        errorMsg = '请选择尺码颜色'
      }
      if (!this.formData.batchData.product_id) {
        errorMsg = '请选择产品'
      }
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      this.formData.tableData = new Array(Number(this.formData.batchData.count) + (Number(this.formData.batchData.lastCount) || 0)).fill(null).map((item, index) => {
        let number = index < Number(this.formData.batchData.count) ? this.formData.batchData.number : this.formData.batchData.lastNumber
        return {
          product_id: this.formData.batchData.product_id,
          product_code: '',
          colorSize: this.formData.batchData.colorSize,
          colorSizeArr: this.selectData.productArr.find((item) => {
            return item.product_id === this.formData.batchData.product_id
          }).childrenMergeInfo.map((item) => {
            return {
              name: item.size_name + '/' + item.color_name,
              id: item.size_id + '/' + item.color_id
            }
          }),
          weave_client_id: this.formData.batchData.weave_client_id || [],
          semi_client_id: this.formData.batchData.semi_client_id || [],
          back_client_id: [],
          number: number,
          cpNum: '',
          inDate: '',
          insDate: '',
          backDate: '',
          outDate: '',
          count: (index + 1) + '/' + (Number(this.formData.batchData.count) + (Number(this.formData.batchData.lastCount) || 0)),
          is_weaveIn: '',
          is_xp: true,
          is_jy: '',
          is_semiOut: '',
          is_semiIn: '',
          cpNumber: '',
          reason: '',
          desc: ''
        }
      })
      console.log(this.formData.tableData)
      this.otherData.batchFlag = false
    },
    deleteLog (id) {
      if (id === 'all' && this.nativeData.selectedLog.length === 0) {
        this.$message.error('请选择至少一条日志进行批量删除')
        return
      }
      this.$confirm('是否要删除该日志信息', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          receiveDispatch.allDelete({
            id: this.nativeData.selectedLog.map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.init()
            }
          })
        } else {
          receiveDispatch.allDelete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
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
    batchUpdateLog (stateChange) {
      const errMsg = {
        is_semi_pop: '出库',
        is_semi_push: '回库',
        is_weave_push: '入库'
      }
      const stateTime = {
        is_semi_pop: 'semi_pop_time',
        is_semi_push: 'semi_push_time',
        is_weave_push: 'weave_time'
      }
      if (this.nativeData.selectedLog.length === 0) {
        this.$message.error('请选择至少一条日志进行批量' + errMsg[stateChange])
        return
      }
      this.nativeData.selectedLog.forEach((item) => {
        item[stateChange] = 1
        item[stateTime[stateChange]] = this.$getTime(new Date())
      })
      let formData = this.nativeData.selectedLog.map((log) => {
        return {

          id: log.id,
          order_id: this.$route.params.id,
          order_type: 1,
          product_id: log.product_id,
          size_id: log.size_id,
          color_id: log.color_id,
          weave_client_id: log.weave_client_id.length > 0 ? parseInt(log.weave_client_id[1]) : log.weave_client_old_id,
          semi_client_info: log.semi_client_id.length > 0 ? JSON.stringify(log.semi_client_id.map((itemChild) => {
            return {
              client_id: itemChild[1].split('/')[0],
              production_type: itemChild[1].split('/').slice(1).join('/')
            }
          })) : JSON.stringify(log.semi_client_info),
          count: log.count,
          number: log.number,
          is_chip: log.is_chip,
          chip_time: log.chip_time,
          chip_user: '',
          is_weave_push: log.is_weave_push,
          weave_time: log.weave_time,
          weave_user: '',
          is_inspection: log.cpNum === log.shoddy_number ? log.is_inspection : 1,
          inspection_time: log.cpNum === log.shoddy_number ? log.inspection_time : this.$getTime(new Date()),
          inspection_user: '',
          shoddy_number: log.cpNum,
          shoddy_reason: log.reason.join(','),
          is_semi_pop: log.is_semi_pop,
          semi_pop_time: log.semi_pop_time,
          semi_pop_user: '',
          is_semi_push: log.is_semi_push,
          semi_push_time: log.semi_push_time,
          semi_push_user: '',
          desc: log.desc
        }
      })
      this.otherData.loading = true
      receiveDispatch.allCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('批量' + errMsg[stateChange] + '成功')
          this.init()
        }
      })
    },
    updateLog (log, stateChange) {
      if (!log.isEdit && !stateChange) {
        this.$message.error('请编辑后再提交数据')
        return
      }
      const errMsg = {
        is_semi_pop: '出库',
        is_semi_push: '回库',
        is_weave_push: '入库'
      }
      const stateTime = {
        is_semi_pop: 'semi_pop_time',
        is_semi_push: 'semi_push_time',
        is_weave_push: 'weave_time'
      }
      if (stateChange && log[stateChange] === 1) {
        this.$message.error('该日志已经' + errMsg[stateChange])
        return
      }
      if (stateChange && log[stateChange] === 2) {
        log[stateChange] = 1
        log[stateTime[stateChange]] = this.$getTime(new Date())
      }
      let formData = [{
        id: log.id,
        order_id: this.$route.params.id,
        order_type: 1,
        product_id: log.product_id,
        size_id: log.size_id,
        color_id: log.color_id,
        weave_client_id: log.weave_client_id.length > 0 ? parseInt(log.weave_client_id[1]) : log.weave_client_old_id,
        semi_client_info: log.semi_client_id.length > 0 ? JSON.stringify(log.semi_client_id.map((itemChild) => {
          return {
            client_id: itemChild[1].split('/')[0],
            production_type: itemChild[1].split('/').slice(1).join('/')
          }
        })) : JSON.stringify(log.semi_client_info),
        count: log.count,
        number: log.number,
        is_chip: log.is_chip,
        chip_time: log.chip_time,
        chip_user: '',
        is_weave_push: log.is_weave_push,
        weave_time: log.weave_time,
        weave_user: '',
        is_inspection: log.cpNum === log.shoddy_number ? log.is_inspection : 1,
        inspection_time: log.cpNum === log.shoddy_number ? log.inspection_time : this.$getTime(new Date()),
        inspection_user: '',
        shoddy_number: log.cpNum,
        shoddy_reason: log.reason.join(','),
        is_semi_pop: log.is_semi_pop,
        semi_pop_time: log.semi_pop_time,
        semi_pop_user: '',
        is_semi_push: log.is_semi_push,
        semi_push_time: log.semi_push_time,
        semi_push_user: '',
        desc: log.desc
      }]
      this.otherData.loading = true
      receiveDispatch.allCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success(errMsg[stateChange] ? errMsg[stateChange] + '成功' : '修改成功')
          this.init()
        }
      })
    },
    // 选择产品初始化尺码颜色表格
    selectProduct (id, index) {
      this.formData.tableData[index].colorSizeArr = this.selectData.productArr.find((item) => {
        return item.product_id === id
      }).childrenMergeInfo.map((item) => {
        return {
          name: item.size_name + '/' + item.color_name,
          id: item.size_id + '/' + item.color_id
        }
      })
    },
    getColorSize (id) {
      let finded = this.selectData.productArr.find((item) => {
        return item.product_id === id
      })
      this.formData.codeData.colorSizeArr = finded.childrenMergeInfo.map((item) => {
        return {
          name: item.size_name + '/' + item.color_name,
          id: item.size_id + '/' + item.color_id
        }
      })
      this.formData.codeData.image = finded.image || []
      console.log(this.selectData.productArr)
    },
    // 选择弹窗产品
    selectPopupProduct (id) {
      this.formData.batchData.colorSizeArr = this.selectData.productArr.find((item) => {
        return item.product_id === id
      }).childrenMergeInfo.map((item) => {
        return {
          name: item.size_name + '/' + item.color_name,
          id: item.size_id + '/' + item.color_id
        }
      })
    },
    selectLog (val) {
      this.nativeData.selectedLog = val
    },
    codeSubmit () {
      this.formData.tableData = [this.formData.codeData]
      this.saveAll()
    },
    saveAll () {
      if (this.formData.tableData.length === 0) {
        this.$message.error('请至少提交一条记录')
        return
      }
      // 数据分类，分成不需要绑定芯片的数据和需要绑定芯片的数据
      let normalData = this.formData.tableData.filter((item) => !item.is_xp)
      let xpData = this.formData.tableData.filter((item) => item.is_xp)
      if (normalData.length === 0 && xpData.length > 0) {
        this.otherData.xpFlag = true
        this.otherData.codeFlag = false
        this.otherData.xpState = 1
        this.otherData.xpLoop = 0
        this.formData.xpformArr = xpData
        this.formData.xpform = this.changeDataToXp(this.formData.xpformArr[this.otherData.xpLoop])
        this.connectXp()
        this.startRead()
      }
      if (normalData.length > 0 && xpData.length === 0) {
        receiveDispatch.allCreate({ data: this.changeDataToSubmit(normalData) }).then((res) => {
          if (res.data.status) {
            this.formData.tableData = []
            this.$message.success('提交成功')
            this.otherData.codeFlag = false
            this.init()
          }
        })
      }
      if (normalData.length > 0 && xpData.length > 0) {
        receiveDispatch.allCreate({ data: this.changeDataToSubmit(normalData) }).then((res) => {
          if (res.data.status) {
            this.otherData.xpFlag = true
            this.otherData.codeFlag = false
            this.otherData.xpState = 1
            this.otherData.xpLoop = 0
            this.formData.xpformArr = xpData
            this.formData.xpform = this.changeDataToXp(this.formData.xpformArr[this.otherData.xpLoop])
            this.connectXp()
            this.startRead()
          }
        })
      }
    },
    // 把数据转换成需要提交的数据
    changeDataToSubmit (data) {
      if (data instanceof Array) {
        return data.map((item) => {
          return {
            id: null,
            order_id: this.$route.params.id,
            order_type: 1,
            product_id: item.product_id,
            size_id: item.colorSize.split('/')[0],
            color_id: item.colorSize.split('/')[1],
            weave_client_id: parseInt(item.weave_client_id[1]),
            semi_client_info: JSON.stringify(item.semi_client_id.length > 0 ? item.semi_client_id.map((itemChild) => {
              return {
                client_id: itemChild[1].split('/')[0],
                production_type: itemChild[1].split('/').slice(1).join('/')
              }
            }) : item.back_client_id.map((itemChild) => {
              return {
                client_id: itemChild[1].split('/')[0],
                production_type: itemChild[1].split('/').slice(1).join('/')
              }
            })),
            count: item.count,
            number: item.number,
            is_chip: item.is_xp ? 1 : 2,
            chip_time: item.is_xp ? this.$getTime(new Date()) : '',
            chip_user: '',
            is_weave_push: item.weave_client_id.length > 0 ? 1 : 2,
            weave_time: item.weave_client_id.length > 0 ? this.$getTime(new Date()) : '',
            weave_user: '',
            is_inspection: item.cpNum !== '' ? 1 : 2,
            inspection_time: item.cpNum !== '' ? this.$getTime(new Date()) : '',
            inspection_user: '',
            shoddy_number: item.cpNum,
            shoddy_reason: item.reason.join(','),
            is_semi_pop: item.semi_client_id.length > 0 ? 1 : 2,
            semi_pop_time: item.semi_client_id.length > 0 ? this.$getTime(new Date()) : '',
            semi_pop_user: '',
            is_semi_push: item.back_client_id.length > 0 ? 1 : 2,
            semi_push_time: item.back_client_id.length > 0 ? this.$getTime(new Date()) : '',
            semi_push_user: '',
            desc: item.desc
          }
        })
      } else {
        return {
          id: null,
          order_id: this.$route.params.id,
          order_type: 1,
          product_id: data.product_id,
          size_id: data.colorSize.split('/')[0],
          color_id: data.colorSize.split('/')[1],
          weave_client_id: parseInt(data.weave_client_id[1]),
          semi_client_info: JSON.stringify(data.semi_client_id.length > 0 ? data.semi_client_id.map((itemChild) => {
            return {
              client_id: itemChild[1].split('/')[0],
              production_type: itemChild[1].split('/').slice(1).join('/')
            }
          }) : data.back_client_id.map((itemChild) => {
            return {
              client_id: itemChild[1].split('/')[0],
              production_type: itemChild[1].split('/').slice(1).join('/')
            }
          })),
          count: data.count,
          number: data.number,
          is_chip: data.is_xp ? 1 : 2,
          chip_time: data.is_xp ? this.$getTime(new Date()) : '',
          chip_user: '',
          is_weave_push: data.weave_client_id.length > 0 ? 1 : 2,
          weave_time: data.weave_client_id.length > 0 ? this.$getTime(new Date()) : '',
          weave_user: '',
          is_inspection: data.cpNum !== '' ? 1 : 2,
          inspection_time: data.cpNum !== '' ? this.$getTime(new Date()) : '',
          inspection_user: '',
          shoddy_number: data.cpNum,
          shoddy_reason: data.reason.join(','),
          is_semi_pop: data.semi_client_id.length > 0 ? 1 : 2,
          semi_pop_time: data.semi_client_id.length > 0 ? this.$getTime(new Date()) : '',
          semi_pop_user: '',
          is_semi_push: data.back_client_id.length > 0 ? 1 : 2,
          semi_push_time: data.back_client_id.length > 0 ? this.$getTime(new Date()) : '',
          semi_push_user: '',
          desc: data.desc
        }
      }
    },
    // 把数据转换成芯片展示数据，主要是把各种id转成name
    changeDataToXp (data) {
      let proFind = this.selectData.productArr.find((item) => {
        return item.product_id === data.product_id
      })
      let clientInfo = []
      if (data.weave_client_id[0] === '已分配单位') {
        clientInfo.push({
          client_name: this.nativeData.allClient.find((itemFind) => Number(itemFind.id) === Number(data.weave_client_id[1].split('/')[0])).name,
          production_type: data.weave_client_id[1].split('/').slice(1).join('/')
        })
      } else {
        clientInfo.push({
          client_name: this.nativeData.allClient.find((itemFind) => itemFind.id === data.weave_client_id[1]).name,
          production_type: '无'
        })
      }
      data.semi_client_id.forEach((item) => {
        if (item[0] === '已分配单位') {
          clientInfo.push({
            client_name: this.nativeData.allClient.find((itemFind) => Number(itemFind.id) === Number(item[1].split('/')[0])).name,
            production_type: item[1].split('/').slice(1).join('/')
          })
        } else {
          clientInfo.push({
            client_name: this.nativeData.allClient.find((itemFind) => itemFind.id === item[1]).name,
            production_type: '无'
          })
        }
      })
      return {
        product_code: proFind.product_code + '(' + proFind.category_info.category_name + '/' + proFind.category_info.type_name + '/' + proFind.category_info.style_name + ')',
        colorSize: data.colorSizeArr.find((item) => item.id === data.colorSize).name,
        desc: data.desc,
        number: data.number,
        count: data.count,
        clientInfo: clientInfo,
        date: data.inDate || data.outDate || data.insDate || data.backDate
      }
    },
    ReadEPC () {
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_Inventory(0)
    },
    WriteEPC (id) {
      let writeContont = 'ABABABAB' + (Array(8).join(0) + id).slice(-8) // 保证八位，前面zwy是标识
      this.otherData.dataBuffer.push(id)
      this.rfidreader.KeyStringMode = 1
      this.rfidreader.KeyString = '0'
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_WriteEPC(writeContont)
    },
    startRead () {
      this.otherData.readTimer = setInterval(() => {
        this.ReadEPC()
      }, 1000)
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
    submitXp () {
      receiveDispatch.allCreate({ data: [this.changeDataToSubmit(this.formData.xpformArr[this.otherData.xpLoop])] }).then((res) => {
        if (res.data.status) {
          this.WriteEPC(res.data.data[0])
          this.xpState = 3
        }
      })
    },
    goNext () {
      if (this.otherData.xpLoop < (this.formData.xpformArr.length - 1)) {
        this.otherData.xpLoop++
        this.otherData.xpState = 1
        this.formData.xpform = this.changeDataToXp(this.formData.xpformArr[this.otherData.xpLoop])
        this.startRead()
      } else {
        this.otherData.xpState = 6
      }
    },
    cancleBind () {
      this.$confirm('是否要停止绑定芯片,已经绑定的芯片数据会提交，如果数据无效请手动删除日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.tableData = []
        this.otherData.xpFlag = false
        this.otherData.xpState = 1
        this.otherData.xpLoop = 0
        this.formData.xpformArr = []
        clearInterval(this.readTimer)
        this.readTimer = null
        this.init()
        this.rfidreader.Disconnect()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    bindOver () {
      this.formData.tableData = []
      this.otherData.xpFlag = false
      this.otherData.xpState = 1
      this.otherData.xpLoop = 0
      this.formData.xpformArr = []
      clearInterval(this.readTimer)
      this.readTimer = null
      this.init()
      this.rfidreader.Disconnect()
    },
    connectXp () {
      try {
        this.rfidreader = YOWORFIDReader.createNew()
      } catch (e) {
        this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
      }

      if (!this.rfidreader.TryConnect()) {
        this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
      }
      this.rfidreader.onResult((resultdata) => {
        switch (resultdata.FunctionID) {
          // 读EPC
          case 23:
            if (resultdata.Result > 0) {
              // 我也不知道为什么ABABABAB0000001.length等于18，我母鸡呀
              if (resultdata.CardNo && resultdata.CardNo.length >= 16 && resultdata.CardNo.substring(0, 8) === 'ABABABAB' && this.otherData.dataBuffer.includes(Number(resultdata.CardNo.substring(8)))) {
                this.otherData.xpState = 7
              } else {
                clearInterval(this.otherData.readTimer)
                this.otherData.readTimer = null
                this.otherData.xpState = 2
                this.submitXp()
              }
            } else {
              console.log('读EPC失败，错误：' + this.GetErrStr(resultdata.Result))
            }
            break
          // 写EPC
          case 26:
            if (resultdata.Result > 0) {
              this.xpState = 4
              this.goNext()
            } else {
              clearInterval(this.otherData.readTimer)
              this.otherData.readTimer = null
              this.startRead()
            }
            break
        }
      })
    },
    lookDetail (type, data) {
      const h = this.$createElement
      if (type === 'reason') {
        this.$msgbox({
          title: '次品原因',
          message: h('div', null, [
            h('div', null, [
              h('span', { style: 'color:#333333' }, '次品原因：'),
              h('span', { style: 'color:#01B48C' }, data.join(','))
            ])
          ])
        })
      }
      if (type === 'client') {
        this.$msgbox({
          title: '单位信息',
          message: h('div', null, [
            h('div', null, [
              h('span', { style: 'color:#333333' }, '单位信息：'),
              h('span', { style: 'color:#01B48C' }, data.map((item) => item.client_name + '/' + item.production_type).join(','))
            ])
          ])
        })
      }
    }
  },
  mounted () {
    this.init(this.otherData.commonApi.concat(this.otherData.otherApi))
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/receiveDispatch/receiveDispatchDetail.less";
.opr {
  color: @blue;
  padding: 0 8px;
  border-right: 1px solid #e9e9e9;
  cursor: pointer;
  &:nth-last-child(1) {
    border-right: 0;
  }
  &:nth-child(1) {
    padding-left: 0;
  }
  &.orange {
    color: @orange;
  }
  &.red {
    color: @red;
  }
  .el-dropdown {
    color: @blue!important;
  }
}
.stateCtn {
  margin-right: 8px;
  display: flex;
  flex-direction: column;
  &.rowFlex {
    flex-direction: row;
    .state {
      margin-right: 8px;
      margin-top: 7px;
    }
  }
  &.blue {
    .state {
      background: @blue;
    }
    .name {
      color: @blue;
    }
  }
  &.red {
    .state {
      background: @red;
    }
    .name {
      color: @red;
    }
  }
  &.orange {
    .state {
      background: @orange;
    }
    .name {
      color: @orange;
    }
  }
  &.green {
    .state {
      background: #01b48c;
    }
    .name {
      color: #01b48c;
      cursor: pointer;
    }
  }
  .state {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ccc;
    margin: 5px auto;
  }
}
</style>
