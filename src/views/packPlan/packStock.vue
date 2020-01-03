<template>
  <div id='packStock'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单信息</div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
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
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{orderInfo.desc}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data='orderInfo.order_batch'></zh-batch>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="planTb.length > 0">
      <div class="titleCtn rightBtn">
        <div class="title">实际装箱信息</div>
        <div class="btn noBorder"
          v-if="actualPackingLog.length > 0"
          @click="$goElView('actualPacking')">查看日志</div>
        <div class="btn noBorder ban"
          v-else>暂无日志</div>
      </div>
      <div class="detailCtn noPadding">
        <div class="swichCtn">
          <div class="swichCtnBox"
            style="left: 32px;">
            <span v-for="(item,index) in planTb"
              :class="{'swich':true, 'active':activePlanId === item.id}"
              :key="index"
              @click="cutPlanTb(item.id,item.pack_info)">装箱计划单{{chinaNum[index]}}</span>
          </div>
          <span class="handleBtn left"></span>
          <span class="handleBtn right"></span>
        </div>
      </div>
      <div class="listCtn">
        <div class="flexTb noMargin">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">包装类型</span>
              <span class="tcolumn">包装序号</span>
              <span class="tcolumn">包装数量</span>
              <span class="tcolumn flex5 noPad">
                <span class="trow">
                  <span class="tcolumn">包含产品</span>
                  <span class="tcolumn">尺码/颜色</span>
                  <span class="tcolumn">计划数量</span>
                  <span class="tcolumn">实际装箱</span>
                  <span class="tcolumn">装箱差值</span>
                </span>
              </span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in activePlanInfo"
              :key="index">
              <span class="tcolumn">{{item.pack_code}}<br />{{item.pack_name}}</span>
              <span class="tcolumn">{{item.start_num + '-' + item.end_num}}</span>
              <span class="tcolumn">{{item.total_box}}</span>
              <span class="tcolumn flex5 noPad">
                <span class="trow"
                  v-for="(itemPro,indexPro) in item.product_info"
                  :key="indexPro">
                  <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro.type.join('/')}}</span>
                  <span class="tcolumn">{{itemPro.size_color.join('/')}}</span>
                  <span class="tcolumn">{{itemPro.number||0}}{{itemPro.unit}}</span>
                  <span class="tcolumn">{{itemPro.actual_number||0}}{{itemPro.unit}}</span>
                  <span :class="['tcolumn',computedDif((itemPro.number||0),(itemPro.actual_number||0))[0]]">{{computedDif((itemPro.number||0),(itemPro.actual_number||0))[1]}}</span>
                </span>
              </span>
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          v-for="(itemOut,indexOut) in actualPackingEditInfo"
          :key="indexOut">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(actualPackingEditInfo,indexOut)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">包装类型</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.pack_code"
                  filterable
                  default-first-option
                  clearable
                  class="elInput"
                  placeholder="请选择需要操作的原料"
                  @change="getPackInfo($event,itemOut)">
                  <el-option v-for="item in activePlanInfo"
                    :key="item.pack_code"
                    :label="item.pack_code + '-' + item.pack_name"
                    :value="item.pack_code">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">包装序号</span>
              </div>
              <div class="content">
                <div class="content elInput middle">
                  <zh-input type='number'
                    placeholder='起始箱'
                    v-model="itemOut.start_num"
                    @input="itemOut.total_box = (Number(itemOut.end_num) || 0) - (Number(itemOut.start_num) || 0) + 1">
                  </zh-input>
                  ~
                  <zh-input type='number'
                    placeholder='末尾箱'
                    v-model="itemOut.end_num"
                    @input="itemOut.total_box = (Number(itemOut.end_num) || 0) - (Number(itemOut.start_num) || 0) + 1">
                  </zh-input>
                </div>
                <zh-input type='number'
                  class="elInput"
                  placeholder='箱数'
                  v-model="itemOut.total_box">
                  <template slot="append">箱</template>
                </zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn"
            v-for="(itemPro,indexPro) in itemOut.product_info"
            :key="indexPro">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">包含产品</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemPro.product_id"
                  disabled
                  class="elInput"
                  placeholder="请选择产品">
                  <el-option v-for="item in itemOut.product_info"
                    :key="item.size_color.join('/')"
                    :label="item.product_code"
                    :value="item.product_id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text"></span>
              </div>
              <div class="content">
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">尺码规格</span>
                      <span class="explanation">（必填）</span>
                    </div>
                    <div class="content">
                      <el-cascader v-model="itemPro.size_color"
                        :options="itemPro.sizeColor"
                        disabled
                        placeholder="请选择尺码颜色"></el-cascader>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">计划数量</span>
                      <span class="explanation">（必填）</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        disabled
                        v-model="itemPro.number">
                        <template slot="append">条</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">实际装箱数</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入实际装箱数量"
                  class="elInput"
                  v-model="itemPro.actual_number"
                  type="number"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="actualPackingEditInfo.length > 0"
            @click="resetEditInfo('actualPacking')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="actualPackingEditInfo.length === 0"
            @click="addItem(actualPackingEditInfo,'actualPacking')">+添加运输单位</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(actualPackingEditInfo,'actualPacking')">
            <div class="btn btnBlue">+添加运输单位</div>
          </div>
          <div class="btn btnDashed"
            v-show="actualPackingEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveActual(true)">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-else>
      <div class="titleCtn rightBtn">
        <div class="title">实际装箱信息</div>
        <div class="btn noBorder"
          v-if="actualPackingLog.length > 0"
          @click="$goElView('actualPacking')">查看日志</div>
        <div class="btn noBorder ban"
          v-else>暂无日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb noMargin">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">产品</span>
              <span class="tcolumn">尺码/颜色</span>
              <span class="tcolumn">计划数量</span>
              <span class="tcolumn">实际装箱</span>
              <span class="tcolumn">装箱差值</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in productInfo"
              :key="index">
              <span class="tcolumn">{{item.product_code}}<br />{{item.type.join('/')}}</span>
              <span class="tcolumn">{{item.size_color.join('/')}}</span>
              <span class="tcolumn">{{(item.order_number || 0) + item.unit}}</span>
              <span class="tcolumn">{{(item.actual_number || 0) + item.unit}}</span>
              <span :class="['tcolumn',computedDif((item.order_number|| 0) ,(item.actual_number || 0))[0]]">{{computedDif((item.order_number|| 0) ,(item.actual_number || 0))[1]}}</span>
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          v-for="(itemOut,indexOut) in actualPackingEditInfo"
          :key="indexOut">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(actualPackingEditInfo,indexOut)"></span>
          <div class="rowCtn"
            v-for="(itemPro,indexPro) in itemOut.product_info"
            :key="indexPro">
            <div class="colCtn flex3">
              <div class="label"
                v-if="indexPro === 0">
                <span class="text">包含产品</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemPro.id"
                  disabled
                  class="elInput"
                  placeholder="请选择产品">
                  <el-option v-for="item in productInfo"
                    :key="item.size_color.join('/')"
                    :label="item.product_code"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label"
                v-if="indexPro === 0">
                <span class="text"></span>
              </div>
              <div class="content">
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label"
                      v-if="indexPro === 0">
                      <span class="text">尺码规格</span>
                    </div>
                    <div class="content">
                      <el-cascader v-model="itemPro.size_color"
                        disabled
                        :options="itemPro.sizeColor"
                        placeholder="请选择尺码颜色"></el-cascader>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label"
                      v-if="indexPro === 0">
                      <span class="text">计划数量</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        disabled
                        placeholder='计划数量'
                        v-model="itemPro.order_number">
                        <template slot="append">条</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label"
                v-if="indexPro === 0">
                <span class="text">实际装箱数</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入实际装箱数量"
                  class="elInput"
                  v-model="itemPro.actual_number"
                  type="number"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="actualPackingEditInfo.length > 0"
            @click="resetEditInfo('actualPacking')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="actualPackingEditInfo.length === 0"
            @click="addItem(actualPackingEditInfo,'actualPacking')">+添加运输单位</div>
          <div class="btn btnDashed"
            v-show="actualPackingEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveActual">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <div class="title">装箱出库</div>
        <div class="btn noBorder"
          v-if="outPackingLog.length > 0"
          @click="$goElView('outPacking')">查看日志</div>
        <div class="btn noBorder ban"
          v-else>暂无日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="flexTb noMargin">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">运输单位</span>
              <span class="tcolumn">运输箱数(箱)</span>
              <span class="tcolumn">出库立方数(m³)</span>
              <span class="tcolumn">单价(m³/元)</span>
              <span class="tcolumn">总价(元)</span>
              <span class="tcolumn center">其他信息</span>
              <span class="tcolumn center">完成时间</span>
              <span class="tcolumn center">备注</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in outPackingInfo"
              :key="index">
              <span class="tcolumn">{{item.client_name}}</span>
              <span class="tcolumn">{{item.number}}</span>
              <span class="tcolumn">{{item.cube_number}}</span>
              <span class="tcolumn">{{item.price}}</span>
              <span class="tcolumn">{{item.total_price}}</span>
              <span class="tcolumn center">
                <el-popover placement="top"
                  width="450"
                  trigger="click">
                  <el-table :data="item.other_info">
                    <el-table-column width="150"
                      property="name"
                      label="标题"></el-table-column>
                    <el-table-column width="300"
                      property="info"
                      label="内容"></el-table-column>
                  </el-table>
                  <span class="btn noBorder noMargin"
                    slot="reference">查看</span>
                </el-popover>
              </span>
              <span class="tcolumn center">{{item.compile_time}}</span>
              <span class="tcolumn center">
                <template v-if="item.remark">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="item.reamrk">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
              </span>
            </span>
          </div>
        </div>
        <div class="editCtn bgGary_page"
          v-for="(itemOut,indexOut) in outPackingEditInfo"
          :key="indexOut">
          <span class="closeIcon_page el-icon-circle-close"
            @click="deleteItem(outPackingEditInfo,indexOut,true)"></span>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">运输单位</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-select v-model="itemOut.client_name"
                  filterable
                  default-first-option
                  clearable
                  class="elInput"
                  placeholder="请选择运输单位">
                  <el-option v-for="item in transportClient"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text"></span>
              </div>
              <div class="content">
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">运输箱数</span>
                      <span class="explanation">（必填）</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.transport_number">
                        <template slot="append">箱</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">出库立方数</span>
                      <span class="explanation">（必填）</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.cube_number"
                        @input="itemOut.total_price = $toFixed((Number(itemOut.cube_number) || 0) * (Number(itemOut.transport_price) || 0))">
                        <template slot="append">m³</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text"></span>
              </div>
              <div class="content">
                <div class="rowCtn noMargin noPadding">
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">运输单价</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.transport_price"
                        @input="itemOut.total_price = $toFixed((Number(itemOut.cube_number) || 0) * (Number(itemOut.transport_price) || 0))">
                        <template slot="append">元/m³</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn noMargin elInput">
                    <div class="label">
                      <span class="text">运输总价</span>
                      <span class="explanation">（必填）</span>
                    </div>
                    <div class="content">
                      <zh-input type='number'
                        placeholder='箱数'
                        v-model="itemOut.total_price">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出库国家</span>
              </div>
              <div class="content">
                <el-autocomplete v-model="itemOut.out_country"
                  :fetch-suggestions="querySearchCountry"
                  placeholder="请选择出库国家"></el-autocomplete>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">运输地址</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入运输地址"
                  class="elInput"
                  v-model="itemOut.out_address"></zh-input>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">出库港口</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入出库港口"
                  class="elInput"
                  v-model="itemOut.out_port"></zh-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">完成时间</span>
                <span class="explanation">（必填）</span>
              </div>
              <div class="content">
                <el-date-picker v-model="itemOut.compile_time"
                  class="elInput"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">备注信息</span>
              </div>
              <div class="content">
                <zh-input placeholder="请输入备注信息"
                  class="elInput"
                  v-model="itemOut.remark"></zh-input>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn_page marginTop20">
          <div class="btn btnDashed"
            v-show="outPackingEditInfo.length > 0"
            @click="resetEditInfo('outPacking')">
            <div class="btn btnOrange">重置</div>
          </div>
          <div class="btn btnDashed bgBlue_page"
            v-if="outPackingEditInfo.length === 0"
            @click="addItem(outPackingEditInfo,'outPacking')">+添加运输单位</div>
          <div class="btn btnDashed"
            v-else
            @click="addItem(outPackingEditInfo,'outPacking')">
            <div class="btn btnBlue">+添加运输单位</div>
          </div>
          <div class="btn btnDashed"
            v-show="outPackingEditInfo.length > 0">
            <div class="btn btnGreen"
              @click="saveOutPacking">保存</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="actualPacking"
      v-if="actualPackingLog.length > 0">
      <div class="titleCtn">
        <div class="title">实际装箱日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          id='yarn'>
          <div class="btn noBorder noMargin"
            @click="deleteLog('all',actualPackingLog,'actualPacking')">批量删除</div>
          <div class="btn noBorder noMargin">批量打印</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">操作时间</span>
            <span class="tb_row">产品信息</span>
            <span class="tb_row flex08">尺码颜色</span>
            <span class="tb_row flex08">实际装箱数</span>
            <span class="tb_row flex08">操作人</span>
            <span class="tb_row middle flex08">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in actualPackingLog[actualPackingLogPages-1]"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.create_time}}</span>
            <span class="tb_row">{{itemLog.product_code}}<br />{{itemLog.type.join('/')}}</span>
            <span class="tb_row flex08">{{itemLog.size + '/' + itemLog.color}}</span>
            <span class="tb_row flex08">{{itemLog.pack_number+itemLog.unit}}</span>
            <span class="tb_row flex08">{{itemLog.user_name}}</span>
            <span class="tb_row middle flex08">
              <span class="tb_handle_btn red"
                @click="deleteLog('one',itemLog.id,'actualPacking')">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="actualPackingLogTotal"
            :current-page.sync="actualPackingLogPages">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="outPacking"
      v-if="outPackingLog.length > 0">
      <div class="titleCtn">
        <div class="title">装箱出库日志</div>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="btnCtn_page"
          id='yarn'>
          <div class="btn noBorder noMargin"
            @click="deleteLog('all',outPackingLog,'outPacking')">批量删除</div>
          <div class="btn noBorder noMargin">批量打印</div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row">操作时间</span>
            <span class="tb_row">运输单位</span>
            <span class="tb_row flex06">运输箱数</span>
            <span class="tb_row flex06">立方数(m³)</span>
            <span class="tb_row flex06">单价(m³/元)</span>
            <span class="tb_row flex06">总价(元)</span>
            <span class="tb_row middle flex06">其他信息</span>
            <span class="tb_row middle flex08">完成时间</span>
            <span class="tb_row middle flex06">操作人</span>
            <span class="tb_row middle flex06">备注</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in outPackingLog[outPackingLogPages-1]"
            :key="indexLog">
            <span class="tb_row flex04">
              <el-checkbox v-model="itemLog.checked"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.created_at}}</span>
            <span class="tb_row">{{itemLog.client_name}}</span>
            <span class="tb_row flex06">{{itemLog.number}}</span>
            <span class="tb_row flex06">{{itemLog.cube_number}}</span>
            <span class="tb_row flex06">{{itemLog.price}}</span>
            <span class="tb_row flex06">{{itemLog.total_price}}</span>
            <span class="tb_row middle flex06">
              <el-popover placement="top"
                width="450"
                trigger="click">
                <el-table :data="itemLog.other_info">
                  <el-table-column width="150"
                    property="name"
                    label="标题"></el-table-column>
                  <el-table-column width="300"
                    property="info"
                    label="内容"></el-table-column>
                </el-table>
                <span class="btn noBorder"
                  style="margin:0"
                  slot="reference">查看</span>
              </el-popover>
            </span>
            <span class="tb_row middle flex08">{{itemLog.compile_time}}</span>
            <span class="tb_row middle flex06">{{itemLog.user_name}}</span>
            <span class="tb_row middle flex06">
              <template v-if="itemLog.remark">
                <el-popover placement="top"
                  width="200"
                  trigger="click"
                  :content="itemLog.reamrk">
                  <span class="btn noBorder"
                    style="margin:0"
                    slot="reference">查看</span>
                </el-popover>
              </template>
              <template v-else>无</template>
            </span>
            <span class="tb_row middle">
              <span class="tb_handle_btn blue">打印</span>
              <span class="tb_handle_btn red"
                @click="deleteLog('one',itemLog.id,'outPacking')">删除</span>
            </span>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="1"
            layout="prev, pager, next"
            :total="outPackingLogTotal"
            :current-page.sync="outPackingLogPages">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum, countries } from '@/assets/js/dictionary.js'
