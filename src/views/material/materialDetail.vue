<template>
  <div id='materialDetail'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.orderType==='1'?'订':'样'}}单信息</span>
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
            <span class="label">{{$route.params.orderType==='1'?'订':'样'}}单公司：</span>
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
        <span class="title">订单{{type==='1'?'原':'辅'}}料统计</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:36px">
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length===0?'请选取纱线进行加工操作':'批量加工'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                @click="easyProcess">批量加工</div>
            </el-tooltip>
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length===0?'请选取纱线进行订购操作':'订购白胚'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                @click="easyOrder(1)">订购白胚</div>
            </el-tooltip>
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length===0?'请选取纱线进行订购操作':'订购色纱'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length===0,'btnWhiteBlue':checkWhichYarn.length>0}"
                @click="easyOrder(2)">订购色纱</div>
            </el-tooltip>
            <el-tooltip class="item"
              effect="dark"
              :content="checkWhichYarn.length!==0?'请选取一个纱线进行调取操作':'批量调取'"
              placement="top">
              <div class="btn"
                :class="{'btnGray':checkWhichYarn.length!==1,'btnWhiteBlue':checkWhichYarn.length===1}"
                @click="selectStockFirst()">批量调取</div>
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
                  <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}名称</div>
                      <div class="tcolumn">计划数量</div>
                      <div class="tcolumn">采购数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                  <!-- <div class="tcolumn"
                    v-if="type==='1'">批量操作</div> -->
                  <!-- <div class="tcolumn">结余入库</div> -->
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in statistic_data"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.material_attribute}}</div>
                      <div class="tcolumn">{{itemChild.reality_weight}}{{type==='1'?'kg':itemChild.unit}}</div>
                      <div class="tcolumn"><span class="green">{{itemChild.order_weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn"
                        style="flex-direction:row;line-height:54px;justify-content:start">
                        <a href="#order"
                          class="blue"
                          @click="normalOrder(item.material_name,itemChild.material_attribute,itemChild.id,itemChild.reality_weight - itemChild.order_weight)">订购</a>
                        <!-- <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"
                          v-if="type==='1'"></span>
                        <span class="blue"
                          @click="easyStock(item.material_name,itemChild.material_attribute,itemChild.reality_weight - itemChild.order_weight, itemChild.id)"
                          v-if="type==='1'">智能调取</span> -->
                        <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"></span>
                        <a href="#process"
                          class="blue"
                          @click="normalProcess(itemChild.id,itemChild.reality_weight)">加工</a>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="tcolumn"
                    v-if="type==='1'">
                    <a class="orange"
                      @click="selectStockFirst(item.material_name,item.childrenMergeInfo)">批量调取白胚</a>
                  </div> -->
                  <!-- <div class="tcolumn">
                    <span class="blue"
                      style="margin-left:8px"
                      @click="handleGoStock">结余入库</span>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="replenishList.length>0"
          style="margin-top:40px">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">选择</div>
                  <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}名称</div>
                      <div class="tcolumn">计划补纱数量</div>
                      <div class="tcolumn">实际补纱数量</div>
                      <div class="tcolumn">已加工数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in replenishList"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.material_color}}</div>
                      <div class="tcolumn">{{itemChild.need_weight}}{{type==='1'?'kg':itemChild.unit}}</div>
                      <div class="tcolumn"><span class="green">{{itemChild.order_weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn"><span class="blue">{{itemChild.process_weight||0}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn"
                        style="flex-direction:row;line-height:54px;justify-content:start">
                        <a href="#order"
                          class="blue"
                          @click="normalOrder(item.material_name,itemChild.material_attribute,itemChild.id,itemChild.reality_weight - itemChild.order_weight,true)">订购</a>
                        <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"
                          v-if="type==='1'"></span>
                        <span class="blue"
                          @click="supplyStock(item.material_name,item.material_color,item.reality_weight-item.order_weight, item.id)"
                          v-if="type==='1'">调取</span>
                        <!-- <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"></span>
                        <a href="#process"
                          class="blue"
                          @click="normalProcess(itemChild.id,itemChild.order_weight)">加工</a> -->
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
      id="order">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">订购公司</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                      <div class="tcolumn">单价</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">完成时间</div>
                    </div>
                  </div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in order_stock_info"
                  :key="index">
                  <div class="tcolumn"><span :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.material_name}}</div>
                      <div class="tcolumn">{{itemChild.color_code}}</div>
                      <div class="tcolumn">{{itemChild.price}}元</div>
                      <div class="tcolumn"><span class="green">{{itemChild.weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                    </div>
                  </div>
                  <div class="tcolumn"><span class="green">{{item.total_price}}元</span></div>
                  <div class="tcolumn"
                    style="flex-direction: row; justify-content: start; align-items: center;">
                    <span class="blue"
                      @click="$openUrl('/materialTable/' + $route.params.id + '/' + $route.params.orderType + '/' + $route.params.type + '?clientName=' + item.client_name + '&&type=' + item.type_source)">打印</span>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in order_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteOrder(index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">订购公司</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.company_id"
                        filterable
                        placeholder="请选择订购公司">
                        <el-option v-for="item in orderCompany"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">单价</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入单价"
                        v-model="item.price"
                        type="number">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemMat,indexMat) in item.material"
                  :key="indexMat">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">{{type==='1'?'原料名称':'辅料名称'}}</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <!-- 补纱的时候用补纱id，不需要订购id -->
                        <el-select v-model="itemMat.id"
                          v-if="!item.replenishFlag"
                          @change="selectMaterial($event,itemMat)">
                          <el-option v-for="item in materialArr"
                            :key="item.id"
                            :value="item.id"
                            :label="item.material_name+'/'+item.material_attribute">
                          </el-option>
                        </el-select>
                        <!-- 补纱的时候显示纱线名称 -->
                        <el-autocomplete v-model="itemMat.name"
                          v-if="item.replenishFlag"
                          :fetch-suggestions="searchYarn"
                          placeholder="请输入名称">
                        </el-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">{{type==='1'?'原料颜色':'辅料属性'}}</span>
                    </div>
                    <div class="content">
                      <el-autocomplete v-model="itemMat.color"
                        :fetch-suggestions="searchColor"
                        placeholder="请输入颜色">
                      </el-autocomplete>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">{{type==='1'?'原':'辅'}}料数量</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入数量"
                        v-model="itemMat.number"
                        type="number">
                        <template slot="append"
                          v-if="type==='1'">kg</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexMat===0 && !replenishFlag"
                      @click="addMaterial(index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexMat>0"
                      @click="deleteMaterial(index,indexMat)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
                    <div class="label">
                      <span class="text">截止日期</span>
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
                  v-if="!order_flag"
                  @click="normalOrder()">普通订购</span>
                <!-- <span class="once"
                  v-if="!order_flag && type==='1'"
                  @click="easyOrder(1)">一键订购白胚</span>
                <span class="once"
                  v-if="!order_flag && type==='1'"
                  @click="easyOrder(2)">一键订购色纱</span> -->
                <!-- <span class="once"
                  v-if="!order_flag && type==='2'"
                  @click="easyOrder(2)">一键订购</span> -->
                <span class="once cancle"
                  v-if="order_flag"
                  @click="cancleOrder">取消订购</span>
                <span class="once normal"
                  v-if="order_flag"
                  @click="addOrder">添加订购公司</span>
                <span class="once ok"
                  v-if="order_flag"
                  @click="saveOrder">确认订购</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="module"
      v-if="replenishList.length>0">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料补充</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                  <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                  <div class="tcolumn">补充数量</div>
                  <div class="tcolumn">已补数量</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in replenishList"
                  :key="item.id">
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_color}}</div>
                  <div class="tcolumn">{{item.need_weight}}</div>
                  <div class="tcolumn">{{item.order_weight}}</div>
                  <div class="tcolumn"
                    style="flex-direction:row;line-height:54px;justify-content:start">
                    <a href="#order"
                      class="blue"
                      @click="normalOrder(item.material_name,item.material_color,item.id,item.need_weight-item.order_weight,true)">订购</a>
                    <span class="border"
                      style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"
                      v-if="type==='1'"></span>
                    <span class="blue"
                      @click="supplyStock(item.material_name,item.material_color,item.need_weight-item.order_weight, item.id)"
                      v-if="type==='1'">调取</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="module"
      id="process">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料加工</span>
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
                    style="flex:6">
                    <div class="trow">
                      <div class="tcolumn">{{type==='1'?'原':'辅'}}料名称</div>
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                      <div class="tcolumn">工序</div>
                      <div class="tcolumn">单价</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">完成时间</div>
                    </div>
                  </div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_info"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.material_name}}</div>
                      <div class="tcolumn">{{itemChild.material_color}}</div>
                      <div class="tcolumn"><span class="green">{{itemChild.process_type}}</span></div>
                      <div class="tcolumn">{{itemChild.price}}元</div>
                      <div class="tcolumn"><span class="green">{{itemChild.weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                    </div>
                  </div>
                  <div class="tcolumn"><span class="green">{{item.total_price}}元</span></div>
                  <div class="tcolumn"><span class="blue"
                      @click="$openUrl('/materialProcessTable/' + $route.params.id + '/' + $route.params.orderType + '/' + $route.params.type + '?clientName=' + item.client_name)">打印</span></div>
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
                      <el-select v-model="item.company_id"
                        filterable
                        placeholder="请选择加工单位">
                        <el-option v-for="item in processCompany"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">加工工序</span>
                      <span class="explanation">(可多选)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.process"
                        filterable
                        multiple
                        placeholder="请选择加工工序">
                        <el-option v-for="item in processList"
                          :key="item.id"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.processList"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工{{type==='1'?'原':'辅'}}料</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-if="!item.replenishFlag"
                        v-model="itemChild.material_id">
                        <el-option v-for="item in materialArr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.material_name+'/'+item.material_attribute">
                        </el-option>
                      </el-select>
                      <el-input v-if="item.replenishFlag"
                        disabled
                        v-model="itemChild.replenish_material_name"></el-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input v-model="itemChild.number"
                        placeholder="请输入加工数量">
                        <template slot="append"
                          v-if="type==='1'">kg</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">加工单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input v-model="itemChild.price"
                        placeholder="请输入加工单价">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addProcessChild(index)">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteProcessChild(index,indexChild)">删除</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
                    <div class="label">
                      <span class="text">截止日期</span>
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
                  v-if="!process_flag"
                  @click="normalProcess()">普通加工</span>
                <!-- <span class="once"
                  v-if="!process_flag"
                  @click="easyProcess">一键加工</span> -->
                <span class="once cancle"
                  v-if="process_flag"
                  @click="cancleProcess">取消加工</span>
                <span class="once normal"
                  v-if="process_flag"
                  @click="addProcess">添加加工单位</span>
                <span class="once ok"
                  v-if="process_flag"
                  @click="saveProcess">确认加工</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购调取日志</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-left:64px;padding-right:64px">
        <div class="btnCtn_page">
          <div class="btn noBorder noMargin"
            @click="deleteOrderLog('all')">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="downloadOrder">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row flex12">完成日期</span>
            <span class="tb_row">来源</span>
            <span class="tb_row flex2">{{type==='1'?'原':'辅'}}料名称</span>
            <span class="tb_row">{{type==='1'?'颜色':'属性'}}</span>
            <span class="tb_row flex08">单价(元)</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">总价(元)</span>
            <span class="tb_row">备注</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row">创建日期</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in order_stock_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row flex12">{{$getTime(item.complete_time)}}</span>
            <span class="tb_row">
              <span>
                <span :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>
                <br />
                {{item.client_name}}
              </span>
            </span>
            <span class="tb_row flex2">{{item.material_name + '/' + item.before_color}}</span>
            <span class="tb_row">{{item.color_code}}</span>
            <span class="tb_row flex08">{{item.price}}</span>
            <span class="tb_row flex08">{{item.weight}}{{type==='1'?'kg':item.unit}}</span>
            <span class="tb_row flex08">{{$toFixed(item.price*item.weight)}}</span>
            <span class="tb_row">{{item.desc}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row">{{item.create_time.slice(0,10)}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteOrderLog(item.id,index)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料加工日志</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-left:64px;padding-right:64px">
        <div class="btnCtn_page">
          <div class="btn noBorder noMargin"
            @click="deleteProcessLog('all')">批量删除</div>
          <div class="btn noBorder noMargin"
            @click="downloadProcess">批量导出excel</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row flex12">完成日期</span>
            <span class="tb_row flex2">加工单位</span>
            <span class="tb_row flex2">{{type==='1'?'原':'辅'}}料名称</span>
            <span class="tb_row">{{type==='1'?'颜色':'属性'}}</span>
            <span class="tb_row flex08">工序</span>
            <span class="tb_row flex08">单价(元)</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">总价(元)</span>
            <span class="tb_row">备注</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row">创建日期</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in process_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row flex12">{{$getTime(item.complete_time)}}</span>
            <span class="tb_row flex2">{{item.client_name}}</span>
            <span class="tb_row flex2">{{item.material_name}}</span>
            <span class="tb_row">{{item.material_color}}</span>
            <span class="tb_row flex08">{{item.process_type}}</span>
            <span class="tb_row flex08">{{item.price}}</span>
            <span class="tb_row flex08">{{item.weight}}{{type==='1'?'kg':item.unit}}</span>
            <span class="tb_row flex08">{{$toFixed(item.price*item.weight)}}</span>
            <span class="tb_row">{{item.desc}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row">{{item.create_time.slice(0,10)}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteProcessLog(item.id,index)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="detailCtn"
        style="padding-top:0">
        <div class="swichCtn"
          style="margin-top:0;border-top:0">
          <div class="swich"
            v-for="(item,index) in stock_list"
            :key="index"
            @click="getNormalYarn(index)"
            :class="{'active':stockDefault===index}">{{item.material_name}}</div>
          <div class="swich"
            @click="getOtherYarn"
            :class="{'active':otherYarnFlag}">所有库存物料</div>
        </div>
        <div style="height:1px;background:#E9E9E9;margin-top:19px"></div>
        <div class="rowCtn"
          v-if="!otherYarnFlag">
          <div class="normalTb"
            style="width:100%">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">仓库名称</div>
                <div class="tcolumn">{{type==='1'?'原料颜色':'辅料属性'}}</div>
                <div class="tcolumn">库存数量</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-if="stock_list.length>0">
              <div class="trow"
                v-for="(item,index) in stock_list[stockDefault].childrenMergeInfo"
                :key="index">
                <div class="tcolumn">{{item.stock_name}}</div>
                <div class="tcolumn">{{item.material_color}}</div>
                <div class="tcolumn">{{item.total_weight}}</div>
                <div class="tcolumn">
                  <span class="blue"
                    @click="normalStock(item.stock_name,item.material_color,item.total_weight,item.stock_id)">调取</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          style="display:block;overflow:hidden"
          v-if="otherYarnFlag">
          <div style="height:32px;margin:20px 32px;width:300px">
            <el-input class="inputs"
              v-model="yarnWord"
              @change="getOtherYarnList"
              placeholder="输入相似物料名称按回车键查询">
              <template slot="append">
                <i class="el-icon-search"
                  @click="getOtherYarnList"></i>
              </template>
            </el-input>
          </div>
          <div class="normalTb">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">仓库名称</div>
                <div class="tcolumn">物料名称</div>
                <div class="tcolumn">{{type==='1'?'原料颜色':'辅料属性'}}</div>
                <div class="tcolumn">库存数量</div>
                <div class="tcolumn">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-if="otherYarnStock.length>0">
              <div class="trow"
                v-for="(item,index) in otherYarnStock"
                :key="index">
                <div class="tcolumn">{{item.stock_name}}</div>
                <div class="tcolumn">{{item.material_name}}</div>
                <div class="tcolumn">{{item.material_color}}</div>
                <div class="tcolumn">{{item.total_weight}}</div>
                <div class="tcolumn">
                  <span class="blue"
                    @click="normalStock(item.stock_name,item.material_color,item.total_weight,item.stock_id,item.material_name)">调取</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn"
            style="margin:20px;float:right">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="pages"
              @current-change="getOtherYarnList">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="module">
      <div class="titleCtn">
        <span class="title">结余入库日志</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="normalTb"
            style="width:100%">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">入库时间</div>
                <div class="tcolumn">原料名称</div>
                <div class="tcolumn">原料颜色</div>
                <div class="tcolumn">入库数量</div>
                <div class="tcolumn">入库仓库</div>
                <div class="tcolumn">操作人</div>
              </div>
            </div>
            <div class="tbody"
              v-if="stock_list.length>0">
              <div class="trow"
                v-for="(item,index) in stock_list[stockDefault].childrenMergeInfo"
                :key="index">
                <div class="tcolumn">{{item.stock_name}}</div>
                <div class="tcolumn">{{item.material_color}}</div>
                <div class="tcolumn">{{item.total_weight}}</div>
                <div class="tcolumn">
                  <span class="blue"
                    @click="normalStock(item.stock_name,item.material_color,item.total_weight,item.stock_id)">调取</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="popup"
      v-show="easyOrderFlag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyOrderFlag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：一键添加操作可以统一选择订购公司和物料单价，如不需要可以选择直接跳过该步骤。
          </div>
          <div v-for="(item,index) in checkWhichYarn"
            :key="index"
            style="padding:8px;background:#f4f4f4;margin:8px 0">
            <div class="row">
              <div class="label">物料名称：</div>
              <div class="info">
                <span class="text">{{item.material_name}}{{item.replenishFlag?'(补)':''}}</span>
              </div>
            </div>
            <div class="row">
              <div class="label">订购公司：</div>
              <div class="info">
                <el-select v-model="commonCompany[index]"
                  filterable
                  placeholder="请选择订购公司">
                  <el-option v-for="item in orderCompany"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">物料单价：</div>
              <div class="info">
                <el-input placeholder="单价"
                  class="hasMargin"
                  v-model="commonPrice[index]"
                  :key="index">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyOrderFlag = false">直接跳过</div>
          <a href="#order"
            class="btn btnBlue"
            @click="commonFn">确定</a>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyProcessFlag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyProcessFlag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：一键加工操作可以统一选择加工单位,加工单价,加工工序和截止日期，如不需要可以选择直接跳过该步骤。
          </div>
          <div v-for="(item,index) in checkWhichYarn"
            :key="index"
            style="padding:8px;background:#f4f4f4;margin:8px 0">
            <div class="row">
              <div class="label">物料名称：</div>
              <div class="info">
                <span class="text">{{item.material_name}}{{item.replenishFlag?'(补)':''}}</span>
              </div>
            </div>
            <div class="row">
              <div class="label">加工单位：</div>
              <div class="info">
                <el-select v-model="commonProcessCompany[index]"
                  filterable
                  placeholder="请选择加工单位">
                  <el-option v-for="item in processCompany"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">加工单价：</div>
              <div class="info">
                <el-input v-model="commonProcessPrice[index]"
                  placeholder="请输入加工单价">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">加工工序：</div>
              <div class="info">
                <el-select v-model="commonProcess[index]"
                  filterable
                  multiple
                  placeholder="请选择加工工序">
                  <el-option v-for="item in processList"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name"></el-option>
                </el-select>
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
          <a href="#process"
            class="btn btnGray"
            @click="easyProcessFlag = false">直接跳过</a>
          <a href="#process"
            class="btn btnBlue"
            @click="commonFnProcess">确定</a>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyStockFlag">
      <div class="main">
        <div class="title">
          <div class="text">调取物料库存</div>
          <i class="el-icon-close"
            @click="easyStockFlag=false"></i>
        </div>
        <div style="max-height:600px;overflow:auto">
          <div class="content"
            v-for="(itemStock,indexStock) in stock_data"
            :key="indexStock">
            <div class="row"
              v-if="!replenishFlag">
              <div class="label">计划物料：</div>
              <div class="info">
                <el-select v-model="itemStock.material_id"
                  filterable
                  placeholder="请选择需要调取的物料">
                  <el-option v-for="item in materialArr"
                    :key="item.id"
                    :value="item.id"
                    :label="item.material_name+'/'+item.material_attribute">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column"
              v-for="(item,index) in itemStock.stock"
              :key="index">
              <div class="row">
                <div class="label">来源仓库：</div>
                <div class="info">
                  <span class="text">{{item.stock_name}}</span>
                </div>
              </div>
              <div class="row">
                <div class="label">调取物料：</div>
                <div class="info">
                  <span class="text">{{item.name}}</span>
                  <span class="text blue">{{item.color}}</span>
                </div>
              </div>
              <div class="row">
                <div class="label">调取数量：</div>
                <div class="info">
                  <zh-input style="margin-bottom:12px;width:160px"
                    placeholder="输入数量"
                    v-model="item.weight">
                    <template slot="append">{{type==='1'?'kg':item.unit}}</template>
                  </zh-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="label">备注信息：</div>
              <div class="info">
                <el-input style="height:32px;flex:1"
                  v-model="itemStock.desc"
                  placeholder="请输入备注信息"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyStockFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveStock">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showGoStockPopup">
      <div class="main">
        <div class="title">
          <span class="tex">结余入库</span>
          <i class="el-icon-close"
            @click="showGoStockPopup=false"></i>
        </div>
        <div class="content"
          style="max-height:500px">
          <template v-for="(itemMa,indexMa) in goStockInfo">
            <div class="row"
              :key="indexMa+'name'">
              <span class="label">结余原料：</span>
              <span class="info elInputInfo">{{itemMa.material_name}}</span>
            </div>
            <div class="row"
              :key="indexMa+'color'">
              <span class="label">原料颜色：</span>
              <span class="info elInputInfo">{{itemMa.material_color}}</span>
            </div>
            <div class="row"
              v-for="(itemSt,indexSt) in itemMa.stock_info"
              :key="indexMa+'info' + indexSt">
              <span class="label">{{indexSt === 0 ? '入库信息：' : ''}}</span>
              <span class="info elInputInfo">
                <zh-input placeholder="请输入入库数量"
                  type='number'
                  class="elInput"
                  v-model="itemSt.goStock_number"></zh-input>
                <el-select placeholder="请选择入库仓库"
                  class="elInput"
                  v-model="itemSt.stock_name">
                  <el-option v-for="item in stockNameArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </span>
              <span class="editBtn blue"
                v-if="indexSt === 0"
                @click="addItem(itemMa.stock_info,'goStock')">添加</span>
              <span class="editBtn red"
                v-else
                @click="deleteItem(itemMa.stock_info,indexSt)">删除</span>
            </div>
          </template>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showGoStockPopup = false">取消</div>
          <div class="btn btnBlue"
            @click="saveGoStock">确定</div>
        </div>
      </div>
    </div>
    <!-- 批量调取白胚选择优先仓库 -->
    <div class="popup"
      v-show="showStockSelect">
      <div class="main">
        <div class="title">
          <span class="tex">选择仓库</span>
          <i class="el-icon-close"
            @click="resetStock"></i>
        </div>
        <div class="content">
          <div class="row"
            style="display: block;">
            <el-steps :active="step"
              align-center
              finish-status="success">
              <el-step title="搜索物料"></el-step>
              <el-step title="选择仓库"></el-step>
              <el-step title="仓库调取"></el-step>
              <el-step title="调取统计"></el-step>
            </el-steps>
          </div>
          <div class="box">
            <div class="line1">
              <span>原料名称：{{checkWhichYarn.length>0?checkWhichYarn[0].material_name:supplyMatName}}</span>
              <span v-if="step<3">所需总量：<span class="blue">{{stockMatTotalNum}}</span></span>
              <span v-if="step===3">实际调取：<span class="blue">{{stockMatReallyTotalNum}}</span></span>
            </div>
            <div class="line1"
              v-if="step>1">
              <span>调取仓库：{{stockYarnInfo.from}}</span>
              <span>调取纱线：{{stockYarnInfo.material_name + '/' + stockYarnInfo.material_color}}</span>
            </div>
            <div class="list"
              v-loading="searchYarnLoading"
              v-show="step===0">
              <div class="serachCtn">
                <div style="height:32px;margin:20px 32px;width:300px">
                  <el-input class="inputs"
                    v-model="searchYarnWord"
                    @change="searchYarnFn"
                    placeholder="输入相似物料名称按回车键查询">
                    <template slot="append">
                      <i class="el-icon-search"
                        @click="searchYarnFn"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="li">
                <span class="once">物料名称</span>
                <span class="once">库存数量</span>
                <span class="once right">操作</span>
              </div>
              <div class="li"
                v-if="searchYarnList.length===0">
                <div style="text-alignt:center">未找到物料库存</div>
              </div>
              <div class="li"
                v-for="(item,index) in searchYarnList"
                :key="index">
                <span class="once">{{item.material_name}}</span>
                <span class="once">{{item.total_weight}}</span>
                <span class="once right">
                  <span class="once right blue"
                    v-if="item.total_weight>=stockMatTotalNum"
                    @click="chooseMat(item.material_name)">调取</span>
                  <span class="once right"
                    v-if="item.total_weight<stockMatTotalNum">库存不足</span>
                </span>
              </div>
            </div>
            <div class="list"
              v-show="step===1">
              <div class="li">
                <span class="once">仓库名称</span>
                <span class="once">纱线颜色</span>
                <span class="once">库存数量</span>
                <span class="once right">操作</span>
              </div>
              <div class="li"
                v-for="(item,index) in stockSelectList"
                :key="index">
                <span class="once">{{item.stock_name}}</span>
                <span class="once">{{item.material_color}}</span>
                <span class="once">{{item.total_weight}}</span>
                <span class="once right blue"
                  v-if="item.total_weight>=stockMatTotalNum"
                  @click="easyStockBatch(item)">调取</span>
                <span class="once right"
                  v-if="item.total_weight<stockMatTotalNum">库存不足</span>
              </div>
            </div>
            <div class="list"
              v-if="step===2">
              <div class="li">
                <span class="once">计划物料</span>
                <span class="once">调取数量</span>
              </div>
              <div class="li"
                v-for="(item,index) in stock_data"
                :key="index">
                <span class="once">{{item.material_name}}</span>
                <span class="once">
                  <el-input placeholder="请输入数量"
                    v-model="item.stock[0].weight">
                    <template slot="append">kg</template>
                  </el-input>
                </span>
              </div>
            </div>
            <div class="list"
              v-if="step===3">
              <div class="li">
                <span class="once">计划物料</span>
                <span class="once">调取数量</span>
              </div>
              <div class="li"
                v-for="(item,index) in stock_data"
                :key="index">
                <span class="once">{{item.material_name}}</span>
                <span class="once">
                  {{item.stock[0].weight}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            v-if="step>0"
            @click="step--">{{step===1?'搜索其他物料':'上一步'}}</div>
          <div class="btn btnBlue"
            @click="step ++"
            v-if="step===2">下一步</div>
          <div class="btn btnBlue"
            v-if="step===3"
            @click="saveStock">确认调取</div>
        </div>
      </div>
    </div>
    <!-- 打印单扫码进入页面后 -->
    <div class="popup"
      v-if="showRouterPopup">
      <div class="main">
        <div class="title">
          <span style="display:flex;justify-content:center;flex:auto">请选择需要您要跳转的页面</span>
          <span class="el-icon-close"
            @click="showRouterPopup = false"></span>
        </div>
        <div class="content">
          <!-- <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/1/' + $route.params.type )">原料订购</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/2/' + $route.params.type )">辅料订购</div>
          </div> -->
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/1/' + $route.params.orderType)">原料出入库</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/2/' + $route.params.orderType)">辅料出入库</div>
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
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, materialPlan, client, materialManage, yarnColor, yarn, process, materialProcess, replenish, yarnStock, material, sampleOrder, stock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      total: 0,
      pages: 1,
      bushaFlag: false,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      bushaInfo: {
        type: 1,
        id: null,
        order_id: this.$route.params.id,
        yarn_info: [],
        client_info: [],
        desc: '',
        replenish_client: ''
      },
      zhizaodanwei: [], // 织造单位，用于补纱
      type: this.$route.params.type,
      loading: true,
      orderInfo: {
        order_code: '',
        client_name: '',
        user_name: '',
        group_name: '',
        order_time: '',
        order_batch: [],
        desc: ''
      },
      materialArr: [], // 物料原始数据，用于下拉框选项
      statistic_data: [], // 物料统计
      order_data: [], // 订购
      order_stock_info: [], // 订购调取详情
      order_stock_log: [], // 订购调取日志
      order_flag: false,
      stock_list: [], // 库存列表
      stockDefault: 0,
      stock_data: [{
        material_id: '',
        desc: '',
        stock: []
      }], // 调取
      easyStockFlag: false,
      process_data: [], // 加工
      process_info: [],
      process_log: [],
      process_flag: false,
      orderCompany: [],
      processCompany: [],
      easyProcessFlag: false,
      colorList: [],
      yarnList: [],
      processList: [],
      commonCompany: [],
      commonPrice: [],
      commonProcessCompany: [], // 一键加工公共单位
      commonProcessPrice: [],
      commonProcess: [],
      commonDate: [],
      replenishList: [],
      replenishFlag: false,
      replenishId: '', // 补纱flag为true时传replenishId
      easyOrderFlag: false,
      otherYarnStock: [],
      otherYarnFlag: false,
      showGoStockPopup: false,
      goStockInfo: [],
      stockNameArr: [],
      showStockSelect: false,
      stockSelectList: [],
      stockSelect: '',
      stockChildren: [],
      lock: true,
      step: 0,
      stockMatTotalNum: 0,
      supplyMatName: '',
      stockYarnInfo: {
        from: '',
        material: ''
      },
      yarnWord: '', // 仓库物料搜索keyword
      searchYarnWord: '', // 调取弹窗物料搜索keyword
      searchYarnLoading: false,
      searchYarnList: [],
      showRouterPopup: false
    }
  },
  methods: {
    // 结余入库事件
    handleGoStock () {
      this.goStockInfo = this.$flatten(this.$clone(this.statistic_data).map(itemMa => {
        return itemMa.childrenMergeInfo.map(itemColor => {
          return {
            material_name: itemMa.material_name,
            material_color: itemColor.material_attribute
          }
        })
      })).map(item => {
        return {
          ...item,
          stock_info: [
            {
              stock_name: '',
              goStock_number: ''
            }
          ]
        }
      })
      if (this.stockNameArr.length === 0) {
        stock.list({}).then(res => {
          this.stockNameArr = res.data.data.filter(item => +item.type === +this.$route.params.type)
        })
      }
      this.showGoStockPopup = true
    },
    // 保存结余
    saveGoStock () {
      if (this.lock) {
        let data = []
        let flag = true
        this.goStockInfo.forEach(itemMa => {
          itemMa.stock_info.forEach(itemSt => {
            if (itemSt.goStock_number && !itemSt.stock_name) {
              flag = false
            }
            if (itemSt.goStock_number && itemSt.stock_name) {
              data.push({
                material_name: itemMa.material_name,
                type: this.$route.params.type,
                color_code: itemMa.material_color,
                order_id: this.$route.params.id,
                action_type: 3,
                attribute: '',
                stock_id: itemSt.stock_name,
                weight: itemSt.goStock_number,
                desc: '',
                company_id: window.sessionStorage.getItem('company_id'),
                user_id: window.sessionStorage.getItem('user_id')
              })
            }
          })
        })
        if (data.length === 0) {
          this.$message.error('检查到没有可提交的数据')
          return
        }
        if (!flag) {
          this.$message.error('检查到存在填写入库数量但未选择入库仓库')
          return
        }
        this.lock = false
        stock.yarnStock({ data: data }).then(res => { // 原料辅料接口都一样
          this.lock = true
          if (res.data.status !== false) {
            this.$message.success('保存成功')
            this.showGoStockPopup = false
            this.goStockInfo = []
            this.$winReload()
          }
        })
      } else {
        this.$message.warning('请勿频繁点击')
      }
    },
    addItem (data, type) {
      if (type === 'goStock') {
        data.push({ goStock_number: '', stock_name: '' })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    // 批量导出excel订购
    downloadOrder () {
      let data = this.order_stock_log.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.type_source_name = (item.type_source === 2 ? '订购' : '调取') + (item.replenish_id ? '/补纱' : '')
        item.total_price = this.$toFixed(item.price * item.weight)
        return item
      })
      downloadExcel(data, [
        { title: '完成日期', key: 'complete_time' },
        { title: '来源类型', key: 'type_source_name' },
        { title: '来源', key: 'client_name' },
        { title: '物料名称', key: 'material_name' },
        { title: '属性', key: 'color_code' },
        { title: '单价(元)', key: 'price' },
        { title: '数量', key: 'weight' },
        { title: '总价(元)', key: 'total_price' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    // 批量导出excel加工
    downloadProcess () {
      let data = this.process_log.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.total_price = this.$toFixed(item.price * item.weight)
        return item
      })
      downloadExcel(data, [
        { title: '完成日期', key: 'complete_time' },
        { title: '加工单位', key: 'client_name' },
        { title: '物料名称', key: 'material_name' },
        { title: '属性', key: 'material_color' },
        { title: '工序', key: 'process_type' },
        { title: '单价(元)', key: 'price' },
        { title: '数量', key: 'weight' },
        { title: '总价(元)', key: 'total_price' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ], this.orderInfo)
    },
    searchColor (queryString, cb) {
      let result = queryString ? this.colorList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colorList
      cb(result)
    },
    searchYarn (queryString, cb) {
      let result = queryString ? this.yarnList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarnList
      cb(result)
    },
    selectMaterial (id, data) {
      let finded = this.materialArr.find((item) => item.id === id)
      data.color = finded.material_attribute
      data.name = finded.material_name
    },
    normalOrder (name, color, id, number, replenishFlag) {
      this.order_flag = true
      this.order_data.push({
        material: [{
          name: name,
          color: color,
          number: number,
          unit: '',
          id: id || null
        }],
        replenishFlag: replenishFlag,
        price: '',
        company_id: '',
        complete_time: this.$getTime(),
        desc: ''
      })
    },
    easyOrder (type) {
      if (this.checkWhichYarn.length === 0) {
        return
      }
      if (this.order_data.length > 0) {
        this.$message.warning('请先完成已有的订购信息再继续订购')
        return
      }
      this.checkWhichYarn.forEach((item) => {
        let material = []
        item.childrenMergeInfo.forEach((itemChild) => {
          if (itemChild.reality_weight - itemChild.order_weight > 0) {
            material.push({
              name: item.material_name,
              color: type === 1 ? '白胚' : itemChild.material_attribute,
              number: itemChild.reality_weight - itemChild.order_weight,
              unit: this.$route.params.type === '1' ? 'kg' : itemChild.unit,
              id: itemChild.id
            })
          }
        })
        if (material.length > 0) {
          this.order_data.push({
            replenishFlag: item.replenishFlag,
            material: material,
            price: '',
            company_id: '',
            complete_time: this.$getTime(),
            desc: ''
          })
        }
      })
      if (this.order_data.length > 0) {
        this.order_flag = true
        this.easyOrderFlag = true
      } else {
        this.$message.warning('物料已采购完毕，如有特殊需求请手动添加订购信息')
      }
    },
    // 智能调取
    easyStock (name, color, number, id, replenishFlag) {
      this.replenishFlag = replenishFlag
      this.replenishId = id
      this.stock_data = [{
        material_id: '',
        desc: '',
        stock: []
      }]
      // 第一步，判断库存里有没有这种原料
      let finded = this.stock_list.find((item) => item.material_name === name)
      let needNum = number
      if (needNum === 0) {
        this.$message.warning('该物料已采购完毕')
        return
      }
      if (!finded) {
        this.$message.warning('仓库里没有符合该名称的物料，请手动调取相似物料')
      } else {
        // 第二步，优先调取白胚
        this.stock_data[0].material_id = id
        let whiteYarn = finded.childrenMergeInfo.filter((item) => item.material_color === '白胚')
        whiteYarn.forEach((item) => {
          if (needNum > 0) {
            let stockWeight = item.total_weight > needNum ? needNum : item.total_weight
            this.stock_data[0].stock.push({
              stock_id: item.stock_id,
              stock_name: item.stock_name,
              weight: stockWeight,
              color: item.material_color,
              name: name
            })
            needNum = needNum - stockWeight
          }
        })
        // 第三步,如果所需重量还不够,需要继续调取色纱
        let colorYarn = finded.childrenMergeInfo.filter((item) => item.material_color === color)
        colorYarn.forEach((item) => {
          if (needNum > 0) {
            let stockWeight = item.total_weight > needNum ? needNum : item.total_weight
            this.stock_data[0].stock.push({
              stock_id: item.stock_id,
              stock_name: item.stock_name,
              weight: stockWeight,
              color: item.material_color,
              name: name
            })
            needNum = needNum - stockWeight
          }
        })
        // 如果色纱和白胚都不够用,那就提示用户继续订购
        if (needNum > 0) {
          this.$message.warning('检测到库存白胚纱线不足,建议订购或手动调取其他色纱')
        }
        if (this.stock_data[0].stock.length > 0) {
          this.easyStockFlag = true
        }
      }
    },
    // 补纱调取
    supplyStock (name, color, number, id) {
      if (parseInt(number) > 0) {
        this.stock_data = [{
          material_id: id,
          material_name: name + '/' + color,
          desc: '',
          stock: [{
            stock_id: '',
            stock_name: '',
            weight: '',
            color: '',
            name: name
          }]
        }]
        this.supplyMatName = name
        this.stockMatTotalNum = number
        this.replenishFlag = true
        yarnStock.list({
          limit: 10,
          page: 1,
          weight: number,
          material_name: name,
          type: this.$route.params.type
        }).then((res) => {
          this.searchYarnList = res.data.data
          this.step = 0
          this.showStockSelect = true
        })
      } else {
        this.$message.warning('检测到需要调取纱线不足一公斤，请手动调取或补纱')
      }
    },
    selectStockFirst () {
      if (this.checkWhichYarn.length !== 1) {
        this.$message.warning('请选择一种纱线进行调取')
        return
      }
      let needNum = this.checkWhichYarn[0].childrenMergeInfo.reduce((total, current) => {
        return total + (current.reality_weight - current.order_weight)
      }, 0)
      if (parseInt(needNum) === 0) {
        this.$message.warning('检测到需要调取纱线不足一公斤，请手动调取或补纱')
        return
      }
      let stockListCopy = this.$clone(this.stock_list)
      let finded = stockListCopy.find((item) => item.material_name === this.checkWhichYarn[0].material_name)
      // if (!finded) {
      //   this.$message.warning('没有符合该原料名称的物料，可以手动搜索相似名称进行调取')
      //   return
      // }
      this.stockMatTotalNum = needNum.toFixed(2)
      this.showStockSelect = true
      this.stockSelectList = finded ? finded.childrenMergeInfo.filter((item) => item.material_color === '白胚') : []
      // 如果仓库有名称完全一样的白胚，就直接进入调取步骤，否则进入搜索纱线步骤
      if (this.stockSelectList.length > 0) {
        this.step = 1
      } else {
        this.step = 0
        // this.$message.warning('仓库里没有符合该名称的白胚物料，请手动搜索相似名称物料进行搜索')
      }
    },
    // 批量调取
    easyStockBatch (whiteYarn) {
      // 调取白胚
      this.stock_data = []
      this.checkWhichYarn[0].childrenMergeInfo.forEach((item, index) => {
        let needNumChild = item.reality_weight - item.order_weight
        let stockWeight = whiteYarn.total_weight > needNumChild ? (needNumChild > 0 ? needNumChild : 0) : whiteYarn.total_weight
        if (stockWeight > 0) {
          this.stock_data.push({
            replenishFlag: this.checkWhichYarn[0].replenishFlag,
            material_id: item.id,
            material_name: this.checkWhichYarn[0].material_name + '/' + item.material_attribute,
            desc: '',
            stock: [{
              stock_id: whiteYarn.stock_id,
              stock_name: whiteYarn.stock_name,
              weight: stockWeight,
              color: whiteYarn.material_color,
              name: this.checkWhichYarn[0].material_name
            }]
          })
        }
      })
      this.stockYarnInfo = {
        from: whiteYarn.stock_name,
        material_name: whiteYarn.material_name || this.checkWhichYarn[0].material_name,
        material_color: whiteYarn.material_color
      }
      this.step = 2
    },
    // 批量调取搜索物料
    searchYarnFn () {
      this.searchYarnLoading = true
      yarnStock.list({
        limit: 10,
        page: 1,
        weight: this.stockMatTotalNum,
        material_name: this.searchYarnWord,
        type: this.$route.params.type
      }).then((res) => {
        this.searchYarnList = res.data.data
        this.searchYarnLoading = false
      })
    },
    chooseMat (name) {
      this.searchYarnLoading = true
      yarnStock.list({
        material_name: name,
        type: this.$route.params.type,
        page: 1,
        limit: 10
      }).then((res) => {
        this.stockSelectList = res.data.data
        this.step = 1
        this.searchYarnLoading = false
      })
    },
    // 关闭弹窗
    resetStock () {
      this.step = 1
      this.showStockSelect = false
      this.stock_data = []
    },
    normalStock (stock, color, number, stockId, materialName) {
      this.stock_data = [{
        material_id: '',
        material_name: '',
        desc: '',
        stock: [{
          stock_id: stockId,
          stock_name: stock,
          weight: '',
          color: color,
          name: materialName || this.stock_list[this.stockDefault].material_name
        }]
      }]
      this.stockYarnInfo = {
        from: stock,
        material_name: materialName || this.stock_list[this.stockDefault].material_name,
        material_color: color
      }
      this.easyStockFlag = true
    },
    saveStock () {
      // 数据验证
      let flattenData = this.$flatten(this.stock_data)
      let errorFlag = false
      errorFlag = flattenData.some((item) => {
        return !item.weight
      })
      if (errorFlag) {
        this.$message.error('请填写调取数量')
        return
      }
      let stockData = []
      let orderData = []
      this.stock_data.forEach((item) => {
        item.stock.forEach((itemChild) => {
          stockData.push({
            order_type: this.$route.params.orderType,
            material_name: this.stockYarnInfo.material_name,
            color_code: this.stockYarnInfo.material_color,
            weight: itemChild.weight,
            vat_code: null,
            plan_id: item.replenishFlag ? null : item.material_id,
            replenish_id: item.replenishFlag ? item.material_id : null,
            order_id: this.$route.params.id,
            stock_id: itemChild.stock_id,
            attribute: '',
            desc: item.desc
          })
          orderData.push({
            order_type: this.$route.params.orderType,
            desc: item.desc,
            complete_time: this.$getTime(),
            total_price: 0,
            price: 0,
            total_weight: itemChild.weight,
            color_code: this.stockYarnInfo.material_color,
            material_name: this.stockYarnInfo.material_name,
            plan_id: item.replenishFlag ? null : item.material_id,
            type: this.type,
            vat_code: null,
            replenish_id: item.replenishFlag ? item.material_id : null,
            type_source: 1, // 1调取，2订购
            attribute: null,
            stock_id: itemChild.stock_id,
            client_id: null,
            order_id: this.$route.params.id
          })
        })
      })
      materialManage.create({
        data: {
          order_data: orderData,
          stock_data: stockData
        }
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('调取成功，请刷新页面后查看采购数量')
          this.easyStockFlag = false
          this.replenishFlag = false
          this.$winReload()
        }
      })
    },
    cancleOrder () {
      this.order_flag = false
      this.order_data = []
    },
    addOrder () {
      this.order_data.push({
        material: [{
          name: '',
          color: '',
          number: '',
          unit: '',
          id: ''
        }],
        price: '',
        company_id: '',
        complete_time: this.$getTime(),
        desc: ''
      })
    },
    deleteOrder (index) {
      this.order_data.splice(index, 1)
      if (this.order_data.length === 0) {
        this.order_flag = false
      }
    },
    saveOrder () {
      // 数据验证
      let flattenData = this.$flatten(this.order_data)
      let errorFlag = false
      errorFlag = flattenData.some((item) => {
        return !item.company_id
      })
      if (errorFlag) {
        this.$message.error('请选择订购公司')
        return
      }
      errorFlag = flattenData.some((item) => {
        return !item.id
      })
      if (errorFlag) {
        this.$message.error('请选择物料')
        return
      }
      errorFlag = flattenData.some((item) => {
        return !item.price
      })
      if (errorFlag) {
        this.$message.error('请输入单价信息')
        return
      }
      errorFlag = flattenData.some((item) => {
        return !item.name
      })
      if (errorFlag) {
        this.$message.error('请填写原料名称')
        return
      }
      errorFlag = flattenData.some((item) => {
        return !item.color
      })
      if (errorFlag) {
        this.$message.error('请填写原料颜色')
        return
      }
      errorFlag = flattenData.some((item) => {
        return !item.number
      })
      if (errorFlag) {
        this.$message.error('请填写原料数量')
        return
      }
      errorFlag = flattenData.some((item) => {
        return !item.complete_time
      })
      if (errorFlag) {
        this.$message.error('请选择截止日期')
        return
      }
      let formData = this.$flatten(this.order_data).map((item) => {
        return {
          order_type: this.$route.params.orderType,
          desc: item.desc,
          complete_time: item.complete_time,
          total_price: 0,
          price: item.price,
          total_weight: item.number,
          color_code: item.color,
          material_name: item.name,
          plan_id: item.replenishFlag ? null : item.id,
          type: this.type,
          vat_code: null,
          replenish_id: item.replenishFlag ? item.id : null,
          type_source: 2, // 1调取，2订购
          attribute: null,
          stock_id: null,
          client_id: item.company_id,
          order_id: this.$route.params.id
        }
      })
      materialManage.create({
        data: {
          order_data: formData,
          stock_data: []
        }
      }).then((res) => {
        if (res.data.status) {
          this.cancleOrder()
          this.$message.success('订购成功，请刷新页面后查看采购数量')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料订购信息,' + (this.$route.params.orderType === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/material/materialDetail/' + +this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType)
            this.$winReload()
          }
          this.replenishFlag = false
        }
      })
    },
    deleteOrderLog (id, index) {
      this.$confirm('请确认该物料还未入库', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          materialManage.delete({
            id: this.order_stock_log.filter(item => item.checked).map((item) => item.id)
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
          materialManage.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看采购和库存变化'
              })
              this.order_stock_log.splice(index, 1)
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
    // 一键订购，统一输入订购公司和价格
    commonFn () {
      this.order_data.forEach((item, index) => {
        item.price = this.commonPrice[index]
        item.company_id = this.commonCompany[index]
      })
      this.commonCompany = []
      this.commonPrice = []
      this.easyOrderFlag = false
    },
    commonFnProcess () {
      this.process_data.forEach((item, index) => {
        item.processList.forEach((itemChild) => {
          itemChild.price = this.commonProcessPrice[index]
        })
        item.process = this.commonProcess[index]
        item.company_id = this.commonProcessCompany[index]
        item.complete_time = this.commonDate[index]
      })
      this.commonProcessCompany = []
      this.commonProcessPrice = []
      this.commonProcess = []
      this.commonDate = []
      this.easyProcessFlag = false
    },
    addMaterial (index) {
      this.order_data[index].material.push({
        id: '',
        color: '',
        name: '',
        number: '',
        unit: ''
      })
    },
    deleteMaterial (index, indexMat) {
      this.order_data[index].material.splice(indexMat, 1)
    },
    normalProcess (id, number) {
      this.process_flag = true
      this.process_data.push({
        company_id: '',
        processList: [{
          material_id: id,
          number: number,
          price: ''
        }],
        process: [],
        complete_time: '',
        desc: ''
      })
    },
    easyProcess () {
      if (this.checkWhichYarn.length === 0) {
        this.$message.warning('请选择一种纱线进行加工')
        return
      }
      if (this.process_data.length > 0) {
        this.$message.warning('请先完成已有的加工信息再继续订购')
        return
      }
      this.checkWhichYarn.forEach((item) => {
        let material = []
        item.childrenMergeInfo.forEach((itemChild) => {
          material.push({
            replenish_material_name: item.material_name + '/' + itemChild.material_color, // 补纱的时候才会用到，用于现实
            material_id: itemChild.id,
            number: itemChild.order_weight,
            price: ''
          })
        })
        this.process_data.push({
          replenishFlag: item.replenishFlag,
          company_id: '',
          processList: material,
          complete_time: '',
          process: [],
          desc: ''
        })
      })
      this.easyProcessFlag = true
      this.process_flag = true
    },
    saveProcess () {
      let errorFlag = false
      let errorMsg = ''
      this.process_data.forEach((item) => {
        if (!item.company_id) {
          errorFlag = true
          errorMsg = '请选择加工单位'
          return
        }
        if (!item.complete_time) {
          errorFlag = true
          errorMsg = '请选择截止日期'
          return
        }
        if (item.process.length === 0) {
          errorFlag = true
          errorMsg = '请选择加工工序'
        }
        item.processList.forEach((itemChild) => {
          if (!itemChild.material_id) {
            errorFlag = true
            errorMsg = '请选择物料'
            return
          }
          if (!itemChild.number) {
            errorFlag = true
            errorMsg = '请输入数量'
            return
          }
          if (!itemChild.price) {
            errorFlag = true
            errorMsg = '请输入单价'
          }
        })
      })
      if (errorFlag) {
        this.$message.error(errorMsg)
        return
      }
      let formData = []
      this.process_data.forEach((item) => {
        item.processList.forEach((itemChild) => {
          formData.push({
            order_type: this.$route.params.orderType,
            process_type: item.process.join('/'),
            type: this.type,
            order_id: this.$route.params.id,
            client_id: item.company_id,
            price: itemChild.price,
            weight: itemChild.number,
            desc: item.desc,
            complete_time: this.$getTime(item.complete_time),
            plan_id: item.replenishFlag ? null : itemChild.material_id,
            replenish_id: item.replenishFlag ? itemChild.material_id : null
          })
        })
      })
      materialProcess.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.cancleProcess()
          this.$message.success('加工成功，请刷新页面后查看加工日志')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料加工信息,' + (this.$route.params.orderType === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType)
            this.$winReload()
          }
        }
      })
    },
    cancleProcess () {
      this.process_data = []
      this.process_flag = false
    },
    deleteProcess (index) {
      this.process_data.splice(index, 1)
      if (this.process_data.length === 0) {
        this.process_flag = false
      }
    },
    addProcess (index) {
      this.process_data.push({
        company_id: '',
        process: [],
        processList: [{
          material_id: '',
          number: '',
          price: ''

        }],
        complete_time: '',
        desc: ''
      })
    },
    addProcessChild (index) {
      this.process_data[index].processList.push({
        number: '',
        price: '',
        material_id: ''
      })
    },
    deleteProcessChild (index, indexChild) {
      this.process_data[index].processList.splice(indexChild, 1)
    },
    deleteProcessLog (id, index) {
      this.$confirm('请确认该物料还未加工', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          materialProcess.delete({
            id: this.process_log.filter(item => item.checked).map((item) => item.id)
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
          materialProcess.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看加工信息变化'
              })
              this.process_log.splice(index, 1)
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
    getNormalYarn (index) {
      this.stockDefault = index
      this.otherYarnFlag = false
    },
    // 选择其他库存物料
    getOtherYarn () {
      this.stockDefault = -1
      this.otherYarnFlag = true
    },
    getOtherYarnList () {
      yarnStock.list({
        material_name: this.yarnWord,
        type: this.$route.params.type,
        page: this.pages,
        limit: 5
      }).then((res) => {
        this.otherYarnStock = res.data.data
        this.total = res.data.meta.total
      })
    }
  },
  computed: {
    checkWhichYarn () {
      return this.statistic_data.filter((item) => item.checked).concat(this.replenishList.filter((item) => item.checked))
    },
    stockMatReallyTotalNum () {
      return (this.stock_data.reduce((total, current) => {
        return total + Number(current.stock[0].weight)
      }, 0)).toFixed(2)
    }
  },
  watch: {
    order_data: {
      handler (val) {
        this.$nextTick(() => {
          this.$fuckSelect()
        })
      },
      deep: true
    },
    process_data: {
      handler (val) {
        this.$nextTick(() => {
          this.$fuckSelect()
        })
      },
      deep: true
    }
  },
  created () {
    let api = this.$route.params.orderType === '1' ? order : sampleOrder
    Promise.all([api.detail({
      id: this.$route.params.id
    }), materialPlan.detail({
      order_id: this.$route.params.id,
      order_type: this.$route.params.orderType, // 区分订单和样单
      material_type: this.$route.params.type
    }), client.list(),
    yarnColor.list(), yarn.list(),
    materialManage.detail({
      order_type: this.$route.params.orderType,
      order_id: this.$route.params.id
    }), materialManage.init({
      order_type: this.$route.params.orderType,
      order_id: this.$route.params.id
    }), process.list(), materialProcess.detail({
      order_type: this.$route.params.orderType,
      order_id: this.$route.params.id
    }), replenish.list({
      order_id: this.$route.params.id
    }), yarnStock.list({
      type: this.$route.params.type,
      page: 1,
      limit: 5
    }), material.list()]).then((res) => {
      this.orderInfo = res[0].data.data
      this.materialArr = res[1].data.data.total_data.filter((item) => {
        return item.material_type === Number(this.$route.params.type) && item.reality_weight
      })
      this.statistic_data = this.$mergeData(this.materialArr, { mainRule: 'material_name/material_name' })
      if (this.$route.params.type === '1') {
        this.statistic_data.forEach((item) => {
          item.childrenMergeInfo.forEach((itemChild) => {
            itemChild.reality_weight = itemChild.reality_weight / 1000
          })
        })
      }
      this.orderCompany = res[2].data.data.filter((item) => {
        if (this.type === '1') {
          return item.type.indexOf(2) !== -1
        } else {
          return item.type.indexOf(10) !== -1
        }
      })
      this.processCompany = res[2].data.data.filter((item) => {
        return item.type.indexOf(3) !== -1
      })
      this.colorList = res[3].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      if (this.$route.params.type === '1') {
        this.yarnList = res[4].data.data.map((item) => {
          return {
            value: item.name
          }
        })
      } else {
        this.yarnList = res[11].data.data.map((item) => {
          return {
            value: item.name
          }
        })
      }
      // 如果没有公司名称，说明是调取，把调取仓库赋值给client_name
      this.order_stock_log = res[5].data.data.map((item) => {
        if (!item.client_name) {
          item.client_name = item.stock_name
        }
        return item
      }).filter(item => item.type === Number(this.type))
      this.order_stock_info = this.$mergeData(this.order_stock_log, { mainRule: 'client_name/client_name', otherRule: [{ name: 'type_source' }] })
      this.order_stock_info.forEach((item) => {
        item.total_price = parseInt(item.childrenMergeInfo.reduce((total, current) => {
          return total + current.price * current.weight
        }, 0))
      })
      this.stock_list = this.$mergeData(res[6].data.data.stock_info.filter(item => item.type === Number(this.type)), { mainRule: 'material_name/material_name' })
      this.processList = res[7].data.data.filter(item => Number(item.type) === 1)
      this.process_log = res[8].data.data.filter(item => item.type === Number(this.type))
      this.process_info = this.$mergeData(this.process_log, { mainRule: 'client_name/client_name' })
      this.process_info.forEach((item) => {
        item.total_price = parseInt(item.childrenMergeInfo.reduce((total, current) => {
          return total + current.price * current.weight
        }, 0))
      })
      this.replenishList = this.$mergeData(res[9].data.data.filter(item => item.type === Number(this.type)), { mainRule: 'material_name/material_name' })
      // 改造补纱数据跟订购数据一样
      this.replenishList.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.material_attribute = itemChild.material_color
          itemChild.reality_weight = itemChild.need_weight
          item.replenishFlag = true
        })
      })
      this.otherYarnStock = res[10].data.data
      this.total = res[10].data.meta.total
      this.loading = false
    })
    if (this.$route.query.showRouterPopup === 'true') {
      this.showRouterPopup = true
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialDetail.less";
</style>
<style lang="less">
</style>
