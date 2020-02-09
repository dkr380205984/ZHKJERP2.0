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
            <span class="text">{{orderInfo.order_code}}</span>
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
        <span class="title">订单{{type==='1'?'原':'辅'}}料统计</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
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
                  <div class="tcolumn"
                    v-if="type==='1'">批量操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in statistic_data"
                  :key="index">
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
                        <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"
                          v-if="type==='1'"></span>
                        <span class="blue"
                          @click="easyStock(item.material_name,itemChild.material_attribute,itemChild.reality_weight - itemChild.order_weight, itemChild.id)"
                          v-if="type==='1'">智能调取</span>
                        <span class="border"
                          style="width: 1px;height: 14px;background: #E9E9E9;margin: 20px 5px;"></span>
                        <a href="#process"
                          class="blue"
                          @click="normalProcess(itemChild.id,itemChild.reality_weight)">加工</a>
                      </div>
                    </div>
                  </div>
                  <div class="tcolumn"
                    v-if="type==='1'">
                    <a class="orange"
                      @click="easyStockBatch(item.material_name,item.childrenMergeInfo)">批量调取白胚</a>
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
                  <div class="tcolumn">
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
                  <div class="colCtn flex3"
                    v-if="!replenishFlag">
                    <div class="label">
                      <span class="text">选择{{type==='1'?'原':'辅'}}料</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.material_id"
                        @change="selectMaterial($event,item)">
                        <el-option v-for="item in materialArr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.material_name+'/'+item.material_attribute">
                        </el-option>
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
                      <el-autocomplete v-model="itemMat.name"
                        :fetch-suggestions="searchYarn"
                        placeholder="请输入名称">
                      </el-autocomplete>
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
                      v-if="indexMat===0"
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
                <span class="once"
                  v-if="!order_flag && type==='1'"
                  @click="easyOrder(1)">一键订购白胚</span>
                <span class="once"
                  v-if="!order_flag && type==='1'"
                  @click="easyOrder(2)">一键订购色纱</span>
                <span class="once"
                  v-if="!order_flag && type==='2'"
                  @click="easyOrder(2)">一键订购</span>
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
    <div class="module"
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
                      @click="easyStock(item.material_name,item.material_color,item.need_weight-item.order_weight, item.id,true)"
                      v-if="type==='1'">调取</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
                      <span class="text">加工{{type==='1'?'原':'辅'}}料</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.material_id">
                        <el-option v-for="item in materialArr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.material_name+'/'+item.material_attribute">
                        </el-option>
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
                      <span class="text">加工工序</span>
                      <span class="explanation">(可多选)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="itemChild.process"
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
                <span class="once"
                  v-if="!process_flag"
                  @click="easyProcess">一键加工</span>
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
    <!-- <div class="module log">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购调取日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.2">完成日期</div>
                  <div class="tcolumn"
                    style="flex:2">来源</div>
                  <div class="tcolumn"
                    style="flex:2">{{type==='1'?'原':'辅'}}料名称</div>
                  <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
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
                  v-for="(item,index) in order_stock_log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.2">{{item.complete_time.slice(0,10)}}</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <span :class="{'blue':item.type_source===1,'green':item.type_source===2}">{{item.type_source===2?'订购':'调取'}}{{item.replenish_id?'/补纱':''}}</span>
                    <span>{{item.client_name}}</span>
                  </div>
                  <div class="tcolumn"
                    style="flex:2">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.color_code}}</div>
                  <div class="tcolumn">{{item.price}}</div>
                  <div class="tcolumn">{{item.weight}}{{type==='1'?'kg':item.unit}}</div>
                  <div class="tcolumn">{{parseInt(item.price*item.weight)}}</div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteOrderLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="module log">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料加工日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.5">完成日期</div>
                  <div class="tcolumn"
                    style="flex:2">加工单位</div>
                  <div class="tcolumn"
                    style="flex:2">{{type==='1'?'原':'辅'}}料名称</div>
                  <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                  <div class="tcolumn">工序</div>
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
                  v-for="(item,index) in process_log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.5">{{item.complete_time.slice(0,10)}}</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <span>{{item.client_name}}</span>
                  </div>
                  <div class="tcolumn"
                    style="flex:2">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_color}}</div>
                  <div class="tcolumn">{{item.process_type}}</div>
                  <div class="tcolumn">{{item.price}}</div>
                  <div class="tcolumn">{{item.weight}}{{type==='1'?'kg':item.unit}}</div>
                  <div class="tcolumn">{{parseInt(item.price*item.weight)}}</div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteProcessLog(item.id,index)">删除</span>
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
        <span class="title">{{type==='1'?'原':'辅'}}料订购调取日志</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page">
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
            <span class="tb_row flex2">{{item.material_name}}</span>
            <span class="tb_row">{{item.color_code}}</span>
            <span class="tb_row flex08">{{item.price}}</span>
            <span class="tb_row flex08">{{item.weight}}{{type==='1'?'kg':item.unit}}</span>
            <span class="tb_row flex08">{{$toFixed(item.price*item.weight)}}</span>
            <span class="tb_row">{{item.desc}}</span>
            <span class="tb_row">{{item.user_name}}</span>
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
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page">
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
          <div class="normalTb"
            style="width:100%">
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
          <div class="row">
            <div class="label">订购公司：</div>
            <div class="info">
              <el-select v-model="commonCompany"
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
                v-for="(item,index) in statistic_data"
                :key="index">
                <template slot="prepend">{{item.material_name}}</template>
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyOrderFlag = false">直接跳过</div>
          <div class="btn btnBlue"
            @click="commonFn">确定</div>
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
          <div class="row">
            <div class="label">加工单位：</div>
            <div class="info">
              <el-select v-model="commonProcessCompany"
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
              <el-input v-model="commonProcessPrice"
                placeholder="请输入加工单价">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">加工工序：</div>
            <div class="info">
              <el-select v-model="commonProcess"
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
              <el-date-picker v-model="commonDate"
                value-format="yyyy-MM-dd"
                style="width:100%"
                type="date"
                placeholder="选择截止日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyProcessFlag = false">直接跳过</div>
          <div class="btn btnBlue"
            @click="commonFnProcess">确定</div>
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
        <div class="opr">
          <div class="btn btnGray"
            @click="easyStockFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveStock">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, materialPlan, client, materialManage, yarnColor, yarn, process, materialProcess, replenish, yarnStock, material, sampleOrder } from '@/assets/js/api.js'
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
      commonCompany: '',
      commonPrice: [],
      commonProcessCompany: '', // 一键加工公共单位
      commonProcessPrice: '',
      commonProcess: [],
      commonDate: '',
      replenishList: [],
      replenishFlag: false,
      replenishId: '', // 补纱flag为true时传replenishId
      easyOrderFlag: false,
      otherYarnStock: [],
      otherYarnFlag: false
    }
  },
  methods: {
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
      data.material.forEach((item) => {
        item.color = finded.material_attribute
        item.name = finded.material_name
      })
    },
    normalOrder (name, color, id, number, replenishFlag) {
      this.replenishFlag = replenishFlag // 补纱需要特殊处理
      this.replenishId = id
      this.order_flag = true
      this.order_data.push({
        material: [{
          name: name,
          color: color,
          number: number,
          unit: ''
        }],
        price: '',
        material_id: id || null,
        company_id: '',
        complete_time: this.$getTime(),
        desc: ''
      })
    },
    easyOrder (type) {
      this.order_flag = true
      this.order_data = []
      this.statistic_data.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          if (itemChild.reality_weight - itemChild.order_weight > 0) {
            this.order_data.push({
              material: [{
                name: item.material_name,
                color: type === 1 ? '白胚' : itemChild.material_attribute,
                number: itemChild.reality_weight - itemChild.order_weight,
                unit: this.$route.params.type === '1' ? 'kg' : itemChild.unit
              }],
              price: '',
              material_id: itemChild.id,
              company_id: '',
              complete_time: this.$getTime(),
              desc: ''
            })
          }
        })
      })
      this.easyOrderFlag = true
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
    // 批量调取
    easyStockBatch (name, children) {
      this.stock_data = []
      // 第一步，判断库存里有没有这种原料
      let finded = this.stock_list.find((item) => item.material_name === name)
      let needNum = children.reduce((total, current) => {
        return total + (current.reality_weight - current.order_weight)
      }, 0)
      if (needNum === 0) {
        this.$message.warning('该物料已采购完毕')
        return
      }
      if (!finded) {
        this.$message.warning('仓库里没有符合该名称的物料，请手动调取相似物料')
      } else {
        // 第二步，调取白胚
        children.forEach((item, index) => {
          let whiteYarn = finded.childrenMergeInfo.filter((item) => item.material_color === '白胚' && item.total_weight !== 0)
          let needNumChild = item.reality_weight - item.order_weight
          if (whiteYarn.length > 0) {
            this.stock_data.push({
              material_id: item.id,
              desc: '',
              stock: []
            })
          }
          whiteYarn.forEach((itemYarn) => {
            if (needNumChild > 0) {
              let stockWeight = itemYarn.total_weight > needNumChild ? needNumChild : itemYarn.total_weight
              this.stock_data[index].stock.push({
                stock_id: itemYarn.stock_id,
                stock_name: itemYarn.stock_name,
                weight: stockWeight,
                color: itemYarn.material_color,
                name: name
              })
              itemYarn.total_weight = itemYarn.total_weight - stockWeight
              needNumChild = needNumChild - stockWeight
              needNum = needNum - stockWeight
            }
          })
        })
        if (needNum > 0) {
          this.$message.warning('检测到库存白胚纱线不足,建议订购或手动调取其他色纱')
        }
        if (this.stock_data[0] && this.stock_data[0].stock.length > 0) {
          this.easyStockFlag = true
        }
      }
    },
    normalStock (stock, color, number, stockId, materialName) {
      this.stock_data = [{
        material_id: '',
        desc: '',
        stock: []
      }]
      this.easyStockFlag = true
      this.stock_data[0].stock.push({
        stock_id: stockId,
        stock_name: stock,
        weight: '',
        color: color,
        name: materialName || this.stock_list[this.stockDefault].material_name
      })
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
            material_name: itemChild.name,
            color_code: itemChild.color,
            weight: itemChild.weight,
            vat_code: null,
            plan_id: this.replenishFlag ? null : item.material_id,
            replenish_id: this.replenishFlag ? this.replenishId : null,
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
            color_code: itemChild.color,
            material_name: itemChild.name,
            plan_id: this.replenishFlag ? null : item.material_id,
            type: this.type,
            vat_code: null,
            replenish_id: this.replenishFlag ? this.replenishId : null,
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
          unit: ''
        }],
        price: '',
        material_id: '',
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
        return !item.material_id
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
          plan_id: this.replenishFlag ? null : item.material_id,
          type: this.type,
          vat_code: null,
          replenish_id: this.replenishFlag ? this.replenishId : null,
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
        materialManage.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!请刷新页面后查看采购和库存变化'
            })
            this.order_stock_log.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 一键订购，统一输入订购公司和价格
    commonFn () {
      this.order_data.forEach((item) => {
        let index = 0
        this.statistic_data.forEach((itemFind, indexFind) => {
          if (itemFind.material_name === item.material[0].name) {
            index = indexFind
          }
        })
        item.price = this.commonPrice[index]
        item.company_id = this.commonCompany
      })
      this.commonCompany = ''
      this.commonPrice = []
      this.easyOrderFlag = false
    },
    commonFnProcess () {
      this.process_data.forEach((item) => {
        item.processList[0].price = this.commonProcessPrice
        item.processList[0].process = this.commonProcess
        item.company_id = this.commonProcessCompany
        item.complete_time = this.commonDate
      })
      this.commonProcessCompany = ''
      this.commonProcessPrice = ''
      this.commonProcess = []
      this.commonDate = ''
      this.easyProcessFlag = false
    },
    addMaterial (index) {
      this.order_data[index].material.push({
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
        material_id: id,
        company_id: '',
        processList: [{
          number: number,
          price: '',
          process: []
        }],
        complete_time: '',
        desc: ''
      })
    },
    easyProcess () {
      this.statistic_data.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          this.process_data.push({
            material_id: itemChild.id,
            company_id: '',
            processList: [{
              number: itemChild.order_weight,
              price: '',
              process: []
            }],
            complete_time: '',
            desc: ''
          })
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
        if (!item.material_id) {
          errorFlag = true
          errorMsg = '请选择物料'
          return
        }
        if (!item.complete_time) {
          errorFlag = true
          errorMsg = '请选择截止日期'
          return
        }
        item.processList.forEach((itemChild) => {
          if (!itemChild.number) {
            errorFlag = true
            errorMsg = '请输入数量'
            return
          }
          if (!itemChild.price) {
            errorFlag = true
            errorMsg = '请输入单价'
            return
          }
          if (itemChild.process.length === 0) {
            errorFlag = true
            errorMsg = '请选择加工工序'
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
            process_type: itemChild.process.join('/'),
            type: this.type,
            order_id: this.$route.params.id,
            client_id: item.company_id,
            price: itemChild.price,
            weight: itemChild.number,
            desc: item.desc,
            complete_time: this.$getTime(item.complete_time),
            plan_id: item.material_id
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
        material_id: '',
        company_id: '',
        processList: [{
          number: '',
          price: '',
          process: []
        }],
        complete_time: '',
        desc: ''
      })
    },
    addProcessChild (index) {
      this.process_data[index].processList.push({
        number: '',
        price: '',
        process: []
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
        materialProcess.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!请刷新页面后查看加工信息变化'
            })
            this.process_log.splice(index, 1)
          }
        })
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
        type: this.$route.params.type,
        page: this.pages,
        limit: 5
      }).then((res) => {
        this.otherYarnStock = res.data.data
        this.total = res.data.meta.total
      })
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
        return item.material_type === Number(this.$route.params.type)
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
      this.replenishList = res[9].data.data.filter(item => item.type === Number(this.type))
      this.otherYarnStock = res[10].data.data
      this.total = res[10].data.meta.total
      this.loading = false
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/material/materialDetail.less";
</style>
