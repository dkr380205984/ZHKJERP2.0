<template>
  <div id='staffPay'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">结算单信息</span>
      </div>
      <div class="detailCtn">
        <div class="excelTable">
          <div class="title">
            <div class="block">
              <div class="selectCtn">
                <el-select v-model="department"
                  placeholder="请选择部门">
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
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择结算月份">
                </el-date-picker>
              </div>
            </div>
            <div class="block">合计</div>
          </div>
          <div class="tabelBodyCtn">
            <div class="tabelBodyMain hasBorder">
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">更新日期</div>
              </div>
              <div class="box">
                <div class="label">合计</div>
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
                <div class="label">
                  <i class="el-icon-caret-right"
                    v-if="!item.checked"
                    @click="item.checked=true"></i>
                  <i class="el-icon-caret-bottom"
                    v-if="item.checked"
                    @click="item.checked=false"></i>
                  {{item.name}}
                </div>
              </div>
              <div class="box">
                <div class="label">{{item.staff_code}}</div>
              </div>
              <div class="box">
                <div class="label">{{item.updated_at}}</div>
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
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
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
                      <el-autocomplete class="inline-input inputs"
                        v-model="itemChild.settle_type"
                        :fetch-suggestions="searchSettle"
                        placeholder="输入结算方式"></el-autocomplete>
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
                      <zh-input class="inputs"
                        type="number"
                        placeholder="输入数量"
                        v-model="itemChild.number">
                      </zh-input>
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
                    <div class="once">{{itemChild.number}}</div>
                    <div class="once">{{itemChild.price * itemChild.number}}</div>
                    <div class="once">{{itemChild.desc}}</div>
                    <div class="once">{{itemChild.user_name?itemChild.user_name:'-'}}</div>
                    <div class="once">{{itemChild.create_time?itemChild.create_time.slice(0,10):'-'}}</div>
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
                    @click="savePay(itemChild)">{{itemChild.updateFlag?'完成编辑':'完成'}}</span>
                  <span v-if="itemChild.addFlag && !itemChild.updateFlag"
                    class="opr blue"
                    @click="deletePay(index,indexChild)">取消</span>
                  <span v-if="!itemChild.addFlag"
                    class="opr orange"
                    @click="updatePay(itemChild)">修改</span>
                  <span v-if="!itemChild.addFlag"
                    class="opr red"
                    @click="deletePayLog(index,indexChild)">删除</span>
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
            @change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff } from '@/assets/js/api.js'
export default {
  data () {
    return {
      page: 1,
      total: 1,
      department: '',
      departmentArr: [],
      date: '',
      list: [],
      workList: [{ value: '检验' }, { value: '织造' }, { value: '加工' }, { value: '装箱' }],
      settleList: [{ value: '按日结算' }, { value: '按月结算' }, { value: '按年结算' }]
    }
  },
  methods: {
    addPay (item) {
      item.checked = true
      item.child_data.unshift({
        addFlag: true,
        id: null,
        staff_id: item.id,
        complete_time: this.date + '-' + ((new Date()).getDay() < 10 ? ('0' + (new Date()).getDay()) : (new Date()).getDay()),
        work_type: '',
        year: this.date.split('-')[0],
        month: this.date.split('-')[1],
        settle_type: '',
        price: '',
        number: '',
        total_price: '',
        desc: ''
      })
    },
    savePay (item) {
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
      staff.createPay({
        id: item.id,
        staff_id: item.staff_id,
        complete_time: item.complete_time,
        work_type: item.work_type,
        year: this.date.split('-')[0],
        month: this.date.split('-')[1],
        settle_type: item.settle_type,
        price: item.price,
        number: item.number,
        total_price: item.price * item.number,
        desc: item.desc
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('操作成功')
          item.addFlag = false
          this.$forceUpdate()
        }
      })
    },
    updatePay (item) {
      item.updateFlag = true
      item.addFlag = true
      this.$forceUpdate()
    },
    deletePayLog (index, indexChild) {

    },
    deletePay (index, indexChild) {
      this.list[index].child_data.splice(indexChild, 1)
    },
    searchWork (queryString, cb) {
      let result = queryString ? this.workList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.workList
      cb(result)
    },
    searchSettle (queryString, cb) {
      let result = queryString ? this.settleList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.settleList
      cb(result)
    },
    getList () {
      staff.payList({
        page: this.page,
        limit: 10
      }).then((res) => {
        this.list = res.data.data.map((item) => {
          item.checked = false
          return item
        })
        this.total = res.data.meta.total
      })
    }
  },
  mounted () {
    // 设置默认日期
    let now = new Date()
    this.date = now.getFullYear() + '-' + (now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1))
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/staff/staffPay.less";
</style>
