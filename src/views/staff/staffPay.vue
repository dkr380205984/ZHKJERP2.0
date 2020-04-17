<template>
  <div id='staffPay'
    class='indexMain'
    v-loading="loading">
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
                  @change="getList"
                  type="month"
                  :clearable="false"
                  value-format="yyyy-MM"
                  placeholder="选择结算月份">
                </el-date-picker>
              </div>
            </div>
            <!-- <div class="block">合计</div> -->
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
  </div>
</template>

<script>
import { staff, order, station } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      defaultImage: require('@/assets/image/index/noPic.jpg'),
      testValue: '',
      page: 1,
      total: 1,
      department: '',
      departmentArr: [],
      date: '',
      list: [],
      workList: [{ value: '检验' }, { value: '织造' }, { value: '加工' }, { value: '装箱' }],
      settleList: [{ value: '按时结算', normal: true }, { value: '按日结算', normal: true }, { value: '按月结算', normal: true }]
    }
  },
  methods: {
    addPay (item) {
      item.checked = true
      item.child_data.unshift({
        addFlag: true,
        id: null,
        staff_id: item.id,
        complete_time: this.date + '-' + ((new Date()).getDate() < 10 ? ('0' + (new Date()).getDate()) : (new Date()).getDate()),
        work_type: '',
        year: this.date.split('-')[0],
        month: this.date.split('-')[1],
        settle_type: '',
        price: '',
        number: '',
        total_price: '',
        unit: '个',
        desc: ''
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
          this.$forceUpdate()
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
      let result = queryString ? this.workList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.workList
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
      if (ev.value === '按时结算') {
        item.unit = '小时'
      }
      if (ev.value === '按日结算') {
        item.unit = '天'
      }
      if (ev.value === '按月结算') {
        item.unit = '月'
      }
    },
    getList () {
      this.loading = true
      staff.payList({
        page: this.page,
        limit: 10,
        year: this.date.split('-')[0],
        month: Number(this.date.split('-')[1]),
        department_id: this.department
      }).then((res) => {
        this.list = res.data.data.map((item) => {
          item.total_price = item.child_data.reduce((total, current) => {
            return total + Math.round(current.total_price)
          }, 0)
          item.checked = false
          return item
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    }
  },
  mounted () {
    // 设置默认日期
    let now = new Date()
    this.date = now.getFullYear() + '-' + (now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1))
    this.getList()
    station.list({
      type: 2
    }).then((res) => {
      this.departmentArr = res.data.data
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
}
</style>
