<template>
  <div id='orderDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnGray"
              style="padding:0 8px;font-size:14px"
              v-if='orderInfo.status !== 2004'
              @click="changeOrderStatus('showCanclePopup')">取消订单</div>
            <div class="btn btnGray"
              style="padding:0 8px;font-size:14px"
              v-if="orderInfo.status === 2001 || orderInfo.status === 2002 || orderInfo.status === 2005"
              @click="changeOrderStatus('change')">修改订单</div>
            <div class="btn btnBlue"
              style="padding:0 8px;font-size:14px"
              v-if="orderInfo.status === 2002 || orderInfo.status === 2005"
              @click="changeOrderStatus('ok')">确认完成</div>
            <div class="btn btnBlue"
              style="padding:0 8px;font-size:14px"
              v-if="orderInfo.status === 2004"
              @click="changeOrderStatus('ok',true)">修改实际装箱值</div>
          </div>
          <div class="otherInfo"
            style="justify-content: space-between;">
            <div class="block">
              <span class="label">金额</span>
              <span class="text">{{canSeePriceFlag ? '￥' + orderInfo.total_price : '/'}}</span>
            </div>
            <div class="block">
              <span class="label">状态</span>
              <span :class="{'text':true,'orange':orderInfo.status === 2001, 'blue':orderInfo.status === 2002,'red':orderInfo.status === 2003 || orderInfo.status === 2005,'green':orderInfo.status === 2004}">{{orderInfo.status|filterStatus}}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.contacts}}</span>
          </div>
        </div>
        <div class="rowCtn">
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
          <div class="colCtn flex3">
            <span class="label">结算单位：</span>
            <span class="text">{{orderInfo.account_unit}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">汇率：</span>
            <span class="text">{{orderInfo.exchange_rate}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">税率：</span>
            <span class="text">{{orderInfo.tax_rate}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{orderInfo.user_name}}</span>
          </div>
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{orderInfo.remark}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">文件信息：</span>
            <span class="text text-warp">
              <span v-for="(item,index) in orderInfo.order_contract"
                :key="index + 'order'"
                class="linkBox">
                <i class="el-icon-view el-icon--right"></i>
                <a :href="item.url"
                  target="view_window"
                  :download="item.url">{{item.name}}</a>
              </span>
              <span v-for="(item,index) in orderInfo.others_info"
                :key="index + 'order'"
                class="linkBox">
                <i class="el-icon-view el-icon--right"></i>
                <a :href="item.url"
                  target="view_window"
                  :download="item.url">{{item.name}}</a>
              </span>
              <span v-for="(item,index) in orderInfo.pack_means"
                :key="index + 'order'"
                class="linkBox">
                <i class="el-icon-view el-icon--right"></i>
                <a :href="item.url"
                  target="view_window"
                  :download="item.url">{{item.name}}</a>
              </span>
              <span v-for="(item,index) in orderInfo.store_means"
                :key="index + 'order'"
                class="linkBox">
                <i class="el-icon-view el-icon--right"></i>
                <a :href="item.url"
                  target="view_window"
                  :download="item.url">{{item.name}}</a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <zh-file-module :orderId='$route.params.id'
      title_has_border
      canChange />
    <div class="module">
      <div class="titleCtn"
        style="display:flex;justify-content: space-between;align-items: center;">
        <span>
          <span class="title hasBorder">发货信息</span>
        </span>
        <span class="btn btnBlue"
          @click="showHistoryProg()">查看历史进度</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row middle">发货日期</span>
              <span class="tb_row middle">批次备注</span>
              <span class="tb_row tb_col flex6">
                <span class="tb_col_item">
                  <span class="tb_row">产品信息</span>
                  <span class="tb_row middle">产品图片</span>
                  <span class="tb_row">尺码/颜色</span>
                  <span class="tb_row">发货数量</span>
                  <span class="tb_row">单价</span>
                  <span class="tb_row">总价</span>
                </span>
              </span>
              <span class="tb_row middle">操作</span>
            </span>
            <span class="tb_content"
              v-for="(itemBatch,indexBatch) in orderInfo.batch_info"
              :key="indexBatch">
              <span class="tb_row middle tb_col"
                style="padding:12px 0;">
                <span style="font-size:16px;font-weight:bold;margin-bottom:4px">第{{itemBatch.batch_id}}批</span>
                <span style="margin-bottom:4px">({{itemBatch.batch_title || '无'}})</span>
                <span style="margin-bottom:4px">{{itemBatch.delivery_time}}</span>
                <span>{{itemBatch.order_type}}</span>
              </span>
              <span class="tb_row middle">
                <template v-if="!itemBatch.desc">无</template>
                <el-popover placement="top-start"
                  v-else
                  title="批次备注"
                  width="200"
                  trigger="hover"
                  :content="(itemBatch.desc).toString()">
                  <span style="cursor: pointer;color:#1A95FF"
                    slot="reference">查看备注</span>
                </el-popover>
              </span>
              <span class="tb_row tb_col flex6">
                <span class="tb_col_item"
                  v-for="(itemPro,indexPro) in itemBatch.product_info"
                  :key="indexPro">
                  <span class="tb_row"
                    style="cursor: pointer;color:#1A95FF"
                    @click="$openUrl('/product/productDetail/' + itemPro.product_id)">{{itemPro.product_code}}<br />{{itemPro.category_info|filterType}}</span>
                  <span class="tb_row middle">
                    <zh-img-list :list='itemPro.image'></zh-img-list>
                  </span>
                  <span class="tb_row">{{itemPro.size_name + '/' + itemPro.color_name}}</span>
                  <span class="tb_row">{{itemPro.numbers + itemPro.category_info.unit}}</span>
                  <span class="tb_row">{{canSeePriceFlag ?  $toFixed(itemPro.unit_price) + orderInfo.account_unit : '/'}}</span>
                  <span class="tb_row">{{canSeePriceFlag ? $toFixed((Number(itemPro.numbers) || 0 ) * (Number(itemPro.unit_price) || 0)) + orderInfo.account_unit : '/'}}</span>
                </span>
              </span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  v-if="itemBatch.status !== 1"
                  @click="changeBatchStatus(itemBatch)">确认发货</span>
                <span class="tb_handle_btn green"
                  v-else>已确认发货</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单产前确认信息</span>
      </div>
      <div class="detailCtn">
        <el-tabs type="border-card"
          style="margin:0 32px;box-shadow:none">
          <el-tab-pane v-for="(item,index) in compareInfo"
            :key="index">
            <span slot="label"
              :class="item.status">{{item.label}}</span>
            <div class="confirmTable">
              <div class="otherCtn"
                v-if="item.compareInfo">
                <span class="item">操作人：{{item.user_name}}</span>
                <span class="item">操作时间：{{item.update_time}}</span>
              </div>
              <div class="tb_content center"
                v-if="!item.compareInfo">暂未确认</div>
              <div class="tb_content"
                v-for="(itemI,indexI) in item.compareInfo"
                :key="indexI">
                <span class="tb_row hasBack">{{item.nameIndex === undefined ? itemI.name : itemI.name[item.nameIndex]}}</span>
                <span class="tb_row flex04"
                  v-if="!itemI.isRemarkItem"
                  :class="{green:itemI.status,orange:!itemI.status}">{{itemI.status ? '无差异' : '差异较大'}}</span>
                <span class="tb_row">
                  <template v-if="Array.isArray(itemI.info)">
                    {{itemI.info.join(',') || '无'}}
                  </template>
                  <template v-else>{{itemI.info || '无'}}</template>
                </span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn warnCtn">
        <span class="title hasBorder">流程进度</span>
        <span class="warningCtn"
          v-if="warnData.warnArr.filter(itemF=>itemF.isWarnStatus > 0).length > 0">
          <span class="item">已触发</span>
          <span class="item red">{{warnData.warnArr.filter(itemF=>itemF.isWarnStatus > 0).length}}</span>
          <span class="item">次预警提醒</span>
        </span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn"
          style="padding:0 60px"
          v-if="warnData.isOpenWarn">
          <zh-time-process :processData="warnData.warnArr"
            :handleFlag="false"
            :startTime="warnData.startTime"
            :endTime='warnData.endTime'
            nowDay
            style="width:100%"></zh-time-process>
        </div>
        <div class="rowCtn"
          v-if="warnData.isOpenWarn">
          <div style="height:1px;background:#E9E9E9;width:100%;margin:25px 0"></div>
        </div>
        <div class="processCtn">
          <div class="processOnce showAll"
            v-for="(item,index) in productProgInfo"
            :key='index'>
            <div class="showCtn">
              <div class="label active">{{item.name}}</div>
              <div class="lineOut">
                <div class="lineIn"
                  v-for="(itemChild,indexChild) in item.info"
                  :key="indexChild"
                  :class="{'blue':indexChild===0,'green':indexChild===1}"
                  :style="{'width':itemChild.prog + '%','z-index':parseInt(100-itemChild.prog)}"></div>
              </div>
              <div class="boxCtn"
                v-for="(itemChild,indexChild) in item.info"
                :key="indexChild">
                <div class="box"
                  :class="{'blue':indexChild===0,'green':indexChild===1}"></div>
                <div class="text">{{itemChild.name}}</div>
                <div class="rate">({{itemChild.prog}}%)</div>
              </div>
              <div class="opr"
                v-if="index===0"
                @click="orderDetailInfo.material.length>0?(showFlag2.showMaterial=!showFlag2.showMaterial):getMaterialDetail()">{{showFlag2.showMaterial?'收起列表':'展开详情'}}</div>
              <div class="opr"
                v-if="index===1"
                @click="orderDetailInfo.production.length>0?(showFlag2.showWeave=!showFlag2.showWeave):getProductionDetail()">{{showFlag2.showWeave?'收起列表':'展开详情'}}</div>
              <div class="opr"
                v-if="index===2"
                @click="orderDetailInfo.outStock.length>0?(showFlag2.showOut=!showFlag2.showOut):getOutStockDetail()">{{showFlag2.showOut?'收起列表':'展开详情'}}</div>
            </div>
            <div class="hideCtn">
              <template v-if="index===0&&showFlag2.showMaterial">
                <div class="flexTb">
                  <div class="thead">
                    <span class="trow">
                      <span class="tcolumn">物料名称</span>
                      <span class="tcolumn flex5 noPad">
                        <span class="trow">
                          <span class="tcolumn">颜色属性</span>
                          <span class="tcolumn">计划数量</span>
                          <span class="tcolumn">采购数量</span>
                          <span class="tcolumn">最终入库</span>
                          <span class="tcolumn">织造出库</span>
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="tbody">
                    <span class="trow"
                      v-for="(item,index) in orderDetailInfo.material"
                      :key="index">
                      <span class="tcolumn">{{item.material_name}}</span>
                      <span class="tcolumn noPad flex5">
                        <span class="trow"
                          v-for="(itemAttr,indexAttr) in item.attr_info"
                          :key="indexAttr">
                          <span class="tcolumn">{{itemAttr.attr}}</span>
                          <span class="tcolumn green">{{itemAttr.plan_number}}{{item.unit}}</span>
                          <span class="tcolumn green">{{itemAttr.order_number}}{{item.unit}}</span>
                          <span class="tcolumn green">{{itemAttr.go_stock_number || 0}}{{item.unit}}</span>
                          <span class="tcolumn green">{{itemAttr.out_stock_number || 0}}{{item.unit}}</span>
                        </span>
                      </span>
                    </span>
                    <!-- <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link"
                        style="margin-left:4px">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialPlan/materialPlanDetail/'+ $route.params.id +'/1')">物料计划</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/material/materialDetail/'+ $route.params.id +'/1/1/normal')">原料订购加工</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialStock/materialStockDetail/'+ $route.params.id +'/1/1')">原料出入库</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/material/materialDetail/'+ $route.params.id +'/2/1/normal')">辅料订购加工</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialStock/materialStockDetail/'+ $route.params.id +'/2/1')">辅料出入库</span>
                      </div>
                    </span> -->
                  </div>
                </div>
              </template>
              <template v-if="index===1&&showFlag2.showWeave">
                <div class="flexTb">
                  <div class="thead">
                    <span class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn noPad"
                        style="flex:6">
                        <div class="trow">
                          <div class="tcolumn">尺码颜色</div>
                          <div class="tcolumn">下单数量</div>
                          <div class="tcolumn">入库数量</div>
                          <div class="tcolumn">次品数量</div>
                          <div class="tcolumn">出库数量</div>
                          <div class="tcolumn">回库数量</div>
                        </div>
                      </div>
                    </span>
                  </div>
                  <div class="tbody">
                    <span class="trow"
                      v-for="(itemPro,index) in orderDetailInfo.production"
                      :key="index">
                      <div class="tcolumn"
                        style="display:flex;flex-direction:column">
                        <span style="color:#01B48C">{{itemPro.product_code}}</span>
                        <span>({{itemPro.category_info.category_name+'/'+ itemPro.category_info.type_name+'/'+ itemPro.category_info.style_name}})</span>
                      </div>
                      <div class="tcolumn noPad"
                        style="flex:6">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <div class="tcolumn">
                            {{itemChild.size_name}}/{{itemChild.color_name}}
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
                        </div>
                      </div>
                    </span>
                    <!-- <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link"
                        style="margin-left:4px">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/weavingProcessing/weavingDetail/'+ $route.params.id +'/1')">生产织造</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/weavingProcessing/processingDetail/'+ $route.params.id +'/1')">半成品加工</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/receiveDispatch/jysf/'+ $route.params.id)">检验收发</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push(`/productProcess/productProcessDetail/${$route.params.id}`)">成品加工</span>
                      </div>
                    </span> -->
                  </div>
                </div>
              </template>
              <template v-if="index===2&&showFlag2.showOut">
                <div class="flexTb">
                  <div class="thead">
                    <span class="trow">
                      <span class="tcolumn">产品信息</span>
                      <span class="tcolumn flex4 noPad">
                        <span class="trow">
                          <span class="tcolumn">尺码颜色</span>
                          <span class="tcolumn">下单数量</span>
                          <span class="tcolumn">实际装箱数量</span>
                          <span class="tcolumn">装箱差值</span>
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="tbody">
                    <span class="trow"
                      v-for="(item,index) in orderDetailInfo.outStock"
                      :key="index">
                      <span class="tcolumn">{{item.product_code}}<br />{{item.type.join('/')}}</span>
                      <span class="tcolumn noPad flex4">
                        <span class="trow"
                          v-for="(itemSize,indexSize) in item.color_info"
                          :key="indexSize">
                          <span class="tcolumn">{{itemSize.size + '/' + itemSize.color}}</span>
                          <span class="tcolumn">{{itemSize.order_number || 0}}{{item.unit || '件'}}</span>
                          <span class="tcolumn green">{{itemSize.number || 0}}{{item.unit || '件'}}</span>
                          <span :class="['tcolumn',(Number(itemSize.number) || 0) < (Number(itemSize.order_number) || 0) ? 'red' : 'green']">{{$toFixed((Number(itemSize.number) || 0) - (Number(itemSize.order_number) || 0))}}{{item.unit || '件'}}</span>
                        </span>
                      </span>
                    </span>
                    <!-- <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link"
                        style="margin-left:4px">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/packPlan/packPlanCreate/'+ $route.params.id)">装箱计划</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/packPlan/packOrderDetail/'+ $route.params.id)">包装辅料订购</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/packPlan/packStock/'+ $route.params.id)">装箱出库</span>
                      </div>
                    </span> -->
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="isHasPermissions('05-01')">
      <div class="titleCtn">
        <span class="title hasBorder">财务概览</span>
        <span class="btn btnBlue"
          style="float:right;margin-top:12px"
          @click="showPricePopup = true">{{nativeOrder.quotation_id?'查看':'导入'}}报价单</span>
      </div>
      <div class="detailCtn">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">工序项目</span>
              <span class="tcolumn flex30 noPad">
                <span class="trow">
                  <span class="tcolumn">数量</span>
                  <span class="tcolumn">总价</span>
                  <span class="tcolumn">平均价格</span>
                </span>
              </span>
              <span class="tcolumn">操作</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              style="flex-wrap: wrap;"
              v-for="(item,index) in orderDetailInfo.finance.finance"
              :key="index">
              <span class="tcolumn">{{item.name}}</span>
              <span class="tcolumn noPad flex30">
                <span class="trow"
                  v-for="(itemPrice,indexPrice) in item.price_info"
                  :key="indexPrice">
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.number && !itemPrice.name}">{{itemPrice.number ? $toFixed(itemPrice.number) + item.unit : ''}}</span>
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.total_price}">{{itemPrice.total_price ? $toFixed(itemPrice.total_price) + (item.priceUnit ? item.priceUnit : '元') : ''}}
                    <span v-if="itemPrice.total_price && nativeOrder.quotation_id && index!==2 && index!==4  && index!==9 && index!==10"
                      :class="{'green':itemPrice.total_price<=itemPrice.plan_total_price,'red':itemPrice.total_price>itemPrice.plan_total_price}">报价{{itemPrice.plan_total_price}}元,同比{{itemPrice.total_price>itemPrice.plan_total_price?'增长':'下降'}} {{Math.abs($toFixed((itemPrice.total_price-itemPrice.plan_total_price)/itemPrice.plan_total_price*100))}}%</span>
                  </span>
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.pre_price}">{{itemPrice.pre_price ? $toFixed(itemPrice.pre_price) + (item.priceUnit ? item.priceUnit : '元') + '/' + item.unit: ''}}
                    <span v-if="itemPrice.pre_price && nativeOrder.quotation_id &&  index!==1 && index!==0 && index!==3  && index!==2 && index!==4 && index!==9 && index!==10"
                      :class="{'green':itemPrice.pre_price<=itemPrice.plan_pre_price,'red':itemPrice.pre_price>itemPrice.plan_pre_price}">报价{{itemPrice.plan_pre_price}}元,同比{{itemPrice.pre_price>itemPrice.plan_pre_price?'增长':'下降'}} {{Math.abs($toFixed((itemPrice.pre_price-itemPrice.plan_pre_price)/itemPrice.plan_pre_price*100))}}%</span>
                  </span>
                </span>
              </span>
              <span class="tcolumn"
                style="border-right:0">
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="index===0">暂无操作</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.yarnOrder.length>0?showFlag.showYarnOrder = !showFlag.showYarnOrder : activeFinanceTitle = 'yarnOrder'"
                  v-if="item.price_info[0].number && index===1">{{showFlag.showYarnOrder?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===1">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.yarnProcess.length>0?showFlag.showYarnProcess = !showFlag.showYarnProcess : activeFinanceTitle = 'yarnProcess'"
                  v-if="item.price_info[0].number && index===2">{{showFlag.showYarnProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===2">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.materialOrder.length>0?showFlag.showMaterialOrder = !showFlag.showMaterialOrder : activeFinanceTitle = 'materialOrder'"
                  v-if="item.price_info[0].number && index===3">{{showFlag.showMaterialOrder?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===3">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.materialProcess.length>0?showFlag.showMaterialProcess = !showFlag.showMaterialProcess : activeFinanceTitle = 'materialProcess'"
                  v-if="item.price_info[0].number && index===4">{{showFlag.showMaterialProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===4">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.weave.length>0?showFlag.showWeave = !showFlag.showWeave : activeFinanceTitle = 'weave'"
                  v-if="item.price_info[0].number && index===5">{{showFlag.showWeave?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===5">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.process.length>0?showFlag.showProcess = !showFlag.showProcess : activeFinanceTitle = 'process'"
                  v-if="item.price_info[0].number && index===6">{{showFlag.showProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===6">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.productProcess.length>0?showFlag.showProductProcess = !showFlag.showProductProcess : activeFinanceTitle = 'productProcess'"
                  v-if="item.price_info[0].number && index===7">{{showFlag.showProductProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===7">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.packOrder.length>0?showFlag.showPackOrder = !showFlag.showPackOrder : activeFinanceTitle = 'packOrder'"
                  v-if="item.price_info[0].number && index===8">{{showFlag.showPackOrder?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===8">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.replenish.length>0?showFlag.showReplenish = !showFlag.showReplenish : activeFinanceTitle = 'replenish'"
                  v-if="item.price_info[0].number && index===9">{{showFlag.showReplenish?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===9">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.deductPrice.length>0?showFlag.showDeductPrice = !showFlag.showDeductPrice : activeFinanceTitle = 'deductPrice'"
                  v-if="item.price_info[0].total_price && index===10">{{showFlag.showDeductPrice?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].total_price && index===10">暂无数据</div>
              </span>
              <div class="hideTbCtn">
                <template v-if="index===1 && showFlag.showYarnOrder">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">订购公司</span>
                        <span class="tcolumn flex5 noPad">
                          <span class="trow">
                            <span class="tcolumn">原料名称</span>
                            <span class="tcolumn">颜色</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">采购数量</span>
                            <span class="tcolumn">入库数量</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.yarnOrder"
                        :key="index">
                        <span class="tcolumn">
                          {{item.client_name || item.stock_name}}
                        </span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.childrenMergeInfo"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name || itemMa.stock_name}}</span>
                            <span class="tcolumn">{{itemMa.color_code}}</span>
                            <span class="tcolumn green">{{itemMa.price ? itemMa.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.weight ? itemMa.weight + 'kg' : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.reality_push_weight ? itemMa.reality_push_weight + 'kg' : '/'}}</span>
                            <span class="tcolumn">{{itemMa.complete_time}}</span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===2 && showFlag.showYarnProcess">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">加工单位</span>
                        <span class="tcolumn flex6 noPad">
                          <span class="trow">
                            <span class="tcolumn">原料名称</span>
                            <span class="tcolumn">颜色</span>
                            <span class="tcolumn">工序</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">加工数量</span>
                            <span class="tcolumn">入库数量</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                        <span class="tcolumn">总价</span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.yarnProcess"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn noPad flex6">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.material_info"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name}}</span>
                            <span class="tcolumn">{{itemMa.color}}</span>
                            <span class="tcolumn">{{itemMa.process_type}}</span>
                            <span class="tcolumn green">{{itemMa.price ? itemMa.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.number ? itemMa.number + 'kg' : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.reality_push_weight ? itemMa.reality_push_weight + 'kg' : '/'}}</span>
                            <span class="tcolumn">{{itemMa.compiled_time}}</span>
                          </span>
                        </span>
                        <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===3 && showFlag.showMaterialOrder">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">订购公司</span>
                        <span class="tcolumn flex5 noPad">
                          <span class="trow">
                            <span class="tcolumn">原料名称</span>
                            <span class="tcolumn">颜色</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">采购数量</span>
                            <span class="tcolumn">入库数量</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.materialOrder"
                        :key="index">
                        <span class="tcolumn">
                          {{item.client_name || item.stock_name}}
                        </span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.childrenMergeInfo"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name || itemMa.stock_name}}</span>
                            <span class="tcolumn">{{itemMa.color_code}}</span>
                            <span class="tcolumn green">{{itemMa.price ? itemMa.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.weight ? itemMa.weight + `${itemMa.unit || '个'}` : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.reality_push_weight ? itemMa.reality_push_weight + `${itemMa.unit || '个'}` : '/'}}</span>
                            <span class="tcolumn">{{itemMa.complete_time}}</span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===4 && showFlag.showMaterialProcess">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">加工单位</span>
                        <span class="tcolumn flex6 noPad">
                          <span class="trow">
                            <span class="tcolumn">原料名称</span>
                            <span class="tcolumn">颜色</span>
                            <span class="tcolumn">工序</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">加工数量</span>
                            <span class="tcolumn">入库数量</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                        <span class="tcolumn">总价</span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.materialProcess"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn noPad flex6">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.material_info"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name}}</span>
                            <span class="tcolumn">{{itemMa.color}}</span>
                            <span class="tcolumn">{{itemMa.process_type}}</span>
                            <span class="tcolumn green">{{itemMa.price ? itemMa.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.number ? itemMa.number + (itemMa.unit || '个') : '/'}}</span>
                            <span class="tcolumn green">{{itemMa.reality_push_weight ? itemMa.reality_push_weight + (itemMa.unit || '个') : '/'}}</span>
                            <span class="tcolumn">{{itemMa.compiled_time}}</span>
                          </span>
                        </span>
                        <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===5 && showFlag.showWeave">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">织造单位</span>
                        <span class="tcolumn flex6 noPad">
                          <span class="trow">
                            <span class="tcolumn">产品信息</span>
                            <span class="tcolumn">尺码颜色</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">数量</span>
                            <span class="tcolumn">总价</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.weave"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn noPad flex6">
                          <span class="trow"
                            v-for="(itemPro,indexPro) in item.product_info"
                            :key="indexPro">
                            <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro|filterType}}</span>
                            <span class="tcolumn">{{itemPro.size + '/' + itemPro.color}}</span>
                            <span class="tcolumn green">{{itemPro.price ? itemPro.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemPro.number ? itemPro.number + (itemPro.unit || '条') : '/'}}</span>
                            <span class="tcolumn green">{{itemPro.total_price ? $toFixed(itemPro.total_price) + '元' : '/'}}</span>
                            <span class="tcolumn">{{itemPro.compiled_time}}</span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===6 && showFlag.showProcess">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">加工单位</span>
                        <span class="tcolumn flex7 noPad">
                          <span class="trow">
                            <span class="tcolumn">产品信息</span>
                            <span class="tcolumn">尺码颜色</span>
                            <span class="tcolumn">工序</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">数量</span>
                            <span class="tcolumn">总价</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.process"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn noPad flex7">
                          <span class="trow"
                            v-for="(itemPro,indexPro) in item.product_info"
                            :key="indexPro">
                            <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro|filterType}}</span>
                            <span class="tcolumn">{{itemPro.size + '/' + itemPro.color}}</span>
                            <span class="tcolumn">{{itemPro.process_type}}</span>
                            <span class="tcolumn green">{{itemPro.price ? itemPro.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemPro.number ? itemPro.number + (itemPro.unit || '条') : '/'}}</span>
                            <span class="tcolumn green">{{itemPro.total_price ? $toFixed(itemPro.total_price) + '元' : '/'}}</span>
                            <span class="tcolumn">{{itemPro.compiled_time}}</span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===7 && showFlag.showProductProcess">
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
                                <div class="tcolumn">检验数量</div>
                                <div class="tcolumn">加工价格</div>
                                <div class="tcolumn">次品数量</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.productProcess"
                        :key="index">
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
                                  style="color:#01b48c">{{itemSon.price}}元</div>
                                <div class="tcolumn"
                                  :style="{'color':itemSon.count?'#F5222D':'#01b48c'}">{{itemSon.count || 0}}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===8 && showFlag.showPackOrder">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">订购单位</span>
                        <span class="tcolumn flex5 noPad">
                          <span class="trow">
                            <span class="tcolumn">包装辅料</span>
                            <span class="tcolumn">单价</span>
                            <span class="tcolumn">订购数量</span>
                            <span class="tcolumn">总价</span>
                            <span class="tcolumn">完成时间</span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.packOrder"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemPack,indexPack) in item.pack_info"
                            :key="indexPack">
                            <span class="tcolumn">{{itemPack.pack_name}}</span>
                            <span class="tcolumn green">{{itemPack.price ? itemPack.price + '元' : '/'}}</span>
                            <span class="tcolumn green">{{itemPack.order_number ? itemPack.order_number + (itemPack.unit || '个') : '/'}}</span>
                            <span class="tcolumn green">{{itemPack.total_price ? $toFixed(Number(itemPack.total_price) || 0 ) + '元' : '/'}}</span>
                            <span class="tcolumn">{{$getTime(itemPack.compiled_time)}}</span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===9 && showFlag.showReplenish">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">补纱单位</span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow">
                            <span class="tcolumn">纱线名称</span>
                            <span class="tcolumn">纱线颜色</span>
                            <span class="tcolumn">补纱数量</span>
                            <span class="tcolumn">承担单位</span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.replenish"
                        :key="index">
                        <span class="tcolumn">{{item.replenish_name}}</span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemOut,indexOut) in item.childrenMergeInfo"
                            :key='indexOut'>
                            <span class="tcolumn">{{itemOut.material_name}}</span>
                            <span class="tcolumn green">{{itemOut.material_color}}</span>
                            <span class="tcolumn green">{{itemOut.need_weight}}</span>
                            <span class="tcolumn green">
                              <span v-for="(itemChild,indexChild) in itemOut.client_info"
                                :key="indexChild">{{itemChild.client_name}}({{itemChild.percent}}元)</span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="index===10 && showFlag.showDeductPrice">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">扣款单位</span>
                        <span class="tcolumn">扣款金额</span>
                        <span class="tcolumn">扣款原因</span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in orderDetailInfo.finance.deductPrice"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn">{{item.deduct_price}}元</span>
                        <span class="tcolumn">{{item.reason_text}}</span>
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showCanclePopup">
      <div class="main"
        style="width:600px">
        <div class="title">
          <span class="text">取消订单{{showCanclePopup|filterTitle}}</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="content steps">
          <el-steps :active="showCanclePopup-1"
            finish-status="success"
            align-center>
            <el-step title="原料结余入库"></el-step>
            <el-step title="辅料结余入库"></el-step>
            <el-step title="包装结余入库"></el-step>
            <el-step title="产品结余入库"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div class="content"
          v-if="showCanclePopup === 1">
          <div class="row">
            <span class="label">入库仓库：</span>
            <span class="info">
              <el-select v-model="yarnStockId"
                placeholder="请选择入库仓库">
                <el-option v-for="item in stockList.filter(item=>item.type === 1)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemMa,indexMa) in cancleYarn">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">原料信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <!-- <zh-input v-model="itemMa.material_name"
                  placeholder="请填写原料"
                  class="elInput" /> -->
                <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchYarn"
                  placeholder="请填写原料"></el-autocomplete>
              </span>
              <span class="editBtn blue"
                v-if="indexMa === 0"
                @click="addItem(cancleYarn,'yarn')">添加</span>
              <span class="editBtn red"
                v-if="indexMa !== 0"
                @click="deleteItem(cancleYarn,indexMa)">删除</span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">属性/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.color"
                  placeholder="属性"
                  class="elInput" />
                <zh-input v-model="itemMa.color_code"
                  placeholder="色号"
                  class="elInput" />
                <zh-input v-model="itemMa.vat_code"
                  placeholder="批/缸号"
                  class="elInput" />
                <zh-input v-model="itemMa.weight"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">kg</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content"
          v-if="showCanclePopup === 2">
          <div class="row">
            <span class="label">入库仓库：</span>
            <span class="info">
              <el-select v-model="materialStockId"
                placeholder="请选择入库仓库">
                <el-option v-for="item in stockList.filter(item=>item.type === 2)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemMa,indexMa) in cancleMaterial">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">辅料信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchMaterial"
                  placeholder="请填写原料"></el-autocomplete>
              </span>
              <span class="editBtn blue"
                v-if="indexMa === 0"
                @click="addItem(cancleMaterial,'material')">添加</span>
              <span class="editBtn red"
                v-if="indexMa !== 0"
                @click="deleteItem(cancleMaterial,indexMa)">删除</span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">属性/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.color"
                  placeholder="属性"
                  class="elInput" />
                <zh-input v-model="itemMa.weight"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">{{(itemMa.unit || '件')}}</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content"
          v-if="showCanclePopup === 3">
          <div class="row">
            <span class="label">入库仓库：</span>
            <span class="info">
              <el-select v-model="packStockId"
                placeholder="请选择入库仓库">
                <el-option v-for="item in stockList.filter(item=>item.type === 3)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemMa,indexMa) in canclePack">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">包装信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchPack"
                  class="elInput"
                  placeholder="请填写包装"></el-autocomplete>
                <zh-input v-model="itemMa.size"
                  placeholder="规格"
                  class="elInput" />
              </span>
              <span class="editBtn blue"
                v-if="indexMa === 0"
                @click="addItem(canclePack,'pack')">添加</span>
              <span class="editBtn red"
                v-if="indexMa !== 0"
                @click="deleteItem(canclePack,indexMa)">删除</span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">属性/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.attribute"
                  placeholder="属性"
                  class="elInput" />
                <zh-input v-model="itemMa.number"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">件</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content"
          v-if="showCanclePopup === 4">
          <div class="row">
            <span class="label">入库仓库：</span>
            <span class="info">
              <el-select v-model="productStockId"
                placeholder="请选择入库仓库">
                <el-option v-for="item in stockList.filter(item=>item.type === 4)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemMa,indexMa) in canCleProduct">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">产品信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <!-- <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchPack"
                  class="elInput"
                  placeholder="请填写包装"></el-autocomplete> -->
                <zh-input v-model="itemMa.product_code"
                  placeholder="产品"
                  class="elInput"
                  disabled />
                <zh-input v-model="itemMa.size"
                  placeholder="尺码"
                  disabled
                  class="elInput" />
              </span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">颜色/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.color"
                  placeholder="颜色"
                  disabled
                  class="elInput" />
                <zh-input v-model="itemMa.number"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">件</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content center"
          v-if="showCanclePopup === 5 || showCanclePopup === 6">
          <!-- <div class="row"> -->
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为取消，是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
          <!-- </div> -->
        </div>
        <div class="opr"
          :style="{'justify-content': showCanclePopup > 4 ? 'flex-end' : 'space-between'}">
          <div class="btn btnGray"
            @click="clearData(showCanclePopup)"
            v-if='(showCanclePopup === 1 || showCanclePopup === 2 || showCanclePopup === 3 || showCanclePopup === 4)'>清空该页数据</div>
          <div style="display:flex">
            <div class="btn btnGray"
              v-if="showCanclePopup === 1 && isCommit"
              @click="closePopup">取消</div>
            <div class="btn btnGray"
              v-if="showCanclePopup<5"
              @click="jumpGoStock">跳过结余</div>
            <div class="btn btnGray"
              v-if="showCanclePopup > 1 && (isCommit === 'before' || isCommit === 'error')"
              @click="showCanclePopup--">上一步</div>
            <div class="btn btnBlue"
              v-if="showCanclePopup < 5"
              @click="showCanclePopup++">下一步</div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 5 && isCommit === 'before'"
              @click="changeOrderStatus('cancle')">确定</div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 5 && isCommit === 'error'"
              @click="changeOrderStatus('cancle')">重试<em class="el-icon-refresh-left"></em></div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 5  && isCommit === 'commit'">提交中<em class="el-icon-loading"></em></div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 6 && isCommit === 'compiled'"
              @click="closePopup">完成</div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showOkPopup">
      <div class="main"
        style="width:600px">
        <div class="title">
          <span class="text">确认完成</span>
          <span class="el-icon-close"
            @click="showOkPopup = false,isCommit = 'before'"></span>
        </div>
        <div class="content steps">
          <el-steps :active="showOkPopup-1"
            finish-status="success"
            align-center>
            <el-step title="实际装箱出库"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div class="content"
          v-if="showOkPopup === 1">
          <template v-for="(itemP,indexP) in actualProductInfo">
            <div class="row"
              :key="'product-' + indexP">
              <span class="label">产品信息：</span>
              <span class="info rowInfo">
                <el-select v-model="itemP.product_id"
                  disabled
                  placeholder="请选择产品">
                  <el-option v-for="item in itemP.productList"
                    :key="item.product_id"
                    :label="item.product_code"
                    :value="item.product_id">
                  </el-option>
                </el-select>
                <el-cascader v-model="itemP.sizeColor"
                  disabled
                  style="margin-left:16px"
                  :options="itemP.sizeColorArr"
                  :props="{ expandTrigger: 'hover' }"></el-cascader>
              </span>
            </div>
            <div class="row"
              :key='"number-" + indexP'>
              <span class="label">数量：</span>
              <span class="info rowInfo">
                <zh-input v-model="itemP.number"
                  disabled
                  placeholder="计划数量">
                  <template slot="append">{{itemP.unit}}</template>
                </zh-input>
                <zh-input v-model="itemP.actual_number"
                  style="margin-left:16px"
                  placeholder="实际装箱数量"
                  type='number'>
                  <template slot="append">{{itemP.unit}}</template>
                </zh-input>
              </span>
            </div>
          </template>
          <template v-for="(itemMa,indexMa) in cancleYarn">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">原料信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <!-- <zh-input v-model="itemMa.material_name"
                  placeholder="请填写原料"
                  class="elInput" /> -->
                <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchYarn"
                  placeholder="请填写原料"></el-autocomplete>
              </span>
              <span class="editBtn blue"
                v-if="indexMa === 0"
                @click="addItem(cancleYarn,'yarn')">添加</span>
              <span class="editBtn red"
                v-if="indexMa !== 0"
                @click="deleteItem(cancleYarn,indexMa)">删除</span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">属性/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.color"
                  placeholder="属性"
                  class="elInput" />
                <zh-input v-model="itemMa.weight"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">kg</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content center"
          v-if="showOkPopup === 2 || showOkPopup === 3">
          <!-- <div class="row"> -->
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为已完成，是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
          <!-- </div> -->
        </div>
        <div class="opr"
          style="justify-content:space-between">
          <div style="display:flex">
            <div class="btn btnWhiteBlue"
              @click="$openUrl(`/packPlan/packPlanCreate/${$route.params.id}`)">查看装箱计划</div>
          </div>
          <div style="display:flex">
            <div class="btn btnGray"
              v-if="showOkPopup === 1 && isCommit"
              @click="showOkPopup = false,isCommit = 'before'">取消</div>
            <div class="btn btnGray"
              v-if="showOkPopup > 1 && (isCommit === 'before' || isCommit === 'error')"
              @click="showOkPopup--">上一步</div>
            <div class="btn btnBlue"
              v-if="showOkPopup < 2"
              @click="showOkPopup++">下一步</div>
            <div class="btn btnBlue"
              v-if="showOkPopup === 2 && isCommit === 'before'"
              @click="changeOrderStatus('okSubmit')">确定</div>
            <div class="btn btnBlue"
              v-if="showOkPopup === 2 && isCommit === 'error'"
              @click="changeOrderStatus('okSubmit')">重试<em class="el-icon-refresh-left"></em></div>
            <div class="btn btnBlue"
              v-if="showOkPopup === 2  && isCommit === 'commit'">提交中<em class="el-icon-loading"></em></div>
            <div class="btn btnBlue"
              v-if="showOkPopup === 3 && isCommit === 'compiled'"
              @click="showOkPopup = false,isCommit = 'before'">完成</div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPricePopup">
      <div class="main"
        style="width:1000px">
        <div class="title">
          <span class="text">绑定报价单</span>
          <span class="el-icon-close"
            @click="showPricePopup = false"></span>
        </div>
        <div class="content">
          <div class="row">
            <div class="tagCtn">
              <div class="tag"
                v-if="productList.length>1"
                :class="{'active':lookAllFlag}"
                @click="lookAll">所有产品</div>
              <div class="tag"
                :class="{'active':item.checked}"
                v-for="item in productList"
                :key="item.product_id"
                @click="checkProduct(item.product_id,item.product_code)">{{item.product_code}}</div>
            </div>
          </div>
          <template v-if="!updatePriceFlag && (priceShowTable.assist_info.length>0 || priceShowTable.material_info.length>0 || priceShowTable.pack_material_info.length>0 || priceShowTable.production_info.length>0 || priceShowTable.semi_product_info.length>0 || priceShowTable.weave_info.length>0)">
            <div class="flexTb"
              style="margin:20px 0">
              <div class="thead">
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;">报价信息</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow">
                      <span class="tcolumn">产品</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow">
                          <span class="tcolumn">名称</span>
                          <span class="tcolumn">克重/数量</span>
                          <span class="tcolumn">单价</span>
                          <span class="tcolumn">损耗</span>
                          <span class="tcolumn">其他</span>
                          <span class="tcolumn">总价</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </div>
              <div class="tbody">
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;background:#FAFAFA">原料信息</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow"
                      v-for="itemPro in priceShowTable.material_info"
                      :key="itemPro.product_code + 'material_info'">
                      <span class="tcolumn">{{itemPro.product_code || '/'}}</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <span class="tcolumn">{{itemChild.name||'/'}}</span>
                          <span class="tcolumn">{{itemChild.weight ? itemChild.weight + (itemChild.unit || 'g') : '/'}}</span>
                          <span class="tcolumn">{{itemChild.price ? itemChild.price + '元' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.prop ? itemChild.prop + '%' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.other ? itemChild.other : '/'}}</span>
                          <span class="tcolumn">{{itemChild.total_price ? itemChild.total_price + '元' : '0元'}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;background:#FAFAFA">辅料信息</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow"
                      v-for="itemPro in priceShowTable.assist_info"
                      :key="itemPro.product_code + 'material_info'">
                      <span class="tcolumn">{{itemPro.product_code || '/'}}</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <span class="tcolumn">{{itemChild.name||'/'}}</span>
                          <span class="tcolumn">{{itemChild.weight ? itemChild.weight + (itemChild.unit || 'g') : '/'}}</span>
                          <span class="tcolumn">{{itemChild.price ? itemChild.price + '元' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.prop ? itemChild.prop + '%' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.other ? itemChild.other : '/'}}</span>
                          <span class="tcolumn">{{itemChild.total_price ? itemChild.total_price + '元' : '0元'}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;background:#FAFAFA">织造信息</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow"
                      v-for="itemPro in priceShowTable.weave_info"
                      :key="itemPro.product_code + 'material_info'">
                      <span class="tcolumn">{{itemPro.product_code || '/'}}</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <span class="tcolumn">{{itemChild.name}}</span>
                          <span class="tcolumn">{{itemChild.number ? itemChild.number + (itemChild.unit || '') : '/'}}</span>
                          <span class="tcolumn">{{itemChild.price ? itemChild.price + '元' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.sunhao ? itemChild.sunhao + '%' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.other ? itemChild.other : '/'}}</span>
                          <span class="tcolumn">{{itemChild.total_price ? itemChild.total_price + '元' : '0元'}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;background:#FAFAFA">半成品加工</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow"
                      v-for="itemPro in priceShowTable.semi_product_info"
                      :key="itemPro.product_code + 'material_info'">
                      <span class="tcolumn">{{itemPro.product_code || '/'}}</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <span class="tcolumn">{{itemChild.name.join?itemChild.name.join('/'):itemChild.name}}</span>
                          <span class="tcolumn">{{itemChild.number ? itemChild.number + (itemChild.unit || '') : '/'}}</span>
                          <span class="tcolumn">{{itemChild.price ? itemChild.price + '元' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.sunhao ? itemChild.sunhao + '%' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.other ? itemChild.other : '/'}}</span>
                          <span class="tcolumn">{{itemChild.total_price ? itemChild.total_price + '元' : '0元'}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;background:#FAFAFA">成品加工</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow"
                      v-for="itemPro in priceShowTable.production_info"
                      :key="itemPro.product_code + 'material_info'">
                      <span class="tcolumn">{{itemPro.product_code || '/'}}</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <span class="tcolumn">{{itemChild.name.join?itemChild.name.join('/'):itemChild.name}}</span>
                          <span class="tcolumn">{{itemChild.number ? itemChild.number + (itemChild.unit || '') : '/'}}</span>
                          <span class="tcolumn">{{itemChild.price ? itemChild.price + '元' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.sunhao ? itemChild.sunhao + '%' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.other ? itemChild.other : '/'}}</span>
                          <span class="tcolumn">{{itemChild.total_price ? itemChild.total_price + '元' : '0元'}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <span class="trow">
                  <span class="tcolumn"
                    style="max-width:70px;background:#FAFAFA">包装辅料</span>
                  <span class="tcolumn noPad"
                    style="flex:7">
                    <span class="trow"
                      v-for="itemPro in priceShowTable.pack_material_info"
                      :key="itemPro.product_code + 'material_info'">
                      <span class="tcolumn">{{itemPro.product_code || '/'}}</span>
                      <span class="tcolumn noPad"
                        style="flex:6">
                        <span class="trow"
                          v-for="(itemChild,indexChild) in itemPro.childrenMergeInfo"
                          :key="indexChild">
                          <span class="tcolumn">{{itemChild.name}}</span>
                          <span class="tcolumn">{{itemChild.number ? itemChild.number + (itemChild.unit || '') : '/'}}</span>
                          <span class="tcolumn">{{itemChild.price ? itemChild.price + '元' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.sunhao ? itemChild.sunhao + '%' : '/'}}</span>
                          <span class="tcolumn">{{itemChild.other ? itemChild.other : '/'}}</span>
                          <span class="tcolumn">{{itemChild.total_price ? itemChild.total_price + '元' : '0元'}}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row">
              <div style="font-size:14px;background:#eee;padding:8px;broder-radius:4px;width:100%">
                <div>
                  <span v-if="lookAllFlag&&productList.length>1">注意：给订单绑定报价单会覆盖原有的报价单，如果每个产品都需要绑定独立报价单，请选中产品后进行绑定操作。</span>
                  <span v-if="!lookAllFlag">正在给产品绑定报价单。</span>
                  不知道报价单编号?前往<span style="color:#1a95ff;cursor:pointer"
                    @click="openPrice()">报价单列表</span>筛选。
                </div>
              </div>
            </div>
            <div class="row">
              <div class="label">搜索报价单：</div>
              <div class="info">
                <el-autocomplete v-model="priceCode"
                  :fetch-suggestions="getPriceList"
                  placeholder="请输入报价单编号搜索"
                  :trigger-on-focus="false"
                  @select="getPriceInfo($event.id)">
                </el-autocomplete>
              </div>
            </div>
            <div class="row">
              <div class="label">报价编号：</div>
              <div class="info text">{{priceInfo.price_code}}</div>
            </div>
            <div class="row">
              <div class="label">报价名称：</div>
              <div class="info text">{{priceInfo.price_name||'无'}}</div>
            </div>
            <div class="row">
              <div class="label">报价总价：</div>
              <div class="info text"
                style="color:#1A95FF">{{priceInfo.price||'无'}}</div>
            </div>
            <div class="row">
              <div class="label">外贸公司：</div>
              <div class="info text">{{priceInfo.client_name}}</div>
            </div>
            <div class="row">
              <div class="label">图片信息：</div>
              <span class="info imgCtn"
                v-if="priceInfo.imgArr.length>0">
                <el-image style="width: 80px; height: 80px"
                  :src="priceInfo.imgArr[0]"
                  :preview-src-list="priceInfo.imgArr">
                </el-image>
              </span>
              <span class="info text"
                v-else>暂无图片信息</span>
            </div>
          </template>
        </div>
        <div class="opr">
          <div style="display:flex">
            <div class="btn btnGray"
              @click="canclePrice">取消</div>
          </div>
          <div style="display:flex"
            v-if="updatePriceFlag || !(priceShowTable.assist_info.length>0 || priceShowTable.material_info.length>0 || priceShowTable.pack_material_info.length>0 || priceShowTable.production_info.length>0 || priceShowTable.semi_product_info.length>0 || priceShowTable.weave_info.length>0)">
            <div class="btn btnBlue"
              @click="bindPrice">确认绑定</div>
          </div>
          <div style="display:flex"
            v-if="!updatePriceFlag && (priceShowTable.assist_info.length>0 || priceShowTable.material_info.length>0 || priceShowTable.pack_material_info.length>0 || priceShowTable.production_info.length>0 || priceShowTable.semi_product_info.length>0 || priceShowTable.weave_info.length>0)">
            <div class="btn btnOrange"
              @click="updatePriceFlag = true">重新绑定</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$openUrl('/orderBatchTable?id=' + $route.params.id)">打印</div>
          <div class="btn btnBlue"
            @click="$router.push('/order/orderCreate?orderId=' + $route.params.id)">复制此订单</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showHistoryProgFlag">
      <div class="main"
        style="width:800px">
        <div class="title">
          <span class="text">查看历史进度</span>
          <span class="el-icon-close"
            @click="showHistoryProgFlag = false"></span>
        </div>
        <div class="content"
          style="max-height:500px">
          <div class="block"
            v-for="(itemLog,indexLog) in historyProgData || []"
            :key="indexLog">
            <div class="block_item">
              <span class="block_label">订单批次：</span>
              <span class="block_text">{{`第${itemLog.number}批`}}</span>
            </div>
            <div class="block_item">
              <span class="block_label">进度描述：</span>
              <span class="block_text">{{itemLog.description || '暂无'}}</span>
            </div>
            <div class="block_item">
              <span class="block_label">创建时间：</span>
              <span class="block_text">{{itemLog.created_at}}</span>
            </div>
            <div class="block_item">
              <span class="block_label">创建人：</span>
              <span class="block_text">{{itemLog.user.name}}</span>
            </div>
            <div class="block_item">
              <span class="block_label">通知人员:</span>
              <span class="block_text">{{itemLog.users|filterUsers}}</span>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnBlue"
            @click="showHistoryProgFlag = false">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { moneyArr, isHasPermissions } from '@/assets/js/dictionary.js'
import { orderBatch, price, order, materialPlan, materialStock, weave, processing, receiveDispatch, inspection, packPlan, finance, materialManage, materialProcess, yarn, material, packag, stock, warnSetting, replenish, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      canSeePriceFlag: false,
      orderInfo: {
        order_code: '',
        batch_info: [],
        order_time: ''
      },
      productList: [],
      timeProgressInfo: [],
      productProgInfo: [],
      orderDetailInfo: {
        'material': [],
        'production': [],
        'inspection': [],
        'outStock': [],
        'finance': {
          title: [
            {
              name: '财务总览',
              key: 'finance'
            }, {
              name: '原料采购',
              key: 'yarnOrder'
            }, {
              name: '原料加工',
              key: 'yarnProcess'
            }, {
              name: '辅料订购',
              key: 'materialOrder'
            }, {
              name: '辅料加工',
              key: 'materialProcess'
            }, {
              name: '生产织造',
              key: 'weave'
            }, {
              name: '半成品加工',
              key: 'process'
            }, {
              name: '包装辅料订购',
              key: 'packOrder'
            }, {
              name: '出库运输',
              key: 'outStock'
            }, {
              name: '补纱信息',
              key: 'replenish'
            }, {
              name: '扣款信息',
              key: 'deductPrice'
            }
          ],
          finance: [],
          yarnOrder: [],
          yarnProcess: [],
          materialOrder: [],
          materialProcess: [],
          weave: [],
          process: [],
          packOrder: [],
          outStock: [],
          replenish: [],
          deductPrice: [],
          productProcess: []
        }
      },
      activeDetailTitle: '',
      activeFinanceTitle: '',
      product_order_total_number: '',
      showCanclePopup: false,
      cancleYarn: [],
      cancleMaterial: [],
      canclePack: [],
      canCleProduct: [],
      yarnList: [],
      materialList: [],
      packList: [],
      isCommit: 'before',
      stockList: [],
      yarnStockId: '',
      materialStockId: '',
      packStockId: '',
      productStockId: '',
      unitArr: moneyArr,
      // 预警数据
      timeData: [{ percent: 0.25, name: '织造' }, { percent: 0.15, name: '织造' }, { percent: 0.6, name: '织造' }],
      isOpenWarn: false,
      warnType: '',
      warnList: [],
      warnData: {
        isOpenWarn: false,
        startTime: this.$getTime(),
        endTime: this.$getTime(),
        warnArr: []
      },
      showFlag: {
        showYarnOrder: false,
        showYarnProcess: false,
        showMaterialOrder: false,
        showMaterialProcess: false,
        showWeave: false,
        showProcess: false,
        showPackOrder: false,
        showOutStock: false,
        showReplenish: false,
        showDeductPrice: false,
        showProductProcess: false
      },
      showFlag2: {
        showMaterial: false,
        showWeave: false,
        showIns: false,
        showOut: false
      },
      // 确认完成修改数据
      showOkPopup: false,
      actualProductInfo: [],
      // 文件更新模块
      showUpdateFilePopup: false,
      showPricePopup: false,
      lookAllFlag: false,
      updatePriceFlag: false,
      checkWhichProduct: '',
      priceTable: {},
      priceShowTable: {
        material_info: [],
        production_info: [],
        semi_product_info: [],
        assist_info: [],
        weave_info: [],
        pack_material_info: []
      },
      priceInfo: {
        price_code: '待选择',
        price_name: '待选择',
        client_name: '待选择',
        price: '待选择',
        imgArr: []
      },
      nativePriceInfo: {}, // 报价单重新提交一份给后台
      price_sts: {
        materialOrderPricePlan: 0,
        materialOrderTotalPlan: 0,
        materialProcessPricePlan: 0,
        materialProcessTotalPlan: 0,
        weavePricePlan: 0,
        weaveTotalPlan: 0,
        semiProcessPricePlan: 0,
        semiProcessTotalPlan: 0,
        finishedProcessPricePlan: 0,
        finishedProcessTotalPlan: 0,
        packPricePlan: 0,
        packTotalPlan: 0
      },
      priceCode: '',
      productAllNumber: 0,
      nativeOrder: {
        quotation_id: null
      },
      // 产前确认信息
      compareInfo: [
        {
          label: '原料确认',
          status: false
        }, {
          label: '辅料确认',
          status: false
        }, {
          label: '半成品确认',
          status: false
        }, {
          label: '成品确认',
          status: false
        }
      ],
      showHistoryProgFlag: false,
      historyProgData: null
    }
  },
  methods: {
    showHistoryProg () {
      if (!this.historyProgData || this.historyProgData.length === 0) {
        orderBatch.changeProgLog({
          order_id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            this.historyProgData = res.data.data
            if (res.data.data.length === 0) {
              this.$message.warning('暂无历史进度')
              return
            }
            this.showHistoryProgFlag = true
          }
        })
      } else {
        this.showHistoryProgFlag = true
      }
    },
    isHasPermissions,
    // 取消绑定初始化数据
    canclePrice () {
      this.showPricePopup = false
      this.updatePriceFlag = false
      if (this.nativeOrder.quotation_id) {
        this.lookAll()
      }
    },
    lookAll () {
      this.lookAllFlag = true
      this.productList.forEach((item) => { item.checked = false })
      this.priceShowTable = this.priceTable
    },
    // 报价单选择产品
    checkProduct (id, code) {
      this.lookAllFlag = false
      this.productList.forEach((item) => { item.checked = false })
      this.productList.find((item) => item.product_id === id).checked = true
      this.checkWhichProduct = code
      this.$forceUpdate()
      this.priceShowTable = {
        material_info: this.priceTable.material_info.filter((item) => item.product_code === code),
        production_info: this.priceTable.production_info.filter((item) => item.product_code === code),
        semi_product_info: this.priceTable.semi_product_info.filter((item) => item.product_code === code),
        assist_info: this.priceTable.assist_info.filter((item) => item.product_code === code),
        weave_info: this.priceTable.weave_info.filter((item) => item.product_code === code),
        pack_material_info: this.priceTable.pack_material_info.filter((item) => item.product_code === code)
      }
      console.log(this.priceShowTable)
      this.updatePriceFlag = false
    },
    // 处理产前确认信息
    getConfirmBeforeProductionInfo (orderInfo) {
      let materialPush = orderInfo.material_push_confirm && JSON.parse(orderInfo.material_push_confirm)
      let assignMaterialPush = orderInfo.assist_material_push_confirm && JSON.parse(orderInfo.assist_material_push_confirm)
      let productInspection = orderInfo.product_inspection_confirm && JSON.parse(orderInfo.product_inspection_confirm)
      let productProduction = orderInfo.product_production_confirm && JSON.parse(orderInfo.product_production_confirm)
      this.compareInfo = [
        {
          label: '原料确认',
          status: materialPush && (materialPush.compareInfo.some(item => !item.status) ? 'orange' : 'green'),
          nameIndex: 0,
          ...(materialPush || {})
        }, {
          label: '辅料确认',
          status: assignMaterialPush && (assignMaterialPush.compareInfo.some(item => !item.status) ? 'orange' : 'green'),
          nameIndex: 1,
          ...(assignMaterialPush || {})
        }, {
          label: '半成品确认',
          status: productInspection && (productInspection.compareInfo.some(item => !item.status) ? 'orange' : 'green'),
          ...(productInspection || {})
        }, {
          label: '成品确认',
          status: productProduction && (productProduction.compareInfo.some(item => !item.status) ? 'orange' : 'green'),
          ...(productProduction || {})
        }
      ]
    },
    // 绑定报价单
    bindPrice () {
      if (!this.priceInfo.id) {
        this.$message.error('请先选择报价单')
        return
      }
      this.loading = true
      this.nativePriceInfo.id = this.nativeOrder.quotation_id || null
      this.nativePriceInfo.order_id = this.$route.params.id
      this.nativePriceInfo.product_info = JSON.stringify([])
      // 如果是订单绑定的，那就覆盖掉原有的，或者没有的
      if (this.lookAllFlag) {
        this.nativePriceInfo.material_info = JSON.stringify(JSON.parse(this.nativePriceInfo.material_info).map((item) => {
          item.product_code = '所有产品'
          return item
        }))
        this.nativePriceInfo.assist_info = JSON.stringify(JSON.parse(this.nativePriceInfo.assist_info).map((item) => {
          item.product_code = '所有产品'
          return item
        }))
        this.nativePriceInfo.production_info = JSON.stringify(JSON.parse(this.nativePriceInfo.production_info).map((item) => {
          item.product_code = '所有产品'
          return item
        }))
        this.nativePriceInfo.semi_product_info = JSON.stringify(JSON.parse(this.nativePriceInfo.semi_product_info).map((item) => {
          item.product_code = '所有产品'
          return item
        }))
        this.nativePriceInfo.weave_info = JSON.stringify(JSON.parse(this.nativePriceInfo.weave_info).map((item) => {
          item.product_code = '所有产品'
          return item
        }))
        this.nativePriceInfo.pack_material_info = JSON.stringify(JSON.parse(this.nativePriceInfo.pack_material_info).map((item) => {
          item.product_code = '所有产品'
          return item
        }))
        price.create(this.nativePriceInfo).then((res) => {
          order.bindQuotation({
            order_id: this.$route.params.id,
            quotation_id: res.data.data.id
          }).then(res => {
            if (res.data.status) {
              this.$message.success('绑定成功')
              this.showPricePopup = false
              this.updatePriceFlag = false
              this.init()
            }
          })
        })
      } else {
        // 如果是产品绑定的
        // 确认一下是不是绑定订单的，如果是绑定订单的，提醒他会覆盖
        if (this.nativeOrder.quotation_id && this.priceTable.material_info.find((item) => item.product_code === '所有产品')) {
          this.$confirm('该订单已经绑定过订单报价单，继续导入产品报价单会覆盖原有订单报价单，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.nativePriceInfo.material_info = JSON.stringify(JSON.parse(this.nativePriceInfo.material_info).map((item) => {
              item.product_code = this.checkWhichProduct
              return item
            }))
            this.nativePriceInfo.assist_info = JSON.stringify(JSON.parse(this.nativePriceInfo.assist_info).map((item) => {
              item.product_code = this.checkWhichProduct
              return item
            }))
            this.nativePriceInfo.production_info = JSON.stringify(JSON.parse(this.nativePriceInfo.production_info).map((item) => {
              item.product_code = this.checkWhichProduct
              return item
            }))
            this.nativePriceInfo.semi_product_info = JSON.stringify(JSON.parse(this.nativePriceInfo.semi_product_info).map((item) => {
              item.product_code = this.checkWhichProduct
              return item
            }))
            this.nativePriceInfo.weave_info = JSON.stringify(JSON.parse(this.nativePriceInfo.weave_info).map((item) => {
              item.product_code = this.checkWhichProduct
              return item
            }))
            this.nativePriceInfo.pack_material_info = JSON.stringify(JSON.parse(this.nativePriceInfo.pack_material_info).map((item) => {
              item.product_code = this.checkWhichProduct
              return item
            }))
            price.create(this.nativePriceInfo).then((res) => {
              order.bindQuotation({
                order_id: this.$route.params.id,
                quotation_id: res.data.data.id
              }).then(res => {
                if (res.data.status) {
                  this.$message.success('绑定成功')
                  this.showPricePopup = false
                  this.updatePriceFlag = false
                  this.init()
                }
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消绑定'
            })
          })
        } else {
          this.priceTable.material_info = this.priceTable.material_info || []
          this.priceTable.assist_info = this.priceTable.assist_info || []
          this.priceTable.production_info = this.priceTable.production_info || []
          this.priceTable.semi_product_info = this.priceTable.semi_product_info || []
          this.priceTable.weave_info = this.priceTable.weave_info || []
          this.priceTable.pack_material_info = this.priceTable.pack_material_info || []
          console.log(this.priceTable.material_info.filter((item) => item.product_code !== this.checkWhichProduct))
          this.nativePriceInfo.material_info = JSON.stringify(this.myFlatten(this.priceTable.material_info.filter((item) => item.product_code !== this.checkWhichProduct)).concat(JSON.parse(this.nativePriceInfo.material_info).map((item) => {
            item.product_code = this.checkWhichProduct
            return item
          })))
          this.nativePriceInfo.assist_info = JSON.stringify(this.myFlatten(this.priceTable.assist_info.filter((item) => item.product_code !== this.checkWhichProduct)).concat(JSON.parse(this.nativePriceInfo.assist_info).map((item) => {
            item.product_code = this.checkWhichProduct
            return item
          })))
          this.nativePriceInfo.production_info = JSON.stringify(this.myFlatten(this.priceTable.production_info.filter((item) => item.product_code !== this.checkWhichProduct)).concat(JSON.parse(this.nativePriceInfo.production_info).map((item) => {
            item.product_code = this.checkWhichProduct
            return item
          })))
          this.nativePriceInfo.semi_product_info = JSON.stringify(this.myFlatten(this.priceTable.semi_product_info.filter((item) => item.product_code !== this.checkWhichProduct)).concat(JSON.parse(this.nativePriceInfo.semi_product_info).map((item) => {
            item.product_code = this.checkWhichProduct
            return item
          })))
          this.nativePriceInfo.weave_info = JSON.stringify(this.myFlatten(this.priceTable.weave_info.filter((item) => item.product_code !== this.checkWhichProduct)).concat(JSON.parse(this.nativePriceInfo.weave_info).map((item) => {
            item.product_code = this.checkWhichProduct
            return item
          })))
          this.nativePriceInfo.pack_material_info = JSON.stringify(this.myFlatten(this.priceTable.pack_material_info.filter((item) => item.product_code !== this.checkWhichProduct)).concat(JSON.parse(this.nativePriceInfo.pack_material_info).map((item) => {
            item.product_code = this.checkWhichProduct
            return item
          })))
          price.create(this.nativePriceInfo).then((res) => {
            order.bindQuotation({
              order_id: this.$route.params.id,
              quotation_id: res.data.data.id
            }).then(res => {
              if (res.data.status) {
                this.$message.success('绑定成功')
                this.showPricePopup = false
                this.updatePriceFlag = false
                this.init()
              }
            })
          })
        }
      }
    },
    // 自己写个符合业务场景的展开函数吧
    myFlatten (json) {
      let arr = []
      json.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.product_code = item.product_code
          arr.push(itemChild)
        })
      })
      return arr
    },
    // 搜索报价单
    getPriceList (queryString, cb) {
      price.list({
        code: queryString,
        limit: 50
      }).then(res => {
        if (res.data.status !== false) {
          this.priceList = res.data.data.map(item => {
            return {
              value: item.quotation_code,
              id: item.id
            }
          })
          cb(this.priceList)
        }
      })
    },
    // 导入报价单
    getPriceInfo (id) {
      this.loading = true
      price.detail({
        id: id
      }).then(res => {
        let data = res.data.data
        this.priceInfo = {
          id: data.id,
          price_name: data.name,
          price_code: data.quotation_code,
          client_name: data.client_name,
          price: data.total_price,
          imgArr: data.file_url || [require('@/assets/image/index/noPic.jpg')]
        }
        // 保存一份原始报价单信息
        this.nativePriceInfo = data
        console.log(data)

        this.loading = false
      })
    },
    openPrice () {
      window.open('/price/priceList/page=1&&keyword=&&date=&&status=&&client_id=&&user_id=')
    },
    getPrice (id) {
      this.loading = true
      price.detail({
        id: id
      }).then((res) => {
        let data = res.data.data
        console.log(data)
        // 把报价单导入订单价格统计
        this.price_sts.materialOrderPricePlan = JSON.parse(data.material_info).reduce((total, current) => {
          return total + Number(current.total_price)
        }, 0)
        this.price_sts.materialOrderTotalPlan = this.price_sts.materialOrderPricePlan * this.productAllNumber
        this.price_sts.materialProcessPricePlan = data.assist_info ? JSON.parse(data.assist_info).reduce((total, current) => {
          return total + Number(current.total_price)
        }, 0) : 0
        this.price_sts.materialProcessTotalPlan = this.price_sts.materialProcessPricePlan * this.productAllNumber
        this.price_sts.weavePricePlan = JSON.parse(data.weave_info).reduce((total, current) => {
          return total + Number(current.total_price)
        }, 0)
        this.price_sts.weaveTotalPlan = this.price_sts.weavePricePlan * this.productAllNumber
        this.price_sts.semiProcessPricePlan = JSON.parse(data.semi_product_info).reduce((total, current) => {
          return total + Number(current.total_price)
        }, 0)
        this.price_sts.semiProcessTotalPlan = this.price_sts.semiProcessPricePlan * this.productAllNumber
        this.price_sts.finishedProcessPricePlan = JSON.parse(data.production_info).reduce((total, current) => {
          return total + Number(current.total_price)
        }, 0)
        this.price_sts.finishedProcessTotalPlan = this.price_sts.finishedProcessPricePlan * this.productAllNumber
        this.price_sts.packPricePlan = JSON.parse(data.pack_material_info).reduce((total, current) => {
          return total + Number(current.total_price)
        }, 0)
        this.price_sts.packTotalPlan = this.price_sts.packPricePlan * this.productAllNumber
        this.orderDetailInfo.finance.finance[0].price_info[0].plan_pre_price = this.$toFixed(data.total_price / data.exchange_rate * 100)
        this.orderDetailInfo.finance.finance[0].price_info[0].plan_total_price = this.$toFixed(this.orderDetailInfo.finance.finance[0].price_info[0].plan_pre_price * this.productAllNumber)
        this.orderDetailInfo.finance.finance[1].price_info[0].plan_pre_price = this.$toFixed(this.price_sts.materialOrderPricePlan)
        this.orderDetailInfo.finance.finance[1].price_info[0].plan_total_price = this.$toFixed(this.price_sts.materialOrderTotalPlan)
        this.orderDetailInfo.finance.finance[3].price_info[0].plan_pre_price = this.$toFixed(this.price_sts.materialProcessPricePlan)
        this.orderDetailInfo.finance.finance[3].price_info[0].plan_total_price = this.$toFixed(this.price_sts.materialProcessTotalPlan)
        this.orderDetailInfo.finance.finance[5].price_info[0].plan_pre_price = this.$toFixed(this.price_sts.weavePricePlan)
        this.orderDetailInfo.finance.finance[5].price_info[0].plan_total_price = this.$toFixed(this.price_sts.weaveTotalPlan)
        this.orderDetailInfo.finance.finance[6].price_info[0].plan_pre_price = this.$toFixed(this.price_sts.semiProcessPricePlan)
        this.orderDetailInfo.finance.finance[6].price_info[0].plan_total_price = this.$toFixed(this.price_sts.semiProcessTotalPlan)
        this.orderDetailInfo.finance.finance[7].price_info[0].plan_pre_price = this.$toFixed(this.price_sts.finishedProcessPricePlan)
        this.orderDetailInfo.finance.finance[7].price_info[0].plan_total_price = this.$toFixed(this.price_sts.finishedProcessTotalPlan)
        this.orderDetailInfo.finance.finance[8].price_info[0].plan_pre_price = this.$toFixed(this.price_sts.packPricePlan)
        this.orderDetailInfo.finance.finance[8].price_info[0].plan_total_price = this.$toFixed(this.price_sts.packTotalPlan)
        this.priceTable = {
          material_info: this.$mergeData(JSON.parse(data.material_info), { mainRule: 'product_code' }),
          production_info: this.$mergeData(JSON.parse(data.production_info), { mainRule: 'product_code' }),
          semi_product_info: this.$mergeData(JSON.parse(data.semi_product_info), { mainRule: 'product_code' }),
          assist_info: this.$mergeData(JSON.parse(data.assist_info), { mainRule: 'product_code' }),
          weave_info: this.$mergeData(JSON.parse(data.weave_info), { mainRule: 'product_code' }),
          pack_material_info: this.$mergeData(JSON.parse(data.pack_material_info), { mainRule: 'product_code' })
        }
        this.priceShowTable = this.$clone(this.priceTable)
        console.log(this.priceShowTable)
        this.loading = false
      })
    },
    // 获取预警列表
    getWarnList () {
      warnSetting.list().then(res => {
        if (res.data.status !== false) {
          this.warnList = res.data.data.filter(item => item.order_type === 1)
        }
      })
    },
    checkedWarn (item) {
      this.warnType = item.title
      this.timeData = [
        {
          percent: this.$toFixed(item.material_plan / 100),
          name: '物料计划'
        }, {
          percent: this.$toFixed(item.material_push / 100),
          name: '物料入库'
        }, {
          percent: this.$toFixed(item.semi_product_push / 100),
          name: '织造入库'
        }, {
          percent: this.$toFixed(item.product_push / 100),
          name: '半成品回库'
        }, {
          percent: this.$toFixed(item.product_pack / 100),
          name: '成品装箱'
        }
      ]
    },
    // 取消订单时跳过结余操作
    jumpGoStock () {
      this.showCanclePopup = 5
      this.cancleYarn = [
        {
          material_name: '',
          type: 1,
          color: '',
          weight: '',
          unit: ''
        }
      ]
      this.cancleMaterial = [
        {
          material_name: '',
          type: 2,
          color: '',
          weight: '',
          unit: ''
        }
      ]
      this.canclePack = [
        {
          material_name: '',
          size: '',
          attribute: '',
          number: ''
        }
      ]
      this.canCleProduct = this.canCleProduct.map(item => {
        item.number = ''
        return item
      })
    },
    init () {
      this.loading = true
      Promise.all([
        order.detailInfo({
          id: this.$route.params.id
        })
      ]).then(res => {
        this.nativeOrder = this.$clone(res[0].data.data) // 克隆一份原生的订单数据
        // 处理产前确认
        this.getConfirmBeforeProductionInfo(res[0].data.data)
        // 初始化
        this.orderInfo = res[0].data.data
        this.orderInfo.order_contract = !this.orderInfo.order_contract ? [] : JSON.parse(this.orderInfo.order_contract).map(item => {
          let splitArr = item.split('/')
          return {
            url: item,
            name: splitArr[splitArr.length - 1]
          }
        })
        this.orderInfo.others_info = !this.orderInfo.others_info ? [] : JSON.parse(this.orderInfo.others_info).map(item => {
          let splitArr = item.split('/')
          return {
            url: item,
            name: splitArr[splitArr.length - 1]
          }
        })
        this.orderInfo.pack_means = !this.orderInfo.pack_means ? [] : JSON.parse(this.orderInfo.pack_means).map(item => {
          let splitArr = item.split('/')
          return {
            url: item,
            name: splitArr[splitArr.length - 1]
          }
        })
        this.orderInfo.store_means = !this.orderInfo.store_means ? [] : JSON.parse(this.orderInfo.store_means).map(item => {
          let splitArr = item.split('/')
          return {
            url: item,
            name: splitArr[splitArr.length - 1]
          }
        })
        let productList = []
        let numArr = this.$flatten(res[0].data.data.batch_info.map(item => {
          return item.product_info.map(itemNum => Number(itemNum.numbers))
        }))
        this.product_order_total_number = numArr.length > 0 ? numArr.reduce((a, b) => a + b) : 0
        res[0].data.data.batch_info.forEach(itemBatch => {
          itemBatch.product_info.forEach(itemPro => {
            let finded = productList.find(item => item.product_id === itemPro.product_id)
            if (!finded) {
              productList.push({
                product_id: itemPro.product_id,
                size: itemPro.all_size,
                color: itemPro.all_color,
                image: itemPro.image,
                product_code: itemPro.product_code,
                category_info: itemPro.category_info,
                numbers: itemPro.numbers
              })
            } else {
              finded.numbers += itemPro.numbers
            }
          })
        })
        this.productList = productList
        if (this.productList.length === 1) {
          this.productList[0].checked = true
        } else {
          this.lookAllFlag = true
        }
        this.productAllNumber = productList.reduce((total, current) => {
          return total + Number(current.numbers)
        }, 0)
        // 处理流程时间线
        let nowDate = this.$getTime()
        let timeArr = this.orderInfo.batch_info.map(item => {
          return {
            time: new Date(item.delivery_time).getTime(),
            id: item.batch_id
          }
        }).sort((a, b) => {
          return b.time - a.time
        })
        let totalTime = timeArr[0].time - new Date(this.orderInfo.order_time).getTime()
        this.timeProgressInfo.push({
          name: '下单日期',
          time: this.orderInfo.order_time,
          prog: 0
        })
        timeArr.forEach((item, index) => {
          if (index === 0) {
            this.timeProgressInfo.push({
              name: '交货日期',
              time: this.$getTime(item.time),
              prog: 100
            })
          } else {
            let progs = (new Date(item.time).getTime() - new Date(this.orderInfo.order_time).getTime()) / totalTime * 100 > 100 ? 100 : (new Date(item.time).getTime() - new Date(this.orderInfo.order_time).getTime()) / totalTime * 100
            this.timeProgressInfo.push({
              name: '第' + (item.id) + '批',
              time: this.$getTime(item.time),
              prog: progs
            })
          }
        })
        let prog = (new Date(nowDate).getTime() - new Date(this.orderInfo.order_time).getTime()) / totalTime * 100 > 100 ? 100 : (new Date(nowDate).getTime() - new Date(this.orderInfo.order_time).getTime()) / totalTime * 100
        this.timeProgressInfo.push({
          name: '今天',
          time: nowDate,
          prog: prog
        })
        // 处理流程进度
        let orderData = res[0].data.data
        this.productProgInfo = [{
          name: '物料进度',
          isCompiled: orderData.material_push_progress.r_push >= 100 && orderData.material_push_progress.r_pop >= 100,
          info: [
            {
              name: '入库',
              prog: orderData.material_push_progress.r_push > 100 ? 100 : orderData.material_push_progress.r_push,
              class: 'greenProg'
            },
            {
              name: '出库',
              prog: orderData.material_push_progress.r_pop > 100 ? 100 : orderData.material_push_progress.r_pop,
              class: 'blueProg'
            }
          ]
        },
        {
          name: '生产进度',
          isCompiled: orderData.product_push_progress >= 100 && orderData.product_push_progress >= 100,
          info: [
            {
              name: '入库',
              prog: orderData.product_push_progress > 100 ? 100 : orderData.product_push_progress,
              class: 'blueProg'
            },
            {
              name: '回库',
              prog: orderData.semi_push_progress > 100 ? 100 : orderData.semi_push_progress,
              class: 'blueProg'
            }
          ]
        },
        {
          name: '出库进度',
          isCompiled: orderData.pack_real_progress >= 100,
          info: [
            {
              name: '装箱',
              prog: orderData.pack_real_progress > 100 ? 100 : orderData.pack_real_progress || 0,
              class: 'blueProg'
            }
          ]
        }]
        this.catDetail('material')
        if (this.orderInfo.time_progress) {
          this.warnData = {
            isOpenWarn: true,
            startTime: this.orderInfo.time_progress.order_time,
            endTime: this.orderInfo.time_progress.end_time,
            warnArr: [
              {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.material_plan / 100),
                name: '物料计划',
                isWarnStatus: this.orderInfo.material_plan_progress_status,
                porgress: 1
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.material_push / 100),
                name: '物料入库',
                isWarnStatus: this.orderInfo.material_push_progress_status,
                porgress: this.orderInfo.material_push_progress.r_push
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.semi_product_push / 100),
                name: '织造入库',
                isWarnStatus: this.orderInfo.semi_product_push_progress_status,
                porgress: this.orderInfo.product_push_progress
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.product_push / 100),
                name: '成品回库',
                isWarnStatus: this.orderInfo.product_push_progress_status,
                porgress: this.orderInfo.semi_push_progress
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.product_pack / 100),
                name: '成品装箱',
                isWarnStatus: this.orderInfo.pack_push_progress_status,
                porgress: this.orderInfo.pack_real_progress
              }
            ]
          }
        }
        if (window.sessionStorage.getItem('user_id') === orderData.user_id || +window.sessionStorage.getItem('has_check') > 0) {
          this.canSeePriceFlag = true
        }
        this.loading = false
        // 如果有报价单需要单独处理报价单
        if (this.nativeOrder.quotation_id) {
          this.getPrice(this.nativeOrder.quotation_id)
        }
      })
    },
    // 物料概述
    getMaterialDetail () {
      this.loading = true
      Promise.all([
        materialPlan.detail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        materialStock.detail({
          order_id: this.$route.params.id,
          order_type: 1
        })
      ]).then(res => {
        let materialDetail = res[0].data.data.total_data.filter(itemF => itemF.reality_weight > 0)
        let materialStock = res[1].data.data.filter(item => Number(item.type) === 3 || Number(item.type) === 4)
        this.orderDetailInfo.material = this.$mergeData(materialDetail, { mainRule: ['material_name', 'material_type'], otherRule: [{ name: 'unit' }], childrenName: 'attr_info', childrenRule: { mainRule: 'material_attribute/attr', otherRule: [{ name: 'reality_weight/plan_number', type: 'add' }, { name: 'order_weight/order_number', type: 'add' }, { name: 'process_weight/process_number', type: 'add' }] } }).map(item => {
          return {
            material_name: item.material_name,
            material_type: item.material_type,
            unit: Number(item.material_type) === 1 ? 'kg' : (item.unit || '个'),
            attr_info: item.attr_info.map(itemAttr => {
              return {
                attr: itemAttr.attr,
                plan_number: this.$toFixed((Number(item.material_type) === 1 ? (itemAttr.plan_number / 1000) : itemAttr.plan_number) || 0),
                order_number: this.$toFixed(itemAttr.order_number || 0),
                process_number: this.$toFixed(itemAttr.process_number || 0)
              }
            })
          }
        })
        materialStock.forEach(itemMa => {
          let flag = this.orderDetailInfo.material.find(item => item.material_name === itemMa.material_name && Number(item.material_type) === Number(itemMa.material_type))
          if (flag) {
            let attrFlag = flag.attr_info.find(item => item.attr === itemMa.material_color)
            if (attrFlag) {
              if (Number(itemMa.type) === 4) {
                attrFlag.out_stock_number = this.$toFixed((Number(attrFlag.out_stock_number) || 0) + (Number(itemMa.total_weight) || 0))
              } else if (Number(itemMa.type) === 3) {
                attrFlag.go_stock_number = this.$toFixed((Number(attrFlag.go_stock_number) || 0) + (Number(itemMa.total_weight) || 0))
              }
            }
          } else {
            this.orderDetailInfo.material.push({
              material_name: itemMa.material_name,
              material_type: itemMa.material_type,
              unit: Number(itemMa.material_type) === 1 ? 'kg' : (itemMa.unit || '个'),
              attr_info: [
                {
                  attr: itemMa.material_color,
                  plan_number: 0,
                  order_number: 0,
                  process_number: 0,
                  go_stock_number: Number(itemMa.type) === 3 ? this.$toFixed(itemMa.total_weight || 0) : 0,
                  out_stock_number: Number(itemMa.type) === 4 ? this.$toFixed(itemMa.total_weight || 0) : 0
                }
              ]
            })
          }
        })
        this.showFlag2.showMaterial = true
        if (this.orderDetailInfo.material.length > 0) {

        } else {
          this.$message.error('暂无物料信息')
        }
        this.loading = false
      })
    },
    // 生产概述
    getProductionDetail () {
      this.loading = true
      receiveDispatch.allDetail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        let productFlat = []
        this.orderInfo.batch_info.forEach((itemBatch) => {
          itemBatch.product_info.forEach((itemPro) => {
            productFlat.push(itemPro)
          })
        })
        this.orderDetailInfo.production = this.$mergeData(productFlat, {
          mainRule: 'product_id',
          otherRule: [{ name: 'category_info' }, { name: 'product_code' }],
          childrenRule: {
            mainRule: ['color_id', 'size_id'],
            otherRule: [
              { name: 'color_name' },
              { name: 'size_name' },
              { name: 'numbers', type: 'add' }
            ]
          }
        })
        this.orderDetailInfo.production.forEach((itemPro) => {
          itemPro.childrenMergeInfo.forEach((itemChild) => {
            itemChild.inNum = res.data.data.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id && itemFind.is_weave_push === 1).reduce((total, current) => {
              return total + current.number
            }, 0)
            itemChild.outNum = res.data.data.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id && itemFind.is_semi_pop === 1).reduce((total, current) => {
              return total + current.number
            }, 0)
            itemChild.cpNum = res.data.data.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id).reduce((total, current) => {
              return total + current.shoddy_number
            }, 0)
            itemChild.backNum = res.data.data.filter((itemFind) => itemFind.product_id === itemPro.product_id && itemFind.size_id === itemChild.size_id && itemFind.color_id === itemChild.color_id && itemFind.is_semi_push === 1).reduce((total, current) => {
              return total + current.number
            }, 0)
          })
        })
        this.showFlag2.showWeave = true
        this.loading = false
      })
    },
    // 检验概述
    getInspectionDetail () {
      this.loading = true
      Promise.all([
        inspection.semiFinishedDetail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        inspection.finishedDetail({
          order_id: this.$route.params.id,
          order_type: 1
        })
      ]).then(res => {
        let inspectionDetail = res[0].data.data.map(item => {
          return {
            product_id: item.product_id,
            size: item.size_name,
            color: item.color_name,
            semi_number: item.number,
            semi_rejects_number: JSON.parse(item.rejects_info).map(value => value.number).length > 0 ? JSON.parse(item.rejects_info).map(value => Number(value.number)).reduce((a, b) => a + b) : 0
          }
        }).concat(res[1].data.data.map(item => {
          return {
            product_id: item.product_id,
            size: item.size_name,
            color: item.color_name,
            finished_number: item.number,
            finished_rejects_number: JSON.parse(item.rejects_info).map(value => value.number).length > 0 ? JSON.parse(item.rejects_info).map(value => Number(value.number)).reduce((a, b) => a + b) : 0
          }
        }))
        this.orderDetailInfo.inspection = this.$mergeData(inspectionDetail, { mainRule: 'product_id', childrenName: 'color_info', childrenRule: { mainRule: ['size', 'color'], otherRule: [{ name: 'semi_number', type: 'add' }, { name: 'semi_rejects_number', type: 'add' }, { name: 'finished_number', type: 'add' }, { name: 'finished_rejects_number', type: 'add' }] } }).map(item => {
          let proFlag = this.productList.find(itemPro => Number(itemPro.product_id) === Number(item.product_id))
          return {
            product_id: item.product_id,
            product_code: proFlag ? proFlag.product_code : '',
            type: proFlag ? [proFlag.category_info.category_name, proFlag.category_info.type_name, proFlag.category_info.style_name] : [],
            unit: proFlag ? proFlag.category_info.unit : '件',
            color_info: item.color_info.map(itemColor => {
              return {
                size: itemColor.size,
                color: itemColor.color,
                semi_number: itemColor.semi_number,
                semi_rejects_number: itemColor.semi_rejects_number,
                finished_number: itemColor.finished_number,
                finished_rejects_number: itemColor.finished_rejects_number
              }
            })
          }
        })
        this.showFlag2.showIns = true
        if (this.orderDetailInfo.inspection.length > 0) {

        } else {
          this.$message.error('暂无检验信息')
        }
        this.loading = false
      })
    },
    // 出库概述
    getOutStockDetail () {
      this.loading = true
      packPlan.packActualLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let orderProductInfo = []
          this.orderInfo.batch_info.forEach(itemBatch => {
            orderProductInfo.push(...itemBatch.product_info.map(itemPro => {
              return {
                product_id: itemPro.product_id,
                color: itemPro.color_name,
                size: itemPro.size_name,
                order_number: itemPro.numbers
              }
            }))
          })
          let outStockDetail = res.data.data.map(item => {
            return {
              product_id: item.product_id,
              size: item.size_name,
              color: item.color_name,
              number: item.number
            }
          })
          this.orderDetailInfo.outStock = this.$mergeData(orderProductInfo.concat(outStockDetail), { mainRule: 'product_id', childrenName: 'color_info', childrenRule: { mainRule: ['size', 'color'], otherRule: [{ name: 'number', type: 'add' }, { name: 'order_number', type: 'add' }] } }).map(item => {
            let proFlag = this.productList.find(itemPro => Number(itemPro.product_id) === Number(item.product_id))
            return {
              product_id: item.product_id,
              product_code: proFlag ? proFlag.product_code : '',
              type: proFlag ? [proFlag.category_info.category_name, proFlag.category_info.type_name, proFlag.category_info.style_name] : [],
              unit: proFlag ? proFlag.category_info.unit : '件',
              color_info: item.color_info.map(itemColor => {
                return {
                  size: itemColor.size,
                  color: itemColor.color,
                  number: itemColor.number,
                  order_number: itemColor.order_number
                }
              })
            }
          })
        }
        this.showFlag2.showOut = true
        if (this.orderDetailInfo.outStock.length > 0) {

        } else {
          this.$message.error('暂无检验信息')
        }
        this.loading = false
      })
    },
    // 财务概述-财务总览
    getFinanceDetail () {
      this.loading = true
      finance.detail({
        order_id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          let data = res.data.data
          this.orderDetailInfo.finance.finance = [
            {
              name: '订单产值',
              unit: '件',
              priceUnit: this.orderInfo.account_unit,
              price_info: [{
                number: data.order.total_number,
                total_price: data.order.order_total_value,
                pre_price: data.order.order_pre_value
              }]
            },
            {
              name: '原料采购',
              unit: 'kg',
              price_info: [{
                name: '实际入库',
                number: data.material_order.order_number.number || 0,
                total_price: data.material_order.order_number.total_value,
                pre_price: data.material_order.order_number.pre_value
              }]
            },
            {
              name: '原料加工',
              unit: 'kg',
              price_info: [{
                number: data.material_process.number,
                total_price: data.material_process.total_value,
                pre_price: data.material_process.pre_value
              }]
            },
            {
              name: '辅料采购',
              unit: '件',
              price_info: [{
                number: data.assist_material_order.number,
                total_price: data.assist_material_order.total_value,
                pre_price: data.assist_material_order.pre_value
              }]
            },
            {
              name: '辅料加工',
              unit: '件',
              price_info: [{
                number: data.assist_material_process.number,
                total_price: data.assist_material_process.total_value,
                pre_price: data.assist_material_process.pre_value
              }]
            },
            {
              name: '生产织造',
              unit: '件',
              price_info: [{
                number: data.product_weave.number,
                total_price: data.product_weave.total_value,
                pre_price: data.product_weave.pre_value
              }]
            },
            {
              name: '半成品加工',
              unit: '件',
              price_info: [{
                number: data.semi_product.number,
                total_price: data.semi_product.total_value,
                pre_price: data.semi_product.pre_value
              }]
            },
            {
              name: '成品加工',
              unit: '件',
              price_info: [{
                number: data.production.number,
                total_price: data.production.total_value,
                pre_price: data.production.pre_value
              }]
            },
            {
              name: '包装辅料订购',
              unit: '个',
              price_info: [{
                number: data.pack_order.number,
                total_price: data.pack_order.total_value,
                pre_price: data.pack_order.pre_value
              }]
            },
            {
              name: '补纱信息',
              unit: 'kg',
              price_info: [{
                number: data.yarn_replenish_weight,
                total_price: 0,
                pre_price: 0
              }]
            },
            {
              name: '扣款金额',
              unit: '元',
              price_info: [{
                number: 0,
                total_price: data.deduct_price,
                pre_price: 0
              }]
            }
          ]
        }
        this.loading = false
      })
    },
    // 财务概述-原料采购-辅料采购
    getMaterialOrderDetail () {
      this.loading = true
      materialManage.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then((res) => {
        this.orderDetailInfo.finance.yarnOrder = this.$mergeData(res.data.data.filter(item => Number(item.type) === 1), { mainRule: ['client_name', 'stock_name'] })
        this.orderDetailInfo.finance.materialOrder = this.$mergeData(res.data.data.filter(item => Number(item.type) === 2), { mainRule: ['client_name', 'stock_name'] })
      })
      this.loading = false
    },
    // 财务概述-原料加工-辅料加工
    getMaterialProcessDetail () {
      this.loading = true
      materialProcess.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.yarnProcess = this.$mergeData(res.data.data.filter(item => Number(item.type) === 1), { mainRule: 'client_name', childrenName: 'material_info', childrenRule: { mainRule: ['process_type', 'material_name', 'price', 'material_color/color'], otherRule: [{ name: 'complete_time/compiled_time' }, { name: 'weight/number', type: 'add' }, { name: 'reality_push_weight', type: 'add' }] } }).map(item => {
            let priceArr = item.material_info.map(itemPrice => Number(this.$toFixed((Number(itemPrice.price) || 0) * (Number(itemPrice.reality_push_weight) || Number(itemPrice.number) || 0))))
            return {
              total_price: priceArr.length > 0 ? priceArr.reduce((a, b) => a + b) : 0,
              ...item
            }
          })
          this.orderDetailInfo.finance.materialProcess = this.$mergeData(res.data.data.filter(item => Number(item.type) === 2), { mainRule: 'client_name', childrenName: 'material_info', childrenRule: { mainRule: ['process_type', 'material_name', 'price', 'material_color/color'], otherRule: [{ name: 'complete_time/compiled_time' }, { name: 'weight/number', type: 'add' }, { name: 'reality_push_weight', type: 'add' }] } }).map(item => {
            let priceArr = item.material_info.map(itemPrice => Number(this.$toFixed((Number(itemPrice.price) || 0) * (Number(itemPrice.reality_push_weight) || Number(itemPrice.number) || 0))))
            return {
              total_price: priceArr.length > 0 ? priceArr.reduce((a, b) => a + b) : 0,
              ...item
            }
          })
        }
        this.loading = false
      })
    },
    // 财务概述-生产织造
    getWeaveDetail () {
      this.loading = true
      weave.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let data = res.data.data.map(item => {
            return {
              ...item.product_info,
              ...item.category_info,
              client_name: item.client_name,
              number: item.number,
              size: item.size_name,
              color: item.color_name,
              is_part: item.is_part,
              price: item.price,
              total_price: this.$toFixed((Number(item.price) || 0) * (Number(item.number) || 0)),
              compiled_time: this.$getTime(item.complete_time)
            }
          })
          this.orderDetailInfo.finance.weave = this.$mergeData(data, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['product_code', 'name', 'category_name', 'type_name', 'style_name', 'size', 'color', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'total_price', type: 'add' }, { name: 'unit' }, { name: 'is_part' }, { name: 'compiled_time' }] } })
        }
        this.loading = false
      })
    },
    // 财务概述-半成品加工
    getProcessDetail () {
      this.loading = true
      processing.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let processInfo = res.data.data.map(item => {
            return {
              ...item.product_info,
              ...item.category_info,
              client_name: item.client_name,
              price: item.price,
              number: item.number,
              total_price: this.$toFixed((Number(item.price) || 0) * (Number(item.number) || 0)),
              size: item.size_name,
              color: item.color_name,
              is_part: item.is_part,
              process_type: item.type,
              compiled_time: this.$getTime(item.complete_time)
            }
          })
          this.orderDetailInfo.finance.process = this.$mergeData(processInfo, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['product_code', 'name', 'category_name', 'type_name', 'style_name', 'size', 'color', 'process_type', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'total_price', type: 'add' }, { name: 'unit' }, { name: 'is_part' }, { name: 'compiled_time' }] } })
        }
        this.loading = false
      })
    },
    // 财务概述-成品加工
    getProductProcessDetail () {
      this.loading = true
      inspection.finishedDetail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let inspectionList = []
          res.data.data.forEach((item) => {
            item.from = item.inspection_user || item.client_name
            item.count = Number(JSON.parse(item.rejects_info).number) || 0
          })
          res.data.data.forEach((item) => {
            this.$commonFind(inspectionList, item, ['product_flow', 'product_id', 'color_id', 'size_id', 'from', 'price'], ['number', 'count'])
          })
          this.orderDetailInfo.finance.productProcess = this.$mergeData(inspectionList, { mainRule: 'from', childrenRule: { mainRule: 'product_id', otherRule: [{ name: 'product_info' }] } })
        }
        this.loading = false
      })
    },
    // 财务概述-包装辅料订购
    getPackOrderDetail () {
      this.loading = true
      packPlan.packOrderLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.packOrder = this.$mergeData(res.data.data, { mainRule: ['client_name', 'client_id'], childrenName: 'pack_info', childrenRule: { mainRule: ['material_name/pack_name', 'price'], otherRule: [{ name: 'number/order_number', type: 'add' }, { name: 'total_price', type: 'add' }, { name: 'order_time/compiled_time' }, { name: 'unit' }] } })
        }
        this.loading = false
      })
    },
    // 财务概述-出库运输
    getOutStockFinanceDetail () {
      this.loading = true
      packPlan.packOutLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.outStock = this.$mergeData(res.data.data, { mainRule: 'client_name', childrenName: 'out_info', childrenRule: { mainRule: ['price', 'complete_time/compiled_time'], otherRule: [{ name: 'number', type: 'add' }, { name: 'cubic_number/cube_number', type: 'add' }, { name: 'total_price', type: 'add' }] } })
        }
        this.loading = false
      })
    },
    // 财务概述-补纱日志
    getReplenish () {
      this.loading = true
      replenish.list({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.replenish = this.$mergeData(res.data.data, { mainRule: 'replenish_name' })
        }
        this.loading = false
      })
    },
    // 财务概述-扣款金额
    getChargebacks () {
      this.loading = true
      chargebacks.log({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.deductPrice = res.data.data
        }
        this.loading = false
      })
    },
    catDetail (type) {
      this.activeDetailTitle = type
    },
    changeFinance (item) {
      this.activeFinanceTitle = item.key
    },
    // 修改订单状态
    changeOrderStatus (type, flag) {
      if (type === 'okSubmit') {
        let flag = {
          product: true,
          sizeColor: true,
          number: true
        }
        let data = this.actualProductInfo.map(item => {
          if (!item.product_id) {
            flag.product = false
          }
          if (!item.sizeColor[0] || !item.sizeColor[1]) {
            flag.sizeColor = false
          }
          if (!item.actual_number && item.actual_number !== 0) {
            flag.number = false
          }
          return {
            product_id: item.product_id,
            size_id: item.sizeColor[0],
            color_id: item.sizeColor[1],
            number: item.actual_number
          }
        })
        if (!flag.product || !flag.sizeColor) {
          this.$message.error('出现未知错误，请尝试刷新页面')
          return
        }
        if (!flag.number) {
          this.$message.error('请输入实际装箱数量')
          return
        }
        this.isCommit = 'commit'
        order.changeStatus({
          order_id: this.$route.params.id,
          pack_real: data,
          type: 3
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('确认完成')
            this.init()
            this.showOkPopup++
            this.isCommit = 'compiled'
          } else {
            this.isCommit = 'error'
          }
        })
      } else if (type === 'ok') {
        this.actualProductInfo = []
        this.orderInfo.batch_info.forEach(itemB => {
          itemB.product_info.forEach(itemP => {
            this.actualProductInfo.push({
              product_id: itemP.product_id,
              productList: [{
                product_id: itemP.product_id,
                product_code: itemP.product_code
              }],
              sizeColorArr: itemP.all_size.map(itemS => {
                return {
                  value: itemS.size_id,
                  label: itemS.size_name,
                  children: itemP.all_color.map(itemC => {
                    return {
                      value: itemC.color_id,
                      label: itemC.color_name
                    }
                  })
                }
              }),
              sizeColor: [itemP.size_id, itemP.color_id],
              number: itemP.numbers,
              actual_number: '',
              unit: itemP.category_info.unit || '件'
            })
          })
        })
        this.showOkPopup = 1
        if (flag) {
          this.loading = true
          packPlan.packActualLog({
            order_id: this.$route.params.id
          }).then(res => {
            res.data.data && res.data.data.forEach(itemF => {
              let findFlag = this.actualProductInfo.find(itemFI => itemFI.product_id === itemF.product_id && itemFI.sizeColor[0] === itemF.size_id && itemFI.sizeColor[1] === itemF.color_id)
              findFlag && (findFlag.actual_number = itemF.number)
            })
            this.loading = false
          })
        }
      } else if (type === 'change') {
        this.$router.push('/order/orderUpdate/' + this.$route.params.id)
      } else if (type === 'showCanclePopup') {
        this.getMaterialOrderAndProduct()
      } else if (type === 'cancle') {
        const { VATCODE_COLORCODE_DEFAULT } = require('@/assets/js/dictionary.js')
        let flag = {
          name: true,
          color: true,
          size: true,
          number: true,
          stock: true
        }
        let yarnData = this.cancleYarn.filter(item => item.material_name || item.color || item.weight).map(item => {
          if (!item.material_name) {
            flag.name = false
          }
          if (!item.color) {
            flag.color = false
          }
          if (!this.yarnStockId) {
            flag.stock = false
          }
          if (!item.number) {
            flag.weight = false
          }
          return {
            material_name: item.material_name,
            color_code: item.color,
            stock_id: this.yarnStockId,
            type: 1,
            color_number: item.color_code || VATCODE_COLORCODE_DEFAULT,
            vat_code: item.vat_code || VATCODE_COLORCODE_DEFAULT,
            attribute: '',
            weight: item.weight,
            desc: '订单结余入库'
          }
        })
        if (!flag.stock) {
          this.$message.error('请选择您需要入库的原料仓库')
          return
        }
        if (!flag.name) {
          this.$message.error('请填写您需要入库的原料')
          return
        }
        if (!flag.color) {
          this.$message.error('请填写您需要入库的原料属性')
          return
        }
        if (!flag.number) {
          this.$message.error('请填写您需要入库的原料数量')
          return
        }
        let materialData = this.cancleMaterial.filter(item => item.material_name || item.color || item.weight).map(item => {
          if (!item.material_name) {
            flag.name = false
          }
          if (!item.color) {
            flag.color = false
          }
          if (!this.materialStockId) {
            flag.stock = false
          }
          if (!item.number) {
            flag.weight = false
          }
          return {
            material_name: item.material_name,
            color_code: item.color,
            stock_id: this.materialStockId,
            type: 2,
            color_number: item.color_code || VATCODE_COLORCODE_DEFAULT,
            vat_code: item.vat_code || VATCODE_COLORCODE_DEFAULT,
            attribute: '',
            weight: item.weight,
            desc: '订单结余入库'
          }
        })
        if (!flag.stock) {
          this.$message.error('请选择您需要入库的辅料仓库')
          return
        }
        if (!flag.name) {
          this.$message.error('请填写您需要入库的辅料')
          return
        }
        if (!flag.color) {
          this.$message.error('请填写您需要入库的辅料属性')
          return
        }
        if (!flag.number) {
          this.$message.error('请填写您需要入库的辅料数量')
          return
        }
        let packData = this.canclePack.filter(item => item.material_name || item.size || item.number || item.attribute).map(item => {
          if (!item.material_name) {
            flag.name = false
          }
          if (!item.size) {
            flag.size = false
          }
          if (!this.packStockId) {
            flag.stock = false
          }
          if (!item.number) {
            flag.number = false
          }
          return {
            material_name: item.material_name,
            size: item.size,
            attribute: '',
            stock_id: this.packStockId,
            desc: '订单结余入库',
            number: item.number,
            action_type: 1
          }
        })
        if (!flag.stock) {
          this.$message.error('请选择您需要入库的包装辅料仓库')
          return
        }
        if (!flag.name) {
          this.$message.error('请填写您需要入库的包装辅料')
          return
        }
        if (!flag.size) {
          this.$message.error('请填写您需要入库的包装辅料规格')
          return
        }
        if (!flag.number) {
          this.$message.error('请填写您需要入库的包装辅料数量')
          return
        }
        let productData = this.canCleProduct.filter(item => Number(item.number)).map(item => {
          if (!this.productStockId) {
            flag.stock = false
          }
          return {
            product_id: item.product_id,
            color: item.color,
            size: item.size,
            order_code: this.orderInfo.order_code,
            stock_number: item.number,
            stock_id: this.productStockId,
            reamrk: '订单结余入库'
          }
        })
        if (!flag.stock) {
          this.$message.error('请选择您需要入库的产品仓库')
          return
        }
        this.isCommit = 'commit'
        order.changeStatus({
          order_id: this.$route.params.id,
          type: 2,
          product_data: productData,
          material_data: yarnData.concat(materialData),
          pack_material_data: packData
        }).then(res => {
          if (res.data.status !== false) {
            this.isCommit = 'compiled'
            this.showCanclePopup++
            this.init()
          } else {
            this.isCommit = 'error'
          }
        })
      } else {
        this.$message.warning('未知操作')
      }
    },
    // 修改批次状态
    changeBatchStatus (itemBatch) {
      order.changeBatchStatus({
        id: itemBatch.id
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('确认完成成功')
          this.init()
        }
      })
    },
    // 取消时初始化原料、辅料、包装和产品信息
    getMaterialOrderAndProduct () {
      this.loading = true
      Promise.all([
        materialManage.detail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        packPlan.packOrderLog({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        yarn.list(),
        material.list(),
        packag.list(),
        stock.list()
      ]).then(res => {
        // 获取订购原料/辅料信息
        let materialInfo = this.$mergeData(res[0].data.data, { mainRule: ['material_name', 'type', 'color_code/color'], otherRule: [{ name: 'weight', type: 'add' }, { name: 'unit' }] }).map(item => {
          return {
            material_name: item.material_name,
            type: item.type,
            color: item.color,
            weight: item.weight,
            unit: item.unit
          }
        })
        this.cancleYarn = materialInfo.filter(item => item.type === 1)
        this.cancleMaterial = materialInfo.filter(item => item.type === 2)
        // 获取包装订购信息
        let packInfo = this.$mergeData(res[1].data.data.map(item => {
          return {
            material_name: item.material_name,
            size: item.pack_size || JSON.parse(item.size).join('*'),
            attribute: item.attribute,
            number: item.number
          }
        }), { mainRule: ['material_name', 'size', 'attribute'], otherRule: [{ name: 'number', type: 'add' }] }).map(item => {
          return {
            material_name: item.material_name,
            size: item.size,
            attribute: item.attribute,
            number: item.number
          }
        })
        this.canclePack = packInfo
        if (this.cancleYarn.length === 0) {
          this.cancleYarn.push({
            material_name: '',
            type: 1,
            color: '',
            weight: '',
            unit: ''
          })
        }
        if (this.cancleMaterial.length === 0) {
          this.cancleMaterial.push({
            material_name: '',
            type: 2,
            color: '',
            weight: '',
            unit: ''
          })
        }
        if (this.canclePack.length === 0) {
          this.canclePack.push({
            material_name: '',
            size: '',
            attribute: '',
            number: ''
          })
        }
        if (this.yarnList.length === 0) {
          this.yarnList = res[2].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.materialList.length === 0) {
          this.materialList = res[3].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.packList.length === 0) {
          this.packList = res[4].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.stockList.length === 0) {
          this.stockList = res[5].data.data
        }
        this.loading = false
      })
      let productInfo = this.$mergeData(this.$flatten(this.orderInfo.batch_info.map(itemBatch => {
        return itemBatch.product_info.map(itemPro => {
          return {
            color: itemPro.color_name,
            size: itemPro.size_name,
            number: itemPro.numbers,
            product_id: itemPro.product_id,
            product_code: itemPro.product_code
          }
        })
      })), { mainRule: ['product_id', 'product_code', 'size', 'color'], otherRule: [{ name: 'number', type: 'add' }] })
      this.canCleProduct = productInfo.map(item => {
        return {
          product_code: item.product_code,
          product_id: item.product_id,
          size: item.size,
          color: item.color,
          number: item.number
        }
      })
      this.showCanclePopup = 1
    },
    // 取消样单时清空预加载数据
    clearData (page) {
      if (page === 1) {
        this.yarnStockId = ''
        this.cancleYarn = [{
          material_name: '',
          type: 1,
          color: '',
          weight: '',
          unit: ''
        }]
      } else if (page === 2) {
        this.materialStockId = ''
        this.cancleMaterial = [{
          material_name: '',
          type: 2,
          color: '',
          weight: '',
          unit: ''
        }]
      } else if (page === 3) {
        this.packStockId = ''
        this.canclePack = [{
          material_name: '',
          size: '',
          attribute: '',
          number: ''
        }]
      } else if (page === 4) {
        this.productStockId = ''
        this.canCleProduct = []
      }
    },
    addItem (item, type) {
      if (type === 'yarn') {
        item.push({
          material_name: '',
          color: '',
          type: 1,
          unit: null,
          weight: ''
        })
      } else if (type === 'material') {
        item.push({
          material_name: '',
          color: '',
          type: 2,
          unit: '件',
          weight: ''
        })
      } else if (type === 'pack') {
        item.push({
          material_name: '',
          size: '',
          number: '',
          attribute: ''
        })
      }
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    querySearchYarn (queryString, cb) {
      var restaurants = this.yarnList
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchMaterial (queryString, cb) {
      var restaurants = this.materialList
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchPack (queryString, cb) {
      var restaurants = this.packList
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    closePopup () {
      this.showCanclePopup = false
      this.isCommit = 'before'
      this.yarnStockId = ''
      this.materialStockId = ''
      this.packStockId = ''
      this.productStockId = ''
      this.cancleYarn = []
      this.cancleMaterial = []
      this.canclePack = []
      this.canCleProduct = []
    }
  },
  mounted () {
    this.init()
    this.activeFinanceTitle = 'finance'
  },
  watch: {
    // activeDetailTitle (newVal) {
    //   if (this.orderDetailInfo[newVal].length === 0) {
    //     if (newVal === 'material') {
    //       this.getMaterialDetail()
    //     } else if (newVal === 'production') {
    //       this.getProductionDetail()
    //     } else if (newVal === 'inspection') {
    //       this.getInspectionDetail()
    //     } else if (newVal === 'outStock') {
    //       this.getOutStockDetail()
    //     } else {
    //       this.$message.error('未知操作')
    //     }
    //   } else if (newVal === 'finance') {
    //     this.changeFinance({ key: 'finance' })
    //   }
    // },
    activeFinanceTitle (newVal) {
      if (this.orderDetailInfo.finance[newVal].length === 0) {
        if (newVal === 'finance') {
          this.getFinanceDetail()
        } else if (newVal === 'yarnOrder') {
          this.getMaterialOrderDetail()
          this.showFlag.showYarnOrder = true
        } else if (newVal === 'yarnProcess') {
          this.getMaterialProcessDetail()
          this.showFlag.showYarnProcess = true
        } else if (newVal === 'materialOrder') {
          this.getMaterialOrderDetail()
          this.showFlag.showMaterialOrder = true
        } else if (newVal === 'materialProcess') {
          this.getMaterialProcessDetail()
          this.showFlag.showMaterialProcess = true
        } else if (newVal === 'weave') {
          this.getWeaveDetail()
          this.showFlag.showWeave = true
        } else if (newVal === 'process') {
          this.getProcessDetail()
          this.showFlag.showProcess = true
        } else if (newVal === 'productProcess') {
          this.getProductProcessDetail()
          this.showFlag.showProductProcess = true
        } else if (newVal === 'packOrder') {
          this.getPackOrderDetail()
          this.showFlag.showPackOrder = true
        } else if (newVal === 'outStock') {
          this.getOutStockFinanceDetail()
          this.showFlag.showOutStock = true
        } else if (newVal === 'replenish') {
          this.getReplenish()
          this.showFlag.showReplenish = true
        } else if (newVal === 'deductPrice') {
          this.getChargebacks()
          this.showFlag.showDeductPrice = true
        } else {
          this.$message.error('未知操作')
        }
      }
    }
  },
  filters: {
    filterType (item) {
      return item.is_part !== 1 ? item.name : [item.category_name, item.type_name, item.style_name].join('/')
    },
    filterStatus (status) {
      if (status === 2001) {
        return '已创建'
      } else if (status === 2002) {
        return '进行中'
      } else if (status === 2003) {
        return '已取消'
      } else if (status === 2004) {
        return '已完成'
      } else if (status === 2005) {
        return '已延期'
      }
    },
    filterTitle (value) {
      if (value === 1) {
        return '-原料结余入库'
      } else if (value === 2) {
        return '-辅料结余入库'
      } else if (value === 3) {
        return '-包装结余入库'
      } else if (value === 4) {
        return '-产品结余入库'
      }
    },
    filterUnitIcon (unit) {
      let unitArr = moneyArr
      let flag = unitArr.find(item => item.name === unit)
      if (flag) {
        return flag.sign
      } else {
        return '￥'
      }
    },
    filterUsers (users) {
      return users.map(itemM => itemM.name).join('，') || '无'
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderDetail.less";
</style>
<style lang="less">
#orderDetail {
  .steps {
    padding: 8px;
    border-bottom: none;
    .el-step__title {
      font-size: 14px !important;
    }
  }
}
</style>
