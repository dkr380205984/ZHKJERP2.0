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
              v-if="orderInfo.status !== 2002 || orderInfo.status !== 2004"
              @click="changeOrderStatus('ok')">确认完成</div>
          </div>
          <div class="otherInfo">
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
            <span class="label">结算单位：</span>
            <span class="text">{{orderInfo.account_unit}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">汇率：</span>
            <span class="text">{{orderInfo.exchange_rate}}</span>
          </div>
          <!-- <div class="colCtn flex3">
            <span class="label">税率：</span>
            <span class="text">{{orderInfo.tax_rate}}</span>
          </div> -->
        </div>
        <div class="rowCtn">
          <!-- <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div> -->
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
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
        <span style="float:right;font-size:26px">
          <i class="el-icon-s-fold"
            style="cursor:pointer;margin-right:12px"
            @click="tableType='normal'"
            :style="{'color':tableType==='normal'?'#1a95ff':'rgba(0,0,0,0.45)'}"></i>
          <i class="el-icon-menu"
            style="cursor:pointer"
            @click="tableType='table'"
            :style="{'color':tableType==='table'?'#1a95ff':'rgba(0,0,0,0.45)'}"></i>
        </span>
      </div>
      <div class="detailCtn"
        v-if="tableType==='normal'">
        <div class="rowCtn"
          style="flex-wrap:wrap">
          <template>
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
              </span>
            </div>
          </template>

        </div>
      </div>
      <template v-if="tableType==='table'">
        <div class="detailCtn"
          v-for="(itemBatch,indexBatch) in  orderInfo.batch_info_new"
          :key="indexBatch">
          <div class="titleNum">第{{itemBatch.batch_id}}批</div>
          <div class="rowCtn"
            style="flex-wrap:wrap">
            <div class="new_batch_style">
              <div class="line">
                <span class="line_item">交货日期：{{itemBatch.delivery_time}}</span>
                <span class="line_item">批次名称：{{itemBatch.name}}</span>
                <span class="line_item">批次类型：{{itemBatch.type}}</span>
              </div>
              <div class="line">
                <span class="line_item">批次备注：{{itemBatch.remark || '暂无备注信息'}}</span>
              </div>
              <div class="line"
                style="flex-direction:column">
                <div class="flexTb noMargin"
                  v-for="(itemInner,indexInner) in itemBatch.product_info"
                  :key="indexInner">
                  <div class="thead">
                    <span class="trow">
                      <span class="tcolumn flex12">产品</span>
                      <span class="tcolumn center flex16"
                        style="font-size:14px">产品图片</span>
                      <span class="tcolumn flex8 noPad">
                        <span class="trow">
                          <span class="tcolumn twoTitleSpan">
                            <span class="leftBottom">颜色</span>
                            <span class="line"></span>
                            <span class="rightTop">尺码</span>
                          </span>
                          <span class="tcolumn"
                            v-for="(itemSize,indexSize) in itemInner.size_info"
                            :key="indexSize">{{itemSize.size_name}}</span>
                          <template v-if="itemInner.size_info.length < 7">
                            <span class="tcolumn"
                              v-for="(itemB,indexB) in 7-itemInner.size_info.length"
                              :key='indexB + "buchong"'></span>
                          </template>
                          <span class="tcolumn center">合计</span>
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="tbody">
                    <span class="trow">
                      <span class="tcolumn flex12">
                        <span class="blue"
                          @click="$router.push('/product/productDetail/' + itemInner.product_id)">{{itemInner.product_code}}</span>
                        <span>{{itemInner.type.join('/')}}</span>
                        <span>单价：{{canSeePriceFlag ? (itemInner.price || 0) + '元/' + (itemInner.unit || '件') : '/'}}</span>
                      </span>
                      <span class="tcolumn center flex16">
                        <zh-img-list :list='itemInner.image'></zh-img-list>
                      </span>
                      <span class="tcolumn flex8 noPad">
                        <span class="trow"
                          v-for="(itemColor,indexColor) in itemInner.color_info"
                          :key="indexColor">
                          <span class="tcolumn">{{itemColor.color_name}}</span>
                          <span class="tcolumn"
                            v-for="(itemSize,indexSize) in itemInner.size_info"
                            :key="indexSize">{{itemColor[itemSize.size_name]}}{{itemInner.unit || '件'}}</span>
                          <template v-if="itemInner.size_info.length < 7">
                            <span class="tcolumn"
                              v-for="(itemB,indexB) in 7-itemInner.size_info.length"
                              :key='indexB + "buchong"'></span>
                          </template>
                          <span class="tcolumn center bgGray">{{itemColor.number || 0}}{{itemInner.unit || '件'}}</span>
                        </span>
                        <span class="trow bgGray">
                          <span class="tcolumn">合计</span>
                          <span class="tcolumn"
                            v-for="(itemSize,indexSize) in itemInner.size_info"
                            :key="indexSize">{{itemSize.number || 0}}{{itemInner.unit || '件'}}</span>
                          <template v-if="itemInner.size_info.length < 7">
                            <span class="tcolumn"
                              v-for="(itemB,indexB) in 7-itemInner.size_info.length"
                              :key='indexB + "buchong"'></span>
                          </template>
                          <span class="tcolumn center">{{itemInner.number || 0}}{{itemInner.unit || '件'}}</span>
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">流程详情页面</span>
      </div>
    </div> -->
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push(`/material/materialDetail/${$route.params.id}/1/1/normal`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaodinggou"></use>
        </svg>
        <span class="name">物料采购</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/materialStock/materialGoStockDetail/${$route.params.id}/1/1`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaochuruku"></use>
        </svg>
        <span class="name">物料出入库</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/process/processCommon/${$route.params.id}/1/1`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-zhizaojiagong"></use>
        </svg>
        <span class="name">织片详情</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/process/processCommon/${$route.params.id}/1/2`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-gongxufenpei"></use>
        </svg>
        <span class="name">套口详情</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/process/processCommon/${$route.params.id}/1/3`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-gongxuguanli"></use>
        </svg>
        <span class="name">其他工序</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/packPlan/packPlanCreate/${$route.params.id}`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-zhuangxiangchuku"></use>
        </svg>
        <span class="name">装箱详情</span>
      </div>
    </div>
    <!-- <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">流程进度</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn"
          style="padding:0 60px"
          v-if="warnData.isOpenWarn">
          <zh-time-process :processData="warnData.warnArr"
            :handleFlag="false"
            :startTime="warnData.startTime"
            :endTime='warnData.endTime'
            style="width:100%"></zh-time-process>
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
                @click="useCallback(item)">{{item.show?'收起列表':'展开详情'}}</div>
            </div>
            <div class="hideCtn"
              v-if="item.show">
              <template v-if="item.key === 'material'">
                <div class="flexTb">
                  <div class="thead">
                    <span class="trow">
                      <span class="tcolumn">物料名称</span>
                      <span class="tcolumn flex5 noPad">
                        <span class="trow">
                          <span class="tcolumn">颜色属性</span>
                          <span class="tcolumn">采购数量</span>
                          <span class="tcolumn">入库数量</span>
                          <span class="tcolumn">出库数量</span>
                          <span class="tcolumn">回库数量</span>
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
                          <span class="tcolumn green">{{itemAttr.order_number}}{{item.unit}}</span>
                          <span class="tcolumn green">{{itemAttr.go_stock_number || 0}}{{item.unit}}</span>
                          <span class="tcolumn green">{{itemAttr.out_stock_number || 0}}{{item.unit}}</span>
                          <span class="tcolumn green">{{itemAttr.back_stock_number || 0}}{{item.unit}}</span>
                        </span>
                      </span>
                    </span>
                    <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/material/materialDetail/'+ $route.params.id +'/1/1/normal')">原料订购</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialStock/materialGoStockDetail/'+ $route.params.id +'/1/1')">原料出入库</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/material/materialDetail/'+ $route.params.id +'/2/1/normal')">辅料订购</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialStock/materialGoStockDetail/'+ $route.params.id +'/2/1')">辅料出入库</span>
                      </div>
                    </span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flexTb">
                  <div class="thead">
                    <span class="trow">
                      <span class="tcolumn">产品信息</span>
                      <span class="tcolumn noPad"
                        style="flex:3">
                        <span class="trow">
                          <span class="tcolumn">尺码颜色</span>
                          <span class="tcolumn">分配数量</span>
                          <span class="tcolumn">检验数量</span>
                          <span class="tcolumn">次品数量</span>
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="tbody">
                    <span class="trow"
                      v-for="(item,index) in orderDetailInfo[item.key]"
                      :key="index">
                      <span class="tcolumn">{{item.product_code}}<br />{{item.product_type}}</span>
                      <span class="tcolumn noPad"
                        style="flex:3">
                        <span class="trow"
                          v-for="(itemSC,indexSC) in item.size_color_info"
                          :key="indexSC">
                          <span class="tcolumn">{{itemSC.size_name + '/' + itemSC.color_name}}</span>
                          <span class="tcolumn green">{{itemSC.number || 0}}{{itemSC.unit || '件'}}</span>
                          <span class="tcolumn orange">{{itemSC.inspection_number || 0}}{{itemSC.unit || '件'}}</span>
                          <span class="tcolumn red">{{itemSC.rejects_number || 0}}{{itemSC.unit || '件'}}</span>
                        </span>
                      </span>
                    </span>
                    <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link"
                        style="margin-left:4px">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push(`/process/processCommon/${$route.params.id}/1/${item.key === '织片' ? 1 : item.key === '套口' ? 2 : 3}`)">{{`${item.key}详情`}}</span>
                      </div>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">财务概览</span>
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
              v-for="(item,index) in orderFinanceDetail"
              :key="index">
              <span class="tcolumn">{{item.name}}</span>
              <span class="tcolumn noPad flex30">
                <span class="trow"
                  v-for="(itemPrice,indexPrice) in item.price_info"
                  :key="indexPrice">
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.number && !itemPrice.name}">{{itemPrice.number ? itemPrice.number + item.unit : ''}}</span>
                  <span class="tcolumn green"
                    :class="{'noData':!itemPrice.total_price}">{{itemPrice.total_price ? itemPrice.total_price + (item.priceUnit ? item.priceUnit : '元') : ''}}</span>
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.pre_price}">{{itemPrice.pre_price ? itemPrice.pre_price + (item.priceUnit ? item.priceUnit : '元') + '' + item.unit: ''}}</span>
                </span>
              </span>
              <span class="tcolumn"
                style="border-right:0">
                <div style="color:#1a95ff;cursor:pointer"
                  v-if="(item.hasDetail && (item.price_info.length > 0) && (item.price_info[0].number)) || (item.hasDetail === 'deduct' && (item.price_info.length > 0) && (item.price_info[0].total_price))"
                  @click="useCallback(item)">{{item.showDetail ? '收起列表' : '展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-else>暂无操作</div>
              </span>
              <div class="hideTbCtn"
                v-if="item.showDetail">
                <template v-if="item.hasDetail === 'material'">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">订购公司</span>
                        <span class="tcolumn flex5 noPad">
                          <span class="trow">
                            <span class="tcolumn">原料名称</span>
                            <span class="tcolumn flex4 noPad">
                              <span class="trow">
                                <span class="tcolumn">颜色</span>
                                <span class="tcolumn">单价</span>
                                <span class="tcolumn">采购数量</span>
                                <span class="tcolumn">入库数量</span>
                              </span>
                            </span>
                          </span>
                        </span>
                        <span class="tcolumn">总价</span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in item.detailInfo"
                        :key="index">
                        <span class="tcolumn"> {{item.client_name}} </span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.material_info"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name}}</span>
                            <span class="tcolumn noPad flex4">
                              <span class="trow"
                                v-for="(itemAttr,indexAttr) in itemMa.attr_info"
                                :key="indexAttr">
                                <span class="tcolumn">{{itemAttr.attr}}</span>
                                <span class="tcolumn green">{{itemAttr.price ? itemAttr.price + '元' : '/'}}</span>
                                <span class="tcolumn green">{{itemAttr.order_number ? itemAttr.order_number + itemAttr.unit : '/'}}</span>
                                <span class="tcolumn green">{{itemAttr.push_weight ? itemAttr.push_weight + itemAttr.unit : '/'}}</span>
                              </span>
                            </span>
                          </span>
                        </span>
                        <span class="tcolumn green">{{item.total_price ? item.total_price + '元' : '/'}}</span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="item.hasDetail === 'production'">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn">织造单位</span>
                        <span class="tcolumn flex6 noPad">
                          <span class="trow">
                            <span class="tcolumn">产品信息</span>
                            <span class="tcolumn noPad flex5">
                              <span class="trow">
                                <span class="tcolumn">尺码颜色</span>
                                <span class="tcolumn">单价</span>
                                <span class="tcolumn">数量</span>
                                <span class="tcolumn">总价</span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(item,index) in item.detailInfo"
                        :key="index">
                        <span class="tcolumn">{{item.client_name}}</span>
                        <span class="tcolumn noPad flex6">
                          <span class="trow"
                            v-for="(itemPro,indexPro) in item.product_info"
                            :key="indexPro">
                            <span class="tcolumn">{{itemPro.product_code}}<br />{{itemPro.product_type}}</span>
                            <span class="tcolumn flex5 noPad">
                              <span class="trow"
                                v-for="(itemSC,indexSC) in itemPro.size_color_info"
                                :key="indexSC">
                                <span class="tcolumn">{{itemSC.size_name + '/' + itemSC.color_name}}</span>
                                <span class="tcolumn green">{{itemSC.price ? itemSC.price + '元' : '/'}}</span>
                                <span class="tcolumn green">{{itemSC.number ? itemSC.number + (itemSC.unit || '条') : '/'}}</span>
                                <span class="tcolumn green">{{itemSC.total_price ? $toFixed(itemSC.total_price) + '元' : '/'}}</span>

                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-if="item.hasDetail === 'pack'">
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
                        v-for="(item,index) in item.detailInfo"
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
                <template v-if="item.hasDetail === 'deduct'">
                  <div class="flexTb">
                    <div class="thead">
                      <span class="trow">
                        <span class="tcolumn"
                          style="flex:1.8">扣款单位</span>
                        <span class="tcolumn">扣款金额</span>
                        <span class="tcolumn"
                          style="flex:1.8">扣款原因</span>
                      </span>
                    </div>
                    <div class="tbody">
                      <span class="trow"
                        v-for="(itemD,indexD) in item.detailInfo"
                        :key="indexD">
                        <span class="tcolumn"
                          style="flex:1.8">{{itemD.client_name}}</span>
                        <span class="tcolumn">{{itemD.deduct_price}}元</span>
                        <span class="tcolumn"
                          style="flex:1.8">{{itemD.desc || '/'}}</span>
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
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为取消，是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
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
          <div class="btn btnBlue"
            @click="$router.push('/order/orderCreate?orderId=' + $route.params.id)">复制此订单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { moneyArr } from '@/assets/js/dictionary.js'
import { order, weave, packPlan, finance, materialManage, yarn, material, packag, stock, chargebacks } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      canSeePriceFlag: false,
      tableType: 'table',
      orderInfo: {
        order_code: '',
        batch_info: [],
        batch_info_new: [],
        order_time: ''
      },
      productList: [],
      timeProgressInfo: [],
      productProgInfo: [],
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
      // 财务详情数据
      orderFinanceDetail: []
    }
  },
  methods: {
    useCallback (item) {
      if ((item.detailInfo && item.detailInfo.length > 0) || item.showDetail) {
        item.showDetail = !item.showDetail
      } else {
        this[item.callback](item, (e = [], key = item.key, showFlag = true) => {
          item.detailInfo = e
          item.showDetail = !item.showDetail
        })
      }
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
        this.orderInfo.batch_info_new = this.orderInfo.batch_info.map((itemBatch) => {
          // 把产品编号相同的先合并一下
          let productInfo = this.$mergeData(itemBatch.product_info.map(itemM => {
            return {
              ...itemM,
              product_id: itemM.product_id
            }
          }), { mainRule: 'product_id', otherRule: [{ name: 'product_code' }, { name: 'category_info' }, { name: 'image' }, { name: 'unit_price/price' }], childrenName: 'other_info' })
          let productInfoData = productInfo.map(itemM => {
            let sizeArr = []
            let colorArr = []
            itemM.other_info.forEach(itemOther => {
              let sizeFlag = sizeArr.find(itemF => itemF.size_name === itemOther.size_name)
              if (sizeFlag) {
                sizeFlag.number = (Number(sizeFlag.number) || 0) + (Number(itemOther.numbers) || 0)
              } else {
                sizeArr.push({
                  size_name: itemOther.size_name,
                  number: itemOther.numbers
                })
              }
              let colorFlag = colorArr.find(itemColor => itemColor.color_name === itemOther.color_name)
              if (!colorFlag) {
                colorArr.push({
                  color_name: itemOther.color_name,
                  [itemOther.size_name]: itemOther.numbers,
                  number: itemOther.numbers
                })
              } else {
                if (colorFlag[itemOther.size_name]) {
                  colorFlag[itemOther.size_name] = (Number(colorFlag[itemOther.size_name]) || 0) + (Number(itemOther.numbers) || 0)
                } else {
                  colorFlag[itemOther.size_name] = itemOther.numbers
                }
                colorFlag.number = (Number(colorFlag.number) || 0) + (Number(itemOther.numbers) || 0)
              }
            })
            return {
              product_code: itemM.product_code,
              product_id: itemM.product_id,
              type: [itemM.category_info.category_name, itemM.category_info.type_name, itemM.category_info.style_name],
              image: itemM.image,
              unit: itemM.category_info.unit,
              price: itemM.price,
              size_info: sizeArr,
              color_info: colorArr,
              number: sizeArr.map(itemS => (+itemS.number || 0)).reduce((a, b) => {
                return a + b
              }, 0)
            }
          })
          return {
            batch_id: itemBatch.batch_id,
            name: itemBatch.batch_title,
            remark: itemBatch.desc,
            type: itemBatch.order_type,
            delivery_time: itemBatch.delivery_time,
            product_info: productInfoData
          }
        })
        let productList = []
        let numArr = this.$flatten(res[0].data.data.batch_info.map(item => {
          return item.product_info.map(itemNum => Number(itemNum.numbers))
        }))
        this.product_order_total_number = numArr.length > 0 ? numArr.reduce((a, b) => a + b) : 0
        res[0].data.data.batch_info.forEach(itemBatch => {
          itemBatch.product_info.forEach(itemPro => {
            if (!productList.find(item => item.product_id === itemPro.product_id)) {
              productList.push({
                product_id: itemPro.product_id,
                size: itemPro.all_size,
                color: itemPro.all_color,
                image: itemPro.image,
                product_code: itemPro.product_code,
                category_info: itemPro.category_info
              })
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
        // 处理是否有权限查看价格
        let orderData = res[0].data.data
        if (window.sessionStorage.getItem('user_id') === orderData.user_id || +window.sessionStorage.getItem('has_check') > 0) {
          this.canSeePriceFlag = true
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
          this.orderFinanceDetail = [
            {
              name: '订单产值',
              unit: '件',
              price_info: [{
                number: data.order.total_number,
                total_price: data.order.order_total_value,
                pre_price: data.order.order_pre_value
              }],
              showDetail: false,
              hasDetail: null,
              detailInfo: []
            },
            {
              name: '原料采购信息',
              unit: 'kg',
              price_info: [
                {
                  name: '入库',
                  number: data.material_order.order_number.number,
                  total_price: data.material_order.order_number.total_value,
                  pre_price: data.material_order.order_number.pre_value
                }
              ],
              showDetail: false,
              hasDetail: 'material',
              callback: 'getMaterialOrderDetail',
              type: 1,
              detailInfo: []
            },
            {
              name: '辅料采购信息',
              unit: '件',
              price_info: [{
                number: data.assist_material_order.number,
                total_price: data.assist_material_order.total_value,
                pre_price: data.assist_material_order.pre_value
              }],
              showDetail: false,
              hasDetail: 'material',
              callback: 'getMaterialOrderDetail',
              type: 2,
              detailInfo: []
            },
            ...Object.entries(data.product_weave.detail_data).map(itemM => {
              return {
                name: `${itemM[0]}信息`,
                unit: '件',
                price_info: [
                  {
                    number: itemM[1] && itemM[1].total_number,
                    total_price: itemM[1] && itemM[1].total_value,
                    pre_price: itemM[1] && itemM[1].pre_value
                  }
                ],
                showDetail: false,
                hasDetail: 'production',
                callback: 'getProductionDetail',
                type: itemM[0],
                detailInfo: []
              }
            }),
            {
              name: '包装辅料订购',
              unit: '个',
              price_info: [{
                number: data.pack_order.number,
                total_price: data.pack_order.total_value,
                pre_price: data.pack_order.pre_value
              }],
              showDetail: false,
              hasDetail: 'pack',
              callback: 'getPackOrderDetail',
              type: null,
              detailInfo: []
            },
            {
              name: '扣款金额',
              unit: '元',
              price_info: [{
                number: 0,
                total_price: data.deduct_price,
                pre_price: 0
              }],
              showDetail: false,
              hasDetail: 'deduct',
              callback: 'getChargebacks',
              type: null,
              detailInfo: []
            }
          ]
        }
        this.loading = false
      })
    },
    // 财务概述-物料概述
    getMaterialOrderDetail (item, cb) {
      this.loading = true
      materialManage.detail({
        order_type: 1,
        order_id: this.$route.params.id
      }).then(res => {
        let data = res.data.data.filter(itemF => +itemF.material_type === +item.type).map(itemM => {
          return {
            client_id: itemM.client_id,
            client_name: itemM.client_name,
            material_name: itemM.material_name,
            material_color: itemM.color_code,
            order_weight: itemM.weight,
            push_weight: itemM.push_weight,
            price: itemM.price,
            unit: itemM.unit || (+item.type === 1 ? 'kg' : '个')
          }
        })
        let returnData = this.$mergeData(data, {
          mainRule: 'client_id',
          otherRule: [
            { name: 'client_name' }
          ],
          childrenName: 'material_info',
          childrenRule: {
            mainRule: 'material_name',
            childrenName: 'attr_info',
            childrenRule: {
              mainRule: ['material_color/attr', 'price'],
              otherRule: [
                { name: 'order_weight/order_number', type: 'add' },
                { name: 'push_weight', type: 'add' },
                { name: 'unit' }
              ]
            }
          }
        })
        returnData.forEach(itemC => {
          itemC.total_price = this.$toFixed(itemC.material_info.map(itemM => {
            return itemM.attr_info.map(itemA => ((itemA.price * itemA.push_weight) || 0)).reduce((a, b) => {
              return a + b
            }, 0)
          }).reduce((a, b) => {
            return a + b
          }, 0))
        })
        if (returnData.length > 0) {
        } else {
          this.$message.error('暂无物料信息')
        }
        cb(returnData)
        this.loading = false
      })
    },
    // 财务概述-生产概述
    getProductionDetail (item, cb) {
      this.loading = true
      Promise.all([
        weave.detail({
          order_id: this.$route.params.id,
          order_type: 1
        })
      ]).then(res => {
        let data = this.$mergeData(res[0].data.data.filter(itemF => itemF.process === item.type).map(itemM => {
          return {
            client_id: itemM.client_id,
            client_name: itemM.client_name,
            product_id: itemM.product_id,
            product_type: [itemM.product_info.category_name, itemM.product_info.type_name, itemM.product_info.style_name].join('/'),
            image: itemM.product_info.image,
            product_code: itemM.product_info.product_code,
            product_title: itemM.product_info.product_title,
            size_id: itemM.size_id,
            size_name: itemM.size_name,
            color_id: itemM.color_id,
            color_name: itemM.color_name,
            price: itemM.price,
            number: itemM.number,
            total_price: itemM.price * itemM.number,
            motorise_number: itemM.motorise_number,
            rejects_number: 0
          }
        }).sort((a, b) => {
          let aStr = a.color_name + '/' + a.size_name
          let bStr = b.color_name + '/' + b.size_name
          return aStr.localeCompare(bStr)
        }), {
          mainRule: 'client_id',
          otherRule: [
            { name: 'client_name' }
          ],
          childrenName: 'product_info',
          childrenRule: {
            mainRule: 'product_id',
            otherRule: [
              { name: 'product_type' },
              { name: 'image' },
              { name: 'product_code' },
              { name: 'product_title' }
            ],
            childrenName: 'size_color_info',
            childrenRule: {
              mainRule: ['size_id', 'color_id', 'price'],
              otherRule: [
                { name: 'size_name' },
                { name: 'color_name' },
                { name: 'number', type: 'add' },
                { name: 'total_price', type: 'add' },
                { name: 'motorise_number', type: 'add' }
              ]
            }
          }
        })
        if (data.length === 0) {
          this.$message.error(`暂无${item.key}信息`)
        }
        cb(data)
        this.loading = false
      })
    },
    // 财务概述-包装辅料订购
    getPackOrderDetail (item, cb) {
      this.loading = true
      packPlan.packOrderLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          let returnData = this.$mergeData(res.data.data, {
            mainRule: 'client_id',
            otherRule: [
              { name: 'client_name' }
            ],
            childrenName: 'pack_info',
            childrenRule: {
              mainRule: ['material_name/pack_name', 'price'],
              otherRule: [
                { name: 'number/order_number', type: 'add' },
                { name: 'total_price', type: 'add' },
                { name: 'order_time/compiled_time' },
                { name: 'unit' }
              ]
            }
          })
          if (returnData.length === 0) {
            this.$message.error('暂无包装订购信息')
          }
          cb(returnData)
        }
        this.loading = false
      })
    },
    // 财务概述-扣款金额
    getChargebacks (item, cb) {
      this.loading = true
      chargebacks.log({
        order_id: this.$route.params.id,
        order_type: 1
      }).then(res => {
        if (res.data.status !== false) {
          console.log(res)
          let returnData = res.data.data
          if (returnData.length === 0) {
            this.$message.error('暂无扣款信息')
          }
          cb(returnData)
        }
        this.loading = false
      })
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
            } else {
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
  created () {
    this.init()
    this.getFinanceDetail()
  },
  filters: {
    filterType (item) {
      return item.is_part === 2 ? item.name : [item.category_name, item.type_name, item.style_name].join('/')
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
