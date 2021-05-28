<template>
  <div id='ticketStatistics'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item"
        :class="{'active':type==='开票管理'}"
        @click="code='';order_code='';date=[];type='开票管理'">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-kaipiaoguanli"></use>
        </svg>
        <span class="name">开票管理</span>
      </div>
      <div class="cut_item"
        :class="{'active':type==='扣款管理'}"
        @click="code='';order_code='';date=[];type='扣款管理'">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-koukuanguanli"></use>
        </svg>
        <span class="name">扣款管理</span>
      </div>
      <div class="cut_item"
        :class="{'active':type==='付款管理'}"
        @click="code='';order_code='';date=[];type='付款管理'">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-fukuanguanli"></use>
        </svg>
        <span class="name">付款管理</span>
      </div>
      <div class="cut_item"
        :class="{'active':type==='收款管理'}"
        @click="code='';order_code='';date=[];type='收款管理'">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-shoukuanguanli"></use>
        </svg>
        <span class="name">收款管理</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">开票列表</span>
        <div style="display:flex">
          <div class="btn"
            :class="{'btnBlue':checkList.length>0,'btnGray':checkList.length===0}"
            @click="batchCheck"
            v-if="type==='开票管理'||type==='扣款管理'">批量审核</div>
          <div class="btn btnBlue"
            @click="openCreate">新增{{type.slice(0,2)}}</div>
        </div>
      </div>
      <div class="listCtn hasBorderTop">
        <template v-if="type==='开票管理'">
          <div class="list">
            <div class="filterCtn2">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="filter_line">
                  <el-input class="filter_item"
                    v-model="code"
                    @change="changeRouter(1)"
                    :placeholder="'输入'+type.slice(0,2)+'编号查询'">
                  </el-input>
                  <el-input class="filter_item"
                    v-model="order_code"
                    @change="changeRouter(1)"
                    placeholder="输入订单编号查询">
                  </el-input>
                  <el-input class="filter_item"
                    v-model="client_name"
                    @change="changeRouter(1)"
                    placeholder="输入公司名称查询">
                  </el-input>
                  <el-select class="filter_item"
                    v-model="settleType"
                    @change="changeRouter(1)"
                    placeholder="选则开票类型">
                    <el-option :value="1"
                      label="收款"></el-option>
                    <el-option :value="0"
                      label="付款"></el-option>
                  </el-select>
                  <el-date-picker v-model="date"
                    style="width:250px"
                    class="filter_item"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeRouter(1)">
                  </el-date-picker>
                  <div class="resetBtn"
                    @click="reset">重置</div>
                </div>
              </div>
            </div>
            <div class="title">
              <div class="col">
                <span class="text">开票编号</span>
              </div>
              <div class="col">
                <span class="text">开票公司</span>
              </div>
              <div class="col">
                <span class="text">关联订单</span>
              </div>
              <div class="col">
                <span class="text">开票日期</span>
              </div>
              <div class="col">
                <span class="text">开票号码</span>
              </div>
              <div class="col">
                <span class="text">开票金额</span>
              </div>
              <div class="col">
                <span class="text">开票合计</span>
              </div>
              <div class="col">
                <span class="text">图片信息</span>
              </div>
              <div class="col">
                <span class="text">审核状态</span>
              </div>
              <div class="col">
                <span class="text">操作</span>
              </div>
            </div>
            <div class="row"
              v-for="item in settleList"
              :key="item.id">
              <div class="col">
                <span class="text">
                  <el-checkbox v-model="item.check">
                    {{item.settle_code}}</el-checkbox>
                </span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col">
                <span class="text">
                  <span style="cursor:pointer;color:#1a95ff"
                    v-for="order in item.order_code"
                    :key="order.order_id"
                    @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span>
                </span>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.complete_time)}}</span>
              </div>
              <div class="col">
                <div style="display:flex;justify-content:space-between;padding-right:15px">
                  <span style="line-height:28px">{{item.invoiceNum}}</span>
                  <div class="jtCtn"
                    v-show="item.invoice_info&&item.invoice_info.length>1">
                    <div class="jt el-icon-caret-top"
                      @click="checkWhich(item,'last',index)"></div>
                    <div class="jt el-icon-caret-bottom"
                      @click="checkWhich(item,'next',index)"></div>
                  </div>
                </div>
              </div>
              <div class="col">
                <span class="text">{{item.invoicePrice}}元</span>
              </div>
              <div class="col">
                <span class="text">{{item.allPrice}}元</span>
              </div>
              <div class="col">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.file_url"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="col">
                <span class="text"
                  :class="item.status === 2 ? 'green' : item.status === 3 ? 'red' : 'blue'">{{item.status === 1 ? '待审核' : item.status === 2 ? '已通过' : '已驳回'}}</span>
              </div>
              <div class="col">
                <span class="text">
                  <span class="opr"
                    @click="goSettleDeductDetail(item)">详情</span>
                  <span class="opr red"
                    @click="deleteLog(item.id)">删除</span>
                </span>
              </div>
            </div>
            <div class="row positonBottom">
              <div class="col">合计</div>
              <div class="col"><span :style="{'color':settleType===1?'#1a95ff':'#F5222D'}">{{$formatNum($toFixed(allPrice.settle/10000))}}万元</span></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
            </div>
          </div>
        </template>
        <template v-else-if="type==='扣款管理'">
          <div class="list">
            <div class="filterCtn2">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="filter_line">
                  <el-input class="filter_item"
                    v-model="code"
                    @change="changeRouter(1)"
                    :placeholder="'输入'+type.slice(0,2)+'编号查询'">
                  </el-input>
                  <el-input class="filter_item"
                    v-model="order_code"
                    @change="changeRouter(1)"
                    placeholder="输入订单编号查询">
                  </el-input>
                  <el-input class="filter_item"
                    v-model="client_name"
                    @change="changeRouter(1)"
                    placeholder="输入公司名称查询">
                  </el-input>
                  <el-date-picker v-model="date"
                    style="width:250px"
                    class="filter_item"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeRouter(1)">
                  </el-date-picker>
                  <div class="resetBtn"
                    @click="reset">重置</div>
                </div>
              </div>
            </div>
            <div class="title">
              <div class="col">
                <span class="text">扣款编号</span>
              </div>
              <div class="col">
                <span class="text">扣款公司</span>
              </div>
              <div class="col">
                <span class="text">关联订单</span>
              </div>
              <div class="col">
                <span class="text">扣款日期</span>
              </div>
              <div class="col">
                <span class="text">扣款金额</span>
              </div>
              <div class="col">
                <span class="text">扣款原因</span>
              </div>
              <div class="col">
                <span class="text">图片信息</span>
              </div>
              <div class="col">
                <span class="text">审核状态</span>
              </div>
              <div class="col"
                style="flex:1.2">
                <span class="text">操作</span>
              </div>
            </div>
            <div class="row"
              v-for="item in chargebacksList"
              :key="item.id">
              <div class="col">
                <span class="text">
                  <el-checkbox v-model="item.check">{{item.code}}</el-checkbox>
                </span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col">
                <span class="text"> <span style="cursor:pointer;color:#1a95ff"
                    v-for="order in item.order_code"
                    :key="order.order_id"
                    @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span></span>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.complete_time)}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.deduct_price}}元</span>
              </div>
              <div class="col">
                <span class="text">{{item.desc}}</span>
              </div>
              <div class="col">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.file_url"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="col">
                <span class="text"><span class="text"
                    :class="item.status === 2 ? 'green' : item.status === 3 ? 'red' : 'blue'">{{item.status === 1 ? '待审核' : item.status === 2 ? '已通过' : '已驳回'}}</span></span>
              </div>
              <div class="col"
                style="flex:1.2">
                <span class="text">
                  <span class="opr green"
                    @click.stop="$openUrl(`/deductTable/${item.client_id}/${item.type}/${item.id}/扣款`)">打印</span>
                  <span class="opr"
                    @click="goSettleDeductDetail(item)">详情</span>
                  <span class="opr red"
                    @click="deleteLog(item.id)">删除</span>
                </span>
              </div>
            </div>
            <div class="row positonBottom">
              <div class="col">合计</div>
              <div class="col"><span style="color:#F5222D">{{$formatNum($toFixed(allPrice.chargebacks/10000))}}万元</span></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="list">
            <div class="filterCtn2">
              <div class="leftCtn">
                <span class="label">筛选条件：</span>
                <div class="filter_line">
                  <el-input class="filter_item"
                    v-model="code"
                    @change="changeRouter(1)"
                    :placeholder="'输入'+type.slice(0,2)+'编号查询'">
                  </el-input>
                  <el-input class="filter_item"
                    v-model="order_code"
                    @change="changeRouter(1)"
                    placeholder="输入订单编号查询">
                  </el-input>
                  <el-input class="filter_item"
                    v-model="client_name"
                    @change="changeRouter(1)"
                    placeholder="输入公司名称查询">
                  </el-input>
                  <el-date-picker v-model="date"
                    style="width:250px"
                    class="filter_item"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeRouter(1)">
                  </el-date-picker>
                  <div class="resetBtn"
                    @click="reset">重置</div>
                </div>
              </div>
            </div>
            <div class="title">
              <div class="col">
                <span class="text">{{type === '收款管理' ?'收款':'付款'}}编号</span>
              </div>
              <div class="col">
                <span class="text">{{type === '收款管理' ?'收款':'付款'}}公司</span>
              </div>
              <div class="col">
                <span class="text">关联订单</span>
              </div>
              <div class="col">
                <span class="text">{{type === '收款管理'?'收款':'付款'}}日期</span>
              </div>
              <div class="col">
                <span class="text">{{type === '收款管理'?'收款':'付款'}}方式</span>
              </div>
              <div class="col">
                <span class="text">{{type === '收款管理'?'收款':'付款'}}金额</span>
              </div>
              <div class="col">
                <span class="text">图片信息</span>
              </div>
              <div class="col">
                <span class="text">操作</span>
              </div>
            </div>
            <div class="row"
              v-for="item in collectionList"
              :key="item.id">
              <div class="col">
                <span class="text">{{item.code}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.client_name}}</span>
              </div>
              <div class="col">
                <span class="text"> <span style="cursor:pointer;color:#1a95ff"
                    v-for="order in item.order_code"
                    :key="order.order_id"
                    @click="$openUrl(item.order_type === 2 ? `/sample/sampleOrderDetail/${order.order_id}` : `/order/orderDetail/${order.order_id}`)">{{order.order_code}};</span></span>
              </div>
              <div class="col">
                <span class="text">{{$getTime(item.complete_time)}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.type}}</span>
              </div>
              <div class="col">
                <span class="text">{{item.price}}元</span>
              </div>
              <div class="col">
                <el-image style="width: 50px; height: 50px;line-height:50px;text-align:center;font-size:22px"
                  :src="item.file_url"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="col">
                <span class="text">
                  <span class="opr"
                    @click="goSettleDeductDetail(item)">详情</span>
                  <span class="opr red"
                    @click="deleteLog(item.id)">删除</span>
                </span>
              </div>
            </div>
            <div class="row positonBottom">
              <div class="col">合计</div>
              <div class="col"><span :style="{'color':type==='收款管理'?'#1a95ff':'#F5222D'}">{{$formatNum($toFixed(allPrice.collection/10000))}}万元</span></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
              <div class="col"></div>
            </div>
          </div>
        </template>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 开票 -->
    <div class="popup"
      v-show="settleFlag">
      <div class="main">
        <div class="title">
          <div class="text">单位开票</div>
          <i class="el-icon-close"
            @click="settleFlag=false;resetAll()"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">开票类型：</div>
            <div class="info">
              <el-select v-model="settle.transfer_type"
                placeholder="输入单位名称按回车搜索">
                <el-option label="应收款"
                  :value="1">
                </el-option>
                <el-option label="应付款"
                  :value="0">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">开票单位：</div>
            <div class="info">
              <el-select v-model="settle.client_id"
                remote
                filterable
                placeholder="请输入单位名称搜索"
                :remote-method="searchClient">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">开票日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="settle.date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">开票总额：</div>
            <div class="info">
              <zh-input placeholder="请输入开票总额"
                type="number"
                v-model="settle.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div v-for="(item,index) in settle.invoiceDetail"
            :key="index">
            <div class="row">
              <div class="label">开票号码：</div>
              <div class="info">
                <el-input placeholder="请输入开票号码"
                  v-model="item.invoiceNum"></el-input>
              </div>
              <div class="editBtn blue"
                v-if="index===0"
                @click="addInvoice">添加</div>
              <div class="editBtn red"
                v-if="index>0"
                @click="deleteInvoice(index)">删除</div>
            </div>
            <div class="row">
              <div class="label">开票金额：</div>
              <div class="info">
                <el-input placeholder="请输入开票金额"
                  v-model="item.invoicePrice"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="label">票据信息：</div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                :on-success="successFile"
                ref="uploada"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入备注信息"
                v-model="settle.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="settleFlag=false;resetAll()">取消</div>
          <div class="btn btnBlue"
            @click="settleFn">确定</div>
        </div>
      </div>
    </div>
    <!-- 扣款 -->
    <div class="popup"
      v-show="chargebacksFlag">
      <div class="main">
        <div class="title">
          <div class="text">订单扣款</div>
          <i class="el-icon-close"
            @click="chargebacksFlag=false;resetAll()"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">开票单位：</div>
            <div class="info">
              <el-select v-model="chargebacks.client_id"
                remote
                filterable
                placeholder="请输入单位名称搜索"
                :remote-method="searchClient">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">扣款日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="chargebacks.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">扣款金额：</div>
            <div class="info">
              <zh-input placeholder="请输入扣款金额"
                type="number"
                v-model="chargebacks.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">扣款原因：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入扣款原因"
                v-model="chargebacks.desc"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">票据信息：</div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                :on-success="successFile"
                ref="uploada"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="chargebacksFlag=false;resetAll()">取消</div>
          <div class="btn btnBlue"
            @click="chargebacksFn">确定</div>
        </div>
      </div>
    </div>
    <!-- 单位收款 -->
    <div class="popup"
      v-if="collectionFlag">
      <div class="main">
        <div class="title">
          <div class="text">单位{{type.slice(0,2)}}</div>
          <i class="el-icon-close"
            @click="collectionFlag=false;resetAll()"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">{{type.slice(0,2)}}单位：</div>
            <div class="info">
              <el-select v-model="collection.client_id"
                remote
                filterable
                placeholder="请输入单位名称搜索"
                :remote-method="searchClient">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">{{type.slice(0,2)}}日期：</div>
            <div class="info">
              <el-date-picker style="width:100%"
                v-model="collection.date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">{{type.slice(0,2)}}金额：</div>
            <div class="info">
              <zh-input :placeholder='`请输入${type.slice(0,2)}金额`'
                type="number"
                v-model="collection.price">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">{{type.slice(0,2)}}方式：</div>
            <div class="info">
              <el-autocomplete v-model="collection.type"
                clearable
                :fetch-suggestions="querySearchCollection"
                :placeholder='`请选择${type.slice(0,2)}方式`'></el-autocomplete>
            </div>
          </div>
          <div class="row">
            <div class="label">票据信息：</div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                :on-success="successFile"
                ref="uploada"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入备注信息"
                v-model="collection.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="collectionFlag=false;resetAll()">取消</div>
          <div class="btn btnBlue"
            @click="collectionFn">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { settle, chargebacks, collection, getToken, client } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      type: '开票管理',
      settleType: 1, // 1是收款开票,0是付款开票
      chargebacksList: [],
      settleList: [],
      collectionList: [],
      postData: { token: '' },
      page: 1,
      total: 1,
      fileArr: [],
      fileUrl: '',
      date: [this.$getTime(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 365)), this.$getTime(new Date())],
      code: '',
      order_code: '',
      client_name: '',
      // 扣款开票数据
      settleFlag: false,
      settle: {
        client_id: '',
        date: this.$getTime(),
        price: '',
        ifInvoice: 2,
        invoiceDetail: [{
          invoiceNum: '',
          invoicePrice: ''
        }],
        desc: '',
        transfer_type: 1
      },
      chargebacksFlag: false,
      chargebacks: {
        client_id: '',
        date: this.$getTime(),
        price: '',
        desc: ''
      },
      collectionFlag: false,
      collection: {
        client_id: '',
        data: this.$getTime(),
        price: '',
        desc: '',
        type: ''
      },
      clientList: [],
      allPrice: {
        settle: 0,
        collection: 0,
        chargebacks: 0
      }
    }
  },
  watch: {
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    },
    type () {
      this.changeRouter(1)
    }
  },
  computed: {
    clientTypeAll () {
      if (this.type === '收款管理') {
        return [1, 2, 37, 38]
      } else {
        if (this.settleType === 1 && this.type === '开票管理') {
          return [1, 2, 37, 38]
        } else {
          return [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
        }
      }
    },
    checkList () {
      if (this.type === '开票管理') {
        return this.settleList.filter((item) => item.check)
      } else if (this.type === '扣款管理') {
        return this.chargebacksList.filter((item) => item.check)
      } else {
        return []
      }
    }
  },
  methods: {
    querySearchCollection (queryString, cb) {
      let list = window.localStorage.getItem('zh_collection_type')
      list = list ? JSON.parse(list) : []
      list = queryString ? list.filter(itemF => itemF.value.indexOf(queryString) !== -1) : list
      cb(list)
    },
    openCreate () {
      if (this.type === '开票管理') {
        this.settle = {
          client_id: '',
          date: this.$getTime(),
          price: '',
          ifInvoice: 2,
          invoiceDetail: [{
            invoiceNum: '',
            invoicePrice: ''
          }],
          desc: '',
          transfer_type: 1
        }
        this.settleFlag = true
      } else if (this.type === '扣款管理') {
        this.chargebacks = {
          client_id: '',
          date: this.$getTime(),
          price: '',
          desc: ''
        }
        this.chargebacksFlag = true
      } else {
        this.collection = {
          client_id: '',
          data: this.$getTime(),
          price: '',
          desc: '',
          type: ''
        }
        this.collectionFlag = true
      }
    },
    resetAll () {
      this.noOrder = false
      this.fileArr = []
      this.fileUrl = ''
    },
    addInvoice () {
      this.settle.invoiceDetail.push({
        invoiceNum: '',
        invoicePrice: ''
      })
    },
    deleteInvoice (index) {
      this.settle.invoiceDetail.splice(index, 1)
    },
    settleFn () {
      settle.create({
        id: null,
        client_id: this.settle.client_id,
        order_id: null,
        complete_time: this.settle.date,
        settle_price: this.settle.price,
        is_invoice: this.settle.ifInvoice,
        invoice_info: JSON.stringify(this.settle.invoiceDetail),
        desc: this.settle.desc,
        order_type: '',
        transfer_type: this.settle.transfer_type,
        type: '',
        file_url: this.fileUrl
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('开票成功')
          this.settleFlag = false
          this.settle = {
            client_id: '',
            date: this.$getTime(),
            price: '',
            ifInvoice: 2,
            invoiceDetail: [{
              invoiceNum: '',
              invoicePrice: ''
            }],
            desc: '',
            transfer_type: 1
          }
          this.getList()
        }
      })
    },
    chargebacksFn () {
      chargebacks.create({
        id: null,
        client_id: this.chargebacks.client_id,
        order_id: null,
        complete_time: this.chargebacks.date,
        deduct_price: this.chargebacks.price,
        desc: this.chargebacks.desc,
        order_type: '',
        type: '',
        file_url: this.fileUrl
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('扣款成功')
          this.chargebacksFlag = false
          this.chargebacks = {
            client_id: '',
            date: this.$getTime(),
            price: '',
            desc: ''
          }
          this.getList()
        }
      })
    },
    collectionFn () {
      collection.create({
        id: null,
        client_id: this.collection.client_id,
        complete_time: this.collection.date,
        order_id: null,
        price: this.collection.price,
        desc: this.collection.desc,
        type: '',
        order_type: '',
        // 加一个字段区分收款(1)付款(0)
        client_type: this.type === '收款管理' ? 1 : 0,
        file_url: this.fileUrl
      }).then((res) => {
        if (res.data.status !== false) {
          this.$message.success(`${this.type === '收款管理' ? '收款' : '付款'}成功`)
          this.collectionFlag = false
          this.collection = {
            date: this.$getTime(),
            price: '',
            desc: '',
            type: ''
          }
          this.getList()
        }
      })
    },
    searchClient (query) {
      if (query) {
        client.list({
          page: 1,
          limit: 10,
          keyword: query,
          status: 1
        }).then(res => {
          if (res.data.status !== false) {
            this.clientList = res.data.data
          }
        })
      }
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/financialStatistics/ticketStatistics/page=' + pages + '&&code=' + this.code + '&&settleType=' + this.settleType + '&&order_code=' + this.order_code + '&&client_name=' + this.client_name + '&&date=' + this.date + '&&type=' + this.type)
    },
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.code = params.code
      this.order_code = params.order_code
      this.type = params.type || '开票管理'
      this.settleType = params.settleType ? Number(params.settleType) : 1
      this.client_name = params.client_name
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = [this.$getTime(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 365)), this.$getTime(new Date())]
      }
    },
    reset () {
      this.$router.push('/financialStatistics/ticketStatistics/page=1&&settleType=1&&code=&&order_code=&&client_name=&&date=&&type=开票管理')
    },
    goSettleDeductDetail (item) {
      this.$router.push('/financialStatistics/oprDetail/' + item.client_id + '/' + item.type + '/' + item.id + '/' + this.type.slice(0, 2) + '?orderId=' + item.order_code.map(itemM => itemM.order_id).join(',') + '&orderType=' + item.order_type)
    },
    checkWhich (item, opr, index) {
      if (item.invoice_info.length > 0) {
        if (opr === 'init' || !opr) {
          item.invoicePrice = item.invoice_info[item.nowIndex || 0].invoicePrice
          item.invoiceNum = item.invoice_info[item.nowIndex || 0].invoiceNum
          this.$set(this.settleList, index, item)
        }
        if (opr === 'next') {
          if (item.nowIndex === item.invoice_info.length - 1) {
            item.nowIndex = 0
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          } else {
            item.nowIndex += 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          }
          this.$forceUpdate()
        }
        if (opr === 'last') {
          if (item.nowIndex === 0) {
            item.nowIndex = item.product_info.length - 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          } else {
            item.nowIndex -= 1
            this.$set(this.settleList, index, item)
            this.checkWhich(item)
          }
          this.$forceUpdate()
        }
      } else {
        item.invoicePrice = 0
        item.invoiceNum = '无票号'
      }
    },
    getChargeBack () {
      chargebacks.log({
        limit: 10,
        page: this.page,
        order_code: this.order_code,
        code: this.code,
        start_time: (this.date && this.date[0]) || '',
        end_time: (this.date && this.date[1]) || '',
        client_name: this.client_name
      }).then((res) => {
        this.chargebacksList = res.data.data
        this.total = res.data.meta.total
        this.allPrice.chargebacks = res.data.total_price
        this.loading = false
      })
    },
    getSettle () {
      settle.log({
        limit: 10,
        page: this.page,
        order_code: this.order_code,
        code: this.code,
        start_time: (this.date && this.date[0]) || '',
        end_time: (this.date && this.date[1]) || '',
        client_name: this.client_name,
        client_type: this.clientTypeAll
      }).then((res) => {
        this.settleList = res.data.data
        this.total = res.data.meta.total
        this.settleList.forEach((item) => {
          this.checkWhich(item, 'init')
          item.allPrice = item.invoice_info.reduce((total, current) => {
            return total + Number(current.invoicePrice)
          }, 0)
        })
        this.allPrice.settle = res.data.total_price
        this.loading = false
      })
    },
    getCollection () {
      collection.log({
        limit: 10,
        page: this.page,
        order_code: this.order_code,
        code: this.code,
        start_time: (this.date && this.date[0]) || '',
        end_time: (this.date && this.date[1]) || '',
        client_name: this.client_name,
        client_type: this.clientTypeAll
      }).then((res) => {
        this.collectionList = res.data.data
        this.total = res.data.meta.total
        this.allPrice.collection = res.data.total_price
        this.loading = false
      })
    },
    getList () {
      this.loading = true
      if (this.type === '开票管理') {
        this.getSettle()
      } else if (this.type === '扣款管理') {
        this.getChargeBack()
      } else {
        this.getCollection()
      }
    },
    deleteLog (id) {
      this.$confirm('是否删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.type === '开票管理') {
          settle.deleteLog({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        } else if (this.type === '扣款管理') {
          chargebacks.deleteLog({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        } else {
          collection.deleteLog({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
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
    beforeAvatarUpload (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile (response, file, fileList) {
      this.fileUrl = 'https://file.zwyknit.com/' + response.key
    },
    beforeRemove (file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteArr.push({
          id: file.id ? file.id : null,
          file_name: file.response ? file.response.key : file.url.split('https://file.zwyknit.com/')[1]
        })
        let deleteIndex = 0
        fileList.forEach((item, index) => {
          if (file.response) {
            if (item.response && (item.response.key === file.response.key)) {
              deleteIndex = index
            }
          } else {
            if (item.url === file.url) {
              deleteIndex = index
            }
          }
        })
        fileList.splice(deleteIndex, 1)
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
    },
    batchCheck () {
      if (this.checkList.length > 0) {
        this.$confirm('是否批量审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let api = this.type === '开票管理' ? settle : chargebacks
          api.check({
            id: this.checkList.map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message.success('审核成功')
              this.checkList.forEach((item) => { item.status = 2 })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$message.warning('请勾选需要审核的' + this.type.slice(0, 2) + '单据')
      }
    }
  },
  created () {
    this.getFilters()
    this.getList()
    getToken().then((res) => {
      this.postData.token = res.data.data
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/ticketStatistics.less";
</style>
