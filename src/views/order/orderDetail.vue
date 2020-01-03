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
            <el-dropdown trigger="click">
              <!-- <span class="el-dropdown-link"> -->
              <div class="btn btnBlue">操作<i class="el-icon-arrow-down el-icon--right"></i></div>
              <!-- </span> -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span class="create">确认完成</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="updated">修改</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="delete">取消订单</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="otherInfo">
            <div class="block">
              <span class="label">金额</span>
              <span class="text">￥6000</span>
            </div>
            <div class="block">
              <span class="label">状态</span>
              <span class="text blue">进行中</span>
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
            <span class="text">{{orderInfo.user_name}}</span>
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
            <span class="label">文件信息：</span>
            <span class="text"></span>
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
                  <span class="tb_row">产品图片</span>
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
                  <span class="tb_row">{{itemPro.product_code}}</span>
                  <span class="tb_row">产品图片</span>
                  <span class="tb_row">{{itemPro.size_name + '/' + itemPro.color_name}}</span>
                  <span class="tb_row">{{itemPro.numbers}}</span>
                  <span class="tb_row">{{itemPro.unit_price}}</span>
                  <span class="tb_row">{{(Number(itemPro.numbers) || 0 ) * (Number(itemPro.unit_price) || 0)}}</span>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">流程进度</span>
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
                <span class="blue">{{6000}}</span>
                条
              </span>
              <span class="title_item_box">
                下单数：
                <span class="green">{{6000}}</span>
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
            <div class="right btn btnBlue">确认完成</div>
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
                    <span class="tcolumn green">{{itemAttr.plan_number}}</span>
                    <span class="tcolumn green">{{itemAttr.order_number}}</span>
                    <span class="tcolumn green">{{itemAttr.go_stock_number}}</span>
                    <span class="tcolumn green">{{itemAttr.out_stock_number}}</span>
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
            <div class="right btn btnBlue">确认完成</div>
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
                    <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro.type.join('/')}}</span>
                    <span class="tcolumn">{{itemPro.size + '/' + itemPro.color}}</span>
                    <span class="tcolumn">{{itemPro.production_process}}</span>
                    <span class="tcolumn green">{{itemPro.allocation_number || '-'}}</span>
                    <span class="tcolumn">
                      <span>入库：<span class="green">{{itemPro.receive_number || '-'}}</span></span>
                      <span>出库：<span class="green">{{itemPro.dispatch_number || '-'}}</span></span>
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
            <div class="right btn btnBlue">确认完成</div>
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
                    v-for="(itemSize,indexSize) in item.sizeColor_info"
                    :key="indexSize">
                    <span class="tcolumn">{{itemSize.size + '/' + itemSize.color}}</span>
                    <span class="tcolumn green">{{itemSize.semi_finished_number}}</span>
                    <span class="tcolumn">{{itemSize.semi_finished_defective_number}}</span>
                    <span class="tcolumn green">{{itemSize.finished_number}}</span>
                    <span class="tcolumn">{{itemSize.finished_defective_number}}</span>
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
                @click="$router.push('/packPlan/packStock/'+ $route.params.id + '/1')">装箱出库</div>
            </div>
            <div class="right btn btnBlue">确认完成</div>
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
                    v-for="(itemSize,indexSize) in item.sizeColor_info"
                    :key="indexSize">
                    <span class="tcolumn">{{itemSize.size + '/' + itemSize.color}}</span>
                    <span class="tcolumn">{{itemSize.order_number}}</span>
                    <span class="tcolumn green">{{itemSize.out_stock_number}}</span>
                    <span :class="['tcolumn',(Number(itemSize.out_stock_number) || 0) < (Number(itemSize.order_number) || 0) ? 'red' : 'green']">{{$toFixed((Number(itemSize.out_stock_number) || 0) - (Number(itemSize.order_number) || 0))}}</span>
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
                      <span class="tcolumn">{{itemPrice.number}}</span>
                      <span class="tcolumn green">{{itemPrice.total_price}}</span>
                      <span class="tcolumn">{{itemPrice.number ? $toFixed((Number(itemPrice.total_price) || 0)/(Number(itemPrice.number) || 0)) : 0}}</span>
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
                  <span class="tcolumn"><span class="green">{{item.type}}</span>{{item.client_name}}</span>
                  <span class="tcolumn noPad flex5">
                    <span class="trow"
                      v-for="(itemMa,indexMa) in item.material_info"
                      :key="indexMa">
                      <span class="tcolumn">{{itemMa.material_name}}</span>
                      <span class="tcolumn">{{itemMa.color}}</span>
                      <span class="tcolumn green">{{itemMa.price}}</span>
                      <span class="tcolumn green">{{itemMa.number}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price}}</span>
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
                      <span class="tcolumn green">{{itemMa.price}}</span>
                      <span class="tcolumn green">{{itemMa.number}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price}}</span>
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
                  <span class="tcolumn"><span class="green">{{item.type}}</span>{{item.client_name}}</span>
                  <span class="tcolumn noPad flex5">
                    <span class="trow"
                      v-for="(itemMa,indexMa) in item.material_info"
                      :key="indexMa">
                      <span class="tcolumn">{{itemMa.material_name}}</span>
                      <span class="tcolumn">{{itemMa.attr}}</span>
                      <span class="tcolumn green">{{itemMa.price}}</span>
                      <span class="tcolumn green">{{itemMa.number}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price}}</span>
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
                      <span class="tcolumn">{{itemMa.attr}}</span>
                      <span class="tcolumn">{{itemMa.process_type}}</span>
                      <span class="tcolumn green">{{itemMa.price}}</span>
                      <span class="tcolumn green">{{itemMa.number}}</span>
                      <span class="tcolumn">{{itemMa.compiled_time}}</span>
                    </span>
                  </span>
                  <span class="tcolumn green">{{item.total_price}}</span>
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
                      <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro.type.join('/')}}</span>
                      <span class="tcolumn">{{itemPro.size + '/' + itemPro.color}}</span>
                      <span class="tcolumn green">{{itemPro.price}}</span>
                      <span class="tcolumn green">{{itemPro.number}}</span>
                      <span class="tcolumn green">{{$toFixed((Number(itemPro.price) || 0 ) * (Number(itemPro.number) || 0))}}</span>
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
                      <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro.type.join('/')}}</span>
                      <span class="tcolumn">{{itemPro.size + '/' + itemPro.color}}</span>
                      <span class="tcolumn">{{itemPro.process_type}}</span>
                      <span class="tcolumn green">{{itemPro.price}}</span>
                      <span class="tcolumn green">{{itemPro.number}}</span>
                      <span class="tcolumn green">{{$toFixed((Number(itemPro.price) || 0 ) * (Number(itemPro.number) || 0))}}</span>
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
                      <span class="tcolumn green">{{itemPack.price}}</span>
                      <span class="tcolumn green">{{itemPack.order_number}}</span>
                      <span class="tcolumn green">{{$toFixed((Number(itemPack.price) || 0 ) * (Number(itemPack.order_number) || 0))}}</span>
                      <span class="tcolumn">{{itemPack.compiled_time}}</span>
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
                  <span class="tcolumn">运输箱数(箱)</span>
                  <span class="tcolumn">出库立方数(m³)</span>
                  <span class="tcolumn">单价(元/m³)</span>
                  <span class="tcolumn">总价(元)</span>
                  <span class="tcolumn">完成时间</span>
                </span>
              </div>
              <div class="tbody">
                <span class="trow"
                  v-for="(item,index) in orderDetailInfo.finance.outStock"
                  :key="index">
                  <span class="tcolumn">{{item.client_name}}</span>
                  <span class="tcolumn">{{item.number}}</span>
                  <span class="tcolumn green">{{item.prot}}</span>
                  <span class="tcolumn green">{{item.price}}</span>
                  <span class="tcolumn green">{{item.total_price}}</span>
                  <span class="tcolumn">{{item.compiled_time}}</span>
                </span>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { order } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      orderInfo: {
        order_code: '',
        order_batch: []
      },
      timeProgressInfo: [],
      productProgInfo: [
        {
          name: '物料进度',
          isCompiled: true,
          info: [
            {
              name: '出入库',
              prog: 10,
              class: 'greenProg'
            }, {
              name: '订购',
              prog: 60,
              class: 'blueProg'
            }
          ]
        }, {
          name: '织造进度',
          isCompiled: true,
          info: [
            {
              name: '织造',
              prog: 100,
              class: 'greenProg'
            }, {
              name: '分配',
              prog: 100,
              class: 'blueProg'
            }
          ]
        }, {
          name: '收发进度',
          isCompiled: false,
          info: [
            {
              name: '收发',
              prog: 10,
              class: 'blueProg'
            }
          ]
        }, {
          name: '检验进度',
          isCompiled: true,
          info: [
            {
              name: '成品',
              prog: 10,
              class: 'greenProg'
            }, {
              name: '半成品',
              prog: 60,
              class: 'blueProg'
            }
          ]
        }, {
          name: '装箱进度',
          isCompiled: true,
          info: [
            {
              name: '装箱',
              prog: 10,
              class: 'blueProg'
            }
          ]
        }
      ],
      orderDetailInfo: {
        'material': [
          {
            material_name: '26支单股晴纶',
            attr_info: [
              {
                attr: '白色',
                plan_number: '6000',
                order_number: '6020',
                go_stock_number: '5900',
                out_stock_number: '5000'
              },
              {
                attr: '黑色',
                plan_number: '6000',
                order_number: '6020',
                go_stock_number: '5900',
                out_stock_number: '5000'
              }
            ]
          }
        ],
        'production': [
          {
            client_name: '针织单位',
            product_info: [
              {
                product_code: '19ABA0001',
                type: ['围巾', '针织', '长巾'],
                size: '均码',
                color: '红色',
                production_process: '织造',
                allocation_number: 600,
                receive_number: 606,
                dispatch_number: 600
              },
              {
                product_code: '19ABA0002',
                type: ['帽子', '针织', '长巾'],
                size: 'S码',
                color: '白色',
                production_process: '织造',
                allocation_number: 1000,
                receive_number: 980,
                dispatch_number: 980
              }
            ]
          }
        ],
        'inspection': [
          {
            product_code: '19ABA0001',
            type: ['围巾', '针织', '长巾'],
            sizeColor_info: [
              {
                size: '均码',
                color: '红色',
                semi_finished_number: 600,
                semi_finished_defective_number: 2,
                finished_number: 200,
                finished_defective_number: 1
              }, {
                size: '均码',
                color: '黑色',
                semi_finished_number: 600,
                semi_finished_defective_number: 2,
                finished_number: 200,
                finished_defective_number: 1
              }
            ]
          }
        ],
        'outStock': [
          {
            product_code: '19ABA0001',
            type: ['围巾', '针织', '长巾'],
            sizeColor_info: [
              {
                size: '均码',
                color: '红色',
                order_number: 2000,
                out_stock_number: 1980
              }, {
                size: '均码',
                color: '黑色',
                order_number: 2000,
                out_stock_number: 2080
              }
            ]
          }
        ],
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
          finance: [
            {
              name: '订单产值',
              price_info: [
                {
                  number: 5924,
                  total_price: 200000
                }
              ]
            },
            {
              name: '原料采购',
              price_info: [
                {
                  name: '调取',
                  number: 595959,
                  total_price: 200000
                },
                {
                  name: '订购',
                  number: 777,
                  total_price: 200000
                }
              ]
            },
            {
              name: '原料加工',
              price_info: [
                {
                  number: 8888,
                  total_price: 200000
                }
              ]
            },
            {
              name: '辅料采购',
              price_info: [
                {
                  name: '调取',
                  number: 20666,
                  total_price: 200000
                },
                {
                  name: '订购',
                  number: 10880,
                  total_price: 200000
                }
              ]
            },
            {
              name: '辅料加工',
              price_info: [
                {
                  number: 12020,
                  total_price: 200000
                }
              ]
            },
            {
              name: '生产织造',
              price_info: [
                {
                  number: 10000,
                  total_price: 208880
                }
              ]
            },
            {
              name: '半成品加工',
              price_info: [
                {
                  number: 10000,
                  total_price: 1000
                }
              ]
            },
            {
              name: '包装辅料订购',
              price_info: [
                {
                  number: 10000,
                  total_price: 19899
                }
              ]
            },
            {
              name: '出库运输',
              price_info: [
                {
                  number: 10000,
                  total_price: 208000
                }
              ]
            }
          ],
          yarnOrder: [
            {
              client_name: '桐庐凯瑞针纺',
              type: '订购',
              material_info: [
                {
                  material_name: '26支单股晴纶',
                  color: '绿色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2020-01-01'
                },
                {
                  material_name: '26支双股晴纶',
                  color: '黄色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2019-12-01'
                }
              ],
              total_price: 20000
            },
            {
              client_name: '桐庐凯瑞针纺',
              type: '订购/补纱',
              material_info: [
                {
                  material_name: '26支单股晴纶',
                  color: '绿色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2020-01-01'
                },
                {
                  material_name: '26支双股晴纶',
                  color: '黄色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2019-12-01'
                }
              ],
              total_price: 20000
            }
          ],
          yarnProcess: [
            {
              client_name: '桐庐汇鸿染色',
              material_info: [
                {
                  material_name: '20支晴纶羊绒',
                  color: '红色',
                  process_type: '染色',
                  price: 26,
                  number: 2000,
                  compiled_time: '2019-12-28'
                },
                {
                  material_name: '20支晴纶羊绒',
                  color: '红色',
                  process_type: '拼线',
                  price: 26,
                  number: 2000,
                  compiled_time: '2019-12-28'
                }
              ],
              total_price: 52000
            }
          ],
          materialOrder: [
            {
              client_name: '桐庐凯瑞针纺',
              type: '订购',
              material_info: [
                {
                  material_name: '牛角扣',
                  attr: '绿色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2020-01-01'
                },
                {
                  material_name: '腰带',
                  attr: '黄色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2019-12-01'
                }
              ],
              total_price: 20000
            },
            {
              client_name: '桐庐凯瑞针纺',
              type: '订购/补纱',
              material_info: [
                {
                  material_name: '衣架',
                  attr: '绿色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2020-01-01'
                },
                {
                  material_name: '衣架',
                  attr: '黄色',
                  price: 20,
                  number: 2000,
                  compiled_time: '2019-12-01'
                }
              ],
              total_price: 20000
            }
          ],
          materialProcess: [
            {
              client_name: '桐庐汇鸿染色',
              material_info: [
                {
                  material_name: '牛角扣',
                  attr: '红色',
                  process_type: '拼接',
                  price: 26,
                  number: 2000,
                  compiled_time: '2019-12-28'
                },
                {
                  material_name: '腰带',
                  attr: '红色',
                  process_type: '吊线',
                  price: 26,
                  number: 2000,
                  compiled_time: '2019-12-28'
                }
              ],
              total_price: 52000
            }
          ],
          weave: [
            {
              client_name: '针织-老王',
              product_info: [
                {
                  product_code: '19AAA0001',
                  type: ['围巾', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                },
                {
                  product_code: '19AAA0002',
                  type: ['帽子', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                }
              ]
            },
            {
              client_name: '针织-老六',
              product_info: [
                {
                  product_code: '19AAA0001',
                  type: ['围巾', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                },
                {
                  product_code: '19AAA0002',
                  type: ['帽子', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                }
              ]
            }
          ],
          process: [
            {
              client_name: '平车-老王',
              product_info: [
                {
                  product_code: '19AAA0001',
                  type: ['围巾', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  process_type: '吊带',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                },
                {
                  product_code: '19AAA0002',
                  type: ['帽子', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  process_type: '吊带',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                }
              ]
            },
            {
              client_name: '针织-老六',
              product_info: [
                {
                  product_code: '19AAA0001',
                  type: ['围巾', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  process_type: '拉毛',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                },
                {
                  product_code: '19AAA0002',
                  type: ['帽子', '针织', '长巾'],
                  color: '红色',
                  size: 'S码',
                  process_type: '拉毛',
                  price: 6,
                  number: 7000,
                  compiled_time: '2019-12-08'
                }
              ]
            }
          ],
          packOrder: [
            {
              client_name: '鸿盟纸箱',
              pack_info: [
                {
                  pack_name: '三瓦箱子（大）',
                  price: 4.2,
                  order_number: 2000,
                  compiled_time: '2019-12-30'
                }, {
                  pack_name: '三瓦箱子（小）',
                  price: 2.2,
                  order_number: 2000,
                  compiled_time: '2019-12-30'
                }
              ]
            }
          ],
          outStock: [
            {
              client_name: '毛国平运输',
              number: 10,
              prot: 200,
              price: 16.8,
              total_price: 20000,
              compiled_time: '2019-12-31'
            }
          ]
        }
      },
      activeDetailTitle: 'finance',
      activeFinanceTitle: 'finance'
    }
  },
  methods: {
    init () {
      this.loading = true
      Promise.all([
        order.detail({
          id: this.$route.params.id
        })
      ]).then(res => {
        this.orderInfo = res[0].data.data
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
        this.loading = false
      })
    },
    catDetail (type) {
      this.activeDetailTitle = type
    },
    changeFinance (item) {
      this.activeFinanceTitle = item.key
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderDetail.less";
</style>
