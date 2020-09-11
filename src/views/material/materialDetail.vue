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
          :afterSend="afterSend"></zh-message>
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
    <div class="module"
      id="order">
      <div class="titleCtn rightBtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购</span>
        <span class="btn btnWhiteBlue"
          @click="getStockInfo">查看库存数据
          <span class="el-icon-d-arrow-right"></span>
        </span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.7">订购公司</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn"
                        style="flex:1.8">{{type==='1'?'原':'辅'}}料名称</div>
                      <div class="tcolumn">{{type==='1'?'颜色':'属性'}}</div>
                      <div class="tcolumn">单价</div>
                      <div class="tcolumn">数量</div>
                      <div class="tcolumn">交货日期</div>
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
                  <div class="tcolumn"
                    style="flex:1.7">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn"
                        style="flex:1.8">{{itemChild.material_name}}</div>
                      <div class="tcolumn">{{itemChild.color_code}}</div>
                      <div class="tcolumn">{{itemChild.price}}元</div>
                      <div class="tcolumn"><span class="green">{{itemChild.weight}}{{type==='1'?'kg':itemChild.unit}}</span></div>
                      <div class="tcolumn">
                        <span v-html="$getZHTimeFormat(itemChild.complete_time)"></span>
                      </div>
                    </div>
                  </div>
                  <div class="tcolumn"><span class="green">{{item.total_price}}元</span></div>
                  <div class="tcolumn"
                    style="flex-direction: row; justify-content: start; align-items: center;">
                    <span class="blue"
                      @click="$openUrl('/materialTable/' + $route.params.id + '/' + $route.params.orderType + '/' + $route.params.type + '?clientName=' + item.client_name )">打印</span>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in order_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteItem(order_data,index)">
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
                        clearable
                        filterable
                        placeholder="请选择订购公司">
                        <el-option v-for="item in orderCompany"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
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
                      <span class="explanation">(默认是产品所需物料)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <!-- 补纱的时候用补纱id，不需要订购id -->
                        <el-select v-model="itemMat.id"
                          v-if="item.replenishFlag"
                          @change="selectMaterial($event,itemMat)">
                          <el-option v-for="item in replenishMat"
                            :key="item.id"
                            :value="item.id"
                            :label="item.material_name+'/'+item.material_color">
                          </el-option>
                        </el-select>
                        <!-- 订购的时候显示纱线名称 -->
                        <el-autocomplete v-model="itemMat.name"
                          v-if="!item.replenishFlag"
                          :fetch-suggestions="searchYarn"
                          placeholder="请输入名称(支持搜索)">
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
                      <span class="text">单价/数量</span>
                    </div>
                    <div class="content"
                      style="display:flex;justify-content:space-between">
                      <zh-input style="width:150px"
                        placeholder="单价"
                        v-model="itemMat.price"
                        type="number">
                        <template slot="append">元</template>
                      </zh-input>
                      <zh-input style="width:150px"
                        placeholder="数量"
                        v-model="itemMat.number"
                        type="number">
                        <template slot="append"
                          v-if="type==='1'">kg</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexMat===0 && !replenishFlag"
                      @click="addItem(item.material,'material')">添加</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexMat>0"
                      @click="deleteItem(item.material,indexMat)">删除</div>
                    <el-tooltip class="item"
                      effect="dark"
                      content="复制一个相同名称和单价的物料"
                      placement="top"
                      v-if="!replenishFlag">
                      <div class="editBtn addBtn"
                        style="margin-left:56px"
                        @click="copyItem(item.material,itemMat)">复制</div>
                    </el-tooltip>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
                    <div class="content"
                      style="display:flex">
                      <div class="colCtn"
                        style="margin-right:16px">
                        <div class="label">
                          <span class="text">下单日期</span>
                        </div>
                        <div class="content">
                          <el-date-picker v-model="item.order_time"
                            disabled
                            value-format="yyyy-MM-dd"
                            style="width:100%"
                            type="date"
                            placeholder="选择下单日期">
                          </el-date-picker>
                        </div>
                      </div>
                      <div class="colCtn"
                        style="margin-right:0">
                        <div class="label">
                          <span class="text">交货日期</span>
                        </div>
                        <div class="content">
                          <el-date-picker v-model="item.complete_time"
                            value-format="yyyy-MM-dd"
                            style="width:100%"
                            type="date"
                            placeholder="选择交货日期"
                            :picker-options="{disabledDate:filterDate}">
                          </el-date-picker>
                          <div class="prompt orange"
                            v-if="item.complete_time === $getTime()">您的交货日期为今日，请再次确认!</div>
                        </div>
                      </div>
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
                  v-if="order_data.length === 0"
                  @click="addItem(order_data,'order')">添加订购</span>
                <template v-else>
                  <span class="once cancle"
                    @click="reset('order')">取消订购</span>
                  <span class="once normal"
                    @click="addItem(order_data,'order')">添加订购公司</span>
                  <span class="once ok"
                    @click="saveOrder">确认订购</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="order_stock_log.length>0">
      <div class="titleCtn">
        <span class="title">{{type==='1'?'原':'辅'}}料订购日志</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-left:64px;padding-right:64px">
        <div class="btnCtn_page"
          style="justify-content: flex-end;margin-bottom:24px">
          <span style="display:flex">
            <div class="btn btnWhiteBlue"
              @click="deleteOrderLog('all')">批量删除</div>
            <div class="btn btnWhiteBlue"
              @click="downloadOrder">批量导出excel</div>
          </span>
          <span style="display:flex">
            <div class="btn btnWhiteBlue"
              :style="'color:' + checkedOrderClientInfo.length > 1 ? '#E9E9E9' : false"
              @click="printOrderTable">打印</div>
          </span>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <span class="tb_row flex04"></span>
            <span class="tb_row middle">创建日期</span>
            <span class="tb_row flex12">订购单位</span>
            <span class="tb_row flex12">{{type==='1'?'原':'辅'}}料名称</span>
            <span class="tb_row">{{type==='1'?'颜色':'属性'}}</span>
            <span class="tb_row flex08">单价(元)</span>
            <span class="tb_row flex08">数量</span>
            <span class="tb_row flex08">总价(元)</span>
            <span class="tb_row middle">备注</span>
            <span class="tb_row middle">完成日期</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(item,index) in order_stock_log"
            :key="index">
            <span class="tb_row flex04">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="tb_row middle">{{$getTime(item.create_time)}}</span>
            <span class="tb_row flex12"> {{item.client_name}} </span>
            <span class="tb_row flex12">{{item.material_name}}</span>
            <span class="tb_row">{{item.color_code}}</span>
            <span class="tb_row flex08">{{item.price}}</span>
            <span class="tb_row flex08">{{item.weight}}{{type==='1'?'kg':item.unit}}</span>
            <span class="tb_row flex08">{{$toFixed(item.price*item.weight)}}</span>
            <span class="tb_row middle">
              <template v-if="!item.desc">/</template>
              <el-popover placement="bottom"
                v-else
                width="200"
                trigger="click"
                :content="item.desc">
                <span class="tb_row_handle_btn blue"
                  slot="reference">查看</span>
              </el-popover>
            </span>
            <span class="tb_row middle">{{$getTime(item.complete_time)}}</span>
            <span class="tb_row">{{item.user_name}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn red"
                @click="deleteOrderLog(item.id,index)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <zh-deduct :orderId='+$route.params.id'
            :orderType='+$route.params.orderType'
            :showType='deductPopupType'
            :logType='[1]'
            :clientList="clientArr"
            v-model="deductPopupFlag">
            <div class="btn btnWhiteBlue"
              @click="deductPopupFlag = true;deductPopupType = false">扣款日志</div>
            <div class="btn btnWhiteRed"
              @click="deductPopupFlag = true;deductPopupType = true">单位扣款</div>
          </zh-deduct>
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <!-- 库存信息 -->
    <el-drawer :visible.sync="showStockInfoFlag"
      custom-class="materialDetail_drawer"
      title="查看库存"
      :destroy-on-close='true'
      :with-header="false">
      <div class="drawerCtn">
        <div class="content">
          <div class="modules">
            <div class="title">
              <span class="text">库存信息</span>
            </div>
            <div class="rowCtn">
              <zh-input v-model="searchWord"
                clearable
                style="width:200px"
                placeholder='筛选物料名称'
                @change="getStockList(1)"></zh-input>
            </div>
            <div class="rowCtn">
              <div class="tableCtnLv2"
                v-loading='stockLoading'>
                <span class="tb_header">
                  <span class="tb_row"
                    style="flex:1.5">仓库</span>
                  <span class="tb_row"
                    style="flex:1.2">纱线名称</span>
                  <span class="tb_row">颜色</span>
                  <span class="tb_row"
                    style="flex:0.8">色号</span>
                  <span class="tb_row"
                    style="flex:0.8">批/缸号</span>
                  <span class="tb_row"
                    style="flex:0.8">库存数量</span>
                </span>
                <span class="tb_content"
                  v-for="(itemLog,indexLog) in stockList"
                  :key="indexLog">
                  <span class="tb_row"
                    style="flex:1.5">{{itemLog.store_name}}</span>
                  <span class="tb_row"
                    style="flex:1.2">{{itemLog.material_name}}</span>
                  <span class="tb_row">{{itemLog.material_color}}</span>
                  <span class="tb_row"
                    style="flex:0.8">{{itemLog.color_code || '/'}}</span>
                  <span class="tb_row"
                    style="flex:0.8">{{itemLog.vat_code || '/'}}</span>
                  <span class="tb_row"
                    style="flex:0.8">{{itemLog.total_weight}}</span>
                </span>
                <span class="tb_content"
                  v-if="stockList.length === 0">
                  <span class="tb_row">暂无库存数据</span>
                </span>
              </div>
            </div>
            <div class="rowCtn"
              style="justify-content:flex-end">
              <el-pagination background
                :page-size="5"
                layout="prev, pager, next"
                :total="stockTotal"
                :current-page.sync="stockPage"
                @current-change="getStockList">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { order, sampleOrder, client, yarn, material, yarnColor, materialManage, yarnStock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      type: this.$route.params.type, // 分辨原辅料
      orderInfo: {},
      productMatArr: [],
      replenishFlag: false,
      replenishList: [],
      order_stock_info: [],
      order_data: [
        {
          material: [{
            name: '',
            color: '',
            number: '',
            unit: '',
            price: '',
            id: ''
          }],
          replenishFlag: '',
          company_id: '',
          order_time: this.$getTime(),
          complete_time: '',
          desc: ''
        }
      ],
      order_stock_log: [],
      orderCompany: [],
      // 订购modules初始化数据
      yarnList: [],
      colorList: [],
      // 扣款窗口数据
      deductPopupFlag: false,
      clientArr: [],
      deductPopupType: true,
      // 抽屉数据
      showStockInfoFlag: false,
      stockLoading: false,
      searchWord: '',
      stockList: [],
      stockTotal: 1,
      stockPage: 1
    }
  },
  methods: {
    filterDate (date) {
      return new Date(this.$getTime(date)).getTime() < new Date(this.$getTime()).getTime()
    },
    getStockList (page) {
      this.stockPage = page || this.stockPage
      this.stockLoading = true
      yarnStock.list({
        limit: 5,
        page: this.stockPage,
        type: this.$route.params.type,
        material_name: this.searchWord || '',
        material_type: this.$route.params.type
      }).then(res => {
        if (res.data.status !== false) {
          this.stockList = res.data.data
          this.stockTotal = res.data.meta.total
          this.stockLoading = false
        }
      })
    },
    getStockInfo () {
      this.showStockInfoFlag = true
      this.getStockList(1)
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
        return item.price === ''
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
          price: item.price,
          total_weight: item.number,
          color_code: item.color,
          material_name: item.name,
          material_type: this.type,
          replenish_id: item.replenishFlag ? item.id : null,
          client_id: item.company_id,
          order_id: this.$route.params.id
        }
      })
      materialManage.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.reset('order')
          this.$message.success('订购成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType + '/normal'
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料订购信息,' + (this.$route.params.orderType === '1' ? '订' : '样') + '单号<span style="color:#1A95FF">' + this.orderInfo.order_code + '</span>'
            this.msgSwitch = true
          } else {
            if (this.$route.params.easyOrder === 'easy') {
              this.$router.push('/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType + '/normal')
              this.init()
            } else {
              this.init()
            }
          }
          this.replenishFlag = false
        }
      })
    },
    searchYarn (queryString, cb) {
      if (this.yarnList.length === 0) {
        let yarnApi = this.type === '1' ? yarn : material
        yarnApi.list().then(res => {
          if (res.data.status !== false) {
            this.yarnList = res.data.data.map((item) => {
              return {
                value: item.name
              }
            })
            this.searchYarn(queryString, cb)
          }
        })
      } else {
        let result = queryString ? this.yarnList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.productMatArr
        cb(result)
      }
    },
    searchColor (queryString, cb) {
      if (this.colorList.length === 0) {
        yarnColor.list().then(res => {
          if (res.data.status !== false) {
            this.colorList = res.data.data.map((item) => {
              return {
                value: item.name
              }
            })
            this.searchColor(queryString, cb)
          }
        })
      } else {
        let result = queryString ? this.colorList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colorList
        cb(result)
      }
    },
    addItem (data, type) {
      if (type === 'order') {
        data.push({
          material: [{
            name: '',
            color: '',
            number: '',
            unit: '',
            price: '',
            id: ''
          }],
          replenishFlag: '',
          company_id: '',
          order_time: this.$getTime(),
          complete_time: '',
          desc: ''
        })
      } else if (type === 'material') {
        data.push({
          name: '',
          color: '',
          number: '',
          unit: '',
          price: '',
          id: ''
        })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    copyItem (data, item) {
      data.push(this.$clone(item))
    },
    reset (type) {
      if (type === 'order') {
        this.order_data = []
      }
    },
    init () {
      this.loading = true
      let api = this.$route.params.orderType === '1' ? order : sampleOrder
      Promise.all([
        api.detail({
          id: this.$route.params.id
        }),
        client.list(),
        materialManage.detail({
          order_type: this.$route.params.orderType,
          order_id: this.$route.params.id
        })
      ]).then(res => {
        // 初始化订单或样单数据
        this.orderInfo = res[0].data.data
        // 优化客供时选择原料框内直接建议产品内物料成分
        if (this.$route.params.orderType === '1') {
          this.productMatArr = this.$unique(this.$flatten(this.orderInfo.batch_info.map(itemB => {
            return itemB.product_info.map(itemP => {
              return itemP.component.map(itemC => {
                return { value: itemC.component_name }
              })
            })
          })), 'value')
        } else {
          this.productMatArr = this.$unique(this.$flatten(this.orderInfo.product_info.map(itemP => {
            return itemP.product_info.component.map(itemC => {
              return { value: itemC.component_name }
            })
          })), 'value')
        }
        // 初始化订购单位
        this.orderCompany = res[1].data.data.filter((item) => {
          if (this.type === '1') {
            return item.type.indexOf(2) !== -1
          } else {
            return item.type.indexOf(3) !== -1
          }
        })
        // 初始化订购数据
        this.order_stock_log = res[2].data.data.map((item) => {
          if (!item.client_name) {
            item.client_name = item.stock_name
          }
          return item
        }).filter(item => (item.material_type === Number(this.type)))
        this.order_stock_info = this.$mergeData(this.order_stock_log, { mainRule: 'client_name/client_name' })
        this.order_stock_info.forEach((item) => {
          item.total_price = parseInt(item.childrenMergeInfo.reduce((total, current) => {
            return total + current.price * current.weight
          }, 0))
        })
        // 初始化扣款单位数据
        this.clientArr = this.$unique(res[2].data.data.filter(itemF => itemF.client_name && itemF.material_type === Number(this.type)).map(itemM => {
          return {
            client_name: itemM.client_name,
            client_id: itemM.client_id,
            type: 1
          }
        }), 'client_id')
        this.loading = false
      })
    },
    afterSend () {
      if (this.$route.params.easyOrder === 'easy') {
        this.$router.push('/material/materialDetail/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.$route.params.orderType + '/normal')
        this.$winReload()
      } else {
        this.$winReload()
      }
    },
    // 批量导出excel订购
    downloadOrder () {
      let data = this.order_stock_log.filter(item => item.checked)
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
    // 订购日志勾选打印
    printOrderTable () {
      if (this.checkedOrderClientInfo.length === 0) {
        this.$message.warning('请勾选最少一个')
        return
      }
      if (this.checkedOrderClientInfo.length > 1) {
        this.$message.error('打印仅支持单个订购调取单位打印')
        return
      }
      let data = this.order_stock_log.filter(item => item.checked).map(item => item.id).join('-')
      this.$openUrl('/materialTable/' + this.$route.params.id + '/' + this.$route.params.orderType + '/' + this.$route.params.type + '?clientName=' + this.checkedOrderClientInfo[0].client_name + '&logId=' + data)
    },
    // 删除订购日志
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
    }
  },
  computed: {
    checkedOrderClientInfo () {
      let data = this.order_stock_log.filter(item => item.checked).map(item => {
        return {
          client_name: item.client_name
        }
      })
      return this.$mergeData(data, { mainRule: ['client_name'] })
    }
  },
  created () {
    this.init()
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
#materialDetail {
  .popup {
    .el-timeline-item {
      padding-bottom: 0px;
      margin-bottom: -9px;
    }
    .el-collapse-item__header {
      min-height: 46px;
      height: 46px;
    }
    .el-timeline-item__tail {
      margin-top: 14px;
    }
    .el-timeline-item__node--normal {
      margin-top: 14px;
    }
    .collapseBox {
      margin: 12px;
    }
  }
}
.materialDetail_drawer {
  min-width: 900px !important;
}
</style>