import { order, client, packPlan } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
      countries: countries,
      orderInfo: {},
      productInfo: [],
      planTb: [{
        id: 6
      }],
      activePlanId: '',
      activePlanInfo: [],
      // lastLvPackArr: [],
      actualPackingEditInfo: [],
      actualPackingInfo: [],
      outPackingEditInfo: [],
      transportClient: [],
      outPackingInfo: [],
      actualPackingLog: [],
      actualPackingLogTotal: 1,
      actualPackingLogPages: 1,
      outPackingLog: [],
      outPackingLogTotal: 1,
      outPackingLogPages: 1,
      lock: true
    }
  },
  methods: {
    deleteLog (type, item, types) {
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (types === 'actualPacking') {
          let checkedArr = []
          if (type === 'all') {
            let deleteItem = []
            item.forEach(itemInner => {
              deleteItem = deleteItem.concat(itemInner)
            })
            checkedArr = deleteItem.filter(value => value.checked).map(value => value.id)
          } else {
            checkedArr.push(item)
          }
          packPlan.deletePackActual({
            id: checkedArr
          }).then(res => {
            if (res.data.status !== false) {
              this.$message.success('删除成功')
              this.getActualPackingLog()
            }
          })
        } else if (types === 'outPacking') {
          let checkedArr = []
          if (type === 'all') {
            let deleteItem = []
            item.forEach(itemInner => {
              deleteItem = deleteItem.concat(itemInner)
            })
            checkedArr = deleteItem.filter(value => value.checked).map(value => value.id)
          } else {
            checkedArr.push(item)
          }
          packPlan.deletePackOut({
            id: checkedArr
          }).then(res => {
            if (res.data.status !== false) {
              this.$message.success('删除成功')
              this.getOutPackingLog()
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
    getActualPackingLog () {
      this.loading = true
      packPlan.packActualLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let data = res.data.data
          if (this.activePlanInfo && this.activePlanInfo.length > 0) {
            let filterLog = data.filter(item => item.pack_plan_id === this.activePlanId)
            this.activePlanInfo.forEach(itemPack => {
              itemPack.product_info.forEach(itemPro => {
                let flag = filterLog.filter(item => item.product_id === itemPro.product_id && item.size === itemPro.size_color[0] && item.color === itemPro.size_color[1])
                // console.log(flag)
                if (flag.length > 0) {
                  itemPro.actual_number = flag.map(item => Number(item.pack_number || 0)).reduce((total, item) => {
                    return total + item
                  })
                }
              })
            })
          }
          this.productInfo.forEach(itemPro => {
            let flag = data.filter(item => item.product_id === itemPro.id && item.size === itemPro.size_color[0] && item.color === itemPro.size_color[1])
            if (flag.length > 0) {
              itemPro.actual_number = flag.map(item => Number(item.pack_number || 0)).reduce((total, item) => {
                return total + item
              })
            }
          })
          this.actualPackingLog = this.$newSplice(this.$clone(data).map(itemPro => {
            let flag = this.productInfo.find(item => item.id === itemPro.product_id)
            return {
              product_code: flag ? flag.product_code : '',
              type: flag ? flag.type : [],
              unit: flag ? flag.unit : '条',
              checked: false,
              ...itemPro
            }
          }), 5)
          this.actualPackingLogTotal = this.actualPackingLog.length
          this.loading = false
        }
      })
    },
    cutPlanTb (id, info) {
      this.$confirm('此操作切换装箱计划单，会重置实际装箱填写的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.actualPackingEditInfo = []
        this.activePlanId = id
        // 自动计算包装数量
        let data = []
        let cloneData = this.$clone(info)
        let packNumArr = []
        let activePlanInfo = [] // 最终处理完成的数据
        cloneData.forEach(item => {
          data = data.concat(item)
        })
        data.forEach(item => {
          let newData = []
          item.pack_info.forEach(itemPro => {
            let flag = data.find(items => items.pack_code === itemPro.name)
            if (flag) {
              let innerFlag = packNumArr.find(items => items.pack_code === itemPro.name)
              if (innerFlag) {
                innerFlag.product_info.forEach(itemPro2 => {
                  newData.push({
                    product_id: itemPro2.product_id,
                    size_color: itemPro2.size_color,
                    number: itemPro2.number * Number(itemPro.number || 0)
                  })
                })
              }
            } else {
              newData.push({
                product_id: itemPro.name,
                size_color: itemPro.size_color,
                number: Number(itemPro.number || 0)
              })
            }
          })
          packNumArr.push({
            pack_code: item.pack_code,
            pack_name: item.pack_name,
            product_info: this.$mergeData(newData, { mainRule: ['product_id', 'size_color'], otherRule: [{ name: 'number', type: 'add' }] }).map(items => {
              return {
                product_id: items.product_id,
                size_color: items.size_color,
                number: items.number
              }
            })
          })
        })
        cloneData[cloneData.length - 1].forEach(item => {
          let flag = packNumArr.find(items => items.pack_code === item.pack_code)
          activePlanInfo.push({
            pack_code: item.pack_code,
            pack_name: item.pack_name,
            start_num: item.start_box,
            end_num: item.end_box,
            total_box: item.total_box,
            product_info: flag ? flag.product_info.map(items => {
              let proFlag = this.productInfo.find(itemInner => itemInner.id === items.product_id)
              return {
                product_id: items.product_id,
                sizeColor: proFlag ? proFlag.sizeColor : [],
                unit: proFlag ? proFlag.unit : [],
                type: proFlag ? proFlag.type : [],
                product_code: proFlag ? proFlag.product_code : [],
                size_color: items.size_color,
                number: items.number * Number(item.total_box || 0)
              }
            }) : []
          })
        })
        this.activePlanInfo = activePlanInfo
        this.getActualPackingLog()
      }).catch(() => {
        this.$message({
          message: '已取消'
        })
      })
    },
    saveActual (flag) {
      if (this.lock) {
        let data = []
        if (flag) {
          this.actualPackingEditInfo.forEach(itemPack => {
            itemPack.product_info.filter(items => items.actual_number).forEach(itemPro => {
              data.push({
                order_id: this.$route.params.id,
                order_type: 1,
                pack_plan_id: this.activePlanId,
                pack_code: itemPack.pack_code,
                product_id: itemPro.product_id || itemPro.id,
                size: itemPro.size_color[0],
                color: itemPro.size_color[1],
                number: itemPro.number || itemPro.order_number,
                pack_number: itemPro.actual_number,
                start_box: itemPack.start_num,
                end_box: itemPack.end_num,
                total_box: itemPack.total_box
              })
            })
          })
        } else {

        }
        if (data.length === 0) {
          this.$message.error('检测到没有可提交的数据')
          return
        }
        this.lock = false
        packPlan.packActual({
          data: data
        }).then(res => {
          if (res.data.status !== false) {
            this.getActualPackingLog()
            this.actualPackingEditInfo = []
            this.$message.success('添加成功')
          }
          this.lock = true
        })
      } else {
        this.$message.warning('请勿频繁点击')
      }
    },
    getOutPackingLog () {
      this.loading = true
      packPlan.packOutLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let data = res.data.data.map(item => {
            return {
              checked: false,
              created_at: item.created_at,
              client_name: item.client_name,
              number: item.number,
              cube_number: item.cubic_number,
              price: item.price,
              total_price: item.total_price,
              other_info: [
                {
                  name: '出库国家',
                  info: item.country
                }, {
                  name: '运输地址',
                  info: item.address
                }, {
                  name: '港口',
                  info: item.port
                }
              ],
              compile_time: item.complete_time,
              remark: item.desc,
              user_name: item.user_name,
              id: item.id
            }
          })
          this.outPackingInfo = this.$clone(data)
          this.outPackingLog = this.$newSplice(this.$clone(data).map(item => {
            return {
              checked: false,
              ...item
            }
          }), 5)
          this.outPackingLogTotal = this.outPackingLog.length
        }
        this.loading = false
      })
    },
    saveOutPacking () {
      if (this.lock) {
        let flag = {
          client: true,
          number: true,
          cube_number: true,
          price: true,
          address: true,
          time: true
        }
        let data = this.outPackingEditInfo.map(item => {
          if (!item.client_name) {
            flag.client = false
          }
          if (!item.transport_number) {
            flag.number = false
          }
          if (!item.cube_number) {
            flag.cube_number = false
          }
          if (!item.total_price) {
            flag.price = false
          }
          if (!item.out_address) {
            flag.address = false
          }
          if (!item.compile_time) {
            flag.time = false
          }
          return {
            order_type: 1,
            order_id: this.$route.params.id,
            user_id: window.sessionStorage.getItem('user_id'),
            client_id: item.client_name,
            number: item.transport_number,
            cubic_number: item.cube_number,
            country: item.out_country,
            address: item.out_address,
            port: item.out_port,
            desc: item.remark,
            cost: '',
            price: item.transport_price,
            total_price: item.total_price,
            complete_time: item.compile_time
          }
        })
        if (!flag.client) {
          this.$message.error('检测到未选择运输单位，请选择')
          return
        }
        if (!flag.number) {
          this.$message.error('检测到未填写运输箱数，请填写')
          return
        }
        if (!flag.cube_number) {
          this.$message.error('检测到未填写出库立方数，请填写')
          return
        }
        if (!flag.price) {
          this.$message.error('检测到未填写总价，请填写')
          return
        }
        if (!flag.address) {
          this.$message.error('检测到未填写运输地址，请填写')
          return
        }
        if (!flag.time) {
          this.$message.error('检测到未选择完成时间，请选择')
          return
        }
        console.log(data)
        this.lock = false
        packPlan.packOut({
          data: data
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('保存成功')
            this.getOutPackingLog()
            this.outPackingEditInfo = []
          }
          this.lock = true
        })
      } else {
        this.$message.warning('请勿频繁操作')
      }
    },
    deleteItem (item, index) {
      this.$confirm('此操作将删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.splice(index, 1)
        this.$message({
          type: 'success',
          message: '已删除'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addItem (item, type) {
      if (type === 'outPacking') {
        item.push({
          client_name: '',
          transport_number: '',
          cube_number: '',
          transport_price: '',
          total_price: '',
          out_country: '',
          out_address: '',
          out_port: '',
          compile_time: this.$getTime(),
          remark: ''
        })
      } else if (type === 'actualPacking') {
        if (this.planTb.length > 0) {
          this.actualPackingEditInfo.push({
            pack_code: '',
            start_num: '',
            end_num: '',
            total_box: '',
            product_info: []
          })
        } else {
          this.actualPackingEditInfo.push({
            product_info: this.$clone(this.productInfo).map(item => {
              item.actual_number = ''
              return item
            })
          })
        }
      }
    },
    querySearchCountry (queryString, cb) {
      var restaurants = this.countries.split('、').map(item => { return { value: item } })
      var results = queryString ? restaurants.filter(item => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    resetEditInfo (type) {
      this.$confirm('此操作将重置填写的数据，无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'actualPacking') {
          this.actualPackingEditInfo = []
        } else if (type === 'outPacking') {
          this.outPackingEditInfo = []
        }
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    computedDif (num1, num2) {
      if (Number(num1) > Number(num2)) {
        return ['orange', '-' + (num1 - num2)]
      } else if (Number(num1) === Number(num2)) {
        return ['blue', 0]
      } else if (Number(num1) < Number(num2)) {
        return ['green', '+' + (Number(num2) - Number(num1))]
      }
    },
    getPackInfo (eve, item) {
      let flag = this.activePlanInfo.find(items => items.pack_code === eve)
      if (flag) {
        item.start_num = flag.start_num
        item.end_num = flag.end_num
        item.total_box = flag.total_box
        item.product_info = flag.product_info.map(items => {
          return {
            ...items,
            actual_number: ''
          }
        })
      }
    }
  },
  created () {
    Promise.all([
      order.editDetail({
        id: this.$route.params.id
      }),
      client.list(),
      packPlan.detail({
        order_id: this.$route.params.id,
        order_type: 1
      })
    ]).then(res => {
      this.orderInfo = res[0].data.data
      let productDetail = []
      this.orderInfo.order_batch.map(item => item.product_info).forEach(item => {
        productDetail = productDetail.concat(item)
      })
      this.productInfo = this.$mergeData(productDetail, { mainRule: ['product_code', 'size_name/size', 'color_name/color'], otherRule: [{ name: 'product_info' }, { name: 'numbers/order_number', type: 'add' }] }).map(item => {
        let sizeColor = item.product_info.size_measurement.map(itemSize => {
          return {
            value: itemSize.measurement,
            label: itemSize.measurement,
            children: item.product_info.color.map(itemColor => {
              return {
                value: itemColor.color_name,
                label: itemColor.color_name
              }
            })
          }
        })
        let obj = {
          sizeColor: sizeColor,
          size_color: [item.size, item.color],
          color: item.product_info.color,
          size: item.product_info.size_measurement,
          product_code: item.product_code,
          id: item.product_info.product_id,
          type: [item.product_info.category_name, item.product_info.type_name, item.product_info.style_name],
          flower_name: item.product_info.flower_name,
          unit: item.product_info.unit,
          order_number: item.order_number
        }
        return obj
      })
      this.transportClient = res[1].data.data.filter(item => item.type.indexOf(8) !== -1)
      this.planTb = res[2].data.data.map(item => {
        return {
          id: item.id,
          pack_info: JSON.parse(item.pack_info)
        }
      })
      if (this.planTb.length > 0) {
        this.actualPackingEditInfo = []
        this.activePlanId = this.planTb[0].id
        // 自动计算包装数量
        let data = []
        let cloneData = this.$clone(this.planTb[0].pack_info)
        let packNumArr = []
        let activePlanInfo = [] // 最终处理完成的数据
        cloneData.forEach(item => {
          data = data.concat(item)
        })
        data.forEach(item => {
          let newData = []
          item.pack_info.forEach(itemPro => {
            let flag = data.find(items => items.pack_code === itemPro.name)
            if (flag) {
              let innerFlag = packNumArr.find(items => items.pack_code === itemPro.name)
              if (innerFlag) {
                innerFlag.product_info.forEach(itemPro2 => {
                  newData.push({
                    product_id: itemPro2.product_id,
                    size_color: itemPro2.size_color,
                    number: itemPro2.number * Number(itemPro.number || 0)
                  })
                })
              }
            } else {
              newData.push({
                product_id: itemPro.name,
                size_color: itemPro.size_color,
                number: Number(itemPro.number || 0)
              })
            }
          })
          packNumArr.push({
            pack_code: item.pack_code,
            pack_name: item.pack_name,
            product_info: this.$mergeData(newData, { mainRule: ['product_id', 'size_color'], otherRule: [{ name: 'number', type: 'add' }] }).map(items => {
              return {
                product_id: items.product_id,
                size_color: items.size_color,
                number: items.number
              }
            })
          })
        })
        cloneData[cloneData.length - 1].forEach(item => {
          let flag = packNumArr.find(items => items.pack_code === item.pack_code)
          activePlanInfo.push({
            pack_code: item.pack_code,
            pack_name: item.pack_name,
            start_num: item.start_box,
            end_num: item.end_box,
            total_box: item.total_box,
            product_info: flag ? flag.product_info.map(items => {
              let proFlag = this.productInfo.find(itemInner => itemInner.id === items.product_id)
              return {
                product_id: items.product_id,
                sizeColor: proFlag ? proFlag.sizeColor : [],
                unit: proFlag ? proFlag.unit : [],
                type: proFlag ? proFlag.type : [],
                product_code: proFlag ? proFlag.product_code : [],
                size_color: items.size_color,
                number: items.number * Number(item.total_box || 0)
              }
            }) : []
          })
        })
        this.activePlanInfo = activePlanInfo
      }
      this.getActualPackingLog()
      this.getOutPackingLog()
      this.loading = false
    })
  },
  filters: {
    filterProduct (id) {
      let product = this.productInfo.find(item => item.id === id)
      return product ? product.product_code : ''
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packStock.less";
</style>
