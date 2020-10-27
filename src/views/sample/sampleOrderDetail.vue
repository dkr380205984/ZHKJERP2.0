<template>
  <div id='orderDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">样品订单信息</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnGray"
              style="line-height:36px;"
              @click="changeOrderStatus('showCanclePopup')"
              v-if="sampleOrderInfo.status === 3001 || sampleOrderInfo.status === 3002">取消订单</div>
            <div class="btn btnGreen"
              style="height:38px;line-height:38px;margin-right:16px"
              @click="changeOrderStatus('waitConfirm')"
              v-if="sampleOrderInfo.status === 3002">待客户确定</div>
            <el-menu mode="horizontal">
              <el-menu class="editMenu"
                mode="horizontal"
                @select="changeOrderStatus">
                <el-submenu index="1"
                  v-if="sampleOrderInfo.status === 3002 || sampleOrderInfo.status === 3004"
                  popper-class='handleMenuSample'>
                  <template slot="title">已确定</template>
                  <!-- <el-menu-item index="continue"
                    class="elMenuItem">继续打样</el-menu-item> -->
                  <el-menu-item index="addOrder"
                    class="elMenuItem"
                    v-if="sampleOrderInfo.status === 3002 || sampleOrderInfo.status === 3004">大货生产</el-menu-item>
                  <!-- <el-menu-item index="waitOrder"
                    class="elMenuItem"
                    v-if="sampleOrderInfo.status === 3002 || sampleOrderInfo.status === 3004">待下单</el-menu-item> -->
                  <!-- <el-menu-item index="ok"
                    class="elMenuItem"
                    v-if="sampleOrderInfo.status === 3002">待下单</el-menu-item> -->
                </el-submenu>
              </el-menu>
            </el-menu>
            <el-menu mode="horizontal"
              class="orange"
              style="margin-left:16px">
              <el-menu class="editMenu"
                mode="horizontal"
                @select="changeOrderStatus">
                <el-submenu index="1"
                  v-if="sampleOrderInfo.status !== 3003 "
                  popper-class='handleMenuSample'>
                  <template slot="title">不确定</template>
                  <el-menu-item index="continue"
                    class="elMenuItem orange">继续打样</el-menu-item>
                  <!-- <el-menu-item index="addOrder"
                    class="elMenuItem"
                    v-if="sampleOrderInfo.status === 3002 || sampleOrderInfo.status === 3004">结束打样</el-menu-item> -->
                  <el-menu-item index="endOrder"
                    class="elMenuItem orange">结束打样</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-menu>
          </div>
          <div class="otherInfo"
            style="flex-direction:row">
            <div class="block">
              <span class="label">状态</span>
              <span :class="{'text':true,'orange':sampleOrderInfo.status === 3001, 'blue':sampleOrderInfo.status === 3002,'red':sampleOrderInfo.status === 3003,'green':sampleOrderInfo.status === 3004}">{{sampleOrderInfo.status|filterStatus}}</span>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">样单号：</span>
            <span class="text">{{sampleOrderInfo.title}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{sampleOrderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{sampleOrderInfo.user_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{sampleOrderInfo.group_name}}</span>
          </div>
        </div>
        <zh-transition :list='sampleOrderArr'
          showKey='showComponentsName'
          @changed='cutSampleOrderInfo'></zh-transition>
      </div>
    </div>
    <zh-confirm-module title_has_border
      :orderId="activeSampleOrderId"
      canChange
      :orderInfo='sampleOrderInfo'
      @change="init" />
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">打样信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户确认：</span>
            <span class="text"
              :class="{'orange':sampleOrderInfo.client_confirm !== 2 && sampleOrderInfo.client_confirm !== 3,'green':sampleOrderInfo.client_confirm === 2,'red':sampleOrderInfo.client_confirm === 3}">{{sampleOrderInfo.client_confirm|filterSampleStatus}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样单类型：</span>
            <span class="text">{{sampleOrderInfo.type}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{sampleOrderInfo.order_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">客户付费：</span>
            <span class="text">
              <div class="btn btnWhiteBlue"
                v-if="!sampleOrderInfo.isClientPay"
                @click="changeOrderStatus('CustomerPayFlag')">付费</div>
              <template v-else>{{sampleOrderInfo.clientPayPrice}}元</template>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息</span>
            <span class="text">{{sampleOrderInfo.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">打样信息</span>
      </div>
      <div class="detailCtn">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">样品编号</span>
              <span class="tcolumn center">产品图片</span>
              <span class="tcolumn noPad flex2">
                <span class="trow">
                  <span class="tcolumn">尺码/颜色</span>
                  <span class="tcolumn">打样数量</span>
                  <span class="tcolumn">单价</span>
                </span>
              </span>
              <span class="tcolumn center">相关信息</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(itemPro,indexPro) in sampleOrderInfo.product_info"
              :key="indexPro">
              <span class="tcolumn">
                <div class="twoLineText">
                  <span @click="$openUrl('/sample/sampleDetail/' + itemPro.id)"
                    style="color:#1A95FF;cursor: pointer;">{{itemPro.product_info.product_code}}</span>
                  <span>({{itemPro.product_info|filterType}})</span>
                </div>
              </span>
              <span class="tcolumn ">
                <span class="trow middle_page">
                  <zh-img-list :list="itemPro.product_info.image"></zh-img-list>
                </span>
              </span>
              <span class="tcolumn flex2 noPad">
                <span class="trow"
                  v-for="(itemSize,indexSize) in itemPro.size_info"
                  :key="indexSize">
                  <span class="tcolumn">{{itemSize.size + ' / ' + itemSize.color}}</span>
                  <span class="tcolumn">{{itemSize.numbers + itemPro.product_info.unit}}</span>
                  <span class="tcolumn">{{itemSize.payPrice ? itemSize.payPrice : '待定'}}</span>
                </span>
              </span>
              <span class="tcolumn center">
                <span class="trow middle_page">
                  <!-- <span class="btn noBorder lineH54"
                    @click="$openUrl('/craft/craftDetail/' + itemPro.id.product_id + '/2')">工艺单</span>
                  <span class="btn noBorder lineH54"
                    @click="$openUrl('/productPlan/productPlanDetail/' + itemPro.id.product_id + '/2')">配料单</span> -->
                  <span class="btn noBorder lineH54"
                    style="margin:0"
                    @click="$openUrl('/sample/sampleDetail/' + itemPro.id)">查看详情</span>
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
                    <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link"
                        style="margin-left:4px">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialPlan/materialPlanDetail/'+ activeSampleOrderId +'/2')">物料计划</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/material/materialDetail/'+ activeSampleOrderId +'/1/2/normal')">原料订购加工</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialStock/materialStockDetail/'+activeSampleOrderId +'/1/2')">原料出入库</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/material/materialDetail/'+activeSampleOrderId +'/2/2/normal')">辅料订购加工</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/materialStock/materialStockDetail/'+ activeSampleOrderId +'/2/2')">辅料出入库</span>
                      </div>
                    </span>
                  </div>
                </div>
              </template>
              <template v-if="index===1&&showFlag2.showWeave">
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
                    <span class="extra">
                      <div class="label">相关页面：</div>
                      <div class="link"
                        style="margin-left:4px">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/weavingProcessing/weavingDetail/'+ activeSampleOrderId +'/2')">生产织造</span>
                      </div>
                      <div class="link">
                        <i class="el-icon-tickets"
                          style="color:#1a95ff"></i>
                        <span @click="$router.push('/weavingProcessing/processingDetail/'+ activeSampleOrderId +'/2')">半成品加工</span>
                      </div>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
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
              v-for="(item,index) in orderDetailInfo.finance.finance"
              :key="index">
              <span class="tcolumn">{{item.name}}</span>
              <span class="tcolumn noPad flex30">
                <span class="trow"
                  v-for="(itemPrice,indexPrice) in item.price_info"
                  :key="indexPrice">
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.number && !itemPrice.name}">{{itemPrice.name}}{{itemPrice.number ? itemPrice.number + item.unit : ''}}</span>
                  <span class="tcolumn green"
                    :class="{'noData':!itemPrice.total_price}">{{itemPrice.total_price ? itemPrice.total_price + (item.priceUnit ? item.priceUnit : '元') : ''}}</span>
                  <span class="tcolumn"
                    :class="{'noData':!itemPrice.pre_price}">{{itemPrice.pre_price ? itemPrice.pre_price + (item.priceUnit ? item.priceUnit : '元') + '' + item.unit: ''}}</span>
                </span>
              </span>
              <span class="tcolumn"
                style="border-right:0">
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.yarnOrder.length>0?showFlag.showYarnOrder = !showFlag.showYarnOrder : activeFinanceTitle = 'yarnOrder'"
                  v-if="item.price_info[0].number && index===0">{{showFlag.showYarnOrder?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===0">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.yarnProcess.length>0?showFlag.showYarnProcess = !showFlag.showYarnProcess : activeFinanceTitle = 'yarnProcess'"
                  v-if="item.price_info[0].number  && index===1">{{showFlag.showYarnProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===1">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.materialOrder.length>0?showFlag.showMaterialOrder = !showFlag.showMaterialOrder : activeFinanceTitle = 'materialOrder'"
                  v-if="item.price_info[0].number && index===2">{{showFlag.showMaterialOrder?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===2">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.materialProcess.length>0?showFlag.showMaterialProcess = !showFlag.showMaterialProcess : activeFinanceTitle = 'materialProcess'"
                  v-if="item.price_info[0].number && index===3">{{showFlag.showMaterialProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===3">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.weave.length>0?showFlag.showWeave = !showFlag.showWeave : activeFinanceTitle = 'weave'"
                  v-if="item.price_info[0].number && index===4">{{showFlag.showWeave?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===4">暂无数据</div>
                <div style="color:#1a95ff;cursor:pointer"
                  @click="orderDetailInfo.finance.process.length>0?showFlag.showProcess = !showFlag.showProcess : activeFinanceTitle = 'process'"
                  v-if="item.price_info[0].number && index===5">{{showFlag.showProcess?'收起列表':'展开详情'}}</div>
                <div style="color:#ccc;cursor:not-allowed"
                  v-if="!item.price_info[0].number && index===5">暂无数据</div>
              </span>
              <div class="hideTbCtn">
                <template v-if="index===0 && showFlag.showYarnOrder">
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
                        <span class="tcolumn">
                          <span class="green">{{Number(item.type) === 1 ? '调取' : '订购'}}</span>
                          {{item.client_name || item.stock_name}}
                        </span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.material_info"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name}}</span>
                            <span class="tcolumn">{{itemMa.color}}</span>
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
                <template v-if="index===1 && showFlag.showYarnProcess">
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
                <template v-if="index===2 && showFlag.showMaterialOrder">
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
                        <span class="tcolumn">
                          <span class="green">{{Number(item.type) === 1 ? '调取' : '订购'}}</span>
                          {{item.client_name|| item.stock_name}}
                        </span>
                        <span class="tcolumn noPad flex5">
                          <span class="trow"
                            v-for="(itemMa,indexMa) in item.material_info"
                            :key="indexMa">
                            <span class="tcolumn">{{itemMa.material_name}}</span>
                            <span class="tcolumn">{{itemMa.color}}</span>
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
                <template v-if="index===3 && showFlag.showMaterialProcess">
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
                <template v-if="index===4 && showFlag.showWeave">
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
                <template v-if="index===5 && showFlag.showProcess">
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
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 转产品窗口 -->
    <div class="popup"
      v-show="changeSampleForProductPopup">
      <div class="main">
        <div class="title">
          <span class="text">样品转产品</span>
          <span class="el-icon-close  "
            @click="closePopup"></span>
        </div>
        <div class="content steps">
          <el-steps :active="changeSampleForProductPopup-1"
            finish-status="success"
            align-center>
            <el-step title="样品转产品"></el-step>
            <el-step title="确认完成"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div class="content"
          v-if=" changeSampleForProductPopup === 1">
          <div class="row">
            <el-checkbox-group v-model="sampleForProductId"
              class="col">
              <el-checkbox v-for="(itemPro,indexPro) in productList"
                class="elRadio"
                :key='indexPro'
                :label="itemPro.product_id">{{itemPro.product_code}}({{itemPro|filterType}})</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="content center_popup"
          v-if="changeSampleForProductPopup === 2 || changeSampleForProductPopup === 3">
          <!-- <div class="row"> -->
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为“已完成”，客户确认状态为“客户已确定”，并且将已选中的样品转为产品（其默认配料单以及工艺单会转为该产品配料单以及工艺单），是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
          <!-- </div> -->
        </div>
        <div class="opr">
          <div class="btn btnGray"
            v-show="changeSampleForProductPopup === 1"
            @click="closePopup">取消</div>
          <div class="btn btnGray"
            v-show="changeSampleForProductPopup > 1 && (isCommit === 'before' || isCommit === 'error')"
            @click="changeSampleForProductPopup--">上一步</div>
          <div class="btn btnBlue"
            v-show="changeSampleForProductPopup < 2"
            @click="changeSampleForProductPopup++">下一步</div>
          <div class="btn btnBlue"
            v-show="changeSampleForProductPopup === 2 && isCommit === 'before'"
            @click="changeOrderStatus('sampleForProduct')">确定</div>
          <div class="btn btnBlue"
            v-show="changeSampleForProductPopup === 2 && isCommit === 'error'"
            @click="changeOrderStatus('sampleForProduct')">重试<em class="el-icon-refresh-left"></em></div>
          <div class="btn btnBlue"
            v-if="changeSampleForProductPopup === 2  && isCommit === 'commit'">提交中<em class="el-icon-loading"></em></div>
          <div class="btn btnBlue"
            v-if="changeSampleForProductPopup === 3 && isCommit === 'compiled' && !this.isOkStatus"
            @click="$router.push('/order/orderCreate?sampleOrderId=' + $route.params.id)">添加订单</div>
          <div class="btn btnBlue"
            v-if="changeSampleForProductPopup === 3 && isCommit === 'compiled'"
            @click="closePopup">完成</div>
        </div>
      </div>
    </div>
    <!-- 继续打样 -->
    <div class="popup"
      v-show="showChangeSampleOrderPopup">
      <div class="main">
        <div class="title">
          <span class="text">继续打样</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="content steps">
          <el-steps :active="showChangeSampleOrderPopup-1"
            finish-status="success"
            align-center>
            <!-- <el-step title="打样信息"></el-step> -->
            <!-- <el-step title="客户付费"></el-step> -->
            <el-step title="提交客户信息"></el-step>
            <el-step title="新增打样订单"></el-step>
          </el-steps>
        </div>
        <div class="content center_popup"
          v-if="showChangeSampleOrderPopup === 1 || showChangeSampleOrderPopup === 2">
          <!-- <span class="el-icon-warning-outline orange">确认提交后将修改该订单状态为“已完成”，客户确认状态为“客户不确定”，是否继续?</span> -->
          <!-- <div class="row"> -->
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为“已完成”，客户确认状态为“客户不确定”，是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
          <!-- </div> -->
        </div>
        <div class="content"
          v-if="showChangeSampleOrderPopup === 3">
          <div class="row">
            <el-radio-group v-model="changeSampleId"
              class="col">
              <el-radio v-for="(itemPro,indexPro) in productList"
                class="elRadio"
                :key='indexPro'
                :label="itemPro.product_id">{{itemPro.product_code}}({{itemPro|filterType}})</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- <div class="content"
          v-if="showChangeSampleOrderPopup === 2">
          <div class="row">
            <span class="label">样单类型：</span>
            <span class="info">
              <el-select v-model="continueSampleInfo.type"
                placeholder="请选择打样类型">
                <el-option v-for="item in sampleTypeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemPro,indexPro) in continueSampleInfo.product_info">
            <div class="row"
              :key="indexPro+'code'">
              <span class="label">样品信息{{indexPro + 1}}：</span>
              <span class="info">
                <el-select v-model="itemPro.product_id"
                  filterable
                  placeholder="请选择打样类型"
                  @change="changeProductSizeColorArr(itemPro,$event)">
                  <el-option v-for="item in productList"
                    :key="item.product_id"
                    :label="item.product_code"
                    :value="item.product_id">
                  </el-option>
                </el-select>
              </span>
              <span v-if="indexPro === 0"
                class="editBtn blue"
                @click="addItem(continueSampleInfo.product_info,'continueSample')">添加</span>
              <span v-else
                class="editBtn red"
                @click="deleteItem(continueSampleInfo.product_info,indexPro)">删除</span>
            </div>
            <div class="row"
              :key="indexPro + 'info'">
              <span class="label">尺码信息：</span>
              <span class="info popup_info_page">
                <el-cascader class="elInput"
                  v-model="itemPro.size_color"
                  placeholder='尺码/颜色'
                  :options="itemPro.sizeColorArr"></el-cascader>
                <zh-input v-model="itemPro.number"
                  class="elInput"
                  type='number'
                  placeholder='数量'>
                  <template slot="append">{{itemPro.unit}}</template>
                </zh-input>
              </span>
            </div>
          </template>
          <div class="row">
            <span class="label">完成时间：</span>
            <span class="info">
              <el-date-picker v-model="continueSampleInfo.time"
                type="date"
                style="width:100%"
                value-format="yyyy-MM-dd"
                placeholder="选择完成日期">
              </el-date-picker>
            </span>
          </div>
        </div> -->
        <!-- <div class="content"
          v-if="showChangeSampleOrderPopup === 3">
          <div class="row">
            <span class="label">客户付费：</span>
            <span class="info info_col_middle">
              <el-switch v-model="continueSampleInfo.isCustomerPay"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </span>
          </div>
          <template v-if="continueSampleInfo.isCustomerPay">
            <template v-for="(itemPro,indexPro) in continueSampleInfo.product_info">
              <div class="row"
                :key="indexPro+'code'">
                <span class="label"></span>
                <span class="info">
                  <el-select v-model="itemPro.product_id"
                    filterable
                    disabled
                    placeholder="请选择打样类型"
                    @change="changeProductSizeColorArr(itemPro,$event)">
                    <el-option v-for="item in productList"
                      :key="item.product_id"
                      :label="item.product_code"
                      :value="item.product_id">
                    </el-option>
                  </el-select>
                </span>
              </div>
              <div class="row"
                :key="indexPro + 'info'">
                <span class="label"></span>
                <span class="info popup_info_page">
                  <el-cascader class="elInput"
                    v-model="itemPro.size_color"
                    placeholder='尺码/颜色'
                    disabled
                    :options="itemPro.sizeColorArr"></el-cascader>
                  <zh-input v-model="itemPro.numbers"
                    class="elInput"
                    type='number'
                    placeholder='付费数量'
                    @input="itemPro.total_price = (Number(itemPro.numbers) || 0) * (Number(itemPro.price) || 0)">
                    <template slot="append">{{itemPro.unit}}</template>
                  </zh-input>
                </span>
              </div>
              <div class="row"
                :key="indexPro + 'price'">
                <span class="label"></span>
                <span class="info popup_info_page">
                  <zh-input v-model="itemPro.price"
                    class="elInput"
                    type='number'
                    placeholder='单价'
                    @input="itemPro.total_price = (Number(itemPro.numbers) || 0) * (Number(itemPro.price) || 0)">
                    <template slot="append">元</template>
                  </zh-input>
                  <zh-input v-model="itemPro.total_price"
                    class="elInput"
                    type='number'
                    placeholder='总价'>
                    <template slot="append">元</template>
                  </zh-input>
                </span>
              </div>
            </template>
          </template>
        </div> -->

        <div class="opr">
          <div class="btn btnGray"
            v-show="showChangeSampleOrderPopup === 1"
            @click="closePopup">取消</div>
          <div class="btn btnGray"
            v-show="showChangeSampleOrderPopup === 3"
            @click="showChangeSampleOrderPopup = 1">上一步</div>
          <div class="btn btnBlue"
            v-show="showChangeSampleOrderPopup === 3"
            @click="changeSampleId ? $openUrl(`/sample/sampleCreate?sampleId=${changeSampleId}&clientId=${sampleOrderInfo.client_id}&contacts_id=${sampleOrderInfo.contacts_id}&parentId=${$route.params.id}`) : $message.warning('请选择需要修改的样品')">去修改</div>
          <div class="btn btnBlue"
            v-show="showChangeSampleOrderPopup === 1 && isCommit === 'before'"
            @click="changeOrderStatus('continueSample')">确定</div>
          <div class="btn btnBlue"
            v-show="showChangeSampleOrderPopup === 1 && isCommit === 'error'"
            @click="changeOrderStatus('continueSample')">重试<em class="el-icon-refresh-left"></em></div>
          <div class="btn btnBlue"
            v-if="showChangeSampleOrderPopup === 1  && isCommit === 'commit'">提交中<em class="el-icon-loading"></em></div>
          <div class="btn btnBlue"
            v-show="showChangeSampleOrderPopup < 3 && isCommit === 'compiled'"
            @click="showChangeSampleOrderPopup = 3">下一步</div>
          <!-- <div class="btn btnBlue"
            v-if="showChangeSampleOrderPopup === 2 && isCommit === 'compiled'"
            @click="closePopup">完成</div> -->
        </div>
      </div>
    </div>
    <!-- 取消样单 -->
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
                <el-option v-for="item in stockList.filter(item=> +item.type === 1)"
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
                <el-option v-for="item in stockList.filter(item=> +item.type === 2)"
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
        <div class="content center_popup"
          v-if="showCanclePopup === 3 || showCanclePopup === 4">
          <!-- <div class="row"> -->
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为“已取消”，是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
          <!-- </div> -->
        </div>
        <div class="opr"
          style="justify-content: space-between;">
          <div>
            <div class="btn btnGray"
              @click="clearData(showCanclePopup)"
              v-if='(showCanclePopup === 1 || showCanclePopup === 2)'>清空该页数据</div>
          </div>
          <div style="display:flex;">
            <div class="btn btnGray"
              v-if="showCanclePopup === 1"
              @click="closePopup">取消</div>
            <div class="btn btnGray"
              v-if="showCanclePopup<3"
              @click="jumpGoStock">跳过结余</div>
            <div class="btn btnGray"
              v-if="showCanclePopup > 1 && (isCommit === 'before' || isCommit === 'error')"
              @click="showCanclePopup--">上一步</div>
            <div class="btn btnBlue"
              v-if="showCanclePopup < 3"
              @click="showCanclePopup++">下一步</div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 3 && isCommit === 'before'"
              @click="changeOrderStatus('cancle')">确定</div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 3 && isCommit === 'error'"
              @click="changeOrderStatus('cancle')">重试<em class="el-icon-refresh-left"></em></div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 3  && isCommit === 'commit'">提交中<em class="el-icon-loading"></em></div>
            <div class="btn btnBlue"
              v-if="showCanclePopup === 4 && isCommit === 'compiled'"
              @click="closePopup">完成</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 客户付费 -->
    <div class="popup"
      v-if="customerPayPopupFlag">
      <div class="main">
        <div class="title">
          <span class="text">客户付费</span>
          <span class="el-icon-close"
            @click="customerPayPopupFlag = false"></span>
        </div>
        <div class="content">
          <!-- <div class="row">
            <span class="label">客户付费：</span>
            <span class="info info_col_middle">
              <el-switch v-model="continueSampleInfo.isCustomerPay"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </span>
          </div> -->
          <!-- <template v-if="continueSampleInfo.isCustomerPay"> -->
          <template v-for="(itemPro,indexPro) in continueSampleInfo.product_info">
            <div class="row"
              :key="indexPro+'code'">
              <!-- <span class="label"></span> -->
              <span class="info">
                <el-select v-model="itemPro.product_id"
                  filterable
                  disabled
                  placeholder="请选择样品"
                  @change="changeProductSizeColorArr(itemPro,$event)">
                  <el-option v-for="item in productList"
                    :key="item.product_id"
                    :label="item.product_code"
                    :value="item.product_id">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div class="row"
              :key="indexPro + 'info'">
              <!-- <span class="label"></span> -->
              <span class="info popup_info_page">
                <el-cascader class="elInput"
                  v-model="itemPro.size_color"
                  placeholder='尺码/颜色'
                  disabled
                  :options="itemPro.sizeColorArr"></el-cascader>
                <zh-input v-model="itemPro.numbers"
                  class="elInput"
                  type='number'
                  placeholder='付费数量'
                  @input="itemPro.total_price = (Number(itemPro.numbers) || 0) * (Number(itemPro.price) || 0)">
                  <template slot="append">{{itemPro.unit}}</template>
                </zh-input>
              </span>
            </div>
            <div class="row"
              :key="indexPro + 'price'">
              <!-- <span class="label"></span> -->
              <span class="info popup_info_page">
                <zh-input v-model="itemPro.price"
                  class="elInput"
                  type='number'
                  placeholder='单价'
                  @input="itemPro.total_price = (Number(itemPro.numbers) || 0) * (Number(itemPro.price) || 0)">
                  <template slot="append">元</template>
                </zh-input>
                <zh-input v-model="itemPro.total_price"
                  class="elInput"
                  type='number'
                  placeholder='总价'>
                  <template slot="append">元</template>
                </zh-input>
              </span>
            </div>
          </template>
          <!-- </template> -->
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="customerPayPopupFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="changeOrderStatus('customerPay')">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            v-if="sampleOrderInfo.status === 3001 || sampleOrderInfo.status === 3002"
            @click="changeOrderStatus('change')">修改</div>
          <div class="btn btnBlue"
            @click="$router.push('/sample/sampleOrderCreate?orderId=' + $route.params.id)">复制此样单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { sampleOrder, materialPlan, materialStock, weave, processing, finance, materialManage, materialProcess, yarn, material, stock, orderType } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
      sampleOrderArr: [],
      activeSampleOrderId: '',
      sampleOrderInfo: {},
      productList: [],
      timeProgressInfo: [],
      productProgInfo: [],
      orderDetailInfo: {
        'material': [],
        'production': [],
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
            }
          ],
          finance: [],
          yarnOrder: [],
          yarnProcess: [],
          materialOrder: [],
          materialProcess: [],
          weave: [],
          process: [],
          warnData: {
            isOpenWarn: false,
            startTime: this.$getTime(),
            endTime: this.$getTime(),
            warnArr: []
          }
        }
      },
      activeDetailTitle: '',
      activeFinanceTitle: '',
      product_order_total_number: '',
      // changeSamplePopup: false, // 修改样品信息弹窗flag
      changeSampleId: '', // 选中要修改的样品id
      showChangeSampleOrderPopup: false, // 继续打样窗口flag
      continueSampleInfo: {
        type: '',
        product_info: [],
        time: '',
        isCustomerPay: false
      }, // 继续打样信息
      sampleTypeArr: [],
      showCanclePopup: false, // 取消样单弹窗flag
      cancleYarn: [],
      cancleMaterial: [],
      yarnList: [],
      materialList: [],
      isCommit: 'before',
      stockList: [],
      yarnStockId: '',
      materialStockId: '',
      changeSampleForProductPopup: false, // 样品转为产品窗口
      sampleForProductId: [],
      isOkStatus: false,
      customerPayPopupFlag: false, // 客户付费窗口flag
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
        showOutStock: false
      },
      showFlag2: {
        showMaterial: false,
        showWeave: false,
        showIns: false,
        showOut: false
      }
    }
  },
  methods: {
    // 取消样单时跳过结余操作
    jumpGoStock () {
      this.showCanclePopup = 3
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
    },
    init (type) {
      this.loading = true
      orderType.typeList({
        order_type: 2
      }).then(res => {
        if (res.data.status !== false) {
          this.sampleTypeArr = res.data.data
        }
      })
      sampleOrder.detail({
        id: this.$route.params.id
      }).then(res => {
        let sampleOrderInfo = res.data.data
        this.sampleOrderArr = [sampleOrderInfo].concat(this.$clone(sampleOrderInfo.child_data || [])).map((item, index) => {
          item.product_info.forEach(itemPro => {
            itemPro.size_info.forEach(itemSize => {
              let flag = item.client_pay.find(itemInner => (+itemInner.size_id === +itemSize.size_id && +itemInner.color_id === +itemSize.color_id && +itemPro.id === +itemInner.product_info.product_id))
              if (flag) {
                itemSize.payNum = flag.number
                itemSize.payPrice = flag.price
              }
            })
          })
          if (item.client_pay.length > 0) {
            item.isClientPay = true
            item.clientPayPrice = this.$toFixed(item.client_pay.map(itemPrice => itemPrice.price * itemPrice.number).reduce((a, b) => {
              return a + b
            }))
          }
          return {
            showComponentsName: this.chinaNum[index] + '次打样',
            ...item
          }
        })
        this.sampleOrderArr = this.sampleOrderArr.reverse()
        this.cutSampleOrderInfo(this.sampleOrderArr[0])
        if (type === 'reset') {
          this.showChangeSampleOrderPopup++
          this.continueSampleInfo.product_info = this.$flatten(this.sampleOrderInfo.product_info.map(itemPro => {
            return {
              product_id: itemPro.product_info.product_id,
              sizeColorArr: JSON.stringify(itemPro.product_info.size_measurement.map(itemSize => {
                return {
                  label: itemSize.size_name,
                  value: itemSize.size_id,
                  children: itemPro.product_info.color.map(itemColor => {
                    return {
                      label: itemColor.color_name,
                      value: itemColor.color_id
                    }
                  })
                }
              })),
              unit: itemPro.product_info.unit,
              size_info: itemPro.size_info
            }
          })).map(itemPro => {
            return {
              product_id: itemPro.product_id,
              number: itemPro.numbers,
              size_color: [itemPro.size_id, itemPro.color_id],
              sizeColorArr: JSON.parse(itemPro.sizeColorArr),
              unit: itemPro.unit
            }
          })
        }
        this.loading = false
      })
    },
    // 切换样单更新数据
    cutSampleOrderInfo (item) {
      // 清空切换前概述数据
      this.orderDetailInfo.material = []
      this.orderDetailInfo.production = []
      this.orderDetailInfo.finance.finance = []
      this.orderDetailInfo.finance.yarnOrder = []
      this.orderDetailInfo.finance.yarnProcess = []
      this.orderDetailInfo.finance.materialOrder = []
      this.orderDetailInfo.finance.materialProcess = []
      this.orderDetailInfo.finance.weave = []
      this.orderDetailInfo.finance.process = []
      // 处理数据
      this.sampleOrderInfo = item
      this.activeSampleOrderId = item.id
      let productList = []
      let numArr = this.$flatten(item.product_info.map(item => {
        return item.size_info.map(itemNum => Number(itemNum.numbers))
      }))
      this.product_order_total_number = numArr.length > 0 ? numArr.reduce((a, b) => a + b) : 0
      item.product_info.forEach(itemPro => {
        if (!productList.find(item => item.product_id === itemPro.product_info.product_id)) {
          productList.push(itemPro.product_info)
        }
      })
      this.productList = productList
      // 处理流程时间线
      this.timeProgressInfo = []
      let nowDate = this.$getTime()
      let totalTime = new Date(this.sampleOrderInfo.deliver_time).getTime() - new Date(this.sampleOrderInfo.order_time).getTime()
      this.timeProgressInfo.push({
        name: '下单日期',
        time: this.sampleOrderInfo.order_time,
        prog: 0
      })
      this.timeProgressInfo.push({
        name: '交货日期',
        time: this.sampleOrderInfo.deliver_time,
        prog: 100
      })
      let prog = (new Date(nowDate).getTime() - new Date(this.sampleOrderInfo.order_time).getTime()) / totalTime * 100 > 100 ? 100 : (new Date(nowDate).getTime() - new Date(this.sampleOrderInfo.order_time).getTime()) / totalTime * 100
      this.timeProgressInfo.push({
        name: '今天',
        time: nowDate,
        prog: prog
      })
      if (this.sampleOrderInfo.time_progress) {
        this.warnData = {
          isOpenWarn: true,
          startTime: this.sampleOrderInfo.time_progress.order_time,
          endTime: this.sampleOrderInfo.time_progress.end_time,
          warnArr: [
            {
              percent: this.$toFixed(this.sampleOrderInfo.time_progress.progress_data.material_plan / 100),
              name: '物料计划',
              isWarnStatus: this.sampleOrderInfo.material_plan_progress_status,
              porgress: 1
            }, {
              percent: this.$toFixed(this.sampleOrderInfo.time_progress.progress_data.material_push / 100),
              name: '物料入库',
              isWarnStatus: this.sampleOrderInfo.material_push_progress_status,
              porgress: this.sampleOrderInfo.material_push_progress.r_push
            }, {
              percent: this.$toFixed(this.sampleOrderInfo.time_progress.progress_data.semi_product_push / 100),
              name: '织造入库',
              isWarnStatus: this.sampleOrderInfo.semi_product_push_progress_status,
              porgress: this.sampleOrderInfo.product_push_progress
            }, {
              percent: this.$toFixed(this.sampleOrderInfo.time_progress.progress_data.product_push / 100),
              name: '成品回库',
              isWarnStatus: this.sampleOrderInfo.product_push_progress_status,
              porgress: this.sampleOrderInfo.semi_push_progress
            }
          ]
        }
      }
      // 处理流程进度
      this.productProgInfo = []
      let sampleOrderData = item
      this.productProgInfo.push({
        name: '物料进度',
        isCompiled: sampleOrderData.material_push_progress.r_push > 100 && sampleOrderData.material_push_progress.r_pop > 100,
        info: [
          {
            name: '入库',
            prog: sampleOrderData.material_push_progress.r_push > 100 ? 100 : sampleOrderData.material_push_progress.r_push,
            class: 'greenProg'
          }, {
            name: '出库',
            prog: sampleOrderData.material_push_progress.r_pop > 100 ? 100 : sampleOrderData.material_push_progress.r_pop,
            class: 'blueProg'
            // }, {
            //   name: '订购',
            //   prog: sampleOrderData.material_order_progress.y_percent > 100 ? 100 : sampleOrderData.material_order_progress.y_percent,
            //   class: 'blueProg'
          }
        ]
        // }, {
        //   name: '织造进度',
        //   isCompiled: sampleOrderData.product_weave_progress.product > 100,
        //   info: [
        //     {
        //       name: '分配',
        //       prog: sampleOrderData.product_weave_progress.product > 100 ? 100 : sampleOrderData.product_weave_progress.product,
        //       class: 'blueProg'
        //     }
        //   ]
      })
      this.getFinanceDetail()
    },
    // 物料概述
    getMaterialDetail () {
      this.loading = true
      Promise.all([
        materialPlan.detail({
          order_id: this.activeSampleOrderId,
          order_type: 2
        }),
        materialStock.detail({
          order_id: this.activeSampleOrderId,
          order_type: 2
        })
      ]).then(res => {
        let materialDetail = res[0].data.data.total_data
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
      Promise.all([
        weave.detail({
          order_id: this.activeSampleOrderId,
          order_type: 2
        }),
        processing.detail({
          order_id: this.activeSampleOrderId,
          order_type: 2
        })
      ]).then(res => {
        let productionDetail = res[0].data.data.map(item => {
          return {
            ...item.product_info,
            ...item.category_info,
            client_name: item.client_name,
            number: item.number,
            size: item.size_name,
            color: item.color_name,
            is_part: item.is_part,
            process_type: '织造'
          }
        }).concat(res[1].data.data.map(item => {
          return {
            ...item.product_info,
            ...item.category_info,
            client_name: item.client_name,
            number: item.number,
            size: item.size_name,
            color: item.color_name,
            is_part: item.is_part,
            process_type: item.type
          }
        }))
        this.orderDetailInfo.production = this.$mergeData(productionDetail, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['code/product_code', 'size', 'color', 'process_type'], otherRule: [{ name: 'unit' }, { name: 'name' }, { name: 'category_name' }, { name: 'style_name' }, { name: 'type_name' }, { name: 'number', type: 'add' }, { name: 'go_number', type: 'add' }, { name: 'out_number', type: 'add' }, { name: 'is_part' }] } })
        this.showFlag2.showWeave = true
        if (this.orderDetailInfo.production.length > 0) {

        } else {
          this.$message.error('暂无生产信息')
        }
        this.loading = false
      })
    },
    // 财务概述-财务总览
    getFinanceDetail () {
      this.loading = true
      finance.detail({
        order_id: this.activeSampleOrderId,
        order_type: 2
      }).then(res => {
        console.log(res)
        if (res.data.status !== false) {
          let data = res.data.data
          this.orderDetailInfo.finance.finance = [
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
        order_id: this.activeSampleOrderId,
        order_type: 2
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
        order_id: this.activeSampleOrderId,
        order_type: 2
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
        order_id: this.activeSampleOrderId,
        order_type: 2
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
          this.orderDetailInfo.finance.weave = this.$mergeData(data, { mainRule: ['client_name'], childrenName: 'product_info', childrenRule: { mainRule: ['code/product_code', 'name', 'category_name', 'type_name', 'style_name', 'size', 'color', 'price'], otherRule: [{ name: 'number', type: 'add' }, { name: 'total_price', type: 'add' }, { name: 'unit' }, { name: 'is_part' }, { name: 'compiled_time' }] } })
        }
        this.loading = false
      })
    },
    // 财务概述-半成品加工
    getProcessDetail () {
      this.loading = true
      processing.detail({
        order_id: this.activeSampleOrderId,
        order_type: 2
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
              size: item.size_name,
              color: item.color_name,
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
    catDetail (type) {
      this.activeDetailTitle = type
    },
    changeFinance (item) {
      this.activeFinanceTitle = item.key
    },
    // 修改订单状态
    changeOrderStatus (type) {
      if (type === 'waitConfirm') {
        this.$confirm('此操作将改变该样单为“完成”状态，并客户确认状态改为“待确认”，是否继续?', '待客户确认-提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sampleOrder.changeStatus({
            order_id: this.activeSampleOrderId,
            type: 1
          }).then(res => {
            if (res.data.status !== false) {
              this.init()
              this.$message.success('修改样单状态为“等待客户确认”成功')
            }
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      } else if (type === 'continue') {
        this.showChangeSampleOrderPopup = 1
      } else if (type === 'continueSample') {
        this.isCommit = 'commit'
        sampleOrder.changeStatus({
          order_id: this.activeSampleOrderId,
          type: 6
        }).then(res => {
          if (res.data.status !== false) {
            this.showChangeSampleOrderPopup++
            this.isCommit = 'compiled'
            this.init()
          } else {
            this.isCommit = 'error'
          }
        })
      } else if (type === 'ok') {
        this.changeSampleForProductPopup = 1
        this.isOkStatus = true
      } else if (type === 'addOrder') {
        this.changeSampleForProductPopup = 1
        this.isOkStatus = false
      } else if (type === 'change') {
        this.$router.push('/sample/sampleOrderUpdate/' + this.activeSampleOrderId)
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
        this.isCommit = 'commit'
        sampleOrder.changeStatus({
          order_id: this.activeSampleOrderId,
          type: 3,
          material_data: yarnData.concat(materialData)
        }).then(res => {
          if (res.data.status !== false) {
            this.isCommit = 'compiled'
            this.showCanclePopup++
            this.init()
          } else {
            this.isCommit = 'error'
          }
        })
      } else if (type === 'sampleForProduct') {
        if (!(this.sampleForProductId.length > 0)) {
          this.$message.warning('请选择需要转为产品的样品')
          return
        }
        this.isCommit = 'commit'
        sampleOrder.changeStatus({
          order_id: this.activeSampleOrderId,
          type: (this.isOkStatus ? 2 : 5),
          sample_product_id: this.sampleForProductId
        }).then(res => {
          if (res.data.status !== false) {
            this.changeSampleForProductPopup++
            this.isCommit = 'compiled'
            this.init()
            this.$message.success('修改样单状态为"客户已确认"成功')
          } else {
            this.isCommit = 'error'
          }
        })
      } else if (type === 'CustomerPayFlag') {
        this.customerPayPopupFlag = true
        this.continueSampleInfo.product_info = this.$flatten(this.sampleOrderInfo.product_info.map(itemPro => {
          return {
            product_id: itemPro.product_info.product_id,
            sizeColorArr: JSON.stringify(itemPro.product_info.size_measurement.map(itemSize => {
              return {
                value: itemSize.size_id,
                label: itemSize.size_name,
                children: itemPro.product_info.color.map(itemColor => {
                  return {
                    value: itemColor.color_id,
                    label: itemColor.color_name
                  }
                })
              }
            })),
            unit: itemPro.product_info.unit,
            size_info: itemPro.size_info
          }
        })).map(itemPro => {
          return {
            product_id: itemPro.product_id,
            number: itemPro.numbers,
            size_color: [itemPro.size_id, itemPro.color_id],
            sizeColorArr: JSON.parse(itemPro.sizeColorArr),
            unit: itemPro.unit
          }
        })
      } else if (type === 'customerPay') {
        let flag = {
          id: true,
          sizeColor: true,
          numbers: true,
          price: true,
          total_price: true
        }
        let clientPay = []
        // if (this.continueSampleInfo.isCustomerPay) {
        clientPay = this.continueSampleInfo.product_info.map(item => {
          if (!item.product_id) {
            flag.id = false
          }
          if (!item.size_color[0] || !item.size_color[1]) {
            flag.sizeColor = false
          }
          if (!item.price) {
            flag.price = false
          }
          if (!item.numbers) {
            flag.numbers = false
          }
          if (!item.total_price) {
            flag.total_price = false
          }
          return {
            product_id: item.product_id,
            order_id: this.activeSampleOrderId,
            client_id: this.sampleOrderInfo.client_id,
            color_id: item.size_color[1],
            size_id: item.size_color[0],
            price: item.price,
            number: item.numbers,
            total_price: item.total_price
          }
        })
        // }
        if (!flag.id) {
          this.$message.error('请选择需要付费的样品')
          return
        }
        if (!flag.sizeColor) {
          this.$message.error('请选择需要付费样品的尺码颜色')
          return
        }
        if (!flag.numbers) {
          this.$message.error('请填写需要付费样品的数量')
          return
        }
        if (!flag.price) {
          this.$message.error('请填写需要付费样品的单价')
          return
        }
        if (!flag.total_price) {
          this.$message.error('请填写需要付费总价')
          return
        }
        this.loading = false
        sampleOrder.clientPay({
          data: clientPay
        }).then(res => {
          this.loading = true
          if (res.data.status !== false) {
            this.$message.success('提交成功')
            this.customerPayPopupFlag = false
            this.init()
          }
        })
      } else if (type === 'endOrder') { // 结束打样
        this.$confirm('此操作会将订单状态修改为“已完成”,并且客户状态修改为“不确定”, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sampleOrder.changeStatus({
            order_id: this.activeSampleOrderId,
            type: 6
          }).then(res => {
            if (res.data.status !== false) {
              this.init()
              this.$message.success('操作成功')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else if (type === 'isNoHandle') {
        this.$message.warning('已完成或已取消的样单无法操作')
      } else {
        this.$message.warning('未知操作')
      }
    },
    // 取消时初始化原料、辅料、包装和产品信息
    getMaterialOrderAndProduct () {
      this.loading = true
      Promise.all([
        materialManage.detail({
          order_id: this.activeSampleOrderId,
          order_type: 2
        }),
        yarn.list(),
        material.list(),
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
        if (this.yarnList.length === 0) {
          this.yarnList = res[1].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.materialList.length === 0) {
          this.materialList = res[2].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.stockList.length === 0) {
          this.stockList = res[3].data.data
        }
        this.loading = false
      })
      this.showCanclePopup = 1
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
      } else if (type === 'continueSample') {
        item.push({
          product_id: '',
          size_color: '',
          number: '',
          sizeColorArr: []
        })
      }
      this.$forceUpdate()
    },
    deleteItem (item, index) {
      item.splice(index, 1)
      this.$forceUpdate()
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
      this.changeSampleForProductPopup = false
      this.showChangeSampleOrderPopup = false
      this.sampleForProductId = []
      this.isCommit = 'before'
      this.yarnStockId = ''
      this.materialStockId = ''
      this.cancleYarn = []
      this.cancleMaterial = []
    },
    changeProductSizeColorArr (item, $event) { // 继续打样填写产品是选择产品更新尺码颜色选项
      this.$forceUpdate()
      console.log($event)
      let flag = this.productList.find(itemPro => itemPro.product_id === $event)
      if (flag) {
        item.sizeColorArr = flag.size_measurement.map(itemSize => {
          return {
            label: itemSize.size_name,
            value: itemSize.size_name,
            children: flag.color.map(itemColor => {
              return {
                label: itemColor.color_name,
                value: itemColor.color_name
              }
            })
          }
        })
        item.unit = flag.unit
      }
    },
    addShowChangeSampleOrderPopup () {
      if (this.showChangeSampleOrderPopup === 1) {
        this.init('reset')
      } else {
        this.showChangeSampleOrderPopup++
      }
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
      }
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    // activeDetailTitle (newVal) {
    //   if (this.orderDetailInfo[newVal].length === 0) {
    //     if (newVal === 'material') {
    //       this.getMaterialDetail()
    //     } else if (newVal === 'production') {
    //       this.getProductionDetail()
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
      if (status === 3001) {
        return '已创建'
      } else if (status === 3002) {
        return '进行中'
      } else if (status === 3003) {
        return '已取消'
      } else if (status === 3004) {
        return '已完成'
      }
    },
    filterTitle (value) {
      if (value === 1) {
        return '-原料结余入库'
      } else if (value === 2) {
        return '-辅料结余入库'
      }
    },
    filterSampleStatus (value) {
      if (value === 1) {
        return '待确认'
      } else if (value === 2) {
        return '已确认'
      } else if (value === 3) {
        return '不确认'
      } else if (value === 5) {
        return '大货生产'
      } else {
        return '待确认'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/sample/sampleOrderDetail.less";
</style>
<style lang="less">
#orderDetail {
  .el-menu,
  .el-submenu,
  .el-submenu__title {
    background-color: #1a95ff;
    border-color: #1a95ff;
    border-radius: 4px;
    color: #fff;
    i {
      color: #fff;
    }
  }
  .orange {
    &.el-menu,
    .el-menu,
    .el-submenu,
    .el-submenu__title {
      background-color: rgb(230, 162, 60) !important;
      border-color: rgb(230, 162, 60) !important;
    }
  }
  .steps {
    padding: 8px;
    border-bottom: none;
    .el-step__title {
      font-size: 14px !important;
    }
  }
}
//操作按钮重写
.elMenuItem {
  color: #999 !important;
  min-width: 120px !important;
  &.is-active {
    color: #999 !important;
    .el-submenu__title {
      color: #999 !important;
    }
  }
  &:hover {
    background: #1a95ff !important;
    color: #fff !important;
    .el-submenu__title:hover {
      background: transparent !important;
      color: #fff !important;
      i {
        color: #fff;
      }
    }
  }
  &.orange:hover {
    background: rgb(230, 162, 60) !important;
  }
}
.handleMenuSample {
  .el-menu--popup {
    min-width: 120px !important;
  }
}
</style>
