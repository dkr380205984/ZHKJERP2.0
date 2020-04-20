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
            <el-dropdown trigger="click"
              @command="changeOrderStatus">
              <!-- <span class="el-dropdown-link"> -->
              <div class="btn btnBlue">操作<i class="el-icon-arrow-down el-icon--right"></i></div>
              <!-- </span> -->
              <el-dropdown-menu>
                <el-dropdown-item command='ok'
                  v-if="orderInfo.status !== 2002 || orderInfo.status !== 2004">
                  <span class="create">确认完成</span>
                </el-dropdown-item>
                <el-dropdown-item command='change'
                  v-if="orderInfo.status === 2001 || orderInfo.status === 2002">
                  <span class="updated">修改</span>
                </el-dropdown-item>
                <el-dropdown-item command='showCanclePopup'
                  v-if='orderInfo.status !== 2004'>
                  <span class="delete">取消订单</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="otherInfo">
            <div class="block">
              <span class="label">金额</span>
              <span class="text">￥{{orderInfo.total_price}}</span>
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
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{orderInfo.remark}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">发货信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <span class="tb_header">
              <span class="tb_row">发货日期</span>
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
            </span>
            <span class="tb_content"
              v-for="(itemBatch,indexBatch) in orderInfo.batch_info"
              :key="indexBatch">
              <span class="tb_row">第{{itemBatch.batch_id}}批<br />{{itemBatch.delivery_time}}</span>
              <span class="tb_row tb_col flex6">
                <span class="tb_col_item"
                  v-for="(itemPro,indexPro) in itemBatch.product_info"
                  :key="indexPro">
                  <span class="tb_row"
                    style="cursor: pointer;color:#1A95FF"
                    @click="$openUrl('/product/productDetail/' + itemPro.product_info.product_id)">{{itemPro.product_code}}<br />{{itemPro.product_info|filterType}}</span>
                  <span class="tb_row middle">
                    <zh-img-list :list='itemPro.product_info.images'></zh-img-list>
                  </span>
                  <span class="tb_row">{{itemPro.size_name + '/' + itemPro.color_name}}</span>
                  <span class="tb_row">{{itemPro.numbers + itemPro.product_info.unit}}</span>
                  <span class="tb_row">{{$toFixed(itemPro.unit_price) + orderInfo.account_unit}}</span>
                  <span class="tb_row">{{$toFixed((Number(itemPro.numbers) || 0 ) * (Number(itemPro.unit_price) || 0))}}{{orderInfo.account_unit}}</span>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="warnData.isOpenWarn">
      <div class="titleCtn">
        <span class="title hasBorder">预警详情</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <zh-time-process :processData="warnData.warnArr"
            :handleFlag="false"
            :startTime="warnData.startTime"
            :endTime='warnData.endTime'
            style="width:100%"></zh-time-process>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">流程进度</span>
        <!-- <span class="right"
          style="display:flex;align-items:center">
          <div class="btn noBorder"
            :style="{'color': isOpenWarn ? '' : '#BBB'}">流程预警</div>
          <el-switch v-model="isOpenWarn" />
          <div class="btn noBorder"
            :style="{'color': isOpenWarn ? '' : '#FFF'}"
            @click="saveWarning">保存</div>
        </span> -->
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="progress_box">
            <div class="progress_contact"
              :style="{width:timeProgressInfo.find(itemTime=>itemTime.name === '今天') ? timeProgressInfo.find(itemTime=>itemTime.name === '今天').prog + '%' : 0}"></div>
            <div class="timeCtn"
              v-for="(itemTime,indexTime) in timeProgressInfo"
              :key="indexTime"
              :style="{left:itemTime.prog + '%'}">
              <div class="time">{{itemTime.time}}</div>
              <div class="line"></div>
              <div class="time_name">{{itemTime.name}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="product_prog_box">
            <div class="prog_title">
              <span class="title_item_box">
                下单数：
                <span class="blue">{{product_order_total_number}}</span>
                条
              </span>
            </div>
            <div class="prog_item"
              v-for="(item,index) in productProgInfo"
              :key='index'>
              <span class="prog_label">{{item.name}}：</span>
              <span class="prog_context">
                <span v-for="(itemInner,indexInner) in item.info"
                  :key="indexInner"
                  :class="['prog_context_item',itemInner.class ]"
                  :style="{'width':itemInner.prog + '%'}">
                  <span class="endLine">
                    <span class="endInfo">{{itemInner.name}}({{(Number(itemInner.prog) || 0) + '%'}})</span>
                  </span>
                </span>
              </span>
              <span class="prog_status"
                v-if="item.isCompiled">完成</span>
            </div>
          </div>
        </div>
        <div class="swichCtn">
          <div :class="['swich',activeDetailTitle === 'material' ? 'active' : '']"
            @click="catDetail('material')">物料概述</div>
          <div :class="['swich',activeDetailTitle === 'production' ? 'active' : '']"
            @click="catDetail('production')">生产概述</div>
          <div :class="['swich',activeDetailTitle === 'inspection' ? 'active' : '']"
            @click="catDetail('inspection')">检验概述</div>
          <div :class="['swich',activeDetailTitle === 'outStock' ? 'active' : '']"
            @click="catDetail('outStock')">出库概述</div>
          <div :class="['swich',activeDetailTitle === 'finance' ? 'active' : '']"
            @click="catDetail('finance')">财务概述</div>
        </div>
      </div>
      <div class="detailCtn">
        <!-- 物料概述 -->
        <template v-if="activeDetailTitle === 'material'">
          <div class="btn_box">
            <div class="left">
              <div class="routerBtn"
                @click="$router.push('/materialPlan/materialPlanDetail/'+ $route.params.id +'/1')">物料计划</div>
              <div class="routerBtn"
                @click="$router.push('/material/materialDetail/'+ $route.params.id +'/1/1')">原料订购加工</div>
              <div class="routerBtn"
                @click="$router.push('/materialStock/materialStockDetail/'+ $route.params.id +'/1/1')">原料出入库</div>
              <div class="routerBtn"
                @click="$router.push('/material/materialDetail/'+ $route.params.id +'/2/1')">辅料订购加工</div>
              <div class="routerBtn"
                @click="$router.push('/materialStock/materialStockDetail/'+ $route.params.id +'/2/1')">辅料出入库</div>
            </div>
            <!-- <div class="right btn btnBlue">确认完成</div> -->
          </div>
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
                    <span class="tcolumn">最终出库</span>
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
            </div>
          </div>
        </template>
        <!-- 生产概述 -->
        <template v-else-if="activeDetailTitle === 'production'">
          <div class="btn_box">
            <div class="left">
              <div class="routerBtn"
                @click="$router.push('/weavingProcessing/weavingDetail/'+ $route.params.id +'/1')">生产织造</div>
              <div class="routerBtn"
                @click="$router.push('/weavingProcessing/processingDetail/'+ $route.params.id +'/1')">半成品加工</div>
              <div class="routerBtn"
                @click="$router.push('/receiveDispatch/receiveDispatchDetail/'+ $route.params.id)">产品收发</div>
            </div>
            <!-- <div class="right btn btnBlue">确认完成</div> -->
          </div>
          <div class="flexTb">
            <div class="thead">
              <span class="trow">
                <span class="tcolumn">生产单位</span>
                <span class="tcolumn flex5 noPad">
                  <span class="trow">
                    <span class="tcolumn">产品信息</span>
                    <span class="tcolumn">尺码颜色</span>
                    <span class="tcolumn">生产工序</span>
                    <span class="tcolumn">分配数量</span>
                    <span class="tcolumn">收发数量</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow"
                v-for="(item,index) in orderDetailInfo.production"
                :key="index">
                <span class="tcolumn">{{item.client_name}}</span>
                <span class="tcolumn noPad flex5">
                  <span class="trow"
                    v-for="(itemPro,indexPro) in item.product_info"
                    :key="indexPro">
                    <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro|filterType}}</span>
                    <span class="tcolumn">{{itemPro.size + '/' + itemPro.color}}</span>
                    <span class="tcolumn">{{itemPro.process_type}}</span>
                    <span class="tcolumn green">{{itemPro.number || 0}}{{itemPro.unit || '件'}}</span>
                    <span class="tcolumn">
                      <span>入库：<span class="green">{{itemPro.go_number || 0}}{{itemPro.unit || '件'}}</span></span>
                      <span>出库：<span class="green">{{itemPro.out_number || 0}}{{itemPro.unit || '件'}}</span></span>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 检验概述 -->
        <template v-else-if="activeDetailTitle === 'inspection'">
          <div class="btn_box">
            <div class="left">
              <div class="routerBtn"
                @click="$router.push('/inspection/semiFinishedDetail/'+ $route.params.id )">半成品检验</div>
              <div class="routerBtn"
                @click="$router.push('/inspection/finishedDetail/'+ $route.params.id )">成品检验</div>
            </div>
            <!-- <div class="right btn btnBlue">确认完成</div> -->
          </div>
          <div class="flexTb">
            <div class="thead">
              <span class="trow">
                <span class="tcolumn">产品信息</span>
                <span class="tcolumn flex5 noPad">
                  <span class="trow">
                    <span class="tcolumn">尺码颜色</span>
                    <span class="tcolumn">半成品检验</span>
                    <span class="tcolumn">次品数量</span>
                    <span class="tcolumn">成品检验</span>
                    <span class="tcolumn">次品数量</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow"
                v-for="(item,index) in orderDetailInfo.inspection"
                :key="index">
                <span class="tcolumn">{{item.product_code}}<br />{{item.type.join('/')}}</span>
                <span class="tcolumn noPad flex5">
                  <span class="trow"
                    v-for="(itemSize,indexSize) in item.color_info"
                    :key="indexSize">
                    <span class="tcolumn">{{itemSize.size + '/' + itemSize.color}}</span>
                    <span class="tcolumn green">{{itemSize.semi_number || 0}}{{item.unit || '件'}}</span>
                    <span class="tcolumn">{{itemSize.semi_rejects_number || 0}}{{item.unit || '件'}}</span>
                    <span class="tcolumn green">{{itemSize.finished_number || 0}}{{item.unit || '件'}}</span>
                    <span class="tcolumn">{{itemSize.finished_rejects_number || 0}}{{item.unit || '件'}}</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 出库概述 -->
        <template v-else-if="activeDetailTitle === 'outStock'">
          <div class="btn_box">
            <div class="left">
              <div class="routerBtn"
                @click="$router.push('/packPlan/packPlanCreate/'+ $route.params.id)">装箱计划</div>
              <div class="routerBtn"
                @click="$router.push('/packPlan/packOrderDetail/'+ $route.params.id)">包装辅料订购</div>
              <div class="routerBtn"
                @click="$router.push('/packPlan/packStock/'+ $route.params.id)">装箱出库</div>
            </div>
            <!-- <div class="right btn btnBlue">确认完成</div> -->
          </div>
          <div class="flexTb">
            <div class="thead">
              <span class="trow">
                <span class="tcolumn">产品信息</span>
                <span class="tcolumn flex4 noPad">
                  <span class="trow">
                    <span class="tcolumn">尺码颜色</span>
                    <span class="tcolumn">下单数量</span>
                    <span class="tcolumn">出库数量</span>
                    <span class="tcolumn">出库差值</span>
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
            </div>
          </div>
        </template>
        <!-- 财务概述 -->
        <template v-else-if="activeDetailTitle === 'finance'">
          <zh-transition :list='orderDetailInfo.finance.title'
            markId='1'
            showKey='name'
            @changed='changeFinance'></zh-transition>
          <template v-if="activeFinanceTitle === 'finance'">
            <div class="flexTb">
              <div class="thead">
                <span class="trow">
                  <span class="tcolumn">工序项目</span>
                  <span class="tcolumn flex30 noPad">
                    <span class="trow">
                      <span class="tcolumn right noBorder flex03"></span>
                      <span class="tcolumn">数量</span>
                      <span class="tcolumn">总价</span>
                      <span class="tcolumn">平均价格</span>
                    </span>
                  </span>
                </span>
              </div>
              <div class="tbody">
                <span class="trow"
                  v-for="(item,index) in orderDetailInfo.finance.finance"
                  :key="index">
                  <span class="tcolumn">{{item.name}}</span>
                  <span class="tcolumn noPad flex30">
                    <span class="trow"
                      v-for="(itemPrice,indexPrice) in item.price_info"
                      :key="indexPrice">
                      <span class="tcolumn right noBorder flex03">{{itemPrice.name}}</span>
                      <span class="tcolumn">{{itemPrice.number ? itemPrice.number + item.unit : '/'}}</span>
                      <span class="tcolumn green">{{itemPrice.total_price ? itemPrice.total_price + orderInfo.account_unit : '/'}}</span>
                      <span class="tcolumn">{{itemPrice.pre_price ? itemPrice.pre_price + orderInfo.account_unit + '/' + item.unit: '/'}}</span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="activeFinanceTitle === 'yarnOrder'">
            <div class="flexTb">
              <div class="thead">
                <span class="trow">
                  <span class="tcolumn">订购公司</span>
                  <span class="tcolumn flex5 noPad">
                    <span class="trow">
                      <span class="tcolumn">原料名称</span>
                      <span class="tcolumn">颜色</span>
                      <span class="tcolumn">单价</span>
                      <span class="tcolumn">数量</span>
                      <span class="tcolumn">完成时间</span>
                    </span>
                  </span>
                  <span class="tcolumn">总价</span>
                </span>
              </div>
              <div class="tbody">
                <span class="trow"
                  v-for="(item,index) in orderDetailInfo.finance.yarnOrder"
                  :key="index">
                  <span class="tcolumn"><span class="green">{{Number(item.type) === 1 ? '调取' : '订购'}}</span>{{item.client_name || item.stock_name}}</span>
                  <span class="tcolumn noPad flex5">
                    <span class="trow"
                      v-for="(itemMa,indexMa) in item.material_info"
                      :key="indexMa">
                      <span class="tcolumn">{{itemMa.material_name}}</span>
                      <span class="tcolumn">{{itemMa.color}}</span>
                      <span class="tcolumn green">{{itemMa.price ? itemMa.price + '元' : '/'}}</span>
                      <span class="tcolumn green">{{itemMa.number ? itemMa.number + '个' : '/'}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="activeFinanceTitle === 'yarnProcess'">
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
                      <span class="tcolumn">数量</span>
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
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="activeFinanceTitle === 'materialOrder'">
            <div class="flexTb">
              <div class="thead">
                <span class="trow">
                  <span class="tcolumn">订购公司</span>
                  <span class="tcolumn flex5 noPad">
                    <span class="trow">
                      <span class="tcolumn">原料名称</span>
                      <span class="tcolumn">颜色</span>
                      <span class="tcolumn">单价</span>
                      <span class="tcolumn">数量</span>
                      <span class="tcolumn">完成时间</span>
                    </span>
                  </span>
                  <span class="tcolumn">总价</span>
                </span>
              </div>
              <div class="tbody">
                <span class="trow"
                  v-for="(item,index) in orderDetailInfo.finance.materialOrder"
                  :key="index">
                  <span class="tcolumn"><span class="green">{{Number(item.type) === 1 ? '调取' : '订购'}}</span>{{item.client_name|| item.stock_name}}</span>
                  <span class="tcolumn noPad flex5">
                    <span class="trow"
                      v-for="(itemMa,indexMa) in item.material_info"
                      :key="indexMa">
                      <span class="tcolumn">{{itemMa.material_name}}</span>
                      <span class="tcolumn">{{itemMa.color}}</span>
                      <span class="tcolumn green">{{itemMa.price ? itemMa.price + '元' : '/'}}</span>
                      <span class="tcolumn green">{{itemMa.number ? itemMa.number + '个' : '/'}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="activeFinanceTitle === 'materialProcess'">
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
                      <span class="tcolumn">数量</span>
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
                      <span class="tcolumn green">{{itemMa.number ? itemMa.number + '个' : '/'}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="activeFinanceTitle === 'weave'">
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
          <template v-else-if="activeFinanceTitle === 'process'">
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
          <template v-else-if="activeFinanceTitle === 'packOrder'">
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
          <template v-else-if="activeFinanceTitle === 'outStock'">
            <div class="flexTb">
              <div class="thead">
                <span class="trow">
                  <span class="tcolumn">运输单位</span>
                  <span class="tcolumn noPad flex5">
                    <span class="trow">
                      <span class="tcolumn">运输箱数(箱)</span>
                      <span class="tcolumn">出库立方数(m³)</span>
                      <span class="tcolumn">单价(元/m³)</span>
                      <span class="tcolumn">总价(元)</span>
                      <span class="tcolumn">完成时间</span>
                    </span>
                  </span>
                </span>
              </div>
              <div class="tbody">
                <span class="trow"
                  v-for="(item,index) in orderDetailInfo.finance.outStock"
                  :key="index">
                  <span class="tcolumn">{{item.client_name}}</span>
                  <span class="tcolumn noPad flex5">
                    <span class="trow"
                      v-for="(itemOut,indexOut) in item.out_info"
                      :key='indexOut'>
                      <span class="tcolumn">{{itemOut.number}}</span>
                      <span class="tcolumn green">{{itemOut.cube_number}}</span>
                      <span class="tcolumn green">{{itemOut.price}}</span>
                      <span class="tcolumn green">{{itemOut.total_price}}</span>
                      <span class="tcolumn">{{itemOut.compiled_time}}</span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </template>
        </template>
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
import { moneyArr } from '@/assets/js/dictionary.js'
import { order, materialPlan, materialStock, weave, processing, receive, dispatch, inspection, packPlan, finance, materialManage, materialProcess, yarn, material, packag, stock, warnSetting } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
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
          outStock: []
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
      }
    }
  },
  methods: {
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
          name: '半成品入库'
        }, {
          percent: this.$toFixed(item.product_push / 100),
          name: '成品入库'
        }, {
          percent: this.$toFixed(item.product_pack / 100),
          name: '成品装箱'
        }
      ]
    },
    saveWarning () {

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
        order.detail({
          id: this.$route.params.id
        })
      ]).then(res => {
        this.orderInfo = res[0].data.data
        this.orderInfo.order_contract = !this.orderInfo.order_contract ? [] : JSON.parse(this.orderInfo.order_contract).map(item => {
          let splitArr = item.split('/')
          console.log(splitArr)
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
            if (!productList.find(item => item.product_id === itemPro.product_info.product_id)) {
              productList.push(itemPro.product_info)
            }
          })
        })
        this.productList = productList
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
        this.productProgInfo.push(
          {
            name: '物料进度',
            isCompiled: orderData.material_push_progress.r_push > 100 && orderData.material_order_progress.y_percent > 100,
            info: [
              {
                name: '入库',
                prog: orderData.material_push_progress.r_push > 100 ? 100 : orderData.material_push_progress.r_push,
                class: 'greenProg'
              }, {
                name: '订购',
                prog: orderData.material_order_progress.y_percent > 100 ? 100 : orderData.material_order_progress.y_percent,
                class: 'blueProg'
              }
            ]
          },
          {
            name: '织造进度',
            isCompiled: orderData.product_weave_progress.product > 100,
            info: [
              {
                name: '分配',
                prog: orderData.product_weave_progress.product > 100 ? 100 : orderData.product_weave_progress.product,
                class: 'blueProg'
              }
            ]
          },
          {
            name: '收发进度',
            isCompiled: orderData.product_push_progress > 100,
            info: [
              {
                name: '收发',
                prog: orderData.product_push_progress > 100 ? 100 : orderData.product_push_progress,
                class: 'blueProg'
              }
            ]
          },
          {
            name: '检验进度',
            isCompiled: orderData.product_inspection_progress.r_product > 100 && orderData.product_inspection_progress.r_semi_product > 100,
            info: [
              {
                name: '成品',
                prog: orderData.product_inspection_progress.r_product > 100 ? 100 : orderData.product_inspection_progress.r_product,
                class: 'greenProg'
              }, {
                name: '半成品',
                prog: orderData.product_inspection_progress.r_semi_product > 100 ? 100 : orderData.product_inspection_progress.r_semi_product,
                class: 'blueProg'
              }
            ]
          },
          {
            name: '装箱进度',
            isCompiled: orderData.order_pack_progress > 100,
            info: [
              {
                name: '装箱',
                prog: orderData.order_pack_progress > 100 ? 100 : orderData.order_pack_progress,
                class: 'blueProg'
              }
            ]
          })
        this.catDetail('material')
        if (this.orderInfo.time_progress) {
          this.warnData = {
            isOpenWarn: true,
            startTime: this.orderInfo.time_progress.order_time,
            endTime: this.orderInfo.time_progress.end_time,
            warnArr: [
              {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.material_plan / 100),
                name: '物料计划'
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.material_push / 100),
                name: '物料入库'
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.semi_product_push / 100),
                name: '半成品入库'
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.product_push / 100),
                name: '成品入库'
              }, {
                percent: this.$toFixed(this.orderInfo.time_progress.progress_data.product_pack / 100),
                name: '成品包装'
              }
            ]
          }
        }
        this.loading = false
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
        let materialDetail = res[0].data.data.total_data
        let materialStock = res[1].data.data.filter(item => Number(item.type) === 3 || Number(item.type) === 1)
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
              if (Number(itemMa.type) === 1) {
                attrFlag.out_stock_number = this.$toFixed((Number(attrFlag.out_stock_number) || 0) + (Number(itemMa.total_weight) || 0))
              } else if (Number(itemMa.type) === 3) {
                attrFlag.go_stock_number = this.$toFixed((Number(attrFlag.go_stock_number) || 0) + (Number(itemMa.total_weight) || 0))
              }
            }
          } else {
            this.orderDetailInfo.push({
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
                  out_stock_number: Number(itemMa.type) === 1 ? this.$toFixed(itemMa.total_weight || 0) : 0
                }
              ]
            })
          }
        })
        this.loading = false
      })
    },
    // 生产概述
    getProductionDetail () {
      this.loading = true
      Promise.all([
        weave.detail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        processing.detail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        receive.detail({
          order_id: this.$route.params.id,
          order_type: 1
        }),
        dispatch.detail({
          order_id: this.$route.params.id,
          order_type: 1
        })
      ]).then(res => {
        let productionDetail = res[0].data.data.map(item => {
          return {
            ...item.product_info,
            ...item.category_info,
            client_name: item.client_name,
            number: item.number,
            size: item.size,
            color: item.color,
            is_part: item.is_part,
            process_type: '织造'
          }
        }).concat(res[1].data.data.map(item => {
          return {
            ...item.product_info,
            ...item.category_info,
            client_name: item.client_name,
            number: item.number,
            size: item.size,
            color: item.color,
            is_part: item.is_part,
            process_type: item.type
          }
        }), res[2].data.data.map(item => {
          return {
            ...item.product_code,
            ...item.category_info,
            client_name: item.client_name,
            process_type: (Number(item.type) === 1 ? '织造' : item.production_type),
            size: item.size,
            color: item.color,
            is_part: item.is_part,
            number: 0,
            go_number: item.number
          }
        }), res[3].data.data.map(item => {
          return {
            ...item.product_code,
            ...item.category_info,
            client_name: item.client_name,
            process_type: (Number(item.type) === 1 ? '织造' : item.production_type),
            size: item.size,
            color: item.color,
            is_part: item.is_part,
            number: 0,
            out_number: item.number
          }
        }))
        this.orderDetailInfo.production = this.$mergeData(productionDetail, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['code/product_code', 'size', 'color', 'process_type'], otherRule: [{ name: 'unit' }, { name: 'name' }, { name: 'category_name' }, { name: 'style_name' }, { name: 'type_name' }, { name: 'number', type: 'add' }, { name: 'go_number', type: 'add' }, { name: 'out_number', type: 'add' }, { name: 'is_part' }] } })
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
            size: item.size,
            color: item.color,
            semi_number: item.number,
            semi_rejects_number: JSON.parse(item.rejects_info).map(value => value.number).length > 0 ? JSON.parse(item.rejects_info).map(value => Number(value.number)).reduce((a, b) => a + b) : 0
          }
        }).concat(res[1].data.data.map(item => {
          return {
            product_id: item.product_id,
            size: item.size,
            color: item.color,
            finished_number: item.number,
            finished_rejects_number: JSON.parse(item.rejects_info).map(value => value.number).length > 0 ? JSON.parse(item.rejects_info).map(value => Number(value.number)).reduce((a, b) => a + b) : 0
          }
        }))
        this.orderDetailInfo.inspection = this.$mergeData(inspectionDetail, { mainRule: 'product_id', childrenName: 'color_info', childrenRule: { mainRule: ['size', 'color'], otherRule: [{ name: 'semi_number', type: 'add' }, { name: 'semi_rejects_number', type: 'add' }, { name: 'finished_number', type: 'add' }, { name: 'finished_rejects_number', type: 'add' }] } }).map(item => {
          let proFlag = this.productList.find(itemPro => Number(itemPro.product_id) === Number(item.product_id))
          return {
            product_id: item.product_id,
            product_code: proFlag ? proFlag.product_code : '',
            type: proFlag ? [proFlag.category_name, proFlag.type_name, proFlag.style_name] : [],
            unit: proFlag ? proFlag.unit : '件',
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
                product_id: itemPro.product_info.product_id,
                color: itemPro.color_name,
                size: itemPro.size_name,
                order_number: itemPro.numbers
              }
            }))
          })
          let outStockDetail = res.data.data.map(item => {
            return {
              product_id: item.product_id,
              size: item.size,
              color: item.color,
              number: item.number
            }
          })
          this.orderDetailInfo.outStock = this.$mergeData(orderProductInfo.concat(outStockDetail), { mainRule: 'product_id', childrenName: 'color_info', childrenRule: { mainRule: ['size', 'color'], otherRule: [{ name: 'number', type: 'add' }, { name: 'order_number', type: 'add' }] } }).map(item => {
            let proFlag = this.productList.find(itemPro => Number(itemPro.product_id) === Number(item.product_id))
            return {
              product_id: item.product_id,
              product_code: proFlag ? proFlag.product_code : '',
              type: proFlag ? [proFlag.category_name, proFlag.type_name, proFlag.style_name] : [],
              unit: proFlag ? proFlag.unit : '件',
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
              price_info: [{
                number: data.order.total_number,
                total_price: data.order.order_total_value,
                pre_price: data.order.order_pre_value
              }]
            },
            {
              name: '原料采购',
              unit: 'kg',
              price_info: [
                {
                  name: '调取',
                  number: data.material_order.stock_number,
                  total_price: 0,
                  pre_price: 0
                },
                {
                  name: '订购',
                  number: data.material_order.order_number.number,
                  total_price: data.material_order.order_number.total_value,
                  pre_price: data.material_order.order_number.pre_value
                }
              ]
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
              name: '包装辅料订购',
              unit: '个',
              price_info: [{
                number: data.pack_order.number,
                total_price: data.pack_order.total_value,
                pre_price: data.pack_order.pre_value
              }]
            },
            {
              name: '出库运输',
              unit: '次',
              price_info: [{
                number: data.stock_out.number,
                total_price: data.stock_out.total_value,
                pre_price: data.stock_out.pre_value
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
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.yarnOrder = this.$mergeData(res.data.data.filter(item => Number(item.type) === 1), { mainRule: ['client_name', 'type_source/type', 'stock_name'], childrenName: 'material_info', childrenRule: { mainRule: ['price', 'material_name', 'color_code/color'], otherRule: [{ name: 'weight/number', type: 'add' }, { name: 'complete_time/compiled_time' }] } }).map(item => {
            let priceArr = item.material_info.map(itemPrice => Number(this.$toFixed((Number(itemPrice.price) || 0) * (Number(itemPrice.number) || 0))))
            return {
              total_price: priceArr.length > 0 ? priceArr.reduce((a, b) => a + b) : 0,
              ...item
            }
          })
          this.orderDetailInfo.finance.materialOrder = this.$mergeData(res.data.data.filter(item => Number(item.type) === 2), { mainRule: ['client_name', 'type_source/type', 'sotck_name'], childrenName: 'material_info', childrenRule: { mainRule: ['price', 'material_name', 'color_code/color'], otherRule: [{ name: 'weight/number', type: 'add' }, { name: 'complete_time/compiled_time' }] } }).map(item => {
            let priceArr = item.material_info.map(itemPrice => Number(this.$toFixed((Number(itemPrice.price) || 0) * (Number(itemPrice.number) || 0))))
            return {
              total_price: priceArr.length > 0 ? priceArr.reduce((a, b) => a + b) : 0,
              ...item
            }
          })
        }
        this.loading = false
      })
    },
    // 财务概述-原料加工-辅料加工
    getMaterialProcessDetail () {
      this.loading = true
      materialProcess.detail({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          this.orderDetailInfo.finance.yarnProcess = this.$mergeData(res.data.data.filter(item => Number(item.type) === 1), { mainRule: 'client_name', childrenName: 'material_info', childrenRule: { mainRule: ['process_type', 'material_name', 'price', 'material_color/color'], otherRule: [{ name: 'complete_time/compiled_time' }, { name: 'weight/number', type: 'add' }] } }).map(item => {
            let priceArr = item.material_info.map(itemPrice => Number(this.$toFixed((Number(itemPrice.price) || 0) * (Number(itemPrice.number) || 0))))
            return {
              total_price: priceArr.length > 0 ? priceArr.reduce((a, b) => a + b) : 0,
              ...item
            }
          })
          this.orderDetailInfo.finance.materialProcess = this.$mergeData(res.data.data.filter(item => Number(item.type) === 2), { mainRule: 'client_name', childrenName: 'material_info', childrenRule: { mainRule: ['process_type', 'material_name', 'price', 'material_color/color'], otherRule: [{ name: 'complete_time/compiled_time' }, { name: 'weight/number', type: 'add' }] } }).map(item => {
            let priceArr = item.material_info.map(itemPrice => Number(this.$toFixed((Number(itemPrice.price) || 0) * (Number(itemPrice.number) || 0))))
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
              size: item.size,
              color: item.color,
              is_part: item.is_part,
              price: item.price,
              total_price: this.$toFixed((Number(item.price) || 0) * (Number(item.number) || 0)),
              compiled_time: this.$getTime(item.complete_time)
            }
          })
          this.orderDetailInfo.finance.weave = this.$mergeData(data, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['code/product_code', 'name', 'category_name', 'type_name', 'style_name', 'size', 'color', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'total_price', type: 'add' }, { name: 'unit' }, { name: 'is_part' }, { name: 'compiled_time' }] } })
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
        if (res.data.stauts !== false) {
          let processInfo = res.data.data.map(item => {
            return {
              ...item.product_info,
              ...item.category_info,
              client_name: item.client_name,
              price: item.price,
              number: item.number,
              total_price: this.$toFixed((Number(item.price) || 0) * (Number(item.number) || 0)),
              size: item.size,
              color: item.color,
              is_part: item.is_part,
              process_type: item.type,
              compiled_time: this.$getTime(item.complete_time)
            }
          })
          this.orderDetailInfo.finance.process = this.$mergeData(processInfo, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['code/product_code', 'name', 'category_name', 'type_name', 'style_name', 'size', 'color', 'process_type', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'total_price', type: 'add' }, { name: 'unit' }, { name: 'is_part' }, { name: 'compiled_time' }] } })
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
        if (res.data.stauts !== false) {
          this.orderDetailInfo.finance.outStock = this.$mergeData(res.data.data, { mainRule: 'client_name', childrenName: 'out_info', childrenRule: { mainRule: ['price', 'complete_time/compiled_time'], otherRule: [{ name: 'number', type: 'add' }, { name: 'cubic_number/cube_number', type: 'add' }, { name: 'total_price', type: 'add' }] } })
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
    changeOrderStatus (type) {
      if (type === 'ok') {
        this.$confirm('此操作将永久修改订单状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          order.changeStatus({
            order_id: this.$route.params.id,
            type: 3
          }).then(res => {
            if (res.data.status !== false) {
              this.$message.success('确认完成')
              this.init()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else if (type === 'change') {
        this.$router.push('/order/orderUpdate/' + this.$route.params.id)
      } else if (type === 'showCanclePopup') {
        this.getMaterialOrderAndProduct()
      } else if (type === 'cancle') {
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
            vat_code: '',
            attribute: '',
            weight: item.weight,
            company_id: window.sessionStorage.getItem('company_id'),
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
            vat_code: '',
            attribute: '',
            weight: item.weight,
            company_id: window.sessionStorage.getItem('company_id'),
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
            product_id: itemPro.product_info.product_id,
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
  created () {
    this.init()
    this.getWarnList()
  },
  watch: {
    activeDetailTitle (newVal) {
      if (this.orderDetailInfo[newVal].length === 0) {
        if (newVal === 'material') {
          this.getMaterialDetail()
        } else if (newVal === 'production') {
          this.getProductionDetail()
        } else if (newVal === 'inspection') {
          this.getInspectionDetail()
        } else if (newVal === 'outStock') {
          this.getOutStockDetail()
        } else {
          this.$message.error('未知操作')
        }
      } else if (newVal === 'finance') {
        this.changeFinance({ key: 'finance' })
      }
    },
    activeFinanceTitle (newVal) {
      if (this.orderDetailInfo.finance[newVal].length === 0) {
        if (newVal === 'finance') {
          this.getFinanceDetail()
        } else if (newVal === 'yarnOrder') {
          this.getMaterialOrderDetail()
        } else if (newVal === 'yarnProcess') {
          this.getMaterialProcessDetail()
        } else if (newVal === 'materialOrder') {
          this.getMaterialOrderDetail()
        } else if (newVal === 'materialProcess') {
          this.getMaterialProcessDetail()
        } else if (newVal === 'weave') {
          this.getWeaveDetail()
        } else if (newVal === 'process') {
          this.getProcessDetail()
        } else if (newVal === 'packOrder') {
          this.getPackOrderDetail()
        } else if (newVal === 'outStock') {
          this.getOutStockFinanceDetail()
        } else {
          this.$message.error('未知操作')
        }
      }
    }
  },
  filters: {
    filterType (item) {
      return item.is_part ? item.name : [item.category_name, item.type_name, item.style_name].join('/')
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
