<template>
  <div id='documentCreate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">选择订单</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入订单号精确查询"
              v-model="order_code"
              @change="getOrderList(1)"></el-input>
            <el-cascader v-model="client_id"
              class="inputs"
              :show-all-levels='false'
              placeholder="筛选公司"
              :options="companyArr"
              :filter-method='searchClient'
              clearable
              :props="{ expandTrigger: 'hover' }"
              @change="getOrderList(1)"
              filterable></el-cascader>
            <el-date-picker v-model="date"
              style="width:290px"
              class="inputs"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getOrderList(1)">
            </el-date-picker>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray"
              style="margin-left:0"
              @click="resetFilter">重置</div>
          </div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <div class="tb_row">订单号</div>
            <div class="tb_row flex12">订单公司</div>
            <div class="tb_row middle">产品图片</div>
            <div class="tb_row flex16 tb_col">
              <div class="tb_col_item">
                <div class="tb_row flex08">产品编号</div>
                <div class="tb_row flex08">下单数量(件)</div>
              </div>
            </div>
            <div class="tb_row flex08">订单数量(件)</div>
            <div class="tb_row middle">下单时间</div>
            <div class="tb_row middle">订单状态</div>
            <div class="tb_row">创建人</div>
            <div class="tb_row middle flex04">选中</div>
          </div>
          <div class="tb_content"
            style="overflow:hidden"
            v-for="(itemOrder,indexOrder) in orderList"
            :key="indexOrder">
            <div class="tb_row">{{itemOrder.order_code}}</div>
            <div class="tb_row flex12">{{itemOrder.client_name}}</div>
            <div class="tb_row middle">
              <zh-img-list :list="itemOrder.images || []"
                type='open'></zh-img-list>
            </div>
            <div class="tb_row flex16 tb_col"
              style="position: relative;">
              <template v-for="(itemPro,indexPro) in itemOrder.product_info">
                <div :class="`tb_col_item showProItem ${itemOrder.nowProIndex === indexPro && (itemOrder.direction && 'activeB' || 'activeT')} ${itemOrder.beforeProIndex === indexPro && (itemOrder.direction && 'outActiveB' || 'outActiveT')}`"
                  :key="indexPro">
                  <div class="tb_row flex08">{{itemPro.product_code}}</div>
                  <div class="tb_row flex08"> {{itemPro.numbers}} </div>
                </div>
              </template>
              <template v-if="itemOrder.product_info.length > 1">
                <span class="el-icon-caret-bottom tb_row_icon tb_row_icon_bottom"
                  @click="changeNowIndex(itemOrder,1)"></span>
                <span class="el-icon-caret-top tb_row_icon tb_row_icon_top"
                  @click="changeNowIndex(itemOrder,-1)"></span>
              </template>
            </div>
            <div class="tb_row flex08"> {{itemOrder.numbers}} </div>
            <div class="tb_row middle"> {{itemOrder.order_time}} </div>
            <div class="tb_row middle"
              :class="{'red':itemOrder.status === 2003 || itemOrder.status === 2005,'green':itemOrder.status === 2004,'blue':itemOrder.status === 2002,'orange':itemOrder.status === 2001}">
              {{itemOrder.status|filterStatus}}
            </div>
            <div class="tb_row"> {{itemOrder.user_name}} </div>
            <div class="tb_row middle flex04">
              <el-checkbox v-model="itemOrder.checked"
                @change="checkedOrder($event,itemOrder)"></el-checkbox>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
        <div class="selectOrderCtn"
          v-if="checkedList.length > 0">
          <span class="label">已选订单</span>
          <div class="selectOrderItem"
            v-for="(itemOrder,indexOrder) in checkedList"
            :key="indexOrder">
            <el-input disabled
              :placeholder="itemOrder.order_code" />
            <span class="el-icon-delete deleteBtn"
              title='删除'></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">单证基本信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">PO Number</span>
            <div class="text">
              <el-input v-model="po_number"
                placeholder="请输入Po号"></el-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">Invoice Number</span>
            <div class="text">
              <el-input v-model="invoice_number"
                placeholder="请输入发票号码"></el-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">Payment Term</span>
            <div class="text">
              <el-autocomplete v-model="payment_term"
                :fetch-suggestions="querySearchPayment"
                placeholder="请选择付款方式"></el-autocomplete>
              <!-- <el-input v-model="payment_term"
                placeholder="请选择付款方式"></el-input> -->
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">TO (Company Name)</span>
            <div class="text">
              <el-autocomplete v-model="to_company_name"
                :fetch-suggestions="querySearchCompanyName"
                @select='selectCompanyName'
                placeholder="请选择公司名称"></el-autocomplete>
              <!-- <el-input v-model="to_company_name"
                placeholder="请选择公司名称"></el-input> -->
            </div>
          </div>
          <div class="colCtn ">
            <span class="label">TO (Address)</span>
            <div class="text">
              <el-input v-model="to_company_address"
                placeholder="请输入公司地址"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Order Date</span>
            <div class="text">
              <el-date-picker style="width:100%"
                v-model="order_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择下单日期">
              </el-date-picker>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">EX-factory Date</span>
            <div class="text">
              <el-date-picker style="width:100%"
                v-model="ex_factory_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择离厂日期">
              </el-date-picker>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">Shipment Date</span>
            <div class="text">
              <el-date-picker style="width:100%"
                v-model="shipment_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择发货日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">From</span>
            <div class="text">
              <el-autocomplete v-model="from"
                :fetch-suggestions="querySearchPortName"
                placeholder="请选择生产地"></el-autocomplete>
              <!-- <el-input v-model="from"
                placeholder="请选择生产地"></el-input> -->
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">To</span>
            <div class="text">
              <!-- <el-input v-model="to"
                placeholder="请选择发货地"></el-input> -->
              <el-autocomplete v-model="to"
                :fetch-suggestions="querySearchPortName"
                placeholder="请选择发货地"></el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">Currency System</span>
            <div class="text">
              <el-select v-model="moneyType"
                filterable
                placeholder="请选择币制">
                <el-option v-for="(item,index) in moneyTypes"
                  :key="index"
                  :label="`${item.label}(${item.value})`"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">Loading Port</span>
            <div class="text">
              <el-autocomplete v-model="loading_port"
                :fetch-suggestions="querySearchPort"
                placeholder="请选择发货港口"></el-autocomplete>
              <!-- <el-input v-model="loading_port"
                placeholder="请选择发货港口"></el-input> -->
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">Destination Port</span>
            <div class="text">
              <el-autocomplete v-model="destination_port"
                :fetch-suggestions="querySearchPort"
                placeholder="请选择到达港口"></el-autocomplete>
              <!-- <el-input v-model="destination_port"
                placeholder="请选择到达港口"></el-input> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">取消</div>
          <div class="btn btnBlue"
            @click="saveAll">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType } from '@/assets/js/dictionary.js'
