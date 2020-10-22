<template>
  <div id='packIn'
    class='indexMain'
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item">
        <span class="icon packPlan"></span>
        <span class="name">装箱计划</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packOrderDetail/' + $route.params.id)">
        <span class="icon packOrder"></span>
        <span class="name">包装订购</span>
      </div>
      <div class="cut_item active">
        <span class="icon packOrder"></span>
        <span class="name">包装入库</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packStock/' + $route.params.id)">
        <span class="icon packOut"></span>
        <span class="name">装箱出库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包装辅料订购统计</div>
      </div>
      <div class="editCtn hasBorderTop"
        style="padding:20px 32px">
        <div class="flexTb"
          style="margin:0"
          ref="orderModule">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">订购单位</span>
              <span class="tcolumn">包装辅料</span>
              <span class="tcolumn">规格</span>
              <span class="tcolumn">属性</span>
              <span class="tcolumn">已订购数量</span>
              <span class="tcolumn">已入库数量</span>
              <span class="tcolumn center">操作</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(item,index) in packOrderInfo"
              :key="index">
              <!-- <span class="tcolumn">{{item.client_name}}</span>
              <span class="tcolumn">{{item.material_name}}</span>
              <span class="tcolumn">{{item.number ? item.number + item.unit : '/'}}</span>
              <span class="tcolumn">{{item.stockInNum  + item.unit}}</span>
              <span class="tcolumn center">
                <div class="btn noBorder noMargin"
                  @click="normalPackIn(item.material_name,item.number - item.stockInNum,item.client_id)">入库</div>
              </span> -->
            </span>
          </div>
        </div>
        <div class="createModule"
          v-for="(item,index) in packIn_data"
          :key="index">
          <div class="deleteIconBtn"
            @click="deletePackIn(index)">
            <i class="el-icon-close"></i>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">订购单位</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-select v-model="item.order_client"
                  filterable
                  placeholder="请选择入库仓库"
                  @change="selectPack">
                  <el-option v-for="item in packOrderInfo"
                    :key="item.client_id"
                    :value="item.client_id"
                    :label="item.client_name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">入库仓库</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-select v-model="item.stock_name"
                  filterable
                  placeholder="请选择入库仓库">
                  <el-option v-for="item in stockArr"
                    :key="item.name"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="rowCtn"
            v-for="(itemChild,indexChild) in item.pack_info"
            :key="indexChild">
            <div class="colCtn flex3">
              <div class="label"
                v-if="indexChild===0">
                <span class="text">包装辅料</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-select v-model="itemChild.pack_name"
                  filterable
                  no-data-text="请先选择订购单位"
                  placeholder="请选择包装辅料">
                  <el-option v-for="item in packArr"
                    :key="item.material_name"
                    :value="item.material_name"
                    :label="item.material_name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label"
                v-if="indexChild===0">
                <span class="text">入库数量</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input v-model="itemChild.number"
                  placeholder="请输入入库数量"></el-input>
              </div>
              <div class="editBtn addBtn"
                v-if="indexChild===0"
                @click="addPack(item)">添加</div>
              <div class="editBtn deleteBtn"
                v-if="indexChild>0"
                @click="deletePack(item,indexChild)">删除</div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">入库时间</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-date-picker v-model="item.date"
                  value-format="yyyy-MM-dd"
                  style="width:100%"
                  type="date"
                  placeholder="选择入库日期">
                </el-date-picker>
              </div>
            </div>
            <div class="colCtn flex3">
              <div class="label">
                <span class="text">备注信息</span>
                <span class="explanation">(必填)</span>
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
            v-if="!packIn_flag"
            @click="normalPackIn()">入库</span>
          <span class="once cancle"
            v-if="packIn_flag"
            @click="canclePackIn">取消入库</span>
          <span class="once normal"
            v-if="packIn_flag"
            @click="addPackIn">添加入库单位</span>
          <span class="once ok"
            v-if="packIn_flag"
            @click="savePackIn">确认入库
          </span>
        </div>
      </div>
    </div>
    <!-- <div class="module log"
      v-if="packLog.length>0">
      <div class="titleCtn rightBtn">
        <span class="title">订购入库日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="display:flex;flex-direction:row;justify-content: flex-end;margin-right:0px">
            <div class="btn btnWhiteBlue"
              @click="deleteLog('all')">批量删除</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb"
              style="margin:0">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="checkAll"
                      @change="getAll"></el-checkbox>
                  </div>
                  <div class="tcolumn">入库日期</div>
                  <div class="tcolumn">包装辅料</div>
                  <div class="tcolumn">订购单位</div>
                  <div class="tcolumn">入库仓库</div>
                  <div class="tcolumn">入库数量</div>
                  <div class="tcolumn">备注信息</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in packLog"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.checked"
                      @change="$forceUpdate()"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{item.complete_time}}</div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn">{{item.store_name}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{item.desc||'无'}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
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
import { packPlan, stock, packag } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      packIn_flag: false,
      packOrderInfo: [],
      packIn_data: [],
      packArr: [],
      stockArr: [],
      packLog: [],
      checkAll: false
    }
  },
  methods: {
    selectPack (id) {
      this.packArr = this.packOrderInfo.find((item) => item.client_id === id).childrenMergeInfo
    },
    deletePackIn (index) {
      if (this.packIn_data.length === 1) {
        this.packIn_flag = false
      }
      this.packIn_data.splice(index, 1)
    },
    normalPackIn (name, number, client) {
      this.packIn_data.push({
        order_client: client || '',
        stock_name: '',
        pack_info: [{
          pack_name: name || '',
          number: number || ''
        }],
        date: this.$getTime(new Date()),
        desc: ''
      })
      this.packIn_flag = true
    },
    canclePackIn () {
      this.packIn_data = []
      this.packIn_flag = false
    },
    addPackIn () {
      this.packIn_data.push({
        order_client: '',
        stock_name: '',
        date: this.$getTime(new Date()),
        desc: '',
        pack_info: [{
          pack_name: '',
          number: ''
        }]
      })
    },
    savePackIn () {
      let errMsg = ''
      this.packIn_data.forEach((item) => {
        if (!item.order_client) {
          errMsg = '请选择订购单位'
        }
        if (!item.stock_name) {
          errMsg = '请选择入库仓库'
        }
        item.pack_info.forEach((itemChild) => {
          if (!itemChild.pack_name) {
            errMsg = '请选择包装辅料'
          }
          if (!itemChild.number) {
            errMsg = '请输入入库数量'
          }
        })
      })
      if (errMsg) {
        this.$message.error(errMsg)
        return
      }
      let formData = []
      this.packIn_data.forEach((item) => {
        item.pack_info.forEach((itemChild) => {
          formData.push({
            material_name: itemChild.pack_name.split('(')[0],
            client_id: item.order_client,
            store_id: item.stock_name,
            number: itemChild.number,
            complete_time: item.date,
            desc: item.desc
          })
        })
      })
      console.log(formData)
      packag.stockIn({
        order_id: this.$route.params.id,
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
        }
      })
    },
    addPack (item) {
      item.pack_info.push({
        pack_name: '',
        number: ''
      })
    },
    deletePack (item, index) {
      item.pack_info.splice(index, 1)
    },
    deleteLog (id, index) {
      this.$confirm('是否删除该入库记录', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id === 'all') {
          packag.stockDelete({
            id: this.packLog.filter((item) => item.checked).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getLog()
            }
          })
        } else {
          packag.stockDelete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!请刷新页面后查看分配信息变化'
              })
              this.packLog.splice(index, 1)
              this.getLog()
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
    getAll () {
      this.packLog.forEach((item) => {
        item.checked = this.checkAll
      })
    },
    getLog () {
      packPlan.packOrderLog({
        order_id: this.$route.params.id,
        order_type: 1
      }).then((res) => {
        this.packOrderInfo = res[0].data.data
      })
    }
  },
  mounted () {
    Promise.all([packPlan.packOrderLog({
      order_id: this.$route.params.id,
      order_type: 1
    }), stock.list({
      type: 3
    })]).then((res) => {
      console.log(res[0].data.data)
      // 直接根据入库日志进行入库，不进行合并操作
      this.packOrderInfo = res[0].data.data
      this.stockArr = res[1].data.data
      this.getLog()
      this.loading = false
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packIn.less";
</style>
