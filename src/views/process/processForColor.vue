<template>
  <div id="processCommon"
    class="indexMain"
    v-loading="otherData.loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">订单信息</span>
        <div class="oprCtn">
          <span class="opr"
            :class="{'active':$route.fullPath.indexOf('processCommon')!==-1}"
            @click="$router.replace('/process/processCommon/' +  $route.params.id + '/' + ( $route.params.orderType ? '1' : '2')+ '/' + $route.params.processType+ '?whichModule=' +$route.query.whichModule + '&processType=' + otherData.processType)">
            全部
          </span>
          <span class="opr"
            :class="{'active':$route.fullPath.indexOf('processForSize')!==-1}"
            @click="$router.replace('/process/processForSize/' +  $route.params.id + '/' + ( $route.params.orderType ? '1' : '2')+ '/' + $route.params.processType+ '?whichModule=' +$route.query.whichModule + '&processType=' + otherData.processType)">
            尺码
          </span>
          <span class="opr"
            :class="{'active':$route.fullPath.indexOf('processForColor')!==-1}"
            @click="$router.replace('/process/processForColor/' +  $route.params.id + '/' + ( $route.params.orderType ? '1' : '2')+ '/' + $route.params.processType+ '?whichModule=' +$route.query.whichModule + '&processType=' + otherData.processType)">
            配色
          </span>
        </div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{renderData.orderInfo.order_code || renderData.orderInfo.title}}</span>
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
          <!-- <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{renderData.orderInfo.group_name}}</span>
          </div> -->
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{renderData.orderInfo.order_time}}
              <order-warning :progress="renderData.orderInfo.time_progress"></order-warning>
            </span>
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
    <div class="module progress">
      <div class="progressCtn"
        v-if="otherData.processType!=='织片'">
        <el-progress type="circle"
          :width="80"
          color="#01B48C"
          :percentage="renderData.progress.commonAllocation===0?0:Number(Number((100*renderData.progress.stockIn/renderData.progress.commonAllocation).toFixed(2)))">
        </el-progress>
        <div class="infoCtn">
          <span class="line1">{{otherData.processType}}入库</span>
          <span class="line2">{{renderData.progress.stockIn}}/{{renderData.progress.commonAllocation}}</span>
          <span class="line3">进度{{renderData.progress.commonAllocation===0?0:Number(100*renderData.progress.stockIn/renderData.progress.commonAllocation).toFixed(2)}}%</span>
        </div>
      </div>
      <div class="progressCtn">
        <el-progress type="circle"
          :width="80"
          :percentage="Number(otherData.processType==='织片'?Number((renderData.progress.allocation>renderData.progress.orderNumber?100:100*renderData.progress.allocation/renderData.progress.orderNumber).toFixed(2)):Number((100*renderData.progress.allocation/renderData.progress.commonAllocation).toFixed(2)))">
        </el-progress>
        <div class="infoCtn">
          <span class="line1">{{otherData.processType}}分配</span>
          <span class="line2">{{renderData.progress.allocation}}/{{otherData.processType==='织片'?renderData.progress.orderNumber:renderData.progress.commonAllocation}}</span>
          <span class="line3">进度{{otherData.processType==='织片'?Number(100*renderData.progress.allocation/renderData.progress.orderNumber).toFixed(2):Number(100*renderData.progress.allocation/renderData.progress.commonAllocation).toFixed(2)}}%</span>
        </div>
      </div>
      <div class="progressCtn">
        <el-progress type="circle"
          color="#E6A23C"
          :width="80"
          :percentage="renderData.progress.commonAllocation===0?0:Number(Number(100*renderData.progress.inspection/renderData.progress.commonAllocation).toFixed(2))">
        </el-progress>
        <div class="infoCtn">
          <span class="line1">{{otherData.processType}}检验</span>
          <span class="line2">{{renderData.progress.inspection}}/{{renderData.progress.commonAllocation}}</span>
          <span class="line3">进度{{renderData.progress.commonAllocation===0?0:Number(100*renderData.progress.inspection/renderData.progress.commonAllocation).toFixed(2)}}%</span>
        </div>
      </div>
    </div>
    <div class="module processCtn"
      v-if="otherData.processType!=='织片'&&otherData.processType!=='套口'">
      <div class="process hover"
        v-for="(item,index) in renderData.processChoose"
        :key="index"
        :class="{'active':otherData.processType===item}"
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
            <el-dropdown-item v-for="item in selectData.processArr"
              :key="item.id"
              :command="item.label">{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 偷懒，所有模块进来不选具体工序的就直接不展示 -->
    <template v-if="otherData.processType!=='工序'">
      <div class="listCutCtn">
        <div class="cut_item"
          v-for="(item,index) in renderData.module"
          :key="index"
          :class="{'active':otherData.whichModule===item.whichModule}"
          @click="otherData.whichModule=item.whichModule">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <span class="name">{{item.name}}</span>
        </div>
      </div>
      <!-- |||||||||分配大模块||||||||| -->
      <!-- 分配操作-->
      <div class="module"
        v-if="otherData.whichModule === 'allocation'">
        <div class="titleCtn">
          <span class="title">{{otherData.processType}}分配</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <div class="btn btnWhiteBlue"
                @click="batchAllocation()">批量分配</div>
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
                        <div class="tcolumn">配色</div>
                        <div class="tcolumn">{{otherData.processType==='织片'?'下单数':'织片分配数+机动数'}}</div>
                        <div class="tcolumn">已分配</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in renderData.allocationList"
                    :key="index">
                    <div class="tcolumn">
                      <el-checkbox v-model="item.checked"
                        @change="checkAllColorSize($event,item)">
                        <div style="display:flex;flex-direction:column;position: relative;bottom: 7px;"><span>{{item.product_code}}</span>
                          <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                        </div>
                      </el-checkbox>
                    </div>
                    <div class="tcolumn noPad"
                      style="flex:3">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                        :key="indexChild">
                        <div class="tcolumn">
                          <el-checkbox @change="$forceUpdate()"
                            v-model="itemChild.checked">{{itemChild.color_name}}</el-checkbox>
                        </div>
                        <div class="tcolumn"
                          style="color:#01B48C"
                          v-if="otherData.processType==='织片'">{{itemChild.numbers}}{{itemChild.unit}}</div>
                        <div class="tcolumn"
                          v-if="otherData.processType!=='织片'"
                          style="flex-direction: row;align-items: center;justify-content: flex-start;">
                          <span style="color:#01B48C">{{itemChild.number}}</span>
                          <span style="color:#E6A23C">+{{itemChild.motorise_number}}</span>
                        </div>
                        <div class="tcolumn"
                          style="flex-direction: row;align-items: center;justify-content: flex-start;"
                          :style="{color:itemChild.allocation===0?'#ccc':'#E6A23C'}">{{itemChild.allocation}}
                          <span style="color:#E6A23C"
                            v-if="itemChild.allocation!==0 && otherData.processType==='织片'">+{{itemChild.motorise_number}}</span>
                        </div>
                        <div class="tcolumn">
                          <span class="btn noBorder"
                            style="padding:0;margin:0"
                            @click="singleAllocation(item.product_id,'',itemChild.color_id,itemChild.numbers)">分配</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="createModule"
                  v-for="(item,index) in formData.allocationForm"
                  :key="index">
                  <div class="deleteIconBtn"
                    @click="formData.allocationForm.splice(index,1)">
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
                          <el-option v-for="item in renderData.allocationList"
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
                          <el-option v-for="item in selectData.clientArr"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="colCtn flex3"
                      v-if="otherData.processType==='工序'">
                      <div class="label"
                        v-if="indexChild===0">
                        <span class="text">工序名称</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="content">
                        <el-select placeholder="选择工序"
                          v-model="itemChild.process">
                          <el-option v-for="item in selectData.processArr"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label">
                          </el-option>
                        </el-select>
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
                        @click="item.companyRate.push({
                        company_id: '',
                        process: otherData.processType==='工序'?'':otherData.processType,
                        price: ''
                      })">添加</div>
                      <div class="editBtn deleteBtn"
                        v-if="indexChild>0"
                        @click="item.companyRate.splice(indexChild,1)">删除</div>
                    </div>
                  </div>
                  <div class="rowCtn"
                    v-for="(itemChild,indexChild) in item.mixedData"
                    :key="indexChild">
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexChild===0">
                        <span class="text">配色</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemChild.colorSize"
                          no-data-text="请先选择产品"
                          placeholder="请选择配色">
                          <el-option v-for="item in item.colorSizeArr"
                            :key="item.color_id"
                            :value="item.color_id "
                            :label="item.color_name"></el-option>
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
                        <div class="editBtn addBtn"
                          v-if="indexChild===0 && otherData.processType!=='织片'"
                          @click="item.mixedData.push({
                            colorSize: '',
                            loss: '',
                            number: '',
                            lossNum: ''
                          })">添加</div>
                        <div class="editBtn deleteBtn"
                          v-if="indexChild>0&& otherData.processType!=='织片'"
                          @click="item.mixedData.splice(indexChild,1)">删除</div>
                      </div>
                    </div>
                    <div class="colCtn flex3"
                      v-if="otherData.processType==='织片'">
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
                        @click="item.mixedData.push({
                        colorSize: '',
                        loss: '',
                        number: '',
                        lossNum: ''
                      })">添加</div>
                      <div class="editBtn deleteBtn"
                        v-if="indexChild>0"
                        @click="item.mixedData.splice(indexChild,1)">删除</div>
                    </div>
                  </div>
                  <div class="rowCtn">
                    <div class="colCtn flex3"
                      style="max-width:319.3px">
                      <div class="content"
                        style="display:flex">
                        <div class="colCtn"
                          style="margin-right:16px">
                          <div class="label">
                            <span class="text">下单日期</span>
                          </div>
                          <div class="content">
                            <el-date-picker v-model="item.order_time"
                              disabled
                              value-format="yyyy-MM-dd"
                              style="width:100%"
                              type="date"
                              placeholder="选择下单日期">
                            </el-date-picker>
                          </div>
                        </div>
                        <div class="colCtn"
                          style="margin-right:0">
                          <div class="label">
                            <span class="text">交货日期</span>
                          </div>
                          <div class="content">
                            <el-date-picker v-model="item.complete_time"
                              value-format="yyyy-MM-dd"
                              style="width:100%"
                              type="date"
                              placeholder="选择交货日期"
                              :picker-options="{disabledDate:filterDate}">
                            </el-date-picker>
                            <div class="prompt orange"
                              v-if="item.complete_time === $getTime()">您的交货日期为今日，请再次确认!</div>
                          </div>
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
                    v-if="formData.allocationForm.length===0"
                    @click="singleAllocation()">新增分配</span>
                  <span class="once cancle"
                    v-if="formData.allocationForm.length>0"
                    @click="cancleAllocation">取消分配</span>
                  <span class="once normal"
                    v-if="formData.allocationForm.length>0"
                    @click="singleAllocation()">添加分配</span>
                  <span class="once ok"
                    v-if="formData.allocationForm.length>0"
                    @click="confirmAllocation">确认分配
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分配信息 -->
      <div class="module"
        v-if="otherData.whichModule === 'allocation' && renderData.allocationDetail.length>0">
        <div class="titleCtn">
          <span class="title">{{otherData.processType}}分配详情</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="margin-right:0">
              <div class="zh_batch_item"
                v-for="(item,index) in renderData.allocationDetail"
                :key="index">
                <div class="line"
                  style="padding-top:0;padding-bottom:0;line-height:38px">
                  <span class="line_item">单位名称：{{item.client_name}}</span>
                  <span class="line_item">单价：<span style="color:#01B48C">{{item.price}}元/件</span></span>
                  <span class="line_item">操作：<span style="color:#1a95ff;cursor:pointer;padding:6px 12px;border:1px solid #1a95ff;border-radius:4px"
                      @click="$openUrl('/weaveTable/' + $route.params.id + '/' + $route.params.orderType + '?type=1&clientId=' + item.client_id)">打印分配单</span></span>
                </div>
                <div class="line"
                  v-for="(itemPro,indexPro) in item.childrenMergeInfo"
                  :key="indexPro">
                  <div class="batchTable">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn w180 noPad">产品</span>
                        <span class="tcolumn twoTitleItem noPad">
                          <span class="leftBottom">颜色</span>
                          <span class="obliqueLine"></span>
                          <span class="rightTop">尺码</span>
                        </span>
                        <span class="tcolumn noPad"
                          v-for="itemSize in itemPro.sizeArr"
                          :key="itemSize">{{itemSize}}</span>
                        <span class="tcolumn noPad">总数</span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow">
                        <span class="tcolumn w180 noPad">
                          <span>{{itemPro.product_info.product_code}}</span>
                          <span>{{itemPro.product_info.category_name?itemPro.product_info.category_name+'/'+ itemPro.product_info.type_name+'/'+ itemPro.product_info.style_name:itemPro.product_info.product_title}}</span>
                        </span>
                        <span class="tcolumn noPad">
                          <span class="trow"
                            v-for="itemColor in itemPro.colorArr"
                            :key="itemColor">
                            <span class="tcolumn noPad">{{itemColor}}</span>
                          </span>
                          <span class="trow">
                            <span class="tcolumn noPad">总数</span>
                          </span>
                        </span>
                        <span class="tcolumn noPad"
                          v-for="itemSize in itemPro.sizeArr"
                          :key="itemSize">
                          <span class="trow"
                            v-for="itemColor in itemPro.colorArr"
                            :key="itemColor">
                            <span class="tcolumn noPad">
                              <span style="color:#01B48C">{{itemPro.colorSize[itemSize][itemColor].number}}</span>
                              <span style="color:#E6A23C"
                                v-if="otherData.processType==='织片'">(+{{itemPro.colorSize[itemSize][itemColor].motorise_number}})</span>
                            </span>
                          </span>
                          <span class="trow">
                            <span class="tcolumn noPad">{{itemPro.colorSize[itemSize].total_number}}</span>
                          </span>
                        </span>
                        <span class="tcolumn noPad">
                          <span class="trow"
                            v-for="itemColor in itemPro.colorArr"
                            :key="itemColor">
                            <span class="tcolumn noPad">{{itemPro.colorSize[itemColor].total_number}}</span>
                          </span>
                          <span class="trow">
                            <span class="tcolumn noPad">{{itemPro.colorSize.total_number}}</span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 物料分配信息 -->
      <div class="module"
        v-if="otherData.whichModule === 'allocation'&&renderData.materialAllocationDetail.length>0">
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
                      </div>
                    </div>
                    <!-- <div class="tcolumn center">操作</div> -->
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in renderData.materialAllocationDetail"
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
                          style="color:#01B48C">{{itemMat.weight}}{{itemMat.material_type===1?'kg':itemMat.unit}}</div>
                      </div>
                    </div>
                    <!-- <div class="tcolumn center">
                    <span class="trow">
                      <span class="btn noBorder"
                        style="margin:0;padding:0">补纱</span>
                      <span class="btn noBorder"
                        style="margin:0 0 0 16px;padding:0">打印补纱单</span>
                    </span>
                  </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 物料出入库信息，分配的时候作为参考 -->
      <div class="module"
        v-if="otherData.whichModule === 'allocation'&&renderData.stockInList.length>0">
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
                        <span class="tcolumn">已出库数量</span>
                        <span class="tcolumn">剩余物料</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in renderData.stockInList"
                    :key="index">
                    <div class="tcolumn">{{item.material_name}}</div>
                    <div class="tcolumn noPad"
                      style="flex:2">
                      <div class="trow"
                        v-for="(itemColor,indexColor) in item.childrenMergeInfo"
                        :key="indexColor">
                        <div class="tcolumn">{{itemColor.material_color}}</div>
                        <span class="tcolumn green">{{$toFixed(itemColor.total_weight || 0)}}{{itemColor.material_type===1?'kg':itemColor.unit}}</span>
                        <span class="tcolumn green">{{itemColor.outNum}}{{itemColor.material_type===1?'kg':itemColor.unit}}</span>
                        <span class="tcolumn"
                          style="color:#E6A23C">{{itemColor.total_weight - itemColor.outNum}}{{itemColor.material_type===1?'kg':itemColor.unit}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分配日志 -->
      <div class="module log"
        v-if="nativeData.allocationLog.length>0 && otherData.whichModule === 'allocation'">
        <div class="titleCtn">
          <span class="title">{{otherData.processType}}分配日志</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <div class="btn btnWhiteBlue"
                @click="deleteAllocationLog('all')">批量删除</div>
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
                      <el-checkbox v-model="otherData.checkAllAllocationLog"
                        @change="checkAllLog($event,nativeData.allocationLog)"></el-checkbox>
                    </div>
                    <div class="tcolumn"
                      style="flex:1.5">单位名称</div>
                    <div class="tcolumn"
                      style="flex:1.5">产品名称</div>
                    <div class="tcolumn"
                      style="flex:1.2">颜色尺码</div>
                    <div class="tcolumn">单价(元)</div>
                    <div class="tcolumn">数量</div>
                    <div class="tcolumn">总价(元)</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in nativeData.allocationLog"
                    :key="index">
                    <span class="tcolumn"
                      style="flex:0.2">
                      <el-checkbox v-model="item.checked"></el-checkbox>
                    </span>
                    <div class="tcolumn"
                      style="flex:1.5">{{item.client_name}}</div>
                    <div class="tcolumn"
                      style="flex:1.5">
                      <span>{{item.product_info.product_code}}</span>
                      <span>{{item.product_info.category_name?item.product_info.category_name+'/'+ item.product_info.type_name+'/'+ item.product_info.style_name:item.product_info.product_title}}</span>
                    </div>
                    <div class="tcolumn"
                      style="flex:1.2">
                      <span>{{item.color_name}}</span>
                    </div>
                    <div class="tcolumn">{{item.price}}</div>
                    <div class="tcolumn"
                      style="flex-direction:row;align-items: center;justify-content: flex-start;"><span style="color:#01B48C">{{item.number}}</span><span style="color:#E6A23C">{{item.motorise_number?'+' + parseInt(item.motorise_number):''}}</span></div>
                    <div class="tcolumn">{{$toFixed(item.price*item.number)}}</div>
                    <div class="tcolumn"
                      style="flex-direction:row;align-items: center;justify-content: flex-start;">
                      <span style="color:#F5222D;cursor:pointer"
                        @click="deleteAllocationLog(item.id,index)">删除</span>
                      <span style="color:#1a95ff;cursor:pointer;margin-left:10px"
                        @click="lookDetail(item)">详情</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分配公共信息填写 -->
      <div class="popup"
        v-show="otherData.batchAllocation_flag">
        <div class="main">
          <div class="title">
            <div class="text">快捷填写</div>
            <i class="el-icon-close"
              @click="otherData.batchAllocation_flag = false"></i>
          </div>
          <div class="content"
            style="max-height:600px">
            <div class="tips">
              提示信息：本步骤可以统一选择单位名称,织造单价和截止日期，如不需要可以选择直接跳过该步骤。
            </div>
            <div style="background: #f4f4f4;padding: 8px;margin: 12px 0;"
              v-for="(item,index) in renderData.checkAllocationList"
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
                  <el-select v-model="formData.batchAllocation_common.commonCompany[index]"
                    filterable
                    :filter-method="searchClient"
                    placeholder="请选择单位名称">
                    <el-option v-for="item in selectData.clientArr"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="row">
                <div class="label">单价：</div>
                <div class="info">
                  <zh-input v-model="formData.batchAllocation_common.commonPrice[index]"
                    placeholder="请输入单价">
                    <template slot="append">元</template>
                  </zh-input>
                </div>
              </div>
              <div class="row"
                v-if="otherData.processType==='织片'">
                <div class="label">机动数：</div>
                <div class="info">
                  <zh-input v-model="formData.batchAllocation_common.commonLoss[index]"
                    placeholder="请输入机动数">
                    <template slot="append">%</template>
                  </zh-input>
                </div>
              </div>
              <div class="row">
                <div class="label">截止日期：</div>
                <div class="info">
                  <el-date-picker v-model="formData.batchAllocation_common.commonDate[index]"
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
              @click="batchAllocationCommon">确定</div>
          </div>
        </div>
      </div>
      <!-- 确认物料信息 -->
      <div class="popup"
        v-show="otherData.material.flag">
        <div class="main"
          style="width:1200px">
          <div class="title">
            <div class="text">{{otherData.material.step===0?'计算物料信息':'物料分配填写表'}}</div>
            <span class="el-icon-close"
              @click="cancleMaterial"></span>
          </div>
          <div class="content"
            style="padding:20px">
            <!-- 第一步，提供一个能看的懂的表格方便他们计算物料 -->
            <template v-if="otherData.material.step===0">
              <div class="editCtn hasBorderTop"
                style="margin:20px 0">
                <div class="zh_batch_item"
                  v-for="(itemClient,indexClient) in formData.cmpMaterialData"
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
            <template v-if="otherData.material.step===1">
              <div class="flexTb">
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
                    v-for="item in formData.allocationMaterialData"
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
                          <el-autocomplete style="height:40px"
                            v-model="itemChild.material_name"
                            :fetch-suggestions="searchYarn"
                            placeholder="名称">
                            <template slot="prepend">
                              <el-tooltip class="item"
                                effect="dark"
                                content="可以通过左边切换按钮切换当前物料属性，该属性会影响物料出入库页面的信息，请正确填写"
                                placement="top">
                                <span style="color:#1a95ff;cursor:pointer">{{item.material_type?'原':'辅'}}</span>
                              </el-tooltip>
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
                          style="flex-direction: row;align-items: center;flex:0.5">
                          <div style="color:#1a95ff;cursor:pointer;"
                            v-if="indexChild===0"
                            @click="item.material_merge.push({
                            id: null,
                            canbeEdit: true,
                            material_name: '',
                            material_attribute: '',
                            vat_code: '',
                            color_code: '',
                            number: '',
                            unit: 'kg'
                          })">增加</div>
                          <div style="color:#F5222D;cursor:pointer;margin-left:12px"
                            @click="deleteMaterial(item.material_merge,indexChild)">删除</div>
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
              @click="otherData.material.step=0"
              v-if="otherData.material.step===1">上一步</div>
            <div class="btn btnGray"
              @click="cancleMaterial">取消</div>
            <div class="btn btnBlue"
              @click="otherData.material.step===0?nextStep():saveMaterial()">{{otherData.material.step===0?'计算所需物料':'确认分配'}}</div>
          </div>
        </div>
      </div>
      <!-- |||||||||分配大模块结束||||||||| -->

      <!-- |||||||||检验大模块||||||||| -->
      <div class="module"
        v-if="otherData.whichModule === 'inspection'">
        <div class="titleCtn">
          <span class="title">分配信息</span>
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
                      style="flex:4">
                      <div class="trow">
                        <div class="tcolumn">配色</div>
                        <div class="tcolumn">分配+机动数</div>
                        <div class="tcolumn">已检验</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in renderData.allocationDetailCommon"
                    :key="index">
                    <div class="tcolumn">
                      <div style="display:flex;flex-direction:column;position: relative;bottom: 7px;"><span>{{item.product_code}}</span>
                        <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                      </div>
                    </div>
                    <div class="tcolumn noPad"
                      style="flex:4">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                        :key="indexChild">
                        <div class="tcolumn">
                          {{itemChild.color_name}}
                        </div>
                        <div class="tcolumn"
                          style="flex-direction:row;align-items: center;justify-content: flex-start;"><span style="color:#01B48C">{{itemChild.number}}</span><span style="color:#E6A23C">+{{parseInt(itemChild.motorise_number)}}</span></div>
                        <div class="tcolumn"
                          :style="{color:itemChild.inspection===0?'#ccc':'#E6A23C'}">{{itemChild.inspection}}</div>
                        <div class="tcolumn">
                          <span style="color:#1a95ff;cursor:pointer"
                            @click="inspectionOnce(item,itemChild)">检验</span>
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
        v-if="otherData.whichModule === 'inspection'">
        <div class="titleCtn">
          <span class="title">{{otherData.processType}}检验</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="margin-right:32px">
              <div class="filterCtn">
                <div class="label">选择产品：</div>
                <!-- 切换产品需要询问是否切换，并初始化尺码颜色 -->
                <el-select class="inputs"
                  v-model="formData.inspectionForm.product_id"
                  placeholder="请选择产品"
                  @change="getInspectionPro">
                  <el-option v-for="item in  renderData.allocationDetailCommon"
                    :key="item.product_id"
                    :value="item.product_id"
                    :label="item.product_code + '(' + item.category_name +'/' + item.type_name + '/' + item.style_name +')'"></el-option>
                </el-select>
              </div>
              <div class="filterCtn">
                <div class="label">选择单位：</div>
                <el-cascader @change="getClientAuth"
                  v-model="formData.inspectionForm.clientAuth"
                  :options="selectData.clientAuthArr"
                  :props="otherData.props"
                  collapse-tags
                  clearable></el-cascader>
                <span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="常用人员设置"
                    placement="top">
                    <i class="el-icon-setting"
                      @click="otherData.inspectionSetting.flag=true"></i>
                  </el-tooltip>
                  <div class="selfSelect"
                    style="transform: translate(calc(8px - 50%), 15px);"
                    v-show="otherData.inspectionSetting.flag">
                    <div class="checkBoxCtn"
                      style="height:auto">
                      <el-checkbox @change="filterSettingAuthArr($event,item.name)"
                        v-model="item.checked"
                        v-for="item in selectData.departmentArr"
                        :key="item.id"
                        :value="item.name"
                        :label="item.name">
                        <span>{{item.name}}</span>
                      </el-checkbox>
                    </div>
                    <!-- <div class="searchCtn">
                      <el-input v-model="otherData.inspectionSetting.search"
                        placeholder="输入名字搜索"
                        @input="getSettingAuthArr"></el-input>
                    </div> -->
                    <div class="checkBoxCtn">
                      <el-checkbox v-model="item.checked"
                        v-for="item in selectData.settingAuthArr"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name">
                        <span>{{item.name}}</span>
                      </el-checkbox>
                    </div>
                    <div class="oprCtn">
                      <div class="btnCancle"
                        @click="otherData.inspectionSetting.flag=false">取消</div>
                      <div class="btnConfirm"
                        @click="saveInspectionSetting">保存常用人员</div>
                    </div>
                  </div>
                </span>

              </div>
              <!-- <div class="filterCtn"
                v-show="otherData.processType==='工序'">
                <div class="label">选择工序：</div>
                <el-select class="inputs"
                  v-model="formData.inspectionForm.process"
                  placeholder="请选择工序">
                  <el-option v-for="item in selectData.processArr"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></el-option>
                </el-select>
              </div> -->
              <div class="filterCtn">
                <div class="label">结算单价：</div>
                <el-input class="inputs"
                  v-model="formData.inspectionForm.price"
                  placeholder="请输入人员结算单价">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <!-- <div style="float:right">
                <div class="btn btnWhiteBlue"
                  @click="saveInspection">确认检验</div>
              </div> -->
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
                        <div class="tcolumn">检验数</div>
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
                    v-for="(item,index) in formData.inspectionForm.detail"
                    :key="index">
                    <div class="tcolumn">
                      <div style="height:32px">
                        <el-cascader v-model="item.client_auth"
                          :options="selectData.clientAuthArr"
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
                              placeholder="请选择配色">
                              <el-option v-for="item in formData.inspectionForm.colorSizeArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </div>
                        </div>
                        <div class="tcolumn">
                          <div style="height:32px">
                            <el-input v-model="itemChild.number"
                              placeholder="检验数"></el-input>
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
                            <el-cascader :options="otherData.defectiveType"
                              :props="{multiple: true}"
                              collapse-tags
                              v-model="itemChild.reason"
                              placeholder="请选择次品原因"
                              clearable></el-cascader>
                          </div>
                        </div>
                        <div class="tcolumn"
                          style="flex-direction:row;align-items:center;justify-content:flex-start">
                          <span class="btn noBorder"
                            style="padding:0;margin:0 5px 0 0"
                            v-if="indexChild===0">
                            <span @click="formData.inspectionForm.colorSizeArr.length>0?itemChild.showCheck=true:$message.warning('请先选择产品')">批量选择</span>
                            <div class="selfSelect"
                              v-if="itemChild.showCheck">
                              <div class="checkBoxCtn">
                                <el-checkbox v-for="(itemCheck,indexCheck) in formData.inspectionForm.colorSizeArr"
                                  :key="indexCheck"
                                  v-model="itemCheck.checked"
                                  @change="$forceUpdate">
                                  <span>{{itemCheck.color_name}}</span>
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
                    v-if="formData.inspectionForm.detail.length === 0"
                    @click="addInspection">新增记录</span>
                  <span class="once cancle"
                    v-if="formData.inspectionForm.detail.length > 0"
                    @click="formData.inspectionForm.detail = []">取消</span>
                  <span class="once normal"
                    v-if="formData.inspectionForm.detail.length > 0"
                    @click="addInspection">新增记录</span>
                  <span class="once ok"
                    v-if="formData.inspectionForm.detail.length > 0"
                    @click="saveInspection">确认检验</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="module"
        v-if="otherData.whichModule === 'inspection' && renderData.inspectionList.length>0">
        <div class="titleCtn">
          <span class="title">检验信息</span>
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
                            <div class="tcolumn">配色</div>
                            <div class="tcolumn">检验数量</div>
                            <div class="tcolumn">次品数量</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="item in renderData.inspectionList"
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
                            <div class="tcolumn">{{itemSon.color_name}}</div>
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
      <div class="module log"
        v-if="otherData.whichModule === 'inspection' && nativeData.inspectionLog.length>0">
        <div class="titleCtn">
          <span class="title">检验日志</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <div class="btn btnWhiteBlue"
                @click="deleteInspectionLog('all')">批量删除</div>
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
                      <el-checkbox v-model="otherData.checkAllInspectionLog"
                        @change="checkAllLog($event,nativeData.inspectionLog)"></el-checkbox>
                    </div>
                    <div class="tcolumn"
                      style="flex:1.8">产品名称</div>
                    <div class="tcolumn"
                      style="flex:1.8">配色</div>
                    <div class="tcolumn"
                      style="flex:1.8">来源单位/人员</div>
                    <div class="tcolumn">检验数量</div>
                    <div class="tcolumn">次品数量</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in nativeData.inspectionLog"
                    :key="index">
                    <span class="tcolumn"
                      style="flex:0.2">
                      <el-checkbox v-model="item.checked"></el-checkbox>
                    </span>
                    <div class="tcolumn"
                      style="flex:1.8">
                      <span>{{item.product_info.product_code}}</span>
                      <span>{{item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name }}</span>
                    </div>
                    <div class="tcolumn"
                      style="flex:1.8">{{item.color_name}}</div>
                    <div class="tcolumn"
                      style="flex:1.8">{{item.inspection_user || item.client_name}}</div>
                    <div class="tcolumn">{{item.number}}</div>
                    <div class="tcolumn"
                      style="color:#F5222D;font-weight:bold">{{item.count}}</div>
                    <div class="tcolumn"
                      style="flex-direction:row;align-items: center;justify-content: flex-start;">
                      <span style="color:#F5222D;cursor:pointer"
                        @click="deleteInspectionLog(item.id,index)">删除</span>
                      <span style="color:#1a95ff;cursor:pointer;margin-left:10px"
                        @click="lookDetail(item)">详情</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- |||||||||检验大模块结束||||||||| -->

      <!-- |||||||||入库大模块||||||||| -->
      <div class="module"
        v-if="otherData.whichModule === 'stockIn'">
        <div class="titleCtn">
          <span class="title">入库信息</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <div class="btn btnWhiteBlue"
                @click="batchStockIn()">批量入库</div>
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
                        <div class="tcolumn">配色</div>
                        <div class="tcolumn">分配+机动数</div>
                        <div class="tcolumn">已入库</div>
                        <div class="tcolumn">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in renderData.allocationDetailCommon"
                    :key="index">
                    <div class="tcolumn">
                      <div style="display:flex;flex-direction:column;position: relative;bottom: 7px;">
                        <el-checkbox v-model="item.checked"
                          @change="checkAllColorSize($event,item)">
                          <span>{{item.product_code}}</span>
                          <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                        </el-checkbox>
                      </div>
                    </div>
                    <div class="tcolumn noPad"
                      style="flex:3">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                        :key="indexChild">
                        <div class="tcolumn">
                          <el-checkbox v-model="itemChild.checked"
                            @change="$forceUpdate()">
                            {{itemChild.color_name}}
                          </el-checkbox>
                        </div>
                        <div class="tcolumn"
                          style="flex-direction:row;align-items: center;justify-content: flex-start;"><span style="color:#01B48C">{{itemChild.number}}</span><span style="color:#E6A23C">+{{parseInt(itemChild.motorise_number)}}</span></div>
                        <div class="tcolumn"
                          :style="{color:itemChild.stockIn===0?'#ccc':'#E6A23C'}">{{itemChild.stockIn}}</div>
                        <div class="tcolumn">
                          <span class="btn noBorder"
                            style="padding:0;margin:0"
                            @click="singleStockIn(item.product_id,'',itemChild.color_id)">入库</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="createModule"
                  v-for="(item,index) in formData.stockInForm"
                  :key="index">
                  <div class="deleteIconBtn"
                    @click="formData.stockInForm.splice(index,1)">
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
                          placeholder="请选择需要入库的产品"
                          @change="selectColorSize(index,$event)">
                          <el-option v-for="item in renderData.allocationDetailCommon"
                            :key="item.product_id"
                            :value="item.product_id"
                            :label="item.product_code + '(' + item.category_name +'/'+ item.type_name + '/' + item.style_name +')'"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div class="rowCtn"
                    v-for="(itemChild,indexChild) in item.detail"
                    :key="indexChild">
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexChild===0">
                        <span class="text">配色</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="content">
                        <el-select v-model="itemChild.colorSize"
                          no-data-text="请先选择产品"
                          placeholder="请选择配色">
                          <el-option v-for="item in item.colorSizeArr"
                            :key="item.color_id"
                            :value="item.color_id"
                            :label="item.color_name"></el-option>
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
                          v-model="itemChild.number"
                          placeholder="请输入入库数量">
                        </zh-input>
                      </div>
                    </div>
                    <div class="colCtn flex3">
                      <div class="label"
                        v-if="indexChild===0">
                        <span class="text">入库捆数</span>
                      </div>
                      <div class="content">
                        <zh-input type="number"
                          v-model="itemChild.count"
                          placeholder="请输入入库捆数">
                        </zh-input>
                      </div>
                    </div>
                  </div>
                  <div class="rowCtn">
                    <div class="colCtn flex3"
                      style="max-width:319.3px">
                      <div class="content"
                        style="display:flex">
                        <div class="colCtn"
                          style="margin-right:16px">
                          <div class="label">
                            <span class="text">下单日期</span>
                          </div>
                          <div class="content">
                            <el-date-picker v-model="item.order_time"
                              disabled
                              value-format="yyyy-MM-dd"
                              style="width:100%"
                              type="date"
                              placeholder="选择下单日期">
                            </el-date-picker>
                          </div>
                        </div>
                        <div class="colCtn"
                          style="margin-right:0">
                          <div class="label">
                            <span class="text">交货日期</span>
                          </div>
                          <div class="content">
                            <el-date-picker v-model="item.complete_time"
                              value-format="yyyy-MM-dd"
                              style="width:100%"
                              type="date"
                              placeholder="选择交货日期"
                              :picker-options="{disabledDate:filterDate}">
                            </el-date-picker>
                            <div class="prompt orange"
                              v-if="item.complete_time === $getTime()">您的交货日期为今日，请再次确认!</div>
                          </div>
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
                    v-if="formData.stockInForm.length===0"
                    @click="singleStockIn()">新增入库</span>
                  <span class="once cancle"
                    v-if="formData.stockInForm.length>0"
                    @click="cancleStockIn">取消入库</span>
                  <span class="once normal"
                    v-if="formData.stockInForm.length>0"
                    @click="singleStockIn()">添加入库</span>
                  <span class="once ok"
                    v-if="formData.stockInForm.length>0"
                    @click="saveStockIn">确认入库
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="module"
        v-if="otherData.whichModule === 'stockIn'&& nativeData.stockInLog.length>0">
        <div class="titleCtn">
          <span class="title">入库日志</span>
        </div>
        <div class="editCtn hasBorderTop">
          <div class="rowCtn">
            <div class="colCtn"
              style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
              <div class="btn btnWhiteBlue"
                @click="deleteStockInLog('all')">批量删除</div>
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
                      <el-checkbox v-model="otherData.checkAllStockInLog"
                        @change="checkAllLog($event,nativeData.stockInLog)"></el-checkbox>
                    </div>
                    <span class="tcolumn"
                      style="flex:1.8">产品信息</span>
                    <span class="tcolumn"
                      style="flex:1.8">配色</span>
                    <span class="tcolumn">入库数量</span>
                    <span class="tcolumn">捆数</span>
                    <span class="tcolumn">操作</span>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in nativeData.stockInLog"
                    :key="index">
                    <span class="tcolumn"
                      style="flex:0.2">
                      <el-checkbox v-model="item.checked"
                        @change="$forceUpdate()"></el-checkbox>
                    </span>
                    <div class="tcolumn"
                      style="flex:1.8">
                      <span>{{item.product_code.code}}</span>
                      <span>{{item.category_info.category_name + '/' + item.category_info.type_name + '/' + item.category_info.style_name }}</span>
                    </div>
                    <div class="tcolumn"
                      style="flex:1.8">{{item.color_name}}</div>
                    <div class="tcolumn"
                      style="color:rgb(1, 180, 140)">{{item.number}}</div>
                    <div class="tcolumn">{{item.count}}</div>
                    <div class="tcolumn"
                      style="flex-direction:row;align-items: center;justify-content: flex-start;">
                      <span style="color:#F5222D;cursor:pointer"
                        @click="deleteStockInLog(item.id,index)">删除</span>
                      <span style="color:#1a95ff;cursor:pointer;margin-left:10px"
                        @click="lookDetail(item)">详情</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- |||||||||入库大模块结束||||||||| -->
    </template>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <zh-deduct :orderId='+$route.params.id'
            :orderType='+$route.params.orderType'
            :showType='deductPopupType'
            :logType='[deductType]'
            :clientList="clientArr"
            v-model="deductPopupFlag">
            <div class="btn btnWhiteBlue"
              @click="deductPopupFlag = true;deductPopupType = false">扣款日志</div>
            <div class="btn btnWhiteRed"
              @click="deductPopupFlag = true;deductPopupType = true">单位扣款</div>
          </zh-deduct>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { processType } from '@/assets/js/dictionary.js'
