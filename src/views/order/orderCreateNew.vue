<template>
  <div id='orderCreate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn"
        style="display: flex;justify-content: space-between;align-items: center;">
        <span class="title">
          基本信息
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent"></zh-message>
        </span>
        <el-autocomplete style="width:200px;height:32px"
          v-model="importKeyword"
          :fetch-suggestions="querySearchOrder"
          placeholder="导入产品订单"
          :trigger-on-focus="false"
          @select="importOrder"></el-autocomplete>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3"
            v-for="(item,index) in order_code"
            :key="index">
            <span class="label">
              <template v-if="index === 0">
                <span class="text">订单号</span>
                <span class="explanation">(必填)</span>
              </template>
            </span>
            <span class="content">
              <zh-input placeholder="请输入订单号"
                v-model="item.code">
              </zh-input>
              <div class="editBtn deleteBtn"
                v-show="index !== order_code.length - 1"
                @click="deleteItem(order_code,index)">删除
              </div>
              <div class="editBtn addBtn"
                v-show="index === order_code.length - 1"
                @click="addItem(order_code,'code')">添加
              </div>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">订单公司</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="client_id"
                filterable
                placeholder="请选择订单公司"
                @change="getContact($event)">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">联系人</span>
            </span>
            <span class="content">
              <el-select v-model="contact_id"
                placeholder="请选择联系人">
                <el-option v-for="item in contactArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">负责小组</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="group_id"
                placeholder="请选择负责小组">
                <el-option v-for="item in groupArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">结算单位</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="unit"
                placeholder="请选择结算单位"
                @change="getUnit">
                <el-option v-for="item in unitArr"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">汇率
                <el-tooltip class="item"
                  effect="dark"
                  content="点击查看实时汇率"
                  placement="top-start">
                  <em class="el-icon-question"
                    @click="$openUrl('http://forex.hexun.com/rmbhl/#zkRate')"></em>
                </el-tooltip>
              </span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入汇率"
                v-model="exchange_rate"
                type="number"
                errorPosition='bottom'
                errorMsg="请输入数字">
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">税率</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入税率"
                v-model="tax_prop"
                type="number"
                errorPosition='bottom'
                errorMsg="请输入数字">
                <template slot="append">%</template>
              </zh-input>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-date-picker v-model="order_time"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择下单日期">
              </el-date-picker>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加产品</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-bottom:0">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入编号查询"
              v-model="searchCode"
              @change="searchCodeChange"></el-input>
            <el-date-picker v-model="date"
              style="width:290px"
              class="inputs"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
        </div>
        <div class="list"
          style="min-height:330px">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
              <transition v-show="!searchTypeFlag"
                name="el-zoom-in-bottom">
                <span class="text">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
              </transition>
              <transition name="el-zoom-in-top">
                <div v-show="searchTypeFlag"
                  class="filterBox">
                  <el-cascader class="filter"
                    v-model="type"
                    placeholder="筛选品类"
                    :options="typeArr"
                    clearable
                    filterable>
                  </el-cascader>
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">花型</span>
              <i class="el-icon-search iconBtn"
                @click="searchFlowerFlag=true"></i>
              <transition name="el-zoom-in-top">
                <div v-show="searchFlowerFlag"
                  class="filterBox">
                  <el-select v-model="flower_id"
                    clearable
                    placeholder="筛选花型">
                    <el-option v-for="(item,index) in flowerArr"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">名称</span>
            </div>
            <div class="col middle">
              <span class="text">图片</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">创建时间
                <span class="iconCtn">
                  <i class="el-icon-caret-top"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchStateFlag">状态
                  <i class="el-icon-search iconBtn"
                    @click="searchStateFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchStateFlag"
                    class="filterBox">
                    <el-dropdown :hide-on-click="false"
                      trigger="click"
                      style="cursor:pointer">
                      <span class="el-dropdown-link">
                        状态筛选<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          工艺单：
                          <el-radio-group v-model="has_craft">
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="0">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          配料单：
                          <el-radio-group v-model="has_plan"
                            divided>
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="0">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          报价单：
                          <el-radio-group v-model="has_quotation"
                            divided>
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="0">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in productList"
            :key="index">
            <div class="col">{{item.product_code}}</div>
            <div class="col">{{item|filterType}}</div>
            <div class="col">{{item.flower_id}}</div>
            <div class="col">{{item.name}}</div>
            <div class="col">
              <zh-img-list :list="item.image"></zh-img-list>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">
              <div :class="{'stateCtn':true, 'green':item.has_craft === 1}">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div :class="{'stateCtn':true, 'green':item.has_plan === 1}">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div :class="{'stateCtn':true, 'green':item.quotation_id === 1}">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
            </div>
            <div class="col">
              <el-checkbox v-model="item.checked"
                @change="checkedPro($event,item)"></el-checkbox>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
      <div class="editCtn">
        <div class="rowCtn"
          style="margin:0">
          <div class="colCtn">
            <span class="label">
              <span class="text">已选产品</span>
            </span>
            <span class="content"
              v-if="checkedProList.length === 0">暂无选中产品</span>
            <span class="content checkProBox"
              v-if="checkedProList.length > 0">
              <div class="flexWarp"
                v-for="(itemCheck,indexCheck) in checkedProList"
                :key="indexCheck">
                <zh-input placeholder="请选择产品"
                  disabled
                  v-model="itemCheck.product_code">
                </zh-input>
                <div class="editBtn deleteBtn"
                  @click="cancleChecked(itemCheck)">删除
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加订单</span>
      </div>
      <div class="editCtn hasBorderTop"
        v-for="(itemBatch,indexBatch) in batchDate"
        :key="indexBatch">
        <div class="titleNum">第{{chinaNum[indexBatch]}}批</div>
        <div class="deleteIcon el-icon-close"
          @click="deleteItem(batchDate,indexBatch)"></div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="content timeCtn">
              <span class="label">批次名称</span>
              <zh-input v-model="itemBatch.name"
                placeholder="可输入批次名称、PO号或者其它订单号"></zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="content timeCtn">
              <span class="label">批次类型</span>
              <el-autocomplete v-model="itemBatch.type"
                :fetch-suggestions="querySearchType"
                placeholder="请输入批次类型"></el-autocomplete>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="content timeCtn">
              <span class="label">交货日期</span>
              <el-date-picker v-model="itemBatch.time"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择交货日期">
              </el-date-picker>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="content timeCtn">
              <span class="label">批次备注</span>
              <zh-input v-model="itemBatch.remark"
                placeholder="请输入批次备注"></zh-input>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row">产品</span>
              <span class="tb_row">尺码颜色</span>
              <span class="tb_row">单价</span>
              <span class="tb_row">数量</span>
              <span class="tb_row middle">色组操作</span>
              <span class="tb_row middle flex06">产品操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemPro,indexPro) in itemBatch.batch_info"
              :key="indexPro">
              <span class="tb_row"
                style="position:relative">
                <el-select v-model="itemPro.id"
                  class="editInput"
                  placeholder="请选择产品"
                  @change="selectPro($event,itemBatch.batch_info,indexPro)">
                  <el-option v-for="item in checkedProList"
                    :key="item.id"
                    :label="item.product_code"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="itemPro.product_info&&itemPro.product_info.length>1"
                  class="oprText"
                  @click="syncPirce(itemPro)">同步单价信息
                  <el-tooltip class="item"
                    effect="dark"
                    content="点击按钮可以将本款产品的其他尺码配色组同步第一组尺码配色的单价"
                    placement="bottom">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              </span>
              <span class="flex40 tb_row tb_col">
                <span class="tb_col_item"
                  v-for="(itemSize,indexSize) in itemPro.product_info"
                  :key="indexSize">
                  <span class="tb_row">
                    <el-cascader v-model="itemSize.size_color"
                      class="editInput"
                      placeholder="请选择尺码颜色"
                      :options="itemPro.sizeColor"
                      :key="isResouceShow"
                      @change="selectSize($event,itemPro.product_info,indexSize)"></el-cascader>
                  </span>
                  <span class="tb_row">
                    <zh-input placeholder="请输入单价"
                      class="editInput"
                      v-model="itemSize.price"
                      type='number'
                      @input="computedTotalPrice">
                      <template slot="append">{{unit}}</template>
                    </zh-input>
                  </span>
                  <span class="tb_row">
                    <zh-input placeholder="请输入数量"
                      class="editInput"
                      v-model="itemSize.number"
                      type='number'
                      @input="computedTotalPrice"></zh-input>
                  </span>
                  <span class="tb_row middle"
                    style="user-select: none;">
                    <span class="tb_handle_btn blue"
                      @click="addItem(itemPro.product_info,'sizeColor')">添加色组</span>
                    <span class="tb_handle_btn red"
                      @click="deleteItem(itemPro.product_info,indexSize)">删除色组</span>
                  </span>
                </span>
              </span>
              <span class="tb_row middle flex06">
                <span class="tb_handle_btn red"
                  @click="deleteItem(itemBatch.batch_info,indexPro)">删除产品</span>
              </span>
            </div>
            <div class="tb_content">
              <span class="tb_row tb_row_handle_btn"
                @click="addItem(itemBatch.batch_info,'batch_pro')">+新增产品</span>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-if="indexBatch === batchDate.length -1">
          <div class="colCtn">
            <span class="content">
              <div class="btn btnWhiteBlue add_batch_btn"
                @click="addItem(batchDate,'batch')">添加批次</div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn"
        style="display:flex;justify-content: space-between">
        <span class="title">预警设置
          <el-tooltip class="item"
            effect="dark"
            content="设置订单流程到期预警"
            placement="top-start">
            <em class="el-icon-question"></em>
          </el-tooltip>
        </span>
        <span class="right"
          style="display:flex;align-items:center">
          <div class="btn noBorder"
            :style="{'color': isOpenWarn ? '' : '#BBB'}">流程预警</div>
          <el-switch v-model="isOpenWarn" />
        </span>
      </div>
      <div class="detailCtn"
        v-if="isOpenWarn">
        <div class="rowCtn">
          <div class="warn_setting">
            <div class="warn_setting_top">
              <div class="warn_setting_top_left">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    {{warnType || '选择类型'}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in warnList"
                      :key="index">
                      <div @click="checkedWarn(item)">{{item.title}}</div>
                    </el-dropdown-item>
                    <el-dropdown-item disabled
                      v-if="warnList.length===0">暂无数据 </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="warn_setting_bottom">
              <zh-time-process :processData="timeData"
                :startTime="order_time"
                :endTime='getWarnEndTime()'
                style="width:100%"></zh-time-process>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="taxt">总价</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入总价"
                v-model="total_price"
                disabled>
                <template slot="append">{{unit}}</template>
              </zh-input>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">订单合同</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                multiple
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="orderUpload"
                :file-list="order_file_arr"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">包装资料</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                multiple
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="packagUpload"
                :file-list="packag_file_arr"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">装箱资料</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                multiple
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="boxUpload"
                :file-list="box_file_arr"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">其他文件</span>
            </span>
            <span class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                multiple
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="otherUpload"
                :file-list="other_file_arr"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="taxt">备注信息</span>
            </span>
            <span class="content">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="remark"
                placeholder="请输入备注信息"></el-input>
            </span>
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
            @click="saveAll">添加</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum, moneyArr } from '@/assets/js/dictionary.js'
