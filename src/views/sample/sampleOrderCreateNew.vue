<template>
  <div id='sampleOrderCreate'
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
          placeholder="导入样品订单"
          :trigger-on-focus="false"
          @select="importOrder"></el-autocomplete>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">样单标题</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入样单标题"
                v-model="sample_order_title">
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">样单类型</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="sample_type"
                placeholder="请选择样单类型">
                <el-option v-for="item in sampleTypeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
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
        <div class="rowCtn">
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
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加样品</span>
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
            <div class="col">{{item.sample_product_code}}</div>
            <div class="col">{{item|filterType}}</div>
            <div class="col">{{item.flower_name}}</div>
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
            :page-size="6"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
      <div class="editCtn">
        <div class="rowCtn"
          v-if="checkedProList.length === 0">
          <div class="colCtn">
            <span class="label">
              <span class="text">已选样品</span>
            </span>
            <span class="content">暂无选中样品</span>
          </div>
        </div>
        <div class="rowCtn"
          v-else
          v-for="(itemCheck,indexCheck) in checkedProList"
          :key="indexCheck">
          <div class="colCtn flex3">
            <span class="label"
              v-if="indexCheck === 0">
              <span class="text">已选样品</span>
            </span>
            <span class="content"
              v-if="checkedProList.length > 0">
              <zh-input placeholder="请选择产品"
                disabled
                v-model="itemCheck.sample_product_code">
              </zh-input>
              <div class="editBtn deleteBtn"
                :style="indexCheck === 0 ? 'top:38px' : 'top:0'"
                @click="cancleChecked(itemCheck)">删除</div>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-if="indexCheck === 0">
              <span class="text"></span>
            </span>
            <span class="content checkSizeColorBox">
              <div class="flexWarpBox"
                v-for="(itemSize,indexSize) in itemCheck.sizeInfo"
                :key="indexSize">
                <div class="colCtn flex3">
                  <span class="cotent">
                    <el-cascader v-model="itemSize.size_color"
                      placeholder="请选择尺码颜色"
                      :options="itemCheck.sizeColor"
                      :key="isResouceShow"></el-cascader>
                  </span>
                </div>
                <div class="colCtn flex3">
                  <span class="content">
                    <zh-input placeholder="请输入打样数量"
                      type="number"
                      v-model="itemSize.number">
                      <span slot="append">{{itemCheck.unit}}</span>
                    </zh-input>
                    <div class="editBtn addBtn"
                      v-if="indexSize === 0"
                      @click="addItem(itemCheck.sizeInfo,'size_color')">添加</div>
                    <div class="editBtn deleteBtn"
                      v-else
                      @click="deleteItem(itemCheck.sizeInfo,indexSize)">删除</div>
                  </span>
                </div>
              </div>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label"><span class="tex">交货时间</span></span>
            <span class="content">
              <el-date-picker v-model="compiled_time"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择交货日期">
              </el-date-picker>
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
    <div class="module"
      :style="{'margin-bottom': isOpenWarn ? '0px' : '120px'}">
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
                      v-if="warnList.length===0">暂无数据</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="warn_setting_bottom">
              <zh-time-process :processData="timeData"
                :startTime="order_time"
                :endTime='compiled_time || $getTime()'
                style="width:100%"></zh-time-process>
            </div>
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
import { sample, client, group, sampleOrder, warnSetting, orderType } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      sample_order_title: '',
      sample_type: '',
      sampleTypeArr: [],
      order_time: this.$getTime(),
      group_id: '',
      groupArr: [],
      client_id: '',
      clientArr: [],
      contact_id: '',
      contactArr: [],
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
      compiled_time: '',
      remark: '',
      isResouceShow: 0, // 处理cascader报错问题 绑定key值用来当option改变时重新渲染cascader
      lock: true,
      importKeyword: '',
      // 预警数据
      isOpenWarn: false,
      warnType: '',
      warnList: [],
      timeData: [{ percent: 0.25, name: '物料计划' }, { percent: 0.25, name: '物料入库' }, { percent: 0.25, name: '半成品入库' }, { percent: 0.25, name: '成品入库' }]
    }
  },
  methods: {
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
        }
      ]
    },
    querySearchOrder (querystring, cb) {
      sampleOrder.list({
        page: 1,
        limit: 9999,
        keyword: querystring
      }).then(res => {
        if (res.data.status !== false) {
          cb(res.data.data.map(item => {
            return {
              value: item.title,
              id: item.id
            }
          }))
        }
      })
    },
    addItem (item, type) {
      if (type === 'size_color') {
        item.push({
          size_color: '',
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
    },
    getList () {
      this.loading = true
      sample.list({
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
        let newItem = this.$clone(item)
        newItem.sizeInfo = []
        newItem.size.forEach(valSize => {
          newItem.color.forEach(valColor => {
            newItem.sizeInfo.push({
              size_color: [valSize.size_id, valColor.color_id],
              number: ''
            })
            this.isResouceShow++
          })
        })
        this.checkedProList.push(newItem)
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
      item.checked = false
      this.checkedProList = this.checkedProList.filter(items => items.checked)
      let cancleProFlag = this.productList.find(items => items.id === item.id)
      if (cancleProFlag) {
        cancleProFlag.checked = false
      }
      this.isResouceShow++
    },
    saveAll () {
      if (!this.lock) {
        this.$message.warning('请勿频繁点击')
        return
      }
      if (!this.sample_order_title) {
        this.$message.error('请输入样单标题')
        return
      }
      if (!this.sample_type && this.sample_type !== 0) {
        this.$message.error('请选择样单类型')
        return
      }
      if (!this.order_time) {
        this.$message.error('请选择下单日期')
        return
      }
      if (!this.group_id) {
        this.$message.error('请选择负责小组')
        return
      }
      if (!this.client_id) {
        this.$message.error('请选择外贸公司')
        return
      }
      // if (!this.contact_id) {
      //   this.$message.error('请选择联系人')
      //   return
      // }
      if (this.checkedProList.length === 0) {
        this.$message.error('检测到未选中打样样品，请选择')
        return
      }
      let sizeFlag = true
      this.checkedProList.forEach(itemPro => {
        if (itemPro.sizeInfo.length === 0) {
          sizeFlag = false
        }
        itemPro.sizeInfo.forEach(itemSize => {
          if (!itemSize.size_color || itemSize.size_color.length === 0 || !itemSize.number) {
            sizeFlag = false
          }
        })
      })
      if (!sizeFlag) {
        this.$message.error('检测到尺码颜色信息未填写完整，请填写')
        return
      }
      if (!this.compiled_time) {
        this.$message.error('请选择交货时间')
        return
      }
      let materialPlanFlag = this.timeData.find(item => item.name === '物料计划')
      let productPushFlag = this.timeData.find(item => item.name === '成品入库')
      let semiProductPushFlag = this.timeData.find(item => item.name === '半成品入库')
      let materialPushFlag = this.timeData.find(item => item.name === '物料入库')
      let warnData = this.isOpenWarn ? {
        order_time: this.order_time,
        end_time: this.compiled_time,
        progress_data: {
          material_plan: this.$toFixed(materialPlanFlag.percent * 100),
          material_push: this.$toFixed(materialPushFlag.percent * 100),
          semi_product_push: this.$toFixed(semiProductPushFlag.percent * 100),
          product_push: this.$toFixed(productPushFlag.percent * 100)
        }
      } : null
      let data = {
        title: this.sample_order_title,
        type: this.sample_type,
        order_time: this.order_time,
        group_id: this.group_id,
        client_id: this.client_id,
        contacts_id: this.contact_id,
        product_info: this.checkedProList.map(itemPro => {
          return {
            product_id: itemPro.id,
            size_info: itemPro.sizeInfo.map(itemSize => {
              return {
                size_id: itemSize.size_color[0],
                color_id: itemSize.size_color[1],
                numbers: itemSize.number
              }
            })
          }
        }),
        deliver_time: this.compiled_time,
        desc: this.remark,
        time_progress: warnData
      }
      this.lock = false
      sampleOrder.create(data).then(res => {
        this.lock = true
        if (res.data.status) {
          this.$message.success('添加成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/sample/sampleOrderDetail/' + res.data.data.id
            this.msgContent = '<span style="color:#E6A23C">添加</span>了一个样单<span style="color:#1A95FF">' + res.data.data.title + '</span>'
            this.msgSwitch = true
          } else {
            this.$router.push('/sample/sampleOrderDetail/' + res.data.data.id)
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
      sampleOrder.editDetail({
        id: event.id
      }).then(res => {
        if (res.data.status !== false) {
          // 数据初始化
          let sampleOrderInfo = res.data.data
          this.sample_order_title = sampleOrderInfo.title
          this.sample_type = sampleOrderInfo.type
          this.order_time = sampleOrderInfo.order_time
          this.group_id = sampleOrderInfo.group_id
          this.client_id = sampleOrderInfo.client_id.toString()
          this.getContact(this.client_id)
          this.contact_id = sampleOrderInfo.contacts_id
          this.checkedProList = this.$mergeData(sampleOrderInfo.size_info, { mainRule: 'product_id/id', otherRule: [{ name: 'product_info' }], childrenName: 'sizeInfo', childrenRule: { mainRule: ['size_id', 'color_id'], otherRule: [{ name: 'numbers/number', type: 'add' }, { name: 'size_name/size' }, { name: 'color_name/color' }] } })
          this.checkedProList = this.checkedProList.map(itemPro => {
            itemPro.sample_product_code = itemPro.product_info.product_code
            itemPro.sizeColor = itemPro.product_info.size_measurement.map(itemSize => {
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
            })
            itemPro.sizeInfo = itemPro.sizeInfo.map(items => {
              return {
                size_color: [items.size_id, items.color_id],
                number: items.number
              }
            })
            itemPro.unit = itemPro.product_info.unit
            return itemPro
          })
          this.compiled_time = sampleOrderInfo.deliver_time
          this.remark = sampleOrderInfo.desc
          this.loading = false
        }
      })
    }
  },
  created () {
    this.getList()
    Promise.all([
      client.list(),
      group.list(),
      warnSetting.list(),
      orderType.typeList({
        order_type: 2
      })
    ]).then(res => {
      this.clientArr = res[0].data.data.filter(item => item.type.indexOf(1) !== -1)
      this.groupArr = res[1].data.data
      this.warnList = res[2].data.data.filter(item => item.order_type === 2)
      this.sampleTypeArr = res[3].data.data
      this.loading = false
    })
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
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
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/sample/sampleOrderCreate.less";
</style>
<style lang="less">
#sampleOrderCreate {
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
}
</style>