import { client, order, documentSetting, documents } from '@/assets/js/api.js'
import { moneyTypes } from '@/assets/js/documentsCommon.js'
export default {
  data () {
    return {
      loading: false,
      order_code: '',
      client_id: '',
      companyArr: [],
      date: '',
      orderList: [],
      pages: 1,
      limit: 5,
      total: 1,
      checkedList: [],
      po_number: '',
      invoice_number: '',
      payment_term: '',
      to_company_name: '',
      to_company_address: '',
      order_date: '',
      ex_factory_date: '',
      shipment_date: '',
      from: '',
      to: '',
      loading_port: '',
      destination_port: '',
      paymentList: [],
      portList: [],
      moneyTypes,
      moneyType: '',
      clientList: []
    }
  },
  methods: {
    saveAll () {
      if (this.$submitLock()) return
      if (this.checkedList.length === 0) {
        this.$message.warning('请勾选订单')
        return
      }
      if (!this.po_number) {
        this.$message.warning('请输入PO号')
        return
      }
      if (!this.invoice_number) {
        this.$message.warning('请输入发票号码')
        return
      }
      if (!this.payment_term) {
        this.$message.warning('请输入付款方式')
        return
      }
      if (!this.to_company_name) {
        this.$message.warning('请输入公司名称')
        return
      }
      if (!this.to_company_address) {
        this.$message.warning('请输入公司地址')
        return
      }
      if (!this.order_date) {
        this.$message.warning('请选择下单日期')
        return
      }
      if (!this.ex_factory_date) {
        this.$message.warning('请选择离厂日期')
        return
      }
      if (!this.shipment_date) {
        this.$message.warning('请选择发货日期')
        return
      }
      if (!this.from) {
        this.$message.warning('请输入生产地')
        return
      }
      if (!this.to) {
        this.$message.warning('请输入发货地')
        return
      }
      if (!this.loading_port) {
        this.$message.warning('请输入发货港口')
        return
      }
      if (!this.destination_port) {
        this.$message.warning('请输入到达港口')
        return
      }
      if (!this.moneyType) {
        this.$message.warning('请选择币制')
        return
      }
      documents.create({
        id: null,
        document_orders: this.checkedList.map(itemM => itemM.id),
        po: this.po_number,
        invoice: this.invoice_number,
        payment: this.payment_term,
        to_company_name: this.to_company_name,
        to_company_address: this.to_company_address,
        order_date: this.order_date,
        ex_factory_date: this.ex_factory_date,
        shipment_date: this.shipment_date,
        from_address: this.from,
        to_address: this.to,
        loading_port: this.loading_port,
        destination_port: this.destination_port,
        currency_system: this.moneyType
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.$router.replace(`/document/index/detail/${res.data.data}`)
        }
      })
    },
    selectCompanyName (event) {
      this.to_company_address = event.address
    },
    querySearchCompanyName (queryString, callback) {
      const returnData = this.clientList.map(itemM => {
        return {
          value: itemM.name,
          label: itemM.name,
          address: itemM.address
        }
      })
      callback(queryString ? returnData.filter(itemF => itemF.value.indexOf(queryString) !== -1) : returnData)
    },
    querySearchPortName (queryString, callback) {
      const returnData = this.portList.map(itemM => {
        return {
          value: itemM.value[0],
          label: itemM.label[0]
        }
      })
      callback(queryString ? returnData.filter(itemF => itemF.label.indexOf(queryString.toUpperCase()) !== -1) : returnData)
    },
    querySearchPort (queryString, callback) {
      const returnData = this.portList.map(itemM => {
        return {
          value: itemM.value.join(','),
          label: itemM.label.join(',')
        }
      })
      callback(queryString ? returnData.filter(itemF => itemF.label.indexOf(queryString.toUpperCase()) !== -1) : returnData)
    },
    querySearchPayment (queryString, callback) {
      callback(queryString ? this.paymentList.filter(itemF => itemF.label.indexOf(queryString) !== -1) : this.paymentList)
    },
    checkedOrder (type, item) {
      const findIndex = this.checkedList.findIndex(itemF => itemF.id === item.id)
      if (type && findIndex < 0) {
        this.checkedList.push(item)
      } else if (!type && findIndex >= 0) {
        this.checkedList.splice(findIndex, 1)
      }
    },
    changeNowIndex (item, number) {
      item.direction = number > 0
      item.beforeProIndex = item.nowProIndex
      const nextIndex = item.nowProIndex + number
      item.nowProIndex = (nextIndex >= 0) ? (nextIndex % item.product_info.length) : (item.product_info.length - 1)
    },
    getOrderList (pages = 1, limit = this.limit) {
      this.loading = true
      order.list({
        page: pages,
        limit,
        keyword: this.order_code || '',
        client_id: (this.company_id && this.company_id[1]) || '',
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
      }).then(res => {
        if (res.data.data.status === false) return
        this.orderList = res.data.data.map(itemM => {
          return {
            checked: !!this.checkedList.find(itemF => itemF.id === itemM.id),
            id: itemM.id,
            order_code: itemM.order_code,
            client_name: itemM.client_name,
            images: this.$unique(itemM.product_info.map(itemMPI => itemMPI.image).flat(1), 'id'),
            product_info: itemM.product_info,
            nowProIndex: 0,
            beforeProIndex: null,
            numbers: itemM.product_info.map(itemMN => (+itemMN.numbers || 0)).reduce((total, current) => total + current, 0),
            order_time: itemM.order_time,
            status: itemM.status,
            user_name: itemM.user_name
          }
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    searchClient (node, query) {
      let flag = true
      if (query) {
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          flag = node.data.label.includes(query)
        } else {
          const queryArr = query.split('')
          for (const item of queryArr) {
            if (!node.data.name_pinyin.includes(item)) {
              flag = false
              break
            }
          }
        }
      }
      return flag
    },
    resetFilter () {
      this.order_code = ''
      this.client_id = ''
      this.date = ''
      this.getOrderList(1)
    }
  },
  mounted () {
    this.getOrderList()
    Promise.all([
      client.list(),
      documentSetting.payTypeList(),
      documentSetting.portList(),
      documentSetting.clientList()
    ]).then(res => {
      this.companyArr = this.$getClientOptions(res[0].data.data, companyType, { type: [1, 2] })
      this.paymentList = res[1].data.data.map(itemM => {
        return {
          value: `${itemM.english.toUpperCase()}`,
          label: `${itemM.english.toUpperCase()}`
        }
      })
      this.portList = res[2].data.data.map(itemM => {
        return {
          value: [itemM.port_name.toUpperCase(), itemM.country.toUpperCase()],
          label: [itemM.port_name.toUpperCase(), itemM.country.toUpperCase()]
        }
      })
      this.clientList = res[3].data.data
    })
  },
  filters: {
    filterStatus (status) {
      if (status === 2001) {
        return '已创建'
      } else if (status === 2002) {
        return '进行中'
      } else if (status === 2003) {
        return '已取消'
      } else if (status === 2004) {
        return '已完成'
      } else if (status === 2005) {
        return '已延期'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/create.less";
</style>
