<template>
  <div id='staffPay'
    class='indexMain'
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=')">
        <span class="icon staffList"></span>
        <span class="name">员工列表</span>
      </div>
      <div class="cut_item active">
        <span class="icon staffDay"></span>
        <span class="name">日常工资结算</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/staff/staffSettle')">
        <span class="icon staffTotal"></span>
        <span class="name">合计工资结算</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">结算单信息</span>
        <div class="titleBtnCtn">
          <div class="btn btnWhiteBlue"
            @click="showLogPopup = true;getPayLog(1)">查看操作日志</div>
          <div class="btn btnWhiteBlue"
            @click="$openUrl('/staffDayTable?year=' + date.split('-')[0] + '&month=' + date.split('-')[1] + '&departmentId=' + department)">打印</div>
          <div class="btn btnWhiteBlue"
            @click="showPopup=true">添加结算人员</div>
        </div>
      </div>
      <div class="detailCtn">
        <div class="excelTable">
          <div class="title"
            style="align-items:center">
            <div class="block">
              <div class="selectCtn">
                <el-select v-model="department"
                  placeholder="选择部门筛选人员"
                  clearable
                  @change="getList">
                  <el-option v-for="(item,index) in departmentArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="selectCtn"
                style="width:auto">
                <span class="label"
                  style="margin-left:15px">请选择结算月份：</span>
                <el-date-picker v-model="date"
                  @change="init"
                  type="month"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="选择结算月份">
                </el-date-picker>
              </div>
            </div>
            <div class="btn noBorder"
              @click="showPreFilledPopup = true">快捷设置</div>
            <!-- <div class="block">合计</div> -->
          </div>
          <div class="tabelBodyCtn">
            <div class="tabelBodyMain hasBorder">
              <div class="box">
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工部门</div>
              </div>
              <div class="box">
                <div class="label">更新日期</div>
              </div>
              <div class="box">
                <div class="label">合计(元)</div>
              </div>
              <div class="box">
                <div class="label">操作</div>
              </div>
            </div>
          </div>
          <div class="tabelBodyCtn"
            v-for="(item,index) in list"
            :key="index">
            <div class="tabelBodyMain"
              :class="{'hasBorder':index<list.length-1}">
              <div class="box">
                <div class="label noWarp">
                  <i class="el-icon-caret-right"
                    v-if="!item.checked"
                    @click="item.checked=true"></i>
                  <i class="el-icon-caret-bottom"
                    v-if="item.checked"
                    @click="item.checked=false"></i>
                  {{item.staff_code}}
                </div>
              </div>
              <div class="box">
                <div class="label">{{item.name}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.department_name}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.child_data.length>0?item.child_data[0].complete_time.slice(0,10):'-'}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.total_price}}</div>
              </div>
              <div class="box">
                <div class="label">
                  <span class="opr"
                    @click="addPay(item)">新增</span>
                </div>
              </div>
            </div>
            <div class="tableBodyList"
              v-show="item.checked">
              <div class="relativeCtn">
                <div class="titleList">
                  <div class="once">结算日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价(元)</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额(元)</div>
                  <div class="once">备注</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <!-- 这一行仅用于占位 -->
                  <div class="once"></div>
                </div>
                <div v-for="(itemChild,indexChild) in item.child_data"
                  :key="indexChild"
                  :class="{'addList':itemChild.addFlag,'normalList':!itemChild.addFlag}">
                  <template v-if="itemChild.addFlag">
                    <div class="once">
                      <el-date-picker class="inputs"
                        v-model="itemChild.complete_time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="mini"
                        placeholder="选择结算日期">
                      </el-date-picker>
                    </div>
                    <div class="once">
                      <el-autocomplete class="inline-input inputs"
                        v-model="itemChild.work_type"
                        :fetch-suggestions="searchWork"
                        placeholder="输入工序"></el-autocomplete>
                    </div>
                    <div class="once">
                      <el-autocomplete class="inline-input inputs staffPayElautocomplete"
                        v-model="itemChild.settle_type"
                        :fetch-suggestions="searchSettle"
                        @select="selectSettle($event,itemChild)"
                        placeholder="可搜索订单号">
                        <template slot-scope="{ item }">
                          <span v-if="item.normal">{{item.value}}</span>
                          <div class="staffPayProductCtn"
                            v-if="!item.normal">
                            <span class="staffPayOnce">{{item.order_code}}</span>
                            <span class="staffPayOnce">{{item.product_code}}</span>
                            <span class="staffPayOnce image">
                              <img :src="item.image||defaultImage" />
                            </span>
                          </div>
                        </template>
                      </el-autocomplete>
                    </div>
                    <div class="once">
                      <zh-input class="inputs"
                        type="number"
                        placeholder="输入单价"
                        v-model="itemChild.price">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                    <div class="once">
                      <zh-input class="inputs haveUnit"
                        type="number"
                        placeholder="输入数量"
                        v-model="itemChild.number">
                      </zh-input>
                      <zh-input class="unit"
                        placeholder="单位"
                        v-model="itemChild.unit"></zh-input>
                    </div>
                    <div class="once">{{itemChild.price * itemChild.number}}</div>
                    <div class="once">
                      <el-input class="inputs"
                        placeholder="输入备注"
                        v-model="itemChild.desc">
                      </el-input>
                    </div>
                    <div class="once">-</div>
                    <div class="once">-</div>
                    <div class="once"></div>
                  </template>
                  <template v-if="!itemChild.addFlag">
                    <div class="once">{{itemChild.complete_time}}</div>
                    <div class="once">{{itemChild.work_type}}</div>
                    <div class="once">{{itemChild.settle_type}}</div>
                    <div class="once">{{itemChild.price}}</div>
                    <div class="once">{{itemChild.number}}{{itemChild.unit}}</div>
                    <div class="once">{{Math.round(itemChild.price * itemChild.number)}}</div>
                    <div class="once">{{itemChild.desc}}</div>
                    <div class="once">{{itemChild.user_name?itemChild.user_name:'-'}}</div>
                    <div class="once">{{itemChild.create_time?itemChild.create_time.date.slice(0,10):'-'}}</div>
                    <div class="once"></div>
                  </template>
                </div>
              </div>
              <div class="absoluteList">
                <div class="once"
                  style="font-weight:bold">操作</div>
                <div class="once"
                  v-for="(itemChild,indexChild) in item.child_data"
                  :key="indexChild">
                  <span v-if="itemChild.addFlag"
                    class="opr blue"
                    @click="savePay(itemChild,item)">{{itemChild.updateFlag?'完成编辑':'完成'}}</span>
                  <span v-if="itemChild.addFlag && !itemChild.updateFlag"
                    class="opr blue"
                    @click="deletePay(index,indexChild)">取消</span>
                  <span v-if="!itemChild.addFlag"
                    class="opr orange"
                    @click="updatePay(itemChild)">修改</span>
                  <span v-if="!itemChild.addFlag"
                    class="opr red"
                    @click="deletePayLog(itemChild.id,index,indexChild)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <div class="main"
        style="width:800px">
        <div class="title">
          <div class="text">添加结算人员</div>
          <i class="el-icon-close"
            @click="showPopup=false"></i>
        </div>
        <div class="content"
          style="padding:16px 30px">
          <div class="row">
            <div class="info">
              <el-select style="width:180px"
                v-model="departmentPopup"
                placeholder="选择部门筛选人员"
                clearable>
                <el-option v-for="(item,index) in departmentArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select style="margin-left:16px;width:180px"
                v-model="staffTagKeyWord"
                placeholder="选择标签筛选人员"
                clearable>
                <el-option v-for="(item,index) in staffTagList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <span class="tableCtnLv2">
                <span class="tb_header min40">
                  <span class="tb_row"
                    style="flex:0.4">
                    <el-checkbox v-model="isCheckedAll"
                      @change="$forceUpdate()"></el-checkbox>
                  </span>
                  <span class="tb_row">所属部门</span>
                  <span class="tb_row">姓名</span>
                  <span class="tb_row"
                    style="flex:2.5">所含标签</span>
                  <span class="tb_row"
                    style="flex:0.4"> </span>
                </span>
                <span class="tb_content_box">
                  <span class="tb_content min40"
                    v-for="(item,index) in staffAllArr"
                    :key="index">
                    <span class="tb_row"
                      style="flex:0.4">
                      <el-checkbox v-model="item.checked"
                        :key="item.id"
                        @change="$forceUpdate()"></el-checkbox>
                    </span>
                    <span class="tb_row">{{item.department_name}}</span>
                    <span class="tb_row">{{item.name}}</span>
                    <span class="tb_row tb_row_tag_box"
                      style="flex:2.5">
                      <template v-for="(itemTag,indexTag) in item.staff_tag">
                        <!-- <span class="tb_row_tag"
                          :key="indexTag"
                          v-if="indexTag < 5">{{itemTag}}</span> -->
                        <el-tag :key="indexTag"
                          v-if="indexTag < 3"
                          style="height:24px;line-height:24px;margin-right:8px">{{itemTag}}</el-tag>
                      </template>
                    </span>
                    <span class="tb_row"
                      style="flex:0.4">
                      <el-popover placement="right"
                        v-if="item.staff_tag.length>3"
                        width="200"
                        trigger="click">
                        <el-tag v-for="(itemTag,indexTag) in item.staff_tag"
                          :key="indexTag"
                          style="height:24px;line-height:24px;margin-right:8px">{{itemTag}}</el-tag>
                        <span class="btn noBorder"
                          style="padding:0"
                          slot="reference">更多</span>
                      </el-popover>
                    </span>
                  </span>
                </span>
              </span>
              <!-- <el-checkbox style="margin-bottom:12px"
                label="全选"
                v-model="isCheckedAll"></el-checkbox>
              <el-checkbox style="margin-bottom:12px"
                v-for="item in staffAllArr"
                :key="item.id"
                :label="item.name"
                v-model="item.checked"
                @change="$forceUpdate()"></el-checkbox> -->
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showPopup=false">取消</div>
          <div class="btn btnBlue"
            @click="checkStaff">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showLogPopup">
      <div class="main"
        style="width:1024px;">
        <div class="title">
          <div class="text">日常工作结算表操作日志</div>
          <i class="el-icon-close"
            @click="showLogPopup=false"></i>
        </div>
        <div class="content"
          style="max-height:580px"
          v-loading='logLoading'>
          <div class="row">
            <div class="col">
              <el-date-picker v-model="date_log"
                @change="getPayLog(1)"
                type="month"
                :clearable="false"
                value-format="yyyy-MM"
                placeholder="筛选月份">
              </el-date-picker>
              <!-- <el-date-picker
                placeholder="">
              </el-date-picker> -->
            </div>
            <div class="col"
              style="margin-left:16px">
              <el-select v-model="department_id"
                @change="getPayLog(1)"
                placeholder="筛选部门"
                clearable>
                <el-option v-for="(item,index) in departmentArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="tableCtnLv2 minHeight5">
              <div class="tb_content">
                <span class="tb_row">员工部门</span>
                <span class="tb_row">员工编号</span>
                <span class="tb_row">员工姓名</span>
                <span class="tb_row">结算日期</span>
                <span class="tb_row">工序</span>
                <span class="tb_row">结算方式</span>
                <span class="tb_row">单价</span>
                <span class="tb_row">数量</span>
                <span class="tb_row">合计</span>
                <span class="tb_row">备注</span>
                <span class="tb_row">结算人</span>
                <span class="tb_row">结算时间</span>
              </div>
              <div class="tb_content"
                v-for="(itemLog,indexLog) in staffLogList"
                :key="indexLog">
                <span class="tb_row">{{itemLog.department_name}}</span>
                <span class="tb_row">{{itemLog.staff_code}}</span>
                <span class="tb_row">{{itemLog.staff_name}}</span>
                <span class="tb_row">{{itemLog.complete_time}}</span>
                <span class="tb_row">{{itemLog.work_type}}</span>
                <span class="tb_row">{{itemLog.settle_type}}</span>
                <span class="tb_row">{{itemLog.price}}</span>
                <span class="tb_row">{{itemLog.number}}</span>
                <span class="tb_row">{{itemLog.total_price}}</span>
                <span class="tb_row">{{itemLog.desc}}</span>
                <span class="tb_row">{{itemLog.user_name}}</span>
                <span class="tb_row">{{$getTime(itemLog.created_at.date)}}</span>
              </div>
              <div class="tb_content">
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row"></span>
                <span class="tb_row">平均单价</span>
                <span class="tb_row">{{log_avg_price}}</span>
                <span class="tb_row">合计数量</span>
                <span class="tb_row">{{log_total_number}}</span>
                <span class="tb_row">合计金额</span>
                <span class="tb_row">{{log_total_price}}</span>
              </div>
              <div class="tb_content">
                <span class="tb_row right">
                  <el-pagination background
                    :page-size="5"
                    layout="prev, pager, next"
                    :total="logTotal"
                    :current-page.sync="logPage"
                    @current-change="getPayLog">
                  </el-pagination>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showPreFilledPopup">
      <div class="main">
        <div class="title">
          <span class="text">快捷设置</span>
          <span class="el-icon-close"
            @click="closePreFilledPopup"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">工序：</span>
            <span class="info">
              <el-autocomplete class="inline-input inputs"
                v-model="preFilledInfo.work_type"
                :fetch-suggestions="searchWork"
                placeholder="输入工序"></el-autocomplete>
            </span>
          </div>
          <div class="row">
            <span class="label">结算方式：</span>
            <span class="info">
              <el-autocomplete class="inline-input inputs staffPayElautocomplete"
                v-model="preFilledInfo.settle_type"
                :fetch-suggestions="searchSettle"
                @select="selectSettle($event,preFilledInfo)"
                placeholder="可搜索订单号">
                <template slot-scope="{ item }">
                  <span v-if="item.normal">{{item.value}}</span>
                  <div class="staffPayProductCtn"
                    v-if="!item.normal">
                    <span class="staffPayOnce">{{item.order_code}}</span>
                    <span class="staffPayOnce">{{item.product_code}}</span>
                    <span class="staffPayOnce image">
                      <img :src="item.image||defaultImage" />
                    </span>
                  </div>
                </template>
              </el-autocomplete>
            </span>
          </div>
          <div class="row">
            <span class="label">单价：</span>
            <span class="info">
              <zh-input type="number"
                placeholder="输入单价"
                v-model="preFilledInfo.price">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnBlue"
            @click="closePreFilledPopup">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$router.push('/staff/staffSettle')">转至合计结算</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff, order, station, staffTag, process } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      showPopup: false,
      showLogPopup: false,
      defaultImage: require('@/assets/image/index/noPic.jpg'),
      testValue: '',
      page: 1,
      total: 1,
      department: '',
      departmentPopup: '',
      departmentArr: [],
      date: '',
      list: [],
      staffAllList: [],
      // workList: [{ value: '检验' }, { value: '织造' }, { value: '加工' }, { value: '装箱' }],
      settleList: [{ value: '按小时结算', normal: true }, { value: '按天数结算', normal: true }, { value: '按整月结算', normal: true }],
      isCheckedAll: false,
      staffTagList: [],
      staffTagKeyWord: '',
      processArr: [],
      // 操作日志
      logLoading: false,
      staffLogList: [],
      logTotal: 1,
      logPage: 1,
      date_log: '',
      department_id: '',
      log_avg_price: 0,
      log_total_number: 0,
      log_total_price: 0,
      // 预填设置
      showPreFilledPopup: false,
      preFilledInfo: {
        work_type: '',
        settle_type: '',
        price: ''
      }
    }
  },
  watch: {
    isCheckedAll (newVal) {
      this.staffAllList.forEach(item => {
        if (!this.departmentPopup && !this.staffTagKeyWord) {
          item.checked = newVal
          this.$forceUpdate()
        } else if (this.departmentPopup && !this.staffTagKeyWord && item.department_id === this.departmentPopup) {
          item.checked = newVal
          this.$forceUpdate()
        } else if (this.departmentPopup && this.staffTagKeyWord && item.department_id === this.departmentPopup && item.staff_tag.indexOf(this.staffTagKeyWord) !== -1) {
          item.checked = newVal
          this.$forceUpdate()
        } else if (!this.departmentPopup && this.staffTagKeyWord && item.staff_tag.indexOf(this.staffTagKeyWord) !== -1) {
          item.checked = newVal
          this.$forceUpdate()
        }
      })
    }
  },
  methods: {
    init () {
      this.loading = true
      staff.getMonthStaffUser({
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1])
      }).then(res => {
        if (res.data.status !== false && res.data.data) {
          let filterUser = res.data.data.staff_data ? JSON.parse(res.data.data.staff_data) : []
          this.staffAllList.forEach(item => {
            if (filterUser.indexOf(item.id) !== -1) {
              item.checked = true
            }
          })
          this.getList()
        } else {
          this.list = []
          this.loading = false
        }
      })
    },
    addPay (item) {
      item.checked = true
      item.child_data.unshift({
        addFlag: true,
        id: null,
        staff_id: item.id,
        complete_time: this.date + '-' + ((new Date()).getDate() < 10 ? ('0' + (new Date()).getDate()) : (new Date()).getDate()),
        work_type: this.preFilledInfo.work_type || '',
        year: this.date.split('-')[0],
        month: this.date.split('-')[1],
        settle_type: this.preFilledInfo.settle_type || '',
        price: this.preFilledInfo.price || '',
        number: '',
        total_price: '',
        unit: '件',
        desc: '',
        create_time: {
          date: this.date + '-' + ((new Date()).getDate() < 10 ? ('0' + (new Date()).getDate()) : (new Date()).getDate())
        }
      })
    },
    savePay (item, itemFather) {
      this.loading = true
      if (!item.price) {
        this.$message.warning('请输入价格')
        return
      }
      if (!item.number) {
        this.$message.warning('请输入数量')
        return
      }
      if (!item.work_type) {
        this.$message.warning('请输入工序')
        return
      }
      if (!item.price) {
        this.$message.warning('请输入结算方式')
        return
      }
      if (!item.unit) {
        this.$message.warning('请输入数量单位')
        return
      }
      staff.createPay({
        id: item.id,
        staff_id: item.staff_id,
        complete_time: item.complete_time,
        work_type: item.work_type,
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1]),
        settle_type: item.settle_type,
        price: item.price,
        number: item.number,
        unit: item.unit,
        total_price: item.price * item.number,
        desc: item.desc
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('操作成功')
          item.addFlag = false
          itemFather.total_price = itemFather.total_price + Math.round(item.price * item.number)
          this.loading = false
          this.init()
        }
      })
    },
    updatePay (item) {
      item.updateFlag = true
      item.addFlag = true
      this.$forceUpdate()
    },
    deletePayLog (id, index, indexChild) {
      this.$confirm('是否删除该工资结算信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        staff.deletePay({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.list[index].total_price = this.list[index].total_price - Math.round(this.list[index].child_data[indexChild].price * this.list[index].child_data[indexChild].number)
            this.list[index].child_data.splice(indexChild, 1)
            this.loading = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deletePay (index, indexChild) {
      this.list[index].child_data.splice(indexChild, 1)
    },
    searchWork (queryString, cb) {
      let result = queryString ? this.processArr.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.processArr
      cb(result)
    },
    searchSettle (queryString, cb) {
      if (!queryString) {
        cb(this.settleList)
      } else {
        order.list({
          limit: 20,
          page: 1,
          product_code: '',
          keyword: queryString,
          start_time: '',
          end_time: '',
          client_id: null,
          group_id: null,
          status: null,
          status_material_plan: null,
          status_material_order: null,
          status_material_push: null,
          status_weave: null,
          status_product_push: null,
          status_product_inspection: null,
          status_stock_out: null
        }).then((res) => {
          let orderArr = res.data.data.map((item) => {
            item.productArr = this.$mergeData(item.product_info, { mainRule: ['product_code'], otherRule: [{ name: 'image' }] })
            return item
          })
          // 展开数据
          let proArr = []
          orderArr.forEach((item) => {
            item.productArr.forEach((itemPro) => {
              proArr.push({
                value: item.order_code + '/' + itemPro.product_code,
                order_code: item.order_code,
                product_code: itemPro.product_code,
                image: itemPro.image[0] ? itemPro.image[0].image_url : ''
              })
            })
          })
          cb(proArr)
        })
      }
    },
    selectSettle (ev, item) {
      if (ev.value === '按小时结算') {
        item.unit = '小时'
      }
      if (ev.value === '按天数结算') {
        item.unit = '天'
      }
      if (ev.value === '按整月结算') {
        item.unit = '月'
      }
    },
    getList () {
      this.loading = true
      if (this.department) {
        this.departmentPopup = this.department
      }
      staff.payList({
        page: this.page,
        limit: 10,
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1]),
        department_id: this.department
      }).then((res) => {
        if (res.data.data) {
          this.list = res.data.data.map((item) => {
            item.total_price = item.child_data.reduce((total, current) => {
              return total + Math.round(current.total_price)
            }, 0)
            item.checked = false
            return item
          })
          this.total = res.data.meta.total
        }
        this.loading = false
      })
    },
    checkStaff () {
      this.loading = true
      this.showPopup = false
      staff.settingMonthStaffUser({
        staff_data: this.staffAllList.filter((item) => item.checked).map((item) => item.id),
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1])
      }).then((res) => {
        if (res.data.stauts !== false) {
          this.$message.success('已成功为您更新' + this.date + '的人员结算信息')
          this.init()
        } else {
          this.loading = false
        }
      })
    },
    getPayLog (page) {
      this.logLoading = true
      this.logPage = page
      staff.payLog({
        limit: 5,
        page: page,
        staff_id: '',
        department_id: this.department_id,
        year: this.date_log.split('-')[0],
        month: Number(this.date_log.split('-')[1])
      }).then(res => {
        if (res.data.status !== false) {
          this.staffLogList = res.data.data
          this.logTotal = res.data.meta.total
          this.log_avg_price = res.data.avg_price
          this.log_total_number = res.data.total_number
          this.log_total_price = res.data.total_price
        }
        this.logLoading = false
      })
    },
    closePreFilledPopup () {
      window.sessionStorage.setItem('staffPayPreFilledInfo', JSON.stringify(this.preFilledInfo))
      this.showPreFilledPopup = false
    }
  },
  computed: {
    staffAllArr () {
      let filterArr = this.staffAllList
      if (this.departmentPopup) {
        filterArr = filterArr.filter((item) => {
          return Number(item.department_id) === Number(this.departmentPopup)
        })
      }
      if (this.staffTagKeyWord) {
        filterArr = filterArr.filter((item) => {
          return item.staff_tag.indexOf(this.staffTagKeyWord) !== -1
        })
      }
      return filterArr
    }
  },
  mounted () {
    let info = window.sessionStorage.getItem('staffPayPreFilledInfo')
    this.preFilledInfo = info ? JSON.parse(info) : {
      work_type: '',
      settle_type: '',
      price: ''
    }
    // 设置默认日期
    let now = new Date()
    this.date = now.getFullYear() + '-' + (now.getMonth() < 9 ? ('0' + now.getMonth()) : now.getMonth())
    this.date_log = this.date
    Promise.all([
      station.list({
        type: 2
      }),
      staff.list(),
      staffTag.list(),
      process.list({
        type: 3
      })
    ]).then((res) => {
      this.departmentArr = res[0].data.data
      this.staffAllList = res[1].data.data
      this.staffTagList = res[2].data.data
      this.processArr = res[3].data.data.map(item => {
        return {
          value: item.name
        }
      })
      this.init()
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/staff/staffPay.less";
</style>
<style lang="less">
.staffPayProductCtn {
  display: flex;
  .staffPayOnce {
    min-width: 110px;
    flex: 1;
    height: 40px;
    padding: 8px;
    &.image {
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      img {
        width: 50px;
        height: 40px;
      }
    }
  }
}
#staffPay {
  .haveUnit {
    .zhInput {
      border-right-color: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .unit {
    .zhInput {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding: 0 4px;
    }
  }
  .tb_row {
    word-break: break-all;
  }
}
</style>