import { order, sampleOrder, client, process, materialStock, yarn, weave, inspection, receive, staff, station } from '@/assets/js/api.js'
export default {
  data () {
    return {
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
        // 进度初始化成1，防止初始化的时候0除以0报错
        progress: {
          orderNumber: 1,
          stockIn: 1,
          allocation: 1,
          commonAllocation: 1,
          inspection: 1
        },
        processChoose: [],
        module: [],
        processModule: [],
        allocationList: [], // 分配列表
        checkAllocationList: [], // 批量分配列表
        allocationDetail: [], // 分配详情--分配模块表格数据
        allocationDetailCommon: [], // 分配详情织片数据
        stockInList: [], // 物料入库信息
        materialAllocationDetail: [], // 物料分配详情
        inspectionList: [] // 检验信息
      },
      // 表单数据，用于提交的数据
      formData: {
        allocationForm: [],
        batchAllocation_common: {
          commonCompany: [],
          commonLoss: [],
          commonPrice: [],
          commonDate: []
        },
        cmpMaterialData: [],
        allocationMaterialData: [],
        price: '',
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
        stockInForm: []
      },
      // 原始数据，往往来源于接口
      nativeData: {
        resSort: {
          common: [],
          stockIn: [],
          allocation: [],
          inspection: []
        },
        clientArr: [],
        yarnArr: [],
        yarnStock: [],
        flatMaterial: [],
        allocationLog: [],
        inspectionLog: [],
        stockInLog: []
      },
      // 下拉框，搜索框的数据
      selectData: {
        clientArr: [],
        processArr: [],
        inspectionProArr: [],
        authArr: [],
        departmentArr: [],
        settingAuthArr: [], // 保存人员设置的人员列表，主要是用于筛选后的结果
        clientAuthArr: []// 人员单位二级选择框
      },
      // 其他数据，一般是控制页面显隐的锁
      otherData: {
        defectiveType: [{
          label: '织片原因',
          value: '织片原因',
          children: [{
            label: '单丝',
            value: '单丝'
          }, {
            label: '漏针',
            value: '漏针'
          }, {
            label: '粗毛',
            value: '粗毛'
          }, {
            label: '细毛',
            value: '细毛'
          }, {
            label: '色差',
            value: '色差'
          }]
        }, {
          label: '套口原因',
          value: '套口原因',
          children: [{
            label: '漏针',
            value: '漏针'
          }, {
            label: '扎针',
            value: '扎针'
          }, {
            label: '罗纹',
            value: '罗纹'
          }, {
            label: '抽条',
            value: '抽条'
          }, {
            label: '合肩',
            value: '合肩'
          }]
        }, {
          label: '平车原因',
          value: '平车原因',
          children: [{
            label: '跳针',
            value: '跳针'
          }, {
            label: '线角',
            value: '线角'
          }, {
            label: '浮线',
            value: '浮线'
          }]
        }, {
          label: '其它原因',
          value: '其它原因',
          children: [{
            label: '污迹',
            value: '污迹'
          }, {
            label: '破损',
            value: '破损'
          }]
        }],
        props: { multiple: true },
        material: {
          step: '',
          flag: '',
          ifUpdate: false
        },
        inspectionSetting: {
          flag: false,
          authArr: []
        },
        batchAllocation_flag: false,
        processType: '',
        whichModule: 'allocation',
        checkAllAllocationLog: false,
        checkAllInspectionLog: false,
        checkAllStockInLog: false,
        loading: true,
        commonApi: [{
          api: (this.$route.params.orderType === '1' ? order : sampleOrder).detail,
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
          api: yarn.list,
          params: {},
          type: 'common'
        }, {
          api: materialStock.detail,
          params: {
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          },
          type: 'common'
        }, {
          api: staff.list,
          params: {},
          type: 'common'
        }, {
          api: station.list,
          params: { type: '2' },
          type: 'common'
        }],
        otherApi: [{
          api: weave.detail,
          params: {
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          },
          type: 'allocation'
        }, {
          api: weave.getDressMat,
          params: {
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          },
          type: 'allocation'
        }, {
          api: inspection.semiFinishedDetail,
          params: {
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          },
          type: 'inspection'
        }, {
          api: receive.detail,
          params: {
            order_id: this.$route.params.id,
            order_type: this.$route.params.orderType
          },
          type: 'stockIn'
        }]
      },
      // 扣款窗口数据
      deductPopupFlag: false,
      clientArr: [],
      deductPopupType: true
    }
  },
  watch: {
    'otherData.whichModule': function (newVal) {
      this.checkUrl()
    },
    'otherData.processType': function (newVal) {
      // 初始化单位为工序分配单位
      this.selectData.clientArr = this.$clone(this.nativeData.clientArr.filter((item) => {
        if (newVal === '织片') {
          return item.type.indexOf(5) !== -1
        } else if (newVal === '套口') {
          return item.type.indexOf(6) !== -1
        } else if (newVal === '车缝') {
          return item.type.indexOf(7) !== -1
        } else if (newVal === '整烫') {
          return item.type.indexOf(8) !== -1
        } else if (newVal === '钉扣') {
          return item.type.indexOf(9) !== -1
        } else if (newVal === '烫钻') {
          return item.type.indexOf(10) !== -1
        } else if (newVal === '手工') {
          return item.type.indexOf(11) !== -1
        } else {
          return item.type.indexOf(13) !== -1
        }
      }))
      this.checkUrl()
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.otherData.processType = processType.find((item) => item.value === Number(this.$route.params.processType)).name
      if (this.$route.query.processType) {
        this.otherData.processType = this.$route.query.processType
      }
      this.init()
    }
  },
  methods: {
    filterDate (date) {
      return new Date(this.$getTime(date)).getTime() < new Date(this.$getTime()).getTime()
    },
    // 拼音搜索单位名称
    searchClient (query) {
      this.selectData.clientArr = []
      let filterClient = []
      if (this.otherData.whichModule === 'inspection') {
        filterClient = this.nativeData.clientArr.filter((item) => {
          return item.type.indexOf(4) !== -1 || item.type.indexOf(5) !== -1
        })
      } else if (this.otherData.whichModule === 'inspection') {
        filterClient = this.nativeData.clientArr.filter((item) => {
          return item.type.indexOf(1) !== -1
        })
      }
      if (query) {
        // 判断一个字符串是否包含某几个字符,所有的indexOf!==-1 且字符是从左往右的,也就是从小到大的
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          this.selectData.clientArr = filterClient.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        } else {
          const queryArr = query.split('')
          filterClient.forEach((item) => {
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
              this.selectData.clientArr.push(item)
            }
          })
        }
      } else {
        this.selectData.clientArr = this.$clone(filterClient)
      }
    },
    searchYarn (queryString, cb) {
      let result = queryString ? this.nativeData.yarnArr.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : (this.nativeData.yarnStock.length > 0 ? this.nativeData.yarnStock : this.nativeData.yarnArr)
      cb(result)
    },
    // 批量分配
    batchAllocation () {
      this.renderData.checkAllocationList = this.renderData.allocationList.filter((item) => {
        return item.childrenMergeInfo.filter((itemChild) => itemChild.checked).length > 0
      }).map((item) => {
        item.checkList = item.childrenMergeInfo.filter((itemChild) => {
          return itemChild.checked === true
        })
        return item
      })
      if (this.formData.allocationForm.length > 0) {
        this.$message.warning('检测到有未完成的' + this.otherData.processType + '分配操作，请完成已有的操作后再进行批量分配')
        return
      }
      if (this.renderData.checkAllocationList.length === 0) {
        this.$message.warning('请至少选择一种配色尺码进行分配')
        return
      }
      this.otherData.batchAllocation_flag = true
    },
    // 填写批量分配公共信息
    batchAllocationCommon () {
      this.renderData.checkAllocationList.forEach((item) => {
        let mixedData = []
        item.checkList.forEach((itemChild) => {
          mixedData.push({
            colorSize: itemChild.color_id,
            loss: '',
            number: itemChild.numbers || (itemChild.number + itemChild.motorise_number),
            lossNum: ''
          })
        })
        if (mixedData.length > 0) {
          this.formData.allocationForm.push({
            companyRate: [{
              company_id: '',
              price: '0',
              process: this.otherData.processType
            }],
            product_id: item.product_id,
            mixedData: mixedData,
            order_time: this.$getTime(),
            complete_time: '',
            colorSizeArr: this.renderData.allocationList.find((itemFind) => item.product_id === itemFind.product_id).childrenMergeInfo,
            desc: ''
          })
        }
      })
      this.formData.allocationForm.forEach((item, index) => {
        item.companyRate[0].company_id = this.formData.batchAllocation_common.commonCompany[index]
        item.companyRate[0].price = this.formData.batchAllocation_common.commonPrice[index]
        if (this.otherData.processType === '织片') {
          item.mixedData.forEach((itemChild) => {
            itemChild.loss = this.formData.batchAllocation_common.commonLoss[index]
            itemChild.lossNum = parseInt(itemChild.number * itemChild.loss / 100)
          })
        }
        item.complete_time = this.formData.batchAllocation_common.commonDate[index]
      })
      this.otherData.batchAllocation_flag = false
    },
    // 单个分配
    singleAllocation (id, size, color, number) {
      this.formData.allocationForm.push({
        companyRate: [{
          company_id: '',
          process: this.otherData.processType,
          price: ''
        }],
        product_id: id || '',
        mixedData: [{
          colorSize: id ? color : '',
          number: number || '',
          loss: this.otherData.processType === '织片' ? 3 : 0,
          lossNum: this.otherData.processType === '织片' ? parseInt(number * 0.03) : 0
        }],
        order_time: this.$getTime(),
        complete_time: '',
        colorSizeArr: [],
        desc: ''
      })
      if (id) {
        this.selectColorSize(this.formData.allocationForm.length - 1, id)
      }
    },
    cancleAllocation () {
      this.formData.allocationForm = []
    },
    // 选择分配产品时，初始化下拉框的尺码配色组
    selectColorSize (index, id) {
      if (this.otherData.whichModule === 'allocation') {
        this.formData.allocationForm[index].colorSizeArr = this.renderData.allocationList.find((item) => item.product_id === id).childrenMergeInfo
      }
      if (this.otherData.whichModule === 'stockIn') {
        this.formData.stockInForm[index].colorSizeArr = this.renderData.allocationDetailCommon.find((item) => item.product_id === id).childrenMergeInfo
      }
    },
    checkAllColorSize (ev, item) {
      item.childrenMergeInfo.forEach((itemChild) => {
        itemChild.checked = ev
      })
    },
    // 机动数计算
    changeLoss (obj) {
      obj.lossNum = Math.ceil(obj.number * obj.loss / 100)
    },
    // 确认分配产品，弹框物料分配
    confirmAllocation () {
      let errorFlag = false
      let errMsg = ''
      this.formData.allocationForm.forEach((item) => {
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
          } else if (itemChild.price === '') {
            errorFlag = true
            errMsg = '请输入单价，如果没有单价请输0元'
          } else if (!itemChild.process) {
            errorFlag = true
            errMsg = '请选择工序'
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
      if (this.renderData.stockInList.length === 0) {
        this.formData.allocationForm.forEach((item) => {
          item.companyRate.forEach((itemClient) => {
            if (!this.formData.allocationMaterialData.find((itemFind) => { return itemFind.company_id === itemClient.company_id })) {
              this.formData.allocationMaterialData.push({
                process: itemClient.process,
                company_id: itemClient.company_id,
                client_name: this.nativeData.clientArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
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
        this.otherData.material.step = 1
      } else {
        let list = []
        this.formData.allocationForm.forEach((item) => {
          item.companyRate.forEach((itemClient) => {
            item.mixedData.forEach((itemColor) => {
              let finded = list.find((itemFind) => {
                return itemFind.product_id === item.product_id && itemFind.client_id === itemClient.company_id && itemFind.process === itemClient.process && itemFind.color_id === itemColor.colorSize
              })
              if (finded) {
                finded.number += Number(itemColor.number)
              } else {
                let productInfo = this.renderData.allocationList.find((itemFind) => Number(itemFind.product_id) === Number(item.product_id))
                list.push({
                  product_id: item.product_id,
                  product_info: productInfo.product_code + '(' + productInfo.category_name + '/' + productInfo.type_name + '/' + productInfo.style_name + ')',
                  client_id: itemClient.company_id,
                  client_name: this.nativeData.clientArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
                  process: itemClient.process,
                  price: itemClient.price,
                  number: itemColor.number,
                  color_id: itemColor.colorSize,
                  color_name: item.colorSizeArr.find((itemFind) => Number(itemFind.color_id) === Number(itemColor.colorSize)).color_name
                })
              }
            })
          })
        })
        list.forEach((item) => {
          let finded = this.formData.cmpMaterialData.find((itemFind) => {
            return itemFind.product_id === item.product_id && itemFind.client_id === item.client_id && itemFind.process === item.process
          })
          if (finded) {
            finded.colorArr.push({
              color_name: item.color_name,
              color_id: item.color_id,
              number: item.number
            })
          } else {
            this.formData.cmpMaterialData.push({
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
        this.formData.cmpMaterialData.forEach((item) => {
          item.materialInfo = this.nativeData.flatMaterial.map((itemMat) => {
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
        this.otherData.material.step = 0
      }
      this.otherData.material.flag = true
    },
    saveAllocation () {
      this.otherData.loading = true
      let formData = []
      this.formData.allocationForm.forEach((item) => {
        item.mixedData.forEach((itemChild) => {
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
              size_id: null,
              color_id: itemChild.colorSize,
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
          this.$message.success('分配成功')
          this.formData.allocationForm = []
          this.formData.allocationMaterialData = []
          this.otherData.material.flag = false
          this.otherData.loading = false
          this.init()
        }
      })
    },
    // 取消物料分配
    cancleMaterial () {
      if (!this.otherData.ifUpdate) {
        this.$confirm('是否确认此次分配不需要分配物料?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveAllocation()
          this.otherData.material.flag = false
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
      this.otherData.material.ifUpdate = false
    },
    updateMaterial () {
      this.formData.allocationMaterialData = this.renderData.materialAllocationDetail.map((item) => {
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
      this.otherData.material.step = 1
      this.otherData.material.flag = true
    },
    deleteMaterial (item, matIndex) {
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
    // 把方便计算的表格转成原有的数据
    nextStep () {
      this.formData.allocationMaterialData = []
      this.formData.cmpMaterialData.forEach((item) => {
        let finded = this.formData.allocationMaterialData.find((itemFind) => { return itemFind.company_id === item.client_id && itemFind.process === item.process })
        if (finded) {
          finded.material_merge = this.materialCmp(finded.material_merge, item.materialInfo)
        } else {
          this.formData.allocationMaterialData.push({
            process: item.process,
            company_id: item.client_id,
            client_name: item.client_name,
            material_type: true,
            material_merge: this.materialCmp([], item.materialInfo)
          })
        }
      })
      this.formData.allocationMaterialData = this.formData.allocationMaterialData.filter((item) => item.material_merge.length > 0)
      if (this.formData.allocationMaterialData.length === 0) {
        this.$message.warning('未填写任何信息，请手动输入物料信息')
        this.formData.allocationForm.forEach((item) => {
          item.companyRate.forEach((itemClient) => {
            if (!this.formData.allocationMaterialData.find((itemFind) => { return itemFind.company_id === itemClient.company_id && itemFind.process === itemClient.process })) {
              this.formData.allocationMaterialData.push({
                process: itemClient.process,
                company_id: itemClient.company_id,
                client_name: this.nativeData.clientArr.find((itemFind) => itemFind.id === itemClient.company_id).name,
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
      this.otherData.material.step = 1
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
    saveMaterial () {
      this.otherData.loading = true
      let formData = []
      this.formData.allocationMaterialData.forEach((item) => {
        item.material_merge.forEach((itemMat) => {
          if (itemMat.material_name) {
            formData.push({
              id: itemMat.id || '',
              client_id: item.company_id,
              material_name: itemMat.material_name,
              material_attribute: itemMat.material_attribute,
              material_type: item.material_type ? 1 : 2,
              unit: itemMat.unit,
              weight: itemMat.number,
              product_flow: item.process
            })
          }
        })
      })
      if (formData.length > 0) {
        weave.saveDressMat({
          order_id: this.$route.params.id,
          order_type: this.$route.params.orderType,
          material_data: formData
        }).then((res) => {
          if (res.data.status) {
            this.saveAllocation()
          }
        })
      } else {
        this.saveAllocation()
      }
    },
    checkAllLog (ev, log) {
      log.forEach((item) => {
        item.checked = ev
      })
    },
    deleteAllocationLog (id, index) {
      this.$confirm('请确认该分配信息还未出库物料,删除织造分配日志还需要手动调整物料分配信息', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          weave.delete({
            id: this.nativeData.allocationLog.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功,请重新确认物料信息!'
              })
              this.updateMaterial()
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
              this.nativeData.allocationLog.splice(index, 1)
              this.updateMaterial()
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
    deleteInspectionLog (id, index) {
      this.$confirm('是否要删除该检验信息，删除后不可恢复', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          inspection.semiFinishedDelete({
            id: this.nativeData.inspectionLog.filter(item => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.init()
            }
          })
        } else {
          inspection.semiFinishedDelete({
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
    // 查看备注详情
    lookDetail (item) {
      if (item.rejects_info) {
        item.desc = JSON.parse(item.rejects_info).join(',')
      }
      const h = this.$createElement
      this.$msgbox({
        title: '日志详情',
        message: h('div', null, [
          h('div', null, [
            h('span', { style: 'color:#333333' }, '日期：'),
            h('span', { style: 'color:#01B48C' }, item.complete_time.slice(0, 10))
          ]),
          h('div', null, [
            h('span', { style: 'color:#333333' }, '操作人：'),
            h('span', { style: 'color:#01B48C' }, item.user_name)
          ]),
          h('div', null, [
            h('span', { style: 'color:#333333' }, '备注：'),
            h('span', { style: 'color:#01B48C' }, item.desc)
          ])
        ])
      })
    },
    // 获取检验产品，初始化尺码配色信息
    getInspectionPro (ev) {
      let colorSizeArr = []
      this.renderData.allocationDetailCommon.find((item) => item.product_id === ev).childrenMergeInfo.forEach((item) => {
        this.commonFind(colorSizeArr, item, ['color_id'], [])
      })
      this.formData.inspectionForm.colorSizeArr = colorSizeArr.map((item) => {
        return {
          color_name: item.color_name,
          color_id: item.color_id,
          size_name: item.size_name,
          size_id: item.size_id,
          value: item.color_id,
          label: item.color_name
        }
      })
      if (this.nativeData.inspectionLog.filter((itemUser) => itemUser.inspection_user_id && itemUser.product_id === ev).length > 0) {
        this.formData.inspectionForm.detail = Array.from(new Set(this.nativeData.inspectionLog.filter((item) => item.inspection_user_id && item.product_id === ev).map((item) => item.inspection_user_id))).map((item) => {
          return {
            client_auth: ['所有人员', Number(item)],
            colorSize: []
          }
        })
        this.formData.inspectionForm.detail.forEach((item) => {
          this.nativeData.inspectionLog.forEach((itemUser) => {
            if (Number(item.client_auth[1]) === Number(itemUser.inspection_user_id) && itemUser.product_id === ev) {
              if (!item.colorSize.find((itemFind) => itemFind.colorSize === itemUser.color_id)) {
                item.colorSize.push({
                  showCheck: false,
                  colorSize: itemUser.color_id,
                  number: '',
                  substandard: '',
                  reason: []
                })
              }
            }
          })
        })
      }
    },
    // 获取检验单位人员，初始化检验表单
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
        let finded = this.formData.inspectionForm.detail.find((itemFind) => {
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
      this.formData.inspectionForm.detail = detail
    },
    // 批量选择检验尺码信息
    selectInspectionColorSize (obj) {
      obj.colorSize = []
      obj.colorSize = this.formData.inspectionForm.colorSizeArr.filter((item) => item.checked).map((item) => {
        return {
          showCheck: false,
          colorSize: item.value,
          number: '',
          price: '',
          substandard: '',
          reason: []
        }
      })
      this.formData.inspectionForm.detail = this.formData.inspectionForm.detail.filter((item) => item.colorSize.length > 0)
    },
    cancleInspectionColorSize () {
      this.formData.inspectionForm.colorSizeArr.forEach((item) => {
        item.checked = false
      })
    },
    spliceInspection (item, index) {
      item.colorSize.splice(index, 1)
      this.formData.inspectionForm.detail = this.formData.inspectionForm.detail.filter((item) => item.colorSize.length > 0)
    },
    // 单个检验
    inspectionOnce (father, son) {
      if (this.formData.inspectionForm.product_id && this.formData.inspectionForm.product_id !== father.product_id) {
        this.$message.error('检测到有别的产品正在检验')
        return
      }
      this.formData.inspectionForm.product_id = father.product_id
      this.getInspectionPro(father.product_id)
      if (!this.formData.inspectionForm.detail[0].client_auth && !this.formData.inspectionForm.detail[0].colorSize[0].colorSize && !this.formData.inspectionForm.detail[0].colorSize[0].number && !this.formData.inspectionForm.detail[0].colorSize[0].substandard && (!this.formData.inspectionForm.detail[0].colorSize[0].reason || this.formData.inspectionForm.detail[0].colorSize[0].reason.length === 0)) {
        this.formData.inspectionForm.detail[0].colorSize[0].colorSize = son.color_id
      } else {
        this.formData.inspectionForm.detail.push({
          client_auth: '',
          colorSize: [{
            showCheck: false,
            colorSize: son.color_id,
            number: '',
            substandard: '',
            reason: []
          }]
        })
      }
    },
    addInspection () {
      this.formData.inspectionForm.detail.push({
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
    // 确认检验
    saveInspection () {
      let error = ''
      this.formData.inspectionForm.detail.forEach((item) => {
        if (item.client_auth.length === 0) {
          error = '请选择所有人员/单位'
        }
        item.colorSize.forEach((itemChild) => {
          if (!itemChild.colorSize) {
            error = '请选择配色'
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
      this.otherData.loading = true
      let formData = []
      this.formData.inspectionForm.detail.forEach((item) => {
        item.colorSize.forEach((itemChild) => {
          formData.push({
            order_type: this.$route.params.orderType,
            product_flow: this.formData.inspectionForm.process || this.otherData.processType,
            order_id: this.$route.params.id,
            product_id: this.formData.inspectionForm.product_id,
            size_id: null,
            color_id: itemChild.colorSize,
            client_id: item.client_auth[0] === '检验单位' ? item.client_auth[1] : '',
            inspection_user: item.client_auth[0] === '所有人员' || item.client_auth[0] === '常用人员' || item.client_auth[0] === '工序负责人员' ? item.client_auth[1] : '',
            count: itemChild.substandard,
            number: itemChild.number,
            rejects_info: JSON.stringify(itemChild.reason),
            complete_time: this.$getTime(new Date()),
            desc: ''
          })
        })
      })
      inspection.semiFinishedCreate({ data: formData }).then((res) => {
        if (res.data.status) {
          let payArr = formData.filter((item) => item.inspection_user).map((item) => {
            return {
              id: null,
              staff_id: item.inspection_user,
              complete_time: this.$getTime(new Date()),
              work_type: this.otherData.processType,
              year: this.$getTime(new Date()).split('-')[0],
              month: Number(this.$getTime(new Date()).split('-')[1]),
              settle_type: this.renderData.orderInfo.order_code || this.renderData.orderInfo.title,
              price: this.formData.inspectionForm.price || 0,
              number: item.number,
              unit: '件',
              total_price: this.formData.inspectionForm.price * item.number,
              desc: item.desc
            }
          })
          if (payArr.length > 0) {
            staff.createPay({ data: payArr }).then((res) => {
              if (res.data.status) {
                this.$message.success('检验成功')
                this.formData.inspectionForm.detail = [{
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
                this.otherData.loading = false
                this.init()
              }
            })
          } else {
            this.$message.success('检验成功')
            this.formData.inspectionForm.detail = [{
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
            this.otherData.loading = false
            this.init()
          }
        }
      })
    },
    // 单个入库
    singleStockIn (id, size, color, number) {
      this.formData.stockInForm.push({
        product_id: id,
        order_time: this.$getTime(),
        complete_time: '',
        desc: '',
        colorSizeArr: [],
        detail: [{
          colorSize: id ? color : '',
          number: number,
          count: ''
        }]
      })
      if (id) {
        this.selectColorSize(this.formData.stockInForm.length - 1, id)
      }
    },
    batchStockIn () {
      let checkStockInList = this.renderData.allocationDetailCommon.filter((item) => {
        return item.childrenMergeInfo.filter((itemChild) => itemChild.checked).length > 0
      }).map((item) => {
        item.checkList = item.childrenMergeInfo.filter((itemChild) => {
          return itemChild.checked === true
        })
        return item
      })
      if (this.formData.stockInForm.length > 0) {
        this.$message.warning('检测到有未完成的' + this.otherData.processType + '入库操作，请完成已有的操作后再进行批量入库')
        return
      }
      if (checkStockInList.length === 0) {
        this.$message.warning('请至少选择一种配色尺码入库')
        return
      }
      this.formData.stockInForm = checkStockInList.map((item) => {
        return {
          product_id: item.product_id,
          order_time: this.$getTime(),
          complete_time: '',
          desc: '',
          colorSizeArr: this.renderData.allocationDetailCommon.find((itemFind) => itemFind.product_id === item.product_id).childrenMergeInfo,
          detail: item.checkList.map((itemChild) => {
            return {
              colorSize: itemChild.color_id,
              number: '',
              count: ''
            }
          })
        }
      })
    },
    cancleStockIn () {
      this.formData.stockInForm = []
    },
    saveStockIn () {
      let formData = []
      this.formData.stockInForm.forEach((item) => {
        item.detail.forEach((itemChild) => {
          formData.push({
            order_id: this.$route.params.id,
            product_id: item.product_id,
            type: 1, // 类型，1 织造 2 加工 没用了
            size_id: '',
            color_id: itemChild.colorSize,
            count: itemChild.count,
            number: itemChild.number,
            complete_time: item.complete_time,
            production_type: this.otherData.processType,
            desc: item.desc
          })
        })
      })
      receive.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.formData.stockInForm = []
          this.init()
        }
      })
    },
    deleteStockInLog (id, index) {
      this.$confirm('是否要删除该入库信息，删除后不可恢复', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          receive.delete({
            id: this.nativeData.stockInLog.filter(item => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.init()
            }
          })
        } else {
          receive.delete({
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
    // 搜索常用人员
    getSettingAuthArr (ev) {
      if (ev) {
        this.selectData.settingAuthArr = this.selectData.authArr.filter((item) => item.name.search(ev) !== -1)
      } else {
        this.selectData.settingAuthArr = this.$clone(this.selectData.authArr)
      }
    },
    filterSettingAuthArr (ev, type) {
      this.selectData.settingAuthArr.forEach((item) => {
        if (item.department_name === type) {
          item.checked = ev
        }
      })
    },
    // 设置常用人员
    saveInspectionSetting () {
      window.localStorage.setItem('inspectionUser', JSON.stringify(this.selectData.settingAuthArr.filter((item) => item.checked)))
      this.otherData.inspectionSetting.flag = false
      this.$message.success('保存常用人员成功,刷新页面后才能生效')
    },
    // 处理公共信息
    getCommon (resArr) {
      this.renderData.orderInfo = resArr[0].data.data
      // 公司信息保留一份原始数据用于搜索筛选
      this.nativeData.clientArr = resArr[1].data.data
      this.nativeData.clientArr.forEach((item) => {
        item.name_pinyin = item.name_pinyin.join('')
      })
      // 初始化单位为工序分配单位
      this.selectData.clientArr = this.$clone(this.nativeData.clientArr.filter((item) => {
        if (this.otherData.processType === '织片') {
          return item.type.indexOf(5) !== -1
        } else if (this.otherData.processType === '套口') {
          return item.type.indexOf(6) !== -1
        } else if (this.otherData.processType === '车缝') {
          return item.type.indexOf(7) !== -1
        } else if (this.otherData.processType === '整烫') {
          return item.type.indexOf(8) !== -1
        } else if (this.otherData.processType === '钉扣') {
          return item.type.indexOf(9) !== -1
        } else if (this.otherData.processType === '烫钻') {
          return item.type.indexOf(10) !== -1
        } else if (this.otherData.processType === '手工') {
          return item.type.indexOf(11) !== -1
        } else {
          return item.type.indexOf(13) !== -1
        }
      }))
      this.selectData.processArr = resArr[2].data.data.filter(item => item.type === 3).map((item) => {
        return {
          value: item.name,
          label: item.name
        }
      })
      this.renderData.processChoose = this.selectData.processArr.slice(0, 3).map((item) => item.label)
      this.selectData.processArr = this.selectData.processArr.slice(3, this.selectData.processArr.length)
      this.nativeData.yarnArr = resArr[3].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      let stockInList = []
      resArr[4].data.data.filter(item => item.type === 2).forEach((item) => {
        this.commonFind(stockInList, item, ['material_name', 'material_color', 'material_color'], ['total_weight'])
      })
      this.nativeData.yarnStock = Array.from(new Set(resArr[4].data.data.map((item) => item.material_name))).map((item) => {
        return {
          value: item
        }
      })
      this.renderData.stockInList = this.$mergeData(stockInList, { mainRule: 'material_name' })
      this.renderData.stockInList.forEach((item) => {
        item.childrenMergeInfo.forEach((itemColor) => {
          this.nativeData.flatMaterial.push({
            material_name: item.material_name,
            material_color: itemColor.material_color,
            material_type: itemColor.material_type,
            unit: itemColor.material_type === 1 ? 'g' : itemColor.unit
          })
          itemColor.outNum = 0
          resArr[4].data.data.filter(item => item.type === 1).forEach((itemOut) => {
            if (item.material_name === itemOut.material_name && itemColor.material_color === itemOut.material_color) {
              itemColor.outNum += itemOut.total_weight
            }
          })
        })
      })
      this.selectData.authArr = resArr[5].data.data
      this.selectData.settingAuthArr = this.$clone(resArr[5].data.data)
      this.selectData.clientAuthArr = [{
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
        children: resArr[5].data.data.filter((item) => {
          return item.station_id && item.station_id.map((item) => item.name).indexOf(this.otherData.processType) !== -1
        }).map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }, {
        value: '所有人员',
        label: '所有人员',
        children: resArr[5].data.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }, {
        value: '织片单位',
        label: '织片单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(5)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '套口单位',
        label: '套口单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(6)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '车缝单位',
        label: '车缝单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(7)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '整烫单位',
        label: '整烫单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(8)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '钉扣单位',
        label: '钉扣单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(9)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '烫钻单位',
        label: '烫钻单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(10)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '手工单位',
        label: '手工单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(11)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }, {
        value: '其它单位',
        label: '其它单位',
        children: resArr[1].data.data.filter(itemF => itemF.type.includes(13)).map(itemM => ({ value: itemM.id, label: itemM.name }))
      }]
      this.selectData.departmentArr = resArr[6].data.data
    },
    // 处理入库信息
    getStockIn (resArr) {
      this.nativeData.stockInLog = resArr[0].data.data.filter((item) => item.production_type === this.otherData.processType)
      this.getProcessChoose(resArr[0].data.data.map((item) => item.production_type))
      this.renderData.allocationDetailCommon.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.stockIn = 0
          resArr[0].data.data.filter((item) => item.production_type === this.otherData.processType).forEach((itemLog) => {
            if (item.product_id === itemLog.product_id && itemChild.color_id === itemLog.color_id) {
              itemChild.stockIn += Number(itemLog.number)
            }
          })
        })
      })
      this.renderData.progress.stockIn = this.renderData.allocationDetailCommon.reduce((total, current) => {
        return total + current.childrenMergeInfo.reduce((totalChild, currentChild) => {
          return totalChild + currentChild.stockIn
        }, 0)
      }, 0)
      this.getDeductClientArr(this.nativeData.stockInLog)
    },
    // 处理分配信息
    getAllocation (resArr) {
      // 织片的分配信息单独处理,其他工序的分配信息全部根据织片分配得来
      if (this.otherData.processType === '织片') {
        let allocationList = []
        this.renderData.orderInfo.batch_info.forEach((itemBatch) => {
          itemBatch.product_info.forEach((itemPro) => {
            this.commonFind(allocationList, itemPro, ['color_id', 'product_id'], ['numbers'])
          })
        })
        this.renderData.allocationList = this.$mergeData(allocationList.map((item) => {
          item.category_name = item.category_info.category_name
          item.type_name = item.category_info.type_name
          item.style_name = item.category_info.style_name
          return item
        }), { mainRule: 'product_id', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'category_info' }, { name: 'product_code' }] })
      } else {
        let allocationList = []
        this.$clone(resArr[0].data.data).filter((item) => item.process === '织片').forEach((item) => {
          this.commonFind(allocationList, item, ['product_id', 'color_id'], ['number', 'motorise_number'])
        })
        this.renderData.allocationList = this.$mergeData(allocationList.map((item) => {
          item.category_name = item.product_info.category_name
          item.type_name = item.product_info.type_name
          item.style_name = item.product_info.style_name
          item.product_code = item.product_info.product_code
          return item
        }), { mainRule: 'product_id', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'category_info' }, { name: 'product_code' }] })
      }
      this.getProcessChoose(this.$clone(resArr[0].data.data).map((item) => item.process))
      this.nativeData.allocationLog = this.$clone(resArr[0].data.data).filter((item) => item.process === this.otherData.processType)
      this.nativeData.allocationLog.forEach((item) => {
        item.size_name = '所有尺码'
      })

      // 统计下已分配数量
      this.renderData.allocationList.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.allocation = 0
          itemChild.motorise_number = 0
          this.$clone(resArr[0].data.data).filter((item) => item.process === this.otherData.processType).forEach((itemLog) => {
            if (item.product_id === itemLog.product_id && itemChild.color_id === itemLog.color_id) {
              itemChild.allocation += Number(itemLog.number)
            }
          })
          this.$clone(resArr[0].data.data).filter((item) => item.process === '织片').forEach((itemLog) => {
            if (item.product_id === itemLog.product_id && itemChild.color_id === itemLog.color_id) {
              itemChild.motorise_number += Number(itemLog.motorise_number)
            }
          })
        })
      })

      this.renderData.allocationDetail = this.$mergeData(this.nativeData.allocationLog, { mainRule: ['client_id', 'price'], otherRule: [{ name: 'client_name' }], childrenRule: { mainRule: 'product_id', otherRule: [{ name: 'product_info' }] } })
      this.renderData.allocationDetail.forEach((itemClient) => {
        itemClient.childrenMergeInfo.forEach((itemPro) => {
          itemPro.colorSize = {}
          itemPro.sizeArr = []
          itemPro.colorArr = []
          itemPro.childrenMergeInfo.forEach((itemColorSize) => {
            itemPro.sizeArr.push(itemColorSize.size_name)
            itemPro.colorArr.push(itemColorSize.color_name)
          })
          itemPro.sizeArr = [...new Set(itemPro.sizeArr)]
          itemPro.colorArr = [...new Set(itemPro.colorArr)]
          itemPro.sizeArr.forEach((itemSize) => {
            itemPro.colorArr.forEach((itemColor) => {
              itemPro.colorSize[itemSize] = itemPro.colorSize[itemSize] || {}
              itemPro.colorSize[itemColor] = itemPro.colorSize[itemColor] || {}
              itemPro.colorSize[itemSize][itemColor] = {
                'number': 0,
                'motorise_number': 0,
                'total_price': 0
              }
            })
          })
          itemPro.childrenMergeInfo.forEach((itemColorSize) => {
            itemPro.colorSize[itemColorSize.size_name][itemColorSize.color_name].number += Number(itemColorSize.number)
            itemPro.colorSize[itemColorSize.size_name][itemColorSize.color_name].motorise_number += Number(itemColorSize.motorise_number)
            itemPro.colorSize[itemColorSize.size_name][itemColorSize.color_name].total_price += (Number(itemColorSize.motorise_number) + Number(itemColorSize.number)) * itemColorSize.price
          })
          itemPro.childrenMergeInfo.forEach((itemColorSize) => {
            itemPro.colorSize[itemColorSize.size_name].total_number = itemPro.colorSize[itemColorSize.size_name].total_price || 0
            itemPro.colorSize[itemColorSize.color_name].total_number = itemPro.colorSize[itemColorSize.color_name].total_number || 0
            itemPro.colorSize.total_number = itemPro.colorSize.total_number || 0
            itemPro.colorSize[itemColorSize.size_name].total_number += (Number(itemColorSize.motorise_number) + Number(itemColorSize.number))
            itemPro.colorSize[itemColorSize.color_name].total_number += (Number(itemColorSize.motorise_number) + Number(itemColorSize.number))
            itemPro.colorSize.total_number += (Number(itemColorSize.motorise_number) + Number(itemColorSize.number))
          })
        })
      })
      // 除了织片工序的分配模块，其他都用织片分配的数据进行入库，检验和分配
      let commonLog = this.$clone(resArr[0].data.data).filter((item) => item.process === '织片')
      let allocationDetailCommon = []
      commonLog.forEach((item) => {
        item.category_name = item.product_info.category_name
        item.type_name = item.product_info.type_name
        item.style_name = item.product_info.style_name
        item.product_code = item.product_info.product_code
        this.commonFind(allocationDetailCommon, item, ['product_id', 'color_id'], ['number', 'motorise_number'])
      })

      this.renderData.allocationDetailCommon = this.$mergeData(allocationDetailCommon, { mainRule: 'product_id', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'product_code' }] })
      this.renderData.materialAllocationDetail = this.$mergeData(resArr[1].data.data.filter((item) => item.product_flow === this.otherData.processType), { mainRule: ['client_id', 'product_flow/process'], otherRule: [{ name: 'client_name' }, { name: 'material_type' }] })
      // 除了织片，其他工序进来如果没有分配织片的，一律点不进来
      if (this.renderData.allocationDetailCommon.length === 0 && this.otherData.processType !== '织片') {
        this.$confirm('该工序还未进行织片分配，不能进行后续操作，请联系织片分配人员进行分配或点击下方按钮进行填写?', '提示', {
          confirmButtonText: '去织片分配',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          this.$router.push('/process/processCommon/' + this.$route.params.id + '/' + this.$route.params.orderType + '/1' + '?whichModule=inspection&processType=织片')
        }).catch(() => {
          this.$router.go(-1)
        })
      }
      let allocationClient = []
      this.nativeData.allocationLog.forEach((item) => {
        this.commonFind(allocationClient, item, ['client_id'], [])
      })
      if (this.selectData.clientAuthArr[0].value === '已分配单位') {
        this.selectData.clientAuthArr.splice(0, 1)
      }

      this.selectData.clientAuthArr.unshift({
        value: '已分配单位',
        label: '已分配单位',
        children: allocationClient.map(itemM => ({ value: itemM.client_id, label: itemM.client_name }))
      })
      // 统计下分配数和订单数
      this.renderData.progress.orderNumber = this.renderData.allocationList.reduce((total, current) => {
        return total + current.childrenMergeInfo.reduce((totalChild, currentChild) => {
          return totalChild + currentChild.numbers
        }, 0)
      }, 0)
      this.renderData.progress.allocation = this.renderData.allocationList.reduce((total, current) => {
        return total + current.childrenMergeInfo.reduce((totalChild, currentChild) => {
          return totalChild + currentChild.allocation + ((this.otherData.processType === '织片') ? (currentChild.motorise_number ? currentChild.motorise_number : 0) : 0)
        }, 0)
      }, 0)
      this.renderData.progress.commonAllocation = this.renderData.allocationList.reduce((total, current) => {
        return total + current.childrenMergeInfo.reduce((totalChild, currentChild) => {
          return totalChild + (this.otherData.processType === '织片' ? currentChild.allocation : currentChild.number) + currentChild.motorise_number
        }, 0)
      }, 0)
      this.getDeductClientArr(this.nativeData.allocationLog)
    },
    // 处理检验信息
    getInspection (resArr) {
      this.nativeData.inspectionLog = resArr[0].data.data.filter((item) => item.product_flow === this.otherData.processType)
      this.nativeData.inspectionLog.forEach((item) => {
        item.from = item.inspection_user || item.client_name
      })
      this.getProcessChoose(resArr[0].data.data.map((item) => item.product_flow))
      let inspectionList = []
      this.$clone(this.nativeData.inspectionLog).forEach((item) => {
        this.commonFind(inspectionList, item, ['product_flow', 'product_id', 'color_id', 'from'], ['number', 'count'])
      })
      this.renderData.inspectionList = this.$mergeData(inspectionList, { mainRule: 'from', childrenRule: { mainRule: 'product_id', otherRule: [{ name: 'product_info' }] } })
      // 统计下已检验数量
      this.renderData.allocationDetailCommon.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.inspection = 0
          resArr[0].data.data.filter((item) => item.product_flow === this.otherData.processType).forEach((itemLog) => {
            if (item.product_id === itemLog.product_id && itemChild.color_id === itemLog.color_id) {
              itemChild.inspection += Number(itemLog.number)
            }
          })
        })
      })

      this.renderData.progress.inspection = this.renderData.allocationDetailCommon.reduce((total, current) => {
        return total + current.childrenMergeInfo.reduce((totalChild, currentChild) => {
          return totalChild + currentChild.inspection
        }, 0)
      }, 0)
      // 初始化已检验人员
      if (this.nativeData.inspectionLog.filter((itemUser) => itemUser.inspection_user_id).length > 0) {
        this.formData.inspectionForm.product_id = this.nativeData.inspectionLog[0].product_id
        this.getInspectionPro(this.nativeData.inspectionLog[0].product_id)
      }
      this.getDeductClientArr(this.nativeData.inspectionLog)
    },
    // 根据工序类型处理模块信息
    getModule (type) {
      this.renderData.module = [{
        name: type + '分配',
        whichModule: 'allocation',
        icon: 'icon-gongxufenpei'
      }, {
        name: type + '检验',
        whichModule: 'inspection',
        icon: 'icon-gongxujianyan'
      }]
      if (type !== '织片') {
        this.renderData.module.unshift({
          name: type + '入库',
          whichModule: 'stockIn',
          icon: 'icon-gongxuruku'
        })
      }
      this.otherData.processType = type
      this.getAllocation(this.nativeData.resSort.allocation)
      this.getStockIn(this.nativeData.resSort.stockIn)
      this.getInspection(this.nativeData.resSort.inspection)
    },
    getProcessChoose (arr) {
      this.renderData.processChoose = Array.from(new Set(this.renderData.processChoose.concat(arr))).filter((item) => item !== '织片' && item !== '套口')
    },
    createProcess (ev) {
      this.renderData.processChoose.push(ev)
      this.getModule(ev)
    },
    // 调接口，并分配给不同的处理函数，最后整合数据
    init (api) {
      let apiArr = api || this.otherData.otherApi
      this.otherData.loading = true
      Promise.all(apiArr.map((item) => {
        return item.api.call(null, item.params)
      })).then((res) => {
        this.nativeData.resSort.stockIn = []
        this.nativeData.resSort.allocation = []
        this.nativeData.resSort.inspection = []
        apiArr.forEach((item, index) => {
          this.nativeData.resSort[item.type].push(res[index])
        })
        if (api) {
          this.getCommon(this.nativeData.resSort.common)
        }
        this.getModule(this.otherData.processType)
        this.checkUrl()
        this.otherData.loading = false
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      })
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
    // 根据日志检测用户是否进对了页面，如果进错了，给他赶出去
    checkUrl () {
      let whichRoot = this.$route.fullPath
      let newVal = this.otherData.whichModule
      if (newVal === 'inspection') {
        if (this.nativeData.inspectionLog.length > 0) {
          if (this.nativeData.inspectionLog[0].size_id && this.nativeData.inspectionLog[0].color_id) {
            whichRoot = '/process/processCommon/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=inspection&processType=' + this.otherData.processType
          }
          if (this.nativeData.inspectionLog[0].size_id && !this.nativeData.inspectionLog[0].color_id) {
            whichRoot = '/process/processForSize/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=inspection&processType=' + this.otherData.processType
          }
          if (!this.nativeData.inspectionLog[0].size_id && this.nativeData.inspectionLog[0].color_id) {
            whichRoot = '/process/processForColor/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=inspection&processType=' + this.otherData.processType
          }
        } else {
          whichRoot = this.$route.path + '?whichModule=inspection&processType=' + this.otherData.processType
        }
      }
      if (newVal === 'allocation') {
        if (this.nativeData.allocationLog.length > 0) {
          if (this.nativeData.allocationLog[0].size_id && this.nativeData.allocationLog[0].color_id) {
            whichRoot = '/process/processCommon/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=allocation&processType=' + this.otherData.processType
          }
          if (this.nativeData.allocationLog[0].size_id && !this.nativeData.allocationLog[0].color_id) {
            whichRoot = '/process/processForSize/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=allocation&processType=' + this.otherData.processType
          }
          if (!this.nativeData.allocationLog[0].size_id && this.nativeData.allocationLog[0].color_id) {
            whichRoot = '/process/processForColor/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=allocation&processType=' + this.otherData.processType
          }
        } else {
          whichRoot = this.$route.path + '?whichModule=allocation&processType=' + this.otherData.processType
        }
      }
      if (newVal === 'stockIn') {
        if (this.nativeData.stockInLog.length > 0) {
          if (this.nativeData.stockInLog[0].size_id && this.nativeData.stockInLog[0].color_id) {
            whichRoot = '/process/processCommon/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=stockIn&processType=' + this.otherData.processType
          }
          if (this.nativeData.stockInLog[0].size_id && !this.nativeData.stockInLog[0].color_id) {
            whichRoot = '/process/processForSize/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=stockIn&processType=' + this.otherData.processType
          }
          if (!this.nativeData.stockInLog[0].size_id && this.nativeData.stockInLog[0].color_id) {
            whichRoot = '/process/processForColor/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.processType + '?whichModule=stockIn&processType=' + this.otherData.processType
          }
        } else {
          whichRoot = this.$route.path + '?whichModule=stockIn&processType=' + this.otherData.processType
        }
      }
      if (this.$route.fullPath.split('/')[2] !== whichRoot.split('/')[2]) {
        this.$message.warning('检测到页面已存在其他数据类型，正在为你自动切换')
      }
      this.$router.replace(whichRoot)
    },
    getDeductClientArr (data) {
      let clientArr = this.$unique(data.filter(itemF => itemF.client_id).map(itemM => ({ client_id: itemM.client_id, client_name: itemM.client_name, type: this.deductType })).concat(this.clientArr), 'client_id')
      this.clientArr = clientArr
    }
  },
  mounted () {
    this.otherData.processType = processType.find((item) => item.value === Number(this.$route.params.processType)).name
    if (this.$route.query.processType) {
      this.otherData.processType = this.$route.query.processType
    }
    this.init(this.otherData.commonApi.concat(this.otherData.otherApi))
    if (this.otherData.processType !== '织片') {
      this.otherData.whichModule = 'stockIn'
    }
    if (this.$route.query.whichModule) {
      this.otherData.whichModule = this.$route.query.whichModule
    }
  },
  computed: {
    deductType () {
      if (this.$route.query.processType === '织片') {
        return 4
      } else if (this.$route.query.processType === '套口') {
        return 5
      }
      return 11
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/processCommon.less";
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
#processCommon {
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
      width: auto;
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
.selfSelect {
  .searchCtn {
    .el-input__inner {
      border-radius: 20px !important;
    }
  }
}
</style>