import { product, client, group, order, getToken, warnSetting, orderType } from '@/assets/js/api.js'
export default {
  data () {
    return {
      lock: true,
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      order_code: [{ code: '' }],
      client_id: '',
      clientArr: [],
      contact_id: '',
      contactArr: [],
      group_id: '',
      groupArr: [],
      unit: '元',
      unitArr: moneyArr,
      exchange_rate: 100,
      tax_prop: 12,
      order_time: this.$getTime(),
      searchCode: '',
      date: '',
      searchTypeFlag: false,
      typeArr: [],
      type: '',
      searchFlowerFlag: false,
      flower_id: '',
      flowerArr: [],
      searchStateFlag: false,
      has_craft: null,
      has_plan: null,
      has_quotation: null,
      productList: [],
      total: 0,
      pages: 1,
      checkedProList: [],
      chinaNum: chinaNum,
      batchDate: [
        {
          time: '',
          name: '',
          remark: '',
          type: '',
          batch_info: [{
            id: '',
            unit: '个',
            product_info: [
              {
                size_color: '',
                price: '',
                number: ''
              }
            ]
          }]
        }
      ],
      postData: { token: '' },
      total_price: '',
      remark: '',
      isResouceShow: 0, // 处理cascader报错问题 绑定key值用来当option改变时重新渲染cascader
      order_file_arr: [],
      packag_file_arr: [],
      box_file_arr: [],
      other_file_arr: [],
      importKeyword: '',
      // 预警数据
      isOpenWarn: false,
      warnType: '',
      warnList: [],
      timeData: [{ percent: 0.2, name: '物料计划' }, { percent: 0.2, name: '物料入库' }, { percent: 0.2, name: '半成品入库' }, { percent: 0.2, name: '成品入库' }, { percent: 0.2, name: '成品装箱' }],
      orderTypeArr: []
    }
  },
  methods: {
    // 批次类型输入建议函数
    querySearchType (queryString, cb) {
      let restaurants = this.orderTypeArr
      let results = queryString ? restaurants.filter(itemF => itemF.value.indexOf(queryString) !== -1) : restaurants
      cb(results)
    },
    // 获取汇率
    getUnit (ev) {
      this.exchange_rate = moneyArr.find((item) => item.name === ev).default
      this.tax_prop = moneyArr.find((item) => item.name === ev).tax_prop
    },
    // 同步单价信息
    syncPirce (pro) {
      let price = this.$clone(pro.product_info[0]).price
      pro.product_info.forEach((item) => {
        item.price = price
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
    getWarnEndTime () {
      let data = this.batchDate[0].time
      return data || this.$getTime()
    },
    querySearchOrder (querystring, cb) {
      order.list({
        page: 1,
        limit: 9999,
        keyword: querystring
      }).then(res => {
        if (res.data.status !== false) {
          cb(res.data.data.map(item => {
            return {
              value: item.order_code,
              id: item.id
            }
          }))
        }
      })
    },
    // querySearchOrderType (querystring, cb) {
    //   var results = querystring ? this.orderTypeArr.filter(itemF => itemF.value.toLowerCase().indexOf(querystring.toLowerCase()) !== -1) : this.orderTypeArr
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    addItem (item, type) {
      if (type === 'code') {
        item.push({ code: '' })
      } else if (type === 'batch') {
        item.push({
          time: '',
          name: '',
          remark: '',
          type: '',
          batch_info: [{
            id: '',
            unit: '个',
            product_info: [
              {
                size_color: '',
                price: '',
                number: ''
              }
            ]
          }]
        })
      } else if (type === 'batch_pro') {
        item.push({
          id: '',
          unit: '个',
          product_info: [
            {
              size_color: '',
              price: '',
              number: ''
            }
          ]
        })
      } else if (type === 'sizeColor') {
        item.push({
          size_color: '',
          price: '',
          number: ''
        })
      }
    },
    deleteItem (item, index) {
      if (item.length === 1) {
        this.$message.warning('至少存在一项')
        return
      }
      item.splice(index, 1)
      this.isResouceShow++
      this.computedTotalPrice()
    },
    beforeAvatarUpload (file) {
      // let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      // let fileNameLength = file.name.length// 取到文件名长度
      // let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = file.name
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 10MB!')
        return false
      }
    },
    getList () {
      this.loading = true
      product.list({
        limit: 5,
        page: this.pages,
        product_code: this.searchCode,
        category_id: this.category_id,
        type_id: this.type_id,
        style_id: this.style_id,
        flower_id: this.flower_id,
        has_plan: this.has_plan,
        has_craft: this.has_craft,
        has_quotation: this.has_quotation,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        type: 1
      }).then(res => {
        if (res.data.status === false) {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        } else {
          this.productList = res.data.data.map(item => {
            if (this.checkedProList.find(vals => vals.id === item.id)) {
              return { ...item, checked: true }
            } else {
              return { ...item, checked: false }
            }
          })
          this.total = res.data.meta.total
        }
        this.loading = false
      })
    },
    searchCodeChange (newVal) {
      this.pages = 1
      this.getList()
    },
    checkedPro (ev, item) {
      if (ev) {
        if (!item.sizeColor) {
          item.sizeColor = []
        }
        item.sizeColor = item.size.map(valSize => {
          return {
            value: valSize.size_id,
            label: valSize.size_name,
            children: item.color.map(valColor => {
              return {
                value: valColor.color_id,
                label: valColor.color_name
              }
            })
          }
        })
        this.checkedProList.push(item)
        this.batchDate.forEach(itemBatch => {
          this.checkedProList.forEach((itemPro, indexPro) => {
            let arr = []
            itemPro.size.forEach(itemSize => {
              itemPro.color.forEach(itemColor => {
                arr.push({
                  size_color: [itemSize.size_id, itemColor.color_id],
                  price: '',
                  number: ''
                })
              })
            })
            if (!itemBatch.batch_info.find(val => val.id === itemPro.id)) {
              if (itemBatch.batch_info[0] && !itemBatch.batch_info[0].id) {
                itemBatch.batch_info[0].id = itemPro.id
                itemBatch.batch_info[0].unit = itemPro.category_info.name
                itemBatch.batch_info[0].sizeColor = itemPro.sizeColor
                itemBatch.batch_info[0].product_info = arr
              } else {
                itemBatch.batch_info.push({
                  id: itemPro.id,
                  unit: itemPro.category_info.name,
                  sizeColor: itemPro.sizeColor,
                  product_info: arr
                })
              }
            }
            this.isResouceShow++
          })
        })
        this.batchDate = this.$clone(this.batchDate)
      } else {
        // 产品取消选中时，批次内删除该产品
        this.batchDate.forEach(itemBatch => {
          let index = itemBatch.batch_info.map(itemPro => itemPro.id).indexOf(item.id)
          if (index !== -1) {
            itemBatch.batch_info.splice(index, 1)
          }
        })
        let cancleProFlag = this.checkedProList.find(items => items.id === item.id)
        if (cancleProFlag) {
          cancleProFlag.checked = false
        }
        this.checkedProList = this.checkedProList.filter(items => items.checked)
      }
    },
    cancleChecked (item) {
      // 产品取消选中时，批次内删除该产品
      this.batchDate.forEach(itemBatch => {
        let index = itemBatch.batch_info.map(itemPro => itemPro.id).indexOf(item.id)
        if (index !== -1) {
          itemBatch.batch_info.splice(index, 1)
          this.isResouceShow++
        }
      })
      item.checked = false
      this.checkedProList = this.checkedProList.filter(items => items.checked)
      let cancleProFlag = this.productList.find(items => items.id === item.id)
      if (cancleProFlag) {
        cancleProFlag.checked = false
      }
    },
    selectPro (event, item, index) {
      let itemPro = item[index]
      if (item.filter(itemBatch => itemBatch.id === event).length > 1) {
        this.$message.warning('检测到同批次中已选中该产品，不可重复选择')
        itemPro.id = ''
        return
      }
      let selectFlag = this.checkedProList.find(val => val.id === event)
      if (selectFlag) {
        itemPro.sizeColor = selectFlag.sizeColor
        this.isResouceShow++
        itemPro.product_info = []
        itemPro.unit = selectFlag.category_info.name || '个'
        selectFlag.size.forEach(itemSize => {
          selectFlag.color.forEach(itemColor => {
            itemPro.product_info.push({
              size_color: [itemSize.size_id, itemColor.color_id],
              price: '',
              number: ''
            })
          })
        })
      }
    },
    selectSize (event, item, index) {
      if (item.filter(itemSize => (itemSize.size_color[0] === event[0] && itemSize.size_color[1] === event[1])).length > 1) {
        this.$message.warning('检测到该批次中该产品已选中该尺码颜色，不可重复选择')
        item[index].size_color = ''
      }
    },
    computedTotalPrice () { // 计算总价
      this.total_price = 0
      this.batchDate.forEach(itemBtach => {
        itemBtach.batch_info.forEach(itemPro => {
          itemPro.product_info.forEach(itemSize => {
            if (itemSize.price && itemSize.number) {
              this.total_price += (itemSize.price * itemSize.number)
            }
          })
        })
      })
    },
    saveAll () {
      if (!this.lock) {
        this.$message.warning('请勿频繁点击')
        return
      }
      let flag = true
      this.order_code.forEach(item => {
        if (!item.code) {
          flag = false
        }
      })
      if (!flag) {
        this.$message.error('请填写订单号')
        return
      }
      if (!this.order_type) {
        this.$message.error('请选择订单类型')
        return
      }
      if (!this.client_id) {
        this.$message.error('请选择外贸公司')
        return
      }
      if (!this.group_id) {
        this.$message.error('请选择负责小组')
        return
      }
      if (!this.unit) {
        this.$message.error('请选择结算单位')
        return
      }
      if (Number(this.tax_prop) !== 0 && !this.tax_prop) {
        this.$message.error('请输入税率')
        return
      }
      if (!this.order_time) {
        this.$message.error('请选择下单日期')
        return
      }
      let timeFlag = true // 是否选择了交货时间的flag
      if (this.batchDate.length < 1) {
        this.$message.error('检测到没有批次数据，请添加')
        return
      }
      this.batchDate.forEach(item => {
        if (!item.time) {
          timeFlag = false
        }
        if (item.batch_info.length < 1) {
          this.$message.error('检测到批次内没有产品信息，请添加')
          flag = false
        }
        item.batch_info.forEach(itemBtach => {
          if (!itemBtach.id) {
            flag = false
          }
          if (itemBtach.product_info.length < 1) {
            this.$message.error('检测到产品内没有尺码颜色信息，请添加')
            flag = false
          }
          itemBtach.product_info.forEach(itemPro => {
            if (itemPro.size_color.length === 0 || !itemPro.price || !itemPro.number) {
              flag = false
            }
          })
        })
      })
      if (!timeFlag) {
        this.$message.error('请选择交货日期')
        return
      }
      if (!flag) {
        this.$message.error('检测到批次信息内有还未填写项，请检查批次内是否填写完成')
        return
      }
      if (!this.total_price) {
        this.$message.error('请输入总价')
        return
      }
      const orderContract = this.$refs.orderUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      const packMeans = this.$refs.packagUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      const storeMeans = this.$refs.boxUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      const otherInfo = this.$refs.otherUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      let materialPlanFlag = this.timeData.find(item => item.name === '物料计划')
      let productPackFlag = this.timeData.find(item => item.name === '成品装箱')
      let productPushFlag = this.timeData.find(item => item.name === '成品入库')
      let semiProductPushFlag = this.timeData.find(item => item.name === '半成品入库')
      let materialPushFlag = this.timeData.find(item => item.name === '物料入库')
      let warnData = this.isOpenWarn ? {
        order_time: this.order_time,
        end_time: this.getWarnEndTime(),
        progress_data: {
          material_plan: this.$toFixed(materialPlanFlag.percent * 100),
          material_push: this.$toFixed(materialPushFlag.percent * 100),
          semi_product_push: this.$toFixed(semiProductPushFlag.percent * 100),
          product_push: this.$toFixed(productPushFlag.percent * 100),
          product_pack: this.$toFixed(productPackFlag.percent * 100)
        }
      } : null
      let data = {
        order_code: this.order_code.map(item => {
          return item.code
        }).join(';'),
        client_id: this.client_id,
        contacts: this.contact_id,
        account_unit: this.unit,
        group_id: this.group_id,
        exchange_rate: this.exchange_rate || moneyArr.find((item) => item.name === this.unit).default,
        tax_rate: this.tax_prop,
        order_time: this.order_time,
        order_info: this.batchDate.map((item, index) => {
          return {
            batch_info: item.batch_info.map(itemPro => {
              return {
                product_id: itemPro.id,
                product_info: itemPro.product_info.map(itemSize => {
                  return {
                    size_id: itemSize.size_color[0],
                    color_id: itemSize.size_color[1],
                    numbers: itemSize.number,
                    unit_price: itemSize.price
                  }
                })
              }
            }),
            delivery_time: item.time,
            batch_id: parseInt(index + 1),
            batch_title: item.name,
            order_type: item.type,
            desc: item.remark
          }
        }),
        total_price: this.total_price,
        remark: this.remark,
        total_price_RMB: this.total_price * this.exchange_rate / 100,
        order_contract: JSON.stringify(orderContract),
        pack_means: JSON.stringify(packMeans),
        store_means: JSON.stringify(storeMeans),
        others_info: JSON.stringify(otherInfo),
        time_progress: warnData
      }
      this.lock = false
      order.create(data).then(res => {
        if (res.data.status) {
          this.$message.success('添加成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/order/orderDetail/' + res.data.data.id
            this.msgContent = '<span style="color:#E6A23C">添加</span>了一个订单<span style="color:#1A95FF">' + res.data.data.order_code + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/order/orderDetail/' + res.data.data.id)
          }
        }
      })
    },
    getContact (eve) { // 外贸公司chang时更新联系人列表
      this.contact_id = ''
      let flag = this.clientArr.find(item => item.id === eve)
      if (flag) {
        this.contactArr = flag.contacts
      }
    },
    importOrder (event) {
      this.loading = true
      order.editDetail({
        id: event.id
      }).then(res => {
        if (res.data.status === false) {
          return
        }
        // 初始化修改订单数据
        let orderInfo = res.data.data
        this.order_code = orderInfo.order_code.split(';').map(item => {
          return {
            code: item
          }
        })
        this.order_type = orderInfo.order_type
        this.client_id = orderInfo.client_id.toString()
        this.getContact(this.client_id)
        this.contact_id = orderInfo.contacts_id
        this.group_id = orderInfo.group_id
        this.unit = orderInfo.account_unit
        this.exchange_rate = orderInfo.exchange_rate
        this.tax_prop = orderInfo.tax_rate
        this.order_time = orderInfo.order_time
        let orderBatch = []
        let arr = [] // 存储产品id
        orderInfo.order_batch.forEach(itemBatch => {
          let productInfo = this.$mergeData(this.$clone(itemBatch.product_info).map(items => {
            items.id = items.product_info.product_id.toString()
            items.unit = items.product_info.unit
            items.sizeColor = items.product_info.size_measurement.map(valSize => {
              return {
                value: valSize.size_id,
                label: valSize.size_name,
                children: items.product_info.color.map(valColor => {
                  return {
                    value: valColor.color_id,
                    label: valColor.color_name
                  }
                })
              }
            })
            delete items.product_info
            delete items.image
            return items
          }), { mainRule: 'id', otherRule: [{ name: 'unit' }, { name: 'sizeColor' }], childrenName: 'product_info', childrenRule: { mainRule: ['size_id', 'color_id', 'unit_price/price'], otherRule: [{ name: 'numbers/number', type: 'add' }, { name: 'size_name/color' }, { name: 'color_name/color' }] } })
          orderBatch.push({
            time: itemBatch.delivery_time,
            remark: itemBatch.desc,
            name: itemBatch.batch_title,
            type: itemBatch.order_type,
            batch_info: productInfo
          })
          itemBatch.product_info.forEach(itemPro => {
            let flag = arr.find(itemId => itemId.id === itemPro.product_info.product_id.toString())
            if (!flag) {
              arr.push({
                category_info: {
                  name: itemPro.product_info.unit,
                  product_category: itemPro.product_info.category_name
                },
                checked: true,
                color: itemPro.product_info.color,
                flower_id: itemPro.product_info.flower_name,
                id: itemPro.product_info.product_id.toString(),
                product_code: itemPro.product_info.product_code,
                sizeColor: itemPro.product_info.size_measurement.map(valSize => {
                  return {
                    value: valSize.size_id,
                    label: valSize.size_name,
                    children: itemPro.product_info.color.map(valColor => {
                      return {
                        value: valColor.color_id,
                        label: valColor.color_name
                      }
                    })
                  }
                }),
                size: itemPro.product_info.size_measurement
              })
            }
          })
        })
        this.checkedProList = arr
        this.batchDate = orderBatch.map(itemBatch => {
          return {
            time: itemBatch.time,
            batch_info: itemBatch.batch_info.map(itemPro => {
              return {
                id: itemPro.id,
                product_info: itemPro.product_info.map(itemSize => {
                  return {
                    size_color: [itemSize.size_id, itemSize.color_id],
                    number: itemSize.number,
                    price: itemSize.price
                  }
                }),
                sizeColor: itemPro.sizeColor,
                unit: itemPro.unit
              }
            }),
            name: itemBatch.name,
            remark: itemBatch.remark,
            type: itemBatch.type
          }
        })
        this.order_file_arr = orderInfo.order_contract ? JSON.parse(orderInfo.order_contract).map(items => {
          return {
            name: items.replace('https://zhihui.tlkrzf.com/', ''),
            url: items
          }
        }) : []
        this.packag_file_arr = orderInfo.pack_means ? JSON.parse(orderInfo.pack_means).map(items => {
          return {
            name: items.replace('https://zhihui.tlkrzf.com/', ''),
            url: items
          }
        }) : []
        this.box_file_arr = orderInfo.store_means ? JSON.parse(orderInfo.store_means).map(items => {
          return {
            name: items.replace('https://zhihui.tlkrzf.com/', ''),
            url: items
          }
        }) : []
        this.other_file_arr = orderInfo.others_info ? JSON.parse(orderInfo.others_info).map(items => {
          return {
            name: items.replace('https://zhihui.tlkrzf.com/', ''),
            url: items
          }
        }) : []
        this.computedTotalPrice()
        this.remark = orderInfo.remark
        this.loading = false
      })
    }
  },
  created () {
    if (this.$route.query.productId) { // 产品详情进入直接勾选上该产品的优化
      product.detail({
        id: this.$route.query.productId
      }).then(res => {
        if (res.data.stauts !== false) {
          let data = res.data.data
          this.checkedProList.push({
            id: data.id,
            product_code: data.product_code,
            size: data.size,
            color: data.color,
            checked: true,
            sizeColor: data.size.map(itemSize => {
              return {
                value: itemSize.size_id,
                label: itemSize.size_name,
                children: data.color.map(itemColor => {
                  return {
                    value: itemColor.color_id,
                    label: itemColor.color_name
                  }
                })
              }
            })
          })
          this.batchDate.forEach(itemBatch => {
            itemBatch.time = this.$getTime()
            let sizeColor = data.size.map(itemSize => {
              return data.color.map(itemColor => {
                return {
                  size_color: [itemSize.size_id, itemColor.color_id],
                  number: '',
                  price: ''
                }
              })
            })
            itemBatch.batch_info = []
            itemBatch.batch_info.push({
              id: data.id.toString(),
              product_info: sizeColor.reduce((a, b) => {
                return a.concat(b)
              }),
              sizeColor: data.size.map(itemSize => {
                return {
                  value: itemSize.size_id,
                  label: itemSize.size_name,
                  children: data.color.map(itemColor => {
                    return {
                      value: itemColor.color_id,
                      label: itemColor.color_name
                    }
                  })
                }
              }),
              unit: data.category_info.name
            })
          })
        }
      })
    }
    if (this.$route.query.orderId) { // 复制订单直接导入某个订单
      this.importOrder({ id: this.$route.query.orderId })
    }
    this.getList()
    Promise.all([
      client.list(),
      group.list(),
      getToken(),
      warnSetting.list(),
      orderType.typeList({
        order_type: 1
      })
    ]).then(res => {
      this.loading = true
      this.clientArr = res[0].data.data.filter(item => item.type.indexOf(1) !== -1)
      this.groupArr = res[1].data.data
      this.postData.token = res[2].data.data
      this.warnList = res[3].data.data.filter(item => item.order_type === 1)
      this.orderTypeArr = res[4].data.data.map(item => {
        return {
          value: item.name
        }
      })
      this.loading = false
    })
  },
  filters: {
    filterType (item) {
      return [item.category_info.product_category, item.type_name, item.style_name].join('/')
    }
  },
  watch: {
    type: {
      deep: true,
      handler (newVal) {
        this.pages = 1
        this.category_id = newVal[0] ? newVal[0] : ''
        this.type_id = newVal[1] ? newVal[1] : ''
        this.style_id = newVal[2] ? newVal[2] : ''
        this.getList()
      }
    },
    date: {
      deep: true,
      handler (newVal) {
        this.pages = 1
        this.getList()
      }
    },
    flower_id (newVal) {
      this.pages = 1
      this.getList()
    },
    has_plan (newVal) {
      this.pages = 1
      this.getList()
    },
    has_craft (newVal) {
      this.pages = 1
      this.getList()
    },
    has_quotation (newVal) {
      this.pages = 1
      this.getList()
    },
    unit (newVal) {
      if (newVal === '元') {
        this.exchange_rate = 100
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/order/orderCreate.less";
</style>
<style lang="less">
#orderCreate {
  .editCtn {
    //  日期选择器样式修改
    .el-date-editor {
      width: 100% !important;
      height: 100% !important;
      line-height: 32px !important;
    }
  }
  .el-input__inner {
    height: 32px !important;
  }
  .oprText {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    position: absolute;
    top: 40px;
    left: 4px;
    cursor: pointer;
    &:hover {
      color: #1a95ff;
    }
  }
}
</style>
