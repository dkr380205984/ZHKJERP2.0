<template>
  <div id='documentList'
    class='indexMain'>
    <div class="module">
      <div class="listCtn"
        v-loading='loading'>
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input v-model="keyword"
              class="inputs"
              placeholder="请输入PO号查询"
              @change="changeRouter(1)"></el-input>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期"
              @change="changeRouter(1)">
            </el-date-picker>
            <div class="btn btnGray"
              @click="resetFilters()"
              style="margin-left:0">重置</div>
          </div>
          <div class="leftCtn">
            <div class="btn btnBlue"
              @click="$router.push('/document/index/create')">添加新单证</div>
          </div>
        </div>

        <el-table :data="list"
          style="width: 100%">
          <!-- <el-table-column fixed
            width="70">
            <template slot="header"
              slot-scope="scope">
              <el-checkbox v-model="checkedAll"
                ref="checkedAllEl"
                @change="checkedChange($event,null,'all',scope)"></el-checkbox>全选
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"
                @change="checkedChange($event,scope.row)"></el-checkbox>
            </template>
          </el-table-column> -->
          <el-table-column fixed
            prop="po_number"
            label="PO Number"
            width="180">
          </el-table-column>
          <el-table-column prop="invoice_number"
            fixed
            label="Invoice Number"
            width="150">
          </el-table-column>
          <el-table-column prop='to'
            label="TO"
            fixed
            width="150">
          </el-table-column>
          <el-table-column label="产品图片"
            width="150"
            align='center'>
            <template slot-scope="scope">
              <zh-img-list :list="(scope.row.product_info[scope.row.showIndex || 0] ? scope.row.product_info[scope.row.showIndex||0].images : [])"
                type='open'></zh-img-list>
            </template>
          </el-table-column>
          <el-table-column label="产品编号"
            width="150">
            <template slot-scope='scope'>
              {{scope.row.product_info[scope.row.showIndex || 0] ? scope.row.product_info[scope.row.showIndex || 0].product_code : ''}}
            </template>
          </el-table-column>
          <el-table-column label="下单数量"
            width="120">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between;padding-right:15px">
                <span>
                  {{scope.row.product_info[scope.row.showIndex || 0] ? scope.row.product_info[scope.row.showIndex || 0].numbers : ''}}
                </span>
                <div class="jtCtn"
                  v-show="scope.row.product_info.length>1">
                  <div class="jt el-icon-caret-top"
                    @click="checkPro(scope.row,-1)"></div>
                  <div class="jt el-icon-caret-bottom"
                    @click="checkPro(scope.row,1)"></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Invoice State"
            width="183">
            <template slot-scope="scope">
              <div style="display:flex">
                <div class="stateCtn"
                  title="形式发票"
                  :class="`${scope.row.invoice_state.CI===1 && 'green' || ''}`">
                  <div class="state"></div>
                  <span class="name">形</span>
                </div>
                <div class="stateCtn"
                  title="装箱单"
                  :class="`${scope.row.invoice_state.PL===1 && 'green' || ''}`">
                  <div class="state"></div>
                  <span class="name">箱</span>
                </div>
                <div class="stateCtn"
                  title="货运委托书"
                  :class="`${scope.row.invoice_state.ET===1 && 'green' || ''}`">
                  <div class="state"></div>
                  <span class="name">货</span>
                </div>
                <div class="stateCtn"
                  title="出口货物报关单"
                  :class="`${scope.row.invoice_state.ED===1 && 'green' || ''}`">
                  <div class="state"></div>
                  <span class="name">出</span>
                </div>
                <div class="stateCtn"
                  title="申报要素"
                  :class="`${scope.row.invoice_state.DE===1 && 'green' || ''}`">
                  <div class="state"></div>
                  <span class="name">申</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="order_number"
            label="订单总数"
            width="150">
          </el-table-column>
          <el-table-column prop="order_time"
            label="下单日期"
            width="150">
          </el-table-column>
          <el-table-column prop="create_time"
            label="添加日期"
            width="150">
          </el-table-column>
          <el-table-column prop="create_user"
            label="添加人"
            width="150">
          </el-table-column>
          <el-table-column label="操作"
            fixed="right"
            width="150">
            <template slot-scope="scope">
              <span class="tOpr"
                @click="$router.push('/document/index/detail/' + scope.row.id)">详情</span>
              <span class="tOpr"
                style="color:#F5222D"
                @click="deleteDocument(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change='changeRouter'>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { documents } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: false,
      keyword: '',
      date: '',
      list: [],
      pages: 1,
      total: 1,
      limit: 10
    }
  },
  methods: {
    checkPro (data, type) {
      if (data.showIndex + type < 0) {
        data.showIndex = data.product_info.length - 1
      } else {
        data.showIndex = (data.showIndex + type) % data.product_info.length
      }
    },
    getList (pages = 1, limit = this.limit) {
      this.loading = true
      documents.list({
        page: pages,
        limit,
        keyword: this.keyword,
        order_date: this.date || ''
      }).then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data.map(itemM => {
            const productInfo = this.$mergeData(itemM.orders ? itemM.orders.map(itemMO => {
              return !itemMO.product_info ? [] : itemMO.product_info.map(itemMP => {
                return {
                  product_id: itemMP.id,
                  name: itemMP.name,
                  images: itemMP.images,
                  product_code: itemMP.product_code,
                  numbers: itemMP.pivot.numbers
                }
              })
            }).flat(1) : [], {
              mainRule: 'product_id',
              otherRule: [
                { name: 'name' },
                { name: 'images' },
                { name: 'product_code' },
                { name: 'numbers', type: 'add' }
              ]
            })
            return {
              id: itemM.id,
              po_number: itemM.po,
              invoice_number: itemM.invoice,
              to: itemM.to_company_name,
              showIndex: 0,
              product_info: productInfo,
              invoice_state: {
                CI: itemM.status_commercial_invoice,
                PL: itemM.status_packing_list,
                ED: itemM.status_export_declaration,
                DE: itemM.status_declare_elements,
                ET: itemM.status_entrustiong_transport
              },
              order_number: productInfo.map(itemMN => +itemMN.numbers || 0).reduce((total, current) => total + current, 0),
              order_time: itemM.order_date,
              create_time: this.$getTime(itemM.created_at.date),
              create_user: itemM.user
            }
          })
          if (this.pages !== pages) { // 更新页码
            this.pages = pages
          }
          this.total = res.data.meta.total
        } this.loading = false
      })
    },
    resetFilters () {
      this.$router.replace(`/document/index/list?pages=1&keyword=&date=`)
    },
    changeRouter (pages = 1) {
      this.$router.replace(`/document/index/list?pages=${pages}&keyword=${this.keyword || ''}&date=${this.date || ''}`)
    },
    deleteDocument (id) {
      this.$confirm('此操作将永久删除该单证, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        documents.delete({
          id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList(this.pages)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getFilters () {
      this.keyword = this.$route.query.keyword || ''
      this.pages = +this.$route.query.pages || 1
      this.date = this.$route.query.date || ''
    }
  },
  watch: {
    $route () {
      this.getFilters()
      this.getList(this.pages)
    }
  },
  created () {
    this.getFilters()
    this.getList(this.pages)
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/list.less";
</style>
